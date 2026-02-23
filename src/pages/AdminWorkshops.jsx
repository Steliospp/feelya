import { useState } from 'react';
import { getWorkshops, updateWorkshop } from '../lib/workshopStore';
import { useAuth } from '../context/AuthContext';
import '../styles/app.css';

const STATUS_LABELS = {
  pending_review: 'Pending Review',
  needs_changes: 'Needs Changes',
  approved: 'Approved',
  published: 'Published',
  scheduled: 'Scheduled',
  completed: 'Completed',
};

const STATUS_TAG = {
  pending_review: 'tag--warning',
  needs_changes: 'tag--danger',
  approved: 'tag--success',
  published: '',
  scheduled: 'tag--success',
  completed: '',
};

export default function AdminWorkshops() {
  const { user } = useAuth();
  const [workshops, setWorkshops] = useState(() => getWorkshops());
  const [activeTab, setActiveTab] = useState('pending_review');
  const [commentDraft, setCommentDraft] = useState({});

  function refresh() { setWorkshops(getWorkshops()); }

  const tabs = [
    { key: 'pending_review', label: 'Pending Review' },
    { key: 'approved', label: 'Approved' },
    { key: 'published', label: 'Published' },
    { key: 'scheduled', label: 'Scheduled' },
    { key: 'all', label: 'All' },
  ];

  const filtered = activeTab === 'all' ? workshops : workshops.filter(w => w.status === activeTab);
  const pendingCount = workshops.filter(w => w.status === 'pending_review').length;

  function handleAction(id, action) {
    const adminName = `${user.first_name} ${user.last_name}`;
    const ws = workshops.find(w => w.id === id);
    if (!ws) return;

    if (action === 'needs_changes') {
      const text = commentDraft[id]?.trim();
      if (!text) return;
      const comments = [...(ws.comments || []), { by: adminName, role: 'SUPER_ADMIN', text, at: new Date().toISOString() }];
      updateWorkshop(id, { status: 'needs_changes', comments });
      setCommentDraft(prev => ({ ...prev, [id]: '' }));
    } else if (action === 'approve') {
      const comments = [...(ws.comments || []), { by: adminName, role: 'SUPER_ADMIN', text: 'Approved.', at: new Date().toISOString() }];
      updateWorkshop(id, { status: 'approved', comments });
    } else if (action === 'publish') {
      updateWorkshop(id, { status: 'published' });
    }
    refresh();
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-header__title">Workshop Reviews</h1>
        <p className="page-header__subtitle">Review, approve, and publish workshop requests from organisations.</p>
      </div>

      {pendingCount > 0 && (
        <div style={{
          padding: '12px 20px',
          background: 'var(--warning-bg)',
          color: '#92400e',
          borderRadius: 'var(--radius)',
          fontWeight: 500,
          fontSize: 14,
          marginBottom: 24,
        }}>
          {pendingCount} workshop{pendingCount > 1 ? 's' : ''} awaiting your review.
        </div>
      )}

      <div className="sessions-tabs" style={{ marginBottom: 24 }}>
        {tabs.map(t => (
          <button key={t.key} className={`sessions-tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
            {t.label} ({t.key === 'all' ? workshops.length : workshops.filter(w => w.status === t.key).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__title">No workshops here</div>
          <p className="empty-state__desc">{activeTab === 'pending_review' ? 'All caught up — no pending reviews.' : 'No workshops with this status.'}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.map(w => (
            <div className="card card--no-hover" key={w.id} style={{ padding: 24 }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 16 }}>{w.title}</span>
                    <span className={`tag ${STATUS_TAG[w.status] || ''}`}>{STATUS_LABELS[w.status]}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-sec)' }}>
                    {w.companyName} — requested by {w.createdBy.name}
                  </div>
                </div>
                <span className="tag">{w.category}</span>
              </div>

              {/* Description */}
              <div style={{ fontSize: 14, color: 'var(--text-sec)', lineHeight: 1.6, marginBottom: 12 }}>{w.description}</div>

              {/* Details */}
              <div style={{ display: 'flex', gap: 24, fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, flexWrap: 'wrap' }}>
                <span>Date: {w.date}</span>
                <span>Time: {w.time}</span>
                <span>Duration: {w.duration}min</span>
                <span>Capacity: {w.capacity}</span>
                {w.therapist && <span>Therapist: {w.therapist.name}</span>}
              </div>

              {/* Comments */}
              {w.comments.length > 0 && (
                <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8, marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>Comments</div>
                  {w.comments.map((c, i) => (
                    <div key={i} style={{ fontSize: 13, color: 'var(--text-sec)', marginBottom: 4 }}>
                      <strong>{c.by}:</strong> {c.text}
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              {w.status === 'pending_review' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      className="form-input"
                      style={{ flex: 1, fontSize: 13 }}
                      placeholder="Add feedback comment..."
                      value={commentDraft[w.id] || ''}
                      onChange={e => setCommentDraft(prev => ({ ...prev, [w.id]: e.target.value }))}
                    />
                    <button className="btn btn--danger-outline btn--sm" onClick={() => handleAction(w.id, 'needs_changes')} disabled={!commentDraft[w.id]?.trim()}>
                      Request Changes
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn--primary btn--sm" onClick={() => handleAction(w.id, 'approve')}>Approve</button>
                  </div>
                </div>
              )}
              {w.status === 'approved' && (
                <button className="btn btn--primary btn--sm" onClick={() => handleAction(w.id, 'publish')}>Publish to Therapists</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
