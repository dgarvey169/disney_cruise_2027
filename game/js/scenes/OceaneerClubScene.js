// =========================================================================
// DISNEY'S OCEANEER CLUB (DECK 2 CENTRAL ROTUNDA HUB - ISSUE #45)
// Available to ALL playable characters (Riley & Amelia)
// =========================================================================

class OceaneerClubScene extends Phaser.Scene {
    constructor() {
        super({ key: 'OceaneerClubScene' });
    }

    init(data) {
        this.gameScene = data ? data.gameScene : null;
        this.fromStation = (data && data.fromStation) ? data.fromStation : 180;
        this.groundY = 445;
        this.jumpZ = 0;
        this.jumpV = 0;
        this.isJumping = false;
        this.isExiting = false;
        this.playerSpeed = 185;

        // Station proximity flags
        this.nearExit = false;
        this.nearRalphSlide = false;
        this.nearImagineering = false;
        this.nearMarvel = false;
        this.nearStarWars = false;
        this.nearFairytale = false;

        // Mobile touch controls state
        this.mobileInput = { left: false, right: false, up: false, down: false, jump: false };
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
        const roomW = Math.max(2100, W);
        this.roomW = roomW;
        this.roomH = roomH;

        const floorH = Math.max(145, Math.round(roomH * 0.25));
        const floorY = roomH - floorH;
        this.floorY = floorY;
        this.floorH = floorH;
        this.groundY = floorY + 38;

        this.physics.world.setBounds(0, 0, roomW, roomH);

        // 0. Solid background
        this.add.rectangle(0, 0, 10000, 10000, 0x080D24).setOrigin(0.5).setDepth(0);

        // 1. Rotunda Background & Flooring
        this.createTextures();
        this.add.tileSprite(roomW / 2, floorY / 2, roomW, floorY, 'oc_wall_pattern').setDepth(1);
        this.add.tileSprite(roomW / 2, floorY + (floorH / 2), roomW, floorH, 'oc_floor_carpet').setDepth(2);

        // Gold & Nautical Cyan Rotunda Curb
        const curb = this.add.graphics().setDepth(3);
        curb.fillStyle(0xF8B800, 1);
        curb.fillRect(0, floorY - 4, roomW, 4);
        curb.fillStyle(0x00E5FF, 0.85);
        curb.fillRect(0, floorY, roomW, 2);

        // Starry Pixie Dust Ceiling Lights & Nautical Arches
        for (let tx = 100; tx < roomW; tx += 220) {
            this.add.rectangle(tx, 16, 170, 12, 0x162447).setDepth(4).setStrokeStyle(1, 0xFFD700);
            const starLight = this.add.circle(tx, 26, 5, 0xFFF3B0).setDepth(4);
            this.tweens.add({
                targets: starLight,
                alpha: 0.4,
                duration: 700 + (tx % 500),
                yoyo: true,
                repeat: -1
            });
        }

        // Fixed Top Marquee Banner
        this.add.rectangle(W / 2, 30, 420, 34, 0x050C24, 0.92)
            .setScrollFactor(0).setDepth(1900).setStrokeStyle(2, 0xFFD700);
        this.add.text(W / 2, 30, "★ DISNEY'S OCEANEER CLUB (DECK 2) ★", {
            fontSize: '10px', fontFamily: '"Press Start 2P", monospace', fill: '#FFD700', stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5).setScrollFactor(0).setDepth(1901);

        // ----------------------------------------------------
        // CENTRAL ROTUNDA & 5 THEMED WING PORTALS
        // ----------------------------------------------------

        // Station 1: Deck 2 Elevator / Ship Exit (x = 140)
        this.createExitStation(140, floorY);

        // Station 2: Wreck-It Ralph Slide & Entrance (x = 440)
        this.createRalphSlideStation(440, floorY);

        // Station 3: Walt Disney Imagineering Lab (x = 800)
        this.createImagineeringStation(800, floorY);

        // Central Rotunda Stage & Explorer Passport Board (x = 1020)
        this.createRotundaPassportBoard(1020, floorY);

        // Station 4: Marvel Super Hero Academy (x = 1280)
        this.createMarvelStation(1280, floorY);

        // Station 5: Star Wars: Cargo Bay (x = 1620)
        this.createStarWarsStation(1620, floorY);

        // Station 6: Fairytale Hall (x = 1940)
        this.createFairytaleStation(1940, floorY);

        // ----------------------------------------------------
        // 2.5D PLAYER (Supports BOTH Riley & Amelia)
        // ----------------------------------------------------
        const charData = getActiveCharacterData(this.gameScene);
        this.charData = charData;

        const spawnX = (data && data.fromStation) ? data.fromStation : (this.fromStation || 180);
        this.player = this.physics.add.sprite(spawnX, this.groundY, charData.idleKey)
            .setDepth(Math.round(this.groundY));
        this.player.body.allowGravity = false;
        this.player.body.setSize(22, 16);
        this.player.body.setOffset(5, charData.bodyOffsetY);

        // Foot Shadow
        this.playerShadow = this.add.ellipse(spawnX, this.groundY + 16, 26, 10, 0x000000, 0.45)
            .setDepth(Math.round(this.groundY) - 1);

        // Camera Follow
        this.cameras.main.setBounds(0, 0, roomW, roomH);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        // Floating Station Action Prompt
        this.promptText = this.add.text(spawnX, this.groundY - 55, '', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#FFFF00',
            backgroundColor: '#000000',
            padding: { x: 8, y: 5 },
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(2000).setVisible(false).setInteractive({ useHandCursor: true });
        this.promptText.on('pointerdown', () => this.handleStationAction());

        // Keyboard Setup
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
            if (this.resetJoystick) {
                this.resetJoystick();
            } else {
                this.mobileInput = { left: false, right: false, up: false, down: false, jump: false };
            }
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

        // Standalone Top-Right Exit Button
        this.add.text(W - 75, 30, '[ EXIT ]', {
            fontSize: '10px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#FF5555',
            backgroundColor: '#000000',
            padding: { x: 8, y: 6 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(2000).setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.exitToShip());

        // Floating Joystick & Touch Controls for Mobile
        const isTouch = !this.sys.game.device.os.desktop || this.sys.game.device.input.touch;
        if (isTouch) {
            this.createMobileControls();
        }

        // Resume handler when returning from any of the 5 themed wings
        this.events.on('resume', () => {
            if (this.input && this.input.keyboard) {
                this.input.keyboard.resetKeys();
            }
            resetKeyInputs();
            if (this.game && this.game.canvas) {
                this.game.canvas.focus();
            }
            if (this.resetJoystick) this.resetJoystick();
            this.refreshPassportBoard();
        });
    }

    createTextures() {
        if (!this.textures.exists('oc_wall_pattern')) {
            const g = this.add.graphics();
            g.fillStyle(0x101C3D, 1);
            g.fillRect(0, 0, 64, 64);
            g.lineStyle(2, 0x1D3166, 1);
            g.strokeRect(0, 0, 64, 64);
            g.fillStyle(0xFFD700, 0.35);
            g.fillCircle(32, 20, 4);
            g.fillCircle(26, 15, 2.5);
            g.fillCircle(38, 15, 2.5);
            g.generateTexture('oc_wall_pattern', 64, 64);
            g.destroy();
        }

        if (!this.textures.exists('oc_floor_carpet')) {
            const g = this.add.graphics();
            g.fillStyle(0x142858, 1);
            g.fillRect(0, 0, 48, 48);
            g.lineStyle(1, 0x1E3A7A, 1);
            g.strokeRect(0, 0, 48, 48);
            g.fillStyle(0xF8B800, 0.45);
            g.fillRect(22, 22, 4, 4);
            g.fillStyle(0x58B8F8, 0.35);
            g.fillRect(10, 10, 2, 2);
            g.fillRect(36, 36, 2, 2);
            g.generateTexture('oc_floor_carpet', 48, 48);
            g.destroy();
        }
    }

    createExitStation(x, floorY) {
        this.add.rectangle(x, floorY - 58, 72, 116, 0x0A152C).setDepth(3).setStrokeStyle(3, 0xFFD700);
        this.add.rectangle(x - 16, floorY - 58, 30, 106, 0x263B66).setDepth(4);
        this.add.rectangle(x + 16, floorY - 58, 30, 106, 0x263B66).setDepth(4);
        this.add.text(x, floorY - 128, 'MIDSHIP ELEVATOR', {
            fontSize: '7px', fontFamily: '"Press Start 2P", monospace', fill: '#FFD700', backgroundColor: '#000000', padding: { x: 4, y: 3 }
        }).setOrigin(0.5).setDepth(5);

        const btn = this.add.text(x, floorY - 146, '▲ UPPER DECKS ▲', {
            fontSize: '7px', fontFamily: '"Press Start 2P", monospace', fill: '#FFFFFF', backgroundColor: '#0055AA', padding: { x: 5, y: 3 }
        }).setOrigin(0.5).setDepth(5).setInteractive({ useHandCursor: true });
        btn.on('pointerdown', () => this.exitToShip());
    }

    createRalphSlideStation(x, floorY) {
        // Peppermint-striped archway & spiral slide preview
        this.add.rectangle(x, floorY - 72, 148, 144, 0x4A0E2E).setDepth(3).setStrokeStyle(4, 0xFF3377);
        const slideG = this.add.graphics().setDepth(4);
        for (let i = 0; i < 6; i++) {
            slideG.fillStyle(i % 2 === 0 ? 0xFF2255 : 0xFFFFFF, 1);
            slideG.fillRect(x - 45 + (i * 15), floorY - 110 + (i * 10), 16, 28);
        }
        // Giant macaron accents
        slideG.fillStyle(0x58F8B8, 1);
        slideG.fillEllipse(x - 52, floorY - 18, 28, 16);
        slideG.fillStyle(0xFF88CC, 1);
        slideG.fillEllipse(x + 52, floorY - 18, 28, 16);

        this.add.text(x, floorY - 134, '★ WRECK-IT RALPH SLIDE ★', {
            fontSize: '7px', fontFamily: '"Press Start 2P", monospace', fill: '#FF88CC', backgroundColor: '#000000', padding: { x: 5, y: 3 }
        }).setOrigin(0.5).setDepth(5);

        this.add.text(x, floorY - 105, 'SUGAR RUSH PEPPERMINT CHUTE\n& VANELLOPE ENTRANCE', {
            fontSize: '6px', fontFamily: '"Press Start 2P", monospace', fill: '#FFFFFF', align: 'center', backgroundColor: '#2A0518', padding: 3
        }).setOrigin(0.5).setDepth(5);

        const btn = this.add.text(x, floorY - 52, '[ ENTER SLIDE WING ]', {
            fontSize: '7px', fontFamily: '"Press Start 2P", monospace', fill: '#FFFFFF', backgroundColor: '#D81860', padding: { x: 6, y: 4 }
        }).setOrigin(0.5).setDepth(6).setInteractive({ useHandCursor: true });
        btn.on('pointerdown', () => this.launchWing('RalphSlideWingScene', x));
    }

    createImagineeringStation(x, floorY) {
        // Blueprint Lab Archway
        this.add.rectangle(x, floorY - 72, 152, 144, 0x0B2B5B).setDepth(3).setStrokeStyle(4, 0x00E5FF);
        this.add.rectangle(x, floorY - 72, 126, 118, 0x061A3A).setDepth(3).setStrokeStyle(1, 0x58B8F8);

        this.add.text(x, floorY - 134, '★ IMAGINEERING LAB ★', {
            fontSize: '7px', fontFamily: '"Press Start 2P", monospace', fill: '#00E5FF', backgroundColor: '#000000', padding: { x: 5, y: 3 }
        }).setOrigin(0.5).setDepth(5);

        this.add.text(x, floorY - 102, 'COASTER SIMULATOR, MAQUETTES\n& FIGMENT 3D PRINTER', {
            fontSize: '6px', fontFamily: '"Press Start 2P", monospace', fill: '#A0E8FF', align: 'center', backgroundColor: '#041228', padding: 3
        }).setOrigin(0.5).setDepth(5);

        const btn = this.add.text(x, floorY - 52, '[ ENTER LAB WING ]', {
            fontSize: '7px', fontFamily: '"Press Start 2P", monospace', fill: '#000000', backgroundColor: '#00E5FF', padding: { x: 6, y: 4 }
        }).setOrigin(0.5).setDepth(6).setInteractive({ useHandCursor: true });
        btn.on('pointerdown', () => this.launchWing('ImagineeringLabWingScene', x));
    }

    createRotundaPassportBoard(x, floorY) {
        // Central Rotunda Passport & Wing Status CRT
        this.add.rectangle(x, floorY - 82, 195, 128, 0x070F26).setDepth(3).setStrokeStyle(3, 0xFFD700);
        this.add.text(x, floorY - 136, '★ OCEANEER PASSPORT ★', {
            fontSize: '7px', fontFamily: '"Press Start 2P", monospace', fill: '#FFD700', backgroundColor: '#000000', padding: { x: 4, y: 2 }
        }).setOrigin(0.5).setDepth(5);

        this.passportTexts = [];
        for (let i = 0; i < 5; i++) {
            const t = this.add.text(x, floorY - 114 + (i * 19), '', {
                fontSize: '6px', fontFamily: '"Press Start 2P", monospace', fill: '#FFFFFF'
            }).setOrigin(0.5).setDepth(5);
            this.passportTexts.push(t);
        }
        this.refreshPassportBoard();

        // Counselor NPC in Rotunda
        this.counselorNPC = this.add.sprite(x + 65, floorY + 22, 'npc_tourist_idle')
            .setDepth(Math.round(floorY + 22)).setTint(0x58D8FF);
        this.add.text(x + 65, floorY - 8, 'COUNSELOR', {
            fontSize: '6px', fontFamily: '"Press Start 2P", monospace', fill: '#FFD700', backgroundColor: '#000000', padding: 2
        }).setOrigin(0.5).setDepth(Math.round(floorY + 22) + 1);

        this.counselorBubble = this.add.text(x + 65, floorY - 28, 'EXPLORE ALL 5 WINGS TO EARN YOUR BADGES!', {
            fontSize: '6px', fontFamily: '"Press Start 2P", monospace', fill: '#000000', backgroundColor: '#FFFFFF', padding: 4
        }).setOrigin(0.5).setDepth(3000).setVisible(false);
    }

    refreshPassportBoard() {
        if (!this.passportTexts || this.passportTexts.length < 5) return;
        const p = getOceaneerProgress();
        const rows = [
            `${p.ralphSlideBadge ? '★' : '☆'} SLIDE: ${p.ralphSlideScore} PTS`,
            `${p.imagineeringBadge ? '★' : '☆'} LAB:   ${p.imagineeringCoasterScore} PTS`,
            `${p.marvelBadge ? '★' : '☆'} MARVEL:${p.marvelTrainingScore} PTS`,
            `${p.starWarsBadge ? '★' : '☆'} CARGO: ${p.cargoBayCreaturesTended}/4 CRITTERS`,
            `${p.fairytaleBadge ? '★' : '☆'} ROYAL: ${p.rapunzelLanterns + p.belleStoriesCompleted + p.sommerhusSnowgies} MAGIC`
        ];
        rows.forEach((txt, idx) => {
            if (this.passportTexts[idx]) {
                this.passportTexts[idx].setText(txt);
                const earned = txt.startsWith('★');
                this.passportTexts[idx].setFill(earned ? '#58F898' : '#D0D8E8');
            }
        });
    }

    createMarvelStation(x, floorY) {
        // Sleek Avengers Portal
        this.add.rectangle(x, floorY - 72, 152, 144, 0x1A1E2E).setDepth(3).setStrokeStyle(4, 0xE83818);
        this.add.rectangle(x, floorY - 72, 126, 118, 0x0F1320).setDepth(3).setStrokeStyle(2, 0x7858F8);

        this.add.text(x, floorY - 134, '★ MARVEL HERO ACADEMY ★', {
            fontSize: '7px', fontFamily: '"Press Start 2P", monospace', fill: '#FFD700', backgroundColor: '#B81800', padding: { x: 5, y: 3 }
        }).setOrigin(0.5).setDepth(5);

        this.add.text(x, floorY - 102, 'NANOTECH SUIT CUSTOMIZER &\nAVENGERS: MISSION TRAINING', {
            fontSize: '6px', fontFamily: '"Press Start 2P", monospace', fill: '#FFFFFF', align: 'center', backgroundColor: '#000000', padding: 3
        }).setOrigin(0.5).setDepth(5);

        const btn = this.add.text(x, floorY - 52, '[ ENTER MARVEL WING ]', {
            fontSize: '7px', fontFamily: '"Press Start 2P", monospace', fill: '#FFFFFF', backgroundColor: '#D02010', padding: { x: 6, y: 4 }
        }).setOrigin(0.5).setDepth(6).setInteractive({ useHandCursor: true });
        btn.on('pointerdown', () => this.launchWing('MarvelAcademyWingScene', x));
    }

    createStarWarsStation(x, floorY) {
        // Starship Cargo Bay Blast Door
        this.add.rectangle(x, floorY - 72, 152, 144, 0x262420).setDepth(3).setStrokeStyle(4, 0xF89800);
        this.add.rectangle(x, floorY - 72, 126, 118, 0x161412).setDepth(3).setStrokeStyle(2, 0x888888);

        this.add.text(x, floorY - 134, '★ STAR WARS: CARGO BAY ★', {
            fontSize: '7px', fontFamily: '"Press Start 2P", monospace', fill: '#FFE81F', backgroundColor: '#000000', padding: { x: 5, y: 3 }
        }).setOrigin(0.5).setDepth(5);

        this.add.text(x, floorY - 102, 'PORG, LOTH-CAT, WORRT, DIANOGA\n& REY / CHEWBACCA CREW', {
            fontSize: '6px', fontFamily: '"Press Start 2P", monospace', fill: '#FFD890', align: 'center', backgroundColor: '#000000', padding: 3
        }).setOrigin(0.5).setDepth(5);

        const btn = this.add.text(x, floorY - 52, '[ ENTER CARGO BAY ]', {
            fontSize: '7px', fontFamily: '"Press Start 2P", monospace', fill: '#000000', backgroundColor: '#F89800', padding: { x: 6, y: 4 }
        }).setOrigin(0.5).setDepth(6).setInteractive({ useHandCursor: true });
        btn.on('pointerdown', () => this.launchWing('StarWarsCargoWingScene', x));
    }

    createFairytaleStation(x, floorY) {
        // Royal Fairytale Hall Archway
        this.add.rectangle(x, floorY - 72, 152, 144, 0x2E1442).setDepth(3).setStrokeStyle(4, 0xFFD700);
        this.add.rectangle(x, floorY - 72, 126, 118, 0x1D0A2B).setDepth(3).setStrokeStyle(2, 0xFF88D8);

        this.add.text(x, floorY - 134, '★ FAIRYTALE HALL ★', {
            fontSize: '7px', fontFamily: '"Press Start 2P", monospace', fill: '#FFD700', backgroundColor: '#3A0A4E', padding: { x: 5, y: 3 }
        }).setOrigin(0.5).setDepth(5);

        this.add.text(x, floorY - 102, "RAPUNZEL'S ART, BELLE'S LIBRARY\n& ANNA & ELSA'S SOMMERHUS", {
            fontSize: '6px', fontFamily: '"Press Start 2P", monospace', fill: '#FFE0F8', align: 'center', backgroundColor: '#12041C', padding: 3
        }).setOrigin(0.5).setDepth(5);

        const btn = this.add.text(x, floorY - 52, '[ ENTER FAIRYTALE HALL ]', {
            fontSize: '7px', fontFamily: '"Press Start 2P", monospace', fill: '#FFFFFF', backgroundColor: '#9828B8', padding: { x: 6, y: 4 }
        }).setOrigin(0.5).setDepth(6).setInteractive({ useHandCursor: true });
        btn.on('pointerdown', () => this.launchWing('FairytaleHallWingScene', x));
    }

    createMobileControls() {
        this.input.addPointer(3);

        const JOY_RADIUS = 60;
        const KNOB_RADIUS = 25;
        this.joyBase = this.add.graphics().setScrollFactor(0).setDepth(2500).setAlpha(0.5);
        this.joyKnob = this.add.graphics().setScrollFactor(0).setDepth(2501).setAlpha(0.7);

        this.joyBase.fillStyle(0xffffff, 1);
        this.joyBase.fillCircle(0, 0, JOY_RADIUS);
        this.joyBase.lineStyle(3, 0x888888, 1);
        this.joyBase.strokeCircle(0, 0, JOY_RADIUS);

        this.joyKnob.fillStyle(0x4488ff, 1);
        this.joyKnob.fillCircle(0, 0, KNOB_RADIUS);

        this.joyBase.setVisible(false);
        this.joyKnob.setVisible(false);

        this.joyPointer = null;
        this.joyOrigin = { x: 0, y: 0 };

        this.resetJoystick = () => {
            this.joyPointer = null;
            if (this.joyBase && this.joyBase.active) this.joyBase.setVisible(false);
            if (this.joyKnob && this.joyKnob.active) this.joyKnob.setVisible(false);
            this.mobileInput.left = false;
            this.mobileInput.right = false;
            this.mobileInput.up = false;
            this.mobileInput.down = false;
            this.mobileInput.jump = false;
        };

        const onPointerDown = (ptr) => {
            if (ptr.y < 60 && ptr.x > this.scale.width - 140) return;

            const halfW = this.scale.width / 2;
            if (ptr.x < halfW) {
                if (this.joyPointer === null) {
                    this.joyPointer = ptr;
                    this.joyOrigin.x = ptr.x;
                    this.joyOrigin.y = ptr.y;
                    this.joyBase.setPosition(ptr.x, ptr.y).setVisible(true);
                    this.joyKnob.setPosition(ptr.x, ptr.y).setVisible(true);
                }
            } else {
                this.mobileInput.jump = true;
                this.time.delayedCall(120, () => { this.mobileInput.jump = false; });
            }
        };

        const onPointerMove = (ptr) => {
            if (this.joyPointer && ptr.id === this.joyPointer.id) {
                const dx = ptr.x - this.joyOrigin.x;
                const dy = ptr.y - this.joyOrigin.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const clamped = Math.min(dist, JOY_RADIUS);
                const angle = Math.atan2(dy, dx);
                const kx = this.joyOrigin.x + Math.cos(angle) * clamped;
                const ky = this.joyOrigin.y + Math.sin(angle) * clamped;
                this.joyKnob.setPosition(kx, ky);

                this.mobileInput.left = dx < -15;
                this.mobileInput.right = dx > 15;
                this.mobileInput.up = dy < -15;
                this.mobileInput.down = dy > 15;
            }
        };

        const onPointerUp = (ptr) => {
            if (this.joyPointer && ptr.id === this.joyPointer.id) {
                this.resetJoystick();
            }
        };

        this.input.on('pointerdown', onPointerDown);
        this.input.on('pointermove', onPointerMove);
        this.input.on('pointerup', onPointerUp);

        this.events.once('shutdown', () => {
            this.input.off('pointerdown', onPointerDown);
            this.input.off('pointermove', onPointerMove);
            this.input.off('pointerup', onPointerUp);
            if (this.joyBase) this.joyBase.destroy();
            if (this.joyKnob) this.joyKnob.destroy();
        });
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

    launchWing(wingKey, stationX) {
        if (this.resetJoystick) this.resetJoystick();
        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
            retroArcadeAudio.play('powerup');
        }
        if (this.input && this.input.keyboard) {
            this.input.keyboard.resetKeys();
        }
        if (stationX) {
            this.player.x = stationX;
        }
        this.scene.setVisible(false);
        this.scene.pause('OceaneerClubScene');
        this.scene.launch(wingKey, {
            oceaneerHub: this,
            gameScene: this.gameScene
        });
    }

    exitToShip() {
        if (this.isExiting) return;
        this.isExiting = true;
        if (this.resetJoystick) this.resetJoystick();
        if (this._cleanWindowListeners) {
            this._cleanWindowListeners();
        }
        if (this.gameScene && this.gameScene.scene) {
            this.gameScene.scene.setVisible(true);
            this.gameScene.scene.wake();
            this.gameScene.scene.resume();
        }
        this.scene.stop('OceaneerClubScene');

        if (this.gameScene && this.gameScene.player && this.gameScene.player.body) {
            const charData = getActiveCharacterData(this.gameScene);
            const returnGroundY = (this.gameScene.groundY && this.gameScene.groundY > 1100) ? 1255 : 975;
            this.gameScene.jumpZ = 0;
            this.gameScene.jumpV = 0;
            this.gameScene.isJumping = false;
            this.gameScene.currentStair = null;

            this.gameScene.player.x = 1250;
            this.gameScene.groundY = returnGroundY;
            this.gameScene.player.y = returnGroundY;
            this.gameScene.player.setVisible(true);
            this.gameScene.player.setAlpha(1);
            this.gameScene.player.setActive(true);
            this.gameScene.player.setDepth(Math.round(returnGroundY));
            this.gameScene.player.body.reset(1250, returnGroundY);
            this.gameScene.player.body.setSize(22, 16);
            this.gameScene.player.body.setOffset(5, charData.bodyOffsetY);

            if (this.gameScene.playerShadow) {
                this.gameScene.playerShadow.setPosition(1250, returnGroundY + 18);
                this.gameScene.playerShadow.setDepth(returnGroundY - 1);
                this.gameScene.playerShadow.setVisible(true);
            }
        }
    }

    handleStationAction() {
        if (this.resetJoystick) this.resetJoystick();
        if (this.nearExit) {
            this.exitToShip();
        } else if (this.nearRalphSlide) {
            this.launchWing('RalphSlideWingScene', 440);
        } else if (this.nearImagineering) {
            this.launchWing('ImagineeringLabWingScene', 800);
        } else if (this.nearMarvel) {
            this.launchWing('MarvelAcademyWingScene', 1280);
        } else if (this.nearStarWars) {
            this.launchWing('StarWarsCargoWingScene', 1620);
        } else if (this.nearFairytale) {
            this.launchWing('FairytaleHallWingScene', 1940);
        }
    }

    update(time, delta) {
        if (this.keysWASD.esc && this.keysWASD.esc.isDown) {
            this.exitToShip();
            return;
        }

        const dt = delta * 0.001;

        if (this.joyPointer) {
            if (this.joyPointer.isDown) {
                const JOY_RADIUS = 60;
                const dx = this.joyPointer.x - this.joyOrigin.x;
                const dy = this.joyPointer.y - this.joyOrigin.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const clamped = Math.min(dist, JOY_RADIUS);
                const angle = Math.atan2(dy, dx);
                const kx = this.joyOrigin.x + Math.cos(angle) * clamped;
                const ky = this.joyOrigin.y + Math.sin(angle) * clamped;
                if (this.joyKnob && this.joyKnob.active) {
                    this.joyKnob.setPosition(kx, ky);
                }

                this.mobileInput.left = dx < -15;
                this.mobileInput.right = dx > 15;
                this.mobileInput.up = dy < -15;
                this.mobileInput.down = dy > 15;
            } else {
                this.resetJoystick();
            }
        }

        const isLeft = (this.cursors.left && this.cursors.left.isDown) ||
                       (this.keysWASD.left && this.keysWASD.left.isDown) ||
                       this.mobileInput.left;
        const isRight = (this.cursors.right && this.cursors.right.isDown) ||
                        (this.keysWASD.right && this.keysWASD.right.isDown) ||
                        this.mobileInput.right;
        const isUp = (this.cursors.up && this.cursors.up.isDown) ||
                     (this.keysWASD.up && this.keysWASD.up.isDown) ||
                     this.mobileInput.up;
        const isDown = (this.cursors.down && this.cursors.down.isDown) ||
                       (this.keysWASD.down && this.keysWASD.down.isDown) ||
                       this.mobileInput.down;

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

        const isJump = (Phaser.Input.Keyboard.JustDown(this.keysWASD.space) ||
                        Phaser.Input.Keyboard.JustDown(this.cursors.space) ||
                        this.mobileInput.jump);
        if (isJump && !this.isJumping) {
            this.mobileInput.jump = false;
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

        this.player.x += vx * dt;
        this.player.x = Phaser.Math.Clamp(this.player.x, 70, this.roomW - 70);

        this.groundY += vy * dt;
        this.groundY = Phaser.Math.Clamp(this.groundY, this.floorY - 5, this.roomH - 25);

        this.player.y = this.groundY - this.jumpZ;
        this.player.body.reset(this.player.x, this.player.y);
        this.player.setDepth(Math.round(this.groundY));
        this.playerShadow.setPosition(this.player.x, this.groundY + 16);

        const charData = getActiveCharacterData(this.gameScene);
        if (moveX !== 0 || moveY !== 0) {
            this.player.anims.play(charData.walkAnim, true);
        } else {
            this.player.anims.play(charData.idleAnim, true);
        }

        // Proximity checks for all 6 stations
        const px = this.player.x;
        const gy = this.groundY;

        this.nearExit = (px < 200 && gy < this.floorY + 60);
        this.nearRalphSlide = (Math.abs(px - 440) < 80 && gy < this.floorY + 65);
        this.nearImagineering = (Math.abs(px - 800) < 80 && gy < this.floorY + 65);
        this.nearMarvel = (Math.abs(px - 1280) < 80 && gy < this.floorY + 65);
        this.nearStarWars = (Math.abs(px - 1620) < 80 && gy < this.floorY + 65);
        this.nearFairytale = (Math.abs(px - 1940) < 80 && gy < this.floorY + 65);

        const nearCounselor = (Math.abs(px - 1085) < 70 && Math.abs(gy - (this.floorY + 22)) < 50);
        if (this.counselorBubble) {
            this.counselorBubble.setVisible(nearCounselor);
        }

        const isTouch = !this.sys.game.device.os.desktop || this.sys.game.device.input.touch;
        let activePrompt = '';
        if (this.nearExit) {
            activePrompt = isTouch ? '[ TAP TO EXIT TO SHIP ]' : '[ ENTER: EXIT TO SHIP ]';
        } else if (this.nearRalphSlide) {
            activePrompt = isTouch ? '[ TAP: WRECK-IT RALPH SLIDE ]' : '[ ENTER: WRECK-IT RALPH SLIDE ]';
        } else if (this.nearImagineering) {
            activePrompt = isTouch ? '[ TAP: IMAGINEERING LAB ]' : '[ ENTER: IMAGINEERING LAB ]';
        } else if (this.nearMarvel) {
            activePrompt = isTouch ? '[ TAP: MARVEL HERO ACADEMY ]' : '[ ENTER: MARVEL HERO ACADEMY ]';
        } else if (this.nearStarWars) {
            activePrompt = isTouch ? '[ TAP: STAR WARS CARGO BAY ]' : '[ ENTER: STAR WARS CARGO BAY ]';
        } else if (this.nearFairytale) {
            activePrompt = isTouch ? '[ TAP: FAIRYTALE HALL ]' : '[ ENTER: FAIRYTALE HALL ]';
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
