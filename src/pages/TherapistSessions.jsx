import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/app.css';

export const mockSessions = [
  { id: 1, clientInitial: 'A', clientName: 'A. Taylor', date: '2026-02-20', time: '6:00 PM', format: 'Video', type: 'Standard', duration: 50, price: 90, status: 'upcoming', notes: '' },
  { id: 2, clientInitial: 'M', clientName: 'M. Johnson', date: '2026-02-20', time: '7:00 PM', format: 'Audio', type: 'Standard', duration: 50, price: 90, status: 'upcoming', notes: '' },
  { id: 3, clientInitial: 'R', clientName: 'R. Patel', date: '2026-02-21', time: '10:00 AM', format: 'Video', type: 'Intro', duration: 30, price: 45, status: 'upcoming', notes: '' },
  { id: 4, clientInitial: 'S', clientName: 'S. Williams', date: '2026-02-21', time: '2:00 PM', format: 'Video', type: 'Standard', duration: 50, price: 90, status: 'upcoming', notes: '' },
  { id: 5, clientInitial: 'J', clientName: 'J. Brown', date: '2026-02-19', time: '11:00 AM', format: 'Video', type: 'Standard', duration: 50, price: 90, status: 'completed', notes: 'Follow-up on anxiety management techniques.' },
  { id: 6, clientInitial: 'L', clientName: 'L. Chen', date: '2026-02-19', time: '3:00 PM', format: 'Audio', type: 'Standard', duration: 50, price: 90, status: 'completed', notes: 'Discussed workplace stress coping strategies.' },
  { id: 7, clientInitial: 'K', clientName: 'K. Davies', date: '2026-02-18', time: '9:00 AM', format: 'Video', type: 'Intro', duration: 30, price: 45, status: 'completed', notes: 'Initial assessment. Client reports moderate anxiety and sleep difficulties.' },
  { id: 8, clientInitial: 'P', clientName: 'P. Evans', date: '2026-02-17', time: '4:00 PM', format: 'Video', type: 'Standard', duration: 50, price: 90, status: 'cancelled', notes: '' },
];

function CancelModal({ session, onConfirm, onClose }) {
  const [reason, setReason] = useState('');
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
        <button className="modal__close" onClick={onClose}>&times;</button>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', background: 'var(--danger-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="modal__title" style={{ fontSize: 20 }}>Cancel Session?</h3>
          <p style={{ fontSize: 14, color: 'var(--text-sec)', lineHeight: 1.6, marginBottom: 8 }}>
            Cancel your session with <strong>{session.clientName}</strong> on {session.date} at {session.time}?
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
            The client will be notified of the cancellation and will not be charged.
          </p>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label className="form-label" style={{ fontSize: 13 }}>Reason (optional)</label>
          <textarea
            className="form-textarea"
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="e.g. Schedule conflict, illness..."
            style={{ minHeight: 70 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn--ghost btn--md btn--full" onClick={onClose}>Keep Session</button>
          <button className="btn btn--md btn--full" onClick={() => onConfirm(reason)} style={{
            background: 'var(--danger)', color: '#fff', border: 'none',
          }}>Cancel Session</button>
        </div>
      </div>
    </div>
  );
}

const tabs = ['upcoming', 'completed', 'cancelled'];

export default function TherapistSessions() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState(mockSessions);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [cancellingSession, setCancellingSession] = useState(null);

  const filtered = sessions.filter((s) => s.status === activeTab);

  function cancelSession(id, reason) {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'cancelled', notes: reason || s.notes } : s));
    setCancellingSession(null);
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (d.getTime() === today.getTime()) return 'Today';
    if (d.getTime() === tomorrow.getTime()) return 'Tomorrow';
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-header__title">Sessions</h1>
        <p className="page-header__subtitle">Manage your therapy sessions</p>
      </div>

      <div className="sessions-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`sessions-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span style={{ marginLeft: 6, opacity: 0.7 }}>
              ({sessions.filter((s) => s.status === tab).length})
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 20 20" fill="none"><path d="M16 2H4a1 1 0 00-1 1v14a1 1 0 001 1h12a1 1 0 001-1V3a1 1 0 00-1-1zM7 2v16M3 7h14M3 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <div className="empty-state__title">No {activeTab} sessions</div>
          <div className="empty-state__desc">
            {activeTab === 'upcoming'
              ? 'You have no upcoming sessions scheduled.'
              : `No ${activeTab} sessions to display.`}
          </div>
        </div>
      ) : (
        <div>
          {filtered.map((s) => (
            <div key={s.id} className="session-item">
              <div className="session-item__left">
                <div className="session-item__avatar">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 12a4 4 0 100-8 4 4 0 000 8zm0 0c-4 0-7 2-7 4.5V18h14v-1.5c0-2.5-3-4.5-7-4.5z" stroke="#fff" strokeWidth="1.5"/></svg>
                </div>
                <div>
                  <div className="session-item__name" style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={() => navigate(`/therapist/client/${encodeURIComponent(s.clientName)}`)}>{s.clientName}</div>
                  <div className="session-item__detail">
                    {s.format} · {s.type} · {s.duration}min · £{s.price}
                  </div>
                  {s.notes && (
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, fontStyle: 'italic' }}>
                      {s.notes}
                    </div>
                  )}
                </div>
              </div>
              <div className="session-item__right">
                <div className="session-item__date">
                  <div className="session-item__date-day">{formatDate(s.date)}</div>
                  <div className="session-item__date-time">{s.time}</div>
                </div>
                <span className={`tag ${s.status === 'upcoming' ? 'tag--success' : s.status === 'completed' ? '' : 'tag--danger'}`}>
                  {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                </span>
                {s.status === 'upcoming' && (
                  <button className="btn btn--danger-outline btn--xs" onClick={() => setCancellingSession(s)}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {cancellingSession && (
        <CancelModal
          session={cancellingSession}
          onConfirm={(reason) => cancelSession(cancellingSession.id, reason)}
          onClose={() => setCancellingSession(null)}
        />
      )}
    </div>
  );
}
