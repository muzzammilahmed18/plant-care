import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  function validate() {
    const errors = {};
    if (!email.trim()) errors.email = "Email is required.";
    if (!password) errors.password = "Password is required.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const success = await login({ email: email.trim(), password });
    if (success) navigate("/");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-lg p-8 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-1">🌱 Welcome back</h1>
        <p className="text-gray-500 text-sm mb-6">Log in to see your plants.</p>

        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-1 focus:outline-none focus:border-blue-500"
        />
        {fieldErrors.email && <p className="text-red-600 text-xs mb-2">{fieldErrors.email}</p>}

        <label className="block text-sm font-medium text-gray-700 mb-1 mt-3">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-1 focus:outline-none focus:border-blue-500"
        />
        {fieldErrors.password && <p className="text-red-600 text-xs mb-2">{fieldErrors.password}</p>}

        {error && <p className="text-red-600 text-sm mt-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-md hover:bg-blue-700 disabled:opacity-50 mt-5"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        <p className="text-sm text-gray-500 mt-5 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link>
        </p>
      </form>
    </div>
  );
}