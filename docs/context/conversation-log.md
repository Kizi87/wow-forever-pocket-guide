# Conversation log (8–9 Nov 2026)

A planning conversation between Chris and Claude (claude.ai chat) that led to this project. Kept so Claude Code knows what was already answered, what was decided, and where earlier answers were wrong.

Legend: **Q** = Chris asked · **A** = answer given · **D** = Chris's decision · **⚠ Correction** = an earlier answer that turned out wrong.

---

## 8 Nov

**Twitch drop.** Q: how to see progress on the "Twitch camp boost". A: it's the *Pouch of Violet Dust* drop (WoW Forever launch celebration): 4 hours of Drops-enabled World of Warcraft streams, campaign ran 4–12 Nov (ends 12 Nov 4:30pm PST = 00:30 13 Nov UK). Progress shows in Twitch → Drops & Rewards. Toy turns campfire purple and extends camp buffs from 1h to 2h for everyone at the camp; removed from collections at end of launch celebration (early December). Chris was at 44% and finished it.

**Graveyards.** Q: why not respawn at nearest spirit healer? A: zones are split into invisible areas, each linked to one graveyard, some faction-locked. Not confirmed whether Forever changed any links.

**Purified Kor Gem.** Q: what is it? A (Classic-based): Alliance paladin chain via Thundris Windweaver in Auberdine; Corrupted Kor Gem drops from Blackfathom naga (Tide Priestesses / Oracles outside, Sea Witches inside); quest must be in log for drop.
- ⚠ **Correction:** Kiz is Horde. In Forever the Horde has its own version — *Seeking the Kor Gem* (quest 95042) — part of the new Undead paladin Wolfsbane chain. The Auberdine detail applies to Alliance. Kiz got the gem in BFD.

**Dungeon journal icon.** Q: does the "In Dungeon" marker mean the quest starts inside? A: for *Baron Aquanis*, yes — it starts from the Strange Water Globe dropped by Baron Aquanis (summoned by clicking the Fathom Core tablet for *Amongst the Ruins*). The general meaning of the icon was inferred, not documented.

**Martyr's Chain.** Q: "Dying inflicts 420 Holy damage" — me or mobs? A: when **you** die. Chris later clarified it's a BFD drop he wanted; it didn't drop.

**Gear sites.** Q: website for all items / gear score? A: no Forever Armory found. Addons instead: GearScore Forever, ForeverHub, Malitor's Armory. Then Q: a way to share everything without 20 screenshots → **ForeverCharacterExport** text export. This is now the app's input format.

**BFD prep (level 27, Ret).** Character review + rotation + dungeon walkthrough given. Key points:
- Rotation: Seal of the Crusader → Judgement → Seal of Command; Holy Strike + Judgement on cooldown (Sacred Arbiter keeps Judgement effects refreshed); Hammer of Justice then Judgement for double Judgement of Command damage; Consecration on 3+ packs after tank has threat; Exorcism on undead/demons; Righteous Fury off as DPS.
- Prep: buy water (none in bags), fill empty slots, consider camp buffs.
- Outside: Corrupted Kor Gem, Damp Note (starts *Allegiance to the Old Gods*; known bug where not everyone can loot it), Sapphires of Aku'Mai.
- Inside order + Fathom Core/Baron Aquanis, Kelris Sleep (Will of the Forsaken breaks it), braziers one at a time, Aku'mai Poison Cloud now 527 Nature per tick.
- Noted *A Moon-Kissed Blade* lumber comes from the **Deadmines**, not BFD.

**After BFD (level 28).** Kor Gem dropped. Q: is the DM lumber soloable? A: very likely — Goblin Woodcarvers are level 18–19 elites in the Mast Room near Sneed; Axe Throw 3s stun; must kill Rhahk'Zor to pass; patrols respawn behind as doors open (Classic behaviour). Drop rate in Forever unknown.

**Is Wolfsbane worth it?** A at the time (axe ~21 DPS): yes, Wolfsbane reported at 25.59 DPS, +9 Sta, +10 Int, Holy proc tripled vs wolves/worgen. Swing speed unknown.
- **D:** Chris doesn't want to go back to Silverpine for low quests; grey Silverpine quests → abandon.
- ⚠ **Superseded on 9 Nov:** the Viscous Hammer (~33–34 weapon DPS) beats Wolfsbane's reported 25.59, so the chain is now XP-only.

**Next dungeon.** A: City of Dalaran (new in Forever, 28–33 per Blizzard) then Razorfen Kraul (29–38 in the in-game group finder) and Scarlet Monastery Graveyard (30–38). Skip Excavation Site (24–29, Alliance territory) and Gnomeregan.

**How to get to Dalaran.** A: Horde need the Dalaran Sewer Key via a Tarren Mill chain from Magus Wordeen Voidglare; only one group member needs the key; entrance is a sewer pipe on Dalaran's north-west wall onto Lordamere Lake; don't enter city streets (max-level guards attack Horde).
- **D:** Chris: "28 might be a bit soon… get the key first… maybe get to 30. Start in Hillsbrad."
- ⚠ **Correction:** *Key to the City* **requires level 30** (all databases agree). Claude had sent him to pick it up at 28.

**Dalaran too far?** A: two levels; meanwhile Razorfen Kraul, SM Graveyard or another BFD.

**Miner Hackett** (Dangerous!): Azurelode Mine, south of Hillsbrad Fields, entrance ~30,56, Hackett ~31,59 deep inside; Foreman Bonds ~31,56.

**Revenge of Gann:** items drop from the **Riflemen, Soldiers and Officers inside Bael'dun Keep** (Bael Modan, southern Barrens), not the dig-site excavators. Turn in to Gann Stonespire.

## 9 Nov

**RFK vs Dalaran difficulty.** A: one site rates RFK 5/10, Dalaran 6/10; nothing contradicts it. RFK: interrupt/CC Death Speaker Jargba's adds (he Mind Controls), Agathelos enrages, kill totems first; known bug — cauldron near Roogug can trap players. Dalaran: Shade of the Archmage can reset and vanish if pulled out of his room.

**Level-30 export review.** Flags:
1. Two-Handed Maces skill 89/150 → expect misses until trained up on easy mobs.
2. Wolfsbane now a downgrade → *A Moon-Kissed Blade* only worth it for XP.
3. Blacksmithing stuck at 133/150 → train Expert.
Also: turn-ins ready (Elixir of Agony in Undercity, Regthar Deathgate in Desolace, "…and that note you found" in Barrens); Key to the City now in log; 2 Heavy Armor Kits unused; neck/trinkets/relic empty; low gold; Frostmaw (37) and To Steal From Thieves (36) too high; consider Retribution Aura instead of Devotion when solo.

**This project.** Chris asked for a Claude Code handoff: prompt + repository of gathered info, to build a pocket guide for WoW Forever, Paladin first, levelling to 60 smoothly, a place to track quests, profession advice (BS + Mining), and research of similar projects.
- **D (answers to setup questions):** phone-friendly web app · paste the export to update the character · just for Chris · no repo yet, give files.
