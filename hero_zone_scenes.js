class HeroZoneScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HeroZoneScene' });
    }

    init(data) {
        this.gameScene = data.gameScene;
        this.heroSpeed = 200;
        this.jumpForce = -450;
        this.timer = 0;
        this.raceStarted = false;
        this.raceFinished = false;
        this.penaltyTextTimer = 0;
        
        // Basketball
        this.chargeTime = 0;
        this.isCharging = false;
    }

    create() {
        retroArcadeAudio.init();

        if (this.gameScene && this.gameScene.scene) {
            this.gameScene.scene.setVisible(false);
            this.gameScene.scene.sleep();
        }

        const W = this.scale.width;
        const H = this.scale.height;
        const worldW = 4000;
        this.worldW = worldW;
        
        this.physics.world.setBounds(0, 0, worldW, H);
        this.physics.world.gravity.y = 1000;

        // Backgrounds
        this.add.rectangle(0, 0, worldW * 2, H * 2, 0x111111).setOrigin(0);
        
        // Generate Incredibles Bouncy House Texture
        let bmd = this.add.graphics();
        bmd.fillStyle(0xE83818, 1);
        bmd.fillRect(0, 0, 64, 64);
        bmd.lineStyle(4, 0x000000);
        bmd.strokeRect(0, 0, 64, 64);
        bmd.fillStyle(0xF8B800, 1);
        bmd.fillCircle(32, 32, 10);
        bmd.generateTexture('hz_wall', 64, 64);
        bmd.destroy();
        
        this.add.tileSprite(0, 0, worldW, H, 'hz_wall').setOrigin(0).setAlpha(0.6).setDepth(0);

        // Ground
        this.platforms = this.physics.add.staticGroup();
        
        // Create floors with some pits
        this.createFloor(0, 800, H - 40); // Hub area
        this.createFloor(900, 1500, H - 40);
        this.createFloor(1650, 2400, H - 40);
        this.createFloor(2550, worldW, H - 40);
        
        // Door back
        this.add.rectangle(100, H - 90, 60, 100, 0x000000).setDepth(1);
        this.add.text(100, H - 150, '[ ESC / DOOR ]', { fontSize: '10px', fontFamily: '"Press Start 2P"', fill: '#FFF' }).setOrigin(0.5);

        // HUB: Basketball
        this.add.rectangle(400, H - 150, 10, 100, 0x555555); // Pole
        this.add.rectangle(420, H - 200, 40, 5, 0xF8B800); // Rim
        this.hoopSensor = this.add.zone(420, H - 195, 30, 10);
        this.physics.add.existing(this.hoopSensor, true);
        
        this.bball = this.physics.add.sprite(300, H - 60, 'hz_wall');
        this.bball.setTint(0xFF8800).setScale(0.3).setBounce(0.6).setCollideWorldBounds(true);
        this.physics.add.collider(this.bball, this.platforms);
        
        // HUB: Air Hockey Table
        this.add.rectangle(600, H - 60, 120, 40, 0x0055FF).setDepth(1);
        this.ahPrompt = this.add.text(600, H - 100, '[ ENTER: AIR HOCKEY ]', { fontSize: '10px', fontFamily: '"Press Start 2P"', fill: '#FFF' }).setOrigin(0.5).setDepth(2);
        this.ahZone = this.add.zone(600, H - 60, 150, 100);
        this.physics.add.existing(this.ahZone, true);

        // START LINE
        this.add.rectangle(800, H - 100, 10, 200, 0xFFFFFF).setDepth(1);
        this.add.text(800, H - 220, 'START', { fontSize: '16px', fontFamily: '"Press Start 2P"', fill: '#0F0' }).setOrigin(0.5);

        // OBSTACLES: Hurdles
        this.hurdles = this.physics.add.staticGroup();
        [1100, 1300, 1900, 2100, 2900, 3100, 3300].forEach(x => {
            let h = this.add.rectangle(x, H - 60, 20, 40, 0x000000);
            this.hurdles.add(h);
        });

        // OBSTACLES: Pendulums
        this.pendulums = this.physics.add.group({ allowGravity: false, immovable: true });
        this.pendulumData = [];
        [1200, 2000, 3000, 3200].forEach(x => {
            let p = this.add.circle(x, H - 150, 25, 0x444444);
            this.physics.add.existing(p);
            p.body.allowGravity = false;
            p.body.immovable = true;
            this.pendulums.add(p);
            this.pendulumData.push({ sprite: p, startX: x, timeOffset: Math.random() * Math.PI * 2 });
        });
        
        // OBSTACLES: Climbing Wall & Slide
        this.climbZone = this.add.zone(2200, H - 140, 60, 200);
        this.physics.add.existing(this.climbZone, true);
        this.add.rectangle(2200, H - 140, 60, 200, 0xF8B800).setAlpha(0.5).setDepth(0); // visual

        this.slideZone = this.add.zone(2700, H - 100, 150, 150);
        this.physics.add.existing(this.slideZone, true);
        this.add.rectangle(2700, H - 100, 150, 150, 0x00AAFF).setAlpha(0.5).setDepth(0); // visual

        // END LINE
        this.add.rectangle(3800, H - 100, 10, 200, 0xFF0000).setDepth(1);
        this.add.text(3800, H - 220, 'FINISH', { fontSize: '16px', fontFamily: '"Press Start 2P"', fill: '#F00' }).setOrigin(0.5);

        // Player
        this.player = this.physics.add.sprite(150, H - 100, 'riley_idle').setDepth(10);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.hurdles, this.hitObstacle, null, this);
        this.physics.add.overlap(this.player, this.pendulums, this.hitObstacle, null, this);

        // NPC Racer
        this.npc = this.physics.add.sprite(750, H - 100, 'npc_tourist_idle').setDepth(9).setTint(0xFF5555);
        this.physics.add.collider(this.npc, this.platforms);
        this.physics.add.collider(this.npc, this.hurdles);

        // Camera
        this.cameras.main.setBounds(0, 0, worldW, H);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        // UI
        this.uiTimer = this.add.text(W / 2, 30, 'TIME: 0.00', { fontSize: '18px', fontFamily: '"Press Start 2P"', fill: '#FFF' }).setOrigin(0.5).setScrollFactor(0).setDepth(100);
        this.uiPenalty = this.add.text(W / 2, 60, '+3.00s', { fontSize: '16px', fontFamily: '"Press Start 2P"', fill: '#F00' }).setOrigin(0.5).setScrollFactor(0).setDepth(100).setVisible(false);

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
            esc: Phaser.Input.Keyboard.KeyCodes.ESC,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE
        });

        // Touch controls setup (similar to others, simplified)
        this.input.addPointer(2);
    }

    createFloor(x1, x2, y) {
        let w = x2 - x1;
        let f = this.add.rectangle(x1 + w/2, y + 20, w, 40, 0x990000);
        this.physics.add.existing(f, true);
        this.platforms.add(f);
    }

    hitObstacle(player, obstacle) {
        if (!this.raceStarted || this.raceFinished) return;
        if (this.penaltyTextTimer > this.time.now) return; // Cooldown
        
        retroArcadeAudio.play('explosion');
        this.timer += 3000;
        this.uiPenalty.setVisible(true);
        this.penaltyTextTimer = this.time.now + 1000;
        
        // Knockback
        this.player.setVelocity(-150, -200);
        
        this.tweens.add({
            targets: this.player,
            alpha: 0,
            duration: 100,
            yoyo: true,
            repeat: 3
        });
    }

    update(time, delta) {
        if (this.wasd.esc.isDown && !this.isExiting) {
            this.isExiting = true;
            this.scene.stop('HeroZoneScene');
            if (this.gameScene && this.gameScene.scene) {
                this.gameScene.scene.wake();
                this.gameScene.scene.setVisible(true);
            }
            return;
        }

        // Air Hockey Trigger
        if (this.physics.overlap(this.player, this.ahZone) && Phaser.Input.Keyboard.JustDown(this.wasd.enter)) {
            this.scene.launch('AirHockeyScene', { heroZone: this });
            this.scene.pause();
        }

        // Basketball Logic
        if (this.player.x < 800) {
            let dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.bball.x, this.bball.y);
            if (dist < 40) {
                if (this.wasd.space.isDown) {
                    this.isCharging = true;
                    this.chargeTime += delta;
                    this.bball.x = this.player.x;
                    this.bball.y = this.player.y - 30;
                    this.bball.body.allowGravity = false;
                    this.bball.setVelocity(0, 0);
                } else if (this.isCharging) {
                    this.isCharging = false;
                    this.bball.body.allowGravity = true;
                    let powerX = Math.min(this.chargeTime * 0.5, 400);
                    let powerY = Math.min(this.chargeTime * 0.8, 600);
                    this.bball.setVelocity(this.player.flipX ? -powerX : powerX, -powerY);
                    this.chargeTime = 0;
                    retroArcadeAudio.play('shoot');
                }
            }
        }
        
        // Hoops score
        if (this.physics.overlap(this.bball, this.hoopSensor)) {
            if (this.bball.body.velocity.y > 0) { // Going down through hoop
                retroArcadeAudio.play('powerup');
                this.bball.setVelocity(0, 50);
                this.bball.x = this.hoopSensor.x;
            }
        }

        // Pendulums
        this.pendulumData.forEach(p => {
            p.sprite.x = p.startX + Math.sin((time * 0.003) + p.timeOffset) * 100;
        });

        // Player Movement
        let left = this.cursors.left.isDown || this.wasd.left.isDown;
        let right = this.cursors.right.isDown || this.wasd.right.isDown;
        let up = this.cursors.up.isDown || this.wasd.up.isDown;
        let down = this.cursors.down.isDown || this.wasd.down.isDown;

        // Climbing
        let isClimbing = false;
        if (this.physics.overlap(this.player, this.climbZone)) {
            this.player.body.allowGravity = false;
            isClimbing = true;
            if (up) this.player.setVelocityY(-150);
            else if (down) this.player.setVelocityY(150);
            else this.player.setVelocityY(0);
        } else {
            this.player.body.allowGravity = true;
        }

        // Sliding
        if (this.physics.overlap(this.player, this.slideZone)) {
            this.player.setVelocityX(300);
            this.player.setVelocityY(300);
        } else {
            if (left) {
                this.player.setVelocityX(-this.heroSpeed);
                this.player.flipX = true;
                if (!isClimbing) this.player.anims.play('riley_walk', true);
            } else if (right) {
                this.player.setVelocityX(this.heroSpeed);
                this.player.flipX = false;
                if (!isClimbing) this.player.anims.play('riley_walk', true);
            } else {
                this.player.setVelocityX(0);
                if (!isClimbing) this.player.anims.play('riley_idle', true);
            }
        }

        // Jumping
        if (up && this.player.body.touching.down && !isClimbing) {
            this.player.setVelocityY(this.jumpForce);
            retroArcadeAudio.play('jump');
        }

        // Pitfalls
        if (this.player.y > this.scale.height - 10) {
            this.hitObstacle(this.player, null);
            this.player.y = this.scale.height - 100;
            this.player.setVelocityY(0);
        }

        // Race Logic
        if (this.player.x > 800 && !this.raceStarted) {
            this.raceStarted = true;
            retroArcadeAudio.play('powerup');
        }

        if (this.raceStarted && !this.raceFinished) {
            this.timer += delta;
            this.uiTimer.setText('TIME: ' + (this.timer / 1000).toFixed(2));
            
            // NPC AI
            if (this.npc.x < 3800) {
                this.npc.setVelocityX(140);
                this.npc.anims.play('npc_tourist_walk', true);
                
                // Jump over hurdles/pits logic for NPC
                let jump = false;
                [1100, 1300, 1900, 2100, 2900, 3100, 3300].forEach(hx => {
                    if (this.npc.x > hx - 50 && this.npc.x < hx && this.npc.body.touching.down) jump = true;
                });
                // Pits
                if (this.npc.x > 800 && this.npc.x < 900 && this.npc.body.touching.down) jump = true;
                if (this.npc.x > 1500 && this.npc.x < 1650 && this.npc.body.touching.down) jump = true;
                if (this.npc.x > 2400 && this.npc.x < 2550 && this.npc.body.touching.down) jump = true;
                
                if (jump && this.npc.body.touching.down) {
                    this.npc.setVelocityY(this.jumpForce);
                }
            }

            // Finish
            if (this.player.x >= 3800) {
                this.raceFinished = true;
                retroArcadeAudio.play('powerup');
                let winMsg = this.npc.x >= 3800 ? "NPC WINS!" : "RILEY WINS!";
                let fin = this.add.text(this.scale.width/2, this.scale.height/2, 'COURSE COMPLETE!\n' + winMsg + '\nTIME: ' + (this.timer/1000).toFixed(2), {
                    fontSize: '24px', fontFamily: '"Press Start 2P"', fill: '#FFD700', align: 'center', backgroundColor: '#000', padding: 20
                }).setOrigin(0.5).setScrollFactor(0).setDepth(200);
            }
        }

        if (this.penaltyTextTimer > 0 && time > this.penaltyTextTimer) {
            this.uiPenalty.setVisible(false);
            this.penaltyTextTimer = 0;
        }
    }
}

