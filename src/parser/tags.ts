import type { Maybe, Stale, Tag } from './types';

const TAG_RE = /^<(empty|not_collected|restricted|unsupported|error)(?::\s*([\s\S]*))?>$/;

/** Parse a whole value that is an addon tag like `<empty: reason>`; null if it isn't one. */
export function parseTag(value: string): Tag | null {
  const m = value.trim().match(TAG_RE);
  if (!m) return null;
  const kind = m[1];
  const reason = (m[2] ?? '').trim() || kind;
  if (kind === 'empty') return { tag: 'empty', reason };
  if (kind === 'not_collected') return { tag: 'unknown', reason };
  return { tag: 'restricted', reason: kind === 'restricted' ? reason : `${kind}: ${reason}` };
}

export function isTag(v: unknown): v is Tag {
  return typeof v === 'object' && v !== null && 'tag' in v && 'reason' in v;
}

export function valueOf<T>(v: Maybe<T>): T | null {
  return isTag(v) ? null : v;
}

const STALE_RE = /\[stale snapshot captured ([^,\]]+)/;

export function parseStale(value: string): Stale | null {
  const m = value.match(STALE_RE);
  return m ? { stale: true, capturedAt: m[1].trim() } : null;
}
