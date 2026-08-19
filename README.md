# The Archive - Raiyan Kabir

An interactive monochrome portfolio presented as a branching story. Raiyan's work in affiliate marketing, partnerships and growth operations is explored through dialogue, hidden notes and unlockable achievements — styled after GBA / indie pixel games.

## Run

Open `index.html` directly in a browser, or serve the folder with any static server:

```
python -m http.server
```

## How to play

- Start on the **Press Enter** screen, then advance through the dialogue with `Enter`, `Space` or `Right Arrow`.
- Choose with `1`–`3` (or click the choices).
- Go back with `Backspace` or `Left Arrow`.
- Open rooms with the keyboard: `Q` quests, `T` toolkit, `P` profile, `C` contact, `H` home, `G` games.
- Press `Esc` (or click outside a popup) to close it.

## Features

- Branching dialogue tree — each statement is a single short line, one press at a time.
- Rooms: **Quests**, **Toolkit**, **Profile**, **Contact** and **Achievements**.
- Secret **Archive Notes** hidden in the story; find them to earn XP.
- **Achievements** unlock after enough presses.
- Sound on/off toggle with retro bleeps and ambient loop.
- Progress is saved locally in the browser (`localStorage`).
- **V1.1 mini games** — six short playable stories that appear when the Guide touches their topic: **Lead Invaders**, **Email Build**, **Partner Call**, **Onboard Pack**, **Close the Deal** and **Auto Flow**. Each is skippable, scores with name entry, and keeps a top-10 leaderboard per game. All six must be lived through before the final page offers contact.
- **V1.2 SIGNAL tier** — when the user reaches the contact popup (end of the story, the contact icon button, or the `C` hotkey), a button appears in the lower-left corner. It opens **The Rerun**: the same stories rewritten in a second visual style, with four new games (**Signal Relay**, **Cable Triage**, **Signal Chain**, **Async Batch**).
- **V1.2 VAULT tier** — complete the rerun to unlock **The Vault**, a 3D version of the archive (three.js helix of 29 chapters and 6 rooms) with a reduced-motion poster and a CSS-3D fallback. `S` and `V` switch tiers, and progress is never revoked.

## Structure

```
index.html    — app shell and start screen
styles.css    — monochrome pixel UI + tier tokens
games.css     — V1.1 mini game UI
games-alt.css — V1.2 signal game UI
script.js     — dialogue data, state, rooms and audio
story-data.js — V1.2 signal rerun data
tier.js       — V1.2 tier switching, button and signal plumbing
games.js      — V1.1 mini game engine and leaderboards
games-alt.js  — V1.2 signal games
tier-loader.js— vault engine ladder (poster / css3d / three.js)
tier3d.js     — V1.2 3D vault engine
tier3d.css    — vault UI
assets/       — favicon, vendored three@0.160.1 (MIT)
tests/        — node regression + V1.2 harnesses (`node tests/run.js`)
```

## Design notes

The archive keeps the mystery subtle and the professional information concrete. Dialogue stays short and readable; every reveal earns its place.
