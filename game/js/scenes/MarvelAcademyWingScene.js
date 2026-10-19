// =========================================================================
// DISNEY'S OCEANEER CLUB: MARVEL SUPER HERO ACADEMY WING (#45)
// Disney Destiny - Deck 2 Oceaneer Club
// NES / Capcom 8-Bit Retro Aesthetic
// =========================================================================

// --- SAFE HELPER GUARDS FOR OCEANEER DATA & ACTIVE CHARACTER ---
function _mshaGetProgress() {
    if (typeof getOceaneerProgress === 'function') {
        try { return getOceaneerProgress(); } catch (e) {}
    }
    try {
        const raw = localStorage.getItem('disney_destiny_oceaneer_progress');
        if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
        marvelTrainingScore: 0,
        marvelSuitHero: 'WAKANDA VIBRANIUM',
        marvelSuitColor: 0x7858F8,
        marvelBadge: false
    };
}

function _mshaSaveProgress(patch) {
    if (typeof saveOceaneerProgress === 'function') {
        try { return saveOceaneerProgress(patch); } catch (e) {}
    }
    try {
        const cur = _mshaGetProgress();
        const updated = Object.assign({}, cur, patch || {});
        localStorage.setItem('disney_destiny_oceaneer_progress', JSON.stringify(updated));
        return updated;
    } catch (e) {
        return patch;
    }
}

