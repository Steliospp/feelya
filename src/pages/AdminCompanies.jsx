import { useState } from 'react';
import { downloadCSV } from '../lib/csv';
import '../styles/app.css';

const mockCompanies = [
  {
    id: 1, name: 'Acme Corp', plan: 'Enterprise', employees: 200, active_users: 168,
    sessions_total: 842, sessions_month: 128, engagement: 84, mrr: 18000,
    coupon_code: 'ACME-2026-Q1', sessions_per_emp: 5, paid_upfront: 18000,
    contact: 'Sam Rivera', contact_email: 'sam.r@acme.com', joined: '2024-06-15',
  },
  {
    id: 2, name: 'TechFlow Ltd', plan: 'Growth', employees: 100, active_users: 78,
    sessions_total: 390, sessions_month: 62, engagement: 78, mrr: 9000,
    coupon_code: 'TECH-2026-Q1', sessions_per_emp: 5, paid_upfront: 9000,
    contact: 'Casey Liu', contact_email: 'casey@techflow.io', joined: '2024-09-01',
  },
  {
    id: 3, name: 'Nova Health', plan: 'Growth', employees: 50, active_users: 42,
    sessions_total: 210, sessions_month: 38, engagement: 84, mrr: 4500,
    coupon_code: 'NOVA-2026-Q1', sessions_per_emp: 5, paid_upfront: 4500,
    contact: 'Dr. Anna Green', contact_email: 'anna@nova.health', joined: '2025-01-10',
  },
  {
    id: 4, name: 'GreenLeaf', plan: 'Starter', employees: 40, active_users: 28,
    sessions_total: 112, sessions_month: 22, engagement: 70, mrr: 3600,
    coupon_code: 'GREEN-2026-Q1', sessions_per_emp: 5, paid_upfront: 3600,
    contact: 'Tom Harris', contact_email: 'tom@greenleaf.co', joined: '2025-03-20',
  },
  {
    id: 5, name: 'BlueStar', plan: 'Growth', employees: 60, active_users: 51,
    sessions_total: 255, sessions_month: 45, engagement: 85, mrr: 5400,
    coupon_code: 'BLUE-2026-Q1', sessions_per_emp: 5, paid_upfront: 5400,
    contact: 'Maria Santos', contact_email: 'maria@bluestar.com', joined: '2024-11-05',
  },
  {
    id: 6, name: 'Horizon Labs', plan: 'Enterprise', employees: 150, active_users: 112,
    sessions_total: 560, sessions_month: 88, engagement: 75, mrr: 13500,
    coupon_code: 'HRZN-2026-Q1', sessions_per_emp: 5, paid_upfront: 13500,
    contact: 'David Park', contact_email: 'david@horizonlabs.io', joined: '2025-02-01',
  },
];

const monthlyData = [
  { month: 'Sep', sessions: 310 },
  { month: 'Oct', sessions: 368 },
  { month: 'Nov', sessions: 412 },
  { month: 'Dec', sessions: 388 },
  { month: 'Jan', sessions: 445 },
  { month: 'Feb', sessions: 483 },
];

