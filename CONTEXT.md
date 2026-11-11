# 🚢 2027 Disney Cruise Project - Persistent Memory & Context

> **Repository:** `dgarvey169/disney_cruise_2027`  
> **Workspace Path:** `/home/drew/Projects/Gemini_Projects/disney_cruise_2027`  
> **Active Branch:** `main`  
> **Last Updated:** September 14, 2026

---

## 1. Trip & Reservation Details
- **Reservation Number:** `44830495`
- **Ship:** **Disney Destiny**
- **Sailing Dates:** **July 31, 2027 – August 7, 2027** (7-Night Western Caribbean)
- **Port:** Fort Lauderdale, FL (Port Everglades)
- **Stateroom:** `9100` (Cat 04B – Deluxe Family Oceanview Stateroom with Verandah, Deck 9 Midship)
- **Guests:** Katie Ann Garvey, Andrew Ryan Garvey, Riley Regina Garvey, Amelia Lee Garvey (Party of 4)
- **Dining:** Main Seating (5:45 PM Dinner / 8:15 PM Evening Show)
- **Protection & Transport:** Vacation Protection Plan added; ground transport declined.

---

## 2. Key Dates & Milestones
- **May 2, 2027:** Activity & Excursion Booking Window Opens (Port Adventures, Palo/Enchanté, Spa).
- **June 28, 2027:** Online Check-in & Port Arrival Time (PAT) Selection Opens.
- **July 31, 2027:** Embarkation Day (All Aboard 4:00 PM / Departure 5:00 PM).
- **August 7, 2027:** Debarkation Day (Begins 8:00 AM).

---

## 3. Daily Itinerary Schedule
1. **Day 1 (Sat, Jul 31):** Fort Lauderdale, FL — All aboard 4:00 PM, Departure 5:00 PM, Sail Away Party.
2. **Day 2 (Sun, Aug 1):** At Sea — AquaMouse, pools, Broadway-style show.
3. **Day 3 (Mon, Aug 2):** George Town, Grand Cayman *(Tender Port)* — 8:00 AM ashore, 5:00 PM aboard.
4. **Day 4 (Tue, Aug 3):** Falmouth, Jamaica — 7:30 AM ashore, 5:00 PM aboard.
5. **Day 5 (Wed, Aug 4):** At Sea — Pirate Night & Fireworks at Sea.
6. **Day 6 (Thu, Aug 5):** Disney Lookout Cay at Lighthouse Point (Bahamas) — 8:30 AM ashore, 5:30 PM aboard.
7. **Day 7 (Fri, Aug 6):** Nassau, Bahamas — 8:00 AM ashore, 4:45 PM aboard.
8. **Day 8 (Sat, Aug 7):** Fort Lauderdale, FL — Debarkation begins 8:00 AM.

---

