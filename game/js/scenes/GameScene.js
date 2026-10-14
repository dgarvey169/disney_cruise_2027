class GameScene extends Phaser.Scene {
    constructor() { super('GameScene'); }
    
    init(data) {
        this.selectedCharacter = (data && data.character) || 'riley'; 
        this.characterName = (data && data.name) || 'Riley';
    }

    create() {
        this.physics.world.setBounds(0, 0, 2400, 1400);
        this.cameras.main.setBounds(0, 0, 2400, 1400);

        // --- BACKGROUND GRAPHICS ---
        // Sun (fixed in the sky)
        this.add.image(600, 150, 'sun').setScrollFactor(0.05);

        // Clouds (Parallax)
        for (let i = 0; i < 15; i++) {
            let cx = Phaser.Math.Between(0, 2400);
            let cy = Phaser.Math.Between(50, 400);
            let sf = 0.1 + (Math.random() * 0.2); // Parallax factor
            this.add.image(cx, cy, 'cloud').setScrollFactor(sf).setAlpha(0.8).setScale(0.5 + Math.random());
        }

        // Birds
        for (let i = 0; i < 8; i++) {
            let bx = Phaser.Math.Between(0, 2400);
            let by = Phaser.Math.Between(100, 500);
            let sf = 0.2 + (Math.random() * 0.3);
            let bird = this.add.image(bx, by, 'bird').setScrollFactor(sf);
            // Simple bird animation tween
            this.tweens.add({
                targets: bird,
                y: by - 10,
                duration: 500 + Math.random() * 500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }

        // Ocean Horizon
        // Deck 11 is around y=1200, so horizon should be visible behind the decks.
        // The game world is 1400 tall. 
        // We'll place the ocean at the bottom of the screen with a very low scroll factor.
        this.oceanBg = this.add.tileSprite(0, 400, this.scale.width, 1400, 'ocean_bg')
            .setOrigin(0, 0)
            .setScrollFactor(0, 0.1);

        const resizeHandler = (gameSize) => {
            if (this.sys && this.sys.isActive()) {
                if (this.oceanBg) this.oceanBg.setSize(gameSize.width, 1400);
                this.layoutHUD(gameSize.width, gameSize.height);
            }
        };
        this.scale.on('resize', resizeHandler);
        this.events.once('shutdown', () => {
            this.scale.off('resize', resizeHandler);
            if (this.cursorTween) {
                this.cursorTween.stop();
                this.cursorTween = null;
            }
        });

        // --- SHIP WALLS (ANGLED 3/4 ISOMETRIC PERSPECTIVE) ---
        // Deck 11 lower hull (beneath y=1280 down to y=1420)
        this.add.tileSprite(0, 1280, 2400, 140, 'ship_wall').setOrigin(0, 0);

        // Deck 12 wall (behind Deck 11, from Deck 12 floor y=1000 down to Deck 11 back wall y=1220) - Full width
        this.add.tileSprite(0, 1000, 2400, 220, 'ship_wall').setOrigin(0, 0);

        // Deck 13 wall (behind Deck 12, from Deck 13 floor y=760 down to Deck 12 back wall y=940) - Full width
        this.add.tileSprite(0, 760, 2400, 180, 'ship_wall').setOrigin(0, 0);

        // Top of AquaMouse structure (from launch deck y=340 down to Deck 13 back wall y=700)
        this.add.tileSprite(700, 340, 100, 360, 'ship_wall').setOrigin(0, 0);

        // 8-bit Architectural Baseboard Trim Lines between vertical walls and horizontal deck corridors
        this.add.rectangle(0, 1220, 2400, 2, 0x182030).setOrigin(0, 1).setDepth(2);
        this.add.rectangle(0, 940, 2400, 2, 0x182030).setOrigin(0, 1).setDepth(2);
        this.add.rectangle(0, 700, 2400, 2, 0x182030).setOrigin(0, 1).setDepth(2);

        // Upper Deck Overhang Ambient Occlusion Shadows
        this.add.tileSprite(0, 1220, 2400, 10, 'deck_overhang_shadow').setOrigin(0, 0).setDepth(3);
        this.add.tileSprite(0, 940, 2400, 10, 'deck_overhang_shadow').setOrigin(0, 0).setDepth(3);
        this.add.tileSprite(0, 700, 2400, 10, 'deck_overhang_shadow').setOrigin(0, 0).setDepth(3);

        const platforms = this.physics.add.staticGroup();
        const water = this.physics.add.staticGroup();
        this.water = water;
        const slides = this.physics.add.staticGroup();
        const doors = this.physics.add.staticGroup();

        const createStaircase = (startX, startY, steps, dirX, dirY) => {
            // 3D Angled Structural Truss Girder beneath the steps
            let trussG = this.add.graphics().setDepth(startY - 5);
            trussG.lineStyle(6, 0x182028, 1);
            trussG.beginPath();
            trussG.moveTo(startX, startY + 14);
            trussG.lineTo(startX + (steps * 40 * dirX), startY + (steps * 40 * dirY) + 14);
            trussG.strokePath();
            trussG.lineStyle(2, 0x586068, 1);
            trussG.beginPath();
            trussG.moveTo(startX, startY + 11);
            trussG.lineTo(startX + (steps * 40 * dirX), startY + (steps * 40 * dirY) + 11);
            trussG.strokePath();

            // Visual 3D steps with depth treads and risers
            for (let i = 0; i < steps; i++) {
                let sx = startX + (i * 40 * dirX);
                let sy = startY + (i * 40 * dirY);
                this.add.image(sx, sy, 'stair_step_3d').setDepth(sy); // Authentic 3D tread & riser
                this.add.image(sx, sy - 20, 'railing').setDepth(sy + 10);
            }
        };

        // ----------------------------------------------------
        // DECK 11 (Main Pool Deck) - y: 1220 to 1280 (Depth: 60px)
        // ----------------------------------------------------
        this.add.tileSprite(0, 1220, 890, 60, 'deck_3d').setOrigin(0, 0).setDepth(1);
        this.add.tileSprite(890, 1220, 300, 60, 'pool_3d_basin').setOrigin(0, 0).setDepth(1);
        this.add.tileSprite(1190, 1220, 1210, 60, 'deck_3d').setOrigin(0, 0).setDepth(1);
        
        doors.create(400, 1190, 'door'); 
        this.add.text(350, 1145, 'SENSES SPA', { fontSize: '9px', fill: '#FFD700', backgroundColor: '#001024', padding: { x: 6, y: 4 }, fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 2 });
        
        doors.create(2100, 1190, 'door');
        this.add.text(2010, 1145, 'MARCELINE MARKET', { fontSize: '9px', fill: '#58B8F8', backgroundColor: '#001024', padding: { x: 6, y: 4 }, fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 2 });
        // Dynamic 8-Bit Funnel Vision Screen
        this.createFunnelVision();

        const iceCreamStands = this.physics.add.staticGroup();
        iceCreamStands.create(1500, 1190, 'icecream_stand');
        this.add.text(1430, 1145, 'EYE SCREAM TREATS', { fontSize: '9px', fill: '#F85898', backgroundColor: '#001024', padding: { x: 6, y: 4 }, fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 2 });

        // Stairs up to Deck 12 (right-up): connects Deck 11 (y=1280) to Deck 12 (y=1000)
        createStaircase(60, 1280, 7, 1, -1);

        // ----------------------------------------------------
        // DECK 12 (Splashdown & Hero Zone) - y: 940 to 1000 (Depth: 60px)
        // ----------------------------------------------------
        this.add.tileSprite(0, 940, 530, 60, 'deck_3d').setOrigin(0, 0).setDepth(1);
        this.add.tileSprite(530, 940, 200, 60, 'pool_3d_basin').setOrigin(0, 0).setDepth(1);
        this.add.tileSprite(730, 940, 970, 60, 'deck_3d').setOrigin(0, 0).setDepth(1);
        this.add.tileSprite(1700, 940, 200, 60, 'pool_3d_basin').setOrigin(0, 0).setDepth(1);
        this.add.tileSprite(1900, 940, 500, 60, 'deck_3d').setOrigin(0, 0).setDepth(1);

        doors.create(140, 910, 'door');
        this.add.text(80, 865, 'COVE CAFE', { fontSize: '9px', fill: '#00F8A0', backgroundColor: '#001024', padding: { x: 6, y: 4 }, fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 2 });
        this.add.text(590, 915, 'SPLASHDOWN', { fontSize: '9px', fill: '#58B8F8', backgroundColor: '#001024', padding: { x: 6, y: 4 }, fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 2 });
        this.add.text(1680, 915, 'TOY STORY SPLASH', { fontSize: '9px', fill: '#F8A800', backgroundColor: '#001024', padding: { x: 6, y: 4 }, fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 2 });

        const hzDoor = doors.create(2000, 910, 'door');
        hzDoor.setInteractive({ useHandCursor: true });
        hzDoor.on('pointerdown', () => this.openHeroZone());

        const hzSign = this.add.text(2000, 855, '★ HERO ZONE ★', {
            fontSize: '9px', fill: '#FFD700', backgroundColor: '#D01000', padding: { x: 8, y: 4 },
            fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5).setDepth(20).setInteractive({ useHandCursor: true });
        hzSign.on('pointerdown', () => this.openHeroZone());

        const hzEnterPrompt = this.add.text(2000, 875, '▼ TAP / ENTER ▼', {
            fontSize: '7px', fill: '#FFFFFF', backgroundColor: '#001024', padding: { x: 5, y: 2 },
            fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(20).setInteractive({ useHandCursor: true });
        hzEnterPrompt.on('pointerdown', () => this.openHeroZone());

        this.tweens.add({
            targets: [hzSign, hzEnterPrompt],
            y: '-=3',
            duration: 600,
            yoyo: true,
            repeat: -1
        });

        // Stairs up to Deck 13 (left-up): connects Deck 12 (y=1000) to Deck 13 (y=760)
        createStaircase(2300, 1000, 6, -1, -1);

        // ----------------------------------------------------
        // DECK 13 (AquaMouse Deck) - y: 700 to 760 (Depth: 60px)
        // ----------------------------------------------------
        this.add.tileSprite(0, 700, 2400, 60, 'deck_3d').setOrigin(0, 0).setDepth(1);

        this.add.text(1170, 675, 'AQUAMOUSE ENTRANCE', { fontSize: '9px', fill: '#FFD700', backgroundColor: '#001024', padding: { x: 6, y: 4 }, fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 2 });


        // AquaMouse Raft Lift
        this.raft = this.physics.add.sprite(1200, 730, 'raft');
        this.raft.body.allowGravity = false;
        this.raft.setImmovable(true);
        
        let liftZone = this.add.zone(1200, 730, 80, 80);
        this.physics.world.enable(liftZone);
        liftZone.body.allowGravity = false;
        
        this.ridingRaft = false;
        this.liftZone = liftZone;

        // Top Deck of AquaMouse
        this.add.tileSprite(700, 320, 100, 20, 'deck_3d').setOrigin(0, 0).setDepth(1);
        this.add.text(670, 275, 'AQUAMOUSE LAUNCH', { fontSize: '9px', fill: '#FFD700', backgroundColor: '#001024', padding: { x: 6, y: 4 }, fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 2 });

        // Midship Elevators & Interaction Zones (Decks 11 & 12)
        this.elevators = this.physics.add.staticGroup();
        this.elevators.create(1250, 1190, 'elevator_door').setDepth(1190); // Deck 11
        this.elevators.create(1250, 910, 'elevator_door').setDepth(910);   // Deck 12
        
        // Interaction Zones
        this.elevatorZones = this.physics.add.staticGroup();
        this.elevatorZones.add(this.add.zone(1250, 1255, 60, 60)); // Deck 11
        this.elevatorZones.add(this.add.zone(1250, 975, 60, 60));  // Deck 12
        // Enable physics on zones
        this.elevatorZones.getChildren().forEach(z => this.physics.add.existing(z, true));

        // --- 3D POOL WATER SUBMERSION COPING & CORRIDORS ---
        // Marble front coping and translucent water surface overlay for 3D pool submersion
        this.add.tileSprite(890, 1268, 300, 14, 'pool_front_coping_3d').setOrigin(0, 0).setDepth(1282);
        this.add.tileSprite(530, 988, 200, 14, 'pool_front_coping_3d').setOrigin(0, 0).setDepth(1002);
        this.add.tileSprite(1700, 988, 200, 14, 'pool_front_coping_3d').setOrigin(0, 0).setDepth(1002);

        this.pools = [
            { name: 'deck11_main', xMin: 890, xMax: 1190, yMin: 1220, yMax: 1280 },
            { name: 'deck12_splashdown', xMin: 530, xMax: 730, yMin: 940, yMax: 1000 },
            { name: 'deck12_toystory', xMin: 1700, xMax: 1900, yMin: 940, yMax: 1000 }
        ];

        // --- 3D DECK SLAB FASCIA (STRUCTURAL DECK THICKNESS) ---
        this.add.tileSprite(0, 1280, 2400, 12, 'deck_fascia').setOrigin(0, 0).setDepth(1340);
        this.add.tileSprite(0, 1000, 300, 12, 'deck_fascia').setOrigin(0, 0).setDepth(1040);
        this.add.tileSprite(345, 1000, 2055, 12, 'deck_fascia').setOrigin(0, 0).setDepth(1040);
        this.add.tileSprite(0, 760, 2055, 12, 'deck_fascia').setOrigin(0, 0).setDepth(800);
        this.add.tileSprite(2100, 760, 300, 12, 'deck_fascia').setOrigin(0, 0).setDepth(800);
        this.add.tileSprite(700, 340, 100, 12, 'deck_fascia').setOrigin(0, 0).setDepth(340); // Top deck

        // --- FOREGROUND RAILINGS WITH INTEGRATED STAIRWELL OPENINGS ---
        this.add.tileSprite(0, 1280, 2400, 40, 'railing').setOrigin(0, 0).setDepth(1350);

        // Deck 12 railing with Stair 1 stairwell opening (x: 300..345)
        this.add.tileSprite(0, 1000, 300, 40, 'railing').setOrigin(0, 0).setDepth(1050);
        this.add.tileSprite(345, 1000, 2055, 40, 'railing').setOrigin(0, 0).setDepth(1050);
        this.add.rectangle(300, 1000, 4, 38, 0x182030).setOrigin(0.5, 0).setDepth(1051);
        this.add.rectangle(345, 1000, 4, 38, 0x182030).setOrigin(0.5, 0).setDepth(1051);
        this.add.rectangle(300, 998, 6, 4, 0xF8B800).setOrigin(0.5, 0).setDepth(1052);
        this.add.rectangle(345, 998, 6, 4, 0xF8B800).setOrigin(0.5, 0).setDepth(1052);

        // Deck 13 railing with Stair 2 stairwell opening (x: 2055..2100)
        this.add.tileSprite(0, 760, 2055, 40, 'railing').setOrigin(0, 0).setDepth(810);
        this.add.tileSprite(2100, 760, 300, 40, 'railing').setOrigin(0, 0).setDepth(810);
        this.add.rectangle(2055, 760, 4, 38, 0x182030).setOrigin(0.5, 0).setDepth(811);
        this.add.rectangle(2100, 760, 4, 38, 0x182030).setOrigin(0.5, 0).setDepth(811);
        this.add.rectangle(2055, 758, 6, 4, 0xF8B800).setOrigin(0.5, 0).setDepth(812);
        this.add.rectangle(2100, 758, 6, 4, 0xF8B800).setOrigin(0.5, 0).setDepth(812);

        this.add.tileSprite(700, 340, 100, 40, 'railing').setOrigin(0, 0).setDepth(350); // Top deck

        // The AquaMouse Slide (circular loop around the deck!)
        let slideCurve = new Phaser.Curves.Spline([
            750, 360,
            400, 150,
            -50, 250,
            -50, 500,
            400, 700,
            500, 900,
            630, 1000
        ]);

        this.slideCurve = slideCurve;
        // Draw the lift tube visually with depth-sorted graphics segments
        let liftCurve = new Phaser.Curves.Line([1200, 750, 750, 360]);
        let liftPoints = liftCurve.getSpacedPoints(40);
        for (let i = 0; i < liftPoints.length - 1; i++) {
            let p1 = liftPoints[i];
            let p2 = liftPoints[i+1];
            let g = this.add.graphics();
            g.lineStyle(40, 0x58D8F8, 0.85);
            g.fillStyle(0x58D8F8, 0.85);
            g.fillCircle(p1.x, p1.y, 20); // Round joint
            g.beginPath();
            g.moveTo(p1.x, p1.y);
            g.lineTo(p2.x, p2.y);
            g.strokePath();
            
            g.lineStyle(2, 0x0000FF, 1);
            g.beginPath();
            g.moveTo(p1.x + 20, p1.y - 10);
            g.lineTo(p2.x + 20, p2.y - 10);
            g.moveTo(p1.x - 20, p1.y + 10);
            g.lineTo(p2.x - 20, p2.y + 10);
            g.strokePath();
            
            g.setDepth(p1.y + 1);
        }

        // Villain Mountain Enclosure (Solid-colored structure around the forward funnel)
        let mountainG = this.add.graphics().setDepth(365); // In front of Top Deck (340) and lift tube top (361)
        mountainG.fillStyle(0x303040, 1);
        mountainG.fillRoundedRect(680, 200, 140, 160, 20); // Dark grey mountain base
        mountainG.fillStyle(0x404050, 1);
        mountainG.fillRoundedRect(700, 150, 100, 100, 20); // Peak
        this.add.text(750, 220, 'VILLAIN\nMOUNTAIN', { fontSize: '9px', fill: '#FF4444', fontFamily: '"Press Start 2P", monospace', align: 'center', stroke: '#000000', strokeThickness: 2 }).setOrigin(0.5).setDepth(366);

        // Toxic Green Smoke Emitter
        let pg = this.make.graphics({x: 0, y: 0, add: false});
        pg.fillStyle(0xFFFFFF, 1);
        pg.fillRect(0, 0, 8, 8);
        pg.generateTexture('smoke_particle', 8, 8);
        
        let smokeEmitter = this.add.particles(750, 160, 'smoke_particle', {
            speed: { min: 10, max: 40 },
            angle: { min: 250, max: 290 },
            scale: { start: 1, end: 3 },
            alpha: { start: 0.8, end: 0 },
            lifespan: 3000,
            frequency: 300,
            tint: [ 0x33FF33, 0x00AA00, 0x88FF33 ], // toxic green variations
            blendMode: 'NORMAL'
        });
        smokeEmitter.setDepth(364); // Rising from behind the peak
        // Brightly colored exit flume at Deck 12 Splashdown
        let flumeG = this.add.graphics().setDepth(1001);
        flumeG.fillStyle(0xFF5500, 1); // Bright orange flume
        flumeG.fillRoundedRect(600, 950, 60, 50, 10);
        flumeG.fillStyle(0xFFFF00, 1); // Yellow stripes
        flumeG.fillRect(610, 950, 5, 50);
        flumeG.fillRect(645, 950, 5, 50);

        // Draw the looping slide visually with depth-sorted graphics segments
        let slidePoints = slideCurve.getSpacedPoints(180); // Increased points for smoother larger curve
        for (let i = 0; i < slidePoints.length - 1; i++) {
            let p1 = slidePoints[i];
            let p2 = slidePoints[i+1];
            let g = this.add.graphics();
            
            // Clear acrylic tube
            g.lineStyle(40, 0x88CCFF, 0.45);
            g.fillStyle(0x88CCFF, 0.45);
            g.fillCircle(p1.x, p1.y, 20); // Round joint
            g.beginPath();
            g.moveTo(p1.x, p1.y);
            g.lineTo(p2.x, p2.y);
            g.strokePath();
            
            // White shiny reflection on the top edge of the tube
            g.lineStyle(4, 0xFFFFFF, 0.7);
            g.beginPath();
            g.moveTo(p1.x - 10, p1.y - 10);
            g.lineTo(p2.x - 10, p2.y - 10);
            g.strokePath();
            
            // Industrial metallic flanges every 10 segments
            if (i % 10 === 0) {
                g.lineStyle(6, 0xAAAAAA, 1); // Grey metal ring
                g.beginPath();
                g.moveTo(p1.x - 22, p1.y - 22);
                g.lineTo(p1.x + 22, p1.y + 22);
                g.strokePath();
                // Add tiny bolts (dots)
                g.fillStyle(0x444444, 1);
                g.fillCircle(p1.x - 18, p1.y - 18, 2);
                g.fillCircle(p1.x + 18, p1.y + 18, 2);
            }
            
            g.setDepth(Math.max(p1.y + 1, 815));
        }

        // --- TOP-MOUNTED CAPCOM RETRO HUD ---
        this.score = 2500;
        this.hudBg = this.add.graphics().setScrollFactor(0).setDepth(3000);

        // Player Avatar Icon & Name
        let playerIconKey = this.selectedCharacter === 'riley' ? 'riley_idle' : 'amelia_idle';
        this.hudPlayerIcon = this.add.image(24, 21, playerIconKey).setScale(0.7).setScrollFactor(0).setDepth(3001);
        this.hudPlayerName = this.add.text(42, 14, this.characterName.toUpperCase(), {
            fontSize: '10px', fill: '#FFD700', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 3
        }).setScrollFactor(0).setDepth(3001);

        // Retro HP Hit-Point Nodes
        this.hudHpText = this.add.text(135, 14, 'HP', {
            fontSize: '10px', fill: '#FFFFFF', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 3
        }).setScrollFactor(0).setDepth(3001);
        this.hpNodes = [];
        for (let i = 0; i < 4; i++) {
            let node = this.add.image(175 + i * 18, 20, 'hp_node_full').setScrollFactor(0).setDepth(3001);
            this.hpNodes.push(node);
        }

        // Center Location Banner
        this.hudLocation = this.add.text(480, 20, '[ DECK 11: MAIN POOL ]', {
            fontSize: '9px', fill: '#58B8F8', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5).setScrollFactor(0).setDepth(3001);

        // Right Zero-Padded Currency/Score Counter: $0002500
        this.hudCoinIcon = this.add.image(740, 20, 'coin_icon').setScrollFactor(0).setDepth(3001);
        this.hudScoreText = this.add.text(755, 14, '$0002500', {
            fontSize: '10px', fill: '#FFFFFF', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 3
        }).setScrollFactor(0).setDepth(3001);

        // Ice Cream Status Indicator Icon
        this.hudIceCreamIcon = this.add.image(890, 20, 'icecream_strawberry').setScale(0.8).setScrollFactor(0).setDepth(3001).setVisible(false);

        // Retro Capcom [MENU] Button
        this.hudMenuBtn = this.add.text(0, 0, '[MENU]', {
            fontSize: '10px', fill: '#FFD700', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 3
        }).setOrigin(1, 0.5).setPadding(8, 8, 8, 8).setScrollFactor(0).setDepth(3001).setInteractive({ useHandCursor: true });
        this.hudMenuBtn.on('pointerover', () => this.hudMenuBtn.setFill('#FFFFFF'));
        this.hudMenuBtn.on('pointerout', () => this.hudMenuBtn.setFill('#FFD700'));
        this.hudMenuBtn.on('pointerdown', () => this.toggleInGameMenu());

        this.createInGameMenu();

        this.layoutHUD(this.scale.width, this.scale.height);

        // --- 2.5D DEPTH MOVEMENT & PLAYER INITIALIZATION ---
        this.groundY = 1255; // Initial Deck 11 floor Y (midway in 1220..1280 corridor)
        this.jumpZ = 0;
        this.jumpV = 0;
        this.isJumping = false;
        this.currentDeck = 'deck11';
        this.currentStair = null;

        let spawnY = 1255;
        this.player = this.physics.add.sprite(700, spawnY, this.selectedCharacter);
        this.player.setBounce(0.0);
        this.player.setCollideWorldBounds(true);
        this.player.body.allowGravity = false;
        this.player.setDepth(spawnY);
        if (this.selectedCharacter === 'riley') {
            this.player.body.setSize(22, 16);
            this.player.body.setOffset(5, 32);
        } else {
            this.player.body.setSize(22, 16);
            this.player.body.setOffset(5, 24);
        }
        this.player.setInteractive({ useHandCursor: true });
        this.player.on('pointerdown', () => {
            if (this.isMenuOpen) return;
            if (this.canBoardRaft()) {
                this.boardRaft();
            }
        });

        // 2.5D Ground Shadow
        this.playerShadow = this.add.image(700, spawnY + 18, 'player_shadow').setOrigin(0.5, 0.5).setDepth(spawnY - 1);

        // Register 8-bit Character Animations
        ['riley', 'amelia'].forEach(c => {
            if (!this.anims.exists(c + '_idle')) {
                this.anims.create({
                    key: c + '_idle',
                    frames: [{ key: c + '_idle' }],
                    frameRate: 1
                });
            }
            if (!this.anims.exists(c + '_walk')) {
                this.anims.create({
                    key: c + '_walk',
                    frames: [
                        { key: c + '_walk_0' },
                        { key: c + '_walk_1' },
                        { key: c + '_walk_2' },
                        { key: c + '_walk_1' }
                    ],
                    frameRate: 8,
                    repeat: -1
                });
            }
            if (!this.anims.exists(c + '_jump')) {
                this.anims.create({
                    key: c + '_jump',
                    frames: [{ key: c + '_jump' }],
                    frameRate: 1
                });
            }
        });

        // Register Ambient NPC Animations
        if (!this.anims.exists('npc_officer_walk')) {
            this.anims.create({
                key: 'npc_officer_walk',
                frames: [
                    { key: 'npc_officer_walk_0' },
                    { key: 'npc_officer_idle' },
                    { key: 'npc_officer_walk_1' },
                    { key: 'npc_officer_idle' }
                ],
                frameRate: 6,
                repeat: -1
            });
        }
        if (!this.anims.exists('npc_officer_idle')) {
            this.anims.create({
                key: 'npc_officer_idle',
                frames: [{ key: 'npc_officer_idle' }],
                frameRate: 1
            });
        }
        if (!this.anims.exists('npc_tourist_walk')) {
            this.anims.create({
                key: 'npc_tourist_walk',
                frames: [
                    { key: 'npc_tourist_walk_0' },
                    { key: 'npc_tourist_idle' },
                    { key: 'npc_tourist_walk_1' },
                    { key: 'npc_tourist_idle' }
                ],
                frameRate: 6,
                repeat: -1
            });
        }
        if (!this.anims.exists('npc_tourist_idle')) {
            this.anims.create({
                key: 'npc_tourist_idle',
                frames: [{ key: 'npc_tourist_idle' }],
                frameRate: 1
            });
        }
        if (!this.anims.exists('npc_lounger_relax')) {
            this.anims.create({
                key: 'npc_lounger_relax',
                frames: [
                    { key: 'npc_lounger_0', duration: 3200 },
                    { key: 'npc_lounger_1', duration: 1200 }
                ],
                frameRate: 1,
                repeat: -1
            });
        }
        if (!this.anims.exists('npc_swimmer_bob')) {
            this.anims.create({
                key: 'npc_swimmer_bob',
                frames: [
                    { key: 'npc_swimmer_0', duration: 800 },
                    { key: 'npc_swimmer_1', duration: 800 }
                ],
                frameRate: 1,
                repeat: -1
            });
        }

        // Initialize Ambient NPCs
        this.createAmbientNPCs();

        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

        window.gameScene = this;

        // AquaMouse boarding zone - show prompt, require Enter/tap
        this.nearRaft = false;
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        const isTouch = !this.sys.game.device.os.desktop || this.sys.game.device.input.touch;
        const promptLabel = isTouch ? '[ TAP TO BOARD AQUAMOUSE! ]' : '[ ENTER: BOARD AQUAMOUSE! ]';
        this.boardPromptText = this.add.text(1200, 700, promptLabel, {
            fontSize: '10px', fill: '#FFD700', backgroundColor: '#001024', padding: { x: 10, y: 8 },
            fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5).setDepth(25).setVisible(false);
        this.boardPromptText.setInteractive({ useHandCursor: true });
        this.boardPromptText.on('pointerdown', () => this.boardRaft());

        this.physics.add.overlap(this.player, this.liftZone, () => {
            this.nearRaft = true;
        });

        // Midship Elevator interaction prompt & overlap
        this.nearElevator = false;
        const elevatorPromptLabel = isTouch ? '[ TAP TO USE ELEVATOR ]' : '[ ENTER: USE ELEVATOR ]';
        this.elevatorPromptText = this.add.text(1250, 700, elevatorPromptLabel, {
            fontSize: '10px', fill: '#FFFFFF', backgroundColor: '#0000AA', padding: { x: 10, y: 8 },
            fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5).setDepth(2000).setVisible(false).setInteractive({ useHandCursor: true });
        this.elevatorPromptText.on('pointerdown', () => this.openElevatorMenu());

        this.physics.add.overlap(this.player, this.elevatorZones, () => {
            this.nearElevator = true;
        });

        // Hero Zone Door logic
        this.nearHeroZone = false;
        const heroZonePromptLabel = isTouch ? '[ TAP TO ENTER HERO ZONE ]' : '[ ENTER: ENTER HERO ZONE ]';
        this.heroZonePromptText = this.add.text(2000, 800, heroZonePromptLabel, {
            fontSize: '10px', fill: '#FFD700', backgroundColor: '#D01000', padding: { x: 10, y: 8 },
            fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5).setDepth(2000).setVisible(false).setInteractive({ useHandCursor: true });
        this.heroZonePromptText.on('pointerdown', () => this.openHeroZone());

        this.heroZoneDoorZone = this.add.zone(2000, 975, 120, 100);
        this.physics.add.existing(this.heroZoneDoorZone, true);
        this.physics.add.overlap(this.player, this.heroZoneDoorZone, () => {
            if (this.currentDeck === 'deck12') {
                this.nearHeroZone = true;
            }
        });


        // Board the raft
        const boardRaft = () => {
            if (this.ridingRaft) return;
            this.ridingRaft = true;

            if (this.boardPromptText) this.boardPromptText.setVisible(false);

            // Crucial: disable body collisions so platforms and decks do not fight the tween
            if (this.player && this.player.body) {
                this.player.body.enable = false;
                this.player.setVelocity(0, 0);
            }

            // Snap player directly to raft seat
            this.player.x = this.raft.x;
            this.player.y = this.raft.y - 24;

            // 1. Lift Tween - player sits on top of raft
            this.tweens.add({
                targets: [this.player, this.raft],
                x: 750,
                y: 350,
                duration: 3000,
                ease: 'Sine.easeInOut',
                onUpdate: () => {
                    // Keep player seated on raft during lift
                    this.player.x = this.raft.x;
                    this.player.y = this.raft.y - 24;
                    // Dynamic depth ordering to sit inside the lift tube
                    this.raft.setDepth(this.raft.y);
                    this.player.setDepth(this.raft.y);
                },
                onComplete: () => {
                    // Show Villain Dialogue Box inside Villain Mountain
                    let quotes = [
                        "FOOLS! PREPARE FOR\nTHE DROP...",
                        "YOU THINK THIS IS\nA JOKE? BWAHAHA!",
                        "THE UNDERWORLD\nAWAITS YOU...",
                        "MWAHAHAHA!\nHOLD ON TIGHT!"
                    ];
                    let quote = quotes[Math.floor(Math.random() * quotes.length)];
                    
                    let dialogBg = this.add.graphics().setDepth(4000).setScrollFactor(0);
                    dialogBg.fillStyle(0x000000, 0.8);
                    dialogBg.lineStyle(2, 0x33FF33, 1);
                    dialogBg.fillRoundedRect(this.cameras.main.width/2 - 150, 60, 300, 60, 8);
                    dialogBg.strokeRoundedRect(this.cameras.main.width/2 - 150, 60, 300, 60, 8);
                    
                    let dialogText = this.add.text(this.cameras.main.width/2, 90, quote, {
                        fontFamily: '"Press Start 2P", monospace',
                        fontSize: '10px',
                        fill: '#33FF33',
                        align: 'center',
                        lineSpacing: 8
                    }).setOrigin(0.5).setDepth(4001).setScrollFactor(0);

                    // Pause inside the mountain for 2.5 seconds
                    this.time.delayedCall(2500, () => {
                        dialogBg.destroy();
                        dialogText.destroy();
                        
                        // 2. Slide Tween
                        let pathObj = { t: 0 };
                        this.tweens.add({
                            targets: pathObj,
                            t: 1,
                            ease: 'Sine.easeInOut',
                            duration: 4000,
                            onUpdate: () => {
                                let p = this.slideCurve.getPoint(pathObj.t);
                                this.raft.x = p.x;
                                this.raft.y = p.y;
                                this.player.x = p.x;
                                this.player.y = p.y - 24; // Seated on raft
                                // Dynamic depth ordering to sit inside the slide tube (elevated over Deck 13 railing)
                                let d = Math.max(p.y, 814); 
                                this.raft.setDepth(d);
                                this.player.setDepth(d);
                            },
                            onComplete: () => {
                                // 3. Splashdown & Hop Out into Deck 12 Pool
                                this.ridingRaft = false;
                                this.score += 1500;
                                this.currentDeck = 'deck12';
                                this.groundY = 975;
                                this.jumpZ = 12;
                                this.jumpV = 200;
                                this.isJumping = true;
                                if (this.player && this.player.body) {
                                    this.player.body.enable = true;
                                    this.player.body.allowGravity = false;
                                    this.player.setVelocity(-120, 0);
                                    this.player.body.reset(630, 975 - (this.player.body.height / 2));
                                }
                                this.raft.x = 1200;
                                this.raft.y = 730;
                            }
                        });
                    });
                }
            });
        };

        this.boardRaft = boardRaft;

        // Make raft and liftZone clickable / tappable
        this.raft.setInteractive({ useHandCursor: true });
        this.raft.on('pointerdown', boardRaft);

        this.liftZone.setInteractive(new Phaser.Geom.Rectangle(0, 0, 80, 80), Phaser.Geom.Rectangle.Contains);
        this.liftZone.on('pointerdown', boardRaft);
        
        // In 2.5D, depth corridors enforce deck boundaries, while water zones handle pool swimming
        this.physics.add.overlap(this.player, water, () => {
            this.inWater = true;
        });



        this.hasIceCream = false;
        this.iceCreamFlavors = ['strawberry', 'chocolate', 'vanilla', 'mint'];
        this.currentFlavorIndex = 0;
        this.iceCreamSprite = this.add.sprite(0, 0, 'icecream_strawberry');
        this.iceCreamSprite.setDepth(16);
        this.iceCreamSprite.setVisible(false);

        this.physics.add.overlap(this.player, iceCreamStands, () => {
            if (!this.hasIceCream) {
                this.hasIceCream = true;
                this.score += 500;
                
                // Change flavor
                let flavor = this.iceCreamFlavors[this.currentFlavorIndex];
                this.iceCreamSprite.setTexture('icecream_' + flavor);
                if (this.hudIceCreamIcon) {
                    this.hudIceCreamIcon.setTexture('icecream_' + flavor).setVisible(true);
                }
                this.currentFlavorIndex = (this.currentFlavorIndex + 1) % this.iceCreamFlavors.length;
                
                this.iceCreamSprite.setVisible(true);
                
                let yumText = this.add.text(this.player.x, this.player.y - 40, '+500 PTS!', {
                    fontSize: '11px', fill: '#FFD700', fontFamily: '"Press Start 2P", monospace',
                    stroke: '#000000', strokeThickness: 3
                });
                
                this.time.delayedCall(5000, () => {
                    this.hasIceCream = false;
                    this.iceCreamSprite.setVisible(false);
                    if (this.hudIceCreamIcon) this.hudIceCreamIcon.setVisible(false);
                });
                
                this.tweens.add({
                    targets: yumText,
                    y: this.player.y - 80,
                    alpha: 0,
                    duration: 2000,
                    onComplete: () => yumText.destroy()
                });
            }
        });

        // Desktop keyboard controls (Arrow keys + WASD + Spacebar)
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Prevent browser scrolling on game control keys
        this.input.keyboard.addCapture([
            Phaser.Input.Keyboard.KeyCodes.UP,
            Phaser.Input.Keyboard.KeyCodes.DOWN,
            Phaser.Input.Keyboard.KeyCodes.LEFT,
            Phaser.Input.Keyboard.KeyCodes.RIGHT,
            Phaser.Input.Keyboard.KeyCodes.SPACE
        ]);

        // Canvas focus management: ensure clicking canvas re-focuses game
        if (this.game.canvas) {
            this.game.canvas.setAttribute('tabindex', '0');
            this.game.canvas.focus();
            this.game.canvas.addEventListener('click', () => {
                this.game.canvas.focus();
            });
        }

        // Global recovery listeners: prevent stuck keys on window blur, tab switch, or modifier release
        const resetKeyInputs = () => {
            if (this.input && this.input.keyboard) {
                this.input.keyboard.resetKeys();
            }
            if (this.mobileInput) {
                this.mobileInput.left = false;
                this.mobileInput.right = false;
                this.mobileInput.up = false;
                this.mobileInput.down = false;
                this.mobileInput.jump = false;
            }
        };

        const onNativeKeyUp = (e) => {
            // Direct DOM safety release: guarantees keys are cleared even if OS or browser dropped Phaser keyup
            if (e.code === 'Space') {
                if (this.spaceKey) this.spaceKey.isDown = false;
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
            // If user released a modifier key (Alt, Meta/Command, Control, Shift), reset all keys
            if (['Alt', 'Meta', 'Control', 'Shift'].includes(e.key)) {
                resetKeyInputs();
            }
        };

        window.addEventListener('blur', resetKeyInputs);
        window.addEventListener('focus', resetKeyInputs);
        window.addEventListener('keyup', onNativeKeyUp);
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) resetKeyInputs();
        });

        this.events.once('shutdown', () => {
            window.removeEventListener('blur', resetKeyInputs);
            window.removeEventListener('focus', resetKeyInputs);
            window.removeEventListener('keyup', onNativeKeyUp);
        });

        this.mobileInput = { left: false, right: false, up: false, down: false, jump: false };

        if (!this.sys.game.device.os.desktop) {
            this.createMobileControls();
        }

        this.inWater = false;
        this.wasInWater = false;
        this.currentFloatieColor = 0;
        this.onSlide = false;
        this.currentStair = null;
    }

    canBoardRaft() {
        if (this.ridingRaft) return false;
        if (this.nearRaft) return true;
        if (this.player && this.raft) {
            let dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.raft.x, this.raft.y);
            return dist < 140;
        }
        return false;
    }

    createMobileControls() {
        this.input.addPointer(3); // Multi-touch

        // --- Floating Joystick ---
        const JOY_RADIUS = 60;
        const KNOB_RADIUS = 25;
        let joyBase = this.add.graphics().setScrollFactor(0).setDepth(20).setAlpha(0.5);
        let joyKnob = this.add.graphics().setScrollFactor(0).setDepth(21).setAlpha(0.7);

        joyBase.fillStyle(0xffffff, 1);
        joyBase.fillCircle(0, 0, JOY_RADIUS);
        joyBase.lineStyle(3, 0x888888, 1);
        joyBase.strokeCircle(0, 0, JOY_RADIUS);

        joyKnob.fillStyle(0x4488ff, 1);
        joyKnob.fillCircle(0, 0, KNOB_RADIUS);

        joyBase.setVisible(false);
        joyKnob.setVisible(false);

        let joyPointer = null;
        let joyOrigin = { x: 0, y: 0 };

        this.input.on('pointerdown', (ptr) => {
            if (this.isMenuOpen) return;
            const halfW = this.scale.width / 2;
            if (ptr.x < halfW) {
                // Left side: spawn joystick at touch point
                if (joyPointer === null) {
                    joyPointer = ptr;
                    joyOrigin.x = ptr.x;
                    joyOrigin.y = ptr.y;
                    joyBase.setPosition(ptr.x, ptr.y).setVisible(true);
                    joyKnob.setPosition(ptr.x, ptr.y).setVisible(true);
                }
            } else {
                // Right side / second finger: jump
                this.mobileInput.jump = true;
                this.time.delayedCall(120, () => this.mobileInput.jump = false);
            }
        });

        this.input.on('pointermove', (ptr) => {
            if (joyPointer && ptr.id === joyPointer.id) {
                let dx = ptr.x - joyOrigin.x;
                let dy = ptr.y - joyOrigin.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                let clamped = Math.min(dist, JOY_RADIUS);
                let angle = Math.atan2(dy, dx);
                let kx = joyOrigin.x + Math.cos(angle) * clamped;
                let ky = joyOrigin.y + Math.sin(angle) * clamped;
                joyKnob.setPosition(kx, ky);

                // Set directional input based on deflection (4-way 2.5D movement)
                this.mobileInput.left = dx < -15;
                this.mobileInput.right = dx > 15;
                this.mobileInput.up = dy < -15;
                this.mobileInput.down = dy > 15;
            }
        });

        this.input.on('pointerup', (ptr) => {
            if (joyPointer && ptr.id === joyPointer.id) {
                joyPointer = null;
                joyBase.setVisible(false);
                joyKnob.setVisible(false);
                this.mobileInput.left = false;
                this.mobileInput.right = false;
                this.mobileInput.up = false;
                this.mobileInput.down = false;
            }
        });
    }

    clampToDeckCorridor(inWater) {
        if (this.groundY < 500) {
            // Top Deck of AquaMouse
            this.currentDeck = 'topdeck';
            this.groundY = Phaser.Math.Clamp(this.groundY, 325, 345);
            this.player.x = Phaser.Math.Clamp(this.player.x, 700, 800);
        } else if (this.groundY < 850) {
            // Deck 13 (AquaMouse Deck) - depth 60px: y 700..760, full width x: 20..2380
            this.currentDeck = 'deck13';
            this.groundY = Phaser.Math.Clamp(this.groundY, 700, 760);
            this.player.x = Phaser.Math.Clamp(this.player.x, 20, 2380);
        } else if (this.groundY < 1120) {
            // Deck 12 (Quiet Cove & Hero Zone) - depth 60px: y 940..1000, full width x: 20..2380
            this.currentDeck = 'deck12';
            this.groundY = Phaser.Math.Clamp(this.groundY, 940, 1000);
            this.player.x = Phaser.Math.Clamp(this.player.x, 20, 2380);
        } else {
            // Deck 11 (Main Pool Deck) - depth 60px: y 1220..1280, full width x: 20..2380
            this.currentDeck = 'deck11';
            this.groundY = Phaser.Math.Clamp(this.groundY, 1220, 1280);
            this.player.x = Phaser.Math.Clamp(this.player.x, 20, 2380);
        }
    }

    update() {
        if (this.isMenuOpen) {
            this.player.setVelocity(0, 0);
            if (this.enterKey && Phaser.Input.Keyboard.JustDown(this.enterKey)) {
                this.executeMenuAction(this.menuSelectedIndex);
            } else if (this.spaceKey && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
                this.executeMenuAction(this.menuSelectedIndex);
            }
            return;
        }

        // Check if player is currently within any swimming pool zone
        let currentPool = null;
        if (this.currentStair === null && this.pools) {
            for (let p of this.pools) {
                if (this.player.x >= p.xMin && this.player.x <= p.xMax &&
                    this.groundY >= p.yMin && this.groundY <= p.yMax) {
                    currentPool = p;
                    break;
                }
            }
        }
        let inWater = (currentPool !== null && this.jumpZ < 15);
        let speed = inWater ? 130 : 250;
        let dt = Math.min(this.game.loop.delta / 1000, 0.05);

        if (this.onSlide) {
            this.player.angle += 15;
            this.player.setVelocity(0, 0);
        } else if (this.ridingRaft) {
            // Player is seated on raft - position controlled by tween, no physics movement
            this.player.anims.play(this.selectedCharacter + '_idle', true);
        } else {
            let isLeft = (this.cursors.left && this.cursors.left.isDown) || 
                         (this.wasd && this.wasd.left && this.wasd.left.isDown) || 
                         this.mobileInput.left;

            let isRight = (this.cursors.right && this.cursors.right.isDown) || 
                          (this.wasd && this.wasd.right && this.wasd.right.isDown) || 
                          this.mobileInput.right;

            let isUp = (this.cursors.up && this.cursors.up.isDown) ||
                       (this.wasd && this.wasd.up && this.wasd.up.isDown) ||
                       this.mobileInput.up;

            let isDown = (this.cursors.down && this.cursors.down.isDown) ||
                         (this.wasd && this.wasd.down && this.wasd.down.isDown) ||
                         this.mobileInput.down;

            let jumpPressed = (this.spaceKey && Phaser.Input.Keyboard.JustDown(this.spaceKey)) ||
                              this.mobileInput.jump;

            let halfH = this.player.body.height / 2;

            // --- JUMPING LOGIC (2.5D Decoupled jumpZ) ---
            if (jumpPressed && !this.isJumping) {
                this.isJumping = true;
                this.jumpZ = 0;
                this.jumpV = inWater ? 380 : 500;
                this.mobileInput.jump = false;
            }

            if (this.isJumping) {
                const JUMP_GRAV = 1350;
                this.jumpZ += this.jumpV * dt;
                this.jumpV -= JUMP_GRAV * dt;

                if (this.jumpZ <= 0) {
                    this.jumpZ = 0;
                    this.jumpV = 0;
                    this.isJumping = false;
                }
            }

            // --- STAIRCASE TRAVERSAL SYSTEM (GEMINI.md Specs) ---
            // Stair 1: Deck 11 (floor y=1280) to Deck 12 (floor y=1000), x: 60 to 340. Slope: groundY = 1340 - x
            // Stair 2: Deck 12 (floor y=1000) to Deck 13 (floor y=760), x: 2060 to 2300. Slope: groundY = 760 + (x - 2060)
            if (!inWater) {
                // Drop through stairs only when holding Down AND pressing Jump
                if (this.currentStair && isDown && jumpPressed) {
                    if (this.currentStair === 'deck11_to_12') {
                        this.currentStair = null;
                        this.currentDeck = 'deck11';
                        this.groundY = 1255;
                        this.isJumping = false;
                        this.jumpZ = 0;
                        this.jumpV = 0;
                    } else if (this.currentStair === 'deck12_to_13') {
                        this.currentStair = null;
                        this.currentDeck = 'deck12';
                        this.groundY = 975;
                        this.isJumping = false;
                        this.jumpZ = 0;
                        this.jumpV = 0;
                    }
                }

                // 1. Detect entering / mounting stairs
                if (!this.currentStair) {
                    // Stair 1 Mounting:
                    // From Deck 11 base (x: 40..100, Deck 11 corridor y: 1210..1285)
                    // Walking right alone allows passing under stairs; pressing Up (or Up+Right) climbs Stair 1
                    if (this.player.x >= 40 && this.player.x <= 100 && this.groundY >= 1210 && this.groundY <= 1285 && isUp) {
                        this.currentStair = 'deck11_to_12';
                        this.groundY = 1340 - this.player.x;
                    }
                    // From Deck 12 top stair opening (x: 300..360, Deck 12 corridor y: 930..1010)
                    // Moving down (or down+left) enters stairwell to descend Stair 1; walking left/right alone passes along Deck 12
                    else if (this.player.x >= 300 && this.player.x <= 360 && this.groundY >= 930 && this.groundY <= 1010 && isDown) {
                        this.currentStair = 'deck11_to_12';
                        this.groundY = 1340 - this.player.x;
                    }
                    // Stair 2 Mounting:
                    // From Deck 12 base (x: 2240..2320, Deck 12 corridor y: 930..1010)
                    // Walking left/right alone allows passing under stairs; pressing Up (or Up+Left) climbs Stair 2
                    else if (this.player.x >= 2240 && this.player.x <= 2320 && this.groundY >= 930 && this.groundY <= 1010 && isUp) {
                        this.currentStair = 'deck12_to_13';
                        this.groundY = 760 + (this.player.x - 2060);
                    }
                    // From Deck 13 top stair opening (x: 2040..2100, Deck 13 corridor y: 690..770)
                    // Moving down (or down+right) enters stairwell to descend Stair 2; walking left/right alone passes along Deck 13
                    else if (this.player.x >= 2040 && this.player.x <= 2100 && this.groundY >= 690 && this.groundY <= 770 && isDown) {
                        this.currentStair = 'deck12_to_13';
                        this.groundY = 760 + (this.player.x - 2060);
                    }
                    // Continuous Collision Detection (CCD) for Airborne Landings on Stairs
                    else if (this.isJumping && this.jumpV < 0 && this.player.x >= 65 && this.player.x <= 335) {
                        let sY = 1340 - this.player.x;
                        if (Math.abs(this.groundY - sY) < 25) {
                            this.currentStair = 'deck11_to_12';
                            this.groundY = sY;
                            this.isJumping = false;
                            this.jumpZ = 0;
                            this.jumpV = 0;
                        }
                    } else if (this.isJumping && this.jumpV < 0 && this.player.x >= 2065 && this.player.x <= 2295) {
                        let sY = 760 + (this.player.x - 2060);
                        if (Math.abs(this.groundY - sY) < 25) {
                            this.currentStair = 'deck12_to_13';
                            this.groundY = sY;
                            this.isJumping = false;
                            this.jumpZ = 0;
                            this.jumpV = 0;
                        }
                    }
                }

                // 2. Process movement on stairs (Lockstep 45° velocity integration & multi-directional input)
                if (this.currentStair === 'deck11_to_12') {
                    // Stair 1 goes up-right:
                    // Up or Right climbs towards Deck 12
                    // Down or Left descends towards Deck 11
                    let climbUp = isRight || isUp;
                    let descendDown = isLeft || isDown;

                    if (climbUp && !descendDown) {
                        this.player.x += speed * dt;
                        this.groundY = 1340 - this.player.x;
                        this.player.setFlipX(false);
                        if (this.player.x >= 340) {
                            this.currentStair = null;
                            this.currentDeck = 'deck12';
                            this.player.x = 340;
                            this.groundY = 975;
                        }
                    } else if (descendDown && !climbUp) {
                        this.player.x -= speed * dt;
                        this.groundY = 1340 - this.player.x;
                        this.player.setFlipX(true);
                        if (this.player.x <= 60) {
                            this.currentStair = null;
                            this.currentDeck = 'deck11';
                            this.player.x = 60;
                            this.groundY = 1255;
                        }
                    }
                } else if (this.currentStair === 'deck12_to_13') {
                    // Stair 2 goes up-left:
                    // Up or Left climbs towards Deck 13
                    // Down or Right descends towards Deck 12
                    let climbUp = isLeft || isUp;
                    let descendDown = isRight || isDown;

                    if (climbUp && !descendDown) {
                        this.player.x -= speed * dt;
                        this.groundY = 760 + (this.player.x - 2060);
                        this.player.setFlipX(true);
                        if (this.player.x <= 2060) {
                            this.currentStair = null;
                            this.currentDeck = 'deck13';
                            this.player.x = 2060;
                            this.groundY = 735;
                        }
                    } else if (descendDown && !climbUp) {
                        this.player.x += speed * dt;
                        this.groundY = 760 + (this.player.x - 2060);
                        this.player.setFlipX(false);
                        if (this.player.x >= 2300) {
                            this.currentStair = null;
                            this.currentDeck = 'deck12';
                            this.player.x = 2300;
                            this.groundY = 975;
                        }
                    }
                } else {
                    // Regular deck movement in 2.5D
                    let vx = 0;
                    let vy = 0;

                    if (isLeft) vx -= speed;
                    if (isRight) vx += speed;
                    if (isUp) vy -= speed * 0.75;
                    if (isDown) vy += speed * 0.75;

                    if (vx !== 0 && vy !== 0) {
                        vx *= 0.7071;
                        vy *= 0.7071;
                    }

                    this.player.x += vx * dt;
                    this.groundY += vy * dt;

                    // Clamp groundY and player.x to current deck corridor
                    this.clampToDeckCorridor(inWater);
                }
            } else {
                // In water movement
                this.currentStair = null;
                let vx = 0;
                let vy = 0;
                if (isLeft) vx -= speed;
                if (isRight) vx += speed;
                if (isUp) vy -= speed * 0.75;
                if (isDown) vy += speed * 0.75;

                if (vx !== 0 && vy !== 0) {
                    vx *= 0.7071;
                    vy *= 0.7071;
                }

                this.player.x += vx * dt;
                this.groundY += vy * dt;
                this.clampToDeckCorridor(true);
            }

            // --- APPLY VISUAL Y POSITION & BODY SYNCHRONIZATION ---
            this.player.y = this.groundY - this.jumpZ;
            this.player.body.reset(this.player.x, this.player.y);

            // Ground Shadow Update
            if (this.playerShadow) {
                this.playerShadow.x = this.player.x;
                this.playerShadow.y = this.groundY + 18;
                this.playerShadow.setDepth(this.groundY - 1);
                if (inWater || this.ridingRaft || this.onSlide) {
                    this.playerShadow.setVisible(false);
                } else {
                    let scale = Math.max(0.4, 1 - (this.jumpZ / 300));
                    let alpha = Math.max(0.15, 0.45 - (this.jumpZ / 400));
                    this.playerShadow.setVisible(true).setScale(scale).setAlpha(alpha);
                }
            }

            // Flip facing direction based on horizontal movement
            if (this.currentStair === null) {
                if (isLeft) {
                    this.player.setFlipX(true);
                } else if (isRight) {
                    this.player.setFlipX(false);
                }
            }

            // Swimming visuals & animations
            if (inWater && !this.wasInWater) {
                this.currentFloatieColor = Phaser.Math.Between(0, 3);
            }

            if (inWater) {
                if (this.player.anims && this.player.anims.isPlaying) {
                    this.player.anims.stop();
                }
                this.player.setTexture(this.selectedCharacter + '_swim_' + this.currentFloatieColor);
                this.player.angle = (Math.sin(this.time.now / 150) * 10);
            } else {
                this.player.angle = 0;
                if (this.isJumping) {
                    this.player.anims.play(this.selectedCharacter + '_jump', true);
                } else if (this.currentStair !== null ? (isLeft || isRight || isUp || isDown) : (isLeft || isRight || isUp || isDown)) {
                    this.player.anims.play(this.selectedCharacter + '_walk', true);
                } else {
                    this.player.anims.play(this.selectedCharacter + '_idle', true);
                }
            }

            // Dynamic Y-Sorting for Player and Held Ice Cream
            this.player.setDepth(this.groundY);
            if (this.hasIceCream && this.iceCreamSprite) {
                this.iceCreamSprite.x = this.player.x + (this.player.flipX ? -15 : 15);
                this.iceCreamSprite.y = this.player.y - 10;
                this.iceCreamSprite.setDepth(this.groundY + 1);
            }
        }

        // AquaMouse boarding handling & UI visibility
        let canBoard = this.canBoardRaft();
        if (canBoard && !this.ridingRaft && !this.nearElevator) {
            this.boardPromptText.setVisible(true);
        } else {
            this.boardPromptText.setVisible(false);
        }

        // Enter key boards the AquaMouse
        if (canBoard && !this.nearElevator && this.enterKey && Phaser.Input.Keyboard.JustDown(this.enterKey)) {
            this.boardRaft();
        }

        // Midship Elevator handling & UI visibility
        if (this.nearElevator && !this.ridingRaft) {
            this.elevatorPromptText.setVisible(true);
            this.elevatorPromptText.x = this.player.x;
            this.elevatorPromptText.y = this.player.y - 60;
            
            if (this.enterKey && Phaser.Input.Keyboard.JustDown(this.enterKey)) {
                this.openElevatorMenu();
            }
        } else {
            this.elevatorPromptText.setVisible(false);
        }

        const isNearHeroZoneDoor = (this.currentDeck === 'deck12' && Math.abs(this.player.x - 2000) <= 90 && Math.abs(this.groundY - 975) <= 50);
        if ((this.nearHeroZone || isNearHeroZoneDoor) && !this.ridingRaft) {
            this.heroZonePromptText.setVisible(true);
            this.heroZonePromptText.x = this.player.x;
            this.heroZonePromptText.y = this.player.y - 65;
            if (this.enterKey && Phaser.Input.Keyboard.JustDown(this.enterKey)) {
                this.openHeroZone();
            }
        } else {
            if (this.heroZonePromptText) this.heroZonePromptText.setVisible(false);
        }


        // Dynamic Funnel Vision Screen Animation
        this.updateFunnelVision(this.time.now, this.game.loop.delta);

        // Ambient Deck NPCs Movement & Interactions
        this.updateAmbientNPCs(this.time.now, this.game.loop.delta);

        // Update Capcom Retro Location Banner
        let loc = 'DECK 11: MAIN POOL';
        if (this.onSlide) {
            loc = 'AQUAMOUSE: TUBE SLIDE!';
        } else if (this.ridingRaft) {
            loc = 'AQUAMOUSE: RIDING RAFT!';
        } else if (inWater) {
            loc = 'SWIMMING: POOL';
        } else if (this.currentStair !== null) {
            loc = 'STAIRWAY TRAVERSAL';
        } else if (this.groundY < 500) {
            loc = 'DECK 13: AQUAMOUSE LAUNCH';
        } else if (this.groundY < 850) {
            if (this.player.x > 2060) {
                loc = 'DECK 13: CURRENTS BAR';
            } else if (this.player.x < 500) {
                loc = 'DECK 13: SPLASHDOWN POOL';
            } else {
                loc = 'DECK 13: AQUAMOUSE';
            }
        } else if (this.groundY < 1120) {
            if (this.player.x > 1850) {
                loc = 'DECK 12: HERO ZONE';
            } else if (this.player.x < 340) {
                loc = 'DECK 12: COVE CAFE';
            } else {
                loc = 'DECK 12: QUIET COVE';
            }
        } else {
            loc = (this.player.x > 1950) ? 'DECK 11: MARCELINE MARKET' : ((this.player.x < 500) ? 'DECK 11: SENSES SPA' : 'DECK 11: MAIN POOL');
        }
        let locFormatted = `[ ${loc} ]`;
        if (this.hudLocation && this.hudLocation.text !== locFormatted) {
            this.hudLocation.setText(locFormatted);
        }

        // Update Zero-Padded Score Counter ($0002500)
        let scoreStr = '$' + String(this.score).padStart(7, '0');
        if (this.hudScoreText && this.hudScoreText.text !== scoreStr) {
            this.hudScoreText.setText(scoreStr);
        }

        // Reset per-frame states
        this.wasInWater = inWater;
        this.inWater = false;
        this.nearRaft = false;
        this.nearElevator = false;
        this.nearHeroZone = false;
    }

    createFunnelVision() {
        const screenX = 940;
        const screenY = 1100;
        const screenW = 200;
        const screenH = 120;
        const centerX = screenX + screenW / 2; // 1040
        const centerY = screenY + screenH / 2; // 1160

        // 1. Red Disney Funnel Hull (behind screen, depth: 1)
        let funnelHull = this.add.graphics().setDepth(1);
        funnelHull.fillStyle(0x000000, 1);
        funnelHull.beginPath();
        funnelHull.moveTo(screenX - 16, screenY + screenH);
        funnelHull.lineTo(screenX - 6, screenY - 50);
        funnelHull.lineTo(screenX + screenW + 6, screenY - 50);
        funnelHull.lineTo(screenX + screenW + 16, screenY + screenH);
        funnelHull.closePath();
        funnelHull.fillPath();

        funnelHull.fillStyle(0xD82000, 1);
        funnelHull.beginPath();
        funnelHull.moveTo(screenX - 14, screenY + screenH);
        funnelHull.lineTo(screenX - 4, screenY - 48);
        funnelHull.lineTo(screenX + screenW + 4, screenY - 48);
        funnelHull.lineTo(screenX + screenW + 14, screenY + screenH);
        funnelHull.closePath();
        funnelHull.fillPath();

        // Funnel top cowl & yellow accent stripe
        funnelHull.fillStyle(0x000000, 1);
        funnelHull.fillRect(screenX - 8, screenY - 56, screenW + 16, 8);
        funnelHull.fillStyle(0xF8B800, 1);
        funnelHull.fillRect(screenX - 6, screenY - 48, screenW + 12, 3);

        // Mickey Silhouette on red funnel above screen
        this.add.image(centerX, screenY - 28, 'fv_mickey_logo').setScale(0.7).setDepth(2);

        // 2. Capcom Marquee Header Box (depth: 5)
        let marqueeG = this.add.graphics().setDepth(5);
        marqueeG.fillStyle(0x000000, 1);
        marqueeG.fillRect(centerX - 82, screenY - 22, 164, 20);
        marqueeG.fillStyle(0xF8B800, 1);
        marqueeG.fillRect(centerX - 80, screenY - 20, 160, 16);
        marqueeG.fillStyle(0x001030, 1);
        marqueeG.fillRect(centerX - 78, screenY - 18, 156, 12);

        this.fvMarqueeText = this.add.text(centerX, screenY - 12, '★ FUNNEL VISION ★', {
            fontSize: '9px', fill: '#F8B800', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(6);

        // Marquee light bulbs (row above and below)
        this.fvBulbs = [];
        for (let i = 0; i < 8; i++) {
            let bx = centerX - 70 + i * 20;
            let bTop = this.add.circle(bx, screenY - 21, 2, 0xF8B800).setDepth(6);
            let bBot = this.add.circle(bx, screenY - 3, 2, 0xFFFFFF).setDepth(6);
            this.fvBulbs.push({ top: bTop, bot: bBot });
        }

        // 3. Screen Bezel Frame & Speaker Columns (depth: 5)
        // IMPORTANT: Bezel is a HOLLOW frame surrounding the screen area (screenX, screenY, screenW, screenH).
        // It NEVER fills the screen interior so cartoon animations remain 100% visible.
        let bezel = this.add.graphics().setDepth(5);

        // Left Speaker Tower (x: screenX - 16 to screenX, y: screenY - 4 to screenY + screenH + 6)
        bezel.fillStyle(0x000000, 1);
        bezel.fillRect(screenX - 16, screenY - 4, 16, screenH + 10);
        bezel.fillStyle(0x182430, 1);
        bezel.fillRect(screenX - 15, screenY - 3, 14, screenH + 8);
        // Left Speaker Grill
        bezel.fillStyle(0x000810, 1);
        bezel.fillRect(screenX - 12, screenY + 6, 8, screenH - 12);
        bezel.fillStyle(0x587890, 1);
        for (let sy = screenY + 12; sy < screenY + screenH - 12; sy += 8) {
            bezel.fillRect(screenX - 10, sy, 4, 2);
        }
        // Left Corner Rivets
        bezel.fillStyle(0xF8B800, 1);
        bezel.fillRect(screenX - 13, screenY, 3, 3);
        bezel.fillRect(screenX - 13, screenY + screenH - 3, 3, 3);

        // Right Speaker Tower (x: screenX + screenW to screenX + screenW + 16, y: screenY - 4 to screenY + screenH + 6)
        bezel.fillStyle(0x000000, 1);
        bezel.fillRect(screenX + screenW, screenY - 4, 16, screenH + 10);
        bezel.fillStyle(0x182430, 1);
        bezel.fillRect(screenX + screenW + 1, screenY - 3, 14, screenH + 8);
        // Right Speaker Grill
        bezel.fillStyle(0x000810, 1);
        bezel.fillRect(screenX + screenW + 4, screenY + 6, 8, screenH - 12);
        bezel.fillStyle(0x587890, 1);
        for (let sy = screenY + 12; sy < screenY + screenH - 12; sy += 8) {
            bezel.fillRect(screenX + screenW + 6, sy, 4, 2);
        }
        // Right Corner Rivets
        bezel.fillStyle(0xF8B800, 1);
        bezel.fillRect(screenX + screenW + 10, screenY, 3, 3);
        bezel.fillRect(screenX + screenW + 10, screenY + screenH - 3, 3, 3);

        // Top Frame Bar (between speaker columns)
        bezel.fillStyle(0x000000, 1);
        bezel.fillRect(screenX, screenY - 4, screenW, 4);
        bezel.fillStyle(0x182430, 1);
        bezel.fillRect(screenX, screenY - 3, screenW, 3);

        // Bottom Frame Bar (between speaker columns)
        bezel.fillStyle(0x000000, 1);
        bezel.fillRect(screenX, screenY + screenH, screenW, 6);
        bezel.fillStyle(0x182430, 1);
        bezel.fillRect(screenX, screenY + screenH, screenW, 5);
        bezel.fillStyle(0xF8B800, 1);
        bezel.fillRect(screenX, screenY + screenH + 4, screenW, 1);

        // Inner screen borders and outer frame strokes
        bezel.lineStyle(2, 0x081018, 1);
        bezel.strokeRect(screenX - 1, screenY - 1, screenW + 2, screenH + 2);
        bezel.lineStyle(1, 0xF8B800, 0.7);
        bezel.strokeRect(screenX - 2, screenY - 2, screenW + 4, screenH + 4);
        bezel.lineStyle(1, 0x000000, 1);
        bezel.strokeRect(screenX - 16, screenY - 4, screenW + 32, screenH + 10);

        // 4. Screen Background Sky & Deck (depth: 2)
        this.fvSky = this.add.graphics().setDepth(2);
        this.fvSky.fillStyle(0x58B8F8, 1);
        this.fvSky.fillRect(screenX, screenY, screenW, 75);
        this.fvSky.fillStyle(0x80D0F8, 1);
        this.fvSky.fillRect(screenX, screenY + 50, screenW, 25);
        // Steamboat wooden deck
        this.fvSky.fillStyle(0x783C00, 1);
        this.fvSky.fillRect(screenX, screenY + 75, screenW, 45);
        this.fvSky.fillStyle(0x482000, 1);
        for (let dx = screenX; dx < screenX + screenW; dx += 20) {
            this.fvSky.fillRect(dx, screenY + 75, 1, 45);
        }
        // Brass deck rail
        this.fvSky.fillStyle(0xF8B800, 1);
        this.fvSky.fillRect(screenX, screenY + 74, screenW, 2);

        // Animated River Waves at bottom of screen (depth: 2)
        this.fvWaves = this.add.tileSprite(screenX, screenY + 104, screenW, 16, 'fv_wave_0').setOrigin(0, 0).setDepth(2);

        // Steamboat Smokestacks in background (depth: 2)
        this.fvStackLeft = this.add.image(screenX + 35, screenY + 62, 'fv_smokestack').setDepth(2);
        this.fvStackRight = this.add.image(screenX + screenW - 35, screenY + 62, 'fv_smokestack').setDepth(2);

        // Steam Puffs Pool (depth: 3)
        this.fvSteamPuffs = [];
        for (let i = 0; i < 4; i++) {
            let p = this.add.image(0, 0, 'fv_steam_0').setDepth(3).setVisible(false);
            this.fvSteamPuffs.push(p);
        }

        // Steamboat Willie Mickey Sprite (depth: 3)
        this.fvMickey = this.add.image(centerX, screenY + 68, 'fv_mickey_0').setDepth(3);

        // Steamboat Wheel (depth: 4)
        this.fvWheel = this.add.image(centerX, screenY + 78, 'fv_wheel_0').setDepth(4);

        // Minnie Mouse Sprite (for celebration scene) (depth: 3)
        this.fvMinnie = this.add.image(centerX + 35, screenY + 68, 'fv_minnie_0').setDepth(3).setVisible(false);

        // Floating Musical Notes & Sparkles Pool (depth: 4)
        this.fvFloatingItems = [];
        for (let i = 0; i < 6; i++) {
            let item = this.add.image(0, 0, 'fv_note_0').setDepth(4).setVisible(false);
            item.baseX = 0;
            item.floatSpeed = 0;
            item.wobblePhase = 0;
            this.fvFloatingItems.push(item);
        }

        // Intermission Presentation Title Banner (Scene 3) (depth: 4)
        this.fvIntermissionContainer = this.add.container(centerX, centerY).setDepth(4).setVisible(false);
        let bannerBg = this.add.graphics();
        bannerBg.fillStyle(0x001024, 0.94);
        bannerBg.fillRect(-90, -48, 180, 96);
        bannerBg.lineStyle(2, 0xF8B800, 1);
        bannerBg.strokeRect(-88, -46, 176, 92);
        let bannerLogo = this.add.image(0, -20, 'fv_mickey_logo').setScale(0.85);
        let bannerTitle1 = this.add.text(0, 4, '★ DISNEY DESTINY ★', {
            fontSize: '8px', fill: '#F8B800', fontFamily: '"Press Start 2P", monospace', align: 'center'
        }).setOrigin(0.5);
        let bannerTitle2 = this.add.text(0, 18, 'CARTOON CLASSIC', {
            fontSize: '7px', fill: '#58B8F8', fontFamily: '"Press Start 2P", monospace', align: 'center'
        }).setOrigin(0.5);
        let bannerTitle3 = this.add.text(0, 32, 'NOW PLAYING', {
            fontSize: '6px', fill: '#FFFFFF', fontFamily: '"Press Start 2P", monospace', align: 'center'
        }).setOrigin(0.5);
        this.fvIntermissionContainer.add([bannerBg, bannerLogo, bannerTitle1, bannerTitle2, bannerTitle3]);

        // Caption Bar for Scene 2 (depth: 4)
        this.fvCaption = this.add.text(centerX, screenY + 12, '', {
            fontSize: '6px', fill: '#FFD700', backgroundColor: '#001024',
            padding: { x: 4, y: 2 }, fontFamily: '"Press Start 2P", monospace', align: 'center'
        }).setOrigin(0.5).setDepth(4).setVisible(false);

        // 5. Jumbotron CRT Scanlines & Screen Glass (depth: 4)
        this.add.image(centerX, centerY, 'fv_scanlines').setDepth(4);

        // Internal timing and state
        this.fvTime = 0;
        this.fvLastBulbToggle = 0;
        this.fvBulbState = false;
        this.fvNextSteamTime = 0;
        this.fvNextNoteTime = 0;
        this.fvScreenBounds = { x: screenX, y: screenY, w: screenW, h: screenH, cx: centerX, cy: centerY };
    }

    updateFunnelVision(time, delta) {
        if (!this.fvScreenBounds) return;
        let dt = delta / 1000;
        this.fvTime += dt;

        let b = this.fvScreenBounds;
        let cycle = this.fvTime % 22; // 22-second loop

        // 1. Toggle Marquee Light Bulbs
        if (time - this.fvLastBulbToggle > 350) {
            this.fvLastBulbToggle = time;
            this.fvBulbState = !this.fvBulbState;
            if (this.fvBulbs) {
                this.fvBulbs.forEach((pair, idx) => {
                    let cTop = ((idx % 2 === 0) ^ this.fvBulbState) ? 0xF8B800 : 0xFFFFFF;
                    let cBot = ((idx % 2 !== 0) ^ this.fvBulbState) ? 0xF8B800 : 0xFFFFFF;
                    pair.top.setFillStyle(cTop);
                    pair.bot.setFillStyle(cBot);
                });
            }
        }

        // 2. Scroll River Waves
        if (this.fvWaves) {
            this.fvWaves.tilePositionX += 28 * dt;
            let waveFrame = (Math.floor(this.fvTime * 3) % 2 === 0) ? 'fv_wave_0' : 'fv_wave_1';
            if (this.fvWaves.texture.key !== waveFrame) {
                this.fvWaves.setTexture(waveFrame);
            }
        }

        // 3. Update Steam Puffs
        if (this.fvSteamPuffs) {
            this.fvSteamPuffs.forEach(p => {
                if (p.visible) {
                    p.y -= 20 * dt;
                    p.x += Math.sin(p.y * 0.08) * 6 * dt;
                    p.alpha -= 0.6 * dt;
                    if (p.alpha <= 0.1 || p.y < b.y + 6) {
                        p.setVisible(false);
                    }
                }
            });

            // Spawn Steam Puffs periodically (every 1.1s)
            if (this.fvTime > this.fvNextSteamTime) {
                this.fvNextSteamTime = this.fvTime + 1.1;
                let spawnStack = (Math.random() < 0.5) ? this.fvStackLeft : this.fvStackRight;
                let idlePuff = this.fvSteamPuffs.find(p => !p.visible);
                if (idlePuff && spawnStack) {
                    idlePuff.setPosition(spawnStack.x, spawnStack.y - 18);
                    let puffKey = (Math.random() < 0.4) ? 'fv_steam_0' : 'fv_steam_1';
                    idlePuff.setTexture(puffKey);
                    idlePuff.setAlpha(1.0);
                    idlePuff.setVisible(true);
                }
            }
        }

        // 4. Update Floating Notes / Hearts
        if (this.fvFloatingItems) {
            this.fvFloatingItems.forEach(item => {
                if (item.visible) {
                    item.y -= item.floatSpeed * dt;
                    item.x = item.baseX + Math.sin((item.y + item.wobblePhase) * 0.1) * 10;
                    item.alpha -= 0.45 * dt;
                    if (item.alpha <= 0.1 || item.y < b.y + 15) {
                        item.setVisible(false);
                    }
                }
            });
        }

        // 5. Scene Management
        if (cycle < 9.5) {
            // === SCENE 1: STEAMBOAT WILLIE (Mickey at the Helm) ===
            this.fvMickey.setVisible(true);
            this.fvWheel.setVisible(true);
            this.fvMinnie.setVisible(false);
            this.fvIntermissionContainer.setVisible(false);
            this.fvCaption.setVisible(false);

            this.fvMickey.setPosition(b.cx, b.y + 68);
            this.fvWheel.setPosition(b.cx, b.y + 78);

            // Steering & whistling animation states
            let subT = cycle % 4.0;
            if (subT < 1.0) {
                this.fvMickey.setTexture('fv_mickey_0');
                this.fvWheel.setAngle(Math.sin(time * 0.004) * 6);
            } else if (subT < 2.0) {
                this.fvMickey.setTexture('fv_mickey_1');
                this.fvWheel.setAngle(-22);
            } else if (subT < 3.0) {
                this.fvMickey.setTexture('fv_mickey_2');
                this.fvWheel.setAngle(0);
            } else {
                this.fvMickey.setTexture('fv_mickey_3');
                this.fvWheel.setAngle(22);
            }

            // Spawn whistling musical notes from Mickey's mouth
            if (this.fvTime > this.fvNextNoteTime) {
                this.fvNextNoteTime = this.fvTime + 0.9;
                let idleNote = this.fvFloatingItems.find(n => !n.visible);
                if (idleNote) {
                    idleNote.setTexture((Math.random() < 0.5) ? 'fv_note_0' : 'fv_note_1');
                    idleNote.baseX = b.cx + 8;
                    idleNote.setPosition(idleNote.baseX, b.y + 56);
                    idleNote.floatSpeed = 28 + Math.random() * 8;
                    idleNote.wobblePhase = Math.random() * 10;
                    idleNote.setAlpha(1.0);
                    idleNote.setVisible(true);
                }
            }
        } else if (cycle < 16.0) {
            // === SCENE 2: HIGH SEAS DANCE & CELEBRATION ===
            this.fvMickey.setVisible(true);
            this.fvMinnie.setVisible(true);
            this.fvWheel.setVisible(true);
            this.fvIntermissionContainer.setVisible(false);
            this.fvCaption.setVisible(true);
            this.fvCaption.setText('★ HIGH SEAS CELEBRATION ★');

            this.fvMickey.setPosition(b.cx - 24, b.y + 68);
            this.fvWheel.setPosition(b.cx, b.y + 80);
            this.fvWheel.setAngle(0);
            this.fvMinnie.setPosition(b.cx + 26, b.y + 68);

            // Mickey happy wave
            this.fvMickey.setTexture((Math.sin(time * 0.008) > 0) ? 'fv_mickey_2' : 'fv_mickey_0');
            // Minnie clapping animation
            this.fvMinnie.setTexture((Math.sin(time * 0.008) > 0) ? 'fv_minnie_0' : 'fv_minnie_1');

            // Spawn floating hearts & stars
            if (this.fvTime > this.fvNextNoteTime) {
                this.fvNextNoteTime = this.fvTime + 0.8;
                let idleItem = this.fvFloatingItems.find(n => !n.visible);
                if (idleItem) {
                    idleItem.setTexture((Math.random() < 0.5) ? 'fv_heart' : 'fv_star');
                    idleItem.baseX = b.cx + (Math.random() * 30 - 15);
                    idleItem.setPosition(idleItem.baseX, b.y + 60);
                    idleItem.floatSpeed = 24 + Math.random() * 6;
                    idleItem.wobblePhase = Math.random() * 10;
                    idleItem.setAlpha(1.0);
                    idleItem.setVisible(true);
                }
            }
        } else {
            // === SCENE 3: FEATURE PRESENTATION MARQUEE ===
            this.fvMickey.setVisible(false);
            this.fvMinnie.setVisible(false);
            this.fvWheel.setVisible(false);
            this.fvCaption.setVisible(false);
            this.fvIntermissionContainer.setVisible(true);

            // Pulse logo gently
            let scale = 0.85 + Math.sin(time * 0.005) * 0.05;
            this.fvIntermissionContainer.setScale(scale);

            // Spawn twinkling stars around the screen
            if (this.fvTime > this.fvNextNoteTime) {
                this.fvNextNoteTime = this.fvTime + 0.6;
                let idleStar = this.fvFloatingItems.find(n => !n.visible);
                if (idleStar) {
                    idleStar.setTexture('fv_star');
                    idleStar.baseX = b.x + 20 + Math.random() * (b.w - 40);
                    idleStar.setPosition(idleStar.baseX, b.y + 20 + Math.random() * (b.h - 40));
                    idleStar.floatSpeed = 10;
                    idleStar.wobblePhase = Math.random() * 10;
                    idleStar.setAlpha(1.0);
                    idleStar.setVisible(true);
                }
            }
        }
    }

    createAmbientNPCs() {
        this.ambientNPCs = [];

        // 1. Reusable 8-bit Capcom Speech Bubble
        this.npcSpeechBox = this.add.graphics().setDepth(2500).setVisible(false);
        this.npcSpeechText = this.add.text(0, 0, '', {
            fontSize: '7px',
            fill: '#F8B800',
            fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000',
            strokeThickness: 1,
            align: 'center',
            wordWrap: { width: 140 }
        }).setOrigin(0, 0).setDepth(2501).setVisible(false);
        this.npcCurrentSpeaker = null;
        this.npcSpeechEndTime = 0;

        // 2. Spawn Walking Deck NPCs
        // Officer Davis (Deck 11 - outside Senses Spa / pool approach)
        let off1 = this.add.sprite(550, 1250, 'npc_officer_idle').setDepth(1250);
        off1.anims.play('npc_officer_walk');
        this.ambientNPCs.push({
            name: 'Officer Davis',
            type: 'walker',
            sprite: off1,
            minX: 430,
            maxX: 760,
            speed: 30,
            dir: 1,
            state: 'walk',
            pauseTimer: 0,
            walkAnim: 'npc_officer_walk',
            idleAnim: 'npc_officer_idle',
            quotes: [
                'WELCOME TO DECK 11!',
                'SMOOTH SAILING TODAY!',
                'ENJOY THE DISNEY DESTINY!'
            ],
            bubbleOffset: 28,
            nextSpeechTime: 0
        });

        // Tourist Bob (Deck 11 - outside Eye Scream Treats)
        let tour1 = this.add.sprite(1680, 1250, 'npc_tourist_idle').setDepth(1250);
        tour1.anims.play('npc_tourist_walk');
        this.ambientNPCs.push({
            name: 'Tourist Bob',
            type: 'walker',
            sprite: tour1,
            minX: 1560,
            maxX: 1960,
            speed: 32,
            dir: -1,
            state: 'walk',
            pauseTimer: 0,
            walkAnim: 'npc_tourist_walk',
            idleAnim: 'npc_tourist_idle',
            quotes: [
                'FREE SOFT SERVE ON DECK!',
                'LOOK AT THAT OCEAN VIEW!',
                'WHAT A WONDERFUL CRUISE!'
            ],
            bubbleOffset: 28,
            nextSpeechTime: 0
        });

        // Active Guest Jordan (Deck 12 - promenade towards Hero Zone)
        let tour2 = this.add.sprite(1100, 970, 'npc_tourist_idle').setDepth(970);
        tour2.anims.play('npc_tourist_walk');
        this.ambientNPCs.push({
            name: 'Jordan',
            type: 'walker',
            sprite: tour2,
            minX: 860,
            maxX: 1460,
            speed: 34,
            dir: 1,
            state: 'walk',
            pauseTimer: 0,
            walkAnim: 'npc_tourist_walk',
            idleAnim: 'npc_tourist_idle',
            quotes: [
                'HEADED TO HERO ZONE!',
                'WEATHER IS PERFECT!',
                'QUIET COVE IS RELAXING.'
            ],
            bubbleOffset: 28,
            nextSpeechTime: 0
        });

        // Officer Henderson (Deck 13 - AquaMouse Ride Operator)
        let off2 = this.add.sprite(1060, 730, 'npc_officer_idle').setDepth(730);
        off2.anims.play('npc_officer_walk');
        this.ambientNPCs.push({
            name: 'Officer Henderson',
            type: 'walker',
            sprite: off2,
            minX: 960,
            maxX: 1150,
            speed: 28,
            dir: 1,
            state: 'walk',
            pauseTimer: 0,
            walkAnim: 'npc_officer_walk',
            idleAnim: 'npc_officer_idle',
            quotes: [
                'READY FOR AQUAMOUSE?',
                'HOLD ON TO YOUR HATS!',
                'WILD WATER COASTER AT SEA!'
            ],
            bubbleOffset: 28,
            nextSpeechTime: 0
        });

        // Guest Elena (Deck 13 - aft promenade towards Currents Bar)
        let tour3 = this.add.sprite(2250, 730, 'npc_tourist_idle').setDepth(730);
        tour3.anims.play('npc_tourist_walk');
        this.ambientNPCs.push({
            name: 'Elena',
            type: 'walker',
            sprite: tour3,
            minX: 2160,
            maxX: 2360,
            speed: 30,
            dir: -1,
            state: 'walk',
            pauseTimer: 0,
            walkAnim: 'npc_tourist_walk',
            idleAnim: 'npc_tourist_idle',
            quotes: [
                'WHAT A VIEW FROM DECK 13!',
                'HEADING TO CURRENTS BAR!',
                'THE WHOLE SHIP LOOKS AMAZING!'
            ],
            bubbleOffset: 28,
            nextSpeechTime: 0
        });

        // 3. Spawn Lounging Sunbathers on Deck Chairs
        // Sunbather Chloe (Deck 11 poolside lounger)
        this.add.image(1360, 1255, 'npc_lounge_chair').setDepth(1254);
        let lounger1 = this.add.sprite(1360, 1253, 'npc_lounger_0').setDepth(1255);
        lounger1.anims.play('npc_lounger_relax');
        this.ambientNPCs.push({
            name: 'Chloe',
            type: 'lounger',
            sprite: lounger1,
            quotes: [
                'AHHH, TOTAL PARADISE...',
                'SUNNY SKIES ALL DAY!',
                'PASS THE PINA COLADA!'
            ],
            bubbleOffset: 18,
            nextSpeechTime: 0
        });

        // Guest Sarah (Deck 12 Quiet Cove lounger)
        this.add.image(420, 975, 'npc_lounge_chair').setDepth(974);
        let lounger2 = this.add.sprite(420, 973, 'npc_lounger_0').setDepth(975);
        lounger2.anims.play('npc_lounger_relax');
        this.ambientNPCs.push({
            name: 'Sarah',
            type: 'lounger',
            sprite: lounger2,
            quotes: [
                'QUIET COVE IS SO PEACEFUL.',
                'BEST SPOT FOR A SIESTA.',
                'HEAR THE WAVES RUSH BY...'
            ],
            bubbleOffset: 18,
            nextSpeechTime: 0
        });

        // Guest Marcus (Deck 12 Cove Cafe lounger)
        this.add.image(240, 975, 'npc_lounge_chair').setDepth(974);
        let lounger3 = this.add.sprite(240, 973, 'npc_lounger_0').setDepth(975);
        lounger3.anims.play('npc_lounger_relax');
        this.ambientNPCs.push({
            name: 'Marcus',
            type: 'lounger',
            sprite: lounger3,
            quotes: [
                'COVE CAFE ESPRESSO IS PERFECTION!',
                'SO PEACEFUL HERE ON DECK 12.',
                'LOVING THE OCEAN BREEZE!'
            ],
            bubbleOffset: 18,
            nextSpeechTime: 0
        });

        // 4. Spawn Swimming NPCs in Pools (Submerged between pool floor and front coping)
        // Swimmer Tommy (Deck 11 Main Pool in front of Funnel Vision)
        let swim1 = this.add.sprite(1020, 1255, 'npc_swimmer_0').setDepth(1255);
        swim1.anims.play('npc_swimmer_bob');
        this.ambientNPCs.push({
            name: 'Tommy',
            type: 'swimmer',
            sprite: swim1,
            minX: 940,
            maxX: 1140,
            baseY: 1255,
            speed: 18,
            dir: 1,
            phase: 0,
            quotes: [
                'SPLISH SPLASH!',
                'WATCHING CARTOONS IN WATER!',
                'THE POOL IS SO WARM!'
            ],
            bubbleOffset: 20,
            nextSpeechTime: 0
        });

        // Swimmer Alex (Deck 12 Quiet Cove Pool)
        let swim2 = this.add.sprite(620, 975, 'npc_swimmer_0').setDepth(975);
        swim2.anims.play('npc_swimmer_bob');
        this.ambientNPCs.push({
            name: 'Alex',
            type: 'swimmer',
            sprite: swim2,
            minX: 560,
            maxX: 700,
            baseY: 975,
            speed: 16,
            dir: -1,
            phase: 1.5,
            quotes: [
                'SO REFRESHING!',
                'FLOATING IN PARADISE.',
                'QUIET COVE IS THE BEST!'
            ],
            bubbleOffset: 20,
            nextSpeechTime: 0
        });

        // Swimmer Lily (Deck 13 Splashdown Pool)
        let swim3 = this.add.sprite(340, 735, 'npc_swimmer_0').setDepth(735);
        swim3.anims.play('npc_swimmer_bob');
        this.ambientNPCs.push({
            name: 'Lily',
            type: 'swimmer',
            sprite: swim3,
            minX: 270,
            maxX: 430,
            baseY: 735,
            speed: 16,
            dir: 1,
            phase: 3.0,
            quotes: [
                'THAT SLIDE WAS EPIC!',
                'LOOK AT THE BIG SPLASH!',
                'I WANNA GO AGAIN!'
            ],
            bubbleOffset: 20,
            nextSpeechTime: 0
        });
    }

    showNPCSpeech(npc, text, time) {
        if (!this.npcSpeechBox || !this.npcSpeechText) return;
        this.npcCurrentSpeaker = npc;
        this.npcSpeechText.setText(text);

        let padX = 8;
        let padY = 5;
        let w = this.npcSpeechText.width + padX * 2;
        let h = this.npcSpeechText.height + padY * 2;

        let bx = npc.sprite.x - w / 2;
        let by = npc.sprite.y - (npc.bubbleOffset || 28) - h;

        // Keep inside camera / world bounds
        bx = Phaser.Math.Clamp(bx, 20, 2380 - w);

        this.npcSpeechBox.clear();
        // Outer black border
        this.npcSpeechBox.fillStyle(0x000000, 1);
        this.npcSpeechBox.fillRect(bx - 2, by - 2, w + 4, h + 4);
        // Navy Capcom dialogue background
        this.npcSpeechBox.fillStyle(0x001024, 0.95);
        this.npcSpeechBox.fillRect(bx, by, w, h);
        // Gold 1px border
        this.npcSpeechBox.lineStyle(1, 0xF8B800, 1);
        this.npcSpeechBox.strokeRect(bx, by, w, h);

        // Downward pointer arrow
        let arrowX = Phaser.Math.Clamp(npc.sprite.x, bx + 8, bx + w - 8);
        let arrowY = by + h;
        this.npcSpeechBox.fillStyle(0x001024, 0.95);
        this.npcSpeechBox.fillTriangle(arrowX - 4, arrowY, arrowX + 4, arrowY, arrowX, arrowY + 6);
        this.npcSpeechBox.lineStyle(1, 0xF8B800, 1);
        this.npcSpeechBox.lineBetween(arrowX - 4, arrowY, arrowX, arrowY + 6);
        this.npcSpeechBox.lineBetween(arrowX, arrowY + 6, arrowX + 4, arrowY);

        this.npcSpeechText.setPosition(bx + padX, by + padY);
        this.npcSpeechBox.setVisible(true);
        this.npcSpeechText.setVisible(true);
        this.npcSpeechEndTime = time + 2500;
    }

    updateAmbientNPCs(time, delta) {
        if (!this.ambientNPCs) return;
        let dt = delta / 1000;

        // 1. Update NPC Movement & States
        for (let npc of this.ambientNPCs) {
            if (npc.type === 'walker') {
                if (npc.state === 'walk') {
                    npc.sprite.x += npc.dir * npc.speed * dt;
                    if (npc.dir > 0 && npc.sprite.x >= npc.maxX) {
                        npc.sprite.x = npc.maxX;
                        npc.state = 'pause';
                        npc.pauseTimer = 1.5 + Math.random() * 1.5;
                        npc.sprite.anims.play(npc.idleAnim, true);
                    } else if (npc.dir < 0 && npc.sprite.x <= npc.minX) {
                        npc.sprite.x = npc.minX;
                        npc.state = 'pause';
                        npc.pauseTimer = 1.5 + Math.random() * 1.5;
                        npc.sprite.anims.play(npc.idleAnim, true);
                    }
                } else if (npc.state === 'pause') {
                    npc.pauseTimer -= dt;
                    if (npc.pauseTimer <= 0) {
                        npc.dir *= -1;
                        npc.sprite.setFlipX(npc.dir < 0);
                        npc.state = 'walk';
                        npc.sprite.anims.play(npc.walkAnim, true);
                    }
                }
                npc.sprite.setDepth(Math.round(npc.sprite.y));
            } else if (npc.type === 'swimmer') {
                npc.sprite.x += npc.dir * npc.speed * dt;
                if (npc.dir > 0 && npc.sprite.x >= npc.maxX) {
                    npc.sprite.x = npc.maxX;
                    npc.dir = -1;
                    npc.sprite.setFlipX(true);
                } else if (npc.dir < 0 && npc.sprite.x <= npc.minX) {
                    npc.sprite.x = npc.minX;
                    npc.dir = 1;
                    npc.sprite.setFlipX(false);
                }
                npc.sprite.y = npc.baseY + Math.sin(time * 0.0035 + npc.phase) * 2.5;
                npc.sprite.setDepth(Math.round(npc.sprite.y));
            }
        }

        // 2. Proximity Speech Bubble Detection
        if (this.player) {
            let playerDeckY = (this.groundY !== undefined) ? this.groundY : this.player.y;
            // If bubble currently showing, check if expired or player moved away
            if (this.npcSpeechBox && this.npcSpeechBox.visible) {
                if (time > this.npcSpeechEndTime) {
                    this.npcSpeechBox.setVisible(false);
                    this.npcSpeechText.setVisible(false);
                    this.npcCurrentSpeaker = null;
                } else if (this.npcCurrentSpeaker) {
                    let d = Phaser.Math.Distance.Between(this.player.x, playerDeckY, this.npcCurrentSpeaker.sprite.x, this.npcCurrentSpeaker.sprite.y);
                    if (d > 120) {
                        this.npcSpeechBox.setVisible(false);
                        this.npcSpeechText.setVisible(false);
                        this.npcCurrentSpeaker = null;
                    }
                }
            }

            // Check if player is near any NPC to trigger greeting
            if (!this.npcSpeechBox || !this.npcSpeechBox.visible) {
                for (let npc of this.ambientNPCs) {
                    if (time < npc.nextSpeechTime) continue;
                    let dx = Math.abs(this.player.x - npc.sprite.x);
                    let dy = Math.abs(playerDeckY - npc.sprite.y);
                    if (dx < 65 && dy < 45) {
                        let quote = Phaser.Utils.Array.GetRandom(npc.quotes);
                        this.showNPCSpeech(npc, quote, time);
                        npc.nextSpeechTime = time + 7000;
                        break;
                    }
                }
            }
        }
    }

    createInGameMenu() {
        this.isMenuOpen = false;
        this.menuSelectedIndex = 0;
        this.lastMenuActionTime = 0;
        this.lastMenuNavTime = 0;
        this.lastMenuToggleTime = 0;
        this.menuItems = [
            { text: 'CONTINUE', action: () => this.closeInGameMenu() },
            { text: 'RESTART LEVEL', action: () => this.restartLevel() },
            { text: 'CHANGE CHARACTER', action: () => this.scene.start('CharacterSelectScene') },
            { text: 'TITLE SCREEN', action: () => this.scene.start('TitleScene') }
        ];

        if (this.input.keyboard && !this.enterKey) {
            this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        }

        // Direct scene GameObjects (no Container) for reliable touch & input handling
        this.menuOverlay = this.add.graphics().setScrollFactor(0).setDepth(4000).setVisible(false);
        this.menuBox = this.add.graphics().setScrollFactor(0).setDepth(4001).setVisible(false);

        // Header Title
        this.menuTitle = this.add.text(0, 0, 'PAUSE MENU', {
            fontSize: '14px', fill: '#F8B800', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 4, align: 'center'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(4002).setVisible(false);

        this.menuSub = this.add.text(0, 0, '★ DISNEY DESTINY ★', {
            fontSize: '8px', fill: '#58B8F8', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 2, align: 'center'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(4002).setVisible(false);

        // Cursor arrow
        this.menuCursor = this.add.text(0, 0, '►', {
            fontSize: '12px', fill: '#F8B800', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5).setScrollFactor(0).setDepth(4002).setVisible(false);

        // Item text objects
        this.menuTextObjects = [];
        this.menuItems.forEach((item, index) => {
            let txt = this.add.text(0, 0, item.text, {
                fontSize: '11px', fill: '#FFFFFF', fontFamily: '"Press Start 2P", monospace',
                stroke: '#000000', strokeThickness: 3
            }).setOrigin(0, 0.5).setScrollFactor(0).setDepth(4002).setVisible(false).setInteractive({ useHandCursor: true });

            const triggerItem = () => {
                this.executeMenuAction(index);
            };

            txt.on('pointerdown', triggerItem);
            txt.on('pointerup', triggerItem);
            txt.on('pointerover', () => this.setMenuIndex(index));

            this.menuTextObjects.push(txt);
        });

        // Prompt helper at bottom of box
        this.menuHelper = this.add.text(0, 0, '[ ARROWS / ENTER OR TAP ]', {
            fontSize: '8px', fill: '#B0C0D0', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 2, align: 'center'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(4002).setVisible(false);

        // Global pointer listener on scene input for 100% reliable mobile touch hit detection
        this.input.on('pointerdown', (ptr) => {
            if (this.isMenuOpen) {
                let idx = this.getMenuItemAt(ptr.x, ptr.y);
                if (idx !== -1) {
                    this.executeMenuAction(idx);
                }
            }
        });
        this.input.on('pointerup', (ptr) => {
            if (this.isMenuOpen) {
                let idx = this.getMenuItemAt(ptr.x, ptr.y);
                if (idx !== -1) {
                    this.executeMenuAction(idx);
                }
            }
        });

        // Native DOM keyboard listener (guarantees Enter, Space, Arrows, P, M, ESC work regardless of canvas focus state)
        const onNativeKeyDown = (e) => {
            if (!this.sys || !this.sys.isActive()) return;
            if (e.key === 'Escape' || e.code === 'Escape' ||
                e.key === 'p' || e.key === 'P' || e.code === 'KeyP' ||
                e.key === 'm' || e.key === 'M' || e.code === 'KeyM') {
                e.preventDefault();
                this.toggleInGameMenu();
                return;
            }
            if (this.isMenuOpen) {
                if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.code === 'KeyW' || e.code === 'ArrowUp') {
                    e.preventDefault();
                    this.navigateMenu(-1);
                } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S' || e.code === 'KeyS' || e.code === 'ArrowDown') {
                    e.preventDefault();
                    this.navigateMenu(1);
                } else if (e.key === 'Enter' || e.code === 'Enter' || e.keyCode === 13 || e.key === ' ' || e.code === 'Space') {
                    e.preventDefault();
                    this.executeMenuAction(this.menuSelectedIndex);
                }
            }
        };
        window.addEventListener('keydown', onNativeKeyDown);
        this.events.once('shutdown', () => {
            window.removeEventListener('keydown', onNativeKeyDown);
        });
    }

    getMenuItemAt(x, y) {
        if (!this.isMenuOpen || !this.menuBoxCoords) return -1;
        let b = this.menuBoxCoords;
        if (x < b.x + 8 || x > b.x + b.w - 8) return -1;
        let startY = b.y + 68;
        let itemSpacing = 30;
        for (let i = 0; i < this.menuItems.length; i++) {
            let cy = startY + i * itemSpacing;
            if (y >= cy - 15 && y <= cy + 15) {
                return i;
            }
        }
        return -1;
    }

    executeMenuAction(index) {
        let now = Date.now();
        if (this.lastMenuActionTime && (now - this.lastMenuActionTime < 350)) return;
        this.lastMenuActionTime = now;
        this.setMenuIndex(index);
        this.executeMenuItem(index);
    }

    toggleInGameMenu() {
        let now = Date.now();
        if (this.lastMenuToggleTime && (now - this.lastMenuToggleTime < 250)) return;
        this.lastMenuToggleTime = now;
        if (this.isMenuOpen) {
            this.closeInGameMenu();
        } else {
            this.openInGameMenu();
        }
    }

    openInGameMenu() {
        this.isMenuOpen = true;
        this.menuSelectedIndex = 0;
        if (this.player && this.player.body) {
            this.player.setVelocity(0, 0);
        }
        if (this.mobileInput) {
            this.mobileInput.left = false;
            this.mobileInput.right = false;
            this.mobileInput.up = false;
            this.mobileInput.down = false;
        }
        this.layoutInGameMenu(this.scale.width, this.scale.height);
        this.setMenuVisible(true);
        this.setMenuIndex(0);
    }

    closeInGameMenu() {
        this.isMenuOpen = false;
        if (this.cursorTween) {
            this.cursorTween.stop();
            this.cursorTween = null;
        }
        this.setMenuVisible(false);
    }

    setMenuVisible(visible) {
        if (this.menuOverlay) this.menuOverlay.setVisible(visible);
        if (this.menuBox) this.menuBox.setVisible(visible);
        if (this.menuTitle) this.menuTitle.setVisible(visible);
        if (this.menuSub) this.menuSub.setVisible(visible);
        if (this.menuCursor) this.menuCursor.setVisible(visible);
        if (this.menuHelper) this.menuHelper.setVisible(visible);
        if (this.menuTextObjects) {
            this.menuTextObjects.forEach(t => {
                t.setVisible(visible);
                if (t.input) t.input.enabled = visible;
            });
        }
    }

    navigateMenu(dir) {
        let now = Date.now();
        if (this.lastMenuNavTime && (now - this.lastMenuNavTime < 180)) return;
        this.lastMenuNavTime = now;
        let count = this.menuItems.length;
        this.setMenuIndex((this.menuSelectedIndex + dir + count) % count);
    }

    setMenuIndex(index) {
        this.menuSelectedIndex = index;
        if (!this.menuTextObjects || !this.menuBoxCoords) return;
        this.menuTextObjects.forEach((txt, i) => {
            if (i === index) {
                txt.setFill('#F8B800');
                let cursorBaseX = this.menuBoxCoords.x + 36;
                if (this.cursorTween) this.cursorTween.stop();
                this.menuCursor.setPosition(cursorBaseX, txt.y);
                this.cursorTween = this.tweens.add({
                    targets: this.menuCursor,
                    x: cursorBaseX + 4,
                    duration: 350,
                    yoyo: true,
                    repeat: -1
                });
            } else {
                txt.setFill('#FFFFFF');
            }
        });
    }

    executeMenuItem(index) {
        if (this.menuItems && this.menuItems[index] && this.menuItems[index].action) {
            this.menuItems[index].action();
        }
    }

    layoutInGameMenu(W, H) {
        if (!this.menuOverlay) return;

        // Overlay fill
        this.menuOverlay.clear();
        this.menuOverlay.fillStyle(0x000000, 0.70);
        this.menuOverlay.fillRect(0, 0, W, H);

        let boxW = Math.min(360, W - 32);
        let boxH = 220;
        let boxX = Math.round(W / 2 - boxW / 2);
        let boxY = Math.round(H / 2 - boxH / 2);
        this.menuBoxCoords = { x: boxX, y: boxY, w: boxW, h: boxH };

        // Capcom vintage double-border box
        let mb = this.menuBox;
        mb.clear();
        mb.fillStyle(0x000000, 1);
        mb.fillRect(boxX - 3, boxY - 3, boxW + 6, boxH + 6);
        mb.fillStyle(0xFFFFFF, 1);
        mb.fillRect(boxX - 1, boxY - 1, boxW + 2, boxH + 2);
        mb.fillStyle(0x001030, 0.96);
        mb.fillRect(boxX + 1, boxY + 1, boxW - 2, boxH - 2);

        // Gold corner rivets
        mb.fillStyle(0xF8B800, 1);
        mb.fillRect(boxX + 2, boxY + 2, 4, 4);
        mb.fillRect(boxX + boxW - 6, boxY + 2, 4, 4);
        mb.fillRect(boxX + 2, boxY + boxH - 6, 4, 4);
        mb.fillRect(boxX + boxW - 6, boxY + boxH - 6, 4, 4);

        // Header separator line
        mb.fillStyle(0x58B8F8, 1);
        mb.fillRect(boxX + 16, boxY + 44, boxW - 32, 2);

        this.menuTitle.setPosition(W / 2, boxY + 20);
        this.menuSub.setPosition(W / 2, boxY + 34);

        let startItemY = boxY + 68;
        let itemSpacing = 30;
        let itemTextX = boxX + 54;
        let rowW = boxW - 64;

        if (this.menuTextObjects) {
            this.menuTextObjects.forEach((txt, i) => {
                let itemY = startItemY + i * itemSpacing;
                txt.setPosition(itemTextX, itemY);
                txt.setFixedSize(rowW, 30);
                txt.setPadding(0, 8, 0, 8);
                if (i === this.menuSelectedIndex) {
                    let cursorBaseX = boxX + 36;
                    this.menuCursor.setPosition(cursorBaseX, itemY);
                }
            });
        }

        this.menuHelper.setPosition(W / 2, boxY + boxH - 18);
    }

    restartLevel() {
        this.closeInGameMenu();
        // Clean physics reset at Deck 11 spawn (x: 700, groundY: 1260)
        this.groundY = 1260;
        this.jumpZ = 0;
        this.jumpV = 0;
        this.isJumping = false;
        this.currentDeck = 'deck11';
        this.currentStair = null;

        let spawnY = 1260;
        let halfH = this.player.body.height / 2;
        this.player.body.reset(700, spawnY - halfH);
        this.player.y = spawnY;
        this.player.setVelocity(0, 0);
        this.player.angle = 0;
        this.player.body.allowGravity = false;
        this.player.setDepth(spawnY);

        if (this.playerShadow) {
            this.playerShadow.setPosition(700, spawnY + 18).setVisible(true).setScale(1).setAlpha(0.4);
            this.playerShadow.setDepth(spawnY - 1);
        }

        this.ridingRaft = false;
        this.onSlide = false;
        this.inWater = false;
        this.wasInWater = false;

        // Restore health nodes
        if (this.hpNodes) {
            this.hpNodes.forEach(node => node.setTexture('hp_node_full'));
        }

        // Camera flash & reposition
        this.cameras.main.flash(300, 255, 255, 255);
        this.cameras.main.centerOn(700, 1260);
    }

    layoutHUD(W, H) {
        const insets = getSafeAreaInsets();
        const topOffset = insets.top;
        const hudHeight = 42 + topOffset;
        const contentY = topOffset + 21;

        if (this.hudBg) {
            this.hudBg.clear();
            this.hudBg.fillStyle(0x001024, 0.92);
            this.hudBg.fillRect(0, 0, W, hudHeight);
            this.hudBg.lineStyle(2, 0xFFFFFF, 1);
            this.hudBg.lineBetween(0, hudHeight, W, hudHeight);
            this.hudBg.lineStyle(1, 0x000000, 1);
            this.hudBg.lineBetween(0, hudHeight + 2, W, hudHeight + 2);
        }

        const leftPadding = Math.max(12, insets.left + 8);
        const rightPadding = Math.max(12, insets.right + 8);
        const isNarrow = W < 520;
        const isVeryNarrow = W < 420;

        // --- LEFT SIDE: Player Avatar & HP ---
        if (this.hudPlayerIcon) {
            this.hudPlayerIcon.setPosition(leftPadding + 8, contentY);
        }
        let curX = leftPadding + 22;

        if (this.hudPlayerName) {
            if (isVeryNarrow) {
                this.hudPlayerName.setVisible(false);
            } else {
                this.hudPlayerName.setVisible(true);
                this.hudPlayerName.setFontSize(isNarrow ? '8px' : '10px');
                this.hudPlayerName.setOrigin(0, 0.5);
                this.hudPlayerName.setPosition(curX, contentY);
                curX += this.hudPlayerName.width + (isNarrow ? 6 : 10);
            }
        }

        if (this.hudHpText) {
            this.hudHpText.setFontSize(isNarrow ? '8px' : '10px');
            this.hudHpText.setOrigin(0, 0.5);
            this.hudHpText.setPosition(curX, contentY);
            curX += this.hudHpText.width + 6;
        }

        if (this.hpNodes) {
            const nodeSpacing = isNarrow ? 13 : 16;
            this.hpNodes.forEach((node, i) => {
                node.setScale(isNarrow ? 0.8 : 1.0);
                node.setPosition(curX + (i * nodeSpacing) + 6, contentY);
            });
        }

        // --- RIGHT SIDE: [MENU]  [ICECREAM]  $0002500 [COIN] ---
        let rightX = W - rightPadding;

        // [MENU] button anchored at top-right
        if (this.hudMenuBtn) {
            this.hudMenuBtn.setFontSize(isNarrow ? '9px' : '10px');
            this.hudMenuBtn.setOrigin(1, 0.5);
            this.hudMenuBtn.setPosition(rightX, contentY);
            rightX -= (this.hudMenuBtn.width + (isNarrow ? 8 : 14));
        }

        // Ice cream indicator
        if (this.hudIceCreamIcon) {
            this.hudIceCreamIcon.setPosition(rightX - 8, contentY);
            if (this.hudIceCreamIcon.visible) {
                rightX -= (20 + (isNarrow ? 6 : 10));
            }
        }

        // Currency score & coin icon
        if (this.hudScoreText) {
            this.hudScoreText.setFontSize(isNarrow ? '8px' : '10px');
            this.hudScoreText.setOrigin(1, 0.5);
            this.hudScoreText.setPosition(rightX, contentY);
            rightX -= (this.hudScoreText.width + 6);
        }

        if (this.hudCoinIcon) {
            this.hudCoinIcon.setScale(isNarrow ? 0.85 : 1.0);
            this.hudCoinIcon.setPosition(rightX - 6, contentY);
        }

        // --- CENTER LOCATION BANNER ---
        if (this.hudLocation) {
            this.hudLocation.setPosition(W / 2, contentY);
            if (W < 640) {
                this.hudLocation.setVisible(false);
            } else {
                this.hudLocation.setVisible(true);
                this.hudLocation.setFontSize('9px');
            }
        }

        if (this.isMenuOpen) {
            this.layoutInGameMenu(W, H);
        }
    }

    openHeroZone() {
        if (this.ridingRaft) return;
        if (this.cursors) {
            if (this.cursors.left) this.cursors.left.isDown = false;
            if (this.cursors.right) this.cursors.right.isDown = false;
            if (this.cursors.up) this.cursors.up.isDown = false;
            if (this.cursors.down) this.cursors.down.isDown = false;
        }
        if (this.wasd) {
            if (this.wasd.left) this.wasd.left.isDown = false;
            if (this.wasd.right) this.wasd.right.isDown = false;
            if (this.wasd.up) this.wasd.up.isDown = false;
            if (this.wasd.down) this.wasd.down.isDown = false;
        }
        if (this.enterKey) {
            this.enterKey.isDown = false;
        }
        if (this.spaceKey) {
            this.spaceKey.isDown = false;
        }
        if (this.input && this.input.keyboard) {
            this.input.keyboard.resetKeys();
        }
        if (this.heroZonePromptText) {
            this.heroZonePromptText.setVisible(false);
        }
        this.nearHeroZone = false;

        this.scene.pause('GameScene');
        this.scene.setVisible(false);
        this.scene.sleep('GameScene');
        this.scene.launch('HeroZoneScene', { gameScene: this });
    }

    openElevatorMenu() {
        if (this.ridingRaft) return;
        // Stop player movement
        if (this.cursors) {
            if (this.cursors.left) this.cursors.left.isDown = false;
            if (this.cursors.right) this.cursors.right.isDown = false;
            if (this.cursors.up) this.cursors.up.isDown = false;
            if (this.cursors.down) this.cursors.down.isDown = false;
        }
        if (this.wasd) {
            if (this.wasd.left) this.wasd.left.isDown = false;
            if (this.wasd.right) this.wasd.right.isDown = false;
            if (this.wasd.up) this.wasd.up.isDown = false;
            if (this.wasd.down) this.wasd.down.isDown = false;
        }
        if (this.elevatorPromptText) {
            this.elevatorPromptText.setVisible(false);
        }
        this.nearElevator = false;
        this.scene.pause('GameScene');
        this.scene.launch('ElevatorMenuScene', { gameScene: this });
    }
}

