# 🚀 Quick Deployment Guide

## Fastest Method: Vercel CLI (1 minute)

1. **Install Vercel CLI** (if you don't have it):
   ```bash
   npm install -g vercel
   ```

2. **Navigate to the folder**:
   ```bash
   cd valorant-globe
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? → Y
   - Which scope? → (select your account)
   - Link to existing project? → N
   - What's your project's name? → valorant-globe (or whatever you want)
   - In which directory is your code located? → ./
   
5. **Done!** You'll get a URL like: `https://valorant-globe-xxxxx.vercel.app`

## Alternative: Netlify Drop (30 seconds)

1. Go to: https://app.netlify.com/drop
2. Drag the entire `valorant-globe` folder onto the page
3. Get your URL instantly!

## Alternative: Cloudflare Pages

1. Go to: https://pages.cloudflare.com
2. Create account (free)
3. Upload the folder
4. Deploy!

---

## For Twitter

### Option 1: Screen Recording
Record a 10-15 second video showing:
- Globe rotating automatically
- Hover over a country (USA/Korea work great)
- Show the color gradient from hot to cool regions

**Tools:**
- Mac: QuickTime (Cmd+Shift+5)
- Windows: Xbox Game Bar (Win+G)
- Linux: OBS Studio

### Option 2: Static Image
Take a screenshot with:
- Globe centered showing colorful countries
- Top 10 panel visible
- Tooltip showing on a major country

**Sample Tweet:**
```
Built an interactive 3D globe showing where all 4,313 Valorant pros come from 🌍

103 countries represented. Darker = more players.

Try it: [YOUR_URL]

Built with Three.js + D3.js
```

---

## Customization

### Change Colors (globe.js, lines 8-15):
```javascript
const COLORS = {
    hottest: 0xff0055,  // Your color in hex
    hot: 0xff4d6d,
    // ... etc
};
```

### Add Wolves Branding (index.html):
```html
<!-- Add your logo -->
<img src="wolves-logo.png" style="position: absolute; top: 20px; left: 20px;">

<!-- Change gradient to team colors -->
background: linear-gradient(135deg, #YOUR_COLOR1 0%, #YOUR_COLOR2 100%);
```

### Change Rotation Speed (globe.js, line 532):
```javascript
globe.rotation.y += 0.002; // Lower = slower, higher = faster
```

---

## Troubleshooting

**Globe not loading?**
- Check browser console (F12)
- Make sure all files are in the same folder
- Try a different browser (Chrome/Firefox work best)

**Colors look wrong?**
- Country name mapping might be off
- Check `countryNameMap` in globe.js (line 20)

**Want to add more countries?**
- Update `country_data.json` with new data
- Refresh the page

---

Enjoy! 🎮🌍
