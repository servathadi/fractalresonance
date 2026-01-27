const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const CONTENT_DIR = path.join(process.cwd(), 'content');

function findAllIndexes(haystack, needle) {
  const out = [];
  if (!needle) return out;
  let idx = 0;
  while (true) {
    const next = haystack.indexOf(needle, idx);
    if (next === -1) break;
    out.push(next);
    idx = next + needle.length;
  }
  return out;
}

function indexToLineCol(text, index) {
  const slice = text.slice(0, index);
  const lines = slice.split('\n');
  const line = lines.length; // 1-based
  const col = lines[lines.length - 1].length + 1; // 1-based
  return { line, col };
}

function snippetAt(text, index, width = 50) {
  const start = Math.max(0, index - width);
  const end = Math.min(text.length, index + width);
  return text
    .slice(start, end)
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}

function csvEscape(value) {
  const s = String(value ?? '');
  if (s.includes('"') || s.includes(',') || s.includes('\n') || s.includes('\r')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

async function main() {
  const args = process.argv.slice(2);
  const outPath = args.find((a) => a.startsWith('--out='))?.slice('--out='.length) || '';

  const files = await glob('**/*.{md,mdx}', { cwd: CONTENT_DIR, absolute: true });
  const issues = [];

  for (const file of files) {
    const rel = path.relative(CONTENT_DIR, file);
    const text = fs.readFileSync(file, 'utf-8');

    // 1) Carriage returns not part of CRLF.
    for (const idx of findAllIndexes(text, '\r')) {
      const next = text[idx + 1] || '';
      if (next === '\n') continue;
      const { line, col } = indexToLineCol(text, idx);
      issues.push({
        type: 'stray_cr',
        file: rel,
        line,
        col,
        context: snippetAt(text, idx),
      });
    }

    // 2) Unicode replacement character (usually from broken encoding).
    for (const idx of findAllIndexes(text, '\uFFFD')) {
      const { line, col } = indexToLineCol(text, idx);
      issues.push({
        type: 'replacement_char',
        file: rel,
        line,
        col,
        context: snippetAt(text, idx),
      });
    }

    // 3) Suspicious "numbers split by control-ish whitespace": digit + CR + letters.
    // Example seen: "D \roughly" or similar.
    const m = text.matchAll(/(\d)\r([A-Za-z])/g);
    for (const hit of m) {
      const idx = hit.index ?? -1;
      if (idx < 0) continue;
      const { line, col } = indexToLineCol(text, idx);
      issues.push({
        type: 'digit_cr_letter',
        file: rel,
        line,
        col,
        context: snippetAt(text, idx),
      });
    }
  }

  issues.sort((a, b) => {
    if (a.file !== b.file) return a.file.localeCompare(b.file);
    if (a.line !== b.line) return a.line - b.line;
    return a.col - b.col;
  });

  const header = ['type', 'file', 'line', 'col', 'context'];
  const rows = [header.join(',')].concat(
    issues.map((it) => [it.type, it.file, it.line, it.col, it.context].map(csvEscape).join(','))
  );
  const csv = rows.join('\n') + '\n';

  if (outPath) {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, csv, 'utf-8');
    console.log(`content-audit: wrote ${issues.length} issues to ${outPath}`);
    return;
  }

  console.log(`content-audit: ${issues.length} issues`);
  for (const it of issues.slice(0, 50)) {
    console.log(`- ${it.type} ${it.file}:${it.line}:${it.col} ${it.context}`);
  }
  if (issues.length > 50) console.log(`- ... (${issues.length - 50} more)`);
  console.log(`\nTip: write CSV with: node scripts/content-audit.js --out=tmp/content-audit.csv`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

