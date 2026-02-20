import { useState, useEffect } from 'react';
import { useModal } from '../context/ModalContext';

export default function TherapistProfileModal() {
  const { profileTherapistId, closeProfileModal, openBookingModal } = useModal();
  const [therapist, setTherapist] = useState(null);

  useEffect(() => {
    if (profileTherapistId) {
      fetch(`/api/therapists/${profileTherapistId}`)
        .then(r => r.json())
        .then(setTherapist);
    } else {
      setTherapist(null);
    }
  }, [profileTherapistId]);

  if (!profileTherapistId || !therapist) return null;

  const specs = therapist.specialisations.split(',');
  const langs = therapist.languages.split(',');

  function handleBook() {
    closeProfileModal();
    openBookingModal(therapist.id);
  }

  return (
    <div className="modal-overlay" style={{ display: 'flex' }} onClick={closeProfileModal}>
      <div className="modal modal--lg" onClick={e => e.stopPropagation()}>
        <button className="modal__close" onClick={closeProfileModal}>&times;</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
          <div className="therapist-card__avatar" style={{ width: '72px', height: '72px' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M12 12c2.5 0 4.5-2 4.5-4.5S14.5 3 12 3 7.5 5 7.5 7.5 9.5 12 12 12zm0 2c-3 0-9 1.5-9 4.5V21h18v-2.5c0-3-6-4.5-9-4.5z" fill="white"/></svg>
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: 600 }}>{therapist.name}</h2>
            <p style={{ color: 'var(--text-sec)', fontSize: '14px' }}>{therapist.title} &middot; {therapist.accreditation}</p>
            <div className="therapist-card__rating" style={{ marginTop: '4px' }}>
              {'★'.repeat(Math.round(therapist.rating))} <span>{therapist.rating}/5 ({therapist.review_count} reviews)</span>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>About</h4>
          <p style={{ fontSize: '14px', color: 'var(--text-sec)', lineHeight: 1.7 }}>{therapist.bio}</p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>Specialisations</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {specs.map(s => <span key={s} className="tag">{s.trim()}</span>)}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>Languages</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {langs.map(l => <span key={l} className="tag">{l.trim()}</span>)}
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>Session Pricing</h4>
          <div className="therapist-card__pricing" style={{ background: 'var(--bg)', borderRadius: '12px', padding: '16px' }}>
            {therapist.intro_video_price && (
              <div className="therapist-card__price-row">
                <span style={{ color: 'var(--text-sec)', fontSize: '14px' }}>Introductory Video</span>
                <strong>&pound;{therapist.intro_video_price}/{therapist.intro_duration}min</strong>
              </div>
            )}
            {therapist.intro_audio_price && (
              <div className="therapist-card__price-row">
                <span style={{ color: 'var(--text-sec)', fontSize: '14px' }}>Introductory Audio</span>
                <strong>&pound;{therapist.intro_audio_price}/{therapist.intro_duration}min</strong>
              </div>
            )}
            <div className="therapist-card__price-row">
              <span style={{ color: 'var(--text-sec)', fontSize: '14px' }}>Video Session</span>
              <strong>&pound;{therapist.video_price}/{therapist.video_duration}min</strong>
            </div>
            <div className="therapist-card__price-row">
              <span style={{ color: 'var(--text-sec)', fontSize: '14px' }}>Audio Session</span>
              <strong>&pound;{therapist.audio_price}/{therapist.audio_duration}min</strong>
            </div>
          </div>
        </div>

        <button className="btn btn--primary btn--lg btn--full" onClick={handleBook}>Book a Session</button>
      </div>
    </div>
  );
}
