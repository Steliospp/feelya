import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequireAuth({ children, roles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // Redirect to the appropriate home for their role
    if (user.role === 'SUPER_ADMIN') return <Navigate to="/admin" replace />;
    if (user.role === 'HR_ADMIN') return <Navigate to="/app/hr" replace />;
    return <Navigate to="/app" replace />;
  }

  return children;
}
