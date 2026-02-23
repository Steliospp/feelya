import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/app.css';

const mockStats = {
  totalEmployees: 247,
  activeThisMonth: 189,
  sessionsBooked: 342,
  avgWellbeing: 78,
  engagementRate: 89,
  workshopsThisMonth: 4,
  workshopAttendance: 156,
  pendingRequests: 3,
  topSpecialities: ['Anxiety', 'Stress', 'Burnout', 'Relationships', 'Depression'],
  monthlyTrend: [
    { month: 'Sep', sessions: 210, engagement: 72 },
    { month: 'Oct', sessions: 248, engagement: 76 },
    { month: 'Nov', sessions: 276, engagement: 79 },
    { month: 'Dec', sessions: 258, engagement: 77 },
    { month: 'Jan', sessions: 310, engagement: 84 },
    { month: 'Feb', sessions: 342, engagement: 89 },
  ],
};

export default function HRDashboard() {
  const { user } = useAuth();
  const maxSessions = Math.max(...mockStats.monthlyTrend.map(m => m.sessions));

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-header__title">HR Dashboard</h1>
        <p className="page-header__subtitle">{user.companyName} — Organisation Wellbeing Overview</p>
      </div>

      {/* KPI Stats */}
      <div className="org-stats-grid">
        <div className="org-stat">
          <div className="org-stat__label">Total Employees</div>
          <div className="org-stat__value">{mockStats.totalEmployees}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Active This Month</div>
          <div className="org-stat__value">{mockStats.activeThisMonth}</div>
          <div className="org-stat__change org-stat__change--up">
            {Math.round((mockStats.activeThisMonth / mockStats.totalEmployees) * 100)}% participation
          </div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Sessions Booked</div>
          <div className="org-stat__value">{mockStats.sessionsBooked}</div>
          <div className="org-stat__change org-stat__change--up">+12% vs last month</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Avg Wellbeing Score</div>
          <div className="org-stat__value">{mockStats.avgWellbeing}/100</div>
          <div className="org-stat__change org-stat__change--up">+3 vs last month</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="org-charts">
        <div className="org-chart-card">
          <div className="org-chart-card__title">Sessions Trend (6 months)</div>
          <div className="org-bar-chart">
            {mockStats.monthlyTrend.map(m => (
              <div className="org-bar" key={m.month}>
                <div className="org-bar__label">{m.month}</div>
                <div className="org-bar__track">
                  <div className="org-bar__fill" style={{ width: `${(m.sessions / maxSessions) * 100}%` }} />
                </div>
                <div className="org-bar__value">{m.sessions}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="org-chart-card">
          <div className="org-chart-card__title">Wellbeing Score</div>
          <div className="org-wellbeing-ring">
            <div className="org-wellbeing-ring__circle" style={{ borderColor: 'var(--primary-100)' }}>
              <div className="org-wellbeing-ring__value">{mockStats.avgWellbeing}</div>
            </div>
            <div className="org-wellbeing-ring__label">Average out of 100</div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <div style={{ fontSize: 13, color: 'var(--text-sec)' }}>Top Specialities Used</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              {mockStats.topSpecialities.map(s => (
                <span key={s} className="tag">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dash-grid" style={{ marginTop: 24 }}>
        <div className="card card--no-hover">
          <div className="card__title">Workshops This Month</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-serif)' }}>{mockStats.workshopsThisMonth}</div>
            <div>
              <div style={{ fontSize: 14, color: 'var(--text-sec)' }}>{mockStats.workshopAttendance} total registrations</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Avg. {Math.round(mockStats.workshopAttendance / mockStats.workshopsThisMonth)} per workshop</div>
            </div>
          </div>
          <Link to="/app/hr/workshops" className="btn btn--outline btn--sm">Manage Workshops</Link>
        </div>

        <div className="card card--no-hover">
          <div className="card__title">
            Employee Requests
            {mockStats.pendingRequests > 0 && (
              <span className="sidebar__badge">{mockStats.pendingRequests}</span>
            )}
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-sec)', marginBottom: 16, lineHeight: 1.6 }}>
            {mockStats.pendingRequests} pending topic suggestions from employees awaiting your review.
          </p>
          <Link to="/app/hr/requests" className="btn btn--outline btn--sm">Review Requests</Link>
        </div>
      </div>

      {/* Privacy Notice */}
      <div style={{ marginTop: 32, padding: 24, background: '#eef2ff', borderRadius: 12, border: '1px solid #e0e7ff' }}>
        <div style={{ fontWeight: 600, color: '#1e1b4b', marginBottom: 4 }}>Privacy Notice</div>
        <div style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
          All data shown is aggregated and anonymised. Individual employee session details, therapist choices, and personal wellbeing scores are never visible to HR. This ensures employee trust and GDPR compliance.
        </div>
      </div>
    </div>
  );
}
