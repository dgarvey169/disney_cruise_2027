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

