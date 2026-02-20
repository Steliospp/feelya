import { useAuth } from '../context/AuthContext';
import '../styles/app.css';

const mockStats = {
  totalEmployees: 247,
  activeThisMonth: 189,
  sessionsBooked: 342,
  avgWellbeing: 78,
  engagementRate: 89,
  topSpecialities: ['Anxiety', 'Stress', 'Burnout', 'Relationships'],
};

export default function HRDashboard() {
  const { user } = useAuth();

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">HR Dashboard</h1>
        <p className="page__subtitle">{user.companyName} — Organisation Overview</p>
      </div>

      <div className="dash-grid">
        <div className="dash-card">
          <div className="dash-card__label">Total Employees</div>
          <div className="dash-card__value">{mockStats.totalEmployees}</div>
        </div>
        <div className="dash-card">
          <div className="dash-card__label">Active This Month</div>
          <div className="dash-card__value">{mockStats.activeThisMonth}</div>
          <div className="dash-card__sub" style={{ color: '#10b981' }}>
            {Math.round((mockStats.activeThisMonth / mockStats.totalEmployees) * 100)}% participation
          </div>
        </div>
        <div className="dash-card">
          <div className="dash-card__label">Sessions Booked</div>
          <div className="dash-card__value">{mockStats.sessionsBooked}</div>
        </div>
        <div className="dash-card">
          <div className="dash-card__label">Engagement Rate</div>
          <div className="dash-card__value">{mockStats.engagementRate}%</div>
        </div>
      </div>

      <div className="dash-grid" style={{ marginTop: 24 }}>
        <div className="dash-card" style={{ gridColumn: '1 / -1' }}>
          <div className="dash-card__label">Average Wellbeing Score</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 }}>
            <div style={{ flex: 1, height: 12, background: '#e2e8f0', borderRadius: 6, overflow: 'hidden' }}>
              <div style={{ width: `${mockStats.avgWellbeing}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: 6 }}></div>
            </div>
            <span style={{ fontWeight: 700, fontSize: 18, color: '#1e1b4b' }}>{mockStats.avgWellbeing}/100</span>
          </div>
        </div>
      </div>

      <div className="dash-grid" style={{ marginTop: 24 }}>
        <div className="dash-card" style={{ gridColumn: '1 / -1' }}>
          <div className="dash-card__label">Top Specialities Used</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            {mockStats.topSpecialities.map((s) => (
              <span key={s} className="tag">{s}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 32, padding: 24, background: '#eef2ff', borderRadius: 12, border: '1px solid #e0e7ff' }}>
        <div style={{ fontWeight: 600, color: '#1e1b4b', marginBottom: 4 }}>Privacy Notice</div>
        <div style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
          All data shown is aggregated and anonymised. You cannot view individual employee usage, session details, or therapist assignments. This protects employee trust and complies with GDPR.
        </div>
      </div>
    </div>
  );
}
