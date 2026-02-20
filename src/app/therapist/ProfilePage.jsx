import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Star, Clock, Users, Shield, Bell, HelpCircle, Settings, LogOut } from 'lucide-react';
import Avatar from '../../components/ui/avatar';
import Badge from '../../components/ui/badge';
import Card from '../../components/ui/card';
import ListRow from '../../components/ui/list-row';
import PageHeader from '../../components/ui/page-header';

const stats = [
  { label: 'Sessions', value: 1240, icon: <Clock className="w-4 h-4" /> },
  { label: 'Clients', value: 28, icon: <Users className="w-4 h-4" /> },
  { label: 'Rating', value: 4.9, icon: <Star className="w-4 h-4" /> },
];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-[720px]">
      <PageHeader title="Profile" />

      {/* Profile hero */}
      <Card elevation={2} className="!p-0 overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-primary-50 via-primary-50/60 to-transparent px-6 py-5">
          <div className="flex items-center gap-4">
            <Avatar name={`${user?.first_name} ${user?.last_name}`} color={user?.avatar_color} size="xl" />
            <div>
              <div className="text-[18px] font-semibold text-text-primary">{user?.first_name} {user?.last_name}</div>
              <div className="text-[14px] text-text-secondary">{user?.credentials || 'Clinical Psychologist, PhD'}</div>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge variant="success"><Shield className="w-3 h-3 mr-1" /> Licensed</Badge>
                <span className="text-[13px] text-text-muted">{user?.email}</span>
              </div>
            </div>
          </div>
        </div>
        {user?.specialties && (
          <div className="px-6 py-3 border-t border-border-light flex flex-wrap gap-2">
            {user.specialties.map((s) => (
              <span key={s} className="text-[12px] font-medium text-primary bg-primary-50 border border-primary/10 px-2.5 py-0.5 rounded-full">{s}</span>
            ))}
          </div>
        )}
      </Card>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label} elevation={1} className="text-center !p-4">
            <div className="text-[22px] font-semibold text-text-primary">{s.value}</div>
            <div className="text-[12px] text-text-secondary flex items-center justify-center gap-1 mt-1">
              {s.icon} {s.label}
            </div>
          </Card>
        ))}
      </div>

      {/* Settings */}
      <Card elevation={1} className="!p-0 overflow-hidden">
        <ListRow icon={<Settings className="w-5 h-5" />} label="Availability settings" desc="Manage your schedule and time slots" onClick={() => {}} />
        <div className="border-t border-border-light" />
        <ListRow icon={<Bell className="w-5 h-5" />} label="Notifications" desc="Session reminders and client updates" onClick={() => {}} />
        <div className="border-t border-border-light" />
        <ListRow icon={<Shield className="w-5 h-5" />} label="Credentials" desc="Professional qualifications and licences" onClick={() => {}} />
        <div className="border-t border-border-light" />
        <ListRow icon={<HelpCircle className="w-5 h-5" />} label="Support" desc="FAQs and contact Feelya team" onClick={() => {}} />
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
