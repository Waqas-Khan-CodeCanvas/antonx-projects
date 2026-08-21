import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { login as loginRequest } from "../api/auth";
import { getMe } from "../api/protected";

const AuthContext = createContext(null);
const STORAGE_KEY = "fetch_lab_auth";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { token: savedToken, user: savedUser } = JSON.parse(saved);
        setToken(savedToken);
        setUser(savedUser);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setInitializing(false);
  }, []);

  const login = useCallback(async (username, password) => {
    const { token: newToken, user: newUser } = await loginRequest(username, password);
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: newToken, user: newUser }));
    return newUser;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const refreshMe = useCallback(async () => {
    if (!token) return;
    const { user: freshUser } = await getMe(token);
    setUser(freshUser);
  }, [token]);

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token),
    isAdmin: user?.role === "admin",
    initializing,
    login,
    logout,
    refreshMe,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}