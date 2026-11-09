import type { ReactNode } from 'react';
import type { Tag } from '../parser/types';
import { pct } from './format';

const TAG_LABEL: Record<Tag['tag'], string> = {
  empty: 'Empty',
  unknown: 'Not collected (not proof of none)',
  restricted: 'Restricted by the game',
};

/** Shows an export tag honestly, instead of pretending the value is zero. */
export function TagNote({ tag }: { tag: Tag }) {
  return (
    <span className={`tag tag-${tag.tag}`} title={tag.reason}>
      {TAG_LABEL[tag.tag]}
      <span className="tag-reason">: {tag.reason}</span>
    </span>
  );
}

export function StaleNote({ capturedAt }: { capturedAt: string }) {
  return <p className="stale">Saved earlier ({capturedAt}), not a live read.</p>;
}

export function Bar({ value, max, warn }: { value: number; max: number; warn?: boolean }) {
  return (
    <div className={`bar${warn ? ' bar-warn' : ''}`} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
      <div className="bar-fill" style={{ width: `${pct(value, max)}%` }} />
    </div>
  );
}

export function Card({ title, children, open = true, badge }: { title: string; children: ReactNode; open?: boolean; badge?: ReactNode }) {
  return (
    <details className="card" open={open}>
      <summary>
        <span>{title}</span>
        {badge}
      </summary>
      <div className="card-body">{children}</div>
    </details>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="empty">{children}</p>;
}
