import { isTag } from '../../parser/tags';
import type { Snapshot } from '../../parser/types';
import { Bar, Card, Empty, StaleNote, TagNote } from '../components';
import { duration, money, qualityClass } from '../format';

/** Weapon skill this far below cap gets a warning. App threshold, not a game fact. */
const WEAPON_SKILL_WARN_GAP = 20;

export function CharacterScreen({ snap }: { snap: Snapshot | null }) {
  if (!snap) return <Empty>No character yet. Paste an export on the Import tab.</Empty>;
  const c = snap.character;
  const guild = c.guild;
  const filled = snap.equipment.filter((e) => e.item).length;
  const mainHand = snap.equipment.find((e) => e.slotKey === 'MainHandSlot')?.item;
  const weaponSkill = mainHand?.subType ? snap.skills.weapons.find((w) => w.name === mainHand.subType) : undefined;
  const bank = snap.bank;
  const fp = snap.flightPaths;

  return (
    <div className="stack">
      <section className="hero">
        <h1>
          {c.name} <span className="muted">· {c.level}</span>
        </h1>
        <p className="muted">
          {c.race} {c.className} · {c.faction} · {c.realm}
        </p>
        {c.xp && (
          <>
            <Bar value={c.xp.current} max={c.xp.max} />
            <p className="small muted">
              {c.xp.current.toLocaleString('en-GB')} / {c.xp.max.toLocaleString('en-GB')} XP ({((c.xp.current / c.xp.max) * 100).toFixed(1)}%)
              {' · rested '}
              {isTag(c.restedXp) ? 'none' : c.restedXp.toLocaleString('en-GB')}
            </p>
          </>
        )}
        <dl className="facts">
          <dt>Gold</dt>
          <dd>{money(c.moneyCopper)}</dd>
          <dt>Where</dt>
          <dd>{[c.subzone, c.zone].filter(Boolean).join(', ') || 'unknown'}</dd>
          <dt>Hearth</dt>
          <dd>{c.hearth ?? 'unknown'}</dd>
          <dt>Guild</dt>
          <dd>{isTag(guild) ? guild.tag === 'empty' ? 'None' : <TagNote tag={guild} /> : `${guild.name} (${guild.rank})`}</dd>
          <dt>Played</dt>
          <dd>
            {duration(c.playedTotalSec)} <span className="muted">({duration(c.playedLevelSec)} this level)</span>
          </dd>
        </dl>
        <p className="small muted">Export captured {snap.header.capturedLocal ?? 'at an unknown time'} (game client time).</p>
      </section>

      {weaponSkill && weaponSkill.max - weaponSkill.current >= WEAPON_SKILL_WARN_GAP && (
        <div className="alert">
          <strong>
            {weaponSkill.name} {weaponSkill.current}/{weaponSkill.max}
          </strong>{' '}
          — your {mainHand!.name} needs this skill, and it's {weaponSkill.max - weaponSkill.current} below cap. Skill it up on easy mobs.
        </div>
      )}

      <Card title="Gear" badge={<span className="badge">{filled}/{snap.equipment.length}</span>}>
        <ul className="rows">
          {snap.equipment.map((e) => (
            <li key={e.slotKey} className={e.item ? '' : 'row-empty'}>
              <span className="row-label">{e.slot}</span>
              {e.item ? (
                <span className={qualityClass(e.item.quality)}>
                  {e.item.name} <span className="muted small">ilvl {e.item.ilvl ?? '?'}</span>
                </span>
              ) : e.unresolved ? (
                <TagNote tag={e.unresolved} />
              ) : (
                <span className="gap">empty</span>
              )}
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Professions">
        <ul className="rows">
          {[...snap.skills.professions, ...snap.skills.secondary].map((p) => (
            <li key={p.name} className="row-bar">
              <span className="row-label">{p.name}</span>
              <span>
                {p.current}/{p.max}
                {p.current >= p.max && <span className="pill warn">at cap</span>}
              </span>
              <Bar value={p.current} max={p.max} warn={p.current >= p.max} />
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Weapon skills">
        <ul className="rows">
          {snap.skills.weapons
            .filter((w) => w.current > 1)
            .map((w) => {
              const low = w.max - w.current >= WEAPON_SKILL_WARN_GAP;
              return (
                <li key={w.name} className="row-bar">
                  <span className="row-label">
                    {w.name}
                    {w === weaponSkill && <span className="pill">equipped</span>}
                  </span>
                  <span>
                    {w.current}/{w.max}
                  </span>
                  <Bar value={w.current} max={w.max} warn={low} />
                </li>
              );
            })}
        </ul>
      </Card>

      <Card title="Talents" badge={<span className="badge">{snap.talents.spent ?? '?'} spent · {snap.talents.available ?? '?'} free</span>}>
        <ul className="rows">
          {snap.talents.nodes.map((t) => (
            <li key={t.name}>
              <span className="row-label">{t.name}</span>
              <span>
                {t.rank}/{t.maxRank}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Stats" open={false}>
        <dl className="facts">
          {Object.entries(c.stats).map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="cap">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
          <dt>Attack power</dt>
          <dd>{c.attackPower ?? '?'}</dd>
          <dt>Main hand</dt>
          <dd>
            {c.meleeDamage ? `${c.meleeDamage.min.toFixed(0)}–${c.meleeDamage.max.toFixed(0)}` : '?'} @ {c.attackSpeed ?? '?'}s
          </dd>
          <dt>Crit</dt>
          <dd>
            {c.crit.melee ?? '?'}% melee · {c.crit.spell ?? '?'}% spell
          </dd>
          <dt>Avoidance</dt>
          <dd>
            {c.dodge}% dodge · {c.parry}% parry · {c.block}% block
          </dd>
          <dt>Armour</dt>
          <dd>{c.armor ?? '?'}</dd>
          <dt>Health / mana</dt>
          <dd>
            {c.healthMax ?? '?'} / {c.powerMax ?? '?'}
          </dd>
        </dl>
      </Card>

      <Card title="Bags" open={false} badge={<span className="badge">{snap.bags.slotsFree ?? '?'} free</span>}>
        <ItemList items={snap.bags.items} />
      </Card>

      <Card title="Bank" open={false}>
        {isTag(bank) ? (
          <TagNote tag={bank} />
        ) : (
          <>
            {bank.stale && <StaleNote capturedAt={bank.stale.capturedAt} />}
            <ItemList items={bank.items} />
          </>
        )}
      </Card>

      <Card title="Reputation" open={false}>
        <ul className="rows">
          {snap.reputation.map((r) => (
            <li key={r.id}>
              <span className="row-label">{r.faction}</span>
              <span>
                {r.standing}{' '}
                {r.progress != null && (
                  <span className="muted small">
                    {r.progress}/{r.progressMax}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Flight paths" open={false}>
        {isTag(fp) ? (
          <TagNote tag={fp} />
        ) : (
          fp.continents.map((cont) => (
            <div key={cont.name}>
              <h3>{cont.name}</h3>
              {cont.capturedAt && <StaleNote capturedAt={cont.capturedAt} />}
              <ul className="rows">
                {cont.nodes
                  .filter((n) => n.state !== 'unreachable')
                  .map((n) => (
                    <li key={n.id}>
                      <span className="row-label">{n.name}</span>
                      <span className="muted small">
                        {n.zone ?? ''} {n.state === 'current' && <span className="pill">here</span>}
                      </span>
                    </li>
                  ))}
              </ul>
              <p className="small muted">{cont.nodes.filter((n) => n.state === 'unreachable').length} more listed as unreachable.</p>
            </div>
          ))
        )}
      </Card>

      <Card title="Quest log" open={false} badge={<span className="badge">{snap.quests.slotsUsed ?? snap.quests.log.length}/{snap.quests.slotsMax ?? 40}</span>}>
        <p className="small muted">Full tracker arrives in M2. For now, the raw list.</p>
        <ul className="rows">
          {snap.quests.log.map((q) => (
            <li key={q.id}>
              <span className="row-label">
                {q.title} <span className="muted small">[{q.level ?? '?'}]</span>
              </span>
              <span className="small">{q.ready ? <span className="pill ok">ready</span> : <span className="muted">{q.zone}</span>}</span>
            </li>
          ))}
        </ul>
      </Card>

      <p className="small muted">Export from ForeverCharacterExport {snap.header.addonVersion}, WoW {snap.header.gameVersion ?? '?'}.</p>
    </div>
  );
}

function ItemList({ items }: { items: { id: number; name: string; count: number }[] }) {
  if (items.length === 0) return <Empty>Nothing listed.</Empty>;
  return (
    <ul className="rows">
      {items.map((i) => (
        <li key={i.id}>
          <span className="row-label">{i.name}</span>
          <span>×{i.count}</span>
        </li>
      ))}
    </ul>
  );
}
