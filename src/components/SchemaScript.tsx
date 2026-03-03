/**
 * SchemaScript — renders JSON-LD structured data in a <script> tag.
 *
 * Safety: All data comes from typed schema generators in src/lib/schema.ts.
 * We manually escape HTML control characters after JSON.stringify to prevent
 * XSS in case user input or external data ever makes its way into the schema.
 *
 * Usage:
 *   <SchemaScript data={schemaSiteGraph()} />
 *   <SchemaScript data={schemaPaperPage(paper)} />
 */

interface SchemaScriptProps {
  data: Record<string, unknown>;
}

export function SchemaScript({ data }: SchemaScriptProps) {
  // JSON.stringify does NOT automatically escape HTML control characters.
  // We must manually escape < and > to prevent XSS if schema data contains
  // malicious strings like "</script><script>alert(1)</script>".
  const jsonLd = JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e');

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: jsonLd }}
    />
  );
}
