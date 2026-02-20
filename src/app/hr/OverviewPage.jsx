import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/ui/badge';
import { Users, CalendarDays, BarChart3, TrendingUp } from 'lucide-react';

const stats = [
  { label: 'Active users this week', value: '189', change: '+12%', icon: Users },
  { label: 'Sessions booked', value: '342', change: '+18%', icon: CalendarDays },
  { label: 'Workshop registrations', value: '87', change: '+24%', icon: BarChart3 },
  { label: 'Top topics', value: 'Anxiety, Stress', change: null, icon: TrendingUp },
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
      {/* Page header */}
      <div className="mb-10">
        <h1 className="text-[32px] font-semibold text-neutral-900 tracking-tight">Overview</h1>
        <p className="text-[15px] text-neutral-400 mt-1.5">{user?.companyName} &mdash; Employee wellbeing at a glance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="relative bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-neutral-200/60 overflow-hidden"
            >
              <div className="absolute top-5 right-5 w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center">
                <Icon className="w-[18px] h-[18px] text-neutral-300" strokeWidth={1.5} />
              </div>
              <div className="text-[12px] font-medium text-neutral-400 uppercase tracking-wider mb-3">{s.label}</div>
              <div className="text-[32px] font-semibold text-neutral-900 tracking-tight leading-none">{s.value}</div>
              {s.change && (
                <div className="text-[12px] font-medium text-emerald-500 mt-2">{s.change} vs last week</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upcoming workshops */}
      <section className="mb-10">
        <h2 className="text-[14px] font-semibold text-neutral-900 mb-4">Upcoming workshops</h2>
        <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-neutral-200/60 overflow-hidden">
          <table className="w-full text-[13.5px]">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="px-6 py-3.5 text-left text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3.5 text-left text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3.5 text-left text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Host</th>
                <th className="px-6 py-3.5 text-right text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Seats</th>
              </tr>
            </thead>
            <tbody>
              {upcomingWorkshops.map((w) => (
                <tr key={w.id} className="border-t border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-900">{w.title}</td>
                  <td className="px-6 py-4 text-neutral-500">{w.date}</td>
                  <td className="px-6 py-4 text-neutral-500">{w.host}</td>
                  <td className="px-6 py-4 text-neutral-500 text-right tabular-nums">{w.seats}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent requests */}
      <section>
        <h2 className="text-[14px] font-semibold text-neutral-900 mb-4">Recent requests</h2>
        <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-neutral-200/60 overflow-hidden">
          <table className="w-full text-[13.5px]">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="px-6 py-3.5 text-left text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Topic</th>
                <th className="px-6 py-3.5 text-right text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Employees</th>
                <th className="px-6 py-3.5 text-left text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.map((r) => (
                <tr key={r.id} className="border-t border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-900">{r.topic}</td>
                  <td className="px-6 py-4 text-neutral-500 text-right tabular-nums">{r.employees} requesting</td>
                  <td className="px-6 py-4"><Badge variant={statusVariant[r.status]}>{r.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
