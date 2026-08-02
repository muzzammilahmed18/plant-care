# PlantCare — Frontend

A React app for tracking when your plants need watering, with real user
accounts, a polished upload experience, and clean global state. Built as
a full-stack internship project, in stages: CRUD → authentication → a
richer multi-field form → global state & UI polish → drag-and-drop
uploads. This is the frontend half; it talks to a separate backend API —
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
  progress bar (not simulated — driven by actual `XMLHttpRequest` upload
  events), and a preview once it's done — all *before* the rest of the
  form is even submitted
- Client + matching server-side validation, with field-specific error
  messages
- The submit button disables and shows a spinner while in flight; a
  toast confirms success or failure afterward

**Managing plants**
- View all plants as cards: status badge (🟢 Fine · 🟡 Due soon ·
  🔴 Overdue), photo, category, notes
- Mark as watered / delete, each with its own loading state and toast

**Loading & empty states**
- While plant data is loading, a grid of **skeleton cards** shows —
  matching the real layout — instead of a spinner or blank screen
- With zero plants, a deliberate empty state (icon + explanation +
  nudge to add your first plant), not just an empty grid

## Global state (no more prop-drilling)

Two context providers hold state that used to be manually passed down
as props through multiple component layers:

- **`ToastContext`** — mounted once near the top of the app, so any page
  (Login, Signup, Plants, anything added later) can trigger a toast via
  `useToast()` without a parent forwarding a function down
- **`PlantsContext`** — holds `plants`, loading/error state, and the
  add/water/delete actions. `PlantForm`, `PlantList`, and `PlantCard` all
  read from `usePlants()` directly instead of receiving everything as
  props from `Plants.jsx`

`AuthContext` (from the auth stage) already followed this same pattern —
these two extend it to the rest of the app.

## Tech stack

- React + Vite
- Tailwind CSS
- React Router — `/login`, `/signup`, and a protected `/` route
- Context API (`AuthContext`, `ToastContext`, `PlantsContext`) for global
  state — no external state library needed at this size
- `XMLHttpRequest` for the upload component specifically, since `fetch()`
  can't report upload progress; plain `fetch` everywhere else

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
    Plants.jsx                               composes the pieces above
  context/
    AuthContext.jsx                           token/email, login/signup/logout
    ToastContext.jsx                            global showToast()
    PlantsContext.jsx                             plants data + actions
  api.js                                     all fetch/XHR calls in one place
  App.jsx                                   route + provider setup
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