// ════════════════════════════════════════
// TICKER
// ════════════════════════════════════════
(()=>{
  const T=[{s:'NVDA',p:'$134.72',c:'+3.41%',u:1},{s:'MSFT',p:'$420.18',c:'+1.21%',u:1},{s:'AMZN',p:'$228.90',c:'+0.83%',u:1},{s:'META',p:'$612.45',c:'-0.42%',u:0},{s:'PLTR',p:'$92.30',c:'+5.12%',u:1},{s:'TSLA',p:'$248.70',c:'-1.80%',u:0},{s:'AVGO',p:'$198.40',c:'+2.20%',u:1},{s:'JNJ',p:'$158.20',c:'+0.31%',u:1},{s:'LLY',p:'$812.40',c:'+1.34%',u:1},{s:'AAPL',p:'$238.55',c:'+0.62%',u:1},{s:'AMD',p:'$132.50',c:'-2.10%',u:0},{s:'V',p:'$284.20',c:'+0.55%',u:1},{s:'COST',p:'$942.10',c:'+0.71%',u:1},{s:'NOW',p:'$1042.30',c:'+1.82%',u:1},{s:'GS',p:'$512.80',c:'+1.14%',u:1}];
  const tk=document.getElementById('ticker');
  [...T,...T].forEach(s=>{const d=document.createElement('div');d.className='tki';d.innerHTML=`<span class="tks">${s.s}</span><span class="tkp">${s.p}</span><span class="tkc ${s.u?'up':'dn'}">${s.c}</span>`;tk.appendChild(d);});
})();

// ════════════════════════════════════════
// HOLDINGS TABLE
// ════════════════════════════════════════
(()=>{
  const H=[{s:'NVDA',n:'Nvidia Corp',a:18.2,p:134.72,d:3.41,m:18.4},{s:'MSFT',n:'Microsoft',a:15.1,p:420.18,d:1.21,m:6.2},{s:'AMZN',n:'Amazon',a:12.4,p:228.90,d:0.83,m:9.1},{s:'META',n:'Meta Platforms',a:11.3,p:612.45,d:-0.42,m:14.3},{s:'PLTR',n:'Palantir',a:8.6,p:92.30,d:5.12,m:22.1},{s:'AVGO',n:'Broadcom',a:7.2,p:198.40,d:2.20,m:11.8},{s:'JNJ',n:'J&J',a:5.4,p:158.20,d:0.31,m:2.1}];
  const tb=document.getElementById('h-body');
  H.forEach(h=>{const tr=document.createElement('tr');tr.innerHTML=`<td><div class="hsym">${h.s}</div><div class="hname">${h.n}</div></td><td><div style="font-size:9px;color:var(--mut);margin-bottom:2px;">${h.a}%</div><div class="hbar-bg"><div class="hbar-fill" style="width:${Math.min(100,h.a*3.5)}%"></div></div></td><td style="font-size:11px;">$${h.p}</td><td><span class="${h.d>=0?'up':'dn'}">${h.d>=0?'+':''}${h.d}%</span></td><td><span class="${h.m>=0?'up':'dn'}">${h.m>=0?'+':''}${h.m}%</span></td><td><button class="why-btn" onclick="event.stopPropagation();openWhy('${h.s}')">Why? 💡</button></td>`;tr.onclick=()=>openWhy(h.s);tb.appendChild(tr);});
})();

// ════════════════════════════════════════
// DAILY SIGNALS
// ════════════════════════════════════════
(()=>{
  const portfolio=['NVDA','MSFT','AMZN','META','PLTR','AVGO','JNJ'];
  const list=document.getElementById('signals-list');
  portfolio.forEach(sym=>{
    const d=DB.find(s=>s.s===sym);if(!d)return;
    const typeMap={strong:'sig-strong',hold:'sig-hold',watch:'sig-watch',swap:'sig-swap'};
    const labelMap={strong:'⚡ STRONG HOLD',hold:'✓ HOLD',watch:'⚠ WATCH',swap:'↕ CONSIDER SWAP'};
    const colorMap={strong:'var(--acc)',hold:'var(--acc)',watch:'var(--gld)',swap:'var(--red)'};
    const confColor=d.confidence>=85?'var(--acc)':d.confidence>=70?'var(--gld)':'var(--red)';
    const swapHTML=d.swapSuggestion?`<div class="swap-suggestion"><span class="swap-sym">Consider → ${d.swapSuggestion.sym}</span><div style="font-size:9px;color:var(--mut);margin-top:3px;">${d.swapSuggestion.reason}</div></div>`:'';
    const el=document.createElement('div');el.className='signal-row';
    el.innerHTML=`<span class="sig-badge ${typeMap[d.signalType]}">${labelMap[d.signalType]}</span>
    <div class="sig-body">
      <div style="display:flex;align-items:baseline;gap:7px;"><span class="sig-sym">${sym}</span><span style="font-size:9px;color:var(--mut);">${d.n}</span></div>
      <div class="sig-reason">${d.reason}</div>
      <div class="sig-conf"><div class="sig-conf-fill" style="width:${d.confidence}%;background:${confColor};"></div></div>
      <div class="sig-meta"><span>AI Confidence: <strong style="color:${confColor};">${d.confidence}%</strong></span><span>Updated 6:30 AM</span><span>Mgmt Score: ${d.mgmt}/10</span></div>
      ${swapHTML}
    </div>
    <button class="why-btn" style="flex-shrink:0;white-space:nowrap;" onclick="openWhy('${sym}')">Full Thesis 💡</button>`;
    list.appendChild(el);
  });
})();

// ════════════════════════════════════════
// GLOSSARY
// ════════════════════════════════════════
const GLOSSARY=[
  {t:'Dollar Cost Averaging (DCA)',d:'Investing a fixed dollar amount at regular intervals regardless of price. Automatically buys more shares when prices are low and fewer when prices are high.',ex:'You invest $300 every month. NVDA drops 30% — your $300 buys significantly more shares. When it recovers, those extra shares generate outsized returns.'},
  {t:'DRIP (Dividend Reinvestment Plan)',d:'Automatically using dividend payments to buy more shares of the same stock instead of taking cash.',ex:"JNJ pays you $18.40 in dividends. DRIP automatically buys 0.11 more JNJ shares. Those shares generate their own dividends next quarter — pure compounding."},
  {t:'P/E Ratio (Price-to-Earnings)',d:'The price of a stock divided by its annual earnings per share. A P/E of 30 means you\'re paying $30 for every $1 of annual earnings.',ex:'COST trades at 52x P/E — expensive for a retailer. Justified because 93% membership renewal makes earnings extremely predictable and growing.'},
  {t:'Market Cap',d:'Total value of all shares outstanding. Share price multiplied by number of shares. Determines whether a company is Large Cap ($10B+), Mid Cap ($2-10B), or Small Cap (<$2B).',ex:'NVDA market cap: ~$3.3 trillion. That\'s larger than the entire GDP of France.'},
  {t:'Insider Buying (Form 4)',d:'When company executives or directors buy their own company\'s stock on the open market. They must report it to the SEC within 2 business days on Form 4.',ex:"Karp buying $2.1M of PLTR on the open market (not a pre-planned 10b5-1 plan) is one of the most bullish signals we track. He knows the company better than anyone."},
  {t:'13F Filing',d:'Quarterly SEC filing that large institutional investors (>$100M in assets) must submit listing all their US equity holdings. Public within 45 days of quarter end.',ex:"Ackman's 13F revealed his $180M new position in PLTR before most retail investors knew. Tracking 13Fs shows what the smartest money is doing."},
  {t:'Yield on Cost',d:'Your annual dividend income divided by what you originally paid for the stock. Grows over time as the company raises dividends on your fixed cost basis.',ex:'You bought JNJ at $100/share. Current yield is 3.2% ($3.20/share/year). In 15 years at 7% dividend growth, yield on cost becomes ~8.8% on your original $100 investment.'},
  {t:'Free Cash Flow (FCF)',d:'Cash a company generates after paying all operating expenses and capital expenditures. The truest measure of a company\'s financial health.',ex:"NVDA generates ~$60B in annual free cash flow. This is real money — it funds dividends, buybacks, R&D, and acquisitions without borrowing."},
  {t:'Moat (Economic Moat)',d:'A sustainable competitive advantage that protects a company\'s profits from competitors. Like a moat protecting a castle.',ex:"Visa's moat: 4.3 billion cards, 130M merchants, and decades of trust. A competitor would need to replace all 130M merchant terminals AND convince consumers to switch. Essentially impossible."},
  {t:'Max Drawdown',d:'The largest peak-to-trough decline in a portfolio or stock before a new peak is reached. The worst loss you would have experienced at any point.',ex:'TQQQ had a -80% max drawdown in 2022. If you had $10,000, it became $2,000. Even if you held through it, it took years to recover. This is why position sizing matters.'},
  {t:'Rebalancing',d:'The process of realigning portfolio weights by selling assets that have grown beyond their target allocation and buying those that have fallen below.',ex:'NVDA grows from 15% to 25% of your portfolio. Rebalancing trims it back to 15% and uses the proceeds to buy underweight holdings. Enforces buying low and selling high automatically.'},
  {t:'Dividend Aristocrat',d:'S&P 500 companies that have increased their dividend for at least 25 consecutive years.',ex:"MSFT is a Dividend Aristocrat with 22 consecutive years of increases. JNJ is a Dividend King — the highest rank — with 62 consecutive years of increases."},
];

const ADV_GLOSSARY=[
  {t:'CEO Earnings Call Scoring',d:"AlphaGen's proprietary scoring of CEO language quality on quarterly earnings calls. Analyzes specificity, hedging frequency, forward guidance precision, and consistency between calls.",ex:"Jensen Huang scores 9.8/10 because he gives specific numbers, makes falsifiable predictions, and almost never uses vague hedging language. A CEO who says 'we expect good growth' scores much lower than one who says 'we expect 28-32% revenue growth in Q2.'"},
  {t:'Volatility Decay (ETF)',d:'The mathematical erosion that occurs when a leveraged ETF must rebalance daily. In volatile sideways markets, a 3x ETF loses value even when the underlying index ends flat.',ex:"If an index goes up 10% then down 10%, it\'s at 99% of where it started. A 3x ETF goes up 30% then down 30% — it\'s at 91% of where it started. The extra 8% loss is volatility decay."},
  {t:'10b5-1 Plan',d:'A pre-arranged trading plan that allows insiders to sell shares according to a schedule set in advance. Not considered an insider trading signal because it was planned before the sale.',ex:"Jensen Huang's $8.4M stock sale is via a 10b5-1 plan — it was scheduled months ago and tells us nothing about his current view. Karp's purchase has no 10b5-1 — he chose to buy PLTR this week. That signals conviction."},
  {t:'Net Retention Rate (NRR)',d:'For SaaS companies, the percentage of recurring revenue retained from existing customers after accounting for upgrades, downgrades, and churn.',ex:"CrowdStrike's 120% NRR means existing customers are spending 20% more year over year — without any new customers. A company with 120%+ NRR grows even if it never signs another contract."},
  {t:'GLP-1',d:'A class of medications (glucagon-like peptide-1 receptor agonists) originally developed for diabetes, now proven highly effective for obesity treatment. Tirzepatide and semaglutide are GLP-1 drugs.',ex:"Eli Lilly\'s Mounjaro/Zepbound and Novo Nordisk\'s Ozempic/Wegovy are GLP-1 drugs. The market opportunity is 1 billion+ people globally who qualify — AlphaGen considers it one of the most important secular trends in healthcare."},
  {t:'EUV Lithography',d:'Extreme ultraviolet lithography — the technology used to etch circuits onto the most advanced semiconductors. Only ASML makes these machines.',ex:'Every iPhone chip, every NVIDIA GPU, every advanced computer processor in the world must be made using ASML\'s EUV machines. There is literally no other option. This is why ASML trades at a significant premium.'},
];

