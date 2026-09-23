// Dynamic safe-area detection helper for notch/island/curved screens
function getSafeAreaInsets() {
    let top = 0, left = 0, right = 0, bottom = 0;
    try {
        const div = document.createElement('div');
        div.style.paddingTop = 'env(safe-area-inset-top, 0px)';
        div.style.paddingLeft = 'env(safe-area-inset-left, 0px)';
        div.style.paddingRight = 'env(safe-area-inset-right, 0px)';
        div.style.paddingBottom = 'env(safe-area-inset-bottom, 0px)';
        div.style.position = 'fixed';
        div.style.left = '-9999px';
        div.style.top = '-9999px';
        div.style.visibility = 'hidden';
        document.body.appendChild(div);
        const style = window.getComputedStyle(div);
        top = parseFloat(style.paddingTop) || 0;
        left = parseFloat(style.paddingLeft) || 0;
        right = parseFloat(style.paddingRight) || 0;
        bottom = parseFloat(style.paddingBottom) || 0;
        document.body.removeChild(div);
    } catch (e) {}
    return { top, left, right, bottom };
}

// Game Configuration
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    backgroundColor: '#87CEEB',
    pixelArt: true,
    roundPixels: true,
    scale: {
        mode: Phaser.Scale.RESIZE,
        width: '100%',
        height: '100%'
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    scene: []
};

// --- AMELIA ROYAL MAKEOVER SYSTEM (BIBBIDI BOBBIDI BOUTIQUE) ---

const DEFAULT_AMELIA_OUTFIT = {
    dressStyle: 'play',
    dressColor: 'rose',
    hairStyle: 'curls',
    hairColor: 'brown',
    crown: 'none',
    scepter: 'none'
};

if (!window.ameliaOutfit) {
    window.ameliaOutfit = Object.assign({}, DEFAULT_AMELIA_OUTFIT);
}

const BOUTIQUE_CONFIG = {
    dressStyles: [
        { id: 'ballgown', label: 'ROYAL BALLGOWN', desc: 'A majestic sweeping gown fit for the Grand Hall!' },
        { id: 'peplum', label: 'PRINCESS PEPLUM', desc: 'Puffed sleeves and delicate royal sash ruffles!' },
        { id: 'mermaid', label: 'MERMAID GOWN', desc: 'An iridescent seafoam gown styled after Ariel!' },
        { id: 'play', label: 'CLASSIC PLAY', desc: 'Amelia\'s comfortable everyday cruise clothes!' }
    ],
    dressColors: [
        { id: 'sapphire', label: 'CINDERELLA BLUE', main: 0x58B8F8, shade: 0x0058F8, desc: 'Sparkling sapphire blue blessed by a fairy godmother!' },
        { id: 'rose', label: 'ROYAL ROSE PINK', main: 0xF85898, shade: 0xB81858, desc: 'A glowing rose pink reminiscent of Aurora\'s coronation!' },
        { id: 'gold', label: 'BELLE RADIANT GOLD', main: 0xF8C800, shade: 0xA88000, desc: 'Gleaming ballroom gold from a tale as old as time!' },
        { id: 'emerald', label: 'TIANA EMERALD', main: 0x48C848, shade: 0x007820, desc: 'Enchanted bayou emerald green with royal water lily trim!' },
        { id: 'crystal', label: 'ELSA ICE CRYSTAL', main: 0x78E0F8, shade: 0x2888B8, desc: 'Glittering icy cyan that sparkles like fresh snow!' },
        { id: 'violet', label: 'RAPUNZEL VIOLET', main: 0xB858D8, shade: 0x681888, desc: 'Radiant corona violet woven with floating lanterns magic!' }
    ],
    hairStyles: [
        { id: 'updo', label: 'ROYAL BUN UPDO', desc: 'An elegant high bun with soft cascading curls!' },
        { id: 'braid', label: 'PRINCESS BRAID', desc: 'A long braided garland trailing gracefully over shoulder!' },
        { id: 'curls', label: 'FLOWING CURLS', desc: 'Amelia\'s signature shoulder-length bouncy curls!' }
    ],
    hairColors: [
        { id: 'brown', label: 'CHESTNUT BROWN', H: 0x783C00, h: 0x482000, L: 0xB87828, desc: 'Amelia\'s natural warm chestnut brown curls!' },
        { id: 'blonde', label: 'GOLDEN SUN BLONDE', H: 0xF8E060, h: 0xC09010, L: 0xFFF8A0, desc: 'Shimmering sunlight golden blonde locks!' },
        { id: 'black', label: 'RAVEN SILK BLACK', H: 0x383838, h: 0x181818, L: 0x686868, desc: 'Lustrous, sleek raven black hair with moonlight shine!' },
        { id: 'auburn', label: 'ROYAL AUBURN', H: 0xC84010, h: 0x801800, L: 0xF87040, desc: 'Vibrant fiery auburn with copper highlights!' },
        { id: 'pink', label: 'FAIRY PASTEL PINK', H: 0xF8A0C8, h: 0xC05080, L: 0xFFD8E8, desc: 'Enchanted pastel pink dusted with pixie glow!' }
    ],
    crowns: [
        { id: 'none', label: 'NONE', desc: 'No crown, keeping hair in its natural royal splendor!' },
        { id: 'tiara', label: 'SPARKLING TIARA', desc: 'A gleaming diamond crystal tiara that catches the light!' },
        { id: 'royal_crown', label: 'ROYAL GOLD CROWN', desc: 'A majestic 24K gold crown set with precious rubies!' },
        { id: 'wreath', label: 'BLOSSOM WREATH', desc: 'A garland of enchanted pink roses and evergreen leaves!' }
    ],
    scepters: [
        { id: 'none', label: 'NONE', desc: 'Hands free for swimming and cruise adventures!' },
        { id: 'star', label: 'GOLD STAR SCEPTER', desc: 'A shining golden star wand with magical trailing stardust!' },
        { id: 'heart', label: 'CRYSTAL HEART WAND', desc: 'A glowing rose crystal heart that pulses with kindness!' },
        { id: 'rose', label: 'ENCHANTED ROSE', desc: 'A royal red rose scepter plucked from an enchanted garden!' }
    ]
};

const BASE_AMELIA_PALETTE = {
    'B': 0x000000,
    'S': 0xFCD8A8,
    's': 0xD89060,
    'H': 0x783C00,
    'h': 0x482000,
    'L': 0xB87828,
    'P': 0xF85898,
    'p': 0xB81858,
    'W': 0xFFFFFF,
    'T': 0xFFD700,
    't': 0xB8860B,
    'C': 0x58F8F8,
    'c': 0x00A8A8,
    'R': 0xE82020,
    'r': 0x900000,
    'G': 0x20C040,
    'g': 0x007820,
    'M': 0xE0B840,
    'Y': 0xFFE800
};

function getAmeliaPalette(outfit) {
    let pal = Object.assign({}, BASE_AMELIA_PALETTE);
    const hairOpt = BOUTIQUE_CONFIG.hairColors.find(h => h.id === outfit.hairColor) || BOUTIQUE_CONFIG.hairColors[0];
    pal['H'] = hairOpt.H;
    pal['h'] = hairOpt.h;
    pal['L'] = hairOpt.L;

    const dressOpt = BOUTIQUE_CONFIG.dressColors.find(d => d.id === outfit.dressColor) || BOUTIQUE_CONFIG.dressColors[0];
    pal['P'] = dressOpt.main;
    pal['p'] = dressOpt.shade;
    pal['W'] = 0xFFFFFF;
    return pal;
}

function buildAmeliaMatrix(outfit, frameType = 'idle') {
    let r0, r1, r2, r3, r4;

    // Rows 0-2 (Crown & Top of Hair)
    if (outfit.crown === 'tiara') {
        if (outfit.hairStyle === 'updo') {
            r0 = "....BBHHHHBB...."; // High bun visible above tiara
            r1 = "...BCCWCCBHHB..."; // Diamond tiara center with bun backdrop
            r2 = "..BTTTTTTTTTB..."; // Gold tiara band
        } else {
            r0 = ".....BCCWCCB....";
            r1 = "...BCCCCCCBB....";
            r2 = "..BTTTTTTTTTB...";
        }
    } else if (outfit.crown === 'royal_crown') {
        if (outfit.hairStyle === 'updo') {
            r0 = "....BTRTRTB....."; // Ruby peaks
            r1 = "...BTTTTTBHHB..."; // Crown band with royal bun visible
            r2 = "..BTRTRTRTRTB...";
        } else {
            r0 = "....BTRTRTB.....";
            r1 = "...BTTTTTTTB....";
            r2 = "..BTRTRTRTRTB...";
        }
    } else if (outfit.crown === 'wreath') {
        r0 = "....BGGPPGGB....";
        r1 = "...BPPGGGGPPB...";
        r2 = "..BGGPPGGPPGB...";
    } else {
        // No crown - pure hair
        if (outfit.hairStyle === 'updo') {
            r0 = "...BBHHHHHHBB..."; // High royal bun
            r1 = "..BHHLLLLLLHHB.."; // Bun highlights
            r2 = "..BHHLLLLLLHHB..";
        } else if (outfit.hairStyle === 'braid') {
            r0 = ".....BBBBBB.....";
            r1 = "...BBHHHHHHBB...";
            r2 = "..BHHHLLLLHHHB..";
        } else { // curls
            r0 = ".....BBBBBB.....";
            r1 = "...BBHHHHHHBB...";
            r2 = "..BHHHLLLLHHHB..";
        }
    }

    // Rows 3-4 (Hair bangs / bow / forehead)
    if (outfit.hairStyle === 'updo') {
        if (outfit.crown !== 'none') {
            r3 = "...BHHHHHHHHB...";
            r4 = "...BHHHHHHHHB...";
        } else {
            r3 = "..BHHPPBBPPHHB..";
            r4 = "...BHHWWWWPPHB..";
        }
    } else if (outfit.hairStyle === 'braid') {
        if (outfit.crown !== 'none') {
            r3 = "..BHHLLLLLLHHB..";
            r4 = "..BHHHHHHHHHHB..";
        } else {
            r3 = "..BHHPPBBPPHHB..";
            r4 = "..BHHPPWWPPHHB..";
        }
    } else { // curls
        if (outfit.crown !== 'none') {
            r3 = "..BHHLLLLLLHHB..";
            r4 = "..BHHHHHHHHHHB..";
        } else {
            r3 = "..BHHPPBBPPHHB..";
            r4 = "..BHHPPWWPPHHB..";
        }
    }

    // Rows 5-9 (Face, Eyes, Cheeks, Mouth, Neck & Side Hair/Braid/Curls)
    let r5, r6, r7, r8, r9;
    if (outfit.hairStyle === 'updo') {
        // Sleek royal updo with exposed neck and delicate curls
        r5 = "...BHSSSSSSHB...";
        r6 = "...BHSWBSSWBSHB.";
        r7 = "...BHSSSSSSHB...";
        r8 = "...BHSSSWWSSHB..";
        r9 = "....BSSSSSSB....";
    } else if (outfit.hairStyle === 'braid') {
        // Long royal braid draping over left shoulder down front
        r5 = ".BHHSSSSSSSSHB..";
        r6 = "BHLHSWBSSWBSHB..";
        r7 = "BHHHSSSSSSSSHB..";
        r8 = ".BHLBSSSWWSSSHB.";
        r9 = ".BHHBSSSSBHHB...";
    } else {
        // Voluminous, bouncy flowing curls expanding out wide on both sides
        r5 = ".BHHSSSSSSSSHHB.";
        r6 = "BHLHSWBSSWBSHLHB";
        r7 = "BHHHSSSSSSSSHHHB";
        r8 = "BHLHBSSSWWSSBHLB";
        r9 = "BHHBSSSSSSSSBHHB";
    }

    // Rows 10-12 (Bodice & Sleeves, plus braid/curls cascading)
    let r10, r11, r12;
    if (outfit.hairStyle === 'braid') {
        // Braid clearly running down left side of bodice
        if (outfit.dressStyle === 'ballgown') {
            r10 = "BHLHBPPPPBHHB...";
            r11 = "BLHLBPWWPBHHB...";
            r12 = "BHLHBPPPPBHHB...";
        } else if (outfit.dressStyle === 'peplum') {
            r10 = "BHLBSSSSSSBPPB..";
            r11 = "BLHLBPPPPPBPPB..";
            r12 = "BHLBBPPPPPPBBB..";
        } else {
            r10 = "BHLHBSSSSBHHB...";
            r11 = "BLHLBPPPPBHHB...";
            r12 = "BHLHBPPPPBHHB...";
        }
    } else if (outfit.hairStyle === 'curls') {
        // Bouncy ringlet curls resting on shoulders
        if (outfit.dressStyle === 'ballgown') {
            r10 = "BHLHBPPPPPPBHLHB";
            r11 = ".BHHBPWWPPBHHB..";
            r12 = "..BBBPPPPPPBBB..";
        } else if (outfit.dressStyle === 'peplum') {
            r10 = "BHLPBSSSSSSBPLHB";
            r11 = ".BPPBPPPPPPBPPB.";
            r12 = "..BBBPPPPPPBBB..";
        } else {
            r10 = "BHLHBPPPPPPBHLHB";
            r11 = ".BHHBPPPPPPBHHB.";
            r12 = "..BBBPPPPPPBBB..";
        }
    } else {
        // Sleek updo bodice
        if (outfit.dressStyle === 'ballgown') {
            r10 = "..BHHBPPPPBHHB..";
            r11 = "..BHHBPWWPBHHB..";
            r12 = "..BHHBPPPPBHHB..";
        } else if (outfit.dressStyle === 'peplum') {
            r10 = ".BPPBSSSSSSBPPB.";
            r11 = ".BPPBPPPPPPBPPB.";
            r12 = "..BBBPPPPPPBBB..";
        } else {
            r10 = "..BHHBSSSSBHHB..";
            r11 = "..BHHBPPPPBHHB..";
            r12 = "..BHHBPPPPBHHB..";
        }
    }

    // Rows 13-17 (Waist, Skirt, Hands)
    let r13, r14, r15, r16, r17;
    if (frameType === 'swim') {
        r12 = "...BSSBPPPPBSSB.";
        r13 = "..BFFFFFFFFFFFFB";
        r14 = "..BFfWWFFFfWWfFB";
        r15 = "..BffffffffffffB";
        r16 = "...BBBBBBBBBBBB.";
        r17 = "....BSSB..BSSB..";
    } else if (outfit.dressStyle === 'ballgown') {
        if (outfit.hairStyle === 'braid') {
            r13 = "BPPBBPPPPPPBSSB."; // Braid ribbon tie
            r14 = "BHLBPPPPPPPPBSSB"; // Braid tassel
        } else {
            r13 = ".BSSBPPPPPPBSSB.";
            r14 = "BSSBPPPPPPPPBSSB";
        }
        r15 = "BPPPPPPPPPPPPPPB";
        r16 = "BPPPPPPWWPPPPPPB";
        r17 = "BBBBBBBBBBBBBBBB";
    } else if (outfit.dressStyle === 'peplum') {
        if (outfit.hairStyle === 'braid') {
            r13 = "BPPBWWWWWWWBSSB.";
            r14 = "BHLBPPPPPPBSSB..";
        } else {
            r13 = ".BSSBWWWWWWWBSSB";
            r14 = ".BSSBPPPPPPBSSB.";
        }
        r15 = "..BBBPPPPPPBBB..";
        r16 = "...BPPPPPPPPB...";
        r17 = "...BBBBBBBBBB...";
    } else if (outfit.dressStyle === 'mermaid') {
        if (outfit.hairStyle === 'braid') {
            r13 = "BPPBBPPPPPPBSSB.";
            r14 = "BHLBPPPPPPBSSB..";
        } else {
            r13 = ".BSSBPPPPPPBSSB.";
            r14 = ".BSSBPPPPPPBSSB.";
        }
        r15 = "..BBBPPPPPPBBB..";
        r16 = "..BPPPPPPPPPPB..";
        r17 = "..BBBBBBBBBBBB..";
    } else { // play
        if (frameType === 'walk_0') {
            r13 = (outfit.hairStyle === 'braid') ? "BPPBBPPPPBBSSB.." : "..BSSBPPPPBBSSB.";
            r14 = (outfit.hairStyle === 'braid') ? "BHLB.BPPPPBBSSB." : "..BSSBPPPPBBSSB.";
            r15 = "...BBBPPPPPBSSB.";
            r16 = "...BPPPPPPPPB...";
            r17 = "...BBBBBBBBBB...";
        } else if (frameType === 'walk_2') {
            r13 = (outfit.hairStyle === 'braid') ? "BPPBBBPPPPBSSB.." : ".BSSBBPPPPBSSB..";
            r14 = (outfit.hairStyle === 'braid') ? "BHLBBBPPPPBSSB.." : ".BSSBBPPPPBSSB..";
            r15 = ".BSSBPPPPPBBB...";
            r16 = "...BPPPPPPPPB...";
            r17 = "...BBBBBBBBBB...";
        } else if (frameType === 'jump') {
            r13 = (outfit.hairStyle === 'braid') ? "BPPBBPPPPPPBSSB." : ".BSSBPPPPPPBSSB.";
            r14 = (outfit.hairStyle === 'braid') ? "BHLBPPPPPPPBSSB." : ".BSSBPPPPPPBSSB.";
            r15 = "..BB.PPPPPP.BB..";
            r16 = "...BPPPPPPPPB...";
            r17 = "...BBBBBBBBBB...";
        } else {
            r13 = (outfit.hairStyle === 'braid') ? "BPPBBPPPPPPBSSB." : ".BSSBPPPPPPBSSB.";
            r14 = (outfit.hairStyle === 'braid') ? "BHLBPPPPPPPBSSB." : ".BSSBPPPPPPBSSB.";
            r15 = "..BBBPPPPPPBBB..";
            r16 = "...BPPPPPPPPB...";
            r17 = "...BBBBBBBBBB...";
        }
    }

    // Rows 18-19 (Legs and Shoes)
    let r18, r19;
    if (frameType === 'swim') {
        r18 = "...BWWWB..BWWWB.";
        r19 = "....BBB....BBB..";
    } else if (frameType === 'walk_0') {
        r18 = "....BSSB...BSSB.";
        r19 = "...BWWWB...BWWWB";
    } else if (frameType === 'walk_2') {
        r18 = "....BSSB.BSSB...";
        r19 = "...BWWWB.BWWWB..";
    } else if (frameType === 'jump') {
        r18 = "....BSSB.BSSB...";
        r19 = "...BWWWB.BWWWB..";
    } else {
        r18 = "....BSSB.BSSB...";
        r19 = "...BWWWB.BWWWB..";
    }

    let rows = [r0, r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14, r15, r16, r17, r18, r19];

    // Overlay Scepter if selected and not swimming
    if (outfit.scepter !== 'none' && frameType !== 'swim') {
        const replaceChar = (str, idx, ch) => str.substring(0, idx) + ch + str.substring(idx + 1);
        let topChar = 'Y';
        if (outfit.scepter === 'heart') topChar = 'P';
        else if (outfit.scepter === 'rose') topChar = 'R';

        rows[10] = replaceChar(rows[10], 14, topChar);
        rows[10] = replaceChar(rows[10], 15, 'B');
        rows[11] = replaceChar(rows[11], 13, 'B');
        rows[11] = replaceChar(rows[11], 14, topChar);
        rows[11] = replaceChar(rows[11], 15, 'B');
        rows[12] = replaceChar(rows[12], 14, 'M');
        rows[12] = replaceChar(rows[12], 15, 'B');
        rows[13] = replaceChar(rows[13], 15, 'M');
        rows[14] = replaceChar(rows[14], 15, 'M');
        rows[15] = replaceChar(rows[15], 15, 'M');
        rows[16] = replaceChar(rows[16], 15, 'B');
    }

    return rows;
}

function renderPixelTextureGlobal(scene, key, width, height, pixelRows, palette, pixelSize = 2) {
    if (scene.textures && scene.textures.exists(key)) {
        let texture = scene.textures.get(key);
        let src = texture.getSourceImage();
        if (src && typeof src.getContext === 'function') {
            let ctx = src.getContext('2d');
            ctx.clearRect(0, 0, width, height);
            for (let y = 0; y < pixelRows.length; y++) {
                let row = pixelRows[y];
                for (let x = 0; x < row.length; x++) {
                    let ch = row[x];
                    if (ch !== '.' && palette[ch] !== undefined) {
                        ctx.fillStyle = '#' + palette[ch].toString(16).padStart(6, '0');
                        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                    }
                }
            }
            if (typeof texture.refresh === 'function') {
                texture.refresh();
            }
            return;
        }
        scene.textures.remove(key);
    }
    let g = scene.add.graphics();
    for (let y = 0; y < pixelRows.length; y++) {
        let row = pixelRows[y];
        for (let x = 0; x < row.length; x++) {
            let ch = row[x];
            if (ch !== '.' && palette[ch] !== undefined) {
                g.fillStyle(palette[ch], 1);
                g.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
            }
        }
    }
    g.generateTexture(key, width, height);
    g.destroy();
}

function generateAllAmeliaTextures(scene, outfit) {
    const palette = getAmeliaPalette(outfit);

    // 1. Idle & Base
    const idleMatrix = buildAmeliaMatrix(outfit, 'idle');
    renderPixelTextureGlobal(scene, 'amelia', 32, 40, idleMatrix, palette, 2);
    renderPixelTextureGlobal(scene, 'amelia_idle', 32, 40, idleMatrix, palette, 2);

    // 2. Walk
    const walk0Matrix = buildAmeliaMatrix(outfit, 'walk_0');
    renderPixelTextureGlobal(scene, 'amelia_walk_0', 32, 40, walk0Matrix, palette, 2);
    renderPixelTextureGlobal(scene, 'amelia_walk_1', 32, 40, idleMatrix, palette, 2);
    const walk2Matrix = buildAmeliaMatrix(outfit, 'walk_2');
    renderPixelTextureGlobal(scene, 'amelia_walk_2', 32, 40, walk2Matrix, palette, 2);

    // 3. Jump
    const jumpMatrix = buildAmeliaMatrix(outfit, 'jump');
    renderPixelTextureGlobal(scene, 'amelia_jump', 32, 40, jumpMatrix, palette, 2);

    // 4. Swim with floaties
    const floatieColors = [0xFF0000, 0xFFFF00, 0x00E000, 0x9400D3];
    const floatieShades = [0x990000, 0xCC9900, 0x008800, 0x550055];
    const swimMatrix = buildAmeliaMatrix(outfit, 'swim');
    for (let i = 0; i < floatieColors.length; i++) {
        let aPal = Object.assign({}, palette, { 'F': floatieColors[i], 'f': floatieShades[i] });
        renderPixelTextureGlobal(scene, 'amelia_swim_' + i, 32, 40, swimMatrix, aPal, 2);
    }

    // 5. Ensure animations exist (textures updated in-place, existing anims remain valid!)
    let targetScene = scene.anims ? scene : (scene.scene ? scene.scene.get('GameScene') : null);
    if (targetScene && targetScene.anims) {
        if (!targetScene.anims.exists('amelia_idle')) {
            targetScene.anims.create({
                key: 'amelia_idle',
                frames: [{ key: 'amelia_idle' }],
                frameRate: 1
            });
        }
        if (!targetScene.anims.exists('amelia_walk')) {
            targetScene.anims.create({
                key: 'amelia_walk',
                frames: [
                    { key: 'amelia_walk_0' },
                    { key: 'amelia_walk_1' },
                    { key: 'amelia_walk_2' },
                    { key: 'amelia_walk_1' }
                ],
                frameRate: 8,
                repeat: -1
            });
        }
        if (!targetScene.anims.exists('amelia_jump')) {
            targetScene.anims.create({
                key: 'amelia_jump',
                frames: [{ key: 'amelia_jump' }],
                frameRate: 1
            });
        }
    }
}

// --- SCENES ---

class BootScene extends Phaser.Scene {
    constructor() { super('BootScene'); }
    generatePixelTexture(key, width, height, pixelRows, palette, pixelSize = 2) {
        let g = this.add.graphics();
        for (let y = 0; y < pixelRows.length; y++) {
            let row = pixelRows[y];
            for (let x = 0; x < row.length; x++) {
                let ch = row[x];
                if (ch !== '.' && palette[ch] !== undefined) {
                    g.fillStyle(palette[ch], 1);
                    g.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                }
            }
        }
        g.generateTexture(key, width, height);
        g.destroy();
    }

    preload() {
        // --- 8-BIT CAPCOM NES CHARACTER PALETTES & FRAMES ---
        const RILEY_PALETTE = {
            'B': 0x000000,
            'S': 0xFCD8A8,
            's': 0xD89060,
            'H': 0x783C00,
            'h': 0x482000,
            'Y': 0xA85820,
            'C': 0x0068F8,
            'c': 0x0038A8,
            'D': 0x001868,
            'W': 0xFFFFFF,
            'R': 0xFC3800
        };

        const AMELIA_PALETTE = {
            'B': 0x000000,
            'S': 0xFCD8A8,
            's': 0xD89060,
            'H': 0x783C00,
            'h': 0x482000,
            'L': 0xB87828,
            'P': 0xF85898,
            'p': 0xB81858,
            'W': 0xFFFFFF
        };

        const riley_idle = [
            ".....BBBBBB.....",
            "...BBHHHHHHBB...",
            "..BHHHYYYYHHHB..",
            "..BHHHHHHHHHHB..",
            "..BHHHHHHHHHHB..",
            "..BSSSSSSSSSSB..",
            "..BSWBSSSSWBSB..",
            "..BSSSSSSSSSSB..",
            "...BSSSWWSSSB...",
            "....BSSSSSSB....",
            "...BCCBBBBCCB...",
            "..BHHBCCCCCCB...",
            ".BHHBCWCCCCBSSB.",
            ".BHHBCCCCCCBSSB.",
            "..BB.CCCCCCBSSB.",
            "....BCCCCCCB....",
            "....BDDDDDDDB...",
            "....BDDDDDDDB...",
            "....BDDDBBDDDB..",
            "....BSSB.BSSB...",
            "....BSSB.BSSB...",
            "....BSSB.BSSB...",
            "...BWWWB.BWWWB..",
            "...BBBBB.BBBBB.."
        ];

        const riley_walk_0 = [
            ".....BBBBBB.....",
            "...BBHHHHHHBB...",
            "..BHHHYYYYHHHB..",
            "..BHHHHHHHHHHB..",
            "..BHHHHHHHHHHB..",
            "..BSSSSSSSSSSB..",
            "..BSWBSSSSWBSB..",
            "..BSSSSSSSSSSB..",
            "...BSSSWWSSSB...",
            "....BSSSSSSB....",
            "...BCCBBBBCCB...",
            "..BHHBCCCCCCB...",
            ".BHHBCWCCCCBB...",
            ".BHHBCCCCCCBSSB.",
            "..BB.CCCCCCBSSB.",
            "....BCCCCCCB....",
            "....BDDDDDDDB...",
            ".....BDDDDDDDB..",
            "....BDDDB.BDDDB.",
            "....BSSB...BSSB.",
            "....BSSB....BSSB",
            "...BWWWB....BWWW",
            "...BBBBB....BBBB",
            "................"
        ];

        const riley_walk_1 = riley_idle;

        const riley_walk_2 = [
            ".....BBBBBB.....",
            "...BBHHHHHHBB...",
            "..BHHHYYYYHHHB..",
            "..BHHHHHHHHHHB..",
            "..BHHHHHHHHHHB..",
            "..BSSSSSSSSSSB..",
            "..BSWBSSSSWBSB..",
            "..BSSSSSSSSSSB..",
            "...BSSSWWSSSB...",
            "....BSSSSSSB....",
            "...BCCBBBBCCB...",
            "..BHHBCCCCCCB...",
            "..BBCWCCCCBSSB..",
            ".BHHBCCCCCCBSSB.",
            ".BHHBCCCCCCBBB..",
            "..BB.CCCCCCB....",
            "....BDDDDDDDB...",
            "...BDDDDDDDDB...",
            "....BDDDB.BDDDB.",
            "....BSSB...BSSB.",
            "...BSSB....BSSB.",
            "..BWWWB....BWWWB",
            "..BBBBB....BBBBB",
            "................"
        ];

        const riley_jump = [
            ".....BBBBBB.....",
            "...BBHHHHHHBB...",
            "..BHHHYYYYHHHB..",
            "..BHHHHHHHHHHB..",
            "..BHHHHHHHHHHB..",
            "..BSSSSSSSSSSB..",
            "..BSWBSSSSWBSB..",
            "..BSSSSSSSSSSB..",
            "...BSSSWWSSSB...",
            "....BSSSSSSB....",
            "...BCCBBBBCCB...",
            ".BSSBCCCCCCBSSB.",
            ".BSSBCWCCCCBSSB.",
            "..BB.CCCCCCB.BB.",
            "....BCCCCCCB....",
            "....BDDDDDDDB...",
            "...BDDDDDDDDDB..",
            "...BDDDB.BDDDB..",
            "...BSSB...BSSB..",
            "..BWWWB...BWWWB.",
            "..BBBBB...BBBBB.",
            "................",
            "................",
            "................"
        ];

        const riley_swim = [
            ".....BBBBBB.....",
            "...BBHHHHHHBB...",
            "..BHHHYYYYHHHB..",
            "..BHHHHHHHHHHB..",
            "..BHHHHHHHHHHB..",
            "..BSSSSSSSSSSB..",
            "..BSWBSSSSWBSB..",
            "..BSSSSSSSSSSB..",
            "...BSSSWWSSSB...",
            "....BSSSSSSB....",
            "...BCCBBBBCCB...",
            "...BSSBCWCCCCBSS",
            "..BFFFFFFFFFFFFB",
            "..BFfWWFFFfWWfFB",
            "..BffffffffffffB",
            "...BBBBBBBBBBBB.",
            "....BDDDB.BDDDB.",
            "....BSSB...BSSB.",
            "...BWWWB...BWWWB",
            "...BBBB.....BBB.",
            "................",
            "................",
            "................",
            "................"
        ];

        const amelia_idle = [
            ".....BBBBBB.....",
            "...BBHHHHHHBB...",
            "..BHHHLLLLHHHB..",
            "..BHHPPBBPPHHB..",
            "..BHHPPWWPPHHB..",
            "..BHSSSSSSSSHB..",
            "..BHSWBSSWBSHB..",
            "..BHSSSSSSSSHB..",
            "..BHSSSWWSSSHB..",
            "..BHHBSSSSBHHB..",
            "..BHHBPPPPBHHB..",
            "..BHHBPPPPBHHB..",
            "..BHHBPPPPBHHB..",
            ".BSSBPPPPPPBSSB.",
            ".BSSBPPPPPPBSSB.",
            "..BBBPPPPPPBBB..",
            "...BPPPPPPPPB...",
            "...BBBBBBBBBB...",
            "....BSSB.BSSB...",
            "...BWWWB.BWWWB.."
        ];

        const amelia_walk_0 = [
            ".....BBBBBB.....",
            "...BBHHHHHHBB...",
            "..BHHHLLLLHHHB..",
            "..BHHPPBBPPHHB..",
            "..BHHPPWWPPHHB..",
            "..BHSSSSSSSSHB..",
            "..BHSWBSSWBSHB..",
            "..BHSSSSSSSSHB..",
            "..BHSSSWWSSSHB..",
            "..BHHBSSSSBHHB..",
            "..BHHBPPPPBHHB..",
            "..BHHBPPPPBHHB..",
            "..BHHBPPPPBHHB..",
            "..BSSBPPPPBBSSB.",
            "..BSSBPPPPBBSSB.",
            "...BBBPPPPPBSSB.",
            "...BPPPPPPPPB...",
            "...BBBBBBBBBB...",
            "....BSSB...BSSB.",
            "...BWWWB...BWWWB"
        ];

        const amelia_walk_1 = amelia_idle;

        const amelia_walk_2 = [
            ".....BBBBBB.....",
            "...BBHHHHHHBB...",
            "..BHHHLLLLHHHB..",
            "..BHHPPBBPPHHB..",
            "..BHHPPWWPPHHB..",
            "..BHSSSSSSSSHB..",
            "..BHSWBSSWBSHB..",
            "..BHSSSSSSSSHB..",
            "..BHSSSWWSSSHB..",
            "..BHHBSSSSBHHB..",
            "..BHHBPPPPBHHB..",
            "..BHHBPPPPBHHB..",
            "..BHHBPPPPBHHB..",
            ".BSSBBPPPPBSSB..",
            ".BSSBBPPPPBSSB..",
            ".BSSBPPPPPBBB...",
            "...BPPPPPPPPB...",
            "...BBBBBBBBBB...",
            "....BSSB.BSSB...",
            "...BWWWB.BWWWB.."
        ];

        const amelia_jump = [
            ".....BBBBBB.....",
            "...BBHHHHHHBB...",
            "..BHHHLLLLHHHB..",
            "..BHHPPBBPPHHB..",
            "..BHHPPWWPPHHB..",
            "..BHSSSSSSSSHB..",
            "..BHSWBSSWBSHB..",
            "..BHSSSSSSSSHB..",
            "..BHSSSWWSSSHB..",
            "..BHHBSSSSBHHB..",
            "..BHHBPPPPBHHB..",
            ".BSSBPPPPPPBSSB.",
            ".BSSBPPPPPPBSSB.",
            "..BB.PPPPPP.BB..",
            "...BPPPPPPPPB...",
            "...BBBBBBBBBB...",
            "....BSSB.BSSB...",
            "...BWWWB.BWWWB..",
            "...BBBBB.BBBBB..",
            "................"
        ];

        const amelia_swim = [
            ".....BBBBBB.....",
            "...BBHHHHHHBB...",
            "..BHHHLLLLHHHB..",
            "..BHHPPBBPPHHB..",
            "..BHHPPWWPPHHB..",
            "..BHSSSSSSSSHB..",
            "..BHSWBSSWBSHB..",
            "..BHSSSSSSSSHB..",
            "..BHSSSWWSSSHB..",
            "..BHHBSSSSBHHB..",
            "..BHHBPPPPBHHB..",
            "...BSSBPPPPBSSB.",
            "..BFFFFFFFFFFFFB",
            "..BFfWWFFFfWWfFB",
            "..BffffffffffffB",
            "...BBBBBBBBBBBB.",
            "....BSSB..BSSB..",
            "...BWWWB..BWWWB.",
            "....BBB....BBB..",
            "................"
        ];

        // Generate Riley Textures (32x48)
        this.generatePixelTexture('riley', 32, 48, riley_idle, RILEY_PALETTE, 2);
        this.generatePixelTexture('riley_idle', 32, 48, riley_idle, RILEY_PALETTE, 2);
        this.generatePixelTexture('riley_walk_0', 32, 48, riley_walk_0, RILEY_PALETTE, 2);
        this.generatePixelTexture('riley_walk_1', 32, 48, riley_walk_1, RILEY_PALETTE, 2);
        this.generatePixelTexture('riley_walk_2', 32, 48, riley_walk_2, RILEY_PALETTE, 2);
        this.generatePixelTexture('riley_jump', 32, 48, riley_jump, RILEY_PALETTE, 2);

        // Generate Amelia Textures (32x40) using Royal Makeover Generator
        generateAllAmeliaTextures(this, window.ameliaOutfit);

        // Generate Floatie variations for Riley
        const floatieColors = [0xFF0000, 0xFFFF00, 0x00E000, 0x9400D3];
        const floatieShades = [0x990000, 0xCC9900, 0x008800, 0x550055];
        for (let i = 0; i < floatieColors.length; i++) {
            let rPal = Object.assign({}, RILEY_PALETTE, { 'F': floatieColors[i], 'f': floatieShades[i] });
            this.generatePixelTexture('riley_swim_' + i, 32, 48, riley_swim, rPal, 2);
        }

        // --- 8-BIT FUNNEL VISION CARTOON PALETTE & TEXTURES ---
        const FV_PALETTE = {
            'B': 0x000000, 'W': 0xFFFFFF, 'S': 0xFCD8A8, 's': 0xD89060,
            'R': 0xE82000, 'r': 0x981000, 'Y': 0xF8B800, 'G': 0x787878,
            'g': 0xB0B0B0, 'D': 0x783C00, 'd': 0x482000, 'P': 0xF85898,
            'p': 0xB81858, 'C': 0x58B8F8, 'U': 0x0040A0, 'u': 0x001850
        };

        const fv_mickey_0 = [
            "..BBBB......BBBB....",
            ".BBBBBB....BBBBBB...",
            ".BBBBBB....BBBBBB...",
            "..BBBB......BBBB....",
            "....WWWWWWWWWW......",
            "...WWWWWWWWWWWW.....",
            "...GGGGGGGGGGGG.....",
            "..BBBBBBBBBBBBBB....",
            "..BSSSSSSSSSSSSB....",
            "..BSWWBSSSSWWBSSB...",
            "..BSWBSSSSSSWBSSB...",
            "..BSSSSSSSSSSSSSB...",
            "..BSSSWWSSSWBSSSB...",
            "...BSSSSSSSSSSSB....",
            "....BBBBBBBBBBB.....",
            "..WW.BBBBBBBBB.WW...",
            ".WWW.BBBBBBBBB.WWW..",
            ".WWW.RRRRRRRRR.WWW..",
            "..W..RYRRYYRRY..W...",
            ".....RRRRRRRRR......",
            ".....BB.....BB......",
            "....YYYY...YYYY.....",
            "...YYYYY...YYYYY...."
        ];

        const fv_mickey_1 = [
            "..BBBB......BBBB....",
            ".BBBBBB....BBBBBB...",
            ".BBBBBB....BBBBBB...",
            "..BBBB......BBBB....",
            "....WWWWWWWWWW......",
            "...WWWWWWWWWWWW.....",
            "...GGGGGGGGGGGG.....",
            "..BBBBBBBBBBBBBB....",
            "..BSSSSSSSSSSSSB....",
            "..BSWWBSSSSWWBSSB...",
            "..BSWBSSSSSSWBSSB...",
            "..BSSSSSSSSSSSSSB...",
            "..BSSSWWSSSWBSSSB...",
            "...BSSSSSSSSSSSB....",
            "....BBBBBBBBBBB.....",
            ".WW..BBBBBBBBB...WW.",
            "WWWW.BBBBBBBBB..WWWW",
            ".WW..RRRRRRRRR...WW.",
            ".....RYRRYYRRY......",
            ".....RRRRRRRRR......",
            "....BB......BB......",
            "...YYYY......YYYY...",
            "..YYYYY.......YY...."
        ];

        const fv_mickey_2 = [
            "..BBBB......BBBB....",
            ".BBBBBB....BBBBBB...",
            ".BBBBBB....BBBBBB...",
            "..BBBB......BBBB....",
            "....WWWWWWWWWW......",
            "...WWWWWWWWWWWW.....",
            "...GGGGGGGGGGGG.....",
            "..BBBBBBBBBBBBBB....",
            "..BSSSSSSSSSSSSB....",
            "..BSWWBSSSSWWBSSB...",
            "..BSWBSSSSSSWBSSB...",
            "..BSSSSSSSSSSSSSB...",
            "..BSSBBWWRRWWSSSB...",
            "...BSSSSSSSSSSSB....",
            "....BBBBBBBBBBB.....",
            "..WW.BBBBBBBBB.WW...",
            ".WWW.BBBBBBBBB.WWW..",
            ".WWW.RRRRRRRRR.WWW..",
            "..W..RYRRYYRRY..W...",
            ".....RRRRRRRRR......",
            ".....BB.....BB......",
            "....YYYY...YYYY.....",
            "...YYYYY...YYYYY...."
        ];

        const fv_mickey_3 = [
            "..BBBB......BBBB....",
            ".BBBBBB....BBBBBB...",
            ".BBBBBB....BBBBBB...",
            "..BBBB......BBBB....",
            "....WWWWWWWWWW......",
            "...WWWWWWWWWWWW.....",
            "...GGGGGGGGGGGG.....",
            "..BBBBBBBBBBBBBB....",
            "..BSSSSSSSSSSSSB....",
            "..BSWWBSSSSWWBSSB...",
            "..BSWBSSSSSSWBSSB...",
            "..BSSSSSSSSSSSSSB...",
            "..BSSSWWSSSWBSSSB...",
            "...BSSSSSSSSSSSB....",
            "....BBBBBBBBBBB.....",
            ".WW...BBBBBBBBB..WW.",
            "WWWW..BBBBBBBBB.WWWW",
            ".WW...RRRRRRRRR..WW.",
            "......RYRRYYRRY.....",
            "......RRRRRRRRR.....",
            "......BB......BB....",
            "...YYYY......YYYY...",
            "....YY.......YYYYY.."
        ];

        const fv_minnie_0 = [
            "..BBBB......BBBB....",
            ".BBBBBB....BBBBBB...",
            ".BBBBBB....BBBBBB...",
            "..BBBB......BBBB....",
            ".......WWWW.........",
            "......WWYYWW........",
            ".......WWWW.........",
            "..BBBBBBBBBBBBBB....",
            "..BSSSSSSSSSSSSB....",
            "..BSWWBSSSSWWBSSB...",
            "..BSWBSSSSSSWBSSB...",
            "..BSSSSSSSSSSSSSB...",
            "..BSSBBWWRRWWSSSB...",
            "...BSSSSSSSSSSSB....",
            "....BBBBBBBBBBB.....",
            "...WW.BBBBBBB.WW....",
            "..WW..PPPPPPP..WW...",
            ".....PWPWPWPWP......",
            "....PPPPPPPPPPP.....",
            "...PWPWPWPWPWPWP....",
            "......BB...BB.......",
            ".....YYYY.YYYY......",
            "....PPYY...YYPP....."
        ];

        const fv_minnie_1 = [
            "..BBBB......BBBB....",
            ".BBBBBB....BBBBBB...",
            ".BBBBBB....BBBBBB...",
            "..BBBB......BBBB....",
            ".......WWWW.........",
            "......WWYYWW........",
            ".......WWWW.........",
            "..BBBBBBBBBBBBBB....",
            "..BSSSSSSSSSSSSB....",
            "..BSWWBSSSSWWBSSB...",
            "..BSWBSSSSSSWBSSB...",
            "..BSSSSSSSSSSSSSB...",
            "..BSSBBWWRRWWSSSB...",
            "...BSSSSSSSSSSSB....",
            "....BBBBBBBBBBB.....",
            "..WW..BBBBBBB..WW...",
            ".WWW..PPPPPPP..WWW..",
            ".....PWPWPWPWP......",
            "....PPPPPPPPPPP.....",
            "...PWPWPWPWPWPWP....",
            "......BB...BB.......",
            ".....YYYY.YYYY......",
            "....PPYY...YYPP....."
        ];

        const fv_wheel_0 = [
            "...........dd...........",
            "...........DD...........",
            "....dd.....DD.....dd....",
            ".....DD....DD....DD.....",
            "......DD...DD...DD......",
            ".......DD..DD..DD.......",
            "........DD.DD.DD........",
            ".........DDDDDD.........",
            "..........DDDD..........",
            "....DDDDDDDDDDDDDDDD....",
            "ddDDDDDD..YYYY..DDDDDDdd",
            "ddDDDDDD.YYYYYY.DDDDDDdd",
            "ddDDDDDD.YYYYYY.DDDDDDdd",
            "ddDDDDDD..YYYY..DDDDDDdd",
            "....DDDDDDDDDDDDDDDD....",
            "..........DDDD..........",
            ".........DDDDDD.........",
            "........DD.DD.DD........",
            ".......DD..DD..DD.......",
            "......DD...DD...DD......",
            ".....DD....DD....DD.....",
            "....dd.....DD.....dd....",
            "...........DD...........",
            "...........dd..........."
        ];

        const fv_smokestack = [
            "....GGGGGG....",
            "...GGGGGGGG...",
            "...BBBBBBBB...",
            "...BBBBBBBB...",
            "...RRRRRRRR...",
            "...RRRRRRRR...",
            "...BBBBBBBB...",
            "...BBBBBBBB...",
            "...BBBBBBBB...",
            "...BBBBBBBB...",
            "...BBBBBBBB...",
            "...BBBBBBBB...",
            "...BBBBBBBB...",
            "...BBBBBBBB...",
            "...BBBBBBBB...",
            "..BBBBBBBBBB..",
            ".BBBBBBBBBBBB."
        ];

        const fv_steam_0 = [
            "...gg...",
            "..gWWg..",
            ".gWWWWg.",
            ".gWWWWg.",
            "..gWWg..",
            "...gg..."
        ];

        const fv_steam_1 = [
            "....gggg....",
            "..ggWWWWgg..",
            ".gWWWWWWWWg.",
            "gWWWWWWWWWWg",
            "gWWWWWWWWWWg",
            ".gWWWWWWWWg.",
            "..ggWWWWgg..",
            "....gggg...."
        ];

        const fv_steam_2 = [
            ".....gggggg.....",
            "...ggWWWWWWgg...",
            "..gWWWWWWWWWWg..",
            ".gWWWWWWWWWWWWg.",
            "gWWWWWWWWWWWWWWg",
            "gWWWWWWWWWWWWWWg",
            ".gWWWWWWWWWWWWg.",
            "..gWWWWWWWWWWg..",
            "...ggWWWWWWgg...",
            ".....gggggg....."
        ];

        const fv_note_0 = [
            "....YYYY",
            "....YYYY",
            "....YY..",
            "....YY..",
            "....YY..",
            "..YYYY..",
            ".YYYYYY.",
            "..YYYY.."
        ];

        const fv_note_1 = [
            "..YYYYYYYYY.",
            "..YYYYYYYYY.",
            "..YY.....YY.",
            "..YY.....YY.",
            "..YY.....YY.",
            ".YYYY...YYYY",
            "YYYYYY.YYYYY",
            ".YYYY...YYYY"
        ];

        const fv_heart = [
            ".RR..RR.",
            "RRRRRRRR",
            "RRRRRRRR",
            ".RRRRRR.",
            "..RRRR..",
            "...RR..."
        ];

        const fv_star = [
            "...YY...",
            "...YY...",
            ".YYYYYY.",
            "YYYYYYYY",
            ".YYYYYY.",
            "...YY...",
            "...YY..."
        ];

        const fv_mickey_logo = [
            "......BBBB......BBBB......",
            ".....BBBBBB....BBBBBB.....",
            ".....BBBBBB....BBBBBB.....",
            "......BBBB......BBBB......",
            ".........BBBBBB...........",
            ".......BBBBBBBBBB.........",
            "......BBBBBBBBBBBB........",
            ".....BBBBBBBBBBBBBB.......",
            ".....BBBBBBBBBBBBBB.......",
            "......BBBBBBBBBBBB........",
            ".......BBBBBBBBBB.........",
            ".........BBBBBB..........."
        ];

        const fv_wave_0 = [
            "....CCCC............CCCC........",
            "..CCWWWWCC........CCWWWWCC......",
            ".CWWUUUUWWC......CWWUUUUWWC.....",
            "CWUUUUUUUUWC....CWUUUUUUUUWC....",
            "UUUUUUUUUUUUCCCCUUUUUUUUUUUUCCCC",
            "UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU",
            "uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu",
            "uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu"
        ];

        const fv_wave_1 = [
            "............CCCC............CCCC",
            "..........CCWWWWCC........CCWWWW",
            ".........CWWUUUUWWC......CWWUUUU",
            "........CWUUUUUUUUWC....CWUUUUUU",
            "CCCC....UUUUUUUUUUUUCCCCUUUUUUUU",
            "UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU",
            "uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu",
            "uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu"
        ];

        this.generatePixelTexture('fv_mickey_0', 40, 46, fv_mickey_0, FV_PALETTE, 2);
        this.generatePixelTexture('fv_mickey_1', 40, 46, fv_mickey_1, FV_PALETTE, 2);
        this.generatePixelTexture('fv_mickey_2', 40, 46, fv_mickey_2, FV_PALETTE, 2);
        this.generatePixelTexture('fv_mickey_3', 40, 46, fv_mickey_3, FV_PALETTE, 2);
        this.generatePixelTexture('fv_minnie_0', 40, 46, fv_minnie_0, FV_PALETTE, 2);
        this.generatePixelTexture('fv_minnie_1', 40, 46, fv_minnie_1, FV_PALETTE, 2);
        this.generatePixelTexture('fv_wheel_0', 48, 48, fv_wheel_0, FV_PALETTE, 2);
        this.generatePixelTexture('fv_smokestack', 28, 34, fv_smokestack, FV_PALETTE, 2);
        this.generatePixelTexture('fv_steam_0', 16, 12, fv_steam_0, FV_PALETTE, 2);
        this.generatePixelTexture('fv_steam_1', 24, 16, fv_steam_1, FV_PALETTE, 2);
        this.generatePixelTexture('fv_steam_2', 32, 20, fv_steam_2, FV_PALETTE, 2);
        this.generatePixelTexture('fv_note_0', 16, 16, fv_note_0, FV_PALETTE, 2);
        this.generatePixelTexture('fv_note_1', 24, 16, fv_note_1, FV_PALETTE, 2);
        this.generatePixelTexture('fv_heart', 16, 12, fv_heart, FV_PALETTE, 2);
        this.generatePixelTexture('fv_star', 16, 14, fv_star, FV_PALETTE, 2);
        this.generatePixelTexture('fv_mickey_logo', 52, 24, fv_mickey_logo, FV_PALETTE, 2);
        this.generatePixelTexture('fv_wave_0', 64, 16, fv_wave_0, FV_PALETTE, 2);
        this.generatePixelTexture('fv_wave_1', 64, 16, fv_wave_1, FV_PALETTE, 2);

        // --- 8-BIT AMBIENT NPC PALETTES & FRAMES ---
        const NPC_OFFICER_PALETTE = {
            'B': 0x000000,
            'W': 0xFFFFFF,
            'G': 0xF8B800,
            'S': 0xFCD8A8,
            's': 0xD89060,
            'N': 0x001858,
            'H': 0x482000
        };

        const NPC_TOURIST_PALETTE = {
            'B': 0x000000,
            'S': 0xFCD8A8,
            's': 0xD89060,
            'R': 0xFC3800,
            'Y': 0xF8B800,
            'K': 0xB88040,
            'H': 0x783C00,
            'W': 0xFFFFFF,
            'T': 0x00B8B8
        };

        const NPC_LOUNGE_PALETTE = {
            'B': 0x000000,
            'W': 0xFFFFFF,
            'U': 0x0068F8,
            'S': 0xFCD8A8,
            's': 0xD89060,
            'H': 0x482000,
            'R': 0xFC3800,
            'Y': 0xF8B800,
            'G': 0x00A840,
            'C': 0x583000
        };

        const NPC_SWIMMER_PALETTE = {
            'B': 0x000000,
            'S': 0xFCD8A8,
            'H': 0x783C00,
            'Y': 0xF8B800,
            'O': 0xFC5800,
            'W': 0xFFFFFF,
            'C': 0x00A8F8,
            'R': 0xFC3800
        };

        const npc_officer_idle = [
            ".....BBBBBB.....",
            "..BBBWGGGGWBBB..",
            ".BWGGGGGGGGGGWB.",
            ".BBBBBBBBBBBBBB.",
            "....BBBBBBBB....",
            "..BSSSSSSSSSSB..",
            "..BSWBSSSSWBSB..",
            "..BSSSSSSSSSSB..",
            "...BSBHHHHBSB...",
            "....BBBBBBBB....",
            "...BWWGGGGWWB...",
            "..BWWGGGGGGWWB..",
            ".BWWWGBNNBGWWWB.",
            ".BWWWGBNNBGWWWB.",
            ".BWWWGBBBBGWWWB.",
            "..BWWWWWWWWWWB..",
            "...BGGWWWWGGB...",
            "....BNNNNNNNB...",
            "....BNNNBNNNB...",
            "....BNNNBNNNB...",
            "....BNNNBNNNB...",
            "....BNNNBNNNB...",
            "...BBBBBBBBBBB..",
            "...BBBBB.BBBBB.."
        ];

        const npc_officer_walk_0 = [
            ".....BBBBBB.....",
            "..BBBWGGGGWBBB..",
            ".BWGGGGGGGGGGWB.",
            ".BBBBBBBBBBBBBB.",
            "....BBBBBBBB....",
            "..BSSSSSSSSSSB..",
            "..BSWBSSSSWBSB..",
            "..BSSSSSSSSSSB..",
            "...BSBHHHHBSB...",
            "....BBBBBBBB....",
            "...BWWGGGGWWB...",
            "..BWWGGGGGGWWB..",
            ".BWWWGBNNBGWWWB.",
            ".BWWWGBNNBGWWWB.",
            ".BWWWGBBBBGWWWB.",
            "..BWWWWWWWWWWB..",
            "...BGGWWWWGGB...",
            "....BNNNNNNNB...",
            "...BNNNNBNNNB...",
            "..BNNNNB.BNNNB..",
            ".BNNNNB...BNNNB.",
            "BNNNNB.....BNNB.",
            "BBBBB.......BBBB",
            "BBBB.........BBB"
        ];

        const npc_officer_walk_1 = [
            ".....BBBBBB.....",
            "..BBBWGGGGWBBB..",
            ".BWGGGGGGGGGGWB.",
            ".BBBBBBBBBBBBBB.",
            "....BBBBBBBB....",
            "..BSSSSSSSSSSB..",
            "..BSWBSSSSWBSB..",
            "..BSSSSSSSSSSB..",
            "...BSBHHHHBSB...",
            "....BBBBBBBB....",
            "...BWWGGGGWWB...",
            "..BWWGGGGGGWWB..",
            ".BWWWGBNNBGWWWB.",
            ".BWWWGBNNBGWWWB.",
            ".BWWWGBBBBGWWWB.",
            "..BWWWWWWWWWWB..",
            "...BGGWWWWGGB...",
            "....BNNNNNNNB...",
            "....BNNNBNNNNB..",
            "...BNNNB.BNNNNB.",
            "..BNNNB...BNNNNB",
            "..BNNB.....BNNNB",
            ".BBBB.......BBBB",
            ".BBB.........BBB"
        ];

        const npc_tourist_idle = [
            "......YYYY......",
            "....YYYYYYYY....",
            "..YYYYYYYYYYYY..",
            ".YYYYYYYYYYYYYY.",
            ".BBBBBBBBBBBBBB.",
            "..BSSSSSSSSSSB..",
            "..BSBBSSSSBBSB..",
            "..BSBBSSSSBBSB..",
            "...BSSSSSSSSB...",
            "....BSSSSSSB....",
            "...BRYRYRYRYB...",
            "..BRYRYRYRYRYB..",
            ".BRRRYYYRRRYYYB.",
            ".BRRYYWWYYRRYYB.",
            "..BRYRYRYRYRYB..",
            "...BRYRYRYRYB...",
            "....BBBBBBBB....",
            "....BKKKKKKB....",
            "....BKKKBKKB....",
            "....BSSB.BSSB...",
            "....BSSB.BSSB...",
            "....BSSB.BSSB...",
            "...BWWWB.BWWWB..",
            "...BBBBB.BBBBB.."
        ];

        const npc_tourist_walk_0 = [
            "......YYYY......",
            "....YYYYYYYY....",
            "..YYYYYYYYYYYY..",
            ".YYYYYYYYYYYYYY.",
            ".BBBBBBBBBBBBBB.",
            "..BSSSSSSSSSSB..",
            "..BSBBSSSSBBSB..",
            "..BSBBSSSSBBSB..",
            "...BSSSSSSSSB...",
            "....BSSSSSSB....",
            "...BRYRYRYRYB...",
            "..BRYRYRYRYRYB..",
            ".BRRRYYYRRRYYYB.",
            ".BRRYYWWYYRRYYB.",
            "..BRYRYRYRYRYB..",
            "...BRYRYRYRYB...",
            "....BBBBBBBB....",
            "....BKKKKKKB....",
            "...BKKKKBKKKB...",
            "..BSSSB...BSSSB.",
            ".BSSSB.....BSSSB",
            "BSSSB.......BSSB",
            "BBBB.........BBB",
            "BBB...........BB"
        ];

        const npc_tourist_walk_1 = [
            "......YYYY......",
            "....YYYYYYYY....",
            "..YYYYYYYYYYYY..",
            ".YYYYYYYYYYYYYY.",
            ".BBBBBBBBBBBBBB.",
            "..BSSSSSSSSSSB..",
            "..BSBBSSSSBBSB..",
            "..BSBBSSSSBBSB..",
            "...BSSSSSSSSB...",
            "....BSSSSSSB....",
            "...BRYRYRYRYB...",
            "..BRYRYRYRYRYB..",
            ".BRRRYYYRRRYYYB.",
            ".BRRYYWWYYRRYYB.",
            "..BRYRYRYRYRYB..",
            "...BRYRYRYRYB...",
            "....BBBBBBBB....",
            "....BKKKKKKB....",
            "...BKKKBKKKKB...",
            "..BSSSB...BSSSB.",
            ".BSSSB.....BSSSB",
            ".BSSB.......BSSB",
            ".BBB.........BBB",
            "..BB.........BBB"
        ];

        const npc_lounge_chair = [
            "....WWWWWWWWWWWWWWWWWW....",
            "...WUWUWUWUWUWUWUWUWUWW...",
            "..WUWUWUWUWUWUWUWUWUWUWW..",
            ".WUWUWUWUWUWUWUWUWUWUWUWW.",
            ".WUWUWUWUWUWUWUWUWUWUWUWW.",
            "BBBBBBBBBBBBBBBBBBBBBBBBBB",
            "C........................C",
            "C........................C",
            "C...CCCCCCCCCCCCCCCCCC...C",
            "C...C................C...C",
            "C...C................C...C",
            "BB.BB................BB.BB"
        ];

        const npc_lounger_0 = [
            "....YYYYYY................",
            "...YYYYYYYY...............",
            "..YYYYYYYYYY..............",
            "..YSBBSBSSSY..............",
            "..YSBBSBSSSS..............",
            "..YSSSSSSSSS..............",
            "..YSSRRRRRSS..............",
            ".YYSRRRRRRRR....GG..YY....",
            ".YYSRRRRRRRR...GGGGYYYY...",
            "WUWUWUWUWUWUWW.RRRR.YY....",
            "WUWUWUWUWUWUWW..SS..SS....",
            "BBBBBBBBBBBBBBBBBBBBBBBBBB",
            "C...C................C...C",
            "BB.BB................BB.BB"
        ];

        const npc_lounger_1 = [
            "....YYYYYY................",
            "...YYYYYYYY...............",
            "..YYYYYYYYYY..............",
            "..YSBBSBSSSY...GG..YY.....",
            "..YSBBSBSSSS..GGGGYYYY....",
            "..YSSSSSSSSS..RRRR.YY.....",
            "..YSSRRRRRSS...SS..SS.....",
            ".YYSRRRRRRRR..............",
            ".YYSRRRRRRRR..............",
            "WUWUWUWUWUWUWW............",
            "WUWUWUWUWUWUWW............",
            "BBBBBBBBBBBBBBBBBBBBBBBBBB",
            "C...C................C...C",
            "BB.BB................BB.BB"
        ];

        const npc_swimmer_0 = [
            ".....BBBBBB.......",
            "...BBHHHHHHBB.....",
            "..BHHSSSSSSHHB....",
            "..BSCCCSSCCCSSB...",
            "..BSSSSSSSSSSSB...",
            "...BSSSSSSSSSB....",
            "....BYYYYYYYB.BOB.",
            "..BYYYYYYYYYYYBOOB",
            ".BYWWYYYYYYYYYBOOB",
            "BYWWWWYYYYYYYYBOB.",
            ".BYYYYYYYYYYYB....",
            "..BYYYYYYYYYB.....",
            "...BBBBBBBBB......",
            "..CC..CCCCC..CC...",
            ".CCCC.......CCCC..",
            ".................."
        ];

        const npc_swimmer_1 = [
            ".....BBBBBB.......",
            "...BBHHHHHHBB.....",
            "..BHHSSSSSSHHB....",
            "..BSWWSSSWWSSB....",
            "..BSSSSSSSSSSSB...",
            "...BSSSSSSSSSB....",
            "....BYYYYYYYB.BOB.",
            "..BYYYYYYYYYYYBOOB",
            ".BYWWYYYYYYYYYBOOB",
            "BYWWWWYYYYYYYYBOB.",
            ".BYYYYYYYYYYYB.W..",
            "..BYYYYYYYYYB.WW..",
            "...BBBBBBBBB......",
            ".CCCC.......CCCC..",
            "..CC..CCCCC..CC...",
            ".................."
        ];

        this.generatePixelTexture('npc_officer_idle', 32, 48, npc_officer_idle, NPC_OFFICER_PALETTE, 2);
        this.generatePixelTexture('npc_officer_walk_0', 32, 48, npc_officer_walk_0, NPC_OFFICER_PALETTE, 2);
        this.generatePixelTexture('npc_officer_walk_1', 32, 48, npc_officer_walk_1, NPC_OFFICER_PALETTE, 2);
        this.generatePixelTexture('npc_tourist_idle', 32, 48, npc_tourist_idle, NPC_TOURIST_PALETTE, 2);
        this.generatePixelTexture('npc_tourist_walk_0', 32, 48, npc_tourist_walk_0, NPC_TOURIST_PALETTE, 2);
        this.generatePixelTexture('npc_tourist_walk_1', 32, 48, npc_tourist_walk_1, NPC_TOURIST_PALETTE, 2);
        this.generatePixelTexture('npc_lounge_chair', 52, 24, npc_lounge_chair, NPC_LOUNGE_PALETTE, 2);
        this.generatePixelTexture('npc_lounger_0', 52, 28, npc_lounger_0, NPC_LOUNGE_PALETTE, 2);
        this.generatePixelTexture('npc_lounger_1', 52, 28, npc_lounger_1, NPC_LOUNGE_PALETTE, 2);
        this.generatePixelTexture('npc_swimmer_0', 36, 32, npc_swimmer_0, NPC_SWIMMER_PALETTE, 2);
        this.generatePixelTexture('npc_swimmer_1', 36, 32, npc_swimmer_1, NPC_SWIMMER_PALETTE, 2);

        let g = this.add.graphics();

        // 8-Bit Funnel Vision Jumbotron Scanlines & Glass Highlight (200x120)
        g.clear();
        g.fillStyle(0x000000, 0.18);
        for (let y = 0; y < 120; y += 3) {
            g.fillRect(0, y, 200, 1);
        }
        g.fillStyle(0xFFFFFF, 0.10);
        g.beginPath();
        g.moveTo(0, 0);
        g.lineTo(80, 0);
        g.lineTo(0, 80);
        g.closePath();
        g.fillPath();
        g.generateTexture('fv_scanlines', 200, 120);
        g.clear();

        // 2.5D Player Ground Shadow (24x8 ellipse)
        g.fillStyle(0x000000, 0.4);
        g.fillEllipse(12, 4, 24, 8);
        g.generateTexture('player_shadow', 24, 8);
        g.clear();
        
        // --- 8-BIT ENVIRONMENT TEXTURES ---
        // Deck (Cruise Ship 16x16 Teak Wood Tiles in 40x40 block)
        g.clear();
        g.fillStyle(0x000000, 1);
        g.fillRect(0, 0, 40, 40);
        for (let p = 0; p < 4; p++) {
            let py = p * 10;
            g.fillStyle(0xB86818, 1);
            g.fillRect(1, py + 1, 38, 8);
            g.fillStyle(0xF8A848, 1);
            g.fillRect(1, py + 1, 38, 2);
            g.fillStyle(0x582000, 1);
            g.fillRect(1, py + 7, 38, 2);
            let seamX = (p % 2 === 0) ? 20 : 10;
            g.fillStyle(0x000000, 1);
            g.fillRect(seamX, py + 1, 2, 8);
            g.fillStyle(0xF8D878, 1);
            g.fillRect(seamX - 3, py + 4, 2, 2);
            g.fillRect(seamX + 3, py + 4, 2, 2);
            if (p % 2 !== 0) {
                g.fillStyle(0x000000, 1);
                g.fillRect(30, py + 1, 2, 8);
                g.fillStyle(0xF8D878, 1);
                g.fillRect(27, py + 4, 2, 2);
                g.fillRect(33, py + 4, 2, 2);
            }
        }
        g.generateTexture('deck', 40, 40);
        g.clear();

        // 8-Bit Stair Step (40x20)
        g.fillStyle(0x000000, 1);
        g.fillRect(0, 0, 40, 20);
        g.fillStyle(0xB86818, 1);
        g.fillRect(1, 1, 38, 8);
        g.fillStyle(0xF8A848, 1);
        g.fillRect(1, 1, 38, 2);
        g.fillStyle(0xFFFFFF, 1);
        g.fillRect(1, 9, 38, 2);
        g.fillStyle(0x404850, 1);
        g.fillRect(1, 11, 38, 8);
        g.fillStyle(0x202830, 1);
        g.fillRect(1, 17, 38, 2);
        g.generateTexture('stair_step', 40, 20);
        g.clear();

        // Upgraded 8-Bit NES Pool Tile (40x40)
        g.fillStyle(0x000000, 1);
        g.fillRect(0, 0, 40, 40);
        g.fillStyle(0xE4E8EC, 1);
        g.fillRect(2, 2, 36, 6);
        g.fillStyle(0xFFFFFF, 1);
        g.fillRect(2, 2, 36, 2);
        g.fillStyle(0x8898A8, 1);
        g.fillRect(2, 6, 36, 2);
        g.fillStyle(0x003888, 1);
        g.fillRect(2, 8, 36, 30);
        g.fillStyle(0x00A8E8, 1);
        g.fillRect(4, 10, 32, 26);
        g.fillStyle(0xFFFFFF, 1);
        g.fillRect(6, 12, 12, 2);
        g.fillRect(22, 12, 10, 2);
        g.fillRect(10, 18, 8, 2);
        g.fillRect(24, 24, 8, 2);
        g.fillRect(8, 28, 14, 2);
        g.fillStyle(0x0068C8, 0.7);
        g.fillRect(4, 20, 32, 1);
        g.fillRect(4, 30, 32, 1);
        g.fillRect(20, 10, 1, 26);
        g.generateTexture('pool', 40, 40);
        g.clear();

        // 8-Bit Pool Front Edge & Coping (40x12)
        // Marble rim and translucent water surface overlay for 2.5D pool submersion
        g.fillStyle(0x00A8E8, 0.55);
        g.fillRect(0, 0, 40, 6);
        g.fillStyle(0xFFFFFF, 0.4);
        g.fillRect(6, 2, 14, 2);
        g.fillRect(24, 3, 10, 2);
        g.fillStyle(0x000000, 1);
        g.fillRect(0, 6, 40, 6);
        g.fillStyle(0xE4E8EC, 1);
        g.fillRect(1, 7, 38, 4);
        g.fillStyle(0xFFFFFF, 1);
        g.fillRect(1, 7, 38, 1);
        g.fillStyle(0x8898A8, 1);
        g.fillRect(1, 10, 38, 1);
        g.generateTexture('pool_front_edge', 40, 12);
        g.clear();

        // --- 3D ANGLED ISOMETRIC PERSPECTIVE ENVIRONMENT TEXTURES ---
        // 1. Deck 3D (Cruise Ship Teak Wood Promenade, 40x60 block)
        // Shaded depth gradient from recessed overhang down to sunlit railing
        g.clear();
        g.fillStyle(0x000000, 1);
        g.fillRect(0, 0, 40, 60);

        // Zone A: Back Walkway in Overhang Shade (y=0..18)
        for (let p = 0; p < 2; p++) {
            let py = p * 9;
            g.fillStyle(0x783810, 1);
            g.fillRect(1, py + 1, 38, 7);
            g.fillStyle(0x984818, 1);
            g.fillRect(1, py + 1, 38, 2);
            g.fillStyle(0x481800, 1);
            g.fillRect(1, py + 6, 38, 2);
            let seamX = (p % 2 === 0) ? 20 : 10;
            g.fillStyle(0x000000, 1);
            g.fillRect(seamX, py + 1, 2, 7);
        }

        // Zone B: Mid Promenade Deck (y=18..44)
        for (let p = 0; p < 3; p++) {
            let py = 18 + p * 9;
            g.fillStyle(0xB86818, 1);
            g.fillRect(1, py + 1, 38, 7);
            g.fillStyle(0xF8A848, 1);
            g.fillRect(1, py + 1, 38, 2);
            g.fillStyle(0x602000, 1);
            g.fillRect(1, py + 6, 38, 2);
            let seamX = (p % 2 === 0) ? 14 : 28;
            g.fillStyle(0x000000, 1);
            g.fillRect(seamX, py + 1, 2, 7);
            g.fillStyle(0xF8D878, 1);
            g.fillRect(seamX - 3, py + 3, 2, 2);
            g.fillRect(seamX + 3, py + 3, 2, 2);
        }

        // Zone C: Sun-Drenched Fore Deck near Railing (y=44..54)
        g.fillStyle(0xD88828, 1);
        g.fillRect(1, 45, 38, 8);
        g.fillStyle(0xF8C868, 1);
        g.fillRect(1, 45, 38, 2);
        g.fillStyle(0x783000, 1);
        g.fillRect(1, 51, 38, 2);

        // Zone D: Teak Margin Waterway Board & Brass Accent Lip (y=54..60)
        g.fillStyle(0x401400, 1);
        g.fillRect(0, 54, 40, 6);
        g.fillStyle(0x883808, 1);
        g.fillRect(0, 55, 40, 4);
        g.fillStyle(0xF8D878, 1); // Polished brass trim highlight
        g.fillRect(0, 55, 40, 1);
        g.fillStyle(0x200800, 1); // Shadow joint
        g.fillRect(0, 59, 40, 1);
        g.generateTexture('deck_3d', 40, 60);
        g.clear();

        // 2. Deck Slab Fascia / Apron (40x12) - Visible 3D Structural Thickness of the Deck
        g.clear();
        g.fillStyle(0x000000, 1);
        g.fillRect(0, 0, 40, 12);
        // Top margin lip
        g.fillStyle(0x501800, 1);
        g.fillRect(0, 0, 40, 2);
        // Structural Steel Beam
        g.fillStyle(0xE4E8EC, 1);
        g.fillRect(0, 2, 40, 7);
        g.fillStyle(0xFFFFFF, 1);
        g.fillRect(0, 2, 40, 1);
        g.fillStyle(0x8898A8, 1);
        g.fillRect(0, 8, 40, 1);
        // 8-bit Rivet Bolts every 10px
        for (let rx = 5; rx < 40; rx += 10) {
            g.fillStyle(0x000000, 1);
            g.fillRect(rx, 4, 3, 3);
            g.fillStyle(0xFFFFFF, 1);
            g.fillRect(rx, 4, 1, 1);
        }
        // Lower drop shadow under slab
        g.fillStyle(0x202830, 1);
        g.fillRect(0, 9, 40, 2);
        g.fillStyle(0x000000, 1);
        g.fillRect(0, 11, 40, 1);
        g.generateTexture('deck_fascia', 40, 12);
        g.clear();

        // 3. Overhang Ambient Occlusion Shadow (40x10)
        g.clear();
        g.fillStyle(0x000814, 0.65);
        g.fillRect(0, 0, 40, 2);
        g.fillStyle(0x000814, 0.45);
        g.fillRect(0, 2, 40, 3);
        g.fillStyle(0x000814, 0.25);
        g.fillRect(0, 5, 40, 3);
        g.fillStyle(0x000814, 0.10);
        g.fillRect(0, 8, 40, 2);
        g.generateTexture('deck_overhang_shadow', 40, 10);
        g.clear();

        // 4. 3D Sunken Swimming Pool Basin (40x60)
        g.clear();
        g.fillStyle(0x000000, 1);
        g.fillRect(0, 0, 40, 60);

        // Back vertical tiled wall (recessed into deck, y=0..14)
        g.fillStyle(0x002868, 1);
        g.fillRect(1, 1, 38, 13);
        g.fillStyle(0x001840, 1);
        g.fillRect(1, 1, 38, 3); // Deep shadow under deck edge
        for (let mx = 8; mx < 40; mx += 8) {
            g.fillStyle(0x001840, 1);
            g.fillRect(mx, 1, 1, 13);
        }
        g.fillStyle(0x58D8F8, 0.7);
        g.fillRect(1, 13, 38, 1);

        // Sunken Water Basin Volume (y=14..52)
        g.fillStyle(0x0050A0, 1);
        g.fillRect(1, 14, 38, 38);
        g.fillStyle(0x00A8E8, 1);
        g.fillRect(2, 16, 36, 34);
        g.fillStyle(0xFFFFFF, 0.85);
        g.fillRect(6, 18, 12, 2);
        g.fillRect(24, 20, 10, 2);
        g.fillRect(12, 28, 14, 2);
        g.fillRect(28, 34, 8, 2);
        g.fillRect(8, 40, 16, 2);
        g.fillStyle(0x0068C8, 0.7);
        g.fillRect(2, 24, 36, 1);
        g.fillRect(2, 36, 36, 1);
        g.fillRect(2, 46, 36, 1);

        // Front submerged interior step (y=52..60)
        g.fillStyle(0x004080, 1);
        g.fillRect(1, 52, 38, 7);
        g.fillStyle(0x002858, 1);
        g.fillRect(1, 58, 38, 1);
        g.generateTexture('pool_3d_basin', 40, 60);
        g.clear();

        // 5. 3D Pool Front Marble Coping & Water Overlay (40x14)
        g.clear();
        g.fillStyle(0x00A8E8, 0.55);
        g.fillRect(0, 0, 40, 6);
        g.fillStyle(0xFFFFFF, 0.5);
        g.fillRect(6, 2, 14, 2);
        g.fillRect(24, 3, 10, 2);

        g.fillStyle(0x000000, 1);
        g.fillRect(0, 6, 40, 8);
        g.fillStyle(0xFFFFFF, 1);
        g.fillRect(1, 7, 38, 2);
        g.fillStyle(0xE4E8EC, 1);
        g.fillRect(1, 9, 38, 3);
        g.fillStyle(0x8898A8, 1);
        g.fillRect(1, 11, 38, 2);
        g.fillStyle(0x404850, 1);
        g.fillRect(1, 13, 38, 1);
        g.generateTexture('pool_front_coping_3d', 40, 14);
        g.clear();

        // 6. Upgraded 3D Stair Step with Depth Tread & Riser (40x22)
        g.clear();
        g.fillStyle(0x000000, 1);
        g.fillRect(0, 0, 40, 22);

        // Horizontal Tread (stepped on by player, y=1..9)
        g.fillStyle(0xD88828, 1);
        g.fillRect(1, 1, 38, 8);
        g.fillStyle(0xF8A848, 1);
        g.fillRect(1, 1, 38, 2);
        // Bright Safety Yellow Non-Slip Traction Nose (y=7..9)
        g.fillStyle(0xFFD700, 1);
        g.fillRect(1, 7, 38, 2);

        // Vertical Steel Riser Face (y=9..20)
        g.fillStyle(0x182028, 1);
        g.fillRect(1, 9, 38, 2); // Shadow under nose
        g.fillStyle(0x485058, 1);
        g.fillRect(1, 11, 38, 8);
        g.fillStyle(0x687078, 1);
        g.fillRect(1, 12, 38, 1); // Steel highlight
        g.fillStyle(0x283038, 1);
        g.fillRect(1, 18, 38, 2); // Bottom shadow

        // Tread joint
        g.fillStyle(0x000000, 1);
        g.fillRect(1, 20, 38, 2);
        g.generateTexture('stair_step_3d', 40, 22);
        g.clear();

        // 8-Bit Retro Cruise Ship Railing (40x40)
        g.fillStyle(0x000000, 1);
        g.fillRect(0, 8, 40, 6);
        g.fillStyle(0xFFFFFF, 1);
        g.fillRect(0, 9, 40, 4);
        g.fillStyle(0xF8B800, 1);
        g.fillRect(0, 9, 40, 1);
        g.fillStyle(0x000000, 1);
        g.fillRect(0, 14, 4, 26);
        g.fillStyle(0xFFFFFF, 1);
        g.fillRect(1, 14, 2, 26);
        g.fillStyle(0x000000, 1);
        g.fillRect(36, 14, 4, 26);
        g.fillStyle(0xFFFFFF, 1);
        g.fillRect(37, 14, 2, 26);
        g.fillStyle(0x000000, 1);
        g.fillRect(4, 24, 32, 3);
        g.fillStyle(0xFFFFFF, 1);
        g.fillRect(4, 25, 32, 1);
        g.fillStyle(0x0058A8, 0.45);
        g.fillRect(4, 14, 32, 10);
        g.fillRect(4, 27, 32, 13);
        g.fillStyle(0xFFFFFF, 0.6);
        g.fillRect(8, 15, 2, 8);
        g.fillRect(12, 17, 2, 6);
        g.fillRect(24, 28, 2, 8);
        g.fillRect(28, 30, 2, 6);
        g.generateTexture('railing', 40, 40);
        g.clear();

        // 8-Bit Cabin/Lounge Door (40x60)
        g.fillStyle(0x000000, 1);
        g.fillRect(0, 0, 40, 60);
        g.fillStyle(0x203858, 1);
        g.fillRect(2, 2, 36, 56);
        g.fillStyle(0x002048, 1);
        g.fillRect(5, 5, 30, 50);
        g.fillStyle(0x000000, 1);
        g.fillRect(9, 9, 22, 18);
        g.fillStyle(0x58B8F8, 1);
        g.fillRect(11, 11, 18, 14);
        g.fillStyle(0xFFFFFF, 1);
        g.fillRect(12, 12, 4, 12);
        g.fillRect(18, 12, 2, 8);
        g.fillStyle(0xF8B800, 1);
        g.fillRect(7, 34, 4, 8);
        g.fillStyle(0xFFFFFF, 1);
        g.fillRect(7, 34, 2, 2);
        g.fillStyle(0x001430, 1);
        g.fillRect(9, 44, 22, 8);
        g.fillStyle(0x003068, 1);
        g.fillRect(10, 45, 20, 6);
        g.generateTexture('door', 40, 60);
        g.clear();

        // Midship Elevator Door (60x60)
        g.fillStyle(0x777777);
        g.fillRect(0, 0, 60, 60);
        g.fillStyle(0xaaaaaa);
        g.fillRect(28, 0, 4, 60); // door split
        // Up/Down arrows
        g.fillStyle(0xffff00);
        g.fillTriangle(20, 15, 30, 5, 40, 15);
        g.fillTriangle(20, 45, 30, 55, 40, 45);
        g.generateTexture('elevator_door', 60, 60);
        g.clear();

        // Tube Platform
        g.fillStyle(0x000000, 1);
        g.fillRect(0, 0, 80, 20);
        g.fillStyle(0xFFFFFF, 1);
        g.fillRect(2, 2, 76, 16);
        g.fillStyle(0x0058F8, 1);
        g.fillRect(4, 4, 72, 12);
        g.generateTexture('tube', 80, 20);
        g.clear();

        // 8-Bit AquaMouse Transparent Slide Tube (40x40)
        g.fillStyle(0x000000, 1);
        g.fillRect(0, 0, 40, 2); // Top border
        g.fillRect(0, 38, 40, 2); // Bottom border
        g.fillRect(0, 0, 2, 40); // Left border
        g.fillRect(38, 0, 2, 40); // Right border
        g.fillStyle(0x58B8F8, 0.5); // More transparent
        g.fillRect(2, 2, 36, 36);
        g.fillStyle(0xFFFFFF, 0.75);
        g.fillRect(4, 4, 32, 2);
        g.fillRect(4, 34, 32, 2);
        g.fillStyle(0xE83818, 1);
        for (let i = 0; i < 40; i += 4) {
            g.fillRect(i, 40 - i - 3, 4, 3);
        }
        g.fillStyle(0xF8B800, 1);
        for (let i = 0; i < 40; i += 4) {
            g.fillRect(i, i, 4, 3);
        }
        g.generateTexture('slide_tube', 40, 40);
        g.clear();

        g.fillStyle(0xffffff, 0.5);
        g.fillRoundedRect(0, 0, 80, 80, 10);
        g.generateTexture('btn', 80, 80);
        g.clear();

        // 8-Bit "Eye Scream Treats" Stand (60x60)
        g.fillStyle(0x000000, 1);
        g.fillRect(0, 0, 60, 60);
        for (let a = 0; a < 6; a++) {
            g.fillStyle((a % 2 === 0) ? 0xF85898 : 0xFFFFFF, 1);
            g.fillRect(2 + a * 9, 2, 9, 18);
        }
        g.fillStyle(0x000000, 1);
        g.fillRect(0, 20, 60, 3);
        g.fillStyle(0xF0F0F0, 1);
        g.fillRect(4, 23, 52, 34);
        g.fillStyle(0x000000, 1);
        g.fillRect(10, 25, 40, 18);
        g.fillStyle(0x002848, 1);
        g.fillRect(12, 27, 36, 14);
        g.fillStyle(0xE0E0E0, 1);
        g.fillRect(16, 29, 12, 10);
        g.fillStyle(0xF8B800, 1);
        g.fillRect(20, 36, 4, 3);
        g.fillStyle(0xB87828, 1);
        g.fillRect(4, 43, 52, 4);
        g.fillStyle(0xF85898, 1);
        g.fillRect(8, 50, 44, 7);
        g.fillStyle(0xFFFFFF, 1);
        g.fillRect(10, 52, 40, 3);
        g.generateTexture('icecream_stand', 60, 60);
        g.clear();

        // 8-Bit Ice Cream Cones (30x30)
        const flavors = [
            { key: 'strawberry', color: 0xFF69B4 },
            { key: 'chocolate', color: 0x8B4513 },
            { key: 'vanilla', color: 0xFFFDD0 },
            { key: 'mint', color: 0x98FF98 }
        ];
        for (let flavor of flavors) {
            g.fillStyle(0x000000, 1);
            g.fillRect(8, 2, 14, 14);
            g.fillRect(10, 16, 10, 12);
            g.fillStyle(flavor.color, 1);
            g.fillRect(9, 3, 12, 12);
            g.fillStyle(0xFFFFFF, 1);
            g.fillRect(10, 4, 3, 3);
            g.fillStyle(0xD2B48C, 1);
            g.fillRect(11, 16, 8, 10);
            g.fillStyle(0xA07040, 1);
            g.fillRect(12, 19, 6, 2);
            g.fillRect(13, 23, 4, 2);
            g.generateTexture('icecream_' + flavor.key, 30, 30);
            g.clear();
        }

        // 8-Bit AquaMouse Raft (40x20)
        g.fillStyle(0x000000, 1);
        g.fillRect(0, 0, 40, 20);
        g.fillStyle(0xF8E800, 1);
        g.fillRect(2, 2, 36, 16);
        g.fillStyle(0xFFFFFF, 1);
        g.fillRect(4, 3, 32, 2);
        g.fillStyle(0xB89800, 1);
        g.fillRect(2, 15, 36, 3);
        g.fillStyle(0x000000, 1);
        g.fillRect(8, 6, 24, 8);
        g.fillStyle(0x303840, 1);
        g.fillRect(9, 7, 22, 6);
        g.fillStyle(0xD82000, 1);
        g.fillRect(3, 8, 3, 4);
        g.fillRect(34, 8, 3, 4);
        g.generateTexture('raft', 40, 20);
        g.clear();

        // 8-Bit Retro Sun (80x80)
        g.fillStyle(0x000000, 1);
        g.fillCircle(40, 40, 34);
        g.fillStyle(0xF8A800, 1);
        g.fillCircle(40, 40, 32);
        g.fillStyle(0xFCE838, 1);
        g.fillCircle(40, 40, 28);
        g.fillStyle(0xFFFFFF, 1);
        g.fillCircle(32, 32, 6);
        for (let a = 0; a < 8; a++) {
            let rad = (a * Math.PI) / 4;
            let rx = 40 + Math.cos(rad) * 36;
            let ry = 40 + Math.sin(rad) * 36;
            g.fillStyle(0xF8A800, 1);
            g.fillRect(rx - 3, ry - 3, 6, 6);
            g.fillStyle(0xFCE838, 1);
            g.fillRect(rx - 2, ry - 2, 4, 4);
        }
        g.generateTexture('sun', 80, 80);
        g.clear();

        // 8-Bit Stepped Cloud (110x60)
        g.fillStyle(0x000000, 1);
        g.fillCircle(30, 32, 26);
        g.fillCircle(58, 24, 22);
        g.fillCircle(82, 32, 26);
        g.fillRect(15, 34, 80, 24);
        g.fillStyle(0xE0E8F0, 1);
        g.fillCircle(30, 32, 24);
        g.fillCircle(58, 24, 20);
        g.fillCircle(82, 32, 24);
        g.fillRect(16, 35, 78, 20);
        g.fillStyle(0xFFFFFF, 1);
        g.fillCircle(28, 28, 20);
        g.fillCircle(56, 20, 17);
        g.fillCircle(80, 28, 20);
        g.fillRect(18, 30, 72, 16);
        g.generateTexture('cloud', 110, 60);
        g.clear();

        // 8-Bit Flying Seagull (20x20)
        g.fillStyle(0x000000, 1);
        g.fillRect(2, 6, 6, 3);
        g.fillRect(6, 9, 8, 3);
        g.fillRect(12, 6, 6, 3);
        g.fillStyle(0xFFFFFF, 1);
        g.fillRect(3, 7, 4, 1);
        g.fillRect(7, 10, 6, 1);
        g.fillRect(13, 7, 4, 1);
        g.fillStyle(0xF8A800, 1);
        g.fillRect(9, 12, 2, 2);
        g.generateTexture('bird', 20, 20);
        g.clear();

        // 8-Bit Ship Wall (480x120) with Capcom NES Portholes & Racing Stripe
        g.fillStyle(0xE8ECF0, 1);
        g.fillRect(0, 0, 480, 120);
        g.fillStyle(0x000000, 1);
        g.fillRect(0, 0, 480, 4);
        g.fillStyle(0xB0B8C0, 1);
        for (let r = 8; r < 480; r += 24) {
            g.fillStyle(0x000000, 1);
            g.fillRect(r, 6, 4, 4);
            g.fillStyle(0xFFFFFF, 1);
            g.fillRect(r + 1, 6, 2, 2);
        }
        g.fillStyle(0xD0D8E0, 1);
        for (let x = 120; x < 480; x += 120) {
            g.fillRect(x, 4, 2, 102);
        }
        g.fillStyle(0x000000, 1);
        g.fillRect(0, 104, 480, 14);
        g.fillStyle(0xC81018, 1);
        g.fillRect(0, 106, 480, 8);
        g.fillStyle(0xF8B800, 1);
        g.fillRect(0, 114, 480, 2);
        [200, 280].forEach(px => {
            g.fillStyle(0x000000, 1);
            g.fillCircle(px, 55, 22);
            g.fillStyle(0xB8C0C8, 1);
            g.fillCircle(px, 55, 20);
            g.fillStyle(0x606870, 1);
            g.fillCircle(px, 55, 17);
            g.fillStyle(0x000000, 1);
            g.fillCircle(px, 55, 15);
            g.fillStyle(0x3888D8, 1);
            g.fillCircle(px, 55, 13);
            g.fillStyle(0x88D0F8, 1);
            g.fillRect(px - 9, 46, 6, 12);
            g.fillStyle(0xFFFFFF, 1);
            g.fillRect(px - 7, 48, 2, 8);
        });
        g.generateTexture('ship_wall', 480, 120);
        g.clear();

        // 8-Bit Retro Ocean Background (800x300)
        const oceanBands = [
            { y: 0, h: 40, color: 0x0068A8 },
            { y: 40, h: 60, color: 0x005088 },
            { y: 100, h: 80, color: 0x003868 },
            { y: 180, h: 120, color: 0x002048 }
        ];
        oceanBands.forEach(b => {
            g.fillStyle(b.color, 1);
            g.fillRect(0, b.y, 800, b.h);
        });
        for (let y = 10; y < 280; y += 18) {
            let offset = (y % 36 === 0) ? 0 : 25;
            for (let x = offset; x < 800; x += 50) {
                g.fillStyle(0xFFFFFF, 0.9);
                g.fillRect(x + 4, y, 10, 2);
                g.fillStyle(0x58B8F8, 1);
                g.fillRect(x, y + 2, 18, 2);
            }
        }
        g.generateTexture('ocean_bg', 800, 300);
        g.clear();

        // 8-Bit Capcom HP Hit-Point Node Full (14x14)
        g.fillStyle(0x000000, 1);
        g.fillRect(0, 0, 14, 14);
        g.fillStyle(0x182848, 1);
        g.fillRect(1, 1, 12, 12);
        g.fillStyle(0x00F8A0, 1);
        g.fillRect(2, 2, 10, 10);
        g.fillStyle(0x00C870, 1);
        g.fillRect(2, 7, 10, 5);
        g.fillStyle(0xFFFFFF, 1);
        g.fillRect(3, 3, 3, 3);
        g.generateTexture('hp_node_full', 14, 14);
        g.clear();

        // 8-Bit Capcom HP Hit-Point Node Empty (14x14)
        g.fillStyle(0x000000, 1);
        g.fillRect(0, 0, 14, 14);
        g.fillStyle(0x404850, 1);
        g.fillRect(1, 1, 12, 12);
        g.fillStyle(0x101418, 1);
        g.fillRect(2, 2, 10, 10);
        g.generateTexture('hp_node_empty', 14, 14);
        g.clear();

        // 8-Bit Gold Coin Icon (14x14)
        g.fillStyle(0x000000, 1);
        g.fillRect(2, 0, 10, 14);
        g.fillRect(0, 2, 14, 10);
        g.fillStyle(0xF8D800, 1);
        g.fillRect(2, 1, 10, 12);
        g.fillRect(1, 2, 12, 10);
        g.fillStyle(0xFFFFFF, 1);
        g.fillRect(3, 3, 3, 3);
        g.fillStyle(0xB89800, 1);
        g.fillRect(4, 5, 6, 4);
        g.generateTexture('coin_icon', 14, 14);
        g.clear();

        // 8-Bit Disney Destiny Profile (330x115)
        // 1. Radar mast & beacon
        g.fillStyle(0x000000, 1);
        g.fillRect(250, 12, 3, 22);
        g.fillRect(246, 16, 11, 2);
        g.fillRect(248, 22, 7, 2);
        g.fillStyle(0xF8B800, 1);
        g.fillRect(250, 10, 3, 3);

        // 2. Twin Disney Funnels
        // Aft Funnel (x: 110, y: 16)
        g.fillStyle(0x000000, 1);
        g.fillRect(109, 15, 28, 24);
        g.fillStyle(0xC81018, 1);
        g.fillRect(111, 19, 24, 18);
        g.fillStyle(0xF83838, 1);
        g.fillRect(113, 20, 4, 16);
        g.fillStyle(0x000000, 1);
        g.fillRect(110, 15, 26, 5);
        g.fillStyle(0x404040, 1);
        g.fillRect(112, 16, 22, 2);
        g.fillStyle(0xF8B800, 1);
        g.fillRect(111, 28, 24, 2);
        g.fillStyle(0xFFFFFF, 1);
        g.fillRect(122, 23, 4, 4);
        g.fillRect(120, 21, 2, 2);
        g.fillRect(125, 21, 2, 2);

        // Forward Funnel (x: 180, y: 16)
        g.fillStyle(0x000000, 1);
        g.fillRect(179, 15, 28, 24);
        g.fillStyle(0xC81018, 1);
        g.fillRect(181, 19, 24, 18);
        g.fillStyle(0xF83838, 1);
        g.fillRect(183, 20, 4, 16);
        g.fillStyle(0x000000, 1);
        g.fillRect(180, 15, 26, 5);
        g.fillStyle(0x404040, 1);
        g.fillRect(182, 16, 22, 2);
        g.fillStyle(0xF8B800, 1);
        g.fillRect(181, 28, 24, 2);
        g.fillStyle(0xFFFFFF, 1);
        g.fillRect(192, 23, 4, 4);
        g.fillRect(190, 21, 2, 2);
        g.fillRect(195, 21, 2, 2);

        // AquaMouse Water Slide Tube
        g.fillStyle(0x000000, 1);
        g.fillRect(137, 24, 43, 6);
        g.fillStyle(0x00E8D8, 1);
        g.fillRect(138, 25, 41, 4);
        g.fillStyle(0xFFFFFF, 1);
        g.fillRect(140, 26, 37, 1);

        // 3. Superstructure Decks
        // Deck 3
        g.fillStyle(0x000000, 1);
        g.fillRect(79, 36, 185, 14);
        g.fillStyle(0xFFFFFF, 1);
        g.fillRect(81, 38, 181, 10);
        for (let x = 86; x < 255; x += 10) {
            g.fillStyle(0x004888, 1);
            g.fillRect(x, 40, 5, 4);
            g.fillStyle(0x80D0F8, 1);
            g.fillRect(x + 1, 41, 2, 2);
        }

        // Deck 2 (Bridge & Cabins)
        g.fillStyle(0x000000, 1);
        g.fillRect(59, 48, 225, 14);
        g.fillStyle(0xFFFFFF, 1);
        g.fillRect(61, 50, 221, 10);
        g.fillStyle(0x003060, 1);
        g.fillRect(260, 51, 18, 6);
        g.fillStyle(0x50B0F8, 1);
        g.fillRect(262, 52, 14, 3);
        for (let x = 66; x < 255; x += 9) {
            g.fillStyle(0x004888, 1);
            g.fillRect(x, 52, 5, 5);
            g.fillStyle(0x80D0F8, 1);
            g.fillRect(x + 1, 53, 2, 2);
        }

        // Deck 1 (Promenade & Yellow Lifeboats)
        g.fillStyle(0x000000, 1);
        g.fillRect(39, 60, 260, 15);
        g.fillStyle(0xE0E8F0, 1);
        g.fillRect(41, 62, 256, 11);
        for (let bx = 65; bx < 250; bx += 16) {
            g.fillStyle(0x000000, 1);
            g.fillRect(bx, 64, 13, 6);
            g.fillStyle(0xF8B800, 1);
            g.fillRect(bx + 1, 65, 11, 4);
            g.fillStyle(0xFFE880, 1);
            g.fillRect(bx + 2, 65, 7, 1);
        }

        // 4. Main Hull
        g.fillStyle(0x000000, 1);
        g.beginPath();
        g.moveTo(25, 73);
        g.lineTo(305, 73);
        g.lineTo(315, 85);
        g.lineTo(310, 102);
        g.lineTo(290, 105);
        g.lineTo(40, 105);
        g.lineTo(25, 95);
        g.closePath();
        g.fillPath();

        g.fillStyle(0x001838, 1);
        g.beginPath();
        g.moveTo(27, 75);
        g.lineTo(303, 75);
        g.lineTo(312, 85);
        g.lineTo(308, 101);
        g.lineTo(288, 103);
        g.lineTo(42, 103);
        g.lineTo(27, 93);
        g.closePath();
        g.fillPath();

        g.fillStyle(0xF8B800, 1);
        g.fillRect(27, 75, 278, 2);

        g.fillStyle(0xC81018, 1);
        g.fillRect(40, 97, 268, 6);
        g.fillStyle(0xF83838, 1);
        g.fillRect(45, 97, 260, 2);

        for (let row = 0; row < 2; row++) {
            let py = 81 + row * 8;
            for (let px = 45; px < 290; px += 12) {
                g.fillStyle(0x000000, 1);
                g.fillRect(px, py, 4, 4);
                g.fillStyle(0x3888D8, 1);
                g.fillRect(px + 1, py + 1, 2, 2);
                g.fillStyle(0xFFFFFF, 1);
                g.fillRect(px + 1, py + 1, 1, 1);
            }
        }

        // Bow Filigree & Foam Wake
        g.fillStyle(0xF8B800, 1);
        g.fillRect(302, 77, 6, 2);
        g.fillRect(304, 79, 4, 2);
        g.fillRect(306, 81, 3, 2);

        g.fillStyle(0xFFFFFF, 1);
        g.fillRect(308, 100, 10, 3);
        g.fillRect(312, 102, 8, 2);
        g.fillRect(20, 100, 12, 3);
        g.fillRect(15, 102, 10, 2);
        g.fillStyle(0x58B8F8, 1);
        g.fillRect(306, 103, 14, 2);
        g.fillRect(18, 103, 16, 2);

        g.generateTexture('title_ship', 330, 115);
        g.clear();

        generateEdgeAndArcadeTextures(this);

        g.destroy();
    }
    create() {
        this.scene.start('TitleScene');
    }
}

// =========================================================================
// EDGE TWEEN CLUB & ARCADE 8-BIT TEXTURE GENERATOR
// =========================================================================

function generateEdgeAndArcadeTextures(scene) {
    let g = scene.add.graphics();

    // 1. Edge Interior Wall (60x60)
    g.fillStyle(0x0a0e28, 1);
    g.fillRect(0, 0, 60, 60);
    g.fillStyle(0x060818, 1);
    g.fillRect(0, 0, 2, 60);
    g.fillRect(58, 0, 2, 60);
    g.fillStyle(0x004466, 0.4);
    g.fillRect(0, 18, 60, 8);
    g.fillStyle(0x0088aa, 0.7);
    g.fillRect(0, 20, 60, 4);
    g.fillStyle(0x00e5ff, 1);
    g.fillRect(0, 21, 60, 2);
    g.fillStyle(0x1a2244, 1);
    g.fillRect(6, 6, 2, 2);
    g.fillRect(52, 6, 2, 2);
    g.fillRect(6, 52, 2, 2);
    g.fillRect(52, 52, 2, 2);
    g.generateTexture('edge_wall', 60, 60);
    g.clear();

    // 2. Edge Carpet / Floor Tile (40x40)
    g.fillStyle(0x111322, 1);
    g.fillRect(0, 0, 40, 40);
    g.fillStyle(0x1c1a38, 1);
    g.fillRect(4, 4, 32, 32);
    g.fillStyle(0x311b58, 1);
    g.fillTriangle(20, 8, 8, 20, 32, 20);
    g.fillTriangle(20, 32, 8, 20, 32, 20);
    g.fillStyle(0x00e5ff, 1);
    g.fillRect(19, 7, 2, 2);
    g.fillRect(7, 19, 2, 2);
    g.fillRect(31, 19, 2, 2);
    g.fillRect(19, 31, 2, 2);
    g.fillStyle(0x070810, 1);
    g.strokeRect(0, 0, 40, 40);
    g.generateTexture('edge_floor', 40, 40);
    g.clear();

    // 3. Edge Modern Curved Lounge Couch (76x38)
    g.fillStyle(0x050714, 0.8);
    g.fillRect(4, 30, 68, 8);
    g.fillStyle(0x1a1630, 1);
    g.fillRect(4, 14, 68, 18);
    g.fillStyle(0x281e50, 1);
    g.fillRect(6, 4, 64, 14);
    g.fillStyle(0x0099b8, 1);
    g.fillRect(8, 16, 30, 14);
    g.fillStyle(0x00b4d8, 1);
    g.fillRect(10, 18, 26, 10);
    g.fillStyle(0x9d0208, 1);
    g.fillRect(38, 16, 30, 14);
    g.fillStyle(0xd90429, 1);
    g.fillRect(40, 18, 26, 10);
    g.fillStyle(0xffd166, 1);
    g.fillRect(12, 10, 8, 8);
    g.fillStyle(0x06d6a0, 1);
    g.fillRect(56, 10, 8, 8);
    g.generateTexture('edge_couch', 76, 38);
    g.clear();

    // 4. Edge Chill Smoothie Bar (84x52)
    g.fillStyle(0x050714, 0.8);
    g.fillRect(4, 44, 76, 8);
    g.fillStyle(0x15162b, 1);
    g.fillRect(4, 12, 76, 34);
    for (let i = 0; i < 5; i++) {
        const col = (i % 2 === 0) ? 0x00e5ff : 0xff2a85;
        g.fillStyle(col, 1);
        g.fillRect(14 + i * 14, 16, 4, 26);
    }
    g.fillStyle(0x05050c, 1);
    g.fillRect(2, 6, 80, 8);
    g.fillStyle(0x00e5ff, 1);
    g.fillRect(2, 12, 80, 2);
    g.fillStyle(0x06d6a0, 0.9);
    g.fillRect(14, 0, 4, 8);
    g.fillStyle(0xff2a85, 0.9);
    g.fillRect(22, 1, 4, 7);
    g.fillStyle(0xffd166, 0.9);
    g.fillRect(30, 0, 4, 8);
    g.generateTexture('edge_bar', 84, 52);
    g.clear();

    // 5. Edge Retro Upright Arcade Cabinet (52x80)
    g.fillStyle(0x050714, 0.8);
    g.fillRect(4, 72, 44, 8);
    g.fillStyle(0x080816, 1);
    g.fillRect(4, 4, 44, 70);
    g.fillStyle(0x1c1038, 1);
    g.fillRect(6, 38, 40, 34);
    g.fillStyle(0xff2a85, 1);
    g.fillTriangle(26, 42, 12, 68, 40, 68);
    g.fillStyle(0x00e5ff, 1);
    g.fillTriangle(26, 46, 16, 66, 36, 66);
    g.fillStyle(0x111118, 1);
    g.fillRect(16, 54, 20, 16);
    g.fillStyle(0x333340, 1);
    g.strokeRect(16, 54, 20, 16);
    g.fillStyle(0xff9900, 1);
    g.fillRect(20, 58, 3, 5);
    g.fillRect(29, 58, 3, 5);
    g.fillStyle(0x222233, 1);
    g.fillRect(6, 32, 40, 8);
    g.fillStyle(0xff2244, 1);
    g.fillCircle(16, 34, 3);
    g.fillStyle(0x888888, 1);
    g.fillRect(15, 36, 2, 4);
    g.fillStyle(0xffd700, 1);
    g.fillCircle(28, 36, 2);
    g.fillStyle(0x00e5ff, 1);
    g.fillCircle(36, 36, 2);
    g.fillStyle(0x021108, 1);
    g.fillRect(8, 14, 36, 18);
    g.fillStyle(0x00e5ff, 1);
    g.fillRect(24, 25, 4, 4);
    g.fillRect(22, 27, 8, 2);
    g.fillStyle(0xff4444, 1);
    g.fillRect(14, 16, 4, 3);
    g.fillRect(34, 16, 4, 3);
    g.fillStyle(0xffffff, 0.25);
    g.fillRect(9, 15, 34, 2);
    g.fillStyle(0x000000, 1);
    g.fillRect(6, 2, 40, 12);
    g.fillStyle(0xffd700, 1);
    g.strokeRect(6, 2, 40, 12);
    g.fillStyle(0x00e5ff, 1);
    g.fillRect(8, 4, 36, 8);
    g.generateTexture('edge_arcade_cabinet', 52, 80);
    g.clear();

    // 6. Wall-Mounted CRT Leaderboard (88x64)
    g.fillStyle(0x000000, 1);
    g.fillRect(0, 0, 88, 64);
    g.fillStyle(0xffd700, 1);
    g.strokeRect(1, 1, 86, 62);
    g.fillStyle(0xb8860b, 1);
    g.strokeRect(3, 3, 82, 58);
    g.fillStyle(0x021408, 1);
    g.fillRect(5, 5, 78, 54);
    g.fillStyle(0x003311, 1);
    g.fillRect(7, 7, 74, 10);
    g.generateTexture('edge_leaderboard', 88, 64);
    g.clear();

    // 7. Tropical Smoothie (20x24)
    g.fillStyle(0xffffff, 0.4);
    g.fillRect(4, 6, 12, 14);
    g.fillStyle(0x00e5ff, 0.9);
    g.fillRect(5, 15, 10, 4);
    g.fillStyle(0xffd700, 0.9);
    g.fillRect(5, 11, 10, 4);
    g.fillStyle(0xff2a85, 0.9);
    g.fillRect(5, 7, 10, 4);
    g.fillStyle(0xffffff, 1);
    g.fillRect(4, 4, 12, 3);
    g.fillRect(6, 2, 8, 3);
    g.fillStyle(0xff5555, 1);
    g.fillRect(11, 0, 2, 6);
    g.fillStyle(0x00ff88, 1);
    g.fillTriangle(6, 1, 14, 1, 10, 0);
    g.generateTexture('edge_smoothie', 20, 24);
    g.clear();

    // 8. Illuminated Neon Sign (160x44)
    g.fillStyle(0x0a0c20, 0.95);
    g.fillRect(0, 0, 160, 44);
    g.fillStyle(0x00e5ff, 1);
    g.strokeRect(2, 2, 156, 40);
    g.fillStyle(0xff2a85, 1);
    g.strokeRect(4, 4, 152, 36);
    g.fillStyle(0xffd700, 1);
    g.fillRect(12, 18, 6, 6);
    g.fillRect(142, 18, 6, 6);
    g.generateTexture('edge_neon_logo', 160, 44);
    g.clear();

    // 9. Edge Midship Elevator Door (60x60)
    g.fillStyle(0x1a1e38, 1);
    g.fillRect(0, 0, 60, 60);
    g.fillStyle(0x00e5ff, 1);
    g.strokeRect(1, 1, 58, 58);
    g.fillStyle(0x2a3058, 1);
    g.fillRect(4, 4, 25, 52);
    g.fillRect(31, 4, 25, 52);
    g.fillStyle(0x00e5ff, 1);
    g.fillRect(29, 4, 2, 52);
    g.fillStyle(0x000000, 1);
    g.fillRect(22, 6, 16, 12);
    g.fillStyle(0xffd700, 1);
    g.strokeRect(22, 6, 16, 12);
    g.fillStyle(0x00ff66, 1);
    g.fillRect(28, 9, 4, 6);
    g.generateTexture('edge_elevator_door', 60, 60);
    g.clear();

    // 10. NPC Leo (32x48) - Chill tween boy lounging with hoodie & headphones
    g.fillStyle(0x000000, 1);
    g.fillRect(6, 4, 20, 40);
    g.fillStyle(0x4a2c14, 1);
    g.fillRect(10, 6, 12, 8);
    g.fillStyle(0xfcd8a8, 1);
    g.fillRect(11, 10, 10, 8);
    g.fillStyle(0x000000, 1);
    g.fillRect(13, 12, 2, 2);
    g.fillRect(17, 12, 2, 2);
    g.fillStyle(0xff6600, 1);
    g.fillRect(8, 8, 3, 10);
    g.fillRect(21, 8, 3, 10);
    g.fillRect(9, 6, 14, 3);
    g.fillStyle(0x00b4d8, 1);
    g.fillRect(8, 18, 16, 16);
    g.fillStyle(0x007799, 1);
    g.fillRect(10, 22, 12, 10);
    g.fillStyle(0x555566, 1);
    g.fillRect(10, 34, 12, 6);
    g.fillStyle(0xfcd8a8, 1);
    g.fillRect(11, 40, 3, 4);
    g.fillRect(18, 40, 3, 4);
    g.fillStyle(0xffffff, 1);
    g.fillRect(10, 43, 5, 3);
    g.fillRect(17, 43, 5, 3);
    g.fillStyle(0x00e5ff, 1);
    g.fillRect(11, 43, 3, 2);
    g.fillRect(18, 43, 3, 2);
    g.generateTexture('edge_npc_leo', 32, 48);
    g.clear();

    // 11. NPC Maya (32x48) - Cheering tween girl in graphic tee & ponytail
    g.fillStyle(0x000000, 1);
    g.fillRect(6, 4, 20, 40);
    g.fillStyle(0x7b1fa2, 1);
    g.fillRect(10, 6, 12, 8);
    g.fillRect(20, 4, 6, 10);
    g.fillStyle(0xff2a85, 1);
    g.fillRect(19, 6, 2, 3);
    g.fillStyle(0xfcd8a8, 1);
    g.fillRect(11, 10, 10, 8);
    g.fillStyle(0x000000, 1);
    g.fillRect(13, 12, 2, 2);
    g.fillRect(17, 12, 2, 2);
    g.fillStyle(0x111122, 1);
    g.fillRect(8, 18, 16, 14);
    g.fillStyle(0xffd700, 1);
    g.fillRect(15, 23, 2, 2);
    g.fillRect(14, 24, 4, 1);
    g.fillStyle(0x1976d2, 1);
    g.fillRect(10, 32, 12, 6);
    g.fillStyle(0xfcd8a8, 1);
    g.fillRect(11, 38, 3, 5);
    g.fillRect(18, 38, 3, 5);
    g.fillStyle(0xff2a85, 1);
    g.fillRect(10, 43, 5, 3);
    g.fillRect(17, 43, 5, 3);
    g.generateTexture('edge_npc_maya', 32, 48);
    g.clear();

    // 12. Starfighter Player Ship (32x32)
    g.fillStyle(0x000000, 1);
    g.fillTriangle(16, 2, 4, 28, 28, 28);
    g.fillStyle(0xffffff, 1);
    g.fillTriangle(16, 4, 6, 26, 26, 26);
    g.fillStyle(0x0058f8, 1);
    g.fillRect(14, 10, 4, 16);
    g.fillStyle(0x00e5ff, 1);
    g.fillRect(15, 8, 2, 6);
    g.fillStyle(0xff2244, 1);
    g.fillRect(5, 22, 4, 4);
    g.fillRect(23, 22, 4, 4);
    g.fillStyle(0x333333, 1);
    g.fillRect(10, 26, 4, 4);
    g.fillRect(18, 26, 4, 4);
    g.generateTexture('shooter_player', 32, 32);
    g.clear();

    // 13. Player Thruster Flame (14x12)
    g.fillStyle(0xffd700, 1);
    g.fillTriangle(7, 12, 1, 0, 13, 0);
    g.fillStyle(0x00e5ff, 1);
    g.fillTriangle(7, 8, 3, 0, 11, 0);
    g.fillStyle(0xffffff, 1);
    g.fillTriangle(7, 4, 5, 0, 9, 0);
    g.generateTexture('shooter_player_thruster', 14, 12);
    g.clear();

    // 14. Player Dual Laser Bolt (6x16)
    g.fillStyle(0x0055ff, 0.6);
    g.fillRect(0, 0, 6, 16);
    g.fillStyle(0x00e5ff, 1);
    g.fillRect(1, 1, 4, 14);
    g.fillStyle(0xffffff, 1);
    g.fillRect(2, 2, 2, 12);
    g.generateTexture('shooter_laser_player', 6, 16);
    g.clear();

    // 15. Player Spread Laser Blast (8x8)
    g.fillStyle(0x0055ff, 0.6);
    g.fillCircle(4, 4, 4);
    g.fillStyle(0x00e5ff, 1);
    g.fillCircle(4, 4, 3);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(4, 4, 1.5);
    g.generateTexture('shooter_laser_spread', 8, 8);
    g.clear();

    // 16. Alien Insectoid Drone (24x20)
    g.fillStyle(0x000000, 1);
    g.fillRect(4, 2, 16, 14);
    g.fillStyle(0xff2244, 1);
    g.fillRect(6, 4, 12, 10);
    g.fillStyle(0xff8800, 1);
    g.fillRect(2, 6, 4, 8);
    g.fillRect(18, 6, 4, 8);
    g.fillStyle(0xffff00, 1);
    g.fillRect(8, 6, 2, 3);
    g.fillRect(14, 6, 2, 3);
    g.fillStyle(0xff0044, 1);
    g.fillRect(11, 14, 2, 4);
    g.generateTexture('shooter_drone', 24, 20);
    g.clear();

    // 17. Armored Cosmic Cruiser (36x28)
    g.fillStyle(0x000000, 1);
    g.fillRect(4, 4, 28, 18);
    g.fillStyle(0x4a0e4e, 1);
    g.fillRect(6, 6, 24, 14);
    g.fillStyle(0x7b1fa2, 1);
    g.fillRect(8, 8, 20, 10);
    g.fillStyle(0x00e5ff, 1);
    g.fillRect(2, 10, 4, 12);
    g.fillRect(30, 10, 4, 12);
    g.fillStyle(0xff3d00, 1);
    g.fillRect(12, 20, 3, 5);
    g.fillRect(21, 20, 3, 5);
    g.generateTexture('shooter_cruiser', 36, 28);
    g.clear();

    // 18. Asteroids (Large 28x28 & Small 14x14)
    g.fillStyle(0x444455, 1);
    g.fillRect(4, 2, 20, 24);
    g.fillRect(2, 4, 24, 20);
    g.fillStyle(0x666677, 1);
    g.fillRect(6, 4, 16, 18);
    g.fillStyle(0x222233, 1);
    g.fillCircle(10, 10, 3);
    g.fillCircle(18, 16, 4);
    g.fillCircle(9, 20, 2);
    g.generateTexture('shooter_asteroid_large', 28, 28);
    g.clear();

    g.fillStyle(0x444455, 1);
    g.fillRect(2, 1, 10, 12);
    g.fillRect(1, 2, 12, 10);
    g.fillStyle(0x666677, 1);
    g.fillRect(3, 3, 8, 8);
    g.fillStyle(0x222233, 1);
    g.fillRect(5, 5, 2, 2);
    g.fillRect(8, 8, 2, 2);
    g.generateTexture('shooter_asteroid_small', 14, 14);
    g.clear();

    // 19. Destiny Dreadnought Boss (76x54)
    g.fillStyle(0x000000, 1);
    g.fillRect(6, 4, 64, 38);
    g.fillStyle(0x212121, 1);
    g.fillRect(8, 6, 60, 34);
    g.fillStyle(0x880e4f, 1);
    g.fillRect(4, 12, 12, 28);
    g.fillRect(60, 12, 12, 28);
    g.fillStyle(0xff1744, 1);
    g.fillRect(8, 40, 4, 8);
    g.fillRect(64, 40, 4, 8);
    g.fillStyle(0xd50000, 1);
    g.fillRect(26, 12, 24, 8);
    g.fillStyle(0xff8a80, 1);
    g.fillRect(30, 14, 16, 3);
    g.fillStyle(0x000000, 1);
    g.fillRect(28, 24, 20, 14);
    g.fillStyle(0x00e5ff, 1);
    g.fillCircle(38, 31, 6);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(38, 31, 3);
    g.generateTexture('shooter_boss', 76, 54);
    g.clear();

    // 20. Power-Ups (P, S, B, STAR) (18x18)
    const pCapsules = [
        { key: 'shooter_powerup_P', border: 0x00e5ff, bg: 0x003355, txt: 'P', col: 0x00e5ff },
        { key: 'shooter_powerup_S', border: 0x00ff66, bg: 0x004422, txt: 'S', col: 0x00ff66 },
        { key: 'shooter_powerup_B', border: 0xff7700, bg: 0x552200, txt: 'B', col: 0xff7700 },
        { key: 'shooter_powerup_STAR', border: 0xffd700, bg: 0x554400, txt: '★', col: 0xffd700 }
    ];
    pCapsules.forEach(p => {
        g.fillStyle(0x000000, 1);
        g.fillRect(1, 1, 16, 16);
        g.fillStyle(p.bg, 1);
        g.fillRect(2, 2, 14, 14);
        g.fillStyle(p.border, 1);
        g.strokeRect(1, 1, 16, 16);
        g.fillStyle(p.col, 1);
        if (p.txt === 'P') {
            g.fillRect(5, 5, 2, 8);
            g.fillRect(5, 5, 7, 2);
            g.fillRect(10, 5, 2, 5);
            g.fillRect(5, 8, 6, 2);
        } else if (p.txt === 'S') {
            g.fillRect(5, 5, 7, 2);
            g.fillRect(5, 5, 2, 4);
            g.fillRect(5, 8, 7, 2);
            g.fillRect(10, 8, 2, 5);
            g.fillRect(5, 12, 7, 2);
        } else if (p.txt === 'B') {
            g.fillRect(5, 5, 2, 8);
            g.fillRect(5, 5, 6, 2);
            g.fillRect(9, 5, 2, 4);
            g.fillRect(5, 8, 6, 2);
            g.fillRect(9, 8, 2, 5);
            g.fillRect(5, 12, 6, 2);
        } else {
            // Star [★] Points Badge
            g.fillRect(8, 4, 2, 10);
            g.fillRect(4, 8, 10, 2);
            g.fillRect(6, 6, 6, 6);
        }
        g.generateTexture(p.key, 18, 18);
        g.clear();
    });

    // 21. Energy Shield (46x46) - 100% HOLLOW neon cyan energy barrier ring with perimeter nodes (ZERO center fill)
    g.lineStyle(2, 0x00e5ff, 1);
    g.strokeCircle(23, 23, 21);
    g.lineStyle(1, 0xffffff, 0.9);
    g.strokeCircle(23, 23, 19);
    // 4 decorative shield emitter nodes on perimeter (center remains 100% transparent so ship is never obscured)
    g.fillStyle(0x00ffff, 1);
    g.fillRect(21, 0, 4, 3);
    g.fillRect(21, 43, 4, 3);
    g.fillRect(0, 21, 3, 4);
    g.fillRect(43, 21, 3, 4);
    g.generateTexture('shooter_shield', 46, 46);
    g.clear();

    // 21b. Invulnerability Forcefield Aura (46x46) - 100% HOLLOW golden halo ring (ZERO center fill)
    g.lineStyle(2, 0xffd700, 1);
    g.strokeCircle(23, 23, 21);
    g.lineStyle(1, 0xffffff, 0.9);
    g.strokeCircle(23, 23, 18);
    // 4 gold power crystals on perimeter
    g.fillStyle(0xffd700, 1);
    g.fillRect(21, 0, 4, 3);
    g.fillRect(21, 43, 4, 3);
    g.fillRect(0, 21, 3, 4);
    g.fillRect(43, 21, 3, 4);
    g.generateTexture('shooter_invuln_shield', 46, 46);
    g.clear();

    // 22. Bullets
    // Downward pointed red-and-white laser missile dart (8x14) - distinctly hostile, cannot be mistaken for a powerup!
    g.fillStyle(0xff0022, 1);
    g.fillTriangle(4, 14, 0, 0, 8, 0);
    g.fillStyle(0xff7700, 1);
    g.fillTriangle(4, 12, 1, 1, 7, 1);
    g.fillStyle(0xffffff, 1);
    g.fillTriangle(4, 8, 2, 2, 6, 2);
    g.generateTexture('shooter_bullet_enemy', 8, 14);
    g.clear();

    g.fillStyle(0xaa00ff, 1);
    g.fillCircle(5, 5, 5);
    g.fillStyle(0xff4081, 1);
    g.fillCircle(5, 5, 3);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(5, 5, 1.5);
    g.generateTexture('shooter_bullet_boss', 10, 10);
    g.clear();

    // 23. Explosions (4 frames)
    g.fillStyle(0xffffff, 1);
    g.fillCircle(16, 16, 6);
    g.fillStyle(0xffff00, 1);
    g.fillCircle(16, 16, 4);
    g.generateTexture('shooter_explosion_0', 32, 32);
    g.clear();

    g.fillStyle(0xff3d00, 1);
    g.fillCircle(16, 16, 12);
    g.fillStyle(0xffd700, 1);
    g.fillCircle(16, 16, 8);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(16, 16, 4);
    g.generateTexture('shooter_explosion_1', 32, 32);
    g.clear();

    g.fillStyle(0xd50000, 1);
    g.fillCircle(16, 16, 14);
    g.fillStyle(0xff9100, 1);
    g.fillCircle(16, 16, 10);
    g.fillStyle(0xffff00, 1);
    g.fillCircle(16, 16, 5);
    g.generateTexture('shooter_explosion_2', 32, 32);
    g.clear();

    g.fillStyle(0x424242, 0.8);
    g.fillCircle(16, 16, 10);
    g.fillStyle(0xff3d00, 0.6);
    g.fillCircle(12, 14, 4);
    g.fillCircle(20, 18, 4);
    g.generateTexture('shooter_explosion_3', 32, 32);
    g.clear();

    // 24. CRT Monitor Scanlines (4x4 tile)
    g.fillStyle(0x000000, 0);
    g.fillRect(0, 0, 4, 2);
    g.fillStyle(0x000000, 0.45);
    g.fillRect(0, 2, 4, 2);
    g.generateTexture('shooter_scanlines', 4, 4);
    g.clear();

    g.destroy();
}

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

class GameScene extends Phaser.Scene {
    constructor() { super('GameScene'); }
    
    init(data) {
        this.selectedCharacter = (data && data.character) || 'riley'; 
        this.characterName = (data && data.name) || 'Riley';
    }

    create() {
        this.physics.world.setBounds(0, 0, 2400, 1400);
        this.cameras.main.setBounds(0, 0, 2400, 1400);

        // --- BACKGROUND GRAPHICS ---
        // Sun (fixed in the sky)
        this.add.image(600, 150, 'sun').setScrollFactor(0.05);

        // Clouds (Parallax)
        for (let i = 0; i < 15; i++) {
            let cx = Phaser.Math.Between(0, 2400);
            let cy = Phaser.Math.Between(50, 400);
            let sf = 0.1 + (Math.random() * 0.2); // Parallax factor
            this.add.image(cx, cy, 'cloud').setScrollFactor(sf).setAlpha(0.8).setScale(0.5 + Math.random());
        }

        // Birds
        for (let i = 0; i < 8; i++) {
            let bx = Phaser.Math.Between(0, 2400);
            let by = Phaser.Math.Between(100, 500);
            let sf = 0.2 + (Math.random() * 0.3);
            let bird = this.add.image(bx, by, 'bird').setScrollFactor(sf);
            // Simple bird animation tween
            this.tweens.add({
                targets: bird,
                y: by - 10,
                duration: 500 + Math.random() * 500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }

        // Ocean Horizon
        // Deck 11 is around y=1200, so horizon should be visible behind the decks.
        // The game world is 1400 tall. 
        // We'll place the ocean at the bottom of the screen with a very low scroll factor.
        this.oceanBg = this.add.tileSprite(0, 400, this.scale.width, 1400, 'ocean_bg')
            .setOrigin(0, 0)
            .setScrollFactor(0, 0.1);

        const resizeHandler = (gameSize) => {
            if (this.sys && this.sys.isActive()) {
                if (this.oceanBg) this.oceanBg.setSize(gameSize.width, 1400);
                this.layoutHUD(gameSize.width, gameSize.height);
            }
        };
        this.scale.on('resize', resizeHandler);
        this.events.once('shutdown', () => {
            this.scale.off('resize', resizeHandler);
            if (this.cursorTween) {
                this.cursorTween.stop();
                this.cursorTween = null;
            }
        });

        // --- SHIP WALLS (ANGLED 3/4 ISOMETRIC PERSPECTIVE) ---
        // Deck 11 lower hull (beneath y=1280 down to y=1420)
        this.add.tileSprite(0, 1280, 2400, 140, 'ship_wall').setOrigin(0, 0);

        // Deck 12 wall (behind Deck 11, from Deck 12 floor y=1000 down to Deck 11 back wall y=1220) - Full width
        this.add.tileSprite(0, 1000, 2400, 220, 'ship_wall').setOrigin(0, 0);

        // Deck 13 wall (behind Deck 12, from Deck 13 floor y=760 down to Deck 12 back wall y=940) - Full width
        this.add.tileSprite(0, 760, 2400, 180, 'ship_wall').setOrigin(0, 0);

        // Top of AquaMouse structure (from launch deck y=340 down to Deck 13 back wall y=700)
        this.add.tileSprite(700, 340, 100, 360, 'ship_wall').setOrigin(0, 0);

        // 8-bit Architectural Baseboard Trim Lines between vertical walls and horizontal deck corridors
        this.add.rectangle(0, 1220, 2400, 2, 0x182030).setOrigin(0, 1).setDepth(2);
        this.add.rectangle(0, 940, 2400, 2, 0x182030).setOrigin(0, 1).setDepth(2);
        this.add.rectangle(0, 700, 2400, 2, 0x182030).setOrigin(0, 1).setDepth(2);

        // Upper Deck Overhang Ambient Occlusion Shadows
        this.add.tileSprite(0, 1220, 2400, 10, 'deck_overhang_shadow').setOrigin(0, 0).setDepth(3);
        this.add.tileSprite(0, 940, 2400, 10, 'deck_overhang_shadow').setOrigin(0, 0).setDepth(3);
        this.add.tileSprite(0, 700, 2400, 10, 'deck_overhang_shadow').setOrigin(0, 0).setDepth(3);

        const platforms = this.physics.add.staticGroup();
        const water = this.physics.add.staticGroup();
        this.water = water;
        const slides = this.physics.add.staticGroup();
        const doors = this.physics.add.staticGroup();

        const createStaircase = (startX, startY, steps, dirX, dirY) => {
            // 3D Angled Structural Truss Girder beneath the steps
            let trussG = this.add.graphics().setDepth(startY - 5);
            trussG.lineStyle(6, 0x182028, 1);
            trussG.beginPath();
            trussG.moveTo(startX, startY + 14);
            trussG.lineTo(startX + (steps * 40 * dirX), startY + (steps * 40 * dirY) + 14);
            trussG.strokePath();
            trussG.lineStyle(2, 0x586068, 1);
            trussG.beginPath();
            trussG.moveTo(startX, startY + 11);
            trussG.lineTo(startX + (steps * 40 * dirX), startY + (steps * 40 * dirY) + 11);
            trussG.strokePath();

            // Visual 3D steps with depth treads and risers
            for (let i = 0; i < steps; i++) {
                let sx = startX + (i * 40 * dirX);
                let sy = startY + (i * 40 * dirY);
                this.add.image(sx, sy, 'stair_step_3d').setDepth(sy); // Authentic 3D tread & riser
                this.add.image(sx, sy - 20, 'railing').setDepth(sy + 10);
            }
        };

        // ----------------------------------------------------
        // DECK 11 (Main Pool Deck) - y: 1220 to 1280 (Depth: 60px)
        // ----------------------------------------------------
        this.add.tileSprite(0, 1220, 890, 60, 'deck_3d').setOrigin(0, 0).setDepth(1);
        this.add.tileSprite(890, 1220, 300, 60, 'pool_3d_basin').setOrigin(0, 0).setDepth(1);
        this.add.tileSprite(1190, 1220, 1210, 60, 'deck_3d').setOrigin(0, 0).setDepth(1);
        
        doors.create(400, 1190, 'door'); 
        this.add.text(350, 1145, 'SENSES SPA', { fontSize: '9px', fill: '#FFD700', backgroundColor: '#001024', padding: { x: 6, y: 4 }, fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 2 });
        
        doors.create(2100, 1190, 'door');
        this.add.text(2010, 1145, 'MARCELINE MARKET', { fontSize: '9px', fill: '#58B8F8', backgroundColor: '#001024', padding: { x: 6, y: 4 }, fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 2 });
        // Dynamic 8-Bit Funnel Vision Screen
        this.createFunnelVision();

        const iceCreamStands = this.physics.add.staticGroup();
        iceCreamStands.create(1500, 1190, 'icecream_stand');
        this.add.text(1430, 1145, 'EYE SCREAM TREATS', { fontSize: '9px', fill: '#F85898', backgroundColor: '#001024', padding: { x: 6, y: 4 }, fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 2 });

        // Stairs up to Deck 12 (right-up): connects Deck 11 (y=1280) to Deck 12 (y=1000)
        createStaircase(60, 1280, 7, 1, -1);

        // ----------------------------------------------------
        // DECK 12 (Splashdown & Hero Zone) - y: 940 to 1000 (Depth: 60px)
        // ----------------------------------------------------
        this.add.tileSprite(0, 940, 530, 60, 'deck_3d').setOrigin(0, 0).setDepth(1);
        this.add.tileSprite(530, 940, 200, 60, 'pool_3d_basin').setOrigin(0, 0).setDepth(1);
        this.add.tileSprite(730, 940, 970, 60, 'deck_3d').setOrigin(0, 0).setDepth(1);
        this.add.tileSprite(1700, 940, 200, 60, 'pool_3d_basin').setOrigin(0, 0).setDepth(1);
        this.add.tileSprite(1900, 940, 500, 60, 'deck_3d').setOrigin(0, 0).setDepth(1);

        doors.create(140, 910, 'door');
        this.add.text(80, 865, 'COVE CAFE', { fontSize: '9px', fill: '#00F8A0', backgroundColor: '#001024', padding: { x: 6, y: 4 }, fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 2 });
        this.add.text(590, 915, 'SPLASHDOWN', { fontSize: '9px', fill: '#58B8F8', backgroundColor: '#001024', padding: { x: 6, y: 4 }, fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 2 });
        this.add.text(1680, 915, 'TOY STORY SPLASH', { fontSize: '9px', fill: '#F8A800', backgroundColor: '#001024', padding: { x: 6, y: 4 }, fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 2 });

        doors.create(2000, 910, 'door');
        this.add.text(1960, 865, 'HERO ZONE', { fontSize: '9px', fill: '#E83818', backgroundColor: '#001024', padding: { x: 6, y: 4 }, fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 2 });

        // Stairs up to Deck 13 (left-up): connects Deck 12 (y=1000) to Deck 13 (y=760)
        createStaircase(2300, 1000, 6, -1, -1);

        // ----------------------------------------------------
        // DECK 13 (AquaMouse Deck) - y: 700 to 760 (Depth: 60px)
        // ----------------------------------------------------
        this.add.tileSprite(0, 700, 2400, 60, 'deck_3d').setOrigin(0, 0).setDepth(1);

        this.add.text(1170, 675, 'AQUAMOUSE ENTRANCE', { fontSize: '9px', fill: '#FFD700', backgroundColor: '#001024', padding: { x: 6, y: 4 }, fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 2 });


        // AquaMouse Raft Lift
        this.raft = this.physics.add.sprite(1200, 730, 'raft');
        this.raft.body.allowGravity = false;
        this.raft.setImmovable(true);
        
        let liftZone = this.add.zone(1200, 730, 80, 80);
        this.physics.world.enable(liftZone);
        liftZone.body.allowGravity = false;
        
        this.ridingRaft = false;
        this.liftZone = liftZone;

        // Top Deck of AquaMouse
        this.add.tileSprite(700, 320, 100, 20, 'deck_3d').setOrigin(0, 0).setDepth(1);
        this.add.text(670, 275, 'AQUAMOUSE LAUNCH', { fontSize: '9px', fill: '#FFD700', backgroundColor: '#001024', padding: { x: 6, y: 4 }, fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 2 });

        // Midship Elevators & Interaction Zones (Decks 11 & 12)
        this.elevators = this.physics.add.staticGroup();
        this.elevators.create(1250, 1190, 'elevator_door').setDepth(1190); // Deck 11
        this.elevators.create(1250, 910, 'elevator_door').setDepth(910);   // Deck 12
        
        // Interaction Zones
        this.elevatorZones = this.physics.add.staticGroup();
        this.elevatorZones.add(this.add.zone(1250, 1255, 60, 60)); // Deck 11
        this.elevatorZones.add(this.add.zone(1250, 975, 60, 60));  // Deck 12
        // Enable physics on zones
        this.elevatorZones.getChildren().forEach(z => this.physics.add.existing(z, true));

        // --- 3D POOL WATER SUBMERSION COPING & CORRIDORS ---
        // Marble front coping and translucent water surface overlay for 3D pool submersion
        this.add.tileSprite(890, 1268, 300, 14, 'pool_front_coping_3d').setOrigin(0, 0).setDepth(1282);
        this.add.tileSprite(530, 988, 200, 14, 'pool_front_coping_3d').setOrigin(0, 0).setDepth(1002);
        this.add.tileSprite(1700, 988, 200, 14, 'pool_front_coping_3d').setOrigin(0, 0).setDepth(1002);

        this.pools = [
            { name: 'deck11_main', xMin: 890, xMax: 1190, yMin: 1220, yMax: 1280 },
            { name: 'deck12_splashdown', xMin: 530, xMax: 730, yMin: 940, yMax: 1000 },
            { name: 'deck12_toystory', xMin: 1700, xMax: 1900, yMin: 940, yMax: 1000 }
        ];

        // --- 3D DECK SLAB FASCIA (STRUCTURAL DECK THICKNESS) ---
        this.add.tileSprite(0, 1280, 2400, 12, 'deck_fascia').setOrigin(0, 0).setDepth(1340);
        this.add.tileSprite(0, 1000, 300, 12, 'deck_fascia').setOrigin(0, 0).setDepth(1040);
        this.add.tileSprite(345, 1000, 2055, 12, 'deck_fascia').setOrigin(0, 0).setDepth(1040);
        this.add.tileSprite(0, 760, 2055, 12, 'deck_fascia').setOrigin(0, 0).setDepth(800);
        this.add.tileSprite(2100, 760, 300, 12, 'deck_fascia').setOrigin(0, 0).setDepth(800);
        this.add.tileSprite(700, 340, 100, 12, 'deck_fascia').setOrigin(0, 0).setDepth(340); // Top deck

        // --- FOREGROUND RAILINGS WITH INTEGRATED STAIRWELL OPENINGS ---
        this.add.tileSprite(0, 1280, 2400, 40, 'railing').setOrigin(0, 0).setDepth(1350);

        // Deck 12 railing with Stair 1 stairwell opening (x: 300..345)
        this.add.tileSprite(0, 1000, 300, 40, 'railing').setOrigin(0, 0).setDepth(1050);
        this.add.tileSprite(345, 1000, 2055, 40, 'railing').setOrigin(0, 0).setDepth(1050);
        this.add.rectangle(300, 1000, 4, 38, 0x182030).setOrigin(0.5, 0).setDepth(1051);
        this.add.rectangle(345, 1000, 4, 38, 0x182030).setOrigin(0.5, 0).setDepth(1051);
        this.add.rectangle(300, 998, 6, 4, 0xF8B800).setOrigin(0.5, 0).setDepth(1052);
        this.add.rectangle(345, 998, 6, 4, 0xF8B800).setOrigin(0.5, 0).setDepth(1052);

        // Deck 13 railing with Stair 2 stairwell opening (x: 2055..2100)
        this.add.tileSprite(0, 760, 2055, 40, 'railing').setOrigin(0, 0).setDepth(810);
        this.add.tileSprite(2100, 760, 300, 40, 'railing').setOrigin(0, 0).setDepth(810);
        this.add.rectangle(2055, 760, 4, 38, 0x182030).setOrigin(0.5, 0).setDepth(811);
        this.add.rectangle(2100, 760, 4, 38, 0x182030).setOrigin(0.5, 0).setDepth(811);
        this.add.rectangle(2055, 758, 6, 4, 0xF8B800).setOrigin(0.5, 0).setDepth(812);
        this.add.rectangle(2100, 758, 6, 4, 0xF8B800).setOrigin(0.5, 0).setDepth(812);

        this.add.tileSprite(700, 340, 100, 40, 'railing').setOrigin(0, 0).setDepth(350); // Top deck

        // The AquaMouse Slide (circular loop around the deck!)
        let slideCurve = new Phaser.Curves.Spline([
            750, 360,
            400, 150,
            -50, 250,
            -50, 500,
            400, 700,
            500, 900,
            630, 1000
        ]);

        this.slideCurve = slideCurve;
        // Draw the lift tube visually with depth-sorted graphics segments
        let liftCurve = new Phaser.Curves.Line([1200, 750, 750, 360]);
        let liftPoints = liftCurve.getSpacedPoints(40);
        for (let i = 0; i < liftPoints.length - 1; i++) {
            let p1 = liftPoints[i];
            let p2 = liftPoints[i+1];
            let g = this.add.graphics();
            g.lineStyle(40, 0x58D8F8, 0.85);
            g.fillStyle(0x58D8F8, 0.85);
            g.fillCircle(p1.x, p1.y, 20); // Round joint
            g.beginPath();
            g.moveTo(p1.x, p1.y);
            g.lineTo(p2.x, p2.y);
            g.strokePath();
            
            g.lineStyle(2, 0x0000FF, 1);
            g.beginPath();
            g.moveTo(p1.x + 20, p1.y - 10);
            g.lineTo(p2.x + 20, p2.y - 10);
            g.moveTo(p1.x - 20, p1.y + 10);
            g.lineTo(p2.x - 20, p2.y + 10);
            g.strokePath();
            
            g.setDepth(p1.y + 1);
        }

        // Villain Mountain Enclosure (Solid-colored structure around the forward funnel)
        let mountainG = this.add.graphics().setDepth(365); // In front of Top Deck (340) and lift tube top (361)
        mountainG.fillStyle(0x303040, 1);
        mountainG.fillRoundedRect(680, 200, 140, 160, 20); // Dark grey mountain base
        mountainG.fillStyle(0x404050, 1);
        mountainG.fillRoundedRect(700, 150, 100, 100, 20); // Peak
        this.add.text(750, 220, 'VILLAIN\nMOUNTAIN', { fontSize: '9px', fill: '#FF4444', fontFamily: '"Press Start 2P", monospace', align: 'center', stroke: '#000000', strokeThickness: 2 }).setOrigin(0.5).setDepth(366);

        // Toxic Green Smoke Emitter
        let pg = this.make.graphics({x: 0, y: 0, add: false});
        pg.fillStyle(0xFFFFFF, 1);
        pg.fillRect(0, 0, 8, 8);
        pg.generateTexture('smoke_particle', 8, 8);
        
        let smokeEmitter = this.add.particles(750, 160, 'smoke_particle', {
            speed: { min: 10, max: 40 },
            angle: { min: 250, max: 290 },
            scale: { start: 1, end: 3 },
            alpha: { start: 0.8, end: 0 },
            lifespan: 3000,
            frequency: 300,
            tint: [ 0x33FF33, 0x00AA00, 0x88FF33 ], // toxic green variations
            blendMode: 'NORMAL'
        });
        smokeEmitter.setDepth(364); // Rising from behind the peak
        // Brightly colored exit flume at Deck 12 Splashdown
        let flumeG = this.add.graphics().setDepth(1001);
        flumeG.fillStyle(0xFF5500, 1); // Bright orange flume
        flumeG.fillRoundedRect(600, 950, 60, 50, 10);
        flumeG.fillStyle(0xFFFF00, 1); // Yellow stripes
        flumeG.fillRect(610, 950, 5, 50);
        flumeG.fillRect(645, 950, 5, 50);

        // Draw the looping slide visually with depth-sorted graphics segments
        let slidePoints = slideCurve.getSpacedPoints(180); // Increased points for smoother larger curve
        for (let i = 0; i < slidePoints.length - 1; i++) {
            let p1 = slidePoints[i];
            let p2 = slidePoints[i+1];
            let g = this.add.graphics();
            
            // Clear acrylic tube
            g.lineStyle(40, 0x88CCFF, 0.45);
            g.fillStyle(0x88CCFF, 0.45);
            g.fillCircle(p1.x, p1.y, 20); // Round joint
            g.beginPath();
            g.moveTo(p1.x, p1.y);
            g.lineTo(p2.x, p2.y);
            g.strokePath();
            
            // White shiny reflection on the top edge of the tube
            g.lineStyle(4, 0xFFFFFF, 0.7);
            g.beginPath();
            g.moveTo(p1.x - 10, p1.y - 10);
            g.lineTo(p2.x - 10, p2.y - 10);
            g.strokePath();
            
            // Industrial metallic flanges every 10 segments
            if (i % 10 === 0) {
                g.lineStyle(6, 0xAAAAAA, 1); // Grey metal ring
                g.beginPath();
                g.moveTo(p1.x - 22, p1.y - 22);
                g.lineTo(p1.x + 22, p1.y + 22);
                g.strokePath();
                // Add tiny bolts (dots)
                g.fillStyle(0x444444, 1);
                g.fillCircle(p1.x - 18, p1.y - 18, 2);
                g.fillCircle(p1.x + 18, p1.y + 18, 2);
            }
            
            g.setDepth(Math.max(p1.y + 1, 815));
        }

        // --- TOP-MOUNTED CAPCOM RETRO HUD ---
        this.score = 2500;
        this.hudBg = this.add.graphics().setScrollFactor(0).setDepth(3000);

        // Player Avatar Icon & Name
        let playerIconKey = this.selectedCharacter === 'riley' ? 'riley_idle' : 'amelia_idle';
        this.hudPlayerIcon = this.add.image(24, 21, playerIconKey).setScale(0.7).setScrollFactor(0).setDepth(3001);
        this.hudPlayerName = this.add.text(42, 14, this.characterName.toUpperCase(), {
            fontSize: '10px', fill: '#FFD700', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 3
        }).setScrollFactor(0).setDepth(3001);

        // Retro HP Hit-Point Nodes
        this.hudHpText = this.add.text(135, 14, 'HP', {
            fontSize: '10px', fill: '#FFFFFF', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 3
        }).setScrollFactor(0).setDepth(3001);
        this.hpNodes = [];
        for (let i = 0; i < 4; i++) {
            let node = this.add.image(175 + i * 18, 20, 'hp_node_full').setScrollFactor(0).setDepth(3001);
            this.hpNodes.push(node);
        }

        // Center Location Banner
        this.hudLocation = this.add.text(480, 20, '[ DECK 11: MAIN POOL ]', {
            fontSize: '9px', fill: '#58B8F8', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5).setScrollFactor(0).setDepth(3001);

        // Right Zero-Padded Currency/Score Counter: $0002500
        this.hudCoinIcon = this.add.image(740, 20, 'coin_icon').setScrollFactor(0).setDepth(3001);
        this.hudScoreText = this.add.text(755, 14, '$0002500', {
            fontSize: '10px', fill: '#FFFFFF', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 3
        }).setScrollFactor(0).setDepth(3001);

        // Ice Cream Status Indicator Icon
        this.hudIceCreamIcon = this.add.image(890, 20, 'icecream_strawberry').setScale(0.8).setScrollFactor(0).setDepth(3001).setVisible(false);

        // Retro Capcom [MENU] Button
        this.hudMenuBtn = this.add.text(0, 0, '[MENU]', {
            fontSize: '10px', fill: '#FFD700', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 3
        }).setOrigin(1, 0.5).setPadding(8, 8, 8, 8).setScrollFactor(0).setDepth(3001).setInteractive({ useHandCursor: true });
        this.hudMenuBtn.on('pointerover', () => this.hudMenuBtn.setFill('#FFFFFF'));
        this.hudMenuBtn.on('pointerout', () => this.hudMenuBtn.setFill('#FFD700'));
        this.hudMenuBtn.on('pointerdown', () => this.toggleInGameMenu());

        this.createInGameMenu();

        this.layoutHUD(this.scale.width, this.scale.height);

        // --- 2.5D DEPTH MOVEMENT & PLAYER INITIALIZATION ---
        this.groundY = 1255; // Initial Deck 11 floor Y (midway in 1220..1280 corridor)
        this.jumpZ = 0;
        this.jumpV = 0;
        this.isJumping = false;
        this.currentDeck = 'deck11';
        this.currentStair = null;

        let spawnY = 1255;
        this.player = this.physics.add.sprite(700, spawnY, this.selectedCharacter);
        this.player.setBounce(0.0);
        this.player.setCollideWorldBounds(true);
        this.player.body.allowGravity = false;
        this.player.setDepth(spawnY);
        if (this.selectedCharacter === 'riley') {
            this.player.body.setSize(22, 16);
            this.player.body.setOffset(5, 32);
        } else {
            this.player.body.setSize(22, 16);
            this.player.body.setOffset(5, 24);
        }
        this.player.setInteractive({ useHandCursor: true });
        this.player.on('pointerdown', () => {
            if (this.isMenuOpen) return;
            if (this.canBoardRaft()) {
                this.boardRaft();
            }
        });

        // 2.5D Ground Shadow
        this.playerShadow = this.add.image(700, spawnY + 18, 'player_shadow').setOrigin(0.5, 0.5).setDepth(spawnY - 1);

        // Register 8-bit Character Animations
        ['riley', 'amelia'].forEach(c => {
            if (!this.anims.exists(c + '_idle')) {
                this.anims.create({
                    key: c + '_idle',
                    frames: [{ key: c + '_idle' }],
                    frameRate: 1
                });
            }
            if (!this.anims.exists(c + '_walk')) {
                this.anims.create({
                    key: c + '_walk',
                    frames: [
                        { key: c + '_walk_0' },
                        { key: c + '_walk_1' },
                        { key: c + '_walk_2' },
                        { key: c + '_walk_1' }
                    ],
                    frameRate: 8,
                    repeat: -1
                });
            }
            if (!this.anims.exists(c + '_jump')) {
                this.anims.create({
                    key: c + '_jump',
                    frames: [{ key: c + '_jump' }],
                    frameRate: 1
                });
            }
        });

        // Register Ambient NPC Animations
        if (!this.anims.exists('npc_officer_walk')) {
            this.anims.create({
                key: 'npc_officer_walk',
                frames: [
                    { key: 'npc_officer_walk_0' },
                    { key: 'npc_officer_idle' },
                    { key: 'npc_officer_walk_1' },
                    { key: 'npc_officer_idle' }
                ],
                frameRate: 6,
                repeat: -1
            });
        }
        if (!this.anims.exists('npc_officer_idle')) {
            this.anims.create({
                key: 'npc_officer_idle',
                frames: [{ key: 'npc_officer_idle' }],
                frameRate: 1
            });
        }
        if (!this.anims.exists('npc_tourist_walk')) {
            this.anims.create({
                key: 'npc_tourist_walk',
                frames: [
                    { key: 'npc_tourist_walk_0' },
                    { key: 'npc_tourist_idle' },
                    { key: 'npc_tourist_walk_1' },
                    { key: 'npc_tourist_idle' }
                ],
                frameRate: 6,
                repeat: -1
            });
        }
        if (!this.anims.exists('npc_tourist_idle')) {
            this.anims.create({
                key: 'npc_tourist_idle',
                frames: [{ key: 'npc_tourist_idle' }],
                frameRate: 1
            });
        }
        if (!this.anims.exists('npc_lounger_relax')) {
            this.anims.create({
                key: 'npc_lounger_relax',
                frames: [
                    { key: 'npc_lounger_0', duration: 3200 },
                    { key: 'npc_lounger_1', duration: 1200 }
                ],
                frameRate: 1,
                repeat: -1
            });
        }
        if (!this.anims.exists('npc_swimmer_bob')) {
            this.anims.create({
                key: 'npc_swimmer_bob',
                frames: [
                    { key: 'npc_swimmer_0', duration: 800 },
                    { key: 'npc_swimmer_1', duration: 800 }
                ],
                frameRate: 1,
                repeat: -1
            });
        }

        // Initialize Ambient NPCs
        this.createAmbientNPCs();

        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

        window.gameScene = this;

        // AquaMouse boarding zone - show prompt, require Enter/tap
        this.nearRaft = false;
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        const isTouch = !this.sys.game.device.os.desktop || this.sys.game.device.input.touch;
        const promptLabel = isTouch ? '[ TAP TO BOARD AQUAMOUSE! ]' : '[ ENTER: BOARD AQUAMOUSE! ]';
        this.boardPromptText = this.add.text(1200, 700, promptLabel, {
            fontSize: '10px', fill: '#FFD700', backgroundColor: '#001024', padding: { x: 10, y: 8 },
            fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5).setDepth(25).setVisible(false);
        this.boardPromptText.setInteractive({ useHandCursor: true });
        this.boardPromptText.on('pointerdown', () => this.boardRaft());

        this.physics.add.overlap(this.player, this.liftZone, () => {
            this.nearRaft = true;
        });

        // Midship Elevator interaction prompt & overlap
        this.nearElevator = false;
        const elevatorPromptLabel = isTouch ? '[ TAP TO USE ELEVATOR ]' : '[ ENTER: USE ELEVATOR ]';
        this.elevatorPromptText = this.add.text(1250, 700, elevatorPromptLabel, {
            fontSize: '10px', fill: '#FFFFFF', backgroundColor: '#0000AA', padding: { x: 10, y: 8 },
            fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5).setDepth(2000).setVisible(false).setInteractive({ useHandCursor: true });
        this.elevatorPromptText.on('pointerdown', () => this.openElevatorMenu());

        this.physics.add.overlap(this.player, this.elevatorZones, () => {
            this.nearElevator = true;
        });

        // Board the raft
        const boardRaft = () => {
            if (this.ridingRaft) return;
            this.ridingRaft = true;

            if (this.boardPromptText) this.boardPromptText.setVisible(false);

            // Crucial: disable body collisions so platforms and decks do not fight the tween
            if (this.player && this.player.body) {
                this.player.body.enable = false;
                this.player.setVelocity(0, 0);
            }

            // Snap player directly to raft seat
            this.player.x = this.raft.x;
            this.player.y = this.raft.y - 24;

            // 1. Lift Tween - player sits on top of raft
            this.tweens.add({
                targets: [this.player, this.raft],
                x: 750,
                y: 350,
                duration: 3000,
                ease: 'Sine.easeInOut',
                onUpdate: () => {
                    // Keep player seated on raft during lift
                    this.player.x = this.raft.x;
                    this.player.y = this.raft.y - 24;
                    // Dynamic depth ordering to sit inside the lift tube
                    this.raft.setDepth(this.raft.y);
                    this.player.setDepth(this.raft.y);
                },
                onComplete: () => {
                    // Show Villain Dialogue Box inside Villain Mountain
                    let quotes = [
                        "FOOLS! PREPARE FOR\nTHE DROP...",
                        "YOU THINK THIS IS\nA JOKE? BWAHAHA!",
                        "THE UNDERWORLD\nAWAITS YOU...",
                        "MWAHAHAHA!\nHOLD ON TIGHT!"
                    ];
                    let quote = quotes[Math.floor(Math.random() * quotes.length)];
                    
                    let dialogBg = this.add.graphics().setDepth(4000).setScrollFactor(0);
                    dialogBg.fillStyle(0x000000, 0.8);
                    dialogBg.lineStyle(2, 0x33FF33, 1);
                    dialogBg.fillRoundedRect(this.cameras.main.width/2 - 150, 60, 300, 60, 8);
                    dialogBg.strokeRoundedRect(this.cameras.main.width/2 - 150, 60, 300, 60, 8);
                    
                    let dialogText = this.add.text(this.cameras.main.width/2, 90, quote, {
                        fontFamily: '"Press Start 2P", monospace',
                        fontSize: '10px',
                        fill: '#33FF33',
                        align: 'center',
                        lineSpacing: 8
                    }).setOrigin(0.5).setDepth(4001).setScrollFactor(0);

                    // Pause inside the mountain for 2.5 seconds
                    this.time.delayedCall(2500, () => {
                        dialogBg.destroy();
                        dialogText.destroy();
                        
                        // 2. Slide Tween
                        let pathObj = { t: 0 };
                        this.tweens.add({
                            targets: pathObj,
                            t: 1,
                            ease: 'Sine.easeInOut',
                            duration: 4000,
                            onUpdate: () => {
                                let p = this.slideCurve.getPoint(pathObj.t);
                                this.raft.x = p.x;
                                this.raft.y = p.y;
                                this.player.x = p.x;
                                this.player.y = p.y - 24; // Seated on raft
                                // Dynamic depth ordering to sit inside the slide tube (elevated over Deck 13 railing)
                                let d = Math.max(p.y, 814); 
                                this.raft.setDepth(d);
                                this.player.setDepth(d);
                            },
                            onComplete: () => {
                                // 3. Splashdown & Hop Out into Deck 12 Pool
                                this.ridingRaft = false;
                                this.score += 1500;
                                this.currentDeck = 'deck12';
                                this.groundY = 975;
                                this.jumpZ = 12;
                                this.jumpV = 200;
                                this.isJumping = true;
                                if (this.player && this.player.body) {
                                    this.player.body.enable = true;
                                    this.player.body.allowGravity = false;
                                    this.player.setVelocity(-120, 0);
                                    this.player.body.reset(630, 975 - (this.player.body.height / 2));
                                }
                                this.raft.x = 1200;
                                this.raft.y = 730;
                            }
                        });
                    });
                }
            });
        };

        this.boardRaft = boardRaft;

        // Make raft and liftZone clickable / tappable
        this.raft.setInteractive({ useHandCursor: true });
        this.raft.on('pointerdown', boardRaft);

        this.liftZone.setInteractive(new Phaser.Geom.Rectangle(0, 0, 80, 80), Phaser.Geom.Rectangle.Contains);
        this.liftZone.on('pointerdown', boardRaft);
        
        // In 2.5D, depth corridors enforce deck boundaries, while water zones handle pool swimming
        this.physics.add.overlap(this.player, water, () => {
            this.inWater = true;
        });



        this.hasIceCream = false;
        this.iceCreamFlavors = ['strawberry', 'chocolate', 'vanilla', 'mint'];
        this.currentFlavorIndex = 0;
        this.iceCreamSprite = this.add.sprite(0, 0, 'icecream_strawberry');
        this.iceCreamSprite.setDepth(16);
        this.iceCreamSprite.setVisible(false);

        this.physics.add.overlap(this.player, iceCreamStands, () => {
            if (!this.hasIceCream) {
                this.hasIceCream = true;
                this.score += 500;
                
                // Change flavor
                let flavor = this.iceCreamFlavors[this.currentFlavorIndex];
                this.iceCreamSprite.setTexture('icecream_' + flavor);
                if (this.hudIceCreamIcon) {
                    this.hudIceCreamIcon.setTexture('icecream_' + flavor).setVisible(true);
                }
                this.currentFlavorIndex = (this.currentFlavorIndex + 1) % this.iceCreamFlavors.length;
                
                this.iceCreamSprite.setVisible(true);
                
                let yumText = this.add.text(this.player.x, this.player.y - 40, '+500 PTS!', {
                    fontSize: '11px', fill: '#FFD700', fontFamily: '"Press Start 2P", monospace',
                    stroke: '#000000', strokeThickness: 3
                });
                
                this.time.delayedCall(5000, () => {
                    this.hasIceCream = false;
                    this.iceCreamSprite.setVisible(false);
                    if (this.hudIceCreamIcon) this.hudIceCreamIcon.setVisible(false);
                });
                
                this.tweens.add({
                    targets: yumText,
                    y: this.player.y - 80,
                    alpha: 0,
                    duration: 2000,
                    onComplete: () => yumText.destroy()
                });
            }
        });

        // Desktop keyboard controls (Arrow keys + WASD + Spacebar)
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Prevent browser scrolling on game control keys
        this.input.keyboard.addCapture([
            Phaser.Input.Keyboard.KeyCodes.UP,
            Phaser.Input.Keyboard.KeyCodes.DOWN,
            Phaser.Input.Keyboard.KeyCodes.LEFT,
            Phaser.Input.Keyboard.KeyCodes.RIGHT,
            Phaser.Input.Keyboard.KeyCodes.SPACE
        ]);

        // Canvas focus management: ensure clicking canvas re-focuses game
        if (this.game.canvas) {
            this.game.canvas.setAttribute('tabindex', '0');
            this.game.canvas.focus();
            this.game.canvas.addEventListener('click', () => {
                this.game.canvas.focus();
            });
        }

        // Global recovery listeners: prevent stuck keys on window blur, tab switch, or modifier release
        const resetKeyInputs = () => {
            if (this.input && this.input.keyboard) {
                this.input.keyboard.resetKeys();
            }
            if (this.mobileInput) {
                this.mobileInput.left = false;
                this.mobileInput.right = false;
                this.mobileInput.up = false;
                this.mobileInput.down = false;
                this.mobileInput.jump = false;
            }
        };

        const onNativeKeyUp = (e) => {
            // Direct DOM safety release: guarantees keys are cleared even if OS or browser dropped Phaser keyup
            if (e.code === 'Space') {
                if (this.spaceKey) this.spaceKey.isDown = false;
            }
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
                if (this.cursors && this.cursors.up) this.cursors.up.isDown = false;
                if (this.wasd && this.wasd.up) this.wasd.up.isDown = false;
            }
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                if (this.cursors && this.cursors.left) this.cursors.left.isDown = false;
                if (this.wasd && this.wasd.left) this.wasd.left.isDown = false;
            }
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                if (this.cursors && this.cursors.right) this.cursors.right.isDown = false;
                if (this.wasd && this.wasd.right) this.wasd.right.isDown = false;
            }
            if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                if (this.cursors && this.cursors.down) this.cursors.down.isDown = false;
                if (this.wasd && this.wasd.down) this.wasd.down.isDown = false;
            }
            // If user released a modifier key (Alt, Meta/Command, Control, Shift), reset all keys
            if (['Alt', 'Meta', 'Control', 'Shift'].includes(e.key)) {
                resetKeyInputs();
            }
        };

        window.addEventListener('blur', resetKeyInputs);
        window.addEventListener('focus', resetKeyInputs);
        window.addEventListener('keyup', onNativeKeyUp);
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) resetKeyInputs();
        });

        this.events.once('shutdown', () => {
            window.removeEventListener('blur', resetKeyInputs);
            window.removeEventListener('focus', resetKeyInputs);
            window.removeEventListener('keyup', onNativeKeyUp);
        });

        this.mobileInput = { left: false, right: false, up: false, down: false, jump: false };

        if (!this.sys.game.device.os.desktop) {
            this.createMobileControls();
        }

        this.inWater = false;
        this.wasInWater = false;
        this.currentFloatieColor = 0;
        this.onSlide = false;
        this.currentStair = null;
    }

    canBoardRaft() {
        if (this.ridingRaft) return false;
        if (this.nearRaft) return true;
        if (this.player && this.raft) {
            let dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.raft.x, this.raft.y);
            return dist < 140;
        }
        return false;
    }

    createMobileControls() {
        this.input.addPointer(3); // Multi-touch

        // --- Floating Joystick ---
        const JOY_RADIUS = 60;
        const KNOB_RADIUS = 25;
        let joyBase = this.add.graphics().setScrollFactor(0).setDepth(20).setAlpha(0.5);
        let joyKnob = this.add.graphics().setScrollFactor(0).setDepth(21).setAlpha(0.7);

        joyBase.fillStyle(0xffffff, 1);
        joyBase.fillCircle(0, 0, JOY_RADIUS);
        joyBase.lineStyle(3, 0x888888, 1);
        joyBase.strokeCircle(0, 0, JOY_RADIUS);

        joyKnob.fillStyle(0x4488ff, 1);
        joyKnob.fillCircle(0, 0, KNOB_RADIUS);

        joyBase.setVisible(false);
        joyKnob.setVisible(false);

        let joyPointer = null;
        let joyOrigin = { x: 0, y: 0 };

        this.input.on('pointerdown', (ptr) => {
            if (this.isMenuOpen) return;
            const halfW = this.scale.width / 2;
            if (ptr.x < halfW) {
                // Left side: spawn joystick at touch point
                if (joyPointer === null) {
                    joyPointer = ptr;
                    joyOrigin.x = ptr.x;
                    joyOrigin.y = ptr.y;
                    joyBase.setPosition(ptr.x, ptr.y).setVisible(true);
                    joyKnob.setPosition(ptr.x, ptr.y).setVisible(true);
                }
            } else {
                // Right side / second finger: jump
                this.mobileInput.jump = true;
                this.time.delayedCall(120, () => this.mobileInput.jump = false);
            }
        });

        this.input.on('pointermove', (ptr) => {
            if (joyPointer && ptr.id === joyPointer.id) {
                let dx = ptr.x - joyOrigin.x;
                let dy = ptr.y - joyOrigin.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                let clamped = Math.min(dist, JOY_RADIUS);
                let angle = Math.atan2(dy, dx);
                let kx = joyOrigin.x + Math.cos(angle) * clamped;
                let ky = joyOrigin.y + Math.sin(angle) * clamped;
                joyKnob.setPosition(kx, ky);

                // Set directional input based on deflection (4-way 2.5D movement)
                this.mobileInput.left = dx < -15;
                this.mobileInput.right = dx > 15;
                this.mobileInput.up = dy < -15;
                this.mobileInput.down = dy > 15;
            }
        });

        this.input.on('pointerup', (ptr) => {
            if (joyPointer && ptr.id === joyPointer.id) {
                joyPointer = null;
                joyBase.setVisible(false);
                joyKnob.setVisible(false);
                this.mobileInput.left = false;
                this.mobileInput.right = false;
                this.mobileInput.up = false;
                this.mobileInput.down = false;
            }
        });
    }

    clampToDeckCorridor(inWater) {
        if (this.groundY < 500) {
            // Top Deck of AquaMouse
            this.currentDeck = 'topdeck';
            this.groundY = Phaser.Math.Clamp(this.groundY, 325, 345);
            this.player.x = Phaser.Math.Clamp(this.player.x, 700, 800);
        } else if (this.groundY < 850) {
            // Deck 13 (AquaMouse Deck) - depth 60px: y 700..760, full width x: 20..2380
            this.currentDeck = 'deck13';
            this.groundY = Phaser.Math.Clamp(this.groundY, 700, 760);
            this.player.x = Phaser.Math.Clamp(this.player.x, 20, 2380);
        } else if (this.groundY < 1120) {
            // Deck 12 (Quiet Cove & Hero Zone) - depth 60px: y 940..1000, full width x: 20..2380
            this.currentDeck = 'deck12';
            this.groundY = Phaser.Math.Clamp(this.groundY, 940, 1000);
            this.player.x = Phaser.Math.Clamp(this.player.x, 20, 2380);
        } else {
            // Deck 11 (Main Pool Deck) - depth 60px: y 1220..1280, full width x: 20..2380
            this.currentDeck = 'deck11';
            this.groundY = Phaser.Math.Clamp(this.groundY, 1220, 1280);
            this.player.x = Phaser.Math.Clamp(this.player.x, 20, 2380);
        }
    }

    update() {
        if (this.isMenuOpen) {
            this.player.setVelocity(0, 0);
            if (this.enterKey && Phaser.Input.Keyboard.JustDown(this.enterKey)) {
                this.executeMenuAction(this.menuSelectedIndex);
            } else if (this.spaceKey && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
                this.executeMenuAction(this.menuSelectedIndex);
            }
            return;
        }

        // Check if player is currently within any swimming pool zone
        let currentPool = null;
        if (this.currentStair === null && this.pools) {
            for (let p of this.pools) {
                if (this.player.x >= p.xMin && this.player.x <= p.xMax &&
                    this.groundY >= p.yMin && this.groundY <= p.yMax) {
                    currentPool = p;
                    break;
                }
            }
        }
        let inWater = (currentPool !== null && this.jumpZ < 15);
        let speed = inWater ? 130 : 250;
        let dt = Math.min(this.game.loop.delta / 1000, 0.05);

        if (this.onSlide) {
            this.player.angle += 15;
            this.player.setVelocity(0, 0);
        } else if (this.ridingRaft) {
            // Player is seated on raft - position controlled by tween, no physics movement
            this.player.anims.play(this.selectedCharacter + '_idle', true);
        } else {
            let isLeft = (this.cursors.left && this.cursors.left.isDown) || 
                         (this.wasd && this.wasd.left && this.wasd.left.isDown) || 
                         this.mobileInput.left;

            let isRight = (this.cursors.right && this.cursors.right.isDown) || 
                          (this.wasd && this.wasd.right && this.wasd.right.isDown) || 
                          this.mobileInput.right;

            let isUp = (this.cursors.up && this.cursors.up.isDown) ||
                       (this.wasd && this.wasd.up && this.wasd.up.isDown) ||
                       this.mobileInput.up;

            let isDown = (this.cursors.down && this.cursors.down.isDown) ||
                         (this.wasd && this.wasd.down && this.wasd.down.isDown) ||
                         this.mobileInput.down;

            let jumpPressed = (this.spaceKey && Phaser.Input.Keyboard.JustDown(this.spaceKey)) ||
                              this.mobileInput.jump;

            let halfH = this.player.body.height / 2;

            // --- JUMPING LOGIC (2.5D Decoupled jumpZ) ---
            if (jumpPressed && !this.isJumping) {
                this.isJumping = true;
                this.jumpZ = 0;
                this.jumpV = inWater ? 380 : 500;
                this.mobileInput.jump = false;
            }

            if (this.isJumping) {
                const JUMP_GRAV = 1350;
                this.jumpZ += this.jumpV * dt;
                this.jumpV -= JUMP_GRAV * dt;

                if (this.jumpZ <= 0) {
                    this.jumpZ = 0;
                    this.jumpV = 0;
                    this.isJumping = false;
                }
            }

            // --- STAIRCASE TRAVERSAL SYSTEM (GEMINI.md Specs) ---
            // Stair 1: Deck 11 (floor y=1280) to Deck 12 (floor y=1000), x: 60 to 340. Slope: groundY = 1340 - x
            // Stair 2: Deck 12 (floor y=1000) to Deck 13 (floor y=760), x: 2060 to 2300. Slope: groundY = 760 + (x - 2060)
            if (!inWater) {
                // Drop through stairs only when holding Down AND pressing Jump
                if (this.currentStair && isDown && jumpPressed) {
                    if (this.currentStair === 'deck11_to_12') {
                        this.currentStair = null;
                        this.currentDeck = 'deck11';
                        this.groundY = 1255;
                        this.isJumping = false;
                        this.jumpZ = 0;
                        this.jumpV = 0;
                    } else if (this.currentStair === 'deck12_to_13') {
                        this.currentStair = null;
                        this.currentDeck = 'deck12';
                        this.groundY = 975;
                        this.isJumping = false;
                        this.jumpZ = 0;
                        this.jumpV = 0;
                    }
                }

                // 1. Detect entering / mounting stairs
                if (!this.currentStair) {
                    // Stair 1 Mounting:
                    // From Deck 11 base (x: 40..100, Deck 11 corridor y: 1210..1285)
                    // Walking right alone allows passing under stairs; pressing Up (or Up+Right) climbs Stair 1
                    if (this.player.x >= 40 && this.player.x <= 100 && this.groundY >= 1210 && this.groundY <= 1285 && isUp) {
                        this.currentStair = 'deck11_to_12';
                        this.groundY = 1340 - this.player.x;
                    }
                    // From Deck 12 top stair opening (x: 300..360, Deck 12 corridor y: 930..1010)
                    // Moving down (or down+left) enters stairwell to descend Stair 1; walking left/right alone passes along Deck 12
                    else if (this.player.x >= 300 && this.player.x <= 360 && this.groundY >= 930 && this.groundY <= 1010 && isDown) {
                        this.currentStair = 'deck11_to_12';
                        this.groundY = 1340 - this.player.x;
                    }
                    // Stair 2 Mounting:
                    // From Deck 12 base (x: 2240..2320, Deck 12 corridor y: 930..1010)
                    // Walking left/right alone allows passing under stairs; pressing Up (or Up+Left) climbs Stair 2
                    else if (this.player.x >= 2240 && this.player.x <= 2320 && this.groundY >= 930 && this.groundY <= 1010 && isUp) {
                        this.currentStair = 'deck12_to_13';
                        this.groundY = 760 + (this.player.x - 2060);
                    }
                    // From Deck 13 top stair opening (x: 2040..2100, Deck 13 corridor y: 690..770)
                    // Moving down (or down+right) enters stairwell to descend Stair 2; walking left/right alone passes along Deck 13
                    else if (this.player.x >= 2040 && this.player.x <= 2100 && this.groundY >= 690 && this.groundY <= 770 && isDown) {
                        this.currentStair = 'deck12_to_13';
                        this.groundY = 760 + (this.player.x - 2060);
                    }
                    // Continuous Collision Detection (CCD) for Airborne Landings on Stairs
                    else if (this.isJumping && this.jumpV < 0 && this.player.x >= 65 && this.player.x <= 335) {
                        let sY = 1340 - this.player.x;
                        if (Math.abs(this.groundY - sY) < 25) {
                            this.currentStair = 'deck11_to_12';
                            this.groundY = sY;
                            this.isJumping = false;
                            this.jumpZ = 0;
                            this.jumpV = 0;
                        }
                    } else if (this.isJumping && this.jumpV < 0 && this.player.x >= 2065 && this.player.x <= 2295) {
                        let sY = 760 + (this.player.x - 2060);
                        if (Math.abs(this.groundY - sY) < 25) {
                            this.currentStair = 'deck12_to_13';
                            this.groundY = sY;
                            this.isJumping = false;
                            this.jumpZ = 0;
                            this.jumpV = 0;
                        }
                    }
                }

                // 2. Process movement on stairs (Lockstep 45° velocity integration & multi-directional input)
                if (this.currentStair === 'deck11_to_12') {
                    // Stair 1 goes up-right:
                    // Up or Right climbs towards Deck 12
                    // Down or Left descends towards Deck 11
                    let climbUp = isRight || isUp;
                    let descendDown = isLeft || isDown;

                    if (climbUp && !descendDown) {
                        this.player.x += speed * dt;
                        this.groundY = 1340 - this.player.x;
                        this.player.setFlipX(false);
                        if (this.player.x >= 340) {
                            this.currentStair = null;
                            this.currentDeck = 'deck12';
                            this.player.x = 340;
                            this.groundY = 975;
                        }
                    } else if (descendDown && !climbUp) {
                        this.player.x -= speed * dt;
                        this.groundY = 1340 - this.player.x;
                        this.player.setFlipX(true);
                        if (this.player.x <= 60) {
                            this.currentStair = null;
                            this.currentDeck = 'deck11';
                            this.player.x = 60;
                            this.groundY = 1255;
                        }
                    }
                } else if (this.currentStair === 'deck12_to_13') {
                    // Stair 2 goes up-left:
                    // Up or Left climbs towards Deck 13
                    // Down or Right descends towards Deck 12
                    let climbUp = isLeft || isUp;
                    let descendDown = isRight || isDown;

                    if (climbUp && !descendDown) {
                        this.player.x -= speed * dt;
                        this.groundY = 760 + (this.player.x - 2060);
                        this.player.setFlipX(true);
                        if (this.player.x <= 2060) {
                            this.currentStair = null;
                            this.currentDeck = 'deck13';
                            this.player.x = 2060;
                            this.groundY = 735;
                        }
                    } else if (descendDown && !climbUp) {
                        this.player.x += speed * dt;
                        this.groundY = 760 + (this.player.x - 2060);
                        this.player.setFlipX(false);
                        if (this.player.x >= 2300) {
                            this.currentStair = null;
                            this.currentDeck = 'deck12';
                            this.player.x = 2300;
                            this.groundY = 975;
                        }
                    }
                } else {
                    // Regular deck movement in 2.5D
                    let vx = 0;
                    let vy = 0;

                    if (isLeft) vx -= speed;
                    if (isRight) vx += speed;
                    if (isUp) vy -= speed * 0.75;
                    if (isDown) vy += speed * 0.75;

                    if (vx !== 0 && vy !== 0) {
                        vx *= 0.7071;
                        vy *= 0.7071;
                    }

                    this.player.x += vx * dt;
                    this.groundY += vy * dt;

                    // Clamp groundY and player.x to current deck corridor
                    this.clampToDeckCorridor(inWater);
                }
            } else {
                // In water movement
                this.currentStair = null;
                let vx = 0;
                let vy = 0;
                if (isLeft) vx -= speed;
                if (isRight) vx += speed;
                if (isUp) vy -= speed * 0.75;
                if (isDown) vy += speed * 0.75;

                if (vx !== 0 && vy !== 0) {
                    vx *= 0.7071;
                    vy *= 0.7071;
                }

                this.player.x += vx * dt;
                this.groundY += vy * dt;
                this.clampToDeckCorridor(true);
            }

            // --- APPLY VISUAL Y POSITION & BODY SYNCHRONIZATION ---
            this.player.y = this.groundY - this.jumpZ;
            this.player.body.reset(this.player.x, this.player.y);

            // Ground Shadow Update
            if (this.playerShadow) {
                this.playerShadow.x = this.player.x;
                this.playerShadow.y = this.groundY + 18;
                this.playerShadow.setDepth(this.groundY - 1);
                if (inWater || this.ridingRaft || this.onSlide) {
                    this.playerShadow.setVisible(false);
                } else {
                    let scale = Math.max(0.4, 1 - (this.jumpZ / 300));
                    let alpha = Math.max(0.15, 0.45 - (this.jumpZ / 400));
                    this.playerShadow.setVisible(true).setScale(scale).setAlpha(alpha);
                }
            }

            // Flip facing direction based on horizontal movement
            if (this.currentStair === null) {
                if (isLeft) {
                    this.player.setFlipX(true);
                } else if (isRight) {
                    this.player.setFlipX(false);
                }
            }

            // Swimming visuals & animations
            if (inWater && !this.wasInWater) {
                this.currentFloatieColor = Phaser.Math.Between(0, 3);
            }

            if (inWater) {
                if (this.player.anims && this.player.anims.isPlaying) {
                    this.player.anims.stop();
                }
                this.player.setTexture(this.selectedCharacter + '_swim_' + this.currentFloatieColor);
                this.player.angle = (Math.sin(this.time.now / 150) * 10);
            } else {
                this.player.angle = 0;
                if (this.isJumping) {
                    this.player.anims.play(this.selectedCharacter + '_jump', true);
                } else if (this.currentStair !== null ? (isLeft || isRight || isUp || isDown) : (isLeft || isRight || isUp || isDown)) {
                    this.player.anims.play(this.selectedCharacter + '_walk', true);
                } else {
                    this.player.anims.play(this.selectedCharacter + '_idle', true);
                }
            }

            // Dynamic Y-Sorting for Player and Held Ice Cream
            this.player.setDepth(this.groundY);
            if (this.hasIceCream && this.iceCreamSprite) {
                this.iceCreamSprite.x = this.player.x + (this.player.flipX ? -15 : 15);
                this.iceCreamSprite.y = this.player.y - 10;
                this.iceCreamSprite.setDepth(this.groundY + 1);
            }
        }

        // AquaMouse boarding handling & UI visibility
        let canBoard = this.canBoardRaft();
        if (canBoard && !this.ridingRaft && !this.nearElevator) {
            this.boardPromptText.setVisible(true);
        } else {
            this.boardPromptText.setVisible(false);
        }

        // Enter key boards the AquaMouse
        if (canBoard && !this.nearElevator && this.enterKey && Phaser.Input.Keyboard.JustDown(this.enterKey)) {
            this.boardRaft();
        }

        // Midship Elevator handling & UI visibility
        if (this.nearElevator && !this.ridingRaft) {
            this.elevatorPromptText.setVisible(true);
            this.elevatorPromptText.x = this.player.x;
            this.elevatorPromptText.y = this.player.y - 60;
            
            if (this.enterKey && Phaser.Input.Keyboard.JustDown(this.enterKey)) {
                this.openElevatorMenu();
            }
        } else {
            this.elevatorPromptText.setVisible(false);
        }

        // Dynamic Funnel Vision Screen Animation
        this.updateFunnelVision(this.time.now, this.game.loop.delta);

        // Ambient Deck NPCs Movement & Interactions
        this.updateAmbientNPCs(this.time.now, this.game.loop.delta);

        // Update Capcom Retro Location Banner
        let loc = 'DECK 11: MAIN POOL';
        if (this.onSlide) {
            loc = 'AQUAMOUSE: TUBE SLIDE!';
        } else if (this.ridingRaft) {
            loc = 'AQUAMOUSE: RIDING RAFT!';
        } else if (inWater) {
            loc = 'SWIMMING: POOL';
        } else if (this.currentStair !== null) {
            loc = 'STAIRWAY TRAVERSAL';
        } else if (this.groundY < 500) {
            loc = 'DECK 13: AQUAMOUSE LAUNCH';
        } else if (this.groundY < 850) {
            if (this.player.x > 2060) {
                loc = 'DECK 13: CURRENTS BAR';
            } else if (this.player.x < 500) {
                loc = 'DECK 13: SPLASHDOWN POOL';
            } else {
                loc = 'DECK 13: AQUAMOUSE';
            }
        } else if (this.groundY < 1120) {
            if (this.player.x > 1850) {
                loc = 'DECK 12: HERO ZONE';
            } else if (this.player.x < 340) {
                loc = 'DECK 12: COVE CAFE';
            } else {
                loc = 'DECK 12: QUIET COVE';
            }
        } else {
            loc = (this.player.x > 1950) ? 'DECK 11: MARCELINE MARKET' : ((this.player.x < 500) ? 'DECK 11: SENSES SPA' : 'DECK 11: MAIN POOL');
        }
        let locFormatted = `[ ${loc} ]`;
        if (this.hudLocation && this.hudLocation.text !== locFormatted) {
            this.hudLocation.setText(locFormatted);
        }

        // Update Zero-Padded Score Counter ($0002500)
        let scoreStr = '$' + String(this.score).padStart(7, '0');
        if (this.hudScoreText && this.hudScoreText.text !== scoreStr) {
            this.hudScoreText.setText(scoreStr);
        }

        // Reset per-frame states
        this.wasInWater = inWater;
        this.inWater = false;
        this.nearRaft = false;
        this.nearElevator = false;
    }

    createFunnelVision() {
        const screenX = 940;
        const screenY = 1100;
        const screenW = 200;
        const screenH = 120;
        const centerX = screenX + screenW / 2; // 1040
        const centerY = screenY + screenH / 2; // 1160

        // 1. Red Disney Funnel Hull (behind screen, depth: 1)
        let funnelHull = this.add.graphics().setDepth(1);
        funnelHull.fillStyle(0x000000, 1);
        funnelHull.beginPath();
        funnelHull.moveTo(screenX - 16, screenY + screenH);
        funnelHull.lineTo(screenX - 6, screenY - 50);
        funnelHull.lineTo(screenX + screenW + 6, screenY - 50);
        funnelHull.lineTo(screenX + screenW + 16, screenY + screenH);
        funnelHull.closePath();
        funnelHull.fillPath();

        funnelHull.fillStyle(0xD82000, 1);
        funnelHull.beginPath();
        funnelHull.moveTo(screenX - 14, screenY + screenH);
        funnelHull.lineTo(screenX - 4, screenY - 48);
        funnelHull.lineTo(screenX + screenW + 4, screenY - 48);
        funnelHull.lineTo(screenX + screenW + 14, screenY + screenH);
        funnelHull.closePath();
        funnelHull.fillPath();

        // Funnel top cowl & yellow accent stripe
        funnelHull.fillStyle(0x000000, 1);
        funnelHull.fillRect(screenX - 8, screenY - 56, screenW + 16, 8);
        funnelHull.fillStyle(0xF8B800, 1);
        funnelHull.fillRect(screenX - 6, screenY - 48, screenW + 12, 3);

        // Mickey Silhouette on red funnel above screen
        this.add.image(centerX, screenY - 28, 'fv_mickey_logo').setScale(0.7).setDepth(2);

        // 2. Capcom Marquee Header Box (depth: 5)
        let marqueeG = this.add.graphics().setDepth(5);
        marqueeG.fillStyle(0x000000, 1);
        marqueeG.fillRect(centerX - 82, screenY - 22, 164, 20);
        marqueeG.fillStyle(0xF8B800, 1);
        marqueeG.fillRect(centerX - 80, screenY - 20, 160, 16);
        marqueeG.fillStyle(0x001030, 1);
        marqueeG.fillRect(centerX - 78, screenY - 18, 156, 12);

        this.fvMarqueeText = this.add.text(centerX, screenY - 12, '★ FUNNEL VISION ★', {
            fontSize: '9px', fill: '#F8B800', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(6);

        // Marquee light bulbs (row above and below)
        this.fvBulbs = [];
        for (let i = 0; i < 8; i++) {
            let bx = centerX - 70 + i * 20;
            let bTop = this.add.circle(bx, screenY - 21, 2, 0xF8B800).setDepth(6);
            let bBot = this.add.circle(bx, screenY - 3, 2, 0xFFFFFF).setDepth(6);
            this.fvBulbs.push({ top: bTop, bot: bBot });
        }

        // 3. Screen Bezel Frame & Speaker Columns (depth: 5)
        // IMPORTANT: Bezel is a HOLLOW frame surrounding the screen area (screenX, screenY, screenW, screenH).
        // It NEVER fills the screen interior so cartoon animations remain 100% visible.
        let bezel = this.add.graphics().setDepth(5);

        // Left Speaker Tower (x: screenX - 16 to screenX, y: screenY - 4 to screenY + screenH + 6)
        bezel.fillStyle(0x000000, 1);
        bezel.fillRect(screenX - 16, screenY - 4, 16, screenH + 10);
        bezel.fillStyle(0x182430, 1);
        bezel.fillRect(screenX - 15, screenY - 3, 14, screenH + 8);
        // Left Speaker Grill
        bezel.fillStyle(0x000810, 1);
        bezel.fillRect(screenX - 12, screenY + 6, 8, screenH - 12);
        bezel.fillStyle(0x587890, 1);
        for (let sy = screenY + 12; sy < screenY + screenH - 12; sy += 8) {
            bezel.fillRect(screenX - 10, sy, 4, 2);
        }
        // Left Corner Rivets
        bezel.fillStyle(0xF8B800, 1);
        bezel.fillRect(screenX - 13, screenY, 3, 3);
        bezel.fillRect(screenX - 13, screenY + screenH - 3, 3, 3);

        // Right Speaker Tower (x: screenX + screenW to screenX + screenW + 16, y: screenY - 4 to screenY + screenH + 6)
        bezel.fillStyle(0x000000, 1);
        bezel.fillRect(screenX + screenW, screenY - 4, 16, screenH + 10);
        bezel.fillStyle(0x182430, 1);
        bezel.fillRect(screenX + screenW + 1, screenY - 3, 14, screenH + 8);
        // Right Speaker Grill
        bezel.fillStyle(0x000810, 1);
        bezel.fillRect(screenX + screenW + 4, screenY + 6, 8, screenH - 12);
        bezel.fillStyle(0x587890, 1);
        for (let sy = screenY + 12; sy < screenY + screenH - 12; sy += 8) {
            bezel.fillRect(screenX + screenW + 6, sy, 4, 2);
        }
        // Right Corner Rivets
        bezel.fillStyle(0xF8B800, 1);
        bezel.fillRect(screenX + screenW + 10, screenY, 3, 3);
        bezel.fillRect(screenX + screenW + 10, screenY + screenH - 3, 3, 3);

        // Top Frame Bar (between speaker columns)
        bezel.fillStyle(0x000000, 1);
        bezel.fillRect(screenX, screenY - 4, screenW, 4);
        bezel.fillStyle(0x182430, 1);
        bezel.fillRect(screenX, screenY - 3, screenW, 3);

        // Bottom Frame Bar (between speaker columns)
        bezel.fillStyle(0x000000, 1);
        bezel.fillRect(screenX, screenY + screenH, screenW, 6);
        bezel.fillStyle(0x182430, 1);
        bezel.fillRect(screenX, screenY + screenH, screenW, 5);
        bezel.fillStyle(0xF8B800, 1);
        bezel.fillRect(screenX, screenY + screenH + 4, screenW, 1);

        // Inner screen borders and outer frame strokes
        bezel.lineStyle(2, 0x081018, 1);
        bezel.strokeRect(screenX - 1, screenY - 1, screenW + 2, screenH + 2);
        bezel.lineStyle(1, 0xF8B800, 0.7);
        bezel.strokeRect(screenX - 2, screenY - 2, screenW + 4, screenH + 4);
        bezel.lineStyle(1, 0x000000, 1);
        bezel.strokeRect(screenX - 16, screenY - 4, screenW + 32, screenH + 10);

        // 4. Screen Background Sky & Deck (depth: 2)
        this.fvSky = this.add.graphics().setDepth(2);
        this.fvSky.fillStyle(0x58B8F8, 1);
        this.fvSky.fillRect(screenX, screenY, screenW, 75);
        this.fvSky.fillStyle(0x80D0F8, 1);
        this.fvSky.fillRect(screenX, screenY + 50, screenW, 25);
        // Steamboat wooden deck
        this.fvSky.fillStyle(0x783C00, 1);
        this.fvSky.fillRect(screenX, screenY + 75, screenW, 45);
        this.fvSky.fillStyle(0x482000, 1);
        for (let dx = screenX; dx < screenX + screenW; dx += 20) {
            this.fvSky.fillRect(dx, screenY + 75, 1, 45);
        }
        // Brass deck rail
        this.fvSky.fillStyle(0xF8B800, 1);
        this.fvSky.fillRect(screenX, screenY + 74, screenW, 2);

        // Animated River Waves at bottom of screen (depth: 2)
        this.fvWaves = this.add.tileSprite(screenX, screenY + 104, screenW, 16, 'fv_wave_0').setOrigin(0, 0).setDepth(2);

        // Steamboat Smokestacks in background (depth: 2)
        this.fvStackLeft = this.add.image(screenX + 35, screenY + 62, 'fv_smokestack').setDepth(2);
        this.fvStackRight = this.add.image(screenX + screenW - 35, screenY + 62, 'fv_smokestack').setDepth(2);

        // Steam Puffs Pool (depth: 3)
        this.fvSteamPuffs = [];
        for (let i = 0; i < 4; i++) {
            let p = this.add.image(0, 0, 'fv_steam_0').setDepth(3).setVisible(false);
            this.fvSteamPuffs.push(p);
        }

        // Steamboat Willie Mickey Sprite (depth: 3)
        this.fvMickey = this.add.image(centerX, screenY + 68, 'fv_mickey_0').setDepth(3);

        // Steamboat Wheel (depth: 4)
        this.fvWheel = this.add.image(centerX, screenY + 78, 'fv_wheel_0').setDepth(4);

        // Minnie Mouse Sprite (for celebration scene) (depth: 3)
        this.fvMinnie = this.add.image(centerX + 35, screenY + 68, 'fv_minnie_0').setDepth(3).setVisible(false);

        // Floating Musical Notes & Sparkles Pool (depth: 4)
        this.fvFloatingItems = [];
        for (let i = 0; i < 6; i++) {
            let item = this.add.image(0, 0, 'fv_note_0').setDepth(4).setVisible(false);
            item.baseX = 0;
            item.floatSpeed = 0;
            item.wobblePhase = 0;
            this.fvFloatingItems.push(item);
        }

        // Intermission Presentation Title Banner (Scene 3) (depth: 4)
        this.fvIntermissionContainer = this.add.container(centerX, centerY).setDepth(4).setVisible(false);
        let bannerBg = this.add.graphics();
        bannerBg.fillStyle(0x001024, 0.94);
        bannerBg.fillRect(-90, -48, 180, 96);
        bannerBg.lineStyle(2, 0xF8B800, 1);
        bannerBg.strokeRect(-88, -46, 176, 92);
        let bannerLogo = this.add.image(0, -20, 'fv_mickey_logo').setScale(0.85);
        let bannerTitle1 = this.add.text(0, 4, '★ DISNEY DESTINY ★', {
            fontSize: '8px', fill: '#F8B800', fontFamily: '"Press Start 2P", monospace', align: 'center'
        }).setOrigin(0.5);
        let bannerTitle2 = this.add.text(0, 18, 'CARTOON CLASSIC', {
            fontSize: '7px', fill: '#58B8F8', fontFamily: '"Press Start 2P", monospace', align: 'center'
        }).setOrigin(0.5);
        let bannerTitle3 = this.add.text(0, 32, 'NOW PLAYING', {
            fontSize: '6px', fill: '#FFFFFF', fontFamily: '"Press Start 2P", monospace', align: 'center'
        }).setOrigin(0.5);
        this.fvIntermissionContainer.add([bannerBg, bannerLogo, bannerTitle1, bannerTitle2, bannerTitle3]);

        // Caption Bar for Scene 2 (depth: 4)
        this.fvCaption = this.add.text(centerX, screenY + 12, '', {
            fontSize: '6px', fill: '#FFD700', backgroundColor: '#001024',
            padding: { x: 4, y: 2 }, fontFamily: '"Press Start 2P", monospace', align: 'center'
        }).setOrigin(0.5).setDepth(4).setVisible(false);

        // 5. Jumbotron CRT Scanlines & Screen Glass (depth: 4)
        this.add.image(centerX, centerY, 'fv_scanlines').setDepth(4);

        // Internal timing and state
        this.fvTime = 0;
        this.fvLastBulbToggle = 0;
        this.fvBulbState = false;
        this.fvNextSteamTime = 0;
        this.fvNextNoteTime = 0;
        this.fvScreenBounds = { x: screenX, y: screenY, w: screenW, h: screenH, cx: centerX, cy: centerY };
    }

    updateFunnelVision(time, delta) {
        if (!this.fvScreenBounds) return;
        let dt = delta / 1000;
        this.fvTime += dt;

        let b = this.fvScreenBounds;
        let cycle = this.fvTime % 22; // 22-second loop

        // 1. Toggle Marquee Light Bulbs
        if (time - this.fvLastBulbToggle > 350) {
            this.fvLastBulbToggle = time;
            this.fvBulbState = !this.fvBulbState;
            if (this.fvBulbs) {
                this.fvBulbs.forEach((pair, idx) => {
                    let cTop = ((idx % 2 === 0) ^ this.fvBulbState) ? 0xF8B800 : 0xFFFFFF;
                    let cBot = ((idx % 2 !== 0) ^ this.fvBulbState) ? 0xF8B800 : 0xFFFFFF;
                    pair.top.setFillStyle(cTop);
                    pair.bot.setFillStyle(cBot);
                });
            }
        }

        // 2. Scroll River Waves
        if (this.fvWaves) {
            this.fvWaves.tilePositionX += 28 * dt;
            let waveFrame = (Math.floor(this.fvTime * 3) % 2 === 0) ? 'fv_wave_0' : 'fv_wave_1';
            if (this.fvWaves.texture.key !== waveFrame) {
                this.fvWaves.setTexture(waveFrame);
            }
        }

        // 3. Update Steam Puffs
        if (this.fvSteamPuffs) {
            this.fvSteamPuffs.forEach(p => {
                if (p.visible) {
                    p.y -= 20 * dt;
                    p.x += Math.sin(p.y * 0.08) * 6 * dt;
                    p.alpha -= 0.6 * dt;
                    if (p.alpha <= 0.1 || p.y < b.y + 6) {
                        p.setVisible(false);
                    }
                }
            });

            // Spawn Steam Puffs periodically (every 1.1s)
            if (this.fvTime > this.fvNextSteamTime) {
                this.fvNextSteamTime = this.fvTime + 1.1;
                let spawnStack = (Math.random() < 0.5) ? this.fvStackLeft : this.fvStackRight;
                let idlePuff = this.fvSteamPuffs.find(p => !p.visible);
                if (idlePuff && spawnStack) {
                    idlePuff.setPosition(spawnStack.x, spawnStack.y - 18);
                    let puffKey = (Math.random() < 0.4) ? 'fv_steam_0' : 'fv_steam_1';
                    idlePuff.setTexture(puffKey);
                    idlePuff.setAlpha(1.0);
                    idlePuff.setVisible(true);
                }
            }
        }

        // 4. Update Floating Notes / Hearts
        if (this.fvFloatingItems) {
            this.fvFloatingItems.forEach(item => {
                if (item.visible) {
                    item.y -= item.floatSpeed * dt;
                    item.x = item.baseX + Math.sin((item.y + item.wobblePhase) * 0.1) * 10;
                    item.alpha -= 0.45 * dt;
                    if (item.alpha <= 0.1 || item.y < b.y + 15) {
                        item.setVisible(false);
                    }
                }
            });
        }

        // 5. Scene Management
        if (cycle < 9.5) {
            // === SCENE 1: STEAMBOAT WILLIE (Mickey at the Helm) ===
            this.fvMickey.setVisible(true);
            this.fvWheel.setVisible(true);
            this.fvMinnie.setVisible(false);
            this.fvIntermissionContainer.setVisible(false);
            this.fvCaption.setVisible(false);

            this.fvMickey.setPosition(b.cx, b.y + 68);
            this.fvWheel.setPosition(b.cx, b.y + 78);

            // Steering & whistling animation states
            let subT = cycle % 4.0;
            if (subT < 1.0) {
                this.fvMickey.setTexture('fv_mickey_0');
                this.fvWheel.setAngle(Math.sin(time * 0.004) * 6);
            } else if (subT < 2.0) {
                this.fvMickey.setTexture('fv_mickey_1');
                this.fvWheel.setAngle(-22);
            } else if (subT < 3.0) {
                this.fvMickey.setTexture('fv_mickey_2');
                this.fvWheel.setAngle(0);
            } else {
                this.fvMickey.setTexture('fv_mickey_3');
                this.fvWheel.setAngle(22);
            }

            // Spawn whistling musical notes from Mickey's mouth
            if (this.fvTime > this.fvNextNoteTime) {
                this.fvNextNoteTime = this.fvTime + 0.9;
                let idleNote = this.fvFloatingItems.find(n => !n.visible);
                if (idleNote) {
                    idleNote.setTexture((Math.random() < 0.5) ? 'fv_note_0' : 'fv_note_1');
                    idleNote.baseX = b.cx + 8;
                    idleNote.setPosition(idleNote.baseX, b.y + 56);
                    idleNote.floatSpeed = 28 + Math.random() * 8;
                    idleNote.wobblePhase = Math.random() * 10;
                    idleNote.setAlpha(1.0);
                    idleNote.setVisible(true);
                }
            }
        } else if (cycle < 16.0) {
            // === SCENE 2: HIGH SEAS DANCE & CELEBRATION ===
            this.fvMickey.setVisible(true);
            this.fvMinnie.setVisible(true);
            this.fvWheel.setVisible(true);
            this.fvIntermissionContainer.setVisible(false);
            this.fvCaption.setVisible(true);
            this.fvCaption.setText('★ HIGH SEAS CELEBRATION ★');

            this.fvMickey.setPosition(b.cx - 24, b.y + 68);
            this.fvWheel.setPosition(b.cx, b.y + 80);
            this.fvWheel.setAngle(0);
            this.fvMinnie.setPosition(b.cx + 26, b.y + 68);

            // Mickey happy wave
            this.fvMickey.setTexture((Math.sin(time * 0.008) > 0) ? 'fv_mickey_2' : 'fv_mickey_0');
            // Minnie clapping animation
            this.fvMinnie.setTexture((Math.sin(time * 0.008) > 0) ? 'fv_minnie_0' : 'fv_minnie_1');

            // Spawn floating hearts & stars
            if (this.fvTime > this.fvNextNoteTime) {
                this.fvNextNoteTime = this.fvTime + 0.8;
                let idleItem = this.fvFloatingItems.find(n => !n.visible);
                if (idleItem) {
                    idleItem.setTexture((Math.random() < 0.5) ? 'fv_heart' : 'fv_star');
                    idleItem.baseX = b.cx + (Math.random() * 30 - 15);
                    idleItem.setPosition(idleItem.baseX, b.y + 60);
                    idleItem.floatSpeed = 24 + Math.random() * 6;
                    idleItem.wobblePhase = Math.random() * 10;
                    idleItem.setAlpha(1.0);
                    idleItem.setVisible(true);
                }
            }
        } else {
            // === SCENE 3: FEATURE PRESENTATION MARQUEE ===
            this.fvMickey.setVisible(false);
            this.fvMinnie.setVisible(false);
            this.fvWheel.setVisible(false);
            this.fvCaption.setVisible(false);
            this.fvIntermissionContainer.setVisible(true);

            // Pulse logo gently
            let scale = 0.85 + Math.sin(time * 0.005) * 0.05;
            this.fvIntermissionContainer.setScale(scale);

            // Spawn twinkling stars around the screen
            if (this.fvTime > this.fvNextNoteTime) {
                this.fvNextNoteTime = this.fvTime + 0.6;
                let idleStar = this.fvFloatingItems.find(n => !n.visible);
                if (idleStar) {
                    idleStar.setTexture('fv_star');
                    idleStar.baseX = b.x + 20 + Math.random() * (b.w - 40);
                    idleStar.setPosition(idleStar.baseX, b.y + 20 + Math.random() * (b.h - 40));
                    idleStar.floatSpeed = 10;
                    idleStar.wobblePhase = Math.random() * 10;
                    idleStar.setAlpha(1.0);
                    idleStar.setVisible(true);
                }
            }
        }
    }

    createAmbientNPCs() {
        this.ambientNPCs = [];

        // 1. Reusable 8-bit Capcom Speech Bubble
        this.npcSpeechBox = this.add.graphics().setDepth(2500).setVisible(false);
        this.npcSpeechText = this.add.text(0, 0, '', {
            fontSize: '7px',
            fill: '#F8B800',
            fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000',
            strokeThickness: 1,
            align: 'center',
            wordWrap: { width: 140 }
        }).setOrigin(0, 0).setDepth(2501).setVisible(false);
        this.npcCurrentSpeaker = null;
        this.npcSpeechEndTime = 0;

        // 2. Spawn Walking Deck NPCs
        // Officer Davis (Deck 11 - outside Senses Spa / pool approach)
        let off1 = this.add.sprite(550, 1250, 'npc_officer_idle').setDepth(1250);
        off1.anims.play('npc_officer_walk');
        this.ambientNPCs.push({
            name: 'Officer Davis',
            type: 'walker',
            sprite: off1,
            minX: 430,
            maxX: 760,
            speed: 30,
            dir: 1,
            state: 'walk',
            pauseTimer: 0,
            walkAnim: 'npc_officer_walk',
            idleAnim: 'npc_officer_idle',
            quotes: [
                'WELCOME TO DECK 11!',
                'SMOOTH SAILING TODAY!',
                'ENJOY THE DISNEY DESTINY!'
            ],
            bubbleOffset: 28,
            nextSpeechTime: 0
        });

        // Tourist Bob (Deck 11 - outside Eye Scream Treats)
        let tour1 = this.add.sprite(1680, 1250, 'npc_tourist_idle').setDepth(1250);
        tour1.anims.play('npc_tourist_walk');
        this.ambientNPCs.push({
            name: 'Tourist Bob',
            type: 'walker',
            sprite: tour1,
            minX: 1560,
            maxX: 1960,
            speed: 32,
            dir: -1,
            state: 'walk',
            pauseTimer: 0,
            walkAnim: 'npc_tourist_walk',
            idleAnim: 'npc_tourist_idle',
            quotes: [
                'FREE SOFT SERVE ON DECK!',
                'LOOK AT THAT OCEAN VIEW!',
                'WHAT A WONDERFUL CRUISE!'
            ],
            bubbleOffset: 28,
            nextSpeechTime: 0
        });

        // Active Guest Jordan (Deck 12 - promenade towards Hero Zone)
        let tour2 = this.add.sprite(1100, 970, 'npc_tourist_idle').setDepth(970);
        tour2.anims.play('npc_tourist_walk');
        this.ambientNPCs.push({
            name: 'Jordan',
            type: 'walker',
            sprite: tour2,
            minX: 860,
            maxX: 1460,
            speed: 34,
            dir: 1,
            state: 'walk',
            pauseTimer: 0,
            walkAnim: 'npc_tourist_walk',
            idleAnim: 'npc_tourist_idle',
            quotes: [
                'HEADED TO HERO ZONE!',
                'WEATHER IS PERFECT!',
                'QUIET COVE IS RELAXING.'
            ],
            bubbleOffset: 28,
            nextSpeechTime: 0
        });

        // Officer Henderson (Deck 13 - AquaMouse Ride Operator)
        let off2 = this.add.sprite(1060, 730, 'npc_officer_idle').setDepth(730);
        off2.anims.play('npc_officer_walk');
        this.ambientNPCs.push({
            name: 'Officer Henderson',
            type: 'walker',
            sprite: off2,
            minX: 960,
            maxX: 1150,
            speed: 28,
            dir: 1,
            state: 'walk',
            pauseTimer: 0,
            walkAnim: 'npc_officer_walk',
            idleAnim: 'npc_officer_idle',
            quotes: [
                'READY FOR AQUAMOUSE?',
                'HOLD ON TO YOUR HATS!',
                'WILD WATER COASTER AT SEA!'
            ],
            bubbleOffset: 28,
            nextSpeechTime: 0
        });

        // Guest Elena (Deck 13 - aft promenade towards Currents Bar)
        let tour3 = this.add.sprite(2250, 730, 'npc_tourist_idle').setDepth(730);
        tour3.anims.play('npc_tourist_walk');
        this.ambientNPCs.push({
            name: 'Elena',
            type: 'walker',
            sprite: tour3,
            minX: 2160,
            maxX: 2360,
            speed: 30,
            dir: -1,
            state: 'walk',
            pauseTimer: 0,
            walkAnim: 'npc_tourist_walk',
            idleAnim: 'npc_tourist_idle',
            quotes: [
                'WHAT A VIEW FROM DECK 13!',
                'HEADING TO CURRENTS BAR!',
                'THE WHOLE SHIP LOOKS AMAZING!'
            ],
            bubbleOffset: 28,
            nextSpeechTime: 0
        });

        // 3. Spawn Lounging Sunbathers on Deck Chairs
        // Sunbather Chloe (Deck 11 poolside lounger)
        this.add.image(1360, 1255, 'npc_lounge_chair').setDepth(1254);
        let lounger1 = this.add.sprite(1360, 1253, 'npc_lounger_0').setDepth(1255);
        lounger1.anims.play('npc_lounger_relax');
        this.ambientNPCs.push({
            name: 'Chloe',
            type: 'lounger',
            sprite: lounger1,
            quotes: [
                'AHHH, TOTAL PARADISE...',
                'SUNNY SKIES ALL DAY!',
                'PASS THE PINA COLADA!'
            ],
            bubbleOffset: 18,
            nextSpeechTime: 0
        });

        // Guest Sarah (Deck 12 Quiet Cove lounger)
        this.add.image(420, 975, 'npc_lounge_chair').setDepth(974);
        let lounger2 = this.add.sprite(420, 973, 'npc_lounger_0').setDepth(975);
        lounger2.anims.play('npc_lounger_relax');
        this.ambientNPCs.push({
            name: 'Sarah',
            type: 'lounger',
            sprite: lounger2,
            quotes: [
                'QUIET COVE IS SO PEACEFUL.',
                'BEST SPOT FOR A SIESTA.',
                'HEAR THE WAVES RUSH BY...'
            ],
            bubbleOffset: 18,
            nextSpeechTime: 0
        });

        // Guest Marcus (Deck 12 Cove Cafe lounger)
        this.add.image(240, 975, 'npc_lounge_chair').setDepth(974);
        let lounger3 = this.add.sprite(240, 973, 'npc_lounger_0').setDepth(975);
        lounger3.anims.play('npc_lounger_relax');
        this.ambientNPCs.push({
            name: 'Marcus',
            type: 'lounger',
            sprite: lounger3,
            quotes: [
                'COVE CAFE ESPRESSO IS PERFECTION!',
                'SO PEACEFUL HERE ON DECK 12.',
                'LOVING THE OCEAN BREEZE!'
            ],
            bubbleOffset: 18,
            nextSpeechTime: 0
        });

        // 4. Spawn Swimming NPCs in Pools (Submerged between pool floor and front coping)
        // Swimmer Tommy (Deck 11 Main Pool in front of Funnel Vision)
        let swim1 = this.add.sprite(1020, 1255, 'npc_swimmer_0').setDepth(1255);
        swim1.anims.play('npc_swimmer_bob');
        this.ambientNPCs.push({
            name: 'Tommy',
            type: 'swimmer',
            sprite: swim1,
            minX: 940,
            maxX: 1140,
            baseY: 1255,
            speed: 18,
            dir: 1,
            phase: 0,
            quotes: [
                'SPLISH SPLASH!',
                'WATCHING CARTOONS IN WATER!',
                'THE POOL IS SO WARM!'
            ],
            bubbleOffset: 20,
            nextSpeechTime: 0
        });

        // Swimmer Alex (Deck 12 Quiet Cove Pool)
        let swim2 = this.add.sprite(620, 975, 'npc_swimmer_0').setDepth(975);
        swim2.anims.play('npc_swimmer_bob');
        this.ambientNPCs.push({
            name: 'Alex',
            type: 'swimmer',
            sprite: swim2,
            minX: 560,
            maxX: 700,
            baseY: 975,
            speed: 16,
            dir: -1,
            phase: 1.5,
            quotes: [
                'SO REFRESHING!',
                'FLOATING IN PARADISE.',
                'QUIET COVE IS THE BEST!'
            ],
            bubbleOffset: 20,
            nextSpeechTime: 0
        });

        // Swimmer Lily (Deck 13 Splashdown Pool)
        let swim3 = this.add.sprite(340, 735, 'npc_swimmer_0').setDepth(735);
        swim3.anims.play('npc_swimmer_bob');
        this.ambientNPCs.push({
            name: 'Lily',
            type: 'swimmer',
            sprite: swim3,
            minX: 270,
            maxX: 430,
            baseY: 735,
            speed: 16,
            dir: 1,
            phase: 3.0,
            quotes: [
                'THAT SLIDE WAS EPIC!',
                'LOOK AT THE BIG SPLASH!',
                'I WANNA GO AGAIN!'
            ],
            bubbleOffset: 20,
            nextSpeechTime: 0
        });
    }

    showNPCSpeech(npc, text, time) {
        if (!this.npcSpeechBox || !this.npcSpeechText) return;
        this.npcCurrentSpeaker = npc;
        this.npcSpeechText.setText(text);

        let padX = 8;
        let padY = 5;
        let w = this.npcSpeechText.width + padX * 2;
        let h = this.npcSpeechText.height + padY * 2;

        let bx = npc.sprite.x - w / 2;
        let by = npc.sprite.y - (npc.bubbleOffset || 28) - h;

        // Keep inside camera / world bounds
        bx = Phaser.Math.Clamp(bx, 20, 2380 - w);

        this.npcSpeechBox.clear();
        // Outer black border
        this.npcSpeechBox.fillStyle(0x000000, 1);
        this.npcSpeechBox.fillRect(bx - 2, by - 2, w + 4, h + 4);
        // Navy Capcom dialogue background
        this.npcSpeechBox.fillStyle(0x001024, 0.95);
        this.npcSpeechBox.fillRect(bx, by, w, h);
        // Gold 1px border
        this.npcSpeechBox.lineStyle(1, 0xF8B800, 1);
        this.npcSpeechBox.strokeRect(bx, by, w, h);

        // Downward pointer arrow
        let arrowX = Phaser.Math.Clamp(npc.sprite.x, bx + 8, bx + w - 8);
        let arrowY = by + h;
        this.npcSpeechBox.fillStyle(0x001024, 0.95);
        this.npcSpeechBox.fillTriangle(arrowX - 4, arrowY, arrowX + 4, arrowY, arrowX, arrowY + 6);
        this.npcSpeechBox.lineStyle(1, 0xF8B800, 1);
        this.npcSpeechBox.lineBetween(arrowX - 4, arrowY, arrowX, arrowY + 6);
        this.npcSpeechBox.lineBetween(arrowX, arrowY + 6, arrowX + 4, arrowY);

        this.npcSpeechText.setPosition(bx + padX, by + padY);
        this.npcSpeechBox.setVisible(true);
        this.npcSpeechText.setVisible(true);
        this.npcSpeechEndTime = time + 2500;
    }

    updateAmbientNPCs(time, delta) {
        if (!this.ambientNPCs) return;
        let dt = delta / 1000;

        // 1. Update NPC Movement & States
        for (let npc of this.ambientNPCs) {
            if (npc.type === 'walker') {
                if (npc.state === 'walk') {
                    npc.sprite.x += npc.dir * npc.speed * dt;
                    if (npc.dir > 0 && npc.sprite.x >= npc.maxX) {
                        npc.sprite.x = npc.maxX;
                        npc.state = 'pause';
                        npc.pauseTimer = 1.5 + Math.random() * 1.5;
                        npc.sprite.anims.play(npc.idleAnim, true);
                    } else if (npc.dir < 0 && npc.sprite.x <= npc.minX) {
                        npc.sprite.x = npc.minX;
                        npc.state = 'pause';
                        npc.pauseTimer = 1.5 + Math.random() * 1.5;
                        npc.sprite.anims.play(npc.idleAnim, true);
                    }
                } else if (npc.state === 'pause') {
                    npc.pauseTimer -= dt;
                    if (npc.pauseTimer <= 0) {
                        npc.dir *= -1;
                        npc.sprite.setFlipX(npc.dir < 0);
                        npc.state = 'walk';
                        npc.sprite.anims.play(npc.walkAnim, true);
                    }
                }
                npc.sprite.setDepth(Math.round(npc.sprite.y));
            } else if (npc.type === 'swimmer') {
                npc.sprite.x += npc.dir * npc.speed * dt;
                if (npc.dir > 0 && npc.sprite.x >= npc.maxX) {
                    npc.sprite.x = npc.maxX;
                    npc.dir = -1;
                    npc.sprite.setFlipX(true);
                } else if (npc.dir < 0 && npc.sprite.x <= npc.minX) {
                    npc.sprite.x = npc.minX;
                    npc.dir = 1;
                    npc.sprite.setFlipX(false);
                }
                npc.sprite.y = npc.baseY + Math.sin(time * 0.0035 + npc.phase) * 2.5;
                npc.sprite.setDepth(Math.round(npc.sprite.y));
            }
        }

        // 2. Proximity Speech Bubble Detection
        if (this.player) {
            let playerDeckY = (this.groundY !== undefined) ? this.groundY : this.player.y;
            // If bubble currently showing, check if expired or player moved away
            if (this.npcSpeechBox && this.npcSpeechBox.visible) {
                if (time > this.npcSpeechEndTime) {
                    this.npcSpeechBox.setVisible(false);
                    this.npcSpeechText.setVisible(false);
                    this.npcCurrentSpeaker = null;
                } else if (this.npcCurrentSpeaker) {
                    let d = Phaser.Math.Distance.Between(this.player.x, playerDeckY, this.npcCurrentSpeaker.sprite.x, this.npcCurrentSpeaker.sprite.y);
                    if (d > 120) {
                        this.npcSpeechBox.setVisible(false);
                        this.npcSpeechText.setVisible(false);
                        this.npcCurrentSpeaker = null;
                    }
                }
            }

            // Check if player is near any NPC to trigger greeting
            if (!this.npcSpeechBox || !this.npcSpeechBox.visible) {
                for (let npc of this.ambientNPCs) {
                    if (time < npc.nextSpeechTime) continue;
                    let dx = Math.abs(this.player.x - npc.sprite.x);
                    let dy = Math.abs(playerDeckY - npc.sprite.y);
                    if (dx < 65 && dy < 45) {
                        let quote = Phaser.Utils.Array.GetRandom(npc.quotes);
                        this.showNPCSpeech(npc, quote, time);
                        npc.nextSpeechTime = time + 7000;
                        break;
                    }
                }
            }
        }
    }

    createInGameMenu() {
        this.isMenuOpen = false;
        this.menuSelectedIndex = 0;
        this.lastMenuActionTime = 0;
        this.lastMenuNavTime = 0;
        this.lastMenuToggleTime = 0;
        this.menuItems = [
            { text: 'CONTINUE', action: () => this.closeInGameMenu() },
            { text: 'RESTART LEVEL', action: () => this.restartLevel() },
            { text: 'CHANGE CHARACTER', action: () => this.scene.start('CharacterSelectScene') },
            { text: 'TITLE SCREEN', action: () => this.scene.start('TitleScene') }
        ];

        if (this.input.keyboard && !this.enterKey) {
            this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        }

        // Direct scene GameObjects (no Container) for reliable touch & input handling
        this.menuOverlay = this.add.graphics().setScrollFactor(0).setDepth(4000).setVisible(false);
        this.menuBox = this.add.graphics().setScrollFactor(0).setDepth(4001).setVisible(false);

        // Header Title
        this.menuTitle = this.add.text(0, 0, 'PAUSE MENU', {
            fontSize: '14px', fill: '#F8B800', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 4, align: 'center'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(4002).setVisible(false);

        this.menuSub = this.add.text(0, 0, '★ DISNEY DESTINY ★', {
            fontSize: '8px', fill: '#58B8F8', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 2, align: 'center'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(4002).setVisible(false);

        // Cursor arrow
        this.menuCursor = this.add.text(0, 0, '►', {
            fontSize: '12px', fill: '#F8B800', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5).setScrollFactor(0).setDepth(4002).setVisible(false);

        // Item text objects
        this.menuTextObjects = [];
        this.menuItems.forEach((item, index) => {
            let txt = this.add.text(0, 0, item.text, {
                fontSize: '11px', fill: '#FFFFFF', fontFamily: '"Press Start 2P", monospace',
                stroke: '#000000', strokeThickness: 3
            }).setOrigin(0, 0.5).setScrollFactor(0).setDepth(4002).setVisible(false).setInteractive({ useHandCursor: true });

            const triggerItem = () => {
                this.executeMenuAction(index);
            };

            txt.on('pointerdown', triggerItem);
            txt.on('pointerup', triggerItem);
            txt.on('pointerover', () => this.setMenuIndex(index));

            this.menuTextObjects.push(txt);
        });

        // Prompt helper at bottom of box
        this.menuHelper = this.add.text(0, 0, '[ ARROWS / ENTER OR TAP ]', {
            fontSize: '8px', fill: '#B0C0D0', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 2, align: 'center'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(4002).setVisible(false);

        // Global pointer listener on scene input for 100% reliable mobile touch hit detection
        this.input.on('pointerdown', (ptr) => {
            if (this.isMenuOpen) {
                let idx = this.getMenuItemAt(ptr.x, ptr.y);
                if (idx !== -1) {
                    this.executeMenuAction(idx);
                }
            }
        });
        this.input.on('pointerup', (ptr) => {
            if (this.isMenuOpen) {
                let idx = this.getMenuItemAt(ptr.x, ptr.y);
                if (idx !== -1) {
                    this.executeMenuAction(idx);
                }
            }
        });

        // Native DOM keyboard listener (guarantees Enter, Space, Arrows, P, M, ESC work regardless of canvas focus state)
        const onNativeKeyDown = (e) => {
            if (!this.sys || !this.sys.isActive()) return;
            if (e.key === 'Escape' || e.code === 'Escape' ||
                e.key === 'p' || e.key === 'P' || e.code === 'KeyP' ||
                e.key === 'm' || e.key === 'M' || e.code === 'KeyM') {
                e.preventDefault();
                this.toggleInGameMenu();
                return;
            }
            if (this.isMenuOpen) {
                if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.code === 'KeyW' || e.code === 'ArrowUp') {
                    e.preventDefault();
                    this.navigateMenu(-1);
                } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S' || e.code === 'KeyS' || e.code === 'ArrowDown') {
                    e.preventDefault();
                    this.navigateMenu(1);
                } else if (e.key === 'Enter' || e.code === 'Enter' || e.keyCode === 13 || e.key === ' ' || e.code === 'Space') {
                    e.preventDefault();
                    this.executeMenuAction(this.menuSelectedIndex);
                }
            }
        };
        window.addEventListener('keydown', onNativeKeyDown);
        this.events.once('shutdown', () => {
            window.removeEventListener('keydown', onNativeKeyDown);
        });
    }

    getMenuItemAt(x, y) {
        if (!this.isMenuOpen || !this.menuBoxCoords) return -1;
        let b = this.menuBoxCoords;
        if (x < b.x + 8 || x > b.x + b.w - 8) return -1;
        let startY = b.y + 68;
        let itemSpacing = 30;
        for (let i = 0; i < this.menuItems.length; i++) {
            let cy = startY + i * itemSpacing;
            if (y >= cy - 15 && y <= cy + 15) {
                return i;
            }
        }
        return -1;
    }

    executeMenuAction(index) {
        let now = Date.now();
        if (this.lastMenuActionTime && (now - this.lastMenuActionTime < 350)) return;
        this.lastMenuActionTime = now;
        this.setMenuIndex(index);
        this.executeMenuItem(index);
    }

    toggleInGameMenu() {
        let now = Date.now();
        if (this.lastMenuToggleTime && (now - this.lastMenuToggleTime < 250)) return;
        this.lastMenuToggleTime = now;
        if (this.isMenuOpen) {
            this.closeInGameMenu();
        } else {
            this.openInGameMenu();
        }
    }

    openInGameMenu() {
        this.isMenuOpen = true;
        this.menuSelectedIndex = 0;
        if (this.player && this.player.body) {
            this.player.setVelocity(0, 0);
        }
        if (this.mobileInput) {
            this.mobileInput.left = false;
            this.mobileInput.right = false;
            this.mobileInput.up = false;
            this.mobileInput.down = false;
        }
        this.layoutInGameMenu(this.scale.width, this.scale.height);
        this.setMenuVisible(true);
        this.setMenuIndex(0);
    }

    closeInGameMenu() {
        this.isMenuOpen = false;
        if (this.cursorTween) {
            this.cursorTween.stop();
            this.cursorTween = null;
        }
        this.setMenuVisible(false);
    }

    setMenuVisible(visible) {
        if (this.menuOverlay) this.menuOverlay.setVisible(visible);
        if (this.menuBox) this.menuBox.setVisible(visible);
        if (this.menuTitle) this.menuTitle.setVisible(visible);
        if (this.menuSub) this.menuSub.setVisible(visible);
        if (this.menuCursor) this.menuCursor.setVisible(visible);
        if (this.menuHelper) this.menuHelper.setVisible(visible);
        if (this.menuTextObjects) {
            this.menuTextObjects.forEach(t => {
                t.setVisible(visible);
                if (t.input) t.input.enabled = visible;
            });
        }
    }

    navigateMenu(dir) {
        let now = Date.now();
        if (this.lastMenuNavTime && (now - this.lastMenuNavTime < 180)) return;
        this.lastMenuNavTime = now;
        let count = this.menuItems.length;
        this.setMenuIndex((this.menuSelectedIndex + dir + count) % count);
    }

    setMenuIndex(index) {
        this.menuSelectedIndex = index;
        if (!this.menuTextObjects || !this.menuBoxCoords) return;
        this.menuTextObjects.forEach((txt, i) => {
            if (i === index) {
                txt.setFill('#F8B800');
                let cursorBaseX = this.menuBoxCoords.x + 36;
                if (this.cursorTween) this.cursorTween.stop();
                this.menuCursor.setPosition(cursorBaseX, txt.y);
                this.cursorTween = this.tweens.add({
                    targets: this.menuCursor,
                    x: cursorBaseX + 4,
                    duration: 350,
                    yoyo: true,
                    repeat: -1
                });
            } else {
                txt.setFill('#FFFFFF');
            }
        });
    }

    executeMenuItem(index) {
        if (this.menuItems && this.menuItems[index] && this.menuItems[index].action) {
            this.menuItems[index].action();
        }
    }

    layoutInGameMenu(W, H) {
        if (!this.menuOverlay) return;

        // Overlay fill
        this.menuOverlay.clear();
        this.menuOverlay.fillStyle(0x000000, 0.70);
        this.menuOverlay.fillRect(0, 0, W, H);

        let boxW = Math.min(360, W - 32);
        let boxH = 220;
        let boxX = Math.round(W / 2 - boxW / 2);
        let boxY = Math.round(H / 2 - boxH / 2);
        this.menuBoxCoords = { x: boxX, y: boxY, w: boxW, h: boxH };

        // Capcom vintage double-border box
        let mb = this.menuBox;
        mb.clear();
        mb.fillStyle(0x000000, 1);
        mb.fillRect(boxX - 3, boxY - 3, boxW + 6, boxH + 6);
        mb.fillStyle(0xFFFFFF, 1);
        mb.fillRect(boxX - 1, boxY - 1, boxW + 2, boxH + 2);
        mb.fillStyle(0x001030, 0.96);
        mb.fillRect(boxX + 1, boxY + 1, boxW - 2, boxH - 2);

        // Gold corner rivets
        mb.fillStyle(0xF8B800, 1);
        mb.fillRect(boxX + 2, boxY + 2, 4, 4);
        mb.fillRect(boxX + boxW - 6, boxY + 2, 4, 4);
        mb.fillRect(boxX + 2, boxY + boxH - 6, 4, 4);
        mb.fillRect(boxX + boxW - 6, boxY + boxH - 6, 4, 4);

        // Header separator line
        mb.fillStyle(0x58B8F8, 1);
        mb.fillRect(boxX + 16, boxY + 44, boxW - 32, 2);

        this.menuTitle.setPosition(W / 2, boxY + 20);
        this.menuSub.setPosition(W / 2, boxY + 34);

        let startItemY = boxY + 68;
        let itemSpacing = 30;
        let itemTextX = boxX + 54;
        let rowW = boxW - 64;

        if (this.menuTextObjects) {
            this.menuTextObjects.forEach((txt, i) => {
                let itemY = startItemY + i * itemSpacing;
                txt.setPosition(itemTextX, itemY);
                txt.setFixedSize(rowW, 30);
                txt.setPadding(0, 8, 0, 8);
                if (i === this.menuSelectedIndex) {
                    let cursorBaseX = boxX + 36;
                    this.menuCursor.setPosition(cursorBaseX, itemY);
                }
            });
        }

        this.menuHelper.setPosition(W / 2, boxY + boxH - 18);
    }

    restartLevel() {
        this.closeInGameMenu();
        // Clean physics reset at Deck 11 spawn (x: 700, groundY: 1260)
        this.groundY = 1260;
        this.jumpZ = 0;
        this.jumpV = 0;
        this.isJumping = false;
        this.currentDeck = 'deck11';
        this.currentStair = null;

        let spawnY = 1260;
        let halfH = this.player.body.height / 2;
        this.player.body.reset(700, spawnY - halfH);
        this.player.y = spawnY;
        this.player.setVelocity(0, 0);
        this.player.angle = 0;
        this.player.body.allowGravity = false;
        this.player.setDepth(spawnY);

        if (this.playerShadow) {
            this.playerShadow.setPosition(700, spawnY + 18).setVisible(true).setScale(1).setAlpha(0.4);
            this.playerShadow.setDepth(spawnY - 1);
        }

        this.ridingRaft = false;
        this.onSlide = false;
        this.inWater = false;
        this.wasInWater = false;

        // Restore health nodes
        if (this.hpNodes) {
            this.hpNodes.forEach(node => node.setTexture('hp_node_full'));
        }

        // Camera flash & reposition
        this.cameras.main.flash(300, 255, 255, 255);
        this.cameras.main.centerOn(700, 1260);
    }

    layoutHUD(W, H) {
        const insets = getSafeAreaInsets();
        const topOffset = insets.top;
        const hudHeight = 42 + topOffset;
        const contentY = topOffset + 21;

        if (this.hudBg) {
            this.hudBg.clear();
            this.hudBg.fillStyle(0x001024, 0.92);
            this.hudBg.fillRect(0, 0, W, hudHeight);
            this.hudBg.lineStyle(2, 0xFFFFFF, 1);
            this.hudBg.lineBetween(0, hudHeight, W, hudHeight);
            this.hudBg.lineStyle(1, 0x000000, 1);
            this.hudBg.lineBetween(0, hudHeight + 2, W, hudHeight + 2);
        }

        const leftPadding = Math.max(12, insets.left + 8);
        const rightPadding = Math.max(12, insets.right + 8);
        const isNarrow = W < 520;
        const isVeryNarrow = W < 420;

        // --- LEFT SIDE: Player Avatar & HP ---
        if (this.hudPlayerIcon) {
            this.hudPlayerIcon.setPosition(leftPadding + 8, contentY);
        }
        let curX = leftPadding + 22;

        if (this.hudPlayerName) {
            if (isVeryNarrow) {
                this.hudPlayerName.setVisible(false);
            } else {
                this.hudPlayerName.setVisible(true);
                this.hudPlayerName.setFontSize(isNarrow ? '8px' : '10px');
                this.hudPlayerName.setOrigin(0, 0.5);
                this.hudPlayerName.setPosition(curX, contentY);
                curX += this.hudPlayerName.width + (isNarrow ? 6 : 10);
            }
        }

        if (this.hudHpText) {
            this.hudHpText.setFontSize(isNarrow ? '8px' : '10px');
            this.hudHpText.setOrigin(0, 0.5);
            this.hudHpText.setPosition(curX, contentY);
            curX += this.hudHpText.width + 6;
        }

        if (this.hpNodes) {
            const nodeSpacing = isNarrow ? 13 : 16;
            this.hpNodes.forEach((node, i) => {
                node.setScale(isNarrow ? 0.8 : 1.0);
                node.setPosition(curX + (i * nodeSpacing) + 6, contentY);
            });
        }

        // --- RIGHT SIDE: [MENU]  [ICECREAM]  $0002500 [COIN] ---
        let rightX = W - rightPadding;

        // [MENU] button anchored at top-right
        if (this.hudMenuBtn) {
            this.hudMenuBtn.setFontSize(isNarrow ? '9px' : '10px');
            this.hudMenuBtn.setOrigin(1, 0.5);
            this.hudMenuBtn.setPosition(rightX, contentY);
            rightX -= (this.hudMenuBtn.width + (isNarrow ? 8 : 14));
        }

        // Ice cream indicator
        if (this.hudIceCreamIcon) {
            this.hudIceCreamIcon.setPosition(rightX - 8, contentY);
            if (this.hudIceCreamIcon.visible) {
                rightX -= (20 + (isNarrow ? 6 : 10));
            }
        }

        // Currency score & coin icon
        if (this.hudScoreText) {
            this.hudScoreText.setFontSize(isNarrow ? '8px' : '10px');
            this.hudScoreText.setOrigin(1, 0.5);
            this.hudScoreText.setPosition(rightX, contentY);
            rightX -= (this.hudScoreText.width + 6);
        }

        if (this.hudCoinIcon) {
            this.hudCoinIcon.setScale(isNarrow ? 0.85 : 1.0);
            this.hudCoinIcon.setPosition(rightX - 6, contentY);
        }

        // --- CENTER LOCATION BANNER ---
        if (this.hudLocation) {
            this.hudLocation.setPosition(W / 2, contentY);
            if (W < 640) {
                this.hudLocation.setVisible(false);
            } else {
                this.hudLocation.setVisible(true);
                this.hudLocation.setFontSize('9px');
            }
        }

        if (this.isMenuOpen) {
            this.layoutInGameMenu(W, H);
        }
    }

    openElevatorMenu() {
        if (this.ridingRaft) return;
        // Stop player movement
        if (this.cursors) {
            if (this.cursors.left) this.cursors.left.isDown = false;
            if (this.cursors.right) this.cursors.right.isDown = false;
            if (this.cursors.up) this.cursors.up.isDown = false;
            if (this.cursors.down) this.cursors.down.isDown = false;
        }
        if (this.wasd) {
            if (this.wasd.left) this.wasd.left.isDown = false;
            if (this.wasd.right) this.wasd.right.isDown = false;
            if (this.wasd.up) this.wasd.up.isDown = false;
            if (this.wasd.down) this.wasd.down.isDown = false;
        }
        if (this.elevatorPromptText) {
            this.elevatorPromptText.setVisible(false);
        }
        this.nearElevator = false;
        this.scene.pause('GameScene');
        this.scene.launch('ElevatorMenuScene', { gameScene: this });
    }
}

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
        this.add.rectangle(cx, cy, 380, 340, 0x0000AA).setStrokeStyle(4, 0xFFFFFF);
        
        this.add.text(cx, cy - 135, 'MIDSHIP ELEVATOR', {
            fontSize: '14px', fill: '#FFD700', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5);

        this.add.text(cx, cy - 110, 'SELECT DESTINATION', {
            fontSize: '9px', fill: '#A0D0FF', fontFamily: '"Press Start 2P", monospace'
        }).setOrigin(0.5);

        const floors = [
            { label: 'Deck 12 (Hero Zone)', type: 'deck', y: 975 },
            { label: 'Deck 11 (Pools)', type: 'deck', y: 1255 },
            { label: 'Deck 5  (Edge Tween Club)', type: 'edge' },
            { label: 'Deck 4  (Bibbidi Bobbidi)', type: 'boutique' }
        ];

        this.menuItems = [];
        let startY = cy - 70;

        floors.forEach((floor, index) => {
            let btn = this.add.text(cx, startY + (index * 36), floor.label, {
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
        let cancelBtn = this.add.text(cx, startY + (floors.length * 36) + 6, '[ CANCEL ]', {
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
        this.add.text(cx, cy + 142, '▲/▼: SELECT   ENTER: TRAVEL', {
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
}

// =========================================================================
// BIBBIDI BOBBIDI BOUTIQUE 8-BIT ICON GRAPHICS
// =========================================================================

const ICON_WIG_MATRIX = [
    ".....OOOOOO.....",
    "...OOHHHHLLOO...",
    "..OHHHHHHLLLLO..",
    ".OHHHDDDDHLLLLO.",
    ".OHHDFFFFDHLLLO.",
    ".OHDFFFFFFDHLLO.",
    ".OHDFFFFFFDHLLO.",
    ".OHDFFFFFFDHLLO.",
    ".OHHDFFFFDHHLLO.",
    "..OHHDDDHHLLLO..",
    "...OOHHHHLLOO...",
    "......OSSO......",
    "......OSSO......",
    ".....OBBBBO.....",
    "....OBBBBBBO....",
    "....OOOOOOOO...."
];

const ICON_DRESS_MATRIX = [
    "....OWWWWWWO....",
    "....OMMMMMMO....",
    "...OMMMMMMMMO...",
    "...OMMLLLLMMO...",
    "....OGGGGGGO....",
    "....OGGGGGGO....",
    "...OMMLLLLMMO...",
    "..OMMMLLLLMMMO..",
    ".OMMMMLLLLMMMMO.",
    ".OMMMMLLLLMMMMO.",
    "OMMMMMLLLLMMMMMO",
    "OMMMDDLLLLDDMMMO",
    "OMMDDDLLLLDDDMMO",
    "OMMDDDLLLLDDDMMO",
    ".OWWWWWWWWWWWWO.",
    "..OOOOOOOOOOOO.."
];

const ICON_CROWN_MATRIX = [
    "......W.........",
    "...W..O..W......",
    "..LOLOLLOLOL....",
    "..OGGGOGGGGO....",
    ".OGGGLGGGLGGGO..",
    ".OGLRGLRGGLRGO..",
    "OGGLRGGLRGGLRGGO",
    "OGDDDDDDDDDDDDGO",
    "OGLLGGLLGGLLGGGO",
    "OGDDRGGDDBGGDGGO",
    "OGDDDDDDDDDDDDGO",
    ".OGGGGGGGGGGGGO.",
    "..OOOOOOOOOOOO..",
    "................",
    "................",
    "................"
];

const ICON_WAND_MATRIX = [
    "..........W.....",
    "........W.......",
    "......OLLLO.....",
    "....OOLGGGLOO...",
    "...OLGGCPPGGLO..",
    "..OLGCPWWPCGGLO.",
    "...OLGGCPPGGLO..",
    "....OOLGGGLOO...",
    "......ODDDO.....",
    ".....OGGGLO.....",
    ".....OGDGLO.....",
    "....OGGGLO......",
    "....OGDGLO......",
    "...OGGGLO.......",
    "..OGWDDDO.......",
    "...OOOOO........"
];

function generateBoutiqueIcons(scene) {
    const wigPal = {
        'O': 0x000000,
        'H': 0xB86820,
        'L': 0xF0A840,
        'D': 0x703810,
        'S': 0xC0C0C0,
        'B': 0x707070,
        'F': 0xFFE0BD
    };
    renderPixelTextureGlobal(scene, 'boutique_icon_wig', 32, 32, ICON_WIG_MATRIX, wigPal, 2);

    const dressPal = {
        'O': 0x000000,
        'M': 0x4898F8,
        'L': 0x88D0FF,
        'D': 0x1858B8,
        'G': 0xFFD700,
        'W': 0xFFFFFF
    };
    renderPixelTextureGlobal(scene, 'boutique_icon_dress', 32, 32, ICON_DRESS_MATRIX, dressPal, 2);

    const crownPal = {
        'O': 0x000000,
        'G': 0xFFD700,
        'L': 0xFFF080,
        'D': 0xB8860B,
        'R': 0xFF2040,
        'B': 0x30A0FF,
        'W': 0xFFFFFF
    };
    renderPixelTextureGlobal(scene, 'boutique_icon_crown', 32, 32, ICON_CROWN_MATRIX, crownPal, 2);

    const wandPal = {
        'O': 0x000000,
        'G': 0xFFD700,
        'L': 0xFFF8A0,
        'D': 0xB8860B,
        'P': 0xFF40A0,
        'C': 0x50F0FF,
        'W': 0xFFFFFF
    };
    renderPixelTextureGlobal(scene, 'boutique_icon_wand', 32, 32, ICON_WAND_MATRIX, wandPal, 2);
}

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

// =========================================================================
// RETRO ARCADE AUDIO & HIGH SCORE SYSTEM
// =========================================================================

class RetroArcadeAudio {
    constructor() {
        this.ctx = null;
    }
    init() {
        if (!this.ctx) {
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) {
                    this.ctx = new AudioCtx();
                }
            } catch (e) {}
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }
    playLaser() {
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.exponentialRampToValueAtTime(110, now + 0.1);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.1);
        } catch(e) {}
    }
    playExplosion() {
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const bufferSize = Math.floor(this.ctx.sampleRate * 0.25);
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, now);
            filter.frequency.linearRampToValueAtTime(80, now + 0.25);
            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            noise.start(now);
            noise.stop(now + 0.25);
        } catch(e) {}
    }
    playPowerup() {
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const freqs = [350, 440, 523, 659, 880];
            freqs.forEach((f, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(f, now + idx * 0.04);
                gain.gain.setValueAtTime(0.12, now + idx * 0.04);
                gain.gain.exponentialRampToValueAtTime(0.01, now + (idx + 1) * 0.04);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now + idx * 0.04);
                osc.stop(now + (idx + 1) * 0.04);
            });
        } catch(e) {}
    }
    playBomb() {
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(160, now);
            osc.frequency.exponentialRampToValueAtTime(30, now + 0.4);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.4);
        } catch(e) {}
    }
    playDamage() {
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(140, now);
            osc.frequency.linearRampToValueAtTime(50, now + 0.16);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.16);
        } catch(e) {}
    }
    playBossHit() {
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.linearRampToValueAtTime(90, now + 0.08);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.08);
        } catch(e) {}
    }
    playGameOver() {
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const freqs = [392, 370, 349, 311];
            freqs.forEach((f, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(f, now + idx * 0.15);
                gain.gain.setValueAtTime(0.15, now + idx * 0.15);
                gain.gain.exponentialRampToValueAtTime(0.01, now + (idx + 1) * 0.15);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now + idx * 0.15);
                osc.stop(now + (idx + 1) * 0.15);
            });
        } catch(e) {}
    }
}
const retroArcadeAudio = new RetroArcadeAudio();

const DEFAULT_EDGE_HIGH_SCORES = [
    { name: 'JAX', score: 12500 },
    { name: 'MAYA', score: 9800 },
    { name: 'LEO', score: 7500 },
    { name: 'SAM', score: 5200 },
    { name: 'ZOE', score: 3400 }
];

function getEdgeHighScores() {
    try {
        const stored = localStorage.getItem('disney_destiny_edge_high_scores');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch(e) {}
    return DEFAULT_EDGE_HIGH_SCORES.slice();
}

function saveEdgeHighScore(playerScore, playerName = 'RILEY') {
    let scores = getEdgeHighScores();
    scores.push({ name: playerName, score: playerScore });
    scores.sort((a, b) => b.score - a.score);
    scores = scores.slice(0, 5);
    try {
        localStorage.setItem('disney_destiny_edge_high_scores', JSON.stringify(scores));
    } catch(e) {}
    return scores;
}

// =========================================================================
// RILEY'S EDGE TWEEN CLUB SOCIAL ARCADE LOUNGE SCENE
// =========================================================================

class EdgeClubScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EdgeClubScene' });
    }

    init(data) {
        this.gameScene = data.gameScene;
        this.groundY = 445;
        this.jumpZ = 0;
        this.jumpV = 0;
        this.isJumping = false;
        this.isExiting = false;
        this.playerSpeed = 160;
        this.smoothieBoostTimer = 0;
        this.heldSmoothie = null;
        this.sparkleTimer = 0;
        this.speechEndTime = 0;
        this.currentSpeaker = null;
        this.nearElevator = false;
        this.nearSmoothie = false;
        this.nearArcade = false;

        // Mobile touch controls state
        this.touchMoveActive = false;
        this.touchMoveDir = 0;
        this.touchMoveDepth = 0;
    }

    create() {
        retroArcadeAudio.init();

        // Ensure underlying GameScene is completely hidden and slept
        if (this.gameScene && this.gameScene.scene) {
            this.gameScene.scene.setVisible(false);
            this.gameScene.scene.sleep();
        }

        const W = this.scale.width;
        const H = this.scale.height;

        const roomH = Math.max(540, H);
        const roomW = Math.max(1600, W);
        this.roomW = roomW;
        this.roomH = roomH;

        const floorH = Math.max(130, Math.round(roomH * 0.22));
        const floorY = roomH - floorH;
        this.floorY = floorY;
        this.floorH = floorH;
        this.groundY = floorY + 25;

        this.physics.world.setBounds(0, 0, roomW, roomH);

        // 0. Solid background guaranteeing no underlying scene leakage
        this.add.rectangle(0, 0, 10000, 10000, 0x07091B).setOrigin(0.5).setDepth(0);

        // 1. Room Background & Framing
        this.add.tileSprite(roomW / 2, floorY / 2, roomW, floorY, 'edge_wall').setDepth(1);
        this.add.tileSprite(roomW / 2, floorY + (floorH / 2), roomW, floorH, 'edge_floor').setDepth(2);

        // Floor curb divider line (gold & cyan trim)
        let curb = this.add.graphics().setDepth(3);
        curb.fillStyle(0x00E5FF, 1);
        curb.fillRect(0, floorY - 2, roomW, 2);
        curb.fillStyle(0xFFD700, 0.7);
        curb.fillRect(0, floorY, roomW, 2);

        // Starry Night Ocean Portholes
        const portholeY = Math.max(140, Math.round(floorY * 0.38));
        [Math.round(roomW * 0.16), Math.round(roomW * 0.5), Math.round(roomW * 0.84)].forEach(px => {
            let port = this.add.graphics().setDepth(4);
            port.fillStyle(0x1B263B, 1);
            port.fillCircle(px, portholeY, 42);
            port.fillStyle(0x0D1B2A, 1);
            port.fillCircle(px, portholeY, 38);
            port.fillStyle(0xFFD700, 1);
            port.lineStyle(3, 0xFFD700, 1);
            port.strokeCircle(px, portholeY, 40);

            // Twinkling stars inside porthole
            for (let s = 0; s < 8; s++) {
                let sx = px + Phaser.Math.Between(-30, 30);
                let sy = portholeY + Phaser.Math.Between(-30, 20);
                let star = this.add.text(sx, sy, '✦', { fontSize: '7px', fill: '#A0D0FF' }).setOrigin(0.5).setDepth(5);
                this.tweens.add({
                    targets: star,
                    alpha: 0.2,
                    duration: Phaser.Math.Between(600, 1400),
                    yoyo: true,
                    repeat: -1
                });
            }
            // Ocean wave line inside porthole
            port.fillStyle(0x003366, 1);
            port.fillRect(px - 36, portholeY + 15, 72, 22);
            port.fillStyle(0x005588, 1);
            port.fillRect(px - 36, portholeY + 15, 72, 3);
        });

        // Giant Illuminated Neon Club Sign
        const neonY = Math.max(50, Math.round(floorY * 0.14));
        this.neonSign = this.add.image(roomW / 2, neonY, 'edge_neon_logo').setDepth(6);
        this.neonTitleText = this.add.text(roomW / 2, neonY, '★ EDGE TWEEN CLUB ★', {
            fontSize: '12px',
            fill: '#00FFFF',
            fontFamily: '"Press Start 2P", monospace',
            stroke: '#FF2A85',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(7);

        this.tweens.add({
            targets: [this.neonSign, this.neonTitleText],
            alpha: 0.85,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // 2. Interactive Furniture & Stations
        const elevX = 120;
        const elevY = floorY - 32;
        this.elevX = elevX;
        this.elevY = elevY;

        const barX = Math.round(roomW * 0.26);
        const barY = floorY - 15;
        this.barX = barX;
        this.barY = barY;

        const couchX = Math.round(roomW * 0.45);
        const couchY = floorY - 5;
        this.couchX = couchX;
        this.couchY = couchY;

        const ldrX = Math.round(roomW * 0.64);
        const ldrY = floorY - 130;
        this.ldrX = ldrX;
        this.ldrY = ldrY;

        const arcX = Math.round(roomW * 0.82);
        const arcY = floorY - 30;
        this.arcX = arcX;
        this.arcY = arcY;

        const djX = Math.min(roomW - 90, Math.round(roomW * 0.94));
        const djY = floorY - 40;
        this.djX = djX;
        this.djY = djY;

        // Equalizer / DJ Booth
        this.djG = this.add.graphics().setDepth(5);
        this.eqBars = [0.4, 0.7, 0.9, 0.5, 0.8, 0.3, 0.6];
        this.time.addEvent({
            delay: 150,
            loop: true,
            callback: () => {
                for (let i = 0; i < this.eqBars.length; i++) {
                    this.eqBars[i] = Phaser.Math.Between(2, 10) / 10;
                }
            }
        });

        // Elevator Doors
        this.elevatorDoor = this.add.image(elevX, elevY, 'edge_elevator_door').setDepth(10);
        this.add.text(elevX, elevY - 44, '[ DECK 5: EDGE ]', {
            fontSize: '8px', fill: '#00FF66', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(11);

        this.elevatorPrompt = this.add.text(elevX, elevY - 68, '[ ENTER: UPPER DECKS ]', {
            fontSize: '8px', fill: '#FFD700', backgroundColor: '#000000', padding: { x: 8, y: 4 },
            fontFamily: '"Press Start 2P", monospace'
        }).setOrigin(0.5).setVisible(false).setDepth(2000);

        // Smoothie Bar
        this.add.image(barX, barY, 'edge_bar').setDepth(10);
        this.add.text(barX, barY - 35, 'CHILL BAR', {
            fontSize: '8px', fill: '#FF2A85', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(11);

        this.smoothiePrompt = this.add.text(barX, barY - 60, '[ ENTER: GRAB SMOOTHIE ]', {
            fontSize: '8px', fill: '#00E5FF', backgroundColor: '#000000', padding: { x: 8, y: 4 },
            fontFamily: '"Press Start 2P", monospace'
        }).setOrigin(0.5).setVisible(false).setDepth(2000);

        // Lounge Sectional Couch & Leo
        this.add.image(couchX, couchY, 'edge_couch').setDepth(10);
        this.leoSprite = this.add.image(couchX - 20, couchY - 18, 'edge_npc_leo').setDepth(12);

        // Wall Leaderboard Display
        this.add.image(ldrX, ldrY, 'edge_leaderboard').setDepth(10);
        this.add.text(ldrX, ldrY - 20, 'HIGH SCORES', {
            fontSize: '8px', fill: '#FFD700', fontFamily: '"Press Start 2P", monospace'
        }).setOrigin(0.5).setDepth(11);

        this.leaderboardTexts = [];
        for (let i = 0; i < 5; i++) {
            let row = this.add.text(ldrX, ldrY - 4 + (i * 12), '', {
                fontSize: '7px', fill: '#00FF66', fontFamily: '"Press Start 2P", monospace'
            }).setOrigin(0.5).setDepth(11);
            this.leaderboardTexts.push(row);
        }
        this.updateLeaderboardDisplay();

        // Retro Arcade Cabinet & Maya
        this.arcadeCabinet = this.add.image(arcX, arcY, 'edge_arcade_cabinet').setDepth(10);
        this.mayaSprite = this.add.image(arcX + 44, arcY + 22, 'edge_npc_maya').setDepth(12);

        // Cabinet Marquee Blink
        this.marqueeText = this.add.text(arcX, arcY - 46, 'GALAXY DESTINY', {
            fontSize: '7px', fill: '#FFD700', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(11);

        this.tweens.add({
            targets: this.marqueeText,
            alpha: 0.3,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        this.arcadePrompt = this.add.text(arcX, arcY - 68, '[ ENTER: PLAY ARCADE ]', {
            fontSize: '8px', fill: '#FFD700', backgroundColor: '#000000', padding: { x: 8, y: 4 },
            fontFamily: '"Press Start 2P", monospace'
        }).setOrigin(0.5).setVisible(false).setDepth(2000);

        // 3. Player Riley
        const spawnX = 180;
        this.playerShadow = this.add.ellipse(spawnX, this.groundY + 16, 24, 8, 0x000000, 0.4).setDepth(Math.round(this.groundY) - 1);
        this.player = this.physics.add.sprite(spawnX, this.groundY, 'riley_idle').setDepth(Math.round(this.groundY));
        this.player.body.allowGravity = false;
        this.player.body.setSize(22, 16);
        this.player.body.setOffset(5, 32);

        // Ensure Riley walk animation exists
        if (!this.anims.exists('riley_walk')) {
            this.anims.create({
                key: 'riley_walk',
                frames: [
                    { key: 'riley_walk_0' },
                    { key: 'riley_walk_1' },
                    { key: 'riley_walk_2' },
                    { key: 'riley_walk_1' }
                ],
                frameRate: 8,
                repeat: -1
            });
        }
        if (!this.anims.exists('riley_idle')) {
            this.anims.create({
                key: 'riley_idle',
                frames: [{ key: 'riley_idle' }],
                frameRate: 1
            });
        }
        if (!this.anims.exists('riley_jump')) {
            this.anims.create({
                key: 'riley_jump',
                frames: [{ key: 'riley_jump' }],
                frameRate: 1
            });
        }

        // Camera Follow
        this.cameras.main.setBounds(0, 0, roomW, roomH);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        // 4. Capcom Speech Bubble System
        this.speechBox = this.add.graphics().setDepth(2500).setVisible(false);
        this.speechText = this.add.text(0, 0, '', {
            fontSize: '7px',
            fill: '#F8B800',
            fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000',
            strokeThickness: 1,
            align: 'center',
            wordWrap: { width: 150 }
        }).setOrigin(0, 0).setDepth(2501).setVisible(false);

        // Dialogue Quotes
        this.leoQuotes = [
            'YO RILEY! GALAXY DESTINY IS IN THE HOUSE!',
            'THE MOTHERSHIP ON WAVE 3 IS SERIOUS BUSINESS!',
            'GRAB THE "P" CAPSULES FOR SPREAD LASERS!',
            'DETONATE A SMART BOMB WHEN SURROUNDED!'
        ];
        this.mayaQuotes = [
            'RILEY! YOU\'VE GOTTA BEAT JAX\'S HIGH SCORE!',
            'HOLD DOWN FIRE FOR CONTINUOUS RAPID BLASTS!',
            'DON\'T MISS THE BLUE SHIELD CAPSULES!',
            'CLAIM THE #1 SPOT ON THE EDGE BOARD!'
        ];

        // 5. Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keysWASD = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            esc: Phaser.Input.Keyboard.KeyCodes.ESC
        });

        this.input.keyboard.on('keydown-ESC', () => this.returnToGameScene());

        // Direct DOM safety release: guarantees keys are cleared even if OS or browser dropped Phaser keyup
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
        };

        const onNativeKeyUp = (e) => {
            if (e.code === 'Space') {
                if (this.cursors && this.cursors.space) this.cursors.space.isDown = false;
                if (this.keysWASD && this.keysWASD.space) this.keysWASD.space.isDown = false;
            }
            if (e.key === 'Enter') {
                if (this.keysWASD && this.keysWASD.enter) this.keysWASD.enter.isDown = false;
            }
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
                if (this.cursors && this.cursors.up) this.cursors.up.isDown = false;
                if (this.keysWASD && this.keysWASD.up) this.keysWASD.up.isDown = false;
            }
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                if (this.cursors && this.cursors.left) this.cursors.left.isDown = false;
                if (this.keysWASD && this.keysWASD.left) this.keysWASD.left.isDown = false;
            }
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                if (this.cursors && this.cursors.right) this.cursors.right.isDown = false;
                if (this.keysWASD && this.keysWASD.right) this.keysWASD.right.isDown = false;
            }
            if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                if (this.cursors && this.cursors.down) this.cursors.down.isDown = false;
                if (this.keysWASD && this.keysWASD.down) this.keysWASD.down.isDown = false;
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

        // Mobile On-Screen Controls
        this.setupMobileControls();

        // Direct Touch on interactive stations
        this.elevatorDoor.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.returnToGameScene());
        this.arcadeCabinet.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.launchArcadeCabinet());
        this.neonSign.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.returnToGameScene());
    }

    setupMobileControls() {
        // Top Left Exit Button (fixed on screen) - available on all devices
        this.exitBtn = this.add.text(16, 16, '[ ◄ DECKS ]', {
            fontSize: '9px', fill: '#FFD700', backgroundColor: '#000000', padding: { x: 8, y: 6 },
            fontFamily: '"Press Start 2P", monospace'
        }).setScrollFactor(0).setDepth(3000).setInteractive({ useHandCursor: true });
        this.exitBtn.on('pointerdown', () => this.returnToGameScene());

        // Mobile touch controls only enabled on non-desktop devices
        if (!this.sys.game.device.os.desktop) {
            const rx = this.scale.width - 70;
            const ry = this.scale.height - 70;

            this.jumpBtn = this.add.circle(rx - 70, ry, 30, 0x005588, 0.7)
                .setScrollFactor(0).setDepth(3000).setInteractive();
            this.add.text(rx - 70, ry, 'JUMP', { fontSize: '8px', fill: '#FFFFFF', fontFamily: '"Press Start 2P"' })
                .setOrigin(0.5).setScrollFactor(0).setDepth(3001);

            this.actionBtn = this.add.circle(rx, ry - 30, 30, 0xFF8800, 0.7)
                .setScrollFactor(0).setDepth(3000).setInteractive();
            this.add.text(rx, ry - 30, 'ACT', { fontSize: '8px', fill: '#FFFFFF', fontFamily: '"Press Start 2P"' })
                .setOrigin(0.5).setScrollFactor(0).setDepth(3001);

            this.jumpBtn.on('pointerdown', () => this.tryJump());
            this.actionBtn.on('pointerdown', () => this.handleActionTrigger());

            // Floating touch movement (drag on left half of screen)
            this.input.on('pointerdown', (pointer) => {
                if (pointer.x < this.scale.width / 2 && pointer.y > 60) {
                    this.touchMoveActive = true;
                    this.touchOriginX = pointer.x;
                    this.touchOriginY = pointer.y;
                }
            });
            this.input.on('pointermove', (pointer) => {
                if (this.touchMoveActive) {
                    const dx = pointer.x - this.touchOriginX;
                    const dy = pointer.y - this.touchOriginY;
                    this.touchMoveDir = Math.abs(dx) > 15 ? (dx > 0 ? 1 : -1) : 0;
                    this.touchMoveDepth = Math.abs(dy) > 15 ? (dy > 0 ? 1 : -1) : 0;
                }
            });
            this.input.on('pointerup', () => {
                this.touchMoveActive = false;
                this.touchMoveDir = 0;
                this.touchMoveDepth = 0;
            });
        }
    }

    tryJump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.jumpV = 280;
            this.player.anims.play('riley_jump', true);
        }
    }

    handleActionTrigger() {
        if (this.nearElevator) {
            this.returnToGameScene();
        } else if (this.nearArcade) {
            this.launchArcadeCabinet();
        } else if (this.nearSmoothie) {
            this.grabSmoothie();
        }
    }

    grabSmoothie() {
        if (this.heldSmoothie) return;
        retroArcadeAudio.playPowerup();
        this.smoothieBoostTimer = 10000;
        const handOffsetX = this.player.flipX ? -11 : 11;
        const handOffsetY = 3;
        this.heldSmoothie = this.add.image(this.player.x + handOffsetX, this.player.y + handOffsetY, 'edge_smoothie')
            .setScale(0.75)
            .setFlipX(this.player.flipX)
            .setDepth(this.player.depth + 1);

        // Flash screen with pastel aura
        this.cameras.main.flash(200, 0, 229, 255);

        // Floating message
        let msg = this.add.text(this.player.x, this.player.y - 50, '+SPEED BOOST!', {
            fontSize: '9px', fill: '#00E5FF', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(2500);

        this.tweens.add({
            targets: msg,
            y: msg.y - 25,
            alpha: 0,
            duration: 1200,
            onComplete: () => msg.destroy()
        });
    }

    updateLeaderboardDisplay() {
        const scores = getEdgeHighScores();
        for (let i = 0; i < 5; i++) {
            if (scores[i]) {
                const s = scores[i];
                const zeroPad = String(s.score).padStart(6, '0');
                const rank = `${i + 1}.`;
                this.leaderboardTexts[i].setText(`${rank} ${s.name.padEnd(5, ' ')} ${zeroPad}`);
                if (s.name === 'RILEY') {
                    this.leaderboardTexts[i].setStyle({ fill: '#FFD700' });
                } else {
                    this.leaderboardTexts[i].setStyle({ fill: '#00FF66' });
                }
            } else {
                this.leaderboardTexts[i].setText('');
            }
        }
    }

    launchArcadeCabinet() {
        retroArcadeAudio.init();
        this.scene.setVisible(false);
        this.scene.pause('EdgeClubScene');
        this.scene.launch('ArcadeShooterScene', { edgeScene: this });
    }

    onReturnFromArcade(score) {
        this.updateLeaderboardDisplay();
        retroArcadeAudio.init();

        // Maya and Leo congratulate Riley
        let quote = (score > 12500)
            ? 'LEGENDARY RILEY! YOU CLAIMED #1 ON THE EDGE BOARD!'
            : (score > 6000)
            ? 'EPIC RUN RILEY! You\'re climbing the high score board!'
            : 'Nice run Riley! Jump back on and blast that Mothership!';

        this.showSpeechBubble(this.mayaSprite, quote, this.time.now);
    }

    showSpeechBubble(speaker, quote, time) {
        if (this.currentSpeaker && time < this.speechEndTime) return;
        this.currentSpeaker = speaker;
        this.speechEndTime = time + 3000;

        this.speechText.setText(quote);
        let padX = 8;
        let padY = 5;
        let w = this.speechText.width + padX * 2;
        let h = this.speechText.height + padY * 2;

        let bx = speaker.x - w / 2;
        let by = speaker.y - 42 - h;
        bx = Phaser.Math.Clamp(bx, 20, this.roomW - w - 20);

        this.speechBox.clear();
        this.speechBox.fillStyle(0x000000, 1);
        this.speechBox.fillRect(bx - 2, by - 2, w + 4, h + 4);
        this.speechBox.fillStyle(0x001024, 0.95);
        this.speechBox.fillRect(bx, by, w, h);
        this.speechBox.lineStyle(1, 0xF8B800, 1);
        this.speechBox.strokeRect(bx, by, w, h);

        let arrowX = Phaser.Math.Clamp(speaker.x, bx + 8, bx + w - 8);
        let arrowY = by + h;
        this.speechBox.fillStyle(0x001024, 0.95);
        this.speechBox.fillTriangle(arrowX - 4, arrowY, arrowX + 4, arrowY, arrowX, arrowY + 6);
        this.speechBox.lineStyle(1, 0xF8B800, 1);
        this.speechBox.lineBetween(arrowX - 4, arrowY, arrowX, arrowY + 6);
        this.speechBox.lineBetween(arrowX, arrowY + 6, arrowX + 4, arrowY);

        this.speechText.setPosition(bx + padX, by + padY);
        this.speechBox.setVisible(true);
        this.speechText.setVisible(true);
    }

    update(time, delta) {
        const dt = delta / 1000;

        // Equalizer Bar Animation
        this.djG.clear();
        this.djG.fillStyle(0x111122, 1);
        this.djG.fillRect(this.djX - 35, this.djY - 18, 70, 36);
        for (let i = 0; i < this.eqBars.length; i++) {
            const h = Math.round(this.eqBars[i] * 28);
            const col = (h > 20) ? 0xFF0055 : (h > 12) ? 0xFFD700 : 0x00E5FF;
            this.djG.fillStyle(col, 1);
            this.djG.fillRect((this.djX - 30) + (i * 9), (this.djY + 14) - h, 6, h);
        }

        // Hide speech bubble if expired
        if (this.currentSpeaker && time >= this.speechEndTime) {
            this.speechBox.setVisible(false);
            this.speechText.setVisible(false);
            this.currentSpeaker = null;
        }

        // Smoothie Speed Boost Timer
        if (this.smoothieBoostTimer > 0) {
            this.smoothieBoostTimer -= delta;
            this.playerSpeed = 240;

            // Rainbow trail sparkles
            this.sparkleTimer += delta;
            if (this.sparkleTimer > 120) {
                this.sparkleTimer = 0;
                let colors = ['#00E5FF', '#FF2A85', '#FFD700', '#00FF66'];
                let c = Phaser.Utils.Array.GetRandom(colors);
                let sp = this.add.text(this.player.x + Phaser.Math.Between(-8, 8), this.player.y + Phaser.Math.Between(-10, 10), '✦', {
                    fontSize: '8px', fill: c
                }).setOrigin(0.5).setDepth(this.player.depth - 1);
                this.tweens.add({
                    targets: sp,
                    alpha: 0,
                    scale: 0.5,
                    duration: 400,
                    onComplete: () => sp.destroy()
                });
            }

            if (this.smoothieBoostTimer <= 0) {
                this.playerSpeed = 160;
                if (this.heldSmoothie) {
                    this.heldSmoothie.destroy();
                    this.heldSmoothie = null;
                }
            }
        }

        // Player Controls (Mutually exclusive & DOM keyup protected)
        let isLeft = (this.cursors.left && this.cursors.left.isDown) || 
                     (this.keysWASD.left && this.keysWASD.left.isDown) || 
                     this.touchMoveDir === -1;

        let isRight = (this.cursors.right && this.cursors.right.isDown) || 
                      (this.keysWASD.right && this.keysWASD.right.isDown) || 
                      this.touchMoveDir === 1;

        let isUp = (this.cursors.up && this.cursors.up.isDown) || 
                   (this.keysWASD.up && this.keysWASD.up.isDown) || 
                   this.touchMoveDepth === -1;

        let isDown = (this.cursors.down && this.cursors.down.isDown) || 
                     (this.keysWASD.down && this.keysWASD.down.isDown) || 
                     this.touchMoveDepth === 1;

        let moveX = 0;
        let moveY = 0;

        if (isLeft && !isRight) {
            moveX = -1;
            this.player.setFlipX(true);
        } else if (isRight && !isLeft) {
            moveX = 1;
            this.player.setFlipX(false);
        }

        if (isUp && !isDown) {
            moveY = -1;
        } else if (isDown && !isUp) {
            moveY = 1;
        }

        // Diagonal normalization
        let vx = moveX * this.playerSpeed;
        let vy = moveY * (this.playerSpeed * 0.6);
        if (moveX !== 0 && moveY !== 0) {
            vx *= 0.7071;
            vy *= 0.7071;
        }

        // Jump Handling
        if ((Phaser.Input.Keyboard.JustDown(this.keysWASD.space) || Phaser.Input.Keyboard.JustDown(this.cursors.space)) && !this.isJumping) {
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

        // 2.5D Movement Execution
        this.player.x += vx * dt;
        this.player.x = Phaser.Math.Clamp(this.player.x, 70, this.roomW - 70);

        this.groundY += vy * dt;
        this.groundY = Phaser.Math.Clamp(this.groundY, this.floorY - 5, this.roomH - 25);

        this.player.y = this.groundY - this.jumpZ;
        this.player.setDepth(Math.round(this.groundY));
        this.player.body.reset(this.player.x, this.player.y);

        this.playerShadow.setPosition(this.player.x, this.groundY + 16);
        this.playerShadow.setDepth(Math.round(this.groundY) - 1);

        // Update held smoothie position in Riley's hand
        if (this.heldSmoothie) {
            const handOffsetX = this.player.flipX ? -11 : 11;
            const handOffsetY = 3;
            this.heldSmoothie.setPosition(this.player.x + handOffsetX, this.player.y + handOffsetY);
            this.heldSmoothie.setFlipX(this.player.flipX);
            this.heldSmoothie.setDepth(this.player.depth + 1);
        }

        // Player Animations
        if (this.isJumping) {
            this.player.anims.play('riley_jump', true);
        } else if (moveX !== 0 || moveY !== 0) {
            this.player.anims.play('riley_walk', true);
        } else {
            this.player.anims.play('riley_idle', true);
        }

        // Proximity Checks
        // 1. Elevator Door
        this.nearElevator = Math.abs(this.player.x - this.elevX) < 55;
        this.elevatorPrompt.setVisible(this.nearElevator);

        // 2. Smoothie Bar
        this.nearSmoothie = Math.abs(this.player.x - this.barX) < 50;
        this.smoothiePrompt.setVisible(this.nearSmoothie);

        // 3. Arcade Cabinet
        this.nearArcade = Math.abs(this.player.x - this.arcX) < 55;
        this.arcadePrompt.setVisible(this.nearArcade);

        // 4. Leo Dialogue Proximity
        if (Math.abs(this.player.x - (this.couchX - 20)) < 65 && !this.currentSpeaker) {
            this.showSpeechBubble(this.leoSprite, Phaser.Utils.Array.GetRandom(this.leoQuotes), time);
        }

        // 5. Maya Dialogue Proximity
        if (Math.abs(this.player.x - (this.arcX + 44)) < 60 && !this.currentSpeaker && !this.nearArcade) {
            this.showSpeechBubble(this.mayaSprite, Phaser.Utils.Array.GetRandom(this.mayaQuotes), time);
        }

        // Key Triggers (Enter)
        if (Phaser.Input.Keyboard.JustDown(this.keysWASD.enter)) {
            this.handleActionTrigger();
        }
    }

    returnToGameScene() {
        if (this.isExiting) return;
        this.isExiting = true;

        if (this._cleanWindowListeners) {
            this._cleanWindowListeners();
        }

        if (this.gameScene && this.gameScene.scene) {
            this.gameScene.scene.setVisible(true);
            this.gameScene.scene.wake();
            this.gameScene.scene.resume();
        }
        this.scene.stop('EdgeClubScene');

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

            this.gameScene.player.body.setSize(22, 16);
            this.gameScene.player.body.setOffset(5, 32);

            if (this.gameScene.playerShadow) {
                this.gameScene.playerShadow.setPosition(1250, returnGroundY + 18);
                this.gameScene.playerShadow.setDepth(returnGroundY - 1);
                this.gameScene.playerShadow.setVisible(true);
            }

            this.gameScene.selectedCharacter = 'riley';
            this.gameScene.characterName = 'Riley';
            if (this.gameScene.hudPlayerName) {
                this.gameScene.hudPlayerName.setText('RILEY');
            }
            if (this.gameScene.hudPlayerIcon) {
                this.gameScene.hudPlayerIcon.setTexture('riley_idle');
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

// =========================================================================
// RETRO ARCADE SPACE SHOOTER SCENE ("GALAXY DESTINY")
// =========================================================================

class ArcadeShooterScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ArcadeShooterScene' });
    }

    init(data) {
        this.edgeScene = data.edgeScene;
        this.lives = 3;
        this.bombs = 2;
        this.weaponLevel = 1; // 1: dual laser, 2: triple spread, 3: quad heavy
        this.shieldHits = 0;  // 0: inactive, >0 absorbs hit
        this.score = 0;
        this.wave = 1;
        this.gameState = 'playing'; // 'playing' -> 'gameover'
        this.lastShotTime = 0;
        this.shotCooldown = 160;
        this.invulnerableTimer = 0;
        this.enemiesDefeatedInWave = 0;
        this.waveTargetEnemies = 16;
        this.boss = null;
        this.bossActive = false;
        this.bossHP = 120;
        this.maxBossHP = 120;
        this.bossLaserTimer = 0;

        // Mobile touch state
        this.touchFireActive = false;
        this.touchDragActive = false;
    }

    create() {
        retroArcadeAudio.init();
        // Disable gravity in arcade space shooter scene
        this.physics.world.gravity.y = 0;

        const W = this.scale.width;
        const H = this.scale.height;
        const cx = W / 2;
        const cy = H / 2;

        // 1. Responsive Arcade Cabinet Dimensions & Framing
        if (W >= 768 && H >= 600) {
            this.cabW = Math.min(680, W - 20);
            this.cabH = Math.min(H - 16, 860);
            this.marqueeH = Math.min(62, Math.max(48, Math.round(this.cabH * 0.08)));
            this.cpoH = Math.min(126, Math.max(96, Math.round(this.cabH * 0.17)));
        } else {
            this.cabW = W - 10;
            this.cabH = H - 10;
            this.marqueeH = Math.max(36, Math.min(48, Math.round(this.cabH * 0.08)));
            this.cpoH = Math.max(76, Math.min(105, Math.round(this.cabH * 0.17)));
        }

        this.cabX = cx - this.cabW / 2;
        this.cabY = cy - this.cabH / 2;

        // Recessed CRT Playfield inside the Cabinet
        const monitorY = this.cabY + this.marqueeH + 10;
        const monitorH = (this.cabY + this.cabH - this.cpoH - 10) - monitorY;
        const maxMonitorW = this.cabW - ((W >= 768) ? 60 : 20);
        const monitorW = Math.min(maxMonitorW, Math.round(monitorH * 1.05));

        this.playW = monitorW;
        this.playH = monitorH;
        this.playX = cx - this.playW / 2;
        this.playY = monitorY;
        this.cpoY = this.cabY + this.cabH - this.cpoH - 6;

        // Outer ambient letterbox
        this.add.rectangle(cx, cy, W, H, 0x030308).setDepth(0);

        // 2. Render Authentic Upright Arcade Cabinet Kit (Chassis, Wings, Marquee, Bezel)
        this.renderArcadeCabinetChassis();

        // 3. CRT Monitor Screen Background
        this.add.rectangle(cx, this.playY + this.playH / 2, this.playW, this.playH, 0x02040D).setDepth(2);

        // Parallax Stars
        this.stars = [];
        for (let i = 0; i < 50; i++) {
            let sx = this.playX + Phaser.Math.Between(4, this.playW - 4);
            let sy = this.playY + Phaser.Math.Between(4, this.playH - 4);
            let speed = (i % 2 === 0) ? 45 : 115;
            let col = (i % 2 === 0) ? '#406080' : '#A0D0FF';
            let char = (i % 3 === 0) ? '✦' : '•';
            let size = (i % 2 === 0) ? '6px' : '9px';
            let star = this.add.text(sx, sy, char, { fontSize: size, fill: col }).setOrigin(0.5).setDepth(3);
            this.stars.push({ obj: star, speed: speed });
        }

        // CRT Phosphor Scanlines Overlay
        this.scanlineOverlay = this.add.tileSprite(cx, this.playY + this.playH / 2, this.playW, this.playH, 'shooter_scanlines')
            .setDepth(25).setAlpha(0.2);

        // 4. Physics Groups (Zero gravity & explicit depth hierarchy)
        this.playerLasers = this.physics.add.group({
            allowGravity: false,
            createCallback: (item) => {
                item.setDepth(15);
                if (item.body) item.body.allowGravity = false;
            }
        });
        this.enemies = this.physics.add.group({
            allowGravity: false,
            createCallback: (item) => {
                item.setDepth(10);
                if (item.body) item.body.allowGravity = false;
            }
        });
        this.enemyBullets = this.physics.add.group({
            allowGravity: false,
            createCallback: (item) => {
                item.setDepth(12);
                if (item.body) item.body.allowGravity = false;
            }
        });
        this.powerups = this.physics.add.group({
            allowGravity: false,
            createCallback: (item) => {
                item.setDepth(14);
                if (item.body) item.body.allowGravity = false;
            }
        });

        // 5. Player Starfighter (Depth 22 - always in front of shield rings and aura effects)
        this.player = this.physics.add.sprite(cx, this.playY + this.playH - 50, 'shooter_player').setDepth(22);
        this.player.body.allowGravity = false;
        this.player.body.setSize(24, 24);

        this.thruster = this.add.image(this.player.x, this.player.y + 16, 'shooter_player_thruster').setDepth(21);
        this.shieldSprite = this.add.image(this.player.x, this.player.y, 'shooter_shield').setDepth(20).setVisible(false);
        this.invulnShield = this.add.image(this.player.x, this.player.y, 'shooter_invuln_shield').setDepth(19).setVisible(false);

        // 6. Arcade Top HUD
        this.highScore = getEdgeHighScores()[0].score || 12500;

        this.scoreText = this.add.text(this.playX + 10, this.playY + 10, '1UP 000000', {
            fontSize: '8px', fill: '#FFFFFF', fontFamily: '"Press Start 2P", monospace'
        }).setDepth(50);

        this.highText = this.add.text(cx, this.playY + 10, `HIGH ${String(this.highScore).padStart(6, '0')}`, {
            fontSize: '8px', fill: '#FFD700', fontFamily: '"Press Start 2P", monospace'
        }).setOrigin(0.5, 0).setDepth(50);

        this.waveText = this.add.text(this.playX + this.playW - 10, this.playY + 10, 'WAVE 01', {
            fontSize: '8px', fill: '#00E5FF', fontFamily: '"Press Start 2P", monospace'
        }).setOrigin(1, 0).setDepth(50);

        // Bottom Status HUD
        this.bottomHud = this.add.text(this.playX + 10, this.playY + this.playH - 16, '', {
            fontSize: '7px', fill: '#FFFFFF', fontFamily: '"Press Start 2P", monospace'
        }).setDepth(50);
        this.updateBottomHUD();

        // Boss Health Bar UI
        this.bossBarContainer = this.add.graphics().setDepth(55).setVisible(false);
        this.bossText = this.add.text(cx, this.playY + 26, '⚠ DREADNOUGHT ⚠', {
            fontSize: '8px', fill: '#FF2A85', fontFamily: '"Press Start 2P", monospace'
        }).setOrigin(0.5).setDepth(56).setVisible(false);

        // 7. Cabinet Control Panel Overlay (CPO) with illustrated joystick, instructions badge & arcade buttons
        this.setupCabinetControlPanel();

        // 8. Keyboard Controls & DOM listeners
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys({
            w: Phaser.Input.Keyboard.KeyCodes.W,
            a: Phaser.Input.Keyboard.KeyCodes.A,
            s: Phaser.Input.Keyboard.KeyCodes.S,
            d: Phaser.Input.Keyboard.KeyCodes.D,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            z: Phaser.Input.Keyboard.KeyCodes.Z,
            x: Phaser.Input.Keyboard.KeyCodes.X,
            b: Phaser.Input.Keyboard.KeyCodes.B,
            enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
            esc: Phaser.Input.Keyboard.KeyCodes.ESC
        });

        this.input.keyboard.on('keydown-ESC', () => this.exitCabinet());
        this.input.keyboard.on('keydown-X', () => {
            if (this.bombBtn) this.bombBtn.setScale(0.92);
            this.detonateSmartBomb();
        });
        this.input.keyboard.on('keyup-X', () => {
            if (this.bombBtn) this.bombBtn.setScale(1);
        });
        this.input.keyboard.on('keydown-B', () => {
            if (this.bombBtn) this.bombBtn.setScale(0.92);
            this.detonateSmartBomb();
        });
        this.input.keyboard.on('keyup-B', () => {
            if (this.bombBtn) this.bombBtn.setScale(1);
        });

        this.input.keyboard.on('keydown-SPACE', () => {
            if (this.fireBtn) this.fireBtn.setScale(0.92);
        });
        this.input.keyboard.on('keyup-SPACE', () => {
            if (this.fireBtn) this.fireBtn.setScale(1);
        });
        this.input.keyboard.on('keydown-Z', () => {
            if (this.fireBtn) this.fireBtn.setScale(0.92);
        });
        this.input.keyboard.on('keyup-Z', () => {
            if (this.fireBtn) this.fireBtn.setScale(1);
        });

        // Direct DOM safety release: guarantees keys are cleared even if OS or browser dropped Phaser keyup
        const resetArcadeKeys = () => {
            if (this.cursors) {
                if (this.cursors.left) this.cursors.left.isDown = false;
                if (this.cursors.right) this.cursors.right.isDown = false;
                if (this.cursors.up) this.cursors.up.isDown = false;
                if (this.cursors.down) this.cursors.down.isDown = false;
                if (this.cursors.space) this.cursors.space.isDown = false;
            }
            if (this.keys) {
                if (this.keys.w) this.keys.w.isDown = false;
                if (this.keys.a) this.keys.a.isDown = false;
                if (this.keys.s) this.keys.s.isDown = false;
                if (this.keys.d) this.keys.d.isDown = false;
                if (this.keys.space) this.keys.space.isDown = false;
                if (this.keys.z) this.keys.z.isDown = false;
                if (this.keys.x) this.keys.x.isDown = false;
                if (this.keys.b) this.keys.b.isDown = false;
                if (this.keys.enter) this.keys.enter.isDown = false;
            }
            if (this.fireBtn) this.fireBtn.setScale(1);
            if (this.bombBtn) this.bombBtn.setScale(1);
        };

        const onArcadeNativeKeyUp = (e) => {
            if (e.code === 'Space') {
                if (this.cursors && this.cursors.space) this.cursors.space.isDown = false;
                if (this.keys && this.keys.space) this.keys.space.isDown = false;
                if (this.fireBtn) this.fireBtn.setScale(1);
            }
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
                if (this.cursors && this.cursors.up) this.cursors.up.isDown = false;
                if (this.keys && this.keys.w) this.keys.w.isDown = false;
            }
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                if (this.cursors && this.cursors.left) this.cursors.left.isDown = false;
                if (this.keys && this.keys.a) this.keys.a.isDown = false;
            }
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                if (this.cursors && this.cursors.right) this.cursors.right.isDown = false;
                if (this.keys && this.keys.d) this.keys.d.isDown = false;
            }
            if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                if (this.cursors && this.cursors.down) this.cursors.down.isDown = false;
                if (this.keys && this.keys.s) this.keys.s.isDown = false;
            }
            if (e.key === 'z' || e.key === 'Z') {
                if (this.keys && this.keys.z) this.keys.z.isDown = false;
                if (this.fireBtn) this.fireBtn.setScale(1);
            }
            if (e.key === 'x' || e.key === 'X') {
                if (this.keys && this.keys.x) this.keys.x.isDown = false;
                if (this.bombBtn) this.bombBtn.setScale(1);
            }
            if (e.key === 'b' || e.key === 'B') {
                if (this.keys && this.keys.b) this.keys.b.isDown = false;
                if (this.bombBtn) this.bombBtn.setScale(1);
            }
            if (['Alt', 'Meta', 'Control', 'Shift'].includes(e.key)) {
                resetArcadeKeys();
            }
        };

        window.addEventListener('blur', resetArcadeKeys);
        window.addEventListener('focus', resetArcadeKeys);
        window.addEventListener('keyup', onArcadeNativeKeyUp);
        const onVis = () => { if (document.hidden) resetArcadeKeys(); };
        document.addEventListener('visibilitychange', onVis);

        this._cleanWindowListeners = () => {
            window.removeEventListener('blur', resetArcadeKeys);
            window.removeEventListener('focus', resetArcadeKeys);
            window.removeEventListener('keyup', onArcadeNativeKeyUp);
            document.removeEventListener('visibilitychange', onVis);
        };

        this.events.once('shutdown', () => {
            if (this.physics && this.physics.world && this.physics.world.gravity) {
                this.physics.world.gravity.y = 1000;
            }
            if (this._cleanWindowListeners) this._cleanWindowListeners();
        });

        // 9. Touch Drag Steering on CRT screen (Mobile + Tablet)
        this.setupTouchDragControls();

        // 10. Overlaps & Collisions
        this.physics.add.overlap(this.playerLasers, this.enemies, (laser, enemy) => this.hitEnemyWithLaser(laser, enemy));
        this.physics.add.overlap(this.enemyBullets, this.player, (bullet, player) => this.hitPlayerWithBullet(bullet));
        this.physics.add.overlap(this.enemies, this.player, (enemy, player) => this.hitPlayerWithEnemy(enemy));
        this.physics.add.overlap(this.powerups, this.player, (powerup, player) => this.collectPowerup(powerup));

        // 11. Wave 1 Mission Briefing Attract Banner
        this.showMissionBriefing();

        // 12. Immediate Enemy Spawn (500ms) + Recurring Spawner
        this.time.delayedCall(500, () => {
            if (this.gameState === 'playing' && !this.bossActive) {
                this.spawnWaveFormation();
            }
        });

        this.enemySpawnTimer = this.time.addEvent({
            delay: 1300,
            loop: true,
            callback: () => this.spawnWaveFormation()
        });
    }

    renderArcadeCabinetChassis() {
        const cx = this.scale.width / 2;

        // A. Cabinet Chassis & Side Panels (Depth 1)
        let cab = this.add.graphics().setDepth(1);
        cab.fillStyle(0x000000, 0.95);
        cab.fillRect(this.cabX - 4, this.cabY - 4, this.cabW + 8, this.cabH + 8);

        cab.fillStyle(0x0E101D, 1);
        cab.fillRect(this.cabX, this.cabY, this.cabW, this.cabH);

        const wingW = Math.max(12, Math.round((this.cabW - this.playW) / 2));

        // Left Side Wing (Synthwave artwork & T-molding)
        cab.fillStyle(0x16142B, 1);
        cab.fillRect(this.cabX, this.cabY, wingW, this.cabH);
        cab.lineStyle(3, 0xFF007F, 0.7);
        cab.lineBetween(this.cabX + 4, this.cabY + 50, this.cabX + wingW - 4, this.cabY + 140);
        cab.lineStyle(3, 0x00E5FF, 0.7);
        cab.lineBetween(this.cabX + 4, this.cabY + 90, this.cabX + wingW - 4, this.cabY + 180);
        cab.lineStyle(2, 0xFFD700, 0.7);
        cab.lineBetween(this.cabX + 4, this.cabY + 130, this.cabX + wingW - 4, this.cabY + 220);

        // Right Side Wing
        cab.fillStyle(0x16142B, 1);
        cab.fillRect(this.cabX + this.cabW - wingW, this.cabY, wingW, this.cabH);
        cab.lineStyle(3, 0xFF007F, 0.7);
        cab.lineBetween(this.cabX + this.cabW - 4, this.cabY + 50, this.cabX + this.cabW - wingW + 4, this.cabY + 140);
        cab.lineStyle(3, 0x00E5FF, 0.7);
        cab.lineBetween(this.cabX + this.cabW - 4, this.cabY + 90, this.cabX + this.cabW - wingW + 4, this.cabY + 180);
        cab.lineStyle(2, 0xFFD700, 0.7);
        cab.lineBetween(this.cabX + this.cabW - 4, this.cabY + 130, this.cabX + this.cabW - wingW + 4, this.cabY + 220);

        // T-Molding Trim (Bright orange/gold rubber edge)
        cab.fillStyle(0xFF5500, 1);
        cab.fillRect(this.cabX, this.cabY, 4, this.cabH);
        cab.fillRect(this.cabX + this.cabW - 4, this.cabY, 4, this.cabH);
        cab.fillStyle(0xFFAA00, 1);
        cab.fillRect(this.cabX + 1, this.cabY, 2, this.cabH);
        cab.fillRect(this.cabX + this.cabW - 3, this.cabY, 2, this.cabH);

        // Chrome Rivet Bolts along cabinet sides
        for (let ry = this.cabY + 30; ry < this.cabY + this.cabH; ry += 65) {
            cab.fillStyle(0x778899, 1);
            cab.fillCircle(this.cabX + 8, ry, 2.5);
            cab.fillCircle(this.cabX + this.cabW - 8, ry, 2.5);
            cab.fillStyle(0xFFFFFF, 1);
            cab.fillCircle(this.cabX + 7, ry - 1, 1);
            cab.fillCircle(this.cabX + this.cabW - 9, ry - 1, 1);
        }

        // B. Top Illuminated Marquee (Depth 35)
        let mq = this.add.graphics().setDepth(35);
        mq.fillStyle(0x222538, 1);
        mq.fillRect(this.cabX + 6, this.cabY + 6, this.cabW - 12, this.marqueeH);
        mq.fillStyle(0x0A0518, 1);
        mq.fillRect(this.cabX + 10, this.cabY + 10, this.cabW - 20, this.marqueeH - 8);

        mq.lineStyle(2, 0xFFD700, 1);
        mq.strokeRect(this.cabX + 10, this.cabY + 10, this.cabW - 20, this.marqueeH - 8);
        mq.lineStyle(1, 0x00E5FF, 0.8);
        mq.strokeRect(this.cabX + 12, this.cabY + 12, this.cabW - 24, this.marqueeH - 12);

        // Speaker Grille Slits
        const spkLeftX = this.cabX + 16;
        const spkRightX = this.cabX + this.cabW - 52;
        for (let s = 0; s < 4; s++) {
            let sy = this.cabY + 15 + s * 6;
            mq.fillStyle(0x000000, 1);
            mq.fillRect(spkLeftX, sy, 26, 3);
            mq.fillRect(spkRightX, sy, 26, 3);
            mq.fillStyle(0x333348, 1);
            mq.fillRect(spkLeftX, sy + 1, 26, 1);
            mq.fillRect(spkRightX, sy + 1, 26, 1);
        }

        // Marquee Text
        let mTitle = this.add.text(cx, this.cabY + 10 + (this.marqueeH - 8) / 2, '★ GALAXY DESTINY ★', {
            fontSize: (this.cabW > 500) ? '12px' : '9px',
            fill: '#FFD700',
            fontFamily: '"Press Start 2P", monospace',
            stroke: '#FF0055',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(36);

        this.tweens.add({
            targets: mTitle,
            alpha: { from: 0.85, to: 1 },
            duration: 650,
            yoyo: true,
            repeat: -1
        });

        // Exit Cabinet Button (in upper-right corner of Marquee)
        this.exitBtn = this.add.text(this.cabX + this.cabW - 14, this.cabY + 12, '[ EXIT ]', {
            fontSize: '7px', fill: '#FF5555', backgroundColor: '#000000', padding: { x: 5, y: 3 },
            fontFamily: '"Press Start 2P"'
        }).setOrigin(1, 0).setDepth(3000).setInteractive({ useHandCursor: true });
        this.exitBtn.on('pointerdown', () => this.exitCabinet());

        // C. Molded CRT Monitor Bezel & Curved Corners (Depth 30)
        let mBezel = this.add.graphics().setDepth(30);
        // Outer dark frame around the monitor (top, bottom, left, right bars)
        mBezel.fillStyle(0x0A0C16, 1);
        mBezel.fillRect(this.playX - 12, this.playY - 12, this.playW + 24, 12); // top bar
        mBezel.fillRect(this.playX - 12, this.playY + this.playH, this.playW + 24, 12); // bottom bar
        mBezel.fillRect(this.playX - 12, this.playY, 12, this.playH); // left bar
        mBezel.fillRect(this.playX + this.playW, this.playY, 12, this.playH); // right bar

        mBezel.lineStyle(2, 0x00E5FF, 1);
        mBezel.strokeRect(this.playX - 4, this.playY - 4, this.playW + 8, this.playH + 8);
        mBezel.lineStyle(1, 0xFFD700, 0.7);
        mBezel.strokeRect(this.playX - 2, this.playY - 2, this.playW + 4, this.playH + 4);

        // 4 CRT Curved Corner Masks
        const cR = 12;
        mBezel.fillStyle(0x0A0C16, 1);
        mBezel.fillTriangle(this.playX, this.playY, this.playX + cR, this.playY, this.playX, this.playY + cR);
        mBezel.fillTriangle(this.playX + this.playW, this.playY, this.playX + this.playW - cR, this.playY, this.playX + this.playW, this.playY + cR);
        mBezel.fillTriangle(this.playX, this.playY + this.playH, this.playX + cR, this.playY + this.playH, this.playX, this.playY + this.playH - cR);
        mBezel.fillTriangle(this.playX + this.playW, this.playY + this.playH, this.playX + this.playW - cR, this.playY + this.playH, this.playX + this.playW, this.playY + this.playH - cR);

        // Bezel Stickers
        this.add.text(this.playX + 8, this.playY - 8, '• DISNEY EDGE ARCADE •', {
            fontSize: '6px', fill: '#00E5FF', fontFamily: '"Press Start 2P"'
        }).setOrigin(0, 1).setDepth(32);

        this.add.text(this.playX + this.playW - 8, this.playY - 8, '★ 1 PLAY 25¢ ★', {
            fontSize: '6px', fill: '#FFD700', fontFamily: '"Press Start 2P"'
        }).setOrigin(1, 1).setDepth(32);
    }

    setupCabinetControlPanel() {
        const cx = this.scale.width / 2;
        const cpoY = this.cpoY;
        const cpoH = this.cpoH;

        // Control Panel Deck Surface (Depth 40)
        let cpoG = this.add.graphics().setDepth(40);
        cpoG.fillStyle(0x181B28, 1);
        cpoG.fillRect(this.cabX + 6, cpoY, this.cabW - 12, cpoH);
        cpoG.fillStyle(0x2B3147, 1);
        cpoG.fillRect(this.cabX + 6, cpoY, this.cabW - 12, 3);
        cpoG.fillStyle(0x0C0D14, 1);
        cpoG.fillRect(this.cabX + 6, cpoY + cpoH - 4, this.cabW - 12, 4);

        // Left & Right Chrome Clamps
        cpoG.fillStyle(0x778899, 1);
        cpoG.fillRect(this.cabX + 6, cpoY, 8, cpoH);
        cpoG.fillRect(this.cabX + this.cabW - 14, cpoY, 8, cpoH);

        // --- 1. Left Section: Illustrated 8-Way Joystick ---
        const joyX = this.cabX + Math.max(38, Math.round(this.cabW * 0.14));
        const joyY = cpoY + Math.round(cpoH * 0.52);

        // Black dust washer
        cpoG.fillStyle(0x0D0D11, 1);
        cpoG.fillCircle(joyX, joyY + 6, 16);
        cpoG.lineStyle(1, 0x333344, 1);
        cpoG.strokeCircle(joyX, joyY + 6, 16);

        // Chrome joystick shaft
        cpoG.fillStyle(0xCCD0E0, 1);
        cpoG.fillRect(joyX - 3, joyY - 12, 6, 18);

        // 3D Red Ball-Top Knob
        cpoG.fillStyle(0xEE1133, 1);
        cpoG.fillCircle(joyX, joyY - 14, 12);
        cpoG.fillStyle(0xFFFFFF, 0.85);
        cpoG.fillCircle(joyX - 3, joyY - 17, 3);

        // Joystick Direction Arrows & Label
        this.add.text(joyX, joyY + 24, 'STEER', {
            fontSize: '6px', fill: '#00E5FF', fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5).setDepth(42);
        this.add.text(joyX, joyY + 32, 'ARROWS / WASD', {
            fontSize: '5px', fill: '#A0B0C0', fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5).setDepth(42);

        // --- 2. Middle Section: Metal "HOW TO PLAY" Instruction Plate ---
        const cardW = Math.min(270, Math.max(160, this.cabW - 230));
        const cardX = cx - cardW / 2;
        const cardH = cpoH - 14;

        cpoG.fillStyle(0x0B1220, 1);
        cpoG.fillRect(cardX, cpoY + 7, cardW, cardH);
        cpoG.lineStyle(1, 0x00E5FF, 1);
        cpoG.strokeRect(cardX, cpoY + 7, cardW, cardH);
        cpoG.lineStyle(1, 0xFFD700, 0.8);
        cpoG.strokeRect(cardX + 2, cpoY + 9, cardW - 4, cardH - 4);

        // 4 Corner Screws
        cpoG.fillStyle(0x8899AA, 1);
        cpoG.fillCircle(cardX + 5, cpoY + 12, 1.5);
        cpoG.fillCircle(cardX + cardW - 5, cpoY + 12, 1.5);
        cpoG.fillCircle(cardX + 5, cpoY + 7 + cardH - 5, 1.5);
        cpoG.fillCircle(cardX + cardW - 5, cpoY + 7 + cardH - 5, 1.5);

        // Instruction Text on Plate
        this.add.text(cx, cpoY + 15, '★ HOW TO PLAY ★', {
            fontSize: '7px', fill: '#FFD700', fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5).setDepth(42);

        this.add.text(cx, cpoY + 28, 'FIRE: [SPACE] OR [Z] (AUTO-FIRE)', {
            fontSize: '6px', fill: '#FFFFFF', fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5).setDepth(42);

        this.add.text(cx, cpoY + 40, 'BOMB: [X] OR [B] (SMART BOMB)', {
            fontSize: '6px', fill: '#FF9100', fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5).setDepth(42);

        this.add.text(cx, cpoY + 52, 'ITEMS: [P]GUN [S]SHIELD [B]BOMB [★]PTS', {
            fontSize: '5px', fill: '#00FF66', fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5).setDepth(42);

        if (cpoH >= 110) {
            this.add.text(cx, cpoY + 64, 'DODGE RED BULLETS! TOUCH DRAG / ARROWS', {
                fontSize: '5px', fill: '#A0D0FF', fontFamily: '"Press Start 2P"'
            }).setOrigin(0.5).setDepth(42);
        }

        // --- 3. Right Section: Clickable & Touchable 3D Arcade Buttons ---
        const btnFireX = this.cabX + this.cabW - Math.max(38, Math.round(this.cabW * 0.12));
        const btnFireY = cpoY + Math.round(cpoH * 0.52);
        const btnBombX = btnFireX - Math.max(44, Math.round(cpoH * 0.42));
        const btnBombY = btnFireY + 4;

        // FIRE Button (Red)
        this.add.circle(btnFireX, btnFireY, 23, 0x111111).setDepth(41);
        this.fireBtn = this.add.circle(btnFireX, btnFireY, 19, 0xFF2233).setDepth(42)
            .setInteractive({ useHandCursor: true });
        this.add.circle(btnFireX - 4, btnFireY - 6, 5, 0xFFAAAA, 0.65).setDepth(43);

        this.add.text(btnFireX, btnFireY - 3, 'FIRE', {
            fontSize: '7px', fill: '#FFFFFF', fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5).setDepth(44);
        this.add.text(btnFireX, btnFireY + 8, '[SPACE]', {
            fontSize: '5px', fill: '#FFD700', fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5).setDepth(44);

        this.fireBtn.on('pointerdown', () => {
            this.touchFireActive = true;
            this.fireBtn.setScale(0.92);
            this.fireBtn.setFillStyle(0xCC1122);
            this.fireLaser();
        });
        const releaseFireBtn = () => {
            this.touchFireActive = false;
            this.fireBtn.setScale(1);
            this.fireBtn.setFillStyle(0xFF2233);
        };
        this.fireBtn.on('pointerup', releaseFireBtn);
        this.fireBtn.on('pointerout', releaseFireBtn);

        // BOMB Button (Orange/Yellow)
        this.add.circle(btnBombX, btnBombY, 20, 0x111111).setDepth(41);
        this.bombBtn = this.add.circle(btnBombX, btnBombY, 16, 0xFF7700).setDepth(42)
            .setInteractive({ useHandCursor: true });
        this.add.circle(btnBombX - 3, btnBombY - 5, 4, 0xFFDD88, 0.65).setDepth(43);

        this.add.text(btnBombX, btnBombY - 3, 'BOMB', {
            fontSize: '6px', fill: '#FFFFFF', fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5).setDepth(44);
        this.add.text(btnBombX, btnBombY + 7, '[X]', {
            fontSize: '5px', fill: '#FFFFFF', fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5).setDepth(44);

        this.bombBtn.on('pointerdown', () => {
            this.bombBtn.setScale(0.92);
            this.bombBtn.setFillStyle(0xCC5500);
            this.detonateSmartBomb();
        });
        const releaseBombBtn = () => {
            this.bombBtn.setScale(1);
            this.bombBtn.setFillStyle(0xFF7700);
        };
        this.bombBtn.on('pointerup', releaseBombBtn);
        this.bombBtn.on('pointerout', releaseBombBtn);
    }

    setupTouchDragControls() {
        // Direct finger-drag to steer ship anywhere across the CRT monitor
        this.input.on('pointerdown', (pointer) => {
            if (pointer.x >= this.playX && pointer.x <= this.playX + this.playW &&
                pointer.y >= this.playY && pointer.y <= this.playY + this.playH) {
                this.touchDragActive = true;
            }
        });
        this.input.on('pointermove', (pointer) => {
            if (this.touchDragActive && this.gameState === 'playing') {
                this.player.x = Phaser.Math.Clamp(pointer.x, this.playX + 16, this.playX + this.playW - 16);
                this.player.y = Phaser.Math.Clamp(pointer.y - 24, this.playY + 55, this.playY + this.playH - 30);
            }
        });
        this.input.on('pointerup', () => {
            this.touchDragActive = false;
        });
    }

    showMissionBriefing() {
        const cx = this.playX + this.playW / 2;
        const cy = this.playY + this.playH / 2 - 20;

        let brief = this.add.container(cx, cy).setDepth(65);
        let bg = this.add.rectangle(0, 0, Math.min(360, this.playW - 24), 142, 0x000000, 0.92)
            .setStrokeStyle(2, 0x00E5FF);

        let t1 = this.add.text(0, -48, '★ MISSION BRIEFING ★', {
            fontSize: '9px', fill: '#FFD700', fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5);

        let t2 = this.add.text(0, -30, 'DEFEND THE DISNEY DESTINY!', {
            fontSize: '7px', fill: '#00FF66', fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5);

        let t3 = this.add.text(0, -2, '• MOVE: ARROWS / WASD / TOUCH DRAG\n• FIRE: HOLD [SPACE] OR [Z] (AUTO)\n• BOMB: [X] OR [B] BLAST SCREEN\n• DODGE RED BULLETS! CATCH [P][S][B][★]', {
            fontSize: '6px', fill: '#FFFFFF', fontFamily: '"Press Start 2P"', align: 'left', lineSpacing: 4
        }).setOrigin(0.5);

        let t4 = this.add.text(0, 46, '>>> BLAST OFF! <<<', {
            fontSize: '9px', fill: '#FF2A85', fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5);

        brief.add([bg, t1, t2, t3, t4]);

        this.tweens.add({
            targets: t4,
            alpha: 0.2,
            duration: 250,
            yoyo: true,
            repeat: 6
        });

        this.missionBriefing = brief;
        this.time.delayedCall(3400, () => {
            this.dismissMissionBriefing();
        });
    }

    dismissMissionBriefing() {
        if (!this.missionBriefing || !this.missionBriefing.active) return;
        let b = this.missionBriefing;
        this.missionBriefing = null;
        this.tweens.add({
            targets: b,
            alpha: 0,
            y: b.y - 20,
            duration: 350,
            onComplete: () => b.destroy()
        });
    }

    updateBottomHUD() {
        const hearts = '♥ '.repeat(Math.max(0, this.lives));
        const bombs = '💣 '.repeat(Math.max(0, this.bombs));
        const shield = this.shieldHits > 0 ? `SHIELD:${this.shieldHits * 50}%` : 'SHIELD:OFF';
        this.bottomHud.setText(`${hearts} | ${bombs} | LVL${this.weaponLevel} | ${shield}`);
    }

    fireLaser() {
        const now = this.time.now;
        if (now - this.lastShotTime < this.shotCooldown) return;
        this.lastShotTime = now;

        if (this.missionBriefing && this.missionBriefing.active) {
            this.dismissMissionBriefing();
        }

        retroArcadeAudio.playLaser();

        const px = this.player.x;
        const py = this.player.y - 14;

        if (this.weaponLevel === 1) {
            // Dual parallel lasers
            let l1 = this.playerLasers.create(px - 7, py, 'shooter_laser_player').setDepth(15);
            let l2 = this.playerLasers.create(px + 7, py, 'shooter_laser_player').setDepth(15);
            if (l1.body) l1.body.allowGravity = false;
            if (l2.body) l2.body.allowGravity = false;
            l1.setVelocityY(-560);
            l2.setVelocityY(-560);
        } else if (this.weaponLevel === 2) {
            // Triple spread laser
            let l1 = this.playerLasers.create(px, py, 'shooter_laser_player').setDepth(15);
            let l2 = this.playerLasers.create(px - 9, py + 2, 'shooter_laser_spread').setDepth(15);
            let l3 = this.playerLasers.create(px + 9, py + 2, 'shooter_laser_spread').setDepth(15);
            if (l1.body) l1.body.allowGravity = false;
            if (l2.body) l2.body.allowGravity = false;
            if (l3.body) l3.body.allowGravity = false;
            l1.setVelocity(0, -560);
            l2.setVelocity(-140, -500);
            l3.setVelocity(140, -500);
        } else {
            // Quad heavy plasma
            let l1 = this.playerLasers.create(px - 6, py, 'shooter_laser_player').setDepth(15);
            let l2 = this.playerLasers.create(px + 6, py, 'shooter_laser_player').setDepth(15);
            let l3 = this.playerLasers.create(px - 14, py + 4, 'shooter_laser_spread').setDepth(15);
            let l4 = this.playerLasers.create(px + 14, py + 4, 'shooter_laser_spread').setDepth(15);
            if (l1.body) l1.body.allowGravity = false;
            if (l2.body) l2.body.allowGravity = false;
            if (l3.body) l3.body.allowGravity = false;
            if (l4.body) l4.body.allowGravity = false;
            l1.setVelocity(0, -580);
            l2.setVelocity(0, -580);
            l3.setVelocity(-190, -480);
            l4.setVelocity(190, -480);
        }
    }

    detonateSmartBomb() {
        if (this.bombs <= 0 || this.gameState !== 'playing') return;
        this.bombs--;
        this.updateBottomHUD();

        retroArcadeAudio.playBomb();
        this.cameras.main.shake(250, 0.02);

        // Flash screen
        let flash = this.add.rectangle(this.playX + this.playW / 2, this.playY + this.playH / 2, this.playW, this.playH, 0xFFFFFF, 0.85).setDepth(200);
        this.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 250,
            onComplete: () => flash.destroy()
        });

        // Clear all enemy bullets
        this.enemyBullets.clear(true, true);

        // Damage all enemies
        this.enemies.getChildren().forEach(e => {
            if (e.isBoss) {
                this.damageBoss(40);
            } else {
                this.destroyEnemy(e, true);
            }
        });
    }

    spawnWaveFormation() {
        if (this.gameState !== 'playing' || this.bossActive) return;

        // Wave Target reached -> Boss spawn on Wave 3 (and multiples of 3)
        if (this.enemiesDefeatedInWave >= this.waveTargetEnemies) {
            if (this.wave % 3 === 0 && !this.bossActive) {
                this.spawnBoss();
                return;
            } else if (this.wave % 3 !== 0) {
                this.advanceWave();
                return;
            }
        }

        const type = Phaser.Math.Between(1, 10);
        const startX = this.playX + Phaser.Math.Between(24, this.playW - 24);

        if (type <= 5) {
            // Alien Drone Swarm
            let drone = this.enemies.create(startX, this.playY - 10, 'shooter_drone').setDepth(10);
            drone.hp = 1;
            drone.scoreVal = 100;
            drone.setVelocityY(90 + this.wave * 10);
            drone.sineOffset = Phaser.Math.Between(0, 100);
            drone.shootCooldown = Phaser.Math.Between(1200, 2400);
            drone.lastShoot = this.time.now;
        } else if (type <= 8) {
            // Cosmic Cruiser
            let cruiser = this.enemies.create(startX, this.playY - 12, 'shooter_cruiser').setDepth(10);
            cruiser.hp = 3;
            cruiser.scoreVal = 250;
            cruiser.setVelocity(Phaser.Math.Between(-30, 30), 60 + this.wave * 8);
            cruiser.shootCooldown = 1500;
            cruiser.lastShoot = this.time.now;
        } else {
            // Space Asteroid
            let rock = this.enemies.create(startX, this.playY - 12, 'shooter_asteroid_large').setDepth(10);
            rock.hp = 2;
            rock.scoreVal = 150;
            rock.isAsteroid = true;
            rock.setVelocity(Phaser.Math.Between(-20, 20), 80);
            rock.rotSpeed = Phaser.Math.Between(-3, 3);
        }
    }

    spawnBoss() {
        this.bossActive = true;
        this.maxBossHP = 100 + this.wave * 20;
        this.bossHP = this.maxBossHP;

        // Siren Warning
        retroArcadeAudio.playDamage();
        this.bossText.setVisible(true);
        this.bossBarContainer.setVisible(true);

        this.tweens.add({
            targets: this.bossText,
            alpha: 0.2,
            duration: 300,
            yoyo: true,
            repeat: 4,
            onComplete: () => this.bossText.setVisible(false)
        });

        // Create Boss Dreadnought
        let boss = this.enemies.create(this.playX + this.playW / 2, this.playY - 30, 'shooter_boss').setDepth(11);
        boss.isBoss = true;
        boss.body.setSize(68, 44);
        boss.setVelocityY(40);
        this.boss = boss;

        this.time.delayedCall(1200, () => {
            if (this.boss && this.boss.active) {
                this.boss.setVelocity(80, 0);
            }
        });
    }

    updateBoss(time, delta) {
        if (!this.boss || !this.boss.active) return;

        // Bounce horizontally
        if (this.boss.x < this.playX + 44) {
            this.boss.setVelocityX(80 + this.wave * 10);
        } else if (this.boss.x > this.playX + this.playW - 44) {
            this.boss.setVelocityX(-80 - this.wave * 10);
        }

        // Draw Boss Health Bar
        this.bossBarContainer.clear();
        let barW = this.playW - 40;
        let barH = 6;
        let bx = this.playX + 20;
        let by = this.playY + 22;

        this.bossBarContainer.fillStyle(0x000000, 0.8);
        this.bossBarContainer.fillRect(bx - 2, by - 2, barW + 4, barH + 4);
        this.bossBarContainer.lineStyle(1, 0xFFD700, 1);
        this.bossBarContainer.strokeRect(bx - 2, by - 2, barW + 4, barH + 4);

        let pct = Math.max(0, this.bossHP / this.maxBossHP);
        let col = (pct > 0.5) ? 0x00FF66 : (pct > 0.25) ? 0xFFD700 : 0xFF0055;
        this.bossBarContainer.fillStyle(col, 1);
        this.bossBarContainer.fillRect(bx, by, barW * pct, barH);

        // Boss Attack Patterns
        this.bossLaserTimer += delta;
        if (this.bossLaserTimer > 1200) {
            this.bossLaserTimer = 0;
            // Wing spread bullets
            let b1 = this.enemyBullets.create(this.boss.x - 24, this.boss.y + 18, 'shooter_bullet_enemy').setDepth(12);
            let b2 = this.enemyBullets.create(this.boss.x + 24, this.boss.y + 18, 'shooter_bullet_enemy').setDepth(12);
            b1.setVelocity(-40, 140);
            b2.setVelocity(40, 140);

            // Aimed energy core orb
            let angle = Phaser.Math.Angle.Between(this.boss.x, this.boss.y, this.player.x, this.player.y);
            let b3 = this.enemyBullets.create(this.boss.x, this.boss.y + 20, 'shooter_bullet_boss').setDepth(12);
            b3.setVelocity(Math.cos(angle) * 160, Math.sin(angle) * 160);
        }
    }

    damageBoss(amount) {
        this.bossHP -= amount;
        retroArcadeAudio.playBossHit();

        // Flash boss
        if (this.boss) {
            this.boss.setTintFill(0xFFFFFF);
            this.time.delayedCall(60, () => {
                if (this.boss && this.boss.active) this.boss.clearTint();
            });
        }

        if (this.bossHP <= 0) {
            this.destroyBoss();
        }
    }

    destroyBoss() {
        this.bossActive = false;
        this.bossBarContainer.setVisible(false);

        // Cascading explosions
        for (let i = 0; i < 8; i++) {
            this.time.delayedCall(i * 180, () => {
                retroArcadeAudio.playExplosion();
                this.cameras.main.shake(150, 0.015);
                let ex = this.boss ? this.boss.x + Phaser.Math.Between(-30, 30) : this.playX + this.playW / 2;
                let ey = this.boss ? this.boss.y + Phaser.Math.Between(-20, 20) : this.playY + 70;
                this.spawnExplosion(ex, ey);
            });
        }

        this.time.delayedCall(1600, () => {
            if (this.boss) {
                this.addScore(2500);
                this.boss.destroy();
                this.boss = null;
            }
            // Drop powerups
            ['shooter_powerup_P', 'shooter_powerup_S', 'shooter_powerup_B', 'shooter_powerup_STAR'].forEach((key, idx) => {
                let p = this.powerups.create(this.playX + 80 + idx * 70, this.playY + 60, key).setDepth(14);
                p.pType = key.replace('shooter_powerup_', '');
                p.setVelocityY(70);
            });

            this.advanceWave();
        });
    }

    advanceWave() {
        this.wave++;
        this.enemiesDefeatedInWave = 0;
        this.waveTargetEnemies = 16 + this.wave * 4;
        this.waveText.setText(`WAVE ${String(this.wave).padStart(2, '0')}`);

        // Floating Wave Banner
        let wMsg = this.add.text(this.playX + this.playW / 2, this.playY + this.playH / 2 - 20, `★ WAVE ${this.wave} ★`, {
            fontSize: '12px', fill: '#00E5FF', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5).setDepth(200);

        this.tweens.add({
            targets: wMsg,
            scale: 1.2,
            duration: 1000,
            yoyo: true,
            onComplete: () => wMsg.destroy()
        });
    }

    hitEnemyWithLaser(laser, enemy) {
        laser.destroy();
        enemy.hp--;

        if (enemy.isBoss) {
            this.damageBoss(2);
            return;
        }

        if (enemy.hp <= 0) {
            this.destroyEnemy(enemy, false);
        } else {
            enemy.setTintFill(0xFFFFFF);
            this.time.delayedCall(40, () => {
                if (enemy && enemy.active) enemy.clearTint();
            });
        }
    }

    destroyEnemy(enemy, isBomb) {
        if (!enemy.active) return;
        const ex = enemy.x;
        const ey = enemy.y;
        const pts = enemy.scoreVal || 100;

        retroArcadeAudio.playExplosion();
        this.spawnExplosion(ex, ey);
        this.addScore(pts);
        this.enemiesDefeatedInWave++;

        // Asteroid fragment splitting
        if (enemy.isAsteroid) {
            let a1 = this.enemies.create(ex - 8, ey, 'shooter_asteroid_small').setDepth(10);
            let a2 = this.enemies.create(ex + 8, ey, 'shooter_asteroid_small').setDepth(10);
            a1.hp = 1; a1.scoreVal = 75; a1.setVelocity(-50, 90);
            a2.hp = 1; a2.scoreVal = 75; a2.setVelocity(50, 90);
        }

        // Random Powerup Drop
        const dropRoll = Phaser.Math.Between(1, 100);
        if (dropRoll <= 18) {
            const keys = ['P', 'S', 'B', 'STAR'];
            const chosen = Phaser.Utils.Array.GetRandom(keys);
            let p = this.powerups.create(ex, ey, 'shooter_powerup_' + chosen).setDepth(14);
            p.pType = chosen;
            p.setVelocityY(65);
        }

        enemy.destroy();
    }

    spawnExplosion(x, y) {
        let exp = this.add.sprite(x, y, 'shooter_explosion_0').setDepth(18);
        let frames = ['shooter_explosion_0', 'shooter_explosion_1', 'shooter_explosion_2', 'shooter_explosion_3'];
        frames.forEach((f, idx) => {
            this.time.delayedCall(idx * 50, () => {
                if (exp && exp.active) exp.setTexture(f);
            });
        });
        this.time.delayedCall(220, () => exp.destroy());
    }

    hitPlayerWithBullet(bullet) {
        bullet.destroy();
        this.damagePlayer();
    }

    hitPlayerWithEnemy(enemy) {
        if (!enemy.isBoss) {
            this.destroyEnemy(enemy, false);
        }
        this.damagePlayer();
    }

    damagePlayer() {
        if (this.invulnerableTimer > 0 || this.gameState !== 'playing') return;

        // Shield Absorbs Hit
        if (this.shieldHits > 0) {
            this.shieldHits--;
            retroArcadeAudio.playDamage();
            this.updateBottomHUD();
            this.cameras.main.shake(120, 0.01);
            if (this.shieldHits <= 0) {
                this.shieldSprite.setVisible(false);
            } else {
                this.shieldSprite.setTint(0xFFAA00);
            }
            let deflect = this.add.circle(this.player.x, this.player.y, 25, 0x00E5FF, 0.6).setDepth(25);
            this.tweens.add({ targets: deflect, radius: 44, alpha: 0, duration: 250, onComplete: () => deflect.destroy() });
            this.invulnerableTimer = 400; // Brief grace period so multi-bullet salvo doesn't instantly pierce life
            return;
        }

        // Lose Life
        this.lives--;
        this.updateBottomHUD();
        retroArcadeAudio.playDamage();
        this.spawnExplosion(this.player.x, this.player.y);
        this.cameras.main.shake(250, 0.02);

        if (this.lives <= 0) {
            this.triggerGameOver();
        } else {
            // Keep ship in place under player control - never teleport or hide the ship!
            this.tweens.killTweensOf(this.player);
            this.tweens.killTweensOf(this.thruster);

            this.player.setAlpha(1.0);
            this.player.setVisible(true);
            this.thruster.setAlpha(1.0);
            this.thruster.setVisible(true);

            // Destroy enemy bullets immediately surrounding the player in 110px radius
            const px = this.player.x;
            const py = this.player.y;
            this.enemyBullets.getChildren().forEach(b => {
                if (Phaser.Math.Distance.Between(b.x, b.y, px, py) < 110) {
                    b.destroy();
                }
            });

            // Activate invulnerability forcefield aura
            this.invulnerableTimer = 2400;
            if (this.invulnShield) {
                this.invulnShield.setPosition(px, py).setVisible(true).setScale(1.0);
            }
        }
    }

    collectPowerup(powerup) {
        const type = powerup.pType;
        powerup.destroy();
        retroArcadeAudio.playPowerup();

        this.player.setVisible(true);
        this.player.setAlpha(1.0);

        let label = '';
        if (type === 'P') {
            this.weaponLevel = Math.min(3, this.weaponLevel + 1);
            label = `WEAPON LVL ${this.weaponLevel}!`;
        } else if (type === 'S') {
            this.shieldHits = 2;
            this.shieldSprite.setVisible(true).clearTint();
            this.invulnerableTimer = 0;
            if (this.invulnShield) this.invulnShield.setVisible(false);
            this.player.clearTint();
            label = 'ENERGY SHIELD (2 HITS)!';
        } else if (type === 'B') {
            this.bombs = Math.min(5, this.bombs + 1);
            label = '+1 SMART BOMB!';
        } else {
            this.addScore(1000);
            label = '+1000 PTS!';
        }
        this.updateBottomHUD();

        let t = this.add.text(this.player.x, this.player.y - 25, label, {
            fontSize: '8px', fill: '#FFD700', fontFamily: '"Press Start 2P"', stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(100);

        this.tweens.add({
            targets: t,
            y: t.y - 20,
            alpha: 0,
            duration: 800,
            onComplete: () => t.destroy()
        });
    }

    addScore(pts) {
        this.score += pts;
        this.scoreText.setText(`1UP ${String(this.score).padStart(6, '0')}`);
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.highText.setText(`HIGH ${String(this.highScore).padStart(6, '0')}`);
            this.highText.setStyle({ fill: '#00FF66' });
        }
    }

    triggerGameOver() {
        this.gameState = 'gameover';
        retroArcadeAudio.playGameOver();
        this.player.setVisible(false);
        this.player.clearTint();
        this.thruster.setVisible(false);
        this.shieldSprite.setVisible(false);
        if (this.invulnShield) this.invulnShield.setVisible(false);

        // Save High Score
        const updatedScores = saveEdgeHighScore(this.score, 'RILEY');
        const isNewHigh = (updatedScores[0] && updatedScores[0].name === 'RILEY' && updatedScores[0].score === this.score);

        // Game Over Dialog Box
        const cx = this.playX + this.playW / 2;
        const cy = this.playY + this.playH / 2;

        let box = this.add.rectangle(cx, cy, this.playW - 30, 210, 0x000000, 0.95)
            .setStrokeStyle(3, isNewHigh ? 0xFFD700 : 0x00E5FF).setDepth(500);

        this.add.text(cx, cy - 75, '★ GAME OVER ★', {
            fontSize: '12px', fill: '#FF2A85', fontFamily: '"Press Start 2P"', stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(501);

        this.add.text(cx, cy - 45, `FINAL SCORE: ${String(this.score).padStart(6, '0')}`, {
            fontSize: '9px', fill: '#FFFFFF', fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5).setDepth(501);

        this.add.text(cx, cy - 25, `WAVES CLEARED: ${this.wave - 1}`, {
            fontSize: '8px', fill: '#A0D0FF', fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5).setDepth(501);

        if (isNewHigh) {
            this.add.text(cx, cy + 2, '★ NEW HIGH SCORE! ★', {
                fontSize: '9px', fill: '#FFD700', fontFamily: '"Press Start 2P"'
            }).setOrigin(0.5).setDepth(501);
            this.add.text(cx, cy + 20, 'RILEY IS #1 ON EDGE BOARD!', {
                fontSize: '7px', fill: '#00FF66', fontFamily: '"Press Start 2P"'
            }).setOrigin(0.5).setDepth(501);
        } else {
            this.add.text(cx, cy + 12, 'EDGE LEADERBOARD UPDATED', {
                fontSize: '8px', fill: '#00FF66', fontFamily: '"Press Start 2P"'
            }).setOrigin(0.5).setDepth(501);
        }

        // Restart & Exit Buttons
        let restartBtn = this.add.text(cx, cy + 50, '[ PLAY AGAIN ]', {
            fontSize: '9px', fill: '#000000', backgroundColor: '#FFD700', padding: { x: 10, y: 6 },
            fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5).setDepth(501).setInteractive({ useHandCursor: true });

        let exitBtn = this.add.text(cx, cy + 80, '[ RETURN TO LOUNGE ]', {
            fontSize: '8px', fill: '#FF5555', backgroundColor: '#000000', padding: { x: 8, y: 4 },
            fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5).setDepth(501).setInteractive({ useHandCursor: true });

        restartBtn.on('pointerdown', () => {
            this.scene.restart();
        });
        exitBtn.on('pointerdown', () => {
            this.exitCabinet();
        });

        this.input.keyboard.on('keydown-ENTER', () => {
            if (this.gameState === 'gameover') this.scene.restart();
        });
    }

    exitCabinet() {
        if (this.physics && this.physics.world && this.physics.world.gravity) {
            this.physics.world.gravity.y = 1000;
        }
        if (this.invulnShield) this.invulnShield.setVisible(false);
        if (this.player) this.player.clearTint();
        if (this._cleanWindowListeners) {
            this._cleanWindowListeners();
        }
        if (this.edgeScene && this.edgeScene.scene) {
            this.edgeScene.scene.setVisible(true);
            this.edgeScene.scene.resume();
        }
        this.scene.stop('ArcadeShooterScene');
        if (this.edgeScene && this.edgeScene.onReturnFromArcade) {
            this.edgeScene.onReturnFromArcade(this.score);
        }
    }

    update(time, delta) {
        const dt = delta / 1000;

        // Scroll Starfield
        for (let i = 0; i < this.stars.length; i++) {
            let s = this.stars[i];
            s.obj.y += s.speed * dt;
            if (s.obj.y > this.playY + this.playH - 4) {
                s.obj.y = this.playY + 4;
                s.obj.x = this.playX + Phaser.Math.Between(4, this.playW - 4);
            }
        }

        if (this.gameState !== 'playing') return;

        // Player Movement (Mutually exclusive & DOM keyup protected)
        let isLeft = (this.cursors.left && this.cursors.left.isDown) || (this.keys.a && this.keys.a.isDown);
        let isRight = (this.cursors.right && this.cursors.right.isDown) || (this.keys.d && this.keys.d.isDown);
        let isUp = (this.cursors.up && this.cursors.up.isDown) || (this.keys.w && this.keys.w.isDown);
        let isDown = (this.cursors.down && this.cursors.down.isDown) || (this.keys.s && this.keys.s.isDown);

        let vx = 0;
        let vy = 0;
        const pSpeed = 240;

        if (isLeft && !isRight) vx = -pSpeed;
        else if (isRight && !isLeft) vx = pSpeed;

        if (isUp && !isDown) vy = -pSpeed;
        else if (isDown && !isUp) vy = pSpeed;

        if (vx !== 0 && vy !== 0) {
            vx *= 0.7071;
            vy *= 0.7071;
        }

        if (!this.touchDragActive) {
            this.player.x += vx * dt;
            this.player.y += vy * dt;
            this.player.x = Phaser.Math.Clamp(this.player.x, this.playX + 16, this.playX + this.playW - 16);
            this.player.y = Phaser.Math.Clamp(this.player.y, this.playY + 60, this.playY + this.playH - 30);
        }
        this.player.body.reset(this.player.x, this.player.y);

        this.thruster.setPosition(this.player.x, this.player.y + 16);
        this.thruster.setScale(Phaser.Math.Between(8, 12) / 10);
        this.shieldSprite.setPosition(this.player.x, this.player.y);
        if (this.shieldHits > 0) {
            this.shieldSprite.angle += 1.5;
        }

        // Invulnerability Forcefield & Golden Sparkle Surge (Ship is 100% visible, never transparent or hidden!)
        if (this.invulnerableTimer > 0) {
            this.invulnerableTimer -= delta;
            this.player.setAlpha(1.0);
            this.thruster.setAlpha(1.0);

            // Sparkling golden energy surge across hull (only when recovering from life loss, not during shield deflection)
            if (this.shieldHits === 0) {
                const isTint = Math.floor(this.invulnerableTimer / 70) % 2 === 0;
                this.player.setTint(isTint ? 0xFFFFAA : 0xFFD700);

                // Pulse glowing invulnerability forcefield around the ship
                if (this.invulnShield) {
                    this.invulnShield.setPosition(this.player.x, this.player.y).setVisible(true);
                    const pulse = 1.0 + Math.sin(time * 0.015) * 0.12;
                    this.invulnShield.setScale(pulse);
                    this.invulnShield.setAlpha(0.75 + Math.sin(time * 0.02) * 0.25);
                }
            }

            if (this.invulnerableTimer <= 0) {
                this.invulnerableTimer = 0;
                this.player.clearTint();
                if (this.invulnShield) {
                    this.invulnShield.setVisible(false);
                }
            }
        }

        // Continuous Fire while Space/Z/Fire Button held
        if (this.cursors.space.isDown || this.keys.space.isDown || this.keys.z.isDown || this.touchFireActive) {
            this.fireLaser();
        }

        // Clean off-screen player lasers (all the way to the top of screen)
        this.playerLasers.getChildren().forEach(laser => {
            if (laser.y < this.playY - 16 || laser.y > this.playY + this.playH + 16 || laser.x < this.playX - 16 || laser.x > this.playX + this.playW + 16) {
                laser.destroy();
            }
        });

        // Clean off-screen enemy bullets
        this.enemyBullets.getChildren().forEach(b => {
            if (b.y > this.playY + this.playH || b.x < this.playX || b.x > this.playX + this.playW) {
                b.destroy();
            }
        });

        // Update Enemies
        this.enemies.getChildren().forEach(e => {
            if (e.isBoss) return;

            // Sine wave drone movement
            if (e.sineOffset !== undefined) {
                e.x += Math.sin((time + e.sineOffset) * 0.005) * 1.5;
            }

            // Enemy Shooting
            if (time - e.lastShoot > e.shootCooldown && e.y > this.playY + 20 && e.y < this.playY + this.playH - 60) {
                e.lastShoot = time;
                let b = this.enemyBullets.create(e.x, e.y + 10, 'shooter_bullet_enemy').setDepth(12);
                b.setVelocityY(160 + this.wave * 12);
            }

            // Clean off-screen enemies
            if (e.y > this.playY + this.playH + 20) {
                e.destroy();
            }
        });

        // Update Boss
        if (this.bossActive) {
            this.updateBoss(time, delta);
        }

        // Clean off-screen powerups
        this.powerups.getChildren().forEach(p => {
            if (p.y > this.playY + this.playH + 10) {
                p.destroy();
            }
        });
    }
}

// =========================================================================
// PHASER GAME CONFIGURATION & SCENE REGISTRATION
// =========================================================================

config.scene = [
    BootScene,
    TitleScene,
    CharacterSelectScene,
    GameScene,
    ElevatorMenuScene,
    BoutiqueScene,
    EdgeClubScene,
    ArcadeShooterScene
];
window.game = new Phaser.Game(config);
const game = window.game;

