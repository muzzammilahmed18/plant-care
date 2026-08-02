import PlantForm from "../components/PlantForm";
import PlantList, { LoadingState, ErrorState, EmptyState } from "../components/PlantList";
import { useAuth } from "../context/AuthContext";
import { usePlants } from "../context/PlantsContext";

// Notice how little this page owns now. Previously it held plants,
// loading, error, submitting, actionLoadingId, serverFieldErrors, toast,
// and every handler function — all passed down as props. Now all of
// that lives in PlantsContext/ToastContext, and this page just reads
// what it needs to decide which state to render.
export default function Plants() {
  const { email, logout } = useAuth();
  const { loading, error, plants, loadPlants } = usePlants();

  return (
    <div className="min-h-screen bg-gray-50 px-6 md:px-10 py-12">
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

        <PlantForm />

        {loading && <LoadingState />}
        {!loading && error && <ErrorState message={error} onRetry={loadPlants} />}
        {!loading && !error && plants.length === 0 && <EmptyState />}
        {!loading && !error && plants.length > 0 && <PlantList />}
      </div>
    </div>
  );
}