import sharp from 'sharp';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

const OG_DIR = join(import.meta.dirname, '..', 'public', 'og-images');
const WIDTH = 1200;
const HEIGHT = 630;

const files = await readdir(OG_DIR);
const svgs = files.filter((f) => f.endsWith('.svg'));

console.log(`Found ${svgs.length} SVG files to convert\n`);

let converted = 0;
let failed = 0;

for (const svg of svgs) {
  const input = join(OG_DIR, svg);
  const output = join(OG_DIR, svg.replace('.svg', '.png'));
  try {
    await sharp(input, { density: 150 })
      .resize(WIDTH, HEIGHT, { fit: 'cover' })
      .png({ quality: 90 })
      .toFile(output);
    converted++;
    console.log(`  OK  ${svg} -> ${svg.replace('.svg', '.png')}`);
  } catch (err) {
    failed++;
    console.error(`  FAIL  ${svg}: ${err.message}`);
  }
}

console.log(`\nDone: ${converted} converted, ${failed} failed`);
if (failed > 0) process.exit(1);
