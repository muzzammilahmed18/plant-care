# PlantCare — Frontend

A simple React app for tracking when your plants need watering. Built as
a full-stack CRUD exercise — this is the frontend half; it talks to a
separate backend API (see [plant-care-backend](https://github.com/muzzammilahmed18/plant-care-backend)).

## What it does

- Add a plant (name, species, watering frequency)
- View all your plants as cards, each showing a status badge:
  - 🟢 Fine
  - 🟡 Due soon
  - 🔴 Overdue
- Mark a plant as watered (updates its last-watered date)
- Delete a plant

## Tech stack

- React + Vite
- Tailwind CSS
- Plain `fetch` for API calls (no external data library) — all requests
  live in `src/api.js`

## Project structure

```
src/
  components/
    PlantForm.jsx     create form
    PlantCard.jsx      one plant's card + water/delete buttons
    PlantList.jsx        grid of cards + loading/error/empty states
  api.js               all fetch calls to the backend, in one place
  App.jsx              owns all state, wires everything together
```

## State & loading behavior

- Every create/update/delete action has its own loading state, so acting
  on one plant doesn't disable buttons on the others
- The plant list state only ever updates from what the server actually
  returns — never assumed optimistically — so the UI always reflects
  real backend data
- A dedicated error state (with a "Try again" button) shows if the
  backend is unreachable, instead of a blank screen

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