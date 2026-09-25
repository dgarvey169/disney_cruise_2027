import re

with open('game/game.js', 'r') as f:
    content = f.read()

# 1. Update config.scene array to include HeroZoneScene and AirHockeyScene
config_scene_match = re.search(r'(config\.scene\s*=\s*\[)([\s\S]*?)(\];)', content)
if config_scene_match:
    scenes_list = config_scene_match.group(2)
    if 'HeroZoneScene' not in scenes_list:
        new_scenes = scenes_list + "    HeroZoneScene,\n    AirHockeyScene\n"
        content = content[:config_scene_match.start(2)] + new_scenes + content[config_scene_match.end(2):]

# 2. Add door interaction logic in GameScene. 
# Around line 4595, we have: loc = 'DECK 12: HERO ZONE';
# Let's find the exact interaction block for HERO ZONE.
entry_logic = """
            if (this.currentDeck === 'deck12' && this.player.x > 1850) {
                // Launch Hero Zone
                retroArcadeAudio.play('powerup');
                this.scene.launch('HeroZoneScene', { gameScene: this });
                return;
            }
"""
# We will insert this into the handleAction method where it handles elevator/doors.
# Let's find where 'DECK 12: HERO ZONE' is set for the prompt, to find the interaction logic.
# Actually, GameScene has handleAction(). Let's check handleAction().
