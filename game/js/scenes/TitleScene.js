class TitleScene extends Phaser.Scene {
    constructor() { super('TitleScene'); }

    create() {
        this.bgGraphics = this.add.graphics();
        this.waterGraphics = this.add.graphics();
        this.titleBoxGraphics = this.add.graphics();

        // 8-Bit Clouds
        this.clouds = [];
        for (let i = 0; i < 4; i++) {
            let cx = 80 + i * 180;
            let cy = 35 + (i % 2) * 30;
            let cloud = this.add.image(cx, cy, 'cloud').setScale(0.85 + i * 0.1).setAlpha(0.85);
            this.clouds.push({ sprite: cloud, speed: 0.25 + i * 0.12 });
        }

        // 8-Bit Sun
        this.sun = this.add.image(100, 75, 'sun').setScale(0.9);

        // 8-Bit Flying Seagulls
        this.birds = [];
        for (let i = 0; i < 3; i++) {
            let bx = 220 + i * 160;
            let by = 60 + (i % 2) * 35;
            let bird = this.add.image(bx, by, 'bird').setScale(1.2);
            this.birds.push(bird);
            this.tweens.add({
                targets: bird,
                y: by - 8,
                duration: 600 + i * 200,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }

        // 8-Bit Disney Destiny Ship Sprite
        this.ship = this.add.image(0, 0, 'title_ship');
        this.tweens.add({
            targets: this.ship,
            y: '+=5',
            duration: 1800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Title Box Texts
        this.titleText = this.add.text(0, 0, 'DISNEY DESTINY', {
            fontSize: '22px', fill: '#F8B800', fontFamily: '"Press Start 2P", monospace',
            align: 'center', stroke: '#000000', strokeThickness: 5
        }).setOrigin(0.5);

        this.subTitleText = this.add.text(0, 0, '★ CRUISE 2027 ★', {
            fontSize: '11px', fill: '#FFFFFF', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 3, align: 'center'
        }).setOrigin(0.5);

        // Push Start Button prompt
        this.startText = this.add.text(0, 0, '► PUSH START BUTTON ◄', {
            fontSize: '12px', fill: '#FFFFFF', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5);

        this.tweens.add({
            targets: this.startText,
            alpha: 0.15,
            duration: 550,
            yoyo: true,
            repeat: -1
        });

        this.hintText = this.add.text(0, 0, '[ PRESS ENTER OR TAP SCREEN ]', {
            fontSize: '9px', fill: '#58B8F8', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5);

        this.creditsText = this.add.text(0, 0, '© 2027 GARVEY FAMILY • NES CAPCOM EDITION', {
            fontSize: '8px', fill: '#B0C0D0', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5);

        this.waveTimer = 0;

        this.renderScene(this.scale.width, this.scale.height);

        const resizeHandler = (gameSize) => {
            if (this.sys && this.sys.isActive()) {
                this.renderScene(gameSize.width, gameSize.height);
            }
        };
        this.scale.on('resize', resizeHandler);
        this.events.once('shutdown', () => {
            this.scale.off('resize', resizeHandler);
        });

        const startSelection = () => {
            this.cameras.main.flash(250, 255, 255, 255);
            this.time.delayedCall(200, () => {
                this.scene.start('CharacterSelectScene');
            });
        };

        this.input.on('pointerdown', startSelection);
        if (this.input.keyboard) {
            this.input.keyboard.on('keydown-ENTER', startSelection);
            this.input.keyboard.on('keydown-SPACE', startSelection);
        }
    }

    update(time, delta) {
        if (this.clouds) {
            let W = this.scale.width;
            for (let c of this.clouds) {
                c.sprite.x += c.speed;
                if (c.sprite.x > W + 70) c.sprite.x = -70;
            }
        }
        this.waveTimer += (delta || 16) * 0.003;
        this.drawWaves(this.scale.width, this.scale.height);
    }

    drawWaves(W, H) {
        let g = this.waterGraphics;
        g.clear();

        let oceanY = H * 0.62;
        let waveStep = Math.sin(this.waveTimer) * 4;
        let waveStep2 = Math.cos(this.waveTimer * 1.2) * 4;

        for (let y = oceanY + 12; y < H; y += 20) {
            let offset = (y % 40 === 0) ? waveStep : waveStep2;
            for (let x = 0; x < W + 32; x += 48) {
                let wx = x + offset;
                g.fillStyle(0xFFFFFF, 0.9);
                g.fillRect(wx, y, 14, 2);
                g.fillStyle(0x58B8F8, 0.9);
                g.fillRect(wx - 4, y + 2, 22, 2);
            }
        }
    }

    renderScene(W, H) {
        let insets = getSafeAreaInsets();
        let g = this.bgGraphics;
        g.clear();

        // 8-Bit NES Banded Sky
        let skyH = H * 0.62;
        g.fillStyle(0x0050A0, 1);
        g.fillRect(0, 0, W, skyH * 0.35);
        g.fillStyle(0x0078F8, 1);
        g.fillRect(0, skyH * 0.35, W, skyH * 0.35);
        g.fillStyle(0x60B8F8, 1);
        g.fillRect(0, skyH * 0.70, W, skyH * 0.30);

        // 8-Bit NES Ocean Bands
        let oceanH = H - skyH;
        g.fillStyle(0x0068A8, 1);
        g.fillRect(0, skyH, W, oceanH * 0.25);
        g.fillStyle(0x005088, 1);
        g.fillRect(0, skyH + oceanH * 0.25, W, oceanH * 0.25);
        g.fillStyle(0x003868, 1);
        g.fillRect(0, skyH + oceanH * 0.50, W, oceanH * 0.25);
        g.fillStyle(0x002048, 1);
        g.fillRect(0, skyH + oceanH * 0.75, W, oceanH * 0.25);

        // Sun positioning
        let sunX = Math.min(W * 0.15, 120);
        let sunY = Math.max(50, insets.top + 30);
        this.sun.setPosition(sunX, sunY);

        // Disney Destiny Ship placement
        let shipScale = W < 420 ? 0.9 : (W < 650 ? 1.05 : 1.25);
        this.ship.setScale(shipScale);
        let shipY = skyH - (28 * shipScale);
        this.ship.setPosition(W / 2, shipY);

        // Title Box - Authentic Capcom 1px Vintage Double Border with Gold Rivets
        let tb = this.titleBoxGraphics;
        tb.clear();

        let boxW = Math.min(560, W - 32);
        let boxH = W < 420 ? 68 : 80;
        let boxX = W / 2 - boxW / 2;
        let boxY = Math.max(insets.top + 16, H * 0.10);

        tb.fillStyle(0x000000, 1);
        tb.fillRect(boxX - 3, boxY - 3, boxW + 6, boxH + 6);
        tb.fillStyle(0xFFFFFF, 1);
        tb.fillRect(boxX - 1, boxY - 1, boxW + 2, boxH + 2);
        tb.fillStyle(0x001030, 0.95);
        tb.fillRect(boxX + 1, boxY + 1, boxW - 2, boxH - 2);

        tb.fillStyle(0xF8B800, 1);
        tb.fillRect(boxX + 2, boxY + 2, 4, 4);
        tb.fillRect(boxX + boxW - 6, boxY + 2, 4, 4);
        tb.fillRect(boxX + 2, boxY + boxH - 6, 4, 4);
        tb.fillRect(boxX + boxW - 6, boxY + boxH - 6, 4, 4);

        let titleSize = W < 420 ? '14px' : (W < 560 ? '18px' : '22px');
        this.titleText.setFontSize(titleSize).setPosition(W / 2, boxY + (W < 420 ? 24 : 28));
        this.subTitleText.setFontSize(W < 420 ? '9px' : '11px').setPosition(W / 2, boxY + (W < 420 ? 46 : 54));

        let startY = boxY + boxH + (W < 420 ? 20 : 28);
        this.startText.setFontSize(W < 420 ? '10px' : '12px').setPosition(W / 2, startY);
        this.hintText.setFontSize(W < 420 ? '8px' : '9px').setPosition(W / 2, startY + 22);

        this.creditsText.setFontSize(W < 420 ? '7px' : '8px').setPosition(W / 2, H - Math.max(20, insets.bottom + 12));
    }
}

