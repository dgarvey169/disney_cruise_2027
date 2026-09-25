import os

with open('game/game.js', 'r') as f:
    game_js = f.read()

with open('hero_zone_scenes.js', 'r') as f:
    hz_scenes = f.read()

if "class HeroZoneScene extends Phaser.Scene" not in game_js:
    # find config.scene = [
    target = "config.scene = ["
    game_js = game_js.replace(target, hz_scenes + "\n\n" + target)
    
    with open('game/game.js', 'w') as f:
        f.write(game_js)
    print("Hero Zone scenes appended.")
else:
    print("Scenes already exist.")
