import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedLayout from "./layouts/ProtectedLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Plants from "./pages/Plants";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <AuthProvider>
      {/* ToastProvider sits above the router, so ANY page (Login,
          Signup, Plants, Dashboard) can trigger a toast via useToast(). */}
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Both authenticated pages share one PlantsProvider via
                ProtectedLayout, so plant data is fetched once and used
                by whichever page is active. */}
            <Route element={<ProtectedLayout />}>
              <Route path="/" element={<Plants />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;