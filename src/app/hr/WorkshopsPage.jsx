import { useState } from 'react';
import Badge from '../../components/ui/badge';
import Button from '../../components/ui/button';

const upcoming = [
  { id: 1, title: 'Managing Workplace Anxiety', topic: 'Anxiety', date: 'Mon 24 Feb, 2:00 PM', host: 'Dr Sarah Chen', seats: '42/50', status: 'confirmed' },
  { id: 2, title: 'Burnout Prevention Workshop', topic: 'Burnout', date: 'Wed 26 Feb, 11:00 AM', host: 'James Okafor', seats: '28/40', status: 'confirmed' },
  { id: 3, title: 'Mindfulness for Teams', topic: 'Mindfulness', date: 'Fri 28 Feb, 3:00 PM', host: 'Priya Sharma', seats: '35/50', status: 'confirmed' },
];

const past = [
  { id: 4, title: 'Building Resilience', topic: 'Resilience', date: 'Mon 10 Feb', host: 'Dr Sarah Chen', attended: 38, rating: 4.8 },
  { id: 5, title: 'Communication Skills', topic: 'Relationships', date: 'Fri 7 Feb', host: 'Tom Williams', attended: 29, rating: 4.6 },
];

const tabs = ['Upcoming', 'Past'];

export default function WorkshopsPage() {
  const [tab, setTab] = useState('Upcoming');

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-[32px] font-semibold text-neutral-900 tracking-tight">Workshops</h1>
          <p className="text-[15px] text-neutral-400 mt-1.5">Manage team workshops and events</p>
        </div>
        <Button>Create workshop</Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-[13px] font-medium rounded-lg transition-colors cursor-pointer border-none no-underline ${
              tab === t
                ? 'bg-neutral-900 text-white'
                : 'bg-transparent text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Upcoming' && (
        <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-neutral-200/60 overflow-hidden">
          <table className="w-full text-[13.5px]">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="px-6 py-3.5 text-left text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3.5 text-left text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Topic</th>
                <th className="px-6 py-3.5 text-left text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3.5 text-left text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Host</th>
                <th className="px-6 py-3.5 text-right text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Seats</th>
                <th className="px-6 py-3.5 text-right text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.map((w) => (
                <tr key={w.id} className="border-t border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-900">{w.title}</td>
                  <td className="px-6 py-4"><Badge variant="muted">{w.topic}</Badge></td>
                  <td className="px-6 py-4 text-neutral-500">{w.date}</td>
                  <td className="px-6 py-4 text-neutral-500">{w.host}</td>
                  <td className="px-6 py-4 text-neutral-500 text-right tabular-nums">{w.seats}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm">View</Button>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Past' && (
        <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-neutral-200/60 overflow-hidden">
          <table className="w-full text-[13.5px]">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="px-6 py-3.5 text-left text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3.5 text-left text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3.5 text-left text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Host</th>
                <th className="px-6 py-3.5 text-right text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Attended</th>
                <th className="px-6 py-3.5 text-right text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Rating</th>
              </tr>
            </thead>
            <tbody>
              {past.map((w) => (
                <tr key={w.id} className="border-t border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-900">{w.title}</td>
                  <td className="px-6 py-4 text-neutral-500">{w.date}</td>
                  <td className="px-6 py-4 text-neutral-500">{w.host}</td>
                  <td className="px-6 py-4 text-neutral-500 text-right tabular-nums">{w.attended}</td>
                  <td className="px-6 py-4 text-neutral-500 text-right tabular-nums">{w.rating}/5</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
