const BASE_URL = "http://localhost:5000";

// Every plant request needs the token attached, so this small helper
// builds the headers once instead of repeating it in every function.
function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ---- Auth ----

export async function signupRequest({ email, password }) {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Signup failed");
  return data;
}

export async function loginRequest({ email, password }) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Login failed");
  return data;
}

// ---- Plants (all require a valid token) ----

export async function getPlants() {
  const res = await fetch(`${BASE_URL}/plants`, { headers: authHeaders() });
  if (res.status === 401 || res.status === 403) {
    throw new Error("Your session has expired. Please log in again.");
  }
  if (!res.ok) throw new Error("Failed to load plants");
  return res.json();
}

export async function createPlant(plant) {
  const res = await fetch(`${BASE_URL}/plants`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(plant),
  });
  if (!res.ok) throw new Error("Failed to add plant");
  return res.json();
}

export async function updatePlant(id, updates) {
  const res = await fetch(`${BASE_URL}/plants/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update plant");
  return res.json();
}

export async function deletePlant(id) {
  const res = await fetch(`${BASE_URL}/plants/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete plant");
  return res.json();
}