import { usePlants } from "../context/PlantsContext";
import { getPlantStatus } from "../utils/plantStatus";
import { BASE_URL } from "../api";

const STATUS_STYLES = {
  Overdue: "bg-red-100 text-red-700",
  "Due soon": "bg-yellow-100 text-yellow-700",
  Fine: "bg-green-100 text-green-700",
};

// onWater/onDelete/actionLoadingId used to arrive as props, forwarded
// down through PlantList by Plants.jsx. Now this card pulls them
// straight from PlantsContext — one less layer of prop-passing.
export default function PlantCard({ plant }) {
  const { waterPlant, removePlant, actionLoadingId } = usePlants();
  const statusLabel = getPlantStatus(plant.lastWateredDate, plant.wateringFrequencyDays);
  const actionLoading = actionLoadingId === plant.id;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
      {plant.photoUrl ? (
        <img
          src={`${BASE_URL}${plant.photoUrl}`}
          alt={plant.name}
          className="w-full h-36 object-cover"
        />
      ) : (
        <div className="w-full h-36 bg-gray-50 flex items-center justify-center text-3xl">
          🌿
        </div>
      )}

      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-gray-900">{plant.name}</h3>
            {plant.species && (
              <p className="text-sm text-gray-500 italic">{plant.species}</p>
            )}
          </div>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_STYLES[statusLabel]}`}>
            {statusLabel}
          </span>
        </div>

        {plant.category && (
          <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full w-fit">
            {plant.category}
          </span>
        )}

        <p className="text-sm text-gray-500">
          Water every {plant.wateringFrequencyDays} day(s) — last watered{" "}
          {new Date(plant.lastWateredDate).toLocaleDateString()}
        </p>

        {plant.notes && (
          <p className="text-xs text-gray-400 line-clamp-2">{plant.notes}</p>
        )}

        <div className="flex gap-2 mt-auto pt-1">
          <button
            onClick={() => waterPlant(plant.id)}
            disabled={actionLoading}
            className="flex-1 bg-blue-600 text-white text-sm font-medium py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {actionLoading ? "..." : "Mark as watered"}
          </button>
          <button
            onClick={() => removePlant(plant.id)}
            disabled={actionLoading}
            className="px-3 py-2 border border-gray-300 text-gray-600 text-sm rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}