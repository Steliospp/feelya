import { useState, useMemo } from 'react';
import { useModal } from '../context/ModalContext';

const MOCK_THERAPISTS = [
  {
    id: 1, name: 'Dr. Sarah Mitchell', title: 'Clinical Psychologist', accreditation: 'BPS Chartered',
    gender: 'Female', specialisations: 'Anxiety,Depression,Stress,Burnout', languages: 'English',
    intro_video_price: 30, intro_audio_price: 20, intro_duration: 30,
    video_price: 85, video_duration: 50, audio_price: 65, audio_duration: 50,
    rating: 4.9, review_count: 127, next_available: 'Tomorrow',
    bio: 'Specialising in evidence-based approaches for workplace stress, anxiety and burnout with over 12 years of clinical experience.',
  },
  {
    id: 2, name: 'James Thompson', title: 'Counselling Psychologist', accreditation: 'BACP Accredited',
    gender: 'Male', specialisations: 'Relationships,Trauma,Grief', languages: 'English,French',
    intro_video_price: 25, intro_audio_price: null, intro_duration: 30,
    video_price: 75, video_duration: 50, audio_price: 55, audio_duration: 50,
    rating: 4.8, review_count: 94, next_available: 'Wed 26 Feb',
    bio: 'Person-centred therapist helping individuals navigate relationship challenges, loss and traumatic experiences.',
  },
  {
    id: 3, name: 'Dr. Priya Sharma', title: 'Clinical Psychologist', accreditation: 'HCPC Registered',
    gender: 'Female', specialisations: 'Anxiety,OCD,Self-esteem,LGBTQ+', languages: 'English,Hindi',
    intro_video_price: 35, intro_audio_price: 25, intro_duration: 30,
    video_price: 95, video_duration: 50, audio_price: 75, audio_duration: 50,
    rating: 4.9, review_count: 156, next_available: 'Thu 27 Feb',
    bio: 'Integrative clinical psychologist with deep expertise in anxiety disorders, OCD and identity-affirming therapy.',
  },
  {
    id: 4, name: 'Michael Chen', title: 'Integrative Therapist', accreditation: 'UKCP Registered',
    gender: 'Male', specialisations: 'Stress,Burnout,Depression', languages: 'English,Mandarin',
    intro_video_price: null, intro_audio_price: 15, intro_duration: 20,
    video_price: 70, video_duration: 50, audio_price: 50, audio_duration: 50,
    rating: 4.7, review_count: 68, next_available: 'Tomorrow',
    bio: 'Blending Eastern mindfulness practices with Western psychotherapy for holistic wellbeing and resilience.',
  },
  {
    id: 5, name: 'Dr. Emily Richards', title: 'Cognitive Behavioural Therapist', accreditation: 'BABCP Accredited',
    gender: 'Female', specialisations: 'Anxiety,OCD,Depression,Stress', languages: 'English',
    intro_video_price: 30, intro_audio_price: 20, intro_duration: 30,
    video_price: 90, video_duration: 50, audio_price: 70, audio_duration: 50,
    rating: 4.8, review_count: 112, next_available: 'Fri 28 Feb',
    bio: 'CBT specialist focused on structured, goal-oriented therapy for anxiety, depression and obsessive-compulsive disorders.',
  },
  {
    id: 6, name: 'David Okafor', title: 'Psychotherapist', accreditation: 'BACP Accredited',
    gender: 'Male', specialisations: 'Trauma,Grief,Relationships,Self-esteem', languages: 'English',
    intro_video_price: 20, intro_audio_price: null, intro_duration: 20,
    video_price: 80, video_duration: 50, audio_price: 60, audio_duration: 50,
    rating: 4.9, review_count: 89, next_available: 'Mon 3 Mar',
    bio: 'Compassionate psychotherapist with a focus on trauma recovery, bereavement and building self-worth.',
  },
];

const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

function getLowestPrice(t) {
  const prices = [t.intro_video_price, t.intro_audio_price, t.audio_price, t.video_price].filter(Boolean);
  return Math.min(...prices);
}

function hasSessionType(t, type) {
  if (type === 'video') return !!t.video_price || !!t.intro_video_price;
  if (type === 'audio') return !!t.audio_price || !!t.intro_audio_price;
  return false;
}

