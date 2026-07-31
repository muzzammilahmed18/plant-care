# PlantCare — Frontend

A React app for tracking when your plants need watering, with real user
accounts. Built as a full-stack internship project, in stages: CRUD →
authentication → a richer multi-field form with validation and file
uploads. This is the frontend half; it talks to a separate backend API —
[plant-care-backend](https://github.com/muzzammilahmed18/plant-care-backend).

## What it does

**Accounts**
- Sign up with an email + password (validated client-side before it ever
  hits the server)
- Log in to an existing account
- The plant list is scoped to whoever's logged in
- Log out clears the session; visiting the app while signed out redirects
  straight to `/login`

**Adding a plant** — a 7-field form:
- Name, species, category (dropdown), watering frequency, date acquired
  (date picker), a photo upload (with a live preview), and notes
- Client-side validation with **field-specific** error messages (not a
  generic "invalid input") — checked before anything is sent to the server
- Matching server-side validation, since the frontend can always be
  bypassed
- Non-image files are rejected instantly, client-side, before any network
  request is made
- The submit button disables and shows a spinner while the request is in
  flight, so it's never possible to double-submit
- A toast notification (green for success, red for failure) confirms what
  happened after every submit

**Managing plants**
- View all plants as cards, each showing a status badge:
  🟢 Fine · 🟡 Due soon · 🔴 Overdue — plus category, photo, and notes
- Mark a plant as watered (updates its last-watered date)
- Delete a plant
- Every action (add/water/delete) has its own loading state and its own
  toast feedback

## Tech stack

- React + Vite
- Tailwind CSS
- React Router — `/login`, `/signup`, and a protected `/` route
- `FormData` (not plain JSON) for the create-plant request, so the photo
  file can travel alongside the text fields
- Auth state via a single `AuthContext` (React Context + `useState`)

## Project structure

```
src/
  components/
    PlantForm.jsx           7-field create form, client validation, photo preview
    PlantCard.jsx             one plant's card, shows photo/category/notes
    PlantList.jsx               grid + loading/error/empty states
    ProtectedRoute.jsx           redirects to /login if not authenticated
    Toast.jsx                     success/error banner, auto-dismisses
  pages/
    Login.jsx / Signup.jsx           auth forms + validation
    Plants.jsx                         the main page (behind the protected route)
  context/
    AuthContext.jsx                      holds token/email, login/signup/logout
  api.js                                all fetch calls (auth + plants) in one place
  App.jsx                              route definitions
```

## Run locally

This app expects the backend to be running at `http://localhost:5000`
(see the backend repo for setup, including the `uploads/` folder for
photos).

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```