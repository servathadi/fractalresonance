const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const CONTENT_DIR = path.join(process.cwd(), 'content');

function isAllowedControl(code) {
  // Allow TAB(9), LF(10), CR(13)
  return code === 9 || code === 10 || code === 13;
}

function stripBadControls(str) {
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
}

function normalizeFrontmatterDelimiters(str) {
  // Convert `---   \n` and `---\r\n` etc to `---\n`
  return str
    .replace(/^(?:\uFEFF)?---\s*\r?$/gm, '---')
    .replace(/^---\s*\r?$/gm, '---');
}

async function main() {
  const args = process.argv.slice(2);
  const write = args.includes('--write');
  const root = args.find((a) => !a.startsWith('--')) || CONTENT_DIR;

  const files = await glob('**/*.{md,mdx}', { cwd: root, absolute: true });
  let changed = 0;
  let issues = 0;

  for (const file of files) {
    const raw = fs.readFileSync(file);
    const text = raw.toString('utf8');

    let hasBad = false;
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      if (code < 32 && !isAllowedControl(code)) {
        hasBad = true;
        break;
      }
    }

    const normalized = normalizeFrontmatterDelimiters(stripBadControls(text));
    const next = normalized;

    if (hasBad || next !== text) {
      issues++;
      if (write) {
        fs.writeFileSync(file, next, 'utf8');
        changed++;
      }
    }
  }

  if (write) {
    console.log(`sanitize-content: wrote ${changed} files (${issues} with issues detected)`);
  } else {
    console.log(`sanitize-content: detected issues in ${issues} files (dry-run). Use --write to apply fixes.`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

