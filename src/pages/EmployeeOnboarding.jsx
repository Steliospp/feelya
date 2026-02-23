import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/app.css';

const TOPIC_OPTIONS = [
  'Anxiety', 'Depression', 'Stress', 'Burnout', 'Sleep',
  'Relationships', 'Self-esteem', 'Grief & Loss', 'Trauma',
  'Work-life Balance', 'Anger', 'Loneliness', 'Motivation',
  'Confidence', 'Mindfulness', 'Career Guidance',
];

const PREFERENCE_OPTIONS = {
  format: [
    { key: 'video', label: 'Video call' },
    { key: 'audio', label: 'Audio only' },
    { key: 'no_pref', label: 'No preference' },
  ],
  time: [
    { key: 'morning', label: 'Morning (9–12)' },
    { key: 'afternoon', label: 'Afternoon (12–5)' },
    { key: 'evening', label: 'Evening (5–8)' },
    { key: 'any', label: 'Any time' },
  ],
  gender: [
    { key: 'no_pref', label: 'No preference' },
    { key: 'male', label: 'Male therapist' },
    { key: 'female', label: 'Female therapist' },
  ],
};

export default function EmployeeOnboarding() {
  const { user, completeOnboarding } = useAuth();
  const [step, setStep] = useState(1);

  // Step 1: Basics
  const [displayName, setDisplayName] = useState(user?.first_name || '');
  const [pronouns, setPronouns] = useState('');

  // Step 2: Topics / goals
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [goalText, setGoalText] = useState('');

  // Step 3: Preferences
  const [prefs, setPrefs] = useState({ format: 'no_pref', time: 'any', gender: 'no_pref' });
  const [triedTherapy, setTriedTherapy] = useState('');

  function toggleTopic(topic) {
    setSelectedTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  }

  function handleComplete() {
    completeOnboarding('EMPLOYEE', user.id, {
      displayName, pronouns, selectedTopics, goalText, prefs, triedTherapy,
    });
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #eef2ff 0%, #fff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 560, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 36 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="14" fill="url(#eolg)"/><path d="M8 14.5C8 14.5 10.5 9 14 9C17.5 9 20 14.5 20 14.5C20 14.5 17.5 20 14 20C10.5 20 8 14.5 8 14.5Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="14" cy="14.5" r="2.5" fill="#fff"/><defs><linearGradient id="eolg" x1="0" y1="0" x2="28" y2="28"><stop stopColor="#6366f1"/><stop offset="1" stopColor="#8b5cf6"/></linearGradient></defs></svg>
          <span style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: 22, fontWeight: 700 }}>feelya</span>
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {[1, 2, 3, 4].map(s => (
            <div key={s} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: step >= s ? 'var(--primary, #6366f1)' : '#e2e8f0',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>

        {/* ──── STEP 1: Basics ──── */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Welcome to Feelya</h2>
              <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.6 }}>Let&rsquo;s personalise your experience. This is private &mdash; your employer will never see your individual answers.</p>
            </div>
            <div style={{ padding: 12, background: '#ecfdf5', borderRadius: 8, border: '1px solid #a7f3d0', fontSize: 13, color: '#065f46' }}>
              <strong>Privacy guarantee:</strong> Your responses are completely confidential. HR only sees anonymised, aggregated trends across the whole organisation &mdash; never individual data.
            </div>
            <div>
              <label className="form-label">What should we call you?</label>
              <input className="form-input" placeholder="First name or nickname" value={displayName} onChange={e => setDisplayName(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Pronouns (optional)</label>
              <select className="form-input" value={pronouns} onChange={e => setPronouns(e.target.value)}>
                <option value="">Prefer not to say</option>
                <option>He/Him</option>
                <option>She/Her</option>
                <option>They/Them</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        )}

        {/* ──── STEP 2: Topics / Goals ──── */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>What would you like support with?</h2>
              <p style={{ fontSize: 15, color: '#64748b' }}>Select any topics that resonate. This helps us match you with the right therapist.</p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {TOPIC_OPTIONS.map(topic => {
                const selected = selectedTopics.includes(topic);
                return (
                  <button
                    key={topic} type="button"
                    onClick={() => toggleTopic(topic)}
                    style={{
                      padding: '8px 16px', borderRadius: 9999, fontSize: 14, fontWeight: 500, cursor: 'pointer',
                      border: selected ? '2px solid #6366f1' : '2px solid #e2e8f0',
                      background: selected ? '#eef2ff' : '#fff',
                      color: selected ? '#4338ca' : '#1e1b4b',
                      transition: 'all 0.15s',
                    }}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>
            <div>
              <label className="form-label">What&rsquo;s your main goal? (optional)</label>
              <textarea
                className="form-textarea"
                placeholder="e.g. I want to manage my work stress better, or I'd like to work through some personal challenges..."
                value={goalText}
                onChange={e => setGoalText(e.target.value)}
                style={{ minHeight: 80, borderRadius: 10, border: '1.5px solid #e2e8f0', padding: '12px 16px', fontSize: 15, fontFamily: 'inherit', width: '100%', resize: 'vertical' }}
              />
            </div>
          </div>
        )}

        {/* ──── STEP 3: Preferences ──── */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Your preferences</h2>
              <p style={{ fontSize: 15, color: '#64748b' }}>Help us find the best fit for you. You can change these anytime.</p>
            </div>

            <div>
              <label className="form-label">Preferred session format</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {PREFERENCE_OPTIONS.format.map(opt => (
                  <button key={opt.key} type="button" onClick={() => setPrefs(p => ({ ...p, format: opt.key }))}
                    style={{
                      flex: 1, padding: '10px 8px', borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                      border: prefs.format === opt.key ? '2px solid #6366f1' : '2px solid #e2e8f0',
                      background: prefs.format === opt.key ? '#eef2ff' : '#fff',
                      color: prefs.format === opt.key ? '#4338ca' : '#1e1b4b',
                      transition: 'all 0.15s',
                    }}
                  >{opt.label}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="form-label">Preferred time of day</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {PREFERENCE_OPTIONS.time.map(opt => (
                  <button key={opt.key} type="button" onClick={() => setPrefs(p => ({ ...p, time: opt.key }))}
                    style={{
                      flex: '1 1 auto', padding: '10px 12px', borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                      border: prefs.time === opt.key ? '2px solid #6366f1' : '2px solid #e2e8f0',
                      background: prefs.time === opt.key ? '#eef2ff' : '#fff',
                      color: prefs.time === opt.key ? '#4338ca' : '#1e1b4b',
                      transition: 'all 0.15s',
                    }}
                  >{opt.label}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="form-label">Therapist gender preference</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {PREFERENCE_OPTIONS.gender.map(opt => (
                  <button key={opt.key} type="button" onClick={() => setPrefs(p => ({ ...p, gender: opt.key }))}
                    style={{
                      flex: 1, padding: '10px 8px', borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                      border: prefs.gender === opt.key ? '2px solid #6366f1' : '2px solid #e2e8f0',
                      background: prefs.gender === opt.key ? '#eef2ff' : '#fff',
                      color: prefs.gender === opt.key ? '#4338ca' : '#1e1b4b',
                      transition: 'all 0.15s',
                    }}
                  >{opt.label}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="form-label">Have you tried therapy before?</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['Yes', 'No', 'Prefer not to say'].map(opt => (
                  <button key={opt} type="button" onClick={() => setTriedTherapy(opt)}
                    style={{
                      flex: 1, padding: '10px 8px', borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                      border: triedTherapy === opt ? '2px solid #6366f1' : '2px solid #e2e8f0',
                      background: triedTherapy === opt ? '#eef2ff' : '#fff',
                      color: triedTherapy === opt ? '#4338ca' : '#1e1b4b',
                      transition: 'all 0.15s',
                    }}
                  >{opt}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ──── STEP 4: Confirm ──── */}
        {step === 4 && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <svg width="56" height="56" viewBox="0 0 48 48" fill="none" style={{ margin: '0 auto 16px', display: 'block' }}>
              <circle cx="24" cy="24" r="22" stroke="#10b981" strokeWidth="3" />
              <path d="M15 24l6 6 12-12" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>You&rsquo;re all set, {displayName || 'there'}!</h2>
            <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.6, maxWidth: 380, margin: '0 auto 16px' }}>
              Your profile is ready. You can start browsing therapists and booking your first session right away.
            </p>
            {selectedTopics.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 16 }}>
                {selectedTopics.map(t => (
                  <span key={t} style={{ padding: '4px 12px', background: '#eef2ff', color: '#4338ca', borderRadius: 9999, fontSize: 13, fontWeight: 500 }}>{t}</span>
                ))}
              </div>
            )}
            <div style={{ padding: 12, background: '#ecfdf5', borderRadius: 8, border: '1px solid #a7f3d0', fontSize: 13, color: '#065f46', textAlign: 'left', marginBottom: 8 }}>
              <strong>Reminder:</strong> Everything you shared is private and confidential. Your employer never sees individual responses.
            </div>
          </div>
        )}

        {/* ──── Navigation ──── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          {step > 1 && step < 4 ? (
            <button className="btn btn--ghost btn--md" type="button" onClick={() => setStep(s => s - 1)}>Back</button>
          ) : <div />}
          {step < 3 && (
            <button className="btn btn--primary btn--md" type="button" onClick={() => setStep(s => s + 1)}
              disabled={step === 1 && !displayName.trim()}
            >
              Continue
            </button>
          )}
          {step === 3 && (
            <button className="btn btn--primary btn--md" type="button" onClick={() => setStep(4)}>
              Complete Setup
            </button>
          )}
          {step === 4 && (
            <button className="btn btn--primary btn--md" type="button" onClick={handleComplete} style={{ margin: '0 auto' }}>
              Start Exploring
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
