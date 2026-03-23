# Portfolio Dashboard

Real-time command dashboard for Simon Cheng's venture portfolio - tracking revenue signals, market intelligence, capital markets, and operational health across 5 verticals.

## Purpose

Single-pane view for portfolio companies across:
- **GPU/AI Infrastructure** - Cloud compute, inference workloads, model deployments
- **Resources** - Mining, energy, commodities tracking
- **Trades** - HVAC, skilled labor marketplace, service businesses
- **Healthcare** - Canadian health system analytics, public dashboards
- **Capital Markets** - M&A signals, fundraising activity, valuation trends

## Data Sources

### Phase 1 (Current)
- Manual data entry via JSON files
- Curated intelligence from daily research agents
- Weekly updates from automated scouting workflows

### Phase 2 (Planned)
- Automated API integrations (AER, AESO, government data)
- Real-time webhook feeds from portfolio company systems
- Agent-generated intelligence pipelines

## Deployment

**Platform:** Vercel
- Auto-deploy on every commit to `main` branch
- Preview deployments for pull requests
- Custom domain: `portfolio.simoncheng.dev` (pending)

## Project Structure

```
portfolio-dashboard/
├── README.md                 # This file
├── index.html                # Main dashboard landing page
├── vercel.json               # Vercel deployment configuration
├── .gitignore                # Node.js template
├── data/
│   ├── revenue-signals.json  # Revenue opportunities, BD leads
│   ├── market-intel.json     # Market intelligence, competitor signals
│   ├── capital-markets.json  # M&A, fundraising, valuations
│   └── operational-health.json # Portfolio company KPIs
├── css/
│   └── styles.css            # Dashboard styling
└── js/
    └── dashboard.js          # Client-side logic, data fetching
```

## Getting Started

### Local Development

```bash
# Clone repository
git clone https://github.com/simonchengnow-max/portfolio-dashboard.git
cd portfolio-dashboard

# Start local server (any HTTP server works)
npx http-server .
# or
python -m http.server 8000
```

Open `http://localhost:8000` in your browser.

### Data Updates

Edit JSON files in `/data` directory. Changes auto-deploy via Vercel.

### Adding New Verticals

1. Add new JSON file in `/data/`
2. Update `dashboard.js` to fetch and render
3. Add section to `index.html`
4. Commit and push to deploy

## Contributing

This is a private command dashboard. Updates are made via:
- Direct commits for urgent changes
- Pull requests for new features

## License

Private - All rights reserved

---

**Last Updated:** March 2026
**Maintained by:** Simon Cheng
