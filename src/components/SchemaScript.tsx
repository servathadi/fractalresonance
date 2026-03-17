/**
 * SchemaScript — renders JSON-LD structured data in a <script> tag.
 *
 * Safety: All data comes from typed schema generators in src/lib/schema.ts.
 * We manually escape HTML control characters like < and > after
 * JSON.stringify to prevent XSS vulnerabilities.
 *
 * Usage:
 *   <SchemaScript data={schemaSiteGraph()} />
 *   <SchemaScript data={schemaPaperPage(paper)} />
 */

interface SchemaScriptProps {
  data: Record<string, unknown>;
}

export function SchemaScript({ data }: SchemaScriptProps) {
  // JSON.stringify does not automatically escape HTML control characters
  // like < and >. We manually escape them to prevent XSS vulnerabilities
  // when injecting this data into script tags via dangerouslySetInnerHTML.
  const jsonLd = JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: jsonLd }}
    />
  );
}
