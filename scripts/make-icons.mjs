// Generates the PWA PNG icons (shield + cross) with no image dependencies.
// Run: node scripts/make-icons.mjs
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const c = Buffer.alloc(4); c.writeUInt32BE(crc(td));
  return Buffer.concat([len, td, c]);
};

function draw(size) {
  const bg = [0x14, 0x16, 0x1b], gold = [0xe0, 0xb8, 0x4c];
  const rows = [];
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 3);
    for (let x = 0; x < size; x++) {
      const u = (x / size) * 64, v = (y / size) * 64; // 64-unit design space, matches icon.svg
      // shield outline: inside outer shape but not inside inner shape
      const inShield = (pad) => {
        if (v < 10 + pad || v > 55 - pad) return false;
        const half = v < 32 ? 18 - pad : (18 - pad) * Math.sqrt(Math.max(0, 1 - ((v - 32) / (23 - pad)) ** 2));
        return Math.abs(u - 32) <= half;
      };
      const ring = inShield(0) && !inShield(4);
      const cross = (Math.abs(u - 32) <= 2 && v >= 22 && v <= 44) || (Math.abs(v - 30) <= 2 && u >= 24 && u <= 40);
      const c = ring || cross ? gold : bg;
      row.set(c, 1 + x * 3);
    }
    rows.push(row);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(Buffer.concat(rows))),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

for (const s of [192, 512]) writeFileSync(`public/icon-${s}.png`, draw(s));
console.log('icons written');
