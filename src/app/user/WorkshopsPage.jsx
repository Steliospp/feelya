import { useState } from 'react';
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react';
import { Chip, ChipRow } from '../../components/ui/chip';
import Card from '../../components/ui/card';
import Badge from '../../components/ui/badge';
import Button from '../../components/ui/button';
import EmptyState from '../../components/ui/empty-state';
import PageHeader from '../../components/ui/page-header';

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
      <PageHeader title="Workshops" description="Group sessions led by licensed professionals." />

      <ChipRow className="mb-6">
        {tabs.map((t) => (
          <Chip key={t} active={tab === t} onClick={() => setTab(t)}>{t}</Chip>
        ))}
      </ChipRow>

      {tab === 'Upcoming' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {workshops.map((w) => (
            <Card key={w.id} className="!p-5 hover:shadow-elevated transition-all duration-200">
              <div className="w-10 h-10 rounded-[12px] bg-primary-50 flex items-center justify-center text-primary mb-3">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-[15px] font-semibold text-text-primary">{w.title}</div>
              <span className="inline-block text-[12px] font-medium text-primary bg-primary-50 px-2.5 py-0.5 rounded-full mt-2">{w.topic}</span>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-[13px] text-text-secondary">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-text-muted" /> {w.date}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-text-muted" /> {w.time}</span>
                <span>{w.duration}</span>
              </div>
              <div className="text-[12px] text-text-muted mt-2">Led by {w.facilitator}</div>
              <div className="flex items-center justify-between mt-4">
                <Badge variant="muted">{w.seatsLeft} seats left</Badge>
                <Button variant="primary" size="sm">Register</Button>
              </div>
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
            <div className="space-y-4">
              {registeredWorkshops.map((w) => (
                <Card key={w.id} className="!p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[15px] font-semibold text-text-primary">{w.title}</div>
                      <Badge variant="success" className="mt-1.5">Registered</Badge>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-[13px] text-text-secondary">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-text-muted" /> {w.date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-text-muted" /> {w.time}</span>
                    <span>{w.duration}</span>
                  </div>
                  <div className="text-[12px] text-text-muted mt-2">Led by {w.facilitator}</div>
                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" size="sm">Cancel</Button>
                    <Button variant="secondary" size="sm">Add to calendar</Button>
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
            <div className="space-y-4">
              {pastWorkshops.map((w) => (
                <Card key={w.id} className="!p-5">
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
