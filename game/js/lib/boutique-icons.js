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

