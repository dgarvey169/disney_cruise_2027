// Game Configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#87CEEB',
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.RESIZE,
        width: '100%',
        height: '100%'
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    scene: []
};

// --- SCENES ---

class BootScene extends Phaser.Scene {
    constructor() { super('BootScene'); }
    preload() {
        let g = this.add.graphics();
        
        // Riley (Blue)
        g.fillStyle(0xffdcb1, 1); // Skin
        g.fillRect(8, 4, 16, 14); // Head
        g.fillStyle(0xA0522D, 1); // Light Brown Hair
        g.fillRect(6, 2, 20, 6);  // Top hair
        g.fillRect(6, 8, 6, 12);  // Left hair
        g.fillRect(20, 8, 6, 12); // Right hair
        g.fillStyle(0x0000ff, 1); // Blue Shirt
        g.fillRect(8, 18, 16, 16); // Body
        g.fillStyle(0xffdcb1, 1); // Arms
        g.fillRect(4, 18, 4, 14); // Left arm
        g.fillRect(24, 18, 4, 14); // Right arm
        g.fillStyle(0x000080, 1); // Dark Blue Pants
        g.fillRect(8, 34, 6, 14); // Left leg
        g.fillRect(18, 34, 6, 14); // Right leg
        g.generateTexture('riley', 32, 48);
        g.clear();

        // Amelia (Pink)
        g.fillStyle(0xffdcb1, 1); // Skin
        g.fillRect(8, 4, 16, 12); // Head
        g.fillStyle(0xA0522D, 1); // Light Brown Hair
        g.fillRect(6, 2, 20, 6);  // Top hair
        g.fillRect(6, 8, 5, 10);  // Left hair
        g.fillRect(21, 8, 5, 10); // Right hair
        g.fillStyle(0xff69b4, 1); // Pink Dress
        g.fillRect(8, 16, 16, 14); // Body
        g.fillRect(4, 26, 24, 6); // Skirt flare
        g.fillStyle(0xffdcb1, 1); // Arms
        g.fillRect(4, 16, 4, 10); // Left arm
        g.fillRect(24, 16, 4, 10); // Right arm
        g.fillStyle(0xffdcb1, 1); // Legs
        g.fillRect(10, 32, 4, 8); // Left leg
        g.fillRect(18, 32, 4, 8); // Right leg
        g.generateTexture('amelia', 32, 40);
        g.clear();
        
        // Floaties colors: Red, Yellow, Green, Purple
        const floatieColors = [0xFF0000, 0xFFFF00, 0x00FF00, 0x800080];

        for (let i = 0; i < floatieColors.length; i++) {
            let color = floatieColors[i];

            // Riley Swim
            g.fillStyle(0xffdcb1, 1); // Skin
            g.fillRect(8, 4, 16, 14); // Head
            g.fillStyle(0xA0522D, 1); // Light Brown Hair
            g.fillRect(6, 2, 20, 6);  
            g.fillRect(6, 8, 6, 12);  
            g.fillRect(20, 8, 6, 12); 
            g.fillStyle(0x0000ff, 1); // Blue Shirt
            g.fillRect(8, 18, 16, 16); 
            g.fillStyle(0xffdcb1, 1); // Arms raised
            g.fillRect(2, 8, 4, 14); 
            g.fillRect(26, 8, 4, 14); 
            // Inner tube
            g.fillStyle(color, 1);
            g.fillRoundedRect(2, 22, 28, 12, 6);
            g.fillStyle(0xFFFFFF, 1);
            g.fillRect(6, 22, 4, 12);
            g.fillRect(22, 22, 4, 12);
            g.fillStyle(0x000080, 1); // Dark Blue Pants
            g.fillRect(8, 34, 16, 10); 
            g.generateTexture('riley_swim_' + i, 32, 48);
            g.clear();

            // Amelia Swim
            g.fillStyle(0xffdcb1, 1); // Skin
            g.fillRect(8, 4, 16, 12); // Head
            g.fillStyle(0xA0522D, 1); // Light Brown Hair
            g.fillRect(6, 2, 20, 6);  
            g.fillRect(6, 8, 5, 10);  
            g.fillRect(21, 8, 5, 10); 
            g.fillStyle(0xff69b4, 1); // Pink Dress
            g.fillRect(8, 16, 16, 14); 
            g.fillStyle(0xffdcb1, 1); // Arms raised
            g.fillRect(2, 8, 4, 10); 
            g.fillRect(26, 8, 4, 10); 
            // Inner tube
            g.fillStyle(color, 1);
            g.fillRoundedRect(2, 22, 28, 12, 6);
            g.fillStyle(0xFFFFFF, 1);
            g.fillRect(6, 22, 4, 12);
            g.fillRect(22, 22, 4, 12);
            g.fillStyle(0xff69b4, 1);
            g.fillRect(6, 34, 20, 6);
            g.generateTexture('amelia_swim_' + i, 32, 40);
            g.clear();
        }
        
        // Deck (Cruise Ship Teak Wood)
        g.fillStyle(0xC19A6B, 1); 
        g.fillRect(0, 0, 40, 40);
        g.lineStyle(1, 0x8B4513, 0.5);
        for(let i = 4; i < 40; i += 8) {
            g.beginPath();
            g.moveTo(0, i);
            g.lineTo(40, i);
            g.strokePath();
        }
        g.lineStyle(2, 0x5C4033, 1);
        g.strokeRect(0, 0, 40, 40);
        g.generateTexture('deck', 40, 40);
        g.clear();

        // Upgraded Pool (Funnel Vision style)
        g.fillStyle(0xE0E0E0, 1); // White/Gray tiled lip
        g.fillRect(0, 0, 40, 40);
        g.fillStyle(0x00BFFF, 0.8); // Deep blue water
        g.fillRect(4, 4, 32, 36);
        // Water surface highlight
        g.fillStyle(0xFFFFFF, 0.4);
        g.fillRect(6, 6, 28, 4);
        g.generateTexture('pool', 40, 40);
        g.clear();

        // Thin Transparent Railing (shorter by one rung)
        g.fillStyle(0xFFFFFF, 0.5); // Semi-transparent white
        g.fillRect(0, 15, 40, 4);  // Top rail (handrail)
        g.fillRect(0, 30, 40, 2); // Mid rail 1
        g.fillRect(0, 15, 4, 25); // Left post
        g.fillRect(36, 15, 4, 25); // Right post
        g.generateTexture('railing', 40, 40);
        g.clear();

        g.fillStyle(0x8B0000, 1);
        g.fillRect(0, 0, 40, 60);
        g.generateTexture('door', 40, 60);
        g.clear();

        g.fillStyle(0xFFFFFF, 0.9);
        g.lineStyle(2, 0x0000FF, 1);
        g.fillRect(0, 0, 80, 20);
        g.strokeRect(0, 0, 80, 20);
        g.generateTexture('tube', 80, 20);
        g.clear();

        // Slide Tube (AquaMouse)
        g.fillStyle(0x87CEFA, 0.6); // Light transparent blue
        g.fillRect(0, 0, 40, 40);
        g.lineStyle(4, 0xFF4500, 0.8); // Orange/Red stripe
        g.beginPath();
        g.moveTo(0, 40);
        g.lineTo(40, 0);
        g.strokePath();
        g.lineStyle(4, 0xFFD700, 0.8); // Yellow stripe
        g.beginPath();
        g.moveTo(0, 0);
        g.lineTo(40, 40);
        g.strokePath();
        g.lineStyle(2, 0x00BFFF, 1); // Border
        g.strokeRect(0, 0, 40, 40);
        g.generateTexture('slide_tube', 40, 40);
        g.clear();

        g.fillStyle(0xffffff, 0.5);
        g.fillRoundedRect(0, 0, 80, 80, 10);
        g.generateTexture('btn', 80, 80);
        g.clear();

        // Ice Cream Stand
        g.fillStyle(0xFFFFFF, 1); // White base
        g.fillRect(0, 20, 60, 40);
        g.fillStyle(0xFFC0CB, 1); // Pink awning
        g.fillRect(0, 0, 60, 20);
        g.fillStyle(0x000000, 1);
        g.fillRect(10, 20, 40, 20); // Counter window
        g.generateTexture('icecream_stand', 60, 60);
        g.clear();

        // Ice Cream Cones (Multiple Flavors)
        const flavors = [
            { key: 'strawberry', color: 0xFF69B4 },
            { key: 'chocolate', color: 0x8B4513 },
            { key: 'vanilla', color: 0xFFFDD0 },
            { key: 'mint', color: 0x98FF98 }
        ];
        for (let flavor of flavors) {
            g.fillStyle(0xD2B48C, 1); // Cone
            g.fillTriangle(15, 30, 5, 15, 25, 15);
            g.fillStyle(flavor.color, 1);
            g.fillCircle(15, 12, 10);
            g.generateTexture('icecream_' + flavor.key, 30, 30);
            g.clear();
        }

        // Raft
        g.fillStyle(0xFFFF00, 1); // Yellow raft
        g.fillRoundedRect(0, 0, 40, 20, 8);
        g.fillStyle(0x000000, 0.2); // Inner hole
        g.fillRoundedRect(5, 5, 30, 10, 4);
        g.generateTexture('raft', 40, 20);
        g.clear();

        // Sun
        g.fillStyle(0xFFD700, 1);
        g.fillCircle(40, 40, 40);
        g.generateTexture('sun', 80, 80);
        g.clear();

        // Cloud
        g.fillStyle(0xFFFFFF, 0.8);
        g.fillCircle(30, 30, 30);
        g.fillCircle(60, 20, 20);
        g.fillCircle(80, 30, 30);
        g.fillCircle(55, 40, 25);
        g.generateTexture('cloud', 110, 60);
        g.clear();

        // Bird (V shape)
        g.lineStyle(2, 0x000000, 1);
        g.beginPath();
        g.moveTo(0, 10);
        g.lineTo(10, 20);
        g.lineTo(20, 10);
        g.strokePath();
        g.generateTexture('bird', 20, 20);
        g.clear();

        // Ship Wall (White with red stripe and spaced out portholes)
        g.fillStyle(0xFFFFFF, 1);
        g.fillRect(0, 0, 480, 120);
        g.fillStyle(0x000000, 0.1); // subtle line for deck separation
        g.fillRect(0, 0, 480, 4);
        g.fillStyle(0xFF0000, 1);
        g.fillRect(0, 110, 480, 10); // Red stripe
        
        // Portholes (Pair of them in the middle of this 480px block)
        g.fillStyle(0x444444, 1);
        g.fillCircle(200, 60, 20);
        g.fillCircle(280, 60, 20);
        
        g.fillStyle(0x87CEEB, 1);
        g.fillCircle(200, 60, 16);
        g.fillCircle(280, 60, 16);
        
        g.generateTexture('ship_wall', 480, 120);
        g.clear();

        // Ocean Background
        g.fillStyle(0x006994, 1); // Deep blue ocean
        g.fillRect(0, 0, 800, 300);
        // Add some wave details
        g.fillStyle(0x007BA7, 1);
        for(let w = 0; w < 20; w++) {
            g.fillRect(Math.random() * 800, Math.random() * 300, 40, 5);
        }
        g.generateTexture('ocean_bg', 800, 300);

        g.destroy();
    }
    create() {
        this.scene.start('TitleScene');
    }
}

