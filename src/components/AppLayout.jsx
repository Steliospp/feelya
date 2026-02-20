import { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ToastProvider } from './Toast';
import { ModalProvider } from '../context/ModalContext';
import BookingModal from './BookingModal';
import TherapistProfileModal from './TherapistProfileModal';
import '../styles/app.css';

export default function AppLayout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) loadNotifCount();
  }, [user]);

  async function loadNotifCount() {
    try {
      const res = await fetch('/api/notifications');
      const notifs = await res.json();
      setNotifCount(notifs.filter(n => !n.read).length);
    } catch {}
  }

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#64748b' }}>Loading...</div>;
  if (!user) return null;

  const initial = user.first_name[0].toUpperCase();

  return (
    <ModalProvider>
    <ToastProvider>
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar__top">
          <a href="/" className="sidebar__logo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="14" fill="url(#slg)"/><path d="M8 14.5C8 14.5 10.5 9 14 9C17.5 9 20 14.5 20 14.5C20 14.5 17.5 20 14 20C10.5 20 8 14.5 8 14.5Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="14" cy="14.5" r="2.5" fill="#fff"/><defs><linearGradient id="slg" x1="0" y1="0" x2="28" y2="28"><stop stopColor="#6366f1"/><stop offset="1" stopColor="#8b5cf6"/></linearGradient></defs></svg>
            <span>feelya</span>
          </a>

          {user.org_name && (
            <div className="sidebar__org">
              <div className="sidebar__org-name">{user.org_name}</div>
            </div>
          )}

          <nav className="sidebar__nav">
            {user.role === 'admin' && (
              <div className="sidebar__section">
                <div className="sidebar__section-label">Organisation</div>
                <NavLink to="/app/org" className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 3h7v7H3V3zm10 0h4v4h-4V3zM3 13h4v4H3v-4zm10 3.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Org Dashboard
                </NavLink>
                <NavLink to="/app/team" className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M14 17v-1a3 3 0 00-3-3H6a3 3 0 00-3 3v1m15-1v-1a3 3 0 00-2.25-2.9M11.5 3.1a3 3 0 010 5.8M8.5 9a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Team
                </NavLink>
              </div>
            )}

            {user.role === 'admin' && <div className="sidebar__section-label">Personal</div>}

            <NavLink to="/app/dashboard" className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 10l7-7 7 7M5 8.5V16a1 1 0 001 1h3v-4h2v4h3a1 1 0 001-1V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Dashboard
            </NavLink>
            <NavLink to="/app/therapists" className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M17 17v-1a4 4 0 00-3-3.87M13 3.13a4 4 0 010 7.75M9 9a4 4 0 100-8 4 4 0 000 8zm0 2c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Find a Therapist
            </NavLink>
            <NavLink to="/app/sessions" className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M13 2v4M7 2v4M3 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              Sessions
            </NavLink>
            <NavLink to="/app/employees" className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M14 15H6m0 0V9m0 6l-3 3m11-3l3 3M10 2a3 3 0 100 6 3 3 0 000-6zM4 14a6 6 0 0112 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Employees
            </NavLink>
            <NavLink to="/app/resources" className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4h5l2 2h5a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Resources
            </NavLink>
            <NavLink to="/app/notifications" className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2a6 6 0 00-6 6v3l-1.5 2.5h15L16 11V8a6 6 0 00-6-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 15.5a2.5 2.5 0 005 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              Notifications
              {notifCount > 0 && <span className="sidebar__badge">{notifCount}</span>}
            </NavLink>
          </nav>
        </div>
        <div className="sidebar__bottom">
          <NavLink to="/app/profile" className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
            <div className="sidebar__avatar" style={{ background: user.avatar_color }}>{initial}</div>
            <span>{user.first_name} {user.last_name}</span>
          </NavLink>
          <button className="sidebar__link sidebar__logout" onClick={handleLogout}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 17H4a1 1 0 01-1-1V4a1 1 0 011-1h3M13 14l4-4-4-4M17 10H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Log Out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="mobile-header">
        <button className="mobile-header__burger" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <span></span><span></span><span></span>
        </button>
        <a href="/" className="mobile-header__logo">feelya</a>
        <div className="mobile-header__avatar" style={{ background: user.avatar_color }}>{initial}</div>
      </header>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <main className="main">
        <div className="main__content">
          <Outlet context={{ user, loadNotifCount }} />
        </div>
      </main>

      <BookingModal />
      <TherapistProfileModal />
    </ToastProvider>
    </ModalProvider>
  );
}
