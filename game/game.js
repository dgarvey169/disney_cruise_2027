// Game Configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#87CEEB',
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
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
        
        g.fillStyle(0x0000ff, 1);
        g.fillRect(0, 0, 32, 48);
        g.generateTexture('riley', 32, 48);
        g.clear();

        g.fillStyle(0xff69b4, 1);
        g.fillRect(0, 0, 32, 40);
        g.generateTexture('amelia', 32, 40);
        g.clear();
        
        g.fillStyle(0x8B4513, 1);
        g.lineStyle(1, 0x654321, 1);
        g.fillRect(0, 0, 40, 40);
        g.strokeRect(0, 0, 40, 40);
        g.generateTexture('deck', 40, 40);
        g.clear();

        g.fillStyle(0x00BFFF, 0.7);
        g.fillRect(0, 0, 40, 40);
        g.generateTexture('pool', 40, 40);
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
        this.input.on('pointerdown', () => this.scene.start('CharacterSelectScene'));
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

        const platforms = this.physics.add.staticGroup();
        const water = this.physics.add.staticGroup();
        const slides = this.physics.add.staticGroup();
        const doors = this.physics.add.staticGroup();

        const createOneWayStair = (x, y) => {
            let step = platforms.create(x, y, 'deck');
            step.body.checkCollision.down = false;
            step.body.checkCollision.left = false;
            step.body.checkCollision.right = false;
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

        // ----------------------------------------------------
        // DECK 13 (AquaMouse) - y = 780
        // ----------------------------------------------------
        platforms.create(1040, 780, 'deck').setScale(51, 1).refreshBody();

        this.add.text(1200, 720, 'AquaMouse Entrance', { fontSize: '16px', fill: '#000' });
        
        // AquaMouse Tubes (climbing up)
        platforms.create(1150, 680, 'tube');
        platforms.create(1050, 600, 'tube');
        platforms.create(950, 520, 'tube');
        platforms.create(850, 440, 'tube');

        // Top Deck of AquaMouse
        platforms.create(750, 360, 'deck').setScale(2.5, 1).refreshBody();
        this.add.text(700, 310, 'AquaMouse Top!', { fontSize: '16px', fill: '#000' });

        // The AquaMouse Slide (going down and left)
        for(let i=1; i<=10; i++) {
            slides.create(750 - (i*40), 360 + (i*40), 'pool');
        }

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
        
        // Collisions
        this.physics.add.collider(this.player, platforms);
        
        this.physics.add.collider(this.player, water, () => {
            this.inWater = true;
        });

        this.physics.add.collider(this.player, slides, () => {
            this.onSlide = true;
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.inWater = false;
        this.onSlide = false;
    }

    update() {
        let speed = this.inWater ? 100 : 250;
        let jumpPower = this.inWater ? -300 : -550;
        
        if (this.onSlide) {
            // Automatic sliding logic! Forces player left and prevents jumping
            this.player.setVelocityX(-400); 
        } else {
            // Normal movement
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

        // Reset states for the next frame
        this.inWater = false; 
        this.onSlide = false;
    }
}

config.scene = [BootScene, TitleScene, CharacterSelectScene, GameScene];
const game = new Phaser.Game(config);
