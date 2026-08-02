// Shared status logic — used by PlantCard (per-plant badge) and the
// Dashboard (aggregate counts), so the definition of "overdue" only
// lives in one place.
export function getPlantStatus(lastWateredDate, frequencyDays) {
  const last = new Date(lastWateredDate);
  const daysSince = Math.floor((Date.now() - last) / (1000 * 60 * 60 * 24));
  const daysLeft = frequencyDays - daysSince;

  if (daysLeft < 0) return "Overdue";
  if (daysLeft <= 1) return "Due soon";
  return "Fine";
}

export const STATUS_COLORS = {
  Overdue: "#dc2626",
  "Due soon": "#ca8a04",
  Fine: "#16a34a",
};