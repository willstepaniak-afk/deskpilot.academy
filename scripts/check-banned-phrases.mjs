#!/usr/bin/env node
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const SCAN_DIRS = ['app', 'components', 'lib'];
const ALLOWED_EXT = new Set(['.ts', '.tsx', '.mdx', '.md', '.css']);

// Files that legitimately reference banned phrases as data (e.g. the source
// list itself). Paths are relative to ROOT.
const SKIP_FILES = new Set([path.join('lib', 'site.ts')]);

const BANNED = [
  'transform',
  'revolutionary',
  'game-changing',
  'next-level',
  'unlock your potential',
];

// A phrase only counts as marketing copy when it stands alone as a word in
// prose. If the phrase is glued to other word characters or hyphens, it's
// part of an identifier (CSS class, variable name, method) — skip it.
function isProseMatch(line, phrase, idx) {
  const before = idx > 0 ? line[idx - 1] : '';
  const after = idx + phrase.length < line.length ? line[idx + phrase.length] : '';
  const isWordOrHyphen = (ch) => /[A-Za-z0-9_-]/.test(ch);
  return !isWordOrHyphen(before) && !isWordOrHyphen(after);
}

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === 'legacy') continue;
      yield* walk(p);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (ALLOWED_EXT.has(ext)) yield p;
    }
  }
}

async function main() {
  const failures = [];
  for (const dir of SCAN_DIRS) {
    const full = path.join(ROOT, dir);
    try {
      await stat(full);
    } catch {
      continue;
    }
    for await (const file of walk(full)) {
      const rel = path.relative(ROOT, file);
      if (SKIP_FILES.has(rel)) continue;
      const text = await readFile(file, 'utf8');
      const lines = text.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lower = line.toLowerCase();
        for (const phrase of BANNED) {
          let from = 0;
          while (true) {
            const idx = lower.indexOf(phrase, from);
            if (idx === -1) break;
            if (isProseMatch(line, phrase, idx)) {
              failures.push({ file: rel, line: i + 1, phrase, text: line.trim() });
              break;
            }
            from = idx + phrase.length;
          }
        }
      }
    }
  }
  if (failures.length > 0) {
    console.error('\nBanned marketing phrases found:');
    for (const f of failures) {
      console.error(`  ${f.file}:${f.line}  "${f.phrase}"`);
      console.error(`    > ${f.text}`);
    }
    console.error('\nReplace these with concrete, operator-voiced copy. See lib/site.ts BANNED_PHRASES.\n');
    process.exit(1);
  }
  console.log('check-banned-phrases: ok');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
