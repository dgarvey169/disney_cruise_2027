// =========================================================================
// WRECK-IT RALPH SLIDE WING - DISNEY'S OCEANEER CLUB (DECK 2)
// Disney Destiny 8-bit NES/Capcom Phaser 3 Scene (Feature #45)
// =========================================================================

class RalphSlideWingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'RalphSlideWingScene' });
    }

    init(data) {
        this.oceaneerHub = data ? data.oceaneerHub : null;
        this.gameScene = (data && data.gameScene) ? data.gameScene : (this.oceaneerHub ? this.oceaneerHub.gameScene : null);

        // Active character (Riley or Amelia) from shared oceaneer club helper
        this.charData = (typeof getActiveCharacterData === 'function')
            ? getActiveCharacterData(this.gameScene)
            : {
                charId: (this.gameScene && this.gameScene.selectedCharacter === 'riley') ? 'riley' : 'amelia',
                charName: (this.gameScene && this.gameScene.selectedCharacter === 'riley') ? 'RILEY' : 'AMELIA',
                displayName: (this.gameScene && this.gameScene.selectedCharacter === 'riley') ? 'Riley' : 'Amelia',
                idleKey: (this.gameScene && this.gameScene.selectedCharacter === 'riley') ? 'riley_idle' : 'amelia_idle',
                walkAnim: (this.gameScene && this.gameScene.selectedCharacter === 'riley') ? 'riley_walk' : 'amelia_walk',
                idleAnim: (this.gameScene && this.gameScene.selectedCharacter === 'riley') ? 'riley_idle' : 'amelia_idle',
                jumpKey: (this.gameScene && this.gameScene.selectedCharacter === 'riley') ? 'riley_jump' : 'amelia_jump',
                bodyOffsetY: (this.gameScene && this.gameScene.selectedCharacter === 'riley') ? 32 : 24
            };

        // Scene execution flags
        this.isExiting = false;
        this.currentMode = 'ROOM'; // 'ROOM' or 'SLIDE'

        // 2.5D Room Exploration state
        this.player = null;
        this.playerShadow = null;
        this.groundY = 440;
        this.jumpZ = 0;
        this.jumpV = 0;
        this.isJumping = false;
        this.playerSpeed = 180;
        this.facing = 'right';

        // Proximity & interaction state
        this.nearSlide = false;
        this.nearVanellope = false;
        this.nearRalph = false;
        this.nearStairs = false;
        this.nearAlcove = false;
        this.nearExit = false;
        this.activeStation = null;

        // Slide Run Mini-Game state
        this.slideTimeLeft = 25.0;
        this.score = 0;
        this.streak = 0;
        this.candiesCollected = 0;
        this.macaronsCollected = 0;
        this.jawbreakersHit = 0;
        this.boostTimer = 0;
        this.slideLane = 1; // 0: Left, 1: Center, 2: Right
        this.laneX = [-110, 0, 110];
        this.slideItems = [];
        this.nextSpawnTime = 0;
        this.isRunFinished = false;

        // Completion modal menu
        this.completionMenuOpen = false;
        this.menuSelectionIndex = 0;
        this.menuReadyTime = 0;

        // Mobile touch input states
        this.mobileInput = {
            left: false,
            right: false,
            up: false,
            down: false,
            jump: false,
            action: false
        };
    }

    create() {
        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.init) {
            retroArcadeAudio.init();
        }

        // Hide and sleep hub scene if present while visiting this wing
        if (this.oceaneerHub && this.oceaneerHub.scene) {
            this.oceaneerHub.scene.setVisible(false);
            if (this.oceaneerHub.scene.isActive('OceaneerClubScene')) {
                this.oceaneerHub.scene.sleep('OceaneerClubScene');
            }
        }

        const W = this.scale.width;
        const H = this.scale.height;

        this.roomW = Math.max(1400, W);
        this.roomH = Math.max(540, H);

        const floorH = Math.max(130, Math.round(this.roomH * 0.22));
        const floorY = this.roomH - floorH;
        this.floorY = floorY;
        this.floorH = floorH;
        this.groundY = floorY + 28;

        this.physics.world.setBounds(0, 0, this.roomW, this.roomH);

        // Generate retro 8-bit procedural graphics textures
        this.createTextures();
        this.ensureCharacterAnimations();

        // 1. Build Room Environment (Deck 2 Wreck-It Ralph Wing)
        this.createRoomEnvironment();

        // 2. Build Interactive Stations & Statues (Vanellope, Ralph, Slide, Stairs, Alcoves)
        this.createRoomStations();

        // 3. Build Player Avatar in Room
        this.createPlayer();

        // 4. Build Capcom Speech Bubble System
        this.createSpeechBubbleSystem();

        // 5. Build Slide Mini-Game System (chute, lanes, kart, HUD)
        this.createSlideElements();

        // 6. Setup Desktop and Mobile Controls
        this.setupControls();

        // 7. Setup Standalone Fixed HUD (Hub exit, slide launcher, room title)
        this.setupRoomHUD();

        // Initial camera bounds and follow
        this.cameras.main.setBounds(0, 0, this.roomW, this.roomH);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.fadeIn(400, 20, 10, 25);
    }

    // =========================================================================
    // TEXTURE GENERATION (RETRO 8-BIT / CAPCOM PROCEDURAL TEXTURES)
    // =========================================================================

    createTextures() {
        // Candy-cane wall pattern (Deep chocolate/magenta with pink diagonal candy stripes & sprinkles)
        if (!this.textures.exists('ralph_candy_wall')) {
            const g = this.add.graphics();
            g.fillStyle(0x240A18, 1);
            g.fillRect(0, 0, 64, 64);
            // Diagonal candy stripes
            g.fillStyle(0x42122D, 1);
            for (let i = -64; i < 128; i += 16) {
                g.beginPath();
                g.moveTo(i, 0);
                g.lineTo(i + 16, 0);
                g.lineTo(i + 80, 64);
                g.lineTo(i + 64, 64);
                g.closePath();
                g.fillPath();
            }
            // Sugar crystals
            g.fillStyle(0xFFD6E8, 0.85);
            g.fillRect(8, 12, 3, 3);
            g.fillRect(40, 24, 3, 3);
            g.fillRect(20, 48, 3, 3);
            g.fillRect(52, 52, 3, 3);
            // Gold candy sprinkles
            g.fillStyle(0xFFD700, 0.9);
            g.fillRect(28, 8, 3, 2);
            g.fillRect(56, 16, 2, 3);
            g.fillRect(12, 36, 3, 2);
            g.fillRect(36, 44, 2, 3);
            g.generateTexture('ralph_candy_wall', 64, 64);
            g.destroy();
        }

        // Checkerboard floor tile (Alternating sweet vanilla cream and strawberry candy swirl)
        if (!this.textures.exists('ralph_floor_tile')) {
            const g = this.add.graphics();
            // Cream tile (Top-Left and Bottom-Right)
            g.fillStyle(0xFFF3EB, 1);
            g.fillRect(0, 0, 32, 32);
            g.fillRect(32, 32, 32, 32);
            // Strawberry tile (Top-Right and Bottom-Left)
            g.fillStyle(0xD81B43, 1);
            g.fillRect(32, 0, 32, 32);
            g.fillRect(0, 32, 32, 32);
            // Border bevels
            g.lineStyle(1, 0xAA0E30, 0.6);
            g.strokeRect(32, 0, 32, 32);
            g.strokeRect(0, 32, 32, 32);
            g.lineStyle(1, 0xFFFFFF, 0.6);
            g.strokeRect(0, 0, 32, 32);
            g.strokeRect(32, 32, 32, 32);
            // Candy swirl on red tiles
            g.fillStyle(0xFFFFFF, 0.7);
            g.fillCircle(48, 16, 5);
            g.fillCircle(16, 48, 5);
            g.generateTexture('ralph_floor_tile', 64, 64);
            g.destroy();
        }

        // Spiral Peppermint Slide graphic (Descending from Deck 3 down to Deck 2 chute)
        if (!this.textures.exists('ralph_spiral_slide_bg')) {
            const g = this.add.graphics();
            const sw = 180;
            const sh = 280;

            // Center support column (Candy Cane Pillar)
            g.fillStyle(0xFFFFFF, 1);
            g.fillRect(sw / 2 - 12, 10, 24, sh - 20);
            for (let y = 10; y < sh - 20; y += 18) {
                g.fillStyle(0xE60026, 1);
                g.beginPath();
                g.moveTo(sw / 2 - 12, y);
                g.lineTo(sw / 2 + 12, y + 10);
                g.lineTo(sw / 2 + 12, y + 18);
                g.lineTo(sw / 2 - 12, y + 8);
                g.closePath();
                g.fillPath();
            }

            // Helical slide loops spiraling down
            const drawSlideLoop = (cy, w, h, angleTilt) => {
                // Outer red/white striped helical tube
                for (let step = 0; step < 7; step++) {
                    const col = (step % 2 === 0) ? 0xE60026 : 0xFFFFFF;
                    g.fillStyle(col, 1);
                    g.fillEllipse(sw / 2 + (step - 3) * (w / 7), cy + (step - 3) * angleTilt, (w / 6) + 4, h);
                }
                // Glass acrylic tube highlight
                g.lineStyle(3, 0xA0E8FF, 0.7);
                g.strokeEllipse(sw / 2, cy, w, h);
            };

            // Loop 1 (Top loop near Deck 3 mezzanine)
            drawSlideLoop(50, 130, 38, 2);
            // Loop 2 (Middle loop)
            drawSlideLoop(120, 145, 42, -2);
            // Loop 3 (Lower loop)
            drawSlideLoop(190, 155, 46, 2);

            // Flared slide exit chute at Deck 2 bottom
            g.fillStyle(0xE60026, 1);
            g.fillRoundedRect(16, sh - 75, 110, 68, 14);
            g.lineStyle(4, 0xFFFFFF, 1);
            g.strokeRoundedRect(16, sh - 75, 110, 68, 14);

            // Flared chute lip / mouth
            g.fillStyle(0x3B050B, 1);
            g.fillEllipse(50, sh - 40, 44, 52);
            g.lineStyle(4, 0xFFD700, 1);
            g.strokeEllipse(50, sh - 40, 44, 52);

            // Splash candy exit banner
            g.fillStyle(0xFFD700, 1);
            g.fillRect(30, sh - 18, 90, 10);
            g.fillStyle(0x000000, 1);
            g.fillRect(34, sh - 16, 82, 6);

            g.generateTexture('ralph_spiral_slide_bg', sw, sh);
            g.destroy();
        }

        // Grand Staircase from Deck 3 to Deck 2
        if (!this.textures.exists('ralph_staircase_bg')) {
            const g = this.add.graphics();
            const w = 150;
            const h = 240;

            // Stair risers and treads descending right to left
            const steps = 8;
            const stepW = Math.round(w / steps);
            const stepH = Math.round((h - 50) / steps);

            for (let i = 0; i < steps; i++) {
                const sx = i * stepW;
                const sy = 45 + i * stepH;
                const swidth = w - sx;
                const sheight = h - sy;

                // Cherry wood structure
                g.fillStyle(0x421217, 1);
                g.fillRect(sx, sy, swidth, sheight);

                // Red velvet carpet runner
                g.fillStyle(0xC8102E, 1);
                g.fillRect(sx + 6, sy, swidth - 12, sheight);

                // Polished brass stair nosing
                g.fillStyle(0xFFD700, 1);
                g.fillRect(sx, sy, swidth, 4);
            }

            // Polished brass handrail and balusters
            g.lineStyle(5, 0xF8B800, 1);
            g.lineBetween(10, 35, w - 10, h - 30);
            for (let b = 15; b < w - 10; b += 22) {
                const by = 35 + (b - 10) * ((h - 65) / (w - 20));
                g.fillStyle(0xFFD700, 1);
                g.fillRect(b, by, 4, 30);
            }

            g.generateTexture('ralph_staircase_bg', w, h);
            g.destroy();
        }

        // Pixel art of Wreck-It Ralph Statue
        if (!this.textures.exists('ralph_statue_tex')) {
            const g = this.add.graphics();
            const w = 64;
            const h = 88;

            // Stone / Brick Pedestal at base
            g.fillStyle(0x8B2500, 1);
            g.fillRect(8, h - 22, 48, 22);
            g.fillStyle(0xD84A20, 1);
            for (let r = 0; r < 3; r++) {
                const ry = h - 20 + r * 7;
                for (let c = 0; c < 4; c++) {
                    const cx = 10 + c * 11 + (r % 2 === 1 ? 5 : 0);
                    if (cx + 9 <= 54) g.fillRect(cx, ry, 9, 5);
                }
            }
            // Brass plaque
            g.fillStyle(0xFFD700, 1);
            g.fillRect(16, h - 10, 32, 7);
            g.fillStyle(0x000000, 1);
            g.fillRect(18, h - 9, 28, 5);

            // Ralph Feet
            g.fillStyle(0xD99A75, 1);
            g.fillRect(14, h - 25, 12, 5);
            g.fillRect(38, h - 25, 12, 5);

            // Dark brown overalls pants
            g.fillStyle(0x562B16, 1);
            g.fillRect(16, h - 42, 32, 18);

            // Red & black flannel shirt torso
            g.fillStyle(0xC01828, 1);
            g.fillRect(14, h - 60, 36, 20);
            // Flannel checks
            g.fillStyle(0x5A0810, 1);
            g.fillRect(18, h - 58, 6, 6);
            g.fillRect(30, h - 58, 6, 6);
            g.fillRect(24, h - 50, 6, 6);

            // Overall single strap
            g.fillStyle(0x562B16, 1);
            g.fillRect(20, h - 60, 5, 20);
            // Brass overall buckle
            g.fillStyle(0xFFD700, 1);
            g.fillRect(20, h - 48, 5, 3);

            // Giant Wrecking Fists
            // Left fist (held high)
            g.fillStyle(0xD99A75, 1);
            g.fillCircle(10, h - 52, 9);
            g.fillStyle(0x9E5A35, 1);
            g.fillRect(7, h - 54, 7, 5); // knuckle lines

            // Right fist (held high)
            g.fillStyle(0xD99A75, 1);
            g.fillCircle(54, h - 52, 9);
            g.fillStyle(0x9E5A35, 1);
            g.fillRect(50, h - 54, 7, 5);

            // Head & Face
            g.fillStyle(0xD99A75, 1);
            g.fillRect(22, h - 74, 20, 15);
            // Big friendly toothy grin
            g.fillStyle(0xFFFFFF, 1);
            g.fillRect(26, h - 64, 12, 4);
            g.fillStyle(0x000000, 1);
            g.fillRect(26, h - 64, 12, 1);
            // Eyes and thick eyebrows
            g.fillStyle(0x3B1E0B, 1);
            g.fillRect(25, h - 72, 5, 3);
            g.fillRect(34, h - 72, 5, 3);
            g.fillStyle(0x000000, 1);
            g.fillRect(26, h - 69, 3, 3);
            g.fillRect(35, h - 69, 3, 3);

            // Spiky Ralph brown hair
            g.fillStyle(0x401E08, 1);
            g.fillCircle(32, h - 77, 12);
            g.fillTriangle(20, h - 76, 25, h - 86, 30, h - 76);
            g.fillTriangle(28, h - 76, 33, h - 87, 38, h - 76);
            g.fillTriangle(36, h - 76, 42, h - 85, 46, h - 76);

            g.generateTexture('ralph_statue_tex', w, h);
            g.destroy();
        }

        // Pixel art of Vanellope von Schweetz Statue
        if (!this.textures.exists('vanellope_statue_tex')) {
            const g = this.add.graphics();
            const w = 48;
            const h = 70;

            // Mint green sugar pedestal
            g.fillStyle(0x20B2AA, 1);
            g.fillRect(6, h - 16, 36, 16);
            g.fillStyle(0xFFD700, 1);
            g.fillRect(12, h - 11, 24, 6);
            g.fillStyle(0x000000, 1);
            g.fillRect(14, h - 10, 20, 4);

            // Tights & sneakers (Mismatched striped leggings)
            g.fillStyle(0x30D5A5, 1);
            g.fillRect(16, h - 26, 4, 11);
            g.fillStyle(0xFFFFFF, 1);
            g.fillRect(16, h - 22, 4, 3);
            g.fillStyle(0x9C27B0, 1);
            g.fillRect(26, h - 26, 4, 11);
            g.fillStyle(0xFFFFFF, 1);
            g.fillRect(26, h - 22, 4, 3);

            // Sneakers
            g.fillStyle(0x1F2937, 1);
            g.fillRect(14, h - 17, 7, 3);
            g.fillRect(25, h - 17, 7, 3);

            // Brown pleated candy-wrapper skirt
            g.fillStyle(0x6D3818, 1);
            g.fillRect(14, h - 33, 18, 8);

            // Mint green hoodie
            g.fillStyle(0x2ED197, 1);
            g.fillRect(14, h - 46, 18, 14);
            // Pink drawstrings
            g.fillStyle(0xFF4081, 1);
            g.fillRect(19, h - 42, 2, 8);
            g.fillRect(25, h - 42, 2, 8);

            // Cute waving hand
            g.fillStyle(0xFFD2B2, 1);
            g.fillCircle(8, h - 44, 4);
            g.fillCircle(38, h - 40, 4);

            // Face
            g.fillStyle(0xFFD2B2, 1);
            g.fillRect(17, h - 56, 14, 11);
            // Mischievous hazel eyes
            g.fillStyle(0x3B200B, 1);
            g.fillRect(19, h - 53, 3, 3);
            g.fillRect(26, h - 53, 3, 3);
            // Cheeky grin
            g.fillStyle(0xE91E63, 1);
            g.fillRect(21, h - 48, 6, 2);

            // High raven-black ponytail & hair
            g.fillStyle(0x181818, 1);
            g.fillCircle(24, h - 57, 9);
            // Ponytail curving up and right
            g.fillCircle(31, h - 63, 7);
            // Red licorice hair tie
            g.fillStyle(0xE50914, 1);
            g.fillCircle(28, h - 61, 3);

            // Candy hair clips (gummy bear, candy corn, peppermint dots)
            g.fillStyle(0x00E5FF, 1);
            g.fillRect(19, h - 60, 3, 3);
            g.fillStyle(0xFFD700, 1);
            g.fillRect(23, h - 63, 3, 3);
            g.fillStyle(0xFF4081, 1);
            g.fillRect(28, h - 57, 2, 2);
            g.fillStyle(0xFFFFFF, 1);
            g.fillRect(16, h - 56, 2, 2);

            g.generateTexture('vanellope_statue_tex', w, h);
            g.destroy();
        }

        // Giant Macarons (Pink, Mint, Gold)
        const createMacaron = (key, shellColor, creamColor) => {
            if (this.textures.exists(key)) return;
            const g = this.add.graphics();
            const w = 46;
            const h = 32;

            // Top cookie shell
            g.fillStyle(shellColor, 1);
            g.fillRoundedRect(4, 2, 38, 12, 6);
            // Top ruffled foot
            g.fillStyle(shellColor, 0.8);
            for (let x = 4; x < 42; x += 4) {
                g.fillCircle(x, 14, 2);
            }

            // Thick sweet creamy filling
            g.fillStyle(creamColor, 1);
            g.fillRoundedRect(6, 12, 34, 7, 3);

            // Bottom ruffled foot
            g.fillStyle(shellColor, 0.8);
            for (let x = 4; x < 42; x += 4) {
                g.fillCircle(x, 18, 2);
            }
            // Bottom cookie shell
            g.fillStyle(shellColor, 1);
            g.fillRoundedRect(4, 18, 38, 12, 6);

            // Glossy highlight shine
            g.fillStyle(0xFFFFFF, 0.6);
            g.fillEllipse(18, 6, 10, 3);

            g.generateTexture(key, w, h);
            g.destroy();
        };

        createMacaron('giant_macaron_pink', 0xFF4081, 0xFFFFFF);
        createMacaron('giant_macaron_mint', 0x20D2AA, 0xFFE082);
        createMacaron('giant_macaron_gold', 0xFFD700, 0x5D3818);

        // Candy Alcove Porthole (Starry ocean view through brass ship porthole)
        if (!this.textures.exists('candy_porthole')) {
            const g = this.add.graphics();
            const s = 80;
            const r = s / 2;

            // Outer brass nautical frame
            g.fillStyle(0xFFD700, 1);
            g.fillCircle(r, r, 38);
            g.fillStyle(0xC89600, 1);
            g.fillCircle(r, r, 35);
            // Peppermint candy rim
            g.fillStyle(0xE60026, 1);
            g.fillCircle(r, r, 32);

            // Night sky ocean interior
            g.fillStyle(0x060E24, 1);
            g.fillCircle(r, r, 28);

            // Rolling midnight waves
            g.fillStyle(0x0C2B68, 1);
            g.fillCircle(r - 10, r + 14, 22);
            g.fillCircle(r + 10, r + 16, 20);
            g.fillStyle(0x1B4FA8, 0.9);
            g.fillCircle(r, r + 22, 22);

            // Stars
            g.fillStyle(0xFFFFFF, 1);
            g.fillRect(r - 14, r - 12, 2, 2);
            g.fillRect(r + 10, r - 16, 2, 2);
            g.fillRect(r + 2, r - 6, 2, 2);
            g.fillRect(r - 8, r + 2, 2, 2);

            // Brass rivets around frame
            g.fillStyle(0x503000, 1);
            for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
                const rx = r + Math.cos(a) * 35;
                const ry = r + Math.sin(a) * 35;
                g.fillCircle(rx, ry, 2);
            }

            g.generateTexture('candy_porthole', s, s);
            g.destroy();
        }

        // Peppermint candy wall sconce light
        if (!this.textures.exists('candy_sconce')) {
            const g = this.add.graphics();
            // Wall bracket
            g.fillStyle(0xFFD700, 1);
            g.fillRect(10, 16, 4, 14);
            g.fillRect(6, 26, 12, 4);
            // Swirled lollipop light globe
            g.fillStyle(0xFFFFFF, 1);
            g.fillCircle(12, 12, 10);
            g.fillStyle(0xE60026, 1);
            g.fillCircle(12, 12, 7);
            g.fillStyle(0xFFF090, 1);
            g.fillCircle(12, 12, 4);
            g.generateTexture('candy_sconce', 24, 34);
            g.destroy();
        }

        // Built-in padded alcove bench
        if (!this.textures.exists('candy_bench')) {
            const g = this.add.graphics();
            const w = 96;
            const h = 42;
            // Base frame (Dark chocolate wood)
            g.fillStyle(0x3B1522, 1);
            g.fillRoundedRect(4, h - 16, 88, 16, 4);
            // Tufted strawberry cushion
            g.fillStyle(0xE83868, 1);
            g.fillRoundedRect(2, 6, 92, 22, 6);
            // Golden trim piping
            g.lineStyle(2, 0xFFD700, 1);
            g.strokeRoundedRect(2, 6, 92, 22, 6);
            // Cushion tufting buttons
            g.fillStyle(0xFFD700, 1);
            g.fillCircle(24, 17, 3);
            g.fillCircle(48, 17, 3);
            g.fillCircle(72, 17, 3);
            g.generateTexture('candy_bench', w, h);
            g.destroy();
        }

        // ---------------------------------------------------------------------
        // MINI-GAME TEXTURES: SUGAR RUSH PEPPERMINT SLIDE RUN
        // ---------------------------------------------------------------------

        // Peppermint Chute Track Background (3 lanes with animated spiral stripes)
        if (!this.textures.exists('slide_lane_track')) {
            const g = this.add.graphics();
            const tw = 380;
            const th = 80;

            // Chute flume base (glossy sugar pink)
            g.fillStyle(0x3B0D24, 1);
            g.fillRect(0, 0, tw, th);

            // Diagonal red and white peppermint candy stripes
            for (let x = -80; x < tw + 80; x += 32) {
                g.fillStyle(0xE60026, 1);
                g.beginPath();
                g.moveTo(x, 0);
                g.lineTo(x + 16, 0);
                g.lineTo(x + 48, th);
                g.lineTo(x + 32, th);
                g.closePath();
                g.fillPath();

                g.fillStyle(0xFFFFFF, 1);
                g.beginPath();
                g.moveTo(x + 16, 0);
                g.lineTo(x + 32, 0);
                g.lineTo(x + 64, th);
                g.lineTo(x + 48, th);
                g.closePath();
                g.fillPath();
            }

            // Flume surface gloss sheen
            g.fillStyle(0xFFFFFF, 0.18);
            g.fillRect(0, 0, tw, th);

            // Lane Divider Guides (Dashed yellow sugar lines)
            g.fillStyle(0xFFD700, 0.9);
            // Lane 1 divider at x = tw / 3
            for (let y = 8; y < th; y += 24) {
                g.fillRect(Math.round(tw / 3) - 2, y, 4, 12);
                g.fillRect(Math.round(tw * 2 / 3) - 2, y, 4, 12);
            }

            // Left & Right Flume Bumpers (candy cane curb)
            g.fillStyle(0xE60026, 1);
            g.fillRect(0, 0, 10, th);
            g.fillRect(tw - 10, 0, 10, th);
            g.fillStyle(0xFFFFFF, 1);
            for (let y = 0; y < th; y += 16) {
                g.fillRect(0, y, 10, 8);
                g.fillRect(tw - 10, y, 10, 8);
            }

            g.generateTexture('slide_lane_track', tw, th);
            g.destroy();
        }

        // Candy Kart / Peppermint Slider Tube
        if (!this.textures.exists('candy_kart_slider')) {
            const g = this.add.graphics();
            const kw = 56;
            const kh = 50;

            // Inflatable peppermint tube ring (outer donut)
            g.fillStyle(0xFFFFFF, 1);
            g.fillEllipse(kw / 2, kh / 2 + 6, 52, 34);
            // Peppermint spiral stripes on tube
            g.fillStyle(0xE60026, 1);
            for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
                g.beginPath();
                g.moveTo(kw / 2, kh / 2 + 6);
                g.lineTo(kw / 2 + Math.cos(a) * 26, (kh / 2 + 6) + Math.sin(a) * 17);
                g.lineTo(kw / 2 + Math.cos(a + 0.35) * 26, (kh / 2 + 6) + Math.sin(a + 0.35) * 17);
                g.closePath();
                g.fillPath();
            }

            // Inner seating cockpit (dark chocolate interior)
            g.fillStyle(0x280B15, 1);
            g.fillEllipse(kw / 2, kh / 2 + 4, 30, 20);

            // Cookie bumper front & candy headlights
            g.fillStyle(0x733E1D, 1);
            g.fillRoundedRect(kw / 2 - 16, 2, 32, 10, 4);
            g.fillStyle(0xFFD700, 1);
            g.fillCircle(kw / 2 - 10, 7, 3);
            g.fillCircle(kw / 2 + 10, 7, 3);

            // Chrome steering wheel
            g.lineStyle(2, 0x00FFFF, 1);
            g.strokeCircle(kw / 2, kh / 2 - 2, 7);

            g.generateTexture('candy_kart_slider', kw, kh);
            g.destroy();
        }

        // Collectible: Sugar Rush Peppermint Candy (+100 pts)
        if (!this.textures.exists('item_peppermint')) {
            const g = this.add.graphics();
            const s = 30;
            const r = s / 2;

            g.fillStyle(0xFFFFFF, 1);
            g.fillCircle(r, r, 13);
            // Red swirls
            g.fillStyle(0xE60026, 1);
            for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
                g.beginPath();
                g.moveTo(r, r);
                g.lineTo(r + Math.cos(a) * 13, r + Math.sin(a) * 13);
                g.lineTo(r + Math.cos(a + 0.5) * 13, r + Math.sin(a + 0.5) * 13);
                g.closePath();
                g.fillPath();
            }
            // Golden outer glow ring
            g.lineStyle(2, 0xFFD700, 0.9);
            g.strokeCircle(r, r, 13);
            // Glossy shine
            g.fillStyle(0xFFFFFF, 0.8);
            g.fillCircle(r - 4, r - 4, 3);

            g.generateTexture('item_peppermint', s, s);
            g.destroy();
        }

        // Collectible: Golden Macaron (+250 pts + Speed Boost)
        if (!this.textures.exists('item_macaron_gold')) {
            const g = this.add.graphics();
            const w = 34;
            const h = 26;

            // Glowing golden aura
            g.fillStyle(0xFFEA00, 0.4);
            g.fillCircle(w / 2, h / 2, 15);

            // Golden shells
            g.fillStyle(0xFFD700, 1);
            g.fillRoundedRect(3, 2, 28, 9, 4);
            g.fillStyle(0xFFFFFF, 1);
            g.fillRoundedRect(5, 9, 24, 6, 2);
            g.fillStyle(0xFFD700, 1);
            g.fillRoundedRect(3, 14, 28, 9, 4);

            // Sparkle star
            g.fillStyle(0xFFFFFF, 1);
            g.fillCircle(w / 2 - 5, 5, 2);
            g.fillCircle(w / 2 + 7, 16, 2);

            g.generateTexture('item_macaron_gold', w, h);
            g.destroy();
        }

        // Hazard: Sour Jawbreaker / Mentos Eruption (-50 pts)
        if (!this.textures.exists('hazard_jawbreaker')) {
            const g = this.add.graphics();
            const s = 32;
            const r = s / 2;

            // Spiky sour jawbreaker
            g.fillStyle(0x7B1FA2, 1); // Acid purple
            g.fillCircle(r, r, 12);

            // Spikes
            g.fillStyle(0x4A148C, 1);
            for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
                const sx = r + Math.cos(a) * 14;
                const sy = r + Math.sin(a) * 14;
                g.fillCircle(sx, sy, 3);
            }

            // Sour lime acid blotches
            g.fillStyle(0x76FF03, 1);
            g.fillCircle(r - 3, r - 3, 3);
            g.fillCircle(r + 4, r + 2, 2);
            g.fillCircle(r, r + 4, 2);

            // Red warning outline
            g.lineStyle(2, 0xFF1744, 0.85);
            g.strokeCircle(r, r, 13);

            g.generateTexture('hazard_jawbreaker', s, s);
            g.destroy();
        }
    }

    ensureCharacterAnimations() {
        const id = this.charData.charId;
        const walkKey = this.charData.walkAnim;
        if (!this.anims.exists(walkKey)) {
            const frames = [];
            if (this.textures.exists(`${id}_walk_0`)) frames.push({ key: `${id}_walk_0` });
            if (this.textures.exists(`${id}_walk_1`)) frames.push({ key: `${id}_walk_1` });
            if (this.textures.exists(`${id}_walk_2`)) frames.push({ key: `${id}_walk_2` });
            if (this.textures.exists(`${id}_walk_1`)) frames.push({ key: `${id}_walk_1` });

            if (frames.length > 0) {
                this.anims.create({
                    key: walkKey,
                    frames: frames,
                    frameRate: 8,
                    repeat: -1
                });
            }
        }
    }

    // =========================================================================
    // ROOM ENVIRONMENT & 2.5D LOUNGE SETUP
    // =========================================================================

    createRoomEnvironment() {
        const rw = this.roomW;
        const rh = this.roomH;
        const fy = this.floorY;
        const fh = this.floorH;

        // Solid background to prevent any bleed-through
        this.add.rectangle(rw / 2, rh / 2, rw + 200, rh + 200, 0x12040D).setOrigin(0.5).setDepth(0);

        // Candy-cane wall pattern
        this.wallTile = this.add.tileSprite(rw / 2, fy / 2, rw, fy, 'ralph_candy_wall').setDepth(1);

        // Candy checkerboard floor
        this.floorTile = this.add.tileSprite(rw / 2, fy + (fh / 2), rw, fh, 'ralph_floor_tile').setDepth(2);

        // Gold & Strawberry curb divider line
        const curb = this.add.graphics().setDepth(3);
        curb.fillStyle(0xFFD700, 1);
        curb.fillRect(0, fy - 3, rw, 3);
        curb.fillStyle(0xE60026, 1);
        curb.fillRect(0, fy, rw, 3);

        // Deck 3 Mezzanine Balcony Runner (Visual overhead framing of the upper deck launch area)
        this.add.rectangle(rw / 2, 22, rw, 36, 0x220815, 0.95).setDepth(4).setStrokeStyle(2, 0xFFD700);
        this.add.text(rw / 2, 22, '▲ DECK 3: GRAND HALL ATRIUM & PEPPERMINT SLIDE LAUNCH ▲', {
            fontSize: '9px',
            fill: '#FFD700',
            fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(5);

        // Ceiling Candy Wall Sconces with gentle pulsing glow
        this.sconces = [];
        for (let sx = 140; sx < rw - 80; sx += 180) {
            const sc = this.add.image(sx, 70, 'candy_sconce').setDepth(5);
            this.sconces.push(sc);
            // Soft glow tween
            this.tweens.add({
                targets: sc,
                alpha: 0.75,
                duration: Phaser.Math.Between(700, 1300),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    createRoomStations() {
        const fy = this.floorY;

        // ---------------------------------------------------------------------
        // 1. Oceaneer Hub Exit Archway (Left side, x = 90)
        // ---------------------------------------------------------------------
        this.stationExitX = 90;
        this.add.rectangle(this.stationExitX, fy - 52, 80, 104, 0x1A0512).setDepth(4).setStrokeStyle(3, 0xFFD700);
        this.add.rectangle(this.stationExitX, fy - 52, 68, 92, 0x0A0008).setDepth(5);
        this.add.text(this.stationExitX, fy - 94, '[ ◄ HUB CENTRAL ]', {
            fontSize: '7px', fill: '#00FF66', fontFamily: '"Press Start 2P", monospace', stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(6);

        // ---------------------------------------------------------------------
        // 2. Themed Candy Alcoves with Ocean Portholes & Built-in Benches
        //    Alcove 1 at x = 320, Alcove 2 at x = 580
        // ---------------------------------------------------------------------
        [320, 580].forEach((ax, idx) => {
            // Alcove recessed archway
            const arch = this.add.graphics().setDepth(4);
            arch.fillStyle(0x1B0713, 0.95);
            arch.fillRoundedRect(ax - 65, fy - 150, 130, 145, 12);
            arch.lineStyle(3, 0xFF4081, 1);
            arch.strokeRoundedRect(ax - 65, fy - 150, 130, 145, 12);

            // Ocean Porthole inside alcove
            const port = this.add.image(ax, fy - 95, 'candy_porthole').setDepth(5);
            port.setInteractive({ useHandCursor: true });
            port.on('pointerdown', () => this.triggerStation('alcove', ax, fy - 95));

            // Built-in cushioned bench
            const bench = this.add.image(ax, fy - 18, 'candy_bench').setDepth(6);
            bench.setInteractive({ useHandCursor: true });
            bench.on('pointerdown', () => this.triggerStation('alcove', ax, fy - 18));

            // Sign above alcove
            this.add.text(ax, fy - 140, idx === 0 ? 'SUGAR BAY ALCOVE' : 'PEPPERMINT VIEW', {
                fontSize: '7px', fill: '#FFD700', fontFamily: '"Press Start 2P", monospace', stroke: '#000', strokeThickness: 2
            }).setOrigin(0.5).setDepth(7);
        });

        // ---------------------------------------------------------------------
        // 3. Peppermint-Striped Spiral Slide from Deck 3 down to Deck 2
        //    Positioned at x = 900
        // ---------------------------------------------------------------------
        this.slideX = 900;
        this.slideY = fy - 120;
        this.spiralSlideGfx = this.add.image(this.slideX, this.slideY, 'ralph_spiral_slide_bg').setDepth(6);
        this.spiralSlideGfx.setInteractive({ useHandCursor: true });
        this.spiralSlideGfx.on('pointerdown', () => this.startSlideRun());

        // Overhead sign for Peppermint Slide
        this.add.text(this.slideX - 20, fy - 225, '★ SUGAR RUSH PEPPERMINT CHUTE ★', {
            fontSize: '8px', fill: '#FF4081', fontFamily: '"Press Start 2P", monospace', stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(8);

        // Slide chute mouth interactive hotspot
        const chuteMouthX = this.slideX - 40;
        const chuteMouthY = fy - 35;
        this.chuteTriggerZone = this.add.circle(chuteMouthX, chuteMouthY, 36, 0xFF0000, 0.001).setDepth(7).setInteractive({ useHandCursor: true });
        this.chuteTriggerZone.on('pointerdown', () => this.startSlideRun());

        // ---------------------------------------------------------------------
        // 4. Vanellope von Schweetz Statue greeting kids at the slide exit
        //    Positioned at x = 800
        // ---------------------------------------------------------------------
        this.vanellopeX = 800;
        this.vanellopeY = fy - 32;
        this.vanellopeStatue = this.add.image(this.vanellopeX, this.vanellopeY, 'vanellope_statue_tex').setDepth(9);
        this.vanellopeStatue.setInteractive({ useHandCursor: true });
        this.vanellopeStatue.on('pointerdown', () => this.triggerStation('vanellope', this.vanellopeX, this.vanellopeY));

        this.add.text(this.vanellopeX, this.vanellopeY - 42, 'VANELLOPE', {
            fontSize: '7px', fill: '#00FFFF', fontFamily: '"Press Start 2P", monospace', stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(10);

        // ---------------------------------------------------------------------
        // 5. Large Wreck-It Ralph Statue & Giant Macarons at Staircase foot
        //    Positioned at x = 1110
        // ---------------------------------------------------------------------
        this.ralphX = 1110;
        this.ralphY = fy - 40;
        this.ralphStatue = this.add.image(this.ralphX, this.ralphY, 'ralph_statue_tex').setDepth(9);
        this.ralphStatue.setInteractive({ useHandCursor: true });
        this.ralphStatue.on('pointerdown', () => this.triggerStation('ralph', this.ralphX, this.ralphY));

        this.add.text(this.ralphX, this.ralphY - 52, 'WRECK-IT RALPH', {
            fontSize: '7px', fill: '#FFD700', fontFamily: '"Press Start 2P", monospace', stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(10);

        // Cluster of Giant Macarons around Ralph's pedestal
        const macaron1 = this.add.image(this.ralphX - 36, fy - 14, 'giant_macaron_pink').setDepth(10).setInteractive({ useHandCursor: true });
        const macaron2 = this.add.image(this.ralphX + 38, fy - 14, 'giant_macaron_gold').setDepth(10).setInteractive({ useHandCursor: true });
        const macaron3 = this.add.image(this.ralphX + 68, fy - 12, 'giant_macaron_mint').setDepth(10).setInteractive({ useHandCursor: true });

        [macaron1, macaron2, macaron3].forEach(m => {
            m.on('pointerdown', () => this.triggerStation('ralph', this.ralphX, this.ralphY));
        });

        // ---------------------------------------------------------------------
        // 6. Regular Staircase Entrance beside the slide (x = 1270)
        // ---------------------------------------------------------------------
        this.stairsX = 1270;
        this.stairsY = fy - 105;
        this.staircase = this.add.image(this.stairsX, this.stairsY, 'ralph_staircase_bg').setDepth(6);
        this.staircase.setInteractive({ useHandCursor: true });
        this.staircase.on('pointerdown', () => this.triggerStation('stairs', this.stairsX, this.stairsY));

        this.add.text(this.stairsX, fy - 195, 'DECK 3 STAIRS', {
            fontSize: '7px', fill: '#F8B800', fontFamily: '"Press Start 2P", monospace', stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(8);

        // ---------------------------------------------------------------------
        // Proximity Action Tooltip Indicator
        // ---------------------------------------------------------------------
        this.actionPrompt = this.add.text(0, 0, '', {
            fontSize: '8px',
            fill: '#FFD700',
            backgroundColor: '#000000',
            padding: { x: 8, y: 5 },
            fontFamily: '"Press Start 2P", monospace'
        }).setOrigin(0.5).setDepth(1200).setVisible(false);
    }

    createPlayer() {
        const spawnX = 220;
        this.playerShadow = this.add.ellipse(spawnX, this.groundY + 16, 26, 9, 0x000000, 0.45).setDepth(11);
        this.player = this.physics.add.sprite(spawnX, this.groundY, this.charData.idleKey).setDepth(12);
        this.player.body.allowGravity = false;
        this.player.body.setSize(22, 18);
        this.player.body.setOffset(5, this.charData.bodyOffsetY || 26);
    }

    // =========================================================================
    // SPEECH BUBBLE DIALOGUE SYSTEM (NES / CAPCOM RETRO AESTHETIC)
    // =========================================================================

    createSpeechBubbleSystem() {
        this.speechBox = this.add.graphics().setDepth(2600).setVisible(false);
        this.speechText = this.add.text(0, 0, '', {
            fontSize: '8px',
            fill: '#FFFFFF',
            fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000',
            strokeThickness: 2,
            align: 'center',
            wordWrap: { width: 220 }
        }).setOrigin(0.5).setDepth(2601).setVisible(false);
    }

    showSpeechBubble(speaker, text, targetX, targetY) {
        if (this.speechTimer) this.speechTimer.remove();
        this.currentSpeaker = speaker;
        this.speechText.setText(text);
        this.speechText.setVisible(true);

        const padX = 16;
        const padY = 12;
        const boxW = Math.max(180, this.speechText.width + padX * 2);
        const boxH = this.speechText.height + padY * 2;

        const bx = Math.round(targetX - boxW / 2);
        const by = Math.round(targetY - boxH - 24);

        this.speechBox.clear();
        // Capcom black background with candy border
        this.speechBox.fillStyle(0x0A0207, 0.94);
        const strokeColor = (speaker === 'vanellope') ? 0x00FFFF : (speaker === 'ralph' ? 0xFFD700 : 0xFF4081);
        this.speechBox.lineStyle(3, strokeColor, 1);
        this.speechBox.fillRoundedRect(bx, by, boxW, boxH, 6);
        this.speechBox.strokeRoundedRect(bx, by, boxW, boxH, 6);

        // Speech bubble triangle pointing toward character
        this.speechBox.fillTriangle(targetX - 7, by + boxH, targetX + 7, by + boxH, targetX, by + boxH + 9);
        this.speechBox.strokeLineShape(new Phaser.Geom.Line(targetX - 7, by + boxH, targetX, by + boxH + 9));
        this.speechBox.strokeLineShape(new Phaser.Geom.Line(targetX + 7, by + boxH, targetX, by + boxH + 9));
        this.speechBox.setVisible(true);

        this.speechText.setPosition(bx + boxW / 2, by + boxH / 2);

        this.speechTimer = this.time.delayedCall(4500, () => {
            this.hideSpeechBubble();
        });
    }

    hideSpeechBubble() {
        if (this.speechBox) this.speechBox.setVisible(false);
        if (this.speechText) this.speechText.setVisible(false);
        this.currentSpeaker = null;
    }

    triggerStation(stationName, x, y) {
        this.playAudio('laser');
        if (stationName === 'vanellope') {
            this.showSpeechBubble('vanellope', 'HEY GLITCH! RACE DOWN THE SUGAR RUSH PEPPERMINT SLIDE!', x, y - 10);
        } else if (stationName === 'ralph') {
            this.showSpeechBubble('ralph', "I'M GONNA WRECK IT! COLLECT CANDY COINS ON THE SLIDE!", x, y - 20);
        } else if (stationName === 'alcove') {
            this.showSpeechBubble('alcove', 'RELAXING IN THE SUGAR RUSH OCEAN ALCOVE... SO SWEET!', x, y - 20);
        } else if (stationName === 'stairs') {
            this.showSpeechBubble('stairs', 'DECK 3 GRAND HALL STAIRWAY! TAKE THE PEPPERMINT SLIDE DOWN!', x, y - 30);
        } else if (stationName === 'slide') {
            this.startSlideRun();
        } else if (stationName === 'exit') {
            this.returnToHub();
        }
    }

    // =========================================================================
    // SLIDE RUN MINI-GAME: "SUGAR RUSH PEPPERMINT SLIDE RUN" (25-SECOND RUN)
    // =========================================================================

    createSlideElements() {
        const W = this.scale.width;
        const H = this.scale.height;

        this.slideContainer = this.add.container(0, 0).setScrollFactor(0).setDepth(1500).setVisible(false);

        // Dim background backdrop
        this.slideBackdrop = this.add.rectangle(W / 2, H / 2, W, H, 0x0A0207, 0.95);
        this.slideContainer.add(this.slideBackdrop);

        // Center Peppermint Flume Chute (Width: 380px)
        this.slideTrackW = 380;
        this.slideTrackCenterX = W / 2;
        this.slideTrackCenterY = H / 2;

        // Scrolling track tileSprite
        this.slideTrack = this.add.tileSprite(this.slideTrackCenterX, this.slideTrackCenterY, this.slideTrackW, H, 'slide_lane_track');
        this.slideContainer.add(this.slideTrack);

        // Animated neon guide chevrons at top
        this.chevronText = this.add.text(this.slideTrackCenterX, 42, '▼   ▼   ▼', {
            fontSize: '12px', fill: '#00FFFF', fontFamily: '"Press Start 2P", monospace', stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5);
        this.slideContainer.add(this.chevronText);

        this.tweens.add({
            targets: this.chevronText,
            alpha: 0.35,
            duration: 350,
            yoyo: true,
            repeat: -1
        });

        // Items group container
        this.slideItemsContainer = this.add.container(0, 0);
        this.slideContainer.add(this.slideItemsContainer);

        // Slider Kart with Player Avatar
        this.kartY = H - 95;
        this.sliderKartContainer = this.add.container(this.slideTrackCenterX, this.kartY);

        // Peppermint slider tube chassis
        this.sliderKartGfx = this.add.image(0, 0, 'candy_kart_slider');
        this.sliderKartContainer.add(this.sliderKartGfx);

        // Sitting player avatar (Riley or Amelia)
        this.kartPlayerSprite = this.add.sprite(0, -10, this.charData.jumpKey || this.charData.idleKey);
        this.kartPlayerSprite.setScale(0.85);
        this.sliderKartContainer.add(this.kartPlayerSprite);

        this.slideContainer.add(this.sliderKartContainer);

        // ---------------------------------------------------------------------
        // Mini-Game HUD
        // ---------------------------------------------------------------------
        this.slideHUD = this.add.container(0, 0).setScrollFactor(0).setDepth(2500).setVisible(false);

        // Top Marquee Bar
        const topBar = this.add.rectangle(W / 2, 24, W, 40, 0x000000, 0.88).setStrokeStyle(2, 0xFF4081);
        this.slideHUD.add(topBar);

        // Title
        this.slideTitle = this.add.text(W / 2, 14, '★ SUGAR RUSH PEPPERMINT SLIDE ★', {
            fontSize: '9px', fill: '#FFD700', fontFamily: '"Press Start 2P", monospace', stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5);
        this.slideHUD.add(this.slideTitle);

        // Timer Display
        this.slideTimerText = this.add.text(32, 28, 'TIME: 25.0s', {
            fontSize: '9px', fill: '#00FFFF', fontFamily: '"Press Start 2P", monospace'
        }).setOrigin(0, 0.5);
        this.slideHUD.add(this.slideTimerText);

        // Score Display
        this.slideScoreText = this.add.text(W / 2, 28, 'SCORE: 00000', {
            fontSize: '9px', fill: '#FFEB3B', fontFamily: '"Press Start 2P", monospace'
        }).setOrigin(0.5, 0.5);
        this.slideHUD.add(this.slideScoreText);

        // Speed / Boost Display
        this.slideSpeedText = this.add.text(W - 32, 28, 'SPEED: 120 MPH', {
            fontSize: '8px', fill: '#00FF66', fontFamily: '"Press Start 2P", monospace'
        }).setOrigin(1, 0.5);
        this.slideHUD.add(this.slideSpeedText);

        // Best Record Ticker (deck progress)
        const prog = (typeof getOceaneerProgress === 'function') ? getOceaneerProgress() : { ralphSlideScore: 0, ralphSlideHolder: 'VANELLOPE' };
        this.slideRecordText = this.add.text(W / 2, 48, `BEST: ${prog.ralphSlideScore || 0} (${prog.ralphSlideHolder || 'VANELLOPE'})`, {
            fontSize: '7px', fill: '#A0D0FF', fontFamily: '"Press Start 2P", monospace'
        }).setOrigin(0.5);
        this.slideHUD.add(this.slideRecordText);

        // Floating score popup texts container
        this.popupsContainer = this.add.container(0, 0).setScrollFactor(0).setDepth(2600);

        // Mobile on-screen steer buttons for slide mode
        this.createSlideMobileButtons();
    }

    createSlideMobileButtons() {
        const W = this.scale.width;
        const H = this.scale.height;

        this.slideMobileButtons = this.add.container(0, 0).setScrollFactor(0).setDepth(2700).setVisible(false);

        // Left button
        const btnL = this.add.rectangle(65, H - 70, 90, 60, 0x000000, 0.75)
            .setStrokeStyle(3, 0x00FFFF).setInteractive({ useHandCursor: true });
        const textL = this.add.text(65, H - 70, '◄ LEFT', {
            fontSize: '10px', fill: '#00FFFF', fontFamily: '"Press Start 2P", monospace'
        }).setOrigin(0.5);
        btnL.on('pointerdown', () => this.steerSlide(-1));

        // Right button
        const btnR = this.add.rectangle(W - 65, H - 70, 90, 60, 0x000000, 0.75)
            .setStrokeStyle(3, 0x00FFFF).setInteractive({ useHandCursor: true });
        const textR = this.add.text(W - 65, H - 70, 'RIGHT ►', {
            fontSize: '10px', fill: '#00FFFF', fontFamily: '"Press Start 2P", monospace'
        }).setOrigin(0.5);
        btnR.on('pointerdown', () => this.steerSlide(1));

        this.slideMobileButtons.add([btnL, textL, btnR, textR]);
    }

    startSlideRun() {
        if (this.currentMode === 'SLIDE') return;
        this.currentMode = 'SLIDE';
        this.hideSpeechBubble();

        this.playAudio('powerup');

        // Reset slide run statistics
        this.slideTimeLeft = 25.0;
        this.score = 0;
        this.streak = 0;
        this.candiesCollected = 0;
        this.macaronsCollected = 0;
        this.jawbreakersHit = 0;
        this.boostTimer = 0;
        this.slideLane = 1; // Center lane
        this.isRunFinished = false;
        this.completionMenuOpen = false;

        // Reposition kart in center lane
        this.sliderKartContainer.x = this.slideTrackCenterX;
        this.sliderKartContainer.angle = 0;

        // Clear existing items
        this.slideItems.forEach(item => {
            if (item && item.sprite) item.sprite.destroy();
        });
        this.slideItems = [];
        this.nextSpawnTime = this.time.now + 600;

        // Show slide containers and HUD
        this.slideContainer.setVisible(true);
        this.slideHUD.setVisible(true);
        if (this.btnRideSlide) this.btnRideSlide.setVisible(false);

        // Show mobile steer buttons on non-desktop
        if (!this.sys.game.device.os.desktop) {
            this.slideMobileButtons.setVisible(true);
            if (this.roomMobileControls) this.roomMobileControls.setVisible(false);
        }

        // Camera center view
        this.cameras.main.stopFollow();
        this.cameras.main.setScroll(0, 0);
    }

    steerSlide(dir) {
        if (this.currentMode !== 'SLIDE' || this.isRunFinished) return;

        const oldLane = this.slideLane;
        this.slideLane = Phaser.Math.Clamp(this.slideLane + dir, 0, 2);

        if (this.slideLane !== oldLane) {
            this.playAudio('laser');
            const targetX = this.slideTrackCenterX + this.laneX[this.slideLane];
            const tiltAngle = dir * 8;

            this.tweens.add({
                targets: this.sliderKartContainer,
                x: targetX,
                angle: tiltAngle,
                duration: 90,
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    this.tweens.add({
                        targets: this.sliderKartContainer,
                        angle: 0,
                        duration: 80,
                        ease: 'Sine.easeOut'
                    });
                }
            });
        }
    }

    updateSlideRun(time, delta) {
        if (this.isRunFinished) return;

        // Decrement slide timer
        this.slideTimeLeft -= (delta / 1000);
        if (this.slideTimeLeft <= 0) {
            this.slideTimeLeft = 0;
            this.finishSlideRun();
            return;
        }

        // Boost timer countdown
        let currentSpeed = 380;
        let speedMph = 120;
        if (this.boostTimer > 0) {
            this.boostTimer -= (delta / 1000);
            currentSpeed = 640;
            speedMph = 210;
            // Visual sparkle pulse when boosted
            this.sliderKartContainer.alpha = (Math.floor(time / 60) % 2 === 0) ? 0.75 : 1;
        } else {
            this.sliderKartContainer.alpha = 1;
        }

        // Scroll peppermint chute background
        this.slideTrack.tilePositionY -= currentSpeed * (delta / 1000);

        // Update HUD text
        this.slideTimerText.setText(`TIME: ${this.slideTimeLeft.toFixed(1)}s`);
        this.slideScoreText.setText(`SCORE: ${String(this.score).padStart(5, '0')}`);
        this.slideSpeedText.setText(`SPEED: ${speedMph} MPH`);
        this.slideSpeedText.setColor(this.boostTimer > 0 ? '#FFD700' : '#00FF66');

        // Item Spawning loop
        if (time >= this.nextSpawnTime) {
            this.spawnSlideObject();
            const delay = this.boostTimer > 0 ? Phaser.Math.Between(450, 650) : Phaser.Math.Between(600, 850);
            this.nextSpawnTime = time + delay;
        }

        // Update active sliding items
        const hitY = this.kartY;
        for (let i = this.slideItems.length - 1; i >= 0; i--) {
            const item = this.slideItems[i];
            item.y += currentSpeed * (delta / 1000);
            item.sprite.y = item.y;

            // Rotation for spinning peppermint candies
            if (item.type === 'peppermint') {
                item.sprite.angle += 3;
            }

            // Check collision with player kart
            if (Math.abs(item.y - hitY) < 32 && item.lane === this.slideLane) {
                this.handleItemPickup(item, i);
                continue;
            }

            // Off-screen cleanup
            if (item.y > this.scale.height + 60) {
                item.sprite.destroy();
                this.slideItems.splice(i, 1);
            }
        }
    }

    spawnSlideObject() {
        const lane = Phaser.Math.Between(0, 2);
        const itemX = this.slideTrackCenterX + this.laneX[lane];
        const itemY = -30;

        // Probability: 55% Peppermint (+100), 20% Golden Macaron (+250 & boost), 25% Jawbreaker Hazard (-50)
        const roll = Math.random();
        let type = 'peppermint';
        let texKey = 'item_peppermint';

        if (roll < 0.22) {
            type = 'macaron';
            texKey = 'item_macaron_gold';
        } else if (roll < 0.47) {
            type = 'jawbreaker';
            texKey = 'hazard_jawbreaker';
        }

        const sprite = this.add.image(itemX, itemY, texKey).setDepth(1550);
        this.slideItemsContainer.add(sprite);

        this.slideItems.push({
            type: type,
            lane: lane,
            x: itemX,
            y: itemY,
            sprite: sprite
        });
    }

    handleItemPickup(item, index) {
        const px = item.x;
        const py = item.y;

        if (item.type === 'peppermint') {
            this.score += 100;
            this.candiesCollected++;
            this.streak++;
            this.playAudio('powerup');
            this.showFloatingPopup('+100', px, py, '#00FFFF');
        } else if (item.type === 'macaron') {
            this.score += 250;
            this.macaronsCollected++;
            this.boostTimer = 3.5; // 3.5s Speed boost
            this.playAudio('powerup');
            this.showFloatingPopup('+250 SPEED BOOST!', px, py, '#FFD700');
        } else if (item.type === 'jawbreaker') {
            if (this.boostTimer > 0) {
                // Invincible boost smashes jawbreaker!
                this.score += 50;
                this.playAudio('laser');
                this.showFloatingPopup('+50 SMASH!', px, py, '#FF4081');
            } else {
                this.score = Math.max(0, this.score - 50);
                this.jawbreakersHit++;
                this.streak = 0;
                this.playAudio('explosion');
                this.cameras.main.shake(140, 0.007);
                this.showFloatingPopup('-50 SOUR HIT!', px, py, '#FF1744');

                // Kart wobble spin
                this.tweens.add({
                    targets: this.sliderKartContainer,
                    angle: 15,
                    duration: 60,
                    yoyo: true,
                    repeat: 2
                });
            }
        }

        item.sprite.destroy();
        this.slideItems.splice(index, 1);
    }

    showFloatingPopup(text, x, y, color) {
        const popup = this.add.text(x, y, text, {
            fontSize: '9px',
            fill: color,
            fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        this.popupsContainer.add(popup);

        this.tweens.add({
            targets: popup,
            y: y - 45,
            alpha: 0,
            duration: 800,
            ease: 'Cubic.easeOut',
            onComplete: () => popup.destroy()
        });
    }

    finishSlideRun() {
        if (this.isRunFinished) return;
        this.isRunFinished = true;

        this.playAudio('powerup');

        // High Score & Progress Persistence via oceaneer-club-data contract
        const prog = (typeof getOceaneerProgress === 'function') ? getOceaneerProgress() : { ralphSlideScore: 0, ralphSlideHolder: 'VANELLOPE' };
        const prevBest = prog.ralphSlideScore || 0;
        const isNewBest = this.score >= prevBest;
        const best = Math.max(prevBest, this.score);

        if (typeof saveOceaneerProgress === 'function') {
            saveOceaneerProgress({
                ralphSlideScore: best,
                ralphSlideHolder: isNewBest ? this.charData.charName : prog.ralphSlideHolder,
                ralphSlideBadge: true
            });
        }

        // Show Celebratory 8-bit Scoreboard Modal with 500ms debounce
        this.showScoreboardModal(isNewBest, best, isNewBest ? this.charData.charName : (prog.ralphSlideHolder || 'VANELLOPE'));
    }

    showScoreboardModal(isNewBest, best, holder) {
        this.completionMenuOpen = true;
        this.menuSelectionIndex = 0;
        this.menuReadyTime = this.time.now + 500; // 500ms debounce

        const W = this.scale.width;
        const H = this.scale.height;

        this.modalBackdrop = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.75)
            .setScrollFactor(0).setDepth(3000);

        this.modalCard = this.add.rectangle(W / 2, H / 2, 420, 270, 0x14050E, 0.98)
            .setStrokeStyle(4, 0xFFD700).setScrollFactor(0).setDepth(3001);

        this.modalTitle = this.add.text(W / 2, H / 2 - 105, '★ SUGAR RUSH SLIDE COMPLETE! ★', {
            fontSize: '9px', fontFamily: '"Press Start 2P"', fill: '#FFD700', stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5).setScrollFactor(0).setDepth(3002);

        this.modalCheer = this.add.text(W / 2, H / 2 - 80, `${this.charData.charName} ROCKED THE CHUTE!`, {
            fontSize: '9px', fontFamily: '"Press Start 2P"', fill: '#00FFFF'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(3002);

        this.modalScore = this.add.text(W / 2, H / 2 - 50, `FINAL SCORE: ${this.score}`, {
            fontSize: '11px', fontFamily: '"Press Start 2P"', fill: '#FFFFFF'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(3002);

        this.modalStats = this.add.text(W / 2, H / 2 - 25, `CANDIES: ${this.candiesCollected}  MACARONS: ${this.macaronsCollected}`, {
            fontSize: '7px', fontFamily: '"Press Start 2P"', fill: '#FFB6C1'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(3002);

        const recordString = isNewBest
            ? '★ NEW ALL-TIME RECORD HOLDER! ★'
            : `RECORD: ${best} (${holder})`;
        this.modalRecord = this.add.text(W / 2, H / 2, recordString, {
            fontSize: '8px', fontFamily: '"Press Start 2P"', fill: isNewBest ? '#FFEB3B' : '#A0D0FF'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(3002);

        this.modalBadge = this.add.text(W / 2, H / 2 + 20, '★ RALPH SLIDE BADGE SAVED! ★', {
            fontSize: '7px', fontFamily: '"Press Start 2P"', fill: '#00FF66'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(3002);

        // Menu Option Buttons
        this.btnRideAgain = this.add.text(W / 2, H / 2 + 50, '  RIDE AGAIN  ', {
            fontSize: '9px', fontFamily: '"Press Start 2P"', fill: '#000000', backgroundColor: '#FFD700', padding: { x: 12, y: 6 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(3003).setInteractive({ useHandCursor: true });
        this.btnRideAgain.on('pointerdown', () => this.confirmMenuChoice(0));

        this.btnExploreWing = this.add.text(W / 2, H / 2 + 76, '  EXPLORE WING  ', {
            fontSize: '9px', fontFamily: '"Press Start 2P"', fill: '#FFFFFF', backgroundColor: '#3B1228', padding: { x: 12, y: 6 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(3003).setInteractive({ useHandCursor: true });
        this.btnExploreWing.on('pointerdown', () => this.confirmMenuChoice(1));

        this.btnBackHub = this.add.text(W / 2, H / 2 + 102, '  BACK TO HUB  ', {
            fontSize: '9px', fontFamily: '"Press Start 2P"', fill: '#FFFFFF', backgroundColor: '#5A0C16', padding: { x: 12, y: 6 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(3003).setInteractive({ useHandCursor: true });
        this.btnBackHub.on('pointerdown', () => this.confirmMenuChoice(2));

        // Selector arrow
        this.menuCursor = this.add.text(W / 2 - 105, H / 2 + 50, '►', {
            fontSize: '10px', fontFamily: '"Press Start 2P"', fill: '#FFD700'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(3004);

        this.tweens.add({
            targets: this.menuCursor,
            x: '+= 5',
            duration: 300,
            yoyo: true,
            repeat: -1
        });
    }

    updateMenuVisuals() {
        const H = this.scale.height;
        const targetsY = [H / 2 + 50, H / 2 + 76, H / 2 + 102];
        if (this.menuCursor) {
            this.menuCursor.y = targetsY[this.menuSelectionIndex];
        }

        const buttons = [this.btnRideAgain, this.btnExploreWing, this.btnBackHub];
        buttons.forEach((btn, idx) => {
            if (btn) {
                if (idx === this.menuSelectionIndex) {
                    btn.setStyle({ fill: '#000000', backgroundColor: '#FFD700' });
                } else {
                    btn.setStyle({ fill: '#FFFFFF', backgroundColor: idx === 1 ? '#3B1228' : '#5A0C16' });
                }
            }
        });
    }

    confirmMenuChoice(chosenIndex) {
        const index = (typeof chosenIndex === 'number') ? chosenIndex : this.menuSelectionIndex;
        this.playAudio('laser');
        this.destroyScoreboardModal();

        if (index === 0) {
            // RIDE AGAIN
            this.startSlideRun();
        } else if (index === 1) {
            // EXPLORE WING
            this.returnToRoomMode();
        } else if (index === 2) {
            // BACK TO HUB
            this.returnToHub();
        }
    }

    destroyScoreboardModal() {
        this.completionMenuOpen = false;
        const elements = [
            this.modalBackdrop, this.modalCard, this.modalTitle, this.modalCheer,
            this.modalScore, this.modalStats, this.modalRecord, this.modalBadge,
            this.btnRideAgain, this.btnExploreWing, this.btnBackHub, this.menuCursor
        ];
        elements.forEach(el => {
            if (el) el.destroy();
        });
    }

    returnToRoomMode() {
        this.currentMode = 'ROOM';
        this.slideContainer.setVisible(false);
        this.slideHUD.setVisible(false);
        this.slideMobileButtons.setVisible(false);
        if (this.btnRideSlide) this.btnRideSlide.setVisible(true);

        if (!this.sys.game.device.os.desktop && this.roomMobileControls) {
            this.roomMobileControls.setVisible(true);
        }

        // Restore camera following player
        this.cameras.main.setBounds(0, 0, this.roomW, this.roomH);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    }

    // =========================================================================
    // HUD & STANDALONE CONTROLS
    // =========================================================================

    setupRoomHUD() {
        const W = this.scale.width;

        // Top-Right: Return to Oceaneer Hub Button
        this.btnHubExit = this.add.text(W - 16, 16, '[ ◄ OCEANEER HUB ]', {
            fontSize: '9px',
            fill: '#FFD700',
            backgroundColor: '#000000',
            padding: { x: 8, y: 6 },
            fontFamily: '"Press Start 2P", monospace'
        }).setOrigin(1, 0).setScrollFactor(0).setDepth(2000).setInteractive({ useHandCursor: true });
        this.btnHubExit.on('pointerdown', () => this.returnToHub());

        // Top-Left: Prominent Ride Slide Button
        this.btnRideSlide = this.add.text(16, 16, '[ ★ RIDE PEPPERMINT SLIDE ★ ]', {
            fontSize: '9px',
            fill: '#00FFFF',
            backgroundColor: '#C8102E',
            padding: { x: 8, y: 6 },
            fontFamily: '"Press Start 2P", monospace'
        }).setOrigin(0, 0).setScrollFactor(0).setDepth(2000).setInteractive({ useHandCursor: true });
        this.btnRideSlide.on('pointerdown', () => this.startSlideRun());
    }

    setupControls() {
        // Keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keysWASD = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            esc: Phaser.Input.Keyboard.KeyCodes.ESC,
            e: Phaser.Input.Keyboard.KeyCodes.E
        });

        // ESC returns to hub
        this.input.keyboard.on('keydown-ESC', () => this.returnToHub());

        // Direct DOM safety release: guarantees keys are cleared even if OS drops keyup
        const resetKeyInputs = () => {
            if (this.cursors) {
                if (this.cursors.left) this.cursors.left.isDown = false;
                if (this.cursors.right) this.cursors.right.isDown = false;
                if (this.cursors.up) this.cursors.up.isDown = false;
                if (this.cursors.down) this.cursors.down.isDown = false;
                if (this.cursors.space) this.cursors.space.isDown = false;
            }
            if (this.keysWASD) {
                if (this.keysWASD.left) this.keysWASD.left.isDown = false;
                if (this.keysWASD.right) this.keysWASD.right.isDown = false;
                if (this.keysWASD.up) this.keysWASD.up.isDown = false;
                if (this.keysWASD.down) this.keysWASD.down.isDown = false;
                if (this.keysWASD.space) this.keysWASD.space.isDown = false;
                if (this.keysWASD.enter) this.keysWASD.enter.isDown = false;
                if (this.keysWASD.e) this.keysWASD.e.isDown = false;
            }
        };

        const onNativeKeyUp = (e) => {
            if (e.code === 'Space') {
                if (this.cursors && this.cursors.space) this.cursors.space.isDown = false;
                if (this.keysWASD && this.keysWASD.space) this.keysWASD.space.isDown = false;
            }
            if (e.key === 'Enter') {
                if (this.keysWASD && this.keysWASD.enter) this.keysWASD.enter.isDown = false;
            }
            if (['Alt', 'Meta', 'Control', 'Shift'].includes(e.key)) {
                resetKeyInputs();
            }
        };

        window.addEventListener('blur', resetKeyInputs);
        window.addEventListener('focus', resetKeyInputs);
        window.addEventListener('keyup', onNativeKeyUp);
        const onVisChange = () => { if (document.hidden) resetKeyInputs(); };
        document.addEventListener('visibilitychange', onVisChange);

        this._cleanWindowListeners = () => {
            window.removeEventListener('blur', resetKeyInputs);
            window.removeEventListener('focus', resetKeyInputs);
            window.removeEventListener('keyup', onNativeKeyUp);
            document.removeEventListener('visibilitychange', onVisChange);
        };

        this.events.once('shutdown', () => {
            if (this._cleanWindowListeners) {
                this._cleanWindowListeners();
            }
        });

        // Mobile On-Screen Controls for room exploration
        if (!this.sys.game.device.os.desktop) {
            this.setupMobileRoomControls();
        }

        // Tap-to-steer in Slide mode
        this.input.on('pointerdown', (pointer) => {
            if (this.currentMode === 'SLIDE' && !this.completionMenuOpen) {
                // Ignore top bar clicks
                if (pointer.y < 60) return;
                if (pointer.x < this.scale.width / 2) {
                    this.steerSlide(-1);
                } else {
                    this.steerSlide(1);
                }
            }
        });
    }

    setupMobileRoomControls() {
        const W = this.scale.width;
        const H = this.scale.height;

        this.roomMobileControls = this.add.container(0, 0).setScrollFactor(0).setDepth(2800);

        // D-Pad Left / Right on bottom-left
        const leftBtn = this.add.circle(50, H - 55, 28, 0x000000, 0.75).setStrokeStyle(2, 0xFFFFFF).setInteractive();
        this.add.text(50, H - 55, '◄', { fontSize: '12px', fill: '#FFFFFF', fontFamily: '"Press Start 2P"' }).setOrigin(0.5);
        leftBtn.on('pointerdown', () => { this.mobileInput.left = true; });
        leftBtn.on('pointerup', () => { this.mobileInput.left = false; });
        leftBtn.on('pointerout', () => { this.mobileInput.left = false; });

        const rightBtn = this.add.circle(115, H - 55, 28, 0x000000, 0.75).setStrokeStyle(2, 0xFFFFFF).setInteractive();
        this.add.text(115, H - 55, '►', { fontSize: '12px', fill: '#FFFFFF', fontFamily: '"Press Start 2P"' }).setOrigin(0.5);
        rightBtn.on('pointerdown', () => { this.mobileInput.right = true; });
        rightBtn.on('pointerup', () => { this.mobileInput.right = false; });
        rightBtn.on('pointerout', () => { this.mobileInput.right = false; });

        // Action & Jump buttons on bottom-right
        const jumpBtn = this.add.circle(W - 115, H - 55, 28, 0x005588, 0.8).setStrokeStyle(2, 0xFFFFFF).setInteractive();
        this.add.text(W - 115, H - 55, 'JUMP', { fontSize: '7px', fill: '#FFFFFF', fontFamily: '"Press Start 2P"' }).setOrigin(0.5);
        jumpBtn.on('pointerdown', () => this.tryJump());

        const actBtn = this.add.circle(W - 50, H - 55, 28, 0xFF4081, 0.8).setStrokeStyle(2, 0xFFFFFF).setInteractive();
        this.add.text(W - 50, H - 55, 'ACT', { fontSize: '7px', fill: '#FFFFFF', fontFamily: '"Press Start 2P"' }).setOrigin(0.5);
        actBtn.on('pointerdown', () => this.handleActionTrigger());

        this.roomMobileControls.add([leftBtn, rightBtn, jumpBtn, actBtn]);
    }

    tryJump() {
        if (this.currentMode === 'ROOM' && !this.isJumping) {
            this.isJumping = true;
            this.jumpV = 280;
            this.playAudio('jump');
            if (this.charData.jumpKey) {
                this.player.setTexture(this.charData.jumpKey);
            }
        }
    }

    handleActionTrigger() {
        if (this.activeStation) {
            this.triggerStation(this.activeStation.name, this.activeStation.x, this.activeStation.y);
        } else {
            this.startSlideRun();
        }
    }

    playAudio(soundName) {
        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
            retroArcadeAudio.play(soundName);
        }
    }

    // =========================================================================
    // SCENE LOOP & UPDATE
    // =========================================================================

    update(time, delta) {
        if (this.isExiting) return;

        // Completion modal navigation
        if (this.completionMenuOpen) {
            if (time < this.menuReadyTime) return;

            const isUp = (this.cursors.up && Phaser.Input.Keyboard.JustDown(this.cursors.up)) ||
                         (this.keysWASD.up && Phaser.Input.Keyboard.JustDown(this.keysWASD.up));
            const isDown = (this.cursors.down && Phaser.Input.Keyboard.JustDown(this.cursors.down)) ||
                           (this.keysWASD.down && Phaser.Input.Keyboard.JustDown(this.keysWASD.down));

            if (isUp) {
                this.menuSelectionIndex = (this.menuSelectionIndex + 2) % 3;
                this.playAudio('laser');
                this.updateMenuVisuals();
            } else if (isDown) {
                this.menuSelectionIndex = (this.menuSelectionIndex + 1) % 3;
                this.playAudio('laser');
                this.updateMenuVisuals();
            }

            const isConfirm = (this.keysWASD.enter && Phaser.Input.Keyboard.JustDown(this.keysWASD.enter)) ||
                              (this.keysWASD.space && Phaser.Input.Keyboard.JustDown(this.keysWASD.space)) ||
                              (this.cursors.space && Phaser.Input.Keyboard.JustDown(this.cursors.space));

            if (isConfirm) {
                this.confirmMenuChoice();
            }
            return;
        }

        // Slide Run Mini-Game Mode
        if (this.currentMode === 'SLIDE') {
            const isLeft = (this.cursors.left && Phaser.Input.Keyboard.JustDown(this.cursors.left)) ||
                           (this.keysWASD.left && Phaser.Input.Keyboard.JustDown(this.keysWASD.left));
            const isRight = (this.cursors.right && Phaser.Input.Keyboard.JustDown(this.cursors.right)) ||
                            (this.keysWASD.right && Phaser.Input.Keyboard.JustDown(this.keysWASD.right));

            if (isLeft) this.steerSlide(-1);
            if (isRight) this.steerSlide(1);

            this.updateSlideRun(time, delta);
            return;
        }

        // 2.5D Room Mode Player Movement
        this.updateRoomMovement(time, delta);

        // Proximity detection to Vanellope, Ralph, Slide, Alcoves, Exit
        this.updateRoomProximity();
    }

    updateRoomMovement(time, delta) {
        if (!this.player) return;

        const isLeft = (this.cursors.left && this.cursors.left.isDown) ||
                       (this.keysWASD.left && this.keysWASD.left.isDown) ||
                       this.mobileInput.left;

        const isRight = (this.cursors.right && this.cursors.right.isDown) ||
                        (this.keysWASD.right && this.keysWASD.right.isDown) ||
                        this.mobileInput.right;

        const isJump = (this.cursors.up && Phaser.Input.Keyboard.JustDown(this.cursors.up)) ||
                       (this.keysWASD.up && Phaser.Input.Keyboard.JustDown(this.keysWASD.up)) ||
                       (this.keysWASD.space && Phaser.Input.Keyboard.JustDown(this.keysWASD.space)) ||
                       (this.cursors.space && Phaser.Input.Keyboard.JustDown(this.cursors.space));

        if (isJump) {
            this.tryJump();
        }

        let vx = 0;
        if (isLeft) {
            vx = -this.playerSpeed;
            this.facing = 'left';
            this.player.setFlipX(true);
        } else if (isRight) {
            vx = this.playerSpeed;
            this.facing = 'right';
            this.player.setFlipX(false);
        }

        // Horizontal position clamping
        this.player.x = Phaser.Math.Clamp(this.player.x + (vx * (delta / 1000)), 50, this.roomW - 50);

        // 2.5D Jump physics
        if (this.isJumping) {
            this.jumpZ += this.jumpV * (delta / 1000);
            this.jumpV -= 850 * (delta / 1000);
            if (this.jumpZ <= 0) {
                this.jumpZ = 0;
                this.jumpV = 0;
                this.isJumping = false;
            }
        }

        this.player.y = this.groundY - this.jumpZ;

        // Shadow follow
        if (this.playerShadow) {
            this.playerShadow.x = this.player.x;
            this.playerShadow.y = this.groundY + 16;
            this.playerShadow.setScale(1 - Math.min(0.5, this.jumpZ / 120));
        }

        // Animation update
        if (!this.isJumping) {
            if (vx !== 0) {
                if (this.charData.walkAnim && this.anims.exists(this.charData.walkAnim)) {
                    this.player.anims.play(this.charData.walkAnim, true);
                }
            } else {
                this.player.anims.stop();
                this.player.setTexture(this.charData.idleKey);
            }
        }
    }

    updateRoomProximity() {
        const px = this.player.x;
        const stations = [
            { name: 'exit', x: this.stationExitX, prompt: '[ ENTER: RETURN TO HUB ]', radius: 55 },
            { name: 'alcove', x: 320, prompt: '[ ENTER: REST IN CANDY ALCOVE ]', radius: 65 },
            { name: 'alcove', x: 580, prompt: '[ ENTER: REST IN CANDY ALCOVE ]', radius: 65 },
            { name: 'vanellope', x: this.vanellopeX, prompt: '[ ENTER: TALK TO VANELLOPE ]', radius: 65 },
            { name: 'slide', x: this.slideX - 40, prompt: '[ ENTER / SPACE: RIDE PEPPERMINT SLIDE! ]', radius: 75 },
            { name: 'ralph', x: this.ralphX, prompt: '[ ENTER: TALK TO RALPH ]', radius: 75 },
            { name: 'stairs', x: this.stairsX, prompt: '[ ENTER: DECK 3 STAIRWAY ]', radius: 70 }
        ];

        let found = null;
        for (const st of stations) {
            if (Math.abs(px - st.x) <= st.radius) {
                found = st;
                break;
            }
        }

        this.activeStation = found;

        if (found) {
            this.actionPrompt.setText(found.prompt);
            this.actionPrompt.setPosition(this.player.x, this.player.y - 48);
            this.actionPrompt.setVisible(true);

            // Interaction key check (ENTER or E)
            const isInteract = (this.keysWASD.enter && Phaser.Input.Keyboard.JustDown(this.keysWASD.enter)) ||
                               (this.keysWASD.e && Phaser.Input.Keyboard.JustDown(this.keysWASD.e)) ||
                               (found.name === 'slide' && this.keysWASD.space && Phaser.Input.Keyboard.JustDown(this.keysWASD.space));

            if (isInteract) {
                this.triggerStation(found.name, found.x, this.floorY - 40);
            }
        } else {
            this.actionPrompt.setVisible(false);
        }
    }

    // =========================================================================
    // SCENE EXIT CONTRACT
    // =========================================================================

    returnToHub() {
        if (this.isExiting) return;
        this.isExiting = true;

        if (this.oceaneerHub && this.oceaneerHub.scene) {
            this.oceaneerHub.scene.setVisible(true);
            this.oceaneerHub.scene.resume('OceaneerClubScene');
        } else if (this.gameScene && this.gameScene.scene) {
            this.gameScene.scene.setVisible(true);
            if (this.gameScene.scene.isSleeping()) {
                this.gameScene.scene.wake();
            }
        }

        this.scene.stop('RalphSlideWingScene');
    }
}
