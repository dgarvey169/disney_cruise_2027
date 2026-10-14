// =========================================================================
// STATION 2: INCREDIBLES AIR HOCKEY SCENE
// =========================================================================

class AirHockeyScene extends Phaser.Scene {
    constructor() {
        super({ key: 'AirHockeyScene' });
    }
    
    init(data) {
        this.heroZone = data ? data.heroZone : null;
        this.playerScore = 0;
        this.aiScore = 0;
        this.isGameOver = false;
        this.isExiting = false;
        this.completionMenuOpen = false;
        this.menuSelectionIndex = 0;
        this.menuReadyTime = 0;
        this.scoring = false;
    }

    create() {
        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.init) {
            retroArcadeAudio.init();
        }
        const W = this.scale.width;
        const H = this.scale.height;
        
        this.add.rectangle(0, 0, W, H, 0x07091B, 0.95).setOrigin(0);
        
        const cx = W / 2;
        const cy = H / 2;
        
        const tableW = 320;
        const tableH = 460;
        this.add.rectangle(cx, cy, tableW + 20, tableH + 20, 0x111111).setStrokeStyle(4, 0x00FFFF);
        this.add.rectangle(cx, cy, tableW, tableH, 0x0B1B3A);
        
        this.add.rectangle(cx, cy, tableW, 2, 0xFF3333);
        this.add.circle(cx, cy, 38).setStrokeStyle(2, 0xFF3333);

        this.goalTop = this.add.zone(cx, cy - tableH / 2 + 5, 110, 24);
        this.physics.add.existing(this.goalTop, true);
        this.add.rectangle(cx, cy - tableH / 2, 110, 10, 0x000000).setStrokeStyle(2, 0xFF5555);
        
        this.goalBot = this.add.zone(cx, cy + tableH / 2 - 5, 110, 24);
        this.physics.add.existing(this.goalBot, true);
        this.add.rectangle(cx, cy + tableH / 2, 110, 10, 0x000000).setStrokeStyle(2, 0x55FF55);
        
        this.physics.world.setBounds(cx - tableW / 2, cy - tableH / 2, tableW, tableH);
        
        if (!this.textures.exists('ah_puck')) {
            let g = this.add.graphics();
            g.fillStyle(0xFF0000, 1);
            g.fillCircle(12, 12, 12);
            g.lineStyle(2, 0xFFFFFF, 1);
            g.strokeCircle(12, 12, 12);
            g.generateTexture('ah_puck', 24, 24);
            g.destroy();
        }

        if (!this.textures.exists('ah_mallet_player')) {
            let g = this.add.graphics();
            g.fillStyle(0x00FF88, 1);
            g.fillCircle(20, 20, 20);
            g.fillStyle(0x008844, 1);
            g.fillCircle(20, 20, 10);
            g.lineStyle(2, 0xFFFFFF, 1);
            g.strokeCircle(20, 20, 20);
            g.generateTexture('ah_mallet_player', 40, 40);
            g.destroy();
        }

        if (!this.textures.exists('ah_mallet_ai')) {
            let g = this.add.graphics();
            g.fillStyle(0xFF5555, 1);
            g.fillCircle(20, 20, 20);
            g.fillStyle(0x990000, 1);
            g.fillCircle(20, 20, 10);
            g.lineStyle(2, 0xFFFFFF, 1);
            g.strokeCircle(20, 20, 20);
            g.generateTexture('ah_mallet_ai', 40, 40);
            g.destroy();
        }

        this.puck = this.physics.add.sprite(cx, cy, 'ah_puck');
        this.puck.setBounce(1.05, 1.05);
        this.puck.setCollideWorldBounds(true);
        this.puck.body.setCircle(12);
        this.puck.body.allowGravity = false;
        this.puck.body.setMaxVelocity(600, 600);
        
        this.paddlePlayer = this.physics.add.sprite(cx, cy + 150, 'ah_mallet_player');
        this.paddlePlayer.setCollideWorldBounds(true);
        this.paddlePlayer.body.setCircle(20);
        this.paddlePlayer.body.allowGravity = false;
        this.paddlePlayer.body.immovable = true;
        
        this.paddleAI = this.physics.add.sprite(cx, cy - 150, 'ah_mallet_ai');
        this.paddleAI.setCollideWorldBounds(true);
        this.paddleAI.body.setCircle(20);
        this.paddleAI.body.allowGravity = false;
        this.paddleAI.body.immovable = true;
        
