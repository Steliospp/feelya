import { useState } from 'react';
import { Clock, Video, MessageCircle } from 'lucide-react';
import { Chip, ChipRow } from '../../components/ui/chip';
import Card from '../../components/ui/card';
import Badge from '../../components/ui/badge';
import Button from '../../components/ui/button';
import Avatar from '../../components/ui/avatar';
import PageHeader from '../../components/ui/page-header';

const days = ['Mon 24', 'Tue 25', 'Wed 26', 'Thu 27', 'Fri 28'];

const schedule = {
  'Mon 24': [
    { id: 1, client: 'Client #042', topic: 'Anxiety', time: '10:00 AM', duration: '50 min', mode: 'video', color: '#6366f1' },
    { id: 2, client: 'Client #018', topic: 'Stress', time: '11:30 AM', duration: '50 min', mode: 'video', color: '#8b5cf6' },
    { id: 3, client: 'Client #091', topic: 'Career', time: '2:00 PM', duration: '30 min', mode: 'chat', color: '#a5b4fc' },
  ],
  'Tue 25': [
    { id: 4, client: 'Client #055', topic: 'Burnout', time: '9:00 AM', duration: '50 min', mode: 'video', color: '#86efac' },
    { id: 5, client: 'Client #033', topic: 'Sleep', time: '11:00 AM', duration: '50 min', mode: 'video', color: '#fbbf24' },
  ],
  'Wed 26': [
    { id: 6, client: 'Client #012', topic: 'Anxiety', time: '10:00 AM', duration: '50 min', mode: 'video', color: '#f9a8d4' },
    { id: 7, client: 'Workshop', topic: 'Managing Workplace Anxiety', time: '2:00 PM', duration: '60 min', mode: 'video', color: '#6366f1', isWorkshop: true },
  ],
  'Thu 27': [
    { id: 8, client: 'Client #071', topic: 'Relationships', time: '10:00 AM', duration: '50 min', mode: 'video', color: '#67e8f9' },
    { id: 9, client: 'Client #042', topic: 'Anxiety', time: '2:00 PM', duration: '50 min', mode: 'video', color: '#6366f1' },
  ],
  'Fri 28': [
    { id: 10, client: 'Client #088', topic: 'CBT', time: '9:00 AM', duration: '50 min', mode: 'video', color: '#c4b5fd' },
    { id: 11, client: 'Workshop', topic: 'Mindfulness for Teams', time: '3:00 PM', duration: '60 min', mode: 'video', color: '#8b5cf6', isWorkshop: true },
  ],
};

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState('Mon 24');
  const sessions = schedule[selectedDay] || [];

  return (
    <div>
      <PageHeader title="Schedule" description="Your weekly session calendar." />

      <ChipRow className="mb-6">
        {days.map((d) => (
          <Chip key={d} active={selectedDay === d} onClick={() => setSelectedDay(d)}>{d}</Chip>
        ))}
      </ChipRow>

      {sessions.length === 0 ? (
        <Card className="!p-8 text-center">
          <p className="text-[14px] text-text-muted">No sessions scheduled for this day.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {sessions.map((s) => (
            <Card key={s.id} className="!p-5">
              <div className="flex items-center gap-4">
                <Avatar name={s.client} color={s.color} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-semibold text-text-primary">{s.client}</span>
                    {s.isWorkshop && <Badge variant="default">Workshop</Badge>}
                  </div>
                  <span className="inline-block text-[12px] font-medium text-primary bg-primary-50 px-2.5 py-0.5 rounded-full mt-1.5">{s.topic}</span>
                </div>
              </div>
              <div className="flex items-center gap-5 mt-3 text-[13px] text-text-secondary">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-text-muted" /> {s.time}</span>
                <span>{s.duration}</span>
                <span className="flex items-center gap-1.5">
                  {s.mode === 'video' ? <Video className="w-3.5 h-3.5 text-text-muted" /> : <MessageCircle className="w-3.5 h-3.5 text-text-muted" />}
                  {s.mode}
                </span>
              </div>
              <div className="flex gap-3 mt-4">
                <Button variant="outline" size="sm">View notes</Button>
                <Button variant="primary" size="sm">
                  <Video className="w-3.5 h-3.5" /> Join
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
