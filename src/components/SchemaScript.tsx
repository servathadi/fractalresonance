/**
 * SchemaScript — renders JSON-LD structured data in a <script> tag.
 *
 * Safety: All data comes from typed schema generators in src/lib/schema.ts.
 * No user input is ever passed to this component. However, as defense-in-depth,
 * the JSON.stringify output is escaped to prevent XSS.
 *
 * Usage:
 *   <SchemaScript data={schemaSiteGraph()} />
 *   <SchemaScript data={schemaPaperPage(paper)} />
 */

interface SchemaScriptProps {
  data: Record<string, unknown>;
}

export function SchemaScript({ data }: SchemaScriptProps) {
  // JSON.stringify alone is NOT safe for script tags. It does not escape HTML
  // control characters like < and >, meaning a string like "</script><script>alert(1)</script>"
  // could break out of the script tag and execute arbitrary code.
  // We must manually escape these characters to prevent XSS.
  const jsonLd = JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: jsonLd }}
    />
  );
}
