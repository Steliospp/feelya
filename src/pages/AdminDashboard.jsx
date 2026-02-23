import { Link } from 'react-router-dom';
import { getWorkshops } from '../lib/workshopStore';
import '../styles/app.css';

const LEADS_KEY = 'feelya_demo_leads';

function loadLeads() {
  try {
    return JSON.parse(localStorage.getItem(LEADS_KEY)) || [];
  } catch { return []; }
}

const stats = {
  totalOrgs: 523,
  totalEmployees: 47820,
  totalSessions: 18453,
  activeTherapists: 312,
  pendingTherapists: 14,
  mrr: '£214,700',
  sessionsToday: 87,
  sessionsThisWeek: 412,
  activeCoupons: 48,
  totalRevenue: '£1,842,600',
};

const recentSessions = [
  { id: 1, client: 'A. Taylor', therapist: 'Dr. Sarah Mitchell', company: 'Acme Corp', time: '10:00 AM', status: 'in-progress' },
  { id: 2, client: 'M. Johnson', therapist: 'James Thompson', company: 'TechFlow Ltd', time: '10:30 AM', status: 'upcoming' },
  { id: 3, client: 'R. Patel', therapist: 'Dr. Priya Sharma', company: 'Acme Corp', time: '11:00 AM', status: 'upcoming' },
  { id: 4, client: 'J. Brown', therapist: 'Emma Richardson', company: 'Nova Health', time: '9:00 AM', status: 'completed' },
  { id: 5, client: 'S. Williams', therapist: 'Dr. Michael Chen', company: 'GreenLeaf', time: '9:30 AM', status: 'completed' },
];

const pendingApprovals = [
  { id: 101, name: 'Dr. Olivia Grant', title: 'Clinical Psychologist', accreditation: 'HCPC', applied: '2026-02-20' },
  { id: 102, name: 'Tom Reynolds', title: 'Counsellor', accreditation: 'BACP', applied: '2026-02-19' },
  { id: 103, name: 'Dr. Fatima Al-Rashid', title: 'Psychotherapist', accreditation: 'UKCP', applied: '2026-02-18' },
];

const statusTag = {
  'in-progress': { cls: 'tag--warning', label: 'In Progress' },
  'upcoming': { cls: 'tag--success', label: 'Upcoming' },
  'completed': { cls: '', label: 'Completed' },
};

