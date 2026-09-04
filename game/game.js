// Game Configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#87CEEB', // Sky blue background
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 }, // Snappy gravity
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
        
        // Riley
        g.fillStyle(0x0000ff, 1);
        g.fillRect(0, 0, 32, 48);
        g.generateTexture('riley', 32, 48);
        g.clear();

        // Amelia
        g.fillStyle(0xff69b4, 1);
        g.fillRect(0, 0, 32, 40);
        g.generateTexture('amelia', 32, 40);
        g.clear();
        
        // Deck
        g.fillStyle(0x8B4513, 1);
        g.lineStyle(1, 0x654321, 1);
        g.fillRect(0, 0, 40, 40);
        g.strokeRect(0, 0, 40, 40);
        g.generateTexture('deck', 40, 40);
        g.clear();

        // Pool
        g.fillStyle(0x00BFFF, 0.7);
        g.fillRect(0, 0, 40, 40);
        g.generateTexture('pool', 40, 40);
        g.clear();

        // Door
        g.fillStyle(0x8B0000, 1);
        g.fillRect(0, 0, 40, 60);
        g.generateTexture('door', 40, 60);
        g.clear();

        // AquaMouse Tube
        g.fillStyle(0xFFFFFF, 0.9);
        g.lineStyle(2, 0x0000FF, 1);
        g.fillRect(0, 0, 80, 20);
        g.strokeRect(0, 0, 80, 20);
        g.generateTexture('tube', 80, 20);
        g.destroy();
    }
    create() {
        this.scene.start('TitleScene');
    }
}

class TitleScene extends Phaser.Scene {
    constructor() { super('TitleScene'); }
    create() {
        this.add.text(400, 200, 'Disney Destiny Adventure', { fontSize: '40px', fill: '#000', fontFamily: 'Arial' }).setOrigin(0.5);
        this.add.text(400, 300, 'Click to Start', { fontSize: '24px', fill: '#000', fontFamily: 'Arial' }).setOrigin(0.5);
        
        this.input.on('pointerdown', () => {
            this.scene.start('CharacterSelectScene');
        });
    }
}

class CharacterSelectScene extends Phaser.Scene {
    constructor() { super('CharacterSelectScene'); }
    create() {
        this.add.text(400, 100, 'Select Your Character', { fontSize: '32px', fill: '#000', fontFamily: 'Arial' }).setOrigin(0.5);
        
        let riley = this.add.image(250, 300, 'riley').setInteractive({ useHandCursor: true });
        this.add.text(250, 350, 'Riley (11)', { fontSize: '20px', fill: '#000', fontFamily: 'Arial' }).setOrigin(0.5);
        
        let amelia = this.add.image(550, 300, 'amelia').setInteractive({ useHandCursor: true });
        this.add.text(550, 350, 'Amelia (8)', { fontSize: '20px', fill: '#000', fontFamily: 'Arial' }).setOrigin(0.5);

        riley.on('pointerover', () => riley.setTint(0xcccccc));
        riley.on('pointerout', () => riley.clearTint());
        amelia.on('pointerover', () => amelia.setTint(0xcccccc));
        amelia.on('pointerout', () => amelia.clearTint());

        riley.on('pointerdown', () => {
            this.scene.start('GameScene', { character: 'riley', name: 'Riley' });
        });

        amelia.on('pointerdown', () => {
            this.scene.start('GameScene', { character: 'amelia', name: 'Amelia' });
        });
    }
}

class GameScene extends Phaser.Scene {
    constructor() { super('GameScene'); }
    
    init(data) {
        this.selectedCharacter = data.character; 
        this.characterName = data.name;
    }

