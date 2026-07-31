import { useState } from "react";

const CATEGORY_OPTIONS = ["Succulent", "Fern", "Flowering", "Foliage", "Herb", "Other"];
const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB, matches the backend limit

function todayISODate() {
  return new Date().toISOString().split("T")[0];
}

export default function PlantForm({ onAdd, submitting, serverFieldErrors }) {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [category, setCategory] = useState("");
  const [frequency, setFrequency] = useState("7");
  const [dateAcquired, setDateAcquired] = useState(todayISODate());
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) {
      setPhoto(null);
      setPhotoPreview(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, photo: "Please choose an image file." }));
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      setErrors((prev) => ({ ...prev, photo: "Image must be under 5MB." }));
      return;
    }

    setErrors((prev) => ({ ...prev, photo: undefined }));
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

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

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("species", species.trim());
    formData.append("category", category);
    formData.append("wateringFrequencyDays", frequency);
    formData.append("dateAcquired", dateAcquired);
    formData.append("notes", notes.trim());
    formData.append("lastWateredDate", new Date().toISOString());
    if (photo) formData.append("photo", photo);

    onAdd(formData, () => {
      // called by the parent on success, to reset the form
      setName("");
      setSpecies("");
      setCategory("");
      setFrequency("7");
      setDateAcquired(todayISODate());
      setNotes("");
      setPhoto(null);
      setPhotoPreview(null);
      setErrors({});
    });
  }

  // Server-side errors (e.g. duplicate/edge cases the client missed)
  // get merged in so both validation layers show up the same way.
  const allErrors = { ...errors, ...serverFieldErrors };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-lg p-6 mb-8"
    >
      <h2 className="font-semibold text-gray-900 mb-4">Add a plant</h2>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Plant name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Fiddle Leaf Fig"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
          {allErrors.name && <p className="text-red-600 text-xs mt-1">{allErrors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Species <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            placeholder="Ficus lyrata"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white"
          >
            <option value="">Select a category...</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {allErrors.category && <p className="text-red-600 text-xs mt-1">{allErrors.category}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Water every (days)
          </label>
          <input
            type="number"
            min="1"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
          {allErrors.wateringFrequencyDays && (
            <p className="text-red-600 text-xs mt-1">{allErrors.wateringFrequencyDays}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date acquired
          </label>
          <input
            type="date"
            value={dateAcquired}
            max={todayISODate()}
            onChange={(e) => setDateAcquired(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
          {allErrors.dateAcquired && (
            <p className="text-red-600 text-xs mt-1">{allErrors.dateAcquired}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Photo <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-700 file:text-sm hover:file:bg-gray-200"
          />
          {allErrors.photo && <p className="text-red-600 text-xs mt-1">{allErrors.photo}</p>}
          {photoPreview && (
            <img
              src={photoPreview}
              alt="Preview"
              className="mt-2 w-16 h-16 object-cover rounded-md border border-gray-200"
            />
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Gift from mom, keep away from direct sun..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
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