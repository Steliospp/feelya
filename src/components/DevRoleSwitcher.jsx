import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roles = [
  { role: 'EMPLOYEE', label: 'Employee', path: '/app' },
  { role: 'THERAPIST', label: 'Therapist', path: '/therapist' },
  { role: 'HR_ADMIN', label: 'HR', path: '/hr' },
  { role: 'SUPER_ADMIN', label: 'Super Admin', path: '/admin' },
];

export default function DevRoleSwitcher() {
  const { user, switchRole, logout } = useAuth();
  const navigate = useNavigate();

  if (import.meta.env.PROD) return null;

  const handleSwitch = (role, path) => {
    switchRole(role);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 16,
      left: 16,
      zIndex: 9999,
      background: '#1e1b4b',
      borderRadius: 12,
      padding: '10px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
      fontSize: 12,
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      <span style={{ color: '#94a3b8', fontWeight: 500, marginRight: 4 }}>DEV</span>
      {roles.map(({ role, label, path }) => (
        <button
          key={role}
          onClick={() => handleSwitch(role, path)}
          style={{
            padding: '5px 10px',
            borderRadius: 6,
            border: 'none',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: 11,
            textDecoration: 'none',
            background: user?.role === role ? '#6366f1' : 'rgba(255,255,255,0.1)',
            color: user?.role === role ? '#fff' : '#94a3b8',
            transition: 'all 0.15s',
          }}
        >
          {label}
        </button>
      ))}
      <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />
      <button
        onClick={handleLogout}
        style={{
          padding: '5px 10px',
          borderRadius: 6,
          border: 'none',
          cursor: 'pointer',
          fontWeight: 500,
          fontSize: 11,
          textDecoration: 'none',
          background: 'rgba(239,68,68,0.15)',
          color: '#f87171',
          transition: 'all 0.15s',
        }}
      >
        Log out
      </button>
    </div>
  );
}