(()=>{
  const b=document.getElementById('gls-body');const b2=document.getElementById('gls-body2');
  if(!b||!b2)return;
  GLOSSARY.forEach(g=>{b.innerHTML+=`<div class="gls-item"><div class="gls-term">${g.t}</div><div class="gls-def">${g.d}</div><div class="gls-ex">${g.ex}</div></div>`;});
  ADV_GLOSSARY.forEach(g=>{b2.innerHTML+=`<div class="gls-item"><div class="gls-term">${g.t}</div><div class="gls-def">${g.d}</div><div class="gls-ex">${g.ex}</div></div>`;});
})();

// ════════════════════════════════════════
// NAVIGATION
// ════════════════════════════════════════
const PM={portfolio:{t:'Portfolio',s:'Growth Seeker · Synced with Robinhood'},simulation:{t:'Simulation Lab',s:'Portfolio builder & scenario planner'},dividends:{t:'Dividends',s:'Income tracker & DRIP management'},watchlist:{t:'Watchlist',s:'Stocks you\'re monitoring'},learn:{t:'Learn',s:'Lessons, Glossary, Explainers & Sleep Test'},markets:{t:'Markets',s:'Insider trades, macro & sector signals'},pricing:{t:'Upgrade',s:'Plans, referral & campus program'}};
function nav(id,el){
  document.querySelectorAll('.pg').forEach(p=>p.classList.remove('on'));
  document.querySelectorAll('.ni').forEach(n=>n.classList.remove('on'));
  document.getElementById('pg-'+id).classList.add('on');
  if(el)el.classList.add('on');
  const m=PM[id];if(m){document.getElementById('tb-title').textContent=m.t;document.getElementById('tb-sub').textContent=m.s;}
}

// ════════════════════════════════════════
// LOGIN PANEL
// ════════════════════════════════════════
function openLogin(){document.getElementById('login-panel').classList.add('open');document.getElementById('lp-ov').classList.add('on');}
function closeLogin(){document.getElementById('login-panel').classList.remove('open');document.getElementById('lp-ov').classList.remove('on');}
function lpTab(t){
  document.getElementById('lt-su').classList.toggle('on',t==='su');
  document.getElementById('lt-li').classList.toggle('on',t==='li');
  document.getElementById('lp-su').style.display=t==='su'?'block':'none';
  document.getElementById('lp-li').style.display=t==='li'?'block':'none';
}
function pwStr(pw){const b=document.getElementById('pw-bar');if(!b)return;if(!pw){b.className='pw-bar';return;}if(pw.length<8)b.className='pw-bar w';else if(pw.length<12||!/[0-9A-Z]/.test(pw))b.className='pw-bar f';else b.className='pw-bar s';}
function tgPw(id,btn){const el=document.getElementById(id);if(!el)return;el.type=el.type==='password'?'text':'password';btn.textContent=el.type==='password'?'👁':'🙈';}
function lpSignup(){
  const fn=document.getElementById('su-fn').value.trim();
  const em=document.getElementById('su-em').value.trim();
  if(!fn||!em||!em.includes('@')){document.getElementById('su-em').style.borderColor='var(--red)';setTimeout(()=>document.getElementById('su-em').style.borderColor='',2000);return;}
  setUser(fn);closeLogin();
}
function lpLogin(){
  const em=document.getElementById('li-em').value.trim();
  if(!em){return;}setUser(em.split('@')[0]);closeLogin();
}
function lpGuest(){setUser('Guest');closeLogin();}
function lpQuick(){const n=prompt('Enter your name:')||'Alex';setUser(n);closeLogin();}
function setUser(name){
  const n=name.charAt(0).toUpperCase()+name.slice(1);
  document.getElementById('uname').textContent=n;
  document.getElementById('utier').textContent='Free Plan · Investor';
  document.getElementById('av').textContent=n.charAt(0).toUpperCase();
  document.getElementById('tb-sub').textContent='Welcome back, '+n+' · Growth Seeker';
  document.getElementById('tb-title').textContent=document.getElementById('tb-title').textContent;
  // After login, show check-in prompt
  setTimeout(()=>openCheckin(),800);
}

// ════════════════════════════════════════
// WHY MODAL
// ════════════════════════════════════════
function openWhy(sym){
  const d=DB.find(s=>s.s===sym);if(!d)return;
  document.getElementById('why-sym').textContent=sym+' — '+d.n;
  document.getElementById('why-chips').innerHTML=d.metrics.map((m,i)=>`<span class="tag ${['tg','tb2','to'][i]}">${m.v} ${m.l}</span>`).join('');
  document.getElementById('why-thesis').textContent=d.thesis;
  document.getElementById('why-mscore').textContent=d.mgmt.toFixed(1);
  document.getElementById('why-mgmt').textContent=d.management;
  document.getElementById('why-risks').textContent=d.risks;
  document.getElementById('why-metrics').innerHTML=d.metrics.map(m=>`<div style="background:var(--sur);border-radius:var(--rs);padding:8px;text-align:center;"><div class="mmv">${m.v}</div><div class="mml2">${m.l}</div></div>`).join('');
  document.getElementById('why-modal').classList.add('on');
  document.body.style.overflow='hidden';
}
function closeWhy(){document.getElementById('why-modal').classList.remove('on');document.body.style.overflow='';}
function openThesis(sym){
  const d=DB.find(s=>s.s===sym)||{s:sym,n:sym,thesis:'AlphaGen\'s agents will analyze this company and generate a full thesis once connected to real-time data feeds.',management:'Management analysis pending agent connection.',whyfit:'Manually pinned by you.',risks:'Full risk analysis pending.',metrics:[{v:'—',l:'Analyzing'},{v:'—',l:'CEO Score'},{v:'—',l:'Risk'}],mgmt:7};
  document.getElementById('th-sym').textContent=d.s+' — '+d.n;
  document.getElementById('th-thesis').textContent=d.thesis;
  document.getElementById('th-mscore').textContent=(d.mgmt||7).toFixed(1);
  document.getElementById('th-mgmt').textContent=d.management;
  document.getElementById('th-fit').textContent=d.whyfit;
  document.getElementById('th-risks').textContent=d.risks;
  document.getElementById('th-metrics').innerHTML=(d.metrics||[]).map(m=>`<div style="background:var(--sur);border-radius:var(--rs);padding:8px;text-align:center;"><div class="mmv">${m.v}</div><div class="mml2">${m.l}</div></div>`).join('');
  document.getElementById('thesis-modal').classList.add('on');
  document.body.style.overflow='hidden';
}
function closeThesis(){document.getElementById('thesis-modal').classList.remove('on');document.body.style.overflow='';}

// ════════════════════════════════════════
// WEEKLY CHECK-IN
// ════════════════════════════════════════
const CI_QUESTIONS=[
  {q:'Any changes to your life situation this week?',hint:'Big life changes should update your portfolio strategy.',opts:[{i:'💼',t:'New job or income change'},{i:'💰',t:'Got a bonus or extra cash to invest'},{i:'📉',t:'Tighter on money this month'},{i:'✅',t:'No major changes — status quo'}]},
  {q:'How are you feeling about risk right now?',hint:'Your emotional comfort with risk changes. Honest answers lead to better portfolios.',opts:[{i:'🚀',t:'Feeling aggressive — want more upside'},{i:'⚖️',t:'Same as usual — balanced'},{i:'🛡️',t:'Feeling cautious — protect what I have'},{i:'😰',t:'Anxious about market volatility'}]},
  {q:'Any sectors you\'re more excited about lately?',hint:'We\'ll adjust your simulation preferences to match your conviction.',opts:[{i:'🤖',t:'AI & Technology — all in'},{i:'💊',t:'Healthcare & biotech breakthroughs'},{i:'⚡',t:'Clean energy & infrastructure'},{i:'🌍',t:'No preference — let AlphaGen decide'}]},
  {q:'Are you planning any big expenses in the next 12 months?',hint:'Upcoming expenses affect how much liquidity you should keep vs invest.',opts:[{i:'🏠',t:'Housing — rent, down payment, etc'},{i:'🎓',t:'Education or tuition'},{i:'✈️',t:'Travel or lifestyle purchase'},{i:'✅',t:'No major expenses planned'}]},
];
let ciStep=0,ciAnswers={};
function buildCiProg(){const p=document.getElementById('ci-prog');p.innerHTML=CI_QUESTIONS.map((_,i)=>`<div class="ci-pd ${i<=ciStep?'on':''}"></div>`).join('');}
function renderCi(){
  buildCiProg();
  const q=CI_QUESTIONS[ciStep];
  const counter=document.getElementById('ci-counter');
  if(counter)counter.textContent=`${ciStep+1} of ${CI_QUESTIONS.length}`;
  document.getElementById('ci-heading').textContent=q.q;
  document.getElementById('ci-back').style.display=ciStep>0?'inline-flex':'none';
  const nextBtn=document.getElementById('ci-next');
  nextBtn.textContent=ciStep===CI_QUESTIONS.length-1?'Update Portfolio →':'Next →';
  document.getElementById('ci-scroll').innerHTML=`<div class="ci-hint">${q.hint}</div><div class="ci-opts">${q.opts.map((o,i)=>`<div class="ci-opt ${ciAnswers[ciStep]===i?'on':''}" onclick="ciPick(${i},this)"><div class="ci-ico">${o.i}</div><div style="font-size:11px;font-family:var(--F);font-weight:600;">${o.t}</div></div>`).join('')}</div>`;
}
function ciPick(i,el){ciAnswers[ciStep]=i;document.querySelectorAll('.ci-opt').forEach(o=>o.classList.remove('on'));el.classList.add('on');}
function ciNav(dir){
  if(dir===1){
    if(ciStep===CI_QUESTIONS.length-1){submitCheckin();return;}
    ciStep++;
  } else {
    if(ciStep>0)ciStep--;
  }
  renderCi();
}
function openCheckin(){ciStep=0;ciAnswers={};renderCi();document.getElementById('checkin-modal').classList.add('on');}
function closeCheckin(){document.getElementById('checkin-modal').classList.remove('on');}
function submitCheckin(){
  document.getElementById('checkin-modal').classList.remove('on');
  // Show toast-style feedback
  const t=document.createElement('div');
  t.style.cssText='position:fixed;bottom:20px;right:20px;background:var(--card);border:1px solid var(--aglow);border-radius:var(--r);padding:14px 18px;z-index:900;font-size:12px;color:var(--tex);box-shadow:0 8px 28px rgba(0,0,0,.5);animation:pgIn .3s ease;max-width:300px;';
  t.innerHTML=`<div style="font-family:var(--F);font-weight:700;font-size:13px;color:var(--acc);margin-bottom:4px;">✅ Portfolio Updated</div>
  <div style="color:var(--mut);font-size:11px;line-height:1.6;">Your check-in has been processed. AlphaGen is adjusting your recommendations based on your current situation.</div>`;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),4500);
}

