import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ToastProvider } from './Toast';
import '../styles/app.css';

const sections = [
  {
    label: 'Overview',
    items: [
      { to: '/admin', end: true, label: 'Dashboard', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 3h7v7H3V3zm10 0h4v4h-4V3zM3 13h4v4H3v-4zm10 3.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    ],
  },
  {
    label: 'Manage',
    items: [
      { to: '/admin/sessions', label: 'Sessions', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M13 2v4M7 2v4M3 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
      { to: '/admin/therapists', label: 'Therapists', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M17 17v-1a4 4 0 00-3-3.87M13 3.13a4 4 0 010 7.75M9 9a4 4 0 100-8 4 4 0 000 8zm0 2c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
      { to: '/admin/users', label: 'Users', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 17v-1a3 3 0 00-3-3H8a3 3 0 00-3 3v1M10 10a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
      { to: '/admin/companies', label: 'Companies', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 17h14M4 4h5v13H4V4zm7 3h5v10h-5V7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { to: '/admin/coupons', label: 'Coupons', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2 7a2 2 0 012-2h12a2 2 0 012 2v1a2 2 0 100 4v1a2 2 0 01-2 2H4a2 2 0 01-2-2v-1a2 2 0 100-4V7z" stroke="currentColor" strokeWidth="1.5"/><path d="M8 8v4m4-4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
      { to: '/admin/categories', label: 'Categories', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5h14M3 10h14M3 15h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
    ],
  },
  {
    label: 'Content',
    items: [
      { to: '/admin/content', label: 'Content', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 3h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1zm0 4h12M7 7v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
      { to: '/admin/workshops', label: 'Workshops', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M14 17v-1a3 3 0 00-3-3H6a3 3 0 00-3 3v1m15-1v-1a3 3 0 00-2.25-2.9M11.5 3.1a3 3 0 010 5.8M8.5 9a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
      { to: '/admin/demos', label: 'Demo Leads', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4h12a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1zm0 3h12M7 4v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    ],
  },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initial = (user.first_name || 'U')[0].toUpperCase();

  return (
    <ToastProvider>
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar__top">
          <a href="/" className="sidebar__logo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="14" fill="url(#slg)"/><path d="M8 14.5C8 14.5 10.5 9 14 9C17.5 9 20 14.5 20 14.5C20 14.5 17.5 20 14 20C10.5 20 8 14.5 8 14.5Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="14" cy="14.5" r="2.5" fill="#fff"/><defs><linearGradient id="slg" x1="0" y1="0" x2="28" y2="28"><stop stopColor="#6366f1"/><stop offset="1" stopColor="#8b5cf6"/></linearGradient></defs></svg>
            <span>feelya</span>
          </a>

          <div className="sidebar__org">
            <div className="sidebar__org-name" style={{ color: '#10b981' }}>Super Admin</div>
          </div>

          <nav className="sidebar__nav">
            {sections.map((section, i) => (
              <div className="sidebar__section" key={i}>
                <div className="sidebar__section-label">{section.label}</div>
                {section.items.map(item => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                ))}
              </div>
            ))}
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
    </ToastProvider>
  );
}
