# Enhancement #11: NES / Capcom 8-Bit Graphical Overhaul Plan

## Assessment

### 1. Feasibility
**High**. Phaser 3 is inherently designed to handle retro, pixel-perfect 2D games. The framework supports a `pixelArt: true` configuration (which we already have enabled) that disables WebGL texture smoothing, ensuring crisp edges. Transitioning from our current primitive `add.graphics()` placeholder method to actual sprite sheets or refined bitmap-generated sprites and tilemaps is a standard, highly supported Phaser workflow.

### 2. Impact
**High**. This will completely replace the current visual identity of the game.
- **Current State**: The game currently uses runtime-generated geometry (using `fillRect` to draw rudimentary characters and lines for decks).
- **Future State**: A polished, cohesive late-80s arcade aesthetic with strict color palettes, black-bordered sprites, and authentic NES-style UI. This will impact asset loading, collision box alignments, and rendering performance (though performance should remain excellent). It will heavily impact the user experience, providing a nostalgic, professional feel.

### 3. Level of Effort (LOE)
**Medium-High**. While the technical implementation in Phaser is straightforward, the sheer volume of assets that need to be generated, aligned, and wired up is significant. 
- The entire environment needs to be translated into a strict 16x16 tile grid.
- Character animations (idle, walk, jump, climbing) must be mapped to sprite sheets.
- UI elements must be built from scratch to replace default text.
- Testing across mobile and desktop to ensure aspect ratios and CSS `image-rendering` work flawlessly.

---

## Work Breakdown Structure (Child Stories/Tasks)

To execute this, we will break the work down into the following child tasks. These can be executed by the 3.8 Flash agent sequentially.

### Task 11.1: Core Rendering & Viewport Configuration
- **Description**: Update the HTML/CSS and Phaser config to enforce strict retro rendering.
- **Action Items**:
  - Add `image-rendering: pixelated;` and `image-rendering: crisp-edges;` to the canvas CSS.
  - Implement mobile safe-area styling (`env(safe-area-inset-top)`).
  - Ensure the Phaser scale manager maintains a nostalgic aspect ratio (e.g., 4:3 or a dynamic 16:9) with letterboxing if necessary, rather than purely fluid resizing that distorts the pixel grid.

### Task 11.2: Character Sprite Pipeline (Riley & Amelia)
- **Description**: Replace the generated `fillRect` graphics for the playable characters with authentic 8-bit sprites.
- **Action Items**:
  - Create or load base sprite sheets for Riley and Amelia adhering to a 3-color (+ transparent) sprite palette limit and black 1px outlines.
  - Wire up Phaser animations (`anims.create`) for Idle, Walk, Jump, and Action states.
  - Adjust Arcade Physics body sizes and offsets (`player.body.setSize()`) to precisely fit the new sprites.

### Task 11.3: 16x16 Environment Tilemap & Level Design
- **Description**: Convert the primitive geometric decks, stairs, and pools into a structured 16x16 tilemap.
- **Action Items**:
  - Load an NES-style tileset image containing deck plates, railings, stairs, and pool water.
  - Replace the current hardcoded deck coordinates with a Phaser Tilemap or a sprite-based grid system.
  - Ensure the strict lockstep physics (e.g., 45-degree slope logic for stairs) still perfectly align with the new 16x16 visual grid.

### Task 11.4: Retro HUD & Typography
- **Description**: Implement a top-mounted, Capcom-style HUD.
- **Action Items**:
  - Remove standard browser/canvas text elements.
  - Add a vintage Bitmap font or load a custom retro web font (e.g., "Press Start 2P").
  - Build the retro HP tracker (e.g., node/sphere based health).
  - Add zero-padded score/currency counters (e.g., `$0000000`).

---

**Execution Note**: As we transition to execution with the 3.8 Flash model, we will create dedicated branches for each of these tasks, merging them incrementally into `main`.
