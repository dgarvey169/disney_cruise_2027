class ElevatorMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ElevatorMenuScene' });
    }
    init(data) {
        this.gameScene = data.gameScene;
    }
    create() {
        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;

        this.add.rectangle(cx, cy, this.scale.width, this.scale.height, 0x000000, 0.7);
        this.add.rectangle(cx, cy, 380, 376, 0x0000AA).setStrokeStyle(4, 0xFFFFFF);
        
        this.add.text(cx, cy - 150, 'MIDSHIP ELEVATOR', {
            fontSize: '14px', fill: '#FFD700', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5);

        this.add.text(cx, cy - 124, 'SELECT DESTINATION', {
            fontSize: '9px', fill: '#A0D0FF', fontFamily: '"Press Start 2P", monospace'
        }).setOrigin(0.5);

        const floors = [
            { label: 'Deck 12 (Quiet Cove)', type: 'deck', y: 975 },
            { label: 'Deck 11 (Pools & Spa)', type: 'deck', y: 1255 }
        ];

        if (this.gameScene.selectedCharacter === 'riley') {
            floors.push({ label: 'Deck 5  (Edge Tween Club)', type: 'edge' });
        } else if (this.gameScene.selectedCharacter === 'amelia') {
            floors.push({ label: 'Deck 4  (Bibbidi Bobbidi)', type: 'boutique' });
        }

        // Oceaneer Club (Deck 2) is available for ALL characters!
        floors.push({ label: 'Deck 2  (Oceaneer Club)', type: 'oceaneer' });

        this.menuItems = [];
        let startY = cy - 84;

        floors.forEach((floor, index) => {
            let btn = this.add.text(cx, startY + (index * 34), floor.label, {
                fontSize: '9px', fill: '#FFFFFF', backgroundColor: '#000000', padding: { x: 14, y: 7 },
                fontFamily: '"Press Start 2P", monospace'
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            const item = {
                btn: btn,
                isCancel: false,
                action: () => {
                    if (floor.type === 'boutique') {
                        this.travelToBoutique();
                    } else if (floor.type === 'edge') {
                        this.travelToEdge();
                    } else if (floor.type === 'oceaneer') {
                        this.travelToOceaneer();
                    } else {
                        this.travelToFloor(floor.y);
                    }
                }
            };
            this.menuItems.push(item);

            btn.on('pointerover', () => this.setSelectedIndex(index));
            btn.on('pointerdown', () => item.action());
        });

        // Cancel option
        let cancelBtn = this.add.text(cx, startY + (floors.length * 34) + 6, '[ CANCEL ]', {
            fontSize: '9px', fill: '#FF5555', backgroundColor: '#000000', padding: { x: 14, y: 6 },
            fontFamily: '"Press Start 2P", monospace'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        const cancelItem = {
            btn: cancelBtn,
            isCancel: true,
            action: () => this.closeMenu()
        };
        this.menuItems.push(cancelItem);

        cancelBtn.on('pointerover', () => this.setSelectedIndex(this.menuItems.length - 1));
        cancelBtn.on('pointerdown', () => cancelItem.action());

        // Navigation hint
        this.add.text(cx, cy + 158, '▲/▼: SELECT   ENTER: TRAVEL', {
            fontSize: '8px', fill: '#FFD700', fontFamily: '"Press Start 2P", monospace'
        }).setOrigin(0.5);

        // Animated cursor arrow
        this.cursorArrow = this.add.text(0, 0, '►', {
            fontSize: '12px', fill: '#FFD700', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 2
        }).setOrigin(1, 0.5);

        this.arrowTween = null;

        // Determine default selected floor (select current floor or Deck 12)
        let defaultIdx = 0;
        if (this.gameScene && this.gameScene.groundY) {
            let gy = this.gameScene.groundY;
            if (gy > 1120) defaultIdx = 1;      // Deck 11
            else defaultIdx = 0;                // Deck 12
        }

        this.setSelectedIndex(defaultIdx);

        // Prevent accidental immediate activation from the enter key used to open elevator
        this.canSubmit = false;
        this.time.delayedCall(120, () => {
            this.canSubmit = true;
        });

        if (this.input.keyboard) {
            this.input.keyboard.on('keydown-UP', () => this.setSelectedIndex(this.selectedIndex - 1));
            this.input.keyboard.on('keydown-W', () => this.setSelectedIndex(this.selectedIndex - 1));
            this.input.keyboard.on('keydown-DOWN', () => this.setSelectedIndex(this.selectedIndex + 1));
            this.input.keyboard.on('keydown-S', () => this.setSelectedIndex(this.selectedIndex + 1));

            this.input.keyboard.on('keydown-ENTER', () => {
                if (!this.canSubmit) return;
                const active = this.menuItems[this.selectedIndex];
                if (active) active.action();
            });
            this.input.keyboard.on('keydown-SPACE', () => {
                if (!this.canSubmit) return;
                const active = this.menuItems[this.selectedIndex];
                if (active) active.action();
            });
            this.input.keyboard.on('keydown-ESC', () => this.closeMenu());
        }
    }

    setSelectedIndex(index) {
        if (!this.menuItems || this.menuItems.length === 0) return;
        if (index < 0) index = this.menuItems.length - 1;
        if (index >= this.menuItems.length) index = 0;
        this.selectedIndex = index;

        this.menuItems.forEach((item, idx) => {
            const isSelected = (idx === this.selectedIndex);
            if (isSelected) {
                if (item.isCancel) {
                    item.btn.setStyle({ fill: '#000000', backgroundColor: '#FF7777' });
                } else {
                    item.btn.setStyle({ fill: '#000000', backgroundColor: '#FFD700' });
                }
                const targetX = item.btn.x - (item.btn.width / 2) - 8;
                this.cursorArrow.setPosition(targetX, item.btn.y);
                this.cursorArrow.setVisible(true);
                if (this.arrowTween) {
                    this.arrowTween.remove();
                }
                this.arrowTween = this.tweens.add({
                    targets: this.cursorArrow,
                    x: targetX - 4,
                    duration: 250,
                    yoyo: true,
                    repeat: -1
                });
            } else {
                if (item.isCancel) {
                    item.btn.setStyle({ fill: '#FF5555', backgroundColor: '#000000' });
                } else {
                    item.btn.setStyle({ fill: '#FFFFFF', backgroundColor: '#000000' });
                }
            }
        });
    }

    closeMenu() {
        this.scene.stop();
        this.scene.resume('GameScene');
    }

    travelToFloor(targetGroundY) {
        this.gameScene.jumpZ = 0;
        this.gameScene.jumpV = 0;
        this.gameScene.isJumping = false;
        this.gameScene.currentStair = null;
        
        this.gameScene.player.x = 1250;
        this.gameScene.groundY = targetGroundY;
        this.gameScene.player.y = targetGroundY;
        this.gameScene.player.body.reset(1250, targetGroundY);

        this.scene.stop();
        this.scene.resume('GameScene');
    }

    travelToBoutique() {
        this.gameScene.selectedCharacter = 'amelia';
        this.gameScene.characterName = 'Amelia';
        if (this.gameScene.hudPlayerIcon) {
            this.gameScene.hudPlayerIcon.setTexture('amelia_idle');
        }
        if (this.gameScene.hudPlayerName) {
            this.gameScene.hudPlayerName.setText('AMELIA');
        }
        if (this.gameScene.layoutHUD) {
            this.gameScene.layoutHUD(this.gameScene.scale.width, this.gameScene.scale.height);
        }
        if (this.gameScene.player) {
            this.gameScene.player.setTexture('amelia_idle');
            this.gameScene.player.body.setSize(22, 16);
            this.gameScene.player.body.setOffset(5, 24);
            if (this.gameScene.player.anims) {
                this.gameScene.player.anims.play('amelia_idle', true);
            }
        }
        this.scene.stop();
        this.scene.launch('BoutiqueScene', { gameScene: this.gameScene });
    }

    travelToEdge() {
        this.gameScene.selectedCharacter = 'riley';
        this.gameScene.characterName = 'Riley';
        if (this.gameScene.hudPlayerIcon) {
            this.gameScene.hudPlayerIcon.setTexture('riley_idle');
        }
        if (this.gameScene.hudPlayerName) {
            this.gameScene.hudPlayerName.setText('RILEY');
        }
        if (this.gameScene.layoutHUD) {
            this.gameScene.layoutHUD(this.gameScene.scale.width, this.gameScene.scale.height);
        }
        if (this.gameScene.player) {
            this.gameScene.player.setTexture('riley_idle');
            this.gameScene.player.body.setSize(22, 16);
            this.gameScene.player.body.setOffset(5, 32);
            if (this.gameScene.player.anims) {
                this.gameScene.player.anims.play('riley_idle', true);
            }
        }
        if (this.gameScene && this.gameScene.scene) {
            this.gameScene.scene.setVisible(false);
            this.gameScene.scene.sleep();
        }
        this.scene.stop();
        this.scene.launch('EdgeClubScene', { gameScene: this.gameScene });
    }

    travelToOceaneer() {
        // Oceaneer Club is available to ALL characters (preserves selectedCharacter)
        if (this.input && this.input.keyboard) {
            this.input.keyboard.resetKeys();
            if (this.input.keyboard.manager) {
                this.input.keyboard.manager.queue = [];
            }
        }
        if (this.gameScene && this.gameScene.input && this.gameScene.input.keyboard) {
            this.gameScene.input.keyboard.resetKeys();
        }
        if (this.gameScene && this.gameScene.scene) {
            this.gameScene.scene.setVisible(false);
            this.gameScene.scene.sleep();
        }
        this.scene.stop();
        this.scene.launch('OceaneerClubScene', { gameScene: this.gameScene });
    }
}


