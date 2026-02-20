import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, Video, Users, Star, ArrowRight } from 'lucide-react';
import Card from '../../components/ui/card';
import Button from '../../components/ui/button';
import Badge from '../../components/ui/badge';
import Avatar from '../../components/ui/avatar';
import PageHeader from '../../components/ui/page-header';
import StatCard from '../../components/ui/stat-card';
import SectionCard from '../../components/ui/section-card';

const todaySessions = [
  { id: 1, client: 'Client #042', topic: 'Anxiety', time: '10:00 AM', duration: '50 min', mode: 'video', color: '#6366f1' },
  { id: 2, client: 'Client #018', topic: 'Stress', time: '11:30 AM', duration: '50 min', mode: 'video', color: '#8b5cf6' },
  { id: 3, client: 'Client #091', topic: 'Career Coaching', time: '2:00 PM', duration: '30 min', mode: 'chat', color: '#a5b4fc' },
];

const upcomingWorkshops = [
  { id: 1, title: 'Managing Workplace Anxiety', date: 'Mon 24 Feb', time: '2:00 PM', registrations: 42 },
  { id: 2, title: 'Mindfulness for Teams', date: 'Fri 28 Feb', time: '3:00 PM', registrations: 35 },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <PageHeader
        title={`${getGreeting()}, ${user?.first_name}`}
        description="Here's your day at a glance."
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Calendar className="w-5 h-5" />} iconClassName="text-primary bg-primary-50" label="Sessions today" value="3" />
        <StatCard icon={<Users className="w-5 h-5" />} iconClassName="text-violet bg-violet/10" label="Active clients" value="28" />
        <StatCard icon={<Star className="w-5 h-5" />} iconClassName="text-warning bg-warning-bg" label="Avg. rating" value="4.9" />
        <StatCard icon={<Clock className="w-5 h-5" />} iconClassName="text-success bg-success-bg" label="Hours this week" value="18" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Today's sessions — hero */}
          <section>
            <Card elevation={2} className="!p-0 overflow-hidden">
              <div className="bg-gradient-to-r from-primary-50 via-primary-50/60 to-transparent px-6 py-4">
                <div className="text-[12px] font-semibold uppercase tracking-wider text-primary/70">
                  Today's schedule
                </div>
              </div>
              <div className="divide-y divide-border-light">
                {todaySessions.map((s) => (
                  <div key={s.id} className="flex items-center gap-4 px-6 py-4 hover:bg-surface-muted/40 transition-colors">
                    <Avatar name={s.client} color={s.color} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-semibold text-text-primary">{s.client}</div>
                      <div className="flex items-center gap-3 mt-0.5 text-[13px] text-text-secondary">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-primary/60" /> {s.time}</span>
                        <span>{s.duration}</span>
                        <span className="text-[12px] font-medium text-primary bg-primary-50 border border-primary/10 px-2 py-0.5 rounded-full">{s.topic}</span>
                      </div>
                    </div>
                    <Button variant="primary" size="sm">
                      <Video className="w-3.5 h-3.5" /> Join
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          {/* Upcoming workshops */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[18px] font-semibold text-text-primary">Your workshops</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {upcomingWorkshops.map((w) => (
                <Card key={w.id} elevation={1} className="!p-5 hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-200">
                  <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center text-primary mb-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="text-[15px] font-medium text-text-primary">{w.title}</div>
                  <div className="text-[13px] text-text-secondary mt-1.5">{w.date}, {w.time}</div>
                  <Badge variant="muted" className="mt-2">{w.registrations} registered</Badge>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Quick stats */}
          <SectionCard title="This month">
            <div className="space-y-4">
              {[
                { label: 'Sessions completed', value: '42' },
                { label: 'New clients', value: '5' },
                { label: 'Workshops hosted', value: '3' },
                { label: 'Client satisfaction', value: '4.9/5' },
              ].map((stat, i) => (
                <div key={stat.label}>
                  {i > 0 && <div className="border-t border-border-light -mx-5 my-0" />}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[14px] text-text-secondary">{stat.label}</span>
                    <span className="text-[18px] font-semibold text-text-primary">{stat.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Recent reviews */}
          <SectionCard title="Recent reviews" noPadding>
            {[
              { client: 'Client #042', rating: 5, text: 'Very supportive and insightful session.' },
              { client: 'Client #018', rating: 5, text: 'Helped me develop coping strategies.' },
              { client: 'Client #067', rating: 4, text: 'Great listener, practical advice.' },
            ].map((r, i) => (
              <div key={i}>
                {i > 0 && <div className="border-t border-border-light" />}
                <div className="px-5 py-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-text-primary">{r.client}</span>
                    <div className="flex gap-0.5">
                      {[...Array(r.rating)].map((_, j) => <Star key={j} className="w-3 h-3 text-warning fill-warning" />)}
                    </div>
                  </div>
                  <p className="text-[13px] text-text-secondary mt-1">{r.text}</p>
                </div>
              </div>
            ))}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
