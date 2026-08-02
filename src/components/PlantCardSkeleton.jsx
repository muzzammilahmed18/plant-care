// Mimics the real PlantCard's shape while data is loading, instead of a
// spinner or a blank screen. Rendering several of these in a grid gives
// an immediate sense of "content is coming" and roughly where it'll sit.
export default function PlantCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
      <div className="w-full h-36 bg-gray-200" />
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-3 bg-gray-100 rounded w-1/3" />
          </div>
          <div className="h-5 w-16 bg-gray-200 rounded-full" />
        </div>
        <div className="h-5 w-20 bg-gray-100 rounded-full" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="flex gap-2 mt-1">
          <div className="h-9 flex-1 bg-gray-200 rounded-md" />
          <div className="h-9 w-14 bg-gray-100 rounded-md" />
        </div>
      </div>
    </div>
  );
}