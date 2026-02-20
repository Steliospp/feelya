import { useState } from 'react';
import Badge from '../../components/ui/badge';
import Button from '../../components/ui/button';
import { Chip, ChipRow } from '../../components/ui/chip';
import PageHeader from '../../components/ui/page-header';
import SectionCard from '../../components/ui/section-card';

const upcoming = [
  { id: 1, title: 'Managing Workplace Anxiety', topic: 'Anxiety', date: 'Mon 24 Feb, 2:00 PM', host: 'Dr Sarah Chen', seats: '42/50', status: 'confirmed' },
  { id: 2, title: 'Burnout Prevention Workshop', topic: 'Burnout', date: 'Wed 26 Feb, 11:00 AM', host: 'James Okafor', seats: '28/40', status: 'confirmed' },
  { id: 3, title: 'Mindfulness for Teams', topic: 'Mindfulness', date: 'Fri 28 Feb, 3:00 PM', host: 'Priya Sharma', seats: '35/50', status: 'confirmed' },
];

const past = [
  { id: 4, title: 'Building Resilience', topic: 'Resilience', date: 'Mon 10 Feb', host: 'Dr Sarah Chen', attended: 38, rating: 4.8 },
  { id: 5, title: 'Communication Skills', topic: 'Relationships', date: 'Fri 7 Feb', host: 'Tom Williams', attended: 29, rating: 4.6 },
];

export default function WorkshopsPage() {
  const [tab, setTab] = useState('Upcoming');

  return (
    <div>
      <PageHeader title="Workshops" description="Manage team workshops and events">
        <Button>Create workshop</Button>
      </PageHeader>

      <ChipRow className="mb-6">
        <Chip active={tab === 'Upcoming'} onClick={() => setTab('Upcoming')}>Upcoming</Chip>
        <Chip active={tab === 'Past'} onClick={() => setTab('Past')}>Past</Chip>
      </ChipRow>

      {tab === 'Upcoming' && (
        <SectionCard noPadding>
          <table className="w-full text-[14px]">
            <thead>
              <tr className="text-left border-b border-border-light">
                <th className="px-5 py-3 text-[13px] text-text-secondary font-medium">Title</th>
                <th className="px-5 py-3 text-[13px] text-text-secondary font-medium">Topic</th>
                <th className="px-5 py-3 text-[13px] text-text-secondary font-medium">Date</th>
                <th className="px-5 py-3 text-[13px] text-text-secondary font-medium">Host</th>
                <th className="px-5 py-3 text-[13px] text-text-secondary font-medium">Seats</th>
                <th className="px-5 py-3 text-[13px] text-text-secondary font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.map((w) => (
                <tr key={w.id} className={"border-t border-border-light hover:bg-surface-muted/60 transition-colors"}>
                  <td className="px-5 py-3.5 font-medium text-text-primary">{w.title}</td>
                  <td className="px-5 py-3.5"><span className="text-[12px] font-medium text-primary bg-primary-50 px-2.5 py-0.5 rounded-full">{w.topic}</span></td>
                  <td className="px-5 py-3.5 text-text-secondary">{w.date}</td>
                  <td className="px-5 py-3.5 text-text-secondary">{w.host}</td>
                  <td className="px-5 py-3.5 text-text-secondary">{w.seats}</td>
                  <td className="px-5 py-3.5 flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      )}

      {tab === 'Past' && (
        <SectionCard noPadding>
          <table className="w-full text-[14px]">
            <thead>
              <tr className="text-left border-b border-border-light">
                <th className="px-5 py-3 text-[13px] text-text-secondary font-medium">Title</th>
                <th className="px-5 py-3 text-[13px] text-text-secondary font-medium">Date</th>
                <th className="px-5 py-3 text-[13px] text-text-secondary font-medium">Host</th>
                <th className="px-5 py-3 text-[13px] text-text-secondary font-medium">Attended</th>
                <th className="px-5 py-3 text-[13px] text-text-secondary font-medium">Rating</th>
              </tr>
            </thead>
            <tbody>
              {past.map((w) => (
                <tr key={w.id} className={"border-t border-border-light hover:bg-surface-muted/60 transition-colors"}>
                  <td className="px-5 py-3.5 font-medium text-text-primary">{w.title}</td>
                  <td className="px-5 py-3.5 text-text-secondary">{w.date}</td>
                  <td className="px-5 py-3.5 text-text-secondary">{w.host}</td>
                  <td className="px-5 py-3.5 text-text-secondary">{w.attended}</td>
                  <td className="px-5 py-3.5 text-text-secondary">{w.rating}/5</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      )}
    </div>
  );
}
