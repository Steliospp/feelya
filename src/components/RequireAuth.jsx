import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { homePathForRole, ROLES } from '../lib/roles';

export default function RequireAuth({ children, roles }) {
  const { user, loading } = useAuth();

  // Wait for Supabase session to resolve before deciding
  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // SUPER_ADMIN can access everything
  if (roles && user.role !== ROLES.SUPER_ADMIN && !roles.includes(user.role)) {
    return <Navigate to={homePathForRole(user.role)} replace />;
  }

  return children;
}
