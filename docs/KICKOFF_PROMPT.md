# Kickoff prompt for Claude Code

Paste everything inside the box as your first message in Claude Code, from the root of this repository.

---

```
You're picking up a project that was planned in a long chat. Everything you need is in this repo.

1. Read CLAUDE.md, then every file under docs/ (context, knowledge, research, spec), then skim both files in samples/exports/.
2. Reply with:
   - a 5-line summary of the project and of Kiz's current state, so I know you've caught up
   - anything in the docs that looks contradictory or that you'd want me to confirm before building
   - your build plan for milestones M1–M3 from docs/spec/product-brief.md, with the file/folder layout you'll use
3. Wait for my OK, then build M1 only:
   - Vite + React + TypeScript PWA scaffold, mobile-first, dark mode
   - ForeverCharacterExport parser per docs/spec/export-format.md, with Vitest fixture tests against both sample exports, including a 27 → 30 diff test
   - paste-to-import screen, character page, snapshot history and diff, JSON backup/restore
   - data/ folder with a JSON Schema requiring sources + confidence + checkedOn on every game fact, and a test that validates it; seed data/class/paladin.json and data/dungeons/*.json from docs/knowledge/forever-facts.md
   - GitHub Actions: test + build, and deploy to GitHub Pages
4. After M1, tell me how to run it locally and how to open it on my phone, then stop and wait.

Ground rules (from CLAUDE.md, repeated because they matter): WoW Forever is not Classic; never present single-source game facts as certain; never invent coordinates, drop rates or NPCs — show gaps as gaps; what I report from the game beats any website. Keep explanations short and lead with the answer.
```

---

## Follow-up prompts you'll probably want later

- **New export:** "Here's my latest export: <paste>. Update docs/context/player-and-character.md and docs/knowledge/quest-status.md, then tell me what changed and the top 5 things to do next."
- **New game fact:** "In game, <what I saw>. Record it as in-game-verified in data/ and fix anything that disagreed."
- **Research a quest/dungeon:** "Research <quest or dungeon> for WoW Forever. Cross-check at least 3 sources dated after 4 Nov 2026, store it in data/ with sources and confidence, and flag conflicts."
- **Next milestone:** "Start M2 from the product brief. Plan first, then wait for my OK."
