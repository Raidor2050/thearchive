# Raiyan Interactive Archive — Implementation Roadmap

## Current direction
A minimal, monochrome GBA/indie-RPG inspired portfolio. The site should feel like a small story the visitor can browse, not like a conventional portfolio template.

## v10 current state
- Solid AMOLED black background.
- Determination Mono / Undertale-style type treatment with fallback fonts.
- Start screen is a single `PRESS ENTER TO BEGIN` action.
- Opening story: `You made it!` → `Thanks for coming.` → `Want to dive deeper into Raiyan's lore?` → YES/NO.
- Dialogue is short, concrete and branching.
- Work chapters reveal MonsterClaw, Truely eSIM and Zager Guitars.
- Operating-model branch explains source → contact → qualify → onboard → activate → measure → improve.
- Profile popup contains detailed Raiyan experience and a glasses-wearing pixel avatar.
- Quests, Toolkit, Contact and Achievements are presented as in-world story panels.
- Clicking outside a popup closes it.
- 12 Enter presses unlock Achievements.
- Hidden archive notes can award Observer XP, but should remain scarce.

## Story rules
1. Never open with a generic résumé statement.
2. Keep mystery subtle. Do not describe visitor device/browser data unless specifically approved.
3. Reach a meaningful choice within a few short dialogue beats.
4. Every work branch should reveal what Raiyan actually did, not vague praise.
5. Avoid motivational clichés, airy claims, and pretentious lore.
6. Humor should be occasional and dry.
7. Popups must feel like rooms in the same story, not webpage modals.
8. Outside-click must dismiss a popup and return to the current scene.

## Architecture
- `index.html`: shell, dialogue, navigation and modal structure.
- `styles.css`: monochrome pixel UI and avatar.
- `script.js`: data-driven scene tree, navigation, save state, audio, popups and achievements.
- `scenes` array in `script.js` is the canonical story graph.
- `quests` and `tools` arrays are the canonical support content.

## Future additions
- Add more optional story branches only when they reveal concrete work or personality.
- Add an archive log that records visited chapters without forcing users to replay them.
- Add a soft “chapter complete” state to visited work branches.
- Keep all media local or procedurally generated unless explicit licensing is documented.
