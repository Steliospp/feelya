import { useState } from 'react';
import { Search } from 'lucide-react';
import Card from '../../components/ui/card';
import Badge from '../../components/ui/badge';
import Avatar from '../../components/ui/avatar';
import PageHeader from '../../components/ui/page-header';

const clients = [
  { id: 1, name: 'Client #042', company: 'Acme Corp', sessions: 8, lastSession: '2 days ago', topics: ['Anxiety', 'CBT'], color: '#6366f1', status: 'active' },
  { id: 2, name: 'Client #018', company: 'Acme Corp', sessions: 12, lastSession: '1 week ago', topics: ['Stress', 'Burnout'], color: '#8b5cf6', status: 'active' },
  { id: 3, name: 'Client #091', company: 'TechStart Ltd', sessions: 5, lastSession: '3 days ago', topics: ['Career'], color: '#a5b4fc', status: 'active' },
  { id: 4, name: 'Client #055', company: 'Acme Corp', sessions: 15, lastSession: '4 days ago', topics: ['Burnout', 'Sleep'], color: '#86efac', status: 'active' },
  { id: 5, name: 'Client #033', company: 'TechStart Ltd', sessions: 3, lastSession: '2 weeks ago', topics: ['Sleep'], color: '#fbbf24', status: 'paused' },
  { id: 6, name: 'Client #012', company: 'Acme Corp', sessions: 20, lastSession: '1 day ago', topics: ['Anxiety', 'Mindfulness'], color: '#f9a8d4', status: 'active' },
  { id: 7, name: 'Client #071', company: 'GlobalFin', sessions: 6, lastSession: '5 days ago', topics: ['Relationships'], color: '#67e8f9', status: 'active' },
  { id: 8, name: 'Client #088', company: 'GlobalFin', sessions: 2, lastSession: '1 week ago', topics: ['CBT'], color: '#c4b5fd', status: 'new' },
];

const statusVariant = { active: 'success', paused: 'warning', new: 'default' };

export default function ClientsPage() {
  const [search, setSearch] = useState('');

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase()) ||
    c.topics.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <PageHeader title="Clients" description="Your active client roster. All data is anonymised." />

      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-muted pointer-events-none" />
        <input
          type="text"
          placeholder="Search by client, company, or topic..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 pl-11 pr-4 bg-surface border border-border-light rounded-[12px] text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all shadow-card max-w-[420px]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((c) => (
          <Card
            key={c.id}
            elevation={1}
            className="!p-5 cursor-pointer hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <Avatar name={c.name} color={c.color} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-semibold text-text-primary">{c.name}</span>
                  <Badge variant={statusVariant[c.status]}>{c.status}</Badge>
                </div>
                <div className="text-[13px] text-text-secondary mt-0.5">{c.company}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-3 text-[13px] text-text-secondary">
              <span>{c.sessions} sessions</span>
              <span className="text-text-muted">&middot;</span>
              <span>Last: {c.lastSession}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {c.topics.map((t) => (
                <span key={t} className="text-[12px] font-medium text-primary bg-primary-50 border border-primary/10 px-2.5 py-0.5 rounded-full">{t}</span>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[14px] text-text-muted">No clients found.</p>
        </div>
      )}
    </div>
  );
}
