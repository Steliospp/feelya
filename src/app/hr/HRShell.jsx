import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Inbox, Users, BarChart3, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Avatar from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const links = [
  { to: '/hr', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/hr/workshops', label: 'Workshops', icon: CalendarDays },
  { to: '/hr/requests', label: 'Requests', icon: Inbox },
  { to: '/hr/employees', label: 'Employees', icon: Users },
  { to: '/hr/insights', label: 'Insights', icon: BarChart3 },
  { to: '/hr/settings', label: 'Settings', icon: Settings },
];

function SideLink({ to, label, icon: Icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[14px] font-medium transition-colors no-underline hover:no-underline',
          isActive ? 'bg-primary-50 text-primary' : 'text-text-secondary hover:bg-surface-dim hover:text-text-primary'
        )
      }
    >
      <Icon className="w-[20px] h-[20px]" />
      {label}
    </NavLink>
  );
}

export default function HRShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-dvh bg-surface-muted">
      {/* Sidebar */}
      <aside className="w-[260px] h-full bg-surface border-r border-border flex flex-col shrink-0">
        <div className="p-4">
          <a href="/" className="flex items-center gap-2 no-underline hover:no-underline">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="14" fill="url(#slg)"/><path d="M8 14.5C8 14.5 10.5 9 14 9C17.5 9 20 14.5 20 14.5C20 14.5 17.5 20 14 20C10.5 20 8 14.5 8 14.5Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="14" cy="14.5" r="2.5" fill="#fff"/><defs><linearGradient id="slg" x1="0" y1="0" x2="28" y2="28"><stop stopColor="#6366f1"/><stop offset="1" stopColor="#8b5cf6"/></linearGradient></defs></svg>
            <span className="text-[18px] font-semibold text-text-primary">feelya</span>
            <span className="text-[12px] font-medium text-primary bg-primary-50 px-2 py-0.5 rounded-full">HR</span>
          </a>
        </div>
        {user?.companyName && (
          <div className="px-4 pb-3">
            <div className="text-[13px] font-medium text-text-secondary">{user.companyName}</div>
          </div>
        )}
        <nav className="flex-1 px-3 space-y-1">
          {links.map((l) => <SideLink key={l.to} {...l} />)}
        </nav>
        <div className="p-3 border-t border-border-light">
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar name={`${user?.first_name} ${user?.last_name}`} color={user?.avatar_color} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium text-text-primary truncate">{user?.first_name} {user?.last_name}</div>
              <div className="text-[11px] text-text-muted truncate">{user?.email}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 text-[13px] font-medium text-text-secondary hover:text-danger rounded-[8px] hover:bg-surface-dim transition-colors cursor-pointer bg-transparent border-none no-underline">
            <LogOut className="w-4 h-4" /> Log out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