/* ---------- icons ---------- */
const videoIcon = (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="4" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M11 7l4-2v6l-4-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const audioIcon = (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
    <path d="M8 2v12M5 5v6m6-6v6M3 7v2m10-2v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const chatIcon = (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
    <path d="M3 3h10a1 1 0 011 1v7a1 1 0 01-1 1H5l-3 2V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
);

const searchIcon = (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const chevronSvg = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const starIcon = (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 1l2.2 4.6L15 6.3l-3.5 3.4.8 4.8L8 12.2 3.7 14.5l.8-4.8L1 6.3l4.8-.7z" />
  </svg>
);

/* ========================================= */
export default function Therapists() {
  const { openProfileModal, openBookingModal } = useModal();

  const [filters, setFilters] = useState({
    price: '',
    gender: '',
    spec: '',
    lang: '',
    type: '',
  });
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recommended');

  const [openGroups, setOpenGroups] = useState({
    price: false,
    gender: false,
    spec: false,
    lang: false,
    type: false,
  });

  const therapists = useMemo(() => {
    let list = MOCK_THERAPISTS.filter(t => {
      if (filters.price) {
        const lp = getLowestPrice(t);
        if (filters.price === '0-50' && lp > 50) return false;
        if (filters.price === '50-80' && (lp < 50 || lp > 80)) return false;
        if (filters.price === '80+' && lp < 80) return false;
      }
      if (filters.gender && t.gender !== filters.gender) return false;
      if (filters.spec && !t.specialisations.includes(filters.spec)) return false;
      if (filters.lang && !t.languages.includes(filters.lang)) return false;
      if (filters.type === 'video' && !t.video_price) return false;
      if (filters.type === 'audio' && !t.audio_price) return false;
      return true;
    });

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.specialisations.toLowerCase().includes(q)
      );
    }

    if (sort === 'price_low') list = [...list].sort((a, b) => getLowestPrice(a) - getLowestPrice(b));
    else if (sort === 'price_high') list = [...list].sort((a, b) => getLowestPrice(b) - getLowestPrice(a));
    else if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [filters, search, sort]);

  function handleFilterChange(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }));
  }

  function resetFilters() {
    setFilters({ price: '', gender: '', spec: '', lang: '', type: '' });
  }

  function toggleGroup(key) {
    setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }));
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="mp">
      {/* ── Header row ── */}
      <div className="mp__results-head">
        <div className="mp__results-left">
          <h1 className="mp__title">Therapists</h1>
          <span className="mp__count">{therapists.length} available</span>
        </div>
        <div className="mp__results-right">
          <div className="mp__search-wrap">
            <span className="mp__search-icon">{searchIcon}</span>
            <input
              className="mp__search"
              type="text"
              placeholder="Search name, title or specialisation..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="mp__sort" value={sort} onChange={e => setSort(e.target.value)}>
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Filters bar ── */}
      <div className="mp__filters">
        <div className="mp__filters-head">
          <span className="mp__filters-title">Filters</span>
          {activeFilterCount > 0 && (
            <button className="mp__filters-clear" onClick={resetFilters}>Clear all</button>
          )}
        </div>

        <div className="mp__filters-row">
          {/* Price */}
          <div className={`mp__fg${openGroups.price ? ' mp__fg--open' : ''}`}>
            <button className="mp__fg-hd" onClick={() => toggleGroup('price')}>Price Range {chevronSvg}</button>
            <div className="mp__fg-bd">
              <select className="mp__select" value={filters.price} onChange={e => handleFilterChange('price', e.target.value)}>
                <option value="">Any price</option>
                <option value="0-50">Up to &pound;50</option>
                <option value="50-80">&pound;50 – &pound;80</option>
                <option value="80+">£80 and more</option>
              </select>
            </div>
          </div>

          {/* Gender */}
          <div className={`mp__fg${openGroups.gender ? ' mp__fg--open' : ''}`}>
            <button className="mp__fg-hd" onClick={() => toggleGroup('gender')}>Gender {chevronSvg}</button>
            <div className="mp__fg-bd">
              <select className="mp__select" value={filters.gender} onChange={e => handleFilterChange('gender', e.target.value)}>
                <option value="">Any</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          {/* Specialisations */}
          <div className={`mp__fg${openGroups.spec ? ' mp__fg--open' : ''}`}>
            <button className="mp__fg-hd" onClick={() => toggleGroup('spec')}>Specialisations {chevronSvg}</button>
            <div className="mp__fg-bd">
              <select className="mp__select" value={filters.spec} onChange={e => handleFilterChange('spec', e.target.value)}>
                <option value="">All</option>
                <option value="Anxiety">Anxiety</option>
                <option value="Depression">Depression</option>
                <option value="Stress">Stress</option>
                <option value="Burnout">Burnout</option>
                <option value="Relationships">Relationships</option>
                <option value="Trauma">Trauma</option>
                <option value="OCD">OCD</option>
                <option value="Self-esteem">Self-esteem</option>
                <option value="LGBTQ+">LGBTQ+</option>
                <option value="Grief">Grief</option>
              </select>
            </div>
          </div>

          {/* Languages */}
          <div className={`mp__fg${openGroups.lang ? ' mp__fg--open' : ''}`}>
            <button className="mp__fg-hd" onClick={() => toggleGroup('lang')}>Languages {chevronSvg}</button>
            <div className="mp__fg-bd">
              <select className="mp__select" value={filters.lang} onChange={e => handleFilterChange('lang', e.target.value)}>
                <option value="">Any language</option>
                <option value="English">English</option>
                <option value="French">French</option>
                <option value="Mandarin">Mandarin</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>
          </div>

          {/* Session Type */}
          <div className={`mp__fg${openGroups.type ? ' mp__fg--open' : ''}`}>
            <button className="mp__fg-hd" onClick={() => toggleGroup('type')}>Session Type {chevronSvg}</button>
            <div className="mp__fg-bd">
              <select className="mp__select" value={filters.type} onChange={e => handleFilterChange('type', e.target.value)}>
                <option value="">Video &amp; Audio</option>
                <option value="video">Video only</option>
                <option value="audio">Audio only</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── Cards grid ── */}
      {therapists.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__title">No therapists found</div>
          <p className="empty-state__desc">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="mp__cards">
          {therapists.map(t => (
            <TherapistCard key={t.id} therapist={t} onViewProfile={openProfileModal} onBookNow={openBookingModal} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ========= Horizontal Card ========= */
function TherapistCard({ therapist: t, onViewProfile, onBookNow }) {
  const [pricingOpen, setPricingOpen] = useState(false);
  const lowestPrice = getLowestPrice(t);
  const specs = t.specialisations.split(',').slice(0, 3);

  return (
    <div className="tc">
      {/* Left: Avatar */}
      <div className="tc__avatar-col">
        <div className="tc__avatar">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 12c2.5 0 4.5-2 4.5-4.5S14.5 3 12 3 7.5 5 7.5 7.5 9.5 12 12 12zm0 2c-3 0-9 1.5-9 4.5V21h18v-2.5c0-3-6-4.5-9-4.5z" fill="white" />
          </svg>
          <span className="tc__dot" />
        </div>
        <div className="tc__rating">
          {starIcon}
          <span>{t.rating}</span>
          <span className="tc__reviews">({t.review_count})</span>
        </div>
      </div>

      {/* Centre: Info */}
      <div className="tc__info">
        <div className="tc__name">{t.name}</div>
        <div className="tc__role">{t.title}</div>
        <span className="tc__badge">{t.accreditation}</span>
        <div className="tc__chips">
          {specs.map(s => <span key={s} className="tc__chip">{s}</span>)}
        </div>
        <div className="tc__bio">{t.bio}</div>
        <div className="tc__session-types">
          {hasSessionType(t, 'video') && <span className="tc__stype" title="Video">{videoIcon}</span>}
          {hasSessionType(t, 'audio') && <span className="tc__stype" title="Audio">{audioIcon}</span>}
          <span className="tc__stype" title="Chat">{chatIcon}</span>
        </div>

        {/* Expandable pricing */}
        <button className="tc__pricing-toggle" onClick={() => setPricingOpen(v => !v)}>
          {pricingOpen ? 'Hide pricing' : 'See pricing'}
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ transform: pricingOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {pricingOpen && (
          <div className="tc__pricing-table">
            {t.intro_video_price && <div className="tc__prow"><span>Intro Video ({t.intro_duration}min)</span><span className="tc__pprice">&pound;{t.intro_video_price}</span></div>}
            {t.intro_audio_price && <div className="tc__prow"><span>Intro Audio ({t.intro_duration}min)</span><span className="tc__pprice">&pound;{t.intro_audio_price}</span></div>}
            <div className="tc__prow"><span>Video ({t.video_duration}min)</span><span className="tc__pprice">&pound;{t.video_price}</span></div>
            <div className="tc__prow"><span>Audio ({t.audio_duration}min)</span><span className="tc__pprice">&pound;{t.audio_price}</span></div>
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="tc__actions">
        <div className="tc__price-from">
          From <strong>&pound;{lowestPrice}</strong>
          <span className="tc__price-per">/ 50 min</span>
        </div>
        <span className="tc__avail">Next: {t.next_available}</span>
        <button className="btn btn--dark btn--sm tc__btn-book" onClick={() => onBookNow(t.id)}>Book now</button>
        <button className="btn btn--ghost btn--sm tc__btn-profile" onClick={() => onViewProfile(t.id)}>View profile</button>
      </div>
    </div>
  );
}
