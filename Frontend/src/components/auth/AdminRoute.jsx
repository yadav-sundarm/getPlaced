import { Navigate } from "react-router-dom";

/**
 * AdminRoute — wraps routes that only admins can access.
 * Reads the JWT from localStorage, decodes the payload (without verifying),
 * and redirects non-admins back to the student login page.
 *
 * Real security enforcement still happens on the backend via verifyJWT + requireAdmin.
 */
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  if (!token) return <Navigate to="/admin/login" replace />;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.role !== "admin") {
      localStorage.removeItem("adminToken");
      return <Navigate to="/admin/login" replace />;
    }
  } catch {
    localStorage.removeItem("adminToken");
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute;