    create() {
        // Massive world! 2400 wide (Forward to Aft), 1400 tall
        this.physics.world.setBounds(0, 0, 2400, 1400);
        this.cameras.main.setBounds(0, 0, 2400, 1400);

        const platforms = this.physics.add.staticGroup();
        const water = this.physics.add.staticGroup();
        const doors = this.physics.add.staticGroup();

        // ----------------------------------------------------
        // DECK 11 (Main Pool Deck) - y = 1300
        // ----------------------------------------------------
        for (let x = 20; x < 900; x += 40) platforms.create(x, 1300, 'deck');      // Forward
        for (let x = 920; x <= 1200; x += 40) water.create(x, 1310, 'pool');       // Main Pools
        for (let x = 1220; x <= 2400; x += 40) platforms.create(x, 1300, 'deck');  // Aft

        // Deck 11 Facilities
        doors.create(200, 1250, 'door'); 
        this.add.text(160, 1190, 'Senses Spa', { fontSize: '14px', fill: '#000' });
        
        doors.create(2100, 1250, 'door');
        this.add.text(2030, 1190, 'Marceline Market', { fontSize: '14px', fill: '#000' });

        this.add.text(950, 1200, 'Funnel Vision', { fontSize: '24px', fill: '#fff', backgroundColor: '#000', padding: 10 });

        // Stairs up to Deck 12 (Left side & Right side)
        for(let i=0; i<6; i++) platforms.create(100 + (i*40), 1260 - (i*40), 'deck');
        for(let i=0; i<6; i++) platforms.create(2300 - (i*40), 1260 - (i*40), 'deck');


        // ----------------------------------------------------
        // DECK 12 (Quiet Cove & Hero Zone) - y = 1020
        // ----------------------------------------------------
        for (let x = 300; x <= 700; x += 40) platforms.create(x, 1020, 'deck');  // Left Balcony
        for (let x = 1400; x <= 2100; x += 40) platforms.create(x, 1020, 'deck'); // Right Balcony

        // Deck 12 Facilities
        this.add.text(350, 950, 'Quiet Cove (Adults)', { fontSize: '14px', fill: '#000' });
        water.create(500, 1030, 'pool'); 
        water.create(540, 1030, 'pool');
        
        this.add.text(1450, 950, 'Toy Story Splash', { fontSize: '14px', fill: '#000' });
        water.create(1500, 1030, 'pool');

        doors.create(1900, 970, 'door');
        this.add.text(1860, 910, 'Hero Zone', { fontSize: '14px', fill: '#000' });

        // Stairs up to Deck 13 (Middle Right)
        for(let i=0; i<5; i++) platforms.create(1600 - (i*40), 980 - (i*40), 'deck');


        // ----------------------------------------------------
        // DECK 13 (AquaMouse) - y = 780
        // ----------------------------------------------------
        for (let x = 1100; x <= 1400; x += 40) platforms.create(x, 780, 'deck');

        this.add.text(1150, 720, 'AquaMouse Entrance', { fontSize: '16px', fill: '#000' });
        
        // AquaMouse Tubes (riding high up)
        platforms.create(1050, 680, 'tube');
        platforms.create(950, 600, 'tube');
        platforms.create(850, 520, 'tube');
        platforms.create(950, 440, 'tube');
        platforms.create(1100, 360, 'tube');
        platforms.create(1250, 360, 'tube');
        platforms.create(1400, 440, 'tube');

        // UI
        this.add.text(16, 16, `Playing as: ${this.characterName}`, { fontSize: '20px', fill: '#000' }).setScrollFactor(0);
        this.add.text(16, 40, 'Explore Decks 11, 12, & 13!', { fontSize: '16px', fill: '#333' }).setScrollFactor(0);

        // Player (Spawn on Deck 11 by the main pool)
        this.player = this.physics.add.sprite(700, 1200, this.selectedCharacter);
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);

        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        this.physics.add.collider(this.player, platforms);
        
        this.physics.add.collider(this.player, water, () => {
            this.inWater = true;
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.inWater = false;
    }

    update() {
        let speed = this.inWater ? 100 : 220;
        let jumpPower = this.inWater ? -300 : -500;
        
        this.inWater = false; 

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
        } else {
            this.player.setVelocityX(0);
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(jumpPower);
        }
    }
}

config.scene = [BootScene, TitleScene, CharacterSelectScene, GameScene];
const game = new Phaser.Game(config);
