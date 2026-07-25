import PlantCard from "./PlantCard";

export function LoadingState() {
  return (
    <div className="flex flex-col items-center py-20 text-gray-500">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4" />
      <p className="text-sm">Loading plants...</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center py-20 text-center px-4">
      <p className="text-gray-900 font-medium mb-1">Couldn't load your plants</p>
      <p className="text-gray-500 text-sm mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="bg-gray-900 text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800"
      >
        Try again
      </button>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="text-center py-20 text-gray-500">
      <p>No plants yet — add your first one above.</p>
    </div>
  );
}

export default function PlantList({ plants, onWater, onDelete, actionLoadingId }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {plants.map((plant) => (
        <PlantCard
          key={plant.id}
          plant={plant}
          onWater={onWater}
          onDelete={onDelete}
          actionLoading={actionLoadingId === plant.id}
        />
      ))}
    </div>
  );
}