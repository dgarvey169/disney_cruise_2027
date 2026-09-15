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
        this.titleBg = this.add.graphics();

        this.titleText = this.add.text(0, 0, 'DISNEY DESTINY ADVENTURE', {
            fontSize: '18px', fill: '#FFD700', fontFamily: '"Press Start 2P", monospace',
            align: 'center', stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);

        this.startText = this.add.text(0, 0, 'PUSH START BUTTON', {
            fontSize: '14px', fill: '#FFFFFF', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5);

        this.tweens.add({ targets: this.startText, alpha: 0.2, duration: 600, yoyo: true, repeat: -1 });

        this.renderScene(this.scale.width, this.scale.height);

        this.scale.on('resize', (gameSize) => {
            this.renderScene(gameSize.width, gameSize.height);
        });

        this.input.on('pointerdown', () => this.scene.start('CharacterSelectScene'));
    }

    renderScene(W, H) {
        let g = this.bgGraphics;
        g.clear();

        // Caribbean sky gradient
        g.fillGradientStyle(0x87CEEB, 0x87CEEB, 0x00BFFF, 0x00BFFF, 1);
        g.fillRect(0, 0, W, H * 0.65);

        // Deep Caribbean ocean
        g.fillGradientStyle(0x006994, 0x006994, 0x003d5c, 0x003d5c, 1);
        g.fillRect(0, H * 0.65, W, H * 0.35);

        // Ocean shimmer waves
        g.fillStyle(0x007BA7, 0.5);
        for (let i = 0; i < 12; i++) {
            g.fillRect(i * (W/12), H * 0.65 + (i % 2) * 8, W / 12, 6);
        }

        // Sun
        let sunX = Math.min(W * 0.15, 140);
        let sunY = Math.min(H * 0.18, 110);
        g.fillStyle(0xFFD700, 1);
        g.fillCircle(sunX, sunY, 50);
        g.lineStyle(3, 0xFFEC8B, 0.7);
        for (let a = 0; a < 360; a += 30) {
            let rad = Phaser.Math.DegToRad(a);
            g.beginPath();
            g.moveTo(sunX + Math.cos(rad) * 55, sunY + Math.sin(rad) * 55);
            g.lineTo(sunX + Math.cos(rad) * 75, sunY + Math.sin(rad) * 75);
            g.strokePath();
        }

        // Clouds
        g.fillStyle(0xFFFFFF, 0.85);
        [[W*0.35, H*0.12, 60], [W*0.6, H*0.08, 45], [W*0.8, H*0.15, 55]].forEach(([cx, cy, r]) => {
            g.fillCircle(cx, cy, r);
            g.fillCircle(cx + r*0.7, cy + 10, r * 0.7);
            g.fillCircle(cx - r*0.6, cy + 10, r * 0.6);
        });

        // Disney Cruise Ship
        let shipX = W * 0.5, shipY = H * 0.65;
        let scale = Math.min(1, (W - 32) / 480);

        g.fillStyle(0x003366, 1);
        g.fillRect(shipX - 200 * scale, shipY - 30 * scale, 400 * scale, 50 * scale);
        g.fillStyle(0xFFFFFF, 1);
        g.fillRect(shipX - 190 * scale, shipY - 90 * scale, 380 * scale, 60 * scale);
        g.fillRect(shipX - 170 * scale, shipY - 140 * scale, 340 * scale, 52 * scale);
        g.fillRect(shipX - 140 * scale, shipY - 185 * scale, 280 * scale, 47 * scale);
        g.fillStyle(0xCC0000, 1);
        g.fillRect(shipX - 200 * scale, shipY - 36 * scale, 400 * scale, 8 * scale);
        g.fillStyle(0x87CEEB, 1);
        for (let i = -3; i <= 3; i++) {
            g.fillCircle(shipX + i * 50 * scale, shipY - 60 * scale, 7 * scale);
            g.fillCircle(shipX + (i * 45 + 15) * scale, shipY - 112 * scale, 6 * scale);
        }
        // Mickey-eared funnel
        g.fillStyle(0xCC0000, 1);
        g.fillRect(shipX + 40 * scale, shipY - 235 * scale, 40 * scale, 50 * scale);
        g.fillStyle(0x000000, 1);
        g.fillCircle(shipX + 50 * scale, shipY - 248 * scale, 18 * scale);
        g.fillCircle(shipX + 70 * scale, shipY - 248 * scale, 18 * scale);
        g.fillCircle(shipX + 60 * scale, shipY - 230 * scale, 26 * scale);
        // Bow
        g.fillStyle(0xFFFFFF, 1);
        g.fillTriangle(shipX + 190 * scale, shipY - 90 * scale, shipX + 240 * scale, shipY - 30 * scale, shipX + 190 * scale, shipY - 30 * scale);
        g.fillStyle(0x003366, 1);
        g.fillTriangle(shipX + 190 * scale, shipY - 30 * scale, shipX + 240 * scale, shipY - 30 * scale, shipX + 240 * scale, shipY + 20 * scale);

        // Title Box - Authentic Capcom 1px Vintage Border
        this.titleBg.clear();
        let boxW = Math.min(680, W - 32);
        let boxH = W < 500 ? 64 : 76;
        let boxY = Math.max(20, H * 0.18);
        this.titleBg.fillStyle(0x001028, 0.85);
        this.titleBg.fillRect(W/2 - boxW/2, boxY, boxW, boxH);
        this.titleBg.lineStyle(2, 0xFFFFFF, 1);
        this.titleBg.strokeRect(W/2 - boxW/2, boxY, boxW, boxH);
        this.titleBg.lineStyle(1, 0x000000, 1);
        this.titleBg.strokeRect(W/2 - boxW/2 - 2, boxY - 2, boxW + 4, boxH + 4);

        let titleFontSize = W < 420 ? '11px' : (W < 600 ? '14px' : '18px');
        this.titleText.setFontSize(titleFontSize).setPosition(W / 2, boxY + boxH / 2);

        let startFontSize = W < 420 ? '10px' : '14px';
        this.startText.setFontSize(startFontSize).setPosition(W / 2, boxY + boxH + (W < 500 ? 25 : 36));
    }
}

