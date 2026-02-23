import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

const mockWorkshops = [
  { id: 1, title: 'Managing Stress at Work', date: 'Tue 25 Feb', time: '12:00 PM', spots: 8, category: 'Stress' },
  { id: 2, title: 'Building Resilience', date: 'Thu 27 Feb', time: '1:00 PM', spots: 12, category: 'Wellbeing' },
];

const mockResources = [
  { id: 1, title: 'Dealing with Burnout at Work', cat: 'Workplace', readTime: '5 min read' },
  { id: 2, title: 'Managing Anxiety: Practical Tips', cat: 'Self-Help', readTime: '4 min read' },
  { id: 3, title: 'Mindfulness for Beginners', cat: 'Wellbeing', readTime: '6 min read' },
];

const mockDashboard = {
  upcomingSessions: 2,
  completedSessions: 8,
  nextSession: {
    id: 1,
    therapist_name: 'Dr. Sarah Mitchell',
    therapist_title: 'Clinical Psychologist',
    date: 'Mon 24 Feb',
    time: '10:00 AM',
    duration: 50,
    session_format: 'video',
    price: 85,
  },
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const data = mockDashboard;
  const greeting = getGreeting();

  return (
    <>
      <div className="page-header">
        <div className="page-header__greeting">{greeting}</div>
        <h1 className="page-header__title">Welcome back, {user?.first_name}</h1>
        <p className="page-header__subtitle">Your personal wellbeing hub</p>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="quick-action" onClick={() => navigate('/app/therapists')}>
          <div className="quick-action__icon" style={{ background: 'var(--primary-50)', color: 'var(--primary)' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M17 17v-1a4 4 0 00-3-3.87M13 3.13a4 4 0 010 7.75M9 9a4 4 0 100-8 4 4 0 000 8zm0 2c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          Book a Session
        </button>
        <button className="quick-action" onClick={() => navigate('/app/workshops')}>
          <div className="quick-action__icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M14 17v-1a3 3 0 00-3-3H6a3 3 0 00-3 3v1m15-1v-1a3 3 0 00-2.25-2.9M11.5 3.1a3 3 0 010 5.8M8.5 9a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          Browse Workshops
        </button>
        <button className="quick-action" onClick={() => navigate('/app/resources')}>
          <div className="quick-action__icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4h5l2 2h5a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          View Resources
        </button>
        <button className="quick-action" onClick={() => navigate('/app/sessions')}>
          <div className="quick-action__icon" style={{ background: '#ede9fe', color: '#8b5cf6' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M13 2v4M7 2v4M3 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
          My Sessions
        </button>
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
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--info">
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10 6v4l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div className="stat-card__value">{(data.completedSessions || 0) + (data.upcomingSessions || 0)}</div>
            <div className="stat-card__label">Total Sessions</div>
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
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), var(--violet))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 12c2.5 0 4.5-2 4.5-4.5S14.5 3 12 3 7.5 5 7.5 7.5 9.5 12 12 12zm0 2c-3 0-9 1.5-9 4.5V21h18v-2.5c0-3-6-4.5-9-4.5z" fill="white" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{data.nextSession.therapist_name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-sec)', marginTop: 2 }}>
                    {data.nextSession.therapist_title}
                  </div>
                </div>
              </div>
              <div style={{
                display: 'flex', gap: 12, padding: '14px 16px',
                background: 'var(--bg)', borderRadius: 'var(--radius)', marginBottom: 16,
              }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Date</div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginTop: 4 }}>{data.nextSession.date}</div>
                </div>
                <div style={{ width: 1, background: 'var(--border)' }} />
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Time</div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginTop: 4 }}>{data.nextSession.time}</div>
                </div>
                <div style={{ width: 1, background: 'var(--border)' }} />
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Format</div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginTop: 4, textTransform: 'capitalize' }}>{data.nextSession.session_format}</div>
                </div>
                <div style={{ width: 1, background: 'var(--border)' }} />
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Duration</div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginTop: 4 }}>{data.nextSession.duration}min</div>
                </div>
              </div>
              <Link to="/app/sessions" className="btn btn--outline btn--xs">View All Sessions</Link>
            </>
          ) : (
            <div className="empty-state" style={{ padding: '30px 10px' }}>
              <p className="empty-state__desc">No upcoming sessions scheduled.</p>
              <button className="btn btn--primary btn--sm" onClick={() => navigate('/app/therapists')}>
                Book a Session
              </button>
            </div>
          )}
        </div>

        <div className="self-test-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3>Book a Session</h3>
          <p>Browse your company&rsquo;s approved therapists and schedule a confidential session.</p>
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
              padding: '14px 16px',
              background: 'var(--bg)',
              borderRadius: 'var(--radius)',
              marginBottom: 8,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'var(--primary-50)', color: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M14 17v-1a3 3 0 00-3-3H6a3 3 0 00-3 3v1m15-1v-1a3 3 0 00-2.25-2.9M11.5 3.1a3 3 0 010 5.8M8.5 9a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{w.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-sec)', marginTop: 2 }}>{w.date} at {w.time}</div>
                </div>
              </div>
              <span className="tag">{w.spots} spots</span>
            </div>
          ))}
          <Link to="/app/workshops" className="btn btn--outline btn--xs" style={{ marginTop: 8 }}>Browse Workshops</Link>
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
              padding: '14px 16px',
              background: 'var(--bg)',
              borderRadius: 'var(--radius)',
              marginBottom: 8,
              cursor: 'pointer',
            }} onClick={() => navigate('/app/resources')}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'var(--success-bg)', color: 'var(--success)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 8h8M8 12h8M8 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{r.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{r.cat} &middot; {r.readTime}</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
