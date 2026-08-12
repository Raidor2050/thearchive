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
- Open rooms with the keyboard: `Q` quests, `T` toolkit, `P` profile, `C` contact, `H` home.
- Press `Esc` (or click outside a popup) to close it.

## Features

- Branching dialogue tree — each statement is a single short line, one press at a time.
- Rooms: **Quests**, **Toolkit**, **Profile**, **Contact** and **Achievements**.
- Secret **Archive Notes** hidden in the story; find them to earn XP.
- **Achievements** unlock after enough presses.
- Sound on/off toggle with retro bleeps and ambient loop.
- Progress is saved locally in the browser (`localStorage`).

## Contact

- Email: raiyang3@gmail.com
- WhatsApp: +8801988667788

## Structure

```
index.html   — app shell and start screen
styles.css   — monochrome pixel UI
script.js    — dialogue data, state, rooms and audio
assets/      — favicon
```

## Design notes

The archive keeps the mystery subtle and the professional information concrete. Dialogue stays short and readable; every reveal earns its place.
