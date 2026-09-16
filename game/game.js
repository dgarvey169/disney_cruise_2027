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

        let g = this.add.graphics();
        
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
        this.selectedCharacter = data.character; 
        this.characterName = data.name;
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
        // Deck 11 wall (beneath y=1300 down to y=1420)
        this.add.tileSprite(0, 1300, 2400, 120, 'ship_wall').setOrigin(0, 0);

        // Deck 12 wall (beneath y=1020 down to y=1300, under Quiet Cove & Hero Zone)
        this.add.tileSprite(340, 1020, 2060, 280, 'ship_wall').setOrigin(0, 0);

        // Deck 13 wall (beneath y=780 down to y=1020, under AquaMouse)
        this.add.tileSprite(20, 780, 2040, 240, 'ship_wall').setOrigin(0, 0);

        // Top of AquaMouse structure (beneath y=360 down to y=780)
        this.add.tileSprite(700, 360, 100, 420, 'ship_wall').setOrigin(0, 0);

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
                this.add.image(sx, sy, 'stair_step'); // Authentic 8-bit beveled step
                this.add.image(sx, sy - 20, 'railing').setDepth(10);
            }
        };

        // ----------------------------------------------------
        // DECK 11 (Main Pool Deck) - y = 1300
        // ----------------------------------------------------
        platforms.create(450, 1300, 'deck').setScale(22, 1).refreshBody(); 
        water.create(1040, 1300, 'pool').setScale(7.5, 1).refreshBody();   
        platforms.create(1040, 1320, 'deck').setScale(7.5, 1).setVisible(false).refreshBody(); // Pool floor
        platforms.create(1790, 1300, 'deck').setScale(30.5, 1).refreshBody(); 
        
        doors.create(400, 1250, 'door'); 
        this.add.text(350, 1190, 'SENSES SPA', { fontSize: '9px', fill: '#FFD700', backgroundColor: '#001024', padding: { x: 6, y: 4 }, fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 2 });
        
        doors.create(2100, 1250, 'door');
        this.add.text(2010, 1190, 'MARCELINE MARKET', { fontSize: '9px', fill: '#58B8F8', backgroundColor: '#001024', padding: { x: 6, y: 4 }, fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 2 });
        this.add.text(930, 1050, 'FUNNEL VISION', { fontSize: '11px', fill: '#FFFFFF', backgroundColor: '#000000', padding: { x: 8, y: 6 }, fontFamily: '"Press Start 2P", monospace', stroke: '#0058F8', strokeThickness: 3 });
        
        // Movie Screen
        let screenBg = this.add.graphics();
        screenBg.fillStyle(0x222222, 1);
        screenBg.fillRect(940, 1100, 200, 120);
        screenBg.lineStyle(4, 0x000000, 1);
        screenBg.strokeRect(940, 1100, 200, 120);
        
        // Movie Screen Mask
        let screenMask = this.add.graphics();
        screenMask.fillStyle(0xFFFFFF, 1);
        screenMask.fillRect(940, 1100, 200, 120);
        let mask = new Phaser.Display.Masks.GeometryMask(this, screenMask);
        
        // Movie Screen Cartoon Elements (Cat and Mouse)
        this.mouse = this.add.circle(940, 1190, 6, 0x8B4513).setMask(mask);
        
        let catHead = this.add.circle(0, 0, 12, 0x808080);
        let catLeftEar = this.add.triangle(-6, -8, 0, 0, 12, 0, 6, -12, 0x808080);
        let catRightEar = this.add.triangle(6, -8, 0, 0, 12, 0, 6, -12, 0x808080);
        this.cat = this.add.container(900, 1184, [catHead, catLeftEar, catRightEar]).setMask(mask);
        
        this.cartoonVx = 100;

        const iceCreamStands = this.physics.add.staticGroup();
        iceCreamStands.create(1500, 1250, 'icecream_stand');
        this.add.text(1430, 1190, 'EYE SCREAM TREATS', { fontSize: '9px', fill: '#F85898', backgroundColor: '#001024', padding: { x: 6, y: 4 }, fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 2 });

        // Stairs up to Deck 12 (right-up)
        createStaircase(60, 1290, 7, 1, -1);

        // ----------------------------------------------------
        // DECK 12 (Quiet Cove & Hero Zone) - y = 1020
        // ----------------------------------------------------
        platforms.create(440, 1020, 'deck').setScale(5, 1).refreshBody();      // left of Quiet Cove
        water.create(630, 1020, 'pool').setScale(5, 1).refreshBody();           // Quiet Cove pool
        platforms.create(630, 1040, 'deck').setScale(5, 1).setVisible(false).refreshBody(); // Quiet Cove floor
        platforms.create(1215, 1020, 'deck').setScale(24.5, 1).refreshBody();  // between pools
        water.create(1800, 1020, 'pool').setScale(5, 1).refreshBody();          // Toy Story Splash pool
        platforms.create(1800, 1040, 'deck').setScale(5, 1).setVisible(false).refreshBody(); // Toy Story floor
        platforms.create(2160, 1020, 'deck').setScale(13, 1).refreshBody();    // right of Toy Story

        this.add.text(590, 950, 'QUIET COVE', { fontSize: '9px', fill: '#00F8A0', backgroundColor: '#001024', padding: { x: 6, y: 4 }, fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 2 });
        this.add.text(1680, 950, 'TOY STORY SPLASH', { fontSize: '9px', fill: '#F8A800', backgroundColor: '#001024', padding: { x: 6, y: 4 }, fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 2 });

        doors.create(2000, 970, 'door');
        this.add.text(1960, 910, 'HERO ZONE', { fontSize: '9px', fill: '#E83818', backgroundColor: '#001024', padding: { x: 6, y: 4 }, fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 2 });

        // Stairs up to Deck 13 (left-up)
        createStaircase(2300, 1010, 6, -1, -1);

        // ----------------------------------------------------
        // DECK 13 (AquaMouse) - y = 780
        // ----------------------------------------------------
        platforms.create(125, 780, 'deck').setScale(5.5, 1).refreshBody();     // left sliver
        water.create(350, 780, 'pool').setScale(6, 1).refreshBody();            // Splashdown pool
        platforms.create(350, 800, 'deck').setScale(6, 1).setVisible(false).refreshBody(); // Splashdown floor
        platforms.create(1265, 780, 'deck').setScale(40, 1).refreshBody();     // right of splashdown → reaches x=2065

        // AquaMouse Splashdown Pool
        this.add.text(340, 710, 'SPLASHDOWN', { fontSize: '9px', fill: '#58B8F8', backgroundColor: '#001024', padding: { x: 6, y: 4 }, fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 2 });

        this.add.text(1170, 715, 'AQUAMOUSE ENTRANCE', { fontSize: '9px', fill: '#FFD700', backgroundColor: '#001024', padding: { x: 6, y: 4 }, fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 2 });
        
        // AquaMouse Raft Lift
        this.raft = this.physics.add.sprite(1200, 750, 'raft');
        this.raft.body.allowGravity = false;
        this.raft.setImmovable(true);
        
        let liftZone = this.add.zone(1200, 750, 80, 80);
        this.physics.world.enable(liftZone);
        liftZone.body.allowGravity = false;
        
        this.ridingRaft = false;
        this.liftZone = liftZone;

        // Top Deck of AquaMouse
        platforms.create(750, 360, 'deck').setScale(2.5, 1).refreshBody();
        this.add.text(670, 310, 'AQUAMOUSE LAUNCH', { fontSize: '9px', fill: '#FFD700', backgroundColor: '#001024', padding: { x: 6, y: 4 }, fontFamily: '"Press Start 2P", monospace', stroke: '#000000', strokeThickness: 2 });

        // --- RAILINGS ---
        // Foreground transparent railings
        this.add.tileSprite(0, 1280, 2400, 40, 'railing').setOrigin(0, 0).setDepth(10);
        this.add.tileSprite(340, 1000, 2060, 40, 'railing').setOrigin(0, 0).setDepth(10);
        this.add.tileSprite(20, 760, 2040, 40, 'railing').setOrigin(0, 0).setDepth(10);
        this.add.tileSprite(700, 340, 100, 40, 'railing').setOrigin(0, 0).setDepth(10); // Top deck

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

        // Removed duplicate pool

        // --- TOP-MOUNTED CAPCOM RETRO HUD ---
        this.score = 2500;
        this.hudBg = this.add.graphics().setScrollFactor(0).setDepth(99);

        // Player Avatar Icon & Name
        let playerIconKey = this.selectedCharacter === 'riley' ? 'riley_idle' : 'amelia_idle';
        this.hudPlayerIcon = this.add.image(24, 21, playerIconKey).setScale(0.7).setScrollFactor(0).setDepth(100);
        this.hudPlayerName = this.add.text(42, 14, this.characterName.toUpperCase(), {
            fontSize: '10px', fill: '#FFD700', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 3
        }).setScrollFactor(0).setDepth(100);

        // Retro HP Hit-Point Nodes
        this.hudHpText = this.add.text(135, 14, 'HP', {
            fontSize: '10px', fill: '#FFFFFF', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 3
        }).setScrollFactor(0).setDepth(100);
        this.hpNodes = [];
        for (let i = 0; i < 4; i++) {
            let node = this.add.image(175 + i * 18, 20, 'hp_node_full').setScrollFactor(0).setDepth(100);
            this.hpNodes.push(node);
        }

        // Center Location Banner
        this.hudLocation = this.add.text(480, 20, '[ DECK 11: MAIN POOL ]', {
            fontSize: '9px', fill: '#58B8F8', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5).setScrollFactor(0).setDepth(100);

        // Right Zero-Padded Currency/Score Counter: $0002500
        this.hudCoinIcon = this.add.image(740, 20, 'coin_icon').setScrollFactor(0).setDepth(100);
        this.hudScoreText = this.add.text(755, 14, '$0002500', {
            fontSize: '10px', fill: '#FFFFFF', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 3
        }).setScrollFactor(0).setDepth(100);

        // Ice Cream Status Indicator Icon
        this.hudIceCreamIcon = this.add.image(890, 20, 'icecream_strawberry').setScale(0.8).setScrollFactor(0).setDepth(100).setVisible(false);

        // Retro Capcom [MENU] Button
        this.hudMenuBtn = this.add.text(0, 0, '[MENU]', {
            fontSize: '10px', fill: '#FFD700', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 3
        }).setOrigin(1, 0.5).setPadding(8, 8, 8, 8).setScrollFactor(0).setDepth(100).setInteractive({ useHandCursor: true });
        this.hudMenuBtn.on('pointerover', () => this.hudMenuBtn.setFill('#FFFFFF'));
        this.hudMenuBtn.on('pointerout', () => this.hudMenuBtn.setFill('#FFD700'));
        this.hudMenuBtn.on('pointerdown', () => this.toggleInGameMenu());

        this.createInGameMenu();

        this.layoutHUD(this.scale.width, this.scale.height);

        // Player (Spawn in the middle of Deck 11)
        this.player = this.physics.add.sprite(700, 1200, this.selectedCharacter);
        this.player.setBounce(0.0);
        this.player.setCollideWorldBounds(true);
        if (this.selectedCharacter === 'riley') {
            this.player.body.setSize(22, 44);
            this.player.body.setOffset(5, 4);
        } else {
            this.player.body.setSize(22, 38);
            this.player.body.setOffset(5, 2);
        }
        this.player.setInteractive({ useHandCursor: true });
        this.player.on('pointerdown', () => {
            if (this.isMenuOpen) return;
            if (this.canBoardRaft()) {
                this.boardRaft();
            }
        });

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
                            // 3. Splashdown & Hop Out
                            this.ridingRaft = false;
                            this.score += 1500;
                            if (this.player && this.player.body) {
                                this.player.body.enable = true;
                                this.player.body.allowGravity = true;
                                this.player.setVelocity(-200, -300);
                            }
                            this.raft.x = 1200;
                            this.raft.y = 750;
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
        
        // Collisions
        this.physics.add.collider(this.player, platforms, null, () => {
            return this.currentStair === null;
        }, this);
        
        this.physics.add.overlap(this.player, water, () => {
            this.inWater = true;
        });



        this.hasIceCream = false;
        this.iceCreamFlavors = ['strawberry', 'chocolate', 'vanilla', 'mint'];
        this.currentFlavorIndex = 0;
        this.iceCreamSprite = this.add.sprite(0, 0, 'icecream_strawberry');
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
            }
        };

        const onNativeKeyUp = (e) => {
            // Direct DOM safety release: guarantees keys are cleared even if OS or browser dropped Phaser keyup
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.code === 'Space') {
                if (this.cursors && this.cursors.up) this.cursors.up.isDown = false;
                if (this.wasd && this.wasd.up) this.wasd.up.isDown = false;
                if (this.spaceKey) this.spaceKey.isDown = false;
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

        this.mobileInput = { left: false, right: false, up: false, down: false };

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
                this.mobileInput.up = true;
                this.time.delayedCall(100, () => this.mobileInput.up = false);
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

                // Set directional input based on deflection
                this.mobileInput.left = dx < -15;
                this.mobileInput.right = dx > 15;
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
                this.mobileInput.down = false;
            }
        });
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

        let inWater = this.inWater || (this.water && this.physics.overlap(this.player, this.water));
        let speed = inWater ? 130 : 250;
        let jumpPower = inWater ? -420 : -550;
        
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

            let jumpPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
                              (this.wasd && Phaser.Input.Keyboard.JustDown(this.wasd.up)) ||
                              (this.spaceKey && Phaser.Input.Keyboard.JustDown(this.spaceKey)) ||
                              this.mobileInput.up;

            // Smooth automatic exit when walking toward pool edge / deck ledge
            if (inWater) {
                const poolExits = [
                    // Deck 11 Main Pool (deck top y=1280)
                    { yMin: 1250, yMax: 1330, deckY: 1280, leftEdge: 912, rightEdge: 1158, leftTarget: 874, rightTarget: 1196 },
                    // Deck 12 Quiet Cove (deck top y=1000)
                    { yMin: 970, yMax: 1050, deckY: 1000, leftEdge: 562, rightEdge: 703, leftTarget: 524, rightTarget: 741, xMax: 1000 },
                    // Deck 12 Toy Story Splash (deck top y=1000)
                    { yMin: 970, yMax: 1050, deckY: 1000, leftEdge: 1727, rightEdge: 1878, leftTarget: 1689, rightTarget: 1916, xMin: 1500 },
                    // Deck 13 Splashdown (deck top y=760)
                    { yMin: 730, yMax: 810, deckY: 760, leftEdge: 257, rightEdge: 443, leftTarget: 219, rightTarget: 481 }
                ];

                let halfH = this.player.body.height / 2;
                for (let pe of poolExits) {
                    if (this.player.y >= pe.yMin && this.player.y <= pe.yMax) {
                        if (pe.xMin && this.player.x < pe.xMin) continue;
                        if (pe.xMax && this.player.x > pe.xMax) continue;

                        if (isLeft && this.player.x <= pe.leftEdge) {
                            this.player.x = pe.leftTarget;
                            this.player.y = pe.deckY - halfH;
                            this.player.body.updateFromGameObject();
                            this.player.setVelocityY(0);
                            inWater = false;
                            this.inWater = false;
                            speed = 250;
                            break;
                        } else if (isRight && this.player.x >= pe.rightEdge) {
                            this.player.x = pe.rightTarget;
                            this.player.y = pe.deckY - halfH;
                            this.player.body.updateFromGameObject();
                            this.player.setVelocityY(0);
                            inWater = false;
                            this.inWater = false;
                            speed = 250;
                            break;
                        }
                    }
                }
            }

            if (inWater && !this.wasInWater) {
                this.currentFloatieColor = Phaser.Math.Between(0, 3);
            }

            if (inWater) {
                if (this.player.anims && this.player.anims.isPlaying) {
                    this.player.anims.stop();
                }
                this.player.setTexture(this.selectedCharacter + '_swim_' + this.currentFloatieColor);
                this.player.angle = (Math.sin(this.time.now / 150) * 10);
                if (this.player.body.velocity.y > 160) {
                    this.player.body.setVelocityY(160);
                }
            } else {
                this.player.angle = 0;
            }

            let isUp = (this.cursors.up && this.cursors.up.isDown) ||
                       (this.wasd && this.wasd.up && this.wasd.up.isDown) ||
                       (this.spaceKey && this.spaceKey.isDown) ||
                       this.mobileInput.up;

            let isDown = (this.cursors.down && this.cursors.down.isDown) ||
                         (this.wasd && this.wasd.down && this.wasd.down.isDown) ||
                         this.mobileInput.down;

            let halfH = this.player.body.height / 2;
            let bottomY = this.player.y + halfH;
            let prevBottomY = this.player.body.prev ? (this.player.body.prev.y + this.player.body.height) : bottomY;

            // --- STAIRCASE TRAVERSAL SYSTEM (Option A) ---
            // Stair 1: Deck 11 (floor y=1280) to Deck 12 (floor y=1000), x from 60 to 340. Slope: floorY = 1340 - x
            // Stair 2: Deck 12 (floor y=1000) to Deck 13 (floor y=760), x from 2060 to 2300. Slope: floorY = 760 + (x - 2060)
            if (!inWater) {
                // Drop through stairs when pressing Down
                if (this.currentStair && isDown) {
                    this.currentStair = null;
                    this.player.body.allowGravity = true;
                }

                // 1. Detect entering / mounting / landing on stairs
                if (!this.currentStair) {
                    // Descending from Deck 12 onto Stair 1 (moving left)
                    if (this.player.x >= 310 && this.player.x <= 360 && bottomY >= 980 && bottomY <= 1025 && isLeft && !jumpPressed) {
                        this.currentStair = 'deck11_to_12';
                        let sY = 1340 - this.player.x;
                        this.player.body.reset(this.player.x, sY - halfH);
                        this.player.body.allowGravity = false;
                    }
                    // Descending from Deck 13 onto Stair 2 (moving right)
                    else if (this.player.x >= 2040 && this.player.x <= 2090 && bottomY >= 740 && bottomY <= 785 && isRight && !jumpPressed) {
                        this.currentStair = 'deck12_to_13';
                        let sY = 760 + (this.player.x - 2060);
                        this.player.body.reset(this.player.x, sY - halfH);
                        this.player.body.allowGravity = false;
                    }
                    // Mounting Stair 1 from Deck 11 base (facing right, pressing Up / Jump)
                    else if (this.player.x >= 40 && this.player.x <= 100 && bottomY >= 1265 && bottomY <= 1295 && isRight && (jumpPressed || isUp)) {
                        this.currentStair = 'deck11_to_12';
                        let sY = 1340 - this.player.x;
                        this.player.body.reset(this.player.x, sY - halfH);
                        this.player.body.allowGravity = false;
                        jumpPressed = false;
                        this.mobileInput.up = false;
                    }
                    // Mounting Stair 2 from Deck 12 base (facing left, pressing Up / Jump)
                    else if (this.player.x >= 2260 && this.player.x <= 2340 && bottomY >= 985 && bottomY <= 1015 && isLeft && (jumpPressed || isUp)) {
                        this.currentStair = 'deck12_to_13';
                        let sY = 760 + (this.player.x - 2060);
                        this.player.body.reset(this.player.x, sY - halfH);
                        this.player.body.allowGravity = false;
                        jumpPressed = false;
                        this.mobileInput.up = false;
                    }
                    // Landing on Stair 1 while airborne/falling (strictly above Deck 11 floor)
                    else if (this.player.body.velocity.y > 0 && this.player.x >= 65 && this.player.x <= 335 && bottomY < 1260) {
                        let sY = 1340 - this.player.x;
                        if ((bottomY >= sY - 8 && bottomY <= sY + 25) || (prevBottomY <= sY && bottomY >= sY)) {
                            this.currentStair = 'deck11_to_12';
                            this.player.body.reset(this.player.x, sY - halfH);
                            this.player.body.allowGravity = false;
                        }
                    }
                    // Landing on Stair 2 while airborne/falling (strictly above Deck 12 floor)
                    else if (this.player.body.velocity.y > 0 && this.player.x >= 2065 && this.player.x <= 2295 && bottomY < 980) {
                        let sY = 760 + (this.player.x - 2060);
                        if ((bottomY >= sY - 8 && bottomY <= sY + 25) || (prevBottomY <= sY && bottomY >= sY)) {
                            this.currentStair = 'deck12_to_13';
                            this.player.body.reset(this.player.x, sY - halfH);
                            this.player.body.allowGravity = false;
                        }
                    }
                }

                // Manage body gravity: stairs require disabling gravity so physics integration does not flutter
                if (this.currentStair) {
                    this.player.body.allowGravity = false;
                } else if (!this.ridingRaft) {
                    this.player.body.allowGravity = true;
                }

                // 2. Process movement on stairs
                if (this.currentStair === 'deck11_to_12') {
                    if (jumpPressed) {
                        this.player.body.allowGravity = true;
                        this.player.setVelocityY(jumpPower);
                        this.currentStair = null;
                        this.mobileInput.up = false;
                        if (isLeft) this.player.setVelocityX(-speed);
                        else if (isRight) this.player.setVelocityX(speed);
                        else this.player.setVelocityX(0);
                    } else if (isLeft) {
                        if (this.player.x <= 65) {
                            this.player.body.reset(60, 1280 - halfH);
                            this.player.body.allowGravity = true;
                            this.player.setVelocityX(-speed);
                            this.player.setVelocityY(0);
                            this.currentStair = null;
                        } else {
                            this.player.setVelocityX(-speed);
                            this.player.setVelocityY(speed); // slope is -1: moving left goes downwards
                            this.player.body.touching.down = true;
                        }
                    } else if (isRight) {
                        if (this.player.x >= 340) {
                            this.player.body.reset(340, 1000 - halfH);
                            this.player.body.allowGravity = true;
                            this.player.setVelocityX(speed);
                            this.player.setVelocityY(0);
                            this.currentStair = null;
                        } else {
                            this.player.setVelocityX(speed);
                            this.player.setVelocityY(-speed); // slope is -1: moving right goes upwards
                            this.player.body.touching.down = true;
                        }
                    } else {
                        this.player.setVelocity(0, 0);
                        this.player.body.touching.down = true;
                    }
                } else if (this.currentStair === 'deck12_to_13') {
                    if (jumpPressed) {
                        this.player.body.allowGravity = true;
                        this.player.setVelocityY(jumpPower);
                        this.currentStair = null;
                        this.mobileInput.up = false;
                        if (isLeft) this.player.setVelocityX(-speed);
                        else if (isRight) this.player.setVelocityX(speed);
                        else this.player.setVelocityX(0);
                    } else if (isRight) {
                        if (this.player.x >= 2295) {
                            this.player.body.reset(2300, 1000 - halfH);
                            this.player.body.allowGravity = true;
                            this.player.setVelocityX(speed);
                            this.player.setVelocityY(0);
                            this.currentStair = null;
                        } else {
                            this.player.setVelocityX(speed);
                            this.player.setVelocityY(speed); // slope is +1: moving right goes downwards
                            this.player.body.touching.down = true;
                        }
                    } else if (isLeft) {
                        if (this.player.x <= 2060) {
                            this.player.body.reset(2060, 760 - halfH);
                            this.player.body.allowGravity = true;
                            this.player.setVelocityX(-speed);
                            this.player.setVelocityY(0);
                            this.currentStair = null;
                        } else {
                            this.player.setVelocityX(-speed);
                            this.player.setVelocityY(-speed); // slope is +1: moving left goes upwards
                            this.player.body.touching.down = true;
                        }
                    } else {
                        this.player.setVelocity(0, 0);
                        this.player.body.touching.down = true;
                    }
                } else {
                    // Regular floor movement
                    if (isLeft) {
                        this.player.setVelocityX(-speed);
                    } else if (isRight) {
                        this.player.setVelocityX(speed);
                    } else {
                        this.player.setVelocityX(0);
                    }

                    if (jumpPressed && (this.player.body.touching.down || inWater)) {
                        this.player.setVelocityY(jumpPower);
                        this.mobileInput.up = false;
                    }
                }
            } else {
                // In water
                this.currentStair = null;
                if (!this.ridingRaft) this.player.body.allowGravity = true;
                if (isLeft) {
                    this.player.setVelocityX(-speed);
                } else if (isRight) {
                    this.player.setVelocityX(speed);
                } else {
                    this.player.setVelocityX(0);
                }

                if (jumpPressed) {
                    this.player.setVelocityY(jumpPower);
                    this.mobileInput.up = false;
                }
            }

            // Flip facing direction based on horizontal movement
            if (isLeft) {
                this.player.setFlipX(true);
            } else if (isRight) {
                this.player.setFlipX(false);
            }

            // Play animations when out of water
            if (!inWater) {
                if (!this.player.body.touching.down && this.currentStair === null) {
                    this.player.anims.play(this.selectedCharacter + '_jump', true);
                } else if (Math.abs(this.player.body.velocity.x) > 10 || (this.currentStair !== null && (isLeft || isRight))) {
                    this.player.anims.play(this.selectedCharacter + '_walk', true);
                } else {
                    this.player.anims.play(this.selectedCharacter + '_idle', true);
                }
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
        
        if (this.hasIceCream) {
            this.iceCreamSprite.x = this.player.x + 15;
            this.iceCreamSprite.y = this.player.y - 10;
        }

        // Movie Screen Animation: Cat and Mouse
        let dt = this.game.loop.delta / 1000;
        this.mouse.x += this.cartoonVx * dt;
        this.cat.x += this.cartoonVx * dt;

        if (this.cartoonVx > 0 && this.cat.x > 1150) {
            this.cartoonVx = -100;
            this.cat.setScale(-1, 1);
            this.mouse.x = 1150;
            this.cat.x = 1180;
        } else if (this.cartoonVx < 0 && this.cat.x < 930) {
            this.cartoonVx = 100;
            this.cat.setScale(1, 1);
            this.mouse.x = 930;
            this.cat.x = 900; 
        }

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
        } else if (this.player.y < 850) {
            loc = 'DECK 13: AQUAMOUSE';
        } else if (this.player.y < 1100) {
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

    createInGameMenu() {
        this.isMenuOpen = false;
        this.menuSelectedIndex = 0;
        this.lastMenuActionTime = 0;
        this.lastMenuNavTime = 0;
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
        this.menuOverlay = this.add.graphics().setScrollFactor(0).setDepth(498).setVisible(false);
        this.menuBox = this.add.graphics().setScrollFactor(0).setDepth(499).setVisible(false);

        // Header Title
        this.menuTitle = this.add.text(0, 0, 'PAUSE MENU', {
            fontSize: '14px', fill: '#F8B800', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 4, align: 'center'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(500).setVisible(false);

        this.menuSub = this.add.text(0, 0, '★ DISNEY DESTINY ★', {
            fontSize: '8px', fill: '#58B8F8', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 2, align: 'center'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(500).setVisible(false);

        // Cursor arrow
        this.menuCursor = this.add.text(0, 0, '►', {
            fontSize: '12px', fill: '#F8B800', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5).setScrollFactor(0).setDepth(500).setVisible(false);

        // Item text objects
        this.menuTextObjects = [];
        this.menuItems.forEach((item, index) => {
            let txt = this.add.text(0, 0, item.text, {
                fontSize: '11px', fill: '#FFFFFF', fontFamily: '"Press Start 2P", monospace',
                stroke: '#000000', strokeThickness: 3
            }).setOrigin(0, 0.5).setScrollFactor(0).setDepth(500).setVisible(false).setInteractive({ useHandCursor: true });

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
        }).setOrigin(0.5).setScrollFactor(0).setDepth(500).setVisible(false);

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

        // Native DOM keyboard listener (guarantees Enter, Space, Arrows work regardless of canvas focus state)
        const onNativeKeyDown = (e) => {
            if (!this.sys || !this.sys.isActive()) return;
            if (e.key === 'Escape' || e.key === 'p' || e.key === 'P' || e.key === 'm' || e.key === 'M') {
                e.preventDefault();
                this.toggleInGameMenu();
                return;
            }
            if (this.isMenuOpen) {
                if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
                    e.preventDefault();
                    this.navigateMenu(-1);
                } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
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

        // Phaser keyboard hotkeys
        if (this.input.keyboard) {
            this.input.keyboard.on('keydown-ESC', () => this.toggleInGameMenu());
            this.input.keyboard.on('keydown-P', () => this.toggleInGameMenu());
            this.input.keyboard.on('keydown-M', () => this.toggleInGameMenu());
        }
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
        // Clean physics reset at Deck 11 spawn (x: 700, y: 1200)
        this.player.body.reset(700, 1200);
        this.player.setVelocity(0, 0);
        this.player.angle = 0;
        this.ridingRaft = false;
        this.onSlide = false;
        this.inWater = false;
        this.wasInWater = false;
        this.currentStair = null;
        this.player.body.allowGravity = true;

        // Restore health nodes
        if (this.hpNodes) {
            this.hpNodes.forEach(node => node.setTexture('hp_node_full'));
        }

        // Camera flash & reposition
        this.cameras.main.flash(300, 255, 255, 255);
        this.cameras.main.centerOn(700, 1200);
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
