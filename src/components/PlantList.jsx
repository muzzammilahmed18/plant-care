import PlantCard from "./PlantCard";
import PlantCardSkeleton from "./PlantCardSkeleton";
import { usePlants } from "../context/PlantsContext";

// A grid of skeleton cards, roughly matching how many real cards will
// likely appear, instead of a spinner or blank space.
export function LoadingState() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <PlantCardSkeleton key={i} />
      ))}
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

// A deliberate "zero data" state, not just an empty grid — explains
// what's going on and nudges toward the action that fixes it.
export function EmptyState() {
  return (
    <div className="flex flex-col items-center text-center py-20 px-4">
      <div className="text-4xl mb-3">🪴</div>
      <p className="text-gray-900 font-medium mb-1">No plants yet</p>
      <p className="text-gray-500 text-sm max-w-xs">
        Add your first plant using the form above to start tracking when
        it needs water.
      </p>
    </div>
  );
}

// Reads plants directly from context — the parent (Plants.jsx) no
// longer needs to fetch them and pass them down as a prop.
export default function PlantList() {
  const { plants } = usePlants();

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {plants.map((plant) => (
        <PlantCard key={plant.id} plant={plant} />
      ))}
    </div>
  );
}