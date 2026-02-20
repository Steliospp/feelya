import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/app.css';

export default function HRLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initial = (user.first_name || 'U')[0].toUpperCase();

  return (
    <>
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar__top">
          <a href="/" className="sidebar__logo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="14" fill="url(#slg)"/><path d="M8 14.5C8 14.5 10.5 9 14 9C17.5 9 20 14.5 20 14.5C20 14.5 17.5 20 14 20C10.5 20 8 14.5 8 14.5Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="14" cy="14.5" r="2.5" fill="#fff"/><defs><linearGradient id="slg" x1="0" y1="0" x2="28" y2="28"><stop stopColor="#6366f1"/><stop offset="1" stopColor="#8b5cf6"/></linearGradient></defs></svg>
            <span>feelya</span>
          </a>

          <div className="sidebar__org">
            <div className="sidebar__org-name">{user.companyName}</div>
          </div>

          <nav className="sidebar__nav">
            <div className="sidebar__section">
              <div className="sidebar__section-label">HR Admin</div>
              <NavLink to="/app/hr" end className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 3h7v7H3V3zm10 0h4v4h-4V3zM3 13h4v4H3v-4zm10 3.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Dashboard
              </NavLink>
              <NavLink to="/app/hr/employees" className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M14 17v-1a3 3 0 00-3-3H6a3 3 0 00-3 3v1m15-1v-1a3 3 0 00-2.25-2.9M11.5 3.1a3 3 0 010 5.8M8.5 9a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Employees
              </NavLink>
            </div>
          </nav>
        </div>
        <div className="sidebar__bottom">
          <div className="sidebar__link" style={{ cursor: 'default' }}>
            <div className="sidebar__avatar" style={{ background: user.avatar_color }}>{initial}</div>
            <span>{user.first_name} {user.last_name}</span>
          </div>
          <button className="sidebar__link sidebar__logout" onClick={handleLogout}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 17H4a1 1 0 01-1-1V4a1 1 0 011-1h3M13 14l4-4-4-4M17 10H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Log Out
          </button>
        </div>
      </aside>

      <header className="mobile-header">
        <button className="mobile-header__burger" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <span></span><span></span><span></span>
        </button>
        <a href="/" className="mobile-header__logo">feelya</a>
        <div className="mobile-header__avatar" style={{ background: user.avatar_color }}>{initial}</div>
      </header>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <main className="main">
        <div className="main__content">
          <Outlet />
        </div>
      </main>
    </>
  );
}