class TitleScene extends Phaser.Scene {
    constructor() { super('TitleScene'); }
    create() {
        let title = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 50, 'Disney Destiny Adventure', { fontSize: '40px', fill: '#000', fontFamily: 'Arial', align: 'center' }).setOrigin(0.5);
        let startText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 50, 'Click to Start', { fontSize: '24px', fill: '#000', fontFamily: 'Arial', align: 'center' }).setOrigin(0.5);
        
        this.scale.on('resize', (gameSize) => {
            title.setPosition(gameSize.width / 2, gameSize.height / 2 - 50);
            startText.setPosition(gameSize.width / 2, gameSize.height / 2 + 50);
        });

        this.input.on('pointerdown', () => this.scene.start('CharacterSelectScene'));
    }
}

class CharacterSelectScene extends Phaser.Scene {
    constructor() { super('CharacterSelectScene'); }
    create() {
        let title = this.add.text(this.cameras.main.centerX, 100, 'Select Your Character', { fontSize: '32px', fill: '#000', fontFamily: 'Arial', align: 'center' }).setOrigin(0.5);
        
        let riley = this.add.image(this.cameras.main.centerX - 150, this.cameras.main.centerY, 'riley').setInteractive({ useHandCursor: true });
        let rileyText = this.add.text(this.cameras.main.centerX - 150, this.cameras.main.centerY + 50, 'Riley (11)', { fontSize: '20px', fill: '#000', fontFamily: 'Arial' }).setOrigin(0.5);
        
        let amelia = this.add.image(this.cameras.main.centerX + 150, this.cameras.main.centerY, 'amelia').setInteractive({ useHandCursor: true });
        let ameliaText = this.add.text(this.cameras.main.centerX + 150, this.cameras.main.centerY + 50, 'Amelia (8)', { fontSize: '20px', fill: '#000', fontFamily: 'Arial' }).setOrigin(0.5);

        this.scale.on('resize', (gameSize) => {
            title.setPosition(gameSize.width / 2, 100);
            riley.setPosition(gameSize.width / 2 - 150, gameSize.height / 2);
            rileyText.setPosition(gameSize.width / 2 - 150, gameSize.height / 2 + 50);
            amelia.setPosition(gameSize.width / 2 + 150, gameSize.height / 2);
            ameliaText.setPosition(gameSize.width / 2 + 150, gameSize.height / 2 + 50);
        });

        riley.on('pointerover', () => riley.setTint(0xcccccc));
        riley.on('pointerout', () => riley.clearTint());
        amelia.on('pointerover', () => amelia.setTint(0xcccccc));
        amelia.on('pointerout', () => amelia.clearTint());

        riley.on('pointerdown', () => this.scene.start('GameScene', { character: 'riley', name: 'Riley' }));
        amelia.on('pointerdown', () => this.scene.start('GameScene', { character: 'amelia', name: 'Amelia' }));
    }
}

