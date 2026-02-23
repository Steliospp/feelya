import { Link } from 'react-router-dom';
import { getWorkshops } from '../lib/workshopStore';
import '../styles/app.css';

const LEADS_KEY = 'feelya_demo_leads';

function loadLeads() {
  try {
    return JSON.parse(localStorage.getItem(LEADS_KEY)) || [];
  } catch { return []; }
}

const mockPlatformStats = {
  totalOrgs: 523,
  totalEmployees: 47820,
  totalSessions: 18453,
  activeTherapists: 312,
  mrr: '£214,700',
};

export default function AdminDashboard() {
  const leads = loadLeads();
  const newLeads = leads.filter((l) => l.status === 'new').length;
  const pendingWorkshops = getWorkshops().filter(w => w.status === 'pending_review').length;

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Super Admin</h1>
        <p className="page__subtitle">Feelya Platform Overview</p>
      </div>

      <div className="dash-grid">
        <div className="dash-card">
          <div className="dash-card__label">Total Organisations</div>
          <div className="dash-card__value">{mockPlatformStats.totalOrgs}</div>
        </div>
        <div className="dash-card">
          <div className="dash-card__label">Total Employees</div>
          <div className="dash-card__value">{mockPlatformStats.totalEmployees.toLocaleString()}</div>
        </div>
        <div className="dash-card">
          <div className="dash-card__label">Total Sessions</div>
          <div className="dash-card__value">{mockPlatformStats.totalSessions.toLocaleString()}</div>
        </div>
        <div className="dash-card">
          <div className="dash-card__label">Active Therapists</div>
          <div className="dash-card__value">{mockPlatformStats.activeTherapists}</div>
        </div>
      </div>

      <div className="dash-grid" style={{ marginTop: 24 }}>
        <div className="dash-card">
          <div className="dash-card__label">Monthly Recurring Revenue</div>
          <div className="dash-card__value" style={{ color: '#10b981' }}>{mockPlatformStats.mrr}</div>
        </div>
        <div className="dash-card">
          <div className="dash-card__label">Demo Leads</div>
          <div className="dash-card__value">{leads.length}</div>
          {newLeads > 0 && (
            <div className="dash-card__sub" style={{ color: '#f59e0b' }}>
              {newLeads} new
            </div>
          )}
          <Link to="/admin/demos" className="btn btn--outline btn--sm" style={{ marginTop: 12 }}>
            View All Leads
          </Link>
        </div>
        <div className="dash-card">
          <div className="dash-card__label">Workshop Reviews</div>
          <div className="dash-card__value" style={{ color: pendingWorkshops > 0 ? '#f59e0b' : 'var(--text)' }}>
            {pendingWorkshops}
          </div>
          {pendingWorkshops > 0 && (
            <div className="dash-card__sub" style={{ color: '#f59e0b' }}>pending review</div>
          )}
          <Link to="/admin/workshops" className="btn btn--outline btn--sm" style={{ marginTop: 12 }}>
            Review Workshops
          </Link>
        </div>
      </div>
    </div>
  );
}
