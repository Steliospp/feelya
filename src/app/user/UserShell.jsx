import { Outlet, NavLink } from 'react-router-dom';
import { Home, Calendar, Users, BookOpen, User } from 'lucide-react';

const tabs = [
  { to: '/app', label: 'Home', icon: Home, end: true },
  { to: '/app/sessions', label: 'Sessions', icon: Calendar },
  { to: '/app/workshops', label: 'Workshops', icon: Users },
  { to: '/app/resources', label: 'Resources', icon: BookOpen },
  { to: '/app/profile', label: 'Profile', icon: User },
];

function TabLink({ to, label, icon: Icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex flex-col items-center gap-0.5 flex-1 py-2 text-[11px] font-medium transition-colors no-underline hover:no-underline ${
          isActive ? 'text-primary' : 'text-text-muted'
        }`
      }
    >
      <Icon className="w-[22px] h-[22px]" />
      {label}
    </NavLink>
  );
}

export default function UserShell() {
  return (
    <div className="flex flex-col h-dvh bg-surface-muted">
      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[600px] mx-auto w-full">
          <Outlet />
        </div>
      </main>

      {/* Bottom tab bar */}
      <nav className="shrink-0 bg-surface border-t border-border flex items-center h-[56px] px-1 pb-[env(safe-area-inset-bottom)]">
        {tabs.map((tab) => (
          <TabLink key={tab.to} {...tab} />
        ))}
      </nav>
    </div>
  );
}
