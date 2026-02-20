import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, Users, Zap, Clock, User, Search, Bell, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { to: '/app', label: 'Home', icon: Home, end: true },
  { to: '/app/start', label: 'Start', icon: Zap },
  { to: '/app/community', label: 'Community', icon: Users },
  { to: '/app/activity', label: 'Activity', icon: Clock },
];

function SideNavLink({ to, label, icon: Icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] font-medium transition-colors no-underline hover:no-underline ${
          isActive
            ? 'bg-indigo-50 text-indigo-600'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
        }`
      }
    >
      <Icon className="w-[18px] h-[18px]" />
      {label}
    </NavLink>
  );
}

export default function UserShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user
    ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase()
    : '?';

  const sidebar = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 pt-5 pb-4">
        <a href="/" className="flex items-center gap-2 no-underline hover:no-underline">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="14" fill="url(#lg2)" />
            <path d="M8 14.5C8 14.5 10.5 9 14 9C17.5 9 20 14.5 20 14.5C20 14.5 17.5 20 14 20C10.5 20 8 14.5 8 14.5Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="14" cy="14.5" r="2.5" fill="#fff" />
            <defs>
              <linearGradient id="lg2" x1="0" y1="0" x2="28" y2="28">
                <stop stopColor="#6366f1" />
                <stop offset="1" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-[17px] font-semibold text-gray-900">feelya</span>
        </a>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navLinks.map((l) => (
          <SideNavLink key={l.to} {...l} />
        ))}
      </nav>

      {/* User section */}
      <div className="px-3 pb-4 mt-auto border-t border-gray-100 pt-3">
        <NavLink
          to="/app/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg no-underline hover:no-underline transition-colors ${
              isActive ? 'bg-indigo-50' : 'hover:bg-gray-50'
            }`
          }
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-semibold shrink-0"
            style={{ backgroundColor: user?.avatar_color || '#6366f1' }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium text-gray-900 truncate">
              {user?.first_name} {user?.last_name}
            </div>
            <div className="text-[11px] text-gray-400 truncate">{user?.email}</div>
          </div>
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 mt-1 text-[13px] font-medium text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer bg-transparent border-none"
        >
          <LogOut className="w-4 h-4" /> Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-dvh bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-[260px] h-full bg-white border-r border-gray-200 flex-col shrink-0">
        {sidebar}
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-[280px] bg-white shadow-xl">
            <div className="flex items-center justify-end px-4 pt-3">
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 cursor-pointer border-none bg-transparent"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            {sidebar}
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-4 h-14 px-4 lg:px-8 max-w-[1280px]">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 cursor-pointer border-none bg-transparent shrink-0"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>

            {/* Search */}
            <div className="relative flex-1 max-w-[400px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search topics, guides..."
                className="w-full h-9 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-lg text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {/* Notifications */}
              <button className="relative w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 cursor-pointer border-none bg-transparent">
                <Bell className="w-[18px] h-[18px] text-gray-500" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500" />
              </button>

              {/* Profile */}
              <button
                onClick={() => navigate('/app/profile')}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-semibold cursor-pointer border-none shrink-0"
                style={{ backgroundColor: user?.avatar_color || '#6366f1' }}
              >
                {initials}
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-6 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
