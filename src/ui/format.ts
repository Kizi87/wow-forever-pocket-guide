export function money(copper: number | null): string {
  if (copper == null) return 'unknown';
  const sign = copper < 0 ? '−' : '';
  const c = Math.abs(copper);
  const g = Math.floor(c / 10000);
  const s = Math.floor((c % 10000) / 100);
  const cc = c % 100;
  return sign + [g ? `${g}g` : '', g || s ? `${s}s` : '', `${cc}c`].filter(Boolean).join(' ');
}

export function duration(sec: number | null): string {
  if (sec == null) return 'unknown';
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return [d ? `${d}d` : '', d || h ? `${h}h` : '', `${m}m`].filter(Boolean).join(' ');
}

export function pct(n: number, d: number): number {
  return d > 0 ? Math.max(0, Math.min(100, (n / d) * 100)) : 0;
}

/** Item quality number → CSS class (colours follow the in-game convention). */
export function qualityClass(q: number | null): string {
  return ['q-poor', 'q-common', 'q-uncommon', 'q-rare', 'q-epic', 'q-legendary'][q ?? 1] ?? 'q-common';
}