function _mshaGetActiveCharacter(gameScene) {
    if (typeof getActiveCharacterData === 'function') {
        try { return getActiveCharacterData(gameScene); } catch (e) {}
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

// --- SUIT TECH CONFIGURATIONS (MODE 1: NANOTECH SUIT CUSTOMIZER) ---
const MARVEL_SUIT_CATALOG = [
    {
        id: 'wakanda',
        name: 'WAKANDA VIBRANIUM',
        hero: 'Black Panther',
        color: 0x7858F8,
        colorHex: '#7858F8',
        accentHex: '#B890FF',
        glowColor: 0x9B59B6,
        iconKey: 'msha_panther_helmet',
        specs: 'Kinetic Energy Micro-Weave Mesh',
        passive: '+25% Kinetic Shield & Shock Ripple',
        ultimateName: 'VIBRANIUM KINETIC SHOCKWAVE',
        ultimateDesc: 'Discharges absorbed kinetic energy in a massive sonic pulse that vaporizes all active drones!',
        blastName: 'Vibranium Kinetic Burst',
        blastColor: 0x9B59B6,
        blastGlow: 0xD8B4FE
    },
    {
        id: 'spiderman',
        name: 'WEB-SLINGER TECH',
        hero: 'Spider-Man',
        color: 0xE82020,
        colorHex: '#E82020',
        accentHex: '#00E5FF',
        glowColor: 0x00E5FF,
        iconKey: 'msha_spider_shooters',
        specs: 'Stark-Synthesized Dual Web Fluid',
        passive: '+30% Faster Fire Rate & Web Tether',
        ultimateName: 'WEB BARRAGE MATRIX',
        ultimateDesc: 'Criss-crosses the battlefield in high-tensile electro-webs, pinning and destroying all hostiles!',
        blastName: 'Stark Electro-Web Bolt',
        blastColor: 0x00D4FF,
        blastGlow: 0xFF4444
    },
    {
        id: 'pym',
        name: 'PYM QUANTUM WASP',
        hero: 'Ant-Man & The Wasp',
        color: 0x00E5FF,
        colorHex: '#00E5FF',
        accentHex: '#FFD700',
        glowColor: 0x00FFCC,
        iconKey: 'msha_pym_discs',
        specs: 'Subatomic Compression Regulators',
        passive: '+40% Precision Combo Bonus',
        ultimateName: 'QUANTUM PARTICLE BURST',
        ultimateDesc: 'Floods the grid with charged Pym particles, subatomically shrinking and dematerializing all targets!',
        blastName: 'Pym Quantum Particle Ray',
        blastColor: 0xFFD700,
        blastGlow: 0x00FFFF
    },
    {
        id: 'ironman',
        name: 'IRON NANO ARMOR',
        hero: 'Iron Man',
        color: 0xF8B800,
        colorHex: '#F8B800',
        accentHex: '#FF2200',
        glowColor: 0xF8B800,
        iconKey: 'msha_arc_core',
        specs: 'Mark LXXXV Gold-Titanium Nanobots',
        passive: '+50% Ultimate Recharge Speed',
        ultimateName: 'MARK LXXXV UNIBEAM',
        ultimateDesc: 'Channels full Arc Reactor core energy into an incandescent screen-clearing repulsor beam!',
        blastName: 'Arc Repulsor Plasma Bolt',
        blastColor: 0xFF4500,
        blastGlow: 0xFFEE00
    }
];

// --- ACADEMY ARCHIVES & DISPLAY CASES LORE (WDWNT TOUR) ---
const MARVEL_ARCHIVES_LORE = {
    webshooters: {
        title: 'SPIDER-MAN WEB-SHOOTERS',
        hero: 'PETER PARKER // STARK LABS',
        iconKey: 'msha_spider_shooters',
        tag: 'GADGET VAULT - STATION 01',
        desc: [
            'Twin wrist-mounted solenoids designed by Peter Parker with Tony Stark.',
            'Contains rapid-cycling pneumatic valves and multi-web selection:',
            '• High-tensile impact webbing (tensile strength: 300 psi)',
            '• Taser electro-burst coils & ricochet web-bombs',
            '• Micro-fluid cartridges auto-reloading in 0.4 seconds.'
        ],
        quote: '"Keep your wrists steady and let the webs do the work!" - Spider-Man'
    },
    panther: {
        title: 'BLACK PANTHER VIBRANIUM HELMET',
        hero: 'KING T\'CHALLA & PRINCESS SHURI',
        iconKey: 'msha_panther_helmet',
        tag: 'ROYAL VAULT - STATION 02',
        desc: [
            'Masterpiece of the Wakandan Design Group, woven from pure Vibranium.',
            'Stores mechanical and energy impact force at the subatomic level:',
            '• Kinetic purple luminescence indicates stored energy charge',
            '• Audio-dampening acoustic mesh for absolute silent stalking',
            '• Kimoyo bead encrypted holo-telemetry linked to Avengers Net.'
        ],
        quote: '"Vibranium absorbs the blow... and returns it twofold." - Black Panther'
    },
    pym: {
        title: 'PYM PARTICLES & WASP WINGS',
        hero: 'DR. HANK PYM & HOPE VAN DYNE',
        iconKey: 'msha_pym_discs',
        tag: 'QUANTUM VAULT - STATION 03',
        desc: [
            'Regulated Pym Particle discs for mass and distance alteration:',
            '• RED DISCS: Subatomic matter compression (instant shrinking)',
            '• BLUE DISCS: Molecular expansion (colossal gigantism)',
            '• Bio-synthetic quantum flutter wings with micro-stingers',
            '• Subatomic phase shifters safely bypass quantum foam.'
        ],
        quote: '"Size is an illusion when you command quantum physics." - The Wasp'
    },
    terminal: {
        title: 'AVENGERS HOLOGRAPHIC BRIEFING',
        hero: 'SPIDER-MAN & BLACK PANTHER',
        iconKey: 'msha_avengers_logo',
        tag: 'COMMAND CONSOLE // INTEL FEED',
        desc: [
            'TRANSMISSION FROM AVENGERS HEADQUARTERS TO DISNEY DESTINY:',
            '',
            'SPIDER-MAN: "Recruits! Welcome to the Marvel Super Hero Academy!',
            'The Destiny is cruising through uncharted dimensional waters.',
            'We need you battle-ready for any rogue drones or anomalies!"',
            '',
            'BLACK PANTHER: "Suit up at the Nanotech Fabricator to calibrate',
            'your armor. Then report to the Virtual Combat Simulator to test',
            'your reflexes in 25-second mission training. Wakanda Forever!"'
        ],
        quote: '"Suit up, recruit. Avengers Assemble!"'
    }
};

// =========================================================================
// MAIN SCENE CLASS
// =========================================================================
class MarvelAcademyWingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MarvelAcademyWingScene' });
    }

    // ---------------------------------------------------------------------
    // SCENE INITIALIZATION & CONTRACT
    // ---------------------------------------------------------------------
    init(data) {
        this.oceaneerHub = data ? data.oceaneerHub : null;
        this.gameScene = (data && data.gameScene) ? data.gameScene : (this.oceaneerHub ? this.oceaneerHub.gameScene : null);

        // Character contract
        this.charData = _mshaGetActiveCharacter(this.gameScene);

        // Core room flags
        this.isExiting = false;
        this.isModalOpen = false;
        this.inCombatSimulator = false;

        // Player movement physics (2.5D lab floor)
        this.playerSpeed = 190;
        this.jumpZ = 0;
        this.jumpV = 0;
        this.isJumping = false;
        this.groundY = 445;

        // Mobile touch input state
        this.mobileInput = { left: false, right: false, up: false, down: false };
        this.touchJoystick = null;

        // Progress & Suit configuration
        const prog = _mshaGetProgress();
        this.trainingHighScore = prog.marvelTrainingScore || 0;
        this.hasMarvelBadge = !!prog.marvelBadge;

        // Active suit resolution
        const savedSuitName = prog.marvelSuitHero || 'WAKANDA VIBRANIUM';
        const foundSuit = MARVEL_SUIT_CATALOG.find(s => s.name === savedSuitName) || MARVEL_SUIT_CATALOG[0];
        this.currentSuit = foundSuit;
        this.selectedSuitIndex = MARVEL_SUIT_CATALOG.indexOf(foundSuit);

        // Combat Simulator state
        this.simTimer = 25.0;
        this.simScore = 0;
        this.simCombo = 1;
        this.simMaxCombo = 1;
        this.simComboTimer = 0;
        this.simUltimateCharge = 25; // start with a head start
        this.simDronesNeutralized = 0;
        this.simActiveDrones = [];
        this.simActiveOrbs = [];
        this.simActiveBolts = [];
        this.simSpawnTimer = 0;
        this.simIsGameOver = false;

        // Station proximity tracker
        this.activeStation = null;
    }

    // ---------------------------------------------------------------------
    // SCENE CREATION & SETUP
    // ---------------------------------------------------------------------
    create() {
        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.init) {
            retroArcadeAudio.init();
        }

        // Hide and sleep underlying GameScene to prevent visual bleed
        if (this.gameScene && this.gameScene.scene) {
            this.gameScene.scene.setVisible(false);
            if (this.gameScene.scene.isActive()) {
                this.gameScene.scene.sleep();
            }
        }

        const W = this.scale.width;
        const H = this.scale.height;

        const roomH = Math.max(540, H);
        const roomW = Math.max(1600, W);
        this.roomW = roomW;
        this.roomH = roomH;

        const floorH = Math.max(135, Math.round(roomH * 0.23));
        const floorY = roomH - floorH;
        this.floorY = floorY;
        this.floorH = floorH;
        this.groundY = floorY + 30;

        this.physics.world.setBounds(0, 0, roomW, roomH);

        // 1. Procedural 8-bit texture initialization
        this.createTextures();

        // 2. Room Background: Solid obsidian backplate
        this.add.rectangle(0, 0, 10000, 10000, 0x050814).setOrigin(0.5).setDepth(0);

        // 3. Metallic Avengers Academy Wall & Trusses
        this.add.tileSprite(roomW / 2, floorY / 2, roomW, floorY, 'msha_wall_bg').setDepth(1).setAlpha(0.95);
        this.add.tileSprite(roomW / 2, floorY + (floorH / 2), roomW, floorH, 'msha_floor_bg').setDepth(2);

        // Glowing divider curb between wall and floor
        const curb = this.add.graphics().setDepth(3);
        curb.fillStyle(0x00E5FF, 1);
        curb.fillRect(0, floorY - 3, roomW, 3);
        curb.fillStyle(0xF8B800, 0.9);
        curb.fillRect(0, floorY, roomW, 2);

        // Ceiling High-Tech Rafters & Lighting
        for (let tx = 80; tx < roomW; tx += 180) {
            this.add.rectangle(tx, 14, 160, 12, 0x1A2236).setDepth(4);
            this.add.rectangle(tx, 22, 140, 4, 0x00E5FF, 0.8).setDepth(4);
            this.add.circle(tx - 45, 30, 5, 0xE0F7FA).setDepth(5);
            this.add.circle(tx + 45, 30, 5, 0xE0F7FA).setDepth(5);
        }

        // 4. Central Avengers "A" Emblem on back wall (x = 860)
        this.createAvengersWallEmblem(860, floorY - 145);

        // 5. Environmental Lab Stations
        // Station 0: Exit gateway back to Hub (x = 130)
        this.createExitGatewayStation(130, floorY);

        // Station 1: Spider-Man Web-Shooters Display (x = 340)
        this.createDisplayCaseStation(340, floorY, 'webshooters');

        // Station 2: Black Panther Vibranium Helmet Display (x = 520)
        this.createDisplayCaseStation(520, floorY, 'panther');

        // Station 3: Ant-Man & The Wasp Pym Particles Display (x = 700)
        this.createDisplayCaseStation(700, floorY, 'pym');

        // Station 4: Holographic Briefing Terminal (x = 860)
        this.createBriefingTerminalStation(860, floorY);

        // Station 5: Nanotech Super Suit Customizer & Mannequin (x = 1140)
        this.createNanotechMannequinStation(1140, floorY);

        // Station 6: "Avengers: Mission Training" Virtual Combat Bay (x = 1450)
        this.createCombatSimulatorBayStation(1450, floorY);

        // 6. 2.5D Player Sprite & Hero Aura
        const spawnX = 240;
        this.player = this.physics.add.sprite(spawnX, this.groundY, this.charData.idleKey)
            .setDepth(Math.round(this.groundY));
        this.player.body.allowGravity = false;
        this.player.body.setSize(22, 16);
        this.player.body.setOffset(5, this.charData.bodyOffsetY || 26);

        // Player Foot Shadow
        this.playerShadow = this.add.ellipse(spawnX, this.groundY + 16, 26, 10, 0x000000, 0.5)
            .setDepth(Math.round(this.groundY) - 1);

        // Player Nanotech Glowing Hero Aura (Equipped Suit Aura)
        this.playerAura = this.add.ellipse(spawnX, this.groundY - 10, 36, 48, this.currentSuit.glowColor, 0.28)
            .setDepth(Math.round(this.groundY) - 1);
        this.tweens.add({
            targets: this.playerAura,
            scaleX: 1.15,
            scaleY: 1.15,
            alpha: 0.45,
            duration: 700,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // 7. Camera Follow
        this.cameras.main.setBounds(0, 0, roomW, roomH);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        // 8. Station Interaction Floating Prompt
        this.promptText = this.add.text(spawnX, this.groundY - 55, '', {
            fontSize: '9px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00FFFF',
            backgroundColor: '#050D1E',
            padding: { x: 8, y: 5 },
            stroke: '#000000',
            strokeThickness: 3
        })
        .setOrigin(0.5)
        .setDepth(1500)
        .setVisible(false)
        .setInteractive({ useHandCursor: true });
        this.promptText.on('pointerdown', () => this.handleActiveStationTrigger());

        // 9. Permanent Top HUD & Navigation Buttons (ScrollFactor 0, Depth 2000)
        this.createTopHUD();

        // 10. Desktop Keyboard Controls & Native Blur/Focus safety
        this.setupKeyboardInput();

        // 11. Mobile Touch Controls (Virtual Joystick + Action buttons)
        const isTouch = !this.sys.game.device.os.desktop || this.sys.game.device.input.touch;
        if (isTouch) {
            this.createMobileTouchControls();
        }

        // 12. Create Modal Systems (Lore archives & Suit Customizer)
        this.createLoreModal();
        this.createSuitCustomizerModal();

        // 13. Create Combat Simulator Layer (Mode 2)
        this.createCombatSimulatorLayer();

        // Re-focus canvas on interaction
        if (this.game && this.game.canvas) {
            this.game.canvas.setAttribute('tabindex', '0');
            this.game.canvas.focus();
            this.game.canvas.addEventListener('click', () => {
                if (this.game && this.game.canvas) this.game.canvas.focus();
            });
        }

        // Cleanup hooks
        this.events.once('shutdown', () => {
            if (this._cleanWindowListeners) this._cleanWindowListeners();
        });
    }

    // ---------------------------------------------------------------------
    // PROCEDURAL 8-BIT TEXTURE GENERATOR
    // ---------------------------------------------------------------------
    createTextures() {
        // High-tech Wall Texture (msha_wall_bg)
        if (!this.textures.exists('msha_wall_bg')) {
            const g = this.add.graphics();
            g.fillStyle(0x0C1222, 1);
            g.fillRect(0, 0, 64, 64);
            g.lineStyle(1, 0x1E2B48, 1);
            g.strokeRect(0, 0, 64, 64);
            g.fillStyle(0x00E5FF, 0.4);
            g.fillRect(31, 0, 2, 64);
            g.fillStyle(0xF8B800, 0.6);
            g.fillRect(4, 4, 3, 3);
            g.fillRect(57, 4, 3, 3);
            g.fillRect(4, 57, 3, 3);
            g.fillRect(57, 57, 3, 3);
            g.generateTexture('msha_wall_bg', 64, 64);
            g.destroy();
        }

        // High-tech Hex/Grid Floor Texture (msha_floor_bg)
        if (!this.textures.exists('msha_floor_bg')) {
            const g = this.add.graphics();
            g.fillStyle(0x111626, 1);
            g.fillRect(0, 0, 64, 64);
            g.lineStyle(1, 0x005588, 0.5);
            g.strokeRect(0, 0, 64, 64);
            g.lineStyle(1, 0x00E5FF, 0.3);
            g.lineBetween(0, 32, 64, 32);
            g.lineBetween(32, 0, 32, 64);
            g.generateTexture('msha_floor_bg', 64, 64);
            g.destroy();
        }

        // Avengers Emblem (msha_avengers_logo)
        if (!this.textures.exists('msha_avengers_logo')) {
            const g = this.add.graphics();
            // Outer Ring
            g.lineStyle(5, 0xF8B800, 1);
            g.strokeCircle(48, 48, 40);
            g.lineStyle(2, 0x00E5FF, 1);
            g.strokeCircle(48, 48, 43);
            // Slanted "A"
            g.fillStyle(0xFFFFFF, 1);
            // Left leg
            g.beginPath();
            g.moveTo(32, 78);
            g.lineTo(44, 20);
            g.lineTo(52, 20);
            g.lineTo(40, 78);
            g.closePath();
            g.fillPath();
            // Right leg & arrow
            g.beginPath();
            g.moveTo(48, 20);
            g.lineTo(68, 78);
            g.lineTo(60, 78);
            g.lineTo(44, 34);
            g.closePath();
            g.fillPath();
            // Arrow bar
            g.fillStyle(0xF8B800, 1);
            g.fillRect(24, 48, 52, 8);
            g.beginPath();
            g.moveTo(76, 44);
            g.lineTo(88, 52);
            g.lineTo(76, 60);
            g.closePath();
            g.fillPath();
            g.generateTexture('msha_avengers_logo', 96, 96);
            g.destroy();
        }

        // Spider-Man Web-Shooters Icon
        this.generatePixelMatrix('msha_spider_shooters', 32, 24, [
            "....RRRRRRRR....",
            "...RSSSSSSSSSR..",
            "..RSWSSSSSSSWSR.",
            "..RSCSSSSSSSCSR.",
            ".RRRCCCCCCCCRRR.",
            ".BBSCCCCCCCBBS..",
            ".BBSCCCCCCCBBS..",
            ".RRRCCCCCCCCRRR.",
            "..RSCSSSSSSSCSR.",
            "..RSWSSSSSSSWSR.",
            "...RSSSSSSSSSR..",
            "....RRRRRRRR...."
        ], {
            'R': 0xE82020,
            'S': 0xC0C0C8,
            'W': 0xFFFFFF,
            'C': 0x00D4FF,
            'B': 0x111122
        }, 2);

        // Black Panther Vibranium Helmet Icon
        this.generatePixelMatrix('msha_panther_helmet', 32, 32, [
            "..KK........KK..",
            ".KKPK......KPKK.",
            ".KPPK......KPPK.",
            ".KPPKKKKKKKKPPK.",
            ".KKSSSSSSSSSSKK.",
            ".KSSPPPPPPPPSSK.",
            ".KSPSSSSSSSSPSK.",
            ".KSPSSWWSSWWPSK.",
            ".KSPSSWWSSWWPSK.",
            ".KSPSSSSSSSSPSK.",
            ".KKSSSPPPPSSSKK.",
            "..KSSSSSSSSSSK..",
            "..KSSSPPPPSSSK..",
            "...KSSPPPPSSK...",
            "....KSSSSSSK....",
            ".....KKKKKK....."
        ], {
            'K': 0x111118,
            'S': 0x484858,
            'P': 0x9B59B6,
            'W': 0xE8E8FF
        }, 2);

        // Pym Particle Discs Icon
        this.generatePixelMatrix('msha_pym_discs', 32, 24, [
            "...GG......GG...",
            "..GYYG....GYYG..",
            ".GYYYYG..GYYYYG.",
            ".GYSSRR..SSBBGY.",
            "GYSWRRRSYSWBBBYG",
            "GYSWRRRSYSWBBBYG",
            "GYSWRRRSYSWBBBYG",
            ".GYSSRR..SSBBGY.",
            ".GYYYYG..GYYYYG.",
            "..GYYG....GYYG..",
            "...GG......GG...",
            "................"
        ], {
            'G': 0xD4AF37,
            'Y': 0xFFE066,
            'S': 0xD0D0D8,
            'R': 0xE82020,
            'B': 0x00A0FF,
            'W': 0xFFFFFF
        }, 2);

        // Iron Man Arc Reactor Core Icon
        this.generatePixelMatrix('msha_arc_core', 32, 32, [
            ".....GGGGGG.....",
            "...GGCCGGCCGG...",
            "..GCWWCCCCWWCG..",
            ".GCWWCCCCCCWWCG.",
            ".GCWCCCWWCCCWCG.",
            "GCWCCWWWWWWCCWCG",
            "GCCWWWWWWWWWWCCG",
            "GCCWWWWWWWWWWCCG",
            "GCCWWWWWWWWWWCCG",
            "GCCWWWWWWWWWWCCG",
            "GCWCCWWWWWWCCWCG",
            ".GCWCCCWWCCCWCG.",
            ".GCWWCCCCCCWWCG.",
            "..GCWWCCCCWWCG..",
            "...GGCCGGCCGG...",
            ".....GGGGGG....."
        ], {
            'G': 0xF8B800,
            'C': 0x00E5FF,
            'W': 0xFFFFFF
        }, 2);

        // Ultron Sentry Drone (Combat Simulator)
        this.generatePixelMatrix('msha_drone_ultron', 36, 28, [
            ".......SSSS.......",
            ".....SSSSSSSS.....",
            "....SSKKKKKKSS....",
            "...SSKRRRRRRKSS...",
            "...SSRRWWWWRRSS...",
            "..SSSKRRRRRRKSSS..",
            "..SSSSKKKKKKSSSS..",
            ".SSSSSSSSSSSSSSSS.",
            ".SS..SSSSSSSS..SS.",
            "KK....SS..SS....KK",
            "......FF..FF......",
            "......YY..YY......",
            "..................",
            ".................."
        ], {
            'S': 0x8892B0,
            'K': 0x1E2438,
            'R': 0xFF0033,
            'W': 0xFFCCCC,
            'F': 0xFF6600,
            'Y': 0xFFCC00
        }, 2);

        // Hydra Recon Skimmer Drone
        this.generatePixelMatrix('msha_drone_hydra', 32, 24, [
            ".......GG.......",
            "......GYYG......",
            ".....GYYYYG.....",
            "....GGYYYYGG....",
            "...GKGGYYGGKG...",
            "..GKKKGGGGKKKG..",
            ".GKKKRRRRRRKKKG.",
            "GGKKRRWWWWRRKKGG",
            "GKKKRRRRRRKKKG..",
            "..KK..YYYY..KK..",
            "......FFFF......",
            "................"
        ], {
            'G': 0x1E824C,
            'Y': 0x2ECC71,
            'K': 0x0F381E,
            'R': 0xFF3333,
            'W': 0xFFFFFF,
            'F': 0xF39C12
        }, 2);

        // Heavy Armored Cyber Combat Bot
        this.generatePixelMatrix('msha_drone_heavy', 40, 36, [
            "......PPPPPPPP......",
            "....PPSSSSSSSSPP....",
            "...PSSSSSSSSSSSSPP..",
            "..PSSCCSSSSSSCCSSPP.",
            ".PSSCCWWSSSSWWCCSSPP",
            ".PSSCCWWSSSSWWCCSSPP",
            ".PSSSSSSSSSSSSSSSSPP",
            ".PSSSSKKKKKKSSSSSSPP",
            "PPSSSKCCKKCCKSSSSP..",
            "PPSSSKCCKKCCKSSSSP..",
            ".PSSSSKKKKKKSSSSSSPP",
            ".PSSSSSSSSSSSSSSSSPP",
            "..PPSSSSSSSSSSSSPP..",
            "....PP..SSSS..PP....",
            "........KKKK........",
            "........FFFF........",
            "........YYYY........",
            "...................."
        ], {
            'P': 0x5E35B1,
            'S': 0x7E57C2,
            'C': 0x00E5FF,
            'W': 0xFFFFFF,
            'K': 0x211047,
            'F': 0xE040FB,
            'Y': 0x80D8FF
        }, 2);

        // Targeting Crosshair
        this.generatePixelMatrix('msha_sim_crosshair', 36, 36, [
            "WWWW..........WWWW",
            "WCC............CCW",
            "WC..............CW",
            "W................W",
            "........WW........",
            "........WW........",
            "......WWCCWW......",
            "......WCCCCW......",
            "..WW..WCCCCW..WW..",
            "..WW..WCCCCW..WW..",
            "......WCCCCW......",
            "......WWCCWW......",
            "........WW........",
            "........WW........",
            "W................W",
            "WC..............CW",
            "WCC............CCW",
            "WWWW..........WWWW"
        ], {
            'W': 0xFFFFFF,
            'C': 0x00E5FF
        }, 2);

        // Plasma Hostile Orb
        if (!this.textures.exists('msha_plasma_orb')) {
            const g = this.add.graphics();
            g.fillStyle(0xFF2255, 1);
            g.fillCircle(10, 10, 8);
            g.fillStyle(0xFFFF88, 1);
            g.fillCircle(10, 10, 4);
            g.lineStyle(2, 0xFF88AA, 0.8);
            g.strokeCircle(10, 10, 9);
            g.generateTexture('msha_plasma_orb', 20, 20);
            g.destroy();
        }

        // Sparkling Nanotech Spark particle
        if (!this.textures.exists('msha_nano_spark')) {
            const g = this.add.graphics();
            g.fillStyle(0x00FFFF, 1);
            g.fillRect(0, 0, 6, 6);
            g.fillStyle(0xFFFFFF, 1);
            g.fillRect(1, 1, 4, 4);
            g.generateTexture('msha_nano_spark', 6, 6);
            g.destroy();
        }

        // Energy Blast Projectile Texture
        if (!this.textures.exists('msha_energy_bolt')) {
            const g = this.add.graphics();
            g.fillStyle(0xFFFFFF, 1);
            g.fillRect(4, 0, 8, 16);
            g.fillStyle(0x00E5FF, 1);
            g.fillRect(2, 2, 12, 12);
            g.generateTexture('msha_energy_bolt', 16, 16);
            g.destroy();
        }
    }

    generatePixelMatrix(key, width, height, rows, palette, scale = 2) {
        if (this.textures.exists(key)) return;
        const g = this.add.graphics();
        for (let y = 0; y < rows.length; y++) {
            const row = rows[y];
            for (let x = 0; x < row.length; x++) {
                const ch = row[x];
                if (ch !== '.' && palette[ch] !== undefined) {
                    g.fillStyle(palette[ch], 1);
                    g.fillRect(x * scale, y * scale, scale, scale);
                }
            }
        }
        g.generateTexture(key, width, height);
        g.destroy();
    }

    // ---------------------------------------------------------------------
    // LAB ENVIRONMENT & STATIONS
    // ---------------------------------------------------------------------
    createAvengersWallEmblem(x, y) {
        const logo = this.add.image(x, y, 'msha_avengers_logo').setDepth(3);
        const glowCircle = this.add.circle(x, y, 54, 0x00E5FF, 0.18).setDepth(2);
        this.tweens.add({
            targets: glowCircle,
            alpha: 0.35,
            scaleX: 1.12,
            scaleY: 1.12,
            duration: 1400,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.add.text(x, y + 58, '★ AVENGERS ACADEMY ★', {
            fontSize: '10px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#F8B800',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(4);
    }

    createExitGatewayStation(x, floorY) {
        // High-tech blast door leading to Oceaneer Club Hub
        const g = this.add.graphics().setDepth(3);
        g.fillStyle(0x0D1B2A, 1);
        g.fillRect(x - 36, floorY - 95, 72, 95);
        g.lineStyle(3, 0x00E5FF, 1);
        g.strokeRect(x - 36, floorY - 95, 72, 95);

        // Security airlock lights
        g.fillStyle(0x00FF88, 1);
        g.fillRect(x - 6, floorY - 85, 12, 6);

        this.add.text(x, floorY - 105, '◄ OCEANEER HUB', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00FF88',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(4);

        // Interactive click zone
        const zone = this.add.zone(x, floorY - 45, 80, 100).setInteractive({ useHandCursor: true });
        zone.on('pointerdown', () => this.returnToHub());
    }

    createDisplayCaseStation(x, floorY, loreType) {
        const lore = MARVEL_ARCHIVES_LORE[loreType];
        const g = this.add.graphics().setDepth(3);

        // Metallic Pedestal
        g.fillStyle(0x1A2236, 1);
        g.fillRect(x - 28, floorY - 32, 56, 32);
        g.lineStyle(2, 0xF8B800, 1);
        g.strokeRect(x - 28, floorY - 32, 56, 32);

        // Glowing Glass Case
        g.fillStyle(0x00E5FF, 0.22);
        g.fillRect(x - 24, floorY - 76, 48, 44);
        g.lineStyle(2, 0x00E5FF, 0.85);
        g.strokeRect(x - 24, floorY - 76, 48, 44);

        // Icon inside case
        const icon = this.add.image(x, floorY - 54, lore.iconKey).setDepth(4);
        this.tweens.add({
            targets: icon,
            y: floorY - 57,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Label Plaque
        this.add.text(x, floorY - 86, lore.title.split(' ')[0], {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#E0F7FA',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(4);

        // Interactive touch zone
        const zone = this.add.zone(x, floorY - 45, 60, 90).setInteractive({ useHandCursor: true });
        zone.on('pointerdown', () => this.openLoreModal(loreType));
    }

    createBriefingTerminalStation(x, floorY) {
        // Holographic Briefing Podium
        const g = this.add.graphics().setDepth(3);
        g.fillStyle(0x1B263B, 1);
        g.fillRect(x - 30, floorY - 40, 60, 40);
        g.lineStyle(2, 0x00E5FF, 1);
        g.strokeRect(x - 30, floorY - 40, 60, 40);

        // Holographic projector cone
        g.fillStyle(0x00E5FF, 0.18);
        g.beginPath();
        g.moveTo(x, floorY - 40);
        g.lineTo(x - 25, floorY - 95);
        g.lineTo(x + 25, floorY - 95);
        g.closePath();
        g.fillPath();

        // Floating mini hologram icon
        const holo = this.add.image(x, floorY - 75, 'msha_avengers_logo').setScale(0.35).setDepth(4).setTint(0x00FFFF);
        this.tweens.add({
            targets: holo,
            alpha: 0.5,
            y: floorY - 78,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        this.add.text(x, floorY - 105, '📡 BRIEFING TERMINAL', {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00FFFF',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(4);

        const zone = this.add.zone(x, floorY - 50, 70, 100).setInteractive({ useHandCursor: true });
        zone.on('pointerdown', () => this.openLoreModal('terminal'));
    }

    createNanotechMannequinStation(x, floorY) {
        // Mode 1: Nanotech Super Suit Customizer & Mannequin
        const g = this.add.graphics().setDepth(3);

        // Heavy armor pod containment base & top ring
        g.fillStyle(0x1C2237, 1);
        g.fillRect(x - 36, floorY - 24, 72, 24);
        g.lineStyle(3, 0xF8B800, 1);
        g.strokeRect(x - 36, floorY - 24, 72, 24);

        g.fillStyle(0x1C2237, 1);
        g.fillRect(x - 36, floorY - 110, 72, 14);
        g.lineStyle(2, 0x00E5FF, 1);
        g.strokeRect(x - 36, floorY - 110, 72, 14);

        // Transparent nanotech assembly glass cylinder
        g.fillStyle(0x00FFFF, 0.12);
        g.fillRect(x - 32, floorY - 96, 64, 72);
        g.lineStyle(2, 0x00FFFF, 0.7);
        g.strokeRect(x - 32, floorY - 96, 64, 72);

        // Mannequin Figure inside pod
        this.mannequinSprite = this.add.rectangle(x, floorY - 58, 22, 44, this.currentSuit.color).setDepth(4);
        this.mannequinHead = this.add.circle(x, floorY - 82, 9, 0xCCCCCC).setDepth(4);
        this.mannequinCore = this.add.circle(x, floorY - 60, 4, 0x00FFFF).setDepth(5);

        // Glowing nanotech scanlines inside pod
        this.mannequinScanline = this.add.rectangle(x, floorY - 92, 58, 2, 0x00FFFF, 0.8).setDepth(5);
        this.tweens.add({
            targets: this.mannequinScanline,
            y: floorY - 28,
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Linear'
        });

        // Plaque Text
        this.add.text(x, floorY - 120, '🗲 NANOTECH FABRICATOR', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#F8B800',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(4);

        this.mannequinLabel = this.add.text(x, floorY - 8, this.currentSuit.name, {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: this.currentSuit.accentHex || '#FFFFFF',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(4);

        const zone = this.add.zone(x, floorY - 60, 80, 120).setInteractive({ useHandCursor: true });
        zone.on('pointerdown', () => this.openSuitCustomizer());
    }

    createCombatSimulatorBayStation(x, floorY) {
        // Mode 2: "Avengers: Mission Training" Virtual Battle Simulator Bay
        const g = this.add.graphics().setDepth(3);

        // Giant curved holographic stadium screen console
        g.fillStyle(0x0F1B2E, 1);
        g.fillRect(x - 85, floorY - 130, 170, 105);
        g.lineStyle(3, 0x00E5FF, 1);
        g.strokeRect(x - 85, floorY - 130, 170, 105);

        // Inner glowing grid screen
        g.fillStyle(0x040814, 0.95);
        g.fillRect(x - 78, floorY - 123, 156, 91);
        g.lineStyle(1, 0x00E5FF, 0.35);
        for (let gx = x - 78; gx <= x + 78; gx += 26) {
            g.lineBetween(gx, floorY - 123, gx, floorY - 32);
        }
        for (let gy = floorY - 123; gy <= floorY - 32; gy += 18) {
            g.lineBetween(x - 78, gy, x + 78, gy);
        }

        // Radar target sweep animation
        const radarBlip = this.add.circle(x - 20, floorY - 80, 4, 0xFF3333).setDepth(4);
        this.tweens.add({
            targets: radarBlip,
            alpha: 0.1,
            x: x + 35,
            duration: 1500,
            yoyo: true,
            repeat: -1
        });

        // Top marquee text
        this.add.text(x, floorY - 140, '★ COMBAT TRAINING BAY ★', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#F8B800',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(4);

        this.screenScoreText = this.add.text(x, floorY - 100, `RECORD: ${this.trainingHighScore}`, {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00FF88',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(4);

        const launchBtn = this.add.text(x, floorY - 65, '[ ENGAGE SIMULATOR ]', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#FFFFFF',
            backgroundColor: '#C02020',
            padding: { x: 6, y: 5 }
        }).setOrigin(0.5).setDepth(4).setInteractive({ useHandCursor: true });

        launchBtn.on('pointerdown', () => this.startCombatSimulator());
        launchBtn.on('pointerover', () => launchBtn.setStyle({ fill: '#FFD700', backgroundColor: '#E82020' }));
        launchBtn.on('pointerout', () => launchBtn.setStyle({ fill: '#FFFFFF', backgroundColor: '#C02020' }));
    }

    // ---------------------------------------------------------------------
    // PERMANENT TOP HUD & UI BUTTONS (SCROLLFACTOR 0)
    // ---------------------------------------------------------------------
    createTopHUD() {
        const W = this.scale.width;

        // Top HUD Header Bar
        const hudBg = this.add.rectangle(W / 2, 22, W, 44, 0x050C1B, 0.9)
            .setScrollFactor(0)
            .setDepth(2000)
            .setStrokeStyle(1, 0x00E5FF);

        // Required contract: Standalone Top-Right [ ◄ OCEANEER HUB ] button
        this.exitBtn = this.add.text(W - 130, 22, '[ ◄ OCEANEER HUB ]', {
            fontSize: '9px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00FFFF',
            backgroundColor: '#0E1E3C',
            padding: { x: 8, y: 6 }
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(2000)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.returnToHub())
        .on('pointerover', () => this.exitBtn.setStyle({ fill: '#FFD700' }))
        .on('pointerout', () => this.exitBtn.setStyle({ fill: '#00FFFF' }));

        // Current Equipped Suit HUD indicator (Top Left)
        this.hudSuitText = this.add.text(12, 14, `SUIT: ${this.currentSuit.name}`, {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: this.currentSuit.colorHex,
            stroke: '#000',
            strokeThickness: 2
        }).setScrollFactor(0).setDepth(2000);

        // High Score / Badge indicator (Top Left row 2)
        this.hudScoreText = this.add.text(12, 27, `BEST: ${this.trainingHighScore} ${this.hasMarvelBadge ? '★ BADGE' : ''}`, {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#FFD700',
            stroke: '#000',
            strokeThickness: 2
        }).setScrollFactor(0).setDepth(2000);

        // Quick Launcher HUD Buttons (Bottom Bar for easy mobile/desktop access)
        const H = this.scale.height;
        this.quickSuitBtn = this.add.text(14, H - 24, '[ 🗲 SUIT CUSTOMIZER ]', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00FFFF',
            backgroundColor: '#09152C',
            padding: { x: 6, y: 4 }
        })
        .setScrollFactor(0)
        .setDepth(2000)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.openSuitCustomizer());

        this.quickCombatBtn = this.add.text(W - 14, H - 24, '[ ★ START MISSION TRAINING ★ ]', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#FFD700',
            backgroundColor: '#7A1010',
            padding: { x: 6, y: 4 }
        })
        .setOrigin(1, 0)
        .setScrollFactor(0)
        .setDepth(2000)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.startCombatSimulator());
    }

    // ---------------------------------------------------------------------
    // INPUT HANDLING & JOYSTICK
    // ---------------------------------------------------------------------
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
                Phaser.Input.Keyboard.KeyCodes.D,
                Phaser.Input.Keyboard.KeyCodes.U,
                Phaser.Input.Keyboard.KeyCodes.X
            ]);
        }

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keysWASD = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
            esc: Phaser.Input.Keyboard.KeyCodes.ESC,
            u: Phaser.Input.Keyboard.KeyCodes.U,
            x: Phaser.Input.Keyboard.KeyCodes.X
        });

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
            }
            this.mobileInput = { left: false, right: false, up: false, down: false };
        };

        const onNativeKeyUp = (e) => {
            if (e.key === 'Escape') {
                if (this.isModalOpen) {
                    this.closeModals();
                } else if (this.inCombatSimulator) {
                    this.exitCombatSimulator();
                } else {
                    this.returnToHub();
                }
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
    }

    createMobileTouchControls() {
        const H = this.scale.height;
        const joyBase = this.add.circle(65, H - 80, 44, 0x112233, 0.6)
            .setScrollFactor(0).setDepth(2500).setStrokeStyle(2, 0x00E5FF);
        const joyKnob = this.add.circle(65, H - 80, 20, 0x00E5FF, 0.85)
            .setScrollFactor(0).setDepth(2501);

        this.touchJoystick = { base: joyBase, knob: joyKnob, originX: 65, originY: H - 80, pointer: null };

        this.input.on('pointerdown', (ptr) => {
            if (this.isModalOpen) return;
            if (ptr.x < 150 && ptr.y > H - 160) {
                this.touchJoystick.pointer = ptr;
            }
        });

        this.input.on('pointermove', (ptr) => {
            if (this.touchJoystick && this.touchJoystick.pointer && ptr.id === this.touchJoystick.pointer.id) {
                const dx = ptr.x - this.touchJoystick.originX;
                const dy = ptr.y - this.touchJoystick.originY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxR = 36;
                const angle = Math.atan2(dy, dx);
                const clamped = Math.min(dist, maxR);
                joyKnob.setPosition(this.touchJoystick.originX + Math.cos(angle) * clamped, this.touchJoystick.originY + Math.sin(angle) * clamped);

                this.mobileInput.left = dx < -12;
                this.mobileInput.right = dx > 12;
                this.mobileInput.up = dy < -12;
                this.mobileInput.down = dy > 12;
            }
        });

        const resetJoy = (ptr) => {
            if (this.touchJoystick && this.touchJoystick.pointer && (!ptr || ptr.id === this.touchJoystick.pointer.id)) {
                this.touchJoystick.pointer = null;
                joyKnob.setPosition(this.touchJoystick.originX, this.touchJoystick.originY);
                this.mobileInput = { left: false, right: false, up: false, down: false };
            }
        };

        this.input.on('pointerup', resetJoy);
    }

    // ---------------------------------------------------------------------
    // REQUIRED RETURN TO HUB CONTRACT
    // ---------------------------------------------------------------------
    returnToHub() {
        if (this.isExiting) return;
        this.isExiting = true;
        if (this._cleanWindowListeners) {
            this._cleanWindowListeners();
        }
        if (this.oceaneerHub && this.oceaneerHub.scene) {
            this.oceaneerHub.scene.setVisible(true);
            this.oceaneerHub.scene.resume('OceaneerClubScene');
        }
        this.scene.stop('MarvelAcademyWingScene');
    }

    // ---------------------------------------------------------------------
    // LAB ROOM UPDATE LOOP (2.5D Movement & Proximity)
    // ---------------------------------------------------------------------
    update(time, delta) {
        if (this.inCombatSimulator) {
            this.updateCombatSimulator(delta);
            return;
        }

        if (this.isModalOpen) return;

        const dt = delta * 0.001;

        // Directional Keyboard & Mobile Input
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

        if (isLeft && isRight) {
            moveX = 0;
        } else if (isLeft) {
            moveX = -1;
            this.player.setFlipX(true);
        } else if (isRight) {
            moveX = 1;
            this.player.setFlipX(false);
        }

        if (isUp && isDown) {
            moveY = 0;
        } else if (isUp) {
            moveY = -1;
        } else if (isDown) {
            moveY = 1;
        }

        let vx = moveX * this.playerSpeed;
        let vy = moveY * (this.playerSpeed * 0.65);
        if (moveX !== 0 && moveY !== 0) {
            vx *= 0.7071;
            vy *= 0.7071;
        }

        // Apply 2.5D coordinates
        this.player.x += vx * dt;
        this.player.x = Phaser.Math.Clamp(this.player.x, 80, this.roomW - 80);

        this.groundY += vy * dt;
        this.groundY = Phaser.Math.Clamp(this.groundY, this.floorY - 5, this.roomH - 25);

        this.player.y = this.groundY;
        this.player.body.reset(this.player.x, this.player.y);
        this.player.setDepth(Math.round(this.groundY));
        this.playerShadow.setPosition(this.player.x, this.groundY + 16);
        this.playerAura.setPosition(this.player.x, this.groundY - 10);

        // Animation playback
        if (moveX !== 0 || moveY !== 0) {
            if (this.anims.exists(this.charData.walkAnim)) {
                this.player.anims.play(this.charData.walkAnim, true);
            }
        } else {
            if (this.anims.exists(this.charData.idleAnim)) {
                this.player.anims.play(this.charData.idleAnim, true);
            }
        }

        // Proximity checks for stations
        this.checkStationProximity();

        // Keyboard trigger for active station
        if ((Phaser.Input.Keyboard.JustDown(this.cursors.space) ||
             Phaser.Input.Keyboard.JustDown(this.keysWASD.enter) ||
             Phaser.Input.Keyboard.JustDown(this.keysWASD.space)) &&
            this.activeStation) {
            this.handleActiveStationTrigger();
        }
    }

    checkStationProximity() {
        const px = this.player.x;
        const stations = [
            { id: 'exit', x: 130, label: '[ ◄ RETURN TO HUB (ENTER) ]' },
            { id: 'webshooters', x: 340, label: '[ 🔍 WEB-SHOOTERS (ENTER) ]' },
            { id: 'panther', x: 520, label: '[ 🔍 VIBRANIUM HELMET (ENTER) ]' },
            { id: 'pym', x: 700, label: '[ 🔍 PYM PARTICLES (ENTER) ]' },
            { id: 'terminal', x: 860, label: '[ 📡 BRIEFING TERMINAL (ENTER) ]' },
            { id: 'mannequin', x: 1140, label: '[ 🗲 SUIT CUSTOMIZER (ENTER) ]' },
            { id: 'combat', x: 1450, label: '[ ★ MISSION TRAINING ★ (ENTER) ]' }
        ];

        let found = null;
        for (const s of stations) {
            if (Math.abs(px - s.x) < 55) {
                found = s;
                break;
            }
        }

        if (found) {
            this.activeStation = found.id;
            this.promptText.setText(found.label);
            this.promptText.setPosition(this.player.x, this.groundY - 55);
            this.promptText.setVisible(true);
        } else {
            this.activeStation = null;
            this.promptText.setVisible(false);
        }
    }

    handleActiveStationTrigger() {
        if (!this.activeStation) return;
        if (this.activeStation === 'exit') {
            this.returnToHub();
        } else if (['webshooters', 'panther', 'pym', 'terminal'].includes(this.activeStation)) {
            this.openLoreModal(this.activeStation);
        } else if (this.activeStation === 'mannequin') {
            this.openSuitCustomizer();
        } else if (this.activeStation === 'combat') {
            this.startCombatSimulator();
        }
    }

    // ---------------------------------------------------------------------
    // DISPLAY CASES & HOLOGRAPHIC BRIEFING MODAL
    // ---------------------------------------------------------------------
    createLoreModal() {
        const W = this.scale.width;
        const H = this.scale.height;

        this.loreModalContainer = this.add.container(0, 0).setScrollFactor(0).setDepth(2700).setVisible(false);

        // Dark backdrop
        const dimBg = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.8)
            .setInteractive(); // block input to back
        this.loreModalContainer.add(dimBg);

        // Holographic Modal Box
        const cardW = Math.min(480, W - 30);
        const cardH = Math.min(340, H - 40);
        const cardBox = this.add.rectangle(W / 2, H / 2, cardW, cardH, 0x071122, 0.96)
            .setStrokeStyle(3, 0x00E5FF);
        this.loreModalContainer.add(cardBox);

        // Top Header
        this.loreTagText = this.add.text(W / 2, H / 2 - cardH / 2 + 20, '', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00E5FF'
        }).setOrigin(0.5);
        this.loreModalContainer.add(this.loreTagText);

        this.loreTitleText = this.add.text(W / 2, H / 2 - cardH / 2 + 42, '', {
            fontSize: '10px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#F8B800',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5);
        this.loreModalContainer.add(this.loreTitleText);

        // Icon Preview
        this.loreIcon = this.add.image(W / 2, H / 2 - cardH / 2 + 76, 'msha_avengers_logo').setScale(0.85);
        this.loreModalContainer.add(this.loreIcon);

        // Description Body
        this.loreBodyText = this.add.text(W / 2 - cardW / 2 + 20, H / 2 - 25, '', {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#E0F7FA',
            lineSpacing: 8,
            wordWrap: { width: cardW - 40 }
        });
        this.loreModalContainer.add(this.loreBodyText);

        // Quote
        this.loreQuoteText = this.add.text(W / 2, H / 2 + cardH / 2 - 58, '', {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#FFD700',
            align: 'center',
            wordWrap: { width: cardW - 40 }
        }).setOrigin(0.5);
        this.loreModalContainer.add(this.loreQuoteText);

        // Close Button
        const closeBtn = this.add.text(W / 2, H / 2 + cardH / 2 - 24, '[ DISMISS (ESC) ]', {
            fontSize: '9px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#FFFFFF',
            backgroundColor: '#0E2448',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        closeBtn.on('pointerdown', () => this.closeModals());
        closeBtn.on('pointerover', () => closeBtn.setStyle({ fill: '#FFD700' }));
        closeBtn.on('pointerout', () => closeBtn.setStyle({ fill: '#FFFFFF' }));
        this.loreModalContainer.add(closeBtn);
    }

    openLoreModal(loreType) {
        const lore = MARVEL_ARCHIVES_LORE[loreType];
        if (!lore) return;

        this.isModalOpen = true;
        this.loreTagText.setText(lore.tag);
        this.loreTitleText.setText(lore.title);
        this.loreIcon.setTexture(lore.iconKey);
        this.loreBodyText.setText(lore.desc.join('\n'));
        this.loreQuoteText.setText(lore.quote);

        this.loreModalContainer.setVisible(true);

        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
            retroArcadeAudio.play('powerup');
        }
    }

    closeModals() {
        this.isModalOpen = false;
        if (this.loreModalContainer) this.loreModalContainer.setVisible(false);
        if (this.suitModalContainer) this.suitModalContainer.setVisible(false);
    }

    // ---------------------------------------------------------------------
    // MODE 1: NANOTECH SUPER SUIT CUSTOMIZER & MANNEQUIN
    // ---------------------------------------------------------------------
    createSuitCustomizerModal() {
        const W = this.scale.width;
        const H = this.scale.height;

        this.suitModalContainer = this.add.container(0, 0).setScrollFactor(0).setDepth(2700).setVisible(false);

        const dimBg = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.85).setInteractive();
        this.suitModalContainer.add(dimBg);

        const cardW = Math.min(520, W - 20);
        const cardH = Math.min(420, H - 30);
        const cardBox = this.add.rectangle(W / 2, H / 2, cardW, cardH, 0x091428, 0.98)
            .setStrokeStyle(3, 0xF8B800);
        this.suitModalContainer.add(cardBox);

        // Header Title
        const title = this.add.text(W / 2, H / 2 - cardH / 2 + 20, '★ NANOTECH SUIT FABRICATOR ★', {
            fontSize: '10px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#F8B800',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5);
        this.suitModalContainer.add(title);

        const sub = this.add.text(W / 2, H / 2 - cardH / 2 + 38, 'SELECT SUIT TECH & MATERIALIZE NANOBOTS', {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00E5FF'
        }).setOrigin(0.5);
        this.suitModalContainer.add(sub);

        // 4 Suit Option Cards (2x2 grid)
        this.suitCardBoxes = [];
        const gridW = cardW - 36;
        const colW = gridW / 2 - 8;
        const rowH = 74;
        const startX = W / 2 - colW / 2 - 6;
        const startY = H / 2 - cardH / 2 + 96;

        MARVEL_SUIT_CATALOG.forEach((suit, idx) => {
            const col = idx % 2;
            const row = Math.floor(idx / 2);
            const cx = (col === 0) ? startX : startX + colW + 12;
            const cy = startY + row * (rowH + 10);

            const sBox = this.add.rectangle(cx, cy, colW, rowH, 0x131E35, 1)
                .setStrokeStyle(2, idx === this.selectedSuitIndex ? 0xF8B800 : 0x2A3B5C)
                .setInteractive({ useHandCursor: true });
            this.suitModalContainer.add(sBox);
            this.suitCardBoxes.push(sBox);

            // Icon
            const sIcon = this.add.image(cx - colW / 2 + 24, cy, suit.iconKey).setScale(0.8);
            this.suitModalContainer.add(sIcon);

            // Name & Hero
            const sName = this.add.text(cx - colW / 2 + 50, cy - 24, suit.name, {
                fontSize: '7px',
                fontFamily: '"Press Start 2P", monospace',
                fill: suit.colorHex
            });
            this.suitModalContainer.add(sName);

            const sHero = this.add.text(cx - colW / 2 + 50, cy - 12, suit.hero.toUpperCase(), {
                fontSize: '6px',
                fontFamily: '"Press Start 2P", monospace',
                fill: '#A0B8D8'
            });
            this.suitModalContainer.add(sHero);

            // Ultimate label
            const sUlt = this.add.text(cx - colW / 2 + 50, cy + 2, `ULT: ${suit.ultimateName.split(' ')[0]}`, {
                fontSize: '6px',
                fontFamily: '"Press Start 2P", monospace',
                fill: '#FFD700'
            });
            this.suitModalContainer.add(sUlt);

            const sPass = this.add.text(cx - colW / 2 + 50, cy + 14, suit.passive, {
                fontSize: '5px',
                fontFamily: '"Press Start 2P", monospace',
                fill: '#00FF88'
            });
            this.suitModalContainer.add(sPass);

            sBox.on('pointerdown', () => this.selectSuitCard(idx));
        });

        // Detailed Selected Suit Specs Box
        this.suitDetailBox = this.add.text(W / 2, H / 2 + cardH / 2 - 96, '', {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#E0F7FA',
            align: 'center',
            lineSpacing: 5,
            wordWrap: { width: cardW - 50 }
        }).setOrigin(0.5);
        this.suitModalContainer.add(this.suitDetailBox);

        // Materialize Nanotech Button
        this.materializeBtn = this.add.text(W / 2, H / 2 + cardH / 2 - 46, '[ 🗲 MATERIALIZE NANOTECH 🗲 ]', {
            fontSize: '10px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#050D1E',
            backgroundColor: '#00E5FF',
            padding: { x: 12, y: 7 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this.materializeBtn.on('pointerdown', () => this.materializeNanotech());
        this.materializeBtn.on('pointerover', () => this.materializeBtn.setStyle({ backgroundColor: '#FFD700' }));
        this.materializeBtn.on('pointerout', () => this.materializeBtn.setStyle({ backgroundColor: '#00E5FF' }));
        this.suitModalContainer.add(this.materializeBtn);

        // Dismiss Button
        const closeBtn = this.add.text(W / 2, H / 2 + cardH / 2 - 16, '[ DISMISS ]', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#8899AA'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => this.closeModals());
        this.suitModalContainer.add(closeBtn);
    }

    openSuitCustomizer() {
        this.isModalOpen = true;
        this.updateSuitCardHighlight();
        this.suitModalContainer.setVisible(true);

        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
            retroArcadeAudio.play('powerup');
        }
    }

    selectSuitCard(index) {
        this.selectedSuitIndex = index;
        this.updateSuitCardHighlight();
        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
            retroArcadeAudio.play('laser');
        }
    }

    updateSuitCardHighlight() {
        const suit = MARVEL_SUIT_CATALOG[this.selectedSuitIndex];
        this.suitCardBoxes.forEach((box, i) => {
            box.setStrokeStyle(i === this.selectedSuitIndex ? 3 : 1, i === this.selectedSuitIndex ? 0xF8B800 : 0x2A3B5C);
        });

        this.suitDetailBox.setText(
            `ACTIVE ARCHITECTURE: ${suit.name}\n` +
            `${suit.specs}\n` +
            `ULTIMATE: ${suit.ultimateName}\n` +
            `${suit.ultimateDesc}`
        );
    }

    materializeNanotech() {
        const suit = MARVEL_SUIT_CATALOG[this.selectedSuitIndex];
        this.currentSuit = suit;

        // Save progress to Oceaneer Club
        _mshaSaveProgress({
            marvelSuitHero: suit.name,
            marvelSuitColor: suit.color,
            marvelBadge: true
        });
        this.hasMarvelBadge = true;

        // Audio celebration
        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
            retroArcadeAudio.play('powerup');
        }

        // Close modal and play animated sparkling nanotech assembly onto mannequin & player
        this.closeModals();
        this.playNanotechAssemblyAnimation(suit);

        // Update Mannequin graphics in the lab
        if (this.mannequinSprite) {
            this.mannequinSprite.setFillStyle(suit.color);
        }
        if (this.mannequinLabel) {
            this.mannequinLabel.setText(suit.name);
            this.mannequinLabel.setFillStyle(suit.color);
        }

        // Update Player glowing hero aura
        if (this.playerAura) {
            this.playerAura.setFillStyle(suit.glowColor, 0.4);
        }

        // Update Top HUD
        if (this.hudSuitText) {
            this.hudSuitText.setText(`SUIT: ${suit.name}`);
            this.hudSuitText.setFillStyle(suit.color);
        }
        if (this.hudScoreText) {
            this.hudScoreText.setText(`BEST: ${this.trainingHighScore} ★ BADGE`);
        }

        // Toast feedback banner
        this.showToastNotification(`NANOTECH SUIT DEPLOYED: ${suit.name}!`);
    }

    playNanotechAssemblyAnimation(suit) {
        // Spawn 32 sparkling nanotech pixel squares streaming into Mannequin and Player
        const startX = this.player.x;
        const startY = this.player.y - 20;
        const targetX = 1140;
        const targetY = this.floorY - 58;

        for (let i = 0; i < 32; i++) {
            const spark = this.add.image(
                startX + Phaser.Math.Between(-30, 30),
                startY + Phaser.Math.Between(-30, 30),
                'msha_nano_spark'
            ).setDepth(2100).setTint(suit.glowColor);

            this.tweens.add({
                targets: spark,
                x: targetX + Phaser.Math.Between(-20, 20),
                y: targetY + Phaser.Math.Between(-30, 30),
                scaleX: 1.5,
                scaleY: 1.5,
                duration: 650 + (i * 18),
                ease: 'Cubic.easeInOut',
                onComplete: () => {
                    spark.destroy();
                }
            });
        }
    }

    showToastNotification(msg) {
        const W = this.scale.width;
        const toast = this.add.text(W / 2, 70, msg, {
            fontSize: '9px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00FF88',
            backgroundColor: '#040F22',
            padding: { x: 12, y: 8 },
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(0.5).setScrollFactor(0).setDepth(3000);

        this.tweens.add({
            targets: toast,
            y: 55,
            alpha: 0,
            duration: 2500,
            ease: 'Sine.easeIn',
            onComplete: () => toast.destroy()
        });
    }

    // ---------------------------------------------------------------------
    // MODE 2: "AVENGERS: MISSION TRAINING" VIRTUAL BATTLE SIMULATOR
    // ---------------------------------------------------------------------
    createCombatSimulatorLayer() {
        const W = this.scale.width;
        const H = this.scale.height;

        this.combatLayer = this.add.container(0, 0).setScrollFactor(0).setDepth(3100).setVisible(false);

        // Cyber Grid Arena Background
        this.simBg = this.add.rectangle(W / 2, H / 2, W, H, 0x030612, 1);
        this.combatLayer.add(this.simBg);

        // Grid lines overlay
        this.simGridGfx = this.add.graphics();
        this.combatLayer.add(this.simGridGfx);

        // Holographic Scanlines
        this.simScanlines = this.add.graphics();
        this.simScanlines.fillStyle(0x00E5FF, 0.04);
        for (let y = 0; y < H; y += 4) {
            this.simScanlines.fillRect(0, y, W, 2);
        }
        this.combatLayer.add(this.simScanlines);

        // Simulator Top HUD
        this.simTimeText = this.add.text(20, 18, 'TIME: 25.0s', {
            fontSize: '10px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00FFFF'
        });
        this.combatLayer.add(this.simTimeText);

        this.simScoreText = this.add.text(W / 2, 18, 'SCORE: 0000', {
            fontSize: '11px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#FFD700',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5, 0);
        this.combatLayer.add(this.simScoreText);

        this.simComboText = this.add.text(W / 2, 34, 'COMBO: x1', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00FF88'
        }).setOrigin(0.5, 0);
        this.combatLayer.add(this.simComboText);

        // Ultimate Charge Meter (Top Right)
        this.simUltText = this.add.text(W - 20, 18, 'ULTIMATE: [    ]', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#E0F7FA'
        }).setOrigin(1, 0);
        this.combatLayer.add(this.simUltText);

        // Active Hero Suit label
        this.simSuitText = this.add.text(20, 36, `TECH: ${this.currentSuit.name}`, {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: this.currentSuit.colorHex
        });
        this.combatLayer.add(this.simSuitText);

        // Hero Ultimate Action Button
        this.simUltimateBtn = this.add.text(W / 2, H - 40, '[ ★ HERO ULTIMATE (SPACE/U) ★ ]', {
            fontSize: '10px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#000000',
            backgroundColor: '#FFD700',
            padding: { x: 12, y: 7 }
        }).setOrigin(0.5).setVisible(false).setInteractive({ useHandCursor: true });
        this.simUltimateBtn.on('pointerdown', () => this.triggerHeroUltimate());
        this.combatLayer.add(this.simUltimateBtn);

        // Mobile touch buttons (FIRE & ULTIMATE)
        this.simMobileFireBtn = this.add.text(W - 75, H - 75, 'FIRE', {
            fontSize: '11px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#FFFFFF',
            backgroundColor: '#C02020',
            padding: { x: 14, y: 12 }
        }).setOrigin(0.5).setVisible(false).setInteractive({ useHandCursor: true });
        this.simMobileFireBtn.on('pointerdown', () => this.fireEnergyBlast(this.simCrosshair.x, this.simCrosshair.y));
        this.combatLayer.add(this.simMobileFireBtn);

        // Targeting Crosshair
        this.simCrosshair = this.add.image(W / 2, H / 2, 'msha_sim_crosshair');
        this.combatLayer.add(this.simCrosshair);

        // Direct Touch-to-Aim & Fire input on entire simulator screen
        this.simBg.setInteractive();
        this.simBg.on('pointerdown', (ptr) => {
            if (!this.inCombatSimulator || this.simIsGameOver) return;
            this.simCrosshair.setPosition(ptr.x, ptr.y);
            this.fireEnergyBlast(ptr.x, ptr.y);
        });

        // Debriefing Victory Card (shows after 25s)
        this.createCombatDebriefingCard();
    }

    createCombatDebriefingCard() {
        const W = this.scale.width;
        const H = this.scale.height;

        this.debriefCard = this.add.container(0, 0).setVisible(false);

        const cardW = Math.min(460, W - 24);
        const cardH = Math.min(340, H - 30);
        const box = this.add.rectangle(W / 2, H / 2, cardW, cardH, 0x050D1E, 0.98)
            .setStrokeStyle(3, 0xF8B800);
        this.debriefCard.add(box);

        const title = this.add.text(W / 2, H / 2 - cardH / 2 + 24, '★ AVENGERS COMBAT DEBRIEFING ★', {
            fontSize: '9px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#F8B800',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5);
        this.debriefCard.add(title);

        this.debriefStatsText = this.add.text(W / 2, H / 2 - 25, '', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#E0F7FA',
            align: 'center',
            lineSpacing: 10
        }).setOrigin(0.5);
        this.debriefCard.add(this.debriefStatsText);

        this.debriefBadgeText = this.add.text(W / 2, H / 2 + 50, '[★ MARVEL ACADEMY BADGE EARNED! ★]', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00FF88',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5);
        this.debriefCard.add(this.debriefBadgeText);

        // Buttons: Retry & Return to Lab
        const retryBtn = this.add.text(W / 2 - 80, H / 2 + cardH / 2 - 32, '[ RETRY ]', {
            fontSize: '9px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#FFFFFF',
            backgroundColor: '#0E3666',
            padding: { x: 10, y: 6 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        retryBtn.on('pointerdown', () => this.startCombatSimulator());
        this.debriefCard.add(retryBtn);

        const returnBtn = this.add.text(W / 2 + 80, H / 2 + cardH / 2 - 32, '[ RETURN TO LAB ]', {
            fontSize: '9px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00FFFF',
            backgroundColor: '#0A1832',
            padding: { x: 10, y: 6 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        returnBtn.on('pointerdown', () => this.exitCombatSimulator());
        this.debriefCard.add(returnBtn);

        this.combatLayer.add(this.debriefCard);
    }

    startCombatSimulator() {
        this.closeModals();
        this.inCombatSimulator = true;
        this.simIsGameOver = false;

        this.simTimer = 25.0;
        this.simScore = 0;
        this.simCombo = 1;
        this.simMaxCombo = 1;
        this.simComboTimer = 0;
        this.simUltimateCharge = 20;
        this.simDronesNeutralized = 0;
        this.simSpawnTimer = 0;

        // Clean up any remaining objects
        this.clearSimulatorObjects();

        // Update visuals
        const W = this.scale.width;
        const H = this.scale.height;
        this.simCrosshair.setPosition(W / 2, H / 2);
        this.simSuitText.setText(`TECH: ${this.currentSuit.name}`);
        this.simSuitText.setFillStyle(this.currentSuit.color);

        this.debriefCard.setVisible(false);
        this.simUltimateBtn.setVisible(false);
        this.combatLayer.setVisible(true);

        const isTouch = !this.sys.game.device.os.desktop || this.sys.game.device.input.touch;
        if (isTouch) {
            this.simMobileFireBtn.setVisible(true);
        }

        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
            retroArcadeAudio.play('powerup');
        }

        // Draw initial cyber arena grid
        this.drawSimulatorGrid();

        // Countdown alert
        this.showToastNotification('ENGAGE: MISSION TRAINING MATRIX ACTIVATED!');
    }

    drawSimulatorGrid() {
        const W = this.scale.width;
        const H = this.scale.height;
        this.simGridGfx.clear();
        this.simGridGfx.lineStyle(1, 0x00E5FF, 0.22);

        // Perspective grid lines
        for (let x = 0; x <= W; x += 40) {
            this.simGridGfx.lineBetween(x, 0, x, H);
        }
        for (let y = 0; y <= H; y += 30) {
            this.simGridGfx.lineBetween(0, y, W, y);
        }
    }

    updateCombatSimulator(delta) {
        if (this.simIsGameOver) return;

        const dt = delta * 0.001;
        this.simTimer -= dt;

        // Update HUD
        if (this.simTimer > 0) {
            this.simTimeText.setText(`TIME: ${this.simTimer.toFixed(1)}s`);
            if (this.simTimer < 5.0) {
                this.simTimeText.setFillStyle(0xFF3333);
            } else {
                this.simTimeText.setFillStyle(0x00FFFF);
            }
        } else {
            this.simTimeText.setText('TIME: 0.0s');
            this.finishCombatSimulator();
            return;
        }

        this.simScoreText.setText(`SCORE: ${this.simScore}`);
        this.simComboText.setText(`COMBO: x${this.simCombo}`);

        // Update Ultimate Gauge
        const chargeBars = Math.floor(this.simUltimateCharge / 10);
        let barStr = '[';
        for (let b = 0; b < 10; b++) {
            barStr += b < chargeBars ? '|' : ' ';
        }
        barStr += `] ${this.simUltimateCharge}%`;
        this.simUltText.setText(`ULTIMATE: ${barStr}`);

        if (this.simUltimateCharge >= 100) {
            this.simUltText.setFillStyle(0xFFD700);
            this.simUltimateBtn.setVisible(true);
        } else {
            this.simUltText.setFillStyle(0xE0F7FA);
            this.simUltimateBtn.setVisible(false);
        }

        // Combo decay timer
        if (this.simCombo > 1) {
            this.simComboTimer += dt;
            if (this.simComboTimer > 2.8) {
                this.simCombo = 1;
                this.simComboTimer = 0;
            }
        }

        // Steer crosshair with Keyboard
        const speed = 320 * dt;
        const W = this.scale.width;
        const H = this.scale.height;

        if (this.cursors.left.isDown || this.keysWASD.left.isDown) this.simCrosshair.x -= speed;
        if (this.cursors.right.isDown || this.keysWASD.right.isDown) this.simCrosshair.x += speed;
        if (this.cursors.up.isDown || this.keysWASD.up.isDown) this.simCrosshair.y -= speed;
        if (this.cursors.down.isDown || this.keysWASD.down.isDown) this.simCrosshair.y += speed;

        this.simCrosshair.x = Phaser.Math.Clamp(this.simCrosshair.x, 30, W - 30);
        this.simCrosshair.y = Phaser.Math.Clamp(this.simCrosshair.y, 60, H - 60);

        // Keyboard firing (Space or Enter)
        if (Phaser.Input.Keyboard.JustDown(this.cursors.space) ||
            Phaser.Input.Keyboard.JustDown(this.keysWASD.enter) ||
            Phaser.Input.Keyboard.JustDown(this.keysWASD.space)) {
            if (this.simUltimateCharge >= 100 && (this.keysWASD.u.isDown || this.keysWASD.x.isDown)) {
                this.triggerHeroUltimate();
            } else {
                this.fireEnergyBlast(this.simCrosshair.x, this.simCrosshair.y);
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.keysWASD.u) || Phaser.Input.Keyboard.JustDown(this.keysWASD.x)) {
            this.triggerHeroUltimate();
        }

        // Drone Spawning
        this.simSpawnTimer += dt;
        const spawnInterval = Phaser.Math.Clamp(1.0 - (25.0 - this.simTimer) * 0.02, 0.55, 1.0);
        if (this.simSpawnTimer > spawnInterval) {
            this.simSpawnTimer = 0;
            this.spawnSimulatorDrone();
        }

        // Drone movement & firing updates
        this.updateDrones(dt);

        // Hostile Orbs movement
        this.updateHostileOrbs(dt);
    }

    spawnSimulatorDrone() {
        const W = this.scale.width;
        const r = Math.random();
        let droneType = 'ultron';
        let key = 'msha_drone_ultron';
        let hp = 1;
        let points = 100;
        let speed = Phaser.Math.Between(70, 110);

        if (r < 0.45) {
            droneType = 'ultron';
            key = 'msha_drone_ultron';
            hp = 1;
            points = 100;
        } else if (r < 0.8) {
            droneType = 'hydra';
            key = 'msha_drone_hydra';
            hp = 1;
            points = 150;
            speed = Phaser.Math.Between(130, 175);
        } else {
            droneType = 'heavy';
            key = 'msha_drone_heavy';
            hp = 2;
            points = 300;
            speed = Phaser.Math.Between(50, 75);
        }

        const startFromLeft = Math.random() < 0.5;
        const spawnX = startFromLeft ? -30 : W + 30;
        const spawnY = Phaser.Math.Between(75, this.scale.height - 120);

        const drone = this.add.image(spawnX, spawnY, key).setDepth(3150).setInteractive({ useHandCursor: true });
        drone.droneType = droneType;
        drone.hp = hp;
        drone.points = points;
        drone.vx = startFromLeft ? speed : -speed;
        drone.vy = Phaser.Math.Between(-25, 25);
        drone.shootCooldown = Phaser.Math.Between(1.5, 3.5);

        drone.on('pointerdown', (ptr) => {
            this.simCrosshair.setPosition(ptr.x, ptr.y);
            this.fireEnergyBlast(ptr.x, ptr.y);
        });

        this.combatLayer.add(drone);
        this.simActiveDrones.push(drone);
    }

    updateDrones(dt) {
        const W = this.scale.width;
        const H = this.scale.height;

        for (let i = this.simActiveDrones.length - 1; i >= 0; i--) {
            const d = this.simActiveDrones[i];
            d.x += d.vx * dt;
            d.y += d.vy * dt;

            // Bounce slightly off top and bottom limits
            if (d.y < 70 || d.y > H - 110) d.vy *= -1;

            // Drone shooting hostile orbs
            d.shootCooldown -= dt;
            if (d.shootCooldown <= 0) {
                d.shootCooldown = Phaser.Math.Between(2.0, 4.0);
                this.spawnHostileOrb(d.x, d.y);
            }

            // Despawn off bounds
            if ((d.vx > 0 && d.x > W + 60) || (d.vx < 0 && d.x < -60)) {
                d.destroy();
                this.simActiveDrones.splice(i, 1);
            }
        }
    }

    spawnHostileOrb(x, y) {
        const orb = this.add.image(x, y, 'msha_plasma_orb').setDepth(3145).setInteractive({ useHandCursor: true });
        orb.vy = Phaser.Math.Between(110, 160);
        orb.vx = Phaser.Math.Between(-30, 30);

        orb.on('pointerdown', (ptr) => {
            this.simCrosshair.setPosition(ptr.x, ptr.y);
            this.fireEnergyBlast(ptr.x, ptr.y);
        });

        this.combatLayer.add(orb);
        this.simActiveOrbs.push(orb);
    }

    updateHostileOrbs(dt) {
        const H = this.scale.height;
        for (let i = this.simActiveOrbs.length - 1; i >= 0; i--) {
            const orb = this.simActiveOrbs[i];
            orb.y += orb.vy * dt;
            orb.x += orb.vx * dt;

            if (orb.y > H - 30) {
                // Orb hit defense line! Break combo and minor shake
                this.cameras.main.shake(120, 0.008);
                if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
                    retroArcadeAudio.play('damage');
                }
                this.simCombo = 1;
                this.simComboTimer = 0;
                orb.destroy();
                this.simActiveOrbs.splice(i, 1);
            }
        }
    }

    fireEnergyBlast(targetX, targetY) {
        if (!this.inCombatSimulator || this.simIsGameOver) return;

        const suit = this.currentSuit;
        const originX = this.scale.width / 2;
        const originY = this.scale.height - 10;

        // Energy Blast Beam Graphic
        const blastGfx = this.add.graphics().setDepth(3180);
        blastGfx.lineStyle(4, suit.blastColor, 1);
        blastGfx.lineBetween(originX, originY, targetX, targetY);
        blastGfx.fillStyle(suit.glowColor, 1);
        blastGfx.fillCircle(targetX, targetY, 14);

        this.tweens.add({
            targets: blastGfx,
            alpha: 0,
            duration: 160,
            onComplete: () => blastGfx.destroy()
        });

        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
            retroArcadeAudio.play('laser');
        }

        // Check hits against active drones
        let hitSomething = false;
        const hitRadius = 32;

        for (let i = this.simActiveDrones.length - 1; i >= 0; i--) {
            const d = this.simActiveDrones[i];
            const dist = Phaser.Math.Distance.Between(targetX, targetY, d.x, d.y);
            if (dist < hitRadius) {
                hitSomething = true;
                d.hp--;
                if (d.hp <= 0) {
                    this.neutralizeDrone(d, i);
                } else {
                    // Flash drone
                    d.setTint(0xFFFFFF);
                    this.time.delayedCall(100, () => {
                        if (d && d.active) d.clearTint();
                    });
                }
                break;
            }
        }

        // Check hits against hostile plasma orbs
        for (let i = this.simActiveOrbs.length - 1; i >= 0; i--) {
            const orb = this.simActiveOrbs[i];
            const dist = Phaser.Math.Distance.Between(targetX, targetY, orb.x, orb.y);
            if (dist < 26) {
                hitSomething = true;
                this.neutralizeOrb(orb, i);
                break;
            }
        }

        // Charge ultimate slightly on fire
        if (!hitSomething) {
            this.simUltimateCharge = Math.min(100, this.simUltimateCharge + 1);
        }
    }

    neutralizeDrone(d, index) {
        const points = d.points * this.simCombo;
        this.simScore += points;
        this.simDronesNeutralized++;

        // Combo increment
        this.simCombo = Math.min(5, this.simCombo + 1);
        this.simMaxCombo = Math.max(this.simMaxCombo, this.simCombo);
        this.simComboTimer = 0;

        // Ultimate charge bonus
        this.simUltimateCharge = Math.min(100, this.simUltimateCharge + (d.droneType === 'heavy' ? 24 : 14));

        // Debris explosion particles
        this.createExplosionBurst(d.x, d.y, this.currentSuit.blastColor);

        // Floating score popup
        this.createScorePopup(d.x, d.y, `+${points}`);

        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
            retroArcadeAudio.play('explosion');
        }

        d.destroy();
        this.simActiveDrones.splice(index, 1);
    }

    neutralizeOrb(orb, index) {
        this.simScore += 50 * this.simCombo;
        this.simComboTimer = 0;
        this.createExplosionBurst(orb.x, orb.y, 0xFF4488);
        this.createScorePopup(orb.x, orb.y, '+50 DEFENSE!');

        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
            retroArcadeAudio.play('laser');
        }

        orb.destroy();
        this.simActiveOrbs.splice(index, 1);
    }

    createExplosionBurst(x, y, color) {
        for (let i = 0; i < 10; i++) {
            const spark = this.add.image(x, y, 'msha_nano_spark').setDepth(3190).setTint(color);
            const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
            const dist = Phaser.Math.Between(20, 50);
            this.tweens.add({
                targets: spark,
                x: x + Math.cos(angle) * dist,
                y: y + Math.sin(angle) * dist,
                alpha: 0,
                scaleX: 0.2,
                scaleY: 0.2,
                duration: Phaser.Math.Between(250, 400),
                onComplete: () => spark.destroy()
            });
        }
    }

    createScorePopup(x, y, text) {
        const popup = this.add.text(x, y, text, {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00FF88',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(3200);

        this.tweens.add({
            targets: popup,
            y: y - 24,
            alpha: 0,
            duration: 650,
            ease: 'Sine.easeOut',
            onComplete: () => popup.destroy()
        });
    }

    triggerHeroUltimate() {
        if (this.simUltimateCharge < 100 || !this.inCombatSimulator || this.simIsGameOver) return;
        this.simUltimateCharge = 0;
        this.simUltimateBtn.setVisible(false);

        const suit = this.currentSuit;
        const W = this.scale.width;
        const H = this.scale.height;

        // Fullscreen ultimate flash & rumble
        this.cameras.main.shake(350, 0.02);
        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
            retroArcadeAudio.play('bomb');
        }

        const ultFlash = this.add.rectangle(W / 2, H / 2, W, H, suit.color, 0.75).setDepth(3250);
        this.tweens.add({
            targets: ultFlash,
            alpha: 0,
            duration: 600,
            onComplete: () => ultFlash.destroy()
        });

        // Banner announcing the hero move
        this.showToastNotification(`★ ${suit.ultimateName}! ★`);

        // Destroy ALL active drones with massive combo bonuses
        let clearedCount = 0;
        for (const d of this.simActiveDrones) {
            this.createExplosionBurst(d.x, d.y, suit.color);
            d.destroy();
            clearedCount++;
        }
        for (const orb of this.simActiveOrbs) {
            this.createExplosionBurst(orb.x, orb.y, 0xFFFFFF);
            orb.destroy();
        }

        this.simActiveDrones = [];
        this.simActiveOrbs = [];

        const ultimateBonus = (clearedCount * 250 + 1000) * this.simCombo;
        this.simScore += ultimateBonus;
        this.simDronesNeutralized += clearedCount;
        this.simCombo = Math.min(5, this.simCombo + 2);
        this.simMaxCombo = Math.max(this.simMaxCombo, this.simCombo);

        this.createScorePopup(W / 2, H / 2, `+${ultimateBonus} ULTIMATE CLEAR!`);
    }

    finishCombatSimulator() {
        this.simIsGameOver = true;
        this.clearSimulatorObjects();

        // High score calculation & save to Oceaneer Club
        const prog = _mshaGetProgress();
        const oldRecord = prog.marvelTrainingScore || 0;
        const isNewRecord = this.simScore > oldRecord;
        const finalBest = Math.max(oldRecord, this.simScore);
        this.trainingHighScore = finalBest;
        this.hasMarvelBadge = true;

        _mshaSaveProgress({
            marvelTrainingScore: finalBest,
            marvelBadge: true
        });

        // Audio victory
        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
            retroArcadeAudio.play('powerup');
        }

        // Update Lab Display High Score
        if (this.screenScoreText) {
            this.screenScoreText.setText(`RECORD: ${finalBest}`);
        }
        if (this.hudScoreText) {
            this.hudScoreText.setText(`BEST: ${finalBest} ★ BADGE`);
        }

        // Debriefing card display
        const recordMsg = isNewRecord ? '\n★ NEW HIGH SCORE RECORD! ★' : '';
        this.debriefStatsText.setText(
            `TRAINING SIMULATION COMPLETE!\n\n` +
            `FINAL SCORE: ${this.simScore}\n` +
            `ACADEMY RECORD: ${finalBest}${recordMsg}\n\n` +
            `TARGETS NEUTRALIZED: ${this.simDronesNeutralized}\n` +
            `MAX COMBO: x${this.simMaxCombo}\n` +
            `SUIT CALIBRATION: 100% OPERATIONAL`
        );

        this.debriefCard.setVisible(true);
    }

    clearSimulatorObjects() {
        for (const d of this.simActiveDrones) {
            if (d && d.active) d.destroy();
        }
        for (const orb of this.simActiveOrbs) {
            if (orb && orb.active) orb.destroy();
        }
        this.simActiveDrones = [];
        this.simActiveOrbs = [];
    }

    exitCombatSimulator() {
        this.inCombatSimulator = false;
        this.clearSimulatorObjects();
        this.combatLayer.setVisible(false);
        this.debriefCard.setVisible(false);
    }
}
