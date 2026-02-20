import Badge from '../../components/ui/badge';
import Button from '../../components/ui/button';

const requests = [
  { id: 1, topic: 'Financial wellbeing workshop', employees: 12, notes: 'Employees want guidance on budgeting, pensions, and financial stress.', status: 'new' },
  { id: 2, topic: 'Parenting support group', employees: 8, notes: 'Working parents looking for strategies to balance work and family.', status: 'reviewed' },
  { id: 3, topic: 'Sleep hygiene session', employees: 15, notes: 'Many report poor sleep affecting work performance.', status: 'approved' },
  { id: 4, topic: 'Dealing with change workshop', employees: 6, notes: 'Following recent restructure, team morale has dipped.', status: 'new' },
  { id: 5, topic: 'Imposter syndrome talk', employees: 20, notes: 'Popular request from junior and mid-level staff.', status: 'scheduled' },
];

const statusVariant = { new: 'warning', reviewed: 'default', approved: 'success', scheduled: 'success' };

export default function RequestsPage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-[32px] font-semibold text-neutral-900 tracking-tight">Requests</h1>
        <p className="text-[15px] text-neutral-400 mt-1.5">Workshop and topic requests from employees</p>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-neutral-200/60 overflow-hidden">
        <table className="w-full text-[13.5px]">
          <thead>
            <tr className="border-b border-neutral-100">
              <th className="px-6 py-3.5 text-left text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Topic</th>
              <th className="px-6 py-3.5 text-right text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Employees</th>
              <th className="px-6 py-3.5 text-left text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Notes</th>
              <th className="px-6 py-3.5 text-left text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3.5 text-right text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="border-t border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-neutral-900">{r.topic}</td>
                <td className="px-6 py-4 text-neutral-500 text-right tabular-nums">{r.employees}</td>
                <td className="px-6 py-4 text-neutral-400 max-w-[320px]">
                  <span className="line-clamp-1">{r.notes}</span>
                </td>
                <td className="px-6 py-4"><Badge variant={statusVariant[r.status]}>{r.status}</Badge></td>
                <td className="px-6 py-4 text-right">
                  {r.status === 'new' && <Button variant="secondary" size="sm">Review</Button>}
                  {r.status === 'reviewed' && <Button variant="primary" size="sm">Approve</Button>}
                  {r.status === 'approved' && <Button variant="outline" size="sm">Schedule</Button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
