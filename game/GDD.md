# Disney Destiny 8-Bit Adventure - Game Design Document

## 1. Overview
An 8-bit character-driven video game set aboard the **Disney Destiny** cruise ship. Built with **Phaser 3** and runs entirely in the browser via `game/index.html`.

## 2. Playable Characters
* **Riley (11 years old):** Blue shirt, dark pants, light-brown hair.
* **Amelia (8 years old):** Pink dress, light-brown hair.
Both characters have standard walk sprites and 4 colored swim sprites (inner tube: red/yellow/green/purple).

## 3. Controls
| Action | Desktop | Mobile |
|---|---|---|
| Move Left/Right | Arrow keys | Drag floating joystick (left half of screen) |
| Jump | Up arrow | Tap right half of screen with second finger |
| Board AquaMouse | Enter (near raft) | Tap the raft zone |

## 4. Game Structure (Levels/Zones)

### ✅ Title Screen
Caribbean-themed: ocean, sky, animated Disney Cruise Ship with Mickey-ear smokestack, sun with rays, clouds. Pulsing gold "Tap or Click to Start" button.

### ✅ Character Select
Choose Riley or Amelia. Pixel-art preview sprites with names.

### ✅ Upper Decks Hub World
Massive zig-zag platforming layout. Dynamic resize — fills any screen size or orientation.

**Deck 11 (Main Pool Deck)**
- Funnel Vision pool (main, large)
- Funnel Vision Movie Screen: cat chasing mouse animation plays on a dark screen above the pool
- Eye Scream Treats ice cream stand (cycling flavors: strawberry → chocolate → vanilla → mint, held above head)
- Senses Spa door (left), Marceline Market door (right)
- Staircase up-right to Deck 12

**Deck 12 (Quiet Cove & Hero Zone)**
- Quiet Cove pool (left), Toy Story Splash pool (right)
- Hero Zone door (far right)
- Staircase up-left to Deck 13

**Deck 13 (AquaMouse Deck)**
- Splashdown pool (left)
- AquaMouse Entrance + Raft Lift zone
- Staircase to/from Deck 12

**AquaMouse Top Deck**
- Small platform at top of lift tube

**AquaMouse Ride Flow:**
1. Stand near raft → "Press ENTER to board!" prompt appears
2. Press Enter (desktop) or tap raft (mobile)
3. Character sits **on top of raft** and lifts to Top Deck via tube
4. Automatic slide along spline curve back down to Splashdown pool on Deck 13

**Physics Features:**
- Continuous invisible ramp staircases — hold left/right to climb, no jumping needed
- Swimming animation triggers in all pools (slower speed, bobbing inner tube, randomized color per entry)
- Ship hull: white walls, red stripe, portholes rendered under each deck
- Transparent railings flush with deck floors on all levels
- Parallax sky, clouds, sun, birds, and deep ocean extending the full world height
- Dynamic resize: `Phaser.Scale.RESIZE` — snaps to browser window on resize or orientation change

### 🔲 Kid's Clubs *(Pending)*
- Edge (if Riley) / Oceaneer's Club (if Amelia)

### 🔲 Theaters *(Pending)*
- Movie theater and grand Walt Disney Theatre

### 🔲 Boutique — Amelia only *(Pending)*
- Bibbidi Bobbidi Boutique makeover mini-game
- Customize dress color & style, hair style, crown, and scepter
