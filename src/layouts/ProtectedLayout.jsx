import { Outlet } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import { PlantsProvider } from "../context/PlantsContext";

// Wraps every authenticated page (Plants, Dashboard, anything added
// later) in a SINGLE shared PlantsProvider, instead of each page
// mounting its own copy and re-fetching independently. <Outlet />
// renders whichever child route matched.
export default function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <PlantsProvider>
        <Outlet />
      </PlantsProvider>
    </ProtectedRoute>
  );
}