import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
  const { signup, loading, error } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  function validate() {
    const errors = {};
    if (!email.trim()) errors.email = "Email is required.";
    else if (!EMAIL_REGEX.test(email)) errors.email = "Enter a valid email address.";

    if (!password) errors.password = "Password is required.";
    else if (password.length < 8) errors.password = "Password must be at least 8 characters.";

    if (confirmPassword !== password) errors.confirmPassword = "Passwords don't match.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const success = await signup({ email: email.trim(), password });
    if (success) {
      showToast("Account created — welcome to PlantCare!", "success");
      navigate("/");
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-lg p-8 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-1">🌱 Create account</h1>
        <p className="text-gray-500 text-sm mb-6">Start tracking your plants.</p>

        <label htmlFor="signup-email" className="block text-sm font-medium text-stone-700 mb-1">Email</label>
        <input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-1 focus:outline-none focus:border-blue-500"
        />
        {fieldErrors.email && <p className="text-red-600 text-xs mb-2">{fieldErrors.email}</p>}

        <label htmlFor="signup-password" className="block text-sm font-medium text-stone-700 mb-1">Password</label>
        <input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-1 focus:outline-none focus:border-blue-500"
        />
        {fieldErrors.password && <p className="text-red-600 text-xs mb-2">{fieldErrors.password}</p>}

        <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-gray-700 mb-1 mt-3">Confirm password</label>
        <input
          id="signup-confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-1 focus:outline-none focus:border-blue-500"
        />
        {fieldErrors.confirmPassword && (
          <p className="text-red-600 text-xs mb-2">{fieldErrors.confirmPassword}</p>
        )}

        {error && <p className="text-red-600 text-sm mt-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white font-medium py-2.5 rounded-md hover:bg-green-700 disabled:opacity-50 mt-5"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>

        <p className="text-sm text-gray-500 mt-5 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 underline hover:text-blue-700">Log in</Link>
        </p>
      </form>
    </main>
  );
}