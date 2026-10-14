// =========================================================================
// RILEY'S EDGE TWEEN CLUB SOCIAL ARCADE LOUNGE SCENE
// =========================================================================

class EdgeClubScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EdgeClubScene' });
    }

    init(data) {
        this.gameScene = data.gameScene;
        this.groundY = 445;
        this.jumpZ = 0;
        this.jumpV = 0;
        this.isJumping = false;
        this.isExiting = false;
        this.playerSpeed = 160;
        this.smoothieBoostTimer = 0;
        this.heldSmoothie = null;
        this.sparkleTimer = 0;
        this.speechEndTime = 0;
        this.currentSpeaker = null;
        this.nearElevator = false;
        this.nearSmoothie = false;
        this.nearArcade = false;

        // Mobile touch controls state
        this.touchMoveActive = false;
        this.touchMoveDir = 0;
        this.touchMoveDepth = 0;
    }

    create() {
        retroArcadeAudio.init();

        // Ensure underlying GameScene is completely hidden and slept
        if (this.gameScene && this.gameScene.scene) {
            this.gameScene.scene.setVisible(false);
            this.gameScene.scene.sleep();
        }

        const W = this.scale.width;
        const H = this.scale.height;

        const roomH = Math.max(540, H);
        const roomW = Math.max(1600, W);
        this.roomW = roomW;
        this.roomH = roomH;

        const floorH = Math.max(130, Math.round(roomH * 0.22));
        const floorY = roomH - floorH;
        this.floorY = floorY;
        this.floorH = floorH;
        this.groundY = floorY + 25;

        this.physics.world.setBounds(0, 0, roomW, roomH);

        // 0. Solid background guaranteeing no underlying scene leakage
        this.add.rectangle(0, 0, 10000, 10000, 0x07091B).setOrigin(0.5).setDepth(0);

        // 1. Room Background & Framing
        this.add.tileSprite(roomW / 2, floorY / 2, roomW, floorY, 'edge_wall').setDepth(1);
        this.add.tileSprite(roomW / 2, floorY + (floorH / 2), roomW, floorH, 'edge_floor').setDepth(2);

        // Floor curb divider line (gold & cyan trim)
        let curb = this.add.graphics().setDepth(3);
        curb.fillStyle(0x00E5FF, 1);
        curb.fillRect(0, floorY - 2, roomW, 2);
        curb.fillStyle(0xFFD700, 0.7);
        curb.fillRect(0, floorY, roomW, 2);

        // Starry Night Ocean Portholes
        const portholeY = Math.max(140, Math.round(floorY * 0.38));
        [Math.round(roomW * 0.16), Math.round(roomW * 0.5), Math.round(roomW * 0.84)].forEach(px => {
            let port = this.add.graphics().setDepth(4);
            port.fillStyle(0x1B263B, 1);
            port.fillCircle(px, portholeY, 42);
            port.fillStyle(0x0D1B2A, 1);
            port.fillCircle(px, portholeY, 38);
            port.fillStyle(0xFFD700, 1);
            port.lineStyle(3, 0xFFD700, 1);
            port.strokeCircle(px, portholeY, 40);

            // Twinkling stars inside porthole
            for (let s = 0; s < 8; s++) {
                let sx = px + Phaser.Math.Between(-30, 30);
                let sy = portholeY + Phaser.Math.Between(-30, 20);
                let star = this.add.text(sx, sy, '✦', { fontSize: '7px', fill: '#A0D0FF' }).setOrigin(0.5).setDepth(5);
                this.tweens.add({
                    targets: star,
                    alpha: 0.2,
                    duration: Phaser.Math.Between(600, 1400),
                    yoyo: true,
                    repeat: -1
                });
            }
            // Ocean wave line inside porthole
            port.fillStyle(0x003366, 1);
            port.fillRect(px - 36, portholeY + 15, 72, 22);
            port.fillStyle(0x005588, 1);
            port.fillRect(px - 36, portholeY + 15, 72, 3);
        });

        // Giant Illuminated Neon Club Sign
        const neonY = Math.max(50, Math.round(floorY * 0.14));
        this.neonSign = this.add.image(roomW / 2, neonY, 'edge_neon_logo').setDepth(6);
        this.neonTitleText = this.add.text(roomW / 2, neonY, '★ EDGE TWEEN CLUB ★', {
            fontSize: '12px',
            fill: '#00FFFF',
            fontFamily: '"Press Start 2P", monospace',
            stroke: '#FF2A85',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(7);

        this.tweens.add({
            targets: [this.neonSign, this.neonTitleText],
            alpha: 0.85,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // 2. Interactive Furniture & Stations
        const elevX = 120;
        const elevY = floorY - 32;
        this.elevX = elevX;
        this.elevY = elevY;

        const barX = Math.round(roomW * 0.26);
        const barY = floorY - 15;
        this.barX = barX;
        this.barY = barY;

        const couchX = Math.round(roomW * 0.45);
        const couchY = floorY - 5;
        this.couchX = couchX;
        this.couchY = couchY;

        const ldrX = Math.round(roomW * 0.64);
        const ldrY = floorY - 130;
        this.ldrX = ldrX;
        this.ldrY = ldrY;

        const arcX = Math.round(roomW * 0.82);
        const arcY = floorY - 30;
        this.arcX = arcX;
        this.arcY = arcY;

        const djX = Math.min(roomW - 90, Math.round(roomW * 0.94));
        const djY = floorY - 40;
        this.djX = djX;
        this.djY = djY;

        // Equalizer / DJ Booth
        this.djG = this.add.graphics().setDepth(5);
        this.eqBars = [0.4, 0.7, 0.9, 0.5, 0.8, 0.3, 0.6];
        this.time.addEvent({
            delay: 150,
            loop: true,
            callback: () => {
                for (let i = 0; i < this.eqBars.length; i++) {
                    this.eqBars[i] = Phaser.Math.Between(2, 10) / 10;
                }
            }
        });

        // Elevator Doors
        this.elevatorDoor = this.add.image(elevX, elevY, 'edge_elevator_door').setDepth(10);
        this.add.text(elevX, elevY - 44, '[ DECK 5: EDGE ]', {
            fontSize: '8px', fill: '#00FF66', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(11);

        this.elevatorPrompt = this.add.text(elevX, elevY - 68, '[ ENTER: UPPER DECKS ]', {
            fontSize: '8px', fill: '#FFD700', backgroundColor: '#000000', padding: { x: 8, y: 4 },
            fontFamily: '"Press Start 2P", monospace'
        }).setOrigin(0.5).setVisible(false).setDepth(2000);

        // Smoothie Bar
        this.add.image(barX, barY, 'edge_bar').setDepth(10);
        this.add.text(barX, barY - 35, 'CHILL BAR', {
            fontSize: '8px', fill: '#FF2A85', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(11);

        this.smoothiePrompt = this.add.text(barX, barY - 60, '[ ENTER: GRAB SMOOTHIE ]', {
            fontSize: '8px', fill: '#00E5FF', backgroundColor: '#000000', padding: { x: 8, y: 4 },
            fontFamily: '"Press Start 2P", monospace'
        }).setOrigin(0.5).setVisible(false).setDepth(2000);

        // Lounge Sectional Couch & Leo
        this.add.image(couchX, couchY, 'edge_couch').setDepth(10);
        this.leoSprite = this.add.image(couchX - 20, couchY - 18, 'edge_npc_leo').setDepth(12);

        // Wall Leaderboard Display
        this.add.image(ldrX, ldrY, 'edge_leaderboard').setDepth(10);
        this.add.text(ldrX, ldrY - 20, 'HIGH SCORES', {
            fontSize: '8px', fill: '#FFD700', fontFamily: '"Press Start 2P", monospace'
        }).setOrigin(0.5).setDepth(11);

        this.leaderboardTexts = [];
        for (let i = 0; i < 5; i++) {
            let row = this.add.text(ldrX, ldrY - 4 + (i * 12), '', {
                fontSize: '7px', fill: '#00FF66', fontFamily: '"Press Start 2P", monospace'
            }).setOrigin(0.5).setDepth(11);
            this.leaderboardTexts.push(row);
        }
        this.updateLeaderboardDisplay();

        // Retro Arcade Cabinet & Maya
        this.arcadeCabinet = this.add.image(arcX, arcY, 'edge_arcade_cabinet').setDepth(10);
        this.mayaSprite = this.add.image(arcX + 44, arcY + 22, 'edge_npc_maya').setDepth(12);

        // Cabinet Marquee Blink
        this.marqueeText = this.add.text(arcX, arcY - 46, 'GALAXY DESTINY', {
            fontSize: '7px', fill: '#FFD700', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(11);

        this.tweens.add({
            targets: this.marqueeText,
            alpha: 0.3,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        this.arcadePrompt = this.add.text(arcX, arcY - 68, '[ ENTER: PLAY ARCADE ]', {
            fontSize: '8px', fill: '#FFD700', backgroundColor: '#000000', padding: { x: 8, y: 4 },
            fontFamily: '"Press Start 2P", monospace'
        }).setOrigin(0.5).setVisible(false).setDepth(2000);

        // 3. Player Riley
        const spawnX = 180;
        this.playerShadow = this.add.ellipse(spawnX, this.groundY + 16, 24, 8, 0x000000, 0.4).setDepth(Math.round(this.groundY) - 1);
        this.player = this.physics.add.sprite(spawnX, this.groundY, 'riley_idle').setDepth(Math.round(this.groundY));
        this.player.body.allowGravity = false;
        this.player.body.setSize(22, 16);
        this.player.body.setOffset(5, 32);

        // Ensure Riley walk animation exists
        if (!this.anims.exists('riley_walk')) {
            this.anims.create({
                key: 'riley_walk',
                frames: [
                    { key: 'riley_walk_0' },
                    { key: 'riley_walk_1' },
                    { key: 'riley_walk_2' },
                    { key: 'riley_walk_1' }
                ],
                frameRate: 8,
                repeat: -1
            });
        }
        if (!this.anims.exists('riley_idle')) {
            this.anims.create({
                key: 'riley_idle',
                frames: [{ key: 'riley_idle' }],
                frameRate: 1
            });
        }
        if (!this.anims.exists('riley_jump')) {
            this.anims.create({
                key: 'riley_jump',
                frames: [{ key: 'riley_jump' }],
                frameRate: 1
            });
        }

        // Camera Follow
        this.cameras.main.setBounds(0, 0, roomW, roomH);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        // 4. Capcom Speech Bubble System
        this.speechBox = this.add.graphics().setDepth(2500).setVisible(false);
        this.speechText = this.add.text(0, 0, '', {
            fontSize: '7px',
            fill: '#F8B800',
            fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000',
            strokeThickness: 1,
            align: 'center',
            wordWrap: { width: 150 }
        }).setOrigin(0, 0).setDepth(2501).setVisible(false);

        // Dialogue Quotes
        this.leoQuotes = [
            'YO RILEY! GALAXY DESTINY IS IN THE HOUSE!',
            'THE MOTHERSHIP ON WAVE 3 IS SERIOUS BUSINESS!',
            'GRAB THE "P" CAPSULES FOR SPREAD LASERS!',
            'DETONATE A SMART BOMB WHEN SURROUNDED!'
        ];
        this.mayaQuotes = [
            'RILEY! YOU\'VE GOTTA BEAT JAX\'S HIGH SCORE!',
            'HOLD DOWN FIRE FOR CONTINUOUS RAPID BLASTS!',
            'DON\'T MISS THE BLUE SHIELD CAPSULES!',
            'CLAIM THE #1 SPOT ON THE EDGE BOARD!'
        ];

        // 5. Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keysWASD = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            esc: Phaser.Input.Keyboard.KeyCodes.ESC
        });

        this.input.keyboard.on('keydown-ESC', () => this.returnToGameScene());

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
            if (this._cleanWindowListeners) {
                this._cleanWindowListeners();
            }
        });

        // Mobile On-Screen Controls
        this.setupMobileControls();

        // Direct Touch on interactive stations
        this.elevatorDoor.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.returnToGameScene());
        this.arcadeCabinet.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.launchArcadeCabinet());
        this.neonSign.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.returnToGameScene());
    }

    setupMobileControls() {
        // Top Left Exit Button (fixed on screen) - available on all devices
        this.exitBtn = this.add.text(16, 16, '[ ◄ DECKS ]', {
            fontSize: '9px', fill: '#FFD700', backgroundColor: '#000000', padding: { x: 8, y: 6 },
            fontFamily: '"Press Start 2P", monospace'
        }).setScrollFactor(0).setDepth(3000).setInteractive({ useHandCursor: true });
        this.exitBtn.on('pointerdown', () => this.returnToGameScene());

        // Mobile touch controls only enabled on non-desktop devices
        if (!this.sys.game.device.os.desktop) {
            const rx = this.scale.width - 70;
            const ry = this.scale.height - 70;

            this.jumpBtn = this.add.circle(rx - 70, ry, 30, 0x005588, 0.7)
                .setScrollFactor(0).setDepth(3000).setInteractive();
            this.add.text(rx - 70, ry, 'JUMP', { fontSize: '8px', fill: '#FFFFFF', fontFamily: '"Press Start 2P"' })
                .setOrigin(0.5).setScrollFactor(0).setDepth(3001);

            this.actionBtn = this.add.circle(rx, ry - 30, 30, 0xFF8800, 0.7)
                .setScrollFactor(0).setDepth(3000).setInteractive();
            this.add.text(rx, ry - 30, 'ACT', { fontSize: '8px', fill: '#FFFFFF', fontFamily: '"Press Start 2P"' })
                .setOrigin(0.5).setScrollFactor(0).setDepth(3001);

            this.jumpBtn.on('pointerdown', () => this.tryJump());
            this.actionBtn.on('pointerdown', () => this.handleActionTrigger());

            // Floating touch movement (drag on left half of screen)
            this.input.on('pointerdown', (pointer) => {
                if (pointer.x < this.scale.width / 2 && pointer.y > 60) {
                    this.touchMoveActive = true;
                    this.touchOriginX = pointer.x;
                    this.touchOriginY = pointer.y;
                }
            });
            this.input.on('pointermove', (pointer) => {
                if (this.touchMoveActive) {
                    const dx = pointer.x - this.touchOriginX;
                    const dy = pointer.y - this.touchOriginY;
                    this.touchMoveDir = Math.abs(dx) > 15 ? (dx > 0 ? 1 : -1) : 0;
                    this.touchMoveDepth = Math.abs(dy) > 15 ? (dy > 0 ? 1 : -1) : 0;
                }
            });
            this.input.on('pointerup', () => {
                this.touchMoveActive = false;
                this.touchMoveDir = 0;
                this.touchMoveDepth = 0;
            });
        }
    }

    tryJump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.jumpV = 280;
            this.player.anims.play('riley_jump', true);
        }
    }

    handleActionTrigger() {
        if (this.nearElevator) {
            this.returnToGameScene();
        } else if (this.nearArcade) {
            this.launchArcadeCabinet();
        } else if (this.nearSmoothie) {
            this.grabSmoothie();
        }
    }

    grabSmoothie() {
        if (this.heldSmoothie) return;
        retroArcadeAudio.playPowerup();
        this.smoothieBoostTimer = 10000;
        const handOffsetX = this.player.flipX ? -11 : 11;
        const handOffsetY = 3;
        this.heldSmoothie = this.add.image(this.player.x + handOffsetX, this.player.y + handOffsetY, 'edge_smoothie')
            .setScale(0.75)
            .setFlipX(this.player.flipX)
            .setDepth(this.player.depth + 1);

        // Flash screen with pastel aura
        this.cameras.main.flash(200, 0, 229, 255);

        // Floating message
        let msg = this.add.text(this.player.x, this.player.y - 50, '+SPEED BOOST!', {
            fontSize: '9px', fill: '#00E5FF', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(2500);

        this.tweens.add({
            targets: msg,
            y: msg.y - 25,
            alpha: 0,
            duration: 1200,
            onComplete: () => msg.destroy()
        });
    }

    updateLeaderboardDisplay() {
        const scores = getEdgeHighScores();
        for (let i = 0; i < 5; i++) {
            if (scores[i]) {
                const s = scores[i];
                const zeroPad = String(s.score).padStart(6, '0');
                const rank = `${i + 1}.`;
                this.leaderboardTexts[i].setText(`${rank} ${s.name.padEnd(5, ' ')} ${zeroPad}`);
                if (s.name === 'RILEY') {
                    this.leaderboardTexts[i].setStyle({ fill: '#FFD700' });
                } else {
                    this.leaderboardTexts[i].setStyle({ fill: '#00FF66' });
                }
            } else {
                this.leaderboardTexts[i].setText('');
            }
        }
    }

    launchArcadeCabinet() {
        retroArcadeAudio.init();
        this.scene.setVisible(false);
        this.scene.pause('EdgeClubScene');
        this.scene.launch('ArcadeShooterScene', { edgeScene: this });
    }

    onReturnFromArcade(score) {
        this.updateLeaderboardDisplay();
        retroArcadeAudio.init();

        // Maya and Leo congratulate Riley
        let quote = (score > 12500)
            ? 'LEGENDARY RILEY! YOU CLAIMED #1 ON THE EDGE BOARD!'
            : (score > 6000)
            ? 'EPIC RUN RILEY! You\'re climbing the high score board!'
            : 'Nice run Riley! Jump back on and blast that Mothership!';

        this.showSpeechBubble(this.mayaSprite, quote, this.time.now);
    }

    showSpeechBubble(speaker, quote, time) {
        if (this.currentSpeaker && time < this.speechEndTime) return;
        this.currentSpeaker = speaker;
        this.speechEndTime = time + 3000;

        this.speechText.setText(quote);
        let padX = 8;
        let padY = 5;
        let w = this.speechText.width + padX * 2;
        let h = this.speechText.height + padY * 2;

        let bx = speaker.x - w / 2;
        let by = speaker.y - 42 - h;
        bx = Phaser.Math.Clamp(bx, 20, this.roomW - w - 20);

        this.speechBox.clear();
        this.speechBox.fillStyle(0x000000, 1);
        this.speechBox.fillRect(bx - 2, by - 2, w + 4, h + 4);
        this.speechBox.fillStyle(0x001024, 0.95);
        this.speechBox.fillRect(bx, by, w, h);
        this.speechBox.lineStyle(1, 0xF8B800, 1);
        this.speechBox.strokeRect(bx, by, w, h);

        let arrowX = Phaser.Math.Clamp(speaker.x, bx + 8, bx + w - 8);
        let arrowY = by + h;
        this.speechBox.fillStyle(0x001024, 0.95);
        this.speechBox.fillTriangle(arrowX - 4, arrowY, arrowX + 4, arrowY, arrowX, arrowY + 6);
        this.speechBox.lineStyle(1, 0xF8B800, 1);
        this.speechBox.lineBetween(arrowX - 4, arrowY, arrowX, arrowY + 6);
        this.speechBox.lineBetween(arrowX, arrowY + 6, arrowX + 4, arrowY);

        this.speechText.setPosition(bx + padX, by + padY);
        this.speechBox.setVisible(true);
        this.speechText.setVisible(true);
    }

    update(time, delta) {
        const dt = delta / 1000;

        // Equalizer Bar Animation
        this.djG.clear();
        this.djG.fillStyle(0x111122, 1);
        this.djG.fillRect(this.djX - 35, this.djY - 18, 70, 36);
        for (let i = 0; i < this.eqBars.length; i++) {
            const h = Math.round(this.eqBars[i] * 28);
            const col = (h > 20) ? 0xFF0055 : (h > 12) ? 0xFFD700 : 0x00E5FF;
            this.djG.fillStyle(col, 1);
            this.djG.fillRect((this.djX - 30) + (i * 9), (this.djY + 14) - h, 6, h);
        }

        // Hide speech bubble if expired
        if (this.currentSpeaker && time >= this.speechEndTime) {
            this.speechBox.setVisible(false);
            this.speechText.setVisible(false);
            this.currentSpeaker = null;
        }

        // Smoothie Speed Boost Timer
        if (this.smoothieBoostTimer > 0) {
            this.smoothieBoostTimer -= delta;
            this.playerSpeed = 240;

            // Rainbow trail sparkles
            this.sparkleTimer += delta;
            if (this.sparkleTimer > 120) {
                this.sparkleTimer = 0;
                let colors = ['#00E5FF', '#FF2A85', '#FFD700', '#00FF66'];
                let c = Phaser.Utils.Array.GetRandom(colors);
                let sp = this.add.text(this.player.x + Phaser.Math.Between(-8, 8), this.player.y + Phaser.Math.Between(-10, 10), '✦', {
                    fontSize: '8px', fill: c
                }).setOrigin(0.5).setDepth(this.player.depth - 1);
                this.tweens.add({
                    targets: sp,
                    alpha: 0,
                    scale: 0.5,
                    duration: 400,
                    onComplete: () => sp.destroy()
                });
            }

            if (this.smoothieBoostTimer <= 0) {
                this.playerSpeed = 160;
                if (this.heldSmoothie) {
                    this.heldSmoothie.destroy();
                    this.heldSmoothie = null;
                }
            }
        }

        // Player Controls (Mutually exclusive & DOM keyup protected)
        let isLeft = (this.cursors.left && this.cursors.left.isDown) || 
                     (this.keysWASD.left && this.keysWASD.left.isDown) || 
                     this.touchMoveDir === -1;

        let isRight = (this.cursors.right && this.cursors.right.isDown) || 
                      (this.keysWASD.right && this.keysWASD.right.isDown) || 
                      this.touchMoveDir === 1;

        let isUp = (this.cursors.up && this.cursors.up.isDown) || 
                   (this.keysWASD.up && this.keysWASD.up.isDown) || 
                   this.touchMoveDepth === -1;

        let isDown = (this.cursors.down && this.cursors.down.isDown) || 
                     (this.keysWASD.down && this.keysWASD.down.isDown) || 
                     this.touchMoveDepth === 1;

        let moveX = 0;
        let moveY = 0;

        if (isLeft && !isRight) {
            moveX = -1;
            this.player.setFlipX(true);
        } else if (isRight && !isLeft) {
            moveX = 1;
            this.player.setFlipX(false);
        }

        if (isUp && !isDown) {
            moveY = -1;
        } else if (isDown && !isUp) {
            moveY = 1;
        }

        // Diagonal normalization
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

        // 2.5D Movement Execution
        this.player.x += vx * dt;
        this.player.x = Phaser.Math.Clamp(this.player.x, 70, this.roomW - 70);

        this.groundY += vy * dt;
        this.groundY = Phaser.Math.Clamp(this.groundY, this.floorY - 5, this.roomH - 25);

        this.player.y = this.groundY - this.jumpZ;
        this.player.setDepth(Math.round(this.groundY));
        this.player.body.reset(this.player.x, this.player.y);

        this.playerShadow.setPosition(this.player.x, this.groundY + 16);
        this.playerShadow.setDepth(Math.round(this.groundY) - 1);

        // Update held smoothie position in Riley's hand
        if (this.heldSmoothie) {
            const handOffsetX = this.player.flipX ? -11 : 11;
            const handOffsetY = 3;
            this.heldSmoothie.setPosition(this.player.x + handOffsetX, this.player.y + handOffsetY);
            this.heldSmoothie.setFlipX(this.player.flipX);
            this.heldSmoothie.setDepth(this.player.depth + 1);
        }

        // Player Animations
        if (this.isJumping) {
            this.player.anims.play('riley_jump', true);
        } else if (moveX !== 0 || moveY !== 0) {
            this.player.anims.play('riley_walk', true);
        } else {
            this.player.anims.play('riley_idle', true);
        }

        // Proximity Checks
        // 1. Elevator Door
        this.nearElevator = Math.abs(this.player.x - this.elevX) < 55;
        this.elevatorPrompt.setVisible(this.nearElevator);

        // 2. Smoothie Bar
        this.nearSmoothie = Math.abs(this.player.x - this.barX) < 50;
        this.smoothiePrompt.setVisible(this.nearSmoothie);

        // 3. Arcade Cabinet
        this.nearArcade = Math.abs(this.player.x - this.arcX) < 55;
        this.arcadePrompt.setVisible(this.nearArcade);

        // 4. Leo Dialogue Proximity
        if (Math.abs(this.player.x - (this.couchX - 20)) < 65 && !this.currentSpeaker) {
            this.showSpeechBubble(this.leoSprite, Phaser.Utils.Array.GetRandom(this.leoQuotes), time);
        }

        // 5. Maya Dialogue Proximity
        if (Math.abs(this.player.x - (this.arcX + 44)) < 60 && !this.currentSpeaker && !this.nearArcade) {
            this.showSpeechBubble(this.mayaSprite, Phaser.Utils.Array.GetRandom(this.mayaQuotes), time);
        }

        // Key Triggers (Enter)
        if (Phaser.Input.Keyboard.JustDown(this.keysWASD.enter)) {
            this.handleActionTrigger();
        }
    }

    returnToGameScene() {
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
        this.scene.stop('EdgeClubScene');

        if (this.gameScene && this.gameScene.player && this.gameScene.player.body) {
            const returnGroundY = this.gameScene.groundY || 1255;
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
            this.gameScene.player.body.setOffset(5, 32);

            if (this.gameScene.playerShadow) {
                this.gameScene.playerShadow.setPosition(1250, returnGroundY + 18);
                this.gameScene.playerShadow.setDepth(returnGroundY - 1);
                this.gameScene.playerShadow.setVisible(true);
            }

            this.gameScene.selectedCharacter = 'riley';
            this.gameScene.characterName = 'Riley';
            if (this.gameScene.hudPlayerName) {
                this.gameScene.hudPlayerName.setText('RILEY');
            }
            if (this.gameScene.hudPlayerIcon) {
                this.gameScene.hudPlayerIcon.setTexture('riley_idle');
            }
            if (this.gameScene.layoutHUD) {
                this.gameScene.layoutHUD(this.gameScene.scale.width, this.gameScene.scale.height);
            }

            this.gameScene.cameras.main.startFollow(this.gameScene.player, true, 0.08, 0.08);
            this.gameScene.nearElevator = true;
            if (this.gameScene.elevatorPromptText) {
                this.gameScene.elevatorPromptText.setVisible(true);
                this.gameScene.elevatorPromptText.x = 1250;
                this.gameScene.elevatorPromptText.y = returnGroundY - 60;
            }
        }
    }
}

