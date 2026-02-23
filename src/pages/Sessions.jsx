import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';

const formatIcons = {
  video: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ),
  audio: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2v8M5 6v4m6-4v4M3 7v2m10-2v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
};

const MOCK_SESSIONS = [
  {
    id: 1, therapist_id: 1, therapist_name: 'Dr. Sarah Mitchell', therapist_title: 'Clinical Psychologist',
    date: 'Mon 24 Feb', time: '10:00 AM', duration: 50, price: 85,
    session_format: 'video', status: 'upcoming',
  },
  {
    id: 2, therapist_id: 2, therapist_name: 'James Thompson', therapist_title: 'Counselling Psychologist',
    date: 'Wed 26 Feb', time: '2:00 PM', duration: 50, price: 75,
    session_format: 'video', status: 'upcoming',
  },
  {
    id: 3, therapist_id: 1, therapist_name: 'Dr. Sarah Mitchell', therapist_title: 'Clinical Psychologist',
    date: 'Mon 17 Feb', time: '10:00 AM', duration: 50, price: 85,
    session_format: 'video', status: 'completed',
  },
  {
    id: 4, therapist_id: 3, therapist_name: 'Dr. Priya Sharma', therapist_title: 'Clinical Psychologist',
    date: 'Thu 13 Feb', time: '3:00 PM', duration: 50, price: 95,
    session_format: 'audio', status: 'completed',
  },
  {
    id: 5, therapist_id: 1, therapist_name: 'Dr. Sarah Mitchell', therapist_title: 'Clinical Psychologist',
    date: 'Mon 10 Feb', time: '10:00 AM', duration: 50, price: 85,
    session_format: 'video', status: 'completed',
  },
  {
    id: 6, therapist_id: 4, therapist_name: 'Michael Chen', therapist_title: 'Integrative Therapist',
    date: 'Fri 7 Feb', time: '11:00 AM', duration: 50, price: 70,
    session_format: 'video', status: 'completed',
  },
  {
    id: 7, therapist_id: 5, therapist_name: 'Dr. Emily Richards', therapist_title: 'CBT Therapist',
    date: 'Mon 3 Feb', time: '9:00 AM', duration: 50, price: 90,
    session_format: 'audio', status: 'completed',
  },
  {
    id: 8, therapist_id: 1, therapist_name: 'Dr. Sarah Mitchell', therapist_title: 'Clinical Psychologist',
    date: 'Wed 29 Jan', time: '10:00 AM', duration: 50, price: 85,
    session_format: 'video', status: 'completed',
  },
  {
    id: 9, therapist_id: 2, therapist_name: 'James Thompson', therapist_title: 'Counselling Psychologist',
    date: 'Tue 21 Jan', time: '2:00 PM', duration: 50, price: 75,
    session_format: 'video', status: 'completed',
  },
  {
    id: 10, therapist_id: 3, therapist_name: 'Dr. Priya Sharma', therapist_title: 'Clinical Psychologist',
    date: 'Mon 6 Jan', time: '4:00 PM', duration: 50, price: 95,
    session_format: 'audio', status: 'cancelled',
  },
];

export default function Sessions() {
  const navigate = useNavigate();
  const showToast = useToast();

  const [sessions, setSessions] = useState(MOCK_SESSIONS);
  const [activeTab, setActiveTab] = useState('upcoming');

  function cancelSession(id) {
    if (!window.confirm('Are you sure you want to cancel this session?')) return;
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'cancelled' } : s));
    showToast('Session cancelled');
  }

  const filtered = sessions.filter(s => s.status === activeTab);
  const counts = {
    upcoming: sessions.filter(s => s.status === 'upcoming').length,
    completed: sessions.filter(s => s.status === 'completed').length,
    cancelled: sessions.filter(s => s.status === 'cancelled').length,
  };

  const emptyMessages = {
    upcoming: 'No upcoming sessions',
    completed: 'No past sessions yet',
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
          Upcoming ({counts.upcoming})
        </button>
        <button
          className={`sessions-tab${activeTab === 'completed' ? ' active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Past ({counts.completed})
        </button>
        <button
          className={`sessions-tab${activeTab === 'cancelled' ? ' active' : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled ({counts.cancelled})
        </button>
      </div>

      <div id="sessionsList">
        {filtered.length === 0 && (
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

        {filtered.map(s => (
          <div className="session-item" key={s.id}>
            <div className="session-item__left">
              <div className="session-item__avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 12c2.5 0 4.5-2 4.5-4.5S14.5 3 12 3 7.5 5 7.5 7.5 9.5 12 12 12zm0 2c-3 0-9 1.5-9 4.5V21h18v-2.5c0-3-6-4.5-9-4.5z" fill="white" />
                </svg>
              </div>
              <div>
                <div className="session-item__name" style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={() => navigate(`/app/therapist-profile/${s.therapist_id}`)}>{s.therapist_name}</div>
                <div className="session-item__detail" style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span>{s.therapist_title}</span>
                  <span style={{ color: 'var(--border)' }}>&middot;</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--primary)' }}>
                    {formatIcons[s.session_format] || formatIcons.video}
                    <span style={{ textTransform: 'capitalize' }}>{s.session_format}</span>
                  </span>
                  <span style={{ color: 'var(--border)' }}>&middot;</span>
                  <span>{s.duration}min</span>
                  <span style={{ color: 'var(--border)' }}>&middot;</span>
                  <span style={{ fontWeight: 600, color: 'var(--text)' }}>&pound;{s.price}</span>
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