// ════════════════════════════════════════
// SIMULATION
// ════════════════════════════════════════
document.addEventListener('click',e=>{
  const el=e.target.closest('.sp');if(!el)return;
  const g=el.dataset.g,multi=el.dataset.multi==='1';
  if(multi){el.classList.toggle('on');}
  else{document.querySelectorAll(`.sp[data-g="${g}"]`).forEach(t=>t.classList.remove('on'));el.classList.add('on');}
  if(g==='rs')updRiskExpl(el.textContent.trim());
  if(g==='lev')updLevExpl(el.textContent.trim());
  if(g==='div'){updDivExpl(el.textContent.trim());document.getElementById('yield-row').style.display=el.textContent.includes('Growth')?'none':'block';}
  svUp();
});
function sv1(id,v){const el=document.getElementById(id);if(el)el.textContent=v;}
function svUp(){
  const s=+document.getElementById('sr-start').value;
  const d=+document.getElementById('sr-dca').value;
  const h=+document.getElementById('sr-hor').value;
  sv1('sv-start','$'+s.toLocaleString());
  sv1('sv-dca','$'+d.toLocaleString()+' / mo');
  sv1('sv-hor',h+' years');
  sv1('sv-risk',document.getElementById('sr-risk').value+' / 10');
  sv1('sv-mgmt',parseFloat(document.getElementById('sr-mgmt').value).toFixed(1)+' / 10');
  sv1('sv-holds',document.getElementById('sr-holds').value);
  const total=s+d*12*h;
  document.getElementById('inv-expl').innerHTML=`Your setup: <strong>$${s.toLocaleString()} start + $${d.toLocaleString()}/mo × ${h} years</strong> = total invested <span style="color:var(--acc);font-weight:700;">$${Math.round(total).toLocaleString()}</span>`;
}
const RE={Balanced:'<strong>Balanced:</strong> Mix of quality growth and stability. Handles 20–35% drawdowns without panic selling.',Growth:'<strong>Growth:</strong> Overweight high-quality growth companies. Accepts 30–40% drawdowns for higher long-term returns.',Aggressive:'<strong style="color:var(--red)">Aggressive:</strong> Maximum return potential. Must stomach 50%+ drawdowns without selling.',Conservative:'<strong style="color:var(--blu)">Conservative:</strong> Capital preservation first. Heavy dividend payers and defensive sectors.'};
const LE={'No Leverage':'<strong>No Leverage:</strong> Clean compounding. Losses capped at your investment. Recommended for most investors.','2x ETFs':'<strong style="color:var(--gld)">2x Leverage:</strong> Boosts returns in bull markets. A -50% market drop means ~-75% on leveraged portion. Use sparingly.','3x ETFs':'<strong style="color:var(--red)">3x Leverage:</strong> Extraordinary returns possible — extraordinary losses guaranteed in crashes. 15+ year horizon only, 5-10% max.'};
const DE={'Growth Focus':'<strong>Growth Focus:</strong> Reinvested earnings over cash distributions. Best for investors under 40 — compounding growth outperforms dividend income over 15+ year horizons.','Dividend Growth':'<strong style="color:var(--gld)">Dividend Growth:</strong> Companies growing their dividend 5–15%/yr. JNJ at 3.2% today becomes ~8% yield-on-cost in 15 years.','High Yield':'<strong style="color:var(--gld)">High Yield:</strong> 4–8%+ dividend payers. Lower capital appreciation but real cash income now.'};
function updRiskExpl(v){const el=document.getElementById('risk-expl');if(el&&RE[v])el.innerHTML=RE[v];}
function updLevExpl(v){const el=document.getElementById('lev-expl');if(el&&LE[v])el.innerHTML=LE[v];}
function updDivExpl(v){const el=document.getElementById('div-expl');if(el&&DE[v])el.innerHTML=DE[v];}

let pinned=[];
function ssSearch(q){
  const dd=document.getElementById('ss-drop');
  if(!q){dd.classList.remove('show');return;}
  const m=SDB.filter(s=>s.s.startsWith(q.toUpperCase())||s.n.toLowerCase().includes(q.toLowerCase())).slice(0,8);
  if(!m.length){dd.classList.remove('show');return;}
  dd.innerHTML=m.map(s=>`<div class="ss-item" onclick="ssAdd('${s.s}','${s.n.replace(/'/g,"\\'")}','${s.sec||''}')"><div class="ss-sym">${s.s}</div><div class="ss-nm">${s.n}</div><div class="ss-sec">${s.sec||''}</div></div>`).join('');
  dd.classList.add('show');
}
function ssAdd(sym,name,sec){if(pinned.find(p=>p.s===sym))return;pinned.push({s:sym,n:name,sec});document.getElementById('ss-in').value='';document.getElementById('ss-drop').classList.remove('show');renderPins();}
function ssDel(sym){pinned=pinned.filter(p=>p.s!==sym);renderPins();}
function renderPins(){document.getElementById('pinned-list').innerHTML=pinned.map(p=>`<div class="pin-row"><div class="pin-sym">${p.s}</div><div style="font-size:9px;color:var(--mut);flex:1;">${p.n}</div><button class="pin-rm" onclick="ssDel('${p.s}')">×</button></div>`).join('');}
document.addEventListener('click',e=>{if(!e.target.closest('.ss-wr'))document.getElementById('ss-drop').classList.remove('show');});
function fmtD(n){if(n>=1e6)return'$'+(n/1e6).toFixed(2)+'M';if(n>=1e3)return'$'+(n/1e3).toFixed(1)+'K';return'$'+Math.round(n).toLocaleString();}

