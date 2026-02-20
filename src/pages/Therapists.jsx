import { useState, useMemo } from 'react';
import { useModal } from '../context/ModalContext';

const MOCK_THERAPISTS = [
  {
    id: 1, name: 'Dr. Sarah Mitchell', title: 'Clinical Psychologist', accreditation: 'BPS Chartered',
    gender: 'Female', specialisations: 'Anxiety,Depression,Stress,Burnout', languages: 'English',
    intro_video_price: 30, intro_audio_price: 20, intro_duration: 30,
    video_price: 85, video_duration: 50, audio_price: 65, audio_duration: 50,
    rating: 4.9, review_count: 127, next_available: 'Tomorrow',
  },
  {
    id: 2, name: 'James Thompson', title: 'Counselling Psychologist', accreditation: 'BACP Accredited',
    gender: 'Male', specialisations: 'Relationships,Trauma,Grief', languages: 'English,French',
    intro_video_price: 25, intro_audio_price: null, intro_duration: 30,
    video_price: 75, video_duration: 50, audio_price: 55, audio_duration: 50,
    rating: 4.8, review_count: 94, next_available: 'Wed 26 Feb',
  },
  {
    id: 3, name: 'Dr. Priya Sharma', title: 'Clinical Psychologist', accreditation: 'HCPC Registered',
    gender: 'Female', specialisations: 'Anxiety,OCD,Self-esteem,LGBTQ+', languages: 'English,Hindi',
    intro_video_price: 35, intro_audio_price: 25, intro_duration: 30,
    video_price: 95, video_duration: 50, audio_price: 75, audio_duration: 50,
    rating: 4.9, review_count: 156, next_available: 'Thu 27 Feb',
  },
  {
    id: 4, name: 'Michael Chen', title: 'Integrative Therapist', accreditation: 'UKCP Registered',
    gender: 'Male', specialisations: 'Stress,Burnout,Depression', languages: 'English,Mandarin',
    intro_video_price: null, intro_audio_price: 15, intro_duration: 20,
    video_price: 70, video_duration: 50, audio_price: 50, audio_duration: 50,
    rating: 4.7, review_count: 68, next_available: 'Tomorrow',
  },
  {
    id: 5, name: 'Dr. Emily Richards', title: 'Cognitive Behavioural Therapist', accreditation: 'BABCP Accredited',
    gender: 'Female', specialisations: 'Anxiety,OCD,Depression,Stress', languages: 'English',
    intro_video_price: 30, intro_audio_price: 20, intro_duration: 30,
    video_price: 90, video_duration: 50, audio_price: 70, audio_duration: 50,
    rating: 4.8, review_count: 112, next_available: 'Fri 28 Feb',
  },
  {
    id: 6, name: 'David Okafor', title: 'Psychotherapist', accreditation: 'BACP Accredited',
    gender: 'Male', specialisations: 'Trauma,Grief,Relationships,Self-esteem', languages: 'English',
    intro_video_price: 20, intro_audio_price: null, intro_duration: 20,
    video_price: 80, video_duration: 50, audio_price: 60, audio_duration: 50,
    rating: 4.9, review_count: 89, next_available: 'Mon 3 Mar',
  },
];

export default function Therapists() {
  const { openProfileModal, openBookingModal } = useModal();

  const [filters, setFilters] = useState({
    price: '',
    gender: '',
    spec: '',
    lang: '',
    type: '',
  });

  const [openGroups, setOpenGroups] = useState({
    price: true,
    gender: true,
    spec: true,
    lang: true,
    type: true,
  });

  const therapists = useMemo(() => {
    return MOCK_THERAPISTS.filter(t => {
      if (filters.price && t.video_price > Number(filters.price)) return false;
      if (filters.gender && t.gender !== filters.gender) return false;
      if (filters.spec && !t.specialisations.includes(filters.spec)) return false;
      if (filters.lang && !t.languages.includes(filters.lang)) return false;
      if (filters.type === 'video' && !t.video_price) return false;
      if (filters.type === 'audio' && !t.audio_price) return false;
      return true;
    });
  }, [filters]);

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
          {therapists.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__title">No therapists found</div>
              <p className="empty-state__desc">Try adjusting your filters.</p>
            </div>
          ) : (
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

function PriceCell({ price, duration }) {
  if (!price) {
    return <div className="therapist-card__price-amount therapist-card__price-amount--na">&ndash;</div>;
  }
  return (
    <div className="therapist-card__price-amount">
      &pound;{price}
      {duration && <span className="therapist-card__price-duration">/{duration}min</span>}
    </div>
  );
}

const videoIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

const audioIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 2v8M5 6v4m6-4v4M3 7v2m10-2v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

function TherapistCard({ therapist: t, onViewProfile, onBookNow }) {
  return (
    <div className="therapist-card">
      <div className="therapist-card__avatar">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path d="M12 12c2.5 0 4.5-2 4.5-4.5S14.5 3 12 3 7.5 5 7.5 7.5 9.5 12 12 12zm0 2c-3 0-9 1.5-9 4.5V21h18v-2.5c0-3-6-4.5-9-4.5z" fill="white" />
        </svg>
        <div className="therapist-card__status"></div>
      </div>

      <div className="therapist-card__name">{t.name}</div>
      <div className="therapist-card__title">{t.title}</div>
      <div className="therapist-card__accreditation">{t.accreditation}</div>

      <div className="therapist-card__pricing">
        <div className="therapist-card__price-row">
          <div className="therapist-card__price-type">
            {videoIcon}
            Introductory Video
          </div>
          <PriceCell price={t.intro_video_price} duration={t.intro_duration} />
        </div>

        <div className="therapist-card__price-row">
          <div className="therapist-card__price-type">
            {audioIcon}
            Introductory Audio
          </div>
          <PriceCell price={t.intro_audio_price} duration={t.intro_duration} />
        </div>

        <div className="therapist-card__price-row">
          <div className="therapist-card__price-type">
            {videoIcon}
            Video session
          </div>
          <PriceCell price={t.video_price} duration={t.video_duration} />
        </div>

        <div className="therapist-card__price-row">
          <div className="therapist-card__price-type">
            {audioIcon}
            Audio session
          </div>
          <PriceCell price={t.audio_price} duration={t.audio_duration} />
        </div>
      </div>

      <div className="therapist-card__actions">
        <button className="btn btn--outline btn--sm" onClick={() => onViewProfile(t.id)}>View profile</button>
        <button className="btn btn--dark btn--sm" onClick={() => onBookNow(t.id)}>Book Now</button>
      </div>
    </div>
  );
}
