import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_THERAPISTS } from '../lib/therapistData';
import '../styles/app.css';

export default function TherapistProfileView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try API first, fall back to mock data
    fetch(`/api/therapists/${id}`, { credentials: 'include' })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => { setTherapist(data); setLoading(false); })
      .catch(() => {
        const mock = MOCK_THERAPISTS[id];
        if (mock) setTherapist(mock);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>Loading...</div>
      </div>
    );
  }

  if (!therapist) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-state__title">Therapist not found</div>
          <p className="empty-state__desc">The therapist you're looking for doesn't exist.</p>
          <button className="btn btn--outline btn--sm" onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  const specs = therapist.specialisations ? therapist.specialisations.split(',').map(s => s.trim()) : [];
  const langs = therapist.languages ? therapist.languages.split(',').map(l => l.trim()) : [];
  const bodies = therapist.professional_bodies ? therapist.professional_bodies.split(',').map(b => b.trim()) : [];

  return (
    <div className="page">
      <button className="btn btn--ghost btn--sm" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Back
      </button>

      {/* Header */}
      <div className="tp__header">
        <div className="tp__avatar">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M12 12c2.5 0 4.5-2 4.5-4.5S14.5 3 12 3 7.5 5 7.5 7.5 9.5 12 12 12zm0 2c-3 0-9 1.5-9 4.5V21h18v-2.5c0-3-6-4.5-9-4.5z" fill="white"/></svg>
        </div>
        <div className="tp__header-info">
          <h1 className="tp__name">{therapist.name}</h1>
          <p className="tp__title">{therapist.title}</p>
          <div className="tp__header-meta">
            <div className="tp__rating">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="#f59e0b"><path d="M8 1l2.2 4.6L15 6.3l-3.5 3.4.8 4.8L8 12.2 3.7 14.5l.8-4.8L1 6.3l4.8-.7z"/></svg>
              <span>{therapist.rating}/5</span>
              <span className="tp__review-count">({therapist.review_count} reviews)</span>
            </div>
          </div>
        </div>
        <button className="btn btn--primary btn--lg" onClick={() => navigate(`/app/book/${therapist.id}`)} style={{ whiteSpace: 'nowrap' }}>Book a Session</button>
      </div>

      <div className="tp__grid">
        {/* Left column */}
        <div className="tp__main">
          {langs.length > 0 && (
            <div className="tp__section">
              <h3 className="tp__section-title">Languages</h3>
              <p className="tp__section-text">{langs.join(', ')}</p>
            </div>
          )}

          {specs.length > 0 && (
            <div className="tp__section">
              <h3 className="tp__section-title">Specialisations</h3>
              <div className="tp__tags">
                {specs.map(s => <span key={s} className="tag">{s}</span>)}
              </div>
            </div>
          )}

          {bodies.length > 0 && bodies[0] !== '' && (
            <div className="tp__section">
              <h3 className="tp__section-title">Professional Bodies</h3>
              <div className="tp__tags">
                {bodies.map(b => <span key={b} className="tag">{b}</span>)}
              </div>
            </div>
          )}

          {therapist.about && (
            <div className="tp__section">
              <h3 className="tp__section-title">About</h3>
              <p className="tp__section-text">{therapist.about}</p>
            </div>
          )}

          {therapist.focus_areas && (
            <div className="tp__section">
              <h3 className="tp__section-title">Focus Areas</h3>
              <p className="tp__section-text">{therapist.focus_areas}</p>
            </div>
          )}

          {therapist.credentials && (
            <div className="tp__section">
              <h3 className="tp__section-title">Credentials</h3>
              <p className="tp__section-text">{therapist.credentials}</p>
            </div>
          )}

          {therapist.experience && (
            <div className="tp__section">
              <h3 className="tp__section-title">Experience</h3>
              <p className="tp__section-text">{therapist.experience}</p>
            </div>
          )}

          {therapist.methodologies && (
            <div className="tp__section">
              <h3 className="tp__section-title">Methodologies</h3>
              <p className="tp__section-text">{therapist.methodologies}</p>
            </div>
          )}
        </div>

        {/* Right column - Pricing */}
        <div className="tp__sidebar-card">
          <h3 className="tp__section-title">Session Pricing</h3>
          <div className="tp__pricing">
            {therapist.intro_video_price && (
              <div className="tp__price-row">
                <span>Introductory Video</span>
                <strong>&pound;{therapist.intro_video_price}/{therapist.intro_duration}min</strong>
              </div>
            )}
            {therapist.intro_audio_price && (
              <div className="tp__price-row">
                <span>Introductory Audio</span>
                <strong>&pound;{therapist.intro_audio_price}/{therapist.intro_duration}min</strong>
              </div>
            )}
            <div className="tp__price-row">
              <span>Video Session</span>
              <strong>&pound;{therapist.video_price}/{therapist.video_duration}min</strong>
            </div>
            <div className="tp__price-row">
              <span>Audio Session</span>
              <strong>&pound;{therapist.audio_price}/{therapist.audio_duration}min</strong>
            </div>
          </div>
          {therapist.next_available && (
            <div className="tp__availability">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="var(--success)" strokeWidth="1.5"/><path d="M8 5v3l2 1.5" stroke="var(--success)" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <span>Next available: {therapist.next_available}</span>
            </div>
          )}
          <button className="btn btn--primary btn--full btn--lg" style={{ marginTop: 16 }} onClick={() => navigate(`/app/book/${therapist.id}`)}>Book a Session</button>
        </div>
      </div>
    </div>
  );
}
