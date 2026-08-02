import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getPlants, createPlant, updatePlant, deletePlant } from "../api";
import { useToast } from "./ToastContext";

const PlantsContext = createContext(null);

// Previously, Plants.jsx owned all of this state directly and manually
// passed plants/onWater/onDelete/etc. down as props to PlantForm,
// PlantList, and PlantCard. Now any of those components can just call
// usePlants() and grab exactly what they need — no prop-drilling.
export function PlantsProvider({ children }) {
  const { showToast } = useToast();

  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [serverFieldErrors, setServerFieldErrors] = useState({});

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

  function addPlant(formData, resetForm) {
    setSubmitting(true);
    setServerFieldErrors({});
    createPlant(formData)
      .then((created) => {
        setPlants((prev) => [...prev, created]);
        showToast(`${created.name} added.`, "success");
        resetForm();
      })
      .catch((err) => {
        if (err.fieldErrors) setServerFieldErrors(err.fieldErrors);
        showToast(err.message || "Couldn't add plant.", "error");
      })
      .finally(() => setSubmitting(false));
  }

  function waterPlant(id) {
    setActionLoadingId(id);
    updatePlant(id, { lastWateredDate: new Date().toISOString() })
      .then((updated) => {
        setPlants((prev) => prev.map((p) => (p.id === id ? updated : p)));
        showToast("Marked as watered.", "success");
      })
      .catch(() => showToast("Couldn't update that plant.", "error"))
      .finally(() => setActionLoadingId(null));
  }

  function removePlant(id) {
    setActionLoadingId(id);
    deletePlant(id)
      .then(() => {
        setPlants((prev) => prev.filter((p) => p.id !== id));
        showToast("Plant removed.", "success");
      })
      .catch(() => showToast("Couldn't delete that plant.", "error"))
      .finally(() => setActionLoadingId(null));
  }

  return (
    <PlantsContext.Provider
      value={{
        plants,
        loading,
        error,
        submitting,
        actionLoadingId,
        serverFieldErrors,
        loadPlants,
        addPlant,
        waterPlant,
        removePlant,
      }}
    >
      {children}
    </PlantsContext.Provider>
  );
}

export function usePlants() {
  return useContext(PlantsContext);
}