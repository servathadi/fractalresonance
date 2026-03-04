/**
 * SchemaScript — renders JSON-LD structured data in a <script> tag.
 *
 * Safety: All data comes from typed schema generators in src/lib/schema.ts.
 * We also sanitize the JSON output by escaping HTML control characters
 * to prevent potential XSS injection if markdown content gets into schema.
 *
 * Usage:
 *   <SchemaScript data={schemaSiteGraph()} />
 *   <SchemaScript data={schemaPaperPage(paper)} />
 */

interface SchemaScriptProps {
  data: Record<string, unknown>;
}

export function SchemaScript({ data }: SchemaScriptProps) {
  // JSON.stringify does NOT automatically escape HTML control characters like < and >.
  // We must explicitly escape them to prevent XSS attacks when injecting into script tags.
  // Using \u003c, \u003e, \u0026 ensures it remains valid JSON but cannot break out of the script block.
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
