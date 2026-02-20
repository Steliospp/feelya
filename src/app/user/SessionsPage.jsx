import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Star, Video, MessageCircle } from 'lucide-react';
import { Chip, ChipRow } from '../../components/ui/chip';
import Card from '../../components/ui/card';
import Badge from '../../components/ui/badge';
import Button from '../../components/ui/button';
import Avatar from '../../components/ui/avatar';
import EmptyState from '../../components/ui/empty-state';
import PageHeader from '../../components/ui/page-header';

const tabs = ['Upcoming', 'Past'];

const upcoming = [
  { id: 1, therapist: 'Dr Sarah Chen', color: '#c4b5fd', licensed: true, topic: 'Anxiety', date: 'Mon 24 Feb', time: '10:00 AM', duration: '50 min', mode: 'video' },
  { id: 2, therapist: 'James Okafor', color: '#a5b4fc', licensed: true, topic: 'Career Coaching', date: 'Wed 26 Feb', time: '2:00 PM', duration: '30 min', mode: 'chat' },
];

const past = [
  { id: 3, therapist: 'Dr Sarah Chen', color: '#c4b5fd', topic: 'Anxiety', date: 'Fri 14 Feb', duration: '50 min', rated: true, rating: 5 },
  { id: 4, therapist: 'Priya Sharma', color: '#86efac', topic: 'Stress Management', date: 'Mon 10 Feb', duration: '30 min', rated: false },
];

export default function SessionsPage() {
  const [tab, setTab] = useState('Upcoming');
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader title="Sessions" description="Your therapy sessions, past and upcoming." />

      <ChipRow className="mb-6">
        {tabs.map((t) => (
          <Chip key={t} active={tab === t} onClick={() => setTab(t)}>{t}</Chip>
        ))}
      </ChipRow>

      {tab === 'Upcoming' && (
        <>
          {upcoming.length === 0 ? (
            <EmptyState
              icon={<Calendar className="w-6 h-6" />}
              title="No upcoming sessions"
              desc="Book a session with a therapist to get started."
              action={<Button onClick={() => navigate('/app/therapists')}>Browse therapists</Button>}
            />
          ) : (
            <div className="space-y-4">
              {upcoming.map((s) => (
                <Card key={s.id} className="!p-5">
                  <div className="flex items-center gap-4">
                    <Avatar name={s.therapist} color={s.color} size="lg" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[15px] font-semibold text-text-primary">{s.therapist}</span>
                        {s.licensed && <Badge variant="success">Licensed</Badge>}
                      </div>
                      <Badge variant="default" className="mt-1.5">{s.topic}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 mt-4 text-[13px] text-text-secondary">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-text-muted" /> {s.date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-text-muted" /> {s.time}</span>
                    <span>{s.duration}</span>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/app/therapist/${s.id}`)}>
                      Reschedule
                    </Button>
                    <Button variant="primary" size="sm">
                      {s.mode === 'video' ? <><Video className="w-4 h-4" /> Join</> : <><MessageCircle className="w-4 h-4" /> Join</>}
                    </Button>
                  </div>
                  <p className="text-[12px] text-text-muted mt-2.5">Available to join 5 min before your session.</p>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'Past' && (
        <>
          {past.length === 0 ? (
            <EmptyState
              icon={<Clock className="w-6 h-6" />}
              title="No past sessions"
              desc="Your completed sessions will appear here."
            />
          ) : (
            <div className="space-y-4">
              {past.map((s) => (
                <Card key={s.id} className="!p-5">
                  <div className="flex items-center gap-4">
                    <Avatar name={s.therapist} color={s.color} size="md" />
                    <div className="flex-1">
                      <div className="text-[15px] font-semibold text-text-primary">{s.therapist}</div>
                      <div className="text-[13px] text-text-secondary mt-0.5">{s.topic} &middot; {s.date} &middot; {s.duration}</div>
                    </div>
                    {s.rated && (
                      <div className="flex items-center gap-0.5">
                        {[...Array(s.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-warning fill-warning" />)}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/app/therapist/${s.id}`)}>
                      Book again
                    </Button>
                    {!s.rated && <Button variant="secondary" size="sm">Leave review</Button>}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