## 4. Key Files & State
- `2027_Disney_Cruise.ipynb` / `2027_Disney_Cruise.md`: Planning notebook with pandas models for budget ($9,786 base + $1,100 optional add-ons), timeline, and excursions. Notebook edits require a Python/json script workaround (`.ipynb` files cannot be directly edited).
- `presentation.html`: Budget presentation separating base costs from optional add-ons. Magic Bands and Photography packages removed.
- `README.md`: Project summary and quick links.
- `Itineraries/`: Raw source PDFs.
- `game/index.html` + `game/js/`: The 8-bit Disney Destiny Adventure game (see Section 5). Code is split into per-scene classic scripts (`js/scenes/*.js`), shared helpers (`js/lib/*.js`), and `js/main.js` (bootstrap, loads last), loaded in order by an inline loader in `index.html` with a single `ASSET_VERSION` cache-buster (Issue #58).
- `game/GDD.md`: Game Design Document.

---

## 5. Game State (game/js/)
The game is a Phaser 3 browser-based platformer. All changes are on the `main` branch.

### Completed Features
- **Title Screen:** Caribbean-themed with ocean, sky, animated Disney Cruise ship (white hull, red stripe, Mickey-ear funnel), sun with rays, clouds, and pulsing gold "Tap or Click to Start" text.
- **Character Select:** Riley (11) or Amelia (8), pixel-art sprites.
- **Dynamic Scaling:** `Phaser.Scale.RESIZE` — game fills 100% of browser window and snaps on orientation change.
- **Parallax Background (GameScene):** Sky, sun, clouds with parallax, animated birds, deep ocean horizon extending the full world height.
- **Ship Hull:** White walls with red stripes and paired portholes tiled beneath each deck (`ship_wall` texture, 480px tile).
- **Three Playable Decks:**
  - **Deck 11 (y=1300):** Funnel Vision pool (main), platforms left & right, Senses Spa door, Marceline Market door, Eye Scream Treats ice cream stand.
  - **Deck 12 (y=1020):** Quiet Cove pool, middle platform, Toy Story Splash pool, right platform, Hero Zone door. Decks split around pools so swimming triggers correctly.
  - **Deck 13 (y=780):** Left sliver, Splashdown pool, large right platform. Deck split around pool.
- **Railings:** Transparent, flush with floor on all decks.
- **Continuous Staircases:** Invisible physics ramps + visual step sprites. Deck 11→12 (right-up), Deck 12→13 (left-up). Walk into staircase and hold left/right to climb or descend smoothly.
- **Swimming Animation:** When a character steps into any pool, they switch to a colored inner-tube swimming sprite that bobs up and down. Inner tube color randomizes on each water entry (red/yellow/green/purple). Works on all 4 pools.
- **Ice Cream:** Pick up at Eye Scream Treats — held above head, flavor cycles (strawberry → chocolate → vanilla → mint) each time.
- **Funnel Vision Movie Screen:** Dark screen above the Deck 11 pool showing an animated cat chasing a mouse that runs back and forth, changing direction at each edge.
- **AquaMouse Ride:**
  - Walk to the raft on Deck 13 → prompt appears: "Press ENTER to board!"
  - Desktop: press **Enter**. Mobile: tap the raft zone.
  - Character sits **on top of the raft** throughout the lift (Deck 13 → Top Deck) and the slide.
  - Slide follows a spline curve from top deck → splashdown pool on Deck 13.
- **Mobile Controls:** Floating joystick — touch left half of screen to spawn joystick at finger position, drag to move. Tap right half of screen with a second finger to jump. Replaces old fixed D-pad buttons.
- **Midship Elevators & Floor Navigation System (#43, #50):**
  - Midship elevators on Deck 11 (`x = 1250, groundY = 1255`) and Deck 12 (`x = 1250, groundY = 975`).
  - Interactive prompt `[ ENTER: USE ELEVATOR ]` / `[ TAP TO USE ELEVATOR ]`.
  - `ElevatorMenuScene`: 8-bit retro popup dialog with keyboard (arrow keys, WASD, Enter, Space, ESC) and mouse/touch selection, animated cursor arrow `►`, and gold selection highlighting.
  - Deck 13 deliberately omitted from the elevator shaft; accessible exclusively via Stair 2 on Deck 12 aft.
  - Clean physics teleportation using `player.body.reset(1250, targetGroundY)` with zero drift or flutter.
- **Riley's Edge Tween Club & Retro Space Shooter Arcade (#47):**
  - Added Deck 5 (Edge Tween Club) destination to Midship Elevators.
  - Explorable 8-bit synthwave lounge with neon lights, DJ equalizer, Leo & Maya NPCs with retro Capcom speech bubbles, tropical smoothie speed boosts, and wall-mounted live Leaderboard.
  - "Galaxy Destiny" arcade cabinet: 8-bit retro space shooter mini-game with parallax starfield, waves of Drones, Cruisers, Asteroids, Boss Dreadnought, power-ups, smart bombs, Web Audio synthesizer effects, and persistent high scores.
- **Amelia's Bibbidi Bobbidi Boutique (#44):**
  - Added Deck 4 (Bibbidi Bobbidi) destination to Midship Elevators.
  - Interactive 8-bit royal makeover salon (`BoutiqueScene`) with 4 customization tiers (Wig, Dress, Crown, Wand/Scepter), dynamic procedural sprite generation (`amelia-outfit.js`), Web Audio harp chimes, and `localStorage` persistence.
- **Riley's Hero Zone (#46):**
  - Deck 12 arena (`HeroZoneScene`) featuring the Incredibles Timed Obstacle Course (`ObstacleCourseScene`), Retro Air Hockey (`AirHockeyScene`), Pop-A-Shot Basketball Shootout (`BasketballShootoutScene`), and Hall of Heroes records display.
- **Amelia's Oceaneer Club (#45, #63):**
  - Added Deck 2 (Oceaneer Club) destination to Midship Elevators.
  - Central Rotunda Hub (`OceaneerClubScene`) with interactive MagicBand Check-In Scanner, Pixie Dust Trail toggle, interactive Tinker Bell lantern, and 5 themed activity wings:
    - `RalphSlideWingScene`: Wreck-It Ralph's Sugar Rush Spiral Slide from Deck 3 to Deck 2 with candy boosts and hazards.
    - `MarvelAcademyWingScene`: Marvel Super Hero Academy with Iron Man, Spider-Man, and Wasp suit-ups and the Holo-Drone Combat Training Bay mini-game.
    - `StarWarsCargoWingScene`: Star Wars Cargo Bay with porg cage, holotable, Loth-cat feeding, and Coaxium hyperdrive puzzle.
    - `ImagineeringLabWingScene`: Walt Disney Imagineering Lab with 3D Souvenir Printer, Animator's Studio, and Cyber-Coaster Track Builder & Simulator.
    - `FairytaleHallWingScene`: Fairytale Hall with Rapunzel's Lantern Painting, Elsa's Ice Magic Symphony, and Belle's Royal Library Storytelling.
- **Currents Bar Removal (#42):** Doorway and signage removed from Deck 13.

### Known Pending Items & Feature Roadmap
- **DuckTales (NES) Graphics & UI Overhaul:** Tracked in Issue #11. Capcom 8-bit styling, black-bordered sprites, PPU palette limits, 16×16 tile grid, retro HP health spheres, padded zero score display, pixelated canvas rendering.
- **Bespoke Character Levels & Storylines:** Issue #12 triaged, closed, and split into:
  - **Issue #43:** Midship Elevators and UI Floor Selection Menu (Completed)
  - **Issue #44:** Amelia's Bibbidi Bobbidi Boutique (Completed)
  - **Issue #45:** Amelia's Oceaneer Club (Completed)
  - **Issue #46:** Riley's Hero Zone (Completed)
  - **Issue #47:** Riley's Edge Tween Club Arcade (Completed)
- **AquaMouse Redesign & Overhaul:** Completed in Issue #39 (PR #52) — visual/depth-ordering overhaul only.
- **Theaters (Pending):** Movie theater and grand Walt Disney Theatre.