export default function AdminCompanies() {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const totalEmployees = mockCompanies.reduce((s, c) => s + c.employees, 0);
  const totalActive = mockCompanies.reduce((s, c) => s + c.active_users, 0);
  const totalMRR = mockCompanies.reduce((s, c) => s + c.mrr, 0);
  const totalSessions = mockCompanies.reduce((s, c) => s + c.sessions_month, 0);
  const maxMonth = Math.max(...monthlyData.map(m => m.sessions));

  function handleExportAll() {
    downloadCSV('companies-report.csv', mockCompanies, [
      { key: 'name', label: 'Company' },
      { key: 'plan', label: 'Plan' },
      { key: 'employees', label: 'Employees' },
      { key: 'active_users', label: 'Active Users' },
      { key: 'sessions_total', label: 'Total Sessions' },
      { key: 'sessions_month', label: 'Sessions This Month' },
      { key: 'engagement', label: 'Engagement %' },
      { key: 'mrr', label: 'MRR (£)' },
      { key: 'paid_upfront', label: 'Paid Upfront (£)' },
      { key: 'contact', label: 'Contact' },
      { key: 'contact_email', label: 'Contact Email' },
    ]);
  }

  function handleExportCompany(company) {
    downloadCSV(`${company.name.replace(/\s+/g, '-').toLowerCase()}-report.csv`, [company], [
      { key: 'name', label: 'Company' },
      { key: 'plan', label: 'Plan' },
      { key: 'employees', label: 'Employees' },
      { key: 'active_users', label: 'Active Users' },
      { key: 'sessions_total', label: 'Total Sessions' },
      { key: 'sessions_month', label: 'Sessions This Month' },
      { key: 'engagement', label: 'Engagement %' },
      { key: 'mrr', label: 'MRR (£)' },
      { key: 'paid_upfront', label: 'Paid Upfront (£)' },
      { key: 'contact', label: 'Contact' },
      { key: 'contact_email', label: 'Contact Email' },
      { key: 'coupon_code', label: 'Coupon Code' },
      { key: 'joined', label: 'Joined' },
    ]);
  }

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="page-header__title">Companies</h1>
          <p className="page-header__subtitle">View company insights, session usage, and export reports.</p>
        </div>
        <div className="export-bar">
          <input type="date" className="export-bar__date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          <span className="export-bar__sep">to</span>
          <input type="date" className="export-bar__date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
          <button className="btn btn--outline btn--sm" onClick={handleExportAll}>Export All CSV</button>
        </div>
      </div>

      {/* Stats */}
      <div className="org-stats-grid" style={{ marginBottom: 24 }}>
        <div className="org-stat">
          <div className="org-stat__label">Total Companies</div>
          <div className="org-stat__value">{mockCompanies.length}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Total Employees</div>
          <div className="org-stat__value">{totalEmployees.toLocaleString()}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Active Users</div>
          <div className="org-stat__value" style={{ color: 'var(--success)' }}>{totalActive}</div>
          <div className="org-stat__change org-stat__change--up">{Math.round((totalActive / totalEmployees) * 100)}% participation</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Total MRR</div>
          <div className="org-stat__value" style={{ color: 'var(--success)' }}>£{totalMRR.toLocaleString()}</div>
        </div>
      </div>

      {/* Sessions Trend */}
      <div className="org-chart-card" style={{ marginBottom: 24 }}>
        <div className="org-chart-card__title">Platform Sessions Trend (6 months)</div>
        <div className="org-bar-chart">
          {monthlyData.map(m => (
            <div className="org-bar" key={m.month}>
              <div className="org-bar__label">{m.month}</div>
              <div className="org-bar__track">
                <div className="org-bar__fill" style={{ width: `${(m.sessions / maxMonth) * 100}%` }} />
              </div>
              <div className="org-bar__value">{m.sessions}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Companies Table */}
      <div className="card card--no-hover">
        <div className="card__title">All Companies</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Company</th>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Plan</th>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Employees</th>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Active</th>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Sessions/Mo</th>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Engagement</th>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>MRR</th>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockCompanies.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '12px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--primary)', cursor: 'pointer' }} onClick={() => setSelectedCompany(c)}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Since {c.joined}</div>
                </td>
                <td style={{ padding: '12px' }}><span className="tag">{c.plan}</span></td>
                <td style={{ padding: '12px' }}>{c.employees}</td>
                <td style={{ padding: '12px' }}>
                  {c.active_users} <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>({Math.round((c.active_users / c.employees) * 100)}%)</span>
                </td>
                <td style={{ padding: '12px', fontWeight: 600 }}>{c.sessions_month}</td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 60, height: 6, background: 'var(--bg)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{
                        width: `${c.engagement}%`, height: '100%', borderRadius: 3,
                        background: c.engagement >= 80 ? 'var(--success)' : c.engagement >= 70 ? 'var(--primary)' : 'var(--warning)',
                      }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{c.engagement}%</span>
                  </div>
                </td>
                <td style={{ padding: '12px', fontWeight: 600, color: 'var(--success)' }}>£{c.mrr.toLocaleString()}</td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn--outline btn--xs" onClick={() => setSelectedCompany(c)}>View</button>
                    <button className="btn btn--ghost btn--xs" onClick={() => handleExportCompany(c)}>Export</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Company Detail Modal */}
      {selectedCompany && (
        <div className="modal-overlay" onClick={() => setSelectedCompany(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
            <button className="modal__close" onClick={() => setSelectedCompany(null)}>&times;</button>
            <h3 className="modal__title">{selectedCompany.name}</h3>
            <p style={{ color: 'var(--text-sec)', fontSize: 14, marginBottom: 20 }}>{selectedCompany.plan} Plan &middot; Since {selectedCompany.joined}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Employees</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{selectedCompany.employees}</div>
              </div>
              <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Active</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--success)' }}>{selectedCompany.active_users}</div>
              </div>
              <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Engagement</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--primary)' }}>{selectedCompany.engagement}%</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Total Sessions</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{selectedCompany.sessions_total}</div>
              </div>
              <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Sessions This Month</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{selectedCompany.sessions_month}</div>
              </div>
              <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Monthly Revenue</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--success)' }}>£{selectedCompany.mrr.toLocaleString()}</div>
              </div>
              <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Paid Upfront</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--success)' }}>£{selectedCompany.paid_upfront.toLocaleString()}</div>
              </div>
            </div>

            <div style={{ padding: 16, background: '#eef2ff', borderRadius: 10, border: '1px solid #e0e7ff', marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', color: '#4338ca', marginBottom: 8 }}>Coupon Details</div>
              <div style={{ display: 'flex', gap: 20, fontSize: 14, flexWrap: 'wrap' }}>
                <div><span style={{ color: '#64748b' }}>Code: </span><code style={{ fontWeight: 700 }}>{selectedCompany.coupon_code}</code></div>
                <div><span style={{ color: '#64748b' }}>Sessions/Employee: </span><strong>{selectedCompany.sessions_per_emp}</strong></div>
              </div>
            </div>

            <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8, marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>Contact</div>
              <div style={{ fontSize: 14 }}><strong>{selectedCompany.contact}</strong> &middot; {selectedCompany.contact_email}</div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn--outline btn--md btn--full" onClick={() => handleExportCompany(selectedCompany)}>
                Export Report (CSV)
              </button>
              <button className="btn btn--ghost btn--md btn--full" onClick={() => setSelectedCompany(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
