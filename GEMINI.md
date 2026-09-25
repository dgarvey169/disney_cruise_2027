# Workspace Rules

- **Auto-Push to GitHub**: Always remember to run `git push` to push committed code to GitHub automatically after completing a task or ask for the user. You do not need to ask for permission to push, and you should not wait for the user to remind you.
- **Bug Fix Workflow via Pull Requests**:
  1. Whenever starting work on a bug, create a dedicated branch (e.g., `fix/issue-<number>-<short-name>`) and set the Project **Status** field to **`In progress`**.
  2. Implement the fix on the branch, commit, and push to GitHub.
  3. Open a Pull Request on GitHub linking to the bug issue.
  4. Post a comment on the bug issue explaining what was done and include a link to the game (`https://dgarvey169.github.io/disney_cruise_2027/game/`).
  5. Move the Project **Status** field to **`In review`** for user testing, providing the PR link and live game link.
  6. Only close the bug and merge the PR into `main` after user testing and explicit approval.

# Game Architecture & Physics Memory

- **Browser Cache Invalidation**:
  - Always bump the asset cache-buster version query parameter (e.g., `game.js?v=X.X`) in `game/index.html` whenever updating `game.js`. Mobile and desktop browsers aggressively cache game scripts, which otherwise hides fixes during user testing.
- **GitHub Pages Branch Management**:
  - During PR testing, GitHub Pages can be pointed to the fix branch (`gh api --method PUT repos/:owner/:repo/pages -F "source[branch]=<branch>" -F "source[path]=/"`) so users can test on live mobile and desktop.
  - When the PR is merged into `main`, immediately restore GitHub Pages to build from `main` and trigger a build (`gh api -X POST repos/:owner/:repo/pages/builds`).

- **Phaser 3 Arcade Physics & Slope Traversal Principles**:
  - **Do NOT manually overwrite `player.y` / `player.body.y` during active movement**: Phaser's `Body.postUpdate()` integrates position each frame using `gameObject.y += (body.position.y - body.prevFrame.y)`. Manually snapping coordinates in `update()` causes `prevFrame` to get out of phase, creating a destructive feedback loop (60Hz vibration / flutter) across consecutive frames.
  - **Clean Physics Reset on State Transitions**: Always invoke `player.body.reset(x, y)` whenever mounting a staircase, landing on stairs from an airborne fall, stepping off onto a deck, or dropping through. This zeros out `body.prev` and `body.prevFrame` and immediately terminates residual airborne falling delta (~500px/s) that would otherwise jitter the player.
  - **Lockstep Velocity Integration on 45° Slopes**: Disable gravity on stairs (`body.allowGravity = false`) and apply equal velocity magnitudes (`vx = ±speed, vy = ∓speed`). Because the stairs are 45° (slope ±1), Phaser's integrator advances horizontal and vertical positions in mathematical lockstep with 0px drift.
  - **Stationary on Stairs**: When horizontal controls are released on stairs, set `this.player.setVelocity(0, 0)` with `allowGravity = false`. Never apply continuous position-snapping when idle.
  - **Continuous Collision Detection (CCD) for Airborne Landings**: Fast falling characters can move 15–20px per frame and may skip narrow trigger zones. Always use swept collision detection (`(bottomY >= sY - 8 && bottomY <= sY + 25) || (prevBottomY <= sY && bottomY >= sY)`) when detecting landings on slopes from above.
  - **Under-Stair Pass-Through on Lower Decks**: Lower deck floors extend under diagonal staircases. Characters walking horizontally at deck level must pass freely underneath stairs without being trapped or redirected upward unless they explicitly press Up/Jump.
  - **Phaser 3 Arcade Physics Overlap Callback Discrimination**:
    - In Phaser 3 Arcade Physics, `physics.add.overlap(group, sprite, callback)` and `physics.add.overlap(sprite, group, callback)` both invoke `collideCallback(sprite, groupMember)`. Phaser always passes the `Sprite` as parameter 1 (`bodyA.gameObject`) and the `Group` child as parameter 2 (`bodyB.gameObject`).
    - Relying on parameter ordering in the callback definition without verifying object identity can lead to accidental destruction of the player sprite (e.g. calling `powerup.destroy()` when parameter 1 is actually `this.player`).
    - Always enforce defensive identity discrimination (`const target = (objA === this.player) ? objB : objA`) and add safety guards (`if (!obj || obj === this.player) return;`) in all collision, damage, and collection handlers.
  - **Arcade Shooter Viewport & Mobile Controls Architecture**:
    - **Recessed CRT Monitor Bezel**: Side cabinet wings, T-molding, and letterbox masks rendered at Depth 30 create a physically recessed viewport for the CRT screen (Depth 2..25). Enemies, lasers, and particles cannot render on top of the cabinet wings.
    - **Screen Boundary Containment**: Cruisers bank and reverse horizontal velocity (`vx = -vx`) when reaching `playX + 18` or `playX + playW - 18`, and drone sine-waves are clamped to stay inside the monitor.
    - **Dual-Thumb Mobile Controls**: Floating joystick (`joyBase` / `joyKnob` at Depth 520) spawns on touch in the left screen region with 360° analog deflection. Dedicated action overlays for `FIRE` and `BOMB` at Depth 510 in the lower-right thumb zone allow simultaneous steering and shooting without touch interference via `this.input.addPointer(3)`.