        this.physics.add.collider(this.puck, this.paddlePlayer, () => {
            if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
                retroArcadeAudio.play('shoot');
            }
        });
        this.physics.add.collider(this.puck, this.paddleAI, () => {
            if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
                retroArcadeAudio.play('shoot');
            }
        });
        const charName = this.heroZone && this.heroZone.gameScene ? this.heroZone.gameScene.characterName : 'Riley';
        const uName = charName.toUpperCase();
        this.scoreText = this.add.text(cx, 35, `${uName} 0  -  0 AI`, {
            fontSize: '12px', fontFamily: '"Press Start 2P"', fill: '#FFD700', backgroundColor: '#000', padding: { x: 10, y: 6 }
        }).setOrigin(0.5);

        this.add.text(cx, 65, 'BEST OF 7 SERIES (FIRST TO 4 WINS)', {
            fontSize: '7px', fontFamily: '"Press Start 2P"', fill: '#A0D0FF'
        }).setOrigin(0.5);

        // Top-Right [ RESTART ] Button
        this.hudRestartBtn = this.add.text(W - 195, 35, '[ RESTART ]', {
            fontSize: '9px', fontFamily: '"Press Start 2P"', fill: '#000000', backgroundColor: '#FFD700', padding: { x: 8, y: 5 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        this.hudRestartBtn.on('pointerdown', () => this.restartAirHockey());

        // Top-Right [ EXIT ] Button
        this.hudExitBtn = this.add.text(W - 75, 35, '[ EXIT ]', {
            fontSize: '9px', fontFamily: '"Press Start 2P"', fill: '#FFFFFF', backgroundColor: '#B80000', padding: { x: 8, y: 5 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        this.hudExitBtn.on('pointerdown', () => this.exitAirHockey());

        if (this.input && this.input.keyboard) {
            this.input.keyboard.resetKeys();
            this.input.keyboard.addCapture([
                Phaser.Input.Keyboard.KeyCodes.UP,
                Phaser.Input.Keyboard.KeyCodes.DOWN,
                Phaser.Input.Keyboard.KeyCodes.LEFT,
                Phaser.Input.Keyboard.KeyCodes.RIGHT,
                Phaser.Input.Keyboard.KeyCodes.ESC,
                Phaser.Input.Keyboard.KeyCodes.W,
                Phaser.Input.Keyboard.KeyCodes.A,
                Phaser.Input.Keyboard.KeyCodes.S,
                Phaser.Input.Keyboard.KeyCodes.D,
                Phaser.Input.Keyboard.KeyCodes.SPACE,
                Phaser.Input.Keyboard.KeyCodes.ENTER,
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

        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
            esc: Phaser.Input.Keyboard.KeyCodes.ESC,
            r: Phaser.Input.Keyboard.KeyCodes.R
        });

        const resetHockeyKeys = () => {
            if (this.cursors) {
                if (this.cursors.left) this.cursors.left.isDown = false;
                if (this.cursors.right) this.cursors.right.isDown = false;
                if (this.cursors.up) this.cursors.up.isDown = false;
                if (this.cursors.down) this.cursors.down.isDown = false;
                if (this.cursors.space) this.cursors.space.isDown = false;
            }
            if (this.wasd) {
                if (this.wasd.left) this.wasd.left.isDown = false;
                if (this.wasd.right) this.wasd.right.isDown = false;
                if (this.wasd.up) this.wasd.up.isDown = false;
                if (this.wasd.down) this.wasd.down.isDown = false;
                if (this.wasd.space) this.wasd.space.isDown = false;
                if (this.wasd.enter) this.wasd.enter.isDown = false;
                if (this.wasd.esc) this.wasd.esc.isDown = false;
                if (this.wasd.r) this.wasd.r.isDown = false;
            }
        };

        const onHockeyNativeKeyUp = (e) => {
            if (e.key === 'r' || e.key === 'R') {
                if (this.wasd && this.wasd.r) this.wasd.r.isDown = false;
            }
            if (e.key === 'Enter') {
                if (this.wasd && this.wasd.enter) this.wasd.enter.isDown = false;
            }
            if (e.code === 'Space') {
                if (this.cursors && this.cursors.space) this.cursors.space.isDown = false;
                if (this.wasd && this.wasd.space) this.wasd.space.isDown = false;
            }
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
                if (this.cursors && this.cursors.up) this.cursors.up.isDown = false;
                if (this.wasd && this.wasd.up) this.wasd.up.isDown = false;
            }
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                if (this.cursors && this.cursors.left) this.cursors.left.isDown = false;
                if (this.wasd && this.wasd.left) this.wasd.left.isDown = false;
            }
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                if (this.cursors && this.cursors.right) this.cursors.right.isDown = false;
                if (this.wasd && this.wasd.right) this.wasd.right.isDown = false;
            }
            if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                if (this.cursors && this.cursors.down) this.cursors.down.isDown = false;
                if (this.wasd && this.wasd.down) this.wasd.down.isDown = false;
            }
            if (['Alt', 'Meta', 'Control', 'Shift'].includes(e.key)) {
                resetHockeyKeys();
            }
        };

        window.addEventListener('blur', resetHockeyKeys);
        window.addEventListener('focus', resetHockeyKeys);
        window.addEventListener('keyup', onHockeyNativeKeyUp);
        const onVisHockey = () => { if (document.hidden) resetHockeyKeys(); };
        document.addEventListener('visibilitychange', onVisHockey);

        this._cleanWindowListeners = () => {
            window.removeEventListener('blur', resetHockeyKeys);
            window.removeEventListener('focus', resetHockeyKeys);
            window.removeEventListener('keyup', onHockeyNativeKeyUp);
            document.removeEventListener('visibilitychange', onVisHockey);
        };

        this.events.once('shutdown', () => {
            if (this._cleanWindowListeners) this._cleanWindowListeners();
        });

        this.input.on('pointermove', (pointer) => {
            if (pointer.isDown || !this.sys.game.device.os.desktop) {
                const targetX = Phaser.Math.Clamp(pointer.x, cx - tableW / 2 + 25, cx + tableW / 2 - 25);
                const targetY = Phaser.Math.Clamp(pointer.y, cy + 20, cy + tableH / 2 - 25);
                this.paddlePlayer.setPosition(targetX, targetY);
            }
        });

        this.tableBounds = { cx, cy, tableW, tableH };
        this.resetPuck();
    }
    
    resetPuck() {
        const { cx, cy } = this.tableBounds;
        this.puck.setPosition(cx, cy);
        this.puck.setVisible(true);
        const vx = (Math.random() - 0.5) * 350;
        const vy = (Math.random() > 0.5 ? 220 : -220);
        this.puck.setVelocity(vx, vy);
    }

    restartAirHockey() {
        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
            retroArcadeAudio.play('powerup');
        }
        if (this._cleanWindowListeners) {
            this._cleanWindowListeners();
        }
        this.scene.restart();
    }

    exitAirHockey() {
        if (this.isExiting) return;
        this.isExiting = true;
        if (this._cleanWindowListeners) {
            this._cleanWindowListeners();
        }
        if (this.heroZone && this.heroZone.scene) {
            this.heroZone.scene.setVisible(true);
            this.heroZone.scene.resume();
            if (this.heroZone.refreshLeaderboard) {
                this.heroZone.refreshLeaderboard();
            }
        }
        this.scene.stop('AirHockeyScene');
    }
    
    update(time, delta) {
        if (this.wasd.r && Phaser.Input.Keyboard.JustDown(this.wasd.r)) {
            this.restartAirHockey();
            return;
        }

        if (this.wasd.esc && Phaser.Input.Keyboard.JustDown(this.wasd.esc)) {
            this.exitAirHockey();
            return;
        }

        if (this.completionMenuOpen) {
            if (this.time.now < this.menuReadyTime) return;

            const isUp = (this.cursors.up && Phaser.Input.Keyboard.JustDown(this.cursors.up)) || 
                         (this.wasd.up && Phaser.Input.Keyboard.JustDown(this.wasd.up));

            const isDown = (this.cursors.down && Phaser.Input.Keyboard.JustDown(this.cursors.down)) || 
                           (this.wasd.down && Phaser.Input.Keyboard.JustDown(this.wasd.down));

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

            const isConfirm = (this.wasd.enter && Phaser.Input.Keyboard.JustDown(this.wasd.enter)) || 
                              (this.wasd.space && Phaser.Input.Keyboard.JustDown(this.wasd.space)) || 
                              (this.cursors.space && Phaser.Input.Keyboard.JustDown(this.cursors.space));

            if (isConfirm) {
                this.confirmMenuChoice();
            }
            return;
        }

        if (this.isGameOver) return;
        
        const { cx, cy, tableW, tableH } = this.tableBounds;

        const speed = 380;
        let vx = 0;
        let vy = 0;

        const isLeft = (this.cursors.left && this.cursors.left.isDown) || (this.wasd.left && this.wasd.left.isDown);
        const isRight = (this.cursors.right && this.cursors.right.isDown) || (this.wasd.right && this.wasd.right.isDown);
        const isUp = (this.cursors.up && this.cursors.up.isDown) || (this.wasd.up && this.wasd.up.isDown);
        const isDown = (this.cursors.down && this.cursors.down.isDown) || (this.wasd.down && this.wasd.down.isDown);

        if (isLeft && isRight) {
            const leftTime = Math.max((this.cursors.left ? this.cursors.left.timeDown : 0), (this.wasd.left ? this.wasd.left.timeDown : 0));
            const rightTime = Math.max((this.cursors.right ? this.cursors.right.timeDown : 0), (this.wasd.right ? this.wasd.right.timeDown : 0));
            vx = (rightTime >= leftTime) ? speed : -speed;
        } else if (isLeft) {
            vx = -speed;
        } else if (isRight) {
            vx = speed;
        }

        if (isUp && isDown) {
            const upTime = Math.max((this.cursors.up ? this.cursors.up.timeDown : 0), (this.wasd.up ? this.wasd.up.timeDown : 0));
            const downTime = Math.max((this.cursors.down ? this.cursors.down.timeDown : 0), (this.wasd.down ? this.wasd.down.timeDown : 0));
            vy = (downTime >= upTime) ? speed : -speed;
        } else if (isUp) {
            vy = -speed;
        } else if (isDown) {
            vy = speed;
        }
        
        if (vx !== 0 || vy !== 0) {
            this.paddlePlayer.x = Phaser.Math.Clamp(this.paddlePlayer.x + (vx * delta * 0.001), cx - tableW / 2 + 25, cx + tableW / 2 - 25);
            this.paddlePlayer.y = Phaser.Math.Clamp(this.paddlePlayer.y + (vy * delta * 0.001), cy + 20, cy + tableH / 2 - 25);
        }
        
        const aiSpeed = 240;
        if (this.puck.y < cy) {
            if (this.paddleAI.x < this.puck.x - 12) {
                this.paddleAI.setVelocityX(aiSpeed);
            } else if (this.paddleAI.x > this.puck.x + 12) {
                this.paddleAI.setVelocityX(-aiSpeed);
            } else {
                this.paddleAI.setVelocityX(0);
            }

            if (this.paddleAI.y < this.puck.y - 30) {
                this.paddleAI.setVelocityY(aiSpeed * 0.6);
            } else {
                this.paddleAI.setVelocityY(-aiSpeed * 0.6);
            }
        } else {
            if (this.paddleAI.x < cx - 15) {
                this.paddleAI.setVelocityX(aiSpeed * 0.7);
            } else if (this.paddleAI.x > cx + 15) {
                this.paddleAI.setVelocityX(-aiSpeed * 0.7);
            } else {
                this.paddleAI.setVelocityX(0);
            }
            if (this.paddleAI.y > cy - 140) {
                this.paddleAI.setVelocityY(-aiSpeed * 0.5);
            } else {
                this.paddleAI.setVelocityY(0);
            }
        }

        this.paddleAI.y = Phaser.Math.Clamp(this.paddleAI.y, cy - tableH / 2 + 25, cy - 20);
        
        const charName = this.heroZone && this.heroZone.gameScene ? this.heroZone.gameScene.characterName : 'Riley';
        const uName = charName.toUpperCase();
        if (!this.scoring && !this.isGameOver) {
            if (this.physics.overlap(this.puck, this.goalTop)) {
                this.handleGoal(`${uName} SCORED!`, 'player');
            } else if (this.physics.overlap(this.puck, this.goalBot)) {
                this.handleGoal('AI SCORED!', 'ai');
            }
        }
    }
    
    handleGoal(msg, scorer) {
        if (this.scoring || this.isGameOver) return;
        this.scoring = true;

        if (scorer === 'player') {
            this.playerScore += 1;
        } else {
            this.aiScore += 1;
        }

        // Freeze and hide puck immediately to prevent multi-overlap score corruption
        this.puck.setVelocity(0, 0);
        this.puck.setVisible(false);

        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
            retroArcadeAudio.play('powerup');
        }
        
        const charName = this.heroZone && this.heroZone.gameScene ? this.heroZone.gameScene.characterName : 'Riley';
        const uName = charName.toUpperCase();
        this.scoreText.setText(`${uName} ${this.playerScore}  -  ${this.aiScore} AI`);
        
        const goalText = this.add.text(this.scale.width / 2, this.scale.height / 2, msg, {
            fontSize: '14px', fontFamily: '"Press Start 2P"', fill: '#FFFF00', backgroundColor: '#000', padding: 8
        }).setOrigin(0.5);
        
        this.time.delayedCall(1000, () => {
            goalText.destroy();
            // Best of 7: First player to 4 goals wins
            if (this.playerScore >= 4 || this.aiScore >= 4) {
                this.finishGame();
            } else {
                this.resetPuck();
                this.scoring = false;
            }
        });
    }

    finishGame() {
        this.isGameOver = true;
        this.completionMenuOpen = true;
        this.menuSelectionIndex = 0;
        this.menuReadyTime = this.time.now + 600;
        this.puck.setVelocity(0, 0);
        this.puck.setVisible(false);

        // Reset key states to prevent accidental confirmation
        if (this.cursors) {
            if (this.cursors.space) this.cursors.space.isDown = false;
            if (this.cursors.up) this.cursors.up.isDown = false;
            if (this.cursors.down) this.cursors.down.isDown = false;
        }
        if (this.wasd) {
            if (this.wasd.space) this.wasd.space.isDown = false;
            if (this.wasd.enter) this.wasd.enter.isDown = false;
            if (this.wasd.up) this.wasd.up.isDown = false;
            if (this.wasd.down) this.wasd.down.isDown = false;
        }
        if (this.input && this.input.keyboard) {
            this.input.keyboard.resetKeys();
        }

        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
            retroArcadeAudio.play('powerup');
        }

        const win = (this.playerScore >= 4);
        if (win) {
            const scores = getHeroZoneScores();
            scores.airHockeyWins = (scores.airHockeyWins || 0) + 1;
            saveHeroZoneScores(scores);
        }

        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;
        const W = this.scale.width;
        const H = this.scale.height;

        this.modalBackdrop = this.add.rectangle(cx, cy, W, H, 0x000000, 0.6).setScrollFactor(0).setDepth(500);
        this.modalBg = this.add.rectangle(cx, cy, 340, 220, 0x000000, 0.95).setStrokeStyle(3, 0xF8B800).setScrollFactor(0).setDepth(501);
        const charName = this.heroZone && this.heroZone.gameScene ? this.heroZone.gameScene.characterName : 'Riley';
        const uName = charName.toUpperCase();
        this.modalTitle = this.add.text(cx, cy - 65, win ? `★ ${uName} WINS SERIES! ★` : 'AI WINS SERIES!', {
            fontSize: '11px', fontFamily: '"Press Start 2P"', fill: win ? '#00FF00' : '#FF5555'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(502);

        this.modalScore = this.add.text(cx, cy - 35, `FINAL: ${uName} ${this.playerScore} - ${this.aiScore} AI`, {
            fontSize: '9px', fontFamily: '"Press Start 2P"', fill: '#FFFFFF'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(502);

        this.modalSubtitle = this.add.text(cx, cy - 12, win ? 'BEST OF 7 CHAMPION!' : 'BEST OF 7 SERIES OVER', {
            fontSize: '7px', fontFamily: '"Press Start 2P"', fill: '#FFD700'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(502);

        this.btnAgain = this.add.text(cx, cy + 25, '  PLAY AGAIN  ', {
            fontSize: '9px', fontFamily: '"Press Start 2P"', fill: '#000000', backgroundColor: '#FFD700', padding: { x: 10, y: 6 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(503).setInteractive({ useHandCursor: true });

        this.btnExitModal = this.add.text(cx, cy + 65, '  RETURN TO HERO ZONE  ', {
            fontSize: '9px', fontFamily: '"Press Start 2P"', fill: '#FFFFFF', backgroundColor: '#660000', padding: { x: 10, y: 6 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(503).setInteractive({ useHandCursor: true });

        this.menuCursor = this.add.text(cx - 95, cy + 25, '►', {
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
        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;
        if (this.menuSelectionIndex === 0) {
            this.btnAgain.setStyle({ fill: '#000000', backgroundColor: '#FFD700' });
            this.btnExitModal.setStyle({ fill: '#FFFFFF', backgroundColor: '#660000' });
            this.menuCursor.setPosition(cx - 95, cy + 25);
        } else {
            this.btnAgain.setStyle({ fill: '#FFFFFF', backgroundColor: '#005500' });
            this.btnExitModal.setStyle({ fill: '#000000', backgroundColor: '#FF5555' });
            this.menuCursor.setPosition(cx - 135, cy + 65);
        }
    }

    confirmMenuChoice() {
        if (this.menuSelectionIndex === 0) {
            this.restartAirHockey();
        } else {
            this.exitAirHockey();
        }
    }
}

