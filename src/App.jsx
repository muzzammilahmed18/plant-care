import { useState, useEffect, useCallback } from "react";
import PlantForm from "./components/PlantForm";
import PlantList, { LoadingState, ErrorState, EmptyState } from "./components/PlantList";
import { getPlants, createPlant, updatePlant, deletePlant } from "./api";

function App() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const loadPlants = useCallback(() => {
    setLoading(true);
    setError(null);
    getPlants()
      .then(setPlants)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadPlants();
  }, [loadPlants]);

  function handleAdd(newPlant) {
    setSubmitting(true);
    createPlant(newPlant)
      .then((created) => setPlants((prev) => [...prev, created]))
      .catch((err) => setError(err.message))
      .finally(() => setSubmitting(false));
  }

  function handleWater(id) {
    setActionLoadingId(id);
    updatePlant(id, { lastWateredDate: new Date().toISOString() })
      .then((updated) =>
        setPlants((prev) => prev.map((p) => (p.id === id ? updated : p)))
      )
      .catch((err) => setError(err.message))
      .finally(() => setActionLoadingId(null));
  }

  function handleDelete(id) {
    setActionLoadingId(id);
    deletePlant(id)
      .then(() => setPlants((prev) => prev.filter((p) => p.id !== id)))
      .catch((err) => setError(err.message))
      .finally(() => setActionLoadingId(null));
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 md:px-10 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🌱 PlantCare</h1>
        <p className="text-gray-500 mb-8">
          Track when each of your plants needs water.
        </p>

        <PlantForm onAdd={handleAdd} submitting={submitting} />

        {loading && <LoadingState />}
        {!loading && error && <ErrorState message={error} onRetry={loadPlants} />}
        {!loading && !error && plants.length === 0 && <EmptyState />}
        {!loading && !error && plants.length > 0 && (
          <PlantList
            plants={plants}
            onWater={handleWater}
            onDelete={handleDelete}
            actionLoadingId={actionLoadingId}
          />
        )}
      </div>
    </div>
  );
}

export default App;