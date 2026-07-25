import { useState } from "react";

export default function PlantForm({ onAdd, submitting }) {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [frequency, setFrequency] = useState(7);
  const [error, setError] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Plant name is required.");
      return;
    }

    onAdd({
      name: name.trim(),
      species: species.trim(),
      wateringFrequencyDays: Number(frequency),
      lastWateredDate: new Date().toISOString(),
    });

    setName("");
    setSpecies("");
    setFrequency(7);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-lg p-5 mb-8 flex flex-col sm:flex-row gap-3"
    >
      <input
        type="text"
        placeholder="Plant name (e.g. Fiddle Leaf Fig)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
      />
      <input
        type="text"
        placeholder="Species (optional)"
        value={species}
        onChange={(e) => setSpecies(e.target.value)}
        className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
      />
      <input
        type="number"
        min="1"
        placeholder="Water every N days"
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
        className="sm:w-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
      />
      <button
        type="submit"
        disabled={submitting}
        className="bg-green-600 text-white text-sm font-medium px-5 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 whitespace-nowrap"
      >
        {submitting ? "Adding..." : "Add plant"}
      </button>

      {error && (
        <p className="text-red-600 text-xs sm:absolute sm:-mt-8">{error}</p>
      )}
    </form>
  );
}