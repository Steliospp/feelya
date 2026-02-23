import { useState } from 'react';
import { useToast } from '../components/Toast';
import '../styles/app.css';

const initialCoupons = [
  { id: 1, code: 'ACME-2026-Q1', company: 'Acme Corp', type: 'company', sessions: 5, used: 142, issued: 200, discount: 100, status: 'active', created: '2026-01-01', expires: '2026-03-31', amount_paid: 18000 },
  { id: 2, code: 'TECH-2026-Q1', company: 'TechFlow Ltd', type: 'company', sessions: 5, used: 68, issued: 100, discount: 100, status: 'active', created: '2026-01-15', expires: '2026-04-15', amount_paid: 9000 },
  { id: 3, code: 'NOVA-2026-Q1', company: 'Nova Health', type: 'company', sessions: 5, used: 35, issued: 50, discount: 100, status: 'active', created: '2026-02-01', expires: '2026-04-30', amount_paid: 4500 },
  { id: 4, code: 'GREEN-2026-Q1', company: 'GreenLeaf', type: 'company', sessions: 5, used: 22, issued: 40, discount: 100, status: 'active', created: '2026-02-01', expires: '2026-04-30', amount_paid: 3600 },
  { id: 5, code: 'BLUE-2026-Q1', company: 'BlueStar', type: 'company', sessions: 5, used: 45, issued: 60, discount: 100, status: 'active', created: '2026-01-20', expires: '2026-04-20', amount_paid: 5400 },
  { id: 6, code: 'WELCOME20', company: null, type: 'promo', sessions: null, used: 312, issued: null, discount: 20, status: 'active', created: '2026-01-01', expires: '2026-06-30', amount_paid: 0 },
  { id: 7, code: 'FIRST50', company: null, type: 'promo', sessions: 1, used: 89, issued: null, discount: 50, status: 'active', created: '2026-01-01', expires: '2026-12-31', amount_paid: 0 },
  { id: 8, code: 'ACME-2025-Q4', company: 'Acme Corp', type: 'company', sessions: 5, used: 200, issued: 200, discount: 100, status: 'expired', created: '2025-10-01', expires: '2025-12-31', amount_paid: 18000 },
];

const tabs = ['active', 'expired', 'all'];

