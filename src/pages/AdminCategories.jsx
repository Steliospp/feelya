import { useState } from 'react';
import { useToast } from '../components/Toast';
import '../styles/app.css';

const initialCategories = [
  { id: 1, name: 'Anxiety', description: 'Generalised anxiety, social anxiety, panic attacks', therapists: 45, sessions: 4280, active: true },
  { id: 2, name: 'Depression', description: 'Low mood, loss of motivation, clinical depression', therapists: 42, sessions: 3920, active: true },
  { id: 3, name: 'Stress', description: 'Work stress, burnout, overwhelm', therapists: 38, sessions: 3150, active: true },
  { id: 4, name: 'Relationships', description: 'Relationship difficulties, communication, conflict', therapists: 28, sessions: 1890, active: true },
  { id: 5, name: 'Trauma & PTSD', description: 'Trauma processing, PTSD, complex trauma', therapists: 22, sessions: 1450, active: true },
  { id: 6, name: 'Self-esteem', description: 'Confidence, self-worth, identity', therapists: 30, sessions: 1680, active: true },
  { id: 7, name: 'OCD', description: 'Obsessive-compulsive disorder, intrusive thoughts', therapists: 12, sessions: 890, active: true },
  { id: 8, name: 'Grief & Loss', description: 'Bereavement, loss, life changes', therapists: 18, sessions: 720, active: true },
  { id: 9, name: 'LGBTQ+', description: 'Identity, coming out, discrimination', therapists: 14, sessions: 560, active: true },
  { id: 10, name: 'Addiction', description: 'Substance use, behavioural addictions', therapists: 10, sessions: 340, active: true },
  { id: 11, name: 'Eating Disorders', description: 'Anorexia, bulimia, binge eating', therapists: 8, sessions: 280, active: true },
  { id: 12, name: 'Sleep', description: 'Insomnia, sleep anxiety, nightmares', therapists: 15, sessions: 420, active: false },
];

export default function AdminCategories() {
  const showToast = useToast();
  const [categories, setCategories] = useState(initialCategories);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });

  function toggleActive(id) {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
    showToast('Category updated');
  }

  function handleAdd() {
    if (!form.name.trim()) return;
    setCategories(prev => [...prev, {
      id: Date.now(),
      name: form.name.trim(),
      description: form.description.trim(),
      therapists: 0,
      sessions: 0,
      active: true,
    }]);
    setForm({ name: '', description: '' });
    setShowAdd(false);
    showToast('Category added');
  }

  function startEdit(cat) {
    setEditingId(cat.id);
    setForm({ name: cat.name, description: cat.description });
  }

  function saveEdit() {
    setCategories(prev => prev.map(c => c.id === editingId ? { ...c, name: form.name.trim(), description: form.description.trim() } : c));
    setEditingId(null);
    setForm({ name: '', description: '' });
    showToast('Category saved');
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({ name: '', description: '' });
  }

  const activeCount = categories.filter(c => c.active).length;

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="page-header__title">Categories</h1>
          <p className="page-header__subtitle">Manage therapy categories that users can filter by.</p>
        </div>
        <button className="btn btn--primary btn--sm" onClick={() => { setShowAdd(true); setEditingId(null); setForm({ name: '', description: '' }); }}>Add Category</button>
      </div>

      <div className="org-stats-grid" style={{ marginBottom: 24 }}>
        <div className="org-stat">
          <div className="org-stat__label">Total Categories</div>
          <div className="org-stat__value">{categories.length}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Active</div>
          <div className="org-stat__value" style={{ color: 'var(--success)' }}>{activeCount}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Total Therapists Across</div>
          <div className="org-stat__value">{categories.reduce((s, c) => s + c.therapists, 0)}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Total Sessions Across</div>
          <div className="org-stat__value">{categories.reduce((s, c) => s + c.sessions, 0).toLocaleString()}</div>
        </div>
      </div>

      <div className="card card--no-hover">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Category</th>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Description</th>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Therapists</th>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Sessions</th>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid var(--border-light)', opacity: c.active ? 1 : 0.6 }}>
                {editingId === c.id ? (
                  <>
                    <td style={{ padding: '8px 12px' }}>
                      <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ fontSize: 14 }} />
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      <input className="form-input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ fontSize: 14 }} />
                    </td>
                    <td style={{ padding: '12px' }}>{c.therapists}</td>
                    <td style={{ padding: '12px' }}>{c.sessions.toLocaleString()}</td>
                    <td style={{ padding: '12px' }}>
                      <span className={`tag ${c.active ? 'tag--success' : 'tag--danger'}`}>{c.active ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn--primary btn--xs" onClick={saveEdit}>Save</button>
                        <button className="btn btn--ghost btn--xs" onClick={cancelEdit}>Cancel</button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ padding: '12px', fontWeight: 600 }}>{c.name}</td>
                    <td style={{ padding: '12px', color: 'var(--text-sec)', maxWidth: 250 }}>{c.description}</td>
                    <td style={{ padding: '12px', fontWeight: 600 }}>{c.therapists}</td>
                    <td style={{ padding: '12px' }}>{c.sessions.toLocaleString()}</td>
                    <td style={{ padding: '12px' }}>
                      <span className={`tag ${c.active ? 'tag--success' : 'tag--danger'}`}>{c.active ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn--outline btn--xs" onClick={() => startEdit(c)}>Edit</button>
                        <button className={`btn btn--xs ${c.active ? 'btn--danger-outline' : 'btn--primary'}`} onClick={() => toggleActive(c.id)}>
                          {c.active ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <button className="modal__close" onClick={() => setShowAdd(false)}>&times;</button>
            <h3 className="modal__title">Add Category</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
              <div>
                <label className="form-label">Name</label>
                <input className="form-input" placeholder="e.g. Mindfulness" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="form-label">Description</label>
                <input className="form-input" placeholder="Brief description..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button className="btn btn--ghost btn--md btn--full" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn btn--primary btn--md btn--full" onClick={handleAdd}>Add Category</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
