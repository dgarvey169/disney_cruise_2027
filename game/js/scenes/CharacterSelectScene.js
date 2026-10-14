class CharacterSelectScene extends Phaser.Scene {
    constructor() { super('CharacterSelectScene'); }

    create() {
        this.bgGraphics = this.add.graphics();
        this.cardGraphics = this.add.graphics();
        this.dialogueGraphics = this.add.graphics();

        this.selectedHero = 'riley';

        // Header Title
        this.headerText = this.add.text(0, 0, 'SELECT HERO', {
            fontSize: '18px', fill: '#F8B800', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 4, align: 'center'
        }).setOrigin(0.5);

        this.headerSub = this.add.text(0, 0, '1P OR 2P CONTROLLER', {
            fontSize: '9px', fill: '#FFFFFF', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 3, align: 'center'
        }).setOrigin(0.5);

        // Riley Elements
        this.rileySprite = this.add.image(0, 0, 'riley').setScale(3).setInteractive({ useHandCursor: true });
        this.rileyName = this.add.text(0, 0, '1P: RILEY', {
            fontSize: '13px', fill: '#F8B800', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5);
        this.rileyAge = this.add.text(0, 0, 'AGE: 11', {
            fontSize: '10px', fill: '#FFFFFF', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5);
        this.rileyRole = this.add.text(0, 0, '[ EDGE TWEEN ]', {
            fontSize: '9px', fill: '#58B8F8', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5);

        // Amelia Elements
        this.ameliaSprite = this.add.image(0, 0, 'amelia').setScale(3).setInteractive({ useHandCursor: true });
        this.ameliaName = this.add.text(0, 0, '2P: AMELIA', {
            fontSize: '13px', fill: '#FFFFFF', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5);
        this.ameliaAge = this.add.text(0, 0, 'AGE: 8', {
            fontSize: '10px', fill: '#FFFFFF', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5);
        this.ameliaRole = this.add.text(0, 0, '[ OCEANEER CLUB ]', {
            fontSize: '9px', fill: '#F85898', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5);

        // Cursor Arrow
        this.cursorArrow = this.add.text(0, 0, '►', {
            fontSize: '16px', fill: '#F8B800', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5);

        this.tweens.add({
            targets: this.cursorArrow,
            x: '+=6',
            duration: 350,
            yoyo: true,
            repeat: -1
        });

        // Bottom Capcom Dialogue Box Text
        this.dialogueText = this.add.text(0, 0, '', {
            fontSize: '10px', fill: '#FFFFFF', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 2, align: 'center', wordWrap: { width: 440 }
        }).setOrigin(0.5);

        // Back Button
        this.backBtn = this.add.text(0, 0, '◄ TITLE', {
            fontSize: '10px', fill: '#58B8F8', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 2
        }).setOrigin(0, 0.5).setInteractive({ useHandCursor: true });
        this.backBtn.on('pointerdown', () => this.scene.start('TitleScene'));

        this.startBtnPrompt = this.add.text(0, 0, 'PRESS ENTER OR TAP TO EMBARK', {
            fontSize: '9px', fill: '#F8B800', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5);
        this.tweens.add({
            targets: this.startBtnPrompt,
            alpha: 0.2,
            duration: 600,
            yoyo: true,
            repeat: -1
        });

        // Interactive Character Hover & Selection
        this.rileySprite.on('pointerover', () => this.selectHero('riley'));
        this.ameliaSprite.on('pointerover', () => this.selectHero('amelia'));

        this.rileySprite.on('pointerdown', () => this.confirmSelection('riley'));
        this.ameliaSprite.on('pointerdown', () => this.confirmSelection('amelia'));

        if (this.input.keyboard) {
            this.input.keyboard.on('keydown-LEFT', () => this.selectHero('riley'));
            this.input.keyboard.on('keydown-A', () => this.selectHero('riley'));
            this.input.keyboard.on('keydown-RIGHT', () => this.selectHero('amelia'));
            this.input.keyboard.on('keydown-D', () => this.selectHero('amelia'));
            this.input.keyboard.on('keydown-UP', () => this.selectHero(this.selectedHero === 'riley' ? 'amelia' : 'riley'));
            this.input.keyboard.on('keydown-DOWN', () => this.selectHero(this.selectedHero === 'riley' ? 'amelia' : 'riley'));

            this.input.keyboard.on('keydown-ENTER', () => this.confirmSelection(this.selectedHero));
            this.input.keyboard.on('keydown-SPACE', () => this.confirmSelection(this.selectedHero));
            this.input.keyboard.on('keydown-ESC', () => this.scene.start('TitleScene'));
        }

        this.layout(this.scale.width, this.scale.height);

        const resizeHandler = (gameSize) => {
            if (this.sys && this.sys.isActive()) {
                this.layout(gameSize.width, gameSize.height);
            }
        };
        this.scale.on('resize', resizeHandler);
        this.events.once('shutdown', () => {
            this.scale.off('resize', resizeHandler);
        });

        this.selectHero('riley');
    }

    selectHero(hero) {
        this.selectedHero = hero;
        if (hero === 'riley') {
            this.rileyName.setFill('#F8B800');
            this.ameliaName.setFill('#FFFFFF');
            this.dialogueText.setText('"RILEY: LET\'S RACE UP TO DECK 11 & EXPLORE THE SHIP!"');
            this.rileySprite.setTint(0xFFFFFF);
            this.ameliaSprite.setTint(0x888888);
        } else {
            this.ameliaName.setFill('#F8B800');
            this.rileyName.setFill('#FFFFFF');
            this.dialogueText.setText('"AMELIA: READY FOR DECK 12 POOLS & ICE CREAM STANDS!"');
            this.ameliaSprite.setTint(0xFFFFFF);
            this.rileySprite.setTint(0x888888);
        }
        this.drawCards(this.scale.width, this.scale.height);
    }

    confirmSelection(hero) {
        this.cameras.main.flash(300, 255, 255, 255);
        this.time.delayedCall(200, () => {
            let name = hero === 'riley' ? 'Riley' : 'Amelia';
            this.scene.start('GameScene', { character: hero, name: name });
        });
    }

    layout(W, H) {
        let insets = getSafeAreaInsets();
        let g = this.bgGraphics;
        g.clear();

        // Midnight NES Space/Tech Background
        g.fillStyle(0x000818, 1);
        g.fillRect(0, 0, W, H);

        // 16x16 Subtle Retro Grid
        g.lineStyle(1, 0x001838, 0.4);
        for (let x = 0; x < W; x += 16) {
            g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.strokePath();
        }
        for (let y = 0; y < H; y += 16) {
            g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.strokePath();
        }

        // Header
        let headerY = Math.max(30, insets.top + 22);
        this.headerText.setPosition(W / 2, headerY);
        this.headerSub.setPosition(W / 2, headerY + 20);

        // Back button
        this.backBtn.setPosition(Math.max(16, insets.left + 12), headerY);

        let isPortrait = (W < 520 && H > W);
        this.isPortrait = isPortrait;

        if (isPortrait) {
            let cardH = 120;
            let cardW = Math.min(320, W - 40);
            let y1 = headerY + 65;
            let y2 = y1 + cardH + 16;

            this.rileyCard = { x: W / 2 - cardW / 2, y: y1, w: cardW, h: cardH };
            this.ameliaCard = { x: W / 2 - cardW / 2, y: y2, w: cardW, h: cardH };

            this.rileySprite.setPosition(W / 2 - cardW / 2 + 50, y1 + 60);
            this.rileyName.setPosition(W / 2 + 25, y1 + 35);
            this.rileyAge.setPosition(W / 2 + 25, y1 + 58);
            this.rileyRole.setPosition(W / 2 + 25, y1 + 80);

            this.ameliaSprite.setPosition(W / 2 - cardW / 2 + 50, y2 + 60);
            this.ameliaName.setPosition(W / 2 + 25, y2 + 35);
            this.ameliaAge.setPosition(W / 2 + 25, y2 + 58);
            this.ameliaRole.setPosition(W / 2 + 25, y2 + 80);

            let dlgY = y2 + cardH + 18;
            this.dialogueBox = { x: W / 2 - cardW / 2, y: dlgY, w: cardW, h: 52 };
            this.dialogueText.setPosition(W / 2, dlgY + 26);
            this.dialogueText.setWordWrapWidth(cardW - 24);

            this.startBtnPrompt.setPosition(W / 2, dlgY + 66);
        } else {
            let cardW = Math.min(220, (W - 80) / 2);
            let cardH = 180;
            let centerY = H * 0.44;
            let spacing = cardW / 2 + 16;

            let x1 = W / 2 - spacing - cardW / 2;
            let x2 = W / 2 + spacing - cardW / 2;
            let cardY = centerY - cardH / 2;

            this.rileyCard = { x: x1, y: cardY, w: cardW, h: cardH };
            this.ameliaCard = { x: x2, y: cardY, w: cardW, h: cardH };

            this.rileySprite.setPosition(x1 + cardW / 2, cardY + 65);
            this.rileyName.setPosition(x1 + cardW / 2, cardY + 122);
            this.rileyAge.setPosition(x1 + cardW / 2, cardY + 142);
            this.rileyRole.setPosition(x1 + cardW / 2, cardY + 162);

            this.ameliaSprite.setPosition(x2 + cardW / 2, cardY + 65);
            this.ameliaName.setPosition(x2 + cardW / 2, cardY + 122);
            this.ameliaAge.setPosition(x2 + cardW / 2, cardY + 142);
            this.ameliaRole.setPosition(x2 + cardW / 2, cardY + 162);

            let dlgW = Math.min(560, W - 40);
            let dlgH = 46;
            let dlgY = cardY + cardH + 20;
            this.dialogueBox = { x: W / 2 - dlgW / 2, y: dlgY, w: dlgW, h: dlgH };
            this.dialogueText.setPosition(W / 2, dlgY + dlgH / 2);
            this.dialogueText.setWordWrapWidth(dlgW - 24);

            this.startBtnPrompt.setPosition(W / 2, dlgY + dlgH + 22);
        }

        this.drawCards(W, H);
    }

    drawCards(W, H) {
        if (!this.rileyCard || !this.ameliaCard) return;

        let cg = this.cardGraphics;
        cg.clear();

        [
            { hero: 'riley', box: this.rileyCard },
            { hero: 'amelia', box: this.ameliaCard }
        ].forEach(({ hero, box }) => {
            let selected = (this.selectedHero === hero);
            let { x, y, w, h } = box;

            cg.fillStyle(0x000000, 1);
            cg.fillRect(x - 3, y - 3, w + 6, h + 6);

            cg.fillStyle(selected ? 0xF8B800 : 0xFFFFFF, 1);
            cg.fillRect(x - 1, y - 1, w + 2, h + 2);

            cg.fillStyle(selected ? 0x002058 : 0x001438, 0.95);
            cg.fillRect(x + 1, y + 1, w - 2, h - 2);

            cg.fillStyle(0xF8B800, 1);
            cg.fillRect(x + 2, y + 2, 4, 4);
            cg.fillRect(x + w - 6, y + 2, 4, 4);
            cg.fillRect(x + 2, y + h - 6, 4, 4);
            cg.fillRect(x + w - 6, y + h - 6, 4, 4);
        });

        if (this.selectedHero === 'riley') {
            this.cursorArrow.setPosition(this.rileyCard.x - 16, this.rileyCard.y + (this.isPortrait ? 60 : 65));
        } else {
            this.cursorArrow.setPosition(this.ameliaCard.x - 16, this.ameliaCard.y + (this.isPortrait ? 60 : 65));
        }

        if (this.dialogueBox) {
            let db = this.dialogueGraphics;
            db.clear();
            let { x, y, w, h } = this.dialogueBox;

            db.fillStyle(0x000000, 1);
            db.fillRect(x - 2, y - 2, w + 4, h + 4);
            db.fillStyle(0xFFFFFF, 1);
            db.fillRect(x - 1, y - 1, w + 2, h + 2);
            db.fillStyle(0x001840, 0.95);
            db.fillRect(x + 1, y + 1, w - 2, h - 2);

            db.fillStyle(0xF8B800, 1);
            db.fillRect(x + 2, y + 2, 3, 3);
            db.fillRect(x + w - 5, y + 2, 3, 3);
            db.fillRect(x + 2, y + h - 5, 3, 3);
            db.fillRect(x + w - 5, y + h - 5, 3, 3);
        }
    }
}

