/**
 * SchemaScript — renders JSON-LD structured data in a <script> tag.
 *
 * Safety: All data comes from typed schema generators in src/lib/schema.ts.
 * No user input is ever passed to this component. The JSON.stringify output
 * is always valid JSON with no HTML special characters unescaped.
 *
 * Usage:
 *   <SchemaScript data={schemaSiteGraph()} />
 *   <SchemaScript data={schemaPaperPage(paper)} />
 */

interface SchemaScriptProps {
  data: Record<string, unknown>;
}

export function SchemaScript({ data }: SchemaScriptProps) {
  // JSON.stringify does NOT automatically escape HTML special characters.
  // To prevent XSS vulnerabilities when injecting data via dangerouslySetInnerHTML
  // inside a script tag, characters like < and > must be manually escaped.
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
