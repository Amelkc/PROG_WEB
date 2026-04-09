import { useState, useContext, createContext, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { LoadingWrap } from "../components/LoadingWrap";
const API_BASE = "http://localhost:8000/api";
const AuthContext = createContext(null);

export function useAuth() { return useContext(AuthContext); }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  });
  const [tokens, setTokens] = useState(() => ({
    access: localStorage.getItem("access_token"),
    refresh: localStorage.getItem("refresh_token"),
  }));

  const login = async (username, password) => {
    const res = await fetch(`${API_BASE}/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error("Invalid credentials");
    const data = await res.json();
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    setTokens({ access: data.access, refresh: data.refresh });
    const me = await apiFetch("/participants/me/", { token: data.access });
    localStorage.setItem("user", JSON.stringify(me));
    setUser(me);
    return me;
  };

  const logout = () => {
    localStorage.clear();
    setTokens({ access: null, refresh: null });
    setUser(null);
  };

  const refreshToken = useCallback(async () => {
    if (!tokens.refresh) return null;
    const res = await fetch(`${API_BASE}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: tokens.refresh }),
    });
    if (!res.ok) { logout(); return null; }
    const data = await res.json();
    localStorage.setItem("access_token", data.access);
    setTokens(t => ({ ...t, access: data.access }));
    return data.access;
  }, [tokens.refresh]);

  return (
    <AuthContext.Provider value={{ user, tokens, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
}


export function RequireAdmin({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingWrap />; 

  const isAdmin = user?.is_staff || user?.is_superuser;

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/events" replace />;  
  return children;
}

export function RequireLogged({children}){
  const { tokens } = useAuth();
  const location = useLocation();
  if (!tokens.access) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}