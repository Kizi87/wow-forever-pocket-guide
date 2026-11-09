# CLAUDE.md — WoW Forever Pocket Guide

Standing instructions for Claude Code in this repository. Read this first, every session.

## What this project is

A personal, phone-friendly web app that acts as a pocket guide for **World of Warcraft: Forever** (Blizzard's "Classic+" game, launched 4 Nov 2026, client 1.60.1, interface 16001).

First target: get one character — **Kiz, Undead Retribution Paladin, Horde, realm "CAMWOW EU4 Realm 7 PvE"** — to level 60 as smoothly as possible.

The owner is Chris (UK, Europe/London time). Single user. Not published, not shared. Hosted wherever is free and simple (GitHub Pages is fine).

## Where the context lives

Read these before writing code. They are the memory of a long planning conversation.

| File | What it holds |
|---|---|
| `docs/context/player-and-character.md` | Who Kiz is right now: level, gear, talents, professions, bank, flight paths, open problems |
| `docs/context/conversation-log.md` | What was asked, answered, decided and corrected, in order |
| `docs/knowledge/forever-facts.md` | Game facts gathered so far, each with sources and a confidence level |
| `docs/knowledge/quest-status.md` | Kiz's quest log as of the last export, with what to do about each quest |
| `docs/knowledge/professions.md` | Blacksmithing + Mining plan |
| `docs/research/similar-projects.md` | Existing Forever tools and datasets, what to borrow, licences |
| `docs/spec/product-brief.md` | What to build, MVP scope, milestones |
| `docs/spec/export-format.md` | How to parse the ForeverCharacterExport text the app takes as input |
| `samples/exports/*.txt` | Two real exports (level 27 and level 30). Use them as parser fixtures |

## Rules that matter more than the code

1. **Forever is not Classic.** Many quests, items, talents, dungeon ranges and profession skill-up points changed. Never assume a Classic Era fact holds. When only Classic data exists, label it `classic-only` in the data and in the UI.
2. **No single-source facts presented as certain.** Chris explicitly wants claims cross-checked across several sources, contradictions resolved, and anything unverifiable shown as unverified. Every game fact stored in the app's data carries `sources[]`, `confidence` (`confirmed` | `multi-source` | `single-source` | `conflicting` | `classic-only` | `in-game-verified`) and `checkedOn`.
3. **Never invent.** No made-up coordinates, drop rates, NPC names or quest givers. A gap is shown as a gap ("unknown — check Questie in game").
4. **In-game observation beats websites.** If Chris reports what the game shows, that wins; record it as `in-game-verified`.
5. **Beta-era data is suspect.** Many sites were written during the beta (level cap 20, then 30). Prefer sources dated after launch (4 Nov 2026).
6. **Data and code are separate.** Game knowledge lives in versioned JSON under `data/`, validated by a schema and a test. Code never hard-codes game facts.
7. **The export is the source of truth for the character.** Don't make Chris type what the export already contains.

## Tone (for any text the app shows Chris)

Lead with the answer. Brief. Dry, deadpan humour is welcome as seasoning (Marvin the Paranoid Android meets Murderbot), never at the expense of clarity, and never jokes about late nights or 12-hour shifts. UK English.

## Default technical choices (change only with a reason)

- Vite + React + TypeScript, installable PWA, works offline.
- No backend. State in IndexedDB (fallback localStorage), with an export/import JSON backup button.
- Static hosting (GitHub Pages).
- Vitest for tests. The export parser gets fixture tests against `samples/exports/`.
- Game data: JSON files in `data/` + a JSON Schema + a validation test that runs in CI.
- Mobile-first layout; must be usable one-handed on a phone next to the PC.

## Working style

- Small, reviewable steps. After each milestone, summarise what changed and what to check.
- When unsure what Chris wants, ask one short question rather than guess.
- When a game fact is needed and not in `data/`, research it, cross-check, store it with sources, then use it.
