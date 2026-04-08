import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { LoadingWrap } from "./LoadingWrap";

export function RequireAdmin({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingWrap />; 

  const isAdmin = user?.is_staff || user?.is_superuser;

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/events" replace />;  
  return children;
}