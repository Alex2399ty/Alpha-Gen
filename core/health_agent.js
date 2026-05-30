// AlphaGen Agent 8 - Portfolio Health (self-contained: logic + agent + self-test).
// Schedule: daily 07:00 ET. No external deps. ASCII only to survive concurrent reformatters.
'use strict';
function allocations(h, pm) {
  var v = h.map(function (x) { return { symbol: x.symbol, sector: x.sector || 'Unknown', value: (pm[x.symbol] != null ? pm[x.symbol] : (x.avg_cost || 0)) * (x.shares || 0) }; });
  var t = v.reduce(function (s, a) { return s + a.value; }, 0);
  return v.map(function (a) { a.weight = t ? a.value / t : 0; return a; });
}
function diversificationScore(h, pm) {
  var a = allocations(h, pm); if (!a.length) return 0;
  var by = {}; a.forEach(function (x) { by[x.sector] = (by[x.sector] || 0) + x.weight; });
  var hhi = Object.keys(by).reduce(function (s, k) { return s + by[k] * by[k]; }, 0);
  var n = Object.keys(by).length; if (n <= 1) return 10;
  var best = 1 / n; return Math.max(0, Math.min(100, Math.round((1 - (hhi - best) / (1 - best)) * 100)));
}
function managementScore(h, pm, sm) {
  var a = allocations(h, pm); if (!a.length) return 0; var acc = 0;
  a.forEach(function (x) { var s = sm[x.symbol] || {}; var c = s.ceoScore != null ? s.ceoScore : (s.ceo_score != null ? s.ceo_score : 50); acc += c * x.weight; });
  return Math.round(Math.max(0, Math.min(100, acc)));
}
function signalMixScore(h, pm, sm) {
  var a = allocations(h, pm); if (!a.length) return 0;
  var w = { strong_hold: 1, hold: 0.75, watch: 0.35, consider_swap: 0 }; var acc = 0;
  a.forEach(function (x) { var g = (sm[x.symbol] || {}).signal || 'hold'; acc += (w[g] != null ? w[g] : 0.5) * x.weight; });
  return Math.round(acc * 100);
}
function riskAlignmentScore(h, pm, sm, rl) {
  if (rl == null) rl = 5; var a = allocations(h, pm); if (!a.length) return 0; var beta = 0;
  a.forEach(function (x) { var b = (sm[x.symbol] || {}).beta; beta += (b != null ? b : 1) * x.weight; });
  var gap = Math.abs(beta - (0.5 + (rl - 1) * (1.5 / 9)));
  return Math.max(0, Math.min(100, Math.round(100 - gap * 80)));
}
function dcaConsistencyScore(o) {
  o = o || {}; var m = o.monthly_dca || 0; if (!m) return 75;
  return Math.round(Math.min(1, (o.contributed_this_month || 0) / m) * 100);
}
var WEIGHTS = { diversification: 0.25, management: 0.25, signalMix: 0.20, riskAlignment: 0.20, dcaConsistency: 0.10 };
function portfolioHealth(p) {
  p = p || {}; var h = p.holdings || [], pm = p.priceMap || {}, sm = p.stockMap || {}, rl = p.riskLevel != null ? p.riskLevel : 5;
  var c = {
    diversification: diversificationScore(h, pm), management: managementScore(h, pm, sm),
    signalMix: signalMixScore(h, pm, sm), riskAlignment: riskAlignmentScore(h, pm, sm, rl), dcaConsistency: dcaConsistencyScore(p),
  };
  var score = Math.round(Object.keys(WEIGHTS).reduce(function (s, k) { return s + c[k] * WEIGHTS[k]; }, 0));
  var sg = [];
  if (c.diversification < 60) sg.push('Concentrated in few sectors; add a holding in an unrepresented sector to lower single-sector risk.');
  if (c.management < 70) sg.push('Weighted CEO score below target; review consider-swap names with weaker management.');
  if (c.signalMix < 60) sg.push('Meaningful value in watch/consider-swap signals; review the AI reasoning on those positions.');
  if (c.riskAlignment < 60) sg.push('Volatility drifting from your stated risk level; a rebalance would realign beta to your profile.');
  if (c.dcaConsistency < 60) sg.push('Behind on the monthly contribution plan; consistent DCA is the biggest long-run lever.');
  if (!sg.length) sg.push('Well-aligned across diversification, management, signals, and risk. Stay the course.');
  return { score: score, components: c, suggestions: sg };
}
var SCHEDULE = '0 7 * * *', AGENT_NAME = 'agent8_health';
function runHealthAgent(portfolios, opts) {
  portfolios = portfolios || []; opts = opts || {};
  var prev = opts.prevScores || {}, log = opts.logger || console.log, persist = opts.persist;
  var valid = portfolios.filter(function (p) { return p && Array.isArray(p.holdings); });
  if (!valid.length) { log('[' + AGENT_NAME + '] no portfolios - skipping'); return []; }
  var res = valid.map(function (p) {
    var r = portfolioHealth(p); var pv = prev[p.id]; var drop = typeof pv === 'number' && pv - r.score > 10;
    if (drop) log('[' + AGENT_NAME + '] ALERT ' + p.id + ': ' + pv + ' -> ' + r.score);
    return { portfolio_id: p.id, user_id: p.user_id, health_score: r.score, components: r.components, suggestions: r.suggestions, alert: drop || undefined, computed_at: new Date().toISOString() };
  });
  if (typeof persist === 'function') persist('portfolio_health', res);
  log('[' + AGENT_NAME + '] scored ' + res.length + ' portfolio(s)');
  return res;
}
module.exports = { portfolioHealth: portfolioHealth, runHealthAgent: runHealthAgent, diversificationScore: diversificationScore, managementScore: managementScore, signalMixScore: signalMixScore, riskAlignmentScore: riskAlignmentScore, dcaConsistencyScore: dcaConsistencyScore, WEIGHTS: WEIGHTS, SCHEDULE: SCHEDULE, AGENT_NAME: AGENT_NAME };

