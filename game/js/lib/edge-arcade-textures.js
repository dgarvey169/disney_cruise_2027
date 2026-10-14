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

