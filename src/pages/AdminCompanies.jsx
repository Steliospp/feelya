import { useState } from 'react';
import { useToast } from '../components/Toast';
import { downloadCSV } from '../lib/csv';
import '../styles/app.css';

const mockCompanies = [
  {
    id: 1, name: 'Acme Corp', plan: 'Growth', employees: 200, active_users: 168,
    sessions_total: 842, sessions_month: 128, engagement: 84, mrr: 18000,
    coupon_code: 'ACME-2026-Q1', sessions_per_emp: 5, paid_upfront: 18000,
    contact: 'Sam Rivera', contact_email: 'sam.r@acme.com', joined: '2024-06-15',
    domain: 'acme.com', status: 'active', sessions_per_day: 20, pilot: false,
    pilot_end: null, notes: '',
  },
  {
    id: 2, name: 'TechFlow Ltd', plan: 'Pilot', employees: 100, active_users: 78,
    sessions_total: 390, sessions_month: 62, engagement: 78, mrr: 9000,
    coupon_code: 'TECH-2026-Q1', sessions_per_emp: 5, paid_upfront: 9000,
    contact: 'Casey Liu', contact_email: 'casey@techflow.io', joined: '2024-09-01',
    domain: 'techflow.io', status: 'active', sessions_per_day: 10, pilot: true,
    pilot_end: '2026-05-01', notes: 'Evaluating for full rollout in Q3.',
  },
  {
    id: 3, name: 'Nova Health', plan: 'Growth', employees: 50, active_users: 42,
    sessions_total: 210, sessions_month: 38, engagement: 84, mrr: 4500,
    coupon_code: 'NOVA-2026-Q1', sessions_per_emp: 5, paid_upfront: 4500,
    contact: 'Dr. Anna Green', contact_email: 'anna@nova.health', joined: '2025-01-10',
    domain: 'nova.health', status: 'active', sessions_per_day: 8, pilot: false,
    pilot_end: null, notes: '',
  },
  {
    id: 4, name: 'GreenLeaf', plan: 'Pilot', employees: 40, active_users: 28,
    sessions_total: 112, sessions_month: 22, engagement: 70, mrr: 3600,
    coupon_code: 'GREEN-2026-Q1', sessions_per_emp: 5, paid_upfront: 3600,
    contact: 'Tom Harris', contact_email: 'tom@greenleaf.co', joined: '2025-03-20',
    domain: 'greenleaf.co', status: 'active', sessions_per_day: 5, pilot: true,
    pilot_end: '2026-04-20', notes: 'Pilot extended once already.',
  },
  {
    id: 5, name: 'BlueStar', plan: 'Growth', employees: 60, active_users: 51,
    sessions_total: 255, sessions_month: 45, engagement: 85, mrr: 5400,
    coupon_code: 'BLUE-2026-Q1', sessions_per_emp: 5, paid_upfront: 5400,
    contact: 'Maria Santos', contact_email: 'maria@bluestar.com', joined: '2024-11-05',
    domain: 'bluestar.com', status: 'active', sessions_per_day: 8, pilot: false,
    pilot_end: null, notes: '',
  },
  {
    id: 6, name: 'Horizon Labs', plan: 'Custom', employees: 150, active_users: 112,
    sessions_total: 560, sessions_month: 88, engagement: 75, mrr: 13500,
    coupon_code: 'HRZN-2026-Q1', sessions_per_emp: 8, paid_upfront: 13500,
    contact: 'David Park', contact_email: 'david@horizonlabs.io', joined: '2025-02-01',
    domain: 'horizonlabs.io', status: 'active', sessions_per_day: 15, pilot: false,
    pilot_end: null, notes: 'Custom contract — includes workshops bundle.',
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

const PACKAGES = {
  Pilot: { label: 'Pilot', sessionsPerEmp: 3, sessionsPerDay: 5, color: '#f59e0b', description: 'Trial period for new companies — limited sessions, time-boxed.' },
  Growth: { label: 'Growth', sessionsPerEmp: 5, sessionsPerDay: 15, color: 'var(--primary)', description: 'Standard package — 5 sessions per employee per quarter.' },
  Custom: { label: 'Custom', sessionsPerEmp: null, sessionsPerDay: null, color: '#8b5cf6', description: 'Fully customisable — set your own limits and terms.' },
};

const emptyOnboardForm = {
  companyName: '',
  domain: '',
  contactName: '',
  contactEmail: '',
  package: 'Growth',
  employees: '',
  sessionsPerEmp: 5,
  sessionsPerDay: 15,
  pilotEndDate: '',
  paidUpfront: '',
  couponCode: '',
  notes: '',
};

const tabs = ['companies', 'onboard'];

export default function AdminCompanies() {
  const showToast = useToast();
  const [activeTab, setActiveTab] = useState('companies');
  const [companies, setCompanies] = useState(mockCompanies);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Onboarding state
  const [onboardForm, setOnboardForm] = useState({ ...emptyOnboardForm });
  const [onboardStep, setOnboardStep] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);

  const totalEmployees = companies.reduce((s, c) => s + c.employees, 0);
  const totalActive = companies.reduce((s, c) => s + c.active_users, 0);
  const totalMRR = companies.reduce((s, c) => s + c.mrr, 0);
  const maxMonth = Math.max(...monthlyData.map(m => m.sessions));

  // ─── helpers ───
  function setField(key, val) {
    setOnboardForm(f => ({ ...f, [key]: val }));
  }

  function selectPackage(pkg) {
    const preset = PACKAGES[pkg];
    setOnboardForm(f => ({
      ...f,
      package: pkg,
      sessionsPerEmp: preset.sessionsPerEmp ?? f.sessionsPerEmp,
      sessionsPerDay: preset.sessionsPerDay ?? f.sessionsPerDay,
      pilotEndDate: pkg !== 'Pilot' ? '' : f.pilotEndDate,
    }));
  }

  function generateCoupon() {
    const prefix = onboardForm.companyName.trim().replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 4) || 'COMP';
    const year = new Date().getFullYear();
    const q = Math.ceil((new Date().getMonth() + 1) / 3);
    setField('couponCode', `${prefix}-${year}-Q${q}`);
  }

  function domainFromEmail(email) {
    const parts = email.split('@');
    if (parts.length === 2 && parts[1].includes('.')) {
      setField('domain', parts[1]);
    }
  }

  // Validation
  const step1Valid = onboardForm.companyName.trim() && onboardForm.domain.trim() && onboardForm.contactName.trim() && onboardForm.contactEmail.trim() && onboardForm.contactEmail.includes('@');
  const step2Valid = onboardForm.package && Number(onboardForm.employees) > 0 && Number(onboardForm.sessionsPerEmp) > 0 && Number(onboardForm.sessionsPerDay) > 0 && (onboardForm.package !== 'Pilot' || onboardForm.pilotEndDate);
  const step3Valid = onboardForm.couponCode.trim();

  function handleSubmitOnboard() {
    const emp = Number(onboardForm.employees);
    const newCompany = {
      id: Date.now(),
      name: onboardForm.companyName.trim(),
      plan: onboardForm.package,
      employees: emp,
      active_users: 0,
      sessions_total: 0,
      sessions_month: 0,
      engagement: 0,
      mrr: Number(onboardForm.paidUpfront) || 0,
      coupon_code: onboardForm.couponCode.trim(),
      sessions_per_emp: Number(onboardForm.sessionsPerEmp),
      paid_upfront: Number(onboardForm.paidUpfront) || 0,
      contact: onboardForm.contactName.trim(),
      contact_email: onboardForm.contactEmail.trim(),
      joined: new Date().toISOString().split('T')[0],
      domain: onboardForm.domain.trim().toLowerCase(),
      status: 'active',
      sessions_per_day: Number(onboardForm.sessionsPerDay),
      pilot: onboardForm.package === 'Pilot',
      pilot_end: onboardForm.package === 'Pilot' ? onboardForm.pilotEndDate : null,
      notes: onboardForm.notes.trim(),
    };
    setCompanies(prev => [newCompany, ...prev]);
    setOnboardForm({ ...emptyOnboardForm });
    setOnboardStep(1);
    setShowConfirm(false);
    setActiveTab('companies');
    showToast(`${newCompany.name} onboarded successfully`);
  }

  function handleExportAll() {
    downloadCSV('companies-report.csv', companies, [
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
      { key: 'domain', label: 'Domain' },
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
      { key: 'domain', label: 'Domain' },
      { key: 'joined', label: 'Joined' },
    ]);
  }

  // ─── Step indicator ───
  function StepIndicator() {
    const steps = ['Company Details', 'Package & Limits', 'Coupon & Review'];
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 28 }}>
        {steps.map((label, i) => {
          const num = i + 1;
          const done = onboardStep > num;
          const active = onboardStep === num;
          return (
            <div key={num} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700,
                  background: done ? 'var(--primary)' : active ? 'var(--primary)' : 'var(--bg)',
                  color: done || active ? '#fff' : 'var(--text-muted)',
                  border: active ? 'none' : done ? 'none' : '2px solid var(--border)',
                }}>
                  {done ? '\u2713' : num}
                </div>
                <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? 'var(--text)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>{label}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{ flex: 1, height: 2, background: done ? 'var(--primary)' : 'var(--border)', margin: '0 12px', borderRadius: 1 }} />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="page-header__title">Companies</h1>
          <p className="page-header__subtitle">Manage corporate clients, onboard new companies, and export reports.</p>
        </div>
        {activeTab === 'companies' && (
          <div className="export-bar">
            <input type="date" className="export-bar__date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            <span className="export-bar__sep">to</span>
            <input type="date" className="export-bar__date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
            <button className="btn btn--outline btn--sm" onClick={handleExportAll}>Export All CSV</button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="sessions-tabs" style={{ marginBottom: 24 }}>
        {tabs.map(tab => (
          <button key={tab} className={`sessions-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab === 'onboard' ? 'Onboard Company' : 'Companies'}
          </button>
        ))}
      </div>

      {/* ═══════════════ COMPANIES TAB ═══════════════ */}
      {activeTab === 'companies' && (
        <>
          {/* Stats */}
          <div className="org-stats-grid" style={{ marginBottom: 24 }}>
            <div className="org-stat">
              <div className="org-stat__label">Total Companies</div>
              <div className="org-stat__value">{companies.length}</div>
            </div>
            <div className="org-stat">
              <div className="org-stat__label">Total Employees</div>
              <div className="org-stat__value">{totalEmployees.toLocaleString()}</div>
            </div>
            <div className="org-stat">
              <div className="org-stat__label">Active Users</div>
              <div className="org-stat__value" style={{ color: 'var(--success)' }}>{totalActive}</div>
              <div className="org-stat__change org-stat__change--up">{totalEmployees > 0 ? Math.round((totalActive / totalEmployees) * 100) : 0}% participation</div>
            </div>
            <div className="org-stat">
              <div className="org-stat__label">Total MRR</div>
              <div className="org-stat__value" style={{ color: 'var(--success)' }}>&pound;{totalMRR.toLocaleString()}</div>
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
                  <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Domain</th>
                  <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Employees</th>
                  <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Active</th>
                  <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Sessions/Mo</th>
                  <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Engagement</th>
                  <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>MRR</th>
                  <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--primary)', cursor: 'pointer' }} onClick={() => setSelectedCompany(c)}>{c.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Since {c.joined}</div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span className="tag" style={{ background: c.plan === 'Pilot' ? '#fef3c7' : c.plan === 'Custom' ? '#ede9fe' : '', color: c.plan === 'Pilot' ? '#92400e' : c.plan === 'Custom' ? '#5b21b6' : '' }}>
                        {c.plan}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <code style={{ fontSize: 12, background: 'var(--bg)', padding: '2px 6px', borderRadius: 4 }}>{c.domain}</code>
                    </td>
                    <td style={{ padding: '12px' }}>{c.employees}</td>
                    <td style={{ padding: '12px' }}>
                      {c.active_users} <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>({c.employees > 0 ? Math.round((c.active_users / c.employees) * 100) : 0}%)</span>
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
                    <td style={{ padding: '12px', fontWeight: 600, color: 'var(--success)' }}>&pound;{c.mrr.toLocaleString()}</td>
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
              <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 600, maxHeight: '85vh', overflow: 'auto' }}>
                <button className="modal__close" onClick={() => setSelectedCompany(null)}>&times;</button>
                <h3 className="modal__title">{selectedCompany.name}</h3>
                <p style={{ color: 'var(--text-sec)', fontSize: 14, marginBottom: 20 }}>
                  {selectedCompany.plan} Plan &middot; Since {selectedCompany.joined}
                  {selectedCompany.pilot && <span style={{ marginLeft: 8, color: '#f59e0b', fontWeight: 600 }}>(Pilot ends {selectedCompany.pilot_end})</span>}
                </p>

                {/* Domain info */}
                <div style={{ padding: 14, background: '#eef2ff', borderRadius: 10, border: '1px solid #e0e7ff', marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', color: '#4338ca', marginBottom: 6 }}>Domain &amp; Access</div>
                  <div style={{ fontSize: 14 }}>
                    Employees with <code style={{ fontWeight: 700, background: '#fff', padding: '2px 6px', borderRadius: 4 }}>@{selectedCompany.domain}</code> email addresses are automatically routed to {selectedCompany.name}&rsquo;s Feelya portal.
                  </div>
                </div>

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
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Sessions / Employee</div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{selectedCompany.sessions_per_emp}</div>
                  </div>
                  <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Sessions / Day Cap</div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{selectedCompany.sessions_per_day}</div>
                  </div>
                  <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Monthly Revenue</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--success)' }}>&pound;{selectedCompany.mrr.toLocaleString()}</div>
                  </div>
                  <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Paid Upfront</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--success)' }}>&pound;{selectedCompany.paid_upfront.toLocaleString()}</div>
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

                {selectedCompany.notes && (
                  <div style={{ padding: 12, background: '#fffbeb', borderRadius: 8, border: '1px solid #fde68a', marginBottom: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#92400e', marginBottom: 4 }}>Notes</div>
                    <div style={{ fontSize: 14, color: '#78350f' }}>{selectedCompany.notes}</div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn--outline btn--md btn--full" onClick={() => handleExportCompany(selectedCompany)}>
                    Export Report (CSV)
                  </button>
                  <button className="btn btn--ghost btn--md btn--full" onClick={() => setSelectedCompany(null)}>Close</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ═══════════════ ONBOARD COMPANY TAB ═══════════════ */}
      {activeTab === 'onboard' && (
        <div className="card card--no-hover" style={{ padding: 28, maxWidth: 720 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Onboard a New Company</h2>
          <p style={{ fontSize: 14, color: 'var(--text-sec)', marginBottom: 24 }}>Set up a corporate client with their package, domain access, employee limits, and coupon code.</p>

          <StepIndicator />

          {/* ──── STEP 1: Company Details ──── */}
          {onboardStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="form-label">Company Name</label>
                <input className="form-input" placeholder="e.g. Acme Corp" value={onboardForm.companyName} onChange={e => setField('companyName', e.target.value)} />
              </div>

              <div>
                <label className="form-label">Primary Contact Name</label>
                <input className="form-input" placeholder="e.g. Sam Rivera" value={onboardForm.contactName} onChange={e => setField('contactName', e.target.value)} />
              </div>

              <div>
                <label className="form-label">Primary Contact Email</label>
                <input className="form-input" type="email" placeholder="e.g. sam@acme.com" value={onboardForm.contactEmail}
                  onChange={e => setField('contactEmail', e.target.value)}
                  onBlur={() => { if (!onboardForm.domain && onboardForm.contactEmail.includes('@')) domainFromEmail(onboardForm.contactEmail); }}
                />
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>The domain will be auto-filled from this email.</div>
              </div>

              <div>
                <label className="form-label">Company Email Domain</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16, color: 'var(--text-muted)', fontWeight: 500 }}>@</span>
                  <input className="form-input" placeholder="acme.com" value={onboardForm.domain} onChange={e => setField('domain', e.target.value)} style={{ flex: 1 }} />
                </div>
                <div style={{ marginTop: 8, padding: 10, background: '#eef2ff', borderRadius: 8, border: '1px solid #e0e7ff', fontSize: 13, color: '#4338ca' }}>
                  Only users with an <strong>@{onboardForm.domain || '...'}</strong> email address will be able to access this company&rsquo;s Feelya portal. Their domain email will route them directly to their company&rsquo;s portal and not another company&rsquo;s.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <button className="btn btn--primary btn--md" disabled={!step1Valid} onClick={() => setOnboardStep(2)}>
                  Next: Package &amp; Limits
                </button>
              </div>
            </div>
          )}

          {/* ──── STEP 2: Package & Limits ──── */}
          {onboardStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="form-label">Package</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  {Object.entries(PACKAGES).map(([key, pkg]) => {
                    const selected = onboardForm.package === key;
                    return (
                      <div
                        key={key}
                        onClick={() => selectPackage(key)}
                        style={{
                          padding: 16, borderRadius: 12, cursor: 'pointer', textAlign: 'center',
                          border: selected ? `2px solid ${pkg.color}` : '2px solid var(--border)',
                          background: selected ? (key === 'Pilot' ? '#fffbeb' : key === 'Custom' ? '#f5f3ff' : '#eef2ff') : 'var(--card-bg)',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div style={{ fontSize: 16, fontWeight: 700, color: pkg.color, marginBottom: 4 }}>{pkg.label}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-sec)', lineHeight: 1.4 }}>{pkg.description}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {onboardForm.package === 'Pilot' && (
                <div>
                  <label className="form-label">Pilot End Date</label>
                  <input className="form-input" type="date" value={onboardForm.pilotEndDate} onChange={e => setField('pilotEndDate', e.target.value)} />
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>The company&rsquo;s access will be reviewed on this date.</div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label className="form-label">Number of Employees</label>
                  <input className="form-input" type="number" min="1" placeholder="e.g. 100" value={onboardForm.employees} onChange={e => setField('employees', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Sessions per Employee (per quarter)</label>
                  <input className="form-input" type="number" min="1" placeholder="e.g. 5"
                    value={onboardForm.sessionsPerEmp}
                    onChange={e => setField('sessionsPerEmp', e.target.value)}
                    disabled={onboardForm.package !== 'Custom'}
                  />
                  {onboardForm.package !== 'Custom' && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Set by package. Switch to Custom to override.</div>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label className="form-label">Max Sessions per Day (company-wide)</label>
                  <input className="form-input" type="number" min="1" placeholder="e.g. 15"
                    value={onboardForm.sessionsPerDay}
                    onChange={e => setField('sessionsPerDay', e.target.value)}
                    disabled={onboardForm.package !== 'Custom'}
                  />
                  {onboardForm.package !== 'Custom' && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Set by package. Switch to Custom to override.</div>}
                </div>
                <div>
                  <label className="form-label">Amount Paid Upfront (&pound;)</label>
                  <input className="form-input" type="number" min="0" placeholder="e.g. 9000" value={onboardForm.paidUpfront} onChange={e => setField('paidUpfront', e.target.value)} />
                </div>
              </div>

              {/* Summary box */}
              {Number(onboardForm.employees) > 0 && (
                <div style={{ padding: 14, background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Quota Summary</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, fontSize: 14 }}>
                    <div><span style={{ color: 'var(--text-sec)' }}>Total sessions/quarter:</span><br /><strong>{Number(onboardForm.employees) * Number(onboardForm.sessionsPerEmp)}</strong></div>
                    <div><span style={{ color: 'var(--text-sec)' }}>Daily cap:</span><br /><strong>{onboardForm.sessionsPerDay} sessions/day</strong></div>
                    <div><span style={{ color: 'var(--text-sec)' }}>Per employee:</span><br /><strong>{onboardForm.sessionsPerEmp} sessions/qtr</strong></div>
                  </div>
                </div>
              )}

              <div>
                <label className="form-label">Internal Notes (optional)</label>
                <textarea className="form-textarea" placeholder="Any internal notes about this company..." value={onboardForm.notes} onChange={e => setField('notes', e.target.value)} style={{ minHeight: 70 }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <button className="btn btn--ghost btn--md" onClick={() => setOnboardStep(1)}>Back</button>
                <button className="btn btn--primary btn--md" disabled={!step2Valid} onClick={() => { if (!onboardForm.couponCode) generateCoupon(); setOnboardStep(3); }}>
                  Next: Coupon &amp; Review
                </button>
              </div>
            </div>
          )}

          {/* ──── STEP 3: Coupon & Review ──── */}
          {onboardStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="form-label">Coupon Code</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input className="form-input" placeholder="e.g. ACME-2026-Q1" value={onboardForm.couponCode} onChange={e => setField('couponCode', e.target.value)} style={{ flex: 1 }} />
                  <button className="btn btn--outline btn--sm" onClick={generateCoupon}>Generate</button>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Employees use this code to sign up. It links them to this company&rsquo;s portal.</div>
              </div>

              {/* Final Review */}
              <div style={{ padding: 20, background: 'var(--bg)', borderRadius: 12, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: 'var(--text)' }}>Review Before Onboarding</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, fontSize: 14 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 2 }}>Company</div>
                    <div style={{ fontWeight: 600 }}>{onboardForm.companyName}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 2 }}>Domain</div>
                    <div><code style={{ fontWeight: 600 }}>@{onboardForm.domain}</code></div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 2 }}>Contact</div>
                    <div>{onboardForm.contactName}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{onboardForm.contactEmail}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 2 }}>Package</div>
                    <div>
                      <span className="tag" style={{ background: onboardForm.package === 'Pilot' ? '#fef3c7' : onboardForm.package === 'Custom' ? '#ede9fe' : '', color: onboardForm.package === 'Pilot' ? '#92400e' : onboardForm.package === 'Custom' ? '#5b21b6' : '' }}>
                        {onboardForm.package}
                      </span>
                      {onboardForm.package === 'Pilot' && <span style={{ fontSize: 12, color: '#f59e0b', marginLeft: 6 }}>ends {onboardForm.pilotEndDate}</span>}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 2 }}>Employees</div>
                    <div style={{ fontWeight: 600 }}>{onboardForm.employees}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 2 }}>Sessions/Employee/Qtr</div>
                    <div style={{ fontWeight: 600 }}>{onboardForm.sessionsPerEmp}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 2 }}>Daily Session Cap</div>
                    <div style={{ fontWeight: 600 }}>{onboardForm.sessionsPerDay}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 2 }}>Coupon Code</div>
                    <div><code style={{ fontWeight: 700, fontSize: 15 }}>{onboardForm.couponCode}</code></div>
                  </div>
                  {Number(onboardForm.paidUpfront) > 0 && (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 2 }}>Paid Upfront</div>
                      <div style={{ fontWeight: 600, color: 'var(--success)' }}>&pound;{Number(onboardForm.paidUpfront).toLocaleString()}</div>
                    </div>
                  )}
                  {onboardForm.notes && (
                    <div style={{ gridColumn: '1 / -1' }}>
                      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 2 }}>Notes</div>
                      <div style={{ fontSize: 13, color: 'var(--text-sec)' }}>{onboardForm.notes}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Domain access summary */}
              <div style={{ padding: 14, background: '#ecfdf5', borderRadius: 10, border: '1px solid #a7f3d0' }}>
                <div style={{ fontSize: 13, color: '#065f46', lineHeight: 1.5 }}>
                  <strong>Access rule:</strong> Only users with an <code style={{ fontWeight: 700, background: '#d1fae5', padding: '1px 4px', borderRadius: 3 }}>@{onboardForm.domain}</code> email
                  can enter {onboardForm.companyName || 'this company'}&rsquo;s portal. Their domain email automatically routes them to {onboardForm.companyName || 'their company'}&rsquo;s Feelya environment,
                  ensuring they are never placed in another company&rsquo;s portal.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <button className="btn btn--ghost btn--md" onClick={() => setOnboardStep(2)}>Back</button>
                <button className="btn btn--primary btn--md" disabled={!step3Valid} onClick={() => setShowConfirm(true)}>
                  Onboard Company
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <button className="modal__close" onClick={() => setShowConfirm(false)}>&times;</button>
            <h3 className="modal__title">Confirm Onboarding</h3>
            <p style={{ fontSize: 14, color: 'var(--text-sec)', margin: '12px 0 20px', lineHeight: 1.6 }}>
              You are about to onboard <strong>{onboardForm.companyName}</strong> on the <strong>{onboardForm.package}</strong> package
              with <strong>{onboardForm.employees}</strong> employees.
              Access will be restricted to <code>@{onboardForm.domain}</code> email addresses.
              The coupon code <code style={{ fontWeight: 700 }}>{onboardForm.couponCode}</code> will be activated immediately.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn--ghost btn--md btn--full" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="btn btn--primary btn--md btn--full" onClick={handleSubmitOnboard}>Confirm &amp; Onboard</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
