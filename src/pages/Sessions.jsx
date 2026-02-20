import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useToast } from '../components/Toast';

export default function Sessions() {
  const navigate = useNavigate();
  const showToast = useToast();
  const { loadNotifCount } = useOutletContext();

  const [sessions, setSessions] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    try {
      const res = await fetch('/api/sessions');
      const data = await res.json();
      setSessions(data);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  async function cancelSession(id) {
    if (!window.confirm('Are you sure you want to cancel this session?')) return;
    try {
      await fetch(`/api/sessions/${id}/cancel`, { method: 'PUT' });
      showToast('Session cancelled');
      loadNotifCount();
      await loadSessions();
    } catch {
      showToast('Failed to cancel session', 'error');
    }
  }

  const filtered = sessions.filter(s => s.status === activeTab);

  const emptyMessages = {
    upcoming: 'No upcoming sessions',
    completed: 'No completed sessions yet',
    cancelled: 'No cancelled sessions'
  };

  return (
    <>
      <div className="page-header">
        <h1 className="page-header__title">Your Sessions</h1>
        <p className="page-header__subtitle">View and manage your therapy sessions.</p>
      </div>

      <div className="sessions-tabs">
        <button
          className={`sessions-tab${activeTab === 'upcoming' ? ' active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </button>
        <button
          className={`sessions-tab${activeTab === 'completed' ? ' active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </button>
        <button
          className={`sessions-tab${activeTab === 'cancelled' ? ' active' : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled
        </button>
      </div>

      <div id="sessionsList">
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Loading sessions...
          </div>
        )}

        {error && <p>Error loading sessions.</p>}

        {!loading && !error && filtered.length === 0 && (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="4" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M13 2v4M7 2v4M3 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div className="empty-state__title">{emptyMessages[activeTab]}</div>
            <p className="empty-state__desc">
              {activeTab === 'upcoming' ? 'Find a therapist to book your first session.' : ''}
            </p>
            {activeTab === 'upcoming' && (
              <button className="btn btn--primary btn--sm" onClick={() => navigate('/app/therapists')}>
                Find a Therapist
              </button>
            )}
          </div>
        )}

        {!loading && !error && filtered.map(s => (
          <div className="session-item" key={s.id}>
            <div className="session-item__left">
              <div className="session-item__avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 12c2.5 0 4.5-2 4.5-4.5S14.5 3 12 3 7.5 5 7.5 7.5 9.5 12 12 12zm0 2c-3 0-9 1.5-9 4.5V21h18v-2.5c0-3-6-4.5-9-4.5z" fill="white" />
                </svg>
              </div>
              <div>
                <div className="session-item__name">{s.therapist_name}</div>
                <div className="session-item__detail">
                  {s.therapist_title} &middot; {s.session_format} &middot; {s.duration}min &middot; &pound;{s.price}
                </div>
              </div>
            </div>
            <div className="session-item__right">
              <div className="session-item__date">
                <div className="session-item__date-day">{s.date}</div>
                <div className="session-item__date-time">{s.time}</div>
              </div>
              {s.status === 'upcoming' && (
                <>
                  <span className="tag tag--success">Confirmed</span>
                  <button className="btn btn--danger-outline btn--xs" onClick={() => cancelSession(s.id)}>
                    Cancel
                  </button>
                </>
              )}
              {s.status === 'completed' && (
                <span className="tag tag--success">Completed</span>
              )}
              {s.status === 'cancelled' && (
                <span className="tag tag--danger">Cancelled</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
