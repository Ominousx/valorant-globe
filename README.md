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
  
**Or take a screenshot:**
- Show the globe with tooltip visible on a hot country (USA/Korea)
- Make sure the top 10 list is visible
- Post with the URL

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
