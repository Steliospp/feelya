import { useState } from 'react';
import { downloadCSV } from '../lib/csv';
import '../styles/app.css';

const mockUsers = [
  { id: 1, name: 'Alex Taylor', email: 'alex.taylor@acme.com', company: 'Acme Corp', role: 'Employee', sessions_used: 3, sessions_total: 5, total_paid: 270, last_session: '2026-02-20', status: 'active', coupon: 'ACME-2026-001' },
  { id: 2, name: 'Morgan Johnson', email: 'm.johnson@acme.com', company: 'Acme Corp', role: 'Employee', sessions_used: 5, sessions_total: 5, total_paid: 450, last_session: '2026-02-22', status: 'active', coupon: 'ACME-2026-002' },
  { id: 3, name: 'Riley Patel', email: 'r.patel@techflow.io', company: 'TechFlow Ltd', role: 'Employee', sessions_used: 2, sessions_total: 5, total_paid: 135, last_session: '2026-02-18', status: 'active', coupon: 'TECH-2026-001' },
  { id: 4, name: 'Sam Williams', email: 's.williams@nova.health', company: 'Nova Health', role: 'Employee', sessions_used: 4, sessions_total: 5, total_paid: 360, last_session: '2026-02-21', status: 'active', coupon: 'NOVA-2026-001' },
  { id: 5, name: 'Jordan Brown', email: 'j.brown@greenleaf.co', company: 'GreenLeaf', role: 'Employee', sessions_used: 1, sessions_total: 5, total_paid: 90, last_session: '2026-02-15', status: 'active', coupon: 'GREEN-2026-001' },
  { id: 6, name: 'Sam Rivera', email: 'sam.r@acme.com', company: 'Acme Corp', role: 'HR Admin', sessions_used: 2, sessions_total: 5, total_paid: 180, last_session: '2026-02-19', status: 'active', coupon: 'ACME-2026-HR1' },
  { id: 7, name: 'Casey Liu', email: 'casey@techflow.io', company: 'TechFlow Ltd', role: 'HR Admin', sessions_used: 0, sessions_total: 5, total_paid: 0, last_session: null, status: 'active', coupon: 'TECH-2026-HR1' },
  { id: 8, name: 'Drew Murphy', email: 'drew@bluestar.com', company: 'BlueStar', role: 'Employee', sessions_used: 5, sessions_total: 5, total_paid: 425, last_session: '2026-02-22', status: 'active', coupon: 'BLUE-2026-001' },
  { id: 9, name: 'Pat Robinson', email: 'pat.r@nova.health', company: 'Nova Health', role: 'Employee', sessions_used: 0, sessions_total: 5, total_paid: 0, last_session: null, status: 'inactive', coupon: 'NOVA-2026-002' },
  { id: 10, name: 'Charlie Cooper', email: 'charlie@greenleaf.co', company: 'GreenLeaf', role: 'Employee', sessions_used: 3, sessions_total: 5, total_paid: 210, last_session: '2026-02-17', status: 'active', coupon: 'GREEN-2026-002' },
];

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);

  const companies = [...new Set(mockUsers.map(u => u.company))];

  const filtered = mockUsers
    .filter(u => companyFilter === 'all' || u.company === companyFilter)
    .filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  function handleExport() {
    downloadCSV('users-report.csv', filtered, [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'company', label: 'Company' },
      { key: 'role', label: 'Role' },
      { key: 'sessions_used', label: 'Sessions Used' },
      { key: 'sessions_total', label: 'Sessions Total' },
      { key: 'total_paid', label: 'Total Paid (£)' },
      { key: 'coupon', label: 'Coupon Code' },
      { key: 'status', label: 'Status' },
    ]);
  }

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="page-header__title">Users</h1>
          <p className="page-header__subtitle">View all platform users, their session usage, and payment history.</p>
        </div>
        <button className="btn btn--outline btn--sm" onClick={handleExport}>Export CSV</button>
      </div>

      {/* Stats */}
      <div className="org-stats-grid" style={{ marginBottom: 24 }}>
        <div className="org-stat">
          <div className="org-stat__label">Total Users</div>
          <div className="org-stat__value">{mockUsers.length}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Active</div>
          <div className="org-stat__value" style={{ color: 'var(--success)' }}>{mockUsers.filter(u => u.status === 'active').length}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Total Sessions Used</div>
          <div className="org-stat__value">{mockUsers.reduce((s, u) => s + u.sessions_used, 0)}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Total Payments</div>
          <div className="org-stat__value" style={{ color: 'var(--success)' }}>£{mockUsers.reduce((s, u) => s + u.total_paid, 0).toLocaleString()}</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <input className="form-input" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 300 }} />
        <select className="form-input" value={companyFilter} onChange={e => setCompanyFilter(e.target.value)} style={{ maxWidth: 200 }}>
          <option value="all">All Companies</option>
          {companies.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card card--no-hover">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>User</th>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Company</th>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Role</th>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Sessions</th>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Paid</th>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Coupon</th>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '12px' }}>
                  <div style={{ fontWeight: 600 }}>{u.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{u.email}</div>
                </td>
                <td style={{ padding: '12px', color: 'var(--text-sec)' }}>{u.company}</td>
                <td style={{ padding: '12px' }}><span className="tag">{u.role}</span></td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 60, height: 6, background: 'var(--bg)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${(u.sessions_used / u.sessions_total) * 100}%`, height: '100%', borderRadius: 3, background: u.sessions_used >= u.sessions_total ? 'var(--danger)' : 'var(--primary)' }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{u.sessions_used}/{u.sessions_total}</span>
                  </div>
                </td>
                <td style={{ padding: '12px', fontWeight: 600 }}>£{u.total_paid}</td>
                <td style={{ padding: '12px' }}>
                  <code style={{ fontSize: 12, background: 'var(--bg)', padding: '2px 6px', borderRadius: 4 }}>{u.coupon}</code>
                </td>
                <td style={{ padding: '12px' }}>
                  <span className={`tag ${u.status === 'active' ? 'tag--success' : 'tag--danger'}`}>
                    {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <button className="btn btn--ghost btn--xs" onClick={() => setSelectedUser(u)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <button className="modal__close" onClick={() => setSelectedUser(null)}>&times;</button>
            <h3 className="modal__title">{selectedUser.name}</h3>
            <p style={{ color: 'var(--text-sec)', fontSize: 14, marginBottom: 20 }}>{selectedUser.email}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Company</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{selectedUser.company}</div>
              </div>
              <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Role</div>
                <div style={{ fontSize: 14 }}>{selectedUser.role}</div>
              </div>
              <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Sessions Used</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{selectedUser.sessions_used} / {selectedUser.sessions_total}</div>
              </div>
              <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Total Paid</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--success)' }}>£{selectedUser.total_paid}</div>
              </div>
              <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Coupon Code</div>
                <code style={{ fontSize: 13 }}>{selectedUser.coupon}</code>
              </div>
              <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Last Session</div>
                <div style={{ fontSize: 14 }}>{selectedUser.last_session || 'None yet'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <span className={`tag ${selectedUser.status === 'active' ? 'tag--success' : 'tag--danger'}`} style={{ padding: '6px 14px' }}>
                {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
