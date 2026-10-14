// =========================================================================
// RETRO ARCADE SPACE SHOOTER SCENE ("GALAXY DESTINY")
// =========================================================================

class ArcadeShooterScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ArcadeShooterScene' });
    }

    init(data) {
        this.edgeScene = data.edgeScene;
        this.lives = 3;
        this.bombs = 2;
        this.weaponLevel = 1; // 1: dual laser, 2: triple spread, 3: quad heavy
        this.shieldHits = 0;  // 0: inactive, >0 absorbs hit
        this.score = 0;
        this.wave = 1;
        this.gameState = 'playing'; // 'playing' -> 'gameover'
        this.lastShotTime = 0;
        this.shotCooldown = 160;
        this.invulnerableTimer = 0;
        this.enemiesDefeatedInWave = 0;
        this.waveTargetEnemies = 16;
        this.boss = null;
        this.bossActive = false;
        this.bossHP = 120;
        this.maxBossHP = 120;
        this.bossLaserTimer = 0;

        // Mobile touch & joystick state
        this.touchFireActive = false;
        this.joystickActive = false;
        this.joystickVx = 0;
        this.joystickVy = 0;
        this.joyPointer = null;
        this.joyOrigin = { x: 0, y: 0 };
        this.mobileInput = { left: false, right: false, up: false, down: false };
    }

    create() {
        retroArcadeAudio.init();
        // Enable multi-touch pointers for concurrent joystick + fire + bomb
        this.input.addPointer(3);
        // Disable gravity in arcade space shooter scene
        this.physics.world.gravity.y = 0;

        const W = this.scale.width;
        const H = this.scale.height;
        const cx = W / 2;
        const cy = H / 2;

        // 1. Responsive Arcade Cabinet Dimensions & Framing
        if (W >= 768 && H >= 600) {
            this.cabW = Math.min(680, W - 20);
            this.cabH = Math.min(H - 16, 860);
            this.marqueeH = Math.min(62, Math.max(48, Math.round(this.cabH * 0.08)));
            this.cpoH = Math.min(126, Math.max(96, Math.round(this.cabH * 0.17)));
        } else {
            this.cabW = W - 10;
            this.cabH = H - 10;
            this.marqueeH = Math.max(36, Math.min(48, Math.round(this.cabH * 0.08)));
            this.cpoH = Math.max(76, Math.min(105, Math.round(this.cabH * 0.17)));
        }

        this.cabX = cx - this.cabW / 2;
        this.cabY = cy - this.cabH / 2;

        // Recessed CRT Playfield inside the Cabinet
        const monitorY = this.cabY + this.marqueeH + 10;
        const monitorH = (this.cabY + this.cabH - this.cpoH - 10) - monitorY;
        const maxMonitorW = this.cabW - ((W >= 768) ? 60 : 20);
        const monitorW = Math.min(maxMonitorW, Math.round(monitorH * 1.05));

        this.playW = monitorW;
        this.playH = monitorH;
        this.playX = cx - this.playW / 2;
        this.playY = monitorY;
        this.cpoY = this.cabY + this.cabH - this.cpoH - 6;

        // Outer ambient letterbox
        this.add.rectangle(cx, cy, W, H, 0x030308).setDepth(0);

        // 2. Render Authentic Upright Arcade Cabinet Kit (Chassis, Wings, Marquee, Bezel)
        this.renderArcadeCabinetChassis();

        // 3. CRT Monitor Screen Background
        this.add.rectangle(cx, this.playY + this.playH / 2, this.playW, this.playH, 0x02040D).setDepth(2);

        // Parallax Stars
        this.stars = [];
        for (let i = 0; i < 50; i++) {
            let sx = this.playX + Phaser.Math.Between(4, this.playW - 4);
            let sy = this.playY + Phaser.Math.Between(4, this.playH - 4);
            let speed = (i % 2 === 0) ? 45 : 115;
            let col = (i % 2 === 0) ? '#406080' : '#A0D0FF';
            let char = (i % 3 === 0) ? '✦' : '•';
            let size = (i % 2 === 0) ? '6px' : '9px';
            let star = this.add.text(sx, sy, char, { fontSize: size, fill: col }).setOrigin(0.5).setDepth(3);
            this.stars.push({ obj: star, speed: speed });
        }

        // CRT Phosphor Scanlines Overlay
        this.scanlineOverlay = this.add.tileSprite(cx, this.playY + this.playH / 2, this.playW, this.playH, 'shooter_scanlines')
            .setDepth(25).setAlpha(0.2);

        // 4. Physics Groups (Zero gravity & explicit depth hierarchy)
        this.playerLasers = this.physics.add.group({
            allowGravity: false,
            createCallback: (item) => {
                item.setDepth(15);
                if (item.body) item.body.allowGravity = false;
            }
        });
        this.enemies = this.physics.add.group({
            allowGravity: false,
            createCallback: (item) => {
                item.setDepth(10);
                if (item.body) item.body.allowGravity = false;
            }
        });
        this.enemyBullets = this.physics.add.group({
            allowGravity: false,
            createCallback: (item) => {
                item.setDepth(12);
                if (item.body) item.body.allowGravity = false;
            }
        });
        this.powerups = this.physics.add.group({
            allowGravity: false,
            createCallback: (item) => {
                item.setDepth(14);
                if (item.body) item.body.allowGravity = false;
            }
        });

        // 5. Player Starfighter (Depth 22 - always in front of shield rings and aura effects)
        this.player = this.physics.add.sprite(cx, this.playY + this.playH - 50, 'shooter_player').setDepth(22);
        this.player.body.allowGravity = false;
        this.player.body.setSize(24, 24);

        this.thruster = this.add.image(this.player.x, this.player.y + 16, 'shooter_player_thruster').setDepth(21);
        this.shieldSprite = this.add.image(this.player.x, this.player.y, 'shooter_shield').setDepth(20).setVisible(false);
        this.invulnShield = this.add.image(this.player.x, this.player.y, 'shooter_invuln_shield').setDepth(19).setVisible(false);

        // 6. Arcade Top HUD
        this.highScore = getEdgeHighScores()[0].score || 12500;

        this.scoreText = this.add.text(this.playX + 10, this.playY + 10, '1UP 000000', {
            fontSize: '8px', fill: '#FFFFFF', fontFamily: '"Press Start 2P", monospace'
        }).setDepth(50);

        this.highText = this.add.text(cx, this.playY + 10, `HIGH ${String(this.highScore).padStart(6, '0')}`, {
            fontSize: '8px', fill: '#FFD700', fontFamily: '"Press Start 2P", monospace'
        }).setOrigin(0.5, 0).setDepth(50);

        this.waveText = this.add.text(this.playX + this.playW - 10, this.playY + 10, 'WAVE 01', {
            fontSize: '8px', fill: '#00E5FF', fontFamily: '"Press Start 2P", monospace'
        }).setOrigin(1, 0).setDepth(50);

        // Bottom Status HUD
        this.bottomHud = this.add.text(this.playX + 10, this.playY + this.playH - 16, '', {
            fontSize: '7px', fill: '#FFFFFF', fontFamily: '"Press Start 2P", monospace'
        }).setDepth(50);
        this.updateBottomHUD();

        // Boss Health Bar UI
        this.bossBarContainer = this.add.graphics().setDepth(55).setVisible(false);
        this.bossText = this.add.text(cx, this.playY + 26, '⚠ DREADNOUGHT ⚠', {
            fontSize: '8px', fill: '#FF2A85', fontFamily: '"Press Start 2P", monospace'
        }).setOrigin(0.5).setDepth(56).setVisible(false);

        // 7. Cabinet Control Panel Overlay (CPO) with illustrated joystick, instructions badge & arcade buttons
        this.setupCabinetControlPanel();

        // 8. Keyboard Controls & DOM listeners
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys({
            w: Phaser.Input.Keyboard.KeyCodes.W,
            a: Phaser.Input.Keyboard.KeyCodes.A,
            s: Phaser.Input.Keyboard.KeyCodes.S,
            d: Phaser.Input.Keyboard.KeyCodes.D,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            z: Phaser.Input.Keyboard.KeyCodes.Z,
            x: Phaser.Input.Keyboard.KeyCodes.X,
            b: Phaser.Input.Keyboard.KeyCodes.B,
            enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
            esc: Phaser.Input.Keyboard.KeyCodes.ESC
        });

        this.input.keyboard.on('keydown-ESC', () => this.exitCabinet());
        this.input.keyboard.on('keydown-X', () => {
            if (this.bombBtn) this.bombBtn.setScale(0.92);
            this.detonateSmartBomb();
        });
        this.input.keyboard.on('keyup-X', () => {
            if (this.bombBtn) this.bombBtn.setScale(1);
        });
        this.input.keyboard.on('keydown-B', () => {
            if (this.bombBtn) this.bombBtn.setScale(0.92);
            this.detonateSmartBomb();
        });
        this.input.keyboard.on('keyup-B', () => {
            if (this.bombBtn) this.bombBtn.setScale(1);
        });

        this.input.keyboard.on('keydown-SPACE', () => {
            if (this.fireBtn) this.fireBtn.setScale(0.92);
        });
        this.input.keyboard.on('keyup-SPACE', () => {
            if (this.fireBtn) this.fireBtn.setScale(1);
        });
        this.input.keyboard.on('keydown-Z', () => {
            if (this.fireBtn) this.fireBtn.setScale(0.92);
        });
        this.input.keyboard.on('keyup-Z', () => {
            if (this.fireBtn) this.fireBtn.setScale(1);
        });

        // Direct DOM safety release: guarantees keys are cleared even if OS or browser dropped Phaser keyup
        const resetArcadeKeys = () => {
            if (this.cursors) {
                if (this.cursors.left) this.cursors.left.isDown = false;
                if (this.cursors.right) this.cursors.right.isDown = false;
                if (this.cursors.up) this.cursors.up.isDown = false;
                if (this.cursors.down) this.cursors.down.isDown = false;
                if (this.cursors.space) this.cursors.space.isDown = false;
            }
            if (this.keys) {
                if (this.keys.w) this.keys.w.isDown = false;
                if (this.keys.a) this.keys.a.isDown = false;
                if (this.keys.s) this.keys.s.isDown = false;
                if (this.keys.d) this.keys.d.isDown = false;
                if (this.keys.space) this.keys.space.isDown = false;
                if (this.keys.z) this.keys.z.isDown = false;
                if (this.keys.x) this.keys.x.isDown = false;
                if (this.keys.b) this.keys.b.isDown = false;
                if (this.keys.enter) this.keys.enter.isDown = false;
            }
            if (this.fireBtn) this.fireBtn.setScale(1);
            if (this.bombBtn) this.bombBtn.setScale(1);
        };

        const onArcadeNativeKeyUp = (e) => {
            if (e.code === 'Space') {
                if (this.cursors && this.cursors.space) this.cursors.space.isDown = false;
                if (this.keys && this.keys.space) this.keys.space.isDown = false;
                if (this.fireBtn) this.fireBtn.setScale(1);
            }
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
                if (this.cursors && this.cursors.up) this.cursors.up.isDown = false;
                if (this.keys && this.keys.w) this.keys.w.isDown = false;
            }
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                if (this.cursors && this.cursors.left) this.cursors.left.isDown = false;
                if (this.keys && this.keys.a) this.keys.a.isDown = false;
            }
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                if (this.cursors && this.cursors.right) this.cursors.right.isDown = false;
                if (this.keys && this.keys.d) this.keys.d.isDown = false;
            }
            if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                if (this.cursors && this.cursors.down) this.cursors.down.isDown = false;
                if (this.keys && this.keys.s) this.keys.s.isDown = false;
            }
            if (e.key === 'z' || e.key === 'Z') {
                if (this.keys && this.keys.z) this.keys.z.isDown = false;
                if (this.fireBtn) this.fireBtn.setScale(1);
            }
            if (e.key === 'x' || e.key === 'X') {
                if (this.keys && this.keys.x) this.keys.x.isDown = false;
                if (this.bombBtn) this.bombBtn.setScale(1);
            }
            if (e.key === 'b' || e.key === 'B') {
                if (this.keys && this.keys.b) this.keys.b.isDown = false;
                if (this.bombBtn) this.bombBtn.setScale(1);
            }
            if (['Alt', 'Meta', 'Control', 'Shift'].includes(e.key)) {
                resetArcadeKeys();
            }
        };

        window.addEventListener('blur', resetArcadeKeys);
        window.addEventListener('focus', resetArcadeKeys);
        window.addEventListener('keyup', onArcadeNativeKeyUp);
        const onVis = () => { if (document.hidden) resetArcadeKeys(); };
        document.addEventListener('visibilitychange', onVis);

        this._cleanWindowListeners = () => {
            window.removeEventListener('blur', resetArcadeKeys);
            window.removeEventListener('focus', resetArcadeKeys);
            window.removeEventListener('keyup', onArcadeNativeKeyUp);
            document.removeEventListener('visibilitychange', onVis);
        };

        this.events.once('shutdown', () => {
            if (this.physics && this.physics.world && this.physics.world.gravity) {
                this.physics.world.gravity.y = 1000;
            }
            if (this._cleanWindowListeners) this._cleanWindowListeners();
        });

        // 9. Floating Joystick & Mobile Action Button Overlays (Fire & Bomb)
        this.setupFloatingJoystickAndTouchControls();

        // 10. Overlaps & Collisions (Strict object discrimination: player is NEVER passed as target)
        this.physics.add.overlap(this.playerLasers, this.enemies, (laser, enemy) => this.hitEnemyWithLaser(laser, enemy));
        this.physics.add.overlap(this.player, this.enemyBullets, (objA, objB) => {
            const bullet = (objA === this.player) ? objB : objA;
            this.hitPlayerWithBullet(bullet);
        });
        this.physics.add.overlap(this.player, this.enemies, (objA, objB) => {
            const enemy = (objA === this.player) ? objB : objA;
            this.hitPlayerWithEnemy(enemy);
        });
        this.physics.add.overlap(this.player, this.powerups, (objA, objB) => {
            const powerup = (objA === this.player) ? objB : objA;
            this.collectPowerup(powerup);
        });

        // 11. Wave 1 Mission Briefing Attract Banner
        this.showMissionBriefing();

        // 12. Immediate Enemy Spawn (500ms) + Recurring Spawner
        this.time.delayedCall(500, () => {
            if (this.gameState === 'playing' && !this.bossActive) {
                this.spawnWaveFormation();
            }
        });

        this.enemySpawnTimer = this.time.addEvent({
            delay: 1300,
            loop: true,
            callback: () => this.spawnWaveFormation()
        });
    }

    renderArcadeCabinetChassis() {
        const cx = this.scale.width / 2;

        // A. Cabinet Chassis Base (Depth 1) - behind the CRT monitor screen
        let cab = this.add.graphics().setDepth(1);
        cab.fillStyle(0x000000, 0.95);
        cab.fillRect(this.cabX - 4, this.cabY - 4, this.cabW + 8, this.cabH + 8);

        cab.fillStyle(0x0E101D, 1);
        cab.fillRect(this.cabX, this.cabY, this.cabW, this.cabH);

        const wingW = Math.max(12, Math.round((this.cabW - this.playW) / 2));

        // Side Wings, T-molding & Outer Frame (Depth 30) - in front of playfield entities so screen is recessed
        let cabWings = this.add.graphics().setDepth(30);

        // Left Side Wing (Synthwave artwork & T-molding)
        cabWings.fillStyle(0x16142B, 1);
        cabWings.fillRect(this.cabX, this.cabY, wingW, this.cabH);
        cabWings.lineStyle(3, 0xFF007F, 0.7);
        cabWings.lineBetween(this.cabX + 4, this.cabY + 50, this.cabX + wingW - 4, this.cabY + 140);
        cabWings.lineStyle(3, 0x00E5FF, 0.7);
        cabWings.lineBetween(this.cabX + 4, this.cabY + 90, this.cabX + wingW - 4, this.cabY + 180);
        cabWings.lineStyle(2, 0xFFD700, 0.7);
        cabWings.lineBetween(this.cabX + 4, this.cabY + 130, this.cabX + wingW - 4, this.cabY + 220);

        // Right Side Wing
        cabWings.fillStyle(0x16142B, 1);
        cabWings.fillRect(this.cabX + this.cabW - wingW, this.cabY, wingW, this.cabH);
        cabWings.lineStyle(3, 0xFF007F, 0.7);
        cabWings.lineBetween(this.cabX + this.cabW - 4, this.cabY + 50, this.cabX + this.cabW - wingW + 4, this.cabY + 140);
        cabWings.lineStyle(3, 0x00E5FF, 0.7);
        cabWings.lineBetween(this.cabX + this.cabW - 4, this.cabY + 90, this.cabX + this.cabW - wingW + 4, this.cabY + 180);
        cabWings.lineStyle(2, 0xFFD700, 0.7);
        cabWings.lineBetween(this.cabX + this.cabW - 4, this.cabY + 130, this.cabX + this.cabW - wingW + 4, this.cabY + 220);

        // T-Molding Trim (Bright orange/gold rubber edge)
        cabWings.fillStyle(0xFF5500, 1);
        cabWings.fillRect(this.cabX, this.cabY, 4, this.cabH);
        cabWings.fillRect(this.cabX + this.cabW - 4, this.cabY, 4, this.cabH);
        cabWings.fillStyle(0xFFAA00, 1);
        cabWings.fillRect(this.cabX + 1, this.cabY, 2, this.cabH);
        cabWings.fillRect(this.cabX + this.cabW - 3, this.cabY, 2, this.cabH);

        // Chrome Rivet Bolts along cabinet sides
        for (let ry = this.cabY + 30; ry < this.cabY + this.cabH; ry += 65) {
            cabWings.fillStyle(0x778899, 1);
            cabWings.fillCircle(this.cabX + 8, ry, 2.5);
            cabWings.fillCircle(this.cabX + this.cabW - 8, ry, 2.5);
            cabWings.fillStyle(0xFFFFFF, 1);
            cabWings.fillCircle(this.cabX + 7, ry - 1, 1);
            cabWings.fillCircle(this.cabX + this.cabW - 9, ry - 1, 1);
        }

        // Outer Side Letterbox Guards (prevent any element from rendering outside cabinet chassis)
        cabWings.fillStyle(0x030308, 1);
        if (this.cabX > 0) {
            cabWings.fillRect(0, 0, this.cabX, this.scale.height);
        }
        if (this.cabX + this.cabW < this.scale.width) {
            cabWings.fillRect(this.cabX + this.cabW, 0, this.scale.width - (this.cabX + this.cabW), this.scale.height);
        }

        // B. Top Illuminated Marquee (Depth 35)
        let mq = this.add.graphics().setDepth(35);
        mq.fillStyle(0x222538, 1);
        mq.fillRect(this.cabX + 6, this.cabY + 6, this.cabW - 12, this.marqueeH);
        mq.fillStyle(0x0A0518, 1);
        mq.fillRect(this.cabX + 10, this.cabY + 10, this.cabW - 20, this.marqueeH - 8);

        mq.lineStyle(2, 0xFFD700, 1);
        mq.strokeRect(this.cabX + 10, this.cabY + 10, this.cabW - 20, this.marqueeH - 8);
        mq.lineStyle(1, 0x00E5FF, 0.8);
        mq.strokeRect(this.cabX + 12, this.cabY + 12, this.cabW - 24, this.marqueeH - 12);

        // Speaker Grille Slits
        const spkLeftX = this.cabX + 16;
        const spkRightX = this.cabX + this.cabW - 52;
        for (let s = 0; s < 4; s++) {
            let sy = this.cabY + 15 + s * 6;
            mq.fillStyle(0x000000, 1);
            mq.fillRect(spkLeftX, sy, 26, 3);
            mq.fillRect(spkRightX, sy, 26, 3);
            mq.fillStyle(0x333348, 1);
            mq.fillRect(spkLeftX, sy + 1, 26, 1);
            mq.fillRect(spkRightX, sy + 1, 26, 1);
        }

        // Marquee Text
        let mTitle = this.add.text(cx, this.cabY + 10 + (this.marqueeH - 8) / 2, '★ GALAXY DESTINY ★', {
            fontSize: (this.cabW > 500) ? '12px' : '9px',
            fill: '#FFD700',
            fontFamily: '"Press Start 2P", monospace',
            stroke: '#FF0055',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(36);

        this.tweens.add({
            targets: mTitle,
            alpha: { from: 0.85, to: 1 },
            duration: 650,
            yoyo: true,
            repeat: -1
        });

        // Exit Cabinet Button (in upper-right corner of Marquee)
        this.exitBtn = this.add.text(this.cabX + this.cabW - 14, this.cabY + 12, '[ EXIT ]', {
            fontSize: '7px', fill: '#FF5555', backgroundColor: '#000000', padding: { x: 5, y: 3 },
            fontFamily: '"Press Start 2P"'
        }).setOrigin(1, 0).setDepth(3000).setInteractive({ useHandCursor: true });
        this.exitBtn.on('pointerdown', () => this.exitCabinet());

        // C. Molded CRT Monitor Bezel & Curved Corners (Depth 30)
        let mBezel = this.add.graphics().setDepth(30);
        // Outer dark frame around the monitor (top, bottom, left, right bars)
        mBezel.fillStyle(0x0A0C16, 1);
        mBezel.fillRect(this.playX - 12, this.playY - 12, this.playW + 24, 12); // top bar
        mBezel.fillRect(this.playX - 12, this.playY + this.playH, this.playW + 24, 12); // bottom bar
        mBezel.fillRect(this.playX - 12, this.playY, 12, this.playH); // left bar
        mBezel.fillRect(this.playX + this.playW, this.playY, 12, this.playH); // right bar

        mBezel.lineStyle(2, 0x00E5FF, 1);
        mBezel.strokeRect(this.playX - 4, this.playY - 4, this.playW + 8, this.playH + 8);
        mBezel.lineStyle(1, 0xFFD700, 0.7);
        mBezel.strokeRect(this.playX - 2, this.playY - 2, this.playW + 4, this.playH + 4);

        // 4 CRT Curved Corner Masks
        const cR = 12;
        mBezel.fillStyle(0x0A0C16, 1);
        mBezel.fillTriangle(this.playX, this.playY, this.playX + cR, this.playY, this.playX, this.playY + cR);
        mBezel.fillTriangle(this.playX + this.playW, this.playY, this.playX + this.playW - cR, this.playY, this.playX + this.playW, this.playY + cR);
        mBezel.fillTriangle(this.playX, this.playY + this.playH, this.playX + cR, this.playY + this.playH, this.playX, this.playY + this.playH - cR);
        mBezel.fillTriangle(this.playX + this.playW, this.playY + this.playH, this.playX + this.playW - cR, this.playY + this.playH, this.playX + this.playW, this.playY + this.playH - cR);

        // Bezel Stickers
        this.add.text(this.playX + 8, this.playY - 8, '• DISNEY EDGE ARCADE •', {
            fontSize: '6px', fill: '#00E5FF', fontFamily: '"Press Start 2P"'
        }).setOrigin(0, 1).setDepth(32);

        this.add.text(this.playX + this.playW - 8, this.playY - 8, '★ 1 PLAY 25¢ ★', {
            fontSize: '6px', fill: '#FFD700', fontFamily: '"Press Start 2P"'
        }).setOrigin(1, 1).setDepth(32);
    }

    setupCabinetControlPanel() {
        const cx = this.scale.width / 2;
        const cpoY = this.cpoY;
        const cpoH = this.cpoH;

        // Control Panel Deck Surface (Depth 40)
        let cpoG = this.add.graphics().setDepth(40);
        cpoG.fillStyle(0x181B28, 1);
        cpoG.fillRect(this.cabX + 6, cpoY, this.cabW - 12, cpoH);
        cpoG.fillStyle(0x2B3147, 1);
        cpoG.fillRect(this.cabX + 6, cpoY, this.cabW - 12, 3);
        cpoG.fillStyle(0x0C0D14, 1);
        cpoG.fillRect(this.cabX + 6, cpoY + cpoH - 4, this.cabW - 12, 4);

        // Left & Right Chrome Clamps
        cpoG.fillStyle(0x778899, 1);
        cpoG.fillRect(this.cabX + 6, cpoY, 8, cpoH);
        cpoG.fillRect(this.cabX + this.cabW - 14, cpoY, 8, cpoH);

        // --- 1. Left Section: Illustrated 8-Way Joystick ---
        const joyX = this.cabX + Math.max(38, Math.round(this.cabW * 0.14));
        const joyY = cpoY + Math.round(cpoH * 0.52);

        // Black dust washer
        cpoG.fillStyle(0x0D0D11, 1);
        cpoG.fillCircle(joyX, joyY + 6, 16);
        cpoG.lineStyle(1, 0x333344, 1);
        cpoG.strokeCircle(joyX, joyY + 6, 16);

        // Chrome joystick shaft
        cpoG.fillStyle(0xCCD0E0, 1);
        cpoG.fillRect(joyX - 3, joyY - 12, 6, 18);

        // 3D Red Ball-Top Knob
        cpoG.fillStyle(0xEE1133, 1);
        cpoG.fillCircle(joyX, joyY - 14, 12);
        cpoG.fillStyle(0xFFFFFF, 0.85);
        cpoG.fillCircle(joyX - 3, joyY - 17, 3);

        // Joystick Direction Arrows & Label
        this.add.text(joyX, joyY + 24, 'STEER', {
            fontSize: '6px', fill: '#00E5FF', fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5).setDepth(42);
        this.add.text(joyX, joyY + 32, 'ARROWS / WASD', {
            fontSize: '5px', fill: '#A0B0C0', fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5).setDepth(42);

        // --- 2. Middle Section: Metal "HOW TO PLAY" Instruction Plate ---
        const cardW = Math.min(270, Math.max(160, this.cabW - 230));
        const cardX = cx - cardW / 2;
        const cardH = cpoH - 14;

        cpoG.fillStyle(0x0B1220, 1);
        cpoG.fillRect(cardX, cpoY + 7, cardW, cardH);
        cpoG.lineStyle(1, 0x00E5FF, 1);
        cpoG.strokeRect(cardX, cpoY + 7, cardW, cardH);
        cpoG.lineStyle(1, 0xFFD700, 0.8);
        cpoG.strokeRect(cardX + 2, cpoY + 9, cardW - 4, cardH - 4);

        // 4 Corner Screws
        cpoG.fillStyle(0x8899AA, 1);
        cpoG.fillCircle(cardX + 5, cpoY + 12, 1.5);
        cpoG.fillCircle(cardX + cardW - 5, cpoY + 12, 1.5);
        cpoG.fillCircle(cardX + 5, cpoY + 7 + cardH - 5, 1.5);
        cpoG.fillCircle(cardX + cardW - 5, cpoY + 7 + cardH - 5, 1.5);

        // Instruction Text on Plate
        this.add.text(cx, cpoY + 15, '★ HOW TO PLAY ★', {
            fontSize: '7px', fill: '#FFD700', fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5).setDepth(42);

        this.add.text(cx, cpoY + 28, 'FIRE: [SPACE] OR [Z] (AUTO-FIRE)', {
            fontSize: '6px', fill: '#FFFFFF', fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5).setDepth(42);

        this.add.text(cx, cpoY + 40, 'BOMB: [X] OR [B] (SMART BOMB)', {
            fontSize: '6px', fill: '#FF9100', fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5).setDepth(42);

        this.add.text(cx, cpoY + 52, 'ITEMS: [P]GUN [S]SHIELD [B]BOMB [★]PTS', {
            fontSize: '5px', fill: '#00FF66', fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5).setDepth(42);

        if (cpoH >= 110) {
            this.add.text(cx, cpoY + 64, 'DODGE RED BULLETS! TOUCH DRAG / ARROWS', {
                fontSize: '5px', fill: '#A0D0FF', fontFamily: '"Press Start 2P"'
            }).setOrigin(0.5).setDepth(42);
        }

        // --- 3. Right Section: Clickable & Touchable 3D Arcade Buttons ---
        const btnFireX = this.cabX + this.cabW - Math.max(38, Math.round(this.cabW * 0.12));
        const btnFireY = cpoY + Math.round(cpoH * 0.52);
        const btnBombX = btnFireX - Math.max(44, Math.round(cpoH * 0.42));
        const btnBombY = btnFireY + 4;

        // FIRE Button (Red)
        this.add.circle(btnFireX, btnFireY, 23, 0x111111).setDepth(41);
        this.fireBtn = this.add.circle(btnFireX, btnFireY, 19, 0xFF2233).setDepth(42)
            .setInteractive({ useHandCursor: true });
        this.add.circle(btnFireX - 4, btnFireY - 6, 5, 0xFFAAAA, 0.65).setDepth(43);

        this.add.text(btnFireX, btnFireY - 3, 'FIRE', {
            fontSize: '7px', fill: '#FFFFFF', fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5).setDepth(44);
        this.add.text(btnFireX, btnFireY + 8, '[SPACE]', {
            fontSize: '5px', fill: '#FFD700', fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5).setDepth(44);

        this.fireBtn.on('pointerdown', () => {
            this.touchFireActive = true;
            this.fireBtn.setScale(0.92);
            this.fireBtn.setFillStyle(0xCC1122);
            this.fireLaser();
        });
        const releaseFireBtn = () => {
            this.touchFireActive = false;
            this.fireBtn.setScale(1);
            this.fireBtn.setFillStyle(0xFF2233);
        };
        this.fireBtn.on('pointerup', releaseFireBtn);
        this.fireBtn.on('pointerout', releaseFireBtn);

        // BOMB Button (Orange/Yellow)
        this.add.circle(btnBombX, btnBombY, 20, 0x111111).setDepth(41);
        this.bombBtn = this.add.circle(btnBombX, btnBombY, 16, 0xFF7700).setDepth(42)
            .setInteractive({ useHandCursor: true });
        this.add.circle(btnBombX - 3, btnBombY - 5, 4, 0xFFDD88, 0.65).setDepth(43);

        this.add.text(btnBombX, btnBombY - 3, 'BOMB', {
            fontSize: '6px', fill: '#FFFFFF', fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5).setDepth(44);
        this.add.text(btnBombX, btnBombY + 7, '[X]', {
            fontSize: '5px', fill: '#FFFFFF', fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5).setDepth(44);

        this.bombBtn.on('pointerdown', () => {
            this.bombBtn.setScale(0.92);
            this.bombBtn.setFillStyle(0xCC5500);
            this.detonateSmartBomb();
        });
        const releaseBombBtn = () => {
            this.bombBtn.setScale(1);
            this.bombBtn.setFillStyle(0xFF7700);
        };
        this.bombBtn.on('pointerup', releaseBombBtn);
        this.bombBtn.on('pointerout', releaseBombBtn);
    }

    setupFloatingJoystickAndTouchControls() {
        const W = this.scale.width;
        const H = this.scale.height;
        const JOY_RADIUS = 42;
        const KNOB_RADIUS = 20;

        // 1. Floating Joystick Graphics (Depth 520 - above playfield and cabinet)
        this.joyBase = this.add.graphics().setDepth(520);
        this.joyKnob = this.add.graphics().setDepth(521);

        this.joyBase.fillStyle(0x060C1E, 0.6);
        this.joyBase.fillCircle(0, 0, JOY_RADIUS);
        this.joyBase.lineStyle(2, 0x00E5FF, 0.85);
        this.joyBase.strokeCircle(0, 0, JOY_RADIUS);
        this.joyBase.lineStyle(1, 0xFFD700, 0.4);
        this.joyBase.strokeCircle(0, 0, JOY_RADIUS - 6);

        this.joyKnob.fillStyle(0x00A8FF, 0.95);
        this.joyKnob.fillCircle(0, 0, KNOB_RADIUS);
        this.joyKnob.lineStyle(2, 0x00FFFF, 1);
        this.joyKnob.strokeCircle(0, 0, KNOB_RADIUS);
        this.joyKnob.fillStyle(0xFFFFFF, 0.85);
        this.joyKnob.fillCircle(-4, -4, 4);

        this.joyBase.setVisible(false);
        this.joyKnob.setVisible(false);

        this.joyPointer = null;
        this.joyOrigin = { x: 0, y: 0 };

        // 2. On-Screen Action Button Overlays (Depth 510) - Primary FIRE & Secondary BOMB
        const btnFireX = Math.round(W - 60);
        const btnFireY = Math.round(H - 68);
        const btnBombX = Math.round(btnFireX - 68);
        const btnBombY = Math.round(btnFireY + 4);

        // FIRE Button Overlay Container
        this.overlayFireContainer = this.add.container(btnFireX, btnFireY).setDepth(510);
        let fireBase = this.add.circle(0, 0, 32, 0x0A0D18, 0.85).setStrokeStyle(2, 0x00E5FF, 0.85);
        this.overlayFireBtn = this.add.circle(0, 0, 28, 0xFF2244, 0.92).setInteractive({ useHandCursor: true });
        let fireHighlight = this.add.circle(-7, -8, 6, 0xFFAAAA, 0.65);
        let fireLabel = this.add.text(0, -4, 'FIRE', {
            fontSize: '9px', fill: '#FFFFFF', fontFamily: '"Press Start 2P"', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5);
        let fireSub = this.add.text(0, 8, '[HOLD]', {
            fontSize: '5px', fill: '#FFD700', fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5);
        this.overlayFireContainer.add([fireBase, this.overlayFireBtn, fireHighlight, fireLabel, fireSub]);

        // BOMB Button Overlay Container
        this.overlayBombContainer = this.add.container(btnBombX, btnBombY).setDepth(510);
        let bombBase = this.add.circle(0, 0, 26, 0x0A0D18, 0.85).setStrokeStyle(2, 0xFFD700, 0.85);
        this.overlayBombBtn = this.add.circle(0, 0, 22, 0xFF7700, 0.92).setInteractive({ useHandCursor: true });
        let bombHighlight = this.add.circle(-5, -6, 5, 0xFFEEAA, 0.65);
        let bombLabel = this.add.text(0, -3, 'BOMB', {
            fontSize: '8px', fill: '#FFFFFF', fontFamily: '"Press Start 2P"', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5);
        let bombSub = this.add.text(0, 7, '[X]', {
            fontSize: '5px', fill: '#FFFFFF', fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5);
        this.overlayBombContainer.add([bombBase, this.overlayBombBtn, bombHighlight, bombLabel, bombSub]);

        // FIRE Button Handlers
        this.firePointerId = null;
        this.overlayFireBtn.on('pointerdown', (ptr) => {
            this.firePointerId = ptr.id;
            this.touchFireActive = true;
            this.overlayFireContainer.setScale(0.92);
            this.fireLaser();
        });
        const releaseOverlayFire = (ptr) => {
            if (this.firePointerId === null || (ptr && ptr.id === this.firePointerId)) {
                this.touchFireActive = false;
                this.overlayFireContainer.setScale(1);
                this.firePointerId = null;
            }
        };
        this.overlayFireBtn.on('pointerup', releaseOverlayFire);
        this.overlayFireBtn.on('pointerout', releaseOverlayFire);

        // BOMB Button Handlers
        this.overlayBombBtn.on('pointerdown', () => {
            this.overlayBombContainer.setScale(0.92);
            this.detonateSmartBomb();
        });
        const releaseOverlayBomb = () => {
            this.overlayBombContainer.setScale(1);
        };
        this.overlayBombBtn.on('pointerup', releaseOverlayBomb);
        this.overlayBombBtn.on('pointerout', releaseOverlayBomb);

        // Resize handler for mobile orientation changes
        this.scale.on('resize', (gameSize) => {
            const newW = gameSize.width;
            const newH = gameSize.height;
            const nFireX = Math.round(newW - 60);
            const nFireY = Math.round(newH - 68);
            if (this.overlayFireContainer) {
                this.overlayFireContainer.setPosition(nFireX, nFireY);
            }
            if (this.overlayBombContainer) {
                this.overlayBombContainer.setPosition(Math.round(nFireX - 68), Math.round(nFireY + 4));
            }
        });

        // 3. Floating Joystick Multi-touch Pointer Listeners
        this.input.on('pointerdown', (ptr) => {
            if (this.gameState !== 'playing') return;

            // Ignore touches hitting the action buttons
            const curFireX = this.overlayFireContainer.x;
            const curFireY = this.overlayFireContainer.y;
            const curBombX = this.overlayBombContainer.x;
            const curBombY = this.overlayBombContainer.y;
            const distFire = Phaser.Math.Distance.Between(ptr.x, ptr.y, curFireX, curFireY);
            const distBomb = Phaser.Math.Distance.Between(ptr.x, ptr.y, curBombX, curBombY);
            if (distFire < 38 || distBomb < 32) {
                return;
            }

            // Ignore exit button in upper-right
            if (this.exitBtn && ptr.y < this.cabY + 40 && ptr.x > this.cabX + this.cabW - 80) {
                return;
            }

            // Spawn floating joystick at touch point (left 75% of screen)
            if (this.joyPointer === null && ptr.x < this.scale.width * 0.75) {
                this.joyPointer = ptr;
                this.joyOrigin.x = ptr.x;
                this.joyOrigin.y = ptr.y;
                this.joyBase.setPosition(ptr.x, ptr.y).setVisible(true);
                this.joyKnob.setPosition(ptr.x, ptr.y).setVisible(true);
                this.joystickActive = true;
                this.joystickVx = 0;
                this.joystickVy = 0;
            }
        });

        this.input.on('pointermove', (ptr) => {
            if (this.joyPointer && ptr.id === this.joyPointer.id) {
                let dx = ptr.x - this.joyOrigin.x;
                let dy = ptr.y - this.joyOrigin.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                let clamped = Math.min(dist, JOY_RADIUS);
                let angle = Math.atan2(dy, dx);
                let kx = this.joyOrigin.x + Math.cos(angle) * clamped;
                let ky = this.joyOrigin.y + Math.sin(angle) * clamped;
                this.joyKnob.setPosition(kx, ky);

                // Deadzone check (8px)
                if (dist > 8) {
                    const norm = Math.min(1.0, (dist - 8) / (JOY_RADIUS - 8));
                    this.joystickVx = Math.cos(angle) * norm * 240;
                    this.joystickVy = Math.sin(angle) * norm * 240;
                    this.mobileInput.left = dx < -12;
                    this.mobileInput.right = dx > 12;
                    this.mobileInput.up = dy < -12;
                    this.mobileInput.down = dy > 12;
                } else {
                    this.joystickVx = 0;
                    this.joystickVy = 0;
                    this.mobileInput.left = false;
                    this.mobileInput.right = false;
                    this.mobileInput.up = false;
                    this.mobileInput.down = false;
                }
            }
        });

        const releaseJoystick = (ptr) => {
            if (this.joyPointer && (!ptr || ptr.id === this.joyPointer.id)) {
                this.joyPointer = null;
                this.joyBase.setVisible(false);
                this.joyKnob.setVisible(false);
                this.joystickActive = false;
                this.joystickVx = 0;
                this.joystickVy = 0;
                this.mobileInput.left = false;
                this.mobileInput.right = false;
                this.mobileInput.up = false;
                this.mobileInput.down = false;
            }
        };

        this.input.on('pointerup', releaseJoystick);
        this.input.on('pointercancel', releaseJoystick);
    }

    showMissionBriefing() {
        const cx = this.playX + this.playW / 2;
        const cy = this.playY + this.playH / 2 - 20;

        let brief = this.add.container(cx, cy).setDepth(65);
        let bg = this.add.rectangle(0, 0, Math.min(360, this.playW - 24), 142, 0x000000, 0.92)
            .setStrokeStyle(2, 0x00E5FF);

        let t1 = this.add.text(0, -48, '★ MISSION BRIEFING ★', {
            fontSize: '9px', fill: '#FFD700', fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5);

        let t2 = this.add.text(0, -30, 'DEFEND THE DISNEY DESTINY!', {
            fontSize: '7px', fill: '#00FF66', fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5);

        let t3 = this.add.text(0, -2, '• MOVE: FLOATING JOYSTICK / WASD\n• FIRE: HOLD [FIRE] BUTTON OR [SPACE]\n• BOMB: TAP [BOMB] BUTTON OR [X]\n• DODGE RED BULLETS! CATCH [P][S][B][★]', {
            fontSize: '6px', fill: '#FFFFFF', fontFamily: '"Press Start 2P"', align: 'left', lineSpacing: 4
        }).setOrigin(0.5);

        let t4 = this.add.text(0, 46, '>>> BLAST OFF! <<<', {
            fontSize: '9px', fill: '#FF2A85', fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5);

        brief.add([bg, t1, t2, t3, t4]);

        this.tweens.add({
            targets: t4,
            alpha: 0.2,
            duration: 250,
            yoyo: true,
            repeat: 6
        });

        this.missionBriefing = brief;
        this.time.delayedCall(3400, () => {
            this.dismissMissionBriefing();
        });
    }

    dismissMissionBriefing() {
        if (!this.missionBriefing || !this.missionBriefing.active) return;
        let b = this.missionBriefing;
        this.missionBriefing = null;
        this.tweens.add({
            targets: b,
            alpha: 0,
            y: b.y - 20,
            duration: 350,
            onComplete: () => b.destroy()
        });
    }

    updateBottomHUD() {
        const hearts = '♥ '.repeat(Math.max(0, this.lives));
        const bombs = '💣 '.repeat(Math.max(0, this.bombs));
        const shield = this.shieldHits > 0 ? `SHIELD:${this.shieldHits * 50}%` : 'SHIELD:OFF';
        this.bottomHud.setText(`${hearts} | ${bombs} | LVL${this.weaponLevel} | ${shield}`);
    }

    fireLaser() {
        const now = this.time.now;
        if (now - this.lastShotTime < this.shotCooldown) return;
        this.lastShotTime = now;

        if (this.missionBriefing && this.missionBriefing.active) {
            this.dismissMissionBriefing();
        }

        retroArcadeAudio.playLaser();

        const px = this.player.x;
        const py = this.player.y - 14;

        if (this.weaponLevel === 1) {
            // Dual parallel lasers
            let l1 = this.playerLasers.create(px - 7, py, 'shooter_laser_player').setDepth(15);
            let l2 = this.playerLasers.create(px + 7, py, 'shooter_laser_player').setDepth(15);
            if (l1.body) l1.body.allowGravity = false;
            if (l2.body) l2.body.allowGravity = false;
            l1.setVelocityY(-560);
            l2.setVelocityY(-560);
        } else if (this.weaponLevel === 2) {
            // Triple spread laser
            let l1 = this.playerLasers.create(px, py, 'shooter_laser_player').setDepth(15);
            let l2 = this.playerLasers.create(px - 9, py + 2, 'shooter_laser_spread').setDepth(15);
            let l3 = this.playerLasers.create(px + 9, py + 2, 'shooter_laser_spread').setDepth(15);
            if (l1.body) l1.body.allowGravity = false;
            if (l2.body) l2.body.allowGravity = false;
            if (l3.body) l3.body.allowGravity = false;
            l1.setVelocity(0, -560);
            l2.setVelocity(-140, -500);
            l3.setVelocity(140, -500);
        } else {
            // Quad heavy plasma
            let l1 = this.playerLasers.create(px - 6, py, 'shooter_laser_player').setDepth(15);
            let l2 = this.playerLasers.create(px + 6, py, 'shooter_laser_player').setDepth(15);
            let l3 = this.playerLasers.create(px - 14, py + 4, 'shooter_laser_spread').setDepth(15);
            let l4 = this.playerLasers.create(px + 14, py + 4, 'shooter_laser_spread').setDepth(15);
            if (l1.body) l1.body.allowGravity = false;
            if (l2.body) l2.body.allowGravity = false;
            if (l3.body) l3.body.allowGravity = false;
            if (l4.body) l4.body.allowGravity = false;
            l1.setVelocity(0, -580);
            l2.setVelocity(0, -580);
            l3.setVelocity(-190, -480);
            l4.setVelocity(190, -480);
        }
    }

    detonateSmartBomb() {
        if (this.bombs <= 0 || this.gameState !== 'playing') return;
        this.bombs--;
        this.updateBottomHUD();

        retroArcadeAudio.playBomb();
        this.cameras.main.shake(250, 0.02);

        // Flash screen
        let flash = this.add.rectangle(this.playX + this.playW / 2, this.playY + this.playH / 2, this.playW, this.playH, 0xFFFFFF, 0.85).setDepth(200);
        this.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 250,
            onComplete: () => flash.destroy()
        });

        // Clear all enemy bullets
        this.enemyBullets.clear(true, true);

        // Damage all enemies
        this.enemies.getChildren().forEach(e => {
            if (e.isBoss) {
                this.damageBoss(40);
            } else {
                this.destroyEnemy(e, true);
            }
        });
    }

    spawnWaveFormation() {
        if (this.gameState !== 'playing' || this.bossActive) return;

        // Wave Target reached -> Boss spawn on Wave 3 (and multiples of 3)
        if (this.enemiesDefeatedInWave >= this.waveTargetEnemies) {
            if (this.wave % 3 === 0 && !this.bossActive) {
                this.spawnBoss();
                return;
            } else if (this.wave % 3 !== 0) {
                this.advanceWave();
                return;
            }
        }

        const type = Phaser.Math.Between(1, 10);
        const startX = this.playX + Phaser.Math.Between(24, this.playW - 24);

        if (type <= 5) {
            // Alien Drone Swarm
            let drone = this.enemies.create(startX, this.playY - 10, 'shooter_drone').setDepth(10);
            drone.hp = 1;
            drone.scoreVal = 100;
            drone.setVelocityY(90 + this.wave * 10);
            drone.sineOffset = Phaser.Math.Between(0, 100);
            drone.shootCooldown = Phaser.Math.Between(1200, 2400);
            drone.lastShoot = this.time.now;
        } else if (type <= 8) {
            // Cosmic Cruiser
            let cruiser = this.enemies.create(startX, this.playY - 12, 'shooter_cruiser').setDepth(10);
            cruiser.hp = 3;
            cruiser.scoreVal = 250;
            cruiser.setVelocity(Phaser.Math.Between(-30, 30), 60 + this.wave * 8);
            cruiser.shootCooldown = 1500;
            cruiser.lastShoot = this.time.now;
        } else {
            // Space Asteroid
            let rock = this.enemies.create(startX, this.playY - 12, 'shooter_asteroid_large').setDepth(10);
            rock.hp = 2;
            rock.scoreVal = 150;
            rock.isAsteroid = true;
            rock.setVelocity(Phaser.Math.Between(-20, 20), 80);
            rock.rotSpeed = Phaser.Math.Between(-3, 3);
        }
    }

    spawnBoss() {
        this.bossActive = true;
        this.maxBossHP = 100 + this.wave * 20;
        this.bossHP = this.maxBossHP;

        // Siren Warning
        retroArcadeAudio.playDamage();
        this.bossText.setVisible(true);
        this.bossBarContainer.setVisible(true);

        this.tweens.add({
            targets: this.bossText,
            alpha: 0.2,
            duration: 300,
            yoyo: true,
            repeat: 4,
            onComplete: () => this.bossText.setVisible(false)
        });

        // Create Boss Dreadnought
        let boss = this.enemies.create(this.playX + this.playW / 2, this.playY - 30, 'shooter_boss').setDepth(11);
        boss.isBoss = true;
        boss.body.setSize(68, 44);
        boss.setVelocityY(40);
        this.boss = boss;

        this.time.delayedCall(1200, () => {
            if (this.boss && this.boss.active) {
                this.boss.setVelocity(80, 0);
            }
        });
    }

    updateBoss(time, delta) {
        if (!this.boss || !this.boss.active) return;

        // Bounce horizontally
        if (this.boss.x < this.playX + 44) {
            this.boss.setVelocityX(80 + this.wave * 10);
        } else if (this.boss.x > this.playX + this.playW - 44) {
            this.boss.setVelocityX(-80 - this.wave * 10);
        }

        // Draw Boss Health Bar
        this.bossBarContainer.clear();
        let barW = this.playW - 40;
        let barH = 6;
        let bx = this.playX + 20;
        let by = this.playY + 22;

        this.bossBarContainer.fillStyle(0x000000, 0.8);
        this.bossBarContainer.fillRect(bx - 2, by - 2, barW + 4, barH + 4);
        this.bossBarContainer.lineStyle(1, 0xFFD700, 1);
        this.bossBarContainer.strokeRect(bx - 2, by - 2, barW + 4, barH + 4);

        let pct = Math.max(0, this.bossHP / this.maxBossHP);
        let col = (pct > 0.5) ? 0x00FF66 : (pct > 0.25) ? 0xFFD700 : 0xFF0055;
        this.bossBarContainer.fillStyle(col, 1);
        this.bossBarContainer.fillRect(bx, by, barW * pct, barH);

        // Boss Attack Patterns
        this.bossLaserTimer += delta;
        if (this.bossLaserTimer > 1200) {
            this.bossLaserTimer = 0;
            // Wing spread bullets
            let b1 = this.enemyBullets.create(this.boss.x - 24, this.boss.y + 18, 'shooter_bullet_enemy').setDepth(12);
            let b2 = this.enemyBullets.create(this.boss.x + 24, this.boss.y + 18, 'shooter_bullet_enemy').setDepth(12);
            b1.setVelocity(-40, 140);
            b2.setVelocity(40, 140);

            // Aimed energy core orb
            let angle = Phaser.Math.Angle.Between(this.boss.x, this.boss.y, this.player.x, this.player.y);
            let b3 = this.enemyBullets.create(this.boss.x, this.boss.y + 20, 'shooter_bullet_boss').setDepth(12);
            b3.setVelocity(Math.cos(angle) * 160, Math.sin(angle) * 160);
        }
    }

    damageBoss(amount) {
        this.bossHP -= amount;
        retroArcadeAudio.playBossHit();

        // Flash boss
        if (this.boss) {
            this.boss.setTintFill(0xFFFFFF);
            this.time.delayedCall(60, () => {
                if (this.boss && this.boss.active) this.boss.clearTint();
            });
        }

        if (this.bossHP <= 0) {
            this.destroyBoss();
        }
    }

    destroyBoss() {
        this.bossActive = false;
        this.bossBarContainer.setVisible(false);

        // Cascading explosions
        for (let i = 0; i < 8; i++) {
            this.time.delayedCall(i * 180, () => {
                retroArcadeAudio.playExplosion();
                this.cameras.main.shake(150, 0.015);
                let ex = this.boss ? this.boss.x + Phaser.Math.Between(-30, 30) : this.playX + this.playW / 2;
                let ey = this.boss ? this.boss.y + Phaser.Math.Between(-20, 20) : this.playY + 70;
                this.spawnExplosion(ex, ey);
            });
        }

        this.time.delayedCall(1600, () => {
            if (this.boss) {
                this.addScore(2500);
                this.boss.destroy();
                this.boss = null;
            }
            // Drop powerups
            ['shooter_powerup_P', 'shooter_powerup_S', 'shooter_powerup_B', 'shooter_powerup_STAR'].forEach((key, idx) => {
                let p = this.powerups.create(this.playX + 80 + idx * 70, this.playY + 60, key).setDepth(14);
                p.pType = key.replace('shooter_powerup_', '');
                p.setVelocityY(70);
            });

            this.advanceWave();
        });
    }

    advanceWave() {
        this.wave++;
        this.enemiesDefeatedInWave = 0;
        this.waveTargetEnemies = 16 + this.wave * 4;
        this.waveText.setText(`WAVE ${String(this.wave).padStart(2, '0')}`);

        // Floating Wave Banner
        let wMsg = this.add.text(this.playX + this.playW / 2, this.playY + this.playH / 2 - 20, `★ WAVE ${this.wave} ★`, {
            fontSize: '12px', fill: '#00E5FF', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5).setDepth(200);

        this.tweens.add({
            targets: wMsg,
            scale: 1.2,
            duration: 1000,
            yoyo: true,
            onComplete: () => wMsg.destroy()
        });
    }

    hitEnemyWithLaser(laser, enemy) {
        laser.destroy();
        enemy.hp--;

        if (enemy.isBoss) {
            this.damageBoss(2);
            return;
        }

        if (enemy.hp <= 0) {
            this.destroyEnemy(enemy, false);
        } else {
            enemy.setTintFill(0xFFFFFF);
            this.time.delayedCall(40, () => {
                if (enemy && enemy.active) enemy.clearTint();
            });
        }
    }

    destroyEnemy(enemy, isBomb) {
        if (!enemy || enemy === this.player || !enemy.active) return;
        const ex = enemy.x;
        const ey = enemy.y;
        const pts = enemy.scoreVal || 100;

        retroArcadeAudio.playExplosion();
        this.spawnExplosion(ex, ey);
        this.addScore(pts);
        this.enemiesDefeatedInWave++;

        // Asteroid fragment splitting
        if (enemy.isAsteroid) {
            let a1 = this.enemies.create(ex - 8, ey, 'shooter_asteroid_small').setDepth(10);
            let a2 = this.enemies.create(ex + 8, ey, 'shooter_asteroid_small').setDepth(10);
            a1.hp = 1; a1.scoreVal = 75; a1.setVelocity(-50, 90);
            a2.hp = 1; a2.scoreVal = 75; a2.setVelocity(50, 90);
        }

        // Random Powerup Drop
        const dropRoll = Phaser.Math.Between(1, 100);
        if (dropRoll <= 18) {
            const keys = ['P', 'S', 'B', 'STAR'];
            const chosen = Phaser.Utils.Array.GetRandom(keys);
            let p = this.powerups.create(ex, ey, 'shooter_powerup_' + chosen).setDepth(14);
            p.pType = chosen;
            p.setVelocityY(65);
        }

        if (typeof enemy.destroy === 'function') {
            enemy.destroy();
        }
    }

    spawnExplosion(x, y) {
        let exp = this.add.sprite(x, y, 'shooter_explosion_0').setDepth(18);
        let frames = ['shooter_explosion_0', 'shooter_explosion_1', 'shooter_explosion_2', 'shooter_explosion_3'];
        frames.forEach((f, idx) => {
            this.time.delayedCall(idx * 50, () => {
                if (exp && exp.active) exp.setTexture(f);
            });
        });
        this.time.delayedCall(220, () => exp.destroy());
    }

    hitPlayerWithBullet(bullet) {
        if (!bullet || bullet === this.player) return;
        if (typeof bullet.destroy === 'function') {
            bullet.destroy();
        }
        this.damagePlayer();
    }

    hitPlayerWithEnemy(enemy) {
        if (!enemy || enemy === this.player) return;
        if (!enemy.isBoss && typeof this.destroyEnemy === 'function') {
            this.destroyEnemy(enemy, false);
        }
        this.damagePlayer();
    }

    damagePlayer() {
        if (this.invulnerableTimer > 0 || this.gameState !== 'playing') return;

        // Shield Absorbs Hit
        if (this.shieldHits > 0) {
            this.shieldHits--;
            retroArcadeAudio.playDamage();
            this.updateBottomHUD();
            this.cameras.main.shake(120, 0.01);
            if (this.shieldHits <= 0) {
                this.shieldSprite.setVisible(false);
            } else {
                this.shieldSprite.setTint(0xFFAA00);
            }
            let deflect = this.add.circle(this.player.x, this.player.y, 25, 0x00E5FF, 0.6).setDepth(25);
            this.tweens.add({ targets: deflect, radius: 44, alpha: 0, duration: 250, onComplete: () => deflect.destroy() });
            this.invulnerableTimer = 400; // Brief grace period so multi-bullet salvo doesn't instantly pierce life
            return;
        }

        // Lose Life
        this.lives--;
        this.updateBottomHUD();
        retroArcadeAudio.playDamage();
        this.spawnExplosion(this.player.x, this.player.y);
        this.cameras.main.shake(250, 0.02);

        if (this.lives <= 0) {
            this.triggerGameOver();
        } else {
            // Keep ship in place under player control - never teleport or hide the ship!
            this.tweens.killTweensOf(this.player);
            this.tweens.killTweensOf(this.thruster);

            this.player.setAlpha(1.0);
            this.player.setVisible(true);
            this.thruster.setAlpha(1.0);
            this.thruster.setVisible(true);

            // Destroy enemy bullets immediately surrounding the player in 110px radius
            const px = this.player.x;
            const py = this.player.y;
            this.enemyBullets.getChildren().forEach(b => {
                if (Phaser.Math.Distance.Between(b.x, b.y, px, py) < 110) {
                    b.destroy();
                }
            });

            // Activate invulnerability forcefield aura
            this.invulnerableTimer = 2400;
            if (this.invulnShield) {
                this.invulnShield.setPosition(px, py).setVisible(true).setScale(1.0);
            }
        }
    }

    collectPowerup(powerup) {
        if (!powerup || powerup === this.player) return;
        const type = powerup.pType;
        if (typeof powerup.destroy === 'function') {
            powerup.destroy();
        }
        retroArcadeAudio.playPowerup();

        this.player.setVisible(true);
        this.player.setActive(true);
        this.player.setAlpha(1.0);

        let label = '';
        if (type === 'P') {
            this.weaponLevel = Math.min(3, this.weaponLevel + 1);
            label = `WEAPON LVL ${this.weaponLevel}!`;
        } else if (type === 'S') {
            this.shieldHits = 2;
            this.shieldSprite.setVisible(true).clearTint();
            this.invulnerableTimer = 0;
            if (this.invulnShield) this.invulnShield.setVisible(false);
            this.player.clearTint();
            label = 'ENERGY SHIELD (2 HITS)!';
        } else if (type === 'B') {
            this.bombs = Math.min(5, this.bombs + 1);
            label = '+1 SMART BOMB!';
        } else {
            this.addScore(1000);
            label = '+1000 PTS!';
        }
        this.updateBottomHUD();

        let t = this.add.text(this.player.x, this.player.y - 25, label, {
            fontSize: '8px', fill: '#FFD700', fontFamily: '"Press Start 2P"', stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(100);

        this.tweens.add({
            targets: t,
            y: t.y - 20,
            alpha: 0,
            duration: 800,
            onComplete: () => t.destroy()
        });
    }

    addScore(pts) {
        this.score += pts;
        this.scoreText.setText(`1UP ${String(this.score).padStart(6, '0')}`);
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.highText.setText(`HIGH ${String(this.highScore).padStart(6, '0')}`);
            this.highText.setStyle({ fill: '#00FF66' });
        }
    }

    triggerGameOver() {
        this.gameState = 'gameover';
        retroArcadeAudio.playGameOver();
        this.player.setVisible(false);
        this.player.clearTint();
        this.thruster.setVisible(false);
        this.shieldSprite.setVisible(false);
        if (this.invulnShield) this.invulnShield.setVisible(false);
        if (this.joyBase) this.joyBase.setVisible(false);
        if (this.joyKnob) this.joyKnob.setVisible(false);
        if (this.overlayFireContainer) this.overlayFireContainer.setVisible(false);
        if (this.overlayBombContainer) this.overlayBombContainer.setVisible(false);
        this.touchFireActive = false;
        this.joystickActive = false;

        // Save High Score
        const updatedScores = saveEdgeHighScore(this.score, 'RILEY');
        const isNewHigh = (updatedScores[0] && updatedScores[0].name === 'RILEY' && updatedScores[0].score === this.score);

        // Game Over Dialog Box
        const cx = this.playX + this.playW / 2;
        const cy = this.playY + this.playH / 2;

        let box = this.add.rectangle(cx, cy, this.playW - 30, 210, 0x000000, 0.95)
            .setStrokeStyle(3, isNewHigh ? 0xFFD700 : 0x00E5FF).setDepth(500);

        this.add.text(cx, cy - 75, '★ GAME OVER ★', {
            fontSize: '12px', fill: '#FF2A85', fontFamily: '"Press Start 2P"', stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(501);

        this.add.text(cx, cy - 45, `FINAL SCORE: ${String(this.score).padStart(6, '0')}`, {
            fontSize: '9px', fill: '#FFFFFF', fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5).setDepth(501);

        this.add.text(cx, cy - 25, `WAVES CLEARED: ${this.wave - 1}`, {
            fontSize: '8px', fill: '#A0D0FF', fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5).setDepth(501);

        if (isNewHigh) {
            this.add.text(cx, cy + 2, '★ NEW HIGH SCORE! ★', {
                fontSize: '9px', fill: '#FFD700', fontFamily: '"Press Start 2P"'
            }).setOrigin(0.5).setDepth(501);
            this.add.text(cx, cy + 20, 'RILEY IS #1 ON EDGE BOARD!', {
                fontSize: '7px', fill: '#00FF66', fontFamily: '"Press Start 2P"'
            }).setOrigin(0.5).setDepth(501);
        } else {
            this.add.text(cx, cy + 12, 'EDGE LEADERBOARD UPDATED', {
                fontSize: '8px', fill: '#00FF66', fontFamily: '"Press Start 2P"'
            }).setOrigin(0.5).setDepth(501);
        }

        // Restart & Exit Buttons
        let restartBtn = this.add.text(cx, cy + 50, '[ PLAY AGAIN ]', {
            fontSize: '9px', fill: '#000000', backgroundColor: '#FFD700', padding: { x: 10, y: 6 },
            fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5).setDepth(501).setInteractive({ useHandCursor: true });

        let exitBtn = this.add.text(cx, cy + 80, '[ RETURN TO LOUNGE ]', {
            fontSize: '8px', fill: '#FF5555', backgroundColor: '#000000', padding: { x: 8, y: 4 },
            fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5).setDepth(501).setInteractive({ useHandCursor: true });

        restartBtn.on('pointerdown', () => {
            this.scene.restart();
        });
        exitBtn.on('pointerdown', () => {
            this.exitCabinet();
        });

        this.input.keyboard.on('keydown-ENTER', () => {
            if (this.gameState === 'gameover') this.scene.restart();
        });
    }

    exitCabinet() {
        if (this.physics && this.physics.world && this.physics.world.gravity) {
            this.physics.world.gravity.y = 1000;
        }
        if (this.invulnShield) this.invulnShield.setVisible(false);
        if (this.player) this.player.clearTint();
        if (this.joyBase) this.joyBase.setVisible(false);
        if (this.joyKnob) this.joyKnob.setVisible(false);
        if (this.overlayFireContainer) this.overlayFireContainer.setVisible(false);
        if (this.overlayBombContainer) this.overlayBombContainer.setVisible(false);
        this.touchFireActive = false;
        this.joystickActive = false;
        if (this._cleanWindowListeners) {
            this._cleanWindowListeners();
        }
        if (this.edgeScene && this.edgeScene.scene) {
            this.edgeScene.scene.setVisible(true);
            this.edgeScene.scene.resume();
        }
        this.scene.stop('ArcadeShooterScene');
        if (this.edgeScene && this.edgeScene.onReturnFromArcade) {
            this.edgeScene.onReturnFromArcade(this.score);
        }
    }

    update(time, delta) {
        const dt = delta / 1000;

        // Scroll Starfield
        for (let i = 0; i < this.stars.length; i++) {
            let s = this.stars[i];
            s.obj.y += s.speed * dt;
            if (s.obj.y > this.playY + this.playH - 4) {
                s.obj.y = this.playY + 4;
                s.obj.x = this.playX + Phaser.Math.Between(4, this.playW - 4);
            }
        }

        if (this.gameState !== 'playing') return;

        // Player Movement (Keyboard WASD/Arrows + Floating Joystick)
        let isLeft = (this.cursors.left && this.cursors.left.isDown) || (this.keys.a && this.keys.a.isDown) || (this.mobileInput && this.mobileInput.left);
        let isRight = (this.cursors.right && this.cursors.right.isDown) || (this.keys.d && this.keys.d.isDown) || (this.mobileInput && this.mobileInput.right);
        let isUp = (this.cursors.up && this.cursors.up.isDown) || (this.keys.w && this.keys.w.isDown) || (this.mobileInput && this.mobileInput.up);
        let isDown = (this.cursors.down && this.cursors.down.isDown) || (this.keys.s && this.keys.s.isDown) || (this.mobileInput && this.mobileInput.down);

        let vx = 0;
        let vy = 0;
        const pSpeed = 240;

        if (this.joystickActive && (this.joystickVx !== 0 || this.joystickVy !== 0)) {
            vx = this.joystickVx;
            vy = this.joystickVy;
        } else {
            if (isLeft && !isRight) vx = -pSpeed;
            else if (isRight && !isLeft) vx = pSpeed;

            if (isUp && !isDown) vy = -pSpeed;
            else if (isDown && !isUp) vy = pSpeed;

            if (vx !== 0 && vy !== 0) {
                vx *= 0.7071;
                vy *= 0.7071;
            }
        }

        this.player.x += vx * dt;
        this.player.y += vy * dt;
        this.player.x = Phaser.Math.Clamp(this.player.x, this.playX + 16, this.playX + this.playW - 16);
        this.player.y = Phaser.Math.Clamp(this.player.y, this.playY + 60, this.playY + this.playH - 30);
        this.player.body.reset(this.player.x, this.player.y);
        this.player.setVisible(true);
        this.player.setActive(true);

        this.thruster.setPosition(this.player.x, this.player.y + 16);
        this.thruster.setScale(Phaser.Math.Between(8, 12) / 10);
        this.shieldSprite.setPosition(this.player.x, this.player.y);
        if (this.shieldHits > 0) {
            this.shieldSprite.angle += 1.5;
        }

        // Invulnerability Forcefield & Golden Sparkle Surge (Ship is 100% visible, never transparent or hidden!)
        if (this.invulnerableTimer > 0) {
            this.invulnerableTimer -= delta;
            this.player.setAlpha(1.0);
            this.thruster.setAlpha(1.0);

            // Sparkling golden energy surge across hull (only when recovering from life loss, not during shield deflection)
            if (this.shieldHits === 0) {
                const isTint = Math.floor(this.invulnerableTimer / 70) % 2 === 0;
                this.player.setTint(isTint ? 0xFFFFAA : 0xFFD700);

                // Pulse glowing invulnerability forcefield around the ship
                if (this.invulnShield) {
                    this.invulnShield.setPosition(this.player.x, this.player.y).setVisible(true);
                    const pulse = 1.0 + Math.sin(time * 0.015) * 0.12;
                    this.invulnShield.setScale(pulse);
                    this.invulnShield.setAlpha(0.75 + Math.sin(time * 0.02) * 0.25);
                }
            }

            if (this.invulnerableTimer <= 0) {
                this.invulnerableTimer = 0;
                this.player.clearTint();
                if (this.invulnShield) {
                    this.invulnShield.setVisible(false);
                }
            }
        }

        // Continuous Fire while Space/Z/Fire Button held
        if (this.cursors.space.isDown || this.keys.space.isDown || this.keys.z.isDown || this.touchFireActive) {
            this.fireLaser();
        }

        // Clean off-screen player lasers (all the way to the top of screen)
        this.playerLasers.getChildren().forEach(laser => {
            if (laser.y < this.playY - 16 || laser.y > this.playY + this.playH + 16 || laser.x < this.playX - 16 || laser.x > this.playX + this.playW + 16) {
                laser.destroy();
            }
        });

        // Clean off-screen enemy bullets
        this.enemyBullets.getChildren().forEach(b => {
            if (b.y > this.playY + this.playH || b.x < this.playX || b.x > this.playX + this.playW) {
                b.destroy();
            }
        });

        // Update Enemies
        this.enemies.getChildren().forEach(e => {
            if (e.isBoss) return;

            // Confine enemy horizontal movement within CRT monitor playfield (bounce off side edges)
            if (e.body && e.body.velocity) {
                if (e.x <= this.playX + 18 && e.body.velocity.x < 0) {
                    e.setVelocityX(Math.abs(e.body.velocity.x));
                } else if (e.x >= this.playX + this.playW - 18 && e.body.velocity.x > 0) {
                    e.setVelocityX(-Math.abs(e.body.velocity.x));
                }
            }

            // Sine wave drone movement with horizontal clamp
            if (e.sineOffset !== undefined) {
                e.x += Math.sin((time + e.sineOffset) * 0.005) * 1.5;
                e.x = Phaser.Math.Clamp(e.x, this.playX + 16, this.playX + this.playW - 16);
            }

            // Enemy Shooting
            if (time - e.lastShoot > e.shootCooldown && e.y > this.playY + 20 && e.y < this.playY + this.playH - 60) {
                e.lastShoot = time;
                let b = this.enemyBullets.create(e.x, e.y + 10, 'shooter_bullet_enemy').setDepth(12);
                b.setVelocityY(160 + this.wave * 12);
            }

            // Clean off-screen enemies (bottom, or abnormal horizontal drift)
            if (e.y > this.playY + this.playH + 20 || e.x < this.playX - 40 || e.x > this.playX + this.playW + 40) {
                e.destroy();
            }
        });

        // Update Boss
        if (this.bossActive) {
            this.updateBoss(time, delta);
        }

        // Clean off-screen powerups
        this.powerups.getChildren().forEach(p => {
            if (p.y > this.playY + this.playH + 10 || p.x < this.playX - 20 || p.x > this.playX + this.playW + 20) {
                p.destroy();
            }
        });
    }
}

