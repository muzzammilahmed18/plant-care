export const BASE_URL = import.meta.env.VITE_API_URL || "https://plant-care-backend-6qns.onrender.com";

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

// Plain JSON now — the photo (if any) was already uploaded separately
// via uploadFile(), so this just sends the resulting photoUrl string
// along with the rest of the plant's fields.
export async function createPlant(plantData) {
  const res = await fetch(`${BASE_URL}/plants`, {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify(plantData),
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

// Uploads a single file with real progress reporting via XMLHttpRequest.
// fetch() genuinely can't report upload progress — XHR is the only
// browser API that exposes progress events for an upload in flight.
export function uploadFile(file, onProgress) {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("photo", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${BASE_URL}/upload`);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(data);
        } else {
          reject(new Error(data.error || "Upload failed"));
        }
      } catch {
        reject(new Error("Upload failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Upload failed — check your connection"));

    xhr.send(formData);
  });
}