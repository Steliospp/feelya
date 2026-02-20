import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MessageCircle, Clock, Users, Shield, CreditCard, Bell, HelpCircle, RotateCcw, ChevronRight, LogOut } from 'lucide-react';
import Avatar from '../../components/ui/avatar';
import Card from '../../components/ui/card';
import ListRow from '../../components/ui/list-row';

const stats = [
  { label: 'Chats', value: 24, icon: <MessageCircle className="w-4 h-4" /> },
  { label: 'Minutes', value: 720, icon: <Clock className="w-4 h-4" /> },
  { label: 'Workshops', value: 3, icon: <Users className="w-4 h-4" /> },
];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="px-4 pt-4 pb-8">
      <h1 className="text-[28px] font-semibold text-text-primary mb-5">Profile</h1>

      {/* Profile card */}
      <Card className="flex items-center gap-4 !p-4 mb-4">
        <Avatar name={`${user?.first_name} ${user?.last_name}`} color={user?.avatar_color} size="xl" />
        <div>
          <div className="text-[18px] font-semibold text-text-primary">{user?.first_name} {user?.last_name}</div>
          <div className="text-[14px] text-text-secondary">{user?.email}</div>
          <div className="text-[13px] text-text-muted mt-0.5">{user?.companyName}</div>
        </div>
      </Card>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {stats.map((s) => (
          <Card key={s.label} className="text-center !p-3">
            <div className="text-[20px] font-semibold text-text-primary">{s.value}</div>
            <div className="text-[12px] text-text-secondary flex items-center justify-center gap-1 mt-0.5">
              {s.icon} {s.label}
            </div>
          </Card>
        ))}
      </div>

      {/* Settings */}
      <Card className="!p-0 overflow-hidden">
        <ListRow icon={<Shield className="w-5 h-5" />} label="Safety & resources" desc="Crisis lines and support" onClick={() => {}} />
        <div className="border-t border-border-light" />
        <ListRow icon={<CreditCard className="w-5 h-5" />} label="Payment" desc="Manage your plan" onClick={() => {}} />
        <div className="border-t border-border-light" />
        <ListRow icon={<Bell className="w-5 h-5" />} label="Notifications" desc="Reminders and updates" onClick={() => {}} />
        <div className="border-t border-border-light" />
        <ListRow icon={<HelpCircle className="w-5 h-5" />} label="Help" desc="FAQs and contact support" onClick={() => {}} />
        <div className="border-t border-border-light" />
        <ListRow icon={<RotateCcw className="w-5 h-5" />} label="Reset app" desc="Clear local data" onClick={() => {}} />
      </Card>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 w-full mt-4 px-4 py-3 text-[15px] font-medium text-danger bg-transparent border-none cursor-pointer no-underline hover:no-underline"
      >
        <LogOut className="w-5 h-5" /> Log out
      </button>
    </div>
  );
}
