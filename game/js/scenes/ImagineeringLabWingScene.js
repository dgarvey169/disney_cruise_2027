// =========================================================================
// WALT DISNEY IMAGINEERING LAB WING SCENE (#45)
// Disney's Oceaneer Club (Deck 2) - Disney Destiny
// =========================================================================

// Safe fallback helpers for Oceaneer Club progress and active character data
function getSafeOceaneerProgress() {
    if (typeof getOceaneerProgress === 'function') {
        try {
            return getOceaneerProgress();
        } catch (e) {}
    }
    try {
        const raw = localStorage.getItem('disney_destiny_oceaneer_progress');
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') return parsed;
        }
    } catch (e) {}
    return {
        imagineeringCoasterScore: 0,
        imagineeringCoasterName: 'DESTINY EXPRESS',
        figmentPrinted: false,
        imagineeringBadge: false
    };
}

function saveSafeOceaneerProgress(patch) {
    if (typeof saveOceaneerProgress === 'function') {
        try {
            return saveOceaneerProgress(patch);
        } catch (e) {}
    }
    try {
        const current = getSafeOceaneerProgress();
        const updated = Object.assign({}, current, patch || {});
        localStorage.setItem('disney_destiny_oceaneer_progress', JSON.stringify(updated));
        return updated;
    } catch (e) {
        return patch;
    }
}

function getSafeActiveCharacterData(gameScene) {
    if (typeof getActiveCharacterData === 'function') {
        try {
            return getActiveCharacterData(gameScene);
        } catch (e) {}
    }
    const selected = (gameScene && gameScene.selectedCharacter) ? gameScene.selectedCharacter : 'amelia';
    const isRiley = (selected === 'riley');
    return {
        charId: isRiley ? 'riley' : 'amelia',
        charName: isRiley ? 'RILEY' : 'AMELIA',
        displayName: isRiley ? 'Riley' : 'Amelia',
        idleKey: isRiley ? 'riley_idle' : 'amelia_idle',
        walkAnim: isRiley ? 'riley_walk' : 'amelia_walk',
        idleAnim: isRiley ? 'riley_idle' : 'amelia_idle',
        jumpKey: isRiley ? 'riley_jump' : 'amelia_jump',
        bodyOffsetY: isRiley ? 32 : 24
    };
}

// -------------------------------------------------------------------------
// ATTRACTION MAQUETTES DATA (From WDWNT Disney Destiny Oceaneer Club Tour)
// -------------------------------------------------------------------------
const WDI_MAQUETTES = [
    {
        id: 'panther',
        name: 'GRAND HALL BLACK PANTHER STATUE',
        location: 'DISNEY DESTINY ATRIUM (DECKS 3-5)',
        era: 'MAIDEN VOYAGE 2025',
        dwg: 'DWG #DD-GH-001',
        iconKey: 'wdi_maq_panther',
        accentColor: '#9B51E0',
        quote: '"In Wakanda, we honor courage, innovation, and nobility."',
        fact: "The heroic centerpiece of the Disney Destiny! Imagineers hand-sculpted this bronze-sheened Vibranium maquette of King T'Challa guarding the grand staircase beneath a celestial fiber-optic chandelier."
    },
    {
        id: 'pirates',
        name: 'PIRATES OF THE CARIBBEAN',
        location: 'NEW ORLEANS SQUARE & ADVENTURELAND',
        era: 'ORIGINAL 1967',
        dwg: 'DWG #DL-POTC-1967',
        iconKey: 'wdi_maq_pirates',
        accentColor: '#E29A38',
        quote: '"Dead men tell no tales..."',
        fact: "Masterminded by Marc Davis and Claude Coats! The original 1:24 scale dimensional maquettes established Disney's revolutionary flume boat drops, burning city fire illusions, and singing audio-animatronic buccaneers."
    },
    {
        id: 'dumbo',
        name: 'DUMBO THE FLYING ELEPHANT',
        location: 'FANTASYLAND AERIAL CAROUSEL',
        era: 'OPENING DAY 1955',
        dwg: 'DWG #DL-DUMBO-1955',
        iconKey: 'wdi_maq_dumbo',
        accentColor: '#56CCF2',
        quote: '"The very things that held ya down are gonna carry you up!"',
        fact: "Engineered with counter-weighted hydraulic lift arms and central spinning cams. Guests manipulate an onboard control joystick to soar high into the Fantasyland skies over circus music."
    },
    {
        id: 'baymax',
        name: 'THE HAPPY RIDE WITH BAYMAX',
        location: 'TOKYO DISNEYLAND (TOMORROWLAND)',
        era: 'TOMORROWLAND 2020',
        dwg: 'DWG #TDL-BAYMAX-2020',
        iconKey: 'wdi_maq_baymax',
        accentColor: '#FF4D4D',
        quote: '"Hello. I am Baymax, your personal healthcare companion."',
        fact: "Pairing dynamic electronic dance music with whipping turntable centrifugal physics! Imagineers designed rotating healthcare nurse-bots that pull passenger cruisers with delightful unexpected spins."
    },
    {
        id: 'jungle',
        name: 'JUNGLE CRUISE EXPEDITION',
        location: 'ADVENTURELAND RIVERS OF THE WORLD',
        era: 'OPENING DAY 1955',
        dwg: 'DWG #DL-JC-1955',
        iconKey: 'wdi_maq_jungle',
        accentColor: '#27AE60',
        quote: '"Behold! The eighth wonder of the world: the backside of water!"',
        fact: "Harper Goff sculpted early riverbed miniature models with a garden hose! The famous mechanical bathing elephants, dancing gorillas, and piranhas brought wild nature to life with deadpan skipper puns."
    },
    {
        id: 'teacup',
        name: 'MAD TEA PARTY',
        location: 'FANTASYLAND GARDENS',
        era: 'OPENING DAY 1955',
        dwg: 'DWG #DL-TEACUP-1955',
        iconKey: 'wdi_maq_teacup',
        accentColor: '#FF69B4',
        quote: '"A very merry unbirthday to you!"',
        fact: "Features three rotating sub-turntables nested within a massive 54-foot master turntable! Riders turn the center steering wheel to whip their pastel teacup at thrilling gyroscopic speeds."
    },
    {
        id: 'mainstreet',
        name: 'MAIN STREET U.S.A.',
        location: 'PARK ENTRANCE & TOWN SQUARE',
        era: 'DISNEYLAND 1955 / MK 1971',
        dwg: 'DWG #MK-MSUSA-1971',
        iconKey: 'wdi_maq_mainstreet',
        accentColor: '#F2C94C',
        quote: '"Here you leave today and enter the world of yesterday, tomorrow and fantasy."',
        fact: "Engineered using architectural forced perspective! Second floors are scaled down to 5/8 size and third floors to 1/2 size, creating an illusion of grand height while keeping Victorian shopfronts warm and welcoming."
    },
    {
        id: 'toontown',
        name: "MICKEY'S TOONTOWN",
        location: 'ANIMATION RESIDENTIAL DISTRICT',
        era: 'ORIGINAL 1993 / REIMAGINED 2023',
        dwg: 'DWG #DL-TOON-1993',
        iconKey: 'wdi_maq_toontown',
        accentColor: '#2D9CDB',
        quote: '"Where the cartoons live, work, and play!"',
        fact: "An asymmetrical cartoon wonderland where no line is completely straight! Imagineers engineered curved stucco, wacky mailboxes, springy lampposts, and tactile gag props that bring hand-drawn animation into 3D reality."
    },
    {
        id: 'china',
        name: 'CHINA PAVILION (EPCOT)',
        location: 'EPCOT WORLD SHOWCASE',
        era: 'WORLD SHOWCASE 1982',
        dwg: 'DWG #EPCOT-CHINA-1982',
        iconKey: 'wdi_maq_china',
        accentColor: '#EB5757',
        quote: '"Harmony between Heaven, Earth, and Humanity."',
        fact: "Home to the exquisite Temple of Heaven (Hall of Prayer for Good Harvests). Imagineers replicated Beijing's acoustical geometry so perfectly that a whisper in the exact center echoes clearly throughout the rotunda."
    },
    {
        id: 'celebration',
        name: 'WORLD CELEBRATION & DREAMERS POINT',
        location: 'EPCOT CENTRAL GARDENS',
        era: 'EPCOT 2023',
        dwg: 'DWG #EPCOT-WC-2023',
        iconKey: 'wdi_maq_celebration',
        accentColor: '#00E5FF',
        quote: '"The greatest journey is the one we take together."',
        fact: "The modern heart of EPCOT featuring Dreamers Point with the life-sized bronze statue of Walt Disney, geometric planter gardens, and futuristic ground pavers illuminated with pulsing fiber-optic constellations."
    }
];

// -------------------------------------------------------------------------
// COASTER BUILDER CUSTOMIZATION OPTIONS
// -------------------------------------------------------------------------
const COASTER_OPTIONS = {
    launch: [
        {
            id: 'lim',
            name: 'LIM MAGNETIC LAUNCH',
            shortName: 'LIM LAUNCH',
            speedMph: 72,
            gForce: 3.8,
            color: 0x00E5FF,
            desc: 'Linear Induction Motors propel the train from 0 to 72 MPH in 2.6 seconds!'
        },
        {
            id: 'chain',
            name: 'CHAIN LIFT HILL',
            shortName: 'CHAIN LIFT',
            speedMph: 56,
            gForce: 3.2,
            color: 0xF8B800,
            desc: 'Classic rhythmic anti-rollback click-clack ascent before a plunging crest drop!'
        },
        {
            id: 'hyper',
            name: 'HYPER 90° DROP',
            shortName: 'HYPER DROP',
            speedMph: 80,
            gForce: 4.5,
            color: 0xFF3333,
            desc: 'A breathless holding brake at the precipice followed by a 90° vertical plunge!'
        }
    ],
    feature: [
        {
            id: 'loop',
            name: '360° VERTICAL LOOP',
            shortName: 'VERTICAL LOOP',
            gForceBonus: 1.1,
            color: 0x9B51E0,
            desc: 'A teardrop clothoid loop delivering full 360° upside-down inversion gravity!'
        },
        {
            id: 'corkscrew',
            name: 'TWIN CORKSCREW ROLL',
            shortName: 'CORKSCREW',
            gForceBonus: 0.9,
            color: 0x00FF88,
            desc: 'Double interlocking barrel rolls twisting riders sideways over the studio!'
        },
        {
            id: 'camelback',
            name: 'AIRTIME CAMELBACK HILLS',
            shortName: 'CAMELBACK',
            gForceBonus: 0.7,
            color: 0xFF69B4,
            desc: 'Parabolic airtime hills engineered for sustained negative-G weightlessness!'
        }
    ],
    showScene: [
        {
            id: 'pirates',
            name: 'PIRATES CANNON SPLASH',
            shortName: 'PIRATES SPLASH',
            themeBg: 0x081524,
            effectColor: 0x00D2FF,
            desc: 'Plunge past a firing pirate galleon with thunderous cannon bursts and water mist!'
        },
        {
            id: 'baymax',
            name: 'BAYMAX TURBO SPIN',
            shortName: 'BAYMAX TURBO',
            themeBg: 0x1A0924,
            effectColor: 0xFF2A85,
            desc: 'High-voltage flight tunnel with glowing jet thrusters and holographic cherry blossoms!'
        },
        {
            id: 'vibranium',
            name: 'BLACK PANTHER VIBRANIUM TUNNEL',
            shortName: 'VIBRANIUM TUNNEL',
            themeBg: 0x140526,
            effectColor: 0x9B51E0,
            desc: 'Wakandan sonic speedway lined with pulsing purple vibranium circuitry and sonic booms!'
        }
    ],
    trainTheme: [
        {
            id: 'rocket',
            name: 'SPACE ROCKET TRAIN',
            shortName: 'SPACE ROCKET',
            textureKey: 'wdi_train_rocket',
            color: 0x00E5FF,
            desc: 'Aerodynamic chrome rocket with glowing blue plasma afterburners!'
        },
        {
            id: 'mine',
            name: 'RUNAWAY MINE CAR',
            shortName: 'MINE TRAIN',
            textureKey: 'wdi_train_mine',
            color: 0xCC7A29,
            desc: 'Wild West wooden coaster car with brass lanterns and gold nuggets!'
        },
        {
            id: 'bobsled',
            name: 'MATTERHORN BOBSLED',
            shortName: 'BOBSLED',
            textureKey: 'wdi_train_bobsled',
            color: 0xE63946,
            desc: 'Streamlined scarlet alpine bobsled built for high-speed banked glacial turns!'
        }
    ]
};

