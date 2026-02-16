# Valorant Players Globe 🌍

An interactive 3D globe visualization showing the global distribution of 4,532 Valorant players across 104 countries.

## Features

- **Interactive 3D Globe**: Built with Three.js for smooth WebGL rendering
- **Color-coded Countries**: Darker/warmer colors indicate more players
  - 🔴 Red (400+ players): USA
  - 🟠 Orange (200-400): South Korea, Turkey, Brazil
  - 🔵 Blue (150-200): Japan, France, Germany, China
  - 🟣 Purple (100-150): Russia, Spain, Canada, Philippines, UK, India, Chile
  - ⚫ Dark (<100): Smaller scenes
- **Hover Tooltips**: See exact player counts for each country
- **Auto-rotation**: Globe slowly rotates automatically
- **Mouse Controls**: 
  - Click & drag to rotate
  - Scroll to zoom in/out
  - Hover for country details
- **Top 10 Rankings**: Live leaderboard of countries with most players
- **Atmospheric Glow**: Realistic space-like aesthetic

## Quick Deploy

### Option 1: Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to this folder: `cd valorant-globe`
3. Deploy: `vercel`
4. Follow prompts (it's super quick!)
5. You'll get a URL like `https://your-project.vercel.app`

### Option 2: Netlify Drop
1. Go to [netlify.com/drop](https://app.netlify.com/drop)
2. Drag the entire folder
3. Get instant URL

### Option 3: Cloudflare Pages
1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect your GitHub or upload files
3. Deploy in seconds

## Files Structure

```
valorant-globe/
├── index.html          # Main HTML file
├── globe.js            # Three.js visualization logic
├── country_data.json   # Player counts by country
└── README.md          # This file
```

## For Twitter

**Best practices:**
1. Record a ~10 second video of the globe rotating
2. Use screen recording software (QuickTime, OBS, etc.)
3. Post with text like:
   > "Built an interactive 3D globe showing where all 4,313 Valorant pros come from 🌍
   > 
   > 103 countries represented. Try it yourself: [YOUR_URL]"

**Or take a screenshot:**
- Show the globe with tooltip visible on a hot country (USA/Korea)
- Make sure the top 10 list is visible
- Post with the URL

## Customization

Want to tweak the colors or style?

**Edit `globe.js`:**
- Line 8-15: Change the color scheme
- Line 199-206: Modify the color thresholds
- Line 532: Adjust rotation speed

**Edit `index.html`:**
- Line 13-16: Change background gradient
- Line 60-80: Modify panel styles
- Wolves branding? Add your logo and team colors!

## Tech Stack

- **Three.js** (r128): 3D rendering
- **D3.js** (v7): Geographic projections
- **TopoJSON**: Country boundary data
- Pure vanilla JS - no build process needed!

## Data Source

Player data scraped from Liquipedia (4,313 players as of Feb 2026)

## Performance

- Runs at 60 FPS on modern browsers
- Mobile-friendly (touch controls work!)
- Loads in ~2 seconds on average connection

## License

MIT - Feel free to use, modify, share!

---

**Questions?** Open an issue or DM me on Twitter

**Built by:** Sushant for Wolves Esports 🐺