export default function AdminCoupons() {
  const showToast = useToast();
  const [coupons, setCoupons] = useState(initialCoupons);
  const [activeTab, setActiveTab] = useState('active');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ code: '', company: '', type: 'company', sessions: 5, discount: 100, issued: '', expires: '', amount_paid: '' });

  const filtered = activeTab === 'all' ? coupons : coupons.filter(c => c.status === activeTab);

  const totalRevenue = coupons.filter(c => c.type === 'company').reduce((s, c) => s + c.amount_paid, 0);
  const totalIssued = coupons.filter(c => c.type === 'company' && c.issued).reduce((s, c) => s + c.issued, 0);
  const totalUsed = coupons.filter(c => c.type === 'company').reduce((s, c) => s + c.used, 0);

  function handleCreate() {
    if (!form.code.trim()) return;
    const newCoupon = {
      id: Date.now(),
      code: form.code.toUpperCase(),
      company: form.type === 'company' ? form.company : null,
      type: form.type,
      sessions: form.type === 'company' ? Number(form.sessions) || 5 : (form.sessions ? Number(form.sessions) : null),
      used: 0,
      issued: form.issued ? Number(form.issued) : null,
      discount: Number(form.discount) || 100,
      status: 'active',
      created: new Date().toISOString().split('T')[0],
      expires: form.expires || null,
      amount_paid: Number(form.amount_paid) || 0,
    };
    setCoupons(prev => [newCoupon, ...prev]);
    setShowCreate(false);
    setForm({ code: '', company: '', type: 'company', sessions: 5, discount: 100, issued: '', expires: '', amount_paid: '' });
    showToast('Coupon created');
  }

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="page-header__title">Coupons</h1>
          <p className="page-header__subtitle">Manage company session packs and promotional discount codes.</p>
        </div>
        <button className="btn btn--primary btn--sm" onClick={() => setShowCreate(true)}>Create Coupon</button>
      </div>

      {/* Explanation Card */}
      <div style={{ padding: 16, background: '#eef2ff', borderRadius: 10, border: '1px solid #e0e7ff', marginBottom: 24 }}>
        <div style={{ fontWeight: 600, color: '#1e1b4b', marginBottom: 4 }}>How Company Coupons Work</div>
        <div style={{ color: '#64748b', fontSize: 13, lineHeight: 1.7 }}>
          Companies pay upfront for session packs. Each employee receives <strong>5 sessions</strong> via a unique coupon code.
          The company coupon batch (e.g. ACME-2026-Q1) is generated, and individual codes are distributed to employees.
          Employees use their coupon to book sessions. You track usage vs issued and ensure companies have paid before activating.
        </div>
      </div>

      {/* Stats */}
      <div className="org-stats-grid" style={{ marginBottom: 24 }}>
        <div className="org-stat">
          <div className="org-stat__label">Active Coupons</div>
          <div className="org-stat__value">{coupons.filter(c => c.status === 'active').length}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Company Revenue</div>
          <div className="org-stat__value" style={{ color: 'var(--success)' }}>£{totalRevenue.toLocaleString()}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Total Codes Issued</div>
          <div className="org-stat__value">{totalIssued}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Codes Redeemed</div>
          <div className="org-stat__value">{totalUsed}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sessions-tabs" style={{ marginBottom: 16 }}>
        {tabs.map(tab => (
          <button key={tab} className={`sessions-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span style={{ marginLeft: 6, opacity: 0.7 }}>({tab === 'all' ? coupons.length : coupons.filter(c => c.status === tab).length})</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card card--no-hover">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Code</th>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Type</th>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Company</th>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Sessions/Person</th>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Usage</th>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Discount</th>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Company Paid</th>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Expires</th>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '12px' }}>
                  <code style={{ fontWeight: 700, fontSize: 13, background: 'var(--bg)', padding: '2px 8px', borderRadius: 4 }}>{c.code}</code>
                </td>
                <td style={{ padding: '12px' }}>
                  <span className={`tag ${c.type === 'company' ? 'tag--success' : ''}`}>
                    {c.type === 'company' ? 'Company Pack' : 'Promo'}
                  </span>
                </td>
                <td style={{ padding: '12px', color: 'var(--text-sec)' }}>{c.company || '—'}</td>
                <td style={{ padding: '12px', fontWeight: 600 }}>{c.sessions || 'Unlimited'}</td>
                <td style={{ padding: '12px' }}>
                  {c.issued ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 60, height: 6, background: 'var(--bg)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${(c.used / c.issued) * 100}%`, height: '100%', borderRadius: 3, background: c.used >= c.issued ? 'var(--danger)' : 'var(--primary)' }} />
                      </div>
                      <span style={{ fontSize: 13 }}>{c.used}/{c.issued}</span>
                    </div>
                  ) : (
                    <span style={{ fontSize: 13 }}>{c.used} used</span>
                  )}
                </td>
                <td style={{ padding: '12px', fontWeight: 600 }}>{c.discount}%</td>
                <td style={{ padding: '12px', fontWeight: 600, color: c.amount_paid > 0 ? 'var(--success)' : 'var(--text-muted)' }}>
                  {c.amount_paid > 0 ? `£${c.amount_paid.toLocaleString()}` : '—'}
                </td>
                <td style={{ padding: '12px', color: 'var(--text-sec)' }}>{c.expires || 'Never'}</td>
                <td style={{ padding: '12px' }}>
                  <span className={`tag ${c.status === 'active' ? 'tag--success' : 'tag--danger'}`}>
                    {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <button className="modal__close" onClick={() => setShowCreate(false)}>&times;</button>
            <h3 className="modal__title">Create Coupon</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
              <div>
                <label className="form-label">Coupon Type</label>
                <select className="form-input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  <option value="company">Company Pack (employees get 5 sessions)</option>
                  <option value="promo">Promo Code (% discount)</option>
                </select>
              </div>

              <div>
                <label className="form-label">Coupon Code</label>
                <input className="form-input" placeholder="e.g. ACME-2026-Q2" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} />
              </div>

              {form.type === 'company' && (
                <>
                  <div>
                    <label className="form-label">Company Name</label>
                    <input className="form-input" placeholder="e.g. Acme Corp" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
                  </div>
                  <div>
                    <label className="form-label">Sessions Per Employee</label>
                    <input className="form-input" type="number" min="1" value={form.sessions} onChange={e => setForm(f => ({ ...f, sessions: e.target.value }))} />
                  </div>
                  <div>
                    <label className="form-label">Number of Codes to Issue</label>
                    <input className="form-input" type="number" min="1" placeholder="e.g. 200" value={form.issued} onChange={e => setForm(f => ({ ...f, issued: e.target.value }))} />
                  </div>
                  <div>
                    <label className="form-label">Amount Paid Upfront (£)</label>
                    <input className="form-input" type="number" min="0" placeholder="e.g. 18000" value={form.amount_paid} onChange={e => setForm(f => ({ ...f, amount_paid: e.target.value }))} />
                  </div>
                </>
              )}

              <div>
                <label className="form-label">Discount %</label>
                <input className="form-input" type="number" min="1" max="100" value={form.discount} onChange={e => setForm(f => ({ ...f, discount: e.target.value }))} />
              </div>

              <div>
                <label className="form-label">Expiry Date</label>
                <input className="form-input" type="date" value={form.expires} onChange={e => setForm(f => ({ ...f, expires: e.target.value }))} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button className="btn btn--ghost btn--md btn--full" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="btn btn--primary btn--md btn--full" onClick={handleCreate}>Create Coupon</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
