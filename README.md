# WoW Forever Pocket Guide

A personal, phone-friendly guide for World of Warcraft: Forever. First job: get **Kiz** (Undead Retribution Paladin, Horde) from level 30 to 60 smoothly — quests, dungeons, gear and Blacksmithing/Mining — using the ForeverCharacterExport addon's text export as input.

This repo is a **starter pack** for Claude Code: no app code yet, just the context and specs it needs to build it.

## What's in here

```
CLAUDE.md                          standing rules for Claude Code (read every session)
docs/KICKOFF_PROMPT.md             paste this into Claude Code first
docs/context/
  player-and-character.md          Kiz at level 30: gear, talents, professions, bank, problems
  conversation-log.md              what was asked, decided and corrected (8–9 Nov 2026)
docs/knowledge/
  forever-facts.md                 Forever facts with sources + confidence (paladin, dungeons, Dalaran key, Wolfsbane, professions)
  quest-status.md                  current quest log, grouped, with advice
  professions.md                   Blacksmithing + Mining plan and source conflicts
docs/research/
  similar-projects.md              existing Forever tools/datasets, what to borrow, licences
docs/spec/
  product-brief.md                 what to build: MVP milestones, data model, quality bar
  export-format.md                 how to parse the export
samples/exports/                   two real exports (level 27 and 30) — parser test fixtures
```

## Getting started

1. Create a new **private** GitHub repository (e.g. `wow-forever-pocket-guide`).
2. Upload the contents of this folder to it (GitHub's "Add file → Upload files" works; drag the whole folder in).
3. Open the repo in Claude Code (web with GitHub connected, or the desktop/terminal app in a local clone).
4. Paste the prompt from `docs/KICKOFF_PROMPT.md`.
5. Approve its plan, let it build milestone 1, then try pasting a fresh export.

When the game changes or you learn something new, tell Claude Code and ask it to update `docs/` and `data/` — that keeps the next session caught up.

## Honesty note

The facts in `docs/knowledge/` were gathered from websites in the first week after launch. Several are single-source or conflicting and are labelled as such. The game itself is the final word.

World of Warcraft is a trademark of Blizzard Entertainment. Personal fan project, not affiliated with Blizzard.
