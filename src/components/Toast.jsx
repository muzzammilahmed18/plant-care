import { useEffect } from "react";

// A small temporary banner that auto-dismisses. Separate from the
// inline field errors — this is for "the request as a whole succeeded
// or failed," not "this specific field is wrong."
export default function Toast({ message, type = "success", onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const styles =
    type === "success"
      ? "bg-green-600 text-white"
      : "bg-red-600 text-white";

  return (
    <div
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-3 ${styles}`}
    >
      <span>{message}</span>
      <button onClick={onDismiss} className="opacity-80 hover:opacity-100">
        ✕
      </button>
    </div>
  );
}