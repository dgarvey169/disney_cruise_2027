# 🚢 2027 Disney Cruise Project - Persistent Memory & Context

> **Repository:** `dgarvey169/disney_cruise_2027`  
> **Workspace Path:** `/home/drew/Projects/Gemini_Projects/disney_cruise_2027`  
> **Active Branch:** `main`  
> **Last Updated:** September 4, 2026

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
- `game/index.html` + `game/game.js`: The 8-bit Disney Destiny Adventure game (see Section 5).
- `game/GDD.md`: Game Design Document.

---

## 5. Game State (game/game.js)
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

### Known Pending Items (from GDD)
- Kid's Clubs: Edge (Riley) / Oceaneer's Club (Amelia)
- Theaters: Movie theater and Walt Disney Theatre
- Boutique mini-game (Amelia only)
