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

