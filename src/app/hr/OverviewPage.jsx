import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/ui/badge';
import PageHeader from '../../components/ui/page-header';
import StatCard from '../../components/ui/stat-card';
import SectionCard from '../../components/ui/section-card';
import { Users, CalendarDays, BarChart3, TrendingUp } from 'lucide-react';

const stats = [
  { label: 'Active users this week', value: '189', change: '+12%', icon: <Users className="w-5 h-5" />, iconClassName: 'text-primary bg-primary-50' },
  { label: 'Sessions booked', value: '342', change: '+18%', icon: <CalendarDays className="w-5 h-5" />, iconClassName: 'text-violet bg-violet/10' },
  { label: 'Workshop registrations', value: '87', change: '+24%', icon: <BarChart3 className="w-5 h-5" />, iconClassName: 'text-success bg-success-bg' },
  { label: 'Top topics', value: 'Anxiety, Stress', icon: <TrendingUp className="w-5 h-5" />, iconClassName: 'text-warning bg-warning-bg' },
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
      <PageHeader
        title="Overview"
        description={`${user?.companyName} \u2014 Employee wellbeing at a glance`}
      />

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <StatCard
            key={s.label}
            icon={s.icon}
            label={s.label}
            value={s.value}
            change={s.change}
            iconClassName={s.iconClassName}
          />
        ))}
      </div>

      {/* Upcoming workshops */}
      <div className="mb-8">
        <SectionCard title="Upcoming workshops" noPadding>
          <table className="w-full text-[14px]">
            <thead>
              <tr className="border-t border-border-light text-left">
                <th className="px-5 py-3 text-[13px] text-text-muted font-medium uppercase tracking-wider">Title</th>
                <th className="px-5 py-3 text-[13px] text-text-muted font-medium uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-[13px] text-text-muted font-medium uppercase tracking-wider">Host</th>
                <th className="px-5 py-3 text-[13px] text-text-muted font-medium uppercase tracking-wider">Seats</th>
              </tr>
            </thead>
            <tbody>
              {upcomingWorkshops.map((w, i) => (
                <tr
                  key={w.id}
                  className={`border-t border-border-light hover:bg-surface-muted/60 transition-colors ${i % 2 === 1 ? 'bg-surface-muted/30' : ''}`}
                >
                  <td className="px-5 py-3.5 font-medium text-text-primary">{w.title}</td>
                  <td className="px-5 py-3.5 text-text-secondary">{w.date}</td>
                  <td className="px-5 py-3.5 text-text-secondary">{w.host}</td>
                  <td className="px-5 py-3.5 text-text-secondary">{w.seats}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      </div>

      {/* Recent requests */}
      <SectionCard title="Recent requests" noPadding>
        <table className="w-full text-[14px]">
          <thead>
            <tr className="border-t border-border-light text-left">
              <th className="px-5 py-3 text-[13px] text-text-muted font-medium uppercase tracking-wider">Topic</th>
              <th className="px-5 py-3 text-[13px] text-text-muted font-medium uppercase tracking-wider">Employees</th>
              <th className="px-5 py-3 text-[13px] text-text-muted font-medium uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentRequests.map((r, i) => (
              <tr
                key={r.id}
                className={`border-t border-border-light hover:bg-surface-muted/60 transition-colors ${i % 2 === 1 ? 'bg-surface-muted/30' : ''}`}
              >
                <td className="px-5 py-3.5 font-medium text-text-primary">{r.topic}</td>
                <td className="px-5 py-3.5 text-text-secondary">{r.employees} requesting</td>
                <td className="px-5 py-3.5"><Badge variant={statusVariant[r.status]}>{r.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
}
