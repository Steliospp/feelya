import { useState, useEffect, useCallback } from 'react';
import { useModal } from '../context/ModalContext';

export default function Therapists() {
  const { openProfileModal, openBookingModal } = useModal();

  const [filters, setFilters] = useState({
    price: '',
    gender: '',
    spec: '',
    lang: '',
    type: '',
  });

  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [openGroups, setOpenGroups] = useState({
    price: true,
    gender: true,
    spec: true,
    lang: true,
    type: true,
  });

  const loadTherapists = useCallback(async (currentFilters) => {
    setLoading(true);
    setError(false);

    const params = new URLSearchParams();
    if (currentFilters.price) params.set('maxPrice', currentFilters.price);
    if (currentFilters.gender) params.set('gender', currentFilters.gender);
    if (currentFilters.spec) params.set('specialisation', currentFilters.spec);
    if (currentFilters.lang) params.set('language', currentFilters.lang);
    if (currentFilters.type) params.set('sessionType', currentFilters.type);

    try {
      const res = await fetch(`/api/therapists?${params}`);
      const data = await res.json();
      setTherapists(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTherapists(filters);
  }, [filters, loadTherapists]);

  function handleFilterChange(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }));
  }

  function resetFilters() {
    setFilters({
      price: '',
      gender: '',
      spec: '',
      lang: '',
      type: '',
    });
  }

  function toggleGroup(key) {
    setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }));
  }

  const chevronSvg = (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <>
      <div className="page-header">
        <h1 className="page-header__title">Therapists</h1>
        <p className="page-header__subtitle">Browse your company's approved, licensed professionals. All therapists are accredited and vetted by Feelya.</p>
        <div style={{ marginTop: 12 }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            background: 'var(--success-bg)',
            color: '#059669',
            borderRadius: 9999,
            fontSize: 12,
            fontWeight: 600,
          }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M4 8l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Company-Approved Programme
          </span>
        </div>
      </div>

      <div className="content-with-filters">
        {/* Filters Sidebar */}
        <div className="filters" id="filtersPanel">
          <div className="filters__title">Filters</div>

          {/* Price Range */}
          <div className={`filter-group${openGroups.price ? ' open' : ''}`}>
            <button className="filter-group__header" onClick={() => toggleGroup('price')}>
              Price Range
              {chevronSvg}
            </button>
            <div className="filter-group__body">
              <div className="filter-option">
                <select value={filters.price} onChange={e => handleFilterChange('price', e.target.value)}>
                  <option value="">Any price</option>
                  <option value="70">Up to &pound;70/session</option>
                  <option value="90">Up to &pound;90/session</option>
                  <option value="120">Up to &pound;120/session</option>
                </select>
              </div>
            </div>
          </div>

          {/* Gender */}
          <div className={`filter-group${openGroups.gender ? ' open' : ''}`}>
            <button className="filter-group__header" onClick={() => toggleGroup('gender')}>
              Gender
              {chevronSvg}
            </button>
            <div className="filter-group__body">
              <div className="filter-option">
                <select value={filters.gender} onChange={e => handleFilterChange('gender', e.target.value)}>
                  <option value="">Any</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
          </div>

          {/* Specialisations */}
          <div className={`filter-group${openGroups.spec ? ' open' : ''}`}>
            <button className="filter-group__header" onClick={() => toggleGroup('spec')}>
              Specialisations
              {chevronSvg}
            </button>
            <div className="filter-group__body">
              <div className="filter-option">
                <select value={filters.spec} onChange={e => handleFilterChange('spec', e.target.value)}>
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
          </div>

          {/* Languages */}
          <div className={`filter-group${openGroups.lang ? ' open' : ''}`}>
            <button className="filter-group__header" onClick={() => toggleGroup('lang')}>
              Languages
              {chevronSvg}
            </button>
            <div className="filter-group__body">
              <div className="filter-option">
                <select value={filters.lang} onChange={e => handleFilterChange('lang', e.target.value)}>
                  <option value="">Any language</option>
                  <option value="English">English</option>
                  <option value="French">French</option>
                  <option value="Mandarin">Mandarin</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>
            </div>
          </div>

          {/* Session Type */}
          <div className={`filter-group${openGroups.type ? ' open' : ''}`}>
            <button className="filter-group__header" onClick={() => toggleGroup('type')}>
              Session Type
              {chevronSvg}
            </button>
            <div className="filter-group__body">
              <div className="filter-option">
                <select value={filters.type} onChange={e => handleFilterChange('type', e.target.value)}>
                  <option value="">Video &amp; Audio</option>
                  <option value="video">Video only</option>
                  <option value="audio">Audio only</option>
                </select>
              </div>
            </div>
          </div>

          <button className="filters__reset" onClick={resetFilters}>Reset Filters</button>
        </div>

        {/* Therapists List */}
        <div id="therapistsList">
          {loading && (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Loading therapists...</div>
          )}

          {error && (
            <p>Error loading therapists.</p>
          )}

          {!loading && !error && therapists.length === 0 && (
            <div className="empty-state">
              <div className="empty-state__title">No therapists found</div>
              <p className="empty-state__desc">Try adjusting your filters.</p>
            </div>
          )}

          {!loading && !error && therapists.length > 0 && (
            <div className="therapist-grid">
              {therapists.map(t => (
                <TherapistCard key={t.id} therapist={t} onViewProfile={openProfileModal} onBookNow={openBookingModal} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function TherapistCard({ therapist: t, onViewProfile, onBookNow }) {
  const specs = t.specialisations ? t.specialisations.split(',') : [];

  return (
    <div className="therapist-card">
      <div className="therapist-card__header">
        <div className="therapist-card__avatar">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M12 12c2.5 0 4.5-2 4.5-4.5S14.5 3 12 3 7.5 5 7.5 7.5 9.5 12 12 12zm0 2c-3 0-9 1.5-9 4.5V21h18v-2.5c0-3-6-4.5-9-4.5z" fill="white" />
          </svg>
          <div className="therapist-card__status"></div>
        </div>
        <div>
          <div className="therapist-card__name">{t.name}</div>
          <div className="therapist-card__title">{t.title} &middot; {t.accreditation}</div>
          <div className="therapist-card__rating">
            {'\u2733'.repeat(0) /* stars rendered below */}
            {Array.from({ length: Math.round(t.rating) }, (_, i) => (
              <span key={i}>{'\u2733'}</span>
            ))}
            {' '}
            <span>({t.review_count} reviews)</span>
          </div>
        </div>
      </div>

      <div className="therapist-card__tags">
        {specs.map((s, i) => (
          <span className="tag" key={i}>{s.trim()}</span>
        ))}
      </div>

      <div className="therapist-card__pricing">
        {t.intro_video_price && (
          <div className="therapist-card__price-row">
            <div className="therapist-card__price-type">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" />
                <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
              </svg>
              Introductory Video
            </div>
            <div className="therapist-card__price-amount">
              &pound;{t.intro_video_price}
              <span className="therapist-card__price-duration">/{t.intro_duration}min</span>
            </div>
          </div>
        )}

        {t.intro_audio_price && (
          <div className="therapist-card__price-row">
            <div className="therapist-card__price-type">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v8M5 6v4m6-4v4M3 7v2m10-2v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              Introductory Audio
            </div>
            <div className="therapist-card__price-amount">
              &pound;{t.intro_audio_price}
              <span className="therapist-card__price-duration">/{t.intro_duration}min</span>
            </div>
          </div>
        )}

        <div className="therapist-card__price-row">
          <div className="therapist-card__price-type">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" />
              <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
            </svg>
            Video session
          </div>
          <div className="therapist-card__price-amount">
            &pound;{t.video_price}
            <span className="therapist-card__price-duration">/{t.video_duration}min</span>
          </div>
        </div>

        <div className="therapist-card__price-row">
          <div className="therapist-card__price-type">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v8M5 6v4m6-4v4M3 7v2m10-2v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            Audio session
          </div>
          <div className="therapist-card__price-amount">
            &pound;{t.audio_price}
            <span className="therapist-card__price-duration">/{t.audio_duration}min</span>
          </div>
        </div>
      </div>

      <div className="therapist-card__next">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
          <path d="M7 4v3l2 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        Next available: {t.next_available}
      </div>

      <div className="therapist-card__actions">
        <button className="btn btn--outline btn--sm" onClick={() => onViewProfile(t.id)}>View Profile</button>
        <button className="btn btn--primary btn--sm" onClick={() => onBookNow(t.id)}>Book Now</button>
      </div>
    </div>
  );
}
