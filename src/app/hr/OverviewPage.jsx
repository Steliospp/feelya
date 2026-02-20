import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/ui/badge';
import PageHeader from '../../components/ui/page-header';
import StatCard from '../../components/ui/stat-card';
import SectionCard from '../../components/ui/section-card';
import Card from '../../components/ui/card';
import { Users, CalendarDays, BarChart3, TrendingUp, Building2, ShieldCheck, Lock } from 'lucide-react';

const stats = [
  { label: 'Active users this week', value: '189', change: '+12%', icon: <Users className="w-5 h-5" />, iconClassName: 'text-primary bg-primary-50' },
  { label: 'Sessions booked', value: '342', change: '+18%', icon: <CalendarDays className="w-5 h-5" />, iconClassName: 'text-violet bg-violet/10' },
  { label: 'Workshop registrations', value: '87', change: '+24%', icon: <BarChart3 className="w-5 h-5" />, iconClassName: 'text-success bg-success-bg' },
  { label: 'Top topics', value: 'Anxiety', icon: <TrendingUp className="w-5 h-5" />, iconClassName: 'text-warning bg-warning-bg' },
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
        description={`${user?.companyName} — Employee wellbeing at a glance`}
      />

      {/* Org header card */}
      <Card className="!p-5 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-[12px] bg-primary-50 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-[16px] font-semibold text-text-primary">{user?.companyName || 'Acme Corp'}</div>
              <div className="text-[13px] text-text-secondary mt-0.5">248 employees enrolled</div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Badge variant="outline">
              <ShieldCheck className="w-3 h-3 mr-1" /> SOC 2
            </Badge>
            <Badge variant="outline">
              <Lock className="w-3 h-3 mr-1" /> GDPR
            </Badge>
          </div>
        </div>
      </Card>

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

      {/* Wellbeing score */}
      <Card className="!p-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[15px] font-semibold text-text-primary">Team wellbeing score</div>
          <span className="text-[13px] font-medium text-success">+4% vs last month</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1 h-2.5 bg-surface-dim rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: '78%' }} />
          </div>
          <span className="text-[20px] font-semibold text-primary">78%</span>
        </div>
        <div className="flex items-center gap-4 mt-3 text-[12px] text-text-muted">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3 h-3" /> All data anonymised
          </span>
          <span>Based on 189 active users</span>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Upcoming workshops */}
        <SectionCard title="Upcoming workshops" noPadding>
          <table className="w-full text-[14px]">
            <thead>
              <tr className="border-t border-border-light text-left">
                <th className="px-5 py-3 text-[13px] text-text-muted font-medium">Title</th>
                <th className="px-5 py-3 text-[13px] text-text-muted font-medium">Date</th>
                <th className="px-5 py-3 text-[13px] text-text-muted font-medium hidden sm:table-cell">Seats</th>
              </tr>
            </thead>
            <tbody>
              {upcomingWorkshops.map((w) => (
                <tr key={w.id} className="border-t border-border-light hover:bg-surface-muted/40 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-text-primary">{w.title}</td>
                  <td className="px-5 py-3.5 text-text-secondary">{w.date}</td>
                  <td className="px-5 py-3.5 text-text-secondary hidden sm:table-cell">{w.seats}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>

        {/* Recent requests */}
        <SectionCard title="Recent requests" noPadding>
          <table className="w-full text-[14px]">
            <thead>
              <tr className="border-t border-border-light text-left">
                <th className="px-5 py-3 text-[13px] text-text-muted font-medium">Topic</th>
                <th className="px-5 py-3 text-[13px] text-text-muted font-medium">Employees</th>
                <th className="px-5 py-3 text-[13px] text-text-muted font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.map((r) => (
                <tr key={r.id} className="border-t border-border-light hover:bg-surface-muted/40 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-text-primary">{r.topic}</td>
                  <td className="px-5 py-3.5 text-text-secondary">{r.employees} requesting</td>
                  <td className="px-5 py-3.5"><Badge variant={statusVariant[r.status]}>{r.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      </div>
    </div>
  );
}
