import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MOCK_THERAPISTS } from '../lib/therapistData';
import '../styles/app.css';

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00',
];

function generateWeekDays(startOffset = 0) {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(today.getDate() + startOffset * 7);
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}

function isToday(d) {
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

function isPastDay(d) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(d);
  target.setHours(0, 0, 0, 0);
  return target.getTime() < today.getTime();
}

function isSlotPassed(timeStr, date) {
  if (!isToday(date)) return false;
  const [hours, minutes] = timeStr.split(':').map(Number);
  const now = new Date();
  const slotTime = new Date();
  slotTime.setHours(hours, minutes, 0, 0);
  return slotTime <= now;
}

function formatDayLabel(d) {
  if (isToday(d)) return 'Today';
  const today = new Date();
  today.setHours(0,0,0,0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const target = new Date(d);
  target.setHours(0,0,0,0);
  if (target.getTime() === tomorrow.getTime()) return 'Tomorrow';
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

// Simulate some slots being unavailable (deterministic per therapist+date)
function getAvailableSlots(therapistId, dateStr, date) {
  const seed = therapistId + dateStr.split('-').reduce((a, b) => a + parseInt(b), 0);
  return TIME_SLOTS.filter((slot, i) => {
    const hash = ((seed * 31 + i * 17) % 10);
    if (hash >= 7) return false; // ~70% availability
    if (date && isSlotPassed(slot, date)) return false;
    return true;
  });
}

export default function BookSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const therapist = MOCK_THERAPISTS[id];

  const [sessionType, setSessionType] = useState(() => {
    if (therapist?.intro_video_price) return 'intro_video';
    return 'video';
  });
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [booked, setBooked] = useState(false);

  const weekDays = useMemo(() => generateWeekDays(weekOffset * 7), [weekOffset]);

  if (!therapist) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-state__title">Therapist not found</div>
          <button className="btn btn--outline btn--sm" onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  function getPrice() {
    if (sessionType === 'intro_video') return { price: therapist.intro_video_price, duration: therapist.intro_duration, label: 'Introductory Video' };
    if (sessionType === 'intro_audio') return { price: therapist.intro_audio_price, duration: therapist.intro_duration, label: 'Introductory Audio' };
    if (sessionType === 'video') return { price: therapist.video_price, duration: therapist.video_duration, label: 'Video Session' };
    return { price: therapist.audio_price, duration: therapist.audio_duration, label: 'Audio Session' };
  }

  const { price, duration, label: sessionLabel } = getPrice();

  const selectedDateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : null;
  const availableSlots = selectedDateStr ? getAvailableSlots(therapist.id, selectedDateStr, selectedDate) : [];

  function handleConfirm() {
    setBooked(true);
  }

  if (booked) {
    return (
      <div className="page">
        <div className="bk__success">
          <div className="bk__success-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="24" fill="var(--success)" opacity="0.1"/>
              <circle cx="24" cy="24" r="18" fill="var(--success)" opacity="0.2"/>
              <path d="M16 24l5 5 11-11" stroke="var(--success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="bk__success-title">Session Booked!</h2>
          <p className="bk__success-desc">
            Your {sessionLabel.toLowerCase()} with <strong>{therapist.name}</strong> has been confirmed.
          </p>
          <div className="bk__success-details">
            <div className="bk__success-row">
              <span>Date</span>
              <strong>{formatDayLabel(selectedDate)}</strong>
            </div>
            <div className="bk__success-row">
              <span>Time</span>
              <strong>{selectedTime}</strong>
            </div>
            <div className="bk__success-row">
              <span>Duration</span>
              <strong>{duration} minutes</strong>
            </div>
            <div className="bk__success-row">
              <span>Cost</span>
              <strong>&pound;{price}</strong>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
            <button className="btn btn--primary btn--sm" onClick={() => navigate('/app/sessions')}>View Sessions</button>
            <button className="btn btn--outline btn--sm" onClick={() => navigate('/app/therapists')}>Browse Therapists</button>
          </div>
        </div>
      </div>
    );
  }

  const sessionTypes = [];
  if (therapist.intro_video_price) sessionTypes.push({ value: 'intro_video', label: 'Introductory Video', price: therapist.intro_video_price, duration: therapist.intro_duration, icon: 'video' });
  if (therapist.intro_audio_price) sessionTypes.push({ value: 'intro_audio', label: 'Introductory Audio', price: therapist.intro_audio_price, duration: therapist.intro_duration, icon: 'audio' });
  sessionTypes.push({ value: 'video', label: 'Video Session', price: therapist.video_price, duration: therapist.video_duration, icon: 'video' });
  sessionTypes.push({ value: 'audio', label: 'Audio Session', price: therapist.audio_price, duration: therapist.audio_duration, icon: 'audio' });

  return (
    <div className="page">
      <button className="btn btn--ghost btn--sm" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Back
      </button>

      <div className="page-header">
        <h1 className="page-header__title">Book a Session</h1>
        <p className="page-header__subtitle">Choose your session type, date and time</p>
      </div>

      <div className="bk__layout">
        {/* Left: Booking form */}
        <div className="bk__form">
          {/* Therapist info strip */}
          <div className="bk__therapist">
            <div className="bk__therapist-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 12c2.5 0 4.5-2 4.5-4.5S14.5 3 12 3 7.5 5 7.5 7.5 9.5 12 12 12zm0 2c-3 0-9 1.5-9 4.5V21h18v-2.5c0-3-6-4.5-9-4.5z" fill="white"/></svg>
            </div>
            <div>
              <div className="bk__therapist-name">{therapist.name}</div>
              <div className="bk__therapist-title">{therapist.title} &middot; {therapist.accreditation}</div>
            </div>
            <div className="bk__therapist-rating">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="#f59e0b"><path d="M8 1l2.2 4.6L15 6.3l-3.5 3.4.8 4.8L8 12.2 3.7 14.5l.8-4.8L1 6.3l4.8-.7z"/></svg>
              {therapist.rating}
            </div>
          </div>

          {/* Step 1: Session type */}
          <div className="bk__step">
            <div className="bk__step-num">1</div>
            <h3 className="bk__step-title">Choose session type</h3>
          </div>
          <div className="bk__types">
            {sessionTypes.map(st => (
              <button
                key={st.value}
                className={`bk__type ${sessionType === st.value ? 'bk__type--active' : ''}`}
                onClick={() => setSessionType(st.value)}
              >
                <div className="bk__type-icon">
                  {st.icon === 'video' ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="11" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M13 9l5-3v8l-5-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2v12M6 6v8m8-8v8M4 8v4m12-4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  )}
                </div>
                <div className="bk__type-info">
                  <div className="bk__type-label">{st.label}</div>
                  <div className="bk__type-meta">{st.duration}min &middot; &pound;{st.price}</div>
                </div>
                <div className="bk__type-check">
                  {sessionType === st.value && (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="var(--primary)"/><path d="M5.5 9.5l2 2 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Step 2: Select date */}
          <div className="bk__step">
            <div className="bk__step-num">2</div>
            <h3 className="bk__step-title">Select a date</h3>
          </div>
          <div className="bk__date-nav">
            <button className="btn btn--ghost btn--xs" disabled={weekOffset === 0} onClick={() => { setWeekOffset(w => w - 1); setSelectedDate(null); setSelectedTime(null); }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <span className="bk__date-range">
              {weekDays[0].toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} — {weekDays[6].toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
            </span>
            <button className="btn btn--ghost btn--xs" onClick={() => { setWeekOffset(w => w + 1); setSelectedDate(null); setSelectedTime(null); }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
          <div className="bk__dates">
            {weekDays.map(d => {
              const isWeekend = d.getDay() === 0 || d.getDay() === 6;
              const past = isPastDay(d);
              const today = isToday(d);
              const isSelected = selectedDate && d.toDateString() === selectedDate.toDateString();
              const disabled = isWeekend || past;
              return (
                <button
                  key={d.toISOString()}
                  className={`bk__date ${isSelected ? 'bk__date--active' : ''} ${disabled ? 'bk__date--disabled' : ''} ${today && !isSelected ? 'bk__date--today' : ''}`}
                  disabled={disabled}
                  onClick={() => { setSelectedDate(d); setSelectedTime(null); }}
                >
                  <span className="bk__date-day">{today ? 'Today' : d.toLocaleDateString('en-GB', { weekday: 'short' })}</span>
                  <span className="bk__date-num">{d.getDate()}</span>
                </button>
              );
            })}
          </div>

          {/* Step 3: Select time */}
          {selectedDate && (
            <>
              <div className="bk__step">
                <div className="bk__step-num">3</div>
                <h3 className="bk__step-title">Pick a time</h3>
              </div>
              <div className="bk__times">
                {availableSlots.map(t => (
                  <button
                    key={t}
                    className={`bk__time ${selectedTime === t ? 'bk__time--active' : ''}`}
                    onClick={() => setSelectedTime(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right: Summary sidebar */}
        <div className="bk__sidebar">
          <div className="bk__summary">
            <h3 className="bk__summary-title">Booking Summary</h3>

            <div className="bk__summary-row">
              <span>Therapist</span>
              <strong>{therapist.name}</strong>
            </div>
            <div className="bk__summary-row">
              <span>Session Type</span>
              <strong>{sessionLabel}</strong>
            </div>
            <div className="bk__summary-row">
              <span>Date</span>
              <strong>{selectedDate ? formatDayLabel(selectedDate) : '—'}</strong>
            </div>
            <div className="bk__summary-row">
              <span>Time</span>
              <strong>{selectedTime || '—'}</strong>
            </div>
            <div className="bk__summary-divider" />
            <div className="bk__summary-row">
              <span>Duration</span>
              <strong>{duration} min</strong>
            </div>
            <div className="bk__summary-row bk__summary-row--total">
              <span>Session fee</span>
              <strong>&pound;{price}</strong>
            </div>
            {user?.companyName && (
              <div className="bk__summary-row bk__summary-row--covered">
                <span>Covered by</span>
                <strong>{user.companyName}</strong>
              </div>
            )}

            <button
              className="btn btn--primary btn--full btn--lg"
              disabled={!selectedDate || !selectedTime}
              onClick={handleConfirm}
              style={{ marginTop: 20 }}
            >
              Confirm Booking
            </button>
            <p className="bk__cancel-note">Free cancellation up to 48 hours before your session.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