class CharacterSelectScene extends Phaser.Scene {
    constructor() { super('CharacterSelectScene'); }
    create() {
        this.title = this.add.text(0, 0, 'SELECT PLAYER', {
            fontSize: '20px', fill: '#FFD700', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 4, align: 'center'
        }).setOrigin(0.5);
        
        this.riley = this.add.image(0, 0, 'riley').setScale(2).setInteractive({ useHandCursor: true });
        this.rileyText = this.add.text(0, 0, '1P: RILEY (11)', {
            fontSize: '11px', fill: '#FFFFFF', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5);
        
        this.amelia = this.add.image(0, 0, 'amelia').setScale(2).setInteractive({ useHandCursor: true });
        this.ameliaText = this.add.text(0, 0, '2P: AMELIA (8)', {
            fontSize: '11px', fill: '#FFFFFF', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5);

        this.subText = this.add.text(0, 0, 'CHOOSE YOUR HERO', {
            fontSize: '10px', fill: '#58B8F8', fontFamily: '"Press Start 2P", monospace',
            stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5);

        this.layout(this.scale.width, this.scale.height);

        this.scale.on('resize', (gameSize) => {
            this.layout(gameSize.width, gameSize.height);
        });

        this.riley.on('pointerover', () => this.riley.setTint(0xcccccc));
        this.riley.on('pointerout', () => this.riley.clearTint());
        this.amelia.on('pointerover', () => amelia.setTint(0xcccccc));
        this.amelia.on('pointerout', () => amelia.clearTint());

        this.riley.on('pointerdown', () => this.scene.start('GameScene', { character: 'riley', name: 'Riley' }));
        this.amelia.on('pointerdown', () => this.scene.start('GameScene', { character: 'amelia', name: 'Amelia' }));
    }

    layout(W, H) {
        const insets = getSafeAreaInsets();
        const topY = Math.max(50, insets.top + 30);
        this.title.setPosition(W / 2, topY);

        if (W < 520 && H > W) {
            // Mobile Portrait: Stack characters vertically
            let centerY1 = H * 0.38;
            let centerY2 = H * 0.65;
            this.riley.setPosition(W / 2, centerY1);
            this.rileyText.setPosition(W / 2, centerY1 + 65);
            this.amelia.setPosition(W / 2, centerY2);
            this.ameliaText.setPosition(W / 2, centerY2 + 65);
        } else {
            // Landscape or Desktop: Side by side
            let spacing = Math.min(160, W * 0.22);
            let centerY = H * 0.52;
            this.riley.setPosition(W / 2 - spacing, centerY);
            this.rileyText.setPosition(W / 2 - spacing, centerY + 70);
            this.amelia.setPosition(W / 2 + spacing, centerY);
            this.ameliaText.setPosition(W / 2 + spacing, centerY + 70);
        }

        this.subText.setPosition(W / 2, H - Math.max(30, insets.bottom + 20));
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

        this.scale.on('resize', (gameSize) => {
            if (this.oceanBg) this.oceanBg.setSize(gameSize.width, 1400);
            this.layoutHUD(gameSize.width, gameSize.height);
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

        const leftPadding = Math.max(16, insets.left + 12);
        const rightPadding = Math.max(16, insets.right + 12);

        if (this.hudPlayerIcon) this.hudPlayerIcon.setPosition(leftPadding, contentY);
        if (this.hudPlayerName) this.hudPlayerName.setPosition(leftPadding + 18, contentY - 7);

        let nameRight = leftPadding + 18 + (this.hudPlayerName ? this.hudPlayerName.width : 45) + 12;
        if (this.hudHpText) this.hudHpText.setPosition(nameRight, contentY - 7);
        let hpRight = nameRight + (this.hudHpText ? this.hudHpText.width : 20) + 8;

        if (this.hpNodes) {
            this.hpNodes.forEach((node, i) => {
                node.setPosition(hpRight + (i * 16), contentY);
            });
        }

        if (this.hudIceCreamIcon) this.hudIceCreamIcon.setPosition(W - rightPadding - 10, contentY);
        if (this.hudScoreText) this.hudScoreText.setPosition(W - rightPadding - 120, contentY - 7);
        if (this.hudCoinIcon) this.hudCoinIcon.setPosition(W - rightPadding - 135, contentY);

        if (this.hudLocation) {
            this.hudLocation.setPosition(W / 2, contentY);
            if (W < 540) {
                this.hudLocation.setFontSize('7px');
                this.hudLocation.setVisible(W >= 360);
            } else {
                this.hudLocation.setFontSize('9px');
                this.hudLocation.setVisible(true);
            }
        }
    }
}

config.scene = [BootScene, TitleScene, CharacterSelectScene, GameScene];
window.game = new Phaser.Game(config);
const game = window.game;
