const fs = require('fs');

const content = `---  # comment\n` +
  `title: Test\n`.repeat(100) +
  `---   # comment\n` +
  `body content `.repeat(100000);

const content2 = `---invalid  # comment\n` +
  `title: Test\n`.repeat(100) +
  `---   # comment\n` +
  `body content `.repeat(100000);

function parseFrontmatterOld(content) {
  const fmRegex = /^---[^\S\r\n]*(?:#.*)?\r?\n([\s\S]*?)\r?\n---[^\S\r\n]*(?:#.*)?\r?\n?([\s\S]*)$/;
  const match = content.match(fmRegex);

  if (!match) {
    return { frontmatter: { title: '', id: '' }, body: content, raw: content };
  }

  const [, fmRaw, body] = match;
  return { bodyLen: body.length };
}

function parseFrontmatterNew(content) {
  const defaultRes = { frontmatter: { title: '', id: '' }, body: content, raw: content };

  // Fast path: must start with ---
  if (!content.startsWith('---')) return defaultRes;

  const firstNewline = content.indexOf('\n');
  if (firstNewline === -1) return defaultRes;

  const firstLine = content.slice(0, firstNewline);
  if (!/^---[^\S\r\n]*(?:#.*)?\r?$/.test(firstLine)) return defaultRes;

  const endMark = '\n---';
  let searchIdx = firstNewline;
  while (true) {
    const endIdx = content.indexOf(endMark, searchIdx);
    if (endIdx === -1) return defaultRes;

    const endOfLine = content.indexOf('\n', endIdx + 4);
    const lineEnd = endOfLine === -1 ? content.length : endOfLine;
    const closingLine = content.slice(endIdx + 1, lineEnd);
    if (/^---[^\S\r\n]*(?:#.*)?\r?$/.test(closingLine)) {
        const fmRaw = content.slice(firstNewline + 1, endIdx);
        let body = '';
        if (endOfLine !== -1) {
            body = content.slice(endOfLine + 1);
        }
        return { bodyLen: body.length };
    }
    searchIdx = endIdx + 4;
  }
}

console.log(parseFrontmatterOld(content));
console.log(parseFrontmatterNew(content));

console.log(parseFrontmatterOld(content2).bodyLen);
console.log(parseFrontmatterNew(content2).bodyLen);
