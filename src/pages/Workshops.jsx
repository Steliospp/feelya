import { useState, useMemo } from 'react';

const mockWorkshops = [
  { id: 1, title: 'Managing Stress at Work', desc: 'Learn practical strategies to manage workplace stress, set healthy boundaries, and prevent burnout.', host: 'Dr. Sarah Mitchell', date: 'Tue 25 Feb 2026', time: '12:00 PM', duration: 60, spots: 8, totalSpots: 20, category: 'Stress', registered: false },
  { id: 2, title: 'Building Resilience', desc: 'Develop mental resilience and learn how to bounce back from setbacks with evidence-based techniques.', host: 'Emma Richardson', date: 'Thu 27 Feb 2026', time: '1:00 PM', duration: 45, spots: 12, totalSpots: 25, category: 'Wellbeing', registered: false },
  { id: 3, title: 'Mindfulness in the Workplace', desc: 'An introduction to mindfulness practices you can use at your desk to improve focus and reduce anxiety.', host: 'Priya Sharma', date: 'Mon 3 Mar 2026', time: '11:00 AM', duration: 30, spots: 15, totalSpots: 30, category: 'Mindfulness', registered: false },
  { id: 4, title: 'Understanding Anxiety', desc: 'Explore the mechanisms of anxiety and learn practical CBT-based tools to manage anxious thoughts.', host: 'Dr. Michael Chen', date: 'Wed 5 Mar 2026', time: '2:00 PM', duration: 60, spots: 6, totalSpots: 20, category: 'Anxiety', registered: true },
  { id: 5, title: 'Healthy Sleep Habits', desc: 'Understand the connection between sleep and mental health, and build better evening routines.', host: 'Dr. Amara Okafor', date: 'Fri 7 Mar 2026', time: '12:30 PM', duration: 45, spots: 18, totalSpots: 25, category: 'Wellbeing', registered: false },
  { id: 6, title: 'Communication Skills for Teams', desc: 'Improve your professional relationships with assertive communication techniques and conflict resolution.', host: 'Dr. James Cooper', date: 'Tue 11 Mar 2026', time: '10:00 AM', duration: 60, spots: 10, totalSpots: 20, category: 'Relationships', registered: false },
];

const CATEGORIES = ['Stress', 'Wellbeing', 'Mindfulness', 'Anxiety', 'Relationships'];

