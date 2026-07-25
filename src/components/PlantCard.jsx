function getStatus(lastWateredDate, frequencyDays) {
  const last = new Date(lastWateredDate);
  const daysSince = Math.floor((Date.now() - last) / (1000 * 60 * 60 * 24));
  const daysLeft = frequencyDays - daysSince;

  if (daysLeft < 0) return { label: "Overdue", color: "bg-red-100 text-red-700" };
  if (daysLeft <= 1) return { label: "Due soon", color: "bg-yellow-100 text-yellow-700" };
  return { label: "Fine", color: "bg-green-100 text-green-700" };
}

export default function PlantCard({ plant, onWater, onDelete, actionLoading }) {
  const status = getStatus(plant.lastWateredDate, plant.wateringFrequencyDays);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{plant.name}</h3>
          {plant.species && (
            <p className="text-sm text-gray-500 italic">{plant.species}</p>
          )}
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.color}`}>
          {status.label}
        </span>
      </div>

      <p className="text-sm text-gray-500">
        Water every {plant.wateringFrequencyDays} day(s) — last watered{" "}
        {new Date(plant.lastWateredDate).toLocaleDateString()}
      </p>

      <div className="flex gap-2 mt-2">
        <button
          onClick={() => onWater(plant.id)}
          disabled={actionLoading}
          className="flex-1 bg-blue-600 text-white text-sm font-medium py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {actionLoading ? "..." : "Mark as watered"}
        </button>
        <button
          onClick={() => onDelete(plant.id)}
          disabled={actionLoading}
          className="px-3 py-2 border border-gray-300 text-gray-600 text-sm rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}