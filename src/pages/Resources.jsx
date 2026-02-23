import { useState, useMemo } from 'react';
import { useToast } from '../components/Toast';

const resources = [
  { cat: 'Workplace', title: 'Dealing with Burnout at Work', desc: 'Recognise the signs of burnout and practical strategies for recovery and prevention in the workplace.', grad: 'linear-gradient(135deg, #ede9fe, #e0e7ff)', icon: '#6366f1' },
  { cat: 'Self-Help', title: 'Managing Anxiety: Practical Tips', desc: 'Evidence-based strategies you can use today to better manage anxious thoughts and feelings.', grad: 'linear-gradient(135deg, #d1fae5, #e0f2fe)', icon: '#10b981' },
  { cat: 'Wellbeing', title: 'Building Resilience in Everyday Life', desc: 'How to develop mental resilience and bounce back from life\'s setbacks with greater strength.', grad: 'linear-gradient(135deg, #fef3c7, #fce7f3)', icon: '#f59e0b' },
  { cat: 'Guide', title: 'Understanding Depression', desc: 'Learn about the signs, symptoms, and treatment options for depression, and when to seek professional help.', grad: 'linear-gradient(135deg, #e0e7ff, #ede9fe)', icon: '#6366f1' },
  { cat: 'Workplace', title: 'Healthy Work-Life Balance', desc: 'Practical tips for setting boundaries, managing your time, and maintaining wellbeing alongside a demanding job.', grad: 'linear-gradient(135deg, #fce7f3, #fef3c7)', icon: '#ec4899' },
  { cat: 'Workplace', title: 'Stress Management Techniques', desc: 'Simple, evidence-based tools you can use anywhere to reduce stress and regain calm during busy periods.', grad: 'linear-gradient(135deg, #d1fae5, #ccfbf1)', icon: '#14b8a6' },
  { cat: 'Self-Help', title: 'Mindfulness for Beginners', desc: 'A simple introduction to mindfulness practice and how it can improve your mental wellbeing.', grad: 'linear-gradient(135deg, #e0f2fe, #d1fae5)', icon: '#0ea5e9' },
  { cat: 'Wellbeing', title: 'Sleep and Mental Health', desc: 'Explore the connection between sleep quality and mental health, with tips for better rest.', grad: 'linear-gradient(135deg, #ede9fe, #fce7f3)', icon: '#8b5cf6' },
  { cat: 'Relationships', title: 'Communicating Better at Work', desc: 'Expert advice on improving workplace communication, resolving conflict, and building stronger professional relationships.', grad: 'linear-gradient(135deg, #fef3c7, #e0e7ff)', icon: '#f59e0b' },
];

const CATEGORIES = [...new Set(resources.map(r => r.cat))];

export default function Resources() {
  const showToast = useToast();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const filtered = useMemo(() => {
    let list = resources;
    if (category) list = list.filter(r => r.cat === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.desc.toLowerCase().includes(q) ||
        r.cat.toLowerCase().includes(q)
      );
    }
    return list;
  }, [search, category]);

  return (
    <>
      <div className="page-header">
        <h1 className="page-header__title">Resources</h1>
        <p className="page-header__subtitle">Expert articles and guides to support your mental health and workplace wellbeing.</p>
      </div>

      <div className="resources-toolbar">
        <div className="mp__search-wrap">
          <span className="mp__search-icon">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </span>
          <input
            className="mp__search"
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="resources-cats">
          <button
            className={`resources-cat${!category ? ' resources-cat--active' : ''}`}
            onClick={() => setCategory('')}
          >
            All
          </button>
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`resources-cat${category === c ? ' resources-cat--active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__title">No resources found</div>
          <p className="empty-state__desc">Try adjusting your search or category filter.</p>
        </div>
      ) : (
        <div className="resources-grid">
          {filtered.map((r, i) => (
            <div className="resource-card" key={i} onClick={() => showToast('Article coming soon!')}>
              <div className="resource-card__img" style={{ background: r.grad }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M12 6.5a.5.5 0 11-1 0 .5.5 0 011 0zM12 12a.5.5 0 11-1 0 .5.5 0 011 0zM12 17.5a.5.5 0 11-1 0 .5.5 0 011 0z" stroke={r.icon} strokeWidth="1.5" />
                  <rect x="3" y="3" width="18" height="18" rx="3" stroke={r.icon} strokeWidth="1.5" />
                </svg>
              </div>
              <div className="resource-card__body">
                <div className="resource-card__cat">{r.cat}</div>
                <div className="resource-card__title">{r.title}</div>
                <div className="resource-card__desc">{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