- **Deck & Stair Coordinates**:
  - **Stair 1**: Connects Deck 11 (floor `y = 1280`) to Deck 12 (floor `y = 1000`) between `x = 60` and `x = 340`. Slope equation: `floorY = 1340 - x`.
- **2.5D Depth Movement & 3/4 Isometric Perspective Architecture (Issues #30, #27, #28, #29, #37)**:
  - **Decoupled 2.5D Coordinate System**: Character position is tracked using `groundY` (foot-plane position within the 60px deck corridor) and `jumpZ` (height off the ground during jumps). Visual render position is computed as `player.y = groundY - jumpZ`.
  - **Arcade Body Reset on Every Frame**: `player.body.reset(player.x, player.y)` keeps the Phaser Arcade Physics body synchronized with visual coordinates without conflicting deltas (`body.prev` / `body.prevFrame`), eliminating 60Hz flutter and collision jitter.
  - **Deck Corridor Coordinates (60px Depth)**:
    - Deck 11: `minY = 1220`, `maxY = 1280` (midway `groundY = 1255`), `x = 20..2380`
    - Deck 12: `minY = 940`, `maxY = 1000` (midway `groundY = 975`), `x = 20..2380`
    - Deck 13: `minY = 700`, `maxY = 760` (midway `groundY = 735`), `x = 20..2380`
    - Top Deck: `minY = 325`, `maxY = 345` (midway `groundY = 335`), `x = 700..800`
  - **Dynamic Y-Sorting Hierarchy**:
    - Floor tiles & bulkheads: `depth = 1` to `3`
    - Bulkhead doors / stands: `depth = 1190` (Deck 11), `910` (Deck 12)
    - Swimmers & deck entities: `depth = Math.round(groundY)`
    - Pool front coping & water overlay: `depth = poolMaxY + 2` (`1282`, `1002`, `762`)
    - 3D deck slab fascia: `depth = poolMaxY + 60` (`1340`, `1040`, `800`)
    - Foreground railings: `depth = poolMaxY + 70` (`1350`, `1050`, `810`)
    - Retro HUD: `depth = 3000+`
    - In-game Menu: `depth = 4000+`
  - **3D Isometric Perspective Textures**:
    - `deck_3d`: 40x60, depth-graded teak planks with shaded back walkway, mid promenade, sunlit fore deck, and brass margin curb.
    - `deck_fascia`: 40x12, 3D structural slab apron with 8-bit rivet bolts and drop shadow.
    - `deck_overhang_shadow`: 40x10, ambient occlusion drop shadow under upper-deck ceiling.
    - `pool_3d_basin`: 40x60, sunken 3D swimming pool basin with shaded mosaic back wall, turquoise water volume, and wave caustics.
    - `pool_front_coping_3d`: 40x14, marble coping slab and translucent water surface overlay.
    - `stair_step_3d`: 40x22, authentic horizontal tread with yellow non-slip safety nose and vertical steel riser.
  - **Stair Mounting & Traversal Coordinates**:
    - Stair 1: `x: 60..340`, `groundY = 1340 - x`. Mounting from Deck 11 base (`x: 40..100, groundY: 1210..1285` with `isUp`). Mounting from Deck 12 top (`x: 300..360, groundY: 930..1010` with `isDown`). Top exit: `x = 340, groundY = 975`. Bottom exit: `x = 60, groundY = 1255`. Stairwell opening in Deck 12 railing and fascia at `x: 300..345` with safety newel posts. Horizontal walking (`Left`/`Right`) passes freely along Deck 12 across the stairwell.
    - Stair 2: `x: 2060..2300`, `groundY = 760 + (x - 2060)`. Mounting from Deck 12 base (`x: 2240..2320, groundY: 930..1010` with `isUp`). Mounting from Deck 13 top (`x: 2040..2100, groundY: 690..770` with `isDown`). Top exit: `x = 2060, groundY = 735`. Bottom exit: `x = 2300, groundY = 975`. Stairwell opening in Deck 13 railing and fascia at `x: 2055..2100` with safety newel posts. Horizontal walking (`Left`/`Right`) passes freely along Deck 13 across the stairwell.

# Feature Roadmap & Design Memory

- **DuckTales (NES / Capcom 8-Bit) Aesthetic Direction (Issue #11)**:
  - **Sprite & Palette Constraints**: Authentic late-80s Capcom NES aesthetic with black-bordered sprites, crisp 8-bit styling, and strict NES PPU-style color palette limits (four 3-color background palettes and four 3-color sprite palettes).
  - **Tile Grid Discipline**: Strict 16×16 px tile structures for all ship deck environments, props, platforms, and hull textures.
  - **Capcom Retro HUD & UI**: Top-mounted HUD featuring retro HP health spheres/nodes, zero-padded score/currency counters (`$0000000`), vintage 1px border dialogue boxes, and uppercase bitmap/pixel typography (e.g., `Press Start 2P`).
  - **Rendering & Viewport**: Canvas rendered with `image-rendering: pixelated; crisp-edges;`, dynamic 16:9 viewport with `object-fit: contain`, and touch/mobile layouts respecting `env(safe-area-inset-*)`.

- **Bespoke Character Levels & Storylines (Issue #12 - Triaged & Closed)**:
  - **Sub-Tasks Generated & Tracked**: Broken down into discrete issues on the project board:
    - #43: Midship Elevators and UI Floor Selection Menu (Completed)
    - #44: Amelia's Bibbidi Bobbidi Boutique (8-bit Makeover UI)
    - #45: Amelia's Oceaneer Club (Deck 2 Hub & 4 Themed Wings: Marvel, Star Wars, Imagineering, Fairytale Hall)
    - #46: Riley's Hero Zone (Deck 12 Timed Incredibles Obstacle Course)
    - #47: Riley's Edge Tween Club Arcade (Retro Space Shooter Cabinet - Completed)
  - Storyboard documented in detail in `Issue_12_Storyboard.md`.

- **Riley's Edge Tween Club Arcade (Issue #47 - Completed)**:
  - **Elevator Navigation**: Added `Deck 5 (Edge Tween Club)` destination in `ElevatorMenuScene`. Selecting it automatically sets active character to Riley and launches `EdgeClubScene`.
  - **Edge Tween Club Lounge (`EdgeClubScene`)**:
    - Authentic late-80s Capcom/NES synthwave aesthetic: deep navy walls (`edge_wall`), neon blue/cyan light strips, illuminated diamond tile flooring (`edge_floor`), pulsing neon "EDGE" sign, starry night ocean portholes with twinkling stars, and an animated DJ equalizer station.
    - **Tween NPCs**: Leo (lounging on sectional couch with headphones) and Maya (cheering by arcade cabinet) with proximity 8-bit Capcom speech bubbles.
    - **Smoothie Bar ("Edge Chill Bar")**: Interactive counter where Riley can grab a tropical smoothie (`edge_smoothie`), gaining a sparkling rainbow aura and +50% speed boost.
    - **Wall-Mounted CRT Leaderboard**: Displays Top 5 scores dynamically pulled from `localStorage` (`getEdgeHighScores()`).
    - **Proximity Prompts**: Blinking retro action prompts for elevator, smoothie bar, and arcade cabinet (`[ ENTER: ... ]` / `[ TAP TO ... ]`).
  - **"Game Within a Game": Retro Space Shooter ("GALAXY DESTINY" / `ArcadeShooterScene`)**:
    - Authentic CRT arcade cabinet surround, golden/cyan border bezel, top marquee, and scanlines.
    - Dual-layer parallax scrolling starfield.
    - Player starfighter with flickering thrusters, dual laser cannons (upgradable to 3-way spread and quad heavy plasma), and energy shield forcefield.
    - Enemy formations: Swooping Alien Drones, Armored Cosmic Cruisers, and tumbling Asteroids (splitting into mini fragments).
    - Boss Battle: **The Destiny Dreadnought** (Wave 3, 120 HP with boss health bar, dual wing spread cannons, aimed homing energy orbs, multi-stage cascading explosions, and victory fanfare).
    - Power-ups: `[P]` (Weapon upgrade), `[S]` (Energy Shield), `[B]` (Smart Bomb), and `[★]` (+1000 pts).
    - Smart Bomb: Screen-clearing shockwave that vaporizes bullets and deals massive damage.
    - **8-Bit Web Audio Synthesizer**: Pure Web Audio oscillators (square, triangle, sawtooth, noise) for laser zaps, explosion booms, powerup chimes, and bomb blasts with zero external dependencies.
    - **Edge High Score Board Integration**: Updates player score, celebrates new high scores ("★ NEW HIGH SCORE! RILEY IS #1 ON THE EDGE BOARD!"), persists in `localStorage`, and immediately updates the Edge Club wall display upon return.
    - **Controls**: Full keyboard (Arrow keys/WASD, Space/Z to shoot, X/B for bomb, ESC to exit) and mobile on-screen controls (floating virtual joystick with 360° analog deflection matching deck traversal, dedicated on-screen FIRE [HOLD] and BOMB [X] overlay buttons with multi-touch isolation, and quick exit).

- **Currents Bar Doorway & Signage Removal (Issue #42 - Completed)**:
  - Removed unused doorway sprite and "CURRENTS BAR" banner on Deck 13 aft (`x = 2240`).

- **Midship Elevators & Floor Navigation System (Issues #43 & #50 - Completed)**:
  - **Locations**: Midship elevator doors and interaction zones placed on Deck 11 (`x = 1250, y = 1190`, ground `y = 1255`) and Deck 12 (`x = 1250, y = 910`, ground `y = 975`).
  - **Deck 13 Traversal**: Elevators are intentionally omitted from Deck 13 per design preference; Deck 13 is reached exclusively via Stair 2 from Deck 12.
  - **Interaction**: Retro prompt `[ ENTER: USE ELEVATOR ]` / `[ TAP TO USE ELEVATOR ]` appears above player.
  - **ElevatorMenuScene**:
    - Authentic 8-bit modal dialog box with animated cursor arrow (`►`), gold active highlights, and soft red cancel option.
    - Full keyboard navigation: `Up` / `Down` and `W` / `S` cycle options with wrap-around.
    - Confirmation via `Enter` / `Space` with debounce to prevent accidental double-activation on open.
    - Cancellation via `ESC` or `[ CANCEL ]` button.
    - Mouse/touch hover seamlessly synchronizes with the cursor position.
  - **Physics Transition**: Teleportation cleanly resets `jumpZ = 0`, sets `groundY = targetGroundY`, and invokes `player.body.reset(1250, targetGroundY)` to guarantee zero physics vibration.

- **AquaMouse Redesign & Overhaul (Issue #39)**:
  - Overhaul of the AquaMouse water coaster aesthetics and ride mechanics. Address raft/tube depth ordering relative to Deck 13 floor planes and slide curves.

- **Full-Width Decks 12 & 13 and Superstructure Continuity (Issue #40 - Completed)**:
  - Eliminated staggered deck overhangs and open-water gaps behind stairwells by extending Deck 12 left to `x = 0` and Deck 13 across the full width (`x = 0..2400`).
  - Background hull wall panels (`ship_wall`), baseboard trim lines, and ambient occlusion overhang shadows cover `x = 0..2400` across all decks.
  - Dedicated stairwell openings with architectural 8-bit safety newel posts on Deck 12 (`x: 300..345`) and Deck 13 (`x: 2055..2100`).
  - New venues added: Cove Cafe (`x = 140`) on Deck 12 forward.
  - Added ambient NPCs Marcus (Cove Cafe lounger) and Elena (Deck 13 aft promenade walker).



