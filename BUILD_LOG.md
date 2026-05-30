# AlphaGen - Build Log

## Run: 2026-05-29 (automated scheduled sprint)

### Increment delivered: Agent 8 - Portfolio Health scoring
Implemented the Portfolio Health Agent from Phase 2 of the master spec: an
explainable 0-100 portfolio score with component breakdown and specific
improvement suggestions. Daily schedule `0 7 * * *`, per spec.

**Files**
- `core/health_agent.js` - canonical, self-contained module (no external deps):
  scoring functions (value-weighted diversification via HHI, weighted CEO score,
  signal mix, risk/beta alignment, DCA consistency), the `runHealthAgent()` job
  with >10pt drop alerting, plus an inline self-test runnable with
  `node core/health_agent.js`.
- `core/health.js` - thin re-export of the above.
- `agents/agent8_health.js` - thin re-export exposing `runHealthAgent`, `SCHEDULE`,
  `AGENT_NAME` for the orchestrator.
- `core/__tests__/health.test.js` - runs the inline test suite.

**Verification:** `node core/health_agent.js` -> "OK - all health tests passed
(score sample=92)", exit 0. Tests cover healthy vs. concentrated portfolios, risk
misalignment, DCA edge cases, empty-portfolio handling, and drop-alert detection.

**Scoring weights:** diversification 0.25, management 0.25, signal mix 0.20, risk
alignment 0.20, DCA 0.10. Every component is bounded 0-100 and individually
inspectable, consistent with AlphaGen's no-black-boxes principle.

### Notes / decisions made autonomously
- Kept the module dependency-free CommonJS so it runs today, rather than coupling to
  a base-agent class that does not yet exist in the repo.
- This run executed alongside concurrent build activity. Files written into `core/`
  and `agents/` were intermittently truncated/reformatted (tabs appeared, lines cut)
  by another process touching the same paths. Consolidating into a single
  immediately-tested file and using thin re-exports was the reliable workaround.
- A stray `.git/index.lock` could not be removed ("operation not permitted"),
  consistent with a concurrent git process; no commit was attempted from this run.

### Next up (priorities)
1. Wire Agent 8 into the orchestrator once `base_agent` lands; persist results to a
   `portfolio_health` table (schema already supports it).
2. Surface the health score + component breakdown on the Portfolio tab UI.
3. Expand `Data.js` stock universe toward 45+.
4. Add the required AI-output disclosures to every recommendation surface.

> Blocker for live-data phases: no Supabase / Alpaca / NewsAPI / SnapTrade / Anthropic
> keys are available to an autonomous run. Those need Alex to provision accounts first.

---

## Run: 2026-05-30 (automated scheduled sprint)

### Increment delivered: Phase 8 compliance disclosures (frontend)
Phase 8 is marked "DO THIS EARLY" and transparency is the #1 guiding principle,
yet the frontend carried ZERO required investment-advice disclosures. Added them
on every recommendation surface — no API keys required, immediate user-facing value.

**Changes**
- `index.html` — (1) per-signal disclosure under the Daily Signals list:
  "AlphaGen's signals are AI-generated algorithmic outputs, not personalized human
  financial advice…"; (2) a persistent site-wide `<footer class="app-disclaimer">`
  before the script tags covering RIA/broker status, risk of loss, past-performance,
  and no-custody-of-funds.
- `script.js` — risk warning injected into the Simulation Lab results
  ("Projections are illustrative only…") right after the projection card.
- `styles.css` — `.disclosure`, `.disclosure-sim`, and `.app-disclaimer` styles
  (gold left-rule callout + muted footer), mobile-adjusted.

**Verification:** `node --check script.js` and `node --check Data.js` both pass.
Disclosure markers confirmed present and stable across re-reads:
index.html (signals + footer), styles.css (4 rules), script.js (sim warning).
Stock universe already at 53 (>45 goal). Agent 8 health self-test still green.

### Notes / decisions made autonomously
- The bash mount and the Read/Write/Edit file tools repeatedly fought over the same
  source files: Edit-tool writes appeared to land, then a sync clobbered/truncated
  index.html (cut mid-tag at ~line 731) and reverted the styles.css edit entirely.
  Root cause matches the system note that the shell sandbox and file tools may use
  different paths/state for the same file. Workaround: restored index.html from the
  HEAD blob (`git show HEAD:index.html`) and re-applied edits via a single bash write,
  then verified stability with a delayed re-read. Avoid interleaving Edit-tool and
  bash writes on the same file in future runs — pick one channel per file.
- `.git/index.lock` still present and unremovable ("Operation not permitted"), so no
  commit was made this run. Changes are on disk and stable but uncommitted.

### Next up (priorities)
1. Surface the Agent 8 Portfolio Health score + component breakdown on the Portfolio tab.
2. Resolve the git lock so increments can be committed.
3. Provision Supabase / Alpaca / NewsAPI / SnapTrade / Anthropic keys to unblock the
   live-data phases (Phase 1-2 backend).
