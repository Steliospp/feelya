import { useState } from 'react';
import { Calendar, Clock, Users, MapPin, CheckCircle } from 'lucide-react';
import { Chip, ChipRow } from '../../components/ui/chip';
import Card from '../../components/ui/card';
import Badge from '../../components/ui/badge';
import Button from '../../components/ui/button';
import EmptyState from '../../components/ui/empty-state';

const tabs = ['Upcoming', 'Registered', 'Past'];

const workshops = [
  { id: 1, title: 'Managing Workplace Stress', topic: 'Stress', date: 'Wed 26 Feb', time: '1:00 PM', duration: '60 min', facilitator: 'Dr Sarah Chen', seats: 20, seatsLeft: 12, location: 'Virtual', registered: false },
  { id: 2, title: 'Building Resilience at Work', topic: 'Burnout', date: 'Fri 28 Feb', time: '11:00 AM', duration: '45 min', facilitator: 'Priya Sharma', seats: 15, seatsLeft: 8, location: 'Virtual', registered: false },
  { id: 3, title: 'Mindfulness for Beginners', topic: 'Anxiety', date: 'Mon 3 Mar', time: '10:00 AM', duration: '30 min', facilitator: 'Emma Clarke', seats: 25, seatsLeft: 18, location: 'Virtual', registered: false },
  { id: 4, title: 'Communication in the Workplace', topic: 'Career', date: 'Wed 5 Mar', time: '2:00 PM', duration: '60 min', facilitator: 'James Okafor', seats: 20, seatsLeft: 5, location: 'Virtual', registered: false },
];

const registeredWorkshops = [
  { id: 5, title: 'Sleep Hygiene Workshop', topic: 'Sleep', date: 'Thu 27 Feb', time: '3:00 PM', duration: '45 min', facilitator: 'Emma Clarke', location: 'Virtual', registered: true },
];

const pastWorkshops = [
  { id: 6, title: 'Understanding Anxiety', topic: 'Anxiety', date: 'Mon 17 Feb', duration: '60 min', facilitator: 'Dr Sarah Chen', attended: true },
];

export default function WorkshopsPage() {
  const [tab, setTab] = useState('Upcoming');

  return (
    <div>
      <h1 className="text-[28px] font-semibold text-text-primary mb-1">Workshops</h1>
      <p className="text-[14px] text-text-secondary mb-4">Group sessions led by licensed professionals.</p>

      <ChipRow className="mb-5">
        {tabs.map((t) => (
          <Chip key={t} active={tab === t} onClick={() => setTab(t)}>{t}</Chip>
        ))}
      </ChipRow>

      {tab === 'Upcoming' && (
        <div className="space-y-3">
          {workshops.map((w) => (
            <Card key={w.id} className="!p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-[15px] font-semibold text-text-primary">{w.title}</div>
                  <Badge variant="muted" className="mt-1.5">{w.topic}</Badge>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-[13px] text-text-secondary">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {w.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {w.time}</span>
                <span>{w.duration}</span>
              </div>
              <div className="flex items-center gap-3 mt-2 text-[12px] text-text-muted">
                <span>Led by {w.facilitator}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {w.seatsLeft} seats left</span>
              </div>
              <Button variant="primary" size="sm" className="mt-3" full>
                Register
              </Button>
            </Card>
          ))}
        </div>
      )}

      {tab === 'Registered' && (
        <>
          {registeredWorkshops.length === 0 ? (
            <EmptyState
              icon={<CheckCircle className="w-6 h-6" />}
              title="No registrations yet"
              desc="Browse upcoming workshops and register."
            />
          ) : (
            <div className="space-y-3">
              {registeredWorkshops.map((w) => (
                <Card key={w.id} className="!p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[15px] font-semibold text-text-primary">{w.title}</div>
                      <Badge variant="success" className="mt-1.5">Registered</Badge>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-[13px] text-text-secondary">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {w.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {w.time}</span>
                    <span>{w.duration}</span>
                  </div>
                  <div className="text-[12px] text-text-muted mt-2">Led by {w.facilitator}</div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="flex-1">Cancel</Button>
                    <Button variant="secondary" size="sm" className="flex-1">Add to calendar</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'Past' && (
        <>
          {pastWorkshops.length === 0 ? (
            <EmptyState
              icon={<Clock className="w-6 h-6" />}
              title="No past workshops"
              desc="Workshops you've attended will appear here."
            />
          ) : (
            <div className="space-y-3">
              {pastWorkshops.map((w) => (
                <Card key={w.id} className="!p-4">
                  <div className="text-[15px] font-semibold text-text-primary">{w.title}</div>
                  <div className="text-[13px] text-text-secondary mt-1">{w.date} &middot; {w.duration} &middot; {w.facilitator}</div>
                  {w.attended && <Badge variant="success" className="mt-2">Attended</Badge>}
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
