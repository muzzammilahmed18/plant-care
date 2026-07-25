const BASE_URL = "http://localhost:5000/plants";

export async function getPlants() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to load plants");
  return res.json();
}

export async function createPlant(plant) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(plant),
  });
  if (!res.ok) throw new Error("Failed to add plant");
  return res.json();
}

export async function updatePlant(id, updates) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update plant");
  return res.json();
}

export async function deletePlant(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete plant");
  return res.json();
}