export default function AdminDashboard() {
  const leads = loadLeads();
  const newLeads = leads.filter((l) => l.status === 'new').length;
  const pendingWorkshops = getWorkshops().filter(w => w.status === 'pending_review').length;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-header__title">Super Admin</h1>
        <p className="page-header__subtitle">Feelya Platform Overview</p>
      </div>

      {/* Key Metrics */}
      <div className="dash-grid">
        <div className="dash-card">
          <div className="dash-card__label">Total Organisations</div>
          <div className="dash-card__value">{stats.totalOrgs}</div>
        </div>
        <div className="dash-card">
          <div className="dash-card__label">Total Employees</div>
          <div className="dash-card__value">{stats.totalEmployees.toLocaleString()}</div>
        </div>
        <div className="dash-card">
          <div className="dash-card__label">Total Sessions</div>
          <div className="dash-card__value">{stats.totalSessions.toLocaleString()}</div>
        </div>
        <div className="dash-card">
          <div className="dash-card__label">Active Therapists</div>
          <div className="dash-card__value">{stats.activeTherapists}</div>
          {stats.pendingTherapists > 0 && (
            <div className="dash-card__sub" style={{ color: '#f59e0b' }}>
              {stats.pendingTherapists} pending approval
            </div>
          )}
        </div>
      </div>

      {/* Revenue & Activity */}
      <div className="dash-grid" style={{ marginTop: 16 }}>
        <div className="dash-card">
          <div className="dash-card__label">Monthly Revenue</div>
          <div className="dash-card__value" style={{ color: '#10b981' }}>{stats.mrr}</div>
        </div>
        <div className="dash-card">
          <div className="dash-card__label">Sessions Today</div>
          <div className="dash-card__value">{stats.sessionsToday}</div>
        </div>
        <div className="dash-card">
          <div className="dash-card__label">Sessions This Week</div>
          <div className="dash-card__value">{stats.sessionsThisWeek}</div>
        </div>
        <div className="dash-card">
          <div className="dash-card__label">Active Coupons</div>
          <div className="dash-card__value">{stats.activeCoupons}</div>
        </div>
      </div>

      {/* Quick Links Row */}
      <div className="dash-grid" style={{ marginTop: 16 }}>
        <div className="dash-card">
          <div className="dash-card__label">Demo Leads</div>
          <div className="dash-card__value">{leads.length}</div>
          {newLeads > 0 && <div className="dash-card__sub" style={{ color: '#f59e0b' }}>{newLeads} new</div>}
          <Link to="/admin/demos" className="btn btn--outline btn--sm" style={{ marginTop: 12 }}>View Leads</Link>
        </div>
        <div className="dash-card">
          <div className="dash-card__label">Workshop Reviews</div>
          <div className="dash-card__value" style={{ color: pendingWorkshops > 0 ? '#f59e0b' : 'var(--text)' }}>{pendingWorkshops}</div>
          {pendingWorkshops > 0 && <div className="dash-card__sub" style={{ color: '#f59e0b' }}>pending review</div>}
          <Link to="/admin/workshops" className="btn btn--outline btn--sm" style={{ marginTop: 12 }}>Review</Link>
        </div>
        <div className="dash-card">
          <div className="dash-card__label">Total Revenue</div>
          <div className="dash-card__value" style={{ color: '#10b981' }}>{stats.totalRevenue}</div>
          <Link to="/admin/companies" className="btn btn--outline btn--sm" style={{ marginTop: 12 }}>View Companies</Link>
        </div>
      </div>

      {/* Today's Sessions */}
      <div className="card card--no-hover" style={{ marginTop: 24, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div className="card__title" style={{ margin: 0 }}>Today's Sessions</div>
          <Link to="/admin/sessions" className="btn btn--outline btn--xs">View All</Link>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
              <th style={{ padding: '10px 12px', color: 'var(--text-sec)', fontWeight: 600 }}>Client</th>
              <th style={{ padding: '10px 12px', color: 'var(--text-sec)', fontWeight: 600 }}>Therapist</th>
              <th style={{ padding: '10px 12px', color: 'var(--text-sec)', fontWeight: 600 }}>Company</th>
              <th style={{ padding: '10px 12px', color: 'var(--text-sec)', fontWeight: 600 }}>Time</th>
              <th style={{ padding: '10px 12px', color: 'var(--text-sec)', fontWeight: 600 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentSessions.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '12px' }}>{s.client}</td>
                <td style={{ padding: '12px', color: 'var(--primary)', fontWeight: 500 }}>{s.therapist}</td>
                <td style={{ padding: '12px', color: 'var(--text-sec)' }}>{s.company}</td>
                <td style={{ padding: '12px' }}>{s.time}</td>
                <td style={{ padding: '12px' }}>
                  <span className={`tag ${statusTag[s.status]?.cls || ''}`}>{statusTag[s.status]?.label || s.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pending Therapist Approvals */}
      <div className="card card--no-hover" style={{ marginTop: 24, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div className="card__title" style={{ margin: 0 }}>Pending Therapist Approvals</div>
          <Link to="/admin/therapists" className="btn btn--outline btn--xs">Manage All</Link>
        </div>
        {pendingApprovals.map(t => (
          <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-light)' }}>
            <div>
              <div style={{ fontWeight: 600 }}>{t.name}</div>
              <div style={{ fontSize: 13, color: 'var(--text-sec)' }}>{t.title} &middot; {t.accreditation} &middot; Applied {t.applied}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span className="tag tag--warning">Pending</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