const SIM_STEPS=[
  {s:'Filtering stock universe…',sub:'Applying sector, risk & management quality filters to 45 stocks'},
  {s:'Scoring CEO quality…',sub:'Analyzing earnings call language patterns and insider signals'},
  {s:'Optimizing allocations…',sub:'Weighting positions by management score and risk profile'},
  {s:'Generating AI theses…',sub:'Writing investment reasoning for each selected holding'},
  {s:'Running 10,000 scenarios…',sub:'Projecting bull, base, and bear case returns for your parameters'},
];
function runSim(){
  const loader=document.getElementById('sim-loader');
  const results=document.getElementById('sim-results');
  if(loader&&results){
    loader.classList.add('on');
    results.style.display='none';
    let step=0;
    const stepEl=document.getElementById('sim-step-txt');
    const subEl=document.getElementById('sim-step-sub');
    const progEl=document.getElementById('sim-prog-fill');
    if(stepEl)stepEl.textContent=SIM_STEPS[0].s;
    if(subEl)subEl.textContent=SIM_STEPS[0].sub;
    if(progEl)progEl.style.width='0%';
    const iv=setInterval(()=>{
      step++;
      if(step>=SIM_STEPS.length){
        clearInterval(iv);
        if(progEl)progEl.style.width='100%';
        setTimeout(()=>{
          loader.classList.remove('on');
          results.style.display='';
          _runSimCore();
        },280);
        return;
      }
      if(stepEl)stepEl.textContent=SIM_STEPS[step].s;
      if(subEl)subEl.textContent=SIM_STEPS[step].sub;
      if(progEl)progEl.style.width=((step+1)/SIM_STEPS.length*100)+'%';
    },460);
    return;
  }
  _runSimCore();
}
function _runSimCore(){
  const start=+document.getElementById('sr-start').value;
  const dca=+document.getElementById('sr-dca').value;
  const hor=+document.getElementById('sr-hor').value;
  const risk=+document.getElementById('sr-risk').value;
  const minMgmt=+document.getElementById('sr-mgmt').value;
  const holdCount=+document.getElementById('sr-holds').value;
  const levEl=document.querySelector('.sp[data-g="lev"].on');
  const lev=levEl?levEl.textContent.trim():'No Leverage';
  const divEl=document.querySelector('.sp[data-g="div"].on');
  const divStyle=divEl?divEl.textContent.trim():'Growth Focus';
  const sectors=[...document.querySelectorAll('#sec-trow .sp.on')].map(t=>t.textContent.trim());

  let pool=[...DB];
  if(sectors.length)pool=pool.filter(s=>sectors.includes(s.sec));
  pool=pool.filter(s=>s.mgmt>=minMgmt);
  if(risk>=8)pool=pool.filter(s=>s.risk>=4);
  else if(risk<=3)pool=pool.filter(s=>s.risk<=5);
  else pool=pool.filter(s=>s.risk>=2&&s.risk<=9);
  if(lev.includes('3x')){const t=DB.find(s=>s.s==='TQQQ');if(t&&!pool.find(s=>s.s==='TQQQ'))pool.push(t);}
  if(divStyle.includes('High Yield')){pool=pool.filter(s=>(s.div||0)>0.5);pool.sort((a,b)=>b.div-a.div);}
  else if(divStyle.includes('Dividend Growth')){pool=pool.filter(s=>(s.div||0)>0.3);pool.sort((a,b)=>b.div-a.div);}
  else pool.sort((a,b)=>(b.mgmt*0.5+(10-b.risk)*0.3)-(a.mgmt*0.5+(10-a.risk)*0.3));

  const pinnedR=pinned.map(p=>DB.find(s=>s.s===p.s)||{s:p.s,n:p.n,sec:p.sec,cap:'Large',div:0,risk:5,mgmt:7.5,thesis:'Manually pinned. Agents will generate a full thesis once connected.',management:'Management analysis pending agent connection.',whyfit:'You pinned this based on your own conviction.',risks:'Full risk analysis pending agent connection.',metrics:[{v:'—',l:'Analyzing'},{v:'—',l:'CEO Score'},{v:'—',l:'Risk'}]});
  const pinnedSyms=pinnedR.map(p=>p.s);
  const filtered=pool.filter(s=>!pinnedSyms.includes(s.s));
  const selected=[...pinnedR,...filtered].slice(0,Math.max(holdCount,pinnedR.length));

  if(!selected.length){document.getElementById('sim-right').innerHTML='<div class="proj-card" style="padding:40px;text-align:center;"><div style="font-size:30px;margin-bottom:10px;">🔍</div><div style="font-family:var(--F);font-size:14px;font-weight:700;margin-bottom:6px;">No stocks match these filters</div><p style="font-size:11px;color:var(--mut);">Try lowering the minimum management score, adding more sectors, or adjusting the risk level.</p></div>';return;}

  const baseRet=Math.min(0.05+(risk/10)*0.12,0.18);
  const levM=lev.includes('3x')?1.4:lev.includes('2x')?1.18:1;
  const rp=Math.pow(1+(baseRet*levM),1/12)-1;
  const n=hor*12;
  const fvS=start*Math.pow(1+rp,n);
  const fvD=dca>0?dca*(Math.pow(1+rp,n)-1)/rp:0;
  const baseV=fvS+fvD;
  const totalInv=start+dca*n;
  const bullV=baseV*(risk>=7?1.65:1.35);
  const bearV=baseV*(risk>=7?0.42:risk>=5?0.60:0.75);
  const bR=v=>Math.round((v/totalInv-1)*100);
  const rLabel=risk>=8?'Aggressive':risk>=6?'Mod-High':risk>=4?'Moderate':'Conservative';
  const rColor=risk>=8?'var(--red)':risk>=5?'var(--gld)':'var(--acc)';
  const avgM=(selected.reduce((s,h)=>s+(h.mgmt||7),0)/selected.length).toFixed(1);
  const divCt=selected.filter(s=>(s.div||0)>0.3).length;
  const totalW=selected.reduce((s,h)=>s+(h.mgmt||7)*(11-(h.risk||5)),0);
  const allocs=selected.map(h=>{const w=((h.mgmt||7)*(11-(h.risk||5)))/totalW;return{...h,pct:(w*100).toFixed(1),dols:Math.round(baseV*w)};});
  const secMap={};allocs.forEach(s=>{secMap[s.sec]=(secMap[s.sec]||0)+1;});
  const secRows=Object.entries(secMap).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([s,c])=>`<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid rgba(28,35,51,.4);"><span style="font-size:10px;">${s}</span><span style="font-family:var(--F);font-size:10px;font-weight:700;">${Math.round(c/selected.length*100)}%</span></div>`).join('');
  const sc={Technology:'var(--blu)','AI / Data':'var(--acc)',Healthcare:'var(--pur)',Financials:'var(--blu)',Consumer:'var(--gld)',Energy:'var(--gld)',Industrials:'var(--mut)','Real Estate':'var(--gld)',Utilities:'var(--blu)',Materials:'var(--gld)'};

  (document.getElementById('sim-results')||document.getElementById('sim-right')).innerHTML=`
    <div class="proj-card" style="margin-bottom:12px;">
      <div class="proj-h"><div class="proj-title">Simulation Results — ${hor}-Year Projection</div><div class="proj-sub">$${start.toLocaleString()} start + $${dca.toLocaleString()}/mo DCA · ${selected.length} holdings · Risk ${risk}/10 · ${lev}</div></div>
      <div class="proj-b">
        <div class="bands">
          <div class="band bull"><div class="band-lbl">Bull Case</div><div class="band-ret">+${bR(bullV)}%</div><div class="band-v">${fmtD(bullV)} final value</div></div>
          <div class="band base"><div class="band-lbl">Base Case</div><div class="band-ret">${bR(baseV)>=0?'+':''}${bR(baseV)}%</div><div class="band-v">${fmtD(baseV)} final value</div></div>
          <div class="band bear"><div class="band-lbl">Bear Case</div><div class="band-ret">${bR(bearV)>=0?'+':''}${bR(bearV)}%</div><div class="band-v">${fmtD(bearV)} final value</div></div>
        </div>
        <div style="height:110px;margin-bottom:11px;"><svg viewBox="0 0 500 110" preserveAspectRatio="none" style="width:100%;height:100%;"><defs><linearGradient id="sg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#00e5a0" stop-opacity="0.24"/><stop offset="100%" stop-color="#00e5a0" stop-opacity="0"/></linearGradient><linearGradient id="sg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4f8cff" stop-opacity="0.16"/><stop offset="100%" stop-color="#4f8cff" stop-opacity="0"/></linearGradient><linearGradient id="sg3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ff4f6d" stop-opacity="0.1"/><stop offset="100%" stop-color="#ff4f6d" stop-opacity="0"/></linearGradient></defs><path d="M0,105 C80,98 160,78 240,52 C310,30 380,12 440,5 C470,2 490,1 500,1 L500,110 L0,110Z" fill="url(#sg1)"/><path d="M0,105 C80,102 160,94 240,80 C310,68 380,52 440,38 C470,32 490,28 500,26 L500,110 L0,110Z" fill="url(#sg2)"/><path d="M0,105 C80,104 160,102 240,98 C310,94 380,90 440,86 C470,84 490,83 500,82 L500,110 L0,110Z" fill="url(#sg3)"/><path d="M0,105 C80,98 160,78 240,52 C310,30 380,12 440,5 C470,2 490,1 500,1" fill="none" stroke="#00e5a0" stroke-width="2.5" stroke-linecap="round"/><path d="M0,105 C80,102 160,94 240,80 C310,68 380,52 440,38 C470,32 490,28 500,26" fill="none" stroke="#4f8cff" stroke-width="1.8" stroke-dasharray="5,3" opacity=".8"/><path d="M0,105 C80,104 160,102 240,98 C310,94 380,90 440,86 C470,84 490,83 500,82" fill="none" stroke="#ff4f6d" stroke-width="1.5" stroke-dasharray="4,4" opacity=".6"/></svg></div>
        <div class="risk-meter"><div style="font-size:9px;color:var(--mut);width:66px;flex-shrink:0;">Portfolio Risk</div><div class="risk-bar"><div class="risk-needle" id="rneedle" style="left:calc(${risk*10-5}% - 7px)"></div></div><div style="font-family:var(--F);font-size:11px;font-weight:700;color:${rColor};">${rLabel}</div></div>
        <div class="srow"><div class="src"><div class="src-v" style="color:var(--acc);">${fmtD(totalInv)}</div><div class="src-l">Total Invested</div></div><div class="src"><div class="src-v" style="color:var(--blu);">${fmtD(baseV)}</div><div class="src-l">Base Case Value</div></div><div class="src"><div class="src-v" style="color:var(--gld);">${avgM}/10</div><div class="src-l">Avg Mgmt Score</div></div><div class="src"><div class="src-v" style="color:var(--pur);">${selected.length}</div><div class="src-l">Holdings</div></div></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:10px;">
          <div style="background:var(--sur);border-radius:var(--rs);padding:11px;"><div style="font-size:9px;color:var(--mut);letter-spacing:.07em;text-transform:uppercase;margin-bottom:7px;">Sector Breakdown</div>${secRows}</div>
          <div style="background:var(--sur);border-radius:var(--rs);padding:11px;"><div style="font-size:9px;color:var(--mut);letter-spacing:.07em;text-transform:uppercase;margin-bottom:7px;">Portfolio DNA</div>
            <div style="font-size:10px;display:flex;flex-direction:column;gap:4px;">
              <div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid rgba(28,35,51,.4);"><span style="color:var(--mut);">Starting amount</span><span style="font-family:var(--F);font-weight:700;">${fmtD(start)}</span></div>
              <div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid rgba(28,35,51,.4);"><span style="color:var(--mut);">Monthly DCA</span><span style="font-family:var(--F);font-weight:700;">${fmtD(dca)}/mo</span></div>
              <div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid rgba(28,35,51,.4);"><span style="color:var(--mut);">Dividend payers</span><span style="font-family:var(--F);font-weight:700;color:var(--gld);">${divCt}/${selected.length}</span></div>
              <div style="display:flex;justify-content:space-between;padding:3px 0;"><span style="color:var(--mut);">Avg mgmt score</span><span style="font-family:var(--F);font-weight:700;color:var(--acc);">${avgM}/10</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card" style="margin-bottom:12px;">
      <div class="ch"><div><div class="ct">Holdings (${selected.length})</div><div class="cs">Click "Full Thesis" for AI reasoning, CEO score, and agent framework notes</div></div><span class="tag tg">Avg mgmt: ${avgM}/10</span></div>
      <div class="cb" style="padding:0 13px;">
        <div style="display:flex;flex-direction:column;">
          ${allocs.map(h=>`<div class="hp-row"><div class="hp-sym">${h.s}${pinned.find(p=>p.s===h.s)?'📌':''}</div><div class="hp-info"><div class="hp-name">${h.n}</div><div class="hp-ind">${h.sec} · ${h.cap} Cap · ${h.pct}% = ${fmtD(h.dols)}</div></div><span style="font-size:8px;padding:2px 6px;border-radius:100px;background:rgba(255,255,255,.05);color:${sc[h.sec]||'var(--mut)'};white-space:nowrap;">${h.sec}</span><div style="text-align:right;flex-shrink:0;"><div style="font-size:9px;color:var(--mut);">${h.pct}%</div><div style="font-size:9px;color:var(--acc);">Mgmt ${(h.mgmt||7).toFixed(1)}</div></div><button class="hp-tb" onclick="openThesis('${h.s}')">Full Thesis ⚡</button></div>`).join('')}
        </div>
      </div>
    </div>
    <div class="agent-note"><div style="font-size:9px;color:var(--acc);letter-spacing:.1em;text-transform:uppercase;margin-bottom:5px;">🤖 Agent Integration Ready</div><p style="font-size:11px;color:var(--mut);line-height:1.7;">Every thesis above is structured to feed your learning agents. When connected, agents will update these theses in real-time from earnings calls, Form 4 insider filings, and macro events. Each position is sized to your exact investment — <strong style="color:var(--tex);">${fmtD(start)} starting + ${fmtD(dca)}/mo</strong>.</p></div>`;
  setTimeout(()=>{const n=document.getElementById('rneedle');if(n)n.style.left=`calc(${risk*10-5}% - 7px)`;},80);
} // end _runSimCore

// ════════════════════════════════════════
// LEARN TABS (overridden below with adaptive quiz support)
// ════════════════════════════════════════
function runSleep(el,yr,name,pct,recov){
  document.querySelectorAll('.slp-c').forEach(c=>c.classList.remove('on'));el.classList.add('on');
  const v=12847,lost=Math.abs(Math.round(v*pct/100)),rem=v-lost;
  document.getElementById('slp-msg').textContent=`Portfolio dropped ${pct}% in the ${name}`;
  document.getElementById('slp-sub').textContent=`Value: $${rem.toLocaleString()} · Down $${lost.toLocaleString()}`;
  document.getElementById('slp-loss').textContent=`-$${lost.toLocaleString()}`;
  document.getElementById('slp-rec').textContent=`${recov} mo.`;
  document.getElementById('slp-txt').innerHTML=`After the <strong>${name}</strong>, markets recovered in <strong>${recov} months</strong>. AlphaGen's DCA kept buying at lower prices — turning the crash into a buying opportunity. Investors who held and kept DCA running recovered fastest.`;
  document.getElementById('slp-res').classList.add('on');
}
setTimeout(()=>{const sc=document.querySelector('.slp-c.on');if(sc)runSleep(sc,'2020','COVID Crash',-34,5);},100);

// Old quiz functions removed — replaced by adaptive quiz system below

// ════════════════════════════════════════
// MISC
// ════════════════════════════════════════
function copyRef(btn){navigator.clipboard.writeText('https://alphagen.app/ref/ALEX47').catch(()=>{});btn.textContent='Copied ✓';btn.style.background='var(--blu)';setTimeout(()=>{btn.textContent='Copy';btn.style.background='';},2000);}

// ════════════════════════════════════════
// MOBILE SIDEBAR
// ════════════════════════════════════════
function toggleSidebar(){
  const sb=document.getElementById('sb');
  const ov=document.getElementById('sb-overlay');
  const isOpen=sb.classList.contains('open');
  sb.classList.toggle('open',!isOpen);
  ov.classList.toggle('on',!isOpen);
  document.body.style.overflow=isOpen?'':'hidden';
}
function closeSidebar(){
  const sb=document.getElementById('sb');
  const ov=document.getElementById('sb-overlay');
  if(sb.classList.contains('open')){
    sb.classList.remove('open');
    ov.classList.remove('on');
    document.body.style.overflow='';
  }
}
// Only lock scroll on mobile
window.addEventListener('resize',()=>{if(window.innerWidth>768)closeSidebar();});

// ════════════════════════════════════════
// KEYBOARD SHORTCUTS
// ════════════════════════════════════════
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    closeWhy();
    closeThesis();
    closeCheckin();
    closeSidebar();
    closeLogin();
  }
});

// ════════════════════════════════════════
// PAGE META — add stocks page
// ════════════════════════════════════════
PM.stocks={t:'Stocks',s:'Research 45+ stocks — AI buy/hold/sell signals with price targets'};

// ════════════════════════════════════════
// LIVE PRICES — Yahoo Finance via CORS proxy
// ════════════════════════════════════════
const LIVE_PRICES={};
const ALL_SYMS=DB.map(s=>s.s).concat(['NFLX','SPOT','UBER','HD','SBUX','BRKB','LMT','CAT','DE','GOOGL','AAPL']);

