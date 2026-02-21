import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roles = [
  { role: 'EMPLOYEE', label: 'Employee', path: '/app' },
  { role: 'HR_ADMIN', label: 'HR', path: '/app/hr' },
  { role: 'THERAPIST', label: 'Therapist', path: '/therapist' },
  { role: 'SUPER_ADMIN', label: 'Super Admin', path: '/admin' },
];

export default function DevRoleSwitcher() {
  const { user, switchRole, logout } = useAuth();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [pos, setPos] = useState({ x: 16, y: window.innerHeight - 70 });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const moved = useRef(false);
  const panelRef = useRef(null);

  if (import.meta.env.PROD) return null;

  const handleSwitch = (role, path) => {
    switchRole(role);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /* Drag is initiated only from the handle (DEV label) */
  const onHandlePointerDown = useCallback((e) => {
    dragging.current = true;
    moved.current = false;
    offset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [pos]);

  const onHandlePointerMove = useCallback((e) => {
    if (!dragging.current) return;
    moved.current = true;
    const el = panelRef.current;
    const maxX = window.innerWidth - (el?.offsetWidth || 200);
    const maxY = window.innerHeight - (el?.offsetHeight || 50);
    setPos({
      x: Math.max(0, Math.min(e.clientX - offset.current.x, maxX)),
      y: Math.max(0, Math.min(e.clientY - offset.current.y, maxY)),
    });
  }, []);

  const onHandlePointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const toggleCollapse = () => {
    if (!moved.current) setCollapsed((c) => !c);
  };

  return (
    <div
      ref={panelRef}
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        zIndex: 9999,
        background: '#1e1b4b',
        borderRadius: 12,
        padding: collapsed ? '6px 12px' : '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
        fontSize: 12,
        fontFamily: "'Inter', -apple-system, sans-serif",
        userSelect: 'none',
        touchAction: 'none',
      }}
    >
      {/* Drag handle */}
      <span
        onPointerDown={onHandlePointerDown}
        onPointerMove={onHandlePointerMove}
        onPointerUp={onHandlePointerUp}
        onClick={toggleCollapse}
        style={{
          color: '#94a3b8',
          fontWeight: 600,
          marginRight: collapsed ? 0 : 4,
          cursor: 'grab',
          fontSize: 11,
          letterSpacing: '0.05em',
          padding: '2px 4px',
        }}
        title="Drag to move · Click to collapse"
      >
        DEV {collapsed ? '▸' : '▾'}
      </span>

      {!collapsed && (
        <>
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
              background: 'rgba(239,68,68,0.15)',
              color: '#f87171',
              transition: 'all 0.15s',
            }}
          >
            Log out
          </button>
        </>
      )}
    </div>
  );
}
