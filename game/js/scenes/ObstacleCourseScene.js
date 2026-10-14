// =========================================================================
// STATION 1: INCREDIBLES TIMED OBSTACLE COURSE SCENE
// =========================================================================

class ObstacleCourseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ObstacleCourseScene' });
    }

    init(data) {
        this.heroZone = data ? data.heroZone : null;
        this.heroSpeed = 230;
        this.jumpForce = -490;
        this.timer = 0;
        this.raceStarted = false;
        this.raceFinished = false;
        this.penaltyCooldown = 0;
        this.isExiting = false;

        this.completionMenuOpen = false;
        this.menuSelectionIndex = 0;
        this.menuReadyTime = 0;

        // Mobile touch controls
        this.touchLeft = false;
        this.touchRight = false;
        this.touchJump = false;
    }

    create() {
        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.init) {
            retroArcadeAudio.init();
        }

        const W = this.scale.width;
        const H = this.scale.height;
        const courseW = 3800;
        this.courseW = courseW;
        this.courseH = H;

        this.physics.world.setBounds(0, 0, courseW, H);
        this.physics.world.gravity.y = 950;

        const floorY = H - 55;
        this.floorY = floorY;

        if (!this.textures.exists('hz_wall_pattern')) {
            let g = this.add.graphics();
            g.fillStyle(0x280505, 1);
            g.fillRect(0, 0, 60, 60);
            g.lineStyle(2, 0x4A0C0C, 1);
            g.strokeRect(0, 0, 60, 60);
            g.fillStyle(0xE83818, 1);
            g.fillCircle(30, 30, 6);
            g.fillStyle(0xF8B800, 1);
            g.fillCircle(30, 30, 3);
            g.generateTexture('hz_wall_pattern', 60, 60);
            g.destroy();
        }

        // 1. Background arena wall
        this.add.rectangle(0, 0, courseW, H, 0x140505).setOrigin(0).setDepth(0);
        this.add.tileSprite(courseW / 2, (floorY) / 2, courseW, floorY, 'hz_wall_pattern').setDepth(1).setAlpha(0.8);

        // Ceiling Trusses & Arena Lighting
        for (let tx = 150; tx < courseW; tx += 300) {
            this.add.rectangle(tx, 20, 260, 18, 0xD01000).setDepth(2);
            this.add.rectangle(tx, 32, 240, 5, 0xF8B800).setDepth(2);
            this.add.circle(tx - 80, 42, 6, 0xFFFFCC).setDepth(3);
            this.add.circle(tx + 80, 42, 6, 0xFFFFCC).setDepth(3);
        }

        // Platforms & Floors
        this.platforms = this.physics.add.staticGroup();

        // Floor segments
        this.createFloorSegment(0, 850, floorY, 0xD01000);
        this.createFloorSegment(950, 1600, floorY, 0x0055AA);
        this.createFloorSegment(1720, 2400, floorY, 0xD01000);
        this.createFloorSegment(2520, 3100, floorY, 0x0055AA);
        this.createFloorSegment(3220, courseW, floorY, 0xD01000);

        // Pit Safety Nets
        this.pitNets = this.physics.add.staticGroup();
        this.createPitNet(850, 950, floorY + 25);
        this.createPitNet(1600, 1720, floorY + 25);
        this.createPitNet(2400, 2520, floorY + 25);
        this.createPitNet(3100, 3220, floorY + 25);

        // Start Banner at x = 120
        this.createStartBanner(150, floorY);

        // Hurdles (Inflatable barriers)
        this.hurdles = this.physics.add.group({ allowGravity: false, immovable: true });
        [1150, 1400, 1900, 2150, 2750, 2980, 3400].forEach(hx => {
            this.createHurdle(hx, floorY);
        });

        // Swinging Pendulums (Wrecking balls)
        this.pendulums = this.physics.add.group({ allowGravity: false, immovable: true });
        this.pendulumList = [];
        this.pendulumGfx = this.add.graphics().setDepth(4);
        [1300, 2020, 2860].forEach((px, i) => {
            this.createPendulum(px, floorY - 170, i * 1.5);
        });

        // Climbing Wall (x = 2260)
        this.createClimbingWall(2260, floorY - 95);

        // Super Slide (x = 2650)
        this.createSuperSlide(2650, floorY);

        // Finish Line Buzzer (x = 3600)
        this.createFinishLine(3600, floorY);

        // ----------------------------------------------------
        // CHARACTERS
        // ----------------------------------------------------
        // PLAYER
        const charId = this.heroZone && this.heroZone.gameScene ? this.heroZone.gameScene.selectedCharacter : 'riley';
        this.player = this.physics.add.sprite(100, floorY - 40, charId + '_idle').setDepth(15);
        this.player.setCollideWorldBounds(true);
        this.player.body.setSize(22, 38);
        this.player.body.setOffset(5, 10);

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.overlap(this.player, this.hurdles, this.handleObstacleHit, null, this);
        this.physics.add.overlap(this.player, this.pendulums, this.handleObstacleHit, null, this);
        this.physics.add.overlap(this.player, this.pitNets, (player, net) => {
            this.handlePitFall(net.safeX || 100);
        }, null, this);

        // Dash (Rival Racer)
        this.dash = this.physics.add.sprite(100, floorY - 40, 'npc_tourist_idle').setDepth(14).setTint(0xFF3333);
        this.dash.setCollideWorldBounds(true);
        this.dash.body.setSize(22, 38);
        this.dash.body.setOffset(5, 10);
        this.physics.add.collider(this.dash, this.platforms);

        this.dashTag = this.add.text(100, floorY - 75, 'DASH', {
            fontSize: '8px', fontFamily: '"Press Start 2P"', fill: '#FFFF00', backgroundColor: '#000', padding: { x: 3, y: 2 }
        }).setOrigin(0.5).setDepth(16);

        // Camera Follow Riley
        this.cameras.main.setBounds(0, 0, courseW, H);
        this.cameras.main.startFollow(this.player, true, 0.12, 0.12);

        // HUD & Controls
        this.createHUD();

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

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keysWASD = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
            esc: Phaser.Input.Keyboard.KeyCodes.ESC,
            r: Phaser.Input.Keyboard.KeyCodes.R
        });

        const resetCourseKeys = () => {
            if (this.cursors) {
                if (this.cursors.left) this.cursors.left.isDown = false;
                if (this.cursors.right) this.cursors.right.isDown = false;
                if (this.cursors.up) this.cursors.up.isDown = false;
                if (this.cursors.down) this.cursors.down.isDown = false;
                if (this.cursors.space) this.cursors.space.isDown = false;
            }
            if (this.keysWASD) {
                if (this.keysWASD.left) this.keysWASD.left.isDown = false;
                if (this.keysWASD.right) this.keysWASD.right.isDown = false;
                if (this.keysWASD.up) this.keysWASD.up.isDown = false;
                if (this.keysWASD.down) this.keysWASD.down.isDown = false;
                if (this.keysWASD.space) this.keysWASD.space.isDown = false;
                if (this.keysWASD.enter) this.keysWASD.enter.isDown = false;
                if (this.keysWASD.esc) this.keysWASD.esc.isDown = false;
                if (this.keysWASD.r) this.keysWASD.r.isDown = false;
            }
            this.touchLeft = false;
            this.touchRight = false;
            this.touchJump = false;
        };

        const onCourseNativeKeyUp = (e) => {
            if (e.code === 'Space') {
                if (this.cursors && this.cursors.space) this.cursors.space.isDown = false;
                if (this.keysWASD && this.keysWASD.space) this.keysWASD.space.isDown = false;
            }
            if (e.key === 'Enter') {
                if (this.keysWASD && this.keysWASD.enter) this.keysWASD.enter.isDown = false;
            }
            if (e.key === 'r' || e.key === 'R') {
                if (this.keysWASD && this.keysWASD.r) this.keysWASD.r.isDown = false;
            }
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
                if (this.cursors && this.cursors.up) this.cursors.up.isDown = false;
                if (this.keysWASD && this.keysWASD.up) this.keysWASD.up.isDown = false;
            }
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                if (this.cursors && this.cursors.left) this.cursors.left.isDown = false;
                if (this.keysWASD && this.keysWASD.left) this.keysWASD.left.isDown = false;
            }
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                if (this.cursors && this.cursors.right) this.cursors.right.isDown = false;
                if (this.keysWASD && this.keysWASD.right) this.keysWASD.right.isDown = false;
            }
            if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                if (this.cursors && this.cursors.down) this.cursors.down.isDown = false;
                if (this.keysWASD && this.keysWASD.down) this.keysWASD.down.isDown = false;
            }
            if (['Alt', 'Meta', 'Control', 'Shift'].includes(e.key)) {
                resetCourseKeys();
            }
        };

        window.addEventListener('blur', resetCourseKeys);
        window.addEventListener('focus', resetCourseKeys);
        window.addEventListener('keyup', onCourseNativeKeyUp);
        const onVisCourse = () => { if (document.hidden) resetCourseKeys(); };
        document.addEventListener('visibilitychange', onVisCourse);

        this._cleanWindowListeners = () => {
            window.removeEventListener('blur', resetCourseKeys);
            window.removeEventListener('focus', resetCourseKeys);
            window.removeEventListener('keyup', onCourseNativeKeyUp);
            document.removeEventListener('visibilitychange', onVisCourse);
        };

        this.events.once('shutdown', () => {
            if (this._cleanWindowListeners) this._cleanWindowListeners();
        });

        this.createTouchControls();
    }

    createFloorSegment(x1, x2, y, color) {
        const w = x2 - x1;
        const cx = x1 + w / 2;
        const f = this.add.rectangle(cx, y + 25, w, 50, color).setDepth(4).setStrokeStyle(2, 0x000);
        this.add.rectangle(cx, y + 3, w, 6, 0xF8B800).setDepth(5);
        this.physics.add.existing(f, true);
        this.platforms.add(f);
    }

    createPitNet(x1, x2, y) {
        const w = x2 - x1;
        const net = this.add.rectangle(x1 + w / 2, y, w, 14, 0xF8B800, 0.75).setDepth(3);
        this.physics.add.existing(net, true);
        net.safeX = x1 - 35;
        this.pitNets.add(net);
    }

    createStartBanner(x, floorY) {
        this.add.rectangle(x, floorY - 110, 16, 220, 0xFFFFFF).setDepth(4);
        this.add.rectangle(x, floorY - 110, 10, 220, 0x000000).setDepth(4);
        this.add.text(x, floorY - 195, '► START LINE ◄', {
            fontSize: '10px', fontFamily: '"Press Start 2P"', fill: '#00FF00', backgroundColor: '#000', padding: { x: 8, y: 4 }, stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(5);
        this.add.text(x, floorY - 170, 'RUN RIGHT TO RACE DASH!', {
            fontSize: '7px', fontFamily: '"Press Start 2P"', fill: '#FFFF00', backgroundColor: '#000', padding: { x: 4, y: 2 }
        }).setOrigin(0.5).setDepth(5);
    }

    createHurdle(x, floorY) {
        const hurdle = this.add.rectangle(x, floorY - 20, 24, 40, 0xD01000).setDepth(5).setStrokeStyle(3, 0xF8B800);
        this.physics.add.existing(hurdle);
        hurdle.body.allowGravity = false;
        hurdle.body.immovable = true;
        this.hurdles.add(hurdle);
    }

    createPendulum(x, anchorY, offset) {
        this.add.circle(x, anchorY, 8, 0xF8B800).setDepth(4);
        const ball = this.add.circle(x, anchorY + 110, 22, 0x222222).setDepth(5).setStrokeStyle(3, 0xD01000);
        this.physics.add.existing(ball);
        ball.body.allowGravity = false;
        ball.body.immovable = true;
        ball.body.setCircle(22);
        this.pendulums.add(ball);

        this.pendulumList.push({
            ball: ball,
            anchorX: x,
            anchorY: anchorY,
            length: 110,
            angleOffset: offset
        });
    }

    createClimbingWall(x, y) {
        this.add.rectangle(x, y, 64, 180, 0xF8B800, 0.4).setDepth(2).setStrokeStyle(3, 0xF8B800);
        for (let py = y - 75; py <= y + 75; py += 25) {
            this.add.rectangle(x, py, 60, 4, 0xD01000).setDepth(3);
        }
        this.add.text(x, y - 105, '▲ CLIMB WALL ▲', {
            fontSize: '7px', fontFamily: '"Press Start 2P"', fill: '#FFFF00', backgroundColor: '#000', padding: { x: 4, y: 2 }
        }).setOrigin(0.5).setDepth(5);

        this.climbZone = this.add.zone(x, y, 70, 190);
        this.physics.add.existing(this.climbZone, true);
    }

    createSuperSlide(x, floorY) {
        this.add.rectangle(x, floorY - 25, 120, 40, 0x00AAFF, 0.75).setDepth(3);
        this.add.text(x, floorY - 65, '► SUPER SLIDE! ►', {
            fontSize: '8px', fontFamily: '"Press Start 2P"', fill: '#00FFFF', backgroundColor: '#001133', padding: { x: 6, y: 3 }
        }).setOrigin(0.5).setDepth(5);

        this.slideZone = this.add.zone(x, floorY - 30, 120, 80);
        this.physics.add.existing(this.slideZone, true);
    }

    createFinishLine(x, floorY) {
        this.add.rectangle(x, floorY - 30, 40, 60, 0xF8B800).setDepth(4).setStrokeStyle(2, 0x000);
        this.buzzerBtn = this.add.circle(x, floorY - 65, 18, 0xD01000).setDepth(5).setStrokeStyle(3, 0xFFFFFF);

        this.add.text(x, floorY - 110, '★ HIT BUZZER! ★', {
            fontSize: '9px', fontFamily: '"Press Start 2P"', fill: '#FF0000', backgroundColor: '#FFFFFF', padding: { x: 6, y: 4 }
        }).setOrigin(0.5).setDepth(6);

        this.buzzerZone = this.add.zone(x, floorY - 60, 60, 80);
        this.physics.add.existing(this.buzzerZone, true);

        this.add.rectangle(x + 50, floorY - 110, 16, 220, 0xFFFFFF).setDepth(3);
        this.add.rectangle(x + 50, floorY - 110, 10, 220, 0x000000).setDepth(3);
    }

    createHUD() {
        const W = this.scale.width;
        this.timerBox = this.add.rectangle(110, 30, 180, 36, 0x000000, 0.85).setScrollFactor(0).setDepth(100).setStrokeStyle(2, 0xF8B800);
        this.uiTimer = this.add.text(110, 30, 'TIME: 0.00s', {
            fontSize: '11px', fontFamily: '"Press Start 2P"', fill: '#FFFFFF'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(101);

        this.uiPenalty = this.add.text(W / 2, 45, '+3.00s PENALTY!', {
            fontSize: '13px', fontFamily: '"Press Start 2P"', fill: '#FF0000', backgroundColor: '#000', padding: { x: 8, y: 4 }, stroke: '#FFF', strokeThickness: 2
        }).setOrigin(0.5).setScrollFactor(0).setDepth(102).setVisible(false);

        // Top-Right [ RESTART ] Button
        this.hudRestartBtn = this.add.text(W - 195, 30, '[ RESTART ]', {
            fontSize: '10px', fontFamily: '"Press Start 2P"', fill: '#000000', backgroundColor: '#FFD700', padding: { x: 8, y: 6 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(100).setInteractive({ useHandCursor: true });
        this.hudRestartBtn.on('pointerdown', () => this.restartCourse());

        // Top-Right [ EXIT ] Button
        this.hudExitBtn = this.add.text(W - 75, 30, '[ EXIT ]', {
            fontSize: '10px', fontFamily: '"Press Start 2P"', fill: '#FFFFFF', backgroundColor: '#B80000', padding: { x: 8, y: 6 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(100).setInteractive({ useHandCursor: true });
        this.hudExitBtn.on('pointerdown', () => this.exitToHeroZone());
    }

    restartCourse() {
        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
            retroArcadeAudio.play('powerup');
        }
        if (this._cleanWindowListeners) {
            this._cleanWindowListeners();
        }
        this.scene.restart();
    }

    createTouchControls() {
        const H = this.scale.height;
        const W = this.scale.width;

        this.touchContainer = this.add.container(0, 0).setScrollFactor(0).setDepth(99);

        const btnL = this.add.rectangle(50, H - 55, 60, 50, 0x000000, 0.6).setStrokeStyle(2, 0xFFFFFF).setInteractive();
        const txtL = this.add.text(50, H - 55, '◄', { fontSize: '20px', fill: '#FFF' }).setOrigin(0.5);
        btnL.on('pointerdown', () => { this.touchLeft = true; });
        btnL.on('pointerup', () => { this.touchLeft = false; });
        btnL.on('pointerout', () => { this.touchLeft = false; });

        const btnR = this.add.rectangle(125, H - 55, 60, 50, 0x000000, 0.6).setStrokeStyle(2, 0xFFFFFF).setInteractive();
        const txtR = this.add.text(125, H - 55, '►', { fontSize: '20px', fill: '#FFF' }).setOrigin(0.5);
        btnR.on('pointerdown', () => { this.touchRight = true; });
        btnR.on('pointerup', () => { this.touchRight = false; });
        btnR.on('pointerout', () => { this.touchRight = false; });

        const btnJ = this.add.rectangle(W - 65, H - 55, 75, 50, 0xD01000, 0.8).setStrokeStyle(2, 0xFFD700).setInteractive();
        const txtJ = this.add.text(W - 65, H - 55, 'JUMP', { fontSize: '9px', fontFamily: '"Press Start 2P"', fill: '#FFF' }).setOrigin(0.5);
        btnJ.on('pointerdown', () => { this.touchJump = true; });
        btnJ.on('pointerup', () => { this.touchJump = false; });
        btnJ.on('pointerout', () => { this.touchJump = false; });

        this.touchContainer.add([btnL, txtL, btnR, txtR, btnJ, txtJ]);
    }

    exitToHeroZone() {
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
        this.scene.stop('ObstacleCourseScene');
    }

    handleObstacleHit(player, obstacle) {
        if (!this.raceStarted || this.raceFinished) return;
        if (this.time.now < this.penaltyCooldown) return;

        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
            retroArcadeAudio.play('explosion');
        }
        this.timer += 3000;
        this.penaltyCooldown = this.time.now + 1200;

        this.uiPenalty.setVisible(true);
        this.time.delayedCall(900, () => {
            if (this.uiPenalty) this.uiPenalty.setVisible(false);
        });

        this.player.setVelocity(-180, -220);

        this.tweens.add({
            targets: this.player,
            alpha: 0.2,
            duration: 80,
            yoyo: true,
            repeat: 5,
            onComplete: () => {
                if (this.player) this.player.setAlpha(1);
            }
        });
    }

    handlePitFall(safeX) {
        if (!this.raceStarted || this.raceFinished) return;
        if (this.time.now < this.penaltyCooldown) return;
        this.timer += 3000;
        this.penaltyCooldown = this.time.now + 1500;
        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
            retroArcadeAudio.play('explosion');
        }

        this.uiPenalty.setVisible(true);
        this.time.delayedCall(900, () => {
            if (this.uiPenalty) this.uiPenalty.setVisible(false);
        });

        this.player.setPosition(safeX, this.floorY - 50);
        this.player.setVelocity(0, -320);
    }

    update(time, delta) {
        if (this.keysWASD.r && Phaser.Input.Keyboard.JustDown(this.keysWASD.r)) {
            this.restartCourse();
            return;
        }

        if (this.keysWASD.esc && Phaser.Input.Keyboard.JustDown(this.keysWASD.esc)) {
            this.exitToHeroZone();
            return;
        }

        if (this.completionMenuOpen) {
            this.player.setVelocity(0, 0);
            if (this.time.now < this.menuReadyTime) {
                return;
            }

            const isUp = (this.cursors.up && Phaser.Input.Keyboard.JustDown(this.cursors.up)) || 
                         (this.keysWASD.up && Phaser.Input.Keyboard.JustDown(this.keysWASD.up));

            const isDown = (this.cursors.down && Phaser.Input.Keyboard.JustDown(this.cursors.down)) || 
                           (this.keysWASD.down && Phaser.Input.Keyboard.JustDown(this.keysWASD.down));

            if (isUp) {
                if (this.menuSelectionIndex !== 0) {
                    this.menuSelectionIndex = 0;
                    this.updateMenuVisuals();
                    if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
                        retroArcadeAudio.play('laser');
                    }
                }
            } else if (isDown) {
                if (this.menuSelectionIndex !== 1) {
                    this.menuSelectionIndex = 1;
                    this.updateMenuVisuals();
                    if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
                        retroArcadeAudio.play('laser');
                    }
                }
            }

            const isConfirm = (this.keysWASD.enter && Phaser.Input.Keyboard.JustDown(this.keysWASD.enter)) || 
                              (this.keysWASD.space && Phaser.Input.Keyboard.JustDown(this.keysWASD.space)) || 
                              (this.cursors.space && Phaser.Input.Keyboard.JustDown(this.cursors.space));

            if (isConfirm) {
                this.confirmMenuChoice();
            }
            return;
        }

        // Draw and update Pendulums via Graphics lineBetween
        if (this.pendulumGfx) {
            this.pendulumGfx.clear();
            this.pendulumGfx.lineStyle(3, 0xF8B800, 1);
            this.pendulumList.forEach(p => {
                const angle = Math.sin((time * 0.0025) + p.angleOffset) * 0.85;
                const bx = p.anchorX + Math.sin(angle) * p.length;
                const by = p.anchorY + Math.cos(angle) * p.length;
                p.ball.setPosition(bx, by);
                this.pendulumGfx.lineBetween(p.anchorX, p.anchorY, bx, by);
            });
        }

        // Horizontal Movement with SOCD Resolution
        const isLeft = (this.cursors.left && this.cursors.left.isDown) || 
                       (this.keysWASD.left && this.keysWASD.left.isDown) || 
                       this.touchLeft;

        const isRight = (this.cursors.right && this.cursors.right.isDown) || 
                        (this.keysWASD.right && this.keysWASD.right.isDown) || 
                        this.touchRight;

        const moveUp = (this.cursors.up && this.cursors.up.isDown) || 
                       (this.keysWASD.up && this.keysWASD.up.isDown) || 
                       this.touchJump || 
                       (this.keysWASD.space && this.keysWASD.space.isDown) || 
                       (this.cursors.space && this.cursors.space.isDown);

        const moveDown = (this.cursors.down && this.cursors.down.isDown) || 
                         (this.keysWASD.down && this.keysWASD.down.isDown);

        let moveX = 0;
        if (isLeft && isRight) {
            const leftTime = Math.max((this.cursors.left ? this.cursors.left.timeDown : 0), (this.keysWASD.left ? this.keysWASD.left.timeDown : 0));
            const rightTime = Math.max((this.cursors.right ? this.cursors.right.timeDown : 0), (this.keysWASD.right ? this.keysWASD.right.timeDown : 0));
            moveX = (rightTime >= leftTime) ? 1 : -1;
        } else if (isLeft) {
            moveX = -1;
        } else if (isRight) {
            moveX = 1;
        }

        const inClimbZone = this.physics.overlap(this.player, this.climbZone);
        if (inClimbZone) {
            this.player.body.allowGravity = false;
            if (moveUp) {
                this.player.setVelocityY(-160);
            } else if (moveDown) {
                this.player.setVelocityY(160);
            } else {
                this.player.setVelocityY(0);
            }
        } else {
            this.player.body.allowGravity = true;
        }

        const inSlideZone = this.physics.overlap(this.player, this.slideZone);
        const charId = this.heroZone && this.heroZone.gameScene ? this.heroZone.gameScene.selectedCharacter : 'riley';
        if (inSlideZone) {
            this.player.setVelocityX(360);
            this.player.setVelocityY(180);
            this.player.anims.play(charId + '_walk', true);
        } else {
            if (moveX === -1) {
                this.player.setVelocityX(-this.heroSpeed);
                this.player.flipX = true;
                if (!inClimbZone) this.player.anims.play(charId + '_walk', true);
            } else if (moveX === 1) {
                this.player.setVelocityX(this.heroSpeed);
                this.player.flipX = false;
                if (!inClimbZone) this.player.anims.play(charId + '_walk', true);
            } else {
                this.player.setVelocityX(0);
                if (!inClimbZone) this.player.anims.play(charId + '_idle', true);
            }
        }

        // Jump
        const onFloor = (this.player.body.blocked.down || this.player.body.touching.down);
        if (moveUp && onFloor && !inClimbZone && !inSlideZone) {
            this.player.setVelocityY(this.jumpForce);
            if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
                retroArcadeAudio.play('jump');
            }
        }

        // Trigger race start
        if (this.player.x > 180 && !this.raceStarted) {
            this.raceStarted = true;
            if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
                retroArcadeAudio.play('powerup');
            }
            const banner = this.add.text(this.scale.width / 2, this.scale.height / 2 - 50, 'RACE STARTED!\nGO GO GO!', {
                fontSize: '16px', fontFamily: '"Press Start 2P"', fill: '#00FF00', align: 'center', backgroundColor: '#000', padding: 12, stroke: '#FFF', strokeThickness: 2
            }).setOrigin(0.5).setScrollFactor(0).setDepth(200);
            this.tweens.add({
                targets: banner,
                scaleX: 1.2,
                scaleY: 1.2,
                alpha: 0,
                duration: 1200,
                onComplete: () => banner.destroy()
            });
        }

        if (this.raceStarted && !this.raceFinished) {
            this.timer += delta;
            this.uiTimer.setText('TIME: ' + (this.timer / 1000).toFixed(2) + 's');

            // Dash Racer AI
            if (this.dash && this.dash.x < 3600) {
                this.dash.setVelocityX(165);
                this.dash.anims.play('npc_tourist_walk', true);
                if (this.dashTag) this.dashTag.setPosition(this.dash.x, this.dash.y - 30);

                const hurdlesX = [1150, 1400, 1900, 2150, 2750, 2980, 3400];
                const pitsX = [850, 1600, 2400, 3100];
                const nearHurdle = hurdlesX.some(hx => (this.dash.x > hx - 55 && this.dash.x < hx));
                const nearPit = pitsX.some(px => (this.dash.x > px - 50 && this.dash.x < px));

                if ((nearHurdle || nearPit) && (this.dash.body.touching.down || this.dash.body.blocked.down)) {
                    this.dash.setVelocityY(-460);
                }
            }

            if (this.physics.overlap(this.player, this.buzzerZone) || this.player.x >= 3590) {
                this.completeCourse();
            }
        }
    }

    completeCourse() {
        if (this.raceFinished) return;
        this.raceFinished = true;
        this.completionMenuOpen = true;
        this.menuSelectionIndex = 0;
        this.menuReadyTime = this.time.now + 600;
        this.player.setVelocity(0, 0);

        if (this.input && this.input.keyboard) this.input.keyboard.resetKeys();
        if (this.cursors) {
            if (this.cursors.left) this.cursors.left.isDown = false;
            if (this.cursors.right) this.cursors.right.isDown = false;
            if (this.cursors.up) this.cursors.up.isDown = false;
            if (this.cursors.down) this.cursors.down.isDown = false;
            if (this.cursors.space) this.cursors.space.isDown = false;
        }
        if (this.keysWASD) {
            if (this.keysWASD.left) this.keysWASD.left.isDown = false;
            if (this.keysWASD.right) this.keysWASD.right.isDown = false;
            if (this.keysWASD.up) this.keysWASD.up.isDown = false;
            if (this.keysWASD.down) this.keysWASD.down.isDown = false;
            if (this.keysWASD.space) this.keysWASD.space.isDown = false;
            if (this.keysWASD.enter) this.keysWASD.enter.isDown = false;
        }

        if (this.touchContainer) {
            this.touchContainer.setVisible(false);
        }

        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
            retroArcadeAudio.play('powerup');
        }

        const finalTime = (this.timer / 1000).toFixed(2);
        const rileyWon = (this.player.x >= 3580 && (!this.dash || this.dash.x < 3580));

        const scores = getHeroZoneScores();
        let isNewRecord = false;
        if (!scores.obstacleTime || parseFloat(finalTime) < parseFloat(scores.obstacleTime)) {
            scores.obstacleTime = finalTime;
            const charName = this.heroZone && this.heroZone.gameScene ? this.heroZone.gameScene.characterName : 'Riley';
            scores.obstacleHolder = charName.toUpperCase();
            saveHeroZoneScores(scores);
            isNewRecord = true;
        }

        const W = this.scale.width;
        const H = this.scale.height;

        this.modalBackdrop = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.6)
            .setScrollFactor(0).setDepth(500);

        this.modalBg = this.add.rectangle(W / 2, H / 2, 380, 240, 0x000000, 0.95)
            .setStrokeStyle(4, 0xF8B800).setScrollFactor(0).setDepth(501);

        this.modalTitle = this.add.text(W / 2, H / 2 - 85, '★ COURSE COMPLETE! ★', {
            fontSize: '11px', fontFamily: '"Press Start 2P"', fill: '#FFD700', stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5).setScrollFactor(0).setDepth(502);

        const charName = this.heroZone && this.heroZone.gameScene ? this.heroZone.gameScene.characterName : 'Riley';
        this.modalWinner = this.add.text(W / 2, H / 2 - 55, rileyWon ? `${charName.toUpperCase()} DEFEATED DASH!` : 'DASH WAS FASTER!', {
            fontSize: '9px', fontFamily: '"Press Start 2P"', fill: rileyWon ? '#00FF00' : '#FF5555'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(502);

        this.modalTime = this.add.text(W / 2, H / 2 - 25, `FINAL TIME: ${finalTime}s`, {
            fontSize: '10px', fontFamily: '"Press Start 2P"', fill: '#FFFFFF'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(502);

        this.modalRecord = this.add.text(W / 2, H / 2 + 5, isNewRecord ? '★ NEW BEST RECORD! ★' : `BEST RECORD: ${scores.obstacleTime}s (${scores.obstacleHolder})`, {
            fontSize: '7px', fontFamily: '"Press Start 2P"', fill: isNewRecord ? '#FFFF00' : '#A0D0FF'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(502);

        this.btnRetry = this.add.text(W / 2, H / 2 + 45, '  PLAY AGAIN  ', {
            fontSize: '10px', fontFamily: '"Press Start 2P"', fill: '#000000', backgroundColor: '#FFD700', padding: { x: 12, y: 7 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(503).setInteractive({ useHandCursor: true });

        this.btnExit = this.add.text(W / 2, H / 2 + 85, '  RETURN TO HERO ZONE  ', {
            fontSize: '10px', fontFamily: '"Press Start 2P"', fill: '#FFFFFF', backgroundColor: '#660000', padding: { x: 12, y: 7 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(503).setInteractive({ useHandCursor: true });

        this.menuCursor = this.add.text(W / 2 - 110, H / 2 + 45, '►', {
            fontSize: '12px', fontFamily: '"Press Start 2P"', fill: '#FFD700'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(504);

        this.tweens.add({
            targets: this.menuCursor,
            x: '+= 6',
            duration: 350,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.btnRetry.on('pointerover', () => {
            this.menuSelectionIndex = 0;
            this.updateMenuVisuals();
        });
        this.btnRetry.on('pointerdown', () => this.confirmMenuChoice());

        this.btnExit.on('pointerover', () => {
            this.menuSelectionIndex = 1;
            this.updateMenuVisuals();
        });
        this.btnExit.on('pointerdown', () => this.confirmMenuChoice());

        this.updateMenuVisuals();
    }

    updateMenuVisuals() {
        if (!this.btnRetry || !this.btnExit || !this.menuCursor) return;
        const W = this.scale.width;
        const H = this.scale.height;
        if (this.menuSelectionIndex === 0) {
            this.btnRetry.setStyle({ fill: '#000000', backgroundColor: '#FFD700' });
            this.btnExit.setStyle({ fill: '#FFFFFF', backgroundColor: '#660000' });
            this.menuCursor.setPosition(W / 2 - 110, H / 2 + 45);
        } else {
            this.btnRetry.setStyle({ fill: '#FFFFFF', backgroundColor: '#005500' });
            this.btnExit.setStyle({ fill: '#000000', backgroundColor: '#FF5555' });
            this.menuCursor.setPosition(W / 2 - 150, H / 2 + 85);
        }
    }

    confirmMenuChoice() {
        if (this.menuSelectionIndex === 0) {
            this.restartCourse();
        } else {
            this.exitToHeroZone();
        }
    }
}

