import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, Video, ArrowRight, Users, BookOpen, Wind } from 'lucide-react';
import Card from '../../components/ui/card';
import Button from '../../components/ui/button';
import Badge from '../../components/ui/badge';
import HeroSessionCard from '../../components/ui/hero-session-card';
import SectionCard from '../../components/ui/section-card';

const upcomingSession = {
  id: 1,
  therapist: 'Dr Sarah Chen',
  color: '#c4b5fd',
  topic: 'Anxiety',
  date: 'Mon 24 Feb',
  time: '10:00 AM',
  mode: 'video',
};

const upcomingWorkshops = [
  { id: 1, title: 'Managing Workplace Stress', date: 'Wed 26 Feb', time: '1:00 PM', seats: 12 },
  { id: 2, title: 'Building Resilience', date: 'Fri 28 Feb', time: '11:00 AM', seats: 8 },
  { id: 3, title: 'Mindfulness for Beginners', date: 'Mon 3 Mar', time: '10:00 AM', seats: 18 },
];

const resources = [
  { id: 1, title: '2-minute breathing exercise', type: 'Tool', time: '2 min', icon: Wind },
  { id: 2, title: 'How to calm racing thoughts', type: 'Article', time: '3 min', icon: BookOpen },
  { id: 3, title: 'Setting boundaries at work', type: 'Guide', time: '5 min', icon: BookOpen },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

const cardStyle = '!border-border/70 shadow-sm';

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.first_name || 'there';

  return (
    <div>
      {/* Page header with breathing room and subtle divider */}
      <div className="mb-8 pb-6 border-b border-border-light">
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
          {getGreeting()}, {firstName}
        </h1>
        <p className="text-sm text-text-muted mt-1.5">Here's your wellbeing space.</p>
      </div>

      {/* 12-col dashboard grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left content — col-span-8 */}
        <div className="lg:col-span-8 space-y-6">
          {/* Hero Upcoming Session */}
          <section>
            {upcomingSession ? (
              <HeroSessionCard
                session={upcomingSession}
                onJoin={() => {}}
                onReschedule={() => navigate(`/app/therapist/${upcomingSession.id}`)}
              />
            ) : (
              <Card className={`!p-6 ${cardStyle}`}>
                <p className="text-[15px] text-text-secondary mb-3">No upcoming sessions.</p>
                <Button variant="primary" size="md" onClick={() => navigate('/app/therapists')}>
                  Book a session
                </Button>
              </Card>
            )}
          </section>

          {/* Book a Session */}
          <section>
            <Card className={`!p-6 ${cardStyle}`}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-[12px] bg-primary-50 flex items-center justify-center text-primary shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-text-primary">Book a session</h3>
                  <p className="text-sm text-text-secondary mt-1">
                    Browse your company's approved therapists and schedule a session.
                  </p>
                  <Button variant="outline" size="md" className="mt-4" onClick={() => navigate('/app/therapists')}>
                    Browse therapists
                  </Button>
                </div>
              </div>
            </Card>
          </section>

          {/* Upcoming Workshops */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-medium uppercase tracking-wide text-text-muted">Upcoming workshops</h2>
              <button
                onClick={() => navigate('/app/workshops')}
                className="text-[13px] font-medium text-primary cursor-pointer bg-transparent border-none hover:underline"
              >
                View all
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingWorkshops.map((w) => (
                <Card
                  key={w.id}
                  className={`!p-5 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all ${cardStyle}`}
                  onClick={() => navigate('/app/workshops')}
                >
                  <div className="w-9 h-9 rounded-[10px] bg-primary-50 flex items-center justify-center text-primary mb-3">
                    <Users className="w-[18px] h-[18px]" />
                  </div>
                  <div className="text-sm font-medium text-text-primary">{w.title}</div>
                  <div className="text-[13px] text-text-secondary mt-1.5">{w.date}, {w.time}</div>
                  <Badge variant="muted" className="mt-2">{w.seats} seats left</Badge>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Right rail — col-span-4 */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Resources */}
          <section>
            <SectionCard
              title="Resources"
              noPadding
              className={cardStyle}
              action={
                <button
                  onClick={() => navigate('/app/resources')}
                  className="text-[13px] font-medium text-primary cursor-pointer bg-transparent border-none hover:underline"
                >
                  View all
                </button>
              }
            >
              {resources.map((r, i) => {
                const Icon = r.icon;
                return (
                  <div key={r.id}>
                    {i > 0 && <div className="border-t border-border-light" />}
                    <div className="flex items-center gap-3 px-5 py-3.5 cursor-pointer hover:bg-surface-muted/40 transition-colors">
                      <div className="w-9 h-9 rounded-[10px] bg-primary-50 flex items-center justify-center text-primary shrink-0">
                        <Icon className="w-[18px] h-[18px]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-text-primary">{r.title}</div>
                        <div className="text-xs text-text-muted mt-0.5">{r.type} &middot; {r.time}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-text-muted shrink-0" />
                    </div>
                  </div>
                );
              })}
            </SectionCard>
          </section>

          {/* Activity stats */}
          <section>
            <SectionCard title="Your activity" className={cardStyle}>
              <div className="space-y-4">
                {[
                  { label: 'Sessions this month', value: '3' },
                  { label: 'Workshops attended', value: '2' },
                  { label: 'Resources viewed', value: '7' },
                ].map((stat, i) => (
                  <div key={stat.label}>
                    {i > 0 && <div className="border-t border-border-light -mx-5 my-0" />}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-sm text-text-secondary">{stat.label}</span>
                      <span className="text-lg font-semibold text-primary">{stat.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </section>
        </div>
      </div>
    </div>
  );
}
