// =========================================================================
// FAIRYTALE HALL WING SCENE (DISNEY'S OCEANEER CLUB - DECK 2) - ISSUE #45
// 3 Disney Princess Spaces:
//   1. Rapunzel's Art Studio (Floating Lanterns & Painting)
//   2. Belle's Library (Enchanted Painting Storytelling)
//   3. Anna & Elsa's Sommerhus ("Frozen Fun" Hosted by Olaf)
// Works for both playable characters (Riley & Amelia)
// =========================================================================

class FairytaleHallWingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'FairytaleHallWingScene' });
    }

    init(data) {
        this.oceaneerHub = data ? data.oceaneerHub : null;
        this.gameScene = (data && data.gameScene) ? data.gameScene : (this.oceaneerHub ? this.oceaneerHub.gameScene : null);
        this.charData = getActiveCharacterData(this.gameScene);

        this.currentRoom = 0; // 0: Rapunzel, 1: Belle, 2: Sommerhus
        this.isExiting = false;
        this.playerSpeed = 180;
        this.isJumping = false;
        this.jumpV = 0;
        this.jumpZ = 0;

        // Space 1: Rapunzel's Art Studio
        this.activeGlowColor = 0xFFD700;
        this.activeGlowColorHex = '#FFD700';
        this.activeTool = 'sun'; // 'brush', 'sun', 'star', 'flower'
        this.lanternGrid = [];
        this.lanternPixels = [];
        this.floatingLanternsList = [];
        this.pascalColorIndex = 0;

        // Space 2: Belle's Library
        this.activeStoryIndex = 0;
        this.storyAct = 1; // 1, 2, 3
        this.storyStars = 0;
        this.storyCompleted = false;

        // Space 3: Sommerhus
        this.snowgieGameActive = false;
        this.snowgiesTagged = 0;
        this.snowgieGameTimer = 30;
        this.activeSnowgies = [];
        this.snowgieCountdownEvent = null;
        this.snowgieSpawnEvent = null;
        this.sculptureStage = 0;

        // Mobile touch controls
        this.mobileInput = { left: false, right: false, up: false, down: false, jump: false, action: false };
    }

    create() {
        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.init) {
            retroArcadeAudio.init();
        }

        const W = this.scale.width;
        const H = this.scale.height;

        // Room dimensions: 3 large side-by-side royal chambers (each 900px wide)
        const roomW = 2700;
        const roomH = Math.max(540, H);
        this.roomW = roomW;
        this.roomH = roomH;

        const floorH = Math.max(140, Math.round(roomH * 0.25));
        const floorY = roomH - floorH;
        this.floorY = floorY;
        this.floorH = floorH;
        this.groundY = floorY + 36;
        this.playerGroundY = this.groundY;

        this.physics.world.setBounds(0, 0, roomW, roomH);

        // 0. Base dark backdrop
        this.add.rectangle(0, 0, 10000, 10000, 0x080612).setOrigin(0.5).setDepth(0);

        // 1. Procedural NES textures
        this.createTextures();

        // 2. Build the 3 Disney Princess Spaces
        this.buildRapunzelStudio(0, 900, floorY, floorH);
        this.buildBelleLibrary(900, 1800, floorY, floorH);
        this.buildSommerhus(1800, 2700, floorY, floorH);

        // 3. Room Portals / Archways between spaces
        this.createArchways(floorY);

        // 4. Player Sprite & Animation Setup
        this.createPlayer();

        // 5. Speech Bubble / Dialogue Box
        this.createSpeechBox();

        // 6. Camera Setup
        this.cameras.main.setBounds(0, 0, roomW, roomH);
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

        // 7. Standalone Standout Fixed UI (HUD, Tabs, Exit Button)
        this.createTopNavigationUI();
        this.createBottomStatusHUD();
        this.createMobileControls();

        // 8. Keyboard Controls & Listeners
        this.setupKeyboardControls();

        // 9. Initial Tab highlight & prompt
        this.updateTabHighlights();
        this.updateHud();
    }

    // =========================================================================
    // AUDIO SYNTHESIS HELPER (NES RETRO AUDIO)
    // =========================================================================
    playSfx(type) {
        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.init) {
            retroArcadeAudio.init();
        }
        const ctx = (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.ctx) ? retroArcadeAudio.ctx : null;
        if (!ctx) return;
        try {
            const now = ctx.currentTime;
            if (type === 'magic') {
                [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, now + idx * 0.04);
                    gain.gain.setValueAtTime(0.12, now + idx * 0.04);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + (idx + 1) * 0.08);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now + idx * 0.04);
                    osc.stop(now + (idx + 1) * 0.08);
                });
            } else if (type === 'fanfare') {
                [440, 554.37, 659.25, 880, 1108.73].forEach((freq, idx) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, now + idx * 0.09);
                    gain.gain.setValueAtTime(0.15, now + idx * 0.09);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + (idx + 1) * 0.12);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now + idx * 0.09);
                    osc.stop(now + (idx + 1) * 0.12);
                });
            } else if (type === 'chirp') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(650, now);
                osc.frequency.linearRampToValueAtTime(1200, now + 0.08);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.09);
            } else if (type === 'snowball') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(260, now);
                osc.frequency.exponentialRampToValueAtTime(750, now + 0.07);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.08);
            } else if (type === 'blip') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'square';
                osc.frequency.setValueAtTime(440, now);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.04);
            }
        } catch (e) {}
    }

    // =========================================================================
    // PROCEDURAL PIXEL TEXTURES
    // =========================================================================
    createTextures() {
        // 1. Royal Purple Carpet Tile (32x32)
        if (!this.textures.exists('fth_carpet')) {
            const g = this.make.graphics({ x: 0, y: 0, add: false });
            g.fillStyle(0x2D0D42, 1);
            g.fillRect(0, 0, 32, 32);
            g.fillStyle(0x3B1257, 1);
            g.fillRect(0, 0, 16, 16);
            g.fillRect(16, 16, 16, 16);
            g.fillStyle(0xE5B800, 0.4);
            g.fillRect(14, 14, 4, 4);
            g.generateTexture('fth_carpet', 32, 32);
            g.destroy();
        }

        // 2. Rapunzel Corona Wall Tile (32x32)
        if (!this.textures.exists('fth_rapunzel_wall')) {
            const g = this.make.graphics({ x: 0, y: 0, add: false });
            g.fillStyle(0x200730, 1);
            g.fillRect(0, 0, 32, 32);
            g.fillStyle(0x2A0B3F, 1);
            g.fillRect(0, 0, 32, 16);
            g.fillStyle(0xF8D038, 0.25);
            g.fillRect(15, 6, 2, 4);
            g.fillRect(14, 7, 4, 2);
            g.generateTexture('fth_rapunzel_wall', 32, 32);
            g.destroy();
        }

        // 3. Belle Library Wood Wall (32x32)
        if (!this.textures.exists('fth_library_wall')) {
            const g = this.make.graphics({ x: 0, y: 0, add: false });
            g.fillStyle(0x220A0A, 1);
            g.fillRect(0, 0, 32, 32);
            g.fillStyle(0x2E1010, 1);
            g.fillRect(2, 2, 28, 28);
            g.fillStyle(0x401616, 1);
            g.fillRect(4, 4, 24, 24);
            g.fillStyle(0xD4AF37, 0.4);
            g.fillRect(1, 1, 30, 1);
            g.generateTexture('fth_library_wall', 32, 32);
            g.destroy();
        }

        // 4. Sommerhus Timber Wall (32x32)
        if (!this.textures.exists('fth_timber_wall')) {
            const g = this.make.graphics({ x: 0, y: 0, add: false });
            g.fillStyle(0x381E10, 1);
            g.fillRect(0, 0, 32, 32);
            g.fillStyle(0x241208, 1);
            g.fillRect(0, 15, 32, 2);
            g.fillRect(0, 31, 32, 1);
            g.fillStyle(0x4C2916, 1);
            g.fillRect(2, 2, 28, 12);
            g.fillRect(2, 18, 28, 12);
            g.fillStyle(0x1A0D06, 0.6);
            g.fillRect(8, 6, 4, 3);
            g.fillRect(22, 22, 3, 3);
            g.generateTexture('fth_timber_wall', 32, 32);
            g.destroy();
        }

        // 5. Corona Sun Pennant Banner (36x60)
        if (!this.textures.exists('fth_corona_banner')) {
            const g = this.make.graphics({ x: 0, y: 0, add: false });
            // Hanging rod
            g.fillStyle(0x8B5A2B, 1);
            g.fillRect(0, 0, 36, 4);
            // Banner body (purple pennant)
            g.fillStyle(0x4E146B, 1);
            g.fillRect(3, 4, 30, 44);
            g.fillTriangle(3, 48, 33, 48, 18, 58);
            // Gold trim border
            g.lineStyle(1, 0xFFD700, 1);
            g.strokeRect(4, 5, 28, 42);
            // Corona Royal Sun
            g.fillStyle(0xFFD700, 1);
            g.fillCircle(18, 26, 7);
            // Radiating rays
            for (let a = 0; a < 8; a++) {
                const angle = (a * Math.PI) / 4;
                const rx = 18 + Math.cos(angle) * 11;
                const ry = 26 + Math.sin(angle) * 11;
                g.fillCircle(rx, ry, 1.5);
            }
            g.generateTexture('fth_corona_banner', 36, 60);
            g.destroy();
        }

        // 6. Pascal the Chameleon (28x22)
        if (!this.textures.exists('fth_pascal_green')) {
            this.createPascalTexture('fth_pascal_green', 0x2ECC71, 0x27AE60);
            this.createPascalTexture('fth_pascal_gold', 0xF1C40F, 0xD4AC0D);
            this.createPascalTexture('fth_pascal_purple', 0x9B59B6, 0x8E44AD);
            this.createPascalTexture('fth_pascal_pink', 0xFF69B4, 0xD81B60);
            this.createPascalTexture('fth_pascal_blue', 0x00E5FF, 0x0097A7);
        }

        // 7. Rose in Glass Cloche Dome (28x44)
        if (!this.textures.exists('fth_rose_dome')) {
            const g = this.make.graphics({ x: 0, y: 0, add: false });
            // Base pedestal (marble gold)
            g.fillStyle(0x3A2612, 1);
            g.fillRect(2, 38, 24, 6);
            g.fillStyle(0xFFD700, 1);
            g.fillRect(4, 37, 20, 2);
            // Glass dome (semi-transparent cyan highlight)
            g.fillStyle(0x70D6FF, 0.25);
            g.fillRect(4, 8, 20, 28);
            g.fillCircle(14, 8, 10);
            g.lineStyle(1, 0xCCE8FF, 0.7);
            g.strokeRect(4, 8, 20, 28);
            g.strokeCircle(14, 8, 10);
            // Stem
            g.fillStyle(0x27AE60, 1);
            g.fillRect(13, 20, 2, 14);
            g.fillRect(11, 25, 3, 2);
            // Crimson Rose head
            g.fillStyle(0xE01840, 1);
            g.fillCircle(14, 18, 5);
            g.fillStyle(0xFF5376, 1);
            g.fillCircle(13, 17, 3);
            // Fallen glowing petal
            g.fillStyle(0xE01840, 1);
            g.fillRect(8, 35, 3, 2);
            g.generateTexture('fth_rose_dome', 28, 44);
            g.destroy();
        }

        // 8. Lumiere Candelabra (28x38)
        if (!this.textures.exists('fth_lumiere')) {
            const g = this.make.graphics({ x: 0, y: 0, add: false });
            // Golden base and stem
            g.fillStyle(0xFFD700, 1);
            g.fillRect(8, 32, 12, 4);
            g.fillRect(12, 16, 4, 16);
            // Arms
            g.fillRect(4, 20, 20, 3);
            g.fillRect(4, 14, 3, 6);
            g.fillRect(21, 14, 3, 6);
            // Center head
            g.fillCircle(14, 12, 3);
            // Candles (white)
            g.fillStyle(0xFFFFFF, 1);
            g.fillRect(4, 9, 3, 5);
            g.fillRect(13, 6, 3, 5);
            g.fillRect(21, 9, 3, 5);
            // Candle flames (golden orange)
            g.fillStyle(0xFF8800, 1);
            g.fillCircle(5, 6, 2.5);
            g.fillCircle(14, 3, 2.5);
            g.fillCircle(22, 6, 2.5);
            g.fillStyle(0xFFFF00, 1);
            g.fillCircle(5, 6, 1.2);
            g.fillCircle(14, 3, 1.2);
            g.fillCircle(22, 6, 1.2);
            g.generateTexture('fth_lumiere', 28, 38);
            g.destroy();
        }

        // 9. Tall Library Bookshelf (44x84)
        if (!this.textures.exists('fth_bookshelf')) {
            const g = this.make.graphics({ x: 0, y: 0, add: false });
            // Wooden case
            g.fillStyle(0x280E0E, 1);
            g.fillRect(0, 0, 44, 84);
            g.fillStyle(0x401818, 1);
            g.fillRect(2, 2, 40, 80);
            // 3 Shelves
            g.fillStyle(0x280E0E, 1);
            g.fillRect(2, 28, 40, 4);
            g.fillRect(2, 56, 40, 4);
            // Shelf 1 books
            const colors = [0x992222, 0x225588, 0x227733, 0xAA7722, 0x772277, 0x992222, 0x225588];
            for (let i = 0; i < 7; i++) {
                g.fillStyle(colors[i % colors.length], 1);
                const h = 18 + (i % 3) * 2;
                g.fillRect(4 + i * 5, 28 - h, 4, h);
                g.fillStyle(0xFFD700, 0.7);
                g.fillRect(4 + i * 5, 28 - h + 4, 4, 1);
            }
            // Shelf 2 books
            for (let i = 0; i < 7; i++) {
                g.fillStyle(colors[(i + 3) % colors.length], 1);
                const h = 17 + (i % 4) * 2;
                g.fillRect(4 + i * 5, 56 - h, 4, h);
                g.fillStyle(0xFFD700, 0.7);
                g.fillRect(4 + i * 5, 56 - h + 3, 4, 1);
            }
            // Shelf 3 books
            for (let i = 0; i < 7; i++) {
                g.fillStyle(colors[(i + 1) % colors.length], 1);
                const h = 19 - (i % 3) * 2;
                g.fillRect(4 + i * 5, 82 - h, 4, h);
                g.fillStyle(0xFFD700, 0.7);
                g.fillRect(4 + i * 5, 82 - h + 4, 4, 1);
            }
            g.generateTexture('fth_bookshelf', 44, 84);
            g.destroy();
        }

        // 10. Olaf the Snowman (32x48)
        if (!this.textures.exists('fth_olaf')) {
            const g = this.make.graphics({ x: 0, y: 0, add: false });
            // Body balls
            g.fillStyle(0xFFFFFF, 1);
            g.fillCircle(16, 38, 9); // bottom ball
            g.fillCircle(16, 25, 7); // middle ball
            g.fillCircle(16, 12, 6); // head
            // Feet
            g.fillCircle(11, 44, 3);
            g.fillCircle(21, 44, 3);
            // Coal buttons
            g.fillStyle(0x222222, 1);
            g.fillCircle(16, 24, 1.5);
            g.fillCircle(16, 34, 1.5);
            g.fillCircle(16, 40, 1.5);
            // Coal eyes & tooth
            g.fillCircle(14, 10, 1.2);
            g.fillCircle(18, 10, 1.2);
            g.fillStyle(0xFFFFFF, 1);
            g.fillRect(14, 14, 4, 2);
            // Carrot nose
            g.fillStyle(0xFF6B00, 1);
            g.fillRect(16, 11, 6, 2);
            // Twig hair
            g.fillStyle(0x5A381E, 1);
            g.fillRect(15, 3, 1, 4);
            g.fillRect(16, 2, 1, 5);
            g.fillRect(17, 4, 1, 3);
            // Twig arms
            g.fillRect(5, 23, 6, 2);
            g.fillRect(3, 20, 3, 2);
            g.fillRect(21, 23, 6, 2);
            g.fillRect(26, 20, 3, 2);
            g.generateTexture('fth_olaf', 32, 48);
            g.destroy();
        }

        // 11. Snowgie (24x24)
        if (!this.textures.exists('fth_snowgie')) {
            const g = this.make.graphics({ x: 0, y: 0, add: false });
            // Round snowball body
            g.fillStyle(0xD8F0FF, 1);
            g.fillCircle(12, 13, 10);
            g.fillStyle(0xFFFFFF, 1);
            g.fillCircle(12, 12, 9);
            // Feet
            g.fillCircle(7, 21, 3);
            g.fillCircle(17, 21, 3);
            // Big cute eyes
            g.fillStyle(0x1B2A4A, 1);
            g.fillCircle(9, 10, 2);
            g.fillCircle(15, 10, 2);
            g.fillStyle(0xFFFFFF, 1);
            g.fillCircle(8, 9, 0.8);
            g.fillCircle(14, 9, 0.8);
            // Cheerful smile
            g.fillStyle(0x1B2A4A, 1);
            g.fillRect(10, 14, 4, 2);
            g.fillRect(11, 16, 2, 1);
            // Rosy cheeks
            g.fillStyle(0xFFAEC9, 0.8);
            g.fillCircle(6, 12, 1.5);
            g.fillCircle(18, 12, 1.5);
            g.generateTexture('fth_snowgie', 24, 24);
            g.destroy();
        }

        // 12. Elsa Ice Magic Snowball Projectile (16x16)
        if (!this.textures.exists('fth_ice_magic')) {
            const g = this.make.graphics({ x: 0, y: 0, add: false });
            g.fillStyle(0x00E5FF, 0.6);
            g.fillCircle(8, 8, 7);
            g.fillStyle(0xFFFFFF, 1);
            g.fillCircle(8, 8, 4);
            // Snowflake spokes
            g.fillStyle(0xCCE8FF, 1);
            g.fillRect(7, 1, 2, 14);
            g.fillRect(1, 7, 14, 2);
            g.generateTexture('fth_ice_magic', 16, 16);
            g.destroy();
        }

        // 13. Ice Crystal Sculptures (Stages 1 through 5)
        for (let s = 1; s <= 5; s++) {
            const key = 'fth_ice_sculpture_' + s;
            if (!this.textures.exists(key)) {
                const g = this.make.graphics({ x: 0, y: 0, add: false });
                const baseW = 48;
                const baseH = 64;
                // Icy Pedestal base
                g.fillStyle(0x0A2B4C, 1);
                g.fillRect(4, 52, 40, 10);
                g.fillStyle(0x3AA4E8, 1);
                g.fillRect(6, 50, 36, 4);

                // Growing crystal structures
                if (s === 1) {
                    g.fillStyle(0x9BE7FF, 1);
                    g.fillTriangle(24, 26, 16, 50, 32, 50);
                    g.fillStyle(0xE0F7FF, 0.8);
                    g.fillTriangle(24, 26, 21, 50, 27, 50);
                } else if (s === 2) {
                    g.fillStyle(0x70D6FF, 1);
                    g.fillTriangle(20, 18, 12, 50, 28, 50);
                    g.fillTriangle(28, 22, 20, 50, 36, 50);
                    g.fillStyle(0xFFFFFF, 0.9);
                    g.fillCircle(20, 18, 3);
                    g.fillCircle(28, 22, 2.5);
                } else if (s === 3) {
                    // Elsa Starburst
                    g.fillStyle(0x70D6FF, 1);
                    g.fillTriangle(24, 12, 14, 50, 34, 50);
                    g.fillStyle(0xFFFFFF, 1);
                    g.fillRect(23, 8, 2, 24);
                    g.fillRect(12, 19, 24, 2);
                    g.fillCircle(24, 20, 5);
                } else if (s === 4) {
                    // Ice Palace Spire
                    g.fillStyle(0x40B5F7, 1);
                    g.fillRect(16, 24, 16, 26);
                    g.fillTriangle(24, 4, 12, 24, 36, 24);
                    g.fillTriangle(14, 16, 8, 50, 20, 50);
                    g.fillTriangle(34, 16, 28, 50, 40, 50);
                    g.fillStyle(0xFFFFFF, 1);
                    g.fillCircle(24, 4, 3);
                } else if (s === 5) {
                    // Masterpiece Arendelle Ice Castle
                    g.fillStyle(0x2796DC, 1);
                    g.fillRect(12, 22, 24, 28);
                    g.fillTriangle(24, 2, 8, 22, 40, 22);
                    g.fillTriangle(10, 14, 4, 50, 18, 50);
                    g.fillTriangle(38, 14, 30, 50, 44, 50);
                    g.fillStyle(0xFFFFFF, 1);
                    g.fillCircle(24, 2, 4);
                    g.fillCircle(10, 14, 2.5);
                    g.fillCircle(38, 14, 2.5);
                    // Glowing crown stars
                    g.fillStyle(0xFFE57F, 1);
                    g.fillCircle(24, 16, 3);
                }
                g.generateTexture(key, baseW, baseH);
                g.destroy();
            }
        }

        // 14. Fairytale Royal Crown Badge (24x20)
        if (!this.textures.exists('fth_crown_badge')) {
            const g = this.make.graphics({ x: 0, y: 0, add: false });
            g.fillStyle(0xF8B800, 1);
            g.fillRect(2, 14, 20, 4);
            g.fillTriangle(4, 14, 4, 4, 9, 14);
            g.fillTriangle(12, 14, 12, 2, 12, 14);
            g.fillTriangle(10, 14, 12, 2, 14, 14);
            g.fillTriangle(15, 14, 20, 4, 20, 14);
            // Jewels
            g.fillStyle(0xE01840, 1);
            g.fillCircle(12, 15, 1.5);
            g.fillStyle(0x00E5FF, 1);
            g.fillCircle(6, 15, 1.2);
            g.fillCircle(18, 15, 1.2);
            // Sparkle tips
            g.fillStyle(0xFFFFFF, 1);
            g.fillCircle(4, 4, 1.5);
            g.fillCircle(12, 2, 1.8);
            g.fillCircle(20, 4, 1.5);
            g.generateTexture('fth_crown_badge', 24, 20);
            g.destroy();
        }
    }

    createPascalTexture(key, bodyColor, shadowColor) {
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        // Body
        g.fillStyle(bodyColor, 1);
        g.fillRect(6, 6, 14, 10);
        g.fillRect(4, 8, 3, 6);
        // Back crest ridge
        g.fillStyle(shadowColor, 1);
        g.fillRect(8, 4, 2, 2);
        g.fillRect(12, 4, 2, 2);
        g.fillRect(16, 4, 2, 2);
        // Curled tail
        g.fillStyle(bodyColor, 1);
        g.fillRect(19, 10, 4, 3);
        g.fillRect(22, 7, 3, 5);
        g.fillRect(20, 7, 3, 2);
        // Feet
        g.fillRect(7, 16, 4, 3);
        g.fillRect(15, 16, 4, 3);
        // Big Chameleon Eye
        g.fillStyle(0xFFFFFF, 1);
        g.fillCircle(6, 8, 3.5);
        g.fillStyle(0x111111, 1);
        g.fillCircle(6, 8, 1.5);
        g.generateTexture(key, 28, 22);
        g.destroy();
    }

    // =========================================================================
    // SPACE 1: RAPUNZEL'S ART STUDIO (FLOATING LANTERNS & PAINTING)
    // =========================================================================
    buildRapunzelStudio(startX, endX, floorY, floorH) {
        const roomCenterX = (startX + endX) / 2; // 450

        // Background Wall & Floor
        this.add.tileSprite(roomCenterX, floorY / 2, 900, floorY, 'fth_rapunzel_wall').setDepth(1);
        this.add.tileSprite(roomCenterX, floorY + (floorH / 2), 900, floorH, 'fth_carpet').setDepth(2);

        // Gold base trim
        const curb = this.add.graphics().setDepth(3);
        curb.fillStyle(0xFFD700, 1);
        curb.fillRect(startX, floorY - 3, 900, 3);
        curb.fillStyle(0x8E24AA, 0.85);
        curb.fillRect(startX, floorY, 900, 2);

        // Ceiling Corona Timber Trusses & Hanging Lanterns
        for (let x = startX + 75; x < endX; x += 150) {
            this.add.rectangle(x, 14, 120, 8, 0x3E1E08).setDepth(4);
            // Wire
            this.add.rectangle(x, 26, 2, 16, 0x1A0D06).setDepth(4);
            // Hanging glowing lantern
            const lan = this.add.rectangle(x, 38, 12, 16, 0xFFB300).setDepth(4).setStrokeStyle(1, 0x8E24AA);
            this.tweens.add({
                targets: lan,
                alpha: 0.6,
                duration: 600 + (x % 400),
                yoyo: true,
                repeat: -1
            });
        }

        // Corona Sun Pennant Banners
        this.add.image(startX + 140, 105, 'fth_corona_banner').setDepth(5);
        this.add.image(endX - 140, 105, 'fth_corona_banner').setDepth(5);

        // Starry Corona Night Window (Where lanterns float!)
        this.nightWindowX = roomCenterX;
        this.nightWindowY = floorY - 220;
        this.createCoronaNightWindow(this.nightWindowX, this.nightWindowY);

        // Paint Table & Pascal the Chameleon
        const tableX = roomCenterX - 240;
        const tableY = floorY - 30;
        this.add.rectangle(tableX, tableY, 80, 24, 0x4A2711).setDepth(6).setStrokeStyle(1, 0xFFD700);
        this.add.rectangle(tableX - 25, tableY + 16, 8, 16, 0x351908).setDepth(6);
        this.add.rectangle(tableX + 25, tableY + 16, 8, 16, 0x351908).setDepth(6);
        // Paint jars on table
        const jarColors = [0xFFD700, 0x9B59B6, 0xFF69B4, 0x00E5FF];
        jarColors.forEach((col, idx) => {
            this.add.rectangle(tableX - 24 + idx * 16, tableY - 14, 10, 12, col).setDepth(7);
        });

        // Pascal sprite on the table
        this.pascalSprite = this.add.image(tableX + 16, tableY - 14, 'fth_pascal_green')
            .setDepth(8)
            .setInteractive({ useHandCursor: true });
        this.pascalSprite.on('pointerdown', () => this.interactWithPascal());

        // Pascal Label
        this.add.text(tableX + 16, tableY - 32, 'PASCAL [TAP]', {
            fontSize: '6px', fontFamily: '"Press Start 2P", monospace', fill: '#00FF66', backgroundColor: '#000000', padding: 2
        }).setOrigin(0.5).setDepth(8);

        // Studio Title Banner
        this.add.rectangle(roomCenterX, 66, 340, 24, 0x220536, 0.9).setDepth(5).setStrokeStyle(2, 0xF8B800);
        this.add.text(roomCenterX, 66, "★ RAPUNZEL'S ART STUDIO ★", {
            fontSize: '9px', fontFamily: '"Press Start 2P", monospace', fill: '#FFD700'
        }).setOrigin(0.5).setDepth(6);

        // Interactive 8-Bit Floating Lantern Workshop Easel
        this.createLanternWorkshop(roomCenterX + 60, floorY - 95);
    }

    createCoronaNightWindow(x, y) {
        const w = 240;
        const h = 100;
        this.nightWindowBounds = { x: x - w / 2, y: y - h / 2, w, h };

        // Window Frame
        this.add.rectangle(x, y, w + 10, h + 10, 0x381907).setDepth(4).setStrokeStyle(2, 0xF8B800);
        // Night sky (deep indigo)
        this.add.rectangle(x, y, w, h, 0x080826).setDepth(5);

        // Distant Corona silhouette castle & towers
        const sil = this.add.graphics().setDepth(6);
        sil.fillStyle(0x120C2E, 1);
        sil.fillRect(x - 30, y + 25, 60, 25);
        sil.fillTriangle(x, y + 5, x - 18, y + 25, x + 18, y + 25); // Central Tower
        sil.fillRect(x - 70, y + 32, 25, 18);
        sil.fillRect(x + 45, y + 32, 25, 18);

        // Twinkling stars in window
        for (let s = 0; s < 14; s++) {
            const sx = x - (w / 2) + 12 + (s * 16) + (s % 3) * 2;
            const sy = y - (h / 2) + 8 + ((s * 19) % 55);
            const star = this.add.text(sx, sy, '✦', { fontSize: '6px', fill: '#FFE8AA' }).setOrigin(0.5).setDepth(7);
            this.tweens.add({
                targets: star,
                alpha: 0.2,
                duration: 500 + (s * 120),
                yoyo: true,
                repeat: -1
            });
        }
    }

    createLanternWorkshop(x, y) {
        this.workshopX = x;
        this.workshopY = y;

        // Wooden Easel Legs
        const easel = this.add.graphics().setDepth(6);
        easel.fillStyle(0x4E270E, 1);
        easel.fillRect(x - 55, y - 55, 6, 140);
        easel.fillRect(x + 49, y - 55, 6, 140);
        easel.fillRect(x - 65, y + 45, 130, 8); // Shelf ledge

        // Lantern Canvas Board (Warm Amber Glow Paper)
        const boardW = 96;
        const boardH = 96;
        this.add.rectangle(x, y - 5, boardW + 8, boardH + 8, 0x1A0924).setDepth(7).setStrokeStyle(2, 0xFFD700);
        this.lanternBoardBg = this.add.rectangle(x, y - 5, boardW, boardH, 0xF8AA38).setDepth(8);

        // 8x8 Interactive Grid of Lantern Pixels
        const cols = 8;
        const rows = 8;
        const cellSize = 11;
        this.lanternGridCols = cols;
        this.lanternGridRows = rows;
        this.lanternCellSize = cellSize;
        this.lanternGridStartX = x - (cols * cellSize) / 2 + cellSize / 2;
        this.lanternGridStartY = (y - 5) - (rows * cellSize) / 2 + cellSize / 2;

        this.lanternGrid = [];
        this.lanternCellGraphics = this.add.graphics().setDepth(9);

        // Initialize grid with blank amber silk glow
        for (let r = 0; r < rows; r++) {
            this.lanternGrid[r] = [];
            for (let c = 0; c < cols; c++) {
                this.lanternGrid[r][c] = 0xFFA500;
            }
        }
        // Stamp default Corona Sun pattern so it looks like Rapunzel's iconic lantern
        this.applySunStencil();
        this.renderLanternGrid();

        // Click on grid to paint with chosen color/tool
        const hitArea = this.add.rectangle(x, y - 5, boardW, boardH, 0x000000, 0.001)
            .setDepth(10)
            .setInteractive({ useHandCursor: true });

        hitArea.on('pointerdown', (ptr) => {
            const localX = ptr.x - (this.lanternGridStartX - cellSize / 2);
            const localY = ptr.y - (this.lanternGridStartY - cellSize / 2);
            const c = Math.floor(localX / cellSize);
            const r = Math.floor(localY / cellSize);
            if (c >= 0 && c < cols && r >= 0 && r < rows) {
                this.handleGridClick(c, r);
                this.renderLanternGrid();
            }
        });

        // Palette Swatches & Stencil Selectors (placed to the right of easel)
        const toolsX = x + 105;
        this.createPaletteSwatches(toolsX, y - 40);
        this.createStencilButtons(toolsX, y + 10);

        // Standout Prominent [ ★ LAUNCH FLOATING LANTERN ★ ] Button
        const launchBtn = this.add.rectangle(x + 20, y + 68, 200, 22, 0x9828B8).setDepth(10).setInteractive({ useHandCursor: true });
        launchBtn.setStrokeStyle(2, 0xFFD700);
        const launchTxt = this.add.text(x + 20, y + 68, '★ LAUNCH FLOATING LANTERN ★', {
            fontSize: '7px', fontFamily: '"Press Start 2P", monospace', fill: '#FFFFFF'
        }).setOrigin(0.5).setDepth(11);

        launchBtn.on('pointerdown', () => this.launchFloatingLantern(x, y - 5));
        launchBtn.on('pointerover', () => { launchBtn.setFillStyle(0xB838D8); });
        launchBtn.on('pointerout', () => { launchBtn.setFillStyle(0x9828B8); });
    }

    createPaletteSwatches(x, y) {
        this.add.text(x, y - 12, 'GLOW COLOR:', {
            fontSize: '6px', fontFamily: '"Press Start 2P", monospace', fill: '#FFD700'
        }).setOrigin(0.5).setDepth(10);

        const swatches = [
            { col: 0xFFD700, hex: '#FFD700' }, // Gold
            { col: 0x9B59B6, hex: '#9B59B6' }, // Purple
            { col: 0xFF69B4, hex: '#FF69B4' }, // Pink
            { col: 0x00E5FF, hex: '#00E5FF' }, // Cyan
            { col: 0xFFFFFF, hex: '#FFFFFF' }  // White
        ];

        this.swatchBoxes = [];
        swatches.forEach((sw, idx) => {
            const sx = x - 36 + idx * 18;
            const sy = y + 4;
            const box = this.add.rectangle(sx, sy, 14, 14, sw.col)
                .setDepth(10)
                .setInteractive({ useHandCursor: true })
                .setStrokeStyle(idx === 0 ? 2 : 1, idx === 0 ? 0xFFFFFF : 0x000000);

            box.on('pointerdown', () => {
                this.activeGlowColor = sw.col;
                this.activeGlowColorHex = sw.hex;
                this.swatchBoxes.forEach(b => b.setStrokeStyle(1, 0x000000));
                box.setStrokeStyle(2, 0xFFFFFF);
                this.playSfx('blip');
            });
            this.swatchBoxes.push(box);
        });
    }

    createStencilButtons(x, y) {
        this.add.text(x, y, 'STENCIL / BRUSH:', {
            fontSize: '6px', fontFamily: '"Press Start 2P", monospace', fill: '#FFD700'
        }).setOrigin(0.5).setDepth(10);

        const stencils = [
            { id: 'sun', label: '☀ SUN' },
            { id: 'star', label: '★ STAR' },
            { id: 'flower', label: '✿ FLOWER' },
            { id: 'brush', label: '✎ BRUSH' },
            { id: 'clear', label: '⟲ CLEAR' }
        ];

        stencils.forEach((st, idx) => {
            const bx = x - 42 + (idx % 3) * 42;
            const by = y + 15 + Math.floor(idx / 3) * 16;
            const btn = this.add.text(bx, by, st.label, {
                fontSize: '6px', fontFamily: '"Press Start 2P", monospace', fill: '#FFFFFF', backgroundColor: '#3A084E', padding: 3
            }).setOrigin(0.5).setDepth(10).setInteractive({ useHandCursor: true });

            btn.on('pointerdown', () => {
                this.playSfx('blip');
                if (st.id === 'sun') {
                    this.applySunStencil();
                } else if (st.id === 'star') {
                    this.applyStarStencil();
                } else if (st.id === 'flower') {
                    this.applyFlowerStencil();
                } else if (st.id === 'clear') {
                    this.clearLanternGrid();
                } else {
                    this.activeTool = 'brush';
                }
                this.renderLanternGrid();
            });
        });
    }

    handleGridClick(c, r) {
        this.playSfx('blip');
        if (this.lanternGrid[r][c] === this.activeGlowColor) {
            this.lanternGrid[r][c] = 0xFFA500; // toggle off
        } else {
            this.lanternGrid[r][c] = this.activeGlowColor;
        }
    }

    applySunStencil() {
        this.clearLanternGrid();
        const center = [
            [2, 3], [2, 4], [3, 2], [3, 3], [3, 4], [3, 5],
            [4, 2], [4, 3], [4, 4], [4, 5], [5, 3], [5, 4]
        ];
        center.forEach(([r, c]) => { this.lanternGrid[r][c] = this.activeGlowColor; });
        // Rays
        [[1, 3], [1, 4], [6, 3], [6, 4], [3, 1], [4, 1], [3, 6], [4, 6]].forEach(([r, c]) => {
            this.lanternGrid[r][c] = this.activeGlowColor;
        });
    }

    applyStarStencil() {
        this.clearLanternGrid();
        const star = [
            [1, 3], [1, 4], [2, 3], [2, 4],
            [3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7],
            [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7],
            [5, 3], [5, 4], [6, 3], [6, 4]
        ];
        star.forEach(([r, c]) => { this.lanternGrid[r][c] = this.activeGlowColor; });
    }

    applyFlowerStencil() {
        this.clearLanternGrid();
        const flower = [
            [2, 3], [2, 4], [5, 3], [5, 4],
            [3, 2], [4, 2], [3, 5], [4, 5],
            [3, 3], [3, 4], [4, 3], [4, 4]
        ];
        flower.forEach(([r, c]) => { this.lanternGrid[r][c] = this.activeGlowColor; });
    }

    clearLanternGrid() {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                this.lanternGrid[r][c] = 0xFFA500;
            }
        }
    }

    renderLanternGrid() {
        if (!this.lanternCellGraphics) return;
        this.lanternCellGraphics.clear();
        const cols = this.lanternGridCols || 8;
        const rows = this.lanternGridRows || 8;
        const cellSize = this.lanternCellSize || 11;
        const startX = this.lanternGridStartX;
        const startY = this.lanternGridStartY;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const px = startX + c * cellSize - cellSize / 2;
                const py = startY + r * cellSize - cellSize / 2;
                const col = this.lanternGrid[r][c];
                this.lanternCellGraphics.fillStyle(col, 1);
                this.lanternCellGraphics.fillRect(px, py, cellSize - 1, cellSize - 1);
            }
        }
    }

    launchFloatingLantern(originX, originY) {
        this.playSfx('fanfare');

        // Increment rapunzelLanterns & award Fairytale Hall badge
        const prog = getOceaneerProgress();
        const newCount = (prog.rapunzelLanterns || 0) + 1;
        saveOceaneerProgress({
            rapunzelLanterns: newCount,
            fairytaleBadge: true
        });
        this.updateHud();

        // 1. Sprout rising player lantern
        const rising = this.add.rectangle(originX, originY, 24, 32, this.activeGlowColor).setDepth(15).setStrokeStyle(1, 0xFFFFFF);
        this.tweens.add({
            targets: rising,
            y: this.nightWindowY + 20,
            x: this.nightWindowX + Phaser.Math.Between(-20, 20),
            scaleX: 0.6,
            scaleY: 0.6,
            alpha: 0.3,
            duration: 3200,
            ease: 'Sine.easeOut',
            onComplete: () => rising.destroy()
        });

        // 2. Swarm of glowing lanterns drifting up into the starry Corona night window
        for (let i = 0; i < 5; i++) {
            this.time.delayedCall(i * 300, () => {
                const wx = this.nightWindowBounds.x + 20 + Phaser.Math.Between(0, this.nightWindowBounds.w - 40);
                const lan = this.add.rectangle(wx, this.nightWindowBounds.y + this.nightWindowBounds.h - 5, 8, 12, this.activeGlowColor)
                    .setDepth(8)
                    .setStrokeStyle(1, 0xFFE082);

                this.tweens.add({
                    targets: lan,
                    y: this.nightWindowBounds.y + 10,
                    x: wx + Phaser.Math.Between(-15, 15),
                    alpha: 0.1,
                    duration: 3800 + i * 200,
                    ease: 'Sine.easeInOut',
                    onComplete: () => lan.destroy()
                });
            });
        }

        // 3. Rapunzel speech dialogue banner
        this.showSpeech(
            "RAPUNZEL",
            "✨ 'AND AT LAST I SEE THE LIGHT!' ✨\nLantern released! Floating lanterns total: " + newCount,
            3800
        );
    }

    interactWithPascal() {
        this.playSfx('chirp');
        const pascalThemes = ['fth_pascal_green', 'fth_pascal_gold', 'fth_pascal_purple', 'fth_pascal_pink', 'fth_pascal_blue'];
        this.pascalColorIndex = (this.pascalColorIndex + 1) % pascalThemes.length;
        this.pascalSprite.setTexture(pascalThemes[this.pascalColorIndex]);

        // Hop animation
        this.tweens.add({
            targets: this.pascalSprite,
            y: this.pascalSprite.y - 12,
            yoyo: true,
            duration: 160,
            ease: 'Power1'
        });

        const quotes = [
            "PASCAL: *Chirp!* (Pascal blended in with your paint!)",
            "PASCAL: *Squeak!* (Pascal loves the Corona lanterns!)",
            "PASCAL: *Nod!* (Pascal says your painting is a masterpiece!)"
        ];
        this.showSpeech("PASCAL", Phaser.Utils.Array.GetRandom(quotes), 3000);
    }

    // =========================================================================
    // SPACE 2: BELLE'S LIBRARY (ENCHANTED PAINTING STORYTELLING)
    // =========================================================================
    buildBelleLibrary(startX, endX, floorY, floorH) {
        const roomCenterX = (startX + endX) / 2; // 1350

        // Background Mahogany Wall & Floor
        this.add.tileSprite(roomCenterX, floorY / 2, 900, floorY, 'fth_library_wall').setDepth(1);
        this.add.tileSprite(roomCenterX, floorY + (floorH / 2), 900, floorH, 'fth_carpet').setDepth(2);

        // Gold base trim
        const curb = this.add.graphics().setDepth(3);
        curb.fillStyle(0xFFD700, 1);
        curb.fillRect(startX, floorY - 3, 900, 3);
        curb.fillStyle(0x7F1D1D, 0.85);
        curb.fillRect(startX, floorY, 900, 2);

        // Tall Bookshelves along the walls
        this.add.image(startX + 90, floorY - 55, 'fth_bookshelf').setDepth(4);
        this.add.image(startX + 140, floorY - 55, 'fth_bookshelf').setDepth(4);
        this.add.image(endX - 140, floorY - 55, 'fth_bookshelf').setDepth(4);
        this.add.image(endX - 90, floorY - 55, 'fth_bookshelf').setDepth(4);

        // Library Title Banner
        this.add.rectangle(roomCenterX, 66, 340, 24, 0x2A0B0B, 0.9).setDepth(5).setStrokeStyle(2, 0xF8B800);
        this.add.text(roomCenterX, 66, "★ BELLE'S ROYAL LIBRARY ★", {
            fontSize: '9px', fontFamily: '"Press Start 2P", monospace', fill: '#FFD700'
        }).setOrigin(0.5).setDepth(6);

        // Pedestal with Enchanted Rose Under Glass Cloche Dome
        const roseX = startX + 225;
        const roseY = floorY - 35;
        this.add.rectangle(roseX, roseY + 12, 32, 24, 0x3D1A10).setDepth(5).setStrokeStyle(1, 0xFFD700);
        this.roseSprite = this.add.image(roseX, roseY - 8, 'fth_rose_dome')
            .setDepth(6)
            .setInteractive({ useHandCursor: true });
        this.roseSprite.on('pointerdown', () => this.interactWithRose());

        this.add.text(roseX, roseY - 36, 'ENCHANTED ROSE', {
            fontSize: '6px', fontFamily: '"Press Start 2P", monospace', fill: '#FF88A8', backgroundColor: '#000000', padding: 2
        }).setOrigin(0.5).setDepth(7);

        // Lumiere Candelabra on side table
        const lumiereX = endX - 225;
        const lumiereY = floorY - 35;
        this.add.rectangle(lumiereX, lumiereY + 12, 32, 24, 0x3D1A10).setDepth(5).setStrokeStyle(1, 0xFFD700);
        this.lumiereSprite = this.add.image(lumiereX, lumiereY - 6, 'fth_lumiere')
            .setDepth(6)
            .setInteractive({ useHandCursor: true });
        this.lumiereSprite.on('pointerdown', () => this.interactWithLumiere());

        this.add.text(lumiereX, lumiereY - 36, 'LUMIERE [TAP]', {
            fontSize: '6px', fontFamily: '"Press Start 2P", monospace', fill: '#FFD700', backgroundColor: '#000000', padding: 2
        }).setOrigin(0.5).setDepth(7);

        // The Enchanted Painting Frame & Storytelling Theater
        this.createEnchantedPaintingTheater(roomCenterX, floorY - 105);
    }

    createEnchantedPaintingTheater(x, y) {
        this.paintingFrameX = x;
        this.paintingFrameY = y;
        const frameW = 320;
        const frameH = 140;

        // Capcom Ornate Gold Frame
        this.add.rectangle(x, y - 10, frameW + 16, frameH + 16, 0x3E1E05).setDepth(6).setStrokeStyle(3, 0xFFD700);
        this.add.rectangle(x, y - 10, frameW + 6, frameH + 6, 0x5C320A).setDepth(6).setStrokeStyle(1, 0xFFEE99);

        // Enchanted Canvas (Deep Royal Velvet Backdrop)
        this.paintingCanvasBg = this.add.rectangle(x, y - 10, frameW, frameH, 0x14051B).setDepth(7);
        this.paintingGraphics = this.add.graphics().setDepth(8);

        // Storytelling Title
        this.storyTitleText = this.add.text(x, y - 68, 'THE ENCHANTED PAINTING', {
            fontSize: '7px', fontFamily: '"Press Start 2P", monospace', fill: '#FFD700'
        }).setOrigin(0.5).setDepth(9);

        // Story Description / Prompt
        this.storyPromptText = this.add.text(x, y - 12, '', {
            fontSize: '7px', fontFamily: '"Press Start 2P", monospace', fill: '#FFFFFF', align: 'center', wordWrap: { width: 300 }
        }).setOrigin(0.5).setDepth(9);

        // Story Stars Display
        this.storyStarsText = this.add.text(x, y + 42, 'STARS: ☆☆☆', {
            fontSize: '7px', fontFamily: '"Press Start 2P", monospace', fill: '#FFD700'
        }).setOrigin(0.5).setDepth(9);

        // Story Selector Tabs (Tale 1: Castle, Tale 2: Ship, Tale 3: Dragon)
        this.storyTabs = [];
        const stories = [
            '1. ENCHANTED CASTLE',
            '2. GOLDEN SHIP',
            '3. ROYAL DRAGON'
        ];
        stories.forEach((st, idx) => {
            const tx = x - 100 + idx * 100;
            const tab = this.add.text(tx, y - 90, st, {
                fontSize: '6px', fontFamily: '"Press Start 2P", monospace', fill: '#FFFFFF', backgroundColor: idx === 0 ? '#8E24AA' : '#330842', padding: 4
            }).setOrigin(0.5).setDepth(9).setInteractive({ useHandCursor: true });

            tab.on('pointerdown', () => {
                this.activeStoryIndex = idx;
                this.storyTabs.forEach((t, i) => {
                    t.setBackgroundColor(i === idx ? '#8E24AA' : '#330842');
                });
                this.startStory(idx);
            });
            this.storyTabs.push(tab);
        });

        // 2 Interactive Story Decision Choice Buttons
        this.choiceBtnA = this.add.text(x, y + 68, '', {
            fontSize: '7px', fontFamily: '"Press Start 2P", monospace', fill: '#FFFFFF', backgroundColor: '#5B147D', padding: { x: 8, y: 5 }
        }).setOrigin(0.5).setDepth(10).setInteractive({ useHandCursor: true });

        this.choiceBtnB = this.add.text(x, y + 92, '', {
            fontSize: '7px', fontFamily: '"Press Start 2P", monospace', fill: '#FFFFFF', backgroundColor: '#3A084E', padding: { x: 8, y: 5 }
        }).setOrigin(0.5).setDepth(10).setInteractive({ useHandCursor: true });

        this.choiceBtnA.on('pointerdown', () => this.handleStoryChoice(1));
        this.choiceBtnB.on('pointerdown', () => this.handleStoryChoice(2));

        // Start default story #0
        this.startStory(0);
    }

    startStory(index) {
        this.playSfx('magic');
        this.activeStoryIndex = index;
        this.storyAct = 1;
        this.storyStars = 0;
        this.storyCompleted = false;
        this.renderStoryAct();
    }

    renderStoryAct() {
        const stories = [
            // Story 1: Tale of the Enchanted Castle
            {
                title: "TALE OF THE ENCHANTED CASTLE",
                acts: [
                    {
                        prompt: "ACT I: Belle arrives at the Beast's castle.\nWhere does she explore first?",
                        choiceA: "✦ 1. EXPLORE THE FORBIDDEN WEST WING",
                        choiceB: "✦ 2. ENTER THE MAGNIFICENT GRAND LIBRARY",
                        art: 'castle_west_wing',
                        artAlt: 'castle_library'
                    },
                    {
                        prompt: "ACT II: A bitter winter storm falls.\nHow does friendship bloom?",
                        choiceA: "✦ 1. OFFER A GENTLE HEALING ROSE",
                        choiceB: "✦ 2. PLAY A SWEET HARPSICHORD WALTZ",
                        art: 'castle_friendship',
                        artAlt: 'castle_music'
                    },
                    {
                        prompt: "ACT III: The final magical petal falls!\nHow is the enchantment broken?",
                        choiceA: "✦ 1. BREAK THE SPELL WITH TRUE LOVE",
                        choiceB: "✦ 2. DANCE TOGETHER IN GOLDEN BALLROOM",
                        art: 'castle_finale',
                        artAlt: 'castle_waltz'
                    }
                ]
            },
            // Story 2: Voyage of the Golden Ship
            {
                title: "VOYAGE OF THE GOLDEN SHIP",
                acts: [
                    {
                        prompt: "ACT I: The Disney Destiny sets sail!\nWhat guiding star do we follow?",
                        choiceA: "✦ 1. CHART BY THE NORTHERN STARS",
                        choiceB: "✦ 2. HOIST THE ROYAL GOLDEN BANNER",
                        art: 'ship_stars',
                        artAlt: 'ship_banner'
                    },
                    {
                        prompt: "ACT II: A luminous ocean mist appears.\nWhat mythical ally arrives?",
                        choiceA: "✦ 1. BEFRIEND A PLAYFUL SEA DRAGON",
                        choiceB: "✦ 2. SING WITH THE CHORUS OF MERMAIDS",
                        art: 'ship_dragon',
                        artAlt: 'ship_mermaids'
                    },
                    {
                        prompt: "ACT III: Reaching the legendary island!\nWhat glorious reward is found?",
                        choiceA: "✦ 1. UNLOCK THE STARDUST COMPASS",
                        choiceB: "✦ 2. CELEBRATE WITH A ROYAL REGATTA",
                        art: 'ship_compass',
                        artAlt: 'ship_regatta'
                    }
                ]
            },
            // Story 3: The Dragon & The Royal Crown
            {
                title: "THE DRAGON & THE ROYAL CROWN",
                acts: [
                    {
                        prompt: "ACT I: High upon the craggy peaks,\na sleeping dragon guards the Royal Crown.",
                        choiceA: "✦ 1. CLIMB THE WHISPERING CLIFFS",
                        choiceB: "✦ 2. READ FROM ANCIENT FAIRY PARCHMENTS",
                        art: 'dragon_cliffs',
                        artAlt: 'dragon_scrolls'
                    },
                    {
                        prompt: "ACT II: The dragon opens one curious eye!\nHow do you introduce yourself?",
                        choiceA: "✦ 1. OFFER A DELICIOUS ROYAL CROISSANT",
                        choiceB: "✦ 2. POLISH ITS EMERALD DRAGON SCALES",
                        art: 'dragon_snack',
                        artAlt: 'dragon_polish'
                    },
                    {
                        prompt: "ACT III: The kingdom celebrates peace!\nHow is the heroic dragon honored?",
                        choiceA: "✦ 1. CROWN THE DRAGON AS ROYAL GUARDIAN",
                        choiceB: "✦ 2. SOAR OVER THE KINGDOM AT SUNSET",
                        art: 'dragon_crown',
                        artAlt: 'dragon_flight'
                    }
                ]
            }
        ];

        const currentStory = stories[this.activeStoryIndex];
        const actData = currentStory.acts[this.storyAct - 1];

        this.storyTitleText.setText(currentStory.title + " - ACT " + this.storyAct + "/3");
        this.storyPromptText.setText(actData.prompt);
        this.choiceBtnA.setText(actData.choiceA).setVisible(true);
        this.choiceBtnB.setText(actData.choiceB).setVisible(true);

        const starsStr = ['☆☆☆', '★☆☆', '★★☆', '★★★'][this.storyStars];
        this.storyStarsText.setText("STORYTELLING STARS: " + starsStr);

        this.drawPaintingArt(actData.art);
    }

    handleStoryChoice(choiceNum) {
        this.playSfx('magic');
        this.storyStars = Math.min(3, this.storyStars + 1);

        if (this.storyAct < 3) {
            this.storyAct++;
            this.renderStoryAct();
        } else {
            // Completed 3-part tale!
            this.completeStory();
        }
    }

    completeStory() {
        this.playSfx('fanfare');
        this.storyCompleted = true;
        this.choiceBtnA.setVisible(false);
        this.choiceBtnB.setVisible(false);

        // Save progress & award badge
        const prog = getOceaneerProgress();
        const newCount = (prog.belleStoriesCompleted || 0) + 1;
        saveOceaneerProgress({
            belleStoriesCompleted: newCount,
            fairytaleBadge: true
        });
        this.updateHud();

        this.storyTitleText.setText("★ TALE COMPLETED! ★");
        this.storyPromptText.setText("✨ A magnificent story told with true Disney heart!\n★ 3 STORYTELLING STARS EARNED! ★\nTotal stories completed: " + newCount);
        this.storyStarsText.setText("STORYTELLING STARS: ★★★");

        // Tell another story button
        this.choiceBtnA.setText("✦ 📖 TELL ANOTHER TALE ✦").setVisible(true);
        this.choiceBtnA.removeAllListeners('pointerdown');
        this.choiceBtnA.on('pointerdown', () => {
            this.choiceBtnA.removeAllListeners('pointerdown');
            this.choiceBtnA.on('pointerdown', () => this.handleStoryChoice(1));
            this.startStory((this.activeStoryIndex + 1) % 3);
        });

        this.drawPaintingArt('celebration');

        // Belle quote speech bubble
        this.showSpeech(
            "BELLE",
            "✨ 'There's something in him that wasn't there before!' ✨\nWhat a truly wonderful imagination you have!",
            4000
        );
    }

    drawPaintingArt(artKey) {
        this.paintingGraphics.clear();
        const cx = this.paintingFrameX || 1350;
        const cy = (this.paintingFrameY || (this.floorY - 105)) - 10;

        if (artKey === 'celebration') {
            // Golden sparkles & bursting fireworks
            this.paintingGraphics.fillStyle(0xFFD700, 1);
            this.paintingGraphics.fillCircle(cx, cy, 14);
            for (let i = 0; i < 16; i++) {
                const a = (i * Math.PI) / 8;
                const rx = cx + Math.cos(a) * 45;
                const ry = cy + Math.sin(a) * 25;
                this.paintingGraphics.fillStyle(i % 2 === 0 ? 0xFF88D8 : 0x00E5FF, 1);
                this.paintingGraphics.fillCircle(rx, ry, 3);
            }
        } else if (artKey.includes('dragon')) {
            // Friendly emerald dragon silhouette with golden wings
            this.paintingGraphics.fillStyle(0x0E4D2A, 1);
            this.paintingGraphics.fillCircle(cx, cy + 5, 20); // body
            this.paintingGraphics.fillCircle(cx + 18, cy - 8, 12); // head
            this.paintingGraphics.fillStyle(0xFFD700, 1);
            this.paintingGraphics.fillTriangle(cx - 5, cy, cx - 35, cy - 25, cx, cy - 15); // wing
            this.paintingGraphics.fillCircle(cx + 22, cy - 10, 2); // eye
        } else if (artKey.includes('ship')) {
            // Golden sailing ship upon shimmering cyan waves
            this.paintingGraphics.fillStyle(0x0077B6, 1);
            this.paintingGraphics.fillRect(cx - 60, cy + 12, 120, 12);
            this.paintingGraphics.fillStyle(0x5A381E, 1);
            this.paintingGraphics.fillTriangle(cx - 40, cy + 12, cx + 40, cy + 12, cx, cy + 24); // hull
            this.paintingGraphics.fillStyle(0xFFD700, 1);
            this.paintingGraphics.fillTriangle(cx - 15, cy - 20, cx, cy + 10, cx - 15, cy + 10); // sail 1
            this.paintingGraphics.fillTriangle(cx + 15, cy - 15, cx, cy + 10, cx + 15, cy + 10); // sail 2
        } else {
            // Castle silhouette under starry moonlit sky
            this.paintingGraphics.fillStyle(0x2B1038, 1);
            this.paintingGraphics.fillRect(cx - 50, cy - 10, 100, 35);
            this.paintingGraphics.fillTriangle(cx, cy - 35, cx - 20, cy - 10, cx + 20, cy - 10); // central spire
            this.paintingGraphics.fillTriangle(cx - 35, cy - 25, cx - 50, cy - 10, cx - 20, cy - 10);
            this.paintingGraphics.fillTriangle(cx + 35, cy - 25, cx + 20, cy - 10, cx + 50, cy - 10);
            // Glowing Rose in the painting
            this.paintingGraphics.fillStyle(0xE01840, 1);
            this.paintingGraphics.fillCircle(cx, cy, 5);
        }
    }

    interactWithRose() {
        this.playSfx('magic');
        this.tweens.add({
            targets: this.roseSprite,
            y: this.roseSprite.y - 8,
            yoyo: true,
            duration: 200,
            ease: 'Power1'
        });
        this.showSpeech(
            "THE ENCHANTED ROSE",
            "✨ The petals glow with warmth.\n'For who could ever learn to love a beast?'",
            3000
        );
    }

    interactWithLumiere() {
        this.playSfx('fanfare');
        this.tweens.add({
            targets: this.lumiereSprite,
            scaleX: 1.2,
            scaleY: 1.2,
            yoyo: true,
            duration: 180
        });
        this.showSpeech(
            "LUMIERE",
            "✨ 'Ma chere Mademoiselle! Be our guest!\nAct out a tale to bring the Enchanted Painting to life!'",
            3200
        );
    }

    // =========================================================================
    // SPACE 3: ANNA & ELSA'S SOMMERHUS ("FROZEN FUN" HOSTED BY OLAF)
    // =========================================================================
    buildSommerhus(startX, endX, floorY, floorH) {
        const roomCenterX = (startX + endX) / 2; // 2250

        // Background Timber Cabin Wall & Floor
        this.add.tileSprite(roomCenterX, floorY / 2, 900, floorY, 'fth_timber_wall').setDepth(1);
        this.add.tileSprite(roomCenterX, floorY + (floorH / 2), 900, floorH, 'fth_carpet').setDepth(2);

        // Nordic Frost Trim Curb
        const curb = this.add.graphics().setDepth(3);
        curb.fillStyle(0x00E5FF, 1);
        curb.fillRect(startX, floorY - 3, 900, 3);
        curb.fillStyle(0xFFFFFF, 0.9);
        curb.fillRect(startX, floorY, 900, 2);

        // Sommerhus Title Banner
        this.add.rectangle(roomCenterX, 66, 360, 24, 0x0E2C48, 0.9).setDepth(5).setStrokeStyle(2, 0x00E5FF);
        this.add.text(roomCenterX, 66, "★ ANNA & ELSA'S SOMMERHUS ★", {
            fontSize: '9px', fontFamily: '"Press Start 2P", monospace', fill: '#A0E8FF'
        }).setOrigin(0.5).setDepth(6);

        // Frosted Window looking out onto Arendelle North Mountain
        const winX = startX + 160;
        const winY = floorY - 210;
        this.createFrostedWindow(winX, winY);

        // Stone Hearth Fireplace on the left
        const fireX = startX + 130;
        const fireY = floorY - 45;
        this.add.rectangle(fireX, fireY, 80, 50, 0x242424).setDepth(4).setStrokeStyle(2, 0x484848);
        this.add.rectangle(fireX, fireY + 10, 40, 25, 0x111111).setDepth(4);
        // Fire flames
        const fire = this.add.text(fireX, fireY + 8, '🔥', { fontSize: '14px' }).setOrigin(0.5).setDepth(5);
        this.tweens.add({ targets: fire, alpha: 0.6, duration: 250, yoyo: true, repeat: -1 });

        // Olaf the Snowman Host
        const olafX = roomCenterX - 110;
        const olafY = floorY - 36;
        this.olafSprite = this.add.image(olafX, olafY, 'fth_olaf')
            .setDepth(6)
            .setInteractive({ useHandCursor: true });
        this.olafSprite.on('pointerdown', () => this.interactWithOlaf());

        this.add.text(olafX, olafY - 36, 'OLAF [TAP]', {
            fontSize: '6px', fontFamily: '"Press Start 2P", monospace', fill: '#FFD700', backgroundColor: '#000000', padding: 2
        }).setOrigin(0.5).setDepth(7);

        // Central Giant Ice Crystal Sculpture Pedestal
        this.sculptureX = roomCenterX + 80;
        this.sculptureY = floorY - 60;
        this.iceSculptureSprite = this.add.image(this.sculptureX, this.sculptureY, 'fth_ice_sculpture_1')
            .setDepth(7)
            .setScale(1.2);

        this.sculptureLabel = this.add.text(this.sculptureX, this.sculptureY - 55, 'ICE SCULPTURE: STAGE 1/5', {
            fontSize: '6px', fontFamily: '"Press Start 2P", monospace', fill: '#00E5FF', backgroundColor: '#000000', padding: 2
        }).setOrigin(0.5).setDepth(8);

        // Mini-Game Snowgie Hiding Spots in Sommerhus
        this.snowgieSpots = [
            { x: startX + 130, y: floorY - 65, name: 'FIREPLACE' },
            { x: startX + 240, y: floorY - 180, name: 'HIGH BEAM' },
            { x: roomCenterX - 200, y: floorY - 40, name: 'CHAIR' },
            { x: startX + 160, y: floorY - 170, name: 'WINDOW' },
            { x: roomCenterX + 220, y: floorY - 45, name: 'CHEST' },
            { x: endX - 120, y: floorY - 45, name: 'SNOWBANK' }
        ];

        // Snowbank prop on the right
        this.add.ellipse(endX - 120, floorY - 15, 90, 24, 0xD4F1F9).setDepth(4);
        this.add.text(endX - 120, floorY - 30, '🌲', { fontSize: '16px' }).setOrigin(0.5).setDepth(4);

        // Carved Rosemaling Chest prop
        this.add.rectangle(roomCenterX + 220, floorY - 25, 45, 25, 0x4A2511).setDepth(4).setStrokeStyle(1, 0x00E5FF);

        // [ ❄ START FROZEN FUN ❄ ] Launch Button
        this.frozenFunStartBtn = this.add.rectangle(roomCenterX + 80, floorY + 15, 230, 24, 0x0288D1)
            .setDepth(10)
            .setInteractive({ useHandCursor: true })
            .setStrokeStyle(2, 0xFFFFFF);

        this.frozenFunStartTxt = this.add.text(roomCenterX + 80, floorY + 15, '❄ START FROZEN FUN (30s) ❄', {
            fontSize: '7px', fontFamily: '"Press Start 2P", monospace', fill: '#FFFFFF'
        }).setOrigin(0.5).setDepth(11);

        this.frozenFunStartBtn.on('pointerdown', () => this.startFrozenFunGame());

        // In-Game Snowgie HUD Banner
        this.frozenHudBanner = this.add.rectangle(roomCenterX + 80, floorY - 145, 280, 24, 0x051B2E, 0.92)
            .setDepth(10)
            .setStrokeStyle(1, 0x00E5FF)
            .setVisible(false);

        this.frozenHudText = this.add.text(roomCenterX + 80, floorY - 145, '', {
            fontSize: '7px', fontFamily: '"Press Start 2P", monospace', fill: '#A0E8FF'
        }).setOrigin(0.5).setDepth(11).setVisible(false);
    }

    createFrostedWindow(x, y) {
        this.add.rectangle(x, y, 70, 70, 0x221307).setDepth(3).setStrokeStyle(2, 0x70D6FF);
        this.add.rectangle(x, y, 64, 64, 0x1B3554).setDepth(4);
        // Distant snowy North Mountain
        const mtn = this.add.graphics().setDepth(5);
        mtn.fillStyle(0xFFFFFF, 1);
        mtn.fillTriangle(x, y - 24, x - 26, y + 26, x + 26, y + 26);
        mtn.fillStyle(0x70D6FF, 0.6);
        mtn.fillTriangle(x, y - 24, x, y + 26, x + 26, y + 26);
    }

    startFrozenFunGame() {
        if (this.snowgieGameActive) return;
        this.playSfx('fanfare');

        this.snowgieGameActive = true;
        this.snowgiesTagged = 0;
        this.snowgieGameTimer = 30;
        this.sculptureStage = 1;
        this.iceSculptureSprite.setTexture('fth_ice_sculpture_1');
        this.sculptureLabel.setText('ICE SCULPTURE: STAGE 1/5');

        this.frozenFunStartBtn.setVisible(false);
        this.frozenFunStartTxt.setVisible(false);
        this.frozenHudBanner.setVisible(true);
        this.frozenHudText.setVisible(true);

        this.updateFrozenHud();

        this.showSpeech("OLAF", "❄ 'LOOK OUT! The Snowgies are popping up everywhere! Catch 'em with Ice Magic!' ❄", 3200);

        // Countdown timer event (1 second)
        this.snowgieCountdownEvent = this.time.addEvent({
            delay: 1000,
            repeat: 29,
            callback: () => {
                this.snowgieGameTimer--;
                this.updateFrozenHud();
                if (this.snowgieGameTimer <= 0) {
                    this.endFrozenFunGame();
                }
            }
        });

        // Spawn Snowgies event (every 1.2 to 1.8 seconds)
        this.spawnSnowgieWave();
    }

    updateFrozenHud() {
        const prog = getOceaneerProgress();
        const best = Math.max(prog.sommerhusSnowgies || 0, this.snowgiesTagged);
        this.frozenHudText.setText(
            `TIME: ${this.snowgieGameTimer}s | TAGGED: ${this.snowgiesTagged} | BEST: ${best}`
        );
    }

    spawnSnowgieWave() {
        if (!this.snowgieGameActive) return;

        // Pick a random spot
        const spot = Phaser.Utils.Array.GetRandom(this.snowgieSpots);
        const snowgie = this.add.image(spot.x, spot.y + 15, 'fth_snowgie')
            .setDepth(8)
            .setInteractive({ useHandCursor: true });

        this.activeSnowgies.push(snowgie);

        // Pop up animation
        this.tweens.add({
            targets: snowgie,
            y: spot.y - 10,
            duration: 180,
            ease: 'Back.easeOut',
            onComplete: () => {
                // Bobbing while waiting
                this.tweens.add({
                    targets: snowgie,
                    y: spot.y - 14,
                    duration: 250,
                    yoyo: true,
                    repeat: 3
                });
            }
        });

        snowgie.on('pointerdown', () => this.tagSnowgie(snowgie));

        // Auto duck down after 1.8s
        this.time.delayedCall(1800, () => {
            if (snowgie && snowgie.active) {
                this.tweens.add({
                    targets: snowgie,
                    y: spot.y + 15,
                    duration: 160,
                    ease: 'Power1',
                    onComplete: () => {
                        this.removeSnowgie(snowgie);
                    }
                });
            }
        });

        // Schedule next spawn
        const nextDelay = Phaser.Math.Between(1100, 1700);
        this.snowgieSpawnEvent = this.time.delayedCall(nextDelay, () => {
            this.spawnSnowgieWave();
        });
    }

    tagSnowgie(snowgie) {
        if (!this.snowgieGameActive || !snowgie || !snowgie.active) return;
        this.playSfx('snowball');

        this.snowgiesTagged++;
        this.updateFrozenHud();

        // Elsa's Ice Magic blast projectile flying from player to Snowgie
        const proj = this.add.image(this.player.x, this.player.y - 16, 'fth_ice_magic').setDepth(15);
        this.tweens.add({
            targets: proj,
            x: snowgie.x,
            y: snowgie.y,
            duration: 140,
            onComplete: () => {
                proj.destroy();
                this.playSfx('magic');
            }
        });

        // Snowgie spins happily in ice sparkle burst
        this.tweens.add({
            targets: snowgie,
            angle: 360,
            scaleX: 1.3,
            scaleY: 1.3,
            alpha: 0,
            duration: 240,
            onComplete: () => {
                this.removeSnowgie(snowgie);
            }
        });

        // Shimmer shard flying into central sculpture
        const shard = this.add.circle(snowgie.x, snowgie.y, 4, 0x00E5FF).setDepth(15);
        this.tweens.add({
            targets: shard,
            x: this.sculptureX,
            y: this.sculptureY,
            duration: 300,
            onComplete: () => {
                shard.destroy();
                this.checkSculptureUpgrade();
            }
        });
    }

    removeSnowgie(snowgie) {
        const idx = this.activeSnowgies.indexOf(snowgie);
        if (idx !== -1) {
            this.activeSnowgies.splice(idx, 1);
        }
        if (snowgie && snowgie.active) {
            snowgie.destroy();
        }
    }

    checkSculptureUpgrade() {
        let newStage = 1;
        if (this.snowgiesTagged >= 16) newStage = 5;
        else if (this.snowgiesTagged >= 12) newStage = 4;
        else if (this.snowgiesTagged >= 8) newStage = 3;
        else if (this.snowgiesTagged >= 4) newStage = 2;

        if (newStage !== this.sculptureStage) {
            this.sculptureStage = newStage;
            this.playSfx('fanfare');
            this.iceSculptureSprite.setTexture('fth_ice_sculpture_' + newStage);
            this.sculptureLabel.setText(`ICE SCULPTURE: STAGE ${newStage}/5`);

            // Flash & grow burst
            this.tweens.add({
                targets: this.iceSculptureSprite,
                scaleX: 1.5,
                scaleY: 1.5,
                yoyo: true,
                duration: 200
            });
        }
    }

    endFrozenFunGame() {
        this.playSfx('fanfare');
        this.snowgieGameActive = false;

        if (this.snowgieCountdownEvent) this.snowgieCountdownEvent.remove();
        if (this.snowgieSpawnEvent) this.snowgieSpawnEvent.remove();

        // Clear active snowgies
        this.activeSnowgies.forEach(s => { if (s && s.active) s.destroy(); });
        this.activeSnowgies = [];

        // Save high score & badge
        const prog = getOceaneerProgress();
        const best = Math.max(prog.sommerhusSnowgies || 0, this.snowgiesTagged);
        saveOceaneerProgress({
            sommerhusSnowgies: best,
            fairytaleBadge: true
        });
        this.updateHud();

        this.frozenHudBanner.setVisible(false);
        this.frozenHudText.setVisible(false);
        this.frozenFunStartBtn.setVisible(true);
        this.frozenFunStartTxt.setText('❄ PLAY AGAIN (BEST: ' + best + ') ❄').setVisible(true);

        this.showSpeech(
            "OLAF",
            `✨ 'LOOK AT THAT GORGEOUS ICE SCULPTURE!' ✨\nYou tagged ${this.snowgiesTagged} Snowgies! You're an Ice Master!`,
            4500
        );
    }

    interactWithOlaf() {
        this.playSfx('chirp');
        this.tweens.add({
            targets: this.olafSprite,
            angle: 15,
            yoyo: true,
            duration: 150,
            repeat: 2
        });

        const quotes = [
            "OLAF: 'Hi everyone! I'm Olaf and I like warm hugs!'",
            "OLAF: 'Some people are worth melting for!'",
            "OLAF: 'Winter's a good time to stay in and cuddle!'",
            "OLAF: 'Tap [START FROZEN FUN] to play with the Snowgies!'"
        ];
        this.showSpeech("OLAF", Phaser.Utils.Array.GetRandom(quotes), 3200);
    }

    // =========================================================================
    // ROOM ARCHWAYS (SEAMLESS 2.5D WALKING EXPLORATION)
    // =========================================================================
    createArchways(floorY) {
        // Archway 1: Between Rapunzel (Studio) & Belle (Library) at x = 900
        const arch1 = this.add.rectangle(900, floorY - 90, 20, 180, 0x1A0924).setDepth(4).setStrokeStyle(3, 0xFFD700);
        this.add.text(870, floorY - 185, '◄ RAPUNZEL', {
            fontSize: '6px', fontFamily: '"Press Start 2P", monospace', fill: '#FFD700', backgroundColor: '#000000', padding: 2
        }).setOrigin(0.5).setDepth(5);
        this.add.text(930, floorY - 185, 'BELLE ►', {
            fontSize: '6px', fontFamily: '"Press Start 2P", monospace', fill: '#FF88A8', backgroundColor: '#000000', padding: 2
        }).setOrigin(0.5).setDepth(5);

        // Archway 2: Between Belle (Library) & Sommerhus at x = 1800
        const arch2 = this.add.rectangle(1800, floorY - 90, 20, 180, 0x181008).setDepth(4).setStrokeStyle(3, 0x00E5FF);
        this.add.text(1770, floorY - 185, '◄ BELLE', {
            fontSize: '6px', fontFamily: '"Press Start 2P", monospace', fill: '#FF88A8', backgroundColor: '#000000', padding: 2
        }).setOrigin(0.5).setDepth(5);
        this.add.text(1830, floorY - 185, 'SOMMERHUS ►', {
            fontSize: '6px', fontFamily: '"Press Start 2P", monospace', fill: '#00E5FF', backgroundColor: '#000000', padding: 2
        }).setOrigin(0.5).setDepth(5);
    }

    // =========================================================================
    // PLAYER CREATION & MOVEMENT
    // =========================================================================
    createPlayer() {
        const startX = 450; // Start inside Rapunzel's Studio
        const startY = this.groundY;

        // Player Shadow
        this.playerShadow = this.add.ellipse(startX, startY + 16, 24, 8, 0x000000, 0.45).setDepth(Math.round(startY) - 1);

        // Player Sprite
        this.player = this.physics.add.sprite(startX, startY, this.charData.idleKey).setDepth(Math.round(startY));
        this.player.body.allowGravity = false;
        this.player.body.setSize(22, 16);
        this.player.body.setOffset(5, this.charData.bodyOffsetY);

        // Register walk animation if not exists
        if (!this.anims.exists(this.charData.walkAnim)) {
            const prefix = this.charData.charId === 'riley' ? 'riley_walk_' : 'amelia_walk_';
            if (this.textures.exists(prefix + '0')) {
                this.anims.create({
                    key: this.charData.walkAnim,
                    frames: [
                        { key: prefix + '0' },
                        { key: prefix + '1' },
                        { key: prefix + '2' },
                        { key: prefix + '1' }
                    ],
                    frameRate: 8,
                    repeat: -1
                });
            }
        }
    }

    // =========================================================================
    // CAPCOM-STYLE SPEECH / DIALOGUE BOX
    // =========================================================================
    createSpeechBox() {
        this.speechContainer = this.add.container(0, 0).setScrollFactor(0).setDepth(2500).setVisible(false);
        const W = this.scale.width;
        const boxW = Math.min(480, W - 40);
        const boxH = 50;
        const bx = W / 2;
        const by = 85;

        const bg = this.add.rectangle(bx, by, boxW, boxH, 0x070414, 0.95).setStrokeStyle(2, 0xF8B800);
        this.speechSpeakerText = this.add.text(bx - boxW / 2 + 14, by - 16, '', {
            fontSize: '7px', fontFamily: '"Press Start 2P", monospace', fill: '#FFD700'
        });
        this.speechContentText = this.add.text(bx - boxW / 2 + 14, by - 2, '', {
            fontSize: '7px', fontFamily: '"Press Start 2P", monospace', fill: '#FFFFFF', wordWrap: { width: boxW - 28 }
        });

        this.speechContainer.add([bg, this.speechSpeakerText, this.speechContentText]);
    }

    showSpeech(speaker, text, duration = 3500) {
        if (!this.speechContainer) return;
        this.speechSpeakerText.setText(speaker);
        this.speechContentText.setText(text);
        this.speechContainer.setVisible(true);

        if (this.speechDismissTimer) this.speechDismissTimer.remove();
        this.speechDismissTimer = this.time.delayedCall(duration, () => {
            this.speechContainer.setVisible(false);
        });
    }

    // =========================================================================
    // TOP NAVIGATION UI TABS & HUB EXIT BUTTON
    // =========================================================================
    createTopNavigationUI() {
        const W = this.scale.width;

        // Top Header Bar Background
        this.add.rectangle(W / 2, 22, W, 44, 0x050410, 0.95)
            .setScrollFactor(0).setDepth(1900).setStrokeStyle(1, 0xFFD700);

        // 3 Princess Room Tabs: Rapunzel, Belle, Sommerhus
        this.tabButtons = [];
        const tabsData = [
            { id: 0, label: "1. RAPUNZEL ☀", targetX: 450 },
            { id: 1, label: "2. BELLE 🌹", targetX: 1350 },
            { id: 2, label: "3. SOMMERHUS ❄", targetX: 2250 }
        ];

        const tabSpacing = Math.min(150, Math.floor((W - 180) / 3));
        const startTabX = Math.round(W * 0.22);

        tabsData.forEach((tabInfo, idx) => {
            const tx = startTabX + idx * tabSpacing;
            const btnBg = this.add.rectangle(tx, 22, tabSpacing - 10, 24, 0x220B38)
                .setScrollFactor(0).setDepth(2000).setInteractive({ useHandCursor: true })
                .setStrokeStyle(1, 0xFFD700);

            const btnTxt = this.add.text(tx, 22, tabInfo.label, {
                fontSize: '7px', fontFamily: '"Press Start 2P", monospace', fill: '#FFD700'
            }).setOrigin(0.5).setScrollFactor(0).setDepth(2001);

            btnBg.on('pointerdown', () => {
                this.playSfx('blip');
                this.switchToRoom(tabInfo.id);
            });

            this.tabButtons.push({ bg: btnBg, txt: btnTxt, info: tabInfo });
        });

        // Top-Right Standalone [ ◄ OCEANEER HUB ] Exit Button
        const exitX = W - 78;
        const exitBg = this.add.rectangle(exitX, 22, 130, 24, 0x8E1E2D)
            .setScrollFactor(0).setDepth(2000).setInteractive({ useHandCursor: true })
            .setStrokeStyle(2, 0xFFD700);

        const exitTxt = this.add.text(exitX, 22, '◄ OCEANEER HUB', {
            fontSize: '7px', fontFamily: '"Press Start 2P", monospace', fill: '#FFFFFF'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(2001);

        exitBg.on('pointerdown', () => this.returnToHub());
        exitBg.on('pointerover', () => exitBg.setFillStyle(0xB8263A));
        exitBg.on('pointerout', () => exitBg.setFillStyle(0x8E1E2D));
    }

    updateTabHighlights() {
        this.tabButtons.forEach(tab => {
            const isActive = tab.info.id === this.currentRoom;
            tab.bg.setFillStyle(isActive ? 0xFFD700 : 0x220B38);
            tab.bg.setStrokeStyle(isActive ? 2 : 1, isActive ? 0xFFFFFF : 0xFFD700);
            tab.txt.setFill(isActive ? '#000000' : '#FFD700');
        });
    }

    switchToRoom(roomId) {
        this.currentRoom = roomId;
        this.updateTabHighlights();
        const targets = [450, 1350, 2250];
        const tx = targets[roomId];

        this.player.x = tx;
        this.playerGroundY = this.groundY;
        this.player.y = this.groundY;
        this.playerShadow.x = tx;
        this.playerShadow.y = this.groundY + 16;

        this.cameras.main.pan(tx, this.cameras.main.centerY, 400, 'Sine.easeInOut');
    }

    // =========================================================================
    // BOTTOM STATUS HUD BAR
    // =========================================================================
    createBottomStatusHUD() {
        const W = this.scale.width;
        const H = this.scale.height;

        // Bottom HUD Strip
        this.add.rectangle(W / 2, H - 14, W, 28, 0x050410, 0.95)
            .setScrollFactor(0).setDepth(2000).setStrokeStyle(1, 0xFFD700);

        // Progress Text
        this.hudProgressText = this.add.text(20, H - 14, '', {
            fontSize: '6px', fontFamily: '"Press Start 2P", monospace', fill: '#FFFFFF'
        }).setOrigin(0, 0.5).setScrollFactor(0).setDepth(2001);

        // Fairytale Hall Crown Badge Indicator
        this.badgeIndicator = this.add.text(W - 20, H - 14, '', {
            fontSize: '6px', fontFamily: '"Press Start 2P", monospace', fill: '#FFD700'
        }).setOrigin(1, 0.5).setScrollFactor(0).setDepth(2001);

        this.updateHud();
    }

    updateHud() {
        const prog = getOceaneerProgress();
        const charName = this.charData ? this.charData.charName : 'HERO';
        const lanterns = prog.rapunzelLanterns || 0;
        const stories = prog.belleStoriesCompleted || 0;
        const snowgies = prog.sommerhusSnowgies || 0;
        const hasBadge = prog.fairytaleBadge || (lanterns > 0 || stories > 0 || snowgies > 0);

        if (this.hudProgressText) {
            this.hudProgressText.setText(
                `HERO: ${charName} | LANTERNS: ${lanterns} | STORIES: ${stories} | SNOWGIES: ${snowgies}`
            );
        }

        if (this.badgeIndicator) {
            if (hasBadge) {
                this.badgeIndicator.setText('👑 FAIRYTALE BADGE: UNLOCKED');
                this.badgeIndicator.setFill('#FFD700');
            } else {
                this.badgeIndicator.setText('🔒 FAIRYTALE BADGE: LOCKED');
                this.badgeIndicator.setFill('#888888');
            }
        }
    }

    // =========================================================================
    // MOBILE ON-SCREEN TOUCH CONTROLS
    // =========================================================================
    createMobileControls() {
        const H = this.scale.height;
        const W = this.scale.width;
        const dpadY = H - 55;

        // Virtual D-pad buttons: Left and Right
        const leftBtn = this.add.rectangle(40, dpadY, 44, 34, 0x000000, 0.5)
            .setScrollFactor(0).setDepth(2100).setInteractive({ useHandCursor: true }).setStrokeStyle(1, 0xFFD700);
        this.add.text(40, dpadY, '◄', { fontSize: '12px', fill: '#FFD700' }).setOrigin(0.5).setScrollFactor(0).setDepth(2101);

        const rightBtn = this.add.rectangle(95, dpadY, 44, 34, 0x000000, 0.5)
            .setScrollFactor(0).setDepth(2100).setInteractive({ useHandCursor: true }).setStrokeStyle(1, 0xFFD700);
        this.add.text(95, dpadY, '►', { fontSize: '12px', fill: '#FFD700' }).setOrigin(0.5).setScrollFactor(0).setDepth(2101);

        leftBtn.on('pointerdown', () => { this.mobileInput.left = true; });
        leftBtn.on('pointerup', () => { this.mobileInput.left = false; });
        leftBtn.on('pointerout', () => { this.mobileInput.left = false; });

        rightBtn.on('pointerdown', () => { this.mobileInput.right = true; });
        rightBtn.on('pointerup', () => { this.mobileInput.right = false; });
        rightBtn.on('pointerout', () => { this.mobileInput.right = false; });

        // Virtual Jump button
        const jumpBtn = this.add.rectangle(W - 45, dpadY, 48, 34, 0x000000, 0.5)
            .setScrollFactor(0).setDepth(2100).setInteractive({ useHandCursor: true }).setStrokeStyle(1, 0xFFD700);
        this.add.text(W - 45, dpadY, 'JUMP', { fontSize: '7px', fontFamily: '"Press Start 2P"', fill: '#FFD700' })
            .setOrigin(0.5).setScrollFactor(0).setDepth(2101);

        jumpBtn.on('pointerdown', () => this.tryJump());
    }

    // =========================================================================
    // KEYBOARD CONTROLS & RESETS
    // =========================================================================
    setupKeyboardControls() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keysWASD = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
            esc: Phaser.Input.Keyboard.KeyCodes.ESC,
            one: Phaser.Input.Keyboard.KeyCodes.ONE,
            two: Phaser.Input.Keyboard.KeyCodes.TWO,
            three: Phaser.Input.Keyboard.KeyCodes.THREE
        });

        // 1, 2, 3 quick room switches
        this.input.keyboard.on('keydown-ONE', () => this.switchToRoom(0));
        this.input.keyboard.on('keydown-TWO', () => this.switchToRoom(1));
        this.input.keyboard.on('keydown-THREE', () => this.switchToRoom(2));
        this.input.keyboard.on('keydown-ESC', () => this.returnToHub());

        // DOM input safety resets to prevent stuck keys
        const resetKeys = () => {
            if (this.cursors) {
                if (this.cursors.left) this.cursors.left.isDown = false;
                if (this.cursors.right) this.cursors.right.isDown = false;
                if (this.cursors.up) this.cursors.up.isDown = false;
                if (this.cursors.down) this.cursors.down.isDown = false;
            }
            if (this.keysWASD) {
                if (this.keysWASD.left) this.keysWASD.left.isDown = false;
                if (this.keysWASD.right) this.keysWASD.right.isDown = false;
                if (this.keysWASD.up) this.keysWASD.up.isDown = false;
                if (this.keysWASD.down) this.keysWASD.down.isDown = false;
            }
            this.mobileInput = { left: false, right: false, up: false, down: false, jump: false, action: false };
        };

        window.addEventListener('blur', resetKeys);
        window.addEventListener('focus', resetKeys);
        const onVisChange = () => { if (document.hidden) resetKeys(); };
        document.addEventListener('visibilitychange', onVisChange);

        this.events.once('shutdown', () => {
            window.removeEventListener('blur', resetKeys);
            window.removeEventListener('focus', resetKeys);
            document.removeEventListener('visibilitychange', onVisChange);
            if (this.snowgieCountdownEvent) this.snowgieCountdownEvent.remove();
            if (this.snowgieSpawnEvent) this.snowgieSpawnEvent.remove();
            if (this.speechDismissTimer) this.speechDismissTimer.remove();
        });
    }

    tryJump() {
        if (this.isJumping) return;
        this.isJumping = true;
        this.jumpV = 280;
        this.jumpZ = 1;
        this.playSfx('snowball');
    }

    // =========================================================================
    // UPDATE LOOP
    // =========================================================================
    update(time, delta) {
        if (this.isExiting) return;

        const dt = delta * 0.001;

        // Keyboard & mobile input checks
        const moveLeft = (this.cursors && this.cursors.left.isDown) || (this.keysWASD && this.keysWASD.left.isDown) || this.mobileInput.left;
        const moveRight = (this.cursors && this.cursors.right.isDown) || (this.keysWASD && this.keysWASD.right.isDown) || this.mobileInput.right;
        const moveUp = (this.cursors && this.cursors.up.isDown) || (this.keysWASD && this.keysWASD.up.isDown) || this.mobileInput.up;
        const moveDown = (this.cursors && this.cursors.down.isDown) || (this.keysWASD && this.keysWASD.down.isDown) || this.mobileInput.down;
        const jumpPressed = (this.cursors && this.cursors.space.isDown) || (this.keysWASD && this.keysWASD.space.isDown) || this.mobileInput.jump;

        if (jumpPressed) {
            this.tryJump();
            // In Sommerhus mini-game: tag nearest active Snowgie
            if (this.snowgieGameActive && this.activeSnowgies.length > 0) {
                this.tagSnowgie(this.activeSnowgies[0]);
            }
        }

        // Horizontal movement
        let vx = 0;
        if (moveLeft) {
            vx = -this.playerSpeed;
            this.player.setFlipX(true);
        } else if (moveRight) {
            vx = this.playerSpeed;
            this.player.setFlipX(false);
        }
        this.player.x = Phaser.Math.Clamp(this.player.x + vx * dt, 40, this.roomW - 40);

        // Slight vertical depth movement in 2.5D floor zone
        let vy = 0;
        if (moveUp) vy = -this.playerSpeed * 0.45;
        else if (moveDown) vy = this.playerSpeed * 0.45;

        const minY = this.floorY + 15;
        const maxY = this.roomH - 22;
        this.playerGroundY = Phaser.Math.Clamp(this.playerGroundY + vy * dt, minY, maxY);

        // Jump physics
        if (this.isJumping) {
            this.jumpZ += this.jumpV * dt;
            this.jumpV -= 800 * dt;
            if (this.jumpZ <= 0) {
                this.jumpZ = 0;
                this.jumpV = 0;
                this.isJumping = false;
            }
        }

        this.player.y = this.playerGroundY - this.jumpZ;
        this.player.setDepth(Math.round(this.playerGroundY));

        // Player Shadow position
        this.playerShadow.x = this.player.x;
        this.playerShadow.y = this.playerGroundY + 16;
        this.playerShadow.setDepth(Math.round(this.playerGroundY) - 1);

        // Walk Animation
        if (vx !== 0 || vy !== 0) {
            if (this.anims.exists(this.charData.walkAnim)) {
                this.player.anims.play(this.charData.walkAnim, true);
            }
        } else {
            this.player.anims.stop();
            this.player.setTexture(this.charData.idleKey);
        }

        // Automatic room tracking based on walking position
        let newRoom = 0;
        if (this.player.x < 900) newRoom = 0;
        else if (this.player.x < 1800) newRoom = 1;
        else newRoom = 2;

        if (newRoom !== this.currentRoom) {
            this.currentRoom = newRoom;
            this.updateTabHighlights();
        }
    }

    // =========================================================================
    // RETURN TO OCEANEER HUB
    // =========================================================================
    returnToHub() {
        if (this.isExiting) return;
        this.isExiting = true;

        if (this.snowgieCountdownEvent) this.snowgieCountdownEvent.remove();
        if (this.snowgieSpawnEvent) this.snowgieSpawnEvent.remove();

        if (this.oceaneerHub && this.oceaneerHub.scene) {
            this.oceaneerHub.scene.setVisible(true);
            this.oceaneerHub.scene.resume('OceaneerClubScene');
        }
        this.scene.stop('FairytaleHallWingScene');
    }
}
