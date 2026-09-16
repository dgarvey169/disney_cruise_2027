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

        // Generate Amelia Textures (32x40)
        this.generatePixelTexture('amelia', 32, 40, amelia_idle, AMELIA_PALETTE, 2);
        this.generatePixelTexture('amelia_idle', 32, 40, amelia_idle, AMELIA_PALETTE, 2);
        this.generatePixelTexture('amelia_walk_0', 32, 40, amelia_walk_0, AMELIA_PALETTE, 2);
        this.generatePixelTexture('amelia_walk_1', 32, 40, amelia_walk_1, AMELIA_PALETTE, 2);
        this.generatePixelTexture('amelia_walk_2', 32, 40, amelia_walk_2, AMELIA_PALETTE, 2);
        this.generatePixelTexture('amelia_jump', 32, 40, amelia_jump, AMELIA_PALETTE, 2);

        // Generate Floatie variations
        const floatieColors = [0xFF0000, 0xFFFF00, 0x00E000, 0x9400D3];
        const floatieShades = [0x990000, 0xCC9900, 0x008800, 0x550055];
        for (let i = 0; i < floatieColors.length; i++) {
            let rPal = Object.assign({}, RILEY_PALETTE, { 'F': floatieColors[i], 'f': floatieShades[i] });
            this.generatePixelTexture('riley_swim_' + i, 32, 48, riley_swim, rPal, 2);

            let aPal = Object.assign({}, AMELIA_PALETTE, { 'F': floatieColors[i], 'f': floatieShades[i] });
            this.generatePixelTexture('amelia_swim_' + i, 32, 40, amelia_swim, aPal, 2);
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
        g.fillRect(0, 0, 40, 40);
        g.fillStyle(0x58B8F8, 0.7);
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

        g.destroy();
    }
    create() {
        this.scene.start('TitleScene');
    }
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

        // --- SHIP WALLS ---
        // Deck 11 lower hull (beneath y=1280 down to y=1420)
        this.add.tileSprite(0, 1280, 2400, 140, 'ship_wall').setOrigin(0, 0);

        // Deck 12 wall (behind Deck 11, from Deck 12 floor y=1000 down to Deck 11 back wall y=1240)
        this.add.tileSprite(340, 1000, 2060, 240, 'ship_wall').setOrigin(0, 0);

        // Deck 13 wall (behind Deck 12, from Deck 13 floor y=760 down to Deck 12 back wall y=960)
        this.add.tileSprite(20, 760, 2040, 200, 'ship_wall').setOrigin(0, 0);

        // Top of AquaMouse structure (from launch deck y=360 down to Deck 13 back wall y=720)
        this.add.tileSprite(700, 360, 100, 360, 'ship_wall').setOrigin(0, 0);

        // 8-bit Architectural Baseboard Trim Lines between vertical walls and horizontal deck corridors
        this.add.rectangle(340, 1240, 2060, 2, 0x182030).setOrigin(0, 1).setDepth(2);
        this.add.rectangle(20, 960, 2040, 2, 0x182030).setOrigin(0, 1).setDepth(2);
        this.add.rectangle(20, 720, 2040, 2, 0x182030).setOrigin(0, 1).setDepth(2);

        const platforms = this.physics.add.staticGroup();
        const water = this.physics.add.staticGroup();
        this.water = water;
        const slides = this.physics.add.staticGroup();
        const doors = this.physics.add.staticGroup();

        const createStaircase = (startX, startY, steps, dirX, dirY) => {
            // Visual steps
            for (let i = 0; i < steps; i++) {
                let sx = startX + (i * 40 * dirX);
                let sy = startY + (i * 40 * dirY);
                this.add.image(sx, sy, 'stair_step').setDepth(sy); // Authentic 8-bit beveled step
                this.add.image(sx, sy - 20, 'railing').setDepth(sy + 10);
            }
        };

        // ----------------------------------------------------
        // DECK 11 (Main Pool Deck) - y: 1240 to 1280 (center y=1260)
        // ----------------------------------------------------
        platforms.create(450, 1260, 'deck').setScale(22, 1).refreshBody(); 
        water.create(1040, 1260, 'pool').setScale(7.5, 1).refreshBody();   
        platforms.create(1790, 1260, 'deck').setScale(30.5, 1).refreshBody(); 
        
        doors.create(400, 1210, 'door'); 
        this.add.text(350, 1165, 'SENSES SPA', { fontSize: '9px', fill: '#FFD700', backgroundColor: '#001024', padding: { x: 6, y: 4 }, fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 2 });
        
        doors.create(2100, 1210, 'door');
        this.add.text(2010, 1165, 'MARCELINE MARKET', { fontSize: '9px', fill: '#58B8F8', backgroundColor: '#001024', padding: { x: 6, y: 4 }, fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 2 });
        // Dynamic 8-Bit Funnel Vision Screen
        this.createFunnelVision();

        const iceCreamStands = this.physics.add.staticGroup();
        iceCreamStands.create(1500, 1210, 'icecream_stand');
        this.add.text(1430, 1165, 'EYE SCREAM TREATS', { fontSize: '9px', fill: '#F85898', backgroundColor: '#001024', padding: { x: 6, y: 4 }, fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 2 });

        // Stairs up to Deck 12 (right-up): connects Deck 11 (y=1280) to Deck 12 (y=1000)
        createStaircase(60, 1280, 7, 1, -1);

        // ----------------------------------------------------
        // DECK 12 (Quiet Cove & Hero Zone) - y: 960 to 1000 (center y=980)
        // ----------------------------------------------------
        platforms.create(440, 980, 'deck').setScale(5, 1).refreshBody();      // left of Quiet Cove
        water.create(630, 980, 'pool').setScale(5, 1).refreshBody();           // Quiet Cove pool
        platforms.create(1215, 980, 'deck').setScale(24.5, 1).refreshBody();  // between pools
        water.create(1800, 980, 'pool').setScale(5, 1).refreshBody();          // Toy Story Splash pool
        platforms.create(2160, 980, 'deck').setScale(13, 1).refreshBody();    // right of Toy Story

        this.add.text(590, 935, 'QUIET COVE', { fontSize: '9px', fill: '#00F8A0', backgroundColor: '#001024', padding: { x: 6, y: 4 }, fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 2 });
        this.add.text(1680, 935, 'TOY STORY SPLASH', { fontSize: '9px', fill: '#F8A800', backgroundColor: '#001024', padding: { x: 6, y: 4 }, fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 2 });

        doors.create(2000, 930, 'door');
        this.add.text(1960, 885, 'HERO ZONE', { fontSize: '9px', fill: '#E83818', backgroundColor: '#001024', padding: { x: 6, y: 4 }, fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 2 });

        // Stairs up to Deck 13 (left-up): connects Deck 12 (y=1000) to Deck 13 (y=760)
        createStaircase(2300, 1000, 6, -1, -1);

        // ----------------------------------------------------
        // DECK 13 (AquaMouse) - y: 720 to 760 (center y=740)
        // ----------------------------------------------------
        platforms.create(125, 740, 'deck').setScale(5.5, 1).refreshBody();     // left sliver
        water.create(350, 740, 'pool').setScale(6, 1).refreshBody();            // Splashdown pool
        platforms.create(1265, 740, 'deck').setScale(40, 1).refreshBody();     // right of splashdown → reaches x=2065

        // AquaMouse Splashdown Pool
        this.add.text(340, 695, 'SPLASHDOWN', { fontSize: '9px', fill: '#58B8F8', backgroundColor: '#001024', padding: { x: 6, y: 4 }, fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 2 });

        this.add.text(1170, 695, 'AQUAMOUSE ENTRANCE', { fontSize: '9px', fill: '#FFD700', backgroundColor: '#001024', padding: { x: 6, y: 4 }, fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 2 });
        
        // AquaMouse Raft Lift
        this.raft = this.physics.add.sprite(1200, 740, 'raft');
        this.raft.body.allowGravity = false;
        this.raft.setImmovable(true);
        
        let liftZone = this.add.zone(1200, 740, 80, 80);
        this.physics.world.enable(liftZone);
        liftZone.body.allowGravity = false;
        
        this.ridingRaft = false;
        this.liftZone = liftZone;

        // Top Deck of AquaMouse
        platforms.create(750, 340, 'deck').setScale(2.5, 1).refreshBody();
        this.add.text(670, 290, 'AQUAMOUSE LAUNCH', { fontSize: '9px', fill: '#FFD700', backgroundColor: '#001024', padding: { x: 6, y: 4 }, fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 2 });

        // --- 2.5D POOL WATER SUBMERSION COPING & CORRIDORS ---
        // Marble front coping and translucent water surface overlay for authentic 2.5D pool submersion
        this.add.tileSprite(890, 1268, 300, 12, 'pool_front_edge').setOrigin(0, 0).setDepth(1275);
        this.add.tileSprite(530, 988, 200, 12, 'pool_front_edge').setOrigin(0, 0).setDepth(995);
        this.add.tileSprite(1700, 988, 200, 12, 'pool_front_edge').setOrigin(0, 0).setDepth(995);
        this.add.tileSprite(230, 748, 240, 12, 'pool_front_edge').setOrigin(0, 0).setDepth(755);

        this.pools = [
            { name: 'deck11_main', xMin: 890, xMax: 1190, yMin: 1240, yMax: 1280 },
            { name: 'deck12_quiet', xMin: 530, xMax: 730, yMin: 960, yMax: 1000 },
            { name: 'deck12_toystory', xMin: 1700, xMax: 1900, yMin: 960, yMax: 1000 },
            { name: 'deck13_splashdown', xMin: 230, xMax: 470, yMin: 720, yMax: 760 }
        ];

        // --- RAILINGS ---
        // Foreground transparent railings (depth: railing Y + 70 so all deck entities and swimmers sort strictly behind)
        this.add.tileSprite(0, 1280, 2400, 40, 'railing').setOrigin(0, 0).setDepth(1350);
        this.add.tileSprite(340, 1000, 2060, 40, 'railing').setOrigin(0, 0).setDepth(1050);
        this.add.tileSprite(20, 760, 2040, 40, 'railing').setOrigin(0, 0).setDepth(810);
        this.add.tileSprite(700, 340, 100, 40, 'railing').setOrigin(0, 0).setDepth(350); // Top deck

        // The AquaMouse Slide (circular loop around the deck!)
        let slideCurve = new Phaser.Curves.Spline([
            750, 360,
            1000, 200,
            1300, 250,
            1200, 450,
            800, 500,
            500, 600,
            350, 760
        ]);

        this.slideCurve = slideCurve;
        // Draw the lift tube visually
        let liftGraphics = this.add.graphics();
        liftGraphics.lineStyle(40, 0xFFFFFF, 0.5); 
        liftGraphics.beginPath();
        liftGraphics.moveTo(1200, 750);
        liftGraphics.lineTo(750, 360);
        liftGraphics.strokePath();
        liftGraphics.lineStyle(2, 0x0000FF, 1);
        liftGraphics.beginPath();
        liftGraphics.moveTo(1220, 740);
        liftGraphics.lineTo(770, 350);
        liftGraphics.moveTo(1180, 760);
        liftGraphics.lineTo(730, 370);
        liftGraphics.strokePath();

        // Draw the looping slide visually
        let slideGraphics = this.add.graphics();
        // Main transparent blue tube
        slideGraphics.lineStyle(40, 0x87CEFA, 0.6); 
        slideCurve.draw(slideGraphics, 64);
        
        // Orange stripe
        slideGraphics.lineStyle(4, 0xFF4500, 0.8);
        slideCurve.draw(slideGraphics, 64);
        
        // Yellow stripe (offset slightly by drawing the same curve with a slight translation? Or just keep one stripe)
        // Let's just have a thick orange/yellow core
        slideGraphics.lineStyle(2, 0xFFD700, 1);
        slideCurve.draw(slideGraphics, 64);

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
        this.groundY = 1260; // Initial Deck 11 floor Y
        this.jumpZ = 0;
        this.jumpV = 0;
        this.isJumping = false;
        this.currentDeck = 'deck11';
        this.currentStair = null;

        let spawnY = 1260;
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
                },
                onComplete: () => {
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
                        },
                        onComplete: () => {
                            // 3. Splashdown & Hop Out into Deck 13 Pool
                            this.ridingRaft = false;
                            this.score += 1500;
                            this.currentDeck = 'deck13';
                            this.groundY = 740;
                            this.jumpZ = 12;
                            this.jumpV = 200;
                            this.isJumping = true;
                            if (this.player && this.player.body) {
                                this.player.body.enable = true;
                                this.player.body.allowGravity = false;
                                this.player.setVelocity(-120, 0);
                                this.player.body.reset(350, 740 - (this.player.body.height / 2));
                            }
                            this.raft.x = 1200;
                            this.raft.y = 740;
                        }
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
            // Deck 13 (AquaMouse Deck)
            this.currentDeck = 'deck13';
            this.groundY = Phaser.Math.Clamp(this.groundY, 720, 760);
            this.player.x = Phaser.Math.Clamp(this.player.x, 20, 2060);
        } else if (this.groundY < 1120) {
            // Deck 12 (Quiet Cove & Hero Zone)
            this.currentDeck = 'deck12';
            this.groundY = Phaser.Math.Clamp(this.groundY, 960, 1000);
            this.player.x = Phaser.Math.Clamp(this.player.x, 340, 2380);
        } else {
            // Deck 11 (Main Pool Deck)
            this.currentDeck = 'deck11';
            this.groundY = Phaser.Math.Clamp(this.groundY, 1240, 1280);
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
                        this.groundY = 1260;
                        this.isJumping = false;
                        this.jumpZ = 0;
                        this.jumpV = 0;
                    } else if (this.currentStair === 'deck12_to_13') {
                        this.currentStair = null;
                        this.currentDeck = 'deck12';
                        this.groundY = 980;
                        this.isJumping = false;
                        this.jumpZ = 0;
                        this.jumpV = 0;
                    }
                }

                // 1. Detect entering / mounting stairs
                if (!this.currentStair) {
                    // Stair 1 Mounting:
                    // From Deck 11 base (x: 40..100, Deck 11 corridor y: 1230..1290)
                    // Walking right alone allows passing under stairs; pressing Up (or Up+Right) climbs Stair 1
                    if (this.player.x >= 40 && this.player.x <= 100 && this.groundY >= 1230 && this.groundY <= 1290 && isUp) {
                        this.currentStair = 'deck11_to_12';
                        this.groundY = 1340 - this.player.x;
                    }
                    // From Deck 12 top (x: 320..370, Deck 12 corridor y: 950..1010)
                    // Moving left or down descends Stair 1
                    else if (this.player.x >= 320 && this.player.x <= 370 && this.groundY >= 950 && this.groundY <= 1010 && (isLeft || isDown)) {
                        this.currentStair = 'deck11_to_12';
                        this.groundY = 1340 - this.player.x;
                    }
                    // Stair 2 Mounting:
                    // From Deck 12 base (x: 2240..2320, Deck 12 corridor y: 950..1010)
                    // Walking left/right alone allows passing under stairs; pressing Up (or Up+Left) climbs Stair 2
                    else if (this.player.x >= 2240 && this.player.x <= 2320 && this.groundY >= 950 && this.groundY <= 1010 && isUp) {
                        this.currentStair = 'deck12_to_13';
                        this.groundY = 760 + (this.player.x - 2060);
                    }
                    // From Deck 13 top (x: 2040..2090, Deck 13 corridor y: 710..770)
                    // Moving right or down descends Stair 2
                    else if (this.player.x >= 2040 && this.player.x <= 2090 && this.groundY >= 710 && this.groundY <= 770 && (isRight || isDown)) {
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
                            this.groundY = 980;
                        }
                    } else if (descendDown && !climbUp) {
                        this.player.x -= speed * dt;
                        this.groundY = 1340 - this.player.x;
                        this.player.setFlipX(true);
                        if (this.player.x <= 60) {
                            this.currentStair = null;
                            this.currentDeck = 'deck11';
                            this.player.x = 60;
                            this.groundY = 1260;
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
                            this.groundY = 740;
                        }
                    } else if (descendDown && !climbUp) {
                        this.player.x += speed * dt;
                        this.groundY = 760 + (this.player.x - 2060);
                        this.player.setFlipX(false);
                        if (this.player.x >= 2300) {
                            this.currentStair = null;
                            this.currentDeck = 'deck12';
                            this.player.x = 2300;
                            this.groundY = 980;
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
        if (canBoard && !this.ridingRaft) {
            this.boardPromptText.setVisible(true);
        } else {
            this.boardPromptText.setVisible(false);
        }

        // Enter key boards the AquaMouse
        if (canBoard && Phaser.Input.Keyboard.JustDown(this.enterKey)) {
            this.boardRaft();
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
            loc = 'DECK 13: AQUAMOUSE';
        } else if (this.groundY < 1120) {
            loc = (this.player.x > 1850) ? 'DECK 12: HERO ZONE' : 'DECK 12: QUIET COVE';
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
        let off1 = this.add.sprite(550, 1256, 'npc_officer_idle').setDepth(1256);
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
        let tour1 = this.add.sprite(1680, 1256, 'npc_tourist_idle').setDepth(1256);
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
        let tour2 = this.add.sprite(1100, 976, 'npc_tourist_idle').setDepth(976);
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
        let off2 = this.add.sprite(1060, 736, 'npc_officer_idle').setDepth(736);
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

        // 3. Spawn Lounging Sunbathers on Deck Chairs
        // Sunbather Chloe (Deck 11 poolside lounger)
        this.add.image(1360, 1264, 'npc_lounge_chair').setDepth(1263);
        let lounger1 = this.add.sprite(1360, 1262, 'npc_lounger_0').setDepth(1264);
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
        this.add.image(420, 984, 'npc_lounge_chair').setDepth(983);
        let lounger2 = this.add.sprite(420, 982, 'npc_lounger_0').setDepth(984);
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

        // 4. Spawn Swimming NPCs in Pools (Submerged between pool floor and front coping)
        // Swimmer Tommy (Deck 11 Main Pool in front of Funnel Vision)
        let swim1 = this.add.sprite(1020, 1260, 'npc_swimmer_0').setDepth(1260);
        swim1.anims.play('npc_swimmer_bob');
        this.ambientNPCs.push({
            name: 'Tommy',
            type: 'swimmer',
            sprite: swim1,
            minX: 940,
            maxX: 1140,
            baseY: 1260,
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
        let swim2 = this.add.sprite(620, 980, 'npc_swimmer_0').setDepth(980);
        swim2.anims.play('npc_swimmer_bob');
        this.ambientNPCs.push({
            name: 'Alex',
            type: 'swimmer',
            sprite: swim2,
            minX: 560,
            maxX: 700,
            baseY: 980,
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
        let swim3 = this.add.sprite(340, 740, 'npc_swimmer_0').setDepth(740);
        swim3.anims.play('npc_swimmer_bob');
        this.ambientNPCs.push({
            name: 'Lily',
            type: 'swimmer',
            sprite: swim3,
            minX: 270,
            maxX: 430,
            baseY: 740,
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
}

config.scene = [BootScene, TitleScene, CharacterSelectScene, GameScene];
window.game = new Phaser.Game(config);
const game = window.game;
