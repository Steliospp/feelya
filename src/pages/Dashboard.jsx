import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function timeAgo(dateStr) {
  const now = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default function Dashboard() {
  const { user } = useAuth();
  const { loadNotifCount } = useOutletContext() || {};
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/dashboard');
        const json = await res.json();
        setData(json);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
    if (loadNotifCount) loadNotifCount();
  }, [loadNotifCount]);

  if (loading) {
    return <div className="page-loading">Loading...</div>;
  }

  if (error || !data) {
    return <p>Error loading dashboard.</p>;
  }

  const greeting = getGreeting();
  const isAdmin = user?.role === 'admin';

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__greeting">{greeting}</div>
        <h1 className="page-header__title">Welcome back, {user?.first_name}</h1>
        {user?.org_name && (
          <p className="page-header__subtitle">
            {user.org_name}{isAdmin ? ' \u00B7 Admin' : ''}
          </p>
        )}
      </div>

      {/* Admin Card */}
      {isAdmin && (
        <div style={{ marginBottom: 24 }}>
          <div
            className="card"
            style={{
              background: 'linear-gradient(135deg, var(--primary-50), #ede9fe)',
              borderColor: 'var(--primary-100)',
              cursor: 'pointer',
            }}
            onClick={() => navigate('org')}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Organisation Dashboard</div>
                <div style={{ fontSize: 14, color: 'var(--text-sec)' }}>
                  View team analytics, engagement metrics, and wellbeing trends
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--primary">
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="4" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M13 2v4M7 2v4M3 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div className="stat-card__value">{data.upcomingSessions}</div>
            <div className="stat-card__label">Upcoming Sessions</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--success">
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
              <path d="M6.5 10l2.5 2.5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
          <div>
            <div className="stat-card__value">{data.completedSessions}</div>
            <div className="stat-card__label">Completed Sessions</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--warning">
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
              <path d="M10 2a6 6 0 00-6 6v3l-1.5 2.5h15L16 11V8a6 6 0 00-6-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 15.5a2.5 2.5 0 005 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div className="stat-card__value">{data.unreadNotifications}</div>
            <div className="stat-card__label">Unread Notifications</div>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="dash-grid">
        {/* Next Session Card */}
        <div className="card">
          <div className="card__title">
            Next Session
            {data.nextSession && <span className="tag tag--success">Confirmed</span>}
          </div>
          {data.nextSession ? (
            <div className="session-item" style={{ border: 'none', padding: 0 }}>
              <div className="session-item__left">
                <div className="session-item__avatar">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 12c2.5 0 4.5-2 4.5-4.5S14.5 3 12 3 7.5 5 7.5 7.5 9.5 12 12 12zm0 2c-3 0-9 1.5-9 4.5V21h18v-2.5c0-3-6-4.5-9-4.5z" fill="white" />
                  </svg>
                </div>
                <div>
                  <div className="session-item__name">{data.nextSession.therapist_name}</div>
                  <div className="session-item__detail">
                    {data.nextSession.therapist_title} &middot; {data.nextSession.session_format} session
                  </div>
                </div>
              </div>
              <div className="session-item__right">
                <div className="session-item__date">
                  <div className="session-item__date-day">{data.nextSession.date}</div>
                  <div className="session-item__date-time">
                    {data.nextSession.time} &middot; {data.nextSession.duration}min
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '30px 10px' }}>
              <p className="empty-state__desc">No upcoming sessions. Find a therapist to get started.</p>
              <button className="btn btn--primary btn--sm" onClick={() => navigate('/app/therapists')}>
                Find a Therapist
              </button>
            </div>
          )}
        </div>

        {/* Recent Notifications Card */}
        <div className="card">
          <div className="card__title">
            Recent Notifications
            <Link to="/app/notifications" style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 500 }}>
              View All
            </Link>
          </div>
          {data.recentNotifications && data.recentNotifications.length > 0 ? (
            data.recentNotifications.slice(0, 4).map((n) => (
              <div
                key={n.id || n.created_at}
                className={`notif-item ${n.read ? '' : 'unread'}`}
                style={{
                  marginBottom: 6,
                  border: 'none',
                  background: n.read ? 'var(--bg)' : 'var(--primary-50)',
                }}
              >
                <div
                  className={`notif-item__icon notif-item__icon--${
                    n.type === 'success' ? 'success' : n.type === 'warning' ? 'warning' : 'info'
                  }`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 8l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="notif-item__content">
                  <div className="notif-item__title">{n.title}</div>
                  <div className="notif-item__time">{timeAgo(n.created_at)}</div>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No notifications yet.</p>
          )}
        </div>
      </div>

      {/* Self-Test CTA */}
      <div style={{ marginTop: 24 }}>
        <div className="self-test-card">
          <h3>How are you feeling?</h3>
          <p>Take our free, confidential 5-minute mood assessment to better understand your emotional wellbeing.</p>
          <button className="btn btn--white btn--md" onClick={() => navigate('/app/self-test')}>
            Take the Self-Test
          </button>
        </div>
      </div>
    </>
  );
}
