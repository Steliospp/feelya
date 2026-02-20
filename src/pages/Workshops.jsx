import { useState } from 'react';

const mockWorkshops = [
  { id: 1, title: 'Managing Stress at Work', desc: 'Learn practical strategies to manage workplace stress, set healthy boundaries, and prevent burnout.', host: 'Dr. Sarah Mitchell', date: 'Tue 25 Feb 2026', time: '12:00 PM', duration: 60, spots: 8, totalSpots: 20, category: 'Stress', registered: false },
  { id: 2, title: 'Building Resilience', desc: 'Develop mental resilience and learn how to bounce back from setbacks with evidence-based techniques.', host: 'Emma Richardson', date: 'Thu 27 Feb 2026', time: '1:00 PM', duration: 45, spots: 12, totalSpots: 25, category: 'Wellbeing', registered: false },
  { id: 3, title: 'Mindfulness in the Workplace', desc: 'An introduction to mindfulness practices you can use at your desk to improve focus and reduce anxiety.', host: 'Priya Sharma', date: 'Mon 3 Mar 2026', time: '11:00 AM', duration: 30, spots: 15, totalSpots: 30, category: 'Mindfulness', registered: false },
  { id: 4, title: 'Understanding Anxiety', desc: 'Explore the mechanisms of anxiety and learn practical CBT-based tools to manage anxious thoughts.', host: 'Dr. Michael Chen', date: 'Wed 5 Mar 2026', time: '2:00 PM', duration: 60, spots: 6, totalSpots: 20, category: 'Anxiety', registered: true },
  { id: 5, title: 'Healthy Sleep Habits', desc: 'Understand the connection between sleep and mental health, and build better evening routines.', host: 'Dr. Amara Okafor', date: 'Fri 7 Mar 2026', time: '12:30 PM', duration: 45, spots: 18, totalSpots: 25, category: 'Wellbeing', registered: false },
  { id: 6, title: 'Communication Skills for Teams', desc: 'Improve your professional relationships with assertive communication techniques and conflict resolution.', host: 'Dr. James Cooper', date: 'Tue 11 Mar 2026', time: '10:00 AM', duration: 60, spots: 10, totalSpots: 20, category: 'Relationships', registered: false },
];

const categories = ['All', 'Stress', 'Wellbeing', 'Mindfulness', 'Anxiety', 'Relationships'];

export default function Workshops() {
  const [workshops, setWorkshops] = useState(mockWorkshops);
  const [filter, setFilter] = useState('All');
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const filtered = filter === 'All' ? workshops : workshops.filter(w => w.category === filter);

  function handleRegister(id) {
    setWorkshops(prev => prev.map(w =>
      w.id === id ? { ...w, registered: !w.registered, spots: w.registered ? w.spots + 1 : w.spots - 1 } : w
    ));
  }

  function handleSuggest() {
    if (!suggestion.trim()) return;
    setSuggestion('');
    setSuggestOpen(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-header__title">Workshops</h1>
        <p className="page-header__subtitle">Browse and register for upcoming wellbeing workshops organised by your company.</p>
      </div>

      {submitted && (
        <div style={{
          padding: '12px 20px',
          background: 'var(--success-bg)',
          color: '#059669',
          borderRadius: 'var(--radius)',
          fontWeight: 500,
          fontSize: 14,
          marginBottom: 20,
        }}>
          Topic suggestion submitted to HR for review. Thank you!
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div className="sessions-tabs">
          {categories.map(cat => (
            <button
              key={cat}
              className={`sessions-tab ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <button className="btn btn--outline btn--sm" onClick={() => setSuggestOpen(!suggestOpen)}>
          Suggest a Topic
        </button>
      </div>

      {suggestOpen && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card__title">Suggest a Workshop Topic</div>
          <p style={{ fontSize: 13, color: 'var(--text-sec)', marginBottom: 12 }}>
            Have a topic you'd like your company to cover? Submit a suggestion for HR to review.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              className="form-input"
              placeholder="e.g. Managing imposter syndrome, Financial wellbeing..."
              value={suggestion}
              onChange={e => setSuggestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSuggest()}
              style={{ flex: 1 }}
            />
            <button className="btn btn--primary btn--sm" onClick={handleSuggest}>Submit</button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__title">No workshops found</div>
          <p className="empty-state__desc">No workshops match this category. Check back soon.</p>
        </div>
      ) : (
        <div className="therapist-grid">
          {filtered.map(w => (
            <div key={w.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <span className="tag">{w.category}</span>
                {w.registered && <span className="tag tag--success">Registered</span>}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{w.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-sec)', lineHeight: 1.6, marginBottom: 16, flex: 1 }}>{w.desc}</p>
              <div style={{ fontSize: 13, color: 'var(--text-sec)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M10 12a4 4 0 100-8 4 4 0 000 8zm0 0c-4 0-7 2-7 4.5V18h14v-1.5c0-2.5-3-4.5-7-4.5z" stroke="currentColor" strokeWidth="1.5"/></svg>
                Hosted by {w.host}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-sec)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M13 2v4M7 2v4M3 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                {w.date} at {w.time} &middot; {w.duration}min
              </div>
              <div style={{ fontSize: 12, color: w.spots < 5 ? 'var(--danger)' : 'var(--text-muted)', marginBottom: 16, fontWeight: w.spots < 5 ? 600 : 400 }}>
                {w.spots} / {w.totalSpots} spots remaining
              </div>
              <button
                className={`btn btn--${w.registered ? 'ghost' : 'primary'} btn--sm btn--full`}
                onClick={() => handleRegister(w.id)}
              >
                {w.registered ? 'Cancel Registration' : 'Register'}
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