async function fetchLivePrices(){
  const syms=ALL_SYMS.join(',');
  const yf=`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${syms}&fields=regularMarketPrice,regularMarketChangePercent,regularMarketPreviousClose,fiftyTwoWeekHigh,fiftyTwoWeekLow,marketCap,trailingPE`;
  const badge=document.getElementById('price-status');
  try{
    // Try direct first, then proxy
    let resp=null;
    try{resp=await fetch(yf,{signal:AbortSignal.timeout(4000)});}catch{}
    if(!resp||!resp.ok){
      resp=await fetch('https://corsproxy.io/?'+encodeURIComponent(yf),{signal:AbortSignal.timeout(8000)});
    }
    const json=await resp.json();
    const quotes=json?.quoteResponse?.result||[];
    quotes.forEach(q=>{
      LIVE_PRICES[q.symbol]={
        price:q.regularMarketPrice,
        change:q.regularMarketChangePercent,
        prev:q.regularMarketPreviousClose,
        high52:q.fiftyTwoWeekHigh,
        low52:q.fiftyTwoWeekLow,
        mcap:q.marketCap,
        pe:q.trailingPE,
      };
      // Sync into liveP for the ticker
      if(liveP[q.symbol]){
        liveP[q.symbol].price=q.regularMarketPrice;
        liveP[q.symbol].base=q.regularMarketPreviousClose||q.regularMarketPrice;
        liveP[q.symbol].change=q.regularMarketChangePercent;
      }
    });
    if(badge)badge.textContent='Live · Updated '+new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
    // Refresh the stock grid if on stocks page
    if(document.getElementById('pg-stocks')?.classList.contains('on'))renderStockGrid(currentStockFilter);
    // Update ticker
    updateTickerFromLive();
  }catch(e){
    if(badge)badge.textContent='Simulated (live fetch failed)';
    console.log('Live price fetch failed, using simulation');
  }
}

function updateTickerFromLive(){
  document.querySelectorAll('.tki').forEach(el=>{
    const sym=el.querySelector('.tks')?.textContent;
    const d=LIVE_PRICES[sym];if(!d)return;
    const pEl=el.querySelector('.tkp'),cEl=el.querySelector('.tkc');
    if(pEl)pEl.textContent='$'+d.price.toFixed(2);
    if(cEl){
      cEl.textContent=(d.change>=0?'+':'')+d.change.toFixed(2)+'%';
      cEl.className='tkc '+(d.change>=0?'up':'dn');
    }
  });
}

function getLivePrice(sym){
  return LIVE_PRICES[sym]?.price||liveP[sym]?.price||100;
}
function getLiveChange(sym){
  return LIVE_PRICES[sym]?.change??liveP[sym]?.change??0;
}

// Fetch on load and every 30 seconds
fetchLivePrices();
setInterval(fetchLivePrices,30000);

// ════════════════════════════════════════
// PRICE TARGETS
// ════════════════════════════════════════
const SECTOR_RETURNS={'Technology':0.155,'AI / Data':0.20,'Healthcare':0.115,'Financials':0.10,'Consumer':0.085,'Energy':0.078,'Industrials':0.088,'Real Estate':0.072,'Utilities':0.062,'Materials':0.075};
function getPriceTargets(sym){
  const d=DB.find(s=>s.s===sym);
  if(!d)return{yr1:{price:'-',ret:'-'},yr5:{price:'-',ret:'-'},yr10:{price:'-',ret:'-'}};
  const price=getLivePrice(sym);
  const quality=d.mgmt/10;
  const baseAnnual=(SECTOR_RETURNS[d.sec]||0.10)*quality*(1-d.risk*0.02);
  const yr1=price*(1+baseAnnual*0.92);
  const yr5=price*Math.pow(1+baseAnnual*0.88,5);
  const yr10=price*Math.pow(1+baseAnnual*0.82,10);
  const pct=(v,base)=>(v>=base?'+':'')+((v/base-1)*100).toFixed(0)+'%';
  const fmt=v=>v>=1000?'$'+Math.round(v).toLocaleString():'$'+v.toFixed(0);
  return{
    yr1:{price:fmt(yr1),ret:pct(yr1,price),raw:yr1},
    yr5:{price:fmt(yr5),ret:pct(yr5,price),raw:yr5},
    yr10:{price:fmt(yr10),ret:pct(yr10,price),raw:yr10},
  };
}

// ════════════════════════════════════════
// STOCK-SPECIFIC AGENT LOG
// ════════════════════════════════════════
function getStockAgentLog(sym){
  const d=DB.find(s=>s.s===sym);if(!d)return[];
  const newsCount=NEWS_POOL.filter(n=>n.sym===sym).length;
  const insiderNews=AGENT_LOG.find(e=>e.sym===sym);
  const logs=[
    {ico:'🔍',body:`Signal confirmed: <strong>${{strong:'STRONG HOLD',hold:'HOLD',watch:'WATCH',swap:'CONSIDER SWAP'}[d.signalType]||'HOLD'}</strong> — AI confidence ${d.confidence}%`,time:'6:30 AM'},
    {ico:'🧠',body:`CEO quality score: <strong>${d.mgmt}/10</strong> — re-evaluated from latest earnings call language analysis`,time:'6:15 AM'},
    {ico:'📰',body:`News scan complete: <strong>${newsCount>0?newsCount+' relevant stories':'No major stories'}</strong> found matching ${sym} this session`,time:'5:50 AM'},
  ];
  if(insiderNews)logs.unshift({ico:'🔍',body:insiderNews.body,time:'9:15 AM'});
  if(d.swapSuggestion)logs.push({ico:'↕',body:`Swap candidate flagged: consider <strong>${d.swapSuggestion.sym}</strong> — ${d.swapSuggestion.reason.substring(0,80)}…`,time:'Yesterday'});
  logs.push({ico:'❤️',body:`Risk score: <strong>${d.risk}/10</strong> — ${d.risk<=3?'conservative, low drawdown risk':d.risk<=6?'moderate volatility expected':'high volatility — ensure position sizing is correct'}`,time:'Yesterday'});
  return logs;
}

// ════════════════════════════════════════
// STOCKS PAGE
// ════════════════════════════════════════
let currentStockFilter='all';
let currentStockSym=null;
let currentSpTab='overview';

function renderStockGrid(filter='all',query=''){
  currentStockFilter=filter;
  const grid=document.getElementById('stk-grid');if(!grid)return;
  let stocks=[...DB,...SDB.filter(s=>!DB.find(d=>d.s===s.s))];
  if(filter==='dividend')stocks=stocks.filter(s=>(s.div||0)>0.5);
  else if(filter!=='all')stocks=stocks.filter(s=>s.sec===filter);
  if(query)stocks=stocks.filter(s=>s.s.includes(query.toUpperCase())||s.n.toLowerCase().includes(query.toLowerCase()));
  const sigStyle={strong:'background:var(--acc);color:var(--bg)',hold:'background:var(--adim);color:var(--acc)',watch:'background:var(--gdim);color:var(--gld)',swap:'background:var(--rdim);color:var(--red)'};
  const sigLabel={strong:'⚡ STRONG HOLD',hold:'✓ HOLD',watch:'⚠ WATCH',swap:'↕ REVIEW'};
  grid.innerHTML=stocks.map(s=>{
    const price=getLivePrice(s.s);
    const change=getLiveChange(s.s);
    const st=s.signalType||'hold';
    return`<div class="stk-card" onclick="openStockDetail('${s.s}')">
      <div class="stk-sym">${s.s}</div>
      <div class="stk-name">${s.n}</div>
      <div class="stk-price ${change>=0?'up':'dn'}">\$${price>=1000?price.toFixed(0):price.toFixed(2)}</div>
      <div class="stk-chg ${change>=0?'up':'dn'}">${change>=0?'▲ +':'▼ '}${Math.abs(change).toFixed(2)}%</div>
      <div class="stk-footer">
        <span class="stk-sig" style="${sigStyle[st]||sigStyle.hold}">${sigLabel[st]||'HOLD'}</span>
        <span class="stk-meta">CEO ${s.mgmt||7}/10</span>
      </div>
    </div>`;
  }).join('');
}

function filterByTab(tab,el){
  document.querySelectorAll('.stk-tab').forEach(t=>t.classList.remove('on'));
  el.classList.add('on');
  renderStockGrid(tab,document.getElementById('stk-search')?.value||'');
}

function filterStockGrid(q){
  renderStockGrid(currentStockFilter,q);
}

// ════════════════════════════════════════
// STOCK DETAIL PANEL
// ════════════════════════════════════════
function openStockDetail(sym){
  currentStockSym=sym;currentSpTab='overview';
  const d=DB.find(s=>s.s===sym);if(!d)return;
  const price=getLivePrice(sym);
  const change=getLiveChange(sym);
  document.getElementById('sp-sym').textContent=sym;
  document.getElementById('sp-name').textContent=d.n+' · '+(d.cap||'Large')+' Cap';
  document.getElementById('sp-sector').textContent=d.sec;
  document.getElementById('sp-price').textContent='$'+(price>=1000?price.toFixed(0):price.toFixed(2));
  const chgEl=document.getElementById('sp-chg');
  chgEl.textContent=(change>=0?'▲ +':'▼ ')+Math.abs(change).toFixed(2)+'% today';
  chgEl.className='sp-chg '+(change>=0?'up':'dn');
  // Reset tabs
  document.querySelectorAll('.sp-tab').forEach(t=>t.classList.toggle('on',t.textContent.trim()==='Overview'));
  renderSpContent('overview');
  document.getElementById('stk-panel').classList.add('open');
  document.getElementById('stk-overlay').classList.add('on');
  document.body.style.overflow='hidden';
}

function closeStockPanel(){
  document.getElementById('stk-panel').classList.remove('open');
  document.getElementById('stk-overlay').classList.remove('on');
  document.body.style.overflow='';
}

function spTab(tab,el){
  document.querySelectorAll('.sp-tab').forEach(t=>t.classList.remove('on'));
  el.classList.add('on');
  currentSpTab=tab;
  renderSpContent(tab);
}

