import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/app.css';

const initialBlogs = [
  { id: 1, title: 'Understanding Anxiety in the Workplace', category: 'Anxiety', content: 'Anxiety in the workplace is more common than many people realise. As a therapist, I see countless clients who struggle with the pressures of modern work life...\n\nThe key to managing workplace anxiety is recognising the early signs. These can include persistent worry about work tasks, difficulty concentrating, physical symptoms like tension headaches, and avoidance of certain work situations.\n\nHere are some evidence-based strategies that can help:\n\n1. Practice grounding techniques during stressful moments\n2. Set clear boundaries between work and personal time\n3. Communicate openly with your manager about workload\n4. Take regular breaks throughout the day\n5. Consider seeking professional support if symptoms persist', image: null, status: 'published', date: '2026-02-10', feedback: null },
  { id: 2, title: 'The Power of Mindful Breathing', category: 'Mindfulness', content: 'Mindful breathing is one of the simplest yet most powerful tools we have for managing stress and anxiety. In my practice, I teach this technique to nearly every client I work with.\n\nThe 4-7-8 breathing technique:\n- Breathe in through your nose for 4 seconds\n- Hold your breath for 7 seconds\n- Exhale slowly through your mouth for 8 seconds\n- Repeat 3-4 times\n\nThis activates the parasympathetic nervous system, helping to calm the fight-or-flight response that many of us live in chronically.', image: null, status: 'pending', date: '2026-02-18', feedback: null },
  { id: 3, title: 'Building Resilience After Setbacks', category: 'Resilience', content: 'Resilience is not about never falling down — it is about learning how to get back up. In this article, I explore practical ways to build resilience in everyday life, drawing on cognitive behavioural principles and positive psychology research.', image: null, status: 'declined', date: '2026-02-05', feedback: 'Great topic, but needs more practical examples and evidence-based references. Please expand the strategies section and resubmit.' },
];