const chevronSvg = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const searchIcon = (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const calendarIcon = (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M13 2v4M7 2v4M3 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
);

const personIcon = (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M10 12a4 4 0 100-8 4 4 0 000 8zm0 0c-4 0-7 2-7 4.5V18h14v-1.5c0-2.5-3-4.5-7-4.5z" stroke="currentColor" strokeWidth="1.5"/></svg>
);

export default function Workshops() {
  const [workshops, setWorkshops] = useState(mockWorkshops);
  const [search, setSearch] = useState('');
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [confirmingCancel, setConfirmingCancel] = useState(null);

  /* filters */
  const [filters, setFilters] = useState({ category: '', duration: '', availability: '' });
  const [openGroups, setOpenGroups] = useState({ category: false, duration: false, availability: false });

  function toggleGroup(key) {
    setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }));
  }
  function handleFilterChange(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }));
  }
  function resetFilters() {
    setFilters({ category: '', duration: '', availability: '' });
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const filtered = useMemo(() => {
    let list = [...workshops];
    if (filters.category) list = list.filter(w => w.category === filters.category);
    if (filters.duration === 'short') list = list.filter(w => w.duration <= 30);
    else if (filters.duration === 'medium') list = list.filter(w => w.duration > 30 && w.duration <= 45);
    else if (filters.duration === 'long') list = list.filter(w => w.duration > 45);
    if (filters.availability === 'available') list = list.filter(w => w.spots > 0);
    else if (filters.availability === 'almost-full') list = list.filter(w => w.spots > 0 && w.spots <= 10);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(w =>
        w.title.toLowerCase().includes(q) ||
        w.host.toLowerCase().includes(q) ||
        w.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [workshops, filters, search]);

  function handleRegister(id) {
    const workshop = workshops.find(w => w.id === id);
    if (workshop?.registered) {
      setConfirmingCancel(id);
      return;
    }
    setWorkshops(prev => prev.map(w =>
      w.id === id ? { ...w, registered: true, spots: w.spots - 1 } : w
    ));
  }

  function confirmCancel(id) {
    setWorkshops(prev => prev.map(w =>
      w.id === id ? { ...w, registered: false, spots: w.spots + 1 } : w
    ));
    setConfirmingCancel(null);
  }

  function handleSuggest() {
    if (!suggestion.trim()) return;
    setSuggestion('');
    setSuggestOpen(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <div className="mp">
      {/* ── Success toast ── */}
      {submitted && (
        <div className="ws__toast">
          Topic suggestion submitted to HR for review. Thank you!
        </div>
      )}

      {/* ── Header row ── */}
      <div className="mp__results-head">
        <div className="mp__results-left">
          <h1 className="mp__title">Workshops</h1>
          <span className="mp__count">{filtered.length} available</span>
        </div>
        <div className="mp__results-right">
          <div className="mp__search-wrap">
            <span className="mp__search-icon">{searchIcon}</span>
            <input
              className="mp__search"
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn--outline btn--sm" onClick={() => setSuggestOpen(!suggestOpen)}>
            Suggest a Topic
          </button>
        </div>
      </div>

      {/* ── Suggest topic panel ── */}
      {suggestOpen && (
        <div className="card ws__suggest">
          <div className="card__title">Suggest a Workshop Topic</div>
          <p className="ws__suggest-desc">
            Have a topic you'd like your company to cover? Submit a suggestion for HR to review.
          </p>
          <div className="ws__suggest-row">
            <input
              className="form-input"
              placeholder="e.g. Managing imposter syndrome, Financial wellbeing..."
              value={suggestion}
              onChange={e => setSuggestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSuggest()}
            />
            <button className="btn btn--primary btn--sm" onClick={handleSuggest}>Submit</button>
          </div>
        </div>
      )}

      {/* ── Sidebar + Cards grid ── */}
      <div className="mp__grid">
        {/* ── Filters sidebar ── */}
        <aside className="mp__sidebar">
          <div className="mp__filters">
            <div className="mp__filters-head">
              <span className="mp__filters-title">Filters</span>
              {activeFilterCount > 0 && (
                <button className="mp__filters-clear" onClick={resetFilters}>Clear all</button>
              )}
            </div>

            {/* Category */}
            <div className={`mp__fg${openGroups.category ? ' mp__fg--open' : ''}`}>
              <button className="mp__fg-hd" onClick={() => toggleGroup('category')}>Category {chevronSvg}</button>
              <div className="mp__fg-bd">
                <select className="mp__select" value={filters.category} onChange={e => handleFilterChange('category', e.target.value)}>
                  <option value="">All categories</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Duration */}
            <div className={`mp__fg${openGroups.duration ? ' mp__fg--open' : ''}`}>
              <button className="mp__fg-hd" onClick={() => toggleGroup('duration')}>Duration {chevronSvg}</button>
              <div className="mp__fg-bd">
                <select className="mp__select" value={filters.duration} onChange={e => handleFilterChange('duration', e.target.value)}>
                  <option value="">Any duration</option>
                  <option value="short">30 min or less</option>
                  <option value="medium">31 – 45 min</option>
                  <option value="long">Over 45 min</option>
                </select>
              </div>
            </div>

            {/* Availability */}
            <div className={`mp__fg${openGroups.availability ? ' mp__fg--open' : ''}`}>
              <button className="mp__fg-hd" onClick={() => toggleGroup('availability')}>Availability {chevronSvg}</button>
              <div className="mp__fg-bd">
                <select className="mp__select" value={filters.availability} onChange={e => handleFilterChange('availability', e.target.value)}>
                  <option value="">All</option>
                  <option value="available">Spots available</option>
                  <option value="almost-full">Almost full</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Cards ── */}
        <section className="mp__results">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__title">No workshops found</div>
              <p className="empty-state__desc">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="mp__cards">
              {filtered.map(w => (
                <div key={w.id} className="wc">
                  <div className="wc__head">
                    <span className="tag">{w.category}</span>
                    {w.registered && <span className="tag tag--success">Registered</span>}
                  </div>
                  <h3 className="wc__title">{w.title}</h3>
                  <p className="wc__desc">{w.desc}</p>
                  <div className="wc__meta">
                    {personIcon}
                    <span>Hosted by {w.host}</span>
                  </div>
                  <div className="wc__meta">
                    {calendarIcon}
                    <span>{w.date} at {w.time} &middot; {w.duration}min</span>
                  </div>
                  <div className={`wc__spots${w.spots < 5 ? ' wc__spots--low' : ''}`}>
                    {w.spots} / {w.totalSpots} spots remaining
                  </div>
                  {confirmingCancel === w.id ? (
                    <div className="wc__confirm">
                      <span className="wc__confirm-text">Are you sure?</span>
                      <div className="wc__confirm-btns">
                        <button className="btn btn--ghost btn--sm" style={{ flex: 1 }} onClick={() => confirmCancel(w.id)}>Yes, cancel</button>
                        <button className="btn btn--primary btn--sm" style={{ flex: 1 }} onClick={() => setConfirmingCancel(null)}>Keep</button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className={`btn btn--${w.registered ? 'ghost' : 'primary'} btn--sm btn--full`}
                      onClick={() => handleRegister(w.id)}
                    >
                      {w.registered ? 'Cancel Registration' : 'Register'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
