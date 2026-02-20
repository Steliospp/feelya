import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Inbox, Users, BarChart3, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../../components/ui/avatar';

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
        `group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-all duration-150 no-underline hover:no-underline ${
          isActive
            ? 'bg-neutral-100 text-neutral-900'
            : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-neutral-900" />
          )}
          <Icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2 : 1.5} />
          {label}
        </>
      )}
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
    <div className="flex h-dvh bg-neutral-50">
      {/* Sidebar */}
      <aside className="w-[272px] h-full bg-white border-r border-neutral-200/70 flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-5 pt-6 pb-2">
          <a href="/" className="flex items-center gap-2.5 no-underline hover:no-underline">
            <svg width="26" height="26" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="14" fill="#18181b"/><path d="M8 14.5C8 14.5 10.5 9 14 9C17.5 9 20 14.5 20 14.5C20 14.5 17.5 20 14 20C10.5 20 8 14.5 8 14.5Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="14" cy="14.5" r="2.5" fill="#fff"/></svg>
            <span className="text-[16px] font-semibold text-neutral-900 tracking-tight">feelya</span>
            <span className="text-[11px] font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">HR</span>
          </a>
        </div>

        {user?.companyName && (
          <div className="px-5 pb-4 pt-1">
            <div className="text-[12px] font-medium text-neutral-400 tracking-wide uppercase">{user.companyName}</div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-4 space-y-0.5">
          {links.map((l) => <SideLink key={l.to} {...l} />)}
        </nav>

        {/* User section */}
        <div className="p-4 mt-auto">
          <div className="border-t border-neutral-100 pt-4">
            <div className="flex items-center gap-3 px-2 mb-2">
              <Avatar name={`${user?.first_name} ${user?.last_name}`} color={user?.avatar_color} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-neutral-900 truncate">{user?.first_name} {user?.last_name}</div>
                <div className="text-[11px] text-neutral-400 truncate">{user?.email}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-2 py-2 text-[13px] font-medium text-neutral-400 hover:text-red-500 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer bg-transparent border-none no-underline"
            >
              <LogOut className="w-4 h-4" /> Log out
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
