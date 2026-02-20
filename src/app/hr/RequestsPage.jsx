import Badge from '../../components/ui/badge';
import Button from '../../components/ui/button';
import PageHeader from '../../components/ui/page-header';
import SectionCard from '../../components/ui/section-card';

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
      <PageHeader title="Requests" description="Workshop and topic requests from employees" />

      <SectionCard noPadding>
        <table className="w-full text-[14px]">
          <thead>
            <tr className="text-left border-b border-border-light">
              <th className="px-5 py-3 text-[13px] text-text-muted font-medium uppercase tracking-wider">Topic</th>
              <th className="px-5 py-3 text-[13px] text-text-muted font-medium uppercase tracking-wider">Employees</th>
              <th className="px-5 py-3 text-[13px] text-text-muted font-medium uppercase tracking-wider">Notes</th>
              <th className="px-5 py-3 text-[13px] text-text-muted font-medium uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-[13px] text-text-muted font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r, i) => (
              <tr key={r.id} className={`border-t border-border-light hover:bg-surface-muted/60 transition-colors ${i % 2 === 1 ? 'bg-surface-muted/30' : ''}`}>
                <td className="px-5 py-3.5 font-medium text-text-primary">{r.topic}</td>
                <td className="px-5 py-3.5 text-text-secondary">{r.employees}</td>
                <td className="px-5 py-3.5 text-text-secondary max-w-[300px] truncate">{r.notes}</td>
                <td className="px-5 py-3.5"><Badge variant={statusVariant[r.status]}>{r.status}</Badge></td>
                <td className="px-5 py-3.5">
                  {r.status === 'new' && <Button variant="secondary" size="sm">Review</Button>}
                  {r.status === 'reviewed' && <Button variant="primary" size="sm">Approve</Button>}
                  {r.status === 'approved' && <Button variant="outline" size="sm">Schedule</Button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
}
