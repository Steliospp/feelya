import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import { Users, CalendarDays, BarChart3, TrendingUp } from 'lucide-react';

const stats = [
  { label: 'Active users this week', value: '189', change: '+12%', icon: <Users className="w-5 h-5" />, color: 'text-primary bg-primary-50' },
  { label: 'Sessions booked', value: '342', change: '+18%', icon: <CalendarDays className="w-5 h-5" />, color: 'text-violet bg-violet/10' },
  { label: 'Workshop registrations', value: '87', change: '+24%', icon: <BarChart3 className="w-5 h-5" />, color: 'text-success bg-success-bg' },
  { label: 'Top topics', value: 'Anxiety, Stress', icon: <TrendingUp className="w-5 h-5" />, color: 'text-warning bg-warning-bg' },
];

const upcomingWorkshops = [
  { id: 1, title: 'Managing Workplace Anxiety', date: 'Mon 24 Feb, 2:00 PM', host: 'Dr Sarah Chen', seats: '42/50' },
  { id: 2, title: 'Burnout Prevention Workshop', date: 'Wed 26 Feb, 11:00 AM', host: 'James Okafor', seats: '28/40' },
  { id: 3, title: 'Mindfulness for Teams', date: 'Fri 28 Feb, 3:00 PM', host: 'Priya Sharma', seats: '35/50' },
];

const recentRequests = [
  { id: 1, topic: 'Financial wellbeing workshop', employees: 12, status: 'new' },
  { id: 2, topic: 'Parenting support group', employees: 8, status: 'reviewed' },
  { id: 3, topic: 'Sleep hygiene session', employees: 15, status: 'approved' },
];

const statusVariant = { new: 'warning', reviewed: 'default', approved: 'success', scheduled: 'success' };

export default function OverviewPage() {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[28px] font-semibold text-text-primary">Overview</h1>
        <p className="text-[15px] text-text-secondary mt-1">{user?.companyName} &mdash; Employee wellbeing at a glance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label} className="!p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center ${s.color}`}>{s.icon}</div>
              {s.change && <span className="text-[13px] font-medium text-success">{s.change}</span>}
            </div>
            <div className="text-[24px] font-semibold text-text-primary">{s.value}</div>
            <div className="text-[13px] text-text-secondary mt-0.5">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Upcoming workshops */}
      <Card className="mb-6 !p-0">
        <div className="p-5 pb-3">
          <h2 className="text-[16px] font-semibold text-text-primary">Upcoming workshops</h2>
        </div>
        <table className="w-full text-[14px]">
          <thead>
            <tr className="border-t border-border-light text-left">
              <th className="px-5 py-3 text-text-secondary font-medium">Title</th>
              <th className="px-5 py-3 text-text-secondary font-medium">Date</th>
              <th className="px-5 py-3 text-text-secondary font-medium">Host</th>
              <th className="px-5 py-3 text-text-secondary font-medium">Seats</th>
            </tr>
          </thead>
          <tbody>
            {upcomingWorkshops.map((w) => (
              <tr key={w.id} className="border-t border-border-light hover:bg-surface-muted transition-colors">
                <td className="px-5 py-3 font-medium text-text-primary">{w.title}</td>
                <td className="px-5 py-3 text-text-secondary">{w.date}</td>
                <td className="px-5 py-3 text-text-secondary">{w.host}</td>
                <td className="px-5 py-3 text-text-secondary">{w.seats}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Recent requests */}
      <Card className="!p-0">
        <div className="p-5 pb-3">
          <h2 className="text-[16px] font-semibold text-text-primary">Recent requests</h2>
        </div>
        <table className="w-full text-[14px]">
          <thead>
            <tr className="border-t border-border-light text-left">
              <th className="px-5 py-3 text-text-secondary font-medium">Topic</th>
              <th className="px-5 py-3 text-text-secondary font-medium">Employees</th>
              <th className="px-5 py-3 text-text-secondary font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentRequests.map((r) => (
              <tr key={r.id} className="border-t border-border-light hover:bg-surface-muted transition-colors">
                <td className="px-5 py-3 font-medium text-text-primary">{r.topic}</td>
                <td className="px-5 py-3 text-text-secondary">{r.employees} requesting</td>
                <td className="px-5 py-3"><Badge variant={statusVariant[r.status]}>{r.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