// =========================================================================
// MAIN SCENE CLASS
// =========================================================================
class ImagineeringLabWingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ImagineeringLabWingScene' });
    }

    init(data) {
        this.oceaneerHub = data ? data.oceaneerHub : null;
        this.gameScene = (data && data.gameScene) ? data.gameScene : (this.oceaneerHub ? this.oceaneerHub.gameScene : null);
        this.charData = getSafeActiveCharacterData(this.gameScene);

        this.groundY = 440;
        this.jumpZ = 0;
        this.jumpV = 0;
        this.isJumping = false;
        this.isExiting = false;
        this.playerSpeed = 165;

        // Active Hard Hat state
        this.hasHardHat = false;

        // Current active modal / sub-mode ('none', 'maquettes', 'printer', 'coaster_draft', 'coaster_ride')
        this.activeSubMode = 'none';

        // Maquette showcase index
        this.currentMaquetteIdx = 0;

        // Coaster builder selection indices
        this.coasterSelections = {
            launch: 0,
            feature: 0,
            showScene: 0,
            trainTheme: 0
        };

        // Mobile touch controls state
        this.mobileInput = { left: false, right: false, up: false, down: false, jump: false, action: false };
    }

    create() {
        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.init) {
            retroArcadeAudio.init();
        }

        // Hide underlying scenes safely
        if (this.oceaneerHub && this.oceaneerHub.scene && this.oceaneerHub.scene.isActive()) {
            this.oceaneerHub.scene.pause('OceaneerClubScene');
            this.oceaneerHub.scene.setVisible(false);
        }
        if (this.gameScene && this.gameScene.scene && this.gameScene.scene.isActive()) {
            this.gameScene.scene.sleep();
            this.gameScene.scene.setVisible(false);
        }

        const W = this.scale.width;
        const H = this.scale.height;

        const roomH = Math.max(540, H);
        const roomW = Math.max(1600, W);
        this.roomW = roomW;
        this.roomH = roomH;

        const floorH = Math.max(140, Math.round(roomH * 0.24));
        const floorY = roomH - floorH;
        this.floorY = floorY;
        this.floorH = floorH;
        this.groundY = floorY + 35;

        this.physics.world.setBounds(0, 0, roomW, roomH);

        // Solid background to prevent any leaking
        this.add.rectangle(0, 0, 10000, 10000, 0x051322).setOrigin(0.5).setDepth(0);

        // Generate procedural 8-bit NES textures
        this.createTextures();

        // 1. Room Background & Blueprint Framing
        this.add.tileSprite(roomW / 2, floorY / 2, roomW, floorY, 'wdi_blueprint_wall').setDepth(1);
        this.add.tileSprite(roomW / 2, floorY + (floorH / 2), roomW, floorH, 'wdi_lab_floor').setDepth(2);

        // Hazard warning stripe curb
        this.add.tileSprite(roomW / 2, floorY - 4, roomW, 8, 'wdi_hazard_strip').setDepth(3);

        // Brass and cyan trim divider line
        const divider = this.add.graphics().setDepth(4);
        divider.fillStyle(0x00E5FF, 1);
        divider.fillRect(0, floorY - 7, roomW, 3);
        divider.fillStyle(0xF8B800, 0.9);
        divider.fillRect(0, floorY, roomW, 2);

        // Blueprint Ceiling Trusses & Laboratory Track Spotlights
        for (let tx = 100; tx < roomW; tx += 180) {
            this.add.rectangle(tx, 14, 160, 12, 0x0d2845).setDepth(5).setStrokeStyle(1, 0x00ffff, 0.4);
            this.add.circle(tx, 22, 5, 0x00E5FF).setDepth(5);
            // Ambient downward light cone
            const lightBeam = this.add.graphics().setDepth(5);
            lightBeam.fillStyle(0x00E5FF, 0.04);
            lightBeam.beginPath();
            lightBeam.moveTo(tx - 6, 24);
            lightBeam.lineTo(tx + 6, 24);
            lightBeam.lineTo(tx + 40, floorY);
            lightBeam.lineTo(tx - 40, floorY);
            lightBeam.closePath();
            lightBeam.fillPath();
        }

        // Room Banner
        this.createRoomHeaders(roomW);

        // 2. Interactive Stations across the studio
        this.createStations(floorY);

        // 3. 2.5D Player Sprite
        this.createPlayer();

        // 4. Fixed HUD (Top Right Hub Button, Top Left Title, Badge Status)
        this.createHUD(W, H);

        // 5. Input Setup
        this.setupKeyboardInput();

        // Mobile Controls
        const isTouch = !this.sys.game.device.os.desktop || this.sys.game.device.input.touch;
        if (isTouch) {
            this.createMobileControls();
        }

        // Refresh stats on resume
        this.events.on('resume', () => {
            this.refreshBadgeHUD();
            if (this.input && this.input.keyboard) this.input.keyboard.resetKeys();
        });
    }

    // =========================================================================
    // ROOM HEADERS & BANNERS
    // =========================================================================
    createRoomHeaders(roomW) {
        const cx = roomW / 2;
        // Central Imagineering Compass Logo & Marquee
        const banner = this.add.rectangle(cx, 44, 460, 36, 0x041628, 0.9).setDepth(6).setStrokeStyle(2, 0x00E5FF);
        this.add.text(cx, 36, '★ WALT DISNEY IMAGINEERING LAB ★', {
            fontSize: '11px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00E5FF',
            stroke: '#002B49',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(7);
        this.add.text(cx, 52, 'DECK 2 • FROM SKETCH TO REALITY • RIDE STUDIO', {
            fontSize: '6px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#F8B800'
        }).setOrigin(0.5).setDepth(7);

        // Blueprint technical wall notes & formulas
        const notes = [
            { x: 260, y: 130, text: 'EQUATION OF THRILLS:\nv = √(2gh)' },
            { x: 570, y: 100, text: 'MAQUETTE SCALES:\n1:24 SCALE DRAFT' },
            { x: 920, y: 120, text: 'DISNEY DESTINY\nDISPLACEMENT: 144k GT' },
            { x: 1260, y: 110, text: 'COASTER G-LIMITS:\n+4.5G / -1.2G' }
        ];
        notes.forEach(n => {
            this.add.text(n.x, n.y, n.text, {
                fontSize: '6px',
                fontFamily: '"Press Start 2P", monospace',
                fill: '#15619B',
                lineSpacing: 4
            }).setDepth(5).setOrigin(0.5);
        });
    }

    // =========================================================================
    // PROCEDURAL TEXTURE GENERATION
    // =========================================================================
    createTextures() {
        // 1. Blueprint Wall Tile (64x64)
        if (!this.textures.exists('wdi_blueprint_wall')) {
            const g = this.add.graphics();
            g.fillStyle(0x061D33, 1);
            g.fillRect(0, 0, 64, 64);
            // Cyan grid lines
            g.lineStyle(1, 0x0C3A66, 0.7);
            for (let i = 0; i < 64; i += 16) {
                g.moveTo(i, 0); g.lineTo(i, 64);
                g.moveTo(0, i); g.lineTo(64, i);
            }
            g.lineStyle(1, 0x145A9B, 0.4);
            for (let i = 0; i < 64; i += 4) {
                g.moveTo(i, 0); g.lineTo(i, 64);
                g.moveTo(0, i); g.lineTo(64, i);
            }
            g.strokePath();
            // Tiny blueprint technical corner ticks
            g.fillStyle(0x00E5FF, 0.6);
            g.fillRect(0, 0, 2, 2);
            g.fillRect(62, 0, 2, 2);
            g.fillRect(0, 62, 2, 2);
            g.fillRect(62, 62, 2, 2);
            g.generateTexture('wdi_blueprint_wall', 64, 64);
            g.destroy();
        }

        // 2. Laboratory Floor Tile (64x64)
        if (!this.textures.exists('wdi_lab_floor')) {
            const g = this.add.graphics();
            g.fillStyle(0x182430, 1);
            g.fillRect(0, 0, 64, 64);
            g.fillStyle(0x1F2F3F, 1);
            g.fillRect(2, 2, 60, 60);
            g.lineStyle(1, 0x0B1520, 1);
            g.strokeRect(0, 0, 64, 64);
            // Center rivet / tech dot
            g.fillStyle(0x00E5FF, 0.35);
            g.fillCircle(32, 32, 2);
            g.generateTexture('wdi_lab_floor', 64, 64);
            g.destroy();
        }

        // 3. Hazard Warning Stripe (32x8)
        if (!this.textures.exists('wdi_hazard_strip')) {
            const g = this.add.graphics();
            g.fillStyle(0x111111, 1);
            g.fillRect(0, 0, 32, 8);
            g.fillStyle(0xF8B800, 1);
            for (let x = -8; x < 40; x += 10) {
                g.beginPath();
                g.moveTo(x, 8);
                g.lineTo(x + 6, 0);
                g.lineTo(x + 10, 0);
                g.lineTo(x + 4, 8);
                g.closePath();
                g.fillPath();
            }
            g.generateTexture('wdi_hazard_strip', 32, 8);
            g.destroy();
        }

        // 4. Imagineer Yellow Hard Hat Accessory (18x12)
        if (!this.textures.exists('wdi_hard_hat')) {
            const g = this.add.graphics();
            // Yellow dome
            g.fillStyle(0xF8B800, 1);
            g.fillRect(3, 2, 12, 6);
            g.fillRect(5, 0, 8, 3);
            // Brim
            g.fillStyle(0xE0A000, 1);
            g.fillRect(0, 8, 18, 3);
            // Shine highlight
            g.fillStyle(0xFFFFAA, 1);
            g.fillRect(6, 1, 4, 2);
            // Mickey / compass logo
            g.fillStyle(0x000000, 1);
            g.fillRect(8, 4, 2, 2);
            g.fillRect(7, 3, 1, 1);
            g.fillRect(10, 3, 1, 1);
            g.generateTexture('wdi_hard_hat', 18, 12);
            g.destroy();
        }

        // 5. Figment Dragon Sprite (28x28)
        if (!this.textures.exists('wdi_figment_sprite')) {
            const g = this.add.graphics();
            // Purple body
            g.fillStyle(0x7D3C98, 1);
            g.fillRect(8, 8, 12, 14);
            // Head
            g.fillRect(10, 4, 11, 7);
            // Lavender snout
            g.fillStyle(0xBB8FCE, 1);
            g.fillRect(16, 7, 6, 4);
            // Orange horns
            g.fillStyle(0xE67E22, 1);
            g.fillRect(9, 1, 3, 4);
            g.fillRect(15, 1, 3, 4);
            // Yellow Eyes with dark pupil
            g.fillStyle(0xF1C40F, 1);
            g.fillRect(12, 4, 3, 3);
            g.fillRect(16, 4, 3, 3);
            g.fillStyle(0x000000, 1);
            g.fillRect(14, 5, 1, 2);
            g.fillRect(18, 5, 1, 2);
            // Golden belly scales
            g.fillStyle(0xF39C12, 1);
            g.fillRect(10, 13, 6, 7);
            // Pink / magenta wings
            g.fillStyle(0xEC407A, 1);
            g.fillRect(4, 8, 5, 8);
            g.fillRect(2, 6, 4, 4);
            // Tail with orange spine
            g.fillStyle(0x7D3C98, 1);
            g.fillRect(4, 18, 6, 4);
            g.fillRect(2, 16, 3, 3);
            g.fillStyle(0xE67E22, 1);
            g.fillRect(3, 15, 2, 2);
            // Feet
            g.fillStyle(0x5B2C6F, 1);
            g.fillRect(8, 22, 5, 4);
            g.fillRect(15, 22, 5, 4);
            g.generateTexture('wdi_figment_sprite', 28, 28);
            g.destroy();
        }

        // 6. Coaster Trains (Rocket, Mine Train, Bobsled) (44x22)
        if (!this.textures.exists('wdi_train_rocket')) {
            const g = this.add.graphics();
            // White & chrome body
            g.fillStyle(0xEEEEEE, 1);
            g.fillRect(4, 6, 36, 12);
            g.fillStyle(0x00E5FF, 1);
            g.fillRect(8, 2, 24, 5); // Cockpit canopy
            g.fillStyle(0x006699, 1);
            g.fillRect(0, 8, 6, 8);  // Nosecone
            // Blue thruster fins
            g.fillStyle(0x0088CC, 1);
            g.fillRect(36, 3, 6, 16);
            // Yellow running rails/wheels
            g.fillStyle(0x222222, 1);
            g.fillCircle(12, 20, 3);
            g.fillCircle(32, 20, 3);
            g.generateTexture('wdi_train_rocket', 44, 24);
            g.destroy();
        }

        if (!this.textures.exists('wdi_train_mine')) {
            const g = this.add.graphics();
            // Rustic wooden brown slats
            g.fillStyle(0x8B4513, 1);
            g.fillRect(4, 6, 36, 14);
            g.fillStyle(0xA0522D, 1);
            g.fillRect(6, 8, 32, 10);
            // Black iron banding
            g.fillStyle(0x222222, 1);
            g.fillRect(4, 6, 3, 14);
            g.fillRect(20, 6, 3, 14);
            g.fillRect(37, 6, 3, 14);
            // Front brass lantern
            g.fillStyle(0xF8B800, 1);
            g.fillRect(1, 8, 4, 6);
            // Iron Wheels
            g.fillStyle(0x444444, 1);
            g.fillCircle(10, 20, 4);
            g.fillCircle(32, 20, 4);
            g.generateTexture('wdi_train_mine', 44, 24);
            g.destroy();
        }

        if (!this.textures.exists('wdi_train_bobsled')) {
            const g = this.add.graphics();
            // Red and white Matterhorn bobsled
            g.fillStyle(0xD90429, 1);
            g.fillRect(4, 6, 36, 12);
            g.fillStyle(0xFFFFFF, 1);
            g.fillRect(8, 9, 28, 4); // White racing stripe
            g.fillStyle(0x2B2D42, 1);
            g.fillRect(2, 8, 5, 8);  // Curved nose
            // Silver ski runner struts
            g.fillStyle(0x8D99AE, 1);
            g.fillRect(6, 18, 32, 3);
            g.fillStyle(0x222222, 1);
            g.fillCircle(10, 21, 3);
            g.fillCircle(32, 21, 3);
            g.generateTexture('wdi_train_bobsled', 44, 24);
            g.destroy();
        }

        // 7. Maquette Display Icons (36x36 pixel art representations)
        this.createMaquetteIcons();
    }

    createMaquetteIcons() {
        const iconDefs = [
            {
                key: 'wdi_maq_panther',
                draw: (g) => {
                    g.fillStyle(0x1F0A2E, 1);
                    g.fillRect(6, 4, 24, 28);
                    g.fillStyle(0x9B51E0, 1);
                    g.fillRect(10, 8, 16, 20);
                    // Silver Vibranium necklace teeth
                    g.fillStyle(0xEEEEEE, 1);
                    g.fillRect(12, 22, 2, 4);
                    g.fillRect(17, 24, 2, 5);
                    g.fillRect(22, 22, 2, 4);
                    // Sleek mask eyes
                    g.fillStyle(0xFFFFFF, 1);
                    g.fillRect(12, 14, 4, 2);
                    g.fillRect(20, 14, 4, 2);
                }
            },
            {
                key: 'wdi_maq_pirates',
                draw: (g) => {
                    g.fillStyle(0x2E1F0A, 1);
                    g.fillRect(4, 14, 28, 16);
                    // Galleon masts
                    g.fillStyle(0x8B4513, 1);
                    g.fillRect(17, 4, 3, 20);
                    g.fillStyle(0xEEEEEE, 1);
                    g.fillRect(10, 6, 16, 8);
                    // Skull bones
                    g.fillStyle(0xFF4444, 1);
                    g.fillRect(15, 2, 6, 4);
                    g.fillStyle(0x00E5FF, 1);
                    g.fillRect(2, 28, 32, 4); // Water
                }
            },
            {
                key: 'wdi_maq_dumbo',
                draw: (g) => {
                    g.fillStyle(0x85929E, 1);
                    g.fillCircle(18, 18, 10);
                    // Pink ear trims
                    g.fillStyle(0xF48FB1, 1);
                    g.fillCircle(9, 18, 6);
                    g.fillCircle(27, 18, 6);
                    // Yellow circus hat & feather
                    g.fillStyle(0xF1C40F, 1);
                    g.fillRect(15, 5, 6, 5);
                    g.fillStyle(0xE74C3C, 1);
                    g.fillRect(17, 2, 2, 4);
                }
            },
            {
                key: 'wdi_maq_baymax',
                draw: (g) => {
                    // White head with two black dots connected by line
                    g.fillStyle(0xFF3333, 1);
                    g.fillRect(6, 6, 24, 24); // Red armor frame
                    g.fillStyle(0xFFFFFF, 1);
                    g.fillCircle(18, 18, 9);
                    g.fillStyle(0x000000, 1);
                    g.fillCircle(14, 18, 2);
                    g.fillCircle(22, 18, 2);
                    g.fillRect(14, 18, 8, 1);
                }
            },
            {
                key: 'wdi_maq_jungle',
                draw: (g) => {
                    // Striped canopy boat
                    g.fillStyle(0x1B4D3E, 1);
                    g.fillRect(4, 20, 28, 10);
                    g.fillStyle(0xF8B800, 1);
                    g.fillRect(6, 10, 24, 6);
                    g.fillStyle(0xC0392B, 1);
                    g.fillRect(10, 10, 4, 6);
                    g.fillRect(18, 10, 4, 6);
                    g.fillRect(24, 10, 4, 6);
                    // Blue river
                    g.fillStyle(0x2980B9, 1);
                    g.fillRect(2, 28, 32, 4);
                }
            },
            {
                key: 'wdi_maq_teacup',
                draw: (g) => {
                    // Whimsical spinning teacup
                    g.fillStyle(0xFF85A2, 1);
                    g.fillRect(8, 14, 20, 12);
                    g.fillStyle(0xFFD1DC, 1);
                    g.fillRect(6, 26, 24, 4); // Saucer
                    g.fillStyle(0xFF85A2, 1);
                    g.fillRect(26, 16, 4, 6); // Handle
                    // Gold swirl
                    g.fillStyle(0xF1C40F, 1);
                    g.fillRect(12, 18, 12, 3);
                }
            },
            {
                key: 'wdi_maq_mainstreet',
                draw: (g) => {
                    // Victorian clock tower facade
                    g.fillStyle(0x8D6E63, 1);
                    g.fillRect(8, 12, 20, 20);
                    g.fillStyle(0xD7CCC8, 1);
                    g.fillRect(11, 4, 14, 10); // Tower
                    g.fillStyle(0xF1C40F, 1);
                    g.fillCircle(18, 10, 3); // Clock face
                    g.fillStyle(0xB71C1C, 1);
                    g.fillRect(8, 22, 20, 3); // Awning
                }
            },
            {
                key: 'wdi_maq_toontown',
                draw: (g) => {
                    // Asymmetrical wacky cartoon house
                    g.fillStyle(0x3498DB, 1);
                    g.fillRect(6, 14, 22, 18);
                    g.fillStyle(0xE74C3C, 1);
                    // Crooked roof
                    g.beginPath();
                    g.moveTo(4, 14);
                    g.lineTo(16, 4);
                    g.lineTo(30, 12);
                    g.closePath();
                    g.fillPath();
                    // Yellow quirky window
                    g.fillStyle(0xF1C40F, 1);
                    g.fillRect(12, 18, 6, 6);
                }
            },
            {
                key: 'wdi_maq_china',
                draw: (g) => {
                    // Multi-tiered red and gold Temple of Heaven roof
                    g.fillStyle(0xC0392B, 1);
                    g.fillRect(10, 16, 16, 14);
                    // Blue & gold curved eaves
                    g.fillStyle(0x2980B9, 1);
                    g.fillRect(6, 14, 24, 4);
                    g.fillRect(8, 8, 20, 4);
                    g.fillStyle(0xF1C40F, 1);
                    g.fillRect(16, 3, 4, 5); // Golden finial spire
                }
            },
            {
                key: 'wdi_maq_celebration',
                draw: (g) => {
                    // EPCOT Spaceship Earth sphere
                    g.fillStyle(0xBDC3C7, 1);
                    g.fillCircle(18, 16, 11);
                    g.fillStyle(0x7F8C8D, 1);
                    // Geodesic facets
                    g.fillRect(14, 10, 4, 4);
                    g.fillRect(18, 14, 4, 4);
                    g.fillRect(12, 16, 4, 4);
                    // Dreamers Point Walt bronze statue base
                    g.fillStyle(0xD4AC0D, 1);
                    g.fillRect(14, 27, 8, 5);
                }
            }
        ];

        iconDefs.forEach(item => {
            if (!this.textures.exists(item.key)) {
                const g = this.add.graphics();
                // Framing tech box
                g.fillStyle(0x051E38, 1);
                g.fillRect(0, 0, 36, 36);
                g.lineStyle(1, 0x00E5FF, 0.8);
                g.strokeRect(0, 0, 36, 36);
                item.draw(g);
                g.generateTexture(item.key, 36, 36);
                g.destroy();
            }
        });
    }

    // =========================================================================
    // 2.5D INTERACTIVE STATIONS SETUP
    // =========================================================================
    createStations(floorY) {
        this.stations = [];

        // Station 0: Exit Door to Oceaneer Club Hub (x = 130)
        this.createHubPortalStation(130, floorY);

        // Station 1: Imagineer Hard-Hat & Vest Dress-Up Station (x = 450)
        this.createDressUpStation(450, floorY);

        // Station 2: Attraction Maquettes Showcase Pedestals (x = 800)
        this.createMaquettesStation(800, floorY);

        // Station 3: Figment 3D Printer Workstation (x = 1150)
        this.createPrinterStation(1150, floorY);

        // Station 4: Ride Studio Coaster CAD Simulator Console (x = 1450)
        this.createCoasterStation(1450, floorY);
    }

    createHubPortalStation(x, floorY) {
        // High-tech doorway back to Oceaneer Hub
        const g = this.add.graphics().setDepth(5);
        g.fillStyle(0x051E38, 1);
        g.fillRect(x - 45, floorY - 110, 90, 110);
        g.lineStyle(3, 0x00E5FF, 1);
        g.strokeRect(x - 45, floorY - 110, 90, 110);

        // Door frame lights
        g.fillStyle(0x00FFFF, 0.8);
        g.fillRect(x - 40, floorY - 105, 80, 8);

        this.add.text(x, floorY - 95, '◄ HUB', {
            fontSize: '9px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00FFFF'
        }).setOrigin(0.5).setDepth(6);

        // Pulsing portal ring
        const portalLight = this.add.rectangle(x, floorY - 45, 60, 75, 0x004080, 0.5).setDepth(6);
        this.tweens.add({
            targets: portalLight,
            alpha: 0.8,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        this.stations.push({
            id: 'hub_door',
            name: 'OCEANEER CLUB HUB',
            x: x,
            y: floorY,
            action: () => this.returnToHub()
        });
    }

    createDressUpStation(x, floorY) {
        // Imagineering Hard Hat & Drafting Worktable
        const g = this.add.graphics().setDepth(5);
        // Drafting table
        g.fillStyle(0x4A2E14, 1);
        g.fillRect(x - 45, floorY - 50, 90, 14);
        g.fillStyle(0x2B1A0A, 1);
        g.fillRect(x - 40, floorY - 36, 10, 36);
        g.fillRect(x + 30, floorY - 36, 10, 36);

        // Blueprints on desk
        g.fillStyle(0x0C3A66, 1);
        g.fillRect(x - 30, floorY - 58, 45, 8);
        g.fillStyle(0x00E5FF, 0.8);
        g.fillRect(x - 28, floorY - 56, 40, 2);

        // Imagineer Coat Rack with Hard Hat & Orange Vest
        g.fillStyle(0x555555, 1);
        g.fillRect(x + 28, floorY - 95, 6, 60);
        g.fillRect(x + 18, floorY - 35, 26, 4);

        // Displayed Hard Hat image
        this.add.image(x + 31, floorY - 95, 'wdi_hard_hat').setDepth(6).setScale(1.2);

        // Vest
        const vestG = this.add.graphics().setDepth(6);
        vestG.fillStyle(0xE65C00, 1);
        vestG.fillRect(x + 22, floorY - 80, 18, 22);
        vestG.fillStyle(0xF8B800, 1);
        vestG.fillRect(x + 24, floorY - 73, 14, 4);

        this.add.text(x, floorY - 110, 'IMAGINEER GEAR', {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#F8B800'
        }).setOrigin(0.5).setDepth(6);

        this.stations.push({
            id: 'dress_up',
            name: 'IMAGINEER DRESS-UP',
            x: x,
            y: floorY,
            action: () => this.toggleImagineerGear()
        });
    }

    createMaquettesStation(x, floorY) {
        // Pedestal showcase table with glass dome and spotlights
        const g = this.add.graphics().setDepth(5);
        // Pedestal base
        g.fillStyle(0x0B2A4A, 1);
        g.fillRect(x - 65, floorY - 45, 130, 45);
        g.lineStyle(2, 0x00E5FF, 1);
        g.strokeRect(x - 65, floorY - 45, 130, 45);

        // Acrylic Glass Dome
        g.fillStyle(0x00E5FF, 0.15);
        g.fillRect(x - 55, floorY - 85, 110, 40);
        g.lineStyle(1, 0x00E5FF, 0.6);
        g.strokeRect(x - 55, floorY - 85, 110, 40);

        // Show rotating miniature Black Panther maquette on pedestal
        const previewMaquette = this.add.image(x, floorY - 65, 'wdi_maq_panther').setDepth(6).setScale(1.2);
        this.tweens.add({
            targets: previewMaquette,
            y: floorY - 68,
            duration: 1200,
            yoyo: true,
            repeat: -1
        });

        this.add.text(x, floorY - 96, '★ ATTRACTION MAQUETTES ★', {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00E5FF'
        }).setOrigin(0.5).setDepth(6);

        this.add.text(x, floorY - 15, '10 HISTORIC MODELS', {
            fontSize: '6px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#F8B800'
        }).setOrigin(0.5).setDepth(6);

        this.stations.push({
            id: 'maquettes',
            name: 'ATTRACTION MAQUETTES',
            x: x,
            y: floorY,
            action: () => this.openMaquettesShowcase()
        });
    }

    createPrinterStation(x, floorY) {
        // 3D Printer Enclosure
        const g = this.add.graphics().setDepth(5);
        // Table
        g.fillStyle(0x0E2840, 1);
        g.fillRect(x - 55, floorY - 40, 110, 40);
        g.lineStyle(2, 0x00E5FF, 0.8);
        g.strokeRect(x - 55, floorY - 40, 110, 40);

        // Chamber
        g.fillStyle(0x04111E, 1);
        g.fillRect(x - 45, floorY - 100, 90, 60);
        g.lineStyle(2, 0x9B51E0, 1);
        g.strokeRect(x - 45, floorY - 100, 90, 60);

        // Internal Bed
        g.fillStyle(0x223344, 1);
        g.fillRect(x - 35, floorY - 50, 70, 8);

        // Laser scan line inside printer
        const scanLine = this.add.graphics().setDepth(6);
        scanLine.fillStyle(0x00FFFF, 0.8);
        scanLine.fillRect(x - 35, floorY - 80, 70, 2);
        this.tweens.add({
            targets: scanLine,
            y: 20,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        // Figment figurine placeholder or active sprite if printed
        const prog = getSafeOceaneerProgress();
        this.figmentDeskSprite = this.add.image(x, floorY - 62, 'wdi_figment_sprite')
            .setDepth(6)
            .setScale(1.1)
            .setAlpha(prog.figmentPrinted ? 1 : 0.35);

        this.add.text(x, floorY - 110, 'FIGMENT 3D PRINTER', {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#9B51E0'
        }).setOrigin(0.5).setDepth(6);

        this.stations.push({
            id: 'printer',
            name: '3D PRINTER STATION',
            x: x,
            y: floorY,
            action: () => this.openFigmentPrinter()
        });
    }

    createCoasterStation(x, floorY) {
        // High-Tech Coaster CAD Drafting Terminal
        const g = this.add.graphics().setDepth(5);
        // Big workstation desk
        g.fillStyle(0x06213B, 1);
        g.fillRect(x - 65, floorY - 50, 130, 50);
        g.lineStyle(2, 0xF8B800, 1);
        g.strokeRect(x - 65, floorY - 50, 130, 50);

        // Twin CRT monitors
        g.fillStyle(0x020B14, 1);
        g.fillRect(x - 55, floorY - 105, 50, 45);
        g.strokeRect(x - 55, floorY - 105, 50, 45);

        g.fillRect(x + 5, floorY - 105, 50, 45);
        g.strokeRect(x + 5, floorY - 105, 50, 45);

        // Monitor 1: Animated wireframe loop
        const loopG = this.add.graphics().setDepth(6);
        loopG.lineStyle(2, 0x00E5FF, 1);
        loopG.strokeCircle(x - 30, floorY - 82, 14);

        // Monitor 2: Speedometer gauge
        const speedG = this.add.graphics().setDepth(6);
        speedG.lineStyle(2, 0xF8B800, 1);
        speedG.strokeCircle(x + 30, floorY - 82, 14);
        speedG.fillStyle(0xFF3333, 1);
        speedG.fillCircle(x + 30, floorY - 82, 3);

        this.add.text(x, floorY - 118, '★ RIDE STUDIO COASTER BUILDER ★', {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#F8B800'
        }).setOrigin(0.5).setDepth(6);

        this.add.text(x, floorY - 20, 'CAD DRAFTING & SIMULATOR', {
            fontSize: '6px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00E5FF'
        }).setOrigin(0.5).setDepth(6);

        this.stations.push({
            id: 'coaster',
            name: 'COASTER BUILDER',
            x: x,
            y: floorY,
            action: () => this.openCoasterBuilder()
        });
    }

    // =========================================================================
    // 2.5D PLAYER CREATION & DYNAMICS
    // =========================================================================
    createPlayer() {
        const spawnX = 220;
        this.player = this.physics.add.sprite(spawnX, this.groundY, this.charData.idleKey).setDepth(Math.round(this.groundY));
        this.player.body.allowGravity = false;
        this.player.body.setSize(22, 16);
        this.player.body.setOffset(5, this.charData.bodyOffsetY);

        // Foot shadow
        this.playerShadow = this.add.ellipse(spawnX, this.groundY + 16, 26, 10, 0x000000, 0.45).setDepth(Math.round(this.groundY) - 1);

        // Hard Hat attachment sprite
        this.playerHat = this.add.image(spawnX, this.groundY - 26, 'wdi_hard_hat').setDepth(Math.round(this.groundY) + 1).setVisible(this.hasHardHat);

        // Station Prompt Text (floats above player)
        this.promptText = this.add.text(spawnX, this.groundY - 60, '', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#FFFF00',
            backgroundColor: '#000000',
            padding: { x: 8, y: 5 },
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(2000).setVisible(false).setInteractive({ useHandCursor: true });

        this.promptText.on('pointerdown', () => this.triggerCurrentStation());

        // Camera Follow
        this.cameras.main.setBounds(0, 0, this.roomW, this.roomH);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    }

    // =========================================================================
    // HUD & STANDALONE BUTTONS
    // =========================================================================
    createHUD(W, H) {
        // 1. Standalone Top-Right Return to Oceaneer Hub Button
        const exitBtn = this.add.container(W - 85, 24).setScrollFactor(0).setDepth(2000);
        const exitBg = this.add.rectangle(0, 0, 150, 28, 0x0A1F36, 0.95)
            .setStrokeStyle(2, 0x00E5FF)
            .setInteractive({ useHandCursor: true });
        const exitTxt = this.add.text(0, 0, '◄ OCEANEER HUB', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00FFFF'
        }).setOrigin(0.5);

        exitBg.on('pointerover', () => exitBg.setFillStyle(0x133960, 1));
        exitBg.on('pointerout', () => exitBg.setFillStyle(0x0A1F36, 0.95));
        exitBg.on('pointerdown', () => {
            if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) retroArcadeAudio.play('laser');
            this.returnToHub();
        });
        exitBtn.add([exitBg, exitTxt]);

        // 2. Top-Left Wing Badge & Title HUD
        const hudBox = this.add.container(12, 14).setScrollFactor(0).setDepth(2000);
        const hudBg = this.add.rectangle(130, 22, 260, 44, 0x041324, 0.88).setStrokeStyle(1, 0x00E5FF, 0.8);
        const hudTitle = this.add.text(12, 8, 'WDI LAB WING • DECK 2', {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#F8B800'
        });

        this.hudBadgeText = this.add.text(12, 24, '', {
            fontSize: '6px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00E5FF'
        });
        hudBox.add([hudBg, hudTitle, this.hudBadgeText]);

        // 3. Bottom Quick Navigation Bar for Mobile and Fast Access
        const quickBar = this.add.container(W / 2, H - 20).setScrollFactor(0).setDepth(1500);
        const quickStations = [
            { label: '🎨 MAQUETTES', x: -160, action: () => this.openMaquettesShowcase() },
            { label: '🖨 FIGMENT 3D', x: 0, action: () => this.openFigmentPrinter() },
            { label: '🎢 COASTER CAD', x: 160, action: () => this.openCoasterBuilder() }
        ];

        quickStations.forEach(s => {
            const btnBg = this.add.rectangle(s.x, 0, 140, 24, 0x051B33, 0.9)
                .setStrokeStyle(1, 0x00E5FF)
                .setInteractive({ useHandCursor: true });
            const btnTxt = this.add.text(s.x, 0, s.label, {
                fontSize: '7px',
                fontFamily: '"Press Start 2P", monospace',
                fill: '#FFFFFF'
            }).setOrigin(0.5);

            btnBg.on('pointerover', () => btnBg.setFillStyle(0x0C3E75, 1));
            btnBg.on('pointerout', () => btnBg.setFillStyle(0x051B33, 0.9));
            btnBg.on('pointerdown', () => {
                if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) retroArcadeAudio.play('powerup');
                s.action();
            });
            quickBar.add([btnBg, btnTxt]);
        });

        this.refreshBadgeHUD();
    }

    refreshBadgeHUD() {
        const prog = getSafeOceaneerProgress();
        const badgeStr = prog.imagineeringBadge ? '★ BADGE: EARNED' : '★ BADGE: LOCKED';
        const figStr = prog.figmentPrinted ? 'FIGMENT: [✔]' : 'FIGMENT: [--]';
        const coasterScore = prog.imagineeringCoasterScore || 0;
        this.hudBadgeText.setText(`${badgeStr} | ${figStr}\nCOASTER BEST: ${coasterScore} PTS`);

        if (this.figmentDeskSprite) {
            this.figmentDeskSprite.setAlpha(prog.figmentPrinted ? 1 : 0.35);
        }
    }

    // =========================================================================
    // KEYBOARD & INPUT SETUP
    // =========================================================================
    setupKeyboardInput() {
        if (this.input && this.input.keyboard) {
            this.input.keyboard.resetKeys();
            this.input.keyboard.addCapture([
                Phaser.Input.Keyboard.KeyCodes.UP,
                Phaser.Input.Keyboard.KeyCodes.DOWN,
                Phaser.Input.Keyboard.KeyCodes.LEFT,
                Phaser.Input.Keyboard.KeyCodes.RIGHT,
                Phaser.Input.Keyboard.KeyCodes.SPACE,
                Phaser.Input.Keyboard.KeyCodes.ENTER,
                Phaser.Input.Keyboard.KeyCodes.ESC,
                Phaser.Input.Keyboard.KeyCodes.W,
                Phaser.Input.Keyboard.KeyCodes.A,
                Phaser.Input.Keyboard.KeyCodes.S,
                Phaser.Input.Keyboard.KeyCodes.D
            ]);
        }

        if (this.game && this.game.canvas) {
            this.game.canvas.setAttribute('tabindex', '0');
            this.game.canvas.focus();
            this.game.canvas.addEventListener('click', () => {
                if (this.game && this.game.canvas) this.game.canvas.focus();
            });
        }

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keysWASD = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
            esc: Phaser.Input.Keyboard.KeyCodes.ESC
        });

        // ESC Key handling
        this.input.keyboard.on('keydown-ESC', () => {
            if (this.activeSubMode !== 'none') {
                this.closeActiveModal();
            } else {
                this.returnToHub();
            }
        });

        // DOM safety releases
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
            }
            this.mobileInput = { left: false, right: false, up: false, down: false, jump: false, action: false };
        };

        window.addEventListener('blur', resetKeyInputs);
        window.addEventListener('focus', resetKeyInputs);

        this._cleanWindowListeners = () => {
            window.removeEventListener('blur', resetKeyInputs);
            window.removeEventListener('focus', resetKeyInputs);
        };

        this.events.once('shutdown', () => {
            if (this._cleanWindowListeners) this._cleanWindowListeners();
        });
    }

    // =========================================================================
    // MOBILE TOUCH CONTROLS
    // =========================================================================
    createMobileControls() {
        const W = this.scale.width;
        const H = this.scale.height;

        // Virtual D-pad on bottom left
        const joyX = 80;
        const joyY = H - 90;

        const joyBase = this.add.circle(joyX, joyY, 50, 0x00E5FF, 0.2).setScrollFactor(0).setDepth(2500);
        const joyKnob = this.add.circle(joyX, joyY, 24, 0x00E5FF, 0.5).setScrollFactor(0).setDepth(2501);

        this.input.on('pointerdown', (ptr) => {
            if (ptr.x < W * 0.4 && ptr.y > H * 0.5) {
                this.joyActive = true;
                this.updateJoyPosition(ptr.x, ptr.y, joyX, joyY, joyKnob);
            }
        });

        this.input.on('pointermove', (ptr) => {
            if (this.joyActive) {
                this.updateJoyPosition(ptr.x, ptr.y, joyX, joyY, joyKnob);
            }
        });

        this.resetJoystick = () => {
            this.joyActive = false;
            if (joyKnob && joyKnob.active) {
                joyKnob.setPosition(joyX, joyY);
            }
            this.mobileInput.left = false;
            this.mobileInput.right = false;
            this.mobileInput.up = false;
            this.mobileInput.down = false;
        };

        this.input.on('pointerup', () => {
            this.resetJoystick();
        });

        // Action Buttons on bottom right
        const actX = W - 70;
        const actY = H - 85;

        // Jump Button
        const jumpBtn = this.add.circle(actX - 70, actY, 28, 0xF8B800, 0.75).setScrollFactor(0).setDepth(2500).setInteractive();
        this.add.text(actX - 70, actY, 'JUMP', { fontSize: '7px', fontFamily: '"Press Start 2P", monospace', fill: '#000000' }).setOrigin(0.5).setScrollFactor(0).setDepth(2501);
        jumpBtn.on('pointerdown', () => this.tryJump());

        // Interact / Action Button
        const actBtn = this.add.circle(actX, actY, 32, 0x00E5FF, 0.85).setScrollFactor(0).setDepth(2500).setInteractive();
        this.add.text(actX, actY, 'USE', { fontSize: '8px', fontFamily: '"Press Start 2P", monospace', fill: '#000000' }).setOrigin(0.5).setScrollFactor(0).setDepth(2501);
        actBtn.on('pointerdown', () => this.triggerCurrentStation());
    }

    updateJoyPosition(px, py, cx, cy, knob) {
        const dx = px - cx;
        const dy = py - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 45;
        const angle = Math.atan2(dy, dx);
        const clampedDist = Math.min(dist, maxDist);

        knob.setPosition(cx + Math.cos(angle) * clampedDist, cy + Math.sin(angle) * clampedDist);

        this.mobileInput.left = dx < -14;
        this.mobileInput.right = dx > 14;
        this.mobileInput.up = dy < -14;
        this.mobileInput.down = dy > 14;
    }

    // =========================================================================
    // UPDATE LOOP
    // =========================================================================
    update(time, delta) {
        if (this.isExiting) return;

        // Route input/update based on activeSubMode
        if (this.activeSubMode === 'coaster_ride') {
            this.updateCoasterRide(delta);
            return;
        }

        if (this.activeSubMode === 'maquettes') {
            if (Phaser.Input.Keyboard.JustDown(this.cursors.left) || Phaser.Input.Keyboard.JustDown(this.keysWASD.left)) {
                this.changeMaquette(-1);
            } else if (Phaser.Input.Keyboard.JustDown(this.cursors.right) || Phaser.Input.Keyboard.JustDown(this.keysWASD.right)) {
                this.changeMaquette(1);
            } else if (Phaser.Input.Keyboard.JustDown(this.keysWASD.enter)) {
                this.closeActiveModal();
            }
            return;
        }

        if (this.activeSubMode === 'printer') {
            if (Phaser.Input.Keyboard.JustDown(this.keysWASD.enter) || Phaser.Input.Keyboard.JustDown(this.keysWASD.space)) {
                this.start3DPrintSequence();
            }
            return;
        }

        if (this.activeSubMode === 'coaster_draft') {
            const categories = ['launch', 'feature', 'showScene', 'trainTheme'];
            if (this.draftSelectedRow === undefined) this.draftSelectedRow = 0;

            if (Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.keysWASD.up)) {
                this.draftSelectedRow = (this.draftSelectedRow - 1 + categories.length) % categories.length;
                this.highlightDraftRow();
            } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down) || Phaser.Input.Keyboard.JustDown(this.keysWASD.down)) {
                this.draftSelectedRow = (this.draftSelectedRow + 1) % categories.length;
                this.highlightDraftRow();
            } else if (Phaser.Input.Keyboard.JustDown(this.cursors.left) || Phaser.Input.Keyboard.JustDown(this.keysWASD.left)) {
                const cat = categories[this.draftSelectedRow];
                this.cycleCoasterChoice(cat, -1);
            } else if (Phaser.Input.Keyboard.JustDown(this.cursors.right) || Phaser.Input.Keyboard.JustDown(this.keysWASD.right)) {
                const cat = categories[this.draftSelectedRow];
                this.cycleCoasterChoice(cat, 1);
            } else if (Phaser.Input.Keyboard.JustDown(this.keysWASD.enter)) {
                this.launchCoasterSimulation();
            }
            return;
        }

        if (this.activeSubMode !== 'none') {
            return;
        }

        const dt = delta * 0.001;

        // Keyboard & mobile movement inputs
        const isLeft = (this.cursors.left && this.cursors.left.isDown) ||
                       (this.keysWASD.left && this.keysWASD.left.isDown) ||
                       this.mobileInput.left;

        const isRight = (this.cursors.right && this.cursors.right.isDown) ||
                        (this.keysWASD.right && this.keysWASD.right.isDown) ||
                        this.mobileInput.right;

        const isUp = (this.cursors.up && this.cursors.up.isDown) ||
                     (this.keysWASD.up && this.keysWASD.up.isDown) ||
                     this.mobileInput.up;

        const isDown = (this.cursors.down && this.cursors.down.isDown) ||
                       (this.keysWASD.down && this.keysWASD.down.isDown) ||
                       this.mobileInput.down;

        let moveX = 0;
        let moveY = 0;

        if (isLeft && !isRight) {
            moveX = -1;
            this.player.setFlipX(true);
            if (this.playerHat) this.playerHat.setFlipX(true);
        } else if (isRight && !isLeft) {
            moveX = 1;
            this.player.setFlipX(false);
            if (this.playerHat) this.playerHat.setFlipX(false);
        }

        if (isUp && !isDown) {
            moveY = -1;
        } else if (isDown && !isUp) {
            moveY = 1;
        }

        let vx = moveX * this.playerSpeed;
        let vy = moveY * (this.playerSpeed * 0.6);
        if (moveX !== 0 && moveY !== 0) {
            vx *= 0.7071;
            vy *= 0.7071;
        }

        // Jump Handling
        const isJump = Phaser.Input.Keyboard.JustDown(this.keysWASD.space) ||
                       Phaser.Input.Keyboard.JustDown(this.cursors.space);
        if (isJump && !this.isJumping) {
            this.tryJump();
        }

        if (this.isJumping) {
            this.jumpZ += this.jumpV * dt;
            this.jumpV -= 750 * dt;
            if (this.jumpZ <= 0) {
                this.jumpZ = 0;
                this.jumpV = 0;
                this.isJumping = false;
            }
        }

        // Apply 2.5D coordinates
        this.player.x += vx * dt;
        this.player.x = Phaser.Math.Clamp(this.player.x, 80, this.roomW - 80);

        this.groundY += vy * dt;
        this.groundY = Phaser.Math.Clamp(this.groundY, this.floorY - 10, this.roomH - 30);

        this.player.y = this.groundY - this.jumpZ;
        this.player.body.reset(this.player.x, this.player.y);
        this.player.setDepth(Math.round(this.groundY));

        // Sync Foot Shadow
        if (this.playerShadow) {
            this.playerShadow.setPosition(this.player.x, this.groundY + 16);
            this.playerShadow.setDepth(Math.round(this.groundY) - 1);
            const scaleFactor = 1 - (this.jumpZ / 120);
            this.playerShadow.setScale(Phaser.Math.Clamp(scaleFactor, 0.4, 1));
        }

        // Sync Hard Hat position if equipped
        if (this.playerHat && this.hasHardHat) {
            const hatOffsetY = (this.charData.charId === 'riley') ? 34 : 26;
            this.playerHat.setPosition(this.player.x, this.player.y - hatOffsetY);
            this.playerHat.setDepth(Math.round(this.groundY) + 1);
        }

        // Walk Animation
        if (moveX !== 0 || moveY !== 0) {
            if (this.anims.exists(this.charData.walkAnim)) {
                this.player.play(this.charData.walkAnim, true);
            }
        } else {
            if (this.anims.exists(this.charData.idleAnim)) {
                this.player.play(this.charData.idleAnim, true);
            } else {
                this.player.setTexture(this.charData.idleKey);
            }
        }

        // Proximity detection to stations
        this.checkStationProximity();
    }

    tryJump() {
        if (this.isJumping) return;
        this.isJumping = true;
        this.jumpV = 320;
        this.jumpZ = 1;
        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
            retroArcadeAudio.play('jump');
        }
    }

    checkStationProximity() {
        let nearestStation = null;
        let minDist = 75;

        for (const st of this.stations) {
            const dist = Phaser.Math.Distance.Between(this.player.x, this.groundY, st.x, st.y);
            if (dist < minDist) {
                minDist = dist;
                nearestStation = st;
            }
        }

        this.currentNearestStation = nearestStation;

        if (nearestStation) {
            this.promptText.setPosition(this.player.x, this.player.y - 56);
            this.promptText.setText(`[ ENTER/TAP: ${nearestStation.name} ]`);
            this.promptText.setVisible(true);

            // Handle ENTER / SPACE interaction
            if (Phaser.Input.Keyboard.JustDown(this.keysWASD.enter) ||
                (Phaser.Input.Keyboard.JustDown(this.keysWASD.space) && !this.isJumping)) {
                nearestStation.action();
            }
        } else {
            this.promptText.setVisible(false);
        }
    }

    triggerCurrentStation() {
        if (this.currentNearestStation) {
            this.currentNearestStation.action();
        }
    }

    // =========================================================================
    // STATION 1: IMAGINEER GEAR DRESS-UP
    // =========================================================================
    toggleImagineerGear() {
        this.hasHardHat = !this.hasHardHat;
        if (this.playerHat) {
            this.playerHat.setVisible(this.hasHardHat);
        }

        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
            retroArcadeAudio.play('powerup');
        }

        const msg = this.hasHardHat
            ? '★ IMAGINEER HARD HAT EQUIPPED!\n"From Sketch to Reality!"'
            : 'HARD HAT REMOVED';

        this.showStudioToast(msg, 0xF8B800);
    }

    showStudioToast(text, color) {
        if (this.toastText) this.toastText.destroy();
        const W = this.scale.width;
        this.toastText = this.add.text(W / 2, 80, text, {
            fontSize: '9px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#000000',
            backgroundColor: '#F8B800',
            padding: { x: 12, y: 8 },
            align: 'center',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setScrollFactor(0).setDepth(3000);

        this.tweens.add({
            targets: this.toastText,
            alpha: 0,
            delay: 1800,
            duration: 400,
            onComplete: () => {
                if (this.toastText) this.toastText.destroy();
            }
        });
    }

    // =========================================================================
    // STATION 2: ATTRACTION MAQUETTES SHOWCASE MODAL
    // =========================================================================
    openMaquettesShowcase() {
        this.activeSubMode = 'maquettes';
        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) retroArcadeAudio.play('laser');

        const W = this.scale.width;
        const H = this.scale.height;

        this.maquetteModal = this.add.container(W / 2, H / 2).setScrollFactor(0).setDepth(3000);

        // Modal backdrop overlay
        const overlay = this.add.rectangle(0, 0, W * 2, H * 2, 0x000000, 0.75).setInteractive();
        const boxW = Math.min(680, W - 40);
        const boxH = Math.min(460, H - 40);

        // Blueprint technical border frame
        const boxBg = this.add.rectangle(0, 0, boxW, boxH, 0x051E38, 0.98)
            .setStrokeStyle(3, 0x00E5FF);

        // Title banner
        const titleTxt = this.add.text(0, -boxH / 2 + 24, '★ ATTRACTION MAQUETTES & MODELS SHOWCASE ★', {
            fontSize: '9px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00E5FF'
        }).setOrigin(0.5);

        const subTitleTxt = this.add.text(0, -boxH / 2 + 40, 'WDWNT DISNEY DESTINY OCEANEER LAB ARCHIVE', {
            fontSize: '6px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#F8B800'
        }).setOrigin(0.5);

        // Maquette index display
        this.maqIndexText = this.add.text(0, -boxH / 2 + 60, '', {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#FFFFFF'
        }).setOrigin(0.5);

        // Model Preview Box
        const prevBox = this.add.rectangle(0, -50, 110, 110, 0x031020, 0.9).setStrokeStyle(2, 0x00E5FF);
        this.maqPreviewIcon = this.add.image(0, -50, 'wdi_maq_panther').setScale(2.2);

        // Model Name & DWG Code
        this.maqNameText = this.add.text(0, 22, '', {
            fontSize: '9px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00FFFF',
            align: 'center'
        }).setOrigin(0.5);

        this.maqDwgText = this.add.text(0, 40, '', {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#F8B800'
        }).setOrigin(0.5);

        // Model Location / Era
        this.maqLocationText = this.add.text(0, 58, '', {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#BBBBBB'
        }).setOrigin(0.5);

        // Fact text container
        this.maqFactText = this.add.text(0, 100, '', {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#E0F7FA',
            align: 'center',
            wordWrap: { width: boxW - 80 },
            lineSpacing: 5
        }).setOrigin(0.5);

        // Quote text
        this.maqQuoteText = this.add.text(0, 146, '', {
            fontSize: '6px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#9B51E0',
            align: 'center',
            wordWrap: { width: boxW - 90 }
        }).setOrigin(0.5);

        // Interactive Navigation Buttons: [◄ PREV] and [NEXT ►]
        const btnY = boxH / 2 - 36;
        const prevBtn = this.createModalButton(-130, btnY, '◄ PREV MODEL', () => this.changeMaquette(-1));
        const nextBtn = this.createModalButton(130, btnY, 'NEXT MODEL ►', () => this.changeMaquette(1));
        const closeBtn = this.createModalButton(0, btnY, '[ ✕ CLOSE ]', () => this.closeActiveModal(), 0xFF4444);

        this.maquetteModal.add([
            overlay, boxBg, titleTxt, subTitleTxt, this.maqIndexText,
            prevBox, this.maqPreviewIcon, this.maqNameText, this.maqDwgText,
            this.maqLocationText, this.maqFactText, this.maqQuoteText,
            prevBtn, nextBtn, closeBtn
        ]);

        this.updateMaquetteView();
    }

    changeMaquette(delta) {
        this.currentMaquetteIdx = (this.currentMaquetteIdx + delta + WDI_MAQUETTES.length) % WDI_MAQUETTES.length;
        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) retroArcadeAudio.play('laser');
        this.updateMaquetteView();
    }

    updateMaquetteView() {
        const item = WDI_MAQUETTES[this.currentMaquetteIdx];
        this.maqIndexText.setText(`MODEL ${this.currentMaquetteIdx + 1} OF ${WDI_MAQUETTES.length}`);
        this.maqPreviewIcon.setTexture(item.iconKey);
        this.maqNameText.setText(item.name);
        this.maqDwgText.setText(item.dwg);
        this.maqLocationText.setText(`${item.location} • ${item.era}`);
        this.maqFactText.setText(item.fact);
        this.maqQuoteText.setText(item.quote);
    }

    createModalButton(x, y, label, callback, strokeColor = 0x00E5FF) {
        const c = this.add.container(x, y);
        const bg = this.add.rectangle(0, 0, 130, 26, 0x082545, 0.9)
            .setStrokeStyle(1, strokeColor)
            .setInteractive({ useHandCursor: true });
        const txt = this.add.text(0, 0, label, {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#FFFFFF'
        }).setOrigin(0.5);

        bg.on('pointerover', () => bg.setFillStyle(0x114375, 1));
        bg.on('pointerout', () => bg.setFillStyle(0x082545, 0.9));
        bg.on('pointerdown', callback);

        c.add([bg, txt]);
        return c;
    }

    // =========================================================================
    // STATION 3: FIGMENT 3D PRINTER STATION
    // =========================================================================
    openFigmentPrinter() {
        this.activeSubMode = 'printer';
        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) retroArcadeAudio.play('powerup');

        const W = this.scale.width;
        const H = this.scale.height;

        this.printerModal = this.add.container(W / 2, H / 2).setScrollFactor(0).setDepth(3000);

        const overlay = this.add.rectangle(0, 0, W * 2, H * 2, 0x000000, 0.75).setInteractive();
        const boxW = Math.min(620, W - 40);
        const boxH = Math.min(440, H - 40);

        const boxBg = this.add.rectangle(0, 0, boxW, boxH, 0x071A2E, 0.98).setStrokeStyle(3, 0x9B51E0);

        // Header
        const headerTxt = this.add.text(0, -boxH / 2 + 24, '★ FIGMENT 3D PRINTER STATION ★', {
            fontSize: '9px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#9B51E0'
        }).setOrigin(0.5);

        const subTxt = this.add.text(0, -boxH / 2 + 40, 'ADDITIVE IMAGINEERING ACCELERATOR • EXTRUDER 215°C', {
            fontSize: '6px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#F8B800'
        }).setOrigin(0.5);

        // 3D Printing Chamber Visualization
        const chamberBg = this.add.rectangle(0, -40, 160, 140, 0x030B14, 0.95).setStrokeStyle(2, 0x9B51E0);
        // Print Bed
        this.add.rectangle(0, 20, 130, 8, 0x334455);

        // Progressive Figment Layer Sprite
        const prog = getSafeOceaneerProgress();
        this.figmentPrintSprite = this.add.image(0, -25, 'wdi_figment_sprite')
            .setScale(2.5)
            .setAlpha(prog.figmentPrinted ? 1 : 0);

        // Laser scan line
        this.laserScanG = this.add.graphics();
        this.laserScanG.fillStyle(0x00FFFF, 0.9);
        this.laserScanG.fillRect(-70, -85, 140, 3);
        this.laserScanG.setVisible(false);

        // Status Readout
        this.printerStatusText = this.add.text(0, 48, prog.figmentPrinted ? 'STATUS: FIGMENT PRINTED & BADGE UNLOCKED!' : 'STATUS: READY TO MATERIALIZE FIGMENT FIGURINE', {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: prog.figmentPrinted ? '#00FF88' : '#00E5FF'
        }).setOrigin(0.5);

        // Progress Bar
        this.printerProgBarBg = this.add.rectangle(0, 68, 260, 12, 0x000000).setStrokeStyle(1, 0x00E5FF);
        this.printerProgBarFill = this.add.rectangle(-130, 68, 0, 10, 0x9B51E0).setOrigin(0, 0.5);

        // Figment lore snippet
        const loreTxt = this.add.text(0, 100, '"Two tiny wings, eyes big and yellow,\nHorns of a steer, but a lovable fellow!\nFrom Journey Into Imagination at EPCOT."', {
            fontSize: '6px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#BB8FCE',
            align: 'center',
            lineSpacing: 4
        }).setOrigin(0.5);

        // Action Buttons: [PRINT FIGMENT] and [CLOSE]
        const btnY = boxH / 2 - 36;
        this.printBtn = this.createModalButton(-100, btnY, prog.figmentPrinted ? '↺ RE-PRINT' : '★ PRINT FIGMENT', () => this.start3DPrintSequence(), 0x9B51E0);
        const closeBtn = this.createModalButton(100, btnY, '[ ✕ CLOSE ]', () => this.closeActiveModal(), 0xFF4444);

        this.printerModal.add([
            overlay, boxBg, headerTxt, subTxt, chamberBg,
            this.figmentPrintSprite, this.laserScanG, this.printerStatusText,
            this.printerProgBarBg, this.printerProgBarFill, loreTxt,
            this.printBtn, closeBtn
        ]);
    }

    start3DPrintSequence() {
        if (this.isPrinting) return;
        this.isPrinting = true;
        this.printBtn.setVisible(false);

        this.figmentPrintSprite.setAlpha(0);
        this.laserScanG.setVisible(true);

        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
            retroArcadeAudio.play('laser');
        }

        // Animate laser scan and progress bar
        let printStep = 0;
        const totalSteps = 10;
        const stepInterval = 250;

        const timer = this.time.addEvent({
            delay: stepInterval,
            repeat: totalSteps,
            callback: () => {
                printStep++;
                const ratio = Math.min(1, printStep / totalSteps);
                this.printerProgBarFill.width = 260 * ratio;
                this.figmentPrintSprite.setAlpha(ratio);

                // Laser oscillates vertically
                const scanY = -85 + (ratio * 80);
                this.laserScanG.clear();
                this.laserScanG.fillStyle(0x00FFFF, 0.9);
                this.laserScanG.fillRect(-70, scanY, 140, 3);
                // Sparkle particles
                this.createPrinterSparks(0, scanY);

                this.printerStatusText.setText(`PRINTING: ${Math.round(ratio * 100)}% • MATERIALIZING SPARK`);

                if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play && printStep % 2 === 0) {
                    retroArcadeAudio.play('laser');
                }

                if (printStep >= totalSteps) {
                    this.finish3DPrintSequence();
                }
            }
        });
    }

    createPrinterSparks(cx, cy) {
        for (let i = 0; i < 4; i++) {
            const rx = cx + Phaser.Math.Between(-50, 50);
            const ry = cy + Phaser.Math.Between(-4, 4);
            const spark = this.add.text(rx, ry, '✦', { fontSize: '6px', fill: '#FFD700' }).setOrigin(0.5);
            this.printerModal.add(spark);
            this.tweens.add({
                targets: spark,
                alpha: 0,
                y: ry + Phaser.Math.Between(-15, 15),
                duration: 400,
                onComplete: () => spark.destroy()
            });
        }
    }

    finish3DPrintSequence() {
        this.isPrinting = false;
        this.laserScanG.setVisible(false);
        this.printBtn.setVisible(true);

        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
            retroArcadeAudio.play('powerup');
        }

        // Save progress!
        saveSafeOceaneerProgress({
            figmentPrinted: true,
            imagineeringBadge: true
        });

        this.printerStatusText.setText('★ COMPLETE: FIGMENT PRINTED & BADGE EARNED! ★');
        this.printerStatusText.setColor('#F8B800');

        this.refreshBadgeHUD();

        // Celebration banner
        this.showStudioToast('★ IMAGINEERING BADGE UNLOCKED! ★\n"One Little Spark of Inspiration!"', 0x9B51E0);
    }

    // =========================================================================
    // STATION 4: RIDE STUDIO COASTER BUILDER & TESTING SIMULATOR
    // =========================================================================
    openCoasterBuilder() {
        this.activeSubMode = 'coaster_draft';
        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) retroArcadeAudio.play('laser');

        const W = this.scale.width;
        const H = this.scale.height;

        this.coasterDraftModal = this.add.container(W / 2, H / 2).setScrollFactor(0).setDepth(3000);

        const overlay = this.add.rectangle(0, 0, W * 2, H * 2, 0x000000, 0.8).setInteractive();
        const boxW = Math.min(740, W - 30);
        const boxH = Math.min(480, H - 30);

        const boxBg = this.add.rectangle(0, 0, boxW, boxH, 0x051E38, 0.98).setStrokeStyle(3, 0xF8B800);

        // Header
        const header = this.add.text(0, -boxH / 2 + 22, '★ RIDE STUDIO COASTER BUILDER ★', {
            fontSize: '9px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#F8B800'
        }).setOrigin(0.5);

        const subhead = this.add.text(0, -boxH / 2 + 38, 'CUSTOMIZE 4 TRACK SEGMENTS & LAUNCH TEST SIMULATION', {
            fontSize: '6px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00E5FF'
        }).setOrigin(0.5);

        // 4 Segment Customization Rows
        const rowStartY = -130;
        const rowGap = 52;

        this.draftSelectedRow = 0;
        this.draftRowBoxes = [];
        this.segmentRowTexts = [];

        const categories = [
            { key: 'launch', label: '1. LAUNCH SYSTEM', items: COASTER_OPTIONS.launch },
            { key: 'feature', label: '2. TRACK FEATURE', items: COASTER_OPTIONS.feature },
            { key: 'showScene', label: '3. SHOW SCENE', items: COASTER_OPTIONS.showScene },
            { key: 'trainTheme', label: '4. COASTER TRAIN', items: COASTER_OPTIONS.trainTheme }
        ];

        categories.forEach((cat, idx) => {
            const ry = rowStartY + (idx * rowGap);
            // Row background box
            const rbox = this.add.rectangle(0, ry, boxW - 60, 44, 0x082545, 0.9).setStrokeStyle(1, 0x00E5FF, 0.6);
            this.draftRowBoxes.push(rbox);

            // Category label
            this.add.text(-boxW / 2 + 45, ry - 12, cat.label, {
                fontSize: '6px',
                fontFamily: '"Press Start 2P", monospace',
                fill: '#F8B800'
            });

            // Choice label
            const choiceTxt = this.add.text(0, ry + 2, '', {
                fontSize: '8px',
                fontFamily: '"Press Start 2P", monospace',
                fill: '#00FFFF'
            }).setOrigin(0.5);

            this.segmentRowTexts.push({ catKey: cat.key, textObj: choiceTxt });

            // Prev button [◄]
            const prevArrow = this.add.rectangle(-boxW / 2 + 65, ry + 2, 26, 20, 0x0C3E75)
                .setStrokeStyle(1, 0x00E5FF)
                .setInteractive({ useHandCursor: true });
            this.add.text(-boxW / 2 + 65, ry + 2, '◄', { fontSize: '8px', fontFamily: '"Press Start 2P", monospace', fill: '#FFFFFF' }).setOrigin(0.5);
            prevArrow.on('pointerdown', () => {
                this.draftSelectedRow = idx;
                this.cycleCoasterChoice(cat.key, -1);
            });

            // Next button [►]
            const nextArrow = this.add.rectangle(boxW / 2 - 65, ry + 2, 26, 20, 0x0C3E75)
                .setStrokeStyle(1, 0x00E5FF)
                .setInteractive({ useHandCursor: true });
            this.add.text(boxW / 2 - 65, ry + 2, '►', { fontSize: '8px', fontFamily: '"Press Start 2P", monospace', fill: '#FFFFFF' }).setOrigin(0.5);
            nextArrow.on('pointerdown', () => {
                this.draftSelectedRow = idx;
                this.cycleCoasterChoice(cat.key, 1);
            });

            this.coasterDraftModal.add([rbox, prevArrow, nextArrow]);
        });

        // Coaster Spec Readout Box
        const specY = 92;
        const specBox = this.add.rectangle(0, specY, boxW - 60, 40, 0x031224, 0.95).setStrokeStyle(1, 0xF8B800, 0.8);
        this.specSummaryText = this.add.text(0, specY, '', {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#FFFFFF',
            align: 'center',
            lineSpacing: 4
        }).setOrigin(0.5);

        // Buttons: [★ TEST RIDE SIMULATOR ★] and [CLOSE]
        const btnY = boxH / 2 - 32;
        const testBtn = this.add.container(-110, btnY);
        const testBg = this.add.rectangle(0, 0, 240, 32, 0xF8B800).setInteractive({ useHandCursor: true });
        const testTxt = this.add.text(0, 0, '★ TEST RIDE SIMULATOR ★', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#000000'
        }).setOrigin(0.5);
        testBg.on('pointerover', () => testBg.setFillStyle(0xFFD700));
        testBg.on('pointerout', () => testBg.setFillStyle(0xF8B800));
        testBg.on('pointerdown', () => this.launchCoasterSimulation());
        testBtn.add([testBg, testTxt]);

        const closeBtn = this.createModalButton(170, btnY, '[ ✕ RETURN ]', () => this.closeActiveModal(), 0xFF4444);

        this.coasterDraftModal.add([
            overlay, boxBg, header, subhead, specBox,
            this.specSummaryText, testBtn, closeBtn
        ]);

        this.updateCoasterDraftView();
    }

    highlightDraftRow() {
        if (!this.draftRowBoxes) return;
        this.draftRowBoxes.forEach((box, idx) => {
            if (idx === this.draftSelectedRow) {
                box.setStrokeStyle(2, 0xF8B800, 1);
                box.setFillStyle(0x0E3A6B, 0.95);
            } else {
                box.setStrokeStyle(1, 0x00E5FF, 0.6);
                box.setFillStyle(0x082545, 0.9);
            }
        });
    }

    cycleCoasterChoice(catKey, delta) {
        const items = COASTER_OPTIONS[catKey];
        this.coasterSelections[catKey] = (this.coasterSelections[catKey] + delta + items.length) % items.length;
        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) retroArcadeAudio.play('laser');
        this.updateCoasterDraftView();
    }

    updateCoasterDraftView() {
        this.segmentRowTexts.forEach(row => {
            const list = COASTER_OPTIONS[row.catKey];
            const idx = this.coasterSelections[row.catKey];
            row.textObj.setText(list[idx].name);
        });

        this.highlightDraftRow();

        const launch = COASTER_OPTIONS.launch[this.coasterSelections.launch];
        const feature = COASTER_OPTIONS.feature[this.coasterSelections.feature];
        const show = COASTER_OPTIONS.showScene[this.coasterSelections.showScene];
        const train = COASTER_OPTIONS.trainTheme[this.coasterSelections.trainTheme];

        const estSpeed = Math.round(launch.speedMph);
        const estG = (launch.gForce + feature.gForceBonus).toFixed(1);
        const excitement = Math.min(999, Math.round(300 + (estSpeed * 4.5) + (estG * 40)));

        this.specSummaryText.setText(
            `EST. TOP SPEED: ${estSpeed} MPH | MAX G-FORCE: ${estG} G | EXCITEMENT RATING: ${excitement} PTS\n` +
            `THEME: ${train.shortName} • SHOW: ${show.shortName}`
        );
    }

    // =========================================================================
    // COASTER SIMULATOR: LIVE TEST RIDE
    // =========================================================================
    launchCoasterSimulation() {
        if (this.coasterDraftModal) {
            this.coasterDraftModal.destroy();
            this.coasterDraftModal = null;
        }

        this.activeSubMode = 'coaster_ride';
        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
            retroArcadeAudio.play('powerup');
        }

        const W = this.scale.width;
        const H = this.scale.height;

        this.simContainer = this.add.container(0, 0).setScrollFactor(0).setDepth(4000);

        // Simulation Stage Canvas
        this.simBg = this.add.rectangle(W / 2, H / 2, W, H, 0x040D1A).setInteractive();
        this.simTrackG = this.add.graphics();
        this.simSceneryG = this.add.graphics();

        // HUD Elements for Simulation
        this.simScore = 200;
        this.simBoostCount = 0;
        this.simSpeed = 0;
        this.simProgress = 0; // 0 to 1 along ride
        this.simApexTriggered = [false, false, false];

        this.simHudSpeed = this.add.text(20, 20, 'SPEED: 0 MPH', {
            fontSize: '9px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00E5FF'
        });

        this.simHudG = this.add.text(20, 36, 'G-FORCE: 1.0 G', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#F8B800'
        });

        this.simHudScore = this.add.text(W - 200, 20, 'SCORE: 200', {
            fontSize: '9px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00FF88'
        });

        // Boost Prompt Banner
        this.boostPrompt = this.add.text(W / 2, 70, '', {
            fontSize: '10px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#FFFF00',
            backgroundColor: '#000000',
            padding: { x: 12, y: 8 },
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setVisible(false);

        // Mobile On-Screen Boost Button
        this.mobileBoostBtn = this.add.rectangle(W / 2, H - 55, 220, 44, 0xF8B800, 0.9)
            .setStrokeStyle(2, 0xFFFFFF)
            .setInteractive({ useHandCursor: true });
        const boostBtnTxt = this.add.text(W / 2, H - 55, '★ TAP TO BOOST! ★', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#000000'
        }).setOrigin(0.5);

        this.mobileBoostBtn.on('pointerdown', () => this.tryApexBoost());

        // Selected train texture
        const train = COASTER_OPTIONS.trainTheme[this.coasterSelections.trainTheme];
        this.simTrainSprite = this.add.image(W * 0.1, H * 0.6, train.textureKey).setScale(1.4);

        // Rider (Amelia or Riley riding in front seat!)
        this.simRiderSprite = this.add.image(W * 0.1, H * 0.6 - 12, this.charData.idleKey).setScale(0.8);

        this.simContainer.add([
            this.simBg, this.simSceneryG, this.simTrackG,
            this.simTrainSprite, this.simRiderSprite,
            this.simHudSpeed, this.simHudG, this.simHudScore,
            this.boostPrompt, this.mobileBoostBtn, boostBtnTxt
        ]);

        // Key listener for boost during ride (SPACE or UP)
        this.rideBoostKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.rideUpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

        this.drawCoasterTrack(W, H);
    }

    drawCoasterTrack(W, H) {
        const g = this.simTrackG;
        g.clear();

        const launch = COASTER_OPTIONS.launch[this.coasterSelections.launch];
        const feature = COASTER_OPTIONS.feature[this.coasterSelections.feature];
        const show = COASTER_OPTIONS.showScene[this.coasterSelections.showScene];

        // Draw Show Scene Themed Backdrop
        this.simSceneryG.clear();
        this.simSceneryG.fillStyle(show.themeBg, 0.65);
        this.simSceneryG.fillRect(W * 0.52, H * 0.15, W * 0.32, H * 0.7);
        this.simSceneryG.lineStyle(2, show.effectColor, 0.8);
        this.simSceneryG.strokeRect(W * 0.52, H * 0.15, W * 0.32, H * 0.7);

        // Track Rail Glow
        g.lineStyle(4, 0x00E5FF, 0.85);

        // Calculate and draw track spline points
        const numSamples = 160;
        g.beginPath();
        for (let i = 0; i <= numSamples; i++) {
            const t = i / numSamples;
            const pt = this.getCoasterPoint(t, W, H);
            if (i === 0) g.moveTo(pt.x, pt.y);
            else g.lineTo(pt.x, pt.y);
        }
        g.strokePath();

        // Track Ties (sleepers)
        g.lineStyle(2, 0xF8B800, 0.6);
        for (let i = 0; i <= numSamples; i += 3) {
            const t = i / numSamples;
            const pt = this.getCoasterPoint(t, W, H);
            g.moveTo(pt.x - 4, pt.y + 4);
            g.lineTo(pt.x + 4, pt.y - 4);
        }
        g.strokePath();
    }

    getCoasterPoint(t, W, H) {
        // Parametric path across screen from left to right with hills, loop, and helix
        const feature = COASTER_OPTIONS.feature[this.coasterSelections.feature];
        const x = W * (0.05 + (t * 0.9));
        let y = H * 0.65;

        if (t < 0.25) {
            // Section 1: Launch stretch / initial drop
            const subT = t / 0.25;
            y = H * (0.65 - (Math.sin(subT * Math.PI) * 0.22));
        } else if (t >= 0.25 && t < 0.55) {
            // Section 2: Selected Feature (Loop, Corkscrew, or Camelback)
            const subT = (t - 0.25) / 0.3;
            if (feature.id === 'loop') {
                // Vertical loop inversion
                const angle = subT * Math.PI * 2;
                y = H * 0.55 - (Math.sin(angle) * (H * 0.28));
            } else if (feature.id === 'corkscrew') {
                // Corkscrew wave
                y = H * 0.55 - (Math.sin(subT * Math.PI * 3) * (H * 0.18));
            } else {
                // Triple Camelback hills
                y = H * 0.55 - (Math.abs(Math.sin(subT * Math.PI * 3)) * (H * 0.22));
            }
        } else if (t >= 0.55 && t < 0.8) {
            // Section 3: Show Scene Tunnel
            const subT = (t - 0.55) / 0.25;
            y = H * (0.58 + (Math.sin(subT * Math.PI * 2) * 0.1));
        } else {
            // Section 4: Banked helix and magnetic brake run
            const subT = (t - 0.8) / 0.2;
            y = H * (0.68 - (Math.sin(subT * Math.PI * 0.5) * 0.08));
        }

        return { x, y };
    }

    updateCoasterRide(delta) {
        const W = this.scale.width;
        const H = this.scale.height;

        const launch = COASTER_OPTIONS.launch[this.coasterSelections.launch];
        const feature = COASTER_OPTIONS.feature[this.coasterSelections.feature];
        const show = COASTER_OPTIONS.showScene[this.coasterSelections.showScene];

        // Progress speed along track
        const rideDurationSeconds = 12;
        this.simProgress += (delta * 0.001) / rideDurationSeconds;

        if (this.simProgress >= 1) {
            this.simProgress = 1;
            this.finishCoasterSimulation();
            return;
        }

        // Current coaster car position and tangent angle
        const curPt = this.getCoasterPoint(this.simProgress, W, H);
        const nextPt = this.getCoasterPoint(Math.min(1, this.simProgress + 0.01), W, H);

        const angle = Phaser.Math.Angle.Between(curPt.x, curPt.y, nextPt.x, nextPt.y);

        this.simTrainSprite.setPosition(curPt.x, curPt.y);
        this.simTrainSprite.setRotation(angle);

        // Rider follows train cockpit
        const riderOffsetDist = 10;
        this.simRiderSprite.setPosition(
            curPt.x - Math.sin(angle) * riderOffsetDist,
            curPt.y + Math.cos(angle) * (riderOffsetDist * 0.5) - 6
        );
        this.simRiderSprite.setRotation(angle);

        // Calculate dynamic speed and G-Force
        const baseSpeed = launch.speedMph;
        const speedFluctuation = Math.sin(this.simProgress * Math.PI * 6) * 12;
        this.simSpeed = Math.round(baseSpeed + speedFluctuation);
        const gForce = (1.2 + Math.abs(Math.sin(angle * 2) * 2.8)).toFixed(1);

        this.simHudSpeed.setText(`SPEED: ${this.simSpeed} MPH`);
        this.simHudG.setText(`G-FORCE: ${gForce} G`);
        this.simScore += Math.round(delta * 0.08);
        this.simHudScore.setText(`SCORE: ${this.simScore}`);

        // Apex Boost Opportunities (Apex 1: t ~ 0.22, Apex 2: t ~ 0.42, Apex 3: t ~ 0.68)
        this.checkApexWindows();

        // Keyboard boost check
        if (Phaser.Input.Keyboard.JustDown(this.rideBoostKey) || Phaser.Input.Keyboard.JustDown(this.rideUpKey)) {
            this.tryApexBoost();
        }
    }

    checkApexWindows() {
        const apexes = [
            { idx: 0, tStart: 0.18, tEnd: 0.26, label: '★ HIT SPACE / TAP FOR LAUNCH BOOST! ★' },
            { idx: 1, tStart: 0.38, tEnd: 0.46, label: '★ HIT SPACE / TAP FOR APEX LOOP BOOST! ★' },
            { idx: 2, tStart: 0.64, tEnd: 0.72, label: '★ HIT SPACE / TAP FOR SHOW TUNNEL BOOST! ★' }
        ];

        let inAnyApex = false;
        for (const ap of apexes) {
            if (this.simProgress >= ap.tStart && this.simProgress <= ap.tEnd) {
                inAnyApex = true;
                this.currentApexIdx = ap.idx;
                if (!this.simApexTriggered[ap.idx]) {
                    this.boostPrompt.setText(ap.label);
                    this.boostPrompt.setVisible(true);
                }
                break;
            }
        }

        if (!inAnyApex) {
            this.currentApexIdx = -1;
            this.boostPrompt.setVisible(false);
        }
    }

    tryApexBoost() {
        if (this.currentApexIdx !== -1 && !this.simApexTriggered[this.currentApexIdx]) {
            this.simApexTriggered[this.currentApexIdx] = true;
            this.simBoostCount++;
            this.simScore += 180;

            if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
                retroArcadeAudio.play('powerup');
            }

            this.boostPrompt.setText('★ PERFECT APEX BOOST! +180 PTS ★');
            this.boostPrompt.setColor('#00FF88');

            // Burst speed flames/sparks behind train
            this.createRideSparks(this.simTrainSprite.x, this.simTrainSprite.y);
        }
    }

    createRideSparks(x, y) {
        for (let i = 0; i < 8; i++) {
            const spark = this.add.text(x + Phaser.Math.Between(-15, 15), y + Phaser.Math.Between(-15, 15), '✦', {
                fontSize: '8px',
                fill: '#00E5FF'
            }).setOrigin(0.5);
            this.simContainer.add(spark);
            this.tweens.add({
                targets: spark,
                alpha: 0,
                scale: 2,
                duration: 500,
                onComplete: () => spark.destroy()
            });
        }
    }

    finishCoasterSimulation() {
        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
            retroArcadeAudio.play('powerup');
        }

        const W = this.scale.width;
        const H = this.scale.height;

        const launch = COASTER_OPTIONS.launch[this.coasterSelections.launch];
        const train = COASTER_OPTIONS.trainTheme[this.coasterSelections.trainTheme];
        const show = COASTER_OPTIONS.showScene[this.coasterSelections.showScene];

        const finalScore = this.simScore;
        const coasterFullName = `${train.shortName} • ${show.shortName}`;

        // Save progress!
        const prog = getSafeOceaneerProgress();
        saveSafeOceaneerProgress({
            imagineeringCoasterScore: Math.max(prog.imagineeringCoasterScore || 0, finalScore),
            imagineeringCoasterName: coasterFullName,
            imagineeringBadge: true
        });

        this.refreshBadgeHUD();

        // End-Of-Ride Report Dialog
        const reportCard = this.add.container(W / 2, H / 2).setScrollFactor(0).setDepth(5000);
        const cardBg = this.add.rectangle(0, 0, Math.min(620, W - 40), Math.min(380, H - 40), 0x051E38, 0.98)
            .setStrokeStyle(3, 0xF8B800);

        const cardTitle = this.add.text(0, -140, '★ IMAGINEERING RIDE SIMULATION COMPLETE ★', {
            fontSize: '9px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#F8B800'
        }).setOrigin(0.5);

        const cardCoaster = this.add.text(0, -112, coasterFullName, {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00E5FF'
        }).setOrigin(0.5);

        const cardStats = this.add.text(0, -40,
            `FINAL EXCITEMENT SCORE: ${finalScore} PTS\n\n` +
            `APEX BOOSTS HIT: ${this.simBoostCount} / 3\n` +
            `MAX SPEED: ${launch.speedMph} MPH\n` +
            `IMAGINEER RATING: SENIOR THRILL DESIGNER ★★★`, {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#FFFFFF',
            align: 'center',
            lineSpacing: 8
        }).setOrigin(0.5);

        const badgeNotif = this.add.text(0, 45, '★ IMAGINEERING BADGE REGISTERED IN OCEANEER LOG! ★', {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00FF88'
        }).setOrigin(0.5);

        // Buttons: [↺ REDESIGN], [★ RIDE AGAIN], [✕ EXIT TO LAB]
        const btnY = 110;
        const redesignBtn = this.createModalButton(-150, btnY, '↺ REDESIGN', () => {
            this.cleanupSimulation();
            this.openCoasterBuilder();
        }, 0x00E5FF);

        const rideAgainBtn = this.createModalButton(0, btnY, '★ RIDE AGAIN', () => {
            this.cleanupSimulation();
            this.launchCoasterSimulation();
        }, 0xF8B800);

        const exitBtn = this.createModalButton(150, btnY, '[ ✕ RETURN ]', () => {
            this.cleanupSimulation();
            this.activeSubMode = 'none';
        }, 0xFF4444);

        reportCard.add([cardBg, cardTitle, cardCoaster, cardStats, badgeNotif, redesignBtn, rideAgainBtn, exitBtn]);
        this.reportCard = reportCard;
    }

    cleanupSimulation() {
        if (this.reportCard) {
            this.reportCard.destroy();
            this.reportCard = null;
        }
        if (this.simContainer) {
            this.simContainer.destroy();
            this.simContainer = null;
        }
    }

    // =========================================================================
    // GENERAL MODAL CLEANUP
    // =========================================================================
    closeActiveModal() {
        if (this.maquetteModal) {
            this.maquetteModal.destroy();
            this.maquetteModal = null;
        }
        if (this.printerModal) {
            this.printerModal.destroy();
            this.printerModal = null;
        }
        if (this.coasterDraftModal) {
            this.coasterDraftModal.destroy();
            this.coasterDraftModal = null;
        }
        this.cleanupSimulation();
        this.activeSubMode = 'none';

        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
            retroArcadeAudio.play('laser');
        }
    }

    // =========================================================================
    // RETURN TO OCEANEER HUB
    // =========================================================================
    returnToHub() {
        if (this.isExiting) return;
        this.isExiting = true;

        if (this.resetJoystick) this.resetJoystick();
        if (this._cleanWindowListeners) this._cleanWindowListeners();

        if (this.oceaneerHub && this.oceaneerHub.scene) {
            this.oceaneerHub.scene.setVisible(true);
            this.oceaneerHub.scene.resume('OceaneerClubScene');
        }

        this.scene.stop('ImagineeringLabWingScene');
    }
}
