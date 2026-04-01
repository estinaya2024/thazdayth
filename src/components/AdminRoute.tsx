import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/Context/AuthContext";

/**
 * ADMIN ROUTE PROTECTOR
 * This component wraps any route that should only be accessible by the owner.
 * It checks if the user is authenticated and has the 'owner' role.
 */

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    console.log("[AdminRoute] Loading auth state...");
    return <div className="h-screen w-full flex items-center justify-center">Chargement...</div>;
  }

  console.log("[AdminRoute] Checking access:", { isAuthenticated, role: user?.role });

  if (!isAuthenticated || user?.role !== "owner") {
    console.warn("[AdminRoute] Access denied. Redirecting to home.", { 
      reason: !isAuthenticated ? "Not authenticated" : `Invalid role: ${user?.role}` 
    });
    // If not admin, redirect to home
    return <Navigate to="/" replace />;
  }

  console.log("[AdminRoute] Access granted to dashboard.");

  return <>{children}</>;
};

export default AdminRoute;
