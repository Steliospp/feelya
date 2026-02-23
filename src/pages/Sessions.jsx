import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';

function isWithin24Hours(datetimeStr) {
  const sessionTime = new Date(datetimeStr);
  const now = new Date();
  const diff = sessionTime.getTime() - now.getTime();
  return diff < 24 * 60 * 60 * 1000;
}

function CancelModal({ session, onConfirm, onClose }) {
  const lateCancel = session.datetime && isWithin24Hours(session.datetime);
  const fee = lateCancel ? Math.round(session.price * 0.5) : 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
        <button className="modal__close" onClick={onClose}>&times;</button>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: lateCancel ? 'var(--warning-bg)' : 'var(--danger-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke={lateCancel ? 'var(--warning)' : 'var(--danger)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="modal__title" style={{ fontSize: 20 }}>
            {lateCancel ? 'Late Cancellation' : 'Cancel Session?'}
          </h3>
          <p style={{ fontSize: 14, color: 'var(--text-sec)', lineHeight: 1.6, marginBottom: 8 }}>
            Are you sure you want to cancel your session with <strong>{session.therapist_name}</strong> on {session.date} at {session.time}?
          </p>

          {lateCancel ? (
            <div style={{
              background: 'var(--warning-bg)', border: '1px solid #fde68a',
              borderRadius: 10, padding: '14px 18px', marginTop: 12, textAlign: 'left',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontWeight: 600, fontSize: 14, color: '#92400e' }}>Less than 24 hours notice</span>
              </div>
              <p style={{ fontSize: 13, color: '#92400e', lineHeight: 1.6, margin: 0 }}>
                Cancellations made less than 24 hours before the session incur a <strong>50% cancellation fee of &pound;{fee}</strong>. This will be charged to your account.
              </p>
            </div>
          ) : (
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Free cancellation &mdash; more than 24 hours before the session.
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn--ghost btn--md btn--full" onClick={onClose}>Keep Session</button>
          <button className="btn btn--md btn--full" onClick={onConfirm} style={{
            background: 'var(--danger)', color: '#fff', border: 'none',
          }}>
            {lateCancel ? `Cancel (£${fee} fee)` : 'Cancel Session'}
          </button>
        </div>
      </div>
    </div>
  );
}

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

// Build datetime strings relative to now so the 24hr check works in the demo
const tomorrow10am = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(10, 0, 0, 0);
  return d.toISOString();
})();
const in3days = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  d.setHours(14, 0, 0, 0);
  return d.toISOString();
})();
const in5hours = (() => {
  const d = new Date();
  d.setHours(d.getHours() + 5, 0, 0, 0);
  return d.toISOString();
})();

const MOCK_SESSIONS = [
  {
    id: 1, therapist_id: 1, therapist_name: 'Dr. Sarah Mitchell', therapist_title: 'Clinical Psychologist',
    date: 'Mon 24 Feb', time: '10:00 AM', duration: 50, price: 85,
    session_format: 'video', status: 'upcoming', datetime: in5hours,
  },
  {
    id: 2, therapist_id: 2, therapist_name: 'James Thompson', therapist_title: 'Counselling Psychologist',
    date: 'Wed 26 Feb', time: '2:00 PM', duration: 50, price: 75,
    session_format: 'video', status: 'upcoming', datetime: in3days,
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
  const [cancellingSession, setCancellingSession] = useState(null);

  function cancelSession(id) {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'cancelled' } : s));
    setCancellingSession(null);
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
                  <button className="btn btn--danger-outline btn--xs" onClick={() => setCancellingSession(s)}>
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

      {cancellingSession && (
        <CancelModal
          session={cancellingSession}
          onConfirm={() => cancelSession(cancellingSession.id)}
          onClose={() => setCancellingSession(null)}
        />
      )}
    </>
  );
}
