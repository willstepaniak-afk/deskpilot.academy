#!/usr/bin/env node
// Generates DeskPilot Academy favicons from an SVG monogram.
// Run after `npm install`: node scripts/generate-favicons.mjs
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public');

// Brand-color "DP" monogram, no decoration. Used by the manifest and as
// the source for raster favicons at the standard sizes.
const MONOGRAM_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="DeskPilot Academy">
  <rect width="512" height="512" rx="96" fill="#0a0e1f"/>
  <rect x="56" y="56" width="400" height="400" rx="72" fill="#3b82f6"/>
  <g fill="#0a0e1f" font-family="ui-sans-serif, system-ui, sans-serif" font-weight="800" font-size="220" letter-spacing="-10">
    <text x="256" y="334" text-anchor="middle">DP</text>
  </g>
</svg>
`;

const sizes = [
  { name: 'favicon-16.png', size: 16 },
  { name: 'favicon-32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
];

async function buildIco(pngBuffers) {
  // ICONDIR (6 bytes) + ICONDIRENTRY * count (16 bytes each) + PNG data
  const count = pngBuffers.length;
  const header = Buffer.alloc(6 + 16 * count);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = icon
  header.writeUInt16LE(count, 4);

  let offset = 6 + 16 * count;
  pngBuffers.forEach((buf, i) => {
    const entryOffset = 6 + 16 * i;
    const size = buf.size === 256 ? 0 : buf.size; // 256 is encoded as 0
    header.writeUInt8(size, entryOffset); // width
    header.writeUInt8(size, entryOffset + 1); // height
    header.writeUInt8(0, entryOffset + 2); // color count (0 for PNG)
    header.writeUInt8(0, entryOffset + 3); // reserved
    header.writeUInt16LE(1, entryOffset + 4); // color planes
    header.writeUInt16LE(32, entryOffset + 6); // bits per pixel
    header.writeUInt32LE(buf.data.length, entryOffset + 8); // size in bytes
    header.writeUInt32LE(offset, entryOffset + 12); // offset
    offset += buf.data.length;
  });

  return Buffer.concat([header, ...pngBuffers.map((b) => b.data)]);
}

async function main() {
  await mkdir(PUBLIC_DIR, { recursive: true });

  // 1) Write the SVG itself for the manifest.
  await writeFile(path.join(PUBLIC_DIR, 'icon.svg'), MONOGRAM_SVG, 'utf8');

  // 2) Raster favicons at each requested size.
  const svgBuffer = Buffer.from(MONOGRAM_SVG, 'utf8');
  const pngEntries = [];
  for (const { name, size } of sizes) {
    const png = await sharp(svgBuffer).resize(size, size).png().toBuffer();
    await writeFile(path.join(PUBLIC_DIR, name), png);
    pngEntries.push({ size, data: png });
    console.log(`  wrote public/${name} (${size}x${size})`);
  }

  // 3) favicon.ico — multi-image ICO bundling 16, 32, and 48 px PNGs.
  const icoSizes = [16, 32, 48];
  const icoBuffers = [];
  for (const size of icoSizes) {
    const png = await sharp(svgBuffer).resize(size, size).png().toBuffer();
    icoBuffers.push({ size, data: png });
  }
  const ico = await buildIco(icoBuffers);
  await writeFile(path.join(PUBLIC_DIR, 'favicon.ico'), ico);
  console.log(`  wrote public/favicon.ico (multi-res 16/32/48)`);

  // 4) og-fallback.png — branded 1200x630 with monogram + wordmark.
  const ogSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0a0e1f"/>
  <g transform="translate(80, 80)">
    <rect width="84" height="84" rx="14" fill="#3b82f6"/>
    <text x="42" y="60" text-anchor="middle" font-family="ui-sans-serif, system-ui" font-weight="800" font-size="48" fill="#0a0e1f" letter-spacing="-2">DP</text>
  </g>
  <text x="200" y="140" font-family="ui-sans-serif, system-ui" font-weight="600" font-size="32" fill="#f8fafc">DeskPilot <tspan fill="#94a3b8" font-weight="400">Academy</tspan></text>
  <text x="80" y="380" font-family="ui-sans-serif, system-ui" font-weight="700" font-size="64" fill="#f8fafc">Operator-level automotive</text>
  <text x="80" y="455" font-family="ui-sans-serif, system-ui" font-weight="700" font-size="64" fill="#f8fafc">sales training</text>
  <text x="80" y="520" font-family="ui-sans-serif, system-ui" font-weight="400" font-size="26" fill="#94a3b8">Not theory — the actual desk process.</text>
  <line x1="80" y1="565" x2="1120" y2="565" stroke="#1e293b" stroke-width="1"/>
  <text x="80" y="600" font-family="ui-sans-serif, system-ui" font-size="20" fill="#94a3b8">deskpilot.academy</text>
  <text x="1120" y="600" text-anchor="end" font-family="ui-sans-serif, system-ui" font-weight="600" font-size="20" fill="#ef5536">Founders pricing — limited</text>
</svg>`;
  const ogPng = await sharp(Buffer.from(ogSvg, 'utf8')).png().toBuffer();
  await writeFile(path.join(PUBLIC_DIR, 'og-fallback.png'), ogPng);
  console.log(`  wrote public/og-fallback.png (1200x630)`);

  console.log('Favicons generated.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
