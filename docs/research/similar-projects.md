# Similar projects and data sources (researched 9 Nov 2026)

What already exists for WoW Forever, what to borrow, and licence notes. This app is personal-use only, which makes licensing easy, but keep the notes so it stays clean if that ever changes.

## Closest to this idea

| Project | What it is | Borrow | Licence |
|---|---|---|---|
| **IndirectTek/classicwowforever** (classicwowforever.dev) | Web session planner: "I have N minutes tonight — what should this character do?" Next.js + Supabase + Claude API, game data as reviewed JSON per zone in `data/zones/`, validated in CI, players can report bad quest data | The **session-planner idea** (time-boxed plans), **JSON-per-zone data validated in CI**, a "report a wrong fact" flow, a `CLAUDE.md` in the repo | App AGPL-3.0; data CC BY-SA 4.0 |
| **fitzforge/polestar** | Biggest Forever guide addon: 158 guides, 1–60 routes found by simulating millions of routes, profession 1–300 guides, dungeon quest journal, upgrade arrows, optional Recorder | **Route rules**: solo quests only, elite quests optional, don't chase 1–2 quests across a flight; grind camps where short; profession guides send you to your own faction's trainer. Their quest facts come from QuestieDB's Forever store | GPL-3.0 + exception for guide packs |
| **brouznouf/factoruide** | Personalised levelling guides for Forever/Classic/TBC: models character power (gear + spells), checkpoints from 20, skips grey quests, drops quests gone grey | **Grey-quest pruning**, **checkpoints** ("ahead of plan → skip to next"), never invent mob sources for tokens/crafted items, leave out Forever quests with unknown objectives rather than guessing | see repo |
| **DismasAU/ForeverPath** | Goal planner addon: craft goals → recipe tree → shopping list; quest, rep, equipment goals; recipe catalogue extracted from the Forever client; classic data from CMaNGOS classic-db as lowest-priority fallback; "(classic data)" label | **Layered data priority** (in-game observed > Forever data > classic data, labelled), **reach-skill goals** for professions (which recipes, how many, materials vs what you own incl. bank) | GPL-3.0 |
| **lazarus-ruin/RuinousForeverPlanner** | Guild planner addon: "Now" view of next actions, gear scan, professions vs dungeon vs grinding decisions | The **"Now" screen** concept | see repo |

## Character data in

| Project | Notes |
|---|---|
| **ForeverCharacterExport 0.3.0** (Chris's addon) | Plain-text export with honest tags (`<empty>`, `<not_collected>`, `[stale …]`). The app's input. No public repo found |
| CharacterExport (CurseForge) | Same idea, Classic/Forever/Retail, built for AI analysis |
| zwinout/CharExporter | Retail; CSV/JSON; auto-save to SavedVariables on logout — a route to automatic import later |
| Geraldlol/witchcraft | Claude Code inside WoW Forever with a WoW MCP server for character context, quests and Lua errors. Interesting future idea, not needed now |

## Game data sources

| Source | Content | Caveat |
|---|---|---|
| **Napalmsteak/WoW-Classic-Item-Caches** — `Forever Cache.json` | 9,667 Forever items with Wowhead tooltips, icons, sources, and `changeFromClassic` (new/updated/unchanged) | Beta snapshot; no levelling gear or recipe lists for Forever yet. **Never look up Forever items by ID in Classic data** — Forever reuses IDs with different stats. Data © Blizzard, via Wowhead |
| QuestieDB (Forever store) | Quest givers, turn-ins, objectives, positions — what Polestar uses | Read licence before copying; personal use fine |
| CMaNGOS classic-db | ~4,100 Classic quests with givers/turn-ins/drops | GPL-3.0; **classic-only** — mark as such |
| Wowhead Forever (`wowhead.com/forever/…`) | Quest/item pages | Don't scrape at scale; link to pages instead |
| 60.tools, metabot.gg, timesaver.gg | Profession routes built from Forever client recipe data | Disagree with each other in places (see professions.md) |
| BLINDEDAI/wow-forever-planner | Priest talent planner; credits ForeverDB and talentsforever.com (CC BY 4.0) | Shows `npm run sync:*` pattern for refreshing beta data |

## Small reference apps worth a look

- andreasostling/forever-camp-planner — static single-page camp-buff planner (no build step). Good example of a tiny Forever tool.
- seheart/wow-forever — Flask planner with a news feed filtered to Forever (notes Blizzard has no working RSS; Wowhead's Forever feed carries blue posts).

## What to take into this project

1. **Fact provenance** on every record (sources, confidence, checked date) — matches Chris's own rule and what Factoruide/ForeverPath do with labels.
2. **Layered data**: in-game-verified > Forever-sourced > classic-only fallback, always labelled.
3. **"Now" / session view**: given the latest export and time available, show the next 3–5 actions.
4. **Grey-quest pruning and checkpoints** for the quest list.
5. **Profession goal**: "get BS to 225" → recipes, counts, materials needed minus what's in bags + bank.
6. **Report-a-fact**: one tap to mark a fact wrong and note what the game showed.
7. Keep it small. Polestar and ForeverPath are huge in-game addons; this is a companion on the phone, not a replacement for Questie.
