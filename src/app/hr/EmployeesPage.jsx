import Badge from '../../components/ui/badge';
import SearchInput from '../../components/ui/search-input';
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
      <div className="mb-10">
        <h1 className="text-[32px] font-semibold text-neutral-900 tracking-tight">Employees</h1>
        <p className="text-[15px] text-neutral-400 mt-1.5">Aggregated activity &mdash; individual data is never visible</p>
      </div>

      <div className="mb-6">
        <SearchInput placeholder="Search by name or team..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-[360px]" />
      </div>

      <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-neutral-200/60 overflow-hidden">
        <table className="w-full text-[13.5px]">
          <thead>
            <tr className="border-b border-neutral-100">
              <th className="px-6 py-3.5 text-left text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Employee</th>
              <th className="px-6 py-3.5 text-left text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Team</th>
              <th className="px-6 py-3.5 text-left text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Last active</th>
              <th className="px-6 py-3.5 text-right text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Sessions</th>
              <th className="px-6 py-3.5 text-right text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Workshops</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id} className="border-t border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-neutral-900">{e.name}</td>
                <td className="px-6 py-4"><Badge variant="muted">{e.team}</Badge></td>
                <td className="px-6 py-4 text-neutral-500">{e.lastActive}</td>
                <td className="px-6 py-4 text-neutral-500 text-right tabular-nums">{e.sessions}</td>
                <td className="px-6 py-4 text-neutral-500 text-right tabular-nums">{e.workshops}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
