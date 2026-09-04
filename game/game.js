// Game configuration
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
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Initialize the game
const game = new Phaser.Game(config);

let player;
let cursors;

function preload() {
    // We don't have assets yet, so we'll generate a simple block texture for now
    let graphics = this.add.graphics();
    graphics.fillStyle(0xff0000, 1);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('placeholder_player', 32, 32);
    graphics.destroy();
    
    // Create a ground texture
    let groundGraphics = this.add.graphics();
    groundGraphics.fillStyle(0x228B22, 1);
    groundGraphics.fillRect(0, 0, 800, 40);
    groundGraphics.generateTexture('placeholder_ground', 800, 40);
    groundGraphics.destroy();
}

function create() {
    // Create static ground
    const ground = this.physics.add.staticGroup();
    ground.create(400, 580, 'placeholder_ground');

    // Create the player character (a red block for now)
    player = this.physics.add.sprite(400, 300, 'placeholder_player');
    player.setBounce(0.1);
    player.setCollideWorldBounds(true);

    // Add collision between player and ground
    this.physics.add.collider(player, ground);

    // Setup keyboard inputs
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    // Player movement logic
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
    } else {
        player.setVelocityX(0);
    }

    // Player jump logic
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-400);
    }
}
