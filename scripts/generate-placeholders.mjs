#!/usr/bin/env node
// One-shot generator for placeholder binary assets shipped in /public.
// Run with: node scripts/generate-placeholders.mjs
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public');
const PLACEHOLDER_DIR = path.join(PUBLIC_DIR, 'placeholders');

// --- minimal PNG (1x1 dark navy pixel) ---
// Hand-crafted minimal PNG. 67 bytes.
const navy1x1 = Buffer.from(
  [
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, // signature
    0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
    0xde, 0x00, 0x00, 0x00, 0x0c, 0x49, 0x44, 0x41,
    0x54, 0x08, 0xd7, 0x63, 0x60, 0x60, 0x60, 0xf8,
    0xcf, 0x00, 0x00, 0x00, 0x06, 0x00, 0x03, 0x36,
    0x37, 0x7c, 0xa8, 0x00, 0x00, 0x00, 0x00, 0x49,
    0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
  ],
);

// --- minimal PDF (1-page placeholder) ---
function buildPdf(title) {
  const lines = [];
  const offsets = [0];

  function add(s) {
    lines.push(s);
  }

  const stream = `BT
/F1 28 Tf
60 720 Td
(DeskPilot Academy) Tj
0 -40 Td
/F1 18 Tf
(${title} - Placeholder) Tj
0 -30 Td
/F1 12 Tf
(The full version of this resource is being finalized.) Tj
0 -16 Td
(Replace this file before launch via /public/placeholders/.) Tj
ET`;

  add('%PDF-1.4');
  // 1 - Catalog
  offsets.push(measure(lines));
  add('1 0 obj');
  add('<</Type /Catalog /Pages 2 0 R>>');
  add('endobj');
  // 2 - Pages
  offsets.push(measure(lines));
  add('2 0 obj');
  add('<</Type /Pages /Kids [3 0 R] /Count 1>>');
  add('endobj');
  // 3 - Page
  offsets.push(measure(lines));
  add('3 0 obj');
  add('<</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources <</Font <</F1 5 0 R>>>>>>');
  add('endobj');
  // 4 - Content stream
  offsets.push(measure(lines));
  add('4 0 obj');
  add(`<</Length ${stream.length}>>`);
  add('stream');
  add(stream);
  add('endstream');
  add('endobj');
  // 5 - Font
  offsets.push(measure(lines));
  add('5 0 obj');
  add('<</Type /Font /Subtype /Type1 /BaseFont /Helvetica>>');
  add('endobj');

  const xrefStart = measure(lines);
  add('xref');
  add('0 6');
  add('0000000000 65535 f ');
  for (let i = 1; i <= 5; i++) {
    add(`${String(offsets[i]).padStart(10, '0')} 00000 n `);
  }
  add('trailer');
  add('<</Size 6 /Root 1 0 R>>');
  add('startxref');
  add(String(xrefStart));
  add('%%EOF');

  return Buffer.from(lines.join('\n') + '\n', 'binary');
}

function measure(lines) {
  return lines.reduce((sum, l) => sum + Buffer.byteLength(l + '\n', 'binary'), 0);
}

const PDF_RESOURCES = [
  { slug: 'fi-menu-cheatsheet', title: 'F&I Menu Cheatsheet' },
  { slug: 'objection-tree-pack', title: 'Objection Tree Pack' },
  { slug: 'desking-payment-grid', title: 'Desking Payment Grid' },
  { slug: 'compliance-quickref', title: 'Compliance Quick Reference' },
  { slug: 'manager-1-1-template', title: 'Manager 1:1 Template' },
];

async function main() {
  await mkdir(PUBLIC_DIR, { recursive: true });
  await mkdir(PLACEHOLDER_DIR, { recursive: true });

  // PNG icons & OG fallback — all use the 1x1 navy PNG. Browsers scale.
  // Will should swap these before launch.
  await writeFile(path.join(PUBLIC_DIR, 'favicon.ico'), navy1x1);
  await writeFile(path.join(PUBLIC_DIR, 'icon-192.png'), navy1x1);
  await writeFile(path.join(PUBLIC_DIR, 'icon-512.png'), navy1x1);
  await writeFile(path.join(PUBLIC_DIR, 'apple-icon.png'), navy1x1);
  await writeFile(path.join(PUBLIC_DIR, 'og-fallback.png'), navy1x1);

  for (const r of PDF_RESOURCES) {
    const buf = buildPdf(r.title);
    await writeFile(path.join(PLACEHOLDER_DIR, `${r.slug}.pdf`), buf);
  }

  console.log('Placeholder assets generated.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
