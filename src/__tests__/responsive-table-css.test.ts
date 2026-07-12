import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('responsive markdown tables', () => {
  it('constrains the scroll wrapper to the content viewport', () => {
    const css = fs.readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');
    const rule = css.match(/\.content-body \.table-wrap\s*\{([^}]*)\}/)?.[1] ?? '';

    expect(rule).toMatch(/overflow-x:\s*auto/);
    expect(rule).toMatch(/(?:^|\n)\s*width:\s*100%/);
    expect(rule).toMatch(/max-width:\s*100%/);
    expect(rule).toMatch(/min-width:\s*0/);
  });

  it('constrains display equations to a local horizontal scroller', () => {
    const css = fs.readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');
    const rule = css.match(/\.content-body \.katex-display\s*\{([^}]*)\}/)?.[1] ?? '';

    expect(rule).toMatch(/overflow-x:\s*auto/);
    expect(rule).toMatch(/(?:^|\n)\s*width:\s*100%/);
    expect(rule).toMatch(/max-width:\s*100%/);
    expect(rule).toMatch(/min-width:\s*0/);
  });

  it('clips the outer paper body while allowing long inline code to wrap', () => {
    const page = fs.readFileSync(
      path.join(process.cwd(), 'src/app/[lang]/papers/[id]/page.tsx'),
      'utf8'
    );
    const css = fs.readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');
    const codeRule = css.match(/\.content-body code\s*\{([^}]*)\}/)?.[1] ?? '';

    expect(page).toContain('content-body min-w-0 max-w-full overflow-x-hidden');
    expect(page).not.toContain('content-body min-w-0 max-w-full overflow-x-auto');
    expect(codeRule).toMatch(/overflow-wrap:\s*anywhere/);
  });

  it('clips root-level horizontal overflow while local scientific scrollers remain available', () => {
    const css = fs.readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');
    const htmlRule = css.match(/(?:^|\n)html\s*\{([^}]*)\}/)?.[1] ?? '';

    expect(htmlRule).toMatch(/overflow-x:\s*clip/);
  });

  it('contains KaTeX accessibility spans within each formula', () => {
    const css = fs.readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');
    const katexRule = css.match(/\.content-body \.katex\s*\{([^}]*)\}/)?.[1] ?? '';

    expect(katexRule).toMatch(/position:\s*relative/);
  });
});
