import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ToastProvider } from './Toast';
import { ModalProvider } from '../context/ModalContext';
import BookingModal from './BookingModal';
import TherapistProfileModal from './TherapistProfileModal';
import { ROLES } from '../lib/roles';
import { companyNav, getNavForRole } from '../lib/navConfig';
import HROnboarding from '../pages/HROnboarding';
import EmployeeOnboarding from '../pages/EmployeeOnboarding';
import '../styles/app.css';

const logoSvg = (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="14" fill="url(#slg)"/><path d="M8 14.5C8 14.5 10.5 9 14 9C17.5 9 20 14.5 20 14.5C20 14.5 17.5 20 14 20C10.5 20 8 14.5 8 14.5Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="14" cy="14.5" r="2.5" fill="#fff"/><defs><linearGradient id="slg" x1="0" y1="0" x2="28" y2="28"><stop stopColor="#6366f1"/><stop offset="1" stopColor="#8b5cf6"/></linearGradient></defs></svg>
);

const logoutIcon = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 17H4a1 1 0 01-1-1V4a1 1 0 011-1h3M13 14l4-4-4-4M17 10H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

export default function AppLayout() {
  const { user, logout, getOnboardingStatus } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  if (!user) return null;

  // Onboarding gates
  if (user.role === ROLES.HR_ADMIN && !getOnboardingStatus('HR_ADMIN', user.id)) {
    return <HROnboarding />;
  }
  if (user.role === ROLES.EMPLOYEE && !getOnboardingStatus('EMPLOYEE', user.id)) {
    return <EmployeeOnboarding />;
  }

  const initial = (user.first_name || 'U')[0].toUpperCase();
  const sections = getNavForRole(companyNav, user.role);
  const isHR = user.role === ROLES.HR_ADMIN || user.role === ROLES.SUPER_ADMIN;
  const orgLabel = user.companyName
    ? (isHR ? `${user.companyName} — HR Admin` : user.companyName)
    : null;

  return (
    <ModalProvider>
    <ToastProvider>
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar__top">
          <a href="/" className="sidebar__logo">
            {logoSvg}
            <span>feelya</span>
          </a>

          {orgLabel && (
            <div className="sidebar__org">
              <div className="sidebar__org-name">{orgLabel}</div>
            </div>
          )}

          <nav className="sidebar__nav">
            {sections.map((section, si) => {
              if (!section.label) {
                // Top-level items (no section header)
                return section.items.map(item => {
                  const isDashboard = item.to === '/app/dashboard';
                  const isAtRoot = location.pathname === '/app' || location.pathname === '/app/';
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={isDashboard}
                      className={({ isActive }) => `sidebar__link ${isActive || (isDashboard && isAtRoot) ? 'active' : ''}`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      {item.icon}
                      {item.label}
                    </NavLink>
                  );
                });
              }
              return (
                <div className="sidebar__section" key={si}>
                  <div className="sidebar__section-label">{section.label}</div>
                  {section.items.map(item => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      {item.icon}
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              );
            })}
          </nav>
        </div>
        <div className="sidebar__bottom">
          <NavLink to="/app/profile" className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
            <div className="sidebar__avatar" style={{ background: user.avatar_color }}>{initial}</div>
            <span>{user.first_name} {user.last_name}</span>
          </NavLink>
          <button className="sidebar__link sidebar__logout" onClick={handleLogout}>
            {logoutIcon}
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
          <Outlet context={{ user }} />
        </div>
      </main>

      <BookingModal />
      <TherapistProfileModal />
    </ToastProvider>
    </ModalProvider>
  );
}
