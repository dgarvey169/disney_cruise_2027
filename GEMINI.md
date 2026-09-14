# Workspace Rules

- **Auto-Push to GitHub**: Always remember to run `git push` to push committed code to GitHub automatically after completing a task or ask for the user. You do not need to ask for permission to push, and you should not wait for the user to remind you.
- **Bug Fix Workflow via Pull Requests**:
  1. Whenever starting work on a bug, create a dedicated branch (e.g., `fix/issue-<number>-<short-name>`) and set the Project **Status** field to **`In progress`**.
  2. Implement the fix on the branch, commit, and push to GitHub.
  3. Open a Pull Request on GitHub linking to the bug issue.
  4. Post a comment on the bug issue explaining what was done and include a link to the game (`https://dgarvey169.github.io/disney_cruise_2027/game/`).
  5. Move the Project **Status** field to **`In review`** for user testing, providing the PR link and live game link.
  6. Only close the bug and merge the PR into `main` after user testing and explicit approval.
