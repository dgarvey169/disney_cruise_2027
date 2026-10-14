// =========================================================================
// PHASER GAME CONFIGURATION & SCENE REGISTRATION
// =========================================================================

// =========================================================================
// RILEY'S HERO ZONE - 2.5D LOUNGE & STATION-BASED MINI-GAMES (ISSUE #46)
// =========================================================================

// High Scores storage
function getHeroZoneScores() {
    try {
        const s = localStorage.getItem('disney_destiny_hero_zone_scores');
        if (s) return JSON.parse(s);
    } catch(e) {}
    return {
        obstacleTime: '45.20',
        obstacleHolder: 'DASH',
        basketballScore: 24,
        basketballHolder: 'RILEY',
        airHockeyWins: 3
    };
}

function saveHeroZoneScores(scores) {
    try {
        localStorage.setItem('disney_destiny_hero_zone_scores', JSON.stringify(scores));
    } catch(e) {}
}

class HeroZoneScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HeroZoneScene' });
    }

    init(data) {
        this.gameScene = data ? data.gameScene : null;
        this.fromStation = (data && data.fromStation) ? data.fromStation : 180;
        this.groundY = 445;
        this.jumpZ = 0;
        this.jumpV = 0;
        this.isJumping = false;
        this.isExiting = false;
        this.playerSpeed = 180;

        // Station flags
        this.nearExit = false;
        this.nearObstacleCourse = false;
        this.nearAirHockey = false;
        this.nearBasketball = false;

        // Mobile touch controls state
        this.touchMoveDir = 0;
        this.touchMoveDepth = 0;
    }

    create(data) {
        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.init) {
            retroArcadeAudio.init();
        }

        // Hide and sleep underlying GameScene
        if (this.gameScene && this.gameScene.scene) {
            this.gameScene.scene.setVisible(false);
            if (this.gameScene.scene.isActive()) {
                this.gameScene.scene.sleep();
            }
        }

        const W = this.scale.width;
        const H = this.scale.height;

        const roomH = Math.max(540, H);
        const roomW = Math.max(1600, W);
        this.roomW = roomW;
        this.roomH = roomH;

        const floorH = Math.max(140, Math.round(roomH * 0.24));
        const floorY = roomH - floorH;
        this.floorY = floorY;
        this.floorH = floorH;
        this.groundY = floorY + 35;

        this.physics.world.setBounds(0, 0, roomW, roomH);

        // 0. Solid room background
        this.add.rectangle(0, 0, 10000, 10000, 0x110404).setOrigin(0.5).setDepth(0);

        // 1. Room Background & Framing
        this.createTextures();
        this.add.tileSprite(roomW / 2, floorY / 2, roomW, floorY, 'hz_wall_pattern').setDepth(1);
        this.add.tileSprite(roomW / 2, floorY + (floorH / 2), roomW, floorH, 'hz_floor_mat').setDepth(2);

        // Gold & Incredibles Red division curb
        let curb = this.add.graphics().setDepth(3);
        curb.fillStyle(0xE83818, 1);
        curb.fillRect(0, floorY - 3, roomW, 3);
        curb.fillStyle(0xFFD700, 0.8);
        curb.fillRect(0, floorY, roomW, 2);

        // Ceiling Trusses & Arena Lighting
        for (let tx = 80; tx < roomW; tx += 200) {
            this.add.rectangle(tx, 15, 180, 14, 0x222222).setDepth(4);
            this.add.circle(tx, 26, 6, 0xFFFFCC).setDepth(4);
        }

        // Top Marquee Banner
        this.add.rectangle(roomW / 2, 45, 480, 36, 0x000000, 0.85).setDepth(5).setStrokeStyle(2, 0xF8B800);
        this.add.text(roomW / 2, 45, '★ RILEY\'S HERO ZONE ARENA ★', {
            fontSize: '11px', fontFamily: '"Press Start 2P"', fill: '#FFD700', stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(6);

        // ----------------------------------------------------
        // STATIONS IN THE 2.5D LOUNGE
        // ----------------------------------------------------

        // Station 1: Exit Door back to Deck 12 (x = 120)
        this.createExitStation(120, floorY);

        // Station 2: Incredibles Obstacle Course Entrance (x = 440)
        this.createObstacleStation(440, floorY);

        // Leaderboard Wall & NPC Dash (x = 750)
        this.createLeaderboardStation(750, floorY);

        // Station 3: Air Hockey Tournament Table (x = 1060)
        this.createAirHockeyStation(1060, floorY);

        // Station 4: Basketball Shootout Station (x = 1380)
        this.createBasketballStation(1380, floorY);

        // ----------------------------------------------------
        // 2.5D PLAYER
        // ----------------------------------------------------
        const spawnX = (data && data.fromStation) ? data.fromStation : (this.fromStation || 180);
        const charId = this.gameScene ? this.gameScene.selectedCharacter : 'riley';
        this.player = this.physics.add.sprite(spawnX, this.groundY, charId + '_idle').setDepth(Math.round(this.groundY));
        this.player.body.allowGravity = false;
        this.player.body.setSize(22, 16);
        this.player.body.setOffset(5, 32);

        // Foot Shadow
        this.playerShadow = this.add.ellipse(spawnX, this.groundY + 16, 26, 10, 0x000000, 0.45).setDepth(Math.round(this.groundY) - 1);

        // Camera Follow
        this.cameras.main.setBounds(0, 0, roomW, roomH);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        // Station Prompt Text (floats above player)
        this.promptText = this.add.text(spawnX, this.groundY - 55, '', {
            fontSize: '9px', fontFamily: '"Press Start 2P"', fill: '#FFFF00', backgroundColor: '#000000', padding: { x: 8, y: 5 }, stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(2000).setVisible(false).setInteractive({ useHandCursor: true });
        this.promptText.on('pointerdown', () => this.handleStationAction());

        // Keyboard Controls
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
                Phaser.Input.Keyboard.KeyCodes.D
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
            esc: Phaser.Input.Keyboard.KeyCodes.ESC
        });

        // Direct DOM safety release: guarantees keys are cleared even if OS or browser dropped Phaser keyup
        const resetKeyInputs = () => {
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
            this.touchMoveDir = 0;
            this.touchMoveDepth = 0;
        };

        const onNativeKeyUp = (e) => {
            if (e.code === 'Space') {
                if (this.cursors && this.cursors.space) this.cursors.space.isDown = false;
                if (this.keysWASD && this.keysWASD.space) this.keysWASD.space.isDown = false;
            }
            if (e.key === 'Enter') {
                if (this.keysWASD && this.keysWASD.enter) this.keysWASD.enter.isDown = false;
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
                resetKeyInputs();
            }
        };

        window.addEventListener('blur', resetKeyInputs);
        window.addEventListener('focus', resetKeyInputs);
        window.addEventListener('keyup', onNativeKeyUp);
        const onVisChange = () => { if (document.hidden) resetKeyInputs(); };
        document.addEventListener('visibilitychange', onVisChange);

        this._cleanWindowListeners = () => {
            window.removeEventListener('blur', resetKeyInputs);
            window.removeEventListener('focus', resetKeyInputs);
            window.removeEventListener('keyup', onNativeKeyUp);
            document.removeEventListener('visibilitychange', onVisChange);
        };

        this.events.once('shutdown', () => {
            if (this._cleanWindowListeners) this._cleanWindowListeners();
        });

        // Top-Right Exit Button
        this.add.text(W - 75, 30, '[ EXIT ]', {
            fontSize: '10px', fontFamily: '"Press Start 2P"', fill: '#FF5555', backgroundColor: '#000000', padding: { x: 8, y: 6 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(2000).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.exitToShip());

        // Floating D-Pad / Controls for Mobile
        this.createMobileControls();

        // Clear input states and refresh leaderboard on resume
        this.events.on('resume', () => {
            if (this.input && this.input.keyboard) {
                this.input.keyboard.resetKeys();
            }
            resetKeyInputs();
            if (this.game && this.game.canvas) {
                this.game.canvas.focus();
            }
            this.refreshLeaderboard();
        });
    }

    createTextures() {
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

        if (!this.textures.exists('hz_floor_mat')) {
            let g = this.add.graphics();
            g.fillStyle(0x7A0D0D, 1);
            g.fillRect(0, 0, 40, 40);
            g.lineStyle(2, 0x991515, 1);
            g.strokeRect(0, 0, 40, 40);
            g.fillStyle(0xF8B800, 0.4);
            g.fillRect(18, 18, 4, 4);
            g.generateTexture('hz_floor_mat', 40, 40);
            g.destroy();
        }

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
    }

    createExitStation(x, floorY) {
        // Door frame
        const door = this.add.rectangle(x, floorY - 55, 64, 110, 0x000022).setDepth(3).setInteractive({ useHandCursor: true });
        this.add.rectangle(x, floorY - 55, 56, 102, 0x1A253A).setDepth(3);
        this.add.text(x, floorY - 125, 'DECK 12 EXIT', {
            fontSize: '8px', fontFamily: '"Press Start 2P"', fill: '#FFD700', backgroundColor: '#000000', padding: { x: 4, y: 3 }
        }).setOrigin(0.5).setDepth(5);

        const sign = this.add.text(x, floorY - 142, '▼ EXIT TO SHIP ▼', {
            fontSize: '7px', fontFamily: '"Press Start 2P"', fill: '#FFFFFF', backgroundColor: '#B80000', padding: { x: 4, y: 2 }
        }).setOrigin(0.5).setDepth(5).setInteractive({ useHandCursor: true });
        door.on('pointerdown', () => this.exitToShip());
        sign.on('pointerdown', () => this.exitToShip());
    }

    createObstacleStation(x, floorY) {
        // Giant Inflatable Arch
        const arch = this.add.rectangle(x, floorY - 70, 130, 140, 0xD01000).setDepth(3).setStrokeStyle(4, 0xF8B800).setInteractive({ useHandCursor: true });
        this.add.rectangle(x, floorY - 70, 96, 120, 0x110202).setDepth(3);
        
        this.add.text(x, floorY - 130, '★ OBSTACLE COURSE ★', {
            fontSize: '8px', fontFamily: '"Press Start 2P"', fill: '#FFD700', backgroundColor: '#000000', padding: { x: 6, y: 3 }
        }).setOrigin(0.5).setDepth(5);

        this.add.text(x, floorY - 95, 'INCREDIBLES TIMED RUN\nBEAT DASH\'S RECORD!', {
            fontSize: '6px', fontFamily: '"Press Start 2P"', fill: '#00FF00', align: 'center', backgroundColor: '#000', padding: 3
        }).setOrigin(0.5).setDepth(5);

        const btn = this.add.text(x, floorY - 60, '[ ENTER COURSE ]', {
            fontSize: '7px', fontFamily: '"Press Start 2P"', fill: '#FFFFFF', backgroundColor: '#D01000', padding: { x: 6, y: 3 }
        }).setOrigin(0.5).setDepth(5).setInteractive({ useHandCursor: true });
        btn.on('pointerdown', () => this.launchObstacleCourse());
        arch.on('pointerdown', () => this.launchObstacleCourse());

        // Inflatable cones
        this.add.triangle(x - 65, floorY - 15, 0, 30, 15, 0, 30, 30, 0xF8B800).setDepth(4);
        this.add.triangle(x + 65, floorY - 15, 0, 30, 15, 0, 30, 30, 0xF8B800).setDepth(4);
    }

    createLeaderboardStation(x, floorY) {
        // CRT Display
        this.add.rectangle(x, floorY - 80, 170, 115, 0x0A0A1E).setDepth(3).setStrokeStyle(3, 0x00FFFF);
        this.add.text(x, floorY - 128, '★ HALL OF HEROES ★', {
            fontSize: '8px', fontFamily: '"Press Start 2P"', fill: '#00FFFF', stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(5);

        this.leaderboardTexts = [];
        for (let i = 0; i < 3; i++) {
            const txt = this.add.text(x, floorY - 105 + (i * 18), '', {
                fontSize: '6px', fontFamily: '"Press Start 2P"', fill: '#FFFFFF'
            }).setOrigin(0.5).setDepth(5);
            this.leaderboardTexts.push(txt);
        }
        this.refreshLeaderboard();

        // NPC Dash stretching near the board
        this.dashNPC = this.add.sprite(x + 40, floorY + 25, 'npc_tourist_idle').setDepth(Math.round(floorY + 25)).setTint(0xFF3333);
        this.add.text(x + 40, floorY - 5, 'DASH', {
            fontSize: '7px', fontFamily: '"Press Start 2P"', fill: '#FFFF00', backgroundColor: '#000', padding: 2
        }).setOrigin(0.5).setDepth(Math.round(floorY + 25) + 1);

        // Speech bubble for Dash
        this.dashBubble = this.add.text(x + 40, floorY - 25, 'TRY TO BEAT MY RECORD!', {
            fontSize: '6px', fontFamily: '"Press Start 2P"', fill: '#000', backgroundColor: '#FFF', padding: 4
        }).setOrigin(0.5).setDepth(3000).setVisible(false);
    }

    refreshLeaderboard() {
        if (!this.leaderboardTexts || this.leaderboardTexts.length < 3) return;
        const scores = getHeroZoneScores();
        const records = [
            `COURSE: ${scores.obstacleTime}s (${scores.obstacleHolder})`,
            `HOOPS:  ${scores.basketballScore} PTS (${scores.basketballHolder})`,
            `HOCKEY: ${scores.airHockeyWins} WINS`
        ];
        records.forEach((rec, idx) => {
            if (this.leaderboardTexts[idx]) {
                this.leaderboardTexts[idx].setText(rec);
            }
        });
    }

    createAirHockeyStation(x, floorY) {
        const table = this.add.rectangle(x, floorY - 10, 130, 65, 0x0055AA).setDepth(Math.round(floorY - 10)).setStrokeStyle(3, 0xFFFFFF);
        this.add.rectangle(x, floorY - 10, 116, 52, 0x0088FF).setDepth(Math.round(floorY - 10));
        this.add.rectangle(x, floorY - 10, 2, 52, 0xFF0000).setDepth(Math.round(floorY - 10) + 1);
        this.add.circle(x, floorY - 10, 12).setStrokeStyle(2, 0xFFFFFF).setDepth(Math.round(floorY - 10) + 1);

        this.add.text(x, floorY - 60, '★ AIR HOCKEY ★', {
            fontSize: '8px', fontFamily: '"Press Start 2P"', fill: '#00FFFF', backgroundColor: '#000044', padding: { x: 6, y: 3 }
        }).setOrigin(0.5).setDepth(5);

        const btn = this.add.text(x, floorY - 80, '[ PLAY AIR HOCKEY ]', {
            fontSize: '7px', fontFamily: '"Press Start 2P"', fill: '#FFFFFF', backgroundColor: '#0055AA', padding: { x: 6, y: 3 }
        }).setOrigin(0.5).setDepth(5).setInteractive({ useHandCursor: true });
        btn.on('pointerdown', () => this.launchAirHockey());
        table.setInteractive({ useHandCursor: true });
        table.on('pointerdown', () => this.launchAirHockey());
    }

    createBasketballStation(x, floorY) {
        const booth = this.add.rectangle(x, floorY - 65, 120, 130, 0x333333).setDepth(3).setStrokeStyle(3, 0xE65C00).setInteractive({ useHandCursor: true });
        this.add.rectangle(x - 30, floorY - 95, 45, 35, 0xFFFFFF).setDepth(4).setStrokeStyle(2, 0xD01000);
        this.add.rectangle(x + 30, floorY - 95, 45, 35, 0xFFFFFF).setDepth(4).setStrokeStyle(2, 0xD01000);
        this.add.rectangle(x - 30, floorY - 80, 24, 4, 0xE65C00).setDepth(5);
        this.add.rectangle(x + 30, floorY - 80, 24, 4, 0xE65C00).setDepth(5);

        this.add.text(x, floorY - 135, 'BASKETBALL SHOOTOUT', {
            fontSize: '8px', fontFamily: '"Press Start 2P"', fill: '#F8B800', backgroundColor: '#000', padding: { x: 6, y: 3 }
        }).setOrigin(0.5).setDepth(5);

        const btn = this.add.text(x, floorY - 50, '[ PLAY SHOOTOUT ]', {
            fontSize: '7px', fontFamily: '"Press Start 2P"', fill: '#FFFFFF', backgroundColor: '#E65C00', padding: { x: 6, y: 3 }
        }).setOrigin(0.5).setDepth(5).setInteractive({ useHandCursor: true });
        btn.on('pointerdown', () => this.launchBasketball());
        booth.on('pointerdown', () => this.launchBasketball());
    }

    createMobileControls() {
        const W = this.scale.width;
        const H = this.scale.height;

        this.touchContainer = this.add.container(0, 0).setScrollFactor(0).setDepth(1500);

        const btnL = this.add.rectangle(45, H - 50, 45, 45, 0x000, 0.6).setStrokeStyle(2, 0xFFF).setInteractive();
        const txtL = this.add.text(45, H - 50, '◄', { fontSize: '18px', fill: '#FFF' }).setOrigin(0.5);
        btnL.on('pointerdown', () => { this.touchMoveDir = -1; });
        btnL.on('pointerup', () => { this.touchMoveDir = 0; });
        btnL.on('pointerout', () => { this.touchMoveDir = 0; });

        const btnR = this.add.rectangle(105, H - 50, 45, 45, 0x000, 0.6).setStrokeStyle(2, 0xFFF).setInteractive();
        const txtR = this.add.text(105, H - 50, '►', { fontSize: '18px', fill: '#FFF' }).setOrigin(0.5);
        btnR.on('pointerdown', () => { this.touchMoveDir = 1; });
        btnR.on('pointerup', () => { this.touchMoveDir = 0; });
        btnR.on('pointerout', () => { this.touchMoveDir = 0; });

        const btnU = this.add.rectangle(75, H - 100, 45, 40, 0x000, 0.6).setStrokeStyle(2, 0xFFF).setInteractive();
        const txtU = this.add.text(75, H - 100, '▲', { fontSize: '18px', fill: '#FFF' }).setOrigin(0.5);
        btnU.on('pointerdown', () => { this.touchMoveDepth = -1; });
        btnU.on('pointerup', () => { this.touchMoveDepth = 0; });
        btnU.on('pointerout', () => { this.touchMoveDepth = 0; });

        const btnD = this.add.rectangle(75, H - 10, 45, 40, 0x000, 0.6).setStrokeStyle(2, 0xFFF).setInteractive();
        const txtD = this.add.text(75, H - 10, '▼', { fontSize: '18px', fill: '#FFF' }).setOrigin(0.5);
        btnD.on('pointerdown', () => { this.touchMoveDepth = 1; });
        btnD.on('pointerup', () => { this.touchMoveDepth = 0; });
        btnD.on('pointerout', () => { this.touchMoveDepth = 0; });

        const btnAct = this.add.rectangle(W - 65, H - 55, 80, 50, 0xD01000, 0.8).setStrokeStyle(2, 0xF8B800).setInteractive();
        const txtAct = this.add.text(W - 65, H - 55, 'ENTER', { fontSize: '9px', fontFamily: '"Press Start 2P"', fill: '#FFF' }).setOrigin(0.5);
        btnAct.on('pointerdown', () => this.handleStationAction());

        this.touchContainer.add([btnL, txtL, btnR, txtR, btnU, txtU, btnD, txtD, btnAct, txtAct]);
    }

    tryJump() {
        if (this.isJumping) return;
        this.isJumping = true;
        this.jumpV = 320;
        this.jumpZ = 1;
        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
            retroArcadeAudio.play('jump');
        }
    }

    exitToShip() {
        if (this.isExiting) return;
        this.isExiting = true;
        if (this._cleanWindowListeners) {
            this._cleanWindowListeners();
        }
        if (this.gameScene && this.gameScene.scene) {
            this.gameScene.scene.setVisible(true);
            this.gameScene.scene.wake();
            this.gameScene.scene.resume();
        }
        this.scene.stop('HeroZoneScene');

        if (this.gameScene && this.gameScene.player && this.gameScene.player.body) {
            const returnGroundY = 975;
            this.gameScene.jumpZ = 0;
            this.gameScene.jumpV = 0;
            this.gameScene.isJumping = false;
            this.gameScene.currentStair = null;

            this.gameScene.player.x = 2000;
            this.gameScene.groundY = returnGroundY;
            this.gameScene.player.y = returnGroundY;
            this.gameScene.player.setVisible(true);
            this.gameScene.player.setAlpha(1);
            this.gameScene.player.setActive(true);
            this.gameScene.player.setDepth(Math.round(returnGroundY));
            this.gameScene.player.body.reset(2000, returnGroundY);
            this.gameScene.player.body.setSize(22, 16);
            this.gameScene.player.body.setOffset(5, 32);

            if (this.gameScene.playerShadow) {
                this.gameScene.playerShadow.setPosition(2000, returnGroundY + 18);
                this.gameScene.playerShadow.setDepth(returnGroundY - 1);
                this.gameScene.playerShadow.setVisible(true);
            }
        }
        if (this.gameScene) {
            this.gameScene.nearHeroZone = false;
            if (this.gameScene.heroZonePromptText) {
                this.gameScene.heroZonePromptText.setVisible(false);
            }
        }
    }

    launchObstacleCourse() {
        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
            retroArcadeAudio.play('powerup');
        }
        if (this.input && this.input.keyboard) this.input.keyboard.resetKeys();
        this.scene.setVisible(false);
        this.scene.pause('HeroZoneScene');
        this.scene.launch('ObstacleCourseScene', { heroZone: this });
    }

    launchAirHockey() {
        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
            retroArcadeAudio.play('powerup');
        }
        if (this.input && this.input.keyboard) this.input.keyboard.resetKeys();
        this.scene.setVisible(false);
        this.scene.pause('HeroZoneScene');
        this.scene.launch('AirHockeyScene', { heroZone: this });
    }

    launchBasketball() {
        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
            retroArcadeAudio.play('powerup');
        }
        if (this.input && this.input.keyboard) this.input.keyboard.resetKeys();
        this.scene.setVisible(false);
        this.scene.pause('HeroZoneScene');
        this.scene.launch('BasketballShootoutScene', { heroZone: this });
    }

    handleStationAction() {
        if (this.nearExit) {
            this.exitToShip();
        } else if (this.nearObstacleCourse) {
            this.launchObstacleCourse();
        } else if (this.nearAirHockey) {
            this.launchAirHockey();
        } else if (this.nearBasketball) {
            this.launchBasketball();
        }
    }

    update(time, delta) {
        if (this.keysWASD.esc && this.keysWASD.esc.isDown) {
            this.exitToShip();
            return;
        }

        const dt = delta * 0.001;

        // Player Controls (2.5D Movement)
        const isLeft = (this.cursors.left && this.cursors.left.isDown) || 
                       (this.keysWASD.left && this.keysWASD.left.isDown) || 
                       this.touchMoveDir === -1;

        const isRight = (this.cursors.right && this.cursors.right.isDown) || 
                        (this.keysWASD.right && this.keysWASD.right.isDown) || 
                        this.touchMoveDir === 1;

        const isUp = (this.cursors.up && this.cursors.up.isDown) || 
                     (this.keysWASD.up && this.keysWASD.up.isDown) || 
                     this.touchMoveDepth === -1;

        const isDown = (this.cursors.down && this.cursors.down.isDown) || 
                       (this.keysWASD.down && this.keysWASD.down.isDown) || 
                       this.touchMoveDepth === 1;

        let moveX = 0;
        let moveY = 0;

        if (isLeft && isRight) {
            const leftTime = Math.max((this.cursors.left ? this.cursors.left.timeDown : 0), (this.keysWASD.left ? this.keysWASD.left.timeDown : 0));
            const rightTime = Math.max((this.cursors.right ? this.cursors.right.timeDown : 0), (this.keysWASD.right ? this.keysWASD.right.timeDown : 0));
            if (rightTime >= leftTime) {
                moveX = 1;
                this.player.setFlipX(false);
            } else {
                moveX = -1;
                this.player.setFlipX(true);
            }
        } else if (isLeft) {
            moveX = -1;
            this.player.setFlipX(true);
        } else if (isRight) {
            moveX = 1;
            this.player.setFlipX(false);
        }

        if (isUp && isDown) {
            const upTime = Math.max((this.cursors.up ? this.cursors.up.timeDown : 0), (this.keysWASD.up ? this.keysWASD.up.timeDown : 0));
            const downTime = Math.max((this.cursors.down ? this.cursors.down.timeDown : 0), (this.keysWASD.down ? this.keysWASD.down.timeDown : 0));
            moveY = (downTime >= upTime) ? 1 : -1;
        } else if (isUp) {
            moveY = -1;
        } else if (isDown) {
            moveY = 1;
        }

        let vx = moveX * this.playerSpeed;
        let vy = moveY * (this.playerSpeed * 0.6);
        if (moveX !== 0 && moveY !== 0) {
            vx *= 0.7071;
            vy *= 0.7071;
        }

        // Jump Handling
        if ((Phaser.Input.Keyboard.JustDown(this.keysWASD.space) || Phaser.Input.Keyboard.JustDown(this.cursors.space)) && !this.isJumping) {
            this.tryJump();
        }

        if (this.isJumping) {
            this.jumpZ += this.jumpV * dt;
            this.jumpV -= 750 * dt;
            if (this.jumpZ <= 0) {
                this.jumpZ = 0;
                this.jumpV = 0;
                this.isJumping = false;
            }
        }

        // Apply 2.5D coordinates
        this.player.x += vx * dt;
        this.player.x = Phaser.Math.Clamp(this.player.x, 70, this.roomW - 70);

        this.groundY += vy * dt;
        this.groundY = Phaser.Math.Clamp(this.groundY, this.floorY - 5, this.roomH - 25);

        this.player.y = this.groundY - this.jumpZ;
        this.player.body.reset(this.player.x, this.player.y);
        this.player.setDepth(Math.round(this.groundY));
        this.playerShadow.setPosition(this.player.x, this.groundY + 16);

        // Walking animation
        const charId = this.gameScene ? this.gameScene.selectedCharacter : 'riley';
        if (moveX !== 0 || moveY !== 0) {
            this.player.anims.play(charId + '_walk', true);
        } else {
            this.player.anims.play(charId + '_idle', true);
        }

        // ----------------------------------------------------
        // STATION PROXIMITY CHECKS
        // ----------------------------------------------------
        const px = this.player.x;
        const gy = this.groundY;

        this.nearExit = (px < 180 && gy < this.floorY + 50);
        this.nearObstacleCourse = (Math.abs(px - 440) < 70 && gy < this.floorY + 55);
        this.nearAirHockey = (Math.abs(px - 1060) < 75 && Math.abs(gy - (this.floorY + 15)) < 45);
        this.nearBasketball = (Math.abs(px - 1380) < 75 && gy < this.floorY + 55);

        // Dash NPC proximity speech bubble
        const nearDash = (Math.abs(px - 790) < 65 && Math.abs(gy - (this.floorY + 25)) < 45);
        if (this.dashBubble) {
            this.dashBubble.setVisible(nearDash);
        }

        // Prompt text positioning and visibility
        let activePrompt = '';
        if (this.nearExit) {
            activePrompt = '[ ENTER: EXIT TO DECK 12 ]';
        } else if (this.nearObstacleCourse) {
            activePrompt = '[ ENTER: START OBSTACLE COURSE ]';
        } else if (this.nearAirHockey) {
            activePrompt = '[ ENTER: PLAY AIR HOCKEY ]';
        } else if (this.nearBasketball) {
            activePrompt = '[ ENTER: PLAY BASKETBALL ]';
        }

        if (activePrompt !== '') {
            this.promptText.setText(activePrompt);
            this.promptText.setPosition(this.player.x, this.player.y - 45);
            this.promptText.setVisible(true);

            if (Phaser.Input.Keyboard.JustDown(this.keysWASD.enter)) {
                this.handleStationAction();
            }
        } else {
            this.promptText.setVisible(false);
        }
    }
}

