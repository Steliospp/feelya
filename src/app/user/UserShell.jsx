import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, Calendar, Users, BookOpen, User, Search, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../../components/ui/avatar';

const links = [
  { to: '/app', label: 'Home', icon: Home, end: true },
  { to: '/app/sessions', label: 'Sessions', icon: Calendar },
  { to: '/app/therapists', label: 'Therapists', icon: Search },
  { to: '/app/workshops', label: 'Workshops', icon: Users },
  { to: '/app/resources', label: 'Resources', icon: BookOpen },
  { to: '/app/profile', label: 'Profile', icon: User },
];

function SideLink({ to, label, icon: Icon, end, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[14px] font-medium transition-colors no-underline hover:no-underline ${
          isActive
            ? 'bg-primary-50 text-primary'
            : 'text-text-secondary hover:bg-surface-dim hover:text-text-primary'
        }`
      }
    >
      <Icon className="w-[20px] h-[20px]" />
      {label}
    </NavLink>
  );
}

export default function UserShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMobile = () => setMobileOpen(false);

  const sidebarContent = (
    <>
      <div className="p-4">
        <a href="/" className="flex items-center gap-2 no-underline hover:no-underline">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="14" fill="url(#ulg)"/><path d="M8 14.5C8 14.5 10.5 9 14 9C17.5 9 20 14.5 20 14.5C20 14.5 17.5 20 14 20C10.5 20 8 14.5 8 14.5Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="14" cy="14.5" r="2.5" fill="#fff"/><defs><linearGradient id="ulg" x1="0" y1="0" x2="28" y2="28"><stop stopColor="#6366f1"/><stop offset="1" stopColor="#8b5cf6"/></linearGradient></defs></svg>
          <span className="text-[18px] font-semibold text-text-primary">feelya</span>
        </a>
      </div>
      {user?.companyName && (
        <div className="px-4 pb-3">
          <div className="text-[13px] font-medium text-text-secondary">{user.companyName}</div>
        </div>
      )}
      <nav className="flex-1 px-3 space-y-1">
        {links.map((l) => (
          <SideLink key={l.to} {...l} onClick={closeMobile} />
        ))}
      </nav>
      <div className="p-3 border-t border-border-light">
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar name={`${user?.first_name} ${user?.last_name}`} color={user?.avatar_color} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium text-text-primary truncate">{user?.first_name} {user?.last_name}</div>
            <div className="text-[11px] text-text-muted truncate">{user?.email}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-[13px] font-medium text-text-secondary hover:text-danger rounded-[8px] hover:bg-surface-dim transition-colors cursor-pointer bg-transparent border-none no-underline"
        >
          <LogOut className="w-4 h-4" /> Log out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-dvh bg-surface-muted">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-[260px] h-full bg-surface border-r border-border flex-col shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={closeMobile} />
          <aside className="absolute left-0 top-0 h-full w-[280px] bg-surface flex flex-col shadow-elevated animate-slide-in">
            <div className="flex items-center justify-between p-4">
              <a href="/" className="flex items-center gap-2 no-underline hover:no-underline">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="14" fill="url(#ulg2)"/><path d="M8 14.5C8 14.5 10.5 9 14 9C17.5 9 20 14.5 20 14.5C20 14.5 17.5 20 14 20C10.5 20 8 14.5 8 14.5Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="14" cy="14.5" r="2.5" fill="#fff"/><defs><linearGradient id="ulg2" x1="0" y1="0" x2="28" y2="28"><stop stopColor="#6366f1"/><stop offset="1" stopColor="#8b5cf6"/></linearGradient></defs></svg>
                <span className="text-[18px] font-semibold text-text-primary">feelya</span>
              </a>
              <button onClick={closeMobile} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-dim cursor-pointer border-none bg-transparent">
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>
            {user?.companyName && (
              <div className="px-4 pb-3">
                <div className="text-[13px] font-medium text-text-secondary">{user.companyName}</div>
              </div>
            )}
            <nav className="flex-1 px-3 space-y-1">
              {links.map((l) => (
                <SideLink key={l.to} {...l} onClick={closeMobile} />
              ))}
            </nav>
            <div className="p-3 border-t border-border-light">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2 text-[13px] font-medium text-text-secondary hover:text-danger rounded-[8px] hover:bg-surface-dim transition-colors cursor-pointer bg-transparent border-none no-underline"
              >
                <LogOut className="w-4 h-4" /> Log out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between h-14 px-4 bg-surface border-b border-border shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-[8px] hover:bg-surface-dim cursor-pointer border-none bg-transparent"
          >
            <Menu className="w-5 h-5 text-text-primary" />
          </button>
          <span className="text-[16px] font-semibold text-text-primary">feelya</span>
          <Avatar name={`${user?.first_name} ${user?.last_name}`} color={user?.avatar_color} size="sm" />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
