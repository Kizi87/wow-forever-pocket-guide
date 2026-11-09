# WoW Forever facts gathered so far

Checked 8–9 Nov 2026 (launch was 4 Nov 2026). Each fact has a confidence level, using the same scale the app's data must use:

- **multi-source** — two or more independent sites agree
- **single-source** — one site only; treat as likely, not certain
- **conflicting** — sources disagree; both versions listed
- **classic-only** — known for Classic Era, not confirmed for Forever
- **in-game-verified** — Chris saw it in game

Seed `data/` from this file, then keep `data/` as the source of truth.

---

## 1. Paladin changes in Forever

| Fact | Confidence | Sources |
|---|---|---|
| Every paladin learns **Holy Strike at level 6** (instant Holy damage based on weapon damage) | multi-source | mmohuts, classicwowforever.com, conquestcapped, teamoverpowered, wowforeverleveling |
| **Seal of Fury** at level 10: tank seal, flat Holy damage per swing, absorb shield with a shield equipped, Judgement of it taunts (10 yd) | multi-source | mmohuts, wow4ever.quest, conquestcapped, lfcarry |
| **Consecration baseline at level 20**; hits first 4 enemies hard, others very lightly | multi-source | conquestcapped, teamoverpowered, mmonerds |
| **Blessing of Kings baseline** from 20 | multi-source | conquestcapped, wowforeverleveling |
| **Judgement no longer consumes your Seal** | multi-source | classicwow.gg, mmonerds, teamoverpowered, conquestcapped |
| **Sacred Arbiter** (16-point tier): Holy Strike +20% damage and refreshes all Judgement effects on the target (even other paladins') | multi-source | classicwow.gg, classicwowforever.com, mmonerds, teamoverpowered |
| **Seal of Command**: chance to deal 70% weapon damage as Holy; best with slow 2H; Judgement of Command double damage on stunned targets | multi-source | wowforever.be, mobalytics, zockify, wowforeverleveling |
| **Vengeance** requires Seal of Command (since 2 Nov); up to 5 stacks, 30 s | multi-source | mobalytics, wowforeverleveling, lfcarry |
| **Unsealed Wrath** (31-point, after Repentance): melee stores a copy of active Seal up to 3 stacks for 15 s; an attack under a different Seal consumes stacks, each with the stored Seal's normal proc chance | multi-source | zockify, classicwowforever.com, mmojugg |
| Seal twisting no longer baseline (Twist of Light talent brings a controlled version back) | multi-source | mmonerds, mmohuts |
| Ret talent order 10–30 | **conflicting** — guides differ (Deflection-first vs Benediction-first; Sacred Arbiter at 25/26/28). Kiz already has 21 points spent | mobalytics, mmojugg, wowforeverbuilds |

### Retribution rotation (levelling / dungeons)

1. Pre-pull **Seal of the Crusader** → **Judgement** (debuff) → switch to **Seal of Command**, keep it.
2. **Holy Strike + Judgement** on cooldown (one macro: `/cast Judgement` then `/cast Holy Strike`). Holy Strike keeps Judgement effects refreshed via Sacred Arbiter.
3. **Hammer of Justice → Judgement** for double Judgement of Command damage.
4. **Consecration** on 3+ targets (after the tank has threat in groups).
5. **Exorcism** on undead/demons.
6. In groups: Righteous Fury **off**; Blessings: Might on melee, Wisdom on healer/casters, Kings otherwise.
7. Short trash: skip Crusader, go straight to Command.

Confidence: multi-source (mobalytics ×2, wowforever.be, maxroll, zockify, mmonster rotation trainer). One guide (maxroll) also suggests alternating Command/Righteousness by swing timing — minority view.

## 2. Dungeons

| Dungeon | Range | Confidence / notes |
|---|---|---|
| Blackfathom Deeps | 22–28 / 24–32 | **conflicting** ranges across sites. Unchanged layout; loot revamped |
| City of Dalaran (new) | 28–33 | multi-source; Blizzard's announcement says 28–33. Other sites say 28–35 or 28–30 |
| Razorfen Kraul | 29–38 in-game group finder | multi-source; some lists say 24+ / 26–34 |
| Scarlet Monastery Graveyard / Library / Armory / Cathedral | 30–38 / 33–41 / 36–44 / 38–46 | multi-source; entry from level 20 |
| Excavation Site: Wetlands (new) | 24–29 | multi-source; Alliance territory |
| Razorfen Downs | 37–46 | multi-source |
| The Drowned City (new) | 35–40 | multi-source |
| Gnomeregan | 29–38 | multi-source |

General: Forever dungeons have one difficulty. Dungeon quest bonus XP was halved (1 Oct beta change), so more XP comes from kills than old guides suggest. (multi-source)

### Blackfathom Deeps notes (done once; kept for reruns)

- Corrupted Kor Gem: Tide Priestesses/Oracles outside, Sea Witches inside (mmonster). Kiz has the Purified Kor Gem.
- Damp Note from Tide Priestesses starts *Allegiance to the Old Gods* (kill Lorgus Jett); needs *The Essence of Aku'Mai* in log; known bug where not every party member can loot it (mmonster, zockify).
- Argent Guard Thaelrid inside gives Horde *Blackfathom Villainy*, turn in to Bashana Runetotem, Thunder Bluff (multi-source).
- Fathom Core tablet (under walkway to Kelris) completes *Amongst the Ruins* and summons Baron Aquanis → Strange Water Globe (~93–100%) → *Baron Aquanis* quest (multi-source).
- Kelris: Sleep (5 yd) + Mind Blast. Braziers: light one at a time, each spawns a wave (multi-source).
- Aku'mai: Poison Cloud ticks 527 Nature (was 50) — move out; Frenzied Rage +75% attack speed (conquestcapped, expcarry).
- Martyr's Chain (mail chest, +9 Str/+9 Sta, 420 Holy on death) — Chris says it's a BFD drop; source boss not confirmed.

### Razorfen Kraul notes

Death Speaker Jargba: interrupt/CC adds, he Mind Controls, focus him. Agathelos: big enrage. Lots of casters/totems/pets — kill totems. Known bug since launch: cauldron near Roogug can trap you (Nov 5 known-issues list). Difficulty 5/10 (single-source: mmonster). Sources: mobalytics, mmonster.

### City of Dalaran — Horde access

| Fact | Confidence | Sources |
|---|---|---|
| Horde need the **Dalaran Sewer Key**; only one group member needs it | multi-source | Icy Veins, Method, mobalytics, games.gg |
| Chain starts with **Magus Wordeen Voidglare, Tarren Mill (~61.6, 20.8)** | multi-source | warcraft.wiki.gg, wowhead Forever, kovarel, foreverchanges |
| **Key to the City requires level 30** (quest level 33) | multi-source | warcraft.wiki.gg, foreverchanges, kovarel, mmonster |
| Key to the City objective: Grimy Key from the Warden's Footlocker, **Lordamere Internment Camp ~16.4, 89.3 (Alterac Mountains map)** | single-source (mmonster). foreverdb shows the objective area as ~23.1, 26.6 on the **Hillsbrad** map — possibly the same spot in a different map frame. Unconfirmed |
| Chain steps: Key to the City, Prison Break In, Stone Tokens, Dalaran Patrols (6 Dalaran Summoners + 12 Elemental Slaves), Blood in the Streets, then **Heart of Disruption** from the Image of Archmage Modera — key is given on **accepting** it | **conflicting order.** Method: Key to the City (+ optional Prison Break In, Stone Tokens) → Dalaran Patrols (+ optional Bracers of Binding). wowhandbook: Prison Break In → Dalaran Patrols → Blood in the Streets. Agree on Heart of Disruption giving the key on accept |
| Image of Archmage Modera ~68.4, 45.4 (Silverpine map) | single-source (mmonster) |
| Entrance: sewer pipe, NW wall of Dalaran onto Lordamere Lake; ~8.8, 59.6 Alterac map / ~69.3, 45.55 Silverpine map | multi-source on location; coordinates from mobalytics, games.gg, blizzplanet |
| Don't go into the city streets as Horde — max-level guards | multi-source |
| Shade of the Archmage resets/vanishes if dragged from his room | single-source (mmonster) |
| Dungeon quests (Source of Power from Doctor Martin Felben, Undercity; The Grave Knight from Melisara, Hillsbrad; Opportunistic Education from Rexxie Copperclutch inside) available from level 24 | multi-source |
| Completing Heart of Disruption makes Dalaran guards non-hostile to Horde | single-source (Warcraft Tavern) |

## 3. Undead paladin weapon chain — Wolfsbane

| Fact | Confidence | Sources |
|---|---|---|
| Chain: Diplomatic Incident (Danitha Morr, Bandarion Keep) → Trevan Rol steps → *A Moon-Kissed Blade* → *An Underrated Talent* / *Ott's Masterwork* (Ott, Tarren Mill) → *The Moonsilver Blade* → *Old Fire-Eye* (lvl 25 elite worgen, Silverpine) → Wolfsbane | multi-source | wowdee, conquestcapped, chaosboost |
| *A Moon-Kissed Blade* (95036): Undead-only, Horde paladin, level 25 (req 20). Needs Whitestone Oak Lumber (**Deadmines**, Goblin Woodcarvers near Sneed), Enchanted Silver Ingot (**Shadowfang Keep**), Purified Kor Gem (**BFD**). Turn in Trevan Rol, Sepulcher area (~43.3, 41.0 Silverpine) | multi-source | wowhead Forever, metaforge, hyjal.cc, forever-codex, expcarry |
| XP: 2,500 (2.5× normal) per forever-codex; 1,750 base per hyjal.cc | **conflicting** |
| Wolfsbane: 2H sword, **25.59 DPS**, +9 Sta, +10 Int, proc 39–59 Holy, ×3 vs wolves/worgen | single-source (buyboost) |
| Kiz's Viscous Hammer: ~33.6 weapon DPS estimated from the export (155.9–193.0 dmg incl. 372 AP at 2.9 speed → AP adds ~77 per swing → ~79–116 base) | derived, not verified in game |

**Conclusion on record:** Wolfsbane looks like a downgrade now. *A Moon-Kissed Blade* is XP-only; do it only if passing the Deadmines anyway.

## 4. Professions (general)

| Fact | Confidence | Sources |
|---|---|---|
| 12 professions; ranks Apprentice 75 / Journeyman 150 / Expert 225 / Artisan 300 | multi-source | metabot, rankedboost, conquestcapped, lfcarry |
| Train next rank at skill 50 / 125 / 200; character level 10 / 20 / 35 | multi-source for skill; level gates from epiccarry, goldgoblin, 60.tools (Artisan at 35) |
| Mining training cost 10c / 5s / 50s / 5g | single-source (conquestcapped) |
| Every crafting profession gives a **Legacy point at 150, 225, 300** | multi-source (lfcarry, conquestcapped) |
| Blacksmithing skill-up colours changed — **don't follow a Classic guide** | multi-source (60.tools, epiccarry, lfcarry, skycoach) |
| ~194–197 new Blacksmithing plans; 6 BS recipes moved to Leatherworking | multi-source |
| Blacksmithing camp objects: Sharpening Wheel (~20), Anvil (~140), Master Forge (300) | multi-source on the three objects; skill levels single-source (expcarry) |
| Merchant's Favor currency buys new plans from profession faction vendors | multi-source |
| Crafted BoP role sets; Ret line = "Crusader's" (Spell power + Strength) then "Justicar's" | single-source (classicwowforever.com) |
| Mining passive +5% max health | single-source (topbuilds) |
| Some creatures can be mined after death | single-source (zockify) |
| Blacksmithing + Mining is the recommended Paladin levelling pair | multi-source (topbuilds, hardcorehelper, classicwowforever, overgear, expcarry, gametyrant, conquestcapped) |

## 5. Misc

- Forever addon API follows Midnight rules: some values (health, power, stats) are "secret" in combat — exports must be taken out of combat. (multi-source: addon pages)
- Graveyard assignment: by zone sub-area, faction-locked healers (Classic behaviour; Forever not confirmed → classic-only).
- Pouch of Violet Dust (Twitch drop): camp buffs 1h → 2h for everyone at the camp; removed early December. (multi-source)