function renderSpContent(tab){
  const sym=currentStockSym;
  const d=DB.find(s=>s.s===sym);
  if(!d)return;
  const el=document.getElementById('sp-content');if(!el)return;
  const price=getLivePrice(sym);
  const change=getLiveChange(sym);
  const targets=getPriceTargets(sym);
  const ld=LIVE_PRICES[sym];
  const sigStyle={strong:'background:var(--acc);color:var(--bg)',hold:'background:var(--adim);color:var(--acc)',watch:'background:var(--gdim);color:var(--gld)',swap:'background:var(--rdim);color:var(--red)'};
  const sigLabel={strong:'⚡ STRONG HOLD',hold:'✓ HOLD',watch:'⚠ WATCH',swap:'↕ CONSIDER SWAP'};

  if(tab==='overview'){
    const pe=ld?.pe?`<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid rgba(28,35,51,.4)"><span style="font-size:10px;color:var(--mut)">P/E Ratio</span><span style="font-family:var(--F);font-size:10px;font-weight:700">${ld.pe.toFixed(1)}x</span></div>`:'';
    const high52=ld?.high52?`<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid rgba(28,35,51,.4)"><span style="font-size:10px;color:var(--mut)">52-Week High</span><span style="font-family:var(--F);font-size:10px;font-weight:700">$${ld.high52.toFixed(2)}</span></div>`:'';
    const low52=ld?.low52?`<div style="display:flex;justify-content:space-between;padding:5px 0"><span style="font-size:10px;color:var(--mut)">52-Week Low</span><span style="font-family:var(--F);font-size:10px;font-weight:700">$${ld.low52.toFixed(2)}</span></div>`:'';
    el.innerHTML=`
      <div class="sig-block">
        <span class="sig-block-badge" style="${sigStyle[d.signalType]||sigStyle.hold}">${sigLabel[d.signalType]||'HOLD'}</span>
        <div class="sig-block-right">
          <div class="sig-conf-row"><span>AI Confidence</span><strong>${d.confidence||80}%</strong></div>
          <div class="sig-conf-bar"><div class="sig-conf-fill" style="width:${d.confidence||80}%;background:${d.confidence>=85?'var(--acc)':d.confidence>=65?'var(--gld)':'var(--red)'};"></div></div>
        </div>
      </div>
      <div style="font-size:9px;color:var(--mut);letter-spacing:.09em;text-transform:uppercase;margin-bottom:7px;">Price Targets</div>
      <div class="target-grid">
        <div class="tgt-card"><div class="tgt-period">1 Year</div><div class="tgt-price">${targets.yr1.price}</div><div class="tgt-ret up">${targets.yr1.ret}</div></div>
        <div class="tgt-card"><div class="tgt-period">5 Years</div><div class="tgt-price">${targets.yr5.price}</div><div class="tgt-ret up">${targets.yr5.ret}</div></div>
        <div class="tgt-card"><div class="tgt-period">10 Years</div><div class="tgt-price">${targets.yr10.price}</div><div class="tgt-ret up">${targets.yr10.ret}</div></div>
      </div>
      <div style="font-size:9px;color:var(--mut);letter-spacing:.09em;text-transform:uppercase;margin-bottom:7px;">Key Metrics</div>
      <div style="background:var(--card);border-radius:var(--rs);padding:9px 12px;">
        <div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid rgba(28,35,51,.4)"><span style="font-size:10px;color:var(--mut)">CEO Score</span><span style="font-family:var(--F);font-size:10px;font-weight:700;color:var(--acc)">${d.mgmt}/10</span></div>
        <div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid rgba(28,35,51,.4)"><span style="font-size:10px;color:var(--mut)">Risk Score</span><span style="font-family:var(--F);font-size:10px;font-weight:700;color:${d.risk>=8?'var(--red)':d.risk>=5?'var(--gld)':'var(--acc)'}">${d.risk}/10</span></div>
        <div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid rgba(28,35,51,.4)"><span style="font-size:10px;color:var(--mut)">Dividend Yield</span><span style="font-family:var(--F);font-size:10px;font-weight:700;color:var(--gld)">${(d.div||0)>0?d.div+'%':'None'}</span></div>
        ${pe}${high52}${low52}
        <div style="display:flex;justify-content:space-between;padding:5px 0"><span style="font-size:10px;color:var(--mut)">Sector</span><span style="font-family:var(--F);font-size:10px;font-weight:700">${d.sec}</span></div>
      </div>
      <div style="margin-top:12px;display:flex;gap:8px;">
        <button class="btn bpri" style="flex:1;" onclick="openWhy('${sym}')">Full AI Thesis 💡</button>
        <button class="btn bout" onclick="openBrokerModal()">Trade via Brokerage →</button>
      </div>`;
  }else if(tab==='thesis'){
    el.innerHTML=`
      <div style="font-size:9px;color:var(--mut);letter-spacing:.09em;text-transform:uppercase;margin-bottom:7px;">Investment Thesis</div>
      <div style="font-size:11px;color:var(--tex);line-height:1.75;margin-bottom:13px;">${d.thesis||'Thesis loading…'}</div>
      <div style="font-size:9px;color:var(--mut);letter-spacing:.09em;text-transform:uppercase;margin-bottom:7px;">Why It Fits Your Portfolio</div>
      <div style="font-size:11px;color:var(--tex);line-height:1.75;margin-bottom:13px;">${d.whyfit||''}</div>
      <div class="mmgrid">${(d.metrics||[]).map(m=>`<div style="background:var(--sur);border-radius:var(--rs);padding:9px;text-align:center;"><div style="font-family:var(--F);font-size:15px;font-weight:800;color:var(--acc);">${m.v}</div><div style="font-size:8px;color:var(--mut);margin-top:1px;text-transform:uppercase;letter-spacing:.05em;">${m.l}</div></div>`).join('')}</div>`;
  }else if(tab==='agent'){
    const logs=getStockAgentLog(sym);
    el.innerHTML=`
      <div class="stk-agent-card">
        <div class="sac-head"><div class="sac-dot"></div><div class="sac-title">🤖 ${sym} Dedicated Agent</div><div class="sac-time">Active now</div></div>
        <div class="sac-log">${logs.map(e=>`<div class="sal-row"><span class="sal-ico">${e.ico}</span><span style="flex:1;">${e.body}</span><span class="sal-time">${e.time}</span></div>`).join('')}</div>
      </div>
      <div style="font-size:9px;color:var(--mut);letter-spacing:.09em;text-transform:uppercase;margin-bottom:7px;">Agent Signal Summary</div>
      <div style="font-size:10px;color:var(--mut);line-height:1.75;background:var(--card);border-radius:var(--rs);padding:11px 13px;">${d.reason||'Signal analysis loading…'}</div>`;
  }else if(tab==='risks'){
    const relatedNews=NEWS_POOL.filter(n=>n.sym===sym||n.sym==='MACRO').slice(0,3);
    el.innerHTML=`
      <div style="font-size:9px;color:var(--red);letter-spacing:.09em;text-transform:uppercase;margin-bottom:7px;">Key Risks</div>
      <div style="font-size:11px;color:var(--tex);line-height:1.75;background:var(--rdim);border:1px solid rgba(255,79,109,.12);border-radius:var(--rs);padding:11px 13px;margin-bottom:13px;">${d.risks||'Risk analysis loading…'}</div>
      ${d.swapSuggestion?`<div style="background:var(--sur);border:1px solid var(--bdr);border-radius:var(--rs);padding:11px 13px;margin-bottom:13px;">
        <div style="font-size:9px;color:var(--gld);letter-spacing:.09em;text-transform:uppercase;margin-bottom:5px;">↕ Swap Candidate</div>
        <div style="font-size:11px;font-family:var(--F);font-weight:700;margin-bottom:3px;">${d.swapSuggestion.sym}</div>
        <div style="font-size:10px;color:var(--mut);">${d.swapSuggestion.reason}</div>
      </div>`:''}
      ${relatedNews.length?`<div style="font-size:9px;color:var(--mut);letter-spacing:.09em;text-transform:uppercase;margin-bottom:7px;">Related News</div>`:''}
      ${relatedNews.map(n=>`<div style="padding:8px 0;border-bottom:1px solid rgba(28,35,51,.4);"><div style="font-family:var(--F);font-size:10px;font-weight:700;margin-bottom:2px;">${n.title}</div><div style="font-size:9px;color:var(--mut);">${n.src} · ${n.time}</div></div>`).join('')}`;
  }
}

// ════════════════════════════════════════
// BROKERAGE MODAL
// ════════════════════════════════════════
function openBrokerModal(){
  document.getElementById('broker-modal').classList.add('on');
  document.body.style.overflow='hidden';
}
function closeBrokerModal(){
  document.getElementById('broker-modal').classList.remove('on');
  document.body.style.overflow='';
}
function selectBroker(broker){
  closeBrokerModal();
  // Show connecting state — backend OAuth flow would go here
  const toast=document.createElement('div');
  toast.style.cssText='position:fixed;bottom:20px;right:20px;background:var(--card);border:1px solid var(--aglow);border-radius:var(--r);padding:14px 18px;z-index:900;font-size:12px;color:var(--tex);box-shadow:0 8px 28px rgba(0,0,0,.5);max-width:320px;animation:pgIn .3s ease;';
  const name=broker==='robinhood'?'Robinhood':'Webull';
  toast.innerHTML=`<div style="font-family:var(--F);font-weight:800;font-size:13px;color:var(--acc);margin-bottom:4px;">🔗 Connecting to ${name}…</div>
  <div style="color:var(--mut);font-size:11px;line-height:1.6;">SnapTrade OAuth integration is in active development. Join the waitlist to be first when it launches — your trades will sync automatically.</div>
  <button class="btn bpri" style="margin-top:10px;width:100%;font-size:11px;" onclick="openLogin();this.closest('div[style]').remove()">Join Waitlist →</button>`;
  document.body.appendChild(toast);
  setTimeout(()=>{if(toast.parentNode)toast.remove();},8000);
}

// Stocks page init is triggered from the nav item onclick directly

// ════════════════════════════════════════
// LIVE PRICE SIMULATION
// ════════════════════════════════════════
const liveP={};
(()=>{
  const initP={NVDA:134.72,MSFT:420.18,AMZN:228.90,META:612.45,PLTR:92.30,AVGO:198.40,JNJ:158.20,LLY:812.40,AAPL:238.55,AMD:132.50,V:284.20,COST:942.10,NOW:1042.30,GS:512.80,TSLA:248.70,ABBV:172.10,CRWD:342.50,PANW:185.20};
  Object.keys(initP).forEach(k=>{liveP[k]={price:initP[k],base:initP[k],change:0};});
})();
let portBase=12847;
function tickPrices(){
  let totalMov=0,ct=0;
  document.querySelectorAll('.tki').forEach(el=>{
    const sym=el.querySelector('.tks')?.textContent;
    if(!liveP[sym])return;
    const d=liveP[sym];
    const move=(Math.random()-0.499)*0.08;
    d.price=+(d.price*(1+move/100)).toFixed(2);
    d.change=(d.price/d.base-1)*100;
    totalMov+=move;ct++;
    const pEl=el.querySelector('.tkp'),cEl=el.querySelector('.tkc');
    if(pEl)pEl.textContent='$'+d.price.toFixed(2);
    if(cEl){cEl.textContent=(d.change>=0?'+':'')+d.change.toFixed(2)+'%';cEl.className='tkc '+(d.change>=0?'up':'dn');}
    el.classList.add(move>0?'flash-up':'flash-dn');
    setTimeout(()=>el.classList.remove('flash-up','flash-dn'),700);
  });
  // Update holdings table prices
  document.querySelectorAll('#h-body tr').forEach(tr=>{
    const sym=tr.querySelector('.hsym')?.textContent;
    if(!sym||!liveP[sym])return;
    const cells=tr.querySelectorAll('td');
    if(cells[2]){
      cells[2].textContent='$'+liveP[sym].price.toFixed(2);
      cells[2].classList.add(liveP[sym].change>=0?'flash-up':'flash-dn');
      setTimeout(()=>cells[2].classList.remove('flash-up','flash-dn'),700);
    }
    if(cells[3]){
      const c=liveP[sym].change;
      cells[3].innerHTML=`<span class="${c>=0?'up':'dn'}">${c>=0?'+':''}${c.toFixed(2)}%</span>`;
    }
  });
  // Update portfolio total
  if(ct>0){
    const drift=(totalMov/ct)*3.2;
    portBase=portBase*(1+drift/10000);
    const pv=document.getElementById('port-total');
    const pc=document.getElementById('port-chg');
    if(pv)pv.textContent='$'+Math.round(portBase).toLocaleString();
    const totalChg=((portBase/12847)-1)*100;
    if(pc)pc.textContent=(totalChg>=0?'▲ +':'▼ ')+Math.abs(totalChg).toFixed(2)+'% today';
    if(pc)pc.className='sdx '+(totalChg>=0?'up':'dn');
  }
}
setInterval(tickPrices,3500);

// ════════════════════════════════════════
// AGENT BAR & LOG
// ════════════════════════════════════════
function renderAgents(){
  const bar=document.getElementById('agent-bar');
  if(!bar||typeof AGENTS_DEF==='undefined')return;
  bar.innerHTML=AGENTS_DEF.map(a=>`
    <div class="agent-chip ${a.status==='proc'?'proc':''}" title="${a.desc}">
      <div class="agent-dot"></div>
      <div class="agent-label">
        <div class="agent-name">${a.icon} ${a.name}</div>
        <div class="agent-time">${a.time}</div>
      </div>
    </div>`).join('');
}
function renderAgentLog(){
  const log=document.getElementById('agent-log');
  if(!log||typeof AGENT_LOG==='undefined')return;
  log.innerHTML=AGENT_LOG.map(e=>`
    <div class="act-entry">
      <span class="act-ico">${e.ico}</span>
      <div class="act-body"><span class="act-sym">${e.sym}</span>${e.body}</div>
      <span class="act-time">${e.time}</span>
    </div>`).join('');
}

