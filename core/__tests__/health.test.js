// Tests live inline in core/health_agent.js. This re-runs them.
require('child_process').execFileSync(
  process.execPath,
  [require('path').join(__dirname, '..', 'health_agent.js')],
  { stdio: 'inherit' }
);
