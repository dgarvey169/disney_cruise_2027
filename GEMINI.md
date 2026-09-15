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

- **Deck & Stair Coordinates**:
  - **Stair 1**: Connects Deck 11 (floor `y = 1280`) to Deck 12 (floor `y = 1000`) between `x = 60` and `x = 340`. Slope equation: `floorY = 1340 - x`.
  - **Stair 2**: Connects Deck 12 (floor `y = 1000`) to Deck 13 (floor `y = 760`) between `x = 2060` and `x = 2300`. Slope equation: `floorY = 760 + (x - 2060)`.

