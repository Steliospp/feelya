import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import { useToast } from './Toast';
import { useAuth } from '../context/AuthContext';

export default function BookingModal() {
  const { bookingTherapistId, closeBookingModal } = useModal();
  const { user } = useAuth();
  const showToast = useToast();
  const outletContext = useOutletContext();
  const [therapist, setTherapist] = useState(null);
  const [sessionType, setSessionType] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('18:00');

  useEffect(() => {
    if (bookingTherapistId) {
      fetch(`/api/therapists/${bookingTherapistId}`)
        .then(r => r.json())
        .then(t => {
          setTherapist(t);
          setSessionType(t.intro_video_price ? 'intro_video' : 'video');
        });
    } else {
      setTherapist(null);
    }
  }, [bookingTherapistId]);

  if (!bookingTherapistId || !therapist) return null;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  function getPrice() {
    if (sessionType === 'intro_video') return { price: therapist.intro_video_price, duration: therapist.intro_duration };
    if (sessionType === 'intro_audio') return { price: therapist.intro_audio_price, duration: therapist.intro_duration };
    if (sessionType === 'video') return { price: therapist.video_price, duration: therapist.video_duration };
    return { price: therapist.audio_price, duration: therapist.audio_duration };
  }

  const { price, duration } = getPrice();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!date) { showToast('Please select a date', 'error'); return; }

    let sType, sFormat;
    if (sessionType === 'intro_video') { sType = 'introductory'; sFormat = 'Video'; }
    else if (sessionType === 'intro_audio') { sType = 'introductory'; sFormat = 'Audio'; }
    else if (sessionType === 'video') { sType = 'regular'; sFormat = 'Video'; }
    else { sType = 'regular'; sFormat = 'Audio'; }

    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ therapistId: therapist.id, sessionType: sType, sessionFormat: sFormat, date, time, duration, price }),
      });
      const data = await res.json();
      if (data.success) {
        closeBookingModal();
        showToast('Session booked successfully!');
        outletContext?.loadNotifCount?.();
      }
    } catch {
      showToast('Failed to book session', 'error');
    }
  }

  return (
    <div className="modal-overlay" style={{ display: 'flex' }} onClick={closeBookingModal}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal__close" onClick={closeBookingModal}>&times;</button>
        <h2 className="modal__title">Book a Session</h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
          <div className="therapist-card__avatar" style={{ width: '48px', height: '48px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 12c2.5 0 4.5-2 4.5-4.5S14.5 3 12 3 7.5 5 7.5 7.5 9.5 12 12 12zm0 2c-3 0-9 1.5-9 4.5V21h18v-2.5c0-3-6-4.5-9-4.5z" fill="white"/></svg>
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{therapist.name}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-sec)' }}>{therapist.title}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Session Type</label>
            <select className="form-input" value={sessionType} onChange={e => setSessionType(e.target.value)}>
              {therapist.intro_video_price && <option value="intro_video">Introductory Video (&pound;{therapist.intro_video_price}/{therapist.intro_duration}min)</option>}
              {therapist.intro_audio_price && <option value="intro_audio">Introductory Audio (&pound;{therapist.intro_audio_price}/{therapist.intro_duration}min)</option>}
              <option value="video">Video Session (&pound;{therapist.video_price}/{therapist.video_duration}min)</option>
              <option value="audio">Audio Session (&pound;{therapist.audio_price}/{therapist.audio_duration}min)</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input className="form-input" type="date" min={minDate} value={date} onChange={e => setDate(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Time</label>
            <select className="form-input" value={time} onChange={e => setTime(e.target.value)}>
              {['09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div style={{ background: 'var(--bg)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-sec)' }}>Session fee</span>
              <span style={{ fontWeight: 700 }}>&pound;{price}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: 'var(--text-sec)' }}>Duration</span>
              <span style={{ fontWeight: 700 }}>{duration} min</span>
            </div>
            {user?.org_name && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-sec)' }}>Covered by</span>
                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{user.org_name}</span>
              </div>
            )}
          </div>

          <button type="submit" className="btn btn--primary btn--lg btn--full">Confirm Booking</button>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '12px' }}>Free cancellation up to 48 hours before your session.</p>
        </form>
      </div>
    </div>
  );
}
