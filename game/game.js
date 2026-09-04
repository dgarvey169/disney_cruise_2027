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
            gravity: { y: 800 },
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
        
        // Riley (blue placeholder)
        g.fillStyle(0x0000ff, 1);
        g.fillRect(0, 0, 32, 48);
        g.generateTexture('riley', 32, 48);
        g.clear();

        // Amelia (pink placeholder)
        g.fillStyle(0xff69b4, 1);
        g.fillRect(0, 0, 32, 40);
        g.generateTexture('amelia', 32, 40);
        g.clear();
        
        // Ship Deck block (40x40) to easily tile
        g.fillStyle(0x8B4513, 1);
        g.lineStyle(1, 0x654321, 1);
        g.fillRect(0, 0, 40, 40);
        g.strokeRect(0, 0, 40, 40);
        g.generateTexture('deck', 40, 40);
        g.clear();

        // Pool water block (40x40)
        g.fillStyle(0x00BFFF, 0.7);
        g.fillRect(0, 0, 40, 40);
        g.generateTexture('pool', 40, 40);
        g.clear();

        // AquaMouse tube platform
        g.fillStyle(0xFFFFFF, 0.9);
        g.lineStyle(2, 0x0000FF, 1);
        g.fillRect(0, 0, 120, 20);
        g.strokeRect(0, 0, 120, 20);
        g.generateTexture('tube', 120, 20);
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
        // Expand the world to be scrolling (1600px wide)
        this.physics.world.setBounds(0, 0, 1600, 600);
        this.cameras.main.setBounds(0, 0, 1600, 600);

        const platforms = this.physics.add.staticGroup();
        const water = this.physics.add.staticGroup();

        // 1. Build the Deck Floor (0 to 600, gap, 800 to 1600)
        for (let x = 20; x < 600; x += 40) {
            platforms.create(x, 580, 'deck');
        }
        for (let x = 820; x < 1600; x += 40) {
            platforms.create(x, 580, 'deck');
        }

        // 2. Build the Pool in the gap (600 to 800)
        for (let x = 620; x <= 780; x += 40) {
            // Submerged effect: water is slightly lower
            water.create(x, 595, 'pool'); 
        }

        // 3. Build the AquaMouse
        // A series of steps/tubes leading up to a slide on the right side
        platforms.create(1000, 480, 'tube');
        platforms.create(1200, 380, 'tube');
        platforms.create(1400, 280, 'tube');
        platforms.create(1200, 180, 'tube');
        platforms.create(1000, 100, 'tube'); // Top of the slide

        // UI Text (fixed to camera using setScrollFactor)
        this.add.text(16, 16, `Playing as: ${this.characterName}`, { fontSize: '20px', fill: '#000', fontFamily: 'Arial' }).setScrollFactor(0);
        this.add.text(16, 40, 'Location: Upper Deck & Pool', { fontSize: '20px', fill: '#000', fontFamily: 'Arial' }).setScrollFactor(0);
        let clubText = (this.selectedCharacter === 'riley') ? 'Find the Edge!' : 'Find the Oceaneer\'s Club!';
        this.add.text(16, 64, clubText, { fontSize: '20px', fill: '#000', fontFamily: 'Arial' }).setScrollFactor(0);
        this.add.text(16, 88, 'Use Arrow Keys to explore.', { fontSize: '16px', fill: '#333', fontFamily: 'Arial' }).setScrollFactor(0);

        // Add Player
        this.player = this.physics.add.sprite(100, 300, this.selectedCharacter);
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);

        // Make Camera follow player with a slight smooth lag
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

        // Collisions
        this.physics.add.collider(this.player, platforms);
        
        // Water collision behavior
        this.physics.add.collider(this.player, water, () => {
            this.inWater = true;
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.inWater = false;
    }

    update() {
        // Apply water effects if in pool
        let speed = this.inWater ? 100 : 200; // Slower in water
        let jumpPower = this.inWater ? -300 : -450; // Less jump in water
        
        // Reset water status every frame
        this.inWater = false; 

        // Horizontal Movement
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
        } else {
            this.player.setVelocityX(0);
        }

        // Jumping
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(jumpPower);
        }
    }
}

config.scene = [BootScene, TitleScene, CharacterSelectScene, GameScene];
const game = new Phaser.Game(config);
