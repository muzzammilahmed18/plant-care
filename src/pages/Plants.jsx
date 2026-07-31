import { useState, useEffect, useCallback } from "react";
import PlantForm from "../components/PlantForm";
import PlantList, { LoadingState, ErrorState, EmptyState } from "../components/PlantList";
import Toast from "../components/Toast";
import { getPlants, createPlant, updatePlant, deletePlant } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Plants() {
  const { email, logout } = useAuth();

  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [serverFieldErrors, setServerFieldErrors] = useState({});
  const [toast, setToast] = useState(null); // { message, type }

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

  function handleAdd(formData, resetForm) {
    setSubmitting(true);
    setServerFieldErrors({});
    createPlant(formData)
      .then((created) => {
        setPlants((prev) => [...prev, created]);
        setToast({ message: `${created.name} added.`, type: "success" });
        resetForm();
      })
      .catch((err) => {
        if (err.fieldErrors) {
          setServerFieldErrors(err.fieldErrors);
        }
        setToast({ message: err.message || "Couldn't add plant.", type: "error" });
      })
      .finally(() => setSubmitting(false));
  }

  function handleWater(id) {
    setActionLoadingId(id);
    updatePlant(id, { lastWateredDate: new Date().toISOString() })
      .then((updated) => {
        setPlants((prev) => prev.map((p) => (p.id === id ? updated : p)));
        setToast({ message: "Marked as watered.", type: "success" });
      })
      .catch((err) => {
        setError(err.message);
        setToast({ message: "Couldn't update that plant.", type: "error" });
      })
      .finally(() => setActionLoadingId(null));
  }

  function handleDelete(id) {
    setActionLoadingId(id);
    deletePlant(id)
      .then(() => {
        setPlants((prev) => prev.filter((p) => p.id !== id));
        setToast({ message: "Plant removed.", type: "success" });
      })
      .catch((err) => {
        setError(err.message);
        setToast({ message: "Couldn't delete that plant.", type: "error" });
      })
      .finally(() => setActionLoadingId(null));
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 md:px-10 py-12">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}

      <div className="max-w-5xl mx-auto">
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900">🌱 PlantCare</h1>
          <div className="text-right">
            <p className="text-sm text-gray-500">{email}</p>
            <button onClick={logout} className="text-sm text-red-600 hover:underline">
              Log out
            </button>
          </div>
        </div>
        <p className="text-gray-500 mb-8">
          Track when each of your plants needs water.
        </p>

        <PlantForm
          onAdd={handleAdd}
          submitting={submitting}
          serverFieldErrors={serverFieldErrors}
        />

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