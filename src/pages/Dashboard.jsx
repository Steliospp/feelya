import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

const mockWorkshops = [
  { id: 1, title: 'Managing Stress at Work', date: 'Tue 25 Feb', time: '12:00 PM', spots: 8 },
  { id: 2, title: 'Building Resilience', date: 'Thu 27 Feb', time: '1:00 PM', spots: 12 },
];

const mockResources = [
  { id: 1, title: 'Dealing with Burnout at Work', cat: 'Workplace' },
  { id: 2, title: 'Managing Anxiety: Practical Tips', cat: 'Self-Help' },
  { id: 3, title: 'Mindfulness for Beginners', cat: 'Wellbeing' },
];

export default function Dashboard() {
  const { user } = useAuth();
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
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>Loading...</div>;
  }

  if (error || !data) {
    return <p>Error loading dashboard.</p>;
  }

  const greeting = getGreeting();

  return (
    <>
      <div className="page-header">
        <div className="page-header__greeting">{greeting}</div>
        <h1 className="page-header__title">Welcome back, {user?.first_name}</h1>
        <p className="page-header__subtitle">Your personal wellbeing hub</p>
      </div>

      {/* Personal Stats */}
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
              <path d="M14 17v-1a3 3 0 00-3-3H6a3 3 0 00-3 3v1m15-1v-1a3 3 0 00-2.25-2.9M11.5 3.1a3 3 0 010 5.8M8.5 9a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className="stat-card__value">{mockWorkshops.length}</div>
            <div className="stat-card__label">Upcoming Workshops</div>
          </div>
        </div>
      </div>

      {/* Top Row: Next Session + Book Session CTA */}
      <div className="dash-grid">
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
              <p className="empty-state__desc">No upcoming sessions scheduled.</p>
              <button className="btn btn--primary btn--sm" onClick={() => navigate('/app/therapists')}>
                Book a Session
              </button>
            </div>
          )}
          {data.nextSession && (
            <div style={{ marginTop: 16 }}>
              <Link to="/app/sessions" className="btn btn--outline btn--xs">View All Sessions</Link>
            </div>
          )}
        </div>

        <div className="self-test-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3>Book a Session</h3>
          <p>Browse your company's approved therapists and schedule a confidential session.</p>
          <button className="btn btn--white btn--md" onClick={() => navigate('/app/therapists')}>
            Find a Therapist
          </button>
        </div>
      </div>

      {/* Bottom Row: Workshops Preview + Resources Preview */}
      <div className="dash-grid" style={{ marginTop: 24 }}>
        <div className="card">
          <div className="card__title">
            Upcoming Workshops
            <Link to="/app/workshops" style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 500 }}>
              View All
            </Link>
          </div>
          {mockWorkshops.map((w) => (
            <div key={w.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              background: 'var(--bg)',
              borderRadius: 'var(--radius)',
              marginBottom: 8,
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{w.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-sec)', marginTop: 2 }}>{w.date} at {w.time}</div>
              </div>
              <span className="tag">{w.spots} spots</span>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card__title">
            Resources
            <Link to="/app/resources" style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 500 }}>
              View All
            </Link>
          </div>
          {mockResources.map((r) => (
            <div key={r.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              background: 'var(--bg)',
              borderRadius: 'var(--radius)',
              marginBottom: 8,
              cursor: 'pointer',
            }} onClick={() => navigate('/app/resources')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="3" stroke="var(--primary)" strokeWidth="1.5" />
                <path d="M8 8h8M8 12h8M8 16h4" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <div>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{r.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.cat}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
