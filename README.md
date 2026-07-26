# PlantCare — Frontend

A React app for tracking when your plants need watering, with real user
accounts. Built as a full-stack exercise in two stages: first CRUD, then
authentication on top of it. This is the frontend half; it talks to a
separate backend API — [plant-care-backend](https://github.com/muzzammilahmed18/plant-care-backend).

## What it does

**Accounts**
- Sign up with an email + password (validated client-side before it ever
  hits the server)
- Log in to an existing account
- The plant list is scoped to whoever's logged in — every account only
  ever sees its own plants
- Log out clears the session and returns you to the login page
- Visiting the app without being logged in redirects straight to `/login`
  — no plant data is ever shown to a signed-out visitor

**Plants (once logged in)**
- Add a plant (name, species, watering frequency)
- View all your plants as cards, each showing a status badge:
  - 🟢 Fine · 🟡 Due soon · 🔴 Overdue
- Mark a plant as watered (updates its last-watered date)
- Delete a plant

## Tech stack

- React + Vite
- Tailwind CSS
- React Router — for `/login`, `/signup`, and a protected `/` route
- Plain `fetch` for API calls, all living in `src/api.js`
- Auth state managed with a single `AuthContext` (React Context +
  `useState`) — no external state library needed at this size

## Project structure

```
src/
  components/
    PlantForm.jsx        create form
    PlantCard.jsx          one plant's card + water/delete buttons
    PlantList.jsx            grid of cards + loading/error/empty states
    ProtectedRoute.jsx        redirects to /login if not authenticated
  pages/
    Login.jsx                 login form + validation
    Signup.jsx                 signup form + validation
    Plants.jsx                   the CRUD page (behind the protected route)
  context/
    AuthContext.jsx               holds token/email, exposes login/signup/logout
  api.js                       all fetch calls (auth + plants) in one place
  App.jsx                     route definitions
```

## Auth flow, in short

1. Sign up or log in → backend returns a JWT
2. The token is stored in `localStorage` (along with the user's email)
3. Every plant request attaches the token as an `Authorization: Bearer`
   header (see `authHeaders()` in `api.js`)
4. If a request comes back `401`/`403` (missing or expired token), the
   frontend surfaces this as a clear error rather than silently failing
5. Logging out simply clears the stored token — nothing further is
   needed for a JWT-based session

## Run locally

This app expects the backend to be running at `http://localhost:5000`
(see the backend repo for setup).

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```