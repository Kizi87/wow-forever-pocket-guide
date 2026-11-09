import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import { describe, expect, it } from 'vitest';

const DATA = resolve(__dirname, '../data');
const SCHEMAS = join(DATA, 'schema');

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
for (const f of readdirSync(SCHEMAS)) ajv.addSchema(JSON.parse(readFileSync(join(SCHEMAS, f), 'utf8')), f);

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? (p === SCHEMAS ? [] : walk(p)) : p.endsWith('.json') ? [p] : [];
  });
}

const files = walk(DATA);

/** Every object that carries a `claim`, a level range, a rotation or a macro is a game fact and must have provenance. */
function factsMissingMeta(node: unknown, path: string, out: string[]) {
  if (Array.isArray(node)) node.forEach((n, i) => factsMissingMeta(n, `${path}[${i}]`, out));
  else if (node && typeof node === 'object') {
    const o = node as Record<string, unknown>;
    const isFact = 'claim' in o || ('min' in o && 'max' in o) || 'steps' in o || 'body' in o;
    if (isFact && !(Array.isArray(o.sources) && o.sources.length > 0 && typeof o.confidence === 'string' && typeof o.checkedOn === 'string')) out.push(path);
    for (const [k, v] of Object.entries(o)) if (k !== 'sources' && k !== 'conflicts') factsMissingMeta(v, `${path}.${k}`, out);
  }
}

describe('data/', () => {
  it('has the seeded files', () => {
    const rel = files.map((f) => relative(DATA, f).replace(/\\/g, '/'));
    expect(rel).toContain('class/paladin.json');
    expect(rel.filter((f) => f.startsWith('dungeons/')).length).toBeGreaterThanOrEqual(8);
  });

  it.each(files.map((f) => [relative(DATA, f).replace(/\\/g, '/'), f]))('%s matches its schema', (_, file) => {
    const json = JSON.parse(readFileSync(file, 'utf8'));
    expect(typeof json.$schema, 'every data file names its schema in "$schema"').toBe('string');
    const schemaName = json.$schema.split('/').pop();
    const validate = ajv.getSchema(schemaName);
    expect(validate, `unknown schema ${schemaName}`).toBeTruthy();
    const ok = validate!(json);
    expect(ok, ajv.errorsText(validate!.errors, { separator: '\n' })).toBe(true);
  });

  it.each(files.map((f) => [relative(DATA, f).replace(/\\/g, '/'), f]))('%s: every fact has sources, confidence and checkedOn', (_, file) => {
    const missing: string[] = [];
    factsMissingMeta(JSON.parse(readFileSync(file, 'utf8')), '$', missing);
    expect(missing).toEqual([]);
  });

  it('the schema rejects a fact without provenance', () => {
    const validate = ajv.getSchema('class.schema.json')!;
    expect(validate({ id: 'x', class: 'X', facts: [{ id: 'a', claim: 'Something' }] })).toBe(false);
    expect(validate({ id: 'x', class: 'X', facts: [{ id: 'a', claim: 'Something', sources: [{ name: 'one site' }], confidence: 'multi-source', checkedOn: '2026-11-09' }] })).toBe(false);
    expect(validate({ id: 'x', class: 'X', facts: [{ id: 'a', claim: 'Something', sources: [{ name: 'a' }], confidence: 'conflicting', checkedOn: '2026-11-09' }] })).toBe(false);
    expect(validate({ id: 'x', class: 'X', facts: [{ id: 'a', claim: 'Something', sources: [{ name: 'a' }], confidence: 'probably', checkedOn: '2026-11-09' }] })).toBe(false);
    expect(validate({ id: 'x', class: 'X', facts: [{ id: 'a', claim: 'Something', sources: [{ name: 'a' }], confidence: 'single-source', checkedOn: '2026-11-09' }] })).toBe(true);
  });
});
