import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { PlantsProvider } from "./context/PlantsContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Plants from "./pages/Plants";

function App() {
  return (
    <AuthProvider>
      {/* ToastProvider sits above the router, so ANY page (Login,
          Signup, Plants) can trigger a toast via useToast(). */}
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  {/* PlantsProvider only wraps the authenticated area,
                      since plant data requires a logged-in user. */}
                  <PlantsProvider>
                    <Plants />
                  </PlantsProvider>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;