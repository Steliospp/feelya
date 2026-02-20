import { useState } from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import { Chip, ChipRow } from '../../components/ui/chip';
import Card from '../../components/ui/card';
import Badge from '../../components/ui/badge';
import Button from '../../components/ui/button';
import PageHeader from '../../components/ui/page-header';

const tabs = ['Upcoming', 'Past'];

const upcoming = [
  { id: 1, title: 'Managing Workplace Anxiety', company: 'Acme Corp', date: 'Mon 24 Feb', time: '2:00 PM', duration: '60 min', registrations: 42, capacity: 50 },
  { id: 2, title: 'Mindfulness for Teams', company: 'TechStart Ltd', date: 'Fri 28 Feb', time: '3:00 PM', duration: '60 min', registrations: 35, capacity: 50 },
  { id: 3, title: 'Stress Resilience Workshop', company: 'GlobalFin', date: 'Mon 3 Mar', time: '11:00 AM', duration: '45 min', registrations: 22, capacity: 40 },
];

const past = [
  { id: 4, title: 'Building Resilience', company: 'Acme Corp', date: 'Mon 10 Feb', attended: 38, rating: 4.8 },
  { id: 5, title: 'Understanding Anxiety', company: 'TechStart Ltd', date: 'Fri 7 Feb', attended: 29, rating: 4.9 },
];

export default function WorkshopsPage() {
  const [tab, setTab] = useState('Upcoming');

  return (
    <div>
      <PageHeader title="Workshops" description="Workshops you're hosting or have hosted." />

      <ChipRow className="mb-6">
        {tabs.map((t) => (
          <Chip key={t} active={tab === t} onClick={() => setTab(t)}>{t}</Chip>
        ))}
      </ChipRow>

      {tab === 'Upcoming' && (
        <div className="space-y-4">
          {upcoming.map((w) => (
            <Card key={w.id} elevation={1} className="!p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[15px] font-semibold text-text-primary">{w.title}</div>
                  <div className="text-[13px] text-text-secondary mt-0.5">{w.company}</div>
                </div>
                <Badge variant="default">{w.registrations}/{w.capacity}</Badge>
              </div>
              <div className="flex items-center gap-5 mt-3 text-[13px] text-text-secondary">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary/60" /> {w.date}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary/60" /> {w.time}</span>
                <span>{w.duration}</span>
              </div>
              <div className="flex gap-3 mt-4">
                <Button variant="outline" size="sm">View details</Button>
                <Button variant="primary" size="sm">Prepare materials</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'Past' && (
        <div className="space-y-4">
          {past.map((w) => (
            <Card key={w.id} elevation={1} className="!p-5">
              <div className="text-[15px] font-semibold text-text-primary">{w.title}</div>
              <div className="text-[13px] text-text-secondary mt-0.5">{w.company}</div>
              <div className="flex items-center gap-4 mt-3 text-[13px] text-text-secondary">
                <span>{w.date}</span>
                <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {w.attended} attended</span>
                <Badge variant="success">{w.rating}/5 rating</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
