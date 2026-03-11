# CampusConnect Prototype (Phase 1)

A lightweight **frontend-only** university group communication platform prototype.

## ✅ Included Features (UI + mock interactions)

1. Register / Login pages (no real auth)
2. Friend search and add-friend interface
3. Direct messaging between friends
4. Group chat interface
5. Voice chat UI mock panel (no real audio)
6. Collaborative document workspace mock (text / spreadsheet / slides modes)
7. Smart meeting planner mock:
   - leader proposes preferred window and duration
   - members' availability is simulated
   - best slot is highlighted based on overlap

## ❌ Not Included in Phase 1

- Backend API
- Database
- Real authentication
- Real-time socket infrastructure
- Real WebRTC voice
- Production-grade permissions

## Run Locally

Option A: Open directly
- Open `index.html` in your browser.

Option B: Serve with a local static server (recommended)

```bash
npx serve .
```

Then open the printed local URL (usually `http://localhost:3000`).

## Deploy to Vercel

This is a static app, so deployment is simple:

```bash
vercel --prod
```

## Suggested GitHub Submission Structure

- `index.html`
- `styles.css`
- `app.js`
- `README.md`
- `vercel.json`

## Screenshots for assignment report

Recommended captures:
- Login/Register screen
- Friends + DM screen
- Group chat + Voice panel
- Collaborative document page
- Meeting planner with suggested slot

---
Built for a university prototype assignment focusing on **UI flow and usability**.
