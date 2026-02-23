import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getWorkshops } from '../lib/workshopStore';
import '../styles/app.css';

const mockStats = {
  upcomingSessions: 8,
  completedToday: 3,
  totalClients: 47,
  rating: 4.9,
  reviewCount: 127,
  earnings: {
    thisWeek: 720,
    thisMonth: 3240,
  },
};

const mockUpcoming = [
  { id: 1, clientInitial: 'A', clientName: 'A. Taylor', date: 'Today', time: '6:00 PM', format: 'Video', type: 'Standard', duration: 50 },
  { id: 2, clientInitial: 'M', clientName: 'M. Johnson', date: 'Today', time: '7:00 PM', format: 'Audio', type: 'Standard', duration: 50 },
  { id: 3, clientInitial: 'R', clientName: 'R. Patel', date: 'Tomorrow', time: '10:00 AM', format: 'Video', type: 'Intro', duration: 30 },
  { id: 4, clientInitial: 'S', clientName: 'S. Williams', date: 'Tomorrow', time: '2:00 PM', format: 'Video', type: 'Standard', duration: 50 },
];

export default function TherapistDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const availableWorkshops = getWorkshops().filter(w => w.status === 'published').length;

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header__greeting">Welcome back,</div>
        <h1 className="page-header__title">Dr. {user.first_name} {user.last_name}</h1>
        <p className="page-header__subtitle">Here's your practice overview</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--primary">
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M16 2H4a1 1 0 00-1 1v14a1 1 0 001 1h12a1 1 0 001-1V3a1 1 0 00-1-1zM7 2v16M3 7h14M3 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <div className="stat-card__value">{mockStats.upcomingSessions}</div>
            <div className="stat-card__label">Upcoming Sessions</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--success">
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M16 6l-8 8-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <div className="stat-card__value">{mockStats.completedToday}</div>
            <div className="stat-card__label">Completed Today</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--info">
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M14 17v-1a3 3 0 00-3-3H6a3 3 0 00-3 3v1m15-1v-1a3 3 0 00-2.25-2.9M11.5 3.1a3 3 0 010 5.8M8.5 9a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <div className="stat-card__value">{mockStats.totalClients}</div>
            <div className="stat-card__label">Total Clients</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--warning">
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M10 2l2.09 6.26H18l-5 3.64L14.18 18 10 14.27 5.82 18 7 11.9l-5-3.64h5.91L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <div className="stat-card__value">{mockStats.rating}</div>
            <div className="stat-card__label">{mockStats.reviewCount} Reviews</div>
          </div>
        </div>
      </div>

      <div className="dash-grid">
        <div className="card card--no-hover">
          <div className="card__title">
            Upcoming Sessions
            <Link to="/therapist/sessions" className="btn btn--outline btn--xs">View All</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {mockUpcoming.map((s) => (
              <div key={s.id} className="session-item" style={{ marginBottom: 0 }}>
                <div className="session-item__left">
                  <div className="session-item__avatar">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 12a4 4 0 100-8 4 4 0 000 8zm0 0c-4 0-7 2-7 4.5V18h14v-1.5c0-2.5-3-4.5-7-4.5z" stroke="#fff" strokeWidth="1.5"/></svg>
                  </div>
                  <div>
                    <div className="session-item__name" style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={() => navigate(`/therapist/client/${encodeURIComponent(s.clientName)}`)}>{s.clientName}</div>
                    <div className="session-item__detail">{s.format} · {s.type} · {s.duration}min</div>
                  </div>
                </div>
                <div className="session-item__right">
                  <div className="session-item__date">
                    <div className="session-item__date-day">{s.date}</div>
                    <div className="session-item__date-time">{s.time}</div>
                  </div>
                  <span className="tag tag--success">Confirmed</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="card card--no-hover">
            <div className="card__title">Earnings</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, color: 'var(--text-sec)' }}>This Week</span>
                <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--success)' }}>
                  £{mockStats.earnings.thisWeek}
                </span>
              </div>
              <div style={{ height: 1, background: 'var(--border-light)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, color: 'var(--text-sec)' }}>This Month</span>
                <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>
                  £{mockStats.earnings.thisMonth.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="card card--no-hover">
            <div className="card__title">Quick Actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/therapist/sessions" className="btn btn--primary btn--md btn--full">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M16 2H4a1 1 0 00-1 1v14a1 1 0 001 1h12a1 1 0 001-1V3a1 1 0 00-1-1zM7 2v16M3 7h14M3 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                View Sessions
              </Link>
              <Link to="/therapist/workshops" className="btn btn--outline btn--md btn--full">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M14 17v-1a3 3 0 00-3-3H6a3 3 0 00-3 3v1m15-1v-1a3 3 0 00-2.25-2.9M11.5 3.1a3 3 0 010 5.8M8.5 9a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Workshops {availableWorkshops > 0 && `(${availableWorkshops} available)`}
              </Link>
              <Link to="/therapist/profile" className="btn btn--outline btn--md btn--full">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M10 13a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.5"/></svg>
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
