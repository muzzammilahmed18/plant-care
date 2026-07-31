const BASE_URL = "http://localhost:5000";

function authHeaderOnly() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function jsonHeaders() {
  return { "Content-Type": "application/json", ...authHeaderOnly() };
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

// ---- Plants ----

export async function getPlants() {
  const res = await fetch(`${BASE_URL}/plants`, { headers: authHeaderOnly() });
  if (res.status === 401 || res.status === 403) {
    throw new Error("Your session has expired. Please log in again.");
  }
  if (!res.ok) throw new Error("Failed to load plants");
  return res.json();
}

// Takes a FormData object (built by PlantForm) so it can include the
// photo file alongside the text fields. Don't set Content-Type manually
// here — the browser sets the correct multipart boundary automatically.
export async function createPlant(formData) {
  const res = await fetch(`${BASE_URL}/plants`, {
    method: "POST",
    headers: authHeaderOnly(),
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.error || "Failed to add plant");
    err.fieldErrors = data.errors || null;
    throw err;
  }
  return data;
}

// Used for the quick "mark as watered" action — plain JSON is enough
// here since no file is involved.
export async function updatePlant(id, updates) {
  const res = await fetch(`${BASE_URL}/plants/${id}`, {
    method: "PUT",
    headers: jsonHeaders(),
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update plant");
  return res.json();
}

export async function deletePlant(id) {
  const res = await fetch(`${BASE_URL}/plants/${id}`, {
    method: "DELETE",
    headers: authHeaderOnly(),
  });
  if (!res.ok) throw new Error("Failed to delete plant");
  return res.json();
}