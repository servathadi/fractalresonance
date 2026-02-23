#!/usr/bin/env node
/**
 * One-command AI-first CMS runner.
 *
 * Default:
 * - Normalize + process inbox
 * - Validate content
 * - Regenerate search index + catalog (the “neural network” artifacts)
 *
 * Optional:
 * - --ai sos (use SOS to digest inbox into clean markdown)
 * - --tools (allow SOS tools)
 * - --build (run full Next.js build/export)
 */

const { spawnSync } = require('child_process');

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const eq = a.indexOf('=');
    if (eq !== -1) {
      out[a.slice(2, eq)] = a.slice(eq + 1);
    } else {
      const k = a.slice(2);
      const v = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
      out[k] = v;
    }
  }
  return out;
}

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', ...opts });
  if (r.status !== 0) process.exit(r.status || 1);
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  const ai = args.ai ? String(args.ai) : undefined;
  const build = Boolean(args.build);
  const tools = Boolean(args.tools);

  const pass = [];
  if (ai) pass.push('--ai', ai);
  if (tools) pass.push('--tools');
  if (args['no-validate']) pass.push('--no-validate');
  if (args['no-index']) pass.push('--no-index');
  if (args['no-catalog']) pass.push('--no-catalog');

  // Always regenerate artifacts by default (even if inbox is empty).
  if (!args['no-force']) pass.push('--force');

  run('node', ['scripts/process-inbox.js', ...pass]);

  if (build) {
    run('npm', ['run', 'build']);
  }
}

main();

