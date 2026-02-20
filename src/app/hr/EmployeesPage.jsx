import Badge from '../../components/ui/badge';
import SearchInput from '../../components/ui/search-input';
import PageHeader from '../../components/ui/page-header';
import SectionCard from '../../components/ui/section-card';
import { useState } from 'react';

const employees = [
  { id: 1, name: 'Employee #001', team: 'Engineering', lastActive: '2 hours ago', sessions: 8, workshops: 3 },
  { id: 2, name: 'Employee #002', team: 'Marketing', lastActive: '1 day ago', sessions: 12, workshops: 2 },
  { id: 3, name: 'Employee #003', team: 'Sales', lastActive: '3 hours ago', sessions: 5, workshops: 4 },
  { id: 4, name: 'Employee #004', team: 'Engineering', lastActive: '5 hours ago', sessions: 15, workshops: 1 },
  { id: 5, name: 'Employee #005', team: 'HR', lastActive: 'Invited', sessions: 0, workshops: 0 },
  { id: 6, name: 'Employee #006', team: 'Product', lastActive: '1 day ago', sessions: 6, workshops: 2 },
  { id: 7, name: 'Employee #007', team: 'Finance', lastActive: 'Invited', sessions: 0, workshops: 0 },
  { id: 8, name: 'Employee #008', team: 'Engineering', lastActive: '4 hours ago', sessions: 10, workshops: 3 },
  { id: 9, name: 'Employee #009', team: 'Design', lastActive: '2 days ago', sessions: 3, workshops: 5 },
  { id: 10, name: 'Employee #010', team: 'Sales', lastActive: '6 hours ago', sessions: 7, workshops: 1 },
];

export default function EmployeesPage() {
  const [search, setSearch] = useState('');
  const filtered = employees.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()) || e.team.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <PageHeader title="Employees" description="Aggregated activity \u2014 individual data is never visible" />

      <SearchInput placeholder="Search by name or team..." value={search} onChange={(e) => setSearch(e.target.value)} className="mb-6 max-w-[400px]" />

      <SectionCard noPadding>
        <table className="w-full text-[14px]">
          <thead>
            <tr className="text-left border-b border-border-light">
              <th className="px-5 py-3 text-[13px] text-text-muted font-medium uppercase tracking-wider">Employee</th>
              <th className="px-5 py-3 text-[13px] text-text-muted font-medium uppercase tracking-wider">Team</th>
              <th className="px-5 py-3 text-[13px] text-text-muted font-medium uppercase tracking-wider">Last active</th>
              <th className="px-5 py-3 text-[13px] text-text-muted font-medium uppercase tracking-wider">Sessions</th>
              <th className="px-5 py-3 text-[13px] text-text-muted font-medium uppercase tracking-wider">Workshops</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e, i) => (
              <tr key={e.id} className={`border-t border-border-light hover:bg-surface-muted/60 transition-colors cursor-pointer ${i % 2 === 1 ? 'bg-surface-muted/30' : ''}`}>
                <td className="px-5 py-3.5 font-medium text-text-primary">{e.name}</td>
                <td className="px-5 py-3.5"><Badge variant="muted">{e.team}</Badge></td>
                <td className="px-5 py-3.5 text-text-secondary">{e.lastActive}</td>
                <td className="px-5 py-3.5 text-text-secondary">{e.sessions}</td>
                <td className="px-5 py-3.5 text-text-secondary">{e.workshops}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
}
