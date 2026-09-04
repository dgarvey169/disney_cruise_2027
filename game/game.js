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
        
        // Riley (Blue)
        g.fillStyle(0xffdcb1, 1); // Skin
        g.fillRect(8, 4, 16, 14); // Head
        g.fillStyle(0x8B4513, 1); // Brown Hair
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
        g.fillStyle(0xFFD700, 1); // Blonde Hair
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

        // Ice Cream Cone
        g.fillStyle(0xD2B48C, 1); // Cone
        g.fillTriangle(15, 30, 5, 15, 25, 15);
        g.fillStyle(0xFF69B4, 1); // Strawberry ice cream
        g.fillCircle(15, 12, 10);
        g.generateTexture('icecream', 30, 30);
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

        // The AquaMouse Slide (going down and left, one-way collision so you can walk through it)
        for(let i=1; i<=10; i++) {
            let slideBlock = slides.create(750 - (i*40), 360 + (i*40), 'slide_tube');
            slideBlock.setVisible(false); // Hide the staircase physics blocks
            slideBlock.body.checkCollision.down = false;
            slideBlock.body.checkCollision.left = false;
            slideBlock.body.checkCollision.right = false;
        }

        // Draw a smooth, continuous slide visual
        let slideGraphics = this.add.graphics();
        // Main transparent blue tube
        slideGraphics.lineStyle(40, 0x87CEFA, 0.6); 
        slideGraphics.beginPath();
        slideGraphics.moveTo(750, 380);
        slideGraphics.lineTo(350, 780);
        slideGraphics.strokePath();
        
        // Orange stripe
        slideGraphics.lineStyle(6, 0xFF4500, 0.8);
        slideGraphics.beginPath();
        slideGraphics.moveTo(760, 370);
        slideGraphics.lineTo(360, 770);
        slideGraphics.strokePath();
        
        // Yellow stripe
        slideGraphics.lineStyle(6, 0xFFD700, 0.8);
        slideGraphics.beginPath();
        slideGraphics.moveTo(740, 390);
        slideGraphics.lineTo(340, 790);
        slideGraphics.strokePath();
        
        // Tube borders
        slideGraphics.lineStyle(2, 0x00BFFF, 1);
        slideGraphics.beginPath();
        slideGraphics.moveTo(770, 360);
        slideGraphics.lineTo(370, 760); // Top border
        slideGraphics.moveTo(730, 400);
        slideGraphics.lineTo(330, 800); // Bottom border
        slideGraphics.strokePath();

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

        this.hasIceCream = false;
        this.iceCreamSprite = this.add.sprite(0, 0, 'icecream');
        this.iceCreamSprite.setVisible(false);

        this.physics.add.overlap(this.player, iceCreamStands, () => {
            if (!this.hasIceCream) {
                this.hasIceCream = true;
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
        this.onSlide = false;
    }

    createMobileControls() {
        this.input.addPointer(2); // Enable multi-touch

        const createBtn = (x, y, text, key) => {
            let btn = this.add.image(x, y, 'btn').setScrollFactor(0).setInteractive();
            let label = this.add.text(x, y, text, { fontSize: '32px', fill: '#000', fontStyle: 'bold' }).setOrigin(0.5).setScrollFactor(0);
            
            btn.on('pointerdown', () => { btn.setTint(0xaaaaaa); this.mobileInput[key] = true; });
            btn.on('pointerup', () => { btn.clearTint(); this.mobileInput[key] = false; });
            btn.on('pointerout', () => { btn.clearTint(); this.mobileInput[key] = false; });
        };

        createBtn(60, 520, '<', 'left');
        createBtn(160, 520, '>', 'right');
        createBtn(740, 520, '^', 'up');
    }

    update() {
        let speed = this.inWater ? 100 : 250;
        let jumpPower = this.inWater ? -300 : -550;
        
        if (this.onSlide) {
            // Automatic sliding logic! Forces player left and prevents jumping
            this.player.setVelocityX(-400); 
            // Twirl logic!
            this.player.angle += 15;
        } else {
            this.player.angle = 0; // Reset angle
            // Normal movement
            let isLeft = this.cursors.left.isDown || this.mobileInput.left;
            let isRight = this.cursors.right.isDown || this.mobileInput.right;
            let isUp = this.cursors.up.isDown || this.mobileInput.up;

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
        this.inWater = false; 
        this.onSlide = false;
    }
}

config.scene = [BootScene, TitleScene, CharacterSelectScene, GameScene];
const game = new Phaser.Game(config);
