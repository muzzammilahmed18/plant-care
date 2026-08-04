import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedLayout from "./layouts/ProtectedLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Plants from "./pages/Plants";

const Dashboard = lazy(() => import("./pages/Dashboard"));

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<ProtectedLayout />}>
              <Route path="/" element={<Plants />} />
              <Route
                path="/dashboard"
                element={
                  <Suspense fallback={<div className="p-10 text-stone-500">Loading dashboard...</div>}>
                    <Dashboard />
                  </Suspense>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;

// trigger fresh deploy