class GameScene extends Phaser.Scene {
    constructor() { super('GameScene'); }
    
    init(data) {
        this.selectedCharacter = data.character; 
        this.characterName = data.name;
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

        this.scale.on('resize', (gameSize) => {
            this.oceanBg.setSize(gameSize.width, 1400);
        }); 

        // --- SHIP WALLS ---
        // Deck 11 wall (beneath y=1300 down to y=1420)
        this.add.tileSprite(0, 1300, 2400, 120, 'ship_wall').setOrigin(0, 0);

        // Deck 12 wall (beneath y=1020 down to y=1300, under Quiet Cove & Hero Zone)
        this.add.tileSprite(340, 1020, 2060, 280, 'ship_wall').setOrigin(0, 0);

        // Deck 13 wall (beneath y=780 down to y=1020, under AquaMouse)
        this.add.tileSprite(20, 780, 2040, 240, 'ship_wall').setOrigin(0, 0);

        // Top of AquaMouse structure (beneath y=360 down to y=780)
        this.add.tileSprite(700, 360, 100, 420, 'ship_wall').setOrigin(0, 0);

        const platforms = this.physics.add.staticGroup();
        const water = this.physics.add.staticGroup();
        const slides = this.physics.add.staticGroup();
        const doors = this.physics.add.staticGroup();

        const createOneWayStair = (x, y) => {
            let step = platforms.create(x, y, 'deck').setScale(1, 0.5).refreshBody();
            step.body.checkCollision.down = false;
            step.body.checkCollision.left = false;
            step.body.checkCollision.right = false;
            this.add.image(x, y - 20, 'railing').setDepth(10);
        };

        // ----------------------------------------------------
        // DECK 11 (Main Pool Deck) - y = 1300
        // ----------------------------------------------------
        platforms.create(450, 1300, 'deck').setScale(22, 1).refreshBody(); 
        water.create(1040, 1310, 'pool').setScale(7.5, 1).refreshBody();   
        platforms.create(1790, 1300, 'deck').setScale(30.5, 1).refreshBody(); 

        doors.create(400, 1250, 'door'); 
        this.add.text(360, 1190, 'Senses Spa', { fontSize: '14px', fill: '#000' });
        
        doors.create(2100, 1250, 'door');
        this.add.text(2030, 1190, 'Marceline Market', { fontSize: '14px', fill: '#000' });
        this.add.text(950, 1200, 'Funnel Vision', { fontSize: '24px', fill: '#fff', backgroundColor: '#000', padding: 10 });

        const iceCreamStands = this.physics.add.staticGroup();
        iceCreamStands.create(1500, 1250, 'icecream_stand');
        this.add.text(1460, 1200, 'Eye Scream Treats', { fontSize: '14px', fill: '#000', backgroundColor: '#FFB6C1', padding: 4 });


        // Stairs up to Deck 12 (Walk under them, then climb RIGHT)
        for(let i=0; i<6; i++) createOneWayStair(100 + (i*40), 1260 - (i*40));

        // ----------------------------------------------------
        // DECK 12 (Quiet Cove & Hero Zone) - y = 1020
        // ----------------------------------------------------
        platforms.create(1370, 1020, 'deck').setScale(51.5, 1).refreshBody(); 

        this.add.text(600, 950, 'Quiet Cove', { fontSize: '14px', fill: '#000' });
        water.create(630, 1030, 'pool').setScale(2, 1).refreshBody(); 
        
        this.add.text(1700, 950, 'Toy Story Splash', { fontSize: '14px', fill: '#000' });
        water.create(1750, 1030, 'pool').setScale(2, 1).refreshBody();

        doors.create(2000, 970, 'door');
        this.add.text(1960, 910, 'Hero Zone', { fontSize: '14px', fill: '#000' });

        // Stairs up to Deck 13 (Walk under them, then climb LEFT)
        for(let i=0; i<6; i++) createOneWayStair(2300 - (i*40), 980 - (i*40));

        this.stairsZones = this.physics.add.group();
        
        // Zone for Deck 11 -> 12 (right-up)
        // From x=100..300, y=1060..1260
        let sz1 = this.add.zone(200, 1160, 240, 240);
        this.physics.add.existing(sz1);
        sz1.body.allowGravity = false;
        sz1.stairType = 'right_up';
        this.stairsZones.add(sz1);

        // Zone for Deck 12 -> 13 (left-up)
        // From x=2100..2300, y=780..980
        let sz2 = this.add.zone(2200, 880, 240, 240);
        this.physics.add.existing(sz2);
        sz2.body.allowGravity = false;
        sz2.stairType = 'left_up';
        this.stairsZones.add(sz2);

        // ----------------------------------------------------
        // DECK 13 (AquaMouse) - y = 780
        // ----------------------------------------------------
        platforms.create(1040, 780, 'deck').setScale(51, 1).refreshBody();

        this.add.text(1200, 720, 'AquaMouse Entrance', { fontSize: '16px', fill: '#000' });
        
        // AquaMouse Raft Lift
        this.raft = this.physics.add.sprite(1200, 750, 'raft');
        this.raft.body.allowGravity = false;
        this.raft.setImmovable(true);
        
        // Wait, if ridingRaft logic goes in overlap, we can do it here. We need it to be bound after player creation though. 
        // We can create the raft and a zone here, but overlap with player must happen after player is created.
        let liftZone = this.add.zone(1200, 750, 80, 80);
        this.physics.world.enable(liftZone);
        liftZone.body.allowGravity = false;
        
        this.ridingRaft = false;
        this.liftZone = liftZone; // save reference for collider later

        // Top Deck of AquaMouse
        platforms.create(750, 360, 'deck').setScale(2.5, 1).refreshBody();
        this.add.text(700, 310, 'AquaMouse Top!', { fontSize: '16px', fill: '#000' });

        // --- RAILINGS ---
        // Foreground transparent railings
        this.add.tileSprite(0, 1280, 2400, 40, 'railing').setOrigin(0, 0).setDepth(10);
        this.add.tileSprite(340, 1000, 2060, 40, 'railing').setOrigin(0, 0).setDepth(10);
        this.add.tileSprite(20, 760, 2040, 40, 'railing').setOrigin(0, 0).setDepth(10);
        this.add.tileSprite(700, 340, 100, 40, 'railing').setOrigin(0, 0).setDepth(10); // Top deck

        // The AquaMouse Slide (circular loop around the deck!)
        let slideCurve = new Phaser.Curves.Spline([
            750, 360,
            1000, 200,
            1300, 250,
            1200, 450,
            800, 500,
            500, 600,
            350, 760
        ]);

        this.slideCurve = slideCurve;
        // Draw the lift tube visually
        let liftGraphics = this.add.graphics();
        liftGraphics.lineStyle(40, 0xFFFFFF, 0.5); 
        liftGraphics.beginPath();
        liftGraphics.moveTo(1200, 750);
        liftGraphics.lineTo(750, 360);
        liftGraphics.strokePath();
        liftGraphics.lineStyle(2, 0x0000FF, 1);
        liftGraphics.beginPath();
        liftGraphics.moveTo(1220, 740);
        liftGraphics.lineTo(770, 350);
        liftGraphics.moveTo(1180, 760);
        liftGraphics.lineTo(730, 370);
        liftGraphics.strokePath();

        // Draw the looping slide visually
        let slideGraphics = this.add.graphics();
        // Main transparent blue tube
        slideGraphics.lineStyle(40, 0x87CEFA, 0.6); 
        slideCurve.draw(slideGraphics, 64);
        
        // Orange stripe
        slideGraphics.lineStyle(4, 0xFF4500, 0.8);
        slideCurve.draw(slideGraphics, 64);
        
        // Yellow stripe (offset slightly by drawing the same curve with a slight translation? Or just keep one stripe)
        // Let's just have a thick orange/yellow core
        slideGraphics.lineStyle(2, 0xFFD700, 1);
        slideCurve.draw(slideGraphics, 64);

        // AquaMouse Splashdown Pool on Deck 13
        this.add.text(280, 720, 'Splashdown!', { fontSize: '14px', fill: '#000' });
        water.create(330, 790, 'pool').setScale(4, 1).refreshBody();

        // UI
        this.add.text(16, 16, `Playing as: ${this.characterName}`, { fontSize: '20px', fill: '#000' }).setScrollFactor(0);
        this.add.text(16, 40, 'Climb to the top of the AquaMouse and slide down!', { fontSize: '16px', fill: '#333' }).setScrollFactor(0);

        // Player (Spawn in the middle of Deck 11)
        this.player = this.physics.add.sprite(700, 1200, this.selectedCharacter);
        this.player.setBounce(0.0);
        this.player.setCollideWorldBounds(true);

        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

        // Raft Lift Logic & Slide
        this.physics.add.overlap(this.player, this.liftZone, () => {
            if (!this.ridingRaft && this.player.body.touching.down) {
                this.ridingRaft = true;
                this.player.body.allowGravity = false;
                this.player.setVelocity(0, 0);

                // 1. Lift Tween
                this.tweens.add({
                    targets: [this.player, this.raft],
                    x: 750,
                    y: 350, 
                    duration: 3000,
                    ease: 'Sine.easeInOut',
                    onComplete: () => {
                        // 2. Slide Tween (Both player and raft!)
                        let pathObj = { t: 0 };
                        this.tweens.add({
                            targets: pathObj,
                            t: 1,
                            ease: 'Sine.easeInOut',
                            duration: 4000,
                            onUpdate: () => {
                                let p = this.slideCurve.getPoint(pathObj.t);
                                this.player.x = p.x;
                                this.player.y = p.y - 10; // Player sits on raft
                                this.raft.x = p.x;
                                this.raft.y = p.y;
                            },
                            onComplete: () => {
                                // 3. Splashdown & Hop Out
                                this.ridingRaft = false;
                                this.player.body.allowGravity = true;
                                this.player.setVelocity(-200, -300); // Hop out!
                                
                                // Reset raft back to start
                                this.raft.x = 1200; 
                                this.raft.y = 750;
                            }
                        });
                    }
                });
            }
        });
        
        // Collisions
        this.physics.add.collider(this.player, platforms);
        
        this.physics.add.collider(this.player, water, () => {
            this.inWater = true;
        });



        this.hasIceCream = false;
        
        this.onStairs = false;
        this.physics.add.overlap(this.player, this.stairsZones, (player, zone) => {
            this.onStairs = zone.stairType;
        });
        this.iceCreamFlavors = ['strawberry', 'chocolate', 'vanilla', 'mint'];
        this.currentFlavorIndex = 0;
        this.iceCreamSprite = this.add.sprite(0, 0, 'icecream_strawberry');
        this.iceCreamSprite.setVisible(false);

        this.physics.add.overlap(this.player, iceCreamStands, () => {
            if (!this.hasIceCream) {
                this.hasIceCream = true;
                
                // Change flavor
                let flavor = this.iceCreamFlavors[this.currentFlavorIndex];
                this.iceCreamSprite.setTexture('icecream_' + flavor);
                this.currentFlavorIndex = (this.currentFlavorIndex + 1) % this.iceCreamFlavors.length;
                
                this.iceCreamSprite.setVisible(true);
                
                let yumText = this.add.text(this.player.x, this.player.y - 40, 'Yummy!', { fontSize: '16px', fill: '#ff0000', fontStyle: 'bold' });
                
                this.time.delayedCall(5000, () => {
                    this.hasIceCream = false;
                    this.iceCreamSprite.setVisible(false);
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

        this.cursors = this.input.keyboard.createCursorKeys();
        this.mobileInput = { left: false, right: false, up: false };

        if (!this.sys.game.device.os.desktop) {
            this.createMobileControls();
        }

        this.inWater = false;
        this.wasInWater = false;
        this.currentFloatieColor = 0;
        this.onSlide = false;
    }

    createMobileControls() {
        this.input.addPointer(2); // Enable multi-touch

        const createBtn = (x_offset, y_offset, text, key, isRightSide=false) => {
            let x = isRightSide ? this.scale.width - x_offset : x_offset;
            let y = this.scale.height - y_offset;
            let btn = this.add.image(x, y, 'btn').setScrollFactor(0).setInteractive();
            let label = this.add.text(x, y, text, { fontSize: '32px', fill: '#000', fontStyle: 'bold' }).setOrigin(0.5).setScrollFactor(0);
            
            btn.on('pointerdown', () => { btn.setTint(0xaaaaaa); this.mobileInput[key] = true; });
            btn.on('pointerup', () => { btn.clearTint(); this.mobileInput[key] = false; });
            btn.on('pointerout', () => { btn.clearTint(); this.mobileInput[key] = false; });
            return { btn, label, x_offset, y_offset, isRightSide };
        };

        let btns = [
            createBtn(60, 80, '<', 'left'),
            createBtn(160, 80, '>', 'right'),
            createBtn(60, 80, '^', 'up', true) // Anchor to right side
        ];

        this.scale.on('resize', (gameSize) => {
            for (let b of btns) {
                let x = b.isRightSide ? gameSize.width - b.x_offset : b.x_offset;
                let y = gameSize.height - b.y_offset;
                b.btn.setPosition(x, y);
                b.label.setPosition(x, y);
            }
        });
    }

    update() {
        let speed = this.inWater ? 100 : 250;
        let jumpPower = this.inWater ? -300 : -550;
        
        if (this.onSlide) {
            // Twirl logic!
            this.player.angle += 15;
            this.player.setVelocity(0, 0); // Disable physics movement while sliding
        } else if (this.ridingRaft) {
            // Player is riding raft, don't allow normal movement
            this.player.setVelocity(0, 0);
        } else {
            if (this.inWater && !this.wasInWater) {
                // Just entered water, pick a new random color for floatie (0-3)
                this.currentFloatieColor = Phaser.Math.Between(0, 3);
            }

            if (this.inWater) {
                this.player.setTexture(this.selectedCharacter + '_swim_' + this.currentFloatieColor);
                this.player.angle = (Math.sin(this.time.now / 150) * 10); // Swimming bob
            } else {
                this.player.setTexture(this.selectedCharacter);
                this.player.angle = 0; // Reset angle
            }
            // Movement
            let isLeft = this.cursors.left.isDown || this.mobileInput.left;
            let isRight = this.cursors.right.isDown || this.mobileInput.right;
            let isUp = this.cursors.up.isDown || this.mobileInput.up;

            if (this.onStairs) {
                // Ignore gravity when traversing stairs if pressing keys, to slide smoothly
                if (this.onStairs === 'right_up') {
                    if (isRight) {
                        this.player.setVelocityX(speed);
                        this.player.setVelocityY(-speed); // Climb up and right
                    } else if (isLeft) {
                        this.player.setVelocityX(-speed);
                        this.player.setVelocityY(speed); // Climb down and left
                    } else {
                        this.player.setVelocityX(0); 
                    }
                } else if (this.onStairs === 'left_up') {
                    if (isLeft) {
                        this.player.setVelocityX(-speed);
                        this.player.setVelocityY(-speed); // Climb up and left
                    } else if (isRight) {
                        this.player.setVelocityX(speed);
                        this.player.setVelocityY(speed); // Climb down and right
                    } else {
                        this.player.setVelocityX(0); 
                    }
                }
            } else {
                if (isLeft) {
                    this.player.setVelocityX(-speed);
                } else if (isRight) {
                    this.player.setVelocityX(speed);
                } else {
                    this.player.setVelocityX(0);
                }

                if (isUp && this.player.body.touching.down) {
                    this.player.setVelocityY(jumpPower);
                }
            }
        
        if (this.hasIceCream) {
            this.iceCreamSprite.x = this.player.x + 15;
            this.iceCreamSprite.y = this.player.y - 10;
        }

        // Reset states for the next frame
        this.wasInWater = this.inWater;
        this.inWater = false; 
        this.onStairs = false;
    }
}

config.scene = [BootScene, TitleScene, CharacterSelectScene, GameScene];
const game = new Phaser.Game(config);
