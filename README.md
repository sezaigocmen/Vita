# Vita – Wellness App with an AI Coach

Live, installable demo of **Vita**, a fitness, nutrition and mindfulness app I designed in Figma — rebuilt as a working web app so you can try the real flows on your phone.

- **Case study:** [sezaigocmen.com/projects/vita](https://www.sezaigocmen.com/projects/vita)
- **Behance:** [Health & Wellness App Experience with AI Agent](https://www.behance.net/gallery/235737961/Health-Wellness-App-Experience-With-AI-Agent)
- **Design & build:** Sezai Göçmen

## Try it

- **On a phone:** open the live link, then *Share → Add to Home Screen* for the full-screen app experience.
- **On a desktop:** the app runs inside an iPhone frame, with a QR code to open it on your phone.

All data is demo data and stays in your browser — nothing is sent or collected.

## What's inside

| Area | Highlights |
|---|---|
| Introduction & Onboarding | Swipeable intro, trial screen, 5 personalisation questions, animated analysis |
| Home | Day picker with progress rings, swipeable daily cards (walk, water, sleep, food), achievements, daily challenges, quick tips |
| Discover | Highlights carousel, workouts, recipes, mind & meditation, community, recipe details |
| Progress | Health score & wellness rings, week-over-week comparison, goals, meditation history |
| AI Coach | Guided conversations with quick replies, actions that update the app, saved chats & tips |
| Profile | Editable demo profile, swipe-to-delete and drag-to-reorder lists, health data |

## Tech

React · TypeScript · Vite · Tailwind CSS · Motion · Zustand · PWA (vite-plugin-pwa)

- `src/shell/` – reusable mobile web-app template: iPhone frame + QR on desktop, full-screen PWA on phones, iOS-style navigation (push/pop, edge-swipe back, sheets, dialogs, toasts)
- `src/app/` – Vita screens, data and components
- `tools/figma/` – small scripts that turn Figma vector data into SVG assets

```bash
npm install
npm run dev     # http://localhost:5173 (and your local network address)
npm run build   # production build in dist/
```

> The AI coach in this demo uses prepared answers, not a live language model.
