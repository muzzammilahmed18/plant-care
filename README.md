# PlantCare — Frontend

A React app for tracking when your plants need watering, with real user
accounts, a polished upload experience, clean global state, a data
dashboard, and automated tests across the stack. Built as a full-stack
internship project, in stages: CRUD → authentication → a richer
multi-field form → global state & UI polish → drag-and-drop uploads →
dashboard & charts → automated testing. This is the frontend half; it
talks to a separate backend API —
[plant-care-backend](https://github.com/muzzammilahmed18/plant-care-backend).

## What it does

**Accounts** — sign up / log in with validated forms, a plant list scoped
to whoever's logged in, and a global toast confirming success (from pages
that have nothing to do with plants, proving the toast system is
genuinely app-wide).

**Adding a plant** — a 7-field form (name, species, category, watering
frequency, date acquired, notes, photo) with client + server-side
validation, a drag-and-drop photo upload with a real progress bar, and a
disabled/spinner submit button while the request is in flight.

**Managing plants** — status badges (🟢 Fine · 🟡 Due soon · 🔴 Overdue),
mark-as-watered, delete — each with its own loading state and toast.

**Dashboard** (`/dashboard`) — stat cards, a category pie chart, a
watering-status bar chart, and a plants-acquired-over-time line chart, all
updating live from a category filter.

**Loading & empty states** — skeleton cards while data loads, a
deliberate empty state when there's nothing to show yet.

## Configuration

This app reads its backend URL from an environment variable rather than
a hardcoded address, so it can point at a local backend during
development and a deployed one in production.

Copy `.env.example` to `.env` and set:
```
VITE_API_URL=http://localhost:5000
```
In production, this gets set to your deployed backend's URL instead
(e.g. in Vercel's project settings), not committed to the repo.

## Testing

This project has tests at three levels:

| Type | Tool | What it covers |
|---|---|---|
| Component tests | Vitest + React Testing Library | Login/Signup validation, PlantForm validation |
| Backend tests | Vitest + Supertest | See [plant-care-backend](https://github.com/yourusername/plant-care-backend) |
| End-to-end | Playwright | A full real-browser flow: sign up → add a plant → see it appear |

**Run the component tests:**
```bash
npm test
```

**Run the end-to-end test:**

First, make sure both servers are already running in separate terminals
(the e2e test does *not* start them for you):
```bash
# Terminal 1
cd ../plant-care-backend && node server.js

# Terminal 2
npm run dev
```
Then, in a third terminal:
```bash
npm run test:e2e
```

**First-time Playwright setup** (only needed once per machine):
```bash
npx playwright install chromium
```

## Global state (no more prop-drilling)

Three context providers — `AuthContext`, `ToastContext`, `PlantsContext`
— hold state that used to be manually passed down as props through
multiple component layers. `PlantForm`, `PlantList`, `PlantCard`, and
`Dashboard` all read what they need directly from context.

## Tech stack

- React + Vite, Tailwind CSS
- React Router — nested routes with a shared `ProtectedLayout`
- Recharts — dashboard charts
- Context API for global state
- Vitest + React Testing Library (component tests), Playwright (e2e)
- `XMLHttpRequest` for the upload component (progress events); plain
  `fetch` everywhere else

## Project structure

```
src/
  components/
    UploadDropzone.jsx        drag-and-drop upload, progress bar, preview
    PlantForm.jsx                7-field create form, client validation
    PlantCard.jsx                  one plant's card, reads actions from context
    PlantCardSkeleton.jsx            loading placeholder shape
    PlantList.jsx                      grid + loading/error/empty states
    ProtectedRoute.jsx                  redirects to /login if signed out
    Toast.jsx                            the actual banner UI
    __tests__/                            component tests
  pages/
    Login.jsx / Signup.jsx                 auth forms + validation
    Plants.jsx                               main CRUD page
    Dashboard.jsx                              charts + stat cards + filter
    __tests__/                                  page-level component tests
  layouts/
    ProtectedLayout.jsx                          shares one PlantsProvider
                                                  across Plants & Dashboard
  context/
    AuthContext.jsx / ToastContext.jsx / PlantsContext.jsx
  utils/
    plantStatus.js                                      shared status logic
  test/
    setup.js                                              jest-dom setup for Vitest
  api.js                                            all fetch/XHR calls in one place
  App.jsx                                          route + provider setup
tests/
  e2e/
    plant-flow.spec.js                                    Playwright end-to-end test
playwright.config.js
```

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```