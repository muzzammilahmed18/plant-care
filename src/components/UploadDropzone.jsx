import { useState, useRef } from "react";
import { uploadFile } from "../api";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB, matches the backend limit

// A styled drag-and-drop zone (falls back to click-to-browse) that
// uploads the file immediately, showing real progress, then hands the
// resulting URL back to whoever's using this component — separate from
// whatever form eventually gets submitted.
export default function UploadDropzone({ photoUrl, onUploaded, onClear }) {
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(null); // null = not uploading
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  function validate(file) {
    if (!file.type.startsWith("image/")) {
      return "Please choose an image file.";
    }
    if (file.size > MAX_SIZE) {
      return "Image must be under 5MB.";
    }
    return null;
  }

  function startUpload(file) {
    const validationError = validate(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setPreview(URL.createObjectURL(file));
    setProgress(0);

    uploadFile(file, setProgress)
      .then((data) => {
        onUploaded(data.url);
        setProgress(null);
      })
      .catch((err) => {
        setError(err.message || "Upload failed. Try again.");
        setProgress(null);
      });
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) startUpload(file);
  }

  function handleFileInput(e) {
    const file = e.target.files[0];
    if (file) startUpload(file);
  }

  function handleClear() {
    setPreview(null);
    setError(null);
    onClear();
    if (inputRef.current) inputRef.current.value = "";
  }

  const isUploading = progress !== null;
  const displayImage = photoUrl ? `http://localhost:5000${photoUrl}` : preview;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Photo <span className="text-gray-400 font-normal">(optional)</span>
      </label>

      {displayImage ? (
        <div className="relative w-full h-36 rounded-md overflow-hidden border border-gray-200">
          <img src={displayImage} alt="Upload preview" className="w-full h-full object-cover" />

          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
              <div className="w-2/3 h-2 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-white text-xs font-medium">{progress}%</span>
            </div>
          )}

          {!isUploading && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-2 right-2 bg-black/60 text-white text-xs w-6 h-6 rounded-full hover:bg-black/80"
            >
              ✕
            </button>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
          className={`w-full h-36 rounded-md border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"
          }`}
        >
          <span className="text-2xl mb-1">📷</span>
          <p className="text-sm text-gray-500">
            <span className="text-blue-600 font-medium">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-400 mt-0.5">PNG or JPG, up to 5MB</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />

      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}