export default function TherapistBlogs() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState(initialBlogs);
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', category: '', content: '', image: null, imagePreview: null });
  const [viewBlog, setViewBlog] = useState(null);
  const fileRef = useRef(null);

  const authorName = `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Therapist';

  function openNewEditor() {
    setEditingId(null);
    setForm({ title: '', category: '', content: '', image: null, imagePreview: null });
    setShowEditor(true);
  }

  function openEditEditor(blog) {
    setEditingId(blog.id);
    setForm({ title: blog.title, category: blog.category, content: blog.content, image: blog.image, imagePreview: blog.image });
    setShowEditor(true);
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm(f => ({ ...f, image: file, imagePreview: url }));
  }

  function removeImage() {
    setForm(f => ({ ...f, image: null, imagePreview: null }));
    if (fileRef.current) fileRef.current.value = '';
  }

  function handleSubmit() {
    if (!form.title.trim() || !form.content.trim()) return;
    if (editingId) {
      setBlogs(prev => prev.map(b => b.id === editingId ? {
        ...b,
        title: form.title.trim(),
        category: form.category.trim(),
        content: form.content.trim(),
        image: form.imagePreview,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        feedback: null,
      } : b));
    } else {
      setBlogs(prev => [{
        id: Date.now(),
        title: form.title.trim(),
        category: form.category.trim(),
        content: form.content.trim(),
        image: form.imagePreview,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        feedback: null,
      }, ...prev]);
    }
    setShowEditor(false);
    setEditingId(null);
    setForm({ title: '', category: '', content: '', image: null, imagePreview: null });
  }

  function cancelEditor() {
    setShowEditor(false);
    setEditingId(null);
    setForm({ title: '', category: '', content: '', image: null, imagePreview: null });
  }

  const statusColors = { published: 'tag--success', pending: 'tag--warning', declined: 'tag--danger' };
  const pendingCount = blogs.filter(b => b.status === 'pending').length;
  const publishedCount = blogs.filter(b => b.status === 'published').length;

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="page-header__title">My Blog Posts</h1>
          <p className="page-header__subtitle">Write articles to share your expertise. Posts are reviewed by our team before publishing.</p>
        </div>
        {!showEditor && <button className="btn btn--primary btn--sm" onClick={openNewEditor}>Write New Blog</button>}
      </div>

      {/* Stats */}
      <div className="org-stats-grid" style={{ marginBottom: 24 }}>
        <div className="org-stat">
          <div className="org-stat__label">Total Posts</div>
          <div className="org-stat__value">{blogs.length}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Published</div>
          <div className="org-stat__value" style={{ color: 'var(--success)' }}>{publishedCount}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Pending Review</div>
          <div className="org-stat__value" style={{ color: '#f59e0b' }}>{pendingCount}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Declined</div>
          <div className="org-stat__value" style={{ color: 'var(--danger)' }}>{blogs.filter(b => b.status === 'declined').length}</div>
        </div>
      </div>

      {/* ─── EDITOR ─── */}
      {showEditor && (
        <div className="card card--no-hover" style={{ padding: 24, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{editingId ? 'Edit Blog Post' : 'Write a New Blog Post'}</h3>
            <button className="btn btn--ghost btn--xs" onClick={cancelEditor}>Cancel</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="form-label">Title</label>
              <input className="form-input" placeholder="Give your article a compelling title..." value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>

            <div>
              <label className="form-label">Category</label>
              <select className="form-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <option value="">Select a category...</option>
                <option>Anxiety</option>
                <option>Depression</option>
                <option>Stress</option>
                <option>Mindfulness</option>
                <option>Relationships</option>
                <option>Resilience</option>
                <option>Self-esteem</option>
                <option>Trauma</option>
                <option>Workplace</option>
                <option>Sleep</option>
                <option>Grief</option>
                <option>CBT</option>
              </select>
            </div>

            {/* Cover Image */}
            <div>
              <label className="form-label">Cover Image</label>
              {form.imagePreview ? (
                <div style={{ position: 'relative', marginBottom: 8 }}>
                  <img src={form.imagePreview} alt="Cover preview" style={{ width: '100%', maxHeight: 240, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)' }} />
                  <button
                    onClick={removeImage}
                    style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}
                  >&times;</button>
                </div>
              ) : (
                <div
                  onClick={() => fileRef.current?.click()}
                  style={{ border: '2px dashed var(--border)', borderRadius: 10, padding: '32px 20px', textAlign: 'center', cursor: 'pointer', color: 'var(--text-muted)', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ marginBottom: 8 }}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>Click to upload a cover image</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>JPG, PNG or WebP</div>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </div>

            {/* Content */}
            <div>
              <label className="form-label">Content</label>
              <textarea
                className="form-textarea"
                placeholder="Write your article here... Share your expertise, insights, and practical advice."
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                style={{ minHeight: 280, lineHeight: 1.8, fontSize: 15 }}
              />
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{form.content.length} characters &middot; ~{Math.max(1, Math.ceil(form.content.split(/\s+/).filter(Boolean).length / 200))} min read</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
            <button className="btn btn--ghost btn--md" onClick={cancelEditor}>Cancel</button>
            <button className="btn btn--primary btn--md" onClick={handleSubmit} disabled={!form.title.trim() || !form.content.trim()}>
              {editingId ? 'Resubmit for Review' : 'Submit for Review'}
            </button>
          </div>

          <div style={{ marginTop: 12, padding: 12, background: '#eef2ff', borderRadius: 8, border: '1px solid #e0e7ff' }}>
            <div style={{ fontSize: 13, color: '#64748b' }}>
              <strong style={{ color: '#1e1b4b' }}>Note:</strong> Your blog post will be submitted for review by our admin team. Once approved, it will be published on the Resources page for all users to read.
            </div>
          </div>
        </div>
      )}

      {/* ─── BLOG LIST ─── */}
      {!showEditor && (
        <>
          {blogs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__title">No blog posts yet</div>
              <p className="empty-state__desc">Write your first article to share your expertise with the community.</p>
              <button className="btn btn--primary btn--sm" onClick={openNewEditor}>Write New Blog</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {blogs.map(b => (
                <div key={b.id} className="card card--no-hover" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', gap: 0 }}>
                    {/* Image thumbnail */}
                    {b.image && (
                      <div style={{ width: 160, minHeight: 120, flexShrink: 0 }}>
                        <img src={b.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <div style={{ padding: 20, flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{b.title}</div>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                            {b.category && <span className="tag">{b.category}</span>}
                            <span className={`tag ${statusColors[b.status]}`}>{b.status.charAt(0).toUpperCase() + b.status.slice(1)}</span>
                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{b.date}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                          <button className="btn btn--ghost btn--xs" onClick={() => setViewBlog(b)}>Preview</button>
                          {b.status !== 'published' && (
                            <button className="btn btn--outline btn--xs" onClick={() => openEditEditor(b)}>Edit</button>
                          )}
                        </div>
                      </div>
                      <div style={{ fontSize: 14, color: 'var(--text-sec)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {b.content}
                      </div>

                      {/* Feedback from admin */}
                      {b.status === 'declined' && b.feedback && (
                        <div style={{ marginTop: 12, padding: 12, background: '#fef2f2', borderRadius: 8, border: '1px solid #fecaca' }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#991b1b', marginBottom: 4 }}>Admin Feedback</div>
                          <div style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.5 }}>{b.feedback}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Preview Modal */}
      {viewBlog && (
        <div className="modal-overlay" onClick={() => setViewBlog(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 640, maxHeight: '85vh', overflow: 'auto' }}>
            <button className="modal__close" onClick={() => setViewBlog(null)}>&times;</button>
            {viewBlog.image && (
              <img src={viewBlog.image} alt="" style={{ width: '100%', maxHeight: 240, objectFit: 'cover', borderRadius: 10, marginBottom: 16 }} />
            )}
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {viewBlog.category && <span className="tag">{viewBlog.category}</span>}
              <span className={`tag ${statusColors[viewBlog.status]}`}>{viewBlog.status.charAt(0).toUpperCase() + viewBlog.status.slice(1)}</span>
            </div>
            <h3 className="modal__title" style={{ marginBottom: 8 }}>{viewBlog.title}</h3>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>By {authorName} &middot; {viewBlog.date}</div>
            <div style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-sec)', whiteSpace: 'pre-wrap' }}>{viewBlog.content}</div>
          </div>
        </div>
      )}
    </div>
  );
}
