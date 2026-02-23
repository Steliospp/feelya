import { useState } from 'react';
import { downloadCSV } from '../lib/csv';
import '../styles/app.css';

const mockDepartments = [
  { dept: 'Engineering', total: 64, active: 59, sessions: 128, engagement: 92 },
  { dept: 'Marketing', total: 28, active: 24, sessions: 52, engagement: 86 },
  { dept: 'Sales', total: 35, active: 27, sessions: 48, engagement: 78 },
  { dept: 'Product', total: 22, active: 20, sessions: 44, engagement: 91 },
  { dept: 'HR', total: 12, active: 11, sessions: 28, engagement: 95 },
  { dept: 'Finance', total: 18, active: 13, sessions: 24, engagement: 72 },
  { dept: 'Operations', total: 20, active: 14, sessions: 18, engagement: 68 },
  { dept: 'Legal', total: 8, active: 6, sessions: 10, engagement: 75 },
  { dept: 'Design', total: 15, active: 14, sessions: 32, engagement: 93 },
  { dept: 'Support', total: 25, active: 18, sessions: 30, engagement: 72 },
];

export default function HREmployees() {
  const totalEmployees = mockDepartments.reduce((s, d) => s + d.total, 0);
  const totalActive = mockDepartments.reduce((s, d) => s + d.active, 0);
  const totalSessions = mockDepartments.reduce((s, d) => s + d.sessions, 0);
  const avgEngagement = Math.round(mockDepartments.reduce((s, d) => s + d.engagement, 0) / mockDepartments.length);

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  function handleExport() {
    downloadCSV('employees-report.csv', mockDepartments, [
      { key: 'dept', label: 'Department' },
      { key: 'total', label: 'Employees' },
      { key: 'active', label: 'Active' },
      { key: 'sessions', label: 'Sessions' },
      { key: 'engagement', label: 'Engagement %' },
    ]);
  }

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="page-header__title">Employees</h1>
          <p className="page-header__subtitle">Aggregated engagement metrics by department. Individual data is never shown.</p>
        </div>
        <div className="export-bar">
          <input type="date" className="export-bar__date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          <span className="export-bar__sep">to</span>
          <input type="date" className="export-bar__date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
          <button className="btn btn--outline btn--sm" onClick={handleExport}>Export CSV</button>
        </div>
      </div>

      <div className="org-stats-grid" style={{ marginBottom: 24 }}>
        <div className="org-stat">
          <div className="org-stat__label">Total Employees</div>
          <div className="org-stat__value">{totalEmployees}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Active Users</div>
          <div className="org-stat__value" style={{ color: 'var(--success)' }}>{totalActive}</div>
          <div className="org-stat__change org-stat__change--up">{Math.round((totalActive / totalEmployees) * 100)}% participation</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Total Sessions</div>
          <div className="org-stat__value">{totalSessions}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Avg Engagement</div>
          <div className="org-stat__value">{avgEngagement}%</div>
        </div>
      </div>

      <div className="card card--no-hover">
        <div className="card__title">Department Engagement</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
              <th style={{ padding: '12px 16px', color: 'var(--text-sec)', fontWeight: 600 }}>Department</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-sec)', fontWeight: 600 }}>Employees</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-sec)', fontWeight: 600 }}>Active</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-sec)', fontWeight: 600 }}>Sessions</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-sec)', fontWeight: 600 }}>Engagement</th>
            </tr>
          </thead>
          <tbody>
            {mockDepartments.sort((a, b) => b.engagement - a.engagement).map(d => (
              <tr key={d.dept} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '14px 16px', fontWeight: 600 }}>{d.dept}</td>
                <td style={{ padding: '14px 16px', color: 'var(--text-sec)' }}>{d.total}</td>
                <td style={{ padding: '14px 16px', color: 'var(--text-sec)' }}>
                  {d.active} <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>({Math.round((d.active / d.total) * 100)}%)</span>
                </td>
                <td style={{ padding: '14px 16px', fontWeight: 600 }}>{d.sessions}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 8, background: 'var(--bg)', borderRadius: 4, overflow: 'hidden', maxWidth: 100 }}>
                      <div style={{
                        width: `${d.engagement}%`,
                        height: '100%',
                        borderRadius: 4,
                        background: d.engagement >= 90 ? 'var(--success)' :
                          d.engagement >= 75 ? 'var(--primary)' : 'var(--warning)',
                      }} />
                    </div>
                    <span style={{ fontWeight: 600, fontSize: 13, color: d.engagement >= 90 ? 'var(--success)' : d.engagement >= 75 ? 'var(--primary)' : 'var(--warning)' }}>
                      {d.engagement}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 24, padding: 24, background: '#eef2ff', borderRadius: 12, border: '1px solid #e0e7ff' }}>
        <div style={{ fontWeight: 600, color: '#1e1b4b', marginBottom: 4 }}>Privacy Notice</div>
        <div style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
          All data is aggregated at the department level. You cannot view individual employee session details, therapist assignments, or personal wellbeing scores. Departments with fewer than 5 employees are excluded from detailed metrics.
        </div>
      </div>
    </div>
  );
}
