import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, Video, ArrowRight, Users, BookOpen, Wind } from 'lucide-react';
import Card from '../../components/ui/card';
import Button from '../../components/ui/button';
import Avatar from '../../components/ui/avatar';
import Badge from '../../components/ui/badge';

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

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.first_name || 'there';

  return (
    <div className="px-4 pt-6 pb-6">
      {/* Greeting */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[26px] font-semibold text-text-primary tracking-tight">
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-[15px] text-text-secondary mt-0.5">Here's your wellbeing space.</p>
        </div>
        <button
          onClick={() => navigate('/app/profile')}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-semibold cursor-pointer border-none shrink-0"
          style={{ backgroundColor: user?.avatar_color || '#6366f1' }}
        >
          {user ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() : '?'}
        </button>
      </div>

      {/* Upcoming Session */}
      <section className="mb-6">
        <h2 className="text-[16px] font-semibold text-text-primary mb-3">Upcoming session</h2>
        {upcomingSession ? (
          <Card className="!p-4">
            <div className="flex items-center gap-3">
              <Avatar name={upcomingSession.therapist} color={upcomingSession.color} size="md" />
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-semibold text-text-primary">{upcomingSession.therapist}</div>
                <Badge variant="default" className="mt-1">{upcomingSession.topic}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3 text-[13px] text-text-secondary">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {upcomingSession.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {upcomingSession.time}</span>
              <span className="flex items-center gap-1"><Video className="w-3.5 h-3.5" /> {upcomingSession.mode}</span>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/app/therapist/${upcomingSession.id}`)}>
                Reschedule
              </Button>
              <Button variant="primary" size="sm" className="flex-1">
                <Video className="w-4 h-4" /> Join
              </Button>
            </div>
            <p className="text-[12px] text-text-muted mt-2">Available to join 5 min before your session.</p>
          </Card>
        ) : (
          <Card>
            <p className="text-[14px] text-text-secondary mb-3">No upcoming sessions.</p>
            <Button variant="primary" size="sm" onClick={() => navigate('/app/therapists')}>
              Book a session
            </Button>
          </Card>
        )}
      </section>

      {/* Book a Session */}
      <section className="mb-6">
        <Card className="!p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-primary-50 flex items-center justify-center text-primary shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-[15px] font-semibold text-text-primary">Book a session</h3>
              <p className="text-[13px] text-text-secondary mt-0.5">
                Browse your company's approved therapists and schedule a session.
              </p>
              <Button variant="primary" size="sm" className="mt-3" onClick={() => navigate('/app/therapists')}>
                Browse therapists
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Workshops */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[16px] font-semibold text-text-primary">Upcoming workshops</h2>
          <button
            onClick={() => navigate('/app/workshops')}
            className="text-[13px] font-medium text-primary cursor-pointer bg-transparent border-none"
          >
            View all
          </button>
        </div>
        <div className="space-y-2">
          {upcomingWorkshops.map((w) => (
            <Card key={w.id} className="!p-4 cursor-pointer" onClick={() => navigate('/app/workshops')}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] bg-primary-50 flex items-center justify-center text-primary shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-medium text-text-primary truncate">{w.title}</div>
                  <div className="text-[12px] text-text-secondary mt-0.5">
                    {w.date}, {w.time} &middot; {w.seats} seats left
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted shrink-0" />
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Resources */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[16px] font-semibold text-text-primary">Resources</h2>
          <button
            onClick={() => navigate('/app/resources')}
            className="text-[13px] font-medium text-primary cursor-pointer bg-transparent border-none"
          >
            View all
          </button>
        </div>
        <Card className="!p-0 overflow-hidden">
          {resources.map((r, i) => {
            const Icon = r.icon;
            return (
              <div key={r.id}>
                {i > 0 && <div className="border-t border-border-light" />}
                <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-surface-dim transition-colors">
                  <div className="w-9 h-9 rounded-[10px] bg-primary-50 flex items-center justify-center text-primary shrink-0">
                    <Icon className="w-[18px] h-[18px]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-medium text-text-primary truncate">{r.title}</div>
                    <div className="text-[12px] text-text-muted">{r.type} &middot; {r.time}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-text-muted shrink-0" />
                </div>
              </div>
            );
          })}
        </Card>
      </section>
    </div>
  );
}
