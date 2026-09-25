import os

with open('game/game.js', 'r') as f:
    game_js = f.read()

# 1. Register scenes in config.scene
game_js = game_js.replace(
    'EdgeClubScene,', 
    'EdgeClubScene,\n    HeroZoneScene,\n    AirHockeyScene,'
)

# 2. Add door zone in GameScene.create()
elevator_overlap = "        this.physics.add.overlap(this.player, this.elevatorZones, () => {\n            this.nearElevator = true;\n        });"
hero_zone_door_code = """
        // Hero Zone Door logic
        this.nearHeroZone = false;
        const heroZonePromptLabel = isTouch ? '[ TAP TO ENTER HERO ZONE ]' : '[ ENTER: HERO ZONE ]';
        this.heroZonePromptText = this.add.text(2000, 800, heroZonePromptLabel, {
            fontSize: '10px', fill: '#FFFFFF', backgroundColor: '#E83818', padding: { x: 10, y: 8 },
            fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5).setDepth(2000).setVisible(false).setInteractive({ useHandCursor: true });
        this.heroZonePromptText.on('pointerdown', () => this.openHeroZone());

        this.heroZoneDoorZone = this.add.zone(2000, 975, 100, 100);
        this.physics.add.existing(this.heroZoneDoorZone, true);
        this.physics.add.overlap(this.player, this.heroZoneDoorZone, () => {
            if (this.currentDeck === 'deck12') {
                this.nearHeroZone = true;
            }
        });
"""
if "this.nearHeroZone" not in game_js:
    game_js = game_js.replace(elevator_overlap, elevator_overlap + "\n" + hero_zone_door_code)

# 3. Handle nearHeroZone update
elevator_update = """            if (this.enterKey && Phaser.Input.Keyboard.JustDown(this.enterKey)) {
                this.openElevatorMenu();
            }
        } else {
            this.elevatorPromptText.setVisible(false);
        }"""
hero_zone_update = """
        if (this.nearHeroZone && this.currentDeck === 'deck12') {
            this.heroZonePromptText.setVisible(true);
            this.heroZonePromptText.x = this.player.x;
            this.heroZonePromptText.y = this.player.y - 60;
            if (this.enterKey && Phaser.Input.Keyboard.JustDown(this.enterKey)) {
                this.openHeroZone();
            }
        } else {
            if (this.heroZonePromptText) this.heroZonePromptText.setVisible(false);
        }
"""
if "this.heroZonePromptText.setVisible(true);" not in game_js:
    game_js = game_js.replace(elevator_update, elevator_update + "\n" + hero_zone_update)

# 4. Add reset nearHeroZone = false
reset_str = "        this.nearElevator = false;\n    }"
if "this.nearHeroZone = false;\n    }" not in game_js:
    game_js = game_js.replace(reset_str, "        this.nearElevator = false;\n        this.nearHeroZone = false;\n    }")

# 5. Add openHeroZone method
open_elevator = "    openElevatorMenu() {"
open_hero_zone_code = """
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
        if (this.heroZonePromptText) {
            this.heroZonePromptText.setVisible(false);
        }
        this.nearHeroZone = false;
        this.scene.pause('GameScene');
        this.scene.launch('HeroZoneScene', { gameScene: this });
    }
"""
if "openHeroZone()" not in game_js:
    game_js = game_js.replace(open_elevator, open_hero_zone_code + "\n" + open_elevator)


with open('game/game.js', 'w') as f:
    f.write(game_js)

print("GameScene patched successfully.")
