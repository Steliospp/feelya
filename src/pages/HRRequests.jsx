import { useState } from 'react';
import '../styles/app.css';

const initialRequests = [
  { id: 1, topic: 'Financial Wellbeing & Money Anxiety', submittedBy: 'Anonymous', date: '2026-02-18', votes: 12, status: 'pending' },
  { id: 2, topic: 'Managing Imposter Syndrome', submittedBy: 'Anonymous', date: '2026-02-16', votes: 8, status: 'pending' },
  { id: 3, topic: 'Supporting a Colleague in Crisis', submittedBy: 'Anonymous', date: '2026-02-14', votes: 15, status: 'pending' },
  { id: 4, topic: 'Parental Leave & Return to Work', submittedBy: 'Anonymous', date: '2026-02-10', votes: 6, status: 'approved' },
  { id: 5, topic: 'ADHD in the Workplace', submittedBy: 'Anonymous', date: '2026-02-05', votes: 19, status: 'approved' },
  { id: 6, topic: 'Meditation for Beginners', submittedBy: 'Anonymous', date: '2026-01-28', votes: 4, status: 'declined' },
];

export default function HRRequests() {
  const [requests, setRequests] = useState(initialRequests);
  const [activeTab, setActiveTab] = useState('pending');

  const filtered = requests.filter(r => r.status === activeTab);

  function updateStatus(id, status) {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  }

  const statusColor = {
    pending: { bg: 'var(--warning-bg)', color: '#92400e' },
    approved: { bg: 'var(--success-bg)', color: '#059669' },
    declined: { bg: 'var(--danger-bg)', color: '#dc2626' },
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-header__title">Employee Requests</h1>
        <p className="page-header__subtitle">Review workshop topic suggestions submitted by employees. All submissions are anonymous.</p>
      </div>

      <div className="org-stats-grid" style={{ marginBottom: 24 }}>
        <div className="org-stat">
          <div className="org-stat__label">Pending Review</div>
          <div className="org-stat__value" style={{ color: 'var(--warning)' }}>{requests.filter(r => r.status === 'pending').length}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Approved</div>
          <div className="org-stat__value" style={{ color: 'var(--success)' }}>{requests.filter(r => r.status === 'approved').length}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Total Suggestions</div>
          <div className="org-stat__value">{requests.length}</div>
        </div>
      </div>

      <div className="sessions-tabs" style={{ marginBottom: 24 }}>
        {['pending', 'approved', 'declined'].map(tab => (
          <button
            key={tab}
            className={`sessions-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} ({requests.filter(r => r.status === tab).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__title">No {activeTab} requests</div>
          <p className="empty-state__desc">
            {activeTab === 'pending' ? 'All requests have been reviewed.' : `No ${activeTab} requests to display.`}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.sort((a, b) => b.votes - a.votes).map(r => (
            <div key={r.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                minWidth: 48,
                height: 48,
                borderRadius: 'var(--radius)',
                background: 'var(--primary-50)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                flexShrink: 0,
              }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>{r.votes}</div>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>votes</div>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{r.topic}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Submitted {r.date} &middot; {r.submittedBy}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="tag" style={{ background: statusColor[r.status].bg, color: statusColor[r.status].color }}>
                  {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                </span>
                {r.status === 'pending' && (
                  <>
                    <button className="btn btn--outline btn--xs" style={{ color: 'var(--success)', borderColor: 'var(--success)' }} onClick={() => updateStatus(r.id, 'approved')}>
                      Approve
                    </button>
                    <button className="btn btn--outline btn--xs" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => updateStatus(r.id, 'declined')}>
                      Decline
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 32, padding: 20, background: 'var(--primary-50)', borderRadius: 'var(--radius)', border: '1px solid var(--primary-100)' }}>
        <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Anonymous Submissions</div>
        <div style={{ color: 'var(--text-sec)', fontSize: 13, lineHeight: 1.6 }}>
          All employee topic suggestions are submitted anonymously to encourage honest feedback. Votes indicate interest from other employees.
        </div>
      </div>
    </div>
  );
}
