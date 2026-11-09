import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const dir = resolve(__dirname, '../samples/exports');
export const L27 = readFileSync(resolve(dir, '2026-11-08_kiz_lvl27.txt'), 'utf8');
export const L30 = readFileSync(resolve(dir, '2026-11-09_kiz_lvl30.txt'), 'utf8');
