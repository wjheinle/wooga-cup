# 🏆 The Wooga Cup Scoring App

**Wild Horse Golf Club · Gothenburg, Nebraska · 2025**

*Hooked on a Feeling — Blue Swede*

---

## Features

- **Live leaderboard** with Modified Stableford points, auto-updates every 30s
- **Per-player scorecards** with stroke entry and handicap stroke allocation
- **8 eligible Cup players** + 2 newbies tracked separately
- **Handicap strokes** applied per USGA allocation (Wooga Handicap index)
- **Newbie handicap assignment** via the Settings tab
- All data persists on the server in `data/scores.json`

## Modified Stableford Points

| Score | Points |
|-------|--------|
| Double Eagle (3 under) | +16 |
| Eagle (2 under) | +9 |
| Birdie (1 under) | +4 |
| Par | +1 |
| Bogey | 0 |
| Double Bogey or worse | -1 |

## Players

| Player | Wooga HCP | Cup Eligible |
|--------|-----------|--------------|
| Joe | 13 | ✅ |
| Ryan | 30 | ✅ |
| Tom | 36 | ✅ |
| Jeff (Tuna) | 36 | ✅ |
| Bill | 18 | ✅ |
| Jon | 36 | ✅ |
| Aiden | 8 | ✅ |
| Max | 36 | ✅ |
| Ben | TBD | ❌ Newbie |
| Jason | TBD | ❌ Newbie |

---

## Deploy to Railway

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Wooga Cup 2025 🏆"
   git remote add origin https://github.com/YOUR_USERNAME/wooga-cup.git
   git push -u origin main
   ```

2. **Deploy on Railway:**
   - Go to [railway.app](https://railway.app)
   - New Project → Deploy from GitHub repo
   - Select `wooga-cup`
   - Railway auto-detects Node.js and runs `npm start`
   - Your app will be live at a `*.railway.app` URL

3. **Persistent Storage:**
   - Railway provides ephemeral storage by default
   - For persistent scores, add a Railway Volume:
     - In Railway dashboard: your service → Volumes
     - Mount at `/app/data`
   - Or simply use the app within a session — scores persist as long as the container runs

---

## Local Development

```bash
npm install
npm start
# Open http://localhost:3000
```

---

*♪ Ooga chaka ooga ooga — Hooked on a Feeling ♪*