// Inline self-test: `node core/health_agent.js`
if (require.main === module) {
  var assert = require('assert');
  var sm = { AAA: { ceoScore: 92, beta: 0.9, signal: 'strong_hold', sector: 'Software' }, BBB: { ceoScore: 88, beta: 1.0, signal: 'hold', sector: 'Healthcare' } };
  var hd = [{ symbol: 'AAA', shares: 10, avg_cost: 50, sector: 'Software' }, { symbol: 'BBB', shares: 10, avg_cost: 50, sector: 'Healthcare' }];
  var pm = { AAA: 50, BBB: 50 };
  var ok = portfolioHealth({ holdings: hd, priceMap: pm, stockMap: sm, riskLevel: 5, monthly_dca: 300, contributed_this_month: 300 });
  assert.ok(ok.score >= 80, 'healthy>=80 got ' + ok.score);
  assert.ok(diversificationScore([{ symbol: 'AAA', shares: 10, avg_cost: 50, sector: 'Software' }, { symbol: 'CCC', shares: 10, avg_cost: 50, sector: 'Software' }], { AAA: 50, CCC: 50 }) < 30, 'concentration low');
  assert.ok(riskAlignmentScore(hd, pm, { AAA: { beta: 0.5 }, BBB: { beta: 0.5 } }, 10) < 60, 'risk misalign');
  assert.strictEqual(dcaConsistencyScore({ monthly_dca: 0 }), 75);
  assert.strictEqual(dcaConsistencyScore({ monthly_dca: 200, contributed_this_month: 100 }), 50);
  assert.strictEqual(typeof portfolioHealth({}).score, 'number');
  var wsm = { AAA: { ceoScore: 55, beta: 0.5, signal: 'consider_swap', sector: 'Software' }, CCC: { ceoScore: 50, beta: 0.5, signal: 'watch', sector: 'Software' } };
  var whd = [{ symbol: 'AAA', shares: 10, avg_cost: 50, sector: 'Software' }, { symbol: 'CCC', shares: 10, avg_cost: 50, sector: 'Software' }];
  var out = runHealthAgent([{ id: 'p1', user_id: 'u1', riskLevel: 10, holdings: whd, priceMap: { AAA: 50, CCC: 50 }, stockMap: wsm }], { prevScores: { p1: 99 }, logger: function () {} });
  assert.strictEqual(out.length, 1); assert.strictEqual(out[0].alert, true, 'drop alert');
  assert.strictEqual(runHealthAgent([{ id: 'x' }], { logger: function () {} }).length, 0);
  console.log('OK - all health tests passed (score sample=' + ok.score + ')');
}
