import { createContext, useContext, useState } from "react";
import { loginRequest, signupRequest } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Read any existing session from localStorage on first load, so
  // refreshing the page doesn't log the user out.
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [email, setEmail] = useState(() => localStorage.getItem("email"));
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function saveSession(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("email", data.email);
    setToken(data.token);
    setEmail(data.email);
  }

  async function login(credentials) {
    setLoading(true);
    setError(null);
    try {
      const data = await loginRequest(credentials);
      saveSession(data);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function signup(credentials) {
    setLoading(true);
    setError(null);
    try {
      const data = await signupRequest(credentials);
      saveSession(data);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setToken(null);
    setEmail(null);
  }

  return (
    <AuthContext.Provider
      value={{ token, email, isAuthenticated: !!token, login, signup, logout, error, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}