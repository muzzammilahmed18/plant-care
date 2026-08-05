# PlantCare — Frontend

🌱 **Live app:** https://plant-care-six-xi.vercel.app
🔗 **Backend API:** https://plant-care-backend-6qns.onrender.com
🔗 **Backend repo:** https://github.com/muzzammilahmed18/plant-care-backend

A full-stack app for tracking when your plants need watering — real user
accounts, photo uploads, a data dashboard, automated tests, and a live
production deployment. Built in stages over a full-stack internship:
CRUD → authentication → richer forms → global state & UI polish →
drag-and-drop uploads → dashboard & charts → automated testing →
deployment & performance.

> ⚠️ **Heads up before you try it live:** the backend runs on Render's
> free tier, which spins down after inactivity. The **first** request
> after a period of no traffic can take 30-60 seconds to respond while
> it wakes back up — that's expected, not a bug. Give it a moment on
> your first signup/login attempt.

## What it does

**Accounts** — sign up / log in with validated forms, a plant list
scoped to whoever's logged in, session persisted via a JWT stored in
`localStorage`.

**Adding a plant** — a 7-field form (name, species, category, watering
frequency, date acquired, notes, photo) with:
- Client + server-side validation, field-specific error messages
- A drag-and-drop photo upload with a real progress bar, uploaded
  immediately and independently of the rest of the form
- A disabled/spinner submit button while the request is in flight
- Toast confirmation on success or failure

**Managing plants** — status badges (🟢 Fine · 🟡 Due soon · 🔴 Overdue,
computed from watering frequency + last-watered date), mark-as-watered,
delete.

**Dashboard** (`/dashboard`) — stat cards, a category pie chart, a
watering-status bar chart, and a plants-acquired-over-time line chart,
all updating live from a category filter. Lazy-loaded as its own bundle
so the charting library isn't downloaded until someone actually visits it.

**Loading & empty states** — skeleton cards while data loads, deliberate
empty states with guidance instead of blank space.

## Architecture overview

```
┌─────────────────┐        HTTPS/JSON         ┌──────────────────┐
│   React (Vite)  │ ────────────────────────► │  Express API     │
│   on Vercel     │ ◄──────────────────────── │  on Render       │
│                 │      JWT in headers       │                  │
└─────────────────┘                           └──────────────────┘
                                                          │
                                                  in-memory storage
                                                (users, plants, uploads/)
```

- **Frontend:** React + Vite, deployed as a static build on Vercel.
  Talks to the backend over plain `fetch`/`XMLHttpRequest`, with the
  backend's URL injected via the `VITE_API_URL` environment variable
  (baked in at build time, not runtime).
- **Backend:** Node + Express on Render, a single service handling auth,
  CRUD, and file uploads. Data lives in in-memory arrays — simple by
  design for this project, but it means data resets whenever the service
  restarts or spins down. A real production version of this would swap
  in a persistent database (Postgres, MongoDB) and object storage (S3,
  Cloudinary) for uploads instead.
- **Auth:** JWT issued on login/signup, stored in the browser's
  `localStorage`, sent as a `Bearer` token on every plant request.
- **State:** three React Context providers (`AuthContext`,
  `ToastContext`, `PlantsContext`) instead of prop-drilling; a shared
  `ProtectedLayout` route wrapper means Plants and Dashboard share one
  `PlantsProvider` rather than each fetching independently.

## Tech stack

React + Vite, Tailwind CSS, React Router, Recharts, Context API,
Vitest + React Testing Library (component tests), Supertest (backend
tests), Playwright (end-to-end tests).

## Configuration

Copy `.env.example` to `.env`:
```
VITE_API_URL=http://localhost:5000
```
In production this is set in Vercel's project settings to the deployed
backend's URL instead — never committed to the repo.

## Run locally

This expects the backend running at `http://localhost:5000` — see the
[backend repo](https://github.com/muzzammilahmed18/plant-care-backend) for
its own setup.

```bash
npm install
npm run dev
```

## Testing

```bash
npm test          # component tests (Vitest + React Testing Library)
npm run test:e2e  # end-to-end test (Playwright — needs both servers running)
```

First-time Playwright setup: `npx playwright install chromium`

## Build & deploy

```bash
npm run build
```
Deployed on **Vercel**, connected directly to this GitHub repo — every
push to `main` triggers an automatic redeploy. `vercel.json` includes a
rewrite rule so client-side routes (`/login`, `/dashboard`, etc.) work
correctly on direct load/refresh, not just in-app navigation.

## Project structure

```
src/
  components/    UploadDropzone, PlantForm, PlantCard, PlantList,
                 PlantCardSkeleton, ProtectedRoute, Toast (+ __tests__)
  pages/         Login, Signup, Plants, Dashboard (+ __tests__)
  layouts/       ProtectedLayout — shares one PlantsProvider
  context/       AuthContext, ToastContext, PlantsContext
  utils/         plantStatus.js — shared watering-status logic
  test/          Vitest setup (jest-dom)
  api.js         all fetch/XHR calls, BASE_URL from env
  App.jsx        routes + providers, lazy-loaded Dashboard
tests/e2e/       Playwright end-to-end test
vercel.json      SPA rewrite rule
```