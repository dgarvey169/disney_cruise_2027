// =========================================================================
// STATION 3: BASKETBALL SHOOTOUT SCENE
// =========================================================================

class BasketballShootoutScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BasketballShootoutScene' });
    }

    init(data) {
        this.heroZone = data ? data.heroZone : null;
        this.score = 0;
        this.timeLeft = 45;
        this.streak = 0;
        this.bestStreak = 0;
        this.isGameOver = false;
        this.isExiting = false;
        this.completionMenuOpen = false;
        this.menuSelectionIndex = 0;
        this.menuReadyTime = 0;

        this.isCharging = false;
        this.chargeTime = 0;
        this.chargeDir = 1;
        this.canShoot = true;
    }

    create() {
        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.init) {
            retroArcadeAudio.init();
        }

        const W = this.scale.width;
        const H = this.scale.height;

        this.physics.world.setBounds(0, 0, W, H);
        this.physics.world.gravity.y = 850;

        if (!this.textures.exists('hz_bball')) {
            let g = this.add.graphics();
            g.fillStyle(0xE65C00, 1);
            g.fillCircle(14, 14, 14);
            g.lineStyle(2, 0x000000, 1);
            g.strokeCircle(14, 14, 14);
            g.beginPath();
            g.moveTo(0, 14); g.lineTo(28, 14);
            g.moveTo(14, 0); g.lineTo(14, 28);
            g.strokePath();
            g.generateTexture('hz_bball', 28, 28);
            g.destroy();
        }

        // 1. Arcade Background & Booth Framing
        this.add.rectangle(0, 0, W, H, 0x110202).setOrigin(0).setDepth(0);
        this.add.tileSprite(W / 2, H / 2, W, H, 'hz_wall_pattern').setDepth(1).setAlpha(0.65);

        // Floor
        const floorY = H - 50;
        this.floorY = floorY;
        this.add.rectangle(W / 2, floorY + 25, W, 50, 0x331010).setDepth(2);
        this.add.rectangle(W / 2, floorY, W, 4, 0xF8B800).setDepth(3);

        // Centered Pop-A-Shot Booth
        const cx = Math.round(W / 2);
        const boothW = Math.min(520, Math.round(W * 0.88));
        this.boothW = boothW;

        // Pop-A-Shot Cage / Frame
        this.add.rectangle(cx, H / 2, boothW, H - 40, 0x000000, 0.45).setDepth(2).setStrokeStyle(3, 0xE65C00);

        // Shooter and Hoop positions
        this.shooterX = Math.round(cx - boothW / 2 + 70);
        this.shooterY = floorY - 20;

        const hoopX = Math.round(cx + boothW / 2 - 75);
        const hoopY = Math.max(130, Math.round(floorY - 200));
        this.hoopX = hoopX;
        this.hoopY = hoopY;

        // Ball return ramp
        const ramp = this.add.graphics().setDepth(3);
        ramp.fillStyle(0x222222, 1);
        ramp.beginPath();
        ramp.moveTo(hoopX + 48, floorY - 60);
        ramp.lineTo(this.shooterX + 30, floorY);
        ramp.lineTo(hoopX + 48, floorY);
        ramp.closePath();
        ramp.fillPath();

        // 2. Backboard & Hoop
        // Support Post
        this.add.rectangle(hoopX + 58, hoopY + 80, 14, floorY - (hoopY + 80) + 40, 0x444444).setDepth(3);

        // Backboard
        this.backboard = this.add.rectangle(hoopX + 48, hoopY - 30, 14, 90, 0xFFFFFF).setDepth(4).setStrokeStyle(3, 0xD01000);
        this.physics.add.existing(this.backboard, true);

        // Backboard Inner Box
        this.add.rectangle(hoopX + 42, hoopY - 20, 4, 34, 0xD01000).setDepth(5);

        // Rim
        this.rimFront = this.add.circle(hoopX - 18, hoopY, 4, 0xE65C00).setDepth(6);
        this.physics.add.existing(this.rimFront, true);
        this.rimBack = this.add.circle(hoopX + 38, hoopY, 4, 0xE65C00).setDepth(6);
        this.physics.add.existing(this.rimBack, true);

        // Net graphics
        this.netGfx = this.add.graphics().setDepth(5);
        this.drawNet(hoopX, hoopY, 1);

        // Hoop Scoring Sensor Zone (centered between rimFront at hoopX - 18 and rimBack at hoopX + 38)
        this.hoopSensor = this.add.zone(hoopX + 10, hoopY + 8, 40, 12);
        this.physics.add.existing(this.hoopSensor, true);

        // 3. Player at Shooting Line
        const charId = this.heroZone && this.heroZone.gameScene ? this.heroZone.gameScene.selectedCharacter : 'riley';
        this.player = this.add.sprite(this.shooterX, this.shooterY, charId + '_idle').setDepth(10);
        this.playerShadow = this.add.ellipse(this.shooterX, floorY, 26, 8, 0x000000, 0.5).setDepth(9);

        // Held ball
        this.heldBall = this.add.sprite(this.shooterX + 16, this.shooterY - 14, 'hz_bball').setDepth(11);

        // Active basketballs group
        this.balls = this.physics.add.group();
        this.physics.add.collider(this.balls, this.backboard, (objA, objB) => {
            if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
                retroArcadeAudio.play('shoot');
            }
        }, (objA, objB) => {
            const ball = (objA === this.backboard) ? objB : objA;
            if (ball && ball.scored) return false;
            return true;
        }, this);

        this.physics.add.collider(this.balls, this.rimFront, (objA, objB) => {
            if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
                retroArcadeAudio.play('shoot');
            }
        }, (objA, objB) => {
            const ball = (objA === this.rimFront) ? objB : objA;
            const rim = (objA === this.rimFront) ? objA : objB;
            // Allow descending ball through the hoop opening without bouncing on top of rim
            if (ball && ball.body && ball.body.velocity.y > 0 && ball.x >= rim.x - 4) {
                return false;
            }
            return true;
        }, this);

        this.physics.add.collider(this.balls, this.rimBack, (objA, objB) => {
            if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
                retroArcadeAudio.play('shoot');
            }
        }, (objA, objB) => {
            const ball = (objA === this.rimBack) ? objB : objA;
            const rim = (objA === this.rimBack) ? objA : objB;
            // Allow descending ball through the hoop opening
            if (ball && ball.body && (ball.scored || (ball.body.velocity.y > 0 && ball.x <= rim.x + 4))) {
                return false;
            }
            return true;
        }, this);

        // Overlap sensor for scoring
        this.physics.add.overlap(this.balls, this.hoopSensor, (objA, objB) => {
            const ball = (objA === this.hoopSensor) ? objB : objA;
            if (ball && ball.body) {
                this.handleBasket(ball);
            }
        }, null, this);

        // 4. Power Meter UI
        this.powerMeterBg = this.add.rectangle(this.shooterX, this.shooterY - 50, 80, 12, 0x000000, 0.8).setDepth(15).setStrokeStyle(2, 0xFFFFFF);
        this.powerMeterFill = this.add.rectangle(this.shooterX - 38, this.shooterY - 50, 0, 8, 0x00FF00).setDepth(16).setOrigin(0, 0.5);
        // Sweet spot marker (centered around 73% power)
        this.add.rectangle(this.shooterX + 17, this.shooterY - 50, 12, 10, 0xFFD700, 0.6).setDepth(17);

        // 5. Retro LED Scoreboard
        this.add.rectangle(W / 2, 40, 420, 45, 0x000000, 0.9).setDepth(20).setStrokeStyle(3, 0xF8B800);
        this.scoreDisplay = this.add.text(W / 2 - 110, 40, 'SCORE: 00', {
            fontSize: '11px', fontFamily: '"Press Start 2P"', fill: '#00FF00'
        }).setOrigin(0.5).setDepth(21);

        this.timeDisplay = this.add.text(W / 2 + 100, 40, 'TIME: 45', {
            fontSize: '11px', fontFamily: '"Press Start 2P"', fill: '#FF5555'
        }).setOrigin(0.5).setDepth(21);

        this.streakDisplay = this.add.text(W / 2, 70, '', {
            fontSize: '8px', fontFamily: '"Press Start 2P"', fill: '#FFFF00'
        }).setOrigin(0.5).setDepth(21);

        // Top-Right [ RESTART ] Button
        this.hudRestartBtn = this.add.text(W - 195, 30, '[ RESTART ]', {
            fontSize: '10px', fontFamily: '"Press Start 2P"', fill: '#000000', backgroundColor: '#FFD700', padding: { x: 8, y: 6 }
        }).setOrigin(0.5).setDepth(100).setInteractive({ useHandCursor: true });
        this.hudRestartBtn.on('pointerdown', () => this.restartShootout());

        // Top-Right [ EXIT ] Button
        this.hudExitBtn = this.add.text(W - 75, 30, '[ EXIT ]', {
            fontSize: '10px', fontFamily: '"Press Start 2P"', fill: '#FFFFFF', backgroundColor: '#B80000', padding: { x: 8, y: 6 }
        }).setOrigin(0.5).setDepth(100).setInteractive({ useHandCursor: true });
        this.hudExitBtn.on('pointerdown', () => this.exitShootout());

        if (this.input && this.input.keyboard) {
            this.input.keyboard.resetKeys();
            this.input.keyboard.addCapture([
                Phaser.Input.Keyboard.KeyCodes.UP,
                Phaser.Input.Keyboard.KeyCodes.DOWN,
                Phaser.Input.Keyboard.KeyCodes.LEFT,
                Phaser.Input.Keyboard.KeyCodes.RIGHT,
                Phaser.Input.Keyboard.KeyCodes.SPACE,
                Phaser.Input.Keyboard.KeyCodes.ENTER,
                Phaser.Input.Keyboard.KeyCodes.ESC,
                Phaser.Input.Keyboard.KeyCodes.W,
                Phaser.Input.Keyboard.KeyCodes.A,
                Phaser.Input.Keyboard.KeyCodes.S,
                Phaser.Input.Keyboard.KeyCodes.D,
                Phaser.Input.Keyboard.KeyCodes.R
            ]);
        }

        if (this.game && this.game.canvas) {
            this.game.canvas.setAttribute('tabindex', '0');
            this.game.canvas.focus();
            this.game.canvas.addEventListener('click', () => {
                if (this.game && this.game.canvas) this.game.canvas.focus();
            });
        }

        // Keyboard Controls
        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            w: Phaser.Input.Keyboard.KeyCodes.W,
            s: Phaser.Input.Keyboard.KeyCodes.S,
            a: Phaser.Input.Keyboard.KeyCodes.A,
            d: Phaser.Input.Keyboard.KeyCodes.D,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
            esc: Phaser.Input.Keyboard.KeyCodes.ESC,
            r: Phaser.Input.Keyboard.KeyCodes.R
        });

        const resetHoopKeys = () => {
            if (this.keys) {
                if (this.keys.space) this.keys.space.isDown = false;
                if (this.keys.enter) this.keys.enter.isDown = false;
                if (this.keys.up) this.keys.up.isDown = false;
                if (this.keys.down) this.keys.down.isDown = false;
                if (this.keys.left) this.keys.left.isDown = false;
                if (this.keys.right) this.keys.right.isDown = false;
                if (this.keys.w) this.keys.w.isDown = false;
                if (this.keys.s) this.keys.s.isDown = false;
                if (this.keys.a) this.keys.a.isDown = false;
                if (this.keys.d) this.keys.d.isDown = false;
                if (this.keys.esc) this.keys.esc.isDown = false;
                if (this.keys.r) this.keys.r.isDown = false;
            }
            if (this.isCharging) {
                this.releaseShot();
            }
        };

        const onHoopNativeKeyUp = (e) => {
            if (e.code === 'Space') {
                if (this.keys && this.keys.space) this.keys.space.isDown = false;
                if (this.isCharging) {
                    this.releaseShot();
                }
            }
            if (e.key === 'r' || e.key === 'R') {
                if (this.keys && this.keys.r) this.keys.r.isDown = false;
            }
            if (e.key === 'Enter') {
                if (this.keys && this.keys.enter) this.keys.enter.isDown = false;
            }
            if (['Alt', 'Meta', 'Control', 'Shift'].includes(e.key)) {
                resetHoopKeys();
            }
        };

        window.addEventListener('blur', resetHoopKeys);
        window.addEventListener('focus', resetHoopKeys);
        window.addEventListener('keyup', onHoopNativeKeyUp);
        const onVisHoop = () => { if (document.hidden) resetHoopKeys(); };
        document.addEventListener('visibilitychange', onVisHoop);

        this._cleanWindowListeners = () => {
            window.removeEventListener('blur', resetHoopKeys);
            window.removeEventListener('focus', resetHoopKeys);
            window.removeEventListener('keyup', onHoopNativeKeyUp);
            document.removeEventListener('visibilitychange', onVisHoop);
        };

        this.events.once('shutdown', () => {
            if (this._cleanWindowListeners) this._cleanWindowListeners();
        });

        // Mobile Shoot Button
        const shootBtn = this.add.rectangle(W / 2, H - 45, 160, 50, 0xE65C00, 0.85).setDepth(100).setStrokeStyle(3, 0xF8B800).setInteractive();
        this.add.text(W / 2, H - 45, 'SHOOT [HOLD]', {
            fontSize: '9px', fontFamily: '"Press Start 2P"', fill: '#FFFFFF'
        }).setOrigin(0.5).setDepth(101);

        shootBtn.on('pointerdown', () => this.startCharge());
        shootBtn.on('pointerup', () => this.releaseShot());
        shootBtn.on('pointerout', () => { if (this.isCharging) this.releaseShot(); });

        // Timer Event
        this.gameTimer = this.time.addEvent({
            delay: 1000,
            callback: this.tickTimer,
            callbackScope: this,
            loop: true
        });
    }

    drawNet(hoopX, hoopY, scaleY) {
        this.netGfx.clear();
        this.netGfx.lineStyle(2, 0xFFFFFF, 0.85);
        this.netGfx.beginPath();
        this.netGfx.moveTo(hoopX - 18, hoopY + 2);
        this.netGfx.lineTo(hoopX - 6, hoopY + 26 * scaleY);
        this.netGfx.lineTo(hoopX + 24, hoopY + 26 * scaleY);
        this.netGfx.lineTo(hoopX + 36, hoopY + 2);
        this.netGfx.strokePath();

        // Cross-hatching
        this.netGfx.lineBetween(hoopX - 10, hoopY + 12 * scaleY, hoopX + 30, hoopY + 12 * scaleY);
        this.netGfx.lineBetween(hoopX - 4, hoopY + 20 * scaleY, hoopX + 24, hoopY + 20 * scaleY);
    }

    startCharge() {
        if (!this.canShoot || this.isGameOver) return;
        this.isCharging = true;
        this.chargeTime = 0;
        this.chargeDir = 1;
    }

    releaseShot() {
        if (!this.isCharging || this.isGameOver) return;
        this.isCharging = false;
        this.canShoot = false;
        if (this.heldBall) this.heldBall.setVisible(false);

        // Power calculation (0..1)
        const powerFraction = Phaser.Math.Clamp(this.chargeTime / 750, 0.05, 1.0);

        // Kinematic calculation to reach the hoop with an arc
        const startX = this.shooterX + 16;
        const startY = this.shooterY - 14;
        const targetX = this.hoopX + 10;
        const targetY = this.hoopY;

        const dX = targetX - startX;
        const dY = targetY - startY; // negative since targetY is higher than startY
        const g = this.physics.world.gravity.y;

        // Desired apex rise above hoop for a high arc
        const apexRise = 100;
        const h_rise = -dY + apexRise; // total vertical rise from start to apex
        const idealVy = -Math.sqrt(2 * g * h_rise);
        const t_up = -idealVy / g;
        const t_down = Math.sqrt(2 * apexRise / g);
        const totalTime = t_up + t_down;
        const idealVx = dX / totalTime;

        // Sweet spot is centered at 0.73 (marker at 68% - 78%)
        // When powerFraction is 0.73, powerRatio is 1.0 (exact swish into the basket)
        // Under 0.73 -> falls short or hits front rim
        // Over 0.73 -> goes too far, hits backboard or back rim
        const sweetSpot = 0.73;
        const powerRatio = 0.55 + (powerFraction / sweetSpot) * 0.45;

        const vx = idealVx * powerRatio;
        const vy = idealVy * Math.sqrt(powerRatio);

        const ball = this.balls.create(startX, startY, 'hz_bball');
        ball.setCircle(14);
        ball.setBounce(0.68, 0.68);
        ball.setCollideWorldBounds(true);
        ball.setVelocity(vx, vy);
        ball.scored = false;

        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
            retroArcadeAudio.play('shoot');
        }

        // Reset power meter
        this.powerMeterFill.width = 0;

        // Respawn next ball after 0.45s
        this.time.delayedCall(450, () => {
            if (!this.isGameOver) {
                this.canShoot = true;
                if (this.heldBall) this.heldBall.setVisible(true);
            }
        });

        // Clean up ball after 4 seconds
        this.time.delayedCall(4000, () => {
            if (ball && ball.active) {
                ball.destroy();
            }
        });
    }

    handleBasket(ball) {
        if (ball.scored || ball.body.velocity.y <= 0) return;
        ball.scored = true;

        const isClean = (Math.abs(ball.x - (this.hoopX + 10)) < 20);
        const pts = isClean ? 3 : 2;
        this.streak++;
        if (this.streak > this.bestStreak) this.bestStreak = this.streak;

        const bonus = (this.streak >= 3) ? 1 : 0;
        const totalPts = pts + bonus;
        this.score += totalPts;

        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
            retroArcadeAudio.play('powerup');
        }

        this.scoreDisplay.setText(`SCORE: ${String(this.score).padStart(2, '0')}`);
        if (this.streak >= 2) {
            this.streakDisplay.setText(`🔥 ${this.streak} STREAK! 🔥`);
        }

        // Net swish animation
        this.tweens.addCounter({
            from: 1,
            to: 1.4,
            duration: 100,
            yoyo: true,
            onUpdate: (tween) => {
                this.drawNet(this.hoopX, this.hoopY, tween.getValue());
            }
        });

        // Floating score popup
        const msg = isClean ? `★ SWISH! +${totalPts} ★` : `+${totalPts} PTS!`;
        const pop = this.add.text(this.hoopX + 10, this.hoopY - 25, msg, {
            fontSize: '9px', fontFamily: '"Press Start 2P"', fill: isClean ? '#FFFF00' : '#00FF00', backgroundColor: '#000', padding: 3
        }).setOrigin(0.5).setDepth(30);

        this.tweens.add({
            targets: pop,
            y: this.hoopY - 55,
            alpha: 0,
            duration: 900,
            onComplete: () => pop.destroy()
        });
    }

    tickTimer() {
        if (this.isGameOver) return;
        this.timeLeft--;
        this.timeDisplay.setText(`TIME: ${String(this.timeLeft).padStart(2, '0')}`);

        if (this.timeLeft <= 0) {
            this.finishShootout();
        }
    }

    restartShootout() {
        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
            retroArcadeAudio.play('powerup');
        }
        if (this.gameTimer) {
            this.gameTimer.remove();
        }
        if (this._cleanWindowListeners) {
            this._cleanWindowListeners();
        }
        this.scene.restart();
    }

    finishShootout() {
        this.isGameOver = true;
        this.completionMenuOpen = true;
        this.menuSelectionIndex = 0;
        this.menuReadyTime = this.time.now + 600;
        this.isCharging = false;
        if (this.gameTimer) this.gameTimer.remove();

        // Reset key states to prevent accidental confirmation
        if (this.keys) {
            if (this.keys.space) this.keys.space.isDown = false;
            if (this.keys.enter) this.keys.enter.isDown = false;
            if (this.keys.up) this.keys.up.isDown = false;
            if (this.keys.down) this.keys.down.isDown = false;
        }
        if (this.input && this.input.keyboard) {
            this.input.keyboard.resetKeys();
        }

        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
            retroArcadeAudio.play('explosion');
        }

        const scores = getHeroZoneScores();
        let isNewRecord = false;
        if (this.score > (scores.basketballScore || 0)) {
            scores.basketballScore = this.score;
            const charName = this.heroZone && this.heroZone.gameScene ? this.heroZone.gameScene.characterName : 'Riley';
            scores.basketballHolder = charName.toUpperCase();
            saveHeroZoneScores(scores);
            isNewRecord = true;
        }

        const W = this.scale.width;
        const H = this.scale.height;

        this.modalBackdrop = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.6).setScrollFactor(0).setDepth(500);
        this.modalBg = this.add.rectangle(W / 2, H / 2, 340, 230, 0x000000, 0.95).setStrokeStyle(4, 0xF8B800).setScrollFactor(0).setDepth(501);
        this.modalTitle = this.add.text(W / 2, H / 2 - 75, '★ TIME\'S UP! ★', {
            fontSize: '12px', fontFamily: '"Press Start 2P"', fill: '#FF5555'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(502);

        const scoreTxt = this.add.text(W / 2, H / 2 - 45, `FINAL SCORE: ${this.score} PTS`, {
            fontSize: '10px', fontFamily: '"Press Start 2P"', fill: '#00FF00'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(502);

        const streakTxt = this.add.text(W / 2, H / 2 - 20, `BEST STREAK: ${this.bestStreak}`, {
            fontSize: '8px', fontFamily: '"Press Start 2P"', fill: '#FFFF00'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(502);

        const recordTxt = this.add.text(W / 2, H / 2 + 10, isNewRecord ? '★ NEW HIGH SCORE! ★' : `RECORD: ${scores.basketballScore} PTS (${scores.basketballHolder})`, {
            fontSize: '7px', fontFamily: '"Press Start 2P"', fill: isNewRecord ? '#FFD700' : '#A0D0FF'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(502);

        this.btnAgain = this.add.text(W / 2, H / 2 + 48, '  PLAY AGAIN  ', {
            fontSize: '9px', fontFamily: '"Press Start 2P"', fill: '#000000', backgroundColor: '#FFD700', padding: { x: 10, y: 6 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(503).setInteractive({ useHandCursor: true });

        this.btnExitModal = this.add.text(W / 2, H / 2 + 85, '  RETURN TO HERO ZONE  ', {
            fontSize: '9px', fontFamily: '"Press Start 2P"', fill: '#FFFFFF', backgroundColor: '#660000', padding: { x: 10, y: 6 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(503).setInteractive({ useHandCursor: true });

        this.menuCursor = this.add.text(W / 2 - 105, H / 2 + 48, '►', {
            fontSize: '11px', fontFamily: '"Press Start 2P"', fill: '#FFD700'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(504);

        this.tweens.add({
            targets: this.menuCursor,
            x: '+= 6',
            duration: 350,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.btnAgain.on('pointerover', () => {
            this.menuSelectionIndex = 0;
            this.updateMenuVisuals();
        });
        this.btnAgain.on('pointerdown', () => this.confirmMenuChoice());

        this.btnExitModal.on('pointerover', () => {
            this.menuSelectionIndex = 1;
            this.updateMenuVisuals();
        });
        this.btnExitModal.on('pointerdown', () => this.confirmMenuChoice());

        this.updateMenuVisuals();
    }

    updateMenuVisuals() {
        if (!this.btnAgain || !this.btnExitModal || !this.menuCursor) return;
        const W = this.scale.width;
        const H = this.scale.height;
        if (this.menuSelectionIndex === 0) {
            this.btnAgain.setStyle({ fill: '#000000', backgroundColor: '#FFD700' });
            this.btnExitModal.setStyle({ fill: '#FFFFFF', backgroundColor: '#660000' });
            this.menuCursor.setPosition(W / 2 - 105, H / 2 + 48);
        } else {
            this.btnAgain.setStyle({ fill: '#FFFFFF', backgroundColor: '#005500' });
            this.btnExitModal.setStyle({ fill: '#000000', backgroundColor: '#FF5555' });
            this.menuCursor.setPosition(W / 2 - 145, H / 2 + 85);
        }
    }

    confirmMenuChoice() {
        if (this.menuSelectionIndex === 0) {
            this.restartShootout();
        } else {
            this.exitShootout();
        }
    }

    exitShootout() {
        if (this.isExiting) return;
        this.isExiting = true;
        if (this._cleanWindowListeners) {
            this._cleanWindowListeners();
        }
        if (this.gameTimer) this.gameTimer.remove();
        if (this.heroZone && this.heroZone.scene) {
            this.heroZone.scene.setVisible(true);
            this.heroZone.scene.resume();
            if (this.heroZone.refreshLeaderboard) {
                this.heroZone.refreshLeaderboard();
            }
        }
        this.scene.stop('BasketballShootoutScene');
    }

    update(time, delta) {
        if (this.keys.r && Phaser.Input.Keyboard.JustDown(this.keys.r)) {
            this.restartShootout();
            return;
        }

        if (this.keys.esc && Phaser.Input.Keyboard.JustDown(this.keys.esc)) {
            this.exitShootout();
            return;
        }

        if (this.completionMenuOpen) {
            if (this.time.now < this.menuReadyTime) return;

            const isUp = (this.keys.up && Phaser.Input.Keyboard.JustDown(this.keys.up)) || 
                         (this.keys.w && Phaser.Input.Keyboard.JustDown(this.keys.w));

            const isDown = (this.keys.down && Phaser.Input.Keyboard.JustDown(this.keys.down)) || 
                           (this.keys.s && Phaser.Input.Keyboard.JustDown(this.keys.s));

            if (isUp) {
                this.menuSelectionIndex = 0;
                this.updateMenuVisuals();
                if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
                    retroArcadeAudio.play('laser');
                }
            } else if (isDown) {
                this.menuSelectionIndex = 1;
                this.updateMenuVisuals();
                if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
                    retroArcadeAudio.play('laser');
                }
            }

            const isConfirm = (this.keys.enter && Phaser.Input.Keyboard.JustDown(this.keys.enter)) || 
                              (this.keys.space && Phaser.Input.Keyboard.JustDown(this.keys.space));

            if (isConfirm) {
                this.confirmMenuChoice();
            }
            return;
        }

        if (this.isGameOver) return;

        // Spacebar shooting controls
        if (Phaser.Input.Keyboard.JustDown(this.keys.space)) {
            this.startCharge();
        } else if (this.keys.space.isDown && this.isCharging) {
            // Charging
            this.chargeTime += delta * 1.2 * this.chargeDir;
            if (this.chargeTime >= 750) {
                this.chargeTime = 750;
                this.chargeDir = -1;
            } else if (this.chargeTime <= 0) {
                this.chargeTime = 0;
                this.chargeDir = 1;
            }
            this.powerMeterFill.width = (this.chargeTime / 750) * 76;
        } else if (Phaser.Input.Keyboard.JustUp(this.keys.space) && this.isCharging) {
            this.releaseShot();
        }
    }
}