class AirHockeyScene extends Phaser.Scene {
    constructor() {
        super({ key: 'AirHockeyScene' });
    }
    
    init(data) {
        this.parentScene = data.heroZone;
        this.playerScore = 0;
        this.aiScore = 0;
        this.isGameOver = false;
    }

    create() {
        const W = this.scale.width;
        const H = this.scale.height;
        
        this.add.rectangle(0, 0, W, H, 0x000000, 0.8).setOrigin(0);
        
        let cx = W/2;
        let cy = H/2;
        
        // Table
        this.add.rectangle(cx, cy, 300, 500, 0xFFFFFF).setStrokeStyle(4, 0x0000FF);
        this.add.line(cx, cy, -150, 0, 150, 0, 0xFF0000); // Center line
        this.add.circle(cx, cy, 40).setStrokeStyle(4, 0xFF0000);
        
        // Goals
        this.goalTop = this.add.zone(cx, cy - 250, 100, 20);
        this.physics.add.existing(this.goalTop, true);
        this.add.rectangle(cx, cy - 250, 100, 10, 0x000000);
        
        this.goalBot = this.add.zone(cx, cy + 250, 100, 20);
        this.physics.add.existing(this.goalBot, true);
        this.add.rectangle(cx, cy + 250, 100, 10, 0x000000);
        
        // Physics bounds
        this.physics.world.setBounds(cx - 150, cy - 250, 300, 500);
        
        // Puck
        this.puck = this.physics.add.sprite(cx, cy, 'hz_wall').setScale(0.3).setTint(0x000000);
        this.puck.setBounce(1, 1).setCollideWorldBounds(true);
        this.puck.body.setCircle(32);
        this.puck.body.allowGravity = false;
        
        // Paddles
        this.paddlePlayer = this.physics.add.sprite(cx, cy + 200, 'hz_wall').setScale(0.5).setTint(0x00FF00);
        this.paddlePlayer.setCollideWorldBounds(true).setImmovable(true);
        this.paddlePlayer.body.setCircle(32);
        this.paddlePlayer.body.allowGravity = false;
        
        this.paddleAI = this.physics.add.sprite(cx, cy - 200, 'hz_wall').setScale(0.5).setTint(0xFF0000);
        this.paddleAI.setCollideWorldBounds(true).setImmovable(true);
        this.paddleAI.body.setCircle(32);
        this.paddleAI.body.allowGravity = false;
        
        this.physics.add.collider(this.puck, this.paddlePlayer);
        this.physics.add.collider(this.puck, this.paddleAI);
        
        // UI
        this.scoreText = this.add.text(W/2 + 200, H/2, 'SCORE\nP:0\nAI:0', { fontSize: '16px', fontFamily: '"Press Start 2P"', fill: '#FFF' }).setOrigin(0.5);
        this.add.text(W/2, H - 40, '[ ESC TO EXIT ]', { fontSize: '10px', fontFamily: '"Press Start 2P"', fill: '#FFF' }).setOrigin(0.5);
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            esc: Phaser.Input.Keyboard.KeyCodes.ESC
        });
        
        this.resetPuck();
    }
    
    resetPuck() {
        this.puck.setPosition(this.scale.width/2, this.scale.height/2);
        let vx = (Math.random() - 0.5) * 400;
        let vy = (Math.random() > 0.5 ? 200 : -200);
        this.puck.setVelocity(vx, vy);
    }
    
    update(time, delta) {
        if (this.wasd.esc.isDown) {
            this.scene.stop();
            if (this.parentScene) this.parentScene.scene.resume();
            return;
        }
        if (this.isGameOver) return;
        
        // Player Input
        let speed = 400;
        let vx = 0; let vy = 0;
        if (this.cursors.left.isDown || this.wasd.left.isDown) vx = -speed;
        if (this.cursors.right.isDown || this.wasd.right.isDown) vx = speed;
        if (this.cursors.up.isDown || this.wasd.up.isDown) vy = -speed;
        if (this.cursors.down.isDown || this.wasd.down.isDown) vy = speed;
        
        this.paddlePlayer.setVelocity(vx, vy);
        // Constrain player to bottom half
        if (this.paddlePlayer.y < this.scale.height/2) this.paddlePlayer.y = this.scale.height/2;
        
        // AI Logic
        if (this.puck.y < this.scale.height/2) {
            if (this.paddleAI.x < this.puck.x - 10) this.paddleAI.setVelocityX(250);
            else if (this.paddleAI.x > this.puck.x + 10) this.paddleAI.setVelocityX(-250);
            else this.paddleAI.setVelocityX(0);
        } else {
            // Return to center
            if (this.paddleAI.x < this.scale.width/2 - 10) this.paddleAI.setVelocityX(200);
            else if (this.paddleAI.x > this.scale.width/2 + 10) this.paddleAI.setVelocityX(-200);
            else this.paddleAI.setVelocityX(0);
        }
        
        // Goal checks
        if (this.physics.overlap(this.puck, this.goalTop)) {
            this.playerScore++;
            this.updateScore();
        } else if (this.physics.overlap(this.puck, this.goalBot)) {
            this.aiScore++;
            this.updateScore();
        }
    }
    
    updateScore() {
        retroArcadeAudio.play('powerup');
        this.scoreText.setText('SCORE\nP:' + this.playerScore + '\nAI:' + this.aiScore);
        if (this.playerScore >= 3 || this.aiScore >= 3) {
            this.isGameOver = true;
            this.puck.setVelocity(0,0);
            let msg = this.playerScore >= 3 ? "YOU WIN!" : "AI WINS!";
            this.add.text(this.scale.width/2, this.scale.height/2, msg, { fontSize: '24px', fontFamily: '"Press Start 2P"', fill: '#FFF' }).setOrigin(0.5);
        } else {
            this.resetPuck();
        }
    }
}
