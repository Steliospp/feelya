import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Star, Video, MessageCircle } from 'lucide-react';
import { Chip, ChipRow } from '../../components/ui/chip';
import Card from '../../components/ui/card';
import Badge from '../../components/ui/badge';
import Button from '../../components/ui/button';
import Avatar from '../../components/ui/avatar';
import EmptyState from '../../components/ui/empty-state';

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
    <div className="px-4 pt-6 pb-6">
      <h1 className="text-[26px] font-semibold text-text-primary mb-4">Sessions</h1>

      <ChipRow className="mb-5">
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
            <div className="space-y-3">
              {upcoming.map((s) => (
                <Card key={s.id} className="!p-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={s.therapist} color={s.color} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[15px] font-semibold text-text-primary">{s.therapist}</span>
                        {s.licensed && <Badge variant="success">Licensed</Badge>}
                      </div>
                      <Badge variant="default" className="mt-1">{s.topic}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-[13px] text-text-secondary">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {s.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {s.time}</span>
                    <span>{s.duration}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/app/therapist/${s.id}`)}>
                      Reschedule
                    </Button>
                    <Button variant="primary" size="sm" className="flex-1">
                      {s.mode === 'video' ? <><Video className="w-4 h-4" /> Join</> : <><MessageCircle className="w-4 h-4" /> Join</>}
                    </Button>
                  </div>
                  <p className="text-[12px] text-text-muted mt-2">Available to join 5 min before your session.</p>
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
            <div className="space-y-3">
              {past.map((s) => (
                <Card key={s.id} className="!p-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={s.therapist} color={s.color} size="md" />
                    <div className="flex-1">
                      <div className="text-[15px] font-semibold text-text-primary">{s.therapist}</div>
                      <div className="text-[13px] text-text-secondary">{s.topic} &middot; {s.date} &middot; {s.duration}</div>
                    </div>
                    {s.rated && (
                      <div className="flex items-center gap-0.5">
                        {[...Array(s.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-warning fill-warning" />)}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/app/therapist/${s.id}`)}>
                      Book again
                    </Button>
                    {!s.rated && <Button variant="secondary" size="sm" className="flex-1">Leave review</Button>}
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
