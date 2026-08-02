# PlantCare — Frontend

A React app for tracking when your plants need watering, with real user
accounts, a polished upload experience, clean global state, and a data
dashboard. Built as a full-stack internship project, in stages: CRUD →
authentication → a richer multi-field form → global state & UI polish →
drag-and-drop uploads → dashboard & charts. This is the frontend half; it
talks to a separate backend API —
[plant-care-backend](https://github.com/muzzammilahmed18/plant-care-backend).

## What it does

**Accounts**
- Sign up / log in, with client-side validated forms
- The plant list is scoped to whoever's logged in
- Log out clears the session; visiting the app while signed out redirects
  straight to `/login`
- A toast confirms successful login/signup — from pages that have nothing
  to do with plants, proving the toast system is genuinely global

**Adding a plant** — a 7-field form:
- Name, species, category (dropdown), watering frequency, date acquired
  (date picker), notes, and a photo
- **Photo upload** is its own polished step: drag-and-drop or click to
  browse, instant client-side type/size validation, a real upload
  progress bar (driven by actual `XMLHttpRequest` upload events), and a
  preview — all *before* the rest of the form is submitted
- Client + matching server-side validation, with field-specific errors
- The submit button disables and shows a spinner while in flight; a
  toast confirms success or failure afterward

**Managing plants**
- View all plants as cards: status badge (🟢 Fine · 🟡 Due soon ·
  🔴 Overdue), photo, category, notes
- Mark as watered / delete, each with its own loading state and toast

**Dashboard** (`/dashboard`)
- **Stat cards**: total plants, and counts of Overdue / Due soon / Fine
- **Pie chart**: plants broken down by category
- **Bar chart**: plants by watering status
- **Line chart**: plants acquired over time, grouped by month
- **A category filter** that updates all four visualizations at once
- Built with [Recharts](https://recharts.org), using `ResponsiveContainer`
  so charts reflow instead of overflowing on smaller screens
- All the underlying stats are computed **client-side** from data already
  sitting in `PlantsContext` — no extra backend endpoints needed for this
- Shares one `PlantsProvider` with the main Plants page (via a
  `ProtectedLayout` route wrapper), so switching between the two pages
  doesn't re-fetch data that's already loaded

**Loading & empty states**
- While plant data is loading, a grid of **skeleton cards** shows —
  matching the real layout — instead of a spinner or blank screen
- With zero plants (or zero plants matching the dashboard's category
  filter), a deliberate empty state explains what's going on

## Global state (no more prop-drilling)

Three context providers hold state that used to be manually passed down
as props through multiple component layers:

- **`AuthContext`** — token/email, login/signup/logout
- **`ToastContext`** — mounted once near the top of the app, so any page
  can trigger a toast via `useToast()`
- **`PlantsContext`** — plants data, loading/error state, and the
  add/water/delete actions, shared by both the Plants page and the
  Dashboard

`PlantForm`, `PlantList`, `PlantCard`, and `Dashboard` all read what they
need directly from context, instead of receiving it as props threaded
down from a parent page.

## Tech stack

- React + Vite
- Tailwind CSS
- React Router — nested routes with a shared `ProtectedLayout` for every
  authenticated page
- Recharts — pie/bar/line charts on the dashboard
- Context API for global state — no external state library needed
- `XMLHttpRequest` for the upload component specifically (progress
  events aren't available via `fetch()`); plain `fetch` everywhere else

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
  pages/
    Login.jsx / Signup.jsx                 auth forms + validation
    Plants.jsx                               main CRUD page
    Dashboard.jsx                              charts + stat cards + filter
  layouts/
    ProtectedLayout.jsx                          shares one PlantsProvider
                                                  across Plants & Dashboard
  context/
    AuthContext.jsx                                token/email, login/signup/logout
    ToastContext.jsx                                 global showToast()
    PlantsContext.jsx                                  plants data + actions
  utils/
    plantStatus.js                                      shared "is it overdue" logic,
                                                         used by PlantCard and Dashboard
  api.js                                            all fetch/XHR calls in one place
  App.jsx                                          route + provider setup
```

## Run locally

Expects the backend running at `http://localhost:5000`.

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```