// ════════════════════════════════════════
// MORNING BRIEF
// ════════════════════════════════════════
function renderMorningBrief(){
  const el=document.getElementById('brief-items');
  if(!el)return;
  const portfolio=['NVDA','MSFT','AMZN','META','PLTR','AVGO','JNJ'];
  const sigMap={strong:{label:'⚡ Strong Hold',color:'var(--acc)',bg:'var(--adim)'},hold:{label:'✓ Hold',color:'var(--acc)',bg:'var(--adim)'},watch:{label:'⚠ Watch',color:'var(--gld)',bg:'var(--gdim)'},swap:{label:'↕ Review',color:'var(--red)',bg:'var(--rdim)'}};
  el.innerHTML=portfolio.map(sym=>{
    const d=DB.find(s=>s.s===sym);if(!d)return'';
    const sig=sigMap[d.signalType]||sigMap.hold;
    const shortReason=d.reason.length>80?d.reason.substring(0,80)+'…':d.reason;
    return`<div class="brief-row">
      <span class="brief-sym">${sym}</span>
      <span class="brief-sig" style="color:${sig.color};background:${sig.bg};">${sig.label}</span>
      <span style="flex:1;">${shortReason}</span>
    </div>`;
  }).join('');
  // Update timestamp
  const ts=document.getElementById('brief-ts');
  const now=new Date();
  if(ts)ts.textContent=now.toLocaleDateString('en-US',{month:'short',day:'numeric'});
}

// ════════════════════════════════════════
// DYNAMIC NEWS FEED
// ════════════════════════════════════════
let newsIdx=0;
function renderNewsFeed(){
  const feed=document.getElementById('news-feed');
  if(!feed||typeof NEWS_POOL==='undefined')return;
  // Show 5 most recent items, rotating
  const items=[];
  for(let i=0;i<5;i++)items.push(NEWS_POOL[(newsIdx+i)%NEWS_POOL.length]);
  const tagColor={up:'var(--acc)',div:'var(--gld)',neu:'var(--mut)',warn:'var(--red)'};
  feed.innerHTML=items.map((n,i)=>`
    <div class="news-item">
      <div class="ni-ico">${n.ico}</div>
      <div style="flex:1;">
        <div class="ni-sym">${n.sym}</div>
        <div class="ni-title">${n.title}</div>
        <div class="ni-meta">${n.src} · ${n.time}</div>
        <div class="ni-imp ${n.tag==='up'?'up':''}" style="${n.tag==='div'?'color:var(--gld)':n.tag==='warn'?'color:var(--red)':''}">${n.imp}</div>
        <span class="ni-expand" onclick="toggleAI(this)">🤖 AI Analysis ↓</span>
        <div class="ni-ai">${n.ai}</div>
      </div>
    </div>`).join('');
}
function toggleAI(el){
  const ai=el.nextElementSibling;
  if(!ai)return;
  ai.classList.toggle('show');
  el.textContent=ai.classList.contains('show')?'🤖 AI Analysis ↑':'🤖 AI Analysis ↓';
}
// Rotate news every 45 seconds
setInterval(()=>{newsIdx=(newsIdx+1)%NEWS_POOL.length;renderNewsFeed();},45000);

// ════════════════════════════════════════
// ADAPTIVE QUIZ (20-question pool)
// ════════════════════════════════════════
let aqStep=0,aqAnswers={},aqQueue=[];
const AQ_PROFILE_LABELS={horizon:'Time Horizon',risk:'Risk Profile',sector:'Sector Focus',goal:'Primary Goal',experience:'Experience',dca:'DCA Budget',concentration:'Portfolio Style',signals:'Signal Preference',discipline:'Discipline',macro:'Macro Awareness',leverage:'Leverage',dividend:'Dividend Pref',intl:'International',esg:'ESG',engagement:'Engagement',autonomy:'AI Autonomy',psychology:'Psychology'};

function initAdaptiveQuiz(){
  if(typeof QUIZ_POOL==='undefined')return;
  aqStep=0;aqAnswers={};
  // Start with first 4 core questions, unlock more based on answers
  aqQueue=QUIZ_POOL.slice(0,4).map(q=>q.id);
  renderAQ();
}
function renderAQ(){
  const wrap=document.getElementById('adaptive-quiz-wrap');
  if(!wrap)return;
  const qId=aqQueue[aqStep];
  const q=QUIZ_POOL.find(x=>x.id===qId);
  if(!q){renderAQResult();return;}
  const answered=Object.keys(aqAnswers);
  const profileTags=answered.map(id=>{
    const qd=QUIZ_POOL.find(x=>x.id===id);
    if(!qd)return'';
    const ans=aqAnswers[id];
    const opt=qd.opts.find(o=>o.k===ans);
    return`<span class="qp-tag">${opt?opt.t.substring(0,18):ans}</span>`;
  }).join('');
  const pct=Math.round((aqStep/(aqQueue.length||4))*100);
  wrap.innerHTML=`
    <div class="qwrap">
      ${answered.length>0?`<div class="quiz-profile-bar">${profileTags}</div>`:''}
      <div class="quiz-count"><span>Question ${aqStep+1} of ${aqQueue.length}+</span><span style="color:var(--acc);">${answered.length} answered · Profile ${pct}% complete</span></div>
      <div class="qdots" id="aq-dots">${aqQueue.map((_,i)=>`<div class="qd ${i<aqStep?'done':i===aqStep?'now':''}"></div>`).join('')}</div>
      <div class="qq">${q.q}</div>
      <div class="qhint">${q.hint}</div>
      <div class="qopts">${q.opts.map(o=>`
        <div class="qopt ${aqAnswers[q.id]===o.k?'on':''}" onclick="aqPick('${q.id}','${o.k}',this)">
          <div class="qkey">${o.k}</div>${o.t}
        </div>`).join('')}</div>
      <div class="qnav">
        ${aqStep>0?`<button class="btn bout" onclick="aqBack()">← Back</button>`:'<span></span>'}
        <span class="qct">${aqStep+1} / ${aqQueue.length}+</span>
        <button class="btn bpri" onclick="aqNext()">${aqStep===aqQueue.length-1?'See My Profile →':'Next →'}</button>
      </div>
      ${aqQueue.length<QUIZ_POOL.length&&aqStep===aqQueue.length-1?`<button class="quiz-more-btn" onclick="aqAddMore()">+ More questions — refine my profile further</button>`:''}
    </div>`;
}
function aqPick(qId,key,el){
  aqAnswers[qId]=key;
  document.querySelectorAll('.qopt').forEach(o=>o.classList.remove('on'));
  el.classList.add('on');
  // Unlock relevant follow-up questions
  aqUnlock(qId,key);
}
function aqUnlock(qId,key){
  const allIds=QUIZ_POOL.map(q=>q.id);
  const inQueue=new Set(aqQueue);
  // Adaptive rules
  if(qId==='goal'&&key==='B'&&!inQueue.has('dividend_use'))aqQueue.push('dividend_use');
  if(qId==='goal'&&(key==='A'||key==='C')&&!inQueue.has('concentration'))aqQueue.push('concentration');
  if(qId==='crash'&&key==='A'&&!inQueue.has('sleep_number'))aqQueue.push('sleep_number');
  if(qId==='crash'&&key==='D'&&!inQueue.has('leverage'))aqQueue.push('leverage');
  if(qId==='experience'&&(key==='C'||key==='D')&&!inQueue.has('insider'))aqQueue.push('insider');
  if(qId==='sector'&&key==='A'&&!inQueue.has('international'))aqQueue.push('international');
  if(qId==='horizon'&&(key==='C'||key==='D')&&!inQueue.has('dca'))aqQueue.push('dca');
}
function aqNext(){
  const qId=aqQueue[aqStep];
  if(!aqAnswers[qId]){
    const qd=QUIZ_POOL.find(x=>x.id===qId);
    if(qd&&qd.opts[0])aqPick(qId,qd.opts[0].k,document.querySelector('.qopt'));
  }
  if(aqStep>=aqQueue.length-1){renderAQResult();return;}
  aqStep++;renderAQ();
}
function aqBack(){if(aqStep>0){aqStep--;renderAQ();}}
function aqAddMore(){
  const inQueue=new Set(aqQueue);
  const remaining=QUIZ_POOL.filter(q=>!inQueue.has(q.id));
  if(remaining.length>0){aqQueue.push(...remaining.slice(0,3).map(q=>q.id));}
  renderAQ();
}
function renderAQResult(){
  const wrap=document.getElementById('adaptive-quiz-wrap');
  if(!wrap)return;
  // Build profile from answers
  const a=aqAnswers;
  let name='Growth Seeker',desc='';
  const goalA=a.goal||'A',crashA=a.crash||'C',horizA=a.horizon||'C';
  if(goalA==='B'){name='Steady Climber';desc='Your priority is income. AlphaGen builds a portfolio of Dividend Kings, high-yield ETFs, and REITs with automatic DRIP.';}
  else if(goalA==='D'){name='Capital Guardian';desc='Capital preservation first. AlphaGen keeps you in quality dividend payers, bonds, and defensive sectors.';}
  else if(crashA==='D'&&horizA==='D'){name='Alpha Hunter';desc='High conviction, long horizon. AlphaGen builds a concentrated growth portfolio with optional leveraged exposure for maximum compounding.';}
  else if(crashA==='A'||crashA==='B'){name='Steady Climber';desc='Stability matters. AlphaGen diversifies with quality dividend payers and defensive positions — building wealth with less volatility.';}
  else{name='Growth Seeker';desc="Balanced — growth-focused but not reckless. Quality growth portfolio with dividend growers mixed in, and a DCA strategy that turns every dip into a buying opportunity.";}
  // Build DNA breakdown
  const dnaItems=[
    {label:'Risk Tolerance',val:a.crash==='D'?'Aggressive':a.crash==='C'?'Moderate':a.crash==='B'?'Conservative':'Cautious'},
    {label:'Time Horizon',val:a.horizon==='D'?'15+ Years':a.horizon==='C'?'7–15 Years':a.horizon==='B'?'3–7 Years':'Short-term'},
    {label:'Dividend Pref',val:a.dividend_use==='A'||a.goal==='B'?'DRIP Reinvest':a.goal==='A'?'Growth Focus':'Balanced'},
    {label:'Style',val:a.concentration==='A'?'Concentrated':a.concentration==='D'?'Index-Like':'Diversified'},
    {label:'AI Autonomy',val:a.ai_trust==='A'?'Full Auto':a.ai_trust==='B'?'AI Leads':'Manual'},
    {label:'Engagement',val:a.news_habit==='A'?'Daily Active':a.news_habit==='D'?'Passive':'Weekly'},
  ].filter(d=>d.val);
  wrap.innerHTML=`
    <div class="qwrap">
      <div style="text-align:center;padding:6px 0 14px;">
        <div style="font-size:36px;margin-bottom:6px;">🎯</div>
        <div style="font-size:10px;color:var(--mut);">Your investor profile</div>
        <div class="qrn" style="font-family:var(--F);font-size:30px;font-weight:800;letter-spacing:-1.5px;color:var(--acc);margin:6px 0 5px;">${name}</div>
        <p style="font-size:11px;color:var(--mut);line-height:1.7;max-width:380px;margin:0 auto;">${desc}</p>
      </div>
      <div class="quiz-dna">${dnaItems.map(d=>`<div class="dna-item"><div class="dna-label">${d.label}</div><div class="dna-val">${d.val}</div></div>`).join('')}</div>
      <div style="font-size:10px;color:var(--mut);text-align:center;margin-bottom:12px;">Based on ${Object.keys(aqAnswers).length} of ${QUIZ_POOL.length} available questions</div>
      <div style="display:flex;gap:8px;">
        <button class="btn bpri" style="flex:1;" onclick="openLogin()">Build My Portfolio →</button>
        <button class="btn bout" onclick="initAdaptiveQuiz()">Retake Quiz</button>
        ${Object.keys(aqAnswers).length<QUIZ_POOL.length?`<button class="btn bout" onclick="aqContinue()">More Questions</button>`:''}
      </div>
    </div>`;
}
function aqContinue(){
  // Add remaining questions and continue
  const inQueue=new Set(aqQueue);
  const remaining=QUIZ_POOL.filter(q=>!inQueue.has(q.id));
  aqQueue.push(...remaining.map(q=>q.id));
  aqStep=Object.keys(aqAnswers).length;
  renderAQ();
}

