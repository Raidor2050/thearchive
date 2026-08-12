# Raiyan Kabir — Interactive Archive v9

A compact black-and-white, GBA/indie-game-inspired professional portfolio.

## Run
Open `index.html` directly in a browser, or serve the folder with any static server.

## Interaction
- `Enter` / `Space`: advance
- `1–3`: choose options
- `Backspace` / `Left Arrow`: back
- `Q`: quests
- `T`: toolkit
- `P`: profile
- `C`: contact
- `H`: home
- `Esc`: close popup

## Design
The experience uses a familiar dialogue pattern: speaker, optional portrait, short text, continuation cue, then early choices. This keeps the interactive layer engaging without hiding the professional content. Dialogue UI research recommends readable text, clear speaker identification, obvious advance cues and short choices. Open-source visual-novel projects also commonly use branching scene data, autosave and lightweight state management.

References:
- Dialogue UI anatomy and choice guidance: https://www.abratabia.com/game-ui-design/dialogue-ui.php
- Monogatari visual novel engine: https://github.com/Monogatari/Monogatari
- Project Aetheria browser VN: https://github.com/Schnee111/project-aetheria

## Notes for Agents
See `IMPLEMENTATION_ROADMAP.md` before modifying the experience. Keep the mystery subtle, keep the professional information concrete, and do not turn this back into a conventional SaaS portfolio.


## v10 narrative update
- Opening is exactly: “You made it!” / “Thanks for coming.” / “Want to dive deeper into Raiyan's lore?” with Yes/No choices.
- Portfolio content is organized as a branching story; popups act as deeper story rooms for Quests, Toolkit, Profile, Contact, and Achievements.
- Clicking the black area outside a popup closes it and returns to the story.
- Dialogues are short, concrete, and non-repetitive.
- Raiyan’s avatar is monochrome pixel art with glasses and additional detail.
