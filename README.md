# AlphaGen

**AI-Powered Asset Allocation for the Next Generation of Investors**

AlphaGen is a frontend web application that builds and manages personalized long-term stock portfolios for college students and young professionals. Every recommendation comes with full AI reasoning — no black boxes.

---

## Project Structure

```
alphagen/
├── index.html      — App shell, HTML structure, all pages/tabs
├── styles.css      — All styling, CSS variables, layout, components
├── data.js         — Stock database (45+ stocks with theses, signals, CEO scores)
├── script.js       — All JavaScript: navigation, simulation, modals, check-in, quiz
└── README.md       — This file
```

---

## Getting Started

### Option 1 — Open locally (instant, no setup)

1. Download all four files into the same folder
2. Double-click `index.html`
3. It opens in your browser — fully functional

No server required. No npm. No build step. Works offline.

### Option 2 — Deploy to Netlify (get a live URL)

1. Go to [netlify.com/drop](https://netlify.com/drop)
2. Drag the entire `alphagen/` folder onto the page
3. You get a live URL like `alphagen.netlify.app` in ~30 seconds

### Option 3 — Deploy via GitHub + Netlify (recommended for ongoing development)

1. Push this folder to a private GitHub repo
2. Go to [netlify.com](https://netlify.com) → New Site → Import from GitHub
3. Select your repo — Netlify auto-deploys on every push

---

## Features

| Tab | What it does |
|---|---|
| **Portfolio** | Holdings table, daily Hold/Sell signals with AI reasoning, live news feed, AI decision log, cash sweep |
| **Simulation Lab** | Build any portfolio with 10+ parameters — see dollar allocations + bull/base/bear projections |
| **Dividends** | DRIP tracker, dividend calendar, 20-year reinvestment projection |
| **Watchlist** | Track stocks before buying, AI monitors for entry signals |
| **Learn** | 5 tabs: Lessons, Glossary, Market Explainers, Sleep Test, Risk Quiz |
| **Markets** | Insider trades (Form 4), institutional 13F filings, macro events, sector performance |
| **Upgrade** | Pricing tiers, referral program, campus program |

### Key interactions
- **Daily Signals** — each portfolio holding shows STRONG HOLD / HOLD / WATCH / CONSIDER SWAP with confidence % and full reasoning
- **Why? 💡 button** — opens full AI thesis modal for any stock (thesis, CEO score, risks, challenge the AI)
- **Weekly Check-In** — 4 questions that simulate dynamic portfolio updates
- **Simulation** — run any parameter combination and see a full portfolio with dollar allocations
- **Login panel** — slides in from the right, optional (guest access always available)

---

## Updating the Stock Database

All stock data lives in `data.js`. Each stock follows this structure:

```javascript
{
  s: 'NVDA',                    // Ticker symbol
  n: 'Nvidia Corp',             // Full name
  sec: 'Technology',            // Sector (used for simulation filtering)
  cap: 'Large',                 // Market cap tier: Large / Mid / Small
  div: 0.03,                    // Dividend yield %
  risk: 7,                      // Risk score 1-10
  mgmt: 9.8,                    // CEO/management score 1-10
  signal: 'STRONG HOLD',        // Daily signal text
  signalType: 'strong',         // strong | hold | watch | swap
  reason: '...',                // AI reasoning for the signal (1-2 sentences)
  confidence: 96,               // Signal confidence 0-100
  thesis: '...',                // Full investment thesis
  management: '...',            // Management assessment
  whyfit: '...',                // Why this stock fits the user's profile
  risks: '...',                 // Key risks to monitor
  metrics: [                    // 3 display metrics for the modal
    { v: '87%', l: 'Gross Margin' },
    { v: '9.8/10', l: 'CEO Score' },
    { v: '+3.4%', l: 'Today' }
  ],
  // Optional — only for WATCH/SWAP signals:
  swapSuggestion: {
    sym: 'AMD',
    reason: 'Why AMD is a better fit right now...'
  }
}
```

**Signal types:**
- `strong` → green filled badge "⚡ STRONG HOLD"
- `hold` → green outline badge "✓ HOLD"
- `watch` → gold badge "⚠ WATCH"
- `swap` → red badge "↕ CONSIDER SWAP" (requires `swapSuggestion`)

---

## Customizing

### Change the portfolio holdings shown on the Portfolio tab

In `script.js`, find this line near the top of the file:

```javascript
const H=[{s:'NVDA',...},{s:'MSFT',...}, ...]
```

Update the array to show whichever stocks you want as the demo portfolio.

### Change the daily signals

In `data.js`, update each stock's `signal`, `signalType`, `reason`, and `confidence` fields. These are what power the Daily Hold/Sell Signals section on the Portfolio tab.

### Change pricing or feature list

In `index.html`, search for `pg-pricing` to find the pricing section.

---

## Next Steps (Backend Roadmap)

This is currently a **static frontend prototype**. The agent framework is scaffolded and ready — each thesis field in `data.js` maps directly to what a live agent will update. Planned backend additions:

1. **SnapTrade OAuth** — connect Robinhood, Webull, Fidelity via single integration
2. **Node.js + PostgreSQL** — user accounts, saved portfolios, waitlist
3. **AI agents** — earnings call scoring, Form 4 monitoring, macro event mapping
4. **Live stock prices** — replace static prices with real-time data feed

Recommended stack when ready: Node.js backend on [Railway](https://railway.app), PostgreSQL for data, SnapTrade for brokerage OAuth.

---

## Deployment Checklist

Before pushing to production:

- [ ] Replace `ALPHAGEN-ALEX47` referral code with your real code
- [ ] Update `alebrow@iu.edu` contact references in any about/contact sections
- [ ] Set up a custom domain (Namecheap → point to Netlify)
- [ ] Add Google Analytics or Plausible for waitlist tracking
- [ ] Add a real waitlist form (Typeform or a simple fetch to a backend endpoint)

---

## Built by

Alex Brown · Founder · Indiana University Spring 2026  
alex2399ty@gmail.com

---

*AlphaGen is currently a prototype. It does not execute real trades or manage real money. All data is for demonstration purposes.*
