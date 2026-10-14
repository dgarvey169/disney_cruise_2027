// =========================================================================
// BIBBIDI BOBBIDI BOUTIQUE SCENE (8-BIT RPG MAKEOVER SALON)
// =========================================================================

class BoutiqueScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BoutiqueScene' });
    }

    init(data) {
        this.gameScene = data.gameScene;
        this.previewSprite = null;
        this.isClosing = false;
        this.mirrorSparkles = [];
        this.tierTabElements = [];
        this.colorSwatchElements = [];
        this.activeTierIdx = 1; // Default to DRESS (0: WIG, 1: DRESS, 2: CROWN, 3: WAND)
        this.canSubmit = false;
        this.swipeStartX = 0;
        this.swipeStartY = 0;
        this.swipeStartTime = 0;
    }

    create() {
        this.events.once('shutdown', () => {
            this.previewSprite = null;
            this.mirrorSparkles = [];
            this.tierTabElements = [];
            this.colorSwatchElements = [];
        });

        generateBoutiqueIcons(this);

        const W = this.scale.width;
        const H = this.scale.height;
        const cx = W / 2;
        const cy = H / 2;
        const isPortrait = H > W && W < 700;

        // Scaling factor so everything scales up proportionally
        const scaleFactor = isPortrait
            ? Math.max(1.0, Math.min(1.4, W / 360))
            : Math.max(1.0, Math.min(2.0, H / 450));
        this.scaleFactor = scaleFactor;

        this.currentOutfit = Object.assign({}, window.ameliaOutfit || DEFAULT_AMELIA_OUTFIT);

        // 4 Category Tiers above character: WIG, DRESS, CROWN, WAND
        this.tiers = [
            {
                id: 'wig',
                name: 'WIG',
                iconKey: 'boutique_icon_wig',
                key: 'hairStyle',
                options: BOUTIQUE_CONFIG.hairStyles,
                colorKey: 'hairColor',
                colors: BOUTIQUE_CONFIG.hairColors
            },
            {
                id: 'dress',
                name: 'DRESS',
                iconKey: 'boutique_icon_dress',
                key: 'dressStyle',
                options: BOUTIQUE_CONFIG.dressStyles,
                colorKey: 'dressColor',
                colors: BOUTIQUE_CONFIG.dressColors
            },
            {
                id: 'crown',
                name: 'CROWN',
                iconKey: 'boutique_icon_crown',
                key: 'crown',
                options: BOUTIQUE_CONFIG.crowns,
                colorKey: null,
                colors: null
            },
            {
                id: 'wand',
                name: 'WAND',
                iconKey: 'boutique_icon_wand',
                key: 'scepter',
                options: BOUTIQUE_CONFIG.scepters,
                colorKey: null,
                colors: null
            }
        ];

        // 1. Royal Salon Background & Framing
        this.add.rectangle(cx, cy, W, H, 0x140620).setDepth(0);
        let bgGraphics = this.add.graphics().setDepth(1);
        bgGraphics.fillStyle(0x200B32, 0.6);
        for (let x = 0; x < W; x += 32) {
            bgGraphics.fillRect(x, 0, 16, H);
        }
        this.add.rectangle(cx, cy, W - 16, H - 16).setStrokeStyle(3, 0xFFD700).setDepth(2);
        this.add.rectangle(cx, cy, W - 24, H - 24).setStrokeStyle(1, 0xFF88D8).setDepth(2);

        // Corner decorative stars
        const cornerPad = Math.round(20 * scaleFactor);
        ['✦', '✦', '✦', '✦'].forEach((star, idx) => {
            let sx = (idx % 2 === 0) ? cornerPad : W - cornerPad;
            let sy = (idx < 2) ? cornerPad : H - cornerPad;
            this.add.text(sx, sy, star, { fontSize: `${Math.round(14 * scaleFactor)}px`, fill: '#FFD700' }).setOrigin(0.5).setDepth(3);
        });

        // Top Header
        const headerFontSize = Math.round((isPortrait ? 11 : 13) * scaleFactor);
        const headerY = Math.max(14, Math.round((isPortrait ? 18 : 16) * scaleFactor));
        this.add.text(cx, headerY, '★ BIBBIDI BOBBIDI BOUTIQUE ★', {
            fontSize: `${headerFontSize}px`,
            fill: '#FFD700',
            fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(4);

        // 2. Tiered Category Selection (Row of 4 visual icons above Amelia)
        const tabW = Math.round((isPortrait ? 56 : 68) * scaleFactor);
        const tabH = Math.round((isPortrait ? 38 : 40) * scaleFactor);
        const tabSpacing = Math.round((isPortrait ? 10 : 16) * scaleFactor);
        const iconSize = Math.round((isPortrait ? 20 : 24) * scaleFactor);
        const tabFontSize = Math.round((isPortrait ? 7 : 8) * scaleFactor);
        const tierY = headerY + Math.round((isPortrait ? 27 : 28) * scaleFactor);

        const totalTabsW = this.tiers.length * tabW + (this.tiers.length - 1) * tabSpacing;
        const startTabX = cx - (totalTabsW / 2) + (tabW / 2);

        this.tierTabElements = [];
        this.tiers.forEach((tier, idx) => {
            const tx = startTabX + idx * (tabW + tabSpacing);
            const bgRect = this.add.rectangle(tx, tierY, tabW, tabH, 0x140620)
                .setStrokeStyle(1, 0x482268)
                .setDepth(5)
                .setInteractive({ useHandCursor: true });

            const iconSprite = this.add.image(tx, tierY - Math.round((isPortrait ? 5 : 5) * scaleFactor), tier.iconKey)
                .setDisplaySize(iconSize, iconSize)
                .setDepth(6);

            const tabText = this.add.text(tx, tierY + Math.round((isPortrait ? 10 : 11) * scaleFactor), tier.name, {
                fontSize: `${tabFontSize}px`,
                fill: '#9080A8',
                fontFamily: '"Press Start 2P", monospace'
            }).setOrigin(0.5).setDepth(6);

            const tabIndicator = this.add.text(tx, tierY + tabH / 2 + 2, '▼', {
                fontSize: `${Math.round(8 * scaleFactor)}px`,
                fill: '#FFD700'
            }).setOrigin(0.5, 0).setDepth(6);

            const clickHandler = () => this.selectTier(idx);
            bgRect.on('pointerdown', clickHandler);
            iconSprite.setInteractive({ useHandCursor: true }).on('pointerdown', clickHandler);
            tabText.setInteractive({ useHandCursor: true }).on('pointerdown', clickHandler);

            this.tierTabElements.push({
                bg: bgRect,
                icon: iconSprite,
                text: tabText,
                indicator: tabIndicator,
                tx: tx,
                ty: tierY
            });
        });

        // 3. Carousel (Left arrow, Card with Item Title, Right arrow)
        const carouselY = tierY + Math.round((isPortrait ? 33 : 34) * scaleFactor);
        const cardW = Math.round((isPortrait ? 250 : 320) * scaleFactor);
        const cardH = Math.round((isPortrait ? 26 : 28) * scaleFactor);
        const arrowFontSize = Math.round((isPortrait ? 14 : 16) * scaleFactor);
        const titleFontSize = Math.round((isPortrait ? 8 : 9) * scaleFactor);
        const counterFontSize = Math.round((isPortrait ? 6 : 7) * scaleFactor);

        // Left Arrow Button
        const arrowOffset = cardW / 2 + Math.round((isPortrait ? 22 : 30) * scaleFactor);
        this.leftArrowBtn = this.add.text(cx - arrowOffset, carouselY, '◀', {
            fontSize: `${arrowFontSize}px`,
            fill: '#FFD700',
            backgroundColor: '#000000',
            padding: { x: Math.round(12 * scaleFactor), y: Math.round(5 * scaleFactor) },
            fontFamily: '"Press Start 2P", monospace'
        }).setOrigin(0.5).setDepth(6).setInteractive({ useHandCursor: true });
        this.leftArrowBtn.setStroke('#FFD700', 2);

        this.leftArrowBtn.on('pointerdown', () => this.cycleCarousel(-1));
        this.leftArrowBtn.on('pointerover', () => this.leftArrowBtn.setStyle({ fill: '#58F8F8' }));
        this.leftArrowBtn.on('pointerout', () => this.leftArrowBtn.setStyle({ fill: '#FFD700' }));

        // Center Card
        this.carouselCard = this.add.rectangle(cx, carouselY, cardW, cardH, 0x16082A).setStrokeStyle(2, 0xFFD700).setDepth(5).setInteractive({ useHandCursor: true });
        this.carouselTitleText = this.add.text(cx, carouselY - Math.round(3 * scaleFactor), '', {
            fontSize: `${titleFontSize}px`,
            fill: '#FFD700',
            fontFamily: '"Press Start 2P", monospace'
        }).setOrigin(0.5).setDepth(6);
        this.carouselCounterText = this.add.text(cx, carouselY + Math.round(8 * scaleFactor), '', {
            fontSize: `${counterFontSize}px`,
            fill: '#A0D0FF',
            fontFamily: '"Press Start 2P", monospace'
        }).setOrigin(0.5).setDepth(6);

        this.carouselCard.on('pointerdown', () => this.cycleCarousel(1));

        // Right Arrow Button
        this.rightArrowBtn = this.add.text(cx + arrowOffset, carouselY, '▶', {
            fontSize: `${arrowFontSize}px`,
            fill: '#FFD700',
            backgroundColor: '#000000',
            padding: { x: Math.round(12 * scaleFactor), y: Math.round(5 * scaleFactor) },
            fontFamily: '"Press Start 2P", monospace'
        }).setOrigin(0.5).setDepth(6).setInteractive({ useHandCursor: true });
        this.rightArrowBtn.setStroke('#FFD700', 2);

        this.rightArrowBtn.on('pointerdown', () => this.cycleCarousel(1));
        this.rightArrowBtn.on('pointerover', () => this.rightArrowBtn.setStyle({ fill: '#58F8F8' }));
        this.rightArrowBtn.on('pointerout', () => this.rightArrowBtn.setStyle({ fill: '#FFD700' }));

        // 4. Color Swatches Palette (Directly below Carousel)
        this.colorRowY = carouselY + Math.round((isPortrait ? 22 : 23) * scaleFactor);
        const colorLabelFontSize = Math.round((isPortrait ? 7 : 8) * scaleFactor);
        this.colorLabel = this.add.text(cx, this.colorRowY, '', {
            fontSize: `${colorLabelFontSize}px`,
            fill: '#F8A0C8',
            fontFamily: '"Press Start 2P", monospace'
        }).setOrigin(0.5).setDepth(6);

        this.colorSwatchesContainer = this.add.container(0, 0).setDepth(6);

        // Bottom Controls Layout (Buttons & Dialogue)
        const btnY = H - Math.max(22, Math.round(24 * scaleFactor));
        const btnSpacing = Math.round((isPortrait ? 110 : 180) * scaleFactor);
        const btnFontSize = Math.round((isPortrait ? 8 : 9) * scaleFactor);
        const btnPaddingX = Math.round((isPortrait ? 12 : 16) * scaleFactor);
        const btnPaddingY = Math.round((isPortrait ? 6 : 8) * scaleFactor);

        const dialogW = Math.min(W - Math.round(36 * scaleFactor), Math.round(720 * scaleFactor));
        const dialogH = Math.round((isPortrait ? 40 : 44) * scaleFactor);
        const dialogY = btnY - Math.round((isPortrait ? 42 : 38) * scaleFactor);
        const dialogFontSize = Math.round((isPortrait ? 7 : 8) * scaleFactor);

        this.add.rectangle(cx, dialogY, dialogW, dialogH, 0x000010, 0.95).setStrokeStyle(2, 0xFFD700).setDepth(7);
        this.add.text(cx - dialogW / 2 + Math.round(14 * scaleFactor), dialogY, '🪄', {
            fontSize: `${Math.round((isPortrait ? 14 : 16) * scaleFactor)}px`
        }).setOrigin(0, 0.5).setDepth(8);

        this.dialogueText = this.add.text(cx - dialogW / 2 + Math.round((isPortrait ? 36 : 44) * scaleFactor), dialogY, '', {
            fontSize: `${dialogFontSize}px`,
            fill: '#58F8F8',
            fontFamily: '"Press Start 2P", monospace',
            lineSpacing: 4,
            wordWrap: { width: dialogW - Math.round((isPortrait ? 50 : 60) * scaleFactor) }
        }).setOrigin(0, 0.5).setDepth(8);

        // 5. Centered Magic Mirror & Amelia Preview (Dynamically fitted in exact screen center)
        const swatchBottom = this.colorRowY + Math.round((isPortrait ? 25 : 27) * scaleFactor);
        const dialogTop = dialogY - dialogH / 2;
        const availH = Math.max(120, dialogTop - swatchBottom);
        const midY = (swatchBottom + dialogTop) / 2;

        const maxMirrorH = Math.min(availH - 8, Math.round((isPortrait ? 150 : 165) * scaleFactor));
        const mirrorH = Math.max(110, maxMirrorH);
        const mirrorW = Math.round(mirrorH * 1.35);
        const mirrorX = cx;
        const mirrorY = midY;

        // Mirror Backing & Glass
        this.add.rectangle(mirrorX, mirrorY, mirrorW, mirrorH, 0x1E1238).setDepth(4);
        let mirrorGlass = this.add.graphics().setDepth(5);
        mirrorGlass.fillStyle(0x281A48, 1);
        mirrorGlass.fillRect(mirrorX - mirrorW / 2 + 6, mirrorY - mirrorH / 2 + 6, mirrorW - 12, mirrorH - 12);
        mirrorGlass.lineStyle(2, 0x483870, 0.7);
        mirrorGlass.lineBetween(mirrorX - mirrorW / 2 + 18, mirrorY - mirrorH / 2 + 12, mirrorX + mirrorW / 2 - 18, mirrorY + mirrorH / 2 - 12);
        mirrorGlass.lineBetween(mirrorX - mirrorW / 2 + 36, mirrorY - mirrorH / 2 + 12, mirrorX + mirrorW / 2 - 12, mirrorY + mirrorH / 2 - 36);

        // Frame & Ruby Jewel
        this.add.rectangle(mirrorX, mirrorY, mirrorW, mirrorH).setStrokeStyle(3, 0xFFD700).setDepth(6);
        this.add.rectangle(mirrorX, mirrorY, mirrorW - 6, mirrorH - 6).setStrokeStyle(1, 0xFF88D8).setDepth(6);
        this.add.circle(mirrorX, mirrorY - mirrorH / 2, Math.round(6 * scaleFactor), 0xF83800).setStrokeStyle(2, 0xFFD700).setDepth(7);

        // Velvet Royal Pedestal
        const pedY = mirrorY + mirrorH / 2 - Math.round((isPortrait ? 10 : 12) * scaleFactor);
        this.add.ellipse(mirrorX, pedY, mirrorW - 20, Math.round(20 * scaleFactor), 0xB81858).setStrokeStyle(2, 0xFFD700).setDepth(7);

        // Floating sparkles
        this.mirrorSparkles = [];
        const sparkleCoords = [
            { x: mirrorX - mirrorW / 2 - 12, y: mirrorY - 25 },
            { x: mirrorX + mirrorW / 2 + 12, y: mirrorY - 35 },
            { x: mirrorX - mirrorW / 2 + 16, y: mirrorY - mirrorH / 2 - 8 },
            { x: mirrorX + mirrorW / 2 - 16, y: mirrorY + mirrorH / 2 + 8 }
        ];
        sparkleCoords.forEach((pt, idx) => {
            let sp = this.add.text(pt.x, pt.y, (idx % 2 === 0 ? '✦' : '✧'), {
                fontSize: `${Math.round(12 * scaleFactor)}px`,
                fill: (idx % 2 === 0 ? '#FFD700' : '#58F8F8')
            }).setOrigin(0.5).setDepth(8);
            this.tweens.add({
                targets: sp,
                alpha: { from: 0.3, to: 1 },
                scale: { from: 0.8, to: 1.3 },
                y: pt.y - 5,
                duration: 600 + (idx * 200),
                yoyo: true,
                repeat: -1
            });
            this.mirrorSparkles.push(sp);
        });

        // Amelia Live Preview Sprite (Feet anchored to velvet pedestal, scaled up inside mirror)
        const ameliaH = mirrorH - Math.round((isPortrait ? 28 : 34) * scaleFactor);
        const previewScale = Math.max(1.8, Math.min(5.5, ameliaH / 40));
        this.currentPreviewScale = previewScale;
        this.previewY = pedY;
        this.updatePreviewTexture();
        this.previewSprite = this.add.image(mirrorX, this.previewY, 'amelia_boutique_preview')
            .setOrigin(0.5, 1)
            .setScale(previewScale)
            .setDepth(9);

        // 7. Action Buttons (Bottom)
        // Return Button
        this.returnBtn = this.add.text(cx - btnSpacing, btnY, '❌ [ RETURN TO ELEVATOR ]', {
            fontSize: `${btnFontSize}px`,
            fill: '#FF6666',
            backgroundColor: '#000000',
            padding: { x: btnPaddingX, y: btnPaddingY },
            fontFamily: '"Press Start 2P", monospace'
        }).setOrigin(0.5).setDepth(8).setInteractive({ useHandCursor: true });
        this.returnBtn.setStroke('#FF6666', 1);
        this.returnBtn.on('pointerdown', () => this.closeBoutique());
        this.returnBtn.on('pointerover', () => this.returnBtn.setStyle({ fill: '#000000', backgroundColor: '#FF7777' }));
        this.returnBtn.on('pointerout', () => this.returnBtn.setStyle({ fill: '#FF6666', backgroundColor: '#000000' }));

        // Apply Makeover Button
        this.applyBtn = this.add.text(cx + btnSpacing, btnY, '✨ [ EMBARK WITH MAKEOVER ]', {
            fontSize: `${btnFontSize}px`,
            fill: '#000000',
            backgroundColor: '#FFD700',
            padding: { x: btnPaddingX, y: btnPaddingY },
            fontFamily: '"Press Start 2P", monospace'
        }).setOrigin(0.5).setDepth(8).setInteractive({ useHandCursor: true });
        this.applyBtn.setStroke('#000000', 1);
        this.applyBtn.on('pointerdown', () => this.applyMakeover());
        this.applyBtn.on('pointerover', () => this.applyBtn.setStyle({ backgroundColor: '#FFF080' }));
        this.applyBtn.on('pointerout', () => this.applyBtn.setStyle({ backgroundColor: '#FFD700' }));
        // 8. Swipe Gestures (Mobile & Touch)
        this.input.on('pointerdown', (pointer) => {
            this.swipeStartX = pointer.x;
            this.swipeStartY = pointer.y;
            this.swipeStartTime = this.time.now;
        });

        this.input.on('pointerup', (pointer) => {
            const dx = pointer.x - this.swipeStartX;
            const dy = pointer.y - this.swipeStartY;
            const dt = this.time.now - this.swipeStartTime;
            // Horizontal swipe of at least 32px
            if (Math.abs(dx) > 32 && Math.abs(dx) > Math.abs(dy) * 1.3 && dt < 600) {
                if (dx < 0) {
                    this.cycleCarousel(1); // Swipe left -> next
                } else {
                    this.cycleCarousel(-1); // Swipe right -> prev
                }
            }
        });

        // Keyboard Controls
        if (this.input.keyboard) {
            this.input.keyboard.on('keydown-LEFT', () => this.cycleCarousel(-1));
            this.input.keyboard.on('keydown-A', () => this.cycleCarousel(-1));
            this.input.keyboard.on('keydown-RIGHT', () => this.cycleCarousel(1));
            this.input.keyboard.on('keydown-D', () => this.cycleCarousel(1));

            this.input.keyboard.on('keydown-UP', () => this.cycleTier(-1));
            this.input.keyboard.on('keydown-W', () => this.cycleTier(-1));
            this.input.keyboard.on('keydown-DOWN', () => this.cycleTier(1));
            this.input.keyboard.on('keydown-S', () => this.cycleTier(1));

            this.input.keyboard.on('keydown-ONE', () => this.selectTier(0));
            this.input.keyboard.on('keydown-TWO', () => this.selectTier(1));
            this.input.keyboard.on('keydown-THREE', () => this.selectTier(2));
            this.input.keyboard.on('keydown-FOUR', () => this.selectTier(3));

            this.input.keyboard.on('keydown-C', () => this.cycleColor(1));

            this.input.keyboard.on('keydown-ENTER', () => this.applyMakeover());
            this.input.keyboard.on('keydown-SPACE', () => this.applyMakeover());
            this.input.keyboard.on('keydown-ESC', () => this.closeBoutique());
        }

        // Render initial tier state
        this.selectTier(this.activeTierIdx);
    }

    selectTier(idx) {
        if (idx < 0) idx = this.tiers.length - 1;
        if (idx >= this.tiers.length) idx = 0;
        this.activeTierIdx = idx;

        // Update Tab visual highlights
        this.tierTabElements.forEach((tab, i) => {
            const isActive = (i === this.activeTierIdx);
            if (isActive) {
                tab.bg.setFillStyle(0x3E1256, 1);
                tab.bg.setStrokeStyle(2, 0xFFD700);
                tab.text.setStyle({ fill: '#FFD700' });
                tab.indicator.setVisible(true);
                if (tab.icon) {
                    this.tweens.add({
                        targets: [tab.icon, tab.bg],
                        scaleX: { from: 1.12, to: 1.0 },
                        scaleY: { from: 1.12, to: 1.0 },
                        duration: 160,
                        ease: 'Back.easeOut'
                    });
                }
            } else {
                tab.bg.setFillStyle(0x140620, 0.9);
                tab.bg.setStrokeStyle(1, 0x482268);
                tab.text.setStyle({ fill: '#9080A8' });
                tab.indicator.setVisible(false);
            }
        });

        // Update carousel and colors for this tier
        this.updateCarouselDisplay();
        this.updateColorSwatches();
        this.updateDialogue();
    }

    cycleTier(delta) {
        this.selectTier(this.activeTierIdx + delta);
    }

    cycleCarousel(delta) {
        const tier = this.tiers[this.activeTierIdx];
        const currentVal = this.currentOutfit[tier.key];
        const optList = tier.options;
        let optIdx = optList.findIndex(o => o.id === currentVal);
        if (optIdx === -1) optIdx = 0;
        optIdx = (optIdx + delta + optList.length) % optList.length;
        this.currentOutfit[tier.key] = optList[optIdx].id;

        // Animate carousel card bounce
        this.tweens.add({
            targets: [this.carouselTitleText, this.carouselCard],
            scaleX: { from: 1.08, to: 1.0 },
            scaleY: { from: 1.08, to: 1.0 },
            duration: 160,
            ease: 'Back.easeOut'
        });

        // Animate preview sprite bounce
        if (this.previewSprite && this.previewSprite.scene) {
            const baseScale = this.currentPreviewScale || this.previewSprite.scaleX;
            this.tweens.add({
                targets: this.previewSprite,
                scaleX: { from: baseScale * 1.05, to: baseScale },
                scaleY: { from: baseScale * 1.05, to: baseScale },
                duration: 160,
                ease: 'Back.easeOut'
            });
        }

        this.spawnMirrorSparkle();
        this.updatePreviewTexture();
        this.updateCarouselDisplay();
        this.updateDialogue();
    }

    selectColor(colorId) {
        const tier = this.tiers[this.activeTierIdx];
        if (!tier.colorKey) return;
        this.currentOutfit[tier.colorKey] = colorId;

        this.spawnMirrorSparkle();
        this.updatePreviewTexture();
        this.updateColorSwatches();
        this.updateDialogue();
    }

    cycleColor(delta) {
        const tier = this.tiers[this.activeTierIdx];
        if (!tier.colorKey || !tier.colors) return;
        const currentVal = this.currentOutfit[tier.colorKey];
        const colorList = tier.colors;
        let colIdx = colorList.findIndex(c => c.id === currentVal);
        if (colIdx === -1) colIdx = 0;
        colIdx = (colIdx + delta + colorList.length) % colorList.length;
        this.selectColor(colorList[colIdx].id);
    }

    updateCarouselDisplay() {
        const tier = this.tiers[this.activeTierIdx];
        const currentVal = this.currentOutfit[tier.key];
        const optList = tier.options;
        let optIdx = optList.findIndex(o => o.id === currentVal);
        if (optIdx === -1) optIdx = 0;
        const opt = optList[optIdx];

        this.carouselTitleText.setText(opt.label);
        this.carouselCounterText.setText(`( ${optIdx + 1} / ${optList.length} )`);
    }

    updateColorSwatches() {
        const tier = this.tiers[this.activeTierIdx];
        this.colorSwatchesContainer.removeAll(true);

        const cx = this.scale.width / 2;
        const isPortrait = this.scale.height > this.scale.width && this.scale.width < 700;
        const scaleFactor = this.scaleFactor || 1.0;

        if (tier.colors && tier.colorKey) {
            const currentColor = this.currentOutfit[tier.colorKey];
            const colors = tier.colors;
            const currentObj = colors.find(c => c.id === currentColor) || colors[0];
            const swatchSize = Math.round((isPortrait ? 22 : 26) * scaleFactor);
            const spacing = Math.round((isPortrait ? 28 : 34) * scaleFactor);
            const totalW = colors.length * spacing;
            const startX = cx - (totalW / 2) + (spacing / 2);

            const labelPrefix = (tier.id === 'wig' ? 'HAIR COLOR' : 'GOWN COLOR');
            this.colorLabel.setText(`${labelPrefix}: [ ${currentObj.label.toUpperCase()} ]`);
            this.colorLabel.setVisible(true);

            colors.forEach((col, idx) => {
                const sx = startX + (idx * spacing);
                const sy = this.colorRowY + Math.round((isPortrait ? 13 : 15) * scaleFactor);
                const isSelected = (col.id === currentColor);
                const hexColor = col.main !== undefined ? col.main : col.H;

                const swatchBg = this.add.rectangle(sx, sy, swatchSize, swatchSize, hexColor)
                    .setStrokeStyle(isSelected ? 3 : 1, isSelected ? 0xFFD700 : 0x000000)
                    .setInteractive({ useHandCursor: true });

                this.colorSwatchesContainer.add(swatchBg);

                if (isSelected) {
                    const check = this.add.text(sx, sy, '✦', {
                        fontSize: `${Math.round(12 * scaleFactor)}px`,
                        fill: (hexColor === 0xF8E060 || hexColor === 0x78E0F8) ? '#000000' : '#FFFFFF'
                    }).setOrigin(0.5);
                    this.colorSwatchesContainer.add(check);
                }

                swatchBg.on('pointerdown', () => this.selectColor(col.id));
                swatchBg.on('pointerover', () => {
                    this.dialogueText.setText(`"FAIRY GODMOTHER: ${col.desc.toUpperCase()}"`);
                });
            });
        } else {
            // Category has no color choices (Crown or Wand)
            this.colorLabel.setText(tier.id === 'crown' ? '✦ ROYAL TIARAS & HEADWEAR ✦' : '✦ ROYAL SCEPTERS & MAGIC WANDS ✦');
            this.colorLabel.setVisible(true);
        }
    }

    updateDialogue() {
        const tier = this.tiers[this.activeTierIdx];
        const opt = tier.options.find(o => o.id === this.currentOutfit[tier.key]) || tier.options[0];
        let desc = opt.desc;
        if (tier.colorKey && tier.colors) {
            const col = tier.colors.find(c => c.id === this.currentOutfit[tier.colorKey]);
            if (col && col.desc) {
                desc = `${opt.desc} ${col.desc}`;
            }
        }
        this.dialogueText.setText(`"FAIRY GODMOTHER: ${desc.toUpperCase()}"`);
    }

    spawnMirrorSparkle() {
        if (!this.previewSprite) return;
        let sx = this.previewSprite.x + (Math.random() * 40 - 20);
        let sy = this.previewSprite.y - 60 + (Math.random() * 50 - 25);
        let star = this.add.text(sx, sy, '✦', { fontSize: '14px', fill: '#FFD700' }).setOrigin(0.5).setDepth(20);
        this.tweens.add({
            targets: star,
            scale: { from: 0.5, to: 1.5 },
            alpha: { from: 1, to: 0 },
            y: sy - 16,
            duration: 350,
            onComplete: () => star.destroy()
        });
    }

    updatePreviewTexture() {
        renderPixelTextureGlobal(
            this,
            'amelia_boutique_preview',
            32,
            40,
            buildAmeliaMatrix(this.currentOutfit, 'idle'),
            getAmeliaPalette(this.currentOutfit),
            2
        );
        if (this.previewSprite && this.previewSprite.scene) {
            this.previewSprite.setTexture('amelia_boutique_preview');
        }
    }

    applyMakeover() {
        // Save to global state
        window.ameliaOutfit = Object.assign({}, this.currentOutfit);

        // Magical screen flash and sparkle burst
        this.cameras.main.flash(400, 255, 215, 0);

        // Spawn magical starburst around Amelia
        for (let i = 0; i < 16; i++) {
            let angle = (i / 16) * Math.PI * 2;
            let sx = this.previewSprite.x;
            let sy = this.previewSprite.y - 60;
            let star = this.add.text(sx, sy, (i % 2 === 0 ? '✦' : '★'), {
                fontSize: '16px',
                fill: (i % 2 === 0 ? '#FFD700' : '#FF88D8')
            }).setOrigin(0.5).setDepth(25);

            this.tweens.add({
                targets: star,
                x: sx + Math.cos(angle) * 70,
                y: sy + Math.sin(angle) * 70,
                alpha: { from: 1, to: 0 },
                scale: { from: 1.5, to: 0.2 },
                duration: 600,
                ease: 'Cubic.easeOut',
                onComplete: () => star.destroy()
            });
        }

        // Regenerate all global Amelia textures in-place
        generateAllAmeliaTextures(this.gameScene || this, window.ameliaOutfit);

        // Update active player sprite & HUD icon in GameScene
        if (this.gameScene) {
            if (this.gameScene.player) {
                this.gameScene.player.setTexture('amelia_idle');
                this.gameScene.player.body.setSize(22, 16);
                this.gameScene.player.body.setOffset(5, 24);
                if (this.gameScene.player.anims) {
                    this.gameScene.player.anims.play('amelia_idle', true);
                }
            }
            if (this.gameScene.hudPlayerIcon) {
                this.gameScene.hudPlayerIcon.setTexture('amelia_idle');
            }
        }

        // Small delay so the player sees the magical burst before returning
        setTimeout(() => {
            this.closeBoutique();
        }, 650);
    }

    closeBoutique() {
        if (this.isClosing) return;
        this.isClosing = true;
        this.scene.resume('GameScene');
        this.scene.stop('BoutiqueScene');
        if (this.gameScene && this.gameScene.player && this.gameScene.player.body) {
            const returnGroundY = this.gameScene.groundY || 1255;
            this.gameScene.jumpZ = 0;
            this.gameScene.jumpV = 0;
            this.gameScene.isJumping = false;
            this.gameScene.currentStair = null;

            this.gameScene.player.x = 1250;
            this.gameScene.groundY = returnGroundY;
            this.gameScene.player.y = returnGroundY;
            this.gameScene.player.setVisible(true);
            this.gameScene.player.setAlpha(1);
            this.gameScene.player.setActive(true);
            this.gameScene.player.setDepth(Math.round(returnGroundY));
            this.gameScene.player.body.reset(1250, returnGroundY);

            if (this.gameScene.selectedCharacter === 'riley') {
                this.gameScene.player.body.setSize(22, 16);
                this.gameScene.player.body.setOffset(5, 32);
            } else {
                this.gameScene.player.body.setSize(22, 16);
                this.gameScene.player.body.setOffset(5, 24);
            }

            if (this.gameScene.playerShadow) {
                this.gameScene.playerShadow.setPosition(1250, returnGroundY + 18);
                this.gameScene.playerShadow.setDepth(returnGroundY - 1);
                this.gameScene.playerShadow.setVisible(true);
            }

            this.gameScene.selectedCharacter = 'amelia';
            this.gameScene.characterName = 'Amelia';
            if (this.gameScene.hudPlayerName) {
                this.gameScene.hudPlayerName.setText('AMELIA');
            }
            if (this.gameScene.hudPlayerIcon) {
                this.gameScene.hudPlayerIcon.setTexture('amelia_idle');
            }
            if (this.gameScene.layoutHUD) {
                this.gameScene.layoutHUD(this.gameScene.scale.width, this.gameScene.scale.height);
            }

            this.gameScene.cameras.main.startFollow(this.gameScene.player, true, 0.08, 0.08);
            this.gameScene.nearElevator = true;
            if (this.gameScene.elevatorPromptText) {
                this.gameScene.elevatorPromptText.setVisible(true);
                this.gameScene.elevatorPromptText.x = 1250;
                this.gameScene.elevatorPromptText.y = returnGroundY - 60;
            }
        }
    }
}

