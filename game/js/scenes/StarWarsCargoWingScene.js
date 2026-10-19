// =========================================================================
// STAR WARS: CARGO BAY WING SCENE (DISNEY'S OCEANEER CLUB - DECK 2)
// Feature #45: Disney's Oceaneer Club on the Disney Destiny
// 8-Bit NES / Capcom Arcade Style (Phaser 3)
// =========================================================================

class StarWarsCargoWingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StarWarsCargoWingScene' });
    }

    init(data) {
        this.oceaneerHub = data ? data.oceaneerHub : null;
        this.gameScene = (data && data.gameScene) ? data.gameScene : (this.oceaneerHub ? this.oceaneerHub.gameScene : null);

        // Character Support for Riley & Amelia
        const charData = (typeof getActiveCharacterData === 'function')
            ? getActiveCharacterData(this.gameScene)
            : {
                charId: 'amelia',
                charName: 'AMELIA',
                displayName: 'Amelia',
                idleKey: 'amelia_idle',
                walkAnim: 'amelia_walk',
                idleAnim: 'amelia_idle',
                jumpKey: 'amelia_jump',
                bodyOffsetY: 24
            };
        this.charData = charData;

        // Player physics & 2.5D state
        this.groundY = 445;
        this.jumpZ = 0;
        this.jumpV = 0;
        this.isJumping = false;
        this.isExiting = false;
        this.playerSpeed = 175;

        // Scene Mode: 'explore', 'datapad', 'power_diagnostic'
        this.currentMode = 'explore';

        // Near station interaction flags
        this.nearStation = null; // 'exit', 'rey', 'chewie', 'terminal', 'porg', 'loth_cat', 'worrt', 'dianoga'
        this.speechEndTime = 0;
        this.currentSpeaker = null;

        // Mobile touch inputs
        this.mobileInput = { left: false, right: false, up: false, down: false, jump: false, action: false };

        // Load persisted Oceaneer progress
        const prog = (typeof getOceaneerProgress === 'function')
            ? getOceaneerProgress()
            : { cargoBayCreaturesTended: 0, cargoBayPowerScore: 0, starWarsBadge: false };
        this.savedProgress = prog;

        const alreadyTended = (prog.cargoBayCreaturesTended >= 4);

        // 4 Signature Star Wars Creatures Data & Care Status
        this.creatures = {
            porg: {
                id: 'porg',
                tabName: '1. PORG',
                name: 'PORG',
                species: 'Ahch-To Cliff Avian',
                homeworld: 'AHCH-TO',
                danger: 'HARMLESS & CURIOUS',
                diet: 'AHCH-TO SMELT & CRUSTACEANS',
                habitatTitle: 'AHCH-TO ROCKY CRAG HABITAT',
                scanned: alreadyTended,
                fed: alreadyTended,
                calmed: alreadyTended,
                happiness: alreadyTended ? 100 : 25,
                containment: 100,
                lore: 'Inquisitive seabirds that nest on sea cliffs. They mimic starship sirens and squawk with joyful chirps!',
                actionLogs: {
                    scan: 'BIO-SCAN COMPLETE: Avian feathers insulated for hyper-speed wind gusts. Vocal pitch: 1650 Hz.',
                    feed: 'FED FRESH SMELT: The Porg gobbled the fish snack and ruffled its plumage with happy chirps!',
                    calm: 'PLAYED RESONANCE WHISTLE: Porg hopped in circles flapping wings with ecstatic joy!'
                }
            },
            loth_cat: {
                id: 'loth_cat',
                tabName: '2. LOTH-CAT',
                name: 'LOTH-CAT',
                species: 'Tooka Feline Subspecies',
                homeworld: 'LOTHAL',
                danger: 'MODERATE (SHARP CLAWS)',
                diet: 'SLICED MEILOORUN FRUIT',
                habitatTitle: 'LOTHAL GRASSLAND TERRARIUM',
                scanned: alreadyTended,
                fed: alreadyTended,
                calmed: alreadyTended,
                happiness: alreadyTended ? 100 : 30,
                containment: 100,
                lore: 'Feisty grasslands predator from Lothal. Has sharp fangs and lightning reflexes, but purrs when scratched!',
                actionLogs: {
                    scan: 'BIO-SCAN COMPLETE: Sensory ear tufts detect vibrations at 50 kHz. Purr frequency: 32 Hz.',
                    feed: 'OFFERED MEILOORUN SLICE: Loth-Cat enthusiastically lapped up the fruit and wiped its whiskers!',
                    calm: 'SCRATCHED BEHIND EARS: Loth-Cat rolled onto its back with a loud, rumbling engine-like purr!'
                }
            },
            worrt: {
                id: 'worrt',
                tabName: '3. WORRT',
                name: 'WORRT',
                species: 'Predatory Desert Amphibian',
                homeworld: 'TATOOINE',
                danger: 'SNAPPING TONGUE HAZARD',
                diet: 'TATOOINE DUNE BEETLES',
                habitatTitle: 'TATOOINE SAND BIOSPHERE',
                scanned: alreadyTended,
                fed: alreadyTended,
                calmed: alreadyTended,
                happiness: alreadyTended ? 100 : 20,
                containment: 100,
                lore: 'Camouflaged ambush carnivore dwelling in the dunes of Tatooine. Snatches bugs with an ultra-fast tongue!',
                actionLogs: {
                    scan: 'BIO-SCAN COMPLETE: Thick epidermal warts resist heat & blasters. Tongue strike velocity: Mach 0.3.',
                    feed: 'DISPENSED DUNE BEETLE: *THWIP!* Worrt snapped its tongue across the chamber in 40 milliseconds!',
                    calm: 'COOLED WITH HYDRATION MIST: Worrt puffed up its throat sac and let out a deep, satisfied croak!'
                }
            },
            dianoga: {
                id: 'dianoga',
                tabName: '4. DIANOGA',
                name: 'DIANOGA',
                species: 'Vodran Cephalopod (Opechi)',
                homeworld: 'VODRAN',
                danger: 'HIGH (CONSTRICTOR TENTACLES)',
                diet: 'RESISTANCE RATION BLOCKS',
                habitatTitle: 'PRESSURIZED SLUDGE TANK',
                scanned: alreadyTended,
                fed: alreadyTended,
                calmed: alreadyTended,
                happiness: alreadyTended ? 100 : 15,
                containment: 100,
                lore: 'One-eyed amphibious scavenger infamous for thriving in starship waste tanks. Surprisingly intelligent and empathetic!',
                actionLogs: {
                    scan: 'BIO-SCAN COMPLETE: Retractable eyestalk with polarized 360° lens. 7 muscular tentacles verified.',
                    feed: 'DROPPED RATION BLOCK: Giant tentacle surged from the sludge and pulled the block underwater with a splash!',
                    calm: 'PLAYED ULTRASONIC FREQUENCY: Dianoga blinked its golden eye calmly and pressed a tentacle against the glass!'
                }
            }
        };

        this.selectedCreatureKey = 'porg';
        this.creatureTendedCount = alreadyTended ? 4 : 0;

        // Terminal Diagnostic Mini-game State
        this.diagActive = false;
        this.diagTimer = 30;
        this.diagScore = 0;
        this.diagCombo = 1;
        this.diagGridStability = 100;
        this.diagChannels = [
            { name: 'PORG COUPLING', val: 55, target: 50, dir: 1, speed: 1.2, alert: false },
            { name: 'LOTH-CAT SHIELD', val: 62, target: 50, dir: -1, speed: 1.5, alert: false },
            { name: 'WORRT CLIMATE', val: 48, target: 50, dir: 1, speed: 1.1, alert: false },
            { name: 'DIANOGA REGULATOR', val: 58, target: 50, dir: -1, speed: 1.8, alert: false }
        ];
    }

    create() {
        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.init) {
            retroArcadeAudio.init();
        }

        // Hide underlying scenes cleanly
        if (this.oceaneerHub && this.oceaneerHub.scene) {
            this.oceaneerHub.scene.setVisible(false);
        }
        if (this.gameScene && this.gameScene.scene) {
            this.gameScene.scene.setVisible(false);
            if (this.gameScene.scene.isActive()) {
                this.gameScene.scene.sleep();
            }
        }

        const W = this.scale.width;
        const H = this.scale.height;

        const roomH = Math.max(540, H);
        const roomW = Math.max(2000, W);
        this.roomW = roomW;
        this.roomH = roomH;

        const floorH = Math.max(140, Math.round(roomH * 0.25));
        const floorY = roomH - floorH;
        this.floorY = floorY;
        this.floorH = floorH;
        this.groundY = floorY + 35;

        this.physics.world.setBounds(0, 0, roomW, roomH);

        // Ensure crisp Capcom textures
        this.createTextures();

        // Ensure Character animations exist for Riley and Amelia
        this.ensureCharacterAnimations();

        // 0. Deep space background
        this.add.rectangle(0, 0, 10000, 10000, 0x05080f).setOrigin(0.5).setDepth(0);

        // 1. Starship Bulkhead Walls & Heavy Deck Grating Floor
        this.add.tileSprite(roomW / 2, floorY / 2, roomW, floorY, 'sw_cargo_wall').setDepth(1);
        this.add.tileSprite(roomW / 2, floorY + (floorH / 2), roomW, floorH, 'sw_cargo_floor').setDepth(2);

        // Floor hazard curb (hazard caution stripes & cyan energy conduit)
        const curb = this.add.graphics().setDepth(3);
        curb.fillStyle(0x00E5FF, 1);
        curb.fillRect(0, floorY - 3, roomW, 3);
        curb.fillStyle(0xF8B800, 0.85);
        curb.fillRect(0, floorY, roomW, 2);

        // Upper Bulkhead Framing & Portholes into Hyperspace / Starfield
        this.createStarshipAtmosphere(roomW, floorY);

        // ----------------------------------------------------
        // STATIONS ACROSS THE CARGO BAY
        // ----------------------------------------------------
        // Station 0: Oceaneer Club Hub Exit Door (x = 110)
        this.createExitStation(110, floorY);

        // Station 1: Rey NPC with Resistance Crates & Comms (x = 340)
        this.createReyStation(340, floorY);

        // Station 2: Porg Habitat - Ahch-To Crag (x = 610)
        this.createHabitatStation('porg', 610, floorY);

        // Station 3: Loth-Cat Habitat - Lothal Terrarium (x = 920)
        this.createHabitatStation('loth_cat', 920, floorY);

        // Station 4: Central Resistance Diagnostic Terminal (x = 1220)
        this.createTerminalStation(1220, floorY);

        // Station 5: Worrt Habitat - Tatooine Biosphere (x = 1520)
        this.createHabitatStation('worrt', 1520, floorY);

        // Station 6: Dianoga Habitat - Pressurized Tank (x = 1770)
        this.createHabitatStation('dianoga', 1770, floorY);

        // Station 7: Chewbacca NPC with Heavy Cargo Loader (x = 1920)
        this.createChewieStation(1920, floorY);

        // ----------------------------------------------------
        // 2.5D PLAYER SPRITE
        // ----------------------------------------------------
        const spawnX = 220;
        this.player = this.physics.add.sprite(spawnX, this.groundY, this.charData.idleKey).setDepth(Math.round(this.groundY));
        this.player.body.allowGravity = false;
        this.player.body.setSize(22, 16);
        this.player.body.setOffset(5, this.charData.bodyOffsetY || 28);

        // Player Foot Shadow
        this.playerShadow = this.add.ellipse(spawnX, this.groundY + 16, 26, 9, 0x000000, 0.45).setDepth(Math.round(this.groundY) - 1);

        // Camera Follow
        this.cameras.main.setBounds(0, 0, roomW, roomH);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        // Floating Station Prompt Text
        this.stationPrompt = this.add.text(spawnX, this.groundY - 55, '', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#FFFF00',
            backgroundColor: '#000000',
            padding: { x: 8, y: 5 },
            stroke: '#002244',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(2000).setVisible(false).setInteractive({ useHandCursor: true });
        this.stationPrompt.on('pointerdown', () => this.handleStationAction());

        // Capcom Speech Bubble System for NPCs & Comms
        this.createSpeechBubbleSystem();

        // Standalone Top HUD (Fixed on screen)
        this.createTopHUD(W);

        // Setup Controls (Keyboard + Mobile)
        this.setupControls(W, H);

        // Create Fullscreen Interactive Overlays (AR Datapad & Terminal Mini-game)
        this.createDatapadOverlay(W, H);
        this.createPowerDiagnosticOverlay(W, H);

        // Listen for screen resize
        this.scale.on('resize', this.handleResize, this);
    }

    // =========================================================================
    // TEXTURE GENERATION (NES / CAPCOM 8-BIT PROCEDURAL PIXEL ART)
    // =========================================================================
    createTextures() {
        // 1. Starship Bulkhead Wall Tile (64x64)
        if (!this.textures.exists('sw_cargo_wall')) {
            const g = this.add.graphics();
            g.fillStyle(0x131924, 1);
            g.fillRect(0, 0, 64, 64);
            g.fillStyle(0x1b2331, 1);
            g.fillRect(2, 2, 60, 60);
            g.fillStyle(0x232c3d, 1);
            g.fillRect(4, 4, 56, 56);

            // Steel Panel Inset & Aurebesh Trim
            g.fillStyle(0x171f2b, 1);
            g.fillRect(8, 8, 48, 48);
            g.fillStyle(0x00E5FF, 0.8);
            g.fillRect(10, 10, 12, 2);
            g.fillRect(10, 10, 2, 8);
            g.fillStyle(0xE65C00, 0.8);
            g.fillRect(42, 52, 12, 2);
            g.fillRect(52, 46, 2, 8);

            // Industrial Rivets
            g.fillStyle(0x3e4b5f, 1);
            [4, 60].forEach(rx => {
                [4, 60].forEach(ry => {
                    g.fillRect(rx - 1, ry - 1, 2, 2);
                });
            });
            g.generateTexture('sw_cargo_wall', 64, 64);
            g.destroy();
        }

        // 2. Starship Cargo Deck Floor Tile (48x48)
        if (!this.textures.exists('sw_cargo_floor')) {
            const g = this.add.graphics();
            g.fillStyle(0x181e26, 1);
            g.fillRect(0, 0, 48, 48);
            g.fillStyle(0x222a36, 1);
            g.fillRect(2, 2, 44, 44);

            // Metal Grating crosshatch
            g.fillStyle(0x151b22, 1);
            for (let i = 4; i < 44; i += 8) {
                g.fillRect(i, 4, 2, 40);
                g.fillRect(4, i, 40, 2);
            }
            g.fillStyle(0x354050, 0.7);
            for (let i = 6; i < 42; i += 8) {
                g.fillRect(i, i, 2, 2);
            }
            g.generateTexture('sw_cargo_floor', 48, 48);
            g.destroy();
        }

        // 3. Stacked Resistance Cargo Containers (64x54)
        if (!this.textures.exists('sw_crates')) {
            const g = this.add.graphics();
            // Lower heavy cargo crate
            g.fillStyle(0x2a3644, 1);
            g.fillRect(2, 20, 60, 34);
            g.fillStyle(0x3c4c5e, 1);
            g.fillRect(4, 22, 56, 30);
            g.fillStyle(0x1c242e, 1);
            g.strokeRect(2, 20, 60, 34);

            // Resistance Starbird Crest in Orange
            g.fillStyle(0xFF6B1A, 1);
            g.fillTriangle(32, 26, 24, 38, 40, 38);
            g.fillRect(30, 36, 4, 8);
            g.fillStyle(0xFFD700, 1);
            g.fillRect(31, 30, 2, 4);

            // Upper Smaller Crate
            g.fillStyle(0x4b5d73, 1);
            g.fillRect(10, 2, 44, 18);
            g.fillStyle(0x5a6f8a, 1);
            g.fillRect(12, 4, 40, 14);
            g.fillStyle(0x00E5FF, 1);
            g.fillRect(14, 8, 12, 3); // Datapad barcode strip
            g.generateTexture('sw_crates', 64, 54);
            g.destroy();
        }

        // 4. Rey 8-Bit Capcom NPC Sprite (32x48)
        if (!this.textures.exists('sw_npc_rey')) {
            const g = this.add.graphics();
            // Scavenger staff strapped diagonally across back
            g.fillStyle(0x707b7c, 1);
            g.lineBetween(4, 4, 28, 46);
            g.lineBetween(5, 4, 29, 46);
            g.fillStyle(0xbdc3c7, 1);
            g.fillRect(14, 20, 4, 6); // staff wrap

            // Hair (Triple buns)
            g.fillStyle(0x3e2714, 1);
            g.fillCircle(16, 8, 7); // center bun
            g.fillCircle(16, 4, 4); // top bun
            g.fillCircle(16, 12, 4); // lower bun
            g.fillStyle(0x5d3a1a, 1);
            g.fillRect(14, 6, 4, 6);

            // Face
            g.fillStyle(0xFCD8A8, 1);
            g.fillRect(11, 10, 10, 10);
            g.fillStyle(0x000000, 1);
            g.fillRect(18, 13, 2, 2); // eye
            g.fillStyle(0xD89060, 1);
            g.fillRect(17, 17, 3, 1); // mouth

            // Desert Scavenger Wraps / Tunic
            g.fillStyle(0xDFD4BD, 1);
            g.fillRect(10, 20, 12, 14);
            g.fillStyle(0xB8A88E, 1);
            g.lineBetween(10, 20, 22, 32);
            g.lineBetween(22, 20, 10, 32);

            // Brown Belt & Holster
            g.fillStyle(0x5D4037, 1);
            g.fillRect(9, 32, 14, 3);
            g.fillStyle(0xD4AF37, 1);
            g.fillRect(15, 32, 2, 3); // buckle
            g.fillStyle(0x3E2723, 1);
            g.fillRect(19, 34, 4, 6); // blaster holster

            // Scavenger Pants & Boots
            g.fillStyle(0x546E7A, 1);
            g.fillRect(11, 35, 4, 6);
            g.fillRect(17, 35, 4, 6);
            g.fillStyle(0x4E342E, 1);
            g.fillRect(10, 41, 5, 6);
            g.fillRect(17, 41, 5, 6);
            g.generateTexture('sw_npc_rey', 32, 48);
            g.destroy();
        }

        // 5. Chewbacca 8-Bit Capcom NPC Sprite (36x56)
        if (!this.textures.exists('sw_npc_chewie')) {
            const g = this.add.graphics();
            // Shaggy Wookiee Head & Body
            g.fillStyle(0x3E2723, 1);
            g.fillRect(8, 4, 20, 50);
            g.fillStyle(0x5D4037, 1);
            g.fillRect(10, 6, 16, 46);
            g.fillStyle(0x795548, 1);
            g.fillRect(12, 8, 12, 42);

            // Wookiee Ears & Head Silhouette
            g.fillRect(6, 6, 4, 8);
            g.fillRect(26, 6, 4, 8);
            g.fillRect(8, 2, 20, 4);

            // Eyes & Nose / Muzzle
            g.fillStyle(0x00E5FF, 1);
            g.fillRect(13, 12, 2, 2);
            g.fillRect(21, 12, 2, 2);
            g.fillStyle(0x000000, 1);
            g.fillRect(16, 15, 4, 3);
            g.fillStyle(0x8D6E63, 1);
            g.fillRect(14, 18, 8, 4);

            // Iconic Diagonal Bandolier with Ammo Cartridges
            g.fillStyle(0x212121, 1);
            g.lineStyle(4, 0x212121, 1);
            g.lineBetween(10, 16, 26, 48);
            g.fillStyle(0xD4AF37, 1);
            for (let i = 0; i < 5; i++) {
                g.fillRect(11 + i * 3, 18 + i * 6, 3, 2);
                g.fillStyle(0xE0E0E0, 1);
                g.fillRect(12 + i * 3, 17 + i * 6, 2, 1);
            }
            // Leather Hip Satchel
            g.fillStyle(0x4E342E, 1);
            g.fillRect(24, 42, 8, 8);
            g.fillStyle(0xD4AF37, 1);
            g.fillRect(27, 44, 2, 2);

            // Big Shaggy Feet
            g.fillStyle(0x3E2723, 1);
            g.fillRect(8, 50, 9, 6);
            g.fillRect(19, 50, 9, 6);
            g.generateTexture('sw_npc_chewie', 36, 56);
            g.destroy();
        }

        // 6. Central Resistance Diagnostic Terminal (64x54)
        if (!this.textures.exists('sw_terminal')) {
            const g = this.add.graphics();
            // Hexagonal Pedestal Base
            g.fillStyle(0x1A252F, 1);
            g.fillRect(12, 34, 40, 20);
            g.fillStyle(0x2C3E50, 1);
            g.fillRect(16, 36, 32, 16);

            // Slanted Console Face
            g.fillStyle(0x34495E, 1);
            g.fillTriangle(6, 34, 58, 34, 48, 16);
            g.fillTriangle(6, 34, 16, 16, 48, 16);
            g.fillStyle(0x00E5FF, 1);
            g.fillRect(18, 20, 28, 10); // glowing console screen

            // Diagnostic Grid Lines
            g.fillStyle(0x002B47, 1);
            g.fillRect(20, 22, 24, 6);
            g.fillStyle(0x00FFAA, 1);
            g.fillRect(22, 24, 6, 2);
            g.fillStyle(0xF8B800, 1);
            g.fillRect(30, 24, 6, 2);
            g.fillStyle(0xFF3366, 1);
            g.fillRect(38, 24, 4, 2);

            // Overhead Holographic Projector Emitter
            g.fillStyle(0x00E5FF, 0.4);
            g.fillTriangle(32, 14, 20, 0, 44, 0);
            g.fillStyle(0xFFFFFF, 0.9);
            g.fillCircle(32, 14, 3);
            g.generateTexture('sw_terminal', 64, 54);
            g.destroy();
        }

        // 7. Habitat: Porg Crag (Ahch-To Rocky Cliff) (72x60)
        if (!this.textures.exists('sw_hab_porg')) {
            const g = this.add.graphics();
            // Stepped rock pedestal
            g.fillStyle(0x424949, 1);
            g.fillRect(6, 26, 60, 32);
            g.fillStyle(0x5D6D7E, 1);
            g.fillRect(12, 16, 48, 20);
            g.fillStyle(0x27AE60, 1); // Ahch-To sea moss
            g.fillRect(14, 16, 16, 4);
            g.fillRect(36, 24, 12, 3);

            // Containment Emitter Pylons & Blue Forcefield Beams
            g.fillStyle(0x1F2A38, 1);
            g.fillRect(4, 6, 6, 48);
            g.fillRect(62, 6, 6, 48);
            g.fillStyle(0x00E5FF, 1);
            g.fillRect(6, 8, 2, 4);
            g.fillRect(64, 8, 2, 4);
            g.fillStyle(0x00E5FF, 0.35);
            g.fillRect(10, 8, 52, 2);
            g.fillRect(10, 18, 52, 2);
            g.fillRect(10, 30, 52, 2);

            // Small Porg on rock
            g.fillStyle(0x5D4037, 1);
            g.fillCircle(36, 14, 6);
            g.fillStyle(0xFFFFFF, 1);
            g.fillCircle(36, 16, 4);
            g.fillStyle(0xF39C12, 1);
            g.fillRect(35, 13, 2, 2); // beak
            g.generateTexture('sw_hab_porg', 72, 60);
            g.destroy();
        }

        // 8. Habitat: Loth-Cat Terrarium (72x60)
        if (!this.textures.exists('sw_hab_lothcat')) {
            const g = this.add.graphics();
            // Terrarium Base
            g.fillStyle(0x2C3E50, 1);
            g.fillRect(4, 38, 64, 20);
            g.fillStyle(0x34495E, 1);
            g.fillRect(8, 40, 56, 16);

            // Lothal Warm Grassland Interior
            g.fillStyle(0xD35400, 0.3);
            g.fillRect(8, 8, 56, 30);
            g.fillStyle(0x2ECC71, 1);
            g.fillRect(10, 34, 52, 4);
            g.fillStyle(0x795548, 1);
            g.fillRect(16, 26, 14, 8); // scratching log

            // Glass Framing & Magnetic Containment Arch
            g.lineStyle(2, 0x00E5FF, 0.8);
            g.strokeRect(8, 8, 56, 30);
            g.lineBetween(12, 10, 24, 22); // glass glare

            // Loth-cat curled up
            g.fillStyle(0xE67E22, 1);
            g.fillEllipse(42, 30, 8, 5);
            g.fillCircle(48, 27, 4);
            g.fillStyle(0xD35400, 1);
            g.fillRect(40, 28, 2, 4); // stripes
            g.generateTexture('sw_hab_lothcat', 72, 60);
            g.destroy();
        }

        // 9. Habitat: Worrt Biosphere (72x60)
        if (!this.textures.exists('sw_hab_worrt')) {
            const g = this.add.graphics();
            // Sand containment basin
            g.fillStyle(0x2C3E50, 1);
            g.fillRect(4, 38, 64, 20);
            g.fillStyle(0xF5CBA7, 1); // Tatooine dune sand
            g.fillRect(8, 32, 56, 12);
            g.fillStyle(0xEDBB99, 1);
            g.fillRect(12, 30, 24, 4);

            // Overhead Tatooine Heat Lamp & Moisture Condenser
            g.fillStyle(0x7F8C8D, 1);
            g.fillRect(32, 4, 8, 16);
            g.fillStyle(0xF39C12, 0.9);
            g.fillCircle(36, 20, 6);
            g.fillStyle(0xF1C40F, 0.3);
            g.fillTriangle(36, 20, 16, 40, 56, 40); // heat light cone

            // Worrt Frog Body in sand
            g.fillStyle(0xB7950B, 1);
            g.fillCircle(28, 30, 7);
            g.fillStyle(0x7D6608, 1);
            g.fillCircle(25, 26, 3); // eye bump
            g.fillStyle(0xF39C12, 1);
            g.fillRect(24, 25, 2, 2); // yellow eye
            g.generateTexture('sw_hab_worrt', 72, 60);
            g.destroy();
        }

        // 10. Habitat: Dianoga Liquid Cargo Tank (76x64)
        if (!this.textures.exists('sw_hab_dianoga')) {
            const g = this.add.graphics();
            // Reinforced Industrial Tank Base & Rings
            g.fillStyle(0x1F2A38, 1);
            g.fillRect(6, 46, 64, 16);
            g.fillStyle(0x2C3E50, 1);
            g.fillRect(10, 48, 56, 12);

            // Cylindrical Glass Tank filled with bubbling sludge
            g.fillStyle(0x0E3D23, 1);
            g.fillRect(10, 10, 56, 36);
            g.fillStyle(0x145A32, 1);
            g.fillRect(12, 16, 52, 28);

            // Water surface ripples & bubbles
            g.fillStyle(0x27AE60, 1);
            g.fillRect(12, 16, 52, 2);
            g.fillStyle(0x52BE80, 0.8);
            g.fillCircle(22, 26, 2);
            g.fillCircle(38, 32, 3);
            g.fillCircle(50, 22, 2);

            // Eyestalk peaking out of water!
            g.fillStyle(0x196F3D, 1);
            g.fillRect(33, 8, 4, 12);
            g.fillStyle(0xF1C40F, 1); // Yellow reptilian eye
            g.fillCircle(35, 7, 4);
            g.fillStyle(0x000000, 1);
            g.fillRect(34, 6, 2, 2); // slit pupil

            // Pressure gauge on side
            g.fillStyle(0xBDC3C7, 1);
            g.fillCircle(68, 24, 5);
            g.fillStyle(0xE74C3C, 1);
            g.fillRect(67, 21, 2, 3);
            g.generateTexture('sw_hab_dianoga', 76, 64);
            g.destroy();
        }
    }

    ensureCharacterAnimations() {
        ['riley', 'amelia'].forEach(prefix => {
            if (this.textures.exists(prefix + '_walk_0') && !this.anims.exists(prefix + '_walk')) {
                this.anims.create({
                    key: prefix + '_walk',
                    frames: [
                        { key: prefix + '_walk_0' },
                        { key: prefix + '_walk_1' },
                        { key: prefix + '_walk_2' },
                        { key: prefix + '_walk_1' }
                    ],
                    frameRate: 8,
                    repeat: -1
                });
            }
            if (this.textures.exists(prefix + '_idle') && !this.anims.exists(prefix + '_idle')) {
                this.anims.create({
                    key: prefix + '_idle',
                    frames: [{ key: prefix + '_idle' }],
                    frameRate: 1
                });
            }
            if (this.textures.exists(prefix + '_jump') && !this.anims.exists(prefix + '_jump')) {
                this.anims.create({
                    key: prefix + '_jump',
                    frames: [{ key: prefix + '_jump' }],
                    frameRate: 1
                });
            }
        });
    }

    // =========================================================================
    // STARSHIP ENVIRONMENT & BULKHEAD ATMOSPHERE
    // =========================================================================
    createStarshipAtmosphere(roomW, floorY) {
        // Overhead Heavy Gantry Crane Rail
        const gantry = this.add.graphics().setDepth(4);
        gantry.fillStyle(0x1C2833, 1);
        gantry.fillRect(0, 24, roomW, 14);
        gantry.fillStyle(0xF39C12, 1);
        gantry.fillRect(0, 36, roomW, 2);

        // Crane Trolley hoist with suspended cargo crate
        const craneX = 1350;
        gantry.fillStyle(0x566573, 1);
        gantry.fillRect(craneX - 25, 20, 50, 18);
        gantry.fillStyle(0x00E5FF, 1);
        gantry.fillRect(craneX - 4, 38, 8, 4);
        // Suspension cable & container
        gantry.lineStyle(2, 0xBDC3C7, 1);
        gantry.lineBetween(craneX - 12, 42, craneX - 12, 72);
        gantry.lineBetween(craneX + 12, 42, craneX + 12, 72);

        const suspendedCrate = this.add.image(craneX, 90, 'sw_crates').setDepth(4);
        this.tweens.add({
            targets: suspendedCrate,
            y: 95,
            duration: 2200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Observation Portholes with Twinkling Starfield
        const portholeY = Math.round(floorY * 0.35);
        [240, 780, 1380, 1880].forEach(px => {
            const port = this.add.graphics().setDepth(3);
            port.fillStyle(0x0A111C, 1);
            port.fillCircle(px, portholeY, 44);
            port.fillStyle(0x05080E, 1);
            port.fillCircle(px, portholeY, 40);
            port.lineStyle(4, 0x34495E, 1);
            port.strokeCircle(px, portholeY, 42);

            // Twinkling stars
            for (let s = 0; s < 7; s++) {
                const sx = px + Phaser.Math.Between(-28, 28);
                const sy = portholeY + Phaser.Math.Between(-28, 28);
                const star = this.add.text(sx, sy, '✦', { fontSize: '6px', fill: '#A0D0FF' }).setOrigin(0.5).setDepth(4);
                this.tweens.add({
                    targets: star,
                    alpha: 0.1,
                    duration: Phaser.Math.Between(700, 1600),
                    yoyo: true,
                    repeat: -1
                });
            }
        });

        // Steam Vents with procedural steam puffs
        this.steamPoints = [420, 1060, 1680];
        this.time.addEvent({
            delay: 1500,
            loop: true,
            callback: () => {
                if (this.currentMode !== 'explore') return;
                const sx = Phaser.Utils.Array.GetRandom(this.steamPoints);
                const steam = this.add.circle(sx, floorY - 50, 4, 0xECF0F1, 0.6).setDepth(5);
                this.tweens.add({
                    targets: steam,
                    y: floorY - 120,
                    x: sx + Phaser.Math.Between(-15, 15),
                    scale: 3.5,
                    alpha: 0,
                    duration: 1800,
                    onComplete: () => steam.destroy()
                });
            }
        });

        // Aurebesh Cargo Bay Identification Signs on walls
        this.add.text(480, floorY - 95, 'CARGO BAY 04 // LIVE SPECIMENS', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00E5FF'
        }).setDepth(3);

        this.add.text(1280, floorY - 95, 'RESISTANCE OUTPOST // DECK 2', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#F39C12'
        }).setDepth(3);
    }

    // =========================================================================
    // STATIONS & INTERACTIVE ZONES
    // =========================================================================
    createExitStation(x, floorY) {
        // Octagonal Door Frame
        const door = this.add.rectangle(x, floorY - 55, 60, 110, 0x0A111C).setDepth(3);
        door.setStrokeStyle(3, 0x34495E);

        this.add.rectangle(x, floorY - 55, 50, 100, 0x152232).setDepth(3);
        this.add.text(x, floorY - 125, 'OCEANEER HUB', {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00FFAA',
            backgroundColor: '#000000',
            padding: { x: 4, y: 3 }
        }).setOrigin(0.5).setDepth(5);

        const sign = this.add.text(x, floorY - 142, '◄ RETURN TO HUB', {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#FFFFFF',
            backgroundColor: '#003366',
            padding: { x: 4, y: 2 }
        }).setOrigin(0.5).setDepth(5).setInteractive({ useHandCursor: true });
        sign.on('pointerdown', () => this.returnToHub());
    }

    createReyStation(x, floorY) {
        // Crates behind Rey
        this.add.image(x - 28, floorY - 24, 'sw_crates').setDepth(4);

        // Rey NPC Sprite
        this.reySprite = this.add.image(x, floorY - 16, 'sw_npc_rey').setDepth(10).setInteractive({ useHandCursor: true });
        this.reySprite.on('pointerdown', () => this.talkToRey());

        // Comms Banner
        this.add.text(x, floorY - 60, 'REY', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00E5FF',
            backgroundColor: '#000000',
            padding: { x: 4, y: 2 }
        }).setOrigin(0.5).setDepth(5);

        // Subtle idle breathing tween
        this.tweens.add({
            targets: this.reySprite,
            scaleY: 1.03,
            duration: 1200,
            yoyo: true,
            repeat: -1
        });
    }

    createChewieStation(x, floorY) {
        // Crates behind Chewie
        this.add.image(x + 24, floorY - 24, 'sw_crates').setDepth(4);

        // Chewbacca NPC Sprite
        this.chewieSprite = this.add.image(x, floorY - 20, 'sw_npc_chewie').setDepth(10).setInteractive({ useHandCursor: true });
        this.chewieSprite.on('pointerdown', () => this.talkToChewie());

        // Comms Banner
        this.add.text(x, floorY - 65, 'CHEWBACCA', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#F39C12',
            backgroundColor: '#000000',
            padding: { x: 4, y: 2 }
        }).setOrigin(0.5).setDepth(5);

        // Idle breathing tween
        this.tweens.add({
            targets: this.chewieSprite,
            scaleY: 1.025,
            duration: 1400,
            yoyo: true,
            repeat: -1
        });
    }

    createTerminalStation(x, floorY) {
        this.terminalSprite = this.add.image(x, floorY - 20, 'sw_terminal').setDepth(10).setInteractive({ useHandCursor: true });
        this.terminalSprite.on('pointerdown', () => this.openPowerDiagnostic());

        this.add.text(x, floorY - 65, '⚡ DIAGNOSTIC TERMINAL ⚡', {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00FFAA',
            backgroundColor: '#001A33',
            padding: { x: 6, y: 3 }
        }).setOrigin(0.5).setDepth(5);

        // Hologram pulse tween
        this.tweens.add({
            targets: this.terminalSprite,
            alpha: 0.9,
            duration: 900,
            yoyo: true,
            repeat: -1
        });
    }

    createHabitatStation(key, x, floorY) {
        const textureMap = {
            porg: 'sw_hab_porg',
            loth_cat: 'sw_hab_lothcat',
            worrt: 'sw_hab_worrt',
            dianoga: 'sw_hab_dianoga'
        };

        const habSprite = this.add.image(x, floorY - 22, textureMap[key]).setDepth(9).setInteractive({ useHandCursor: true });
        habSprite.on('pointerdown', () => this.openDatapadForCreature(key));

        const creature = this.creatures[key];

        // Habitat Name Plate
        this.add.text(x, floorY - 65, creature.name, {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#FFFF00',
            backgroundColor: '#000000',
            padding: { x: 5, y: 3 }
        }).setOrigin(0.5).setDepth(5);

        // Subtle ambient creature animation
        this.tweens.add({
            targets: habSprite,
            y: floorY - 24,
            duration: 1000 + Math.random() * 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    // =========================================================================
    // CAPCOM SPEECH BUBBLE SYSTEM
    // =========================================================================
    createSpeechBubbleSystem() {
        this.speechBox = this.add.graphics().setDepth(2500).setVisible(false);
        this.speechText = this.add.text(0, 0, '', {
            fontSize: '7px',
            fill: '#F8B800',
            fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000',
            strokeThickness: 1,
            align: 'center',
            wordWrap: { width: 180 }
        }).setOrigin(0, 0).setDepth(2501).setVisible(false);

        this.reyQuotes = [
            'WELCOME ABOARD! THE RESISTANCE NEEDS HELP CARING FOR THESE CREATURES!',
            'Porgs from Ahch-To love small fish snacks! Be gentle when you play with them.',
            'That Loth-Cat might look prickly, but scratch behind its ears and it purrs like an engine!',
            'The Worrt has an appetite for desert bugs. Keep your distance when its tongue snaps!',
            'Keep an eye on Chewie\'s diagnostic terminal! The power couplings need constant tuning.'
        ];

        this.chewieQuotes = [
            'RRRAARRWHHGWWR! [CHECK THE DIANOGA TANK!]',
            'AARRRWWGGH! [The Dianoga loves raw ration blocks, but watch your fingers!]',
            'GRRR-WOOF! [The power grid is fluctuating! Jump on the terminal!]',
            'HWWRRR-UGH! [You\'re doing great, Resistance Creature Handler!]'
        ];

        this.reyQuoteIndex = 0;
        this.chewieQuoteIndex = 0;
    }

    showSpeechBubble(speaker, quote, durationMs = 4000) {
        this.currentSpeaker = speaker;
        this.speechEndTime = this.time.now + durationMs;

        this.speechText.setText(quote);
        const padX = 8;
        const padY = 6;
        const w = this.speechText.width + padX * 2;
        const h = this.speechText.height + padY * 2;

        let bx = speaker.x - w / 2;
        let by = speaker.y - 50 - h;
        bx = Phaser.Math.Clamp(bx, 20, this.roomW - w - 20);

        this.speechBox.clear();
        this.speechBox.fillStyle(0x000000, 1);
        this.speechBox.fillRect(bx - 2, by - 2, w + 4, h + 4);
        this.speechBox.fillStyle(0x001428, 0.95);
        this.speechBox.fillRect(bx, by, w, h);
        this.speechBox.lineStyle(1, 0x00E5FF, 1);
        this.speechBox.strokeRect(bx, by, w, h);

        const arrowX = Phaser.Math.Clamp(speaker.x, bx + 10, bx + w - 10);
        const arrowY = by + h;
        this.speechBox.fillStyle(0x001428, 0.95);
        this.speechBox.fillTriangle(arrowX - 4, arrowY, arrowX + 4, arrowY, arrowX, arrowY + 6);
        this.speechBox.lineStyle(1, 0x00E5FF, 1);
        this.speechBox.lineBetween(arrowX - 4, arrowY, arrowX, arrowY + 6);
        this.speechBox.lineBetween(arrowX, arrowY + 6, arrowX + 4, arrowY);

        this.speechText.setPosition(bx + padX, by + padY);
        this.speechBox.setVisible(true);
        this.speechText.setVisible(true);
    }

    talkToRey() {
        const quote = this.reyQuotes[this.reyQuoteIndex % this.reyQuotes.length];
        this.reyQuoteIndex++;
        this.playCommsChirp();
        this.showSpeechBubble(this.reySprite, 'REY: ' + quote);
    }

    talkToChewie() {
        const quote = this.chewieQuotes[this.chewieQuoteIndex % this.chewieQuotes.length];
        this.chewieQuoteIndex++;
        this.playChewieRoar();
        this.showSpeechBubble(this.chewieSprite, 'CHEWBACCA: ' + quote);
    }

    // =========================================================================
    // TOP HUD & RESISTANCE STATUS (STANDALONE INTERACTIVE BUTTONS)
    // =========================================================================
    createTopHUD(W) {
        // Container fixed on screen
        this.hudContainer = this.add.container(0, 0).setScrollFactor(0).setDepth(2000);

        // Top-Left: AR Datapad Launcher Button
        const datapadBtn = this.add.text(15, 20, '[ 📱 AR DATAPAD ]', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00FFAA',
            backgroundColor: '#002233',
            padding: { x: 8, y: 6 }
        }).setInteractive({ useHandCursor: true });
        datapadBtn.on('pointerdown', () => this.openDatapad());
        this.hudContainer.add(datapadBtn);

        // Top-Center Left: Power Terminal Launcher Button
        const terminalBtn = this.add.text(175, 20, '[ ⚡ POWER GRID ]', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#FFD700',
            backgroundColor: '#221100',
            padding: { x: 8, y: 6 }
        }).setInteractive({ useHandCursor: true });
        terminalBtn.on('pointerdown', () => this.openPowerDiagnostic());
        this.hudContainer.add(terminalBtn);

        // Top-Right: Required Oceaneer Hub Exit Button
        this.hubExitBtn = this.add.text(W - 80, 20, '[ ◄ OCEANEER HUB ]', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#FF5555',
            backgroundColor: '#000000',
            padding: { x: 8, y: 6 }
        }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
        this.hubExitBtn.on('pointerdown', () => this.returnToHub());
        this.hudContainer.add(this.hubExitBtn);

        // Resistance Creature Care Status Tracker
        this.careStatusText = this.add.text(15, 45, '', {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#A0D0FF',
            backgroundColor: '#000000',
            padding: { x: 6, y: 4 }
        });
        this.hudContainer.add(this.careStatusText);
        this.updateCareStatusHUD();
    }

    updateCareStatusHUD() {
        let count = 0;
        ['porg', 'loth_cat', 'worrt', 'dianoga'].forEach(k => {
            const c = this.creatures[k];
            if (c.scanned && c.fed && c.calmed) count++;
        });
        this.creatureTendedCount = count;

        const badgeUnlocked = this.savedProgress.starWarsBadge || (count >= 4);
        const badgeStr = badgeUnlocked ? '★ BADGE EARNED' : `${count}/4 TENDED`;
        this.careStatusText.setText(`CREATURES: ${badgeStr}`);
        if (badgeUnlocked) {
            this.careStatusText.setColor('#00FFAA');
        }
    }

    // =========================================================================
    // CONTROLS (DESKTOP KEYBOARD + MOBILE TOUCH)
    // =========================================================================
    setupControls(W, H) {
        // Keyboard
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
                Phaser.Input.Keyboard.KeyCodes.ONE,
                Phaser.Input.Keyboard.KeyCodes.TWO,
                Phaser.Input.Keyboard.KeyCodes.THREE,
                Phaser.Input.Keyboard.KeyCodes.FOUR
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
            num1: Phaser.Input.Keyboard.KeyCodes.ONE,
            num2: Phaser.Input.Keyboard.KeyCodes.TWO,
            num3: Phaser.Input.Keyboard.KeyCodes.THREE,
            num4: Phaser.Input.Keyboard.KeyCodes.FOUR
        });

        // Dedicated ESC handler
        this.input.keyboard.on('keydown-ESC', () => {
            if (this.currentMode === 'datapad') {
                this.closeDatapad();
            } else if (this.currentMode === 'power_diagnostic') {
                this.closePowerDiagnostic();
            } else {
                this.returnToHub();
            }
        });

        // 1-4 shortcut keys
        [1, 2, 3, 4].forEach(num => {
            this.input.keyboard.on(`keydown-${num}`, () => {
                if (this.currentMode === 'datapad') {
                    const keys = ['porg', 'loth_cat', 'worrt', 'dianoga'];
                    this.selectDatapadCreature(keys[num - 1]);
                } else if (this.currentMode === 'power_diagnostic' && this.diagActive) {
                    this.stabilizeChannel(num - 1);
                }
            });
        });

        // Left / Right / A / D keys to switch creatures while AR Datapad is open
        const onLeftNav = () => {
            if (this.currentMode === 'datapad') this.navigateDatapadCreature(-1);
        };
        const onRightNav = () => {
            if (this.currentMode === 'datapad') this.navigateDatapadCreature(1);
        };
        this.input.keyboard.on('keydown-LEFT', onLeftNav);
        this.input.keyboard.on('keydown-A', onLeftNav);
        this.input.keyboard.on('keydown-RIGHT', onRightNav);
        this.input.keyboard.on('keydown-D', onRightNav);

        // Window event safety cleanups
        const resetKeys = () => {
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
            }
            this.mobileInput = { left: false, right: false, up: false, down: false, jump: false, action: false };
        };

        window.addEventListener('blur', resetKeys);
        window.addEventListener('focus', resetKeys);
        this.events.once('shutdown', () => {
            window.removeEventListener('blur', resetKeys);
            window.removeEventListener('focus', resetKeys);
        });

        // Mobile On-Screen Touch Controls
        this.createMobileTouchControls(W, H);
    }

    createMobileTouchControls(W, H) {
        this.mobileControlsContainer = this.add.container(0, 0).setScrollFactor(0).setDepth(2000);

        // Only display if touch is supported or mobile viewport
        const isTouch = !this.sys.game.device.os.desktop || this.sys.game.device.input.touch;
        if (!isTouch && W > 800) {
            this.mobileControlsContainer.setVisible(false);
            return;
        }

        const btnY = H - 50;

        // Bottom-Left D-pad: Left & Right
        const leftBtn = this.add.rectangle(45, btnY, 50, 44, 0x000000, 0.7)
            .setStrokeStyle(2, 0x00E5FF)
            .setInteractive();
        const leftText = this.add.text(45, btnY, '◄', { fontSize: '14px', fill: '#00E5FF' }).setOrigin(0.5);

        leftBtn.on('pointerdown', () => { this.mobileInput.left = true; });
        leftBtn.on('pointerup', () => { this.mobileInput.left = false; });
        leftBtn.on('pointerout', () => { this.mobileInput.left = false; });

        const rightBtn = this.add.rectangle(110, btnY, 50, 44, 0x000000, 0.7)
            .setStrokeStyle(2, 0x00E5FF)
            .setInteractive();
        const rightText = this.add.text(110, btnY, '►', { fontSize: '14px', fill: '#00E5FF' }).setOrigin(0.5);

        rightBtn.on('pointerdown', () => { this.mobileInput.right = true; });
        rightBtn.on('pointerup', () => { this.mobileInput.right = false; });
        rightBtn.on('pointerout', () => { this.mobileInput.right = false; });

        // Bottom-Right: Jump & Action
        const jumpBtn = this.add.rectangle(W - 125, btnY, 54, 44, 0x000000, 0.7)
            .setStrokeStyle(2, 0xFFD700)
            .setInteractive();
        const jumpText = this.add.text(W - 125, btnY, 'JUMP', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#FFD700'
        }).setOrigin(0.5);

        jumpBtn.on('pointerdown', () => { this.tryJump(); });

        const actBtn = this.add.rectangle(W - 55, btnY, 54, 44, 0x000000, 0.7)
            .setStrokeStyle(2, 0x00FFAA)
            .setInteractive();
        const actText = this.add.text(W - 55, btnY, 'ACT', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00FFAA'
        }).setOrigin(0.5);

        actBtn.on('pointerdown', () => { this.handleStationAction(); });

        this.mobileControlsContainer.add([leftBtn, leftText, rightBtn, rightText, jumpBtn, jumpText, actBtn, actText]);
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

    handleResize(gameSize) {
        const W = gameSize.width;
        const H = gameSize.height;
        if (this.hubExitBtn) {
            this.hubExitBtn.setX(W - 80);
        }
    }

    // =========================================================================
    // ACTIVITY 1: AR DATAPAD EXOTIC CREATURE HANDLER (INTERACTIVE MODAL)
    // =========================================================================
    createDatapadOverlay(W, H) {
        this.datapadContainer = this.add.container(0, 0).setScrollFactor(0).setDepth(3000).setVisible(false);

        // Semi-transparent backdrop
        this.dpBackdrop = this.add.rectangle(0, 0, 4000, 4000, 0x000000, 0.85).setOrigin(0.5);
        this.datapadContainer.add(this.dpBackdrop);

        // Datapad Bezel & Display Frame (width ~ 680, height ~ 450)
        const frameW = 680;
        const frameH = 450;
        const cx = W / 2;
        const cy = H / 2;

        const bezel = this.add.rectangle(cx, cy, frameW, frameH, 0x1A2533)
            .setStrokeStyle(3, 0x00E5FF);
        const innerScreen = this.add.rectangle(cx, cy, frameW - 16, frameH - 16, 0x05131E);

        // Header Title
        const header = this.add.text(cx, cy - 200, '// RESISTANCE AR DATAPAD // SPECIMEN HANDLER', {
            fontSize: '9px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00FFAA'
        }).setOrigin(0.5);

        // Close Button
        const closeBtn = this.add.text(cx + 250, cy - 200, '[ ✕ CLOSE ]', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#FF5555',
            backgroundColor: '#000000',
            padding: { x: 5, y: 3 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => this.closeDatapad());

        this.datapadContainer.add([bezel, innerScreen, header, closeBtn]);

        // Creature Selection Tabs (4 tabs at top)
        this.creatureTabs = {};
        const tabKeys = ['porg', 'loth_cat', 'worrt', 'dianoga'];
        const tabW = 145;
        const startX = cx - (tabW * 1.5);

        tabKeys.forEach((key, idx) => {
            const tx = startX + (idx * tabW);
            const ty = cy - 165;
            const tabBox = this.add.rectangle(tx, ty, tabW - 8, 24, 0x152232)
                .setStrokeStyle(1, 0x34495E)
                .setInteractive({ useHandCursor: true });
            const tabTxt = this.add.text(tx, ty, this.creatures[key].tabName, {
                fontSize: '7px',
                fontFamily: '"Press Start 2P", monospace',
                fill: '#A0D0FF'
            }).setOrigin(0.5);

            tabBox.on('pointerdown', () => this.selectDatapadCreature(key));
            this.datapadContainer.add([tabBox, tabTxt]);
            this.creatureTabs[key] = { box: tabBox, text: tabTxt };
        });

        // Left Pane: Biome & Creature Animated Viewport (280x210)
        const viewX = cx - 160;
        const viewY = cy - 25;
        this.dpBiomeBg = this.add.graphics();
        this.dpCreatureSprite = this.add.graphics();
        this.dpScanLaser = this.add.rectangle(viewX, viewY - 90, 270, 3, 0x00E5FF, 0).setOrigin(0.5);

        // Happiness & Containment Bars
        this.dpHappinessText = this.add.text(viewX - 130, viewY + 115, 'HAPPINESS: 100%', {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00FFAA'
        });
        this.dpHappinessBarG = this.add.graphics();

        this.dpContainmentText = this.add.text(viewX - 130, viewY + 145, 'CONTAINMENT: 100%', {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00E5FF'
        });
        this.dpContainmentBarG = this.add.graphics();

        this.datapadContainer.add([
            this.dpBiomeBg,
            this.dpCreatureSprite,
            this.dpScanLaser,
            this.dpHappinessText,
            this.dpHappinessBarG,
            this.dpContainmentText,
            this.dpContainmentBarG
        ]);

        // Right Pane: Bio-Data Readout & 3 Handler Action Buttons
        const infoX = cx + 30;
        const infoY = cy - 130;

        this.dpTitleText = this.add.text(infoX, infoY, '', {
            fontSize: '10px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#FFD700'
        });
        this.dpHomeText = this.add.text(infoX, infoY + 22, '', {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#A0D0FF'
        });
        this.dpDietText = this.add.text(infoX, infoY + 38, '', {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#A0D0FF'
        });

        // Handler Checklist Tags
        this.dpTagScan = this.add.text(infoX, infoY + 60, '[ SCAN NEEDED ]', {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#FF5555'
        });
        this.dpTagFeed = this.add.text(infoX + 130, infoY + 60, '[ HUNGRY ]', {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#FF9900'
        });
        this.dpTagCalm = this.add.text(infoX, infoY + 76, '[ AGITATED ]', {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#FF5555'
        });

        // Lore Box & Action Log readout
        this.dpLoreBox = this.add.rectangle(infoX + 130, infoY + 125, 270, 56, 0x0E1F2E)
            .setStrokeStyle(1, 0x1F3A52);
        this.dpLoreText = this.add.text(infoX + 5, infoY + 104, '', {
            fontSize: '6px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#E0E8F0',
            wordWrap: { width: 255 },
            lineSpacing: 4
        });

        // 3 Action Buttons: [ SCAN BIO-DATA ], [ FEED TREAT ], [ CALM / PLAY ]
        this.btnScan = this.createActionButton(infoX + 40, cy + 105, '[ SCAN BIO-DATA ]', 0x00E5FF, () => this.handleActionScan());
        this.btnFeed = this.createActionButton(infoX + 135, cy + 105, '[ FEED TREAT ]', 0xF39C12, () => this.handleActionFeed());
        this.btnCalm = this.createActionButton(infoX + 225, cy + 105, '[ CALM / PLAY ]', 0x2ECC71, () => this.handleActionCalm());

        // Previous and Next Creature Navigation Buttons
        const prevBtn = this.add.rectangle(cx - 240, cy + 195, 76, 22, 0x001428)
            .setStrokeStyle(1.5, 0x00E5FF)
            .setInteractive({ useHandCursor: true });
        const prevTxt = this.add.text(cx - 240, cy + 195, '◄ PREV', {
            fontSize: '6px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00E5FF'
        }).setOrigin(0.5);
        prevBtn.on('pointerdown', () => this.navigateDatapadCreature(-1));

        const nextBtn = this.add.rectangle(cx + 240, cy + 195, 76, 22, 0x001428)
            .setStrokeStyle(1.5, 0x00E5FF)
            .setInteractive({ useHandCursor: true });
        const nextTxt = this.add.text(cx + 240, cy + 195, 'NEXT ►', {
            fontSize: '6px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00E5FF'
        }).setOrigin(0.5);
        nextBtn.on('pointerdown', () => this.navigateDatapadCreature(1));

        // Status Banner across bottom of datapad
        this.dpStatusBanner = this.add.text(cx, cy + 195, 'SELECT CREATURE // TEND ALL 4 TO EARN BADGE', {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00FFAA'
        }).setOrigin(0.5);

        this.datapadContainer.add([
            this.dpTitleText,
            this.dpHomeText,
            this.dpDietText,
            this.dpTagScan,
            this.dpTagFeed,
            this.dpTagCalm,
            this.dpLoreBox,
            this.dpLoreText,
            this.btnScan.box,
            this.btnScan.text,
            this.btnFeed.box,
            this.btnFeed.text,
            this.btnCalm.box,
            this.btnCalm.text,
            prevBtn,
            prevTxt,
            nextBtn,
            nextTxt,
            this.dpStatusBanner
        ]);
    }

    navigateDatapadCreature(dir) {
        const keys = ['porg', 'loth_cat', 'worrt', 'dianoga'];
        let idx = keys.indexOf(this.selectedCreatureKey);
        if (idx === -1) idx = 0;
        idx = (idx + dir + keys.length) % keys.length;
        this.selectDatapadCreature(keys[idx]);
    }

    createActionButton(x, y, label, color, onClick) {
        const box = this.add.rectangle(x, y, 84, 30, 0x001428)
            .setStrokeStyle(1.5, color)
            .setInteractive({ useHandCursor: true });
        const text = this.add.text(x, y, label, {
            fontSize: '6px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#' + color.toString(16).padStart(6, '0'),
            align: 'center'
        }).setOrigin(0.5);

        box.on('pointerdown', onClick);
        return { box, text };
    }

    openDatapad() {
        this.currentMode = 'datapad';
        this.datapadContainer.setVisible(true);
        this.selectDatapadCreature(this.selectedCreatureKey || 'porg');
        this.playCommsChirp();
    }

    openDatapadForCreature(key) {
        this.selectedCreatureKey = key;
        this.openDatapad();
    }

    closeDatapad() {
        this.currentMode = 'explore';
        this.datapadContainer.setVisible(false);
        this.updateCareStatusHUD();
    }

    selectDatapadCreature(key) {
        this.selectedCreatureKey = key;
        const creature = this.creatures[key];

        // Highlight active tab
        ['porg', 'loth_cat', 'worrt', 'dianoga'].forEach(k => {
            const isSel = (k === key);
            this.creatureTabs[k].box.setFillStyle(isSel ? 0x003355 : 0x152232);
            this.creatureTabs[k].box.setStrokeStyle(1.5, isSel ? 0x00E5FF : 0x34495E);
            this.creatureTabs[k].text.setColor(isSel ? '#FFD700' : '#A0D0FF');
        });

        // Update Text Info
        this.dpTitleText.setText(creature.name + ' - ' + creature.species.toUpperCase());
        this.dpHomeText.setText('HOMEWORLD: ' + creature.homeworld);
        this.dpDietText.setText('DIET: ' + creature.diet);

        // Checklist Status
        this.dpTagScan.setText(creature.scanned ? '[✔ BIO-SCANNED]' : '[ SCAN NEEDED ]')
            .setColor(creature.scanned ? '#00FFAA' : '#FF5555');
        this.dpTagFeed.setText(creature.fed ? '[✔ NOURISHED]' : '[ HUNGRY ]')
            .setColor(creature.fed ? '#00FFAA' : '#FF9900');
        this.dpTagCalm.setText(creature.calmed ? '[✔ CALM & PLAYFUL]' : '[ AGITATED ]')
            .setColor(creature.calmed ? '#00FFAA' : '#FF5555');

        this.dpLoreText.setText(creature.lore);

        // Redraw Biome & Creature in Viewport
        this.drawDatapadBiomeAndCreature(key);
        this.updateDatapadMeters(creature);
    }

    updateDatapadMeters(creature) {
        const W = this.scale.width;
        const H = this.scale.height;
        const cx = W / 2;
        const cy = H / 2;
        const viewX = cx - 160;
        const viewY = cy - 25;

        // Happiness Meter
        this.dpHappinessText.setText(`HAPPINESS: ${creature.happiness}%`);
        this.dpHappinessBarG.clear();
        this.dpHappinessBarG.fillStyle(0x111111, 1);
        this.dpHappinessBarG.fillRect(viewX - 130, viewY + 128, 260, 10);
        const happyCol = (creature.happiness >= 100) ? 0x00FFAA : (creature.happiness >= 50) ? 0xFFD700 : 0xFF5555;
        this.dpHappinessBarG.fillStyle(happyCol, 1);
        this.dpHappinessBarG.fillRect(viewX - 130, viewY + 128, Math.round(260 * (creature.happiness / 100)), 10);

        // Containment Meter
        this.dpContainmentText.setText(`CONTAINMENT STABILITY: ${creature.containment}%`);
        this.dpContainmentBarG.clear();
        this.dpContainmentBarG.fillStyle(0x111111, 1);
        this.dpContainmentBarG.fillRect(viewX - 130, viewY + 158, 260, 10);
        this.dpContainmentBarG.fillStyle(0x00E5FF, 1);
        this.dpContainmentBarG.fillRect(viewX - 130, viewY + 158, Math.round(260 * (creature.containment / 100)), 10);
    }

    drawDatapadBiomeAndCreature(key) {
        const W = this.scale.width;
        const H = this.scale.height;
        const cx = W / 2;
        const cy = H / 2;
        const viewX = cx - 160;
        const viewY = cy - 25;

        // 1. Biome Backdrop Frame (270x190)
        this.dpBiomeBg.clear();
        this.dpBiomeBg.fillStyle(0x000000, 1);
        this.dpBiomeBg.fillRect(viewX - 135, viewY - 95, 270, 190);

        if (key === 'porg') {
            // Ahch-To storm clouds & ocean cliffs
            this.dpBiomeBg.fillStyle(0x1B4F72, 1);
            this.dpBiomeBg.fillRect(viewX - 135, viewY - 95, 270, 120);
            this.dpBiomeBg.fillStyle(0x154360, 1);
            this.dpBiomeBg.fillRect(viewX - 135, viewY + 25, 270, 70); // dark ocean
            // Jagged sea crag
            this.dpBiomeBg.fillStyle(0x5D6D7E, 1);
            this.dpBiomeBg.fillTriangle(viewX - 80, viewY + 95, viewX + 80, viewY + 95, viewX, viewY - 10);
            this.dpBiomeBg.fillStyle(0x27AE60, 1);
            this.dpBiomeBg.fillRect(viewX - 30, viewY + 15, 60, 6);
        } else if (key === 'loth_cat') {
            // Lothal sunset grasslands
            this.dpBiomeBg.fillStyle(0xBA4A00, 1);
            this.dpBiomeBg.fillRect(viewX - 135, viewY - 95, 270, 100);
            this.dpBiomeBg.fillStyle(0xF39C12, 1);
            this.dpBiomeBg.fillCircle(viewX + 60, viewY - 40, 24); // sunset sun
            this.dpBiomeBg.fillStyle(0x229954, 1);
            this.dpBiomeBg.fillRect(viewX - 135, viewY + 20, 270, 75);
        } else if (key === 'worrt') {
            // Tatooine twin suns desert
            this.dpBiomeBg.fillStyle(0xEDBB99, 1);
            this.dpBiomeBg.fillRect(viewX - 135, viewY - 95, 270, 100);
            this.dpBiomeBg.fillStyle(0xF39C12, 1);
            this.dpBiomeBg.fillCircle(viewX - 40, viewY - 45, 18);
            this.dpBiomeBg.fillStyle(0xF1C40F, 1);
            this.dpBiomeBg.fillCircle(viewX + 20, viewY - 30, 12);
            this.dpBiomeBg.fillStyle(0xD4AC0D, 1);
            this.dpBiomeBg.fillRect(viewX - 135, viewY + 20, 270, 75);
        } else if (key === 'dianoga') {
            // Murky sewage & sludge container
            this.dpBiomeBg.fillStyle(0x0B3B24, 1);
            this.dpBiomeBg.fillRect(viewX - 135, viewY - 95, 270, 190);
            this.dpBiomeBg.fillStyle(0x145A32, 1);
            this.dpBiomeBg.fillRect(viewX - 135, viewY - 20, 270, 115);
            this.dpBiomeBg.fillStyle(0x2ECC71, 0.4);
            this.dpBiomeBg.fillCircle(viewX - 50, viewY + 20, 16);
            this.dpBiomeBg.fillCircle(viewX + 40, viewY + 50, 22);
        }

        // Biome border
        this.dpBiomeBg.lineStyle(2, 0x00E5FF, 0.8);
        this.dpBiomeBg.strokeRect(viewX - 135, viewY - 95, 270, 190);

        // 2. Large Animated 8-bit Creature Sprite in Center
        this.drawLargeCreatureSprite(key, viewX, viewY);
    }

    drawLargeCreatureSprite(key, cx, cy) {
        this.dpCreatureSprite.clear();

        if (key === 'porg') {
            // Large Porg (round cute body, big glassy eyes)
            this.dpCreatureSprite.fillStyle(0x4A2E18, 1);
            this.dpCreatureSprite.fillCircle(cx, cy - 10, 34); // head and back
            this.dpCreatureSprite.fillStyle(0xFFFFFF, 1);
            this.dpCreatureSprite.fillEllipse(cx, cy - 4, 26, 28); // white belly
            // Wings
            this.dpCreatureSprite.fillStyle(0x3E2714, 1);
            this.dpCreatureSprite.fillEllipse(cx - 28, cy - 8, 10, 20);
            this.dpCreatureSprite.fillEllipse(cx + 28, cy - 8, 10, 20);
            // Big Black Eyes
            this.dpCreatureSprite.fillStyle(0x000000, 1);
            this.dpCreatureSprite.fillCircle(cx - 12, cy - 18, 8);
            this.dpCreatureSprite.fillCircle(cx + 12, cy - 18, 8);
            this.dpCreatureSprite.fillStyle(0xFFFFFF, 1);
            this.dpCreatureSprite.fillCircle(cx - 10, cy - 20, 3);
            this.dpCreatureSprite.fillCircle(cx + 14, cy - 20, 3);
            // Down-turned cute mouth & orange feet
            this.dpCreatureSprite.fillStyle(0xE67E22, 1);
            this.dpCreatureSprite.fillTriangle(cx - 5, cy - 10, cx + 5, cy - 10, cx, cy - 6);
            this.dpCreatureSprite.fillRect(cx - 14, cy + 22, 10, 4);
            this.dpCreatureSprite.fillRect(cx + 4, cy + 22, 10, 4);
        } else if (key === 'loth_cat') {
            // Large Loth-Cat (pointed tufted ears, wide grin, feline markings)
            this.dpCreatureSprite.fillStyle(0xE67E22, 1);
            this.dpCreatureSprite.fillEllipse(cx, cy + 5, 48, 28); // body
            this.dpCreatureSprite.fillCircle(cx, cy - 18, 26); // head
            // Big ears
            this.dpCreatureSprite.fillTriangle(cx - 24, cy - 24, cx - 12, cy - 48, cx - 4, cy - 26);
            this.dpCreatureSprite.fillTriangle(cx + 24, cy - 24, cx + 12, cy - 48, cx + 4, cy - 26);
            // Ear tufts & stripes
            this.dpCreatureSprite.fillStyle(0xBA4A00, 1);
            this.dpCreatureSprite.fillRect(cx - 18, cy - 36, 4, 8);
            this.dpCreatureSprite.fillRect(cx + 14, cy - 36, 4, 8);
            this.dpCreatureSprite.fillRect(cx - 12, cy - 2, 4, 16);
            this.dpCreatureSprite.fillRect(cx + 4, cy - 2, 4, 16);
            // Wide smiling face & yellow eyes
            this.dpCreatureSprite.fillStyle(0xF1C40F, 1);
            this.dpCreatureSprite.fillEllipse(cx - 10, cy - 20, 6, 4);
            this.dpCreatureSprite.fillEllipse(cx + 10, cy - 20, 6, 4);
            this.dpCreatureSprite.fillStyle(0x000000, 1);
            this.dpCreatureSprite.fillRect(cx - 10, cy - 22, 2, 4);
            this.dpCreatureSprite.fillRect(cx + 10, cy - 22, 2, 4);
            // Cat grin
            this.dpCreatureSprite.lineStyle(2, 0x000000, 1);
            this.dpCreatureSprite.strokeCircle(cx - 6, cy - 12, 5);
            this.dpCreatureSprite.strokeCircle(cx + 6, cy - 12, 5);
        } else if (key === 'worrt') {
            // Large Worrt (bumpy golden-brown toad with giant throat sac)
            this.dpCreatureSprite.fillStyle(0x7D6608, 1);
            this.dpCreatureSprite.fillEllipse(cx, cy + 4, 60, 36);
            this.dpCreatureSprite.fillStyle(0xB7950B, 1);
            this.dpCreatureSprite.fillCircle(cx, cy - 12, 28);
            // Big throat pouch
            this.dpCreatureSprite.fillStyle(0xD4AC0D, 1);
            this.dpCreatureSprite.fillEllipse(cx, cy, 32, 20);
            // Bulging eyes
            this.dpCreatureSprite.fillStyle(0x7D6608, 1);
            this.dpCreatureSprite.fillCircle(cx - 18, cy - 26, 10);
            this.dpCreatureSprite.fillCircle(cx + 18, cy - 26, 10);
            this.dpCreatureSprite.fillStyle(0xE67E22, 1);
            this.dpCreatureSprite.fillCircle(cx - 18, cy - 26, 7);
            this.dpCreatureSprite.fillCircle(cx + 18, cy - 26, 7);
            this.dpCreatureSprite.fillStyle(0x000000, 1);
            this.dpCreatureSprite.fillRect(cx - 24, cy - 27, 12, 3);
            this.dpCreatureSprite.fillRect(cx + 12, cy - 27, 12, 3);
            // Warty skin dots
            this.dpCreatureSprite.fillStyle(0x512E5F, 0.6);
            this.dpCreatureSprite.fillCircle(cx - 14, cy - 6, 3);
            this.dpCreatureSprite.fillCircle(cx + 12, cy - 8, 4);
            this.dpCreatureSprite.fillCircle(cx + 22, cy + 10, 3);
        } else if (key === 'dianoga') {
            // Large Dianoga (water surface, eyestalk, coiling tentacle)
            this.dpCreatureSprite.fillStyle(0x196F3D, 1);
            // Long eyestalk
            this.dpCreatureSprite.fillRect(cx - 6, cy - 40, 12, 50);
            // Eyeball
            this.dpCreatureSprite.fillStyle(0xF1C40F, 1);
            this.dpCreatureSprite.fillCircle(cx, cy - 42, 14);
            this.dpCreatureSprite.fillStyle(0x000000, 1);
            this.dpCreatureSprite.fillRect(cx - 3, cy - 48, 6, 12); // vertical slit
            this.dpCreatureSprite.fillStyle(0xFFFFFF, 1);
            this.dpCreatureSprite.fillCircle(cx + 4, cy - 44, 3);

            // Coiling Tentacle tips emerging from water
            this.dpCreatureSprite.fillStyle(0x1E8449, 1);
            this.dpCreatureSprite.fillCircle(cx - 40, cy + 5, 12);
            this.dpCreatureSprite.fillCircle(cx - 48, cy - 10, 9);
            this.dpCreatureSprite.fillCircle(cx - 42, cy - 22, 6);

            this.dpCreatureSprite.fillCircle(cx + 45, cy + 12, 14);
            this.dpCreatureSprite.fillCircle(cx + 52, cy - 6, 10);
            this.dpCreatureSprite.fillCircle(cx + 44, cy - 18, 7);
            // Suction cups
            this.dpCreatureSprite.fillStyle(0xA9DFBF, 1);
            this.dpCreatureSprite.fillCircle(cx - 42, cy + 4, 3);
            this.dpCreatureSprite.fillCircle(cx - 46, cy - 8, 2);
            this.dpCreatureSprite.fillCircle(cx + 46, cy + 10, 3);
        }
    }

    handleActionScan() {
        const creature = this.creatures[this.selectedCreatureKey];
        if (creature.scanned) {
            this.dpLoreText.setText('SCAN CONFIRMED: Bio-telemetry already synced with Resistance central database!');
            return;
        }

        creature.scanned = true;
        creature.happiness = Math.min(100, creature.happiness + 25);
        this.playScannerSound();

        // Laser scan sweep animation
        this.dpScanLaser.setAlpha(1);
        this.tweens.add({
            targets: this.dpScanLaser,
            y: this.dpScanLaser.y + 180,
            duration: 800,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                this.dpScanLaser.setAlpha(0);
                this.dpScanLaser.y = (this.scale.height / 2) - 25 - 90;
            }
        });

        this.dpLoreText.setText(creature.actionLogs.scan);
        this.selectDatapadCreature(this.selectedCreatureKey);
        this.checkCreatureFullyTended(creature);
    }

    handleActionFeed() {
        const creature = this.creatures[this.selectedCreatureKey];
        if (creature.fed) {
            this.dpLoreText.setText('CREATURE IS FULL: Specimen has consumed its recommended dietary allotment!');
            return;
        }

        creature.fed = true;
        creature.happiness = Math.min(100, creature.happiness + 35);

        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
            retroArcadeAudio.play('powerup');
        }

        // Animated treat falling into viewport
        const W = this.scale.width;
        const H = this.scale.height;
        const treat = this.add.circle((W / 2) - 160, (H / 2) - 110, 6, 0xF39C12, 1).setDepth(3100);
        this.tweens.add({
            targets: treat,
            y: (H / 2) - 30,
            scale: 1.5,
            duration: 500,
            onComplete: () => {
                treat.destroy();
                this.showFloatingHearts((W / 2) - 160, (H / 2) - 40);
            }
        });

        this.dpLoreText.setText(creature.actionLogs.feed);
        this.selectDatapadCreature(this.selectedCreatureKey);
        this.checkCreatureFullyTended(creature);
    }

    handleActionCalm() {
        const creature = this.creatures[this.selectedCreatureKey];
        if (creature.calmed) {
            this.dpLoreText.setText('CALM VERIFIED: Specimen is already tranquil, playful, and responsive to handlers!');
            return;
        }

        creature.calmed = true;
        creature.happiness = 100;

        if (this.selectedCreatureKey === 'porg') this.playPorgChirp();
        else if (this.selectedCreatureKey === 'loth_cat') this.playLothCatPurr();
        else if (this.selectedCreatureKey === 'worrt') this.playWorrtSnap();
        else this.playCommsChirp();

        const W = this.scale.width;
        const H = this.scale.height;
        this.showFloatingHearts((W / 2) - 160, (H / 2) - 40);

        this.dpLoreText.setText(creature.actionLogs.calm);
        this.selectDatapadCreature(this.selectedCreatureKey);
        this.checkCreatureFullyTended(creature);
    }

    showFloatingHearts(x, y) {
        for (let i = 0; i < 4; i++) {
            const heart = this.add.text(x + Phaser.Math.Between(-30, 30), y, '♥', {
                fontSize: '12px',
                fill: '#FF3366'
            }).setDepth(3200);
            this.tweens.add({
                targets: heart,
                y: y - 50,
                alpha: 0,
                duration: 1200,
                onComplete: () => heart.destroy()
            });
        }
    }

    checkCreatureFullyTended(creature) {
        if (creature.scanned && creature.fed && creature.calmed) {
            creature.happiness = 100;
            this.updateCareStatusHUD();

            let allDone = true;
            ['porg', 'loth_cat', 'worrt', 'dianoga'].forEach(k => {
                if (!this.creatures[k].scanned || !this.creatures[k].fed || !this.creatures[k].calmed) {
                    allDone = false;
                }
            });

            if (allDone) {
                // Save progress
                if (typeof getOceaneerProgress === 'function' && typeof saveOceaneerProgress === 'function') {
                    const prog = getOceaneerProgress();
                    saveOceaneerProgress({
                        cargoBayCreaturesTended: 4,
                        starWarsBadge: true
                    });
                }
                this.savedProgress.starWarsBadge = true;
                this.dpStatusBanner.setText('★ ALL CREATURES 100% SECURE & HAPPY! BADGE UNLOCKED! ★').setColor('#FFD700');
                if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
                    retroArcadeAudio.play('powerup');
                }
                this.showSpeechBubble(this.reySprite, 'REY: INCREDIBLE WORK! You took amazing care of all four species!');
            }
        }
    }

    // =========================================================================
    // ACTIVITY 2: STARSHIP CARGO BAY POWER & CONTAINMENT DIAGNOSTIC (MINI-GAME)
    // =========================================================================
    createPowerDiagnosticOverlay(W, H) {
        this.diagContainer = this.add.container(0, 0).setScrollFactor(0).setDepth(3000).setVisible(false);

        // Terminal Backdrop
        const backdrop = this.add.rectangle(0, 0, 4000, 4000, 0x000000, 0.88).setOrigin(0.5);
        this.diagContainer.add(backdrop);

        const frameW = 680;
        const frameH = 450;
        const cx = W / 2;
        const cy = H / 2;

        const bezel = this.add.rectangle(cx, cy, frameW, frameH, 0x141E28)
            .setStrokeStyle(3, 0xF39C12);
        const innerScreen = this.add.rectangle(cx, cy, frameW - 16, frameH - 16, 0x07111A);

        const title = this.add.text(cx, cy - 200, '// RESISTANCE TERMINAL // POWER & CONTAINMENT GRID', {
            fontSize: '9px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#FFD700'
        }).setOrigin(0.5);

        const closeBtn = this.add.text(cx + 250, cy - 200, '[ ✕ ABORT ]', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#FF5555',
            backgroundColor: '#000000',
            padding: { x: 5, y: 3 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => this.closePowerDiagnostic());

        // HUD Stats Bar
        this.diagTimerText = this.add.text(cx - 280, cy - 165, 'TIME: 30s', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00FFAA'
        });
        this.diagScoreText = this.add.text(cx - 130, cy - 165, 'SCORE: 0000', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#FFFF00'
        });
        this.diagStabilityText = this.add.text(cx + 40, cy - 165, 'GRID: 100%', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00E5FF'
        });
        this.diagComboText = this.add.text(cx + 190, cy - 165, 'COMBO: x1', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#FF9900'
        });

        this.diagContainer.add([bezel, innerScreen, title, closeBtn, this.diagTimerText, this.diagScoreText, this.diagStabilityText, this.diagComboText]);

        // 4 Habitat Containment Power Grid Channels
        this.diagChannelUIs = [];
        const startY = cy - 120;
        const rowH = 68;

        this.diagChannels.forEach((chan, idx) => {
            const ry = startY + (idx * rowH);

            const rowBox = this.add.rectangle(cx, ry + 16, frameW - 40, 56, 0x0E1A24)
                .setStrokeStyle(1.5, 0x223647);

            const chanName = this.add.text(cx - 290, ry - 4, `${idx + 1}. ${chan.name}`, {
                fontSize: '8px',
                fontFamily: '"Press Start 2P", monospace',
                fill: '#E0E8F0'
            });

            const statusText = this.add.text(cx - 290, ry + 14, 'STATUS: BALANCED', {
                fontSize: '7px',
                fontFamily: '"Press Start 2P", monospace',
                fill: '#00FFAA'
            });

            // Power Gauge Graphic
            const gaugeG = this.add.graphics();

            // Stabilize Interactive Button
            const stabBtn = this.add.rectangle(cx + 225, ry + 16, 110, 32, 0x003355)
                .setStrokeStyle(2, 0x00E5FF)
                .setInteractive({ useHandCursor: true });
            const stabTxt = this.add.text(cx + 225, ry + 16, `[ STABILIZE ${idx + 1} ]`, {
                fontSize: '7px',
                fontFamily: '"Press Start 2P", monospace',
                fill: '#00E5FF'
            }).setOrigin(0.5);

            stabBtn.on('pointerdown', () => this.stabilizeChannel(idx));

            this.diagContainer.add([rowBox, chanName, statusText, gaugeG, stabBtn, stabTxt]);
            this.diagChannelUIs.push({ rowBox, statusText, gaugeG, stabBtn, stabTxt });
        });

        // Rey & Chewie Comms Chatter Box
        const commsY = cy + 175;
        this.diagCommsBox = this.add.rectangle(cx, commsY, frameW - 40, 36, 0x000E1A)
            .setStrokeStyle(1, 0x00E5FF);
        this.diagCommsText = this.add.text(cx, commsY, 'CHEWIE: RRRAARRWHHGWWR! [Keep all 4 containment bars in the green!]', {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#A0D0FF'
        }).setOrigin(0.5);

        this.diagContainer.add([this.diagCommsBox, this.diagCommsText]);

        // Results Summary Modal (nested)
        this.createDiagnosticResultsModal(cx, cy, frameW, frameH);
    }

    createDiagnosticResultsModal(cx, cy, frameW, frameH) {
        this.diagResultsContainer = this.add.container(0, 0).setVisible(false);

        const resBox = this.add.rectangle(cx, cy, frameW - 60, frameH - 60, 0x09141F)
            .setStrokeStyle(3, 0xFFD700);
        this.resTitleText = this.add.text(cx, cy - 120, '★ DIAGNOSTIC COMPLETE! ★', {
            fontSize: '11px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#FFD700'
        }).setOrigin(0.5);

        this.resScoreText = this.add.text(cx, cy - 70, '', {
            fontSize: '9px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#FFFFFF'
        }).setOrigin(0.5);

        this.resRankText = this.add.text(cx, cy - 35, '', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00FFAA'
        }).setOrigin(0.5);

        this.resBadgeText = this.add.text(cx, cy + 5, '', {
            fontSize: '7px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#FFD700'
        }).setOrigin(0.5);

        // Buttons
        const replayBtn = this.add.rectangle(cx - 110, cy + 70, 160, 36, 0x003366)
            .setStrokeStyle(2, 0x00FFAA)
            .setInteractive({ useHandCursor: true });
        const replayTxt = this.add.text(cx - 110, cy + 70, '[ RETRY TEST ]', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#00FFAA'
        }).setOrigin(0.5);
        replayBtn.on('pointerdown', () => this.startDiagnosticSimulation());

        const exitResBtn = this.add.rectangle(cx + 110, cy + 70, 160, 36, 0x331100)
            .setStrokeStyle(2, 0xFFD700)
            .setInteractive({ useHandCursor: true });
        const exitResTxt = this.add.text(cx + 110, cy + 70, '[ CARGO BAY ]', {
            fontSize: '8px',
            fontFamily: '"Press Start 2P", monospace',
            fill: '#FFD700'
        }).setOrigin(0.5);
        exitResBtn.on('pointerdown', () => this.closePowerDiagnostic());

        this.diagResultsContainer.add([resBox, this.resTitleText, this.resScoreText, this.resRankText, this.resBadgeText, replayBtn, replayTxt, exitResBtn, exitResTxt]);
        this.diagContainer.add(this.diagResultsContainer);
    }

    openPowerDiagnostic() {
        this.currentMode = 'power_diagnostic';
        this.diagContainer.setVisible(true);
        this.diagResultsContainer.setVisible(false);
        this.startDiagnosticSimulation();
        this.playCommsChirp();
    }

    closePowerDiagnostic() {
        this.diagActive = false;
        this.currentMode = 'explore';
        this.diagContainer.setVisible(false);
        this.updateCareStatusHUD();
    }

    startDiagnosticSimulation() {
        this.diagActive = true;
        this.diagTimer = 30;
        this.diagScore = 0;
        this.diagCombo = 1;
        this.diagGridStability = 100;
        this.diagResultsContainer.setVisible(false);

        this.diagChannels.forEach((c, idx) => {
            c.val = 45 + idx * 5;
            c.dir = (idx % 2 === 0) ? 1 : -1;
            c.speed = 1.0 + Math.random() * 0.8;
            c.alert = false;
        });

        this.diagCommsText.setText('REY: Diagnostic sequence initiated! Balance power spikes with keys 1-4 or click!');

        // Timer Loop Event
        if (this.diagTimerEvent) this.diagTimerEvent.remove();
        this.diagTimerEvent = this.time.addEvent({
            delay: 1000,
            repeat: 29,
            callback: () => {
                if (!this.diagActive) return;
                this.diagTimer--;
                this.diagTimerText.setText(`TIME: ${this.diagTimer}s`);

                // Passive points for maintaining grid stability
                if (this.diagGridStability > 80) {
                    this.diagScore += 50 * this.diagCombo;
                }

                // Random Power Surge Alert Event
                if (this.diagTimer === 22 || this.diagTimer === 14 || this.diagTimer === 6) {
                    this.triggerSurgeAlert();
                }

                if (this.diagTimer <= 0) {
                    this.finishDiagnosticSimulation();
                }
            }
        });
    }

    triggerSurgeAlert() {
        const randIdx = Phaser.Math.Between(0, 3);
        const chan = this.diagChannels[randIdx];
        chan.alert = true;
        chan.val = (chan.val > 50) ? 92 : 12;
        this.playAlarmBeep();
        this.diagCommsText.setText(`WARNING! ${chan.name} OVERLOAD! TAP STABILIZE RAPIDLY!`);
    }

    stabilizeChannel(idx) {
        if (!this.diagActive) return;
        const chan = this.diagChannels[idx];
        const ui = this.diagChannelUIs[idx];

        const oldVal = chan.val;
        // Balance toward target 50
        chan.val = Math.round(chan.val + (chan.val > 50 ? -20 : 20));
        chan.dir *= -1;

        if (chan.alert) {
            // Defused surge!
            chan.alert = false;
            this.diagScore += 400 * this.diagCombo;
            this.diagCombo = Math.min(4, this.diagCombo + 1);
            this.diagCommsText.setText(`REY: Excellent response! ${chan.name} surge suppressed!`);
            this.playPowerupChime();
        } else if (Math.abs(oldVal - 50) < 18) {
            // Perfect balance!
            this.diagScore += 150 * this.diagCombo;
            this.diagCombo = Math.min(4, this.diagCombo + 1);
            this.playStabilizeBeep();
        } else {
            this.diagScore += 75;
            this.playStabilizeBeep();
        }

        this.diagScoreText.setText(`SCORE: ${this.diagScore}`);
        this.diagComboText.setText(`COMBO: x${this.diagCombo}`);

        // Button feedback punch
        this.tweens.add({
            targets: ui.stabBtn,
            scaleX: 1.08,
            scaleY: 1.08,
            duration: 80,
            yoyo: true
        });
    }

    finishDiagnosticSimulation() {
        this.diagActive = false;
        if (this.diagTimerEvent) this.diagTimerEvent.remove();

        this.score = this.diagScore;
        const prog = (typeof getOceaneerProgress === 'function')
            ? getOceaneerProgress()
            : { cargoBayCreaturesTended: 0, cargoBayPowerScore: 0, starWarsBadge: false };

        const newHighScore = Math.max(prog.cargoBayPowerScore || 0, this.score);

        // Required Progress Save Contract
        if (typeof saveOceaneerProgress === 'function') {
            saveOceaneerProgress({
                cargoBayCreaturesTended: 4,
                cargoBayPowerScore: Math.max(prog.cargoBayPowerScore || 0, this.score),
                starWarsBadge: true
            });
        }
        this.savedProgress.starWarsBadge = true;

        // Rank Evaluation
        let rankStr = 'RANK: CARGO BAY APPRENTICE (BRONZE)';
        if (this.diagScore >= 3500) {
            rankStr = 'RANK: RESISTANCE CHIEF ENGINEER (GOLD)';
        } else if (this.diagScore >= 2000) {
            rankStr = 'RANK: SENIOR CREATURE TECHNICIAN (SILVER)';
        }

        this.resScoreText.setText(`FINAL SCORE: ${this.diagScore} // BEST: ${newHighScore}`);
        this.resRankText.setText(rankStr);
        this.resBadgeText.setText('★ RESISTANCE STAR WARS BADGE UNLOCKED! ★');

        this.diagResultsContainer.setVisible(true);
        if (typeof retroArcadeAudio !== 'undefined' && retroArcadeAudio.play) {
            retroArcadeAudio.play('powerup');
        }
        this.playChewieRoar();
    }

    // =========================================================================
    // AUDIO SYNTHESIS & SOUND EFFECTS (NES / RETRO WEB AUDIO)
    // =========================================================================
    playCommsChirp() {
        if (!retroArcadeAudio || !retroArcadeAudio.ctx) {
            if (retroArcadeAudio && retroArcadeAudio.play) retroArcadeAudio.play('laser');
            return;
        }
        try {
            const ctx = retroArcadeAudio.ctx;
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.linearRampToValueAtTime(1760, now + 0.08);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.1);
        } catch (e) {}
    }

    playPorgChirp() {
        if (!retroArcadeAudio || !retroArcadeAudio.ctx) return;
        try {
            const ctx = retroArcadeAudio.ctx;
            const now = ctx.currentTime;
            [0, 0.06, 0.12].forEach((d, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(1350 + i * 150, now + d);
                osc.frequency.linearRampToValueAtTime(1850 + i * 150, now + d + 0.05);
                gain.gain.setValueAtTime(0.12, now + d);
                gain.gain.exponentialRampToValueAtTime(0.01, now + d + 0.05);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + d);
                osc.stop(now + d + 0.05);
            });
        } catch (e) {}
    }

    playLothCatPurr() {
        if (!retroArcadeAudio || !retroArcadeAudio.ctx) return;
        try {
            const ctx = retroArcadeAudio.ctx;
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(45, now);
            osc.frequency.linearRampToValueAtTime(75, now + 0.2);
            osc.frequency.linearRampToValueAtTime(45, now + 0.4);
            gain.gain.setValueAtTime(0.14, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.45);
        } catch (e) {}
    }

    playWorrtSnap() {
        if (!retroArcadeAudio || !retroArcadeAudio.ctx) return;
        try {
            const ctx = retroArcadeAudio.ctx;
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(40, now + 0.06);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.06);
        } catch (e) {}
    }

    playChewieRoar() {
        if (!retroArcadeAudio || !retroArcadeAudio.ctx) {
            if (retroArcadeAudio && retroArcadeAudio.play) retroArcadeAudio.play('damage');
            return;
        }
        try {
            const ctx = retroArcadeAudio.ctx;
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(95, now);
            osc.frequency.linearRampToValueAtTime(145, now + 0.18);
            osc.frequency.linearRampToValueAtTime(75, now + 0.38);
            osc.frequency.linearRampToValueAtTime(115, now + 0.55);
            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.6);
        } catch (e) {}
    }

    playScannerSound() {
        if (!retroArcadeAudio || !retroArcadeAudio.ctx) return;
        try {
            const ctx = retroArcadeAudio.ctx;
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(500, now);
            osc.frequency.linearRampToValueAtTime(1500, now + 0.35);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.38);
        } catch (e) {}
    }

    playStabilizeBeep() {
        if (!retroArcadeAudio || !retroArcadeAudio.ctx) return;
        try {
            const ctx = retroArcadeAudio.ctx;
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(620, now);
            osc.frequency.setValueAtTime(840, now + 0.05);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.1);
        } catch (e) {}
    }

    playAlarmBeep() {
        if (!retroArcadeAudio || !retroArcadeAudio.ctx) return;
        try {
            const ctx = retroArcadeAudio.ctx;
            const now = ctx.currentTime;
            [0, 0.12].forEach(d => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'square';
                osc.frequency.setValueAtTime(880, now + d);
                gain.gain.setValueAtTime(0.15, now + d);
                gain.gain.exponentialRampToValueAtTime(0.01, now + d + 0.08);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + d);
                osc.stop(now + d + 0.08);
            });
        } catch (e) {}
    }

    playPowerupChime() {
        if (retroArcadeAudio && retroArcadeAudio.play) {
            retroArcadeAudio.play('powerup');
        }
    }

    // =========================================================================
    // UPDATE CYCLE & PLAYER INTERACTION DISPATCH
    // =========================================================================
    update(time, delta) {
        const dt = delta / 1000;

        // Hide NPC speech bubble when expired
        if (this.currentSpeaker && time >= this.speechEndTime) {
            this.speechBox.setVisible(false);
            this.speechText.setVisible(false);
            this.currentSpeaker = null;
        }

        // If modal/overlay is open, freeze world movement and update mini-game
        if (this.currentMode !== 'explore') {
            if (this.player && this.player.body) {
                this.player.body.setVelocity(0, 0);
            }
            if (this.currentMode === 'power_diagnostic' && this.diagActive) {
                this.updateDiagnosticSimulation(dt);
            }
            return;
        }

        // --- Explore Mode Player Movement ---
        let vx = 0;
        let vy = 0;

        const left = (this.cursors && this.cursors.left && this.cursors.left.isDown) ||
                     (this.keysWASD && this.keysWASD.left && this.keysWASD.left.isDown) ||
                     this.mobileInput.left;
        const right = (this.cursors && this.cursors.right && this.cursors.right.isDown) ||
                      (this.keysWASD && this.keysWASD.right && this.keysWASD.right.isDown) ||
                      this.mobileInput.right;
        const up = (this.cursors && this.cursors.up && this.cursors.up.isDown) ||
                   (this.keysWASD && this.keysWASD.up && this.keysWASD.up.isDown) ||
                   this.mobileInput.up;
        const down = (this.cursors && this.cursors.down && this.cursors.down.isDown) ||
                     (this.keysWASD && this.keysWASD.down && this.keysWASD.down.isDown) ||
                     this.mobileInput.down;
        const jumpPressed = Phaser.Input.Keyboard.JustDown(this.keysWASD.space) ||
                            Phaser.Input.Keyboard.JustDown(this.cursors.space) ||
                            this.mobileInput.jump;

        if (jumpPressed) {
            this.tryJump();
        }

        if (left) {
            vx = -this.playerSpeed;
            this.player.setFlipX(true);
        } else if (right) {
            vx = this.playerSpeed;
            this.player.setFlipX(false);
        }

        // 2.5D Vertical depth shifting within deck area
        const minY = this.floorY + 20;
        const maxY = this.floorY + this.floorH - 20;

        if (up && this.groundY > minY) {
            vy = -this.playerSpeed * 0.55;
        } else if (down && this.groundY < maxY) {
            vy = this.playerSpeed * 0.55;
        }

        this.groundY += vy * dt;
        this.groundY = Phaser.Math.Clamp(this.groundY, minY, maxY);

        // Jump physics (Z-axis offset)
        if (this.isJumping) {
            this.jumpZ += this.jumpV * dt;
            this.jumpV -= 900 * dt; // gravity
            if (this.jumpZ <= 0) {
                this.jumpZ = 0;
                this.jumpV = 0;
                this.isJumping = false;
            }
        }

        // Apply movement velocity and visual depth
        this.player.body.setVelocityX(vx);
        this.player.y = this.groundY - this.jumpZ;
        this.player.setDepth(Math.round(this.groundY));

        // Update Foot Shadow
        if (this.playerShadow) {
            this.playerShadow.x = this.player.x;
            this.playerShadow.y = this.groundY + 16;
            this.playerShadow.setDepth(Math.round(this.groundY) - 1);
            const shadowScale = 1 - (this.jumpZ / 120);
            this.playerShadow.setScale(Math.max(0.4, shadowScale));
        }

        // Walking / Idle animations
        if (vx !== 0 || vy !== 0) {
            if (this.player.anims && this.anims.exists(this.charData.walkAnim)) {
                this.player.anims.play(this.charData.walkAnim, true);
            }
        } else {
            if (this.player.anims && this.anims.exists(this.charData.idleAnim)) {
                this.player.anims.play(this.charData.idleAnim, true);
            }
        }

        // Check Proximity to Stations & Update Prompts
        this.checkStationProximity();

        // Keyboard Action Trigger (Space or Enter)
        const actPressed = Phaser.Input.Keyboard.JustDown(this.keysWASD.space) ||
                           Phaser.Input.Keyboard.JustDown(this.keysWASD.enter);
        if (actPressed && !this.isJumping) {
            this.handleStationAction();
        }
    }

    checkStationProximity() {
        const px = this.player.x;
        const dist = (x) => Math.abs(px - x);

        let nearest = null;
        let promptText = '';

        if (dist(110) < 55) {
            nearest = 'exit';
            promptText = '[ SPACE / TAP: RETURN TO HUB ]';
        } else if (dist(340) < 55) {
            nearest = 'rey';
            promptText = '[ SPACE / TAP: TALK TO REY ]';
        } else if (dist(610) < 65) {
            nearest = 'porg';
            promptText = '[ SPACE / TAP: TEND PORG (AR DATAPAD) ]';
        } else if (dist(920) < 65) {
            nearest = 'loth_cat';
            promptText = '[ SPACE / TAP: TEND LOTH-CAT (AR DATAPAD) ]';
        } else if (dist(1220) < 65) {
            nearest = 'terminal';
            promptText = '[ SPACE / TAP: POWER DIAGNOSTIC TERMINAL ]';
        } else if (dist(1520) < 65) {
            nearest = 'worrt';
            promptText = '[ SPACE / TAP: TEND WORRT (AR DATAPAD) ]';
        } else if (dist(1770) < 65) {
            nearest = 'dianoga';
            promptText = '[ SPACE / TAP: TEND DIANOGA (AR DATAPAD) ]';
        } else if (dist(1920) < 60) {
            nearest = 'chewie';
            promptText = '[ SPACE / TAP: TALK TO CHEWIE ]';
        }

        this.nearStation = nearest;

        if (nearest && promptText) {
            this.stationPrompt.setText(promptText);
            this.stationPrompt.setPosition(this.player.x, this.player.y - 55);
            this.stationPrompt.setVisible(true);
        } else {
            this.stationPrompt.setVisible(false);
        }
    }

    handleStationAction() {
        if (!this.nearStation) return;

        switch (this.nearStation) {
            case 'exit':
                this.returnToHub();
                break;
            case 'rey':
                this.talkToRey();
                break;
            case 'chewie':
                this.talkToChewie();
                break;
            case 'terminal':
                this.openPowerDiagnostic();
                break;
            case 'porg':
            case 'loth_cat':
            case 'worrt':
            case 'dianoga':
                this.openDatapadForCreature(this.nearStation);
                break;
        }
    }

    // =========================================================================
    // POWER DIAGNOSTIC MINI-GAME TICK LOOP
    // =========================================================================
    updateDiagnosticSimulation(dt) {
        const W = this.scale.width;
        const cx = W / 2;

        let totalDrift = 0;

        this.diagChannels.forEach((chan, idx) => {
            const ui = this.diagChannelUIs[idx];

            // Natural power fluctuation
            chan.val += chan.dir * chan.speed * dt * 12;

            if (chan.val >= 94) {
                chan.val = 94;
                chan.dir = -1;
            } else if (chan.val <= 6) {
                chan.val = 6;
                chan.dir = 1;
            }

            const drift = Math.abs(chan.val - 50);
            totalDrift += drift;

            // Danger status and styling
            const isDanger = (chan.val > 80 || chan.val < 20 || chan.alert);
            ui.rowBox.setStrokeStyle(1.5, isDanger ? 0xFF3366 : 0x223647);

            if (chan.alert) {
                ui.statusText.setText('STATUS: ! CRITICAL SURGE !').setColor('#FF3366');
            } else if (isDanger) {
                ui.statusText.setText('STATUS: UNSTABLE FLUX').setColor('#FF9900');
            } else {
                ui.statusText.setText('STATUS: BALANCED (SAFE)').setColor('#00FFAA');
            }

            // Draw Gauge (Width 280)
            const gaugeX = cx - 110;
            const gaugeY = (this.scale.height / 2) - 120 + (idx * 68) + 16;
            ui.gaugeG.clear();

            // Background track
            ui.gaugeG.fillStyle(0x07111A, 1);
            ui.gaugeG.fillRect(gaugeX, gaugeY - 6, 200, 14);

            // Safe Green Target Zone in Middle (40% to 60%)
            ui.gaugeG.fillStyle(0x00FF88, 0.25);
            ui.gaugeG.fillRect(gaugeX + 70, gaugeY - 6, 60, 14);

            // Active Power Bar
            const barW = Math.round(200 * (chan.val / 100));
            const barCol = isDanger ? 0xFF3366 : (drift < 18) ? 0x00FFAA : 0xF39C12;
            ui.gaugeG.fillStyle(barCol, 1);
            ui.gaugeG.fillRect(gaugeX, gaugeY - 4, barW, 10);
            ui.gaugeG.lineStyle(1, 0x00E5FF, 0.7);
            ui.gaugeG.strokeRect(gaugeX, gaugeY - 6, 200, 14);
        });

        // Overall grid stability calculation
        const avgDrift = totalDrift / 4;
        this.diagGridStability = Math.max(10, Math.round(100 - avgDrift * 1.4));
        this.diagStabilityText.setText(`GRID: ${this.diagGridStability}%`);

        if (this.diagGridStability < 40) {
            this.diagStabilityText.setColor('#FF3366');
        } else {
            this.diagStabilityText.setColor('#00E5FF');
        }
    }

    // =========================================================================
    // SCENE EXIT CONTRACT: RETURN TO OCEANEER CLUB HUB
    // =========================================================================
    returnToHub() {
        if (this.isExiting) return;
        this.isExiting = true;

        if (this.oceaneerHub && this.oceaneerHub.scene) {
            this.oceaneerHub.scene.setVisible(true);
            this.oceaneerHub.scene.resume('OceaneerClubScene');
        }
        this.scene.stop('StarWarsCargoWingScene');
    }
}
