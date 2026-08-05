import { useState } from "react";
import { usePlants } from "../context/PlantsContext";
import UploadDropzone from "./UploadDropzone";

const CATEGORY_OPTIONS = ["Succulent", "Fern", "Flowering", "Foliage", "Herb", "Other"];

function todayISODate() {
  return new Date().toISOString().split("T")[0];
}

// onAdd/submitting/serverFieldErrors used to be passed down as props
// from Plants.jsx. Now this form reads them straight from
// PlantsContext, since it's rendered anywhere inside a PlantsProvider.
export default function PlantForm() {
  const { addPlant, submitting, serverFieldErrors } = usePlants();
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [category, setCategory] = useState("");
  const [frequency, setFrequency] = useState("7");
  const [dateAcquired, setDateAcquired] = useState(todayISODate());
  const [notes, setNotes] = useState("");
  // Just a URL string now — the actual upload already happened via
  // UploadDropzone by the time this form is submitted.
  const [photoUrl, setPhotoUrl] = useState(null);
  const [errors, setErrors] = useState({});

  function validate() {
    const next = {};

    if (!name.trim() || name.trim().length < 2) {
      next.name = "Name must be at least 2 characters.";
    }
    if (!category) {
      next.category = "Please choose a category.";
    }
    const freqNum = Number(frequency);
    if (!frequency || isNaN(freqNum) || freqNum < 1) {
      next.wateringFrequencyDays = "Enter a positive number of days.";
    }
    if (!dateAcquired) {
      next.dateAcquired = "Date acquired is required.";
    } else if (new Date(dateAcquired) > new Date()) {
      next.dateAcquired = "Date acquired can't be in the future.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const plantData = {
      name: name.trim(),
      species: species.trim(),
      category,
      wateringFrequencyDays: frequency,
      dateAcquired,
      notes: notes.trim(),
      lastWateredDate: new Date(dateAcquired).toISOString(),
      photoUrl,
    };

    addPlant(plantData, () => {
      // called by the parent on success, to reset the form
      setName("");
      setSpecies("");
      setCategory("");
      setFrequency("7");
      setDateAcquired(todayISODate());
      setNotes("");
      setPhotoUrl(null);
      setErrors({});
    });
  }

  // Server-side errors (e.g. duplicate/edge cases the client missed)
  // get merged in so both validation layers show up the same way.
  const allErrors = { ...errors, ...serverFieldErrors };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-stone-200 rounded-lg p-6 mb-8"
    >
      <h2 className="font-semibold text-stone-900 mb-4">Add a plant</h2>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="plant-name" className="block text-sm font-medium text-stone-700 mb-1">
            Plant name
          </label>
          <input
            id="plant-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Fiddle Leaf Fig"
            className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
          {allErrors.name && <p className="text-red-600 text-xs mt-1">{allErrors.name}</p>}
        </div>

        <div>
          <label htmlFor="plant-species" className="block text-sm font-medium text-stone-700 mb-1">
            Species <span className="text-stone-400 font-normal">(optional)</span>
          </label>
          <input
            id="plant-species"
            type="text"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            placeholder="Ficus lyrata"
            className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="plant-category" className="block text-sm font-medium text-stone-700 mb-1">
            Category
          </label>
          <select
            id="plant-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white"
          >
            <option value="">Select a category...</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {allErrors.category && <p className="text-red-600 text-xs mt-1">{allErrors.category}</p>}
        </div>

        <div>
          <label htmlFor="plant-frequency" className="block text-sm font-medium text-stone-700 mb-1">
            Water every (days)
          </label>
          <input
            id="plant-frequency"
            type="number"
            min="1"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
          {allErrors.wateringFrequencyDays && (
            <p className="text-red-600 text-xs mt-1">{allErrors.wateringFrequencyDays}</p>
          )}
        </div>

        <div>
          <label htmlFor="plant-date-acquired" className="block text-sm font-medium text-stone-700 mb-1">
            Date acquired
          </label>
          <input
            id="plant-date-acquired"
            type="date"
            value={dateAcquired}
            max={todayISODate()}
            onChange={(e) => setDateAcquired(e.target.value)}
            className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
          {allErrors.dateAcquired && (
            <p className="text-red-600 text-xs mt-1">{allErrors.dateAcquired}</p>
          )}
        </div>

        <UploadDropzone
          photoUrl={photoUrl}
          onUploaded={setPhotoUrl}
          onClear={() => setPhotoUrl(null)}
        />

        <div className="sm:col-span-2">
          <label htmlFor="plant-notes" className="block text-sm font-medium text-stone-700 mb-1">
            Notes <span className="text-stone-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="plant-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Gift from mom, keep away from direct sun..."
            className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 bg-green-600 text-white text-sm font-medium px-6 py-2.5 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
      >
        {submitting && (
          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        )}
        {submitting ? "Adding plant..." : "Add plant"}
      </button>
    </form>
  );
}