import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, Users, Plus, Clock, User } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import BottomSheet from '../../components/ui/bottom-sheet';
import ListRow from '../../components/ui/list-row';
import { Zap, Calendar, Search as SearchIcon, MessageSquare } from 'lucide-react';

function TabLink({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        cn(
          'flex flex-col items-center gap-0.5 text-[11px] font-medium transition-colors no-underline hover:no-underline pt-2 pb-1 flex-1',
          isActive ? 'text-primary' : 'text-text-muted'
        )
      }
    >
      <Icon className="w-[22px] h-[22px]" />
      <span>{label}</span>
    </NavLink>
  );
}

export default function UserShell() {
  const [startOpen, setStartOpen] = useState(false);
  const navigate = useNavigate();

  const handleStartAction = (path) => {
    setStartOpen(false);
    navigate(path);
  };

  return (
    <div className="flex flex-col h-dvh bg-surface-muted max-w-[520px] mx-auto relative">
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </div>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-[520px] mx-auto bg-surface border-t border-border-light flex items-end z-40">
        <TabLink to="/app" icon={Home} label="Home" />
        <TabLink to="/app/community" icon={Users} label="Community" />

        {/* Center Start button */}
        <div className="flex flex-col items-center flex-1 -mt-4">
          <button
            onClick={() => setStartOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-violet text-white shadow-elevated flex items-center justify-center hover:shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-7 h-7" />
          </button>
          <span className="text-[11px] font-medium text-text-muted mt-0.5">Start</span>
        </div>

        <TabLink to="/app/activity" icon={Clock} label="Activity" />
        <TabLink to="/app/profile" icon={User} label="Profile" />
      </nav>

      {/* Start bottom sheet */}
      <BottomSheet open={startOpen} onClose={() => setStartOpen(false)} title="Start">
        <div className="flex flex-col gap-1 mt-2">
          <ListRow
            icon={<Zap className="w-5 h-5" />}
            label="Start now"
            desc="Connect with someone in minutes"
            onClick={() => handleStartAction('/app/start')}
          />
          <ListRow
            icon={<Calendar className="w-5 h-5" />}
            label="Schedule"
            desc="Book a time that works for you"
            onClick={() => handleStartAction('/app/start/schedule')}
          />
          <ListRow
            icon={<SearchIcon className="w-5 h-5" />}
            label="Browse guides"
            desc="Find the right person for you"
            onClick={() => handleStartAction('/app/guides')}
          />
          <ListRow
            icon={<MessageSquare className="w-5 h-5" />}
            label="Ask the community"
            desc="Get peer support and perspectives"
            onClick={() => handleStartAction('/app/community/new')}
          />
        </div>
      </BottomSheet>
    </div>
  );
}
