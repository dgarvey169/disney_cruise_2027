// Game Configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#87CEEB', // Sky blue background
    pixelArt: true, // Crucial for 8-bit aesthetic
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },
    scene: [] // We'll push our scenes here at the bottom
};

// --- SCENES ---

// 1. BootScene: Loads assets before the game starts
class BootScene extends Phaser.Scene {
    constructor() { super('BootScene'); }
    preload() {
        // Generate placeholder graphics for our characters
        
        // Riley (11 year old - blue placeholder)
        let g = this.add.graphics();
        g.fillStyle(0x0000ff, 1);
        g.fillRect(0, 0, 32, 48); // Slightly taller
        g.generateTexture('riley', 32, 48);
        g.clear();

        // Amelia (8 year old - pink placeholder)
        g.fillStyle(0xff69b4, 1);
        g.fillRect(0, 0, 32, 40); // Slightly shorter
        g.generateTexture('amelia', 32, 40);
        g.clear();
        
        // Ship Deck / Ground
        g.fillStyle(0x8B4513, 1); // Wood-colored brown deck
        g.fillRect(0, 0, 800, 40);
        g.generateTexture('deck', 800, 40);
        g.destroy();
    }
    create() {
        this.scene.start('TitleScene');
    }
}

// 2. TitleScene: The main menu
class TitleScene extends Phaser.Scene {
    constructor() { super('TitleScene'); }
    create() {
        this.add.text(400, 200, 'Disney Destiny Adventure', { fontSize: '40px', fill: '#000', fontFamily: 'Arial' }).setOrigin(0.5);
        this.add.text(400, 300, 'Click to Start', { fontSize: '24px', fill: '#000', fontFamily: 'Arial' }).setOrigin(0.5);
        
        // Click anywhere to proceed to character select
        this.input.on('pointerdown', () => {
            this.scene.start('CharacterSelectScene');
        });
    }
}

// 3. CharacterSelectScene: Choose Riley or Amelia
class CharacterSelectScene extends Phaser.Scene {
    constructor() { super('CharacterSelectScene'); }
    create() {
        this.add.text(400, 100, 'Select Your Character', { fontSize: '32px', fill: '#000', fontFamily: 'Arial' }).setOrigin(0.5);
        
        // Riley Button
        let riley = this.add.image(250, 300, 'riley').setInteractive({ useHandCursor: true });
        this.add.text(250, 350, 'Riley (11)', { fontSize: '20px', fill: '#000', fontFamily: 'Arial' }).setOrigin(0.5);
        
        // Amelia Button
        let amelia = this.add.image(550, 300, 'amelia').setInteractive({ useHandCursor: true });
        this.add.text(550, 350, 'Amelia (8)', { fontSize: '20px', fill: '#000', fontFamily: 'Arial' }).setOrigin(0.5);

        // Hover effects
        riley.on('pointerover', () => riley.setTint(0xcccccc));
        riley.on('pointerout', () => riley.clearTint());
        
        amelia.on('pointerover', () => amelia.setTint(0xcccccc));
        amelia.on('pointerout', () => amelia.clearTint());

        // Select events
        riley.on('pointerdown', () => {
            this.scene.start('GameScene', { character: 'riley', name: 'Riley' });
        });

        amelia.on('pointerdown', () => {
            this.scene.start('GameScene', { character: 'amelia', name: 'Amelia' });
        });
    }
}

// 4. GameScene: The main gameplay on the ship
class GameScene extends Phaser.Scene {
    constructor() { super('GameScene'); }
    
    // Receive data from the previous scene
    init(data) {
        this.selectedCharacter = data.character; // 'riley' or 'amelia'
        this.characterName = data.name;
    }

    create() {
        // Create static deck ground
        const ground = this.physics.add.staticGroup();
        ground.create(400, 580, 'deck');

        // Display current area and character
        this.add.text(16, 16, `Playing as: ${this.characterName}`, { fontSize: '20px', fill: '#000', fontFamily: 'Arial' });
        this.add.text(16, 40, 'Location: Upper Deck & Pool', { fontSize: '20px', fill: '#000', fontFamily: 'Arial' });
        
        // Setup club text depending on character
        let clubText = (this.selectedCharacter === 'riley') ? 'Next Stop: Edge' : 'Next Stop: Oceaneer\'s Club';
        this.add.text(16, 64, clubText, { fontSize: '20px', fill: '#000', fontFamily: 'Arial' });

        // Create the player character based on selection
        this.player = this.physics.add.sprite(100, 300, this.selectedCharacter);
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);

        // Add collision
        this.physics.add.collider(this.player, ground);

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // Horizontal Movement
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
        } else {
            this.player.setVelocityX(0);
        }

        // Jumping
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-450);
        }
    }
}

// Register scenes
config.scene = [BootScene, TitleScene, CharacterSelectScene, GameScene];

// Start the game
const game = new Phaser.Game(config);