// Override old quiz tab to use new one
function lTab(t,el){
  document.querySelectorAll('.ltab').forEach(l=>l.classList.remove('on'));el.classList.add('on');
  ['lessons','glossary','explainers','sleep','quiz'].forEach(id=>{const el2=document.getElementById('l-'+id);if(el2)el2.style.display='none';});
  const target=document.getElementById('l-'+t);if(target)target.style.display='block';
  if(t==='quiz')initAdaptiveQuiz();
}

// ════════════════════════════════════════
// AGENT HEARTBEAT — live updates every 25s
// ════════════════════════════════════════
const HEARTBEAT_ENTRIES=[
  {ico:'📰',sym:'NVDA',body:'Sentiment scan complete: 94 articles this week, 87% positive. Thesis confidence maintained.'},
  {ico:'🔍',sym:'MSFT',body:'Form 4 check: no new insider activity. Last open-market buy: $680K (Mar 3). Clean.'},
  {ico:'🌍',sym:'MACRO',body:'CPI data within expected range. No portfolio rebalancing triggered. Growth weight maintained.'},
  {ico:'🧠',sym:'PLTR',body:'Karp Q1 earnings call language rescored: 9.1 → 9.3. Specificity index improved.'},
  {ico:'❤️',sym:'PORTFOLIO',body:'Daily health check passed. Correlation: 0.72. Concentration: 7 holdings. Score: 83/100.'},
  {ico:'📅',sym:'DCA',body:'Next DCA run: Monday 9:30 AM. $300 allocation confirmed across 7 holdings.'},
  {ico:'📰',sym:'AMZN',body:'AWS news scan: 3 articles on hyperscaler competition. Impact assessment: neutral to positive.'},
  {ico:'🔍',sym:'AVGO',body:'Form 4 update: Hock Tan open-market purchase verified. Signal strength: HIGH — non-10b5-1.'},
  {ico:'🌍',sym:'LLY',body:'GLP-1 trial data monitoring: tirzepatide head-to-head vs semaglutide results confirmed positive.'},
  {ico:'🧠',sym:'COST',body:'Membership renewal data updated: 93.2% (new all-time high). Management score confirmed 9.4.'},
];
let hbIdx=0;
function agentHeartbeat(){
  const log=document.getElementById('agent-log');
  if(!log)return;
  const e=HEARTBEAT_ENTRIES[hbIdx%HEARTBEAT_ENTRIES.length];
  hbIdx++;
  const el=document.createElement('div');
  el.className='act-entry';
  el.style.animation='pgIn .35s ease both';
  el.innerHTML=`<span class="act-ico">${e.ico}</span><div class="act-body"><span class="act-sym">${e.sym}</span>${e.body}</div><span class="act-time">Just now</span>`;
  log.insertBefore(el,log.firstChild);
  while(log.children.length>14)log.removeChild(log.lastChild);
  // Update the running agent chip timing
  document.querySelectorAll('.agent-time').forEach(t=>{
    if(t.textContent.includes('ago')){const m=parseInt(t.textContent);if(!isNaN(m))t.textContent=(m+1)+'m ago';}
  });
  // Pulse the CEO agent chip as "completing"
  const procChip=document.querySelector('.agent-chip.proc .agent-time');
  if(procChip){procChip.textContent='Updated just now';setTimeout(()=>{if(procChip)procChip.textContent='Running now…';},3000);}
}
setInterval(agentHeartbeat,25000);

// ════════════════════════════════════════
// INIT ALL NEW FEATURES
// ════════════════════════════════════════
(()=>{
  renderAgents();
  renderAgentLog();
  renderMorningBrief();
  renderNewsFeed();
  // Init quiz when quiz tab is opened
  const quizTab=document.querySelector('.ltab[onclick*="quiz"]');
  if(quizTab){
    const wrap=document.getElementById('adaptive-quiz-wrap');
    if(wrap&&wrap.innerHTML==='')initAdaptiveQuiz();
  }
})();

// Init slider display values
svUp();

// ════════════════════════════════════════
// PORTFOLIO PERFORMANCE CHART — real Yahoo history + S&P 500 benchmark
// ════════════════════════════════════════
(()=>{
  // Allocation weights (match Holdings table)
  const WEIGHTS={NVDA:18.2,MSFT:15.1,AMZN:12.4,META:11.3,PLTR:8.6,AVGO:7.2,JNJ:5.4};
  const wTotal=Object.values(WEIGHTS).reduce((a,b)=>a+b,0);
  const SYMS=Object.keys(WEIGHTS);
  let curRange='6mo';
  let drawData=null; // {labels, port[], spx[]}

  async function yfChart(sym,range){
    const url=`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?range=${range}&interval=1d`;
    let resp=null;
    try{resp=await fetch(url,{signal:AbortSignal.timeout(5000)});}catch{}
    if(!resp||!resp.ok){
      try{resp=await fetch('https://corsproxy.io/?'+encodeURIComponent(url),{signal:AbortSignal.timeout(9000)});}catch{return null;}
    }
    try{
      const j=await resp.json();
      const r=j?.chart?.result?.[0];if(!r)return null;
      const ts=r.timestamp||[];
      const adj=r.indicators?.adjclose?.[0]?.adjclose;
      const close=adj||r.indicators?.quote?.[0]?.close||[];
      const out=[];
      for(let i=0;i<ts.length;i++){if(close[i]!=null)out.push({t:ts[i],c:close[i]});}
      return out;
    }catch{return null;}
  }

  async function loadPerf(range){
    const status=document.getElementById('perf-status');
    if(status){status.style.display='flex';status.textContent='Loading real price history…';}
    const all=await Promise.all(SYMS.map(s=>yfChart(s,range)));
    const spxRaw=await yfChart('%5EGSPC',range);
    const series={};let minLen=Infinity;
    SYMS.forEach((s,i)=>{const d=all[i];if(d&&d.length>1){series[s]=d;minLen=Math.min(minLen,d.length);}});
    const haveSyms=Object.keys(series);
    if(!haveSyms.length||!spxRaw||spxRaw.length<2){
      if(status){status.style.display='flex';status.textContent='Live history unavailable right now — retry in a moment.';}
      return;
    }
    minLen=Math.min(minLen,spxRaw.length);
    // Align: take last minLen points of each
    const tail=(arr)=>arr.slice(arr.length-minLen);
    const spx=tail(spxRaw);
    const labels=spx.map(p=>p.t*1000);
    // Effective weights over available symbols only
    const wEff={};let wSum=0;haveSyms.forEach(s=>{wSum+=WEIGHTS[s];});
    haveSyms.forEach(s=>{wEff[s]=WEIGHTS[s]/wSum;});
    const port=new Array(minLen).fill(0);
    haveSyms.forEach(s=>{
      const d=tail(series[s]);const base=d[0].c;
      for(let i=0;i<minLen;i++){port[i]+=wEff[s]*(d[i].c/base)*100;}
    });
    const spxBase=spx[0].c;const spxN=spx.map(p=>p.c/spxBase*100);
    drawData={labels,port,spx:spxN};
    const pr=port[port.length-1]-100, sr=spxN[spxN.length-1]-100;
    const fmt=x=>(x>=0?'+':'')+x.toFixed(1)+'%';
    const pEl=document.getElementById('perf-port-ret'),sEl=document.getElementById('perf-spx-ret');
    if(pEl){pEl.textContent=fmt(pr);pEl.style.color=pr>=0?'var(--acc)':'var(--red)';}
    if(sEl){sEl.textContent=fmt(sr);sEl.style.color=sr>=0?'var(--tex)':'var(--red)';}
    const sub=document.getElementById('perf-sub');
    if(sub)sub.textContent=`${haveSyms.length}/${SYMS.length} holdings · ${minLen} trading days · weighted vs S&P 500`;
    if(status)status.style.display='none';
    drawPerf();
  }

  function drawPerf(){
    const cv=document.getElementById('perf-canvas');if(!cv||!drawData)return;
    const wrap=document.getElementById('perf-chart-wrap');
    const dpr=window.devicePixelRatio||1;
    const W=wrap.clientWidth||600, H=230;
    cv.width=W*dpr;cv.height=H*dpr;
    const ctx=cv.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);
    const padL=8,padR=8,padT=10,padB=18;
    const {labels,port,spx}=drawData;
    const all=port.concat(spx);
    let lo=Math.min(...all),hi=Math.max(...all);
    const rng=(hi-lo)||1;lo-=rng*0.08;hi+=rng*0.08;
    const x=i=>padL+(W-padL-padR)*(i/(port.length-1));
    const y=v=>padT+(H-padT-padB)*(1-(v-lo)/(hi-lo));
    // gridlines + baseline (100)
    ctx.strokeStyle='rgba(90,106,138,0.12)';ctx.lineWidth=1;
    for(let g=0;g<=3;g++){const gy=padT+(H-padT-padB)*g/3;ctx.beginPath();ctx.moveTo(padL,gy);ctx.lineTo(W-padR,gy);ctx.stroke();}
    if(100>=lo&&100<=hi){ctx.strokeStyle='rgba(90,106,138,0.35)';ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(padL,y(100));ctx.lineTo(W-padR,y(100));ctx.stroke();ctx.setLineDash([]);}
    const line=(arr,color,fill)=>{
      ctx.beginPath();arr.forEach((v,i)=>{i?ctx.lineTo(x(i),y(v)):ctx.moveTo(x(i),y(v));});
      if(fill){const grd=ctx.createLinearGradient(0,padT,0,H-padB);grd.addColorStop(0,'rgba(0,229,160,0.18)');grd.addColorStop(1,'rgba(0,229,160,0)');
        ctx.lineTo(x(arr.length-1),H-padB);ctx.lineTo(x(0),H-padB);ctx.closePath();ctx.fillStyle=grd;ctx.fill();
        ctx.beginPath();arr.forEach((v,i)=>{i?ctx.lineTo(x(i),y(v)):ctx.moveTo(x(i),y(v));});}
      ctx.strokeStyle=color;ctx.lineWidth=fill?2:1.5;ctx.lineJoin='round';ctx.stroke();
    };
    line(spx,'rgba(90,106,138,0.85)',false);
    line(port,'#00e5a0',true);
    // date endpoints
    ctx.fillStyle='#5a6a8a';ctx.font='9px monospace';ctx.textBaseline='alphabetic';
    const d0=new Date(labels[0]),d1=new Date(labels[labels.length-1]);
    const ds=d=>(d.getMonth()+1)+'/'+d.getDate()+'/'+String(d.getFullYear()).slice(2);
    ctx.textAlign='left';ctx.fillText(ds(d0),padL,H-5);
    ctx.textAlign='right';ctx.fillText(ds(d1),W-padR,H-5);
  }

  // wire timeframe buttons
  document.getElementById('perf-tfs')?.addEventListener('click',e=>{
    const b=e.target.closest('.perf-tf');if(!b)return;
    document.querySelectorAll('.perf-tf').forEach(x=>x.classList.remove('on'));
    b.classList.add('on');curRange=b.dataset.r;loadPerf(curRange);
  });
  window.addEventListener('resize',()=>{if(drawData)drawPerf();});

  // initial load (slight delay so layout settles)
  setTimeout(()=>loadPerf(curRange),400);
})();
