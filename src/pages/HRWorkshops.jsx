import { useState } from 'react';
import '../styles/app.css';

const initialWorkshops = [
  { id: 1, title: 'Managing Stress at Work', host: 'Dr. Sarah Mitchell', date: '2026-02-25', time: '12:00 PM', duration: 60, registered: 12, capacity: 20, status: 'upcoming', category: 'Stress' },
  { id: 2, title: 'Building Resilience', host: 'Emma Richardson', date: '2026-02-27', time: '1:00 PM', duration: 45, registered: 13, capacity: 25, status: 'upcoming', category: 'Wellbeing' },
  { id: 3, title: 'Mindfulness in the Workplace', host: 'Priya Sharma', date: '2026-03-03', time: '11:00 AM', duration: 30, registered: 15, capacity: 30, status: 'upcoming', category: 'Mindfulness' },
  { id: 4, title: 'Understanding Anxiety', host: 'Dr. Michael Chen', date: '2026-03-05', time: '2:00 PM', duration: 60, registered: 14, capacity: 20, status: 'upcoming', category: 'Anxiety' },
  { id: 5, title: 'Work-Life Balance', host: 'Emma Richardson', date: '2026-02-10', time: '12:00 PM', duration: 45, registered: 22, capacity: 25, status: 'completed', category: 'Wellbeing' },
  { id: 6, title: 'Dealing with Burnout', host: 'Dr. Sarah Mitchell', date: '2026-01-28', time: '11:00 AM', duration: 60, registered: 18, capacity: 20, status: 'completed', category: 'Stress' },
];

export default function HRWorkshops() {
  const [workshops] = useState(initialWorkshops);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', host: '', date: '', time: '', duration: '60', capacity: '20', category: 'Wellbeing' });

  const filtered = workshops.filter(w => w.status === activeTab);
  const upcoming = workshops.filter(w => w.status === 'upcoming').length;
  const totalRegistrations = workshops.reduce((s, w) => s + w.registered, 0);

  function handleCreate(e) {
    e.preventDefault();
    setShowCreate(false);
    setForm({ title: '', host: '', date: '', time: '', duration: '60', capacity: '20', category: 'Wellbeing' });
  }

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-header__title">Workshops</h1>
          <p className="page-header__subtitle">Create and manage wellbeing workshops for your employees.</p>
        </div>
        <button className="btn btn--primary btn--sm" onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? 'Cancel' : 'Create Workshop'}
        </button>
      </div>

      {showCreate && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card__title">New Workshop</div>
          <form onSubmit={handleCreate}>
            <div className="profile-grid">
              <div>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Workshop title" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Host / Facilitator</label>
                  <input className="form-input" value={form.host} onChange={e => setForm({...form, host: e.target.value})} placeholder="Therapist or facilitator name" required />
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
                  <label className="form-label">Date</label>
                  <input className="form-input" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Time</label>
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
            <button className="btn btn--primary btn--sm" type="submit" style={{ marginTop: 8 }}>Create Workshop</button>
          </form>
        </div>
      )}

      <div className="org-stats-grid" style={{ marginBottom: 24 }}>
        <div className="org-stat">
          <div className="org-stat__label">Upcoming</div>
          <div className="org-stat__value">{upcoming}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Total Workshops</div>
          <div className="org-stat__value">{workshops.length}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Total Registrations</div>
          <div className="org-stat__value">{totalRegistrations}</div>
        </div>
      </div>

      <div className="sessions-tabs" style={{ marginBottom: 24 }}>
        <button className={`sessions-tab ${activeTab === 'upcoming' ? 'active' : ''}`} onClick={() => setActiveTab('upcoming')}>
          Upcoming ({workshops.filter(w => w.status === 'upcoming').length})
        </button>
        <button className={`sessions-tab ${activeTab === 'completed' ? 'active' : ''}`} onClick={() => setActiveTab('completed')}>
          Past ({workshops.filter(w => w.status === 'completed').length})
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__title">No {activeTab} workshops</div>
        </div>
      ) : (
        <div className="card card--no-hover">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', color: 'var(--text-sec)', fontWeight: 600 }}>Workshop</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-sec)', fontWeight: 600 }}>Host</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-sec)', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-sec)', fontWeight: 600 }}>Registrations</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-sec)', fontWeight: 600 }}>Category</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(w => (
                <tr key={w.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>{w.title}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-sec)' }}>{w.host}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-sec)' }}>{w.date} at {w.time}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontWeight: 600 }}>{w.registered}</span>
                    <span style={{ color: 'var(--text-muted)' }}> / {w.capacity}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}><span className="tag">{w.category}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
