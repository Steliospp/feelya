import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getWorkshops, addWorkshop, updateWorkshop, newId } from '../lib/workshopStore';
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

export default function HRWorkshops() {
  const { user } = useAuth();
  const [workshops, setWorkshops] = useState(() => getWorkshops().filter(w => w.companyId === user.companyId));
  const [activeTab, setActiveTab] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', date: '', time: '', duration: '60', capacity: '20', category: 'Wellbeing' });

  function refresh() {
    setWorkshops(getWorkshops().filter(w => w.companyId === user.companyId));
  }

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'pending_review', label: 'Pending' },
    { key: 'needs_changes', label: 'Needs Changes' },
    { key: 'approved', label: 'Approved' },
    { key: 'published', label: 'Published' },
    { key: 'scheduled', label: 'Scheduled' },
  ];

  const filtered = activeTab === 'all' ? workshops : workshops.filter(w => w.status === activeTab);
  const pendingCount = workshops.filter(w => w.status === 'pending_review').length;
  const needsChangesCount = workshops.filter(w => w.status === 'needs_changes').length;
  const scheduledCount = workshops.filter(w => w.status === 'scheduled').length;

  function handleCreate(e) {
    e.preventDefault();
    addWorkshop({
      id: newId(),
      companyId: user.companyId,
      companyName: user.companyName,
      title: form.title,
      description: form.description,
      category: form.category,
      date: form.date,
      time: form.time,
      duration: Number(form.duration),
      capacity: Number(form.capacity),
      status: 'pending_review',
      createdBy: { id: user.id, name: `${user.first_name} ${user.last_name}` },
      therapist: null,
      attendees: [],
      comments: [],
      createdAt: new Date().toISOString(),
    });
    setShowCreate(false);
    setForm({ title: '', description: '', date: '', time: '', duration: '60', capacity: '20', category: 'Wellbeing' });
    refresh();
  }

  function handleResubmit(id) {
    updateWorkshop(id, { status: 'pending_review' });
    refresh();
  }

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-header__title">Workshops</h1>
          <p className="page-header__subtitle">Create workshop requests and track their approval status.</p>
        </div>
        <button className="btn btn--primary btn--sm" onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? 'Cancel' : 'Request Workshop'}
        </button>
      </div>

      {showCreate && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card__title">New Workshop Request</div>
          <form onSubmit={handleCreate}>
            <div className="profile-grid">
              <div>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Workshop title" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe the workshop goals and content..." required />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    <option>Wellbeing</option>
                    <option>Stress</option>
                    <option>Anxiety</option>
                    <option>Mindfulness</option>
                    <option>Relationships</option>
                  </select>
                </div>
              </div>
              <div>
                <div className="form-group">
                  <label className="form-label">Preferred Date</label>
                  <input className="form-input" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Time</label>
                  <input className="form-input" type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} required />
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Duration (min)</label>
                    <input className="form-input" type="number" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Capacity</label>
                    <input className="form-input" type="number" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} />
                  </div>
                </div>
              </div>
            </div>
            <button className="btn btn--primary btn--sm" type="submit" style={{ marginTop: 8 }}>Submit for Review</button>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="org-stats-grid" style={{ marginBottom: 24 }}>
        <div className="org-stat">
          <div className="org-stat__label">Pending Review</div>
          <div className="org-stat__value" style={{ color: 'var(--warning)' }}>{pendingCount}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Needs Changes</div>
          <div className="org-stat__value" style={{ color: 'var(--danger)' }}>{needsChangesCount}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Scheduled</div>
          <div className="org-stat__value" style={{ color: 'var(--success)' }}>{scheduledCount}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Total</div>
          <div className="org-stat__value">{workshops.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sessions-tabs" style={{ marginBottom: 24 }}>
        {tabs.map(t => (
          <button key={t.key} className={`sessions-tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
            {t.label} ({t.key === 'all' ? workshops.length : workshops.filter(w => w.status === t.key).length})
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__title">No workshops in this category</div>
          <p className="empty-state__desc">Create a new workshop request to get started.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(w => (
            <div className="card card--no-hover" key={w.id} style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 16 }}>{w.title}</span>
                    <span className={`tag ${STATUS_TAG[w.status] || ''}`}>{STATUS_LABELS[w.status]}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-sec)', marginBottom: 8 }}>{w.description}</div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                    <span>{w.category}</span>
                    <span>{w.date} at {w.time}</span>
                    <span>{w.duration}min</span>
                    <span>{w.capacity} capacity</span>
                    {w.therapist && <span>Therapist: {w.therapist.name}</span>}
                    {w.attendees.length > 0 && <span>{w.attendees.length} registered</span>}
                  </div>
                </div>
                {w.status === 'needs_changes' && (
                  <button className="btn btn--outline btn--sm" onClick={() => handleResubmit(w.id)}>Resubmit</button>
                )}
              </div>
              {/* Show admin comments */}
              {w.comments.length > 0 && (
                <div style={{ marginTop: 12, padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>Review Comments</div>
                  {w.comments.map((c, i) => (
                    <div key={i} style={{ fontSize: 13, color: 'var(--text-sec)', marginBottom: 4 }}>
                      <strong>{c.by}:</strong> {c.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
