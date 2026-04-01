import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/Context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  userOnly?: boolean;
}

const ProtectedRoute = ({ children, userOnly = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center">Chargement...</div>;
  }

  if (userOnly && !isAuthenticated) {
    // Redirect to login but save the current location they were trying to go to
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
