import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/app.css';

const SPECIALITY_OPTIONS = [
  'Anxiety', 'Depression', 'Stress', 'Burnout', 'Trauma & PTSD',
  'Grief & Loss', 'Relationships', 'Self-esteem', 'CBT',
  'Mindfulness', 'Workplace Issues', 'Sleep', 'Anger Management',
  'OCD', 'Eating Disorders', 'Addiction', 'ADHD', 'Couples Therapy',
];

const UK_BODIES = [
  { key: 'BACP', label: 'BACP — British Association for Counselling & Psychotherapy' },
  { key: 'HCPC', label: 'HCPC — Health & Care Professions Council' },
  { key: 'BPS', label: 'BPS — British Psychological Society' },
  { key: 'UKCP', label: 'UKCP — UK Council for Psychotherapy' },
];

const STEP_LABELS = ['Profile', 'Identity', 'Credentials', 'Stripe', 'Submit'];

export default function TherapistOnboarding() {
  const { user, completeOnboarding } = useAuth();
  const [step, setStep] = useState(1);
  const photoRef = useRef(null);
  const idRef = useRef(null);
  const certRef = useRef(null);

  // Step 1: Profile + photo
  const [profile, setProfile] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    bio: '',
    specialities: [],
    languages: 'English',
    yearsExperience: '',
    photoPreview: null,
  });

  // Step 2: Identity
  const [identity, setIdentity] = useState({
    legalName: `${user?.first_name || ''} ${user?.last_name || ''}`.trim(),
    dob: '',
    address: '',
    idFileName: '',
  });

  // Step 3: Credentials
  const [credentials, setCredentials] = useState({
    body: '',
    registrationId: '',
    membershipType: '',
    certFileName: '',
    insuranceProvider: '',
    insuranceExpiry: '',
  });

  // Step 4: Stripe
  const [stripeConnected, setStripeConnected] = useState(false);
  const [hourlyRate, setHourlyRate] = useState('');

  // Submission status
  const [submitted, setSubmitted] = useState(false);

  function toggleSpeciality(spec) {
    setProfile(p => ({
      ...p,
      specialities: p.specialities.includes(spec) ? p.specialities.filter(s => s !== spec) : [...p.specialities, spec],
    }));
  }

  function handlePhotoUpload(e) {
    const file = e.target.files?.[0];
    if (file) setProfile(p => ({ ...p, photoPreview: URL.createObjectURL(file) }));
  }

  function handleIdUpload(e) {
    const file = e.target.files?.[0];
    if (file) setIdentity(i => ({ ...i, idFileName: file.name }));
  }

  function handleCertUpload(e) {
    const file = e.target.files?.[0];
    if (file) setCredentials(c => ({ ...c, certFileName: file.name }));
  }

  function handleSubmitForReview() {
    setSubmitted(true);
    setStep(6);
    completeOnboarding('THERAPIST', user.id, {
      status: 'pending_review',
      profile, identity, credentials, hourlyRate,
    });
  }

  // Validation
  const step1Valid = profile.firstName.trim() && profile.lastName.trim() && profile.bio.trim() && profile.specialities.length > 0;
  const step2Valid = identity.legalName.trim() && identity.dob && identity.idFileName;
  const step3Valid = credentials.body && credentials.registrationId.trim() && credentials.certFileName;
  const step4Valid = stripeConnected && hourlyRate;

  function StepBar() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 28 }}>
        {STEP_LABELS.map((label, i) => {
          const num = i + 1;
          const done = step > num;
          const active = step === num;
          return (
            <div key={num} style={{ display: 'flex', alignItems: 'center', flex: i < STEP_LABELS.length - 1 ? 1 : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                  background: done || active ? 'var(--primary, #6366f1)' : '#f1f5f9',
                  color: done || active ? '#fff' : '#94a3b8',
                  border: done || active ? 'none' : '2px solid #e2e8f0',
                }}>
                  {done ? '\u2713' : num}
                </div>
                <span style={{ fontSize: 12, fontWeight: active ? 600 : 400, color: active ? '#1e1b4b' : '#94a3b8', whiteSpace: 'nowrap' }}>{label}</span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div style={{ flex: 1, height: 2, background: done ? '#6366f1' : '#e2e8f0', margin: '0 8px', borderRadius: 1 }} />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 640, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 36 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="14" fill="url(#tolg)"/><path d="M8 14.5C8 14.5 10.5 9 14 9C17.5 9 20 14.5 20 14.5C20 14.5 17.5 20 14 20C10.5 20 8 14.5 8 14.5Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="14" cy="14.5" r="2.5" fill="#fff"/><defs><linearGradient id="tolg" x1="0" y1="0" x2="28" y2="28"><stop stopColor="#6366f1"/><stop offset="1" stopColor="#8b5cf6"/></linearGradient></defs></svg>
          <span style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: 22, fontWeight: 700 }}>feelya</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#ec4899', background: '#fce7f3', padding: '2px 8px', borderRadius: 9999 }}>Therapist</span>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Complete your therapist profile</h2>
        <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>Once submitted, our team will review and verify your credentials before you go live.</p>

        {step <= 5 && <StepBar />}

        {/* ──── STEP 1: Profile + Photo ──── */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Your profile</h3>

            {/* Photo upload */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                onClick={() => photoRef.current?.click()}
                style={{
                  width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', cursor: 'pointer',
                  background: profile.photoPreview ? 'none' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  border: '3px solid #e2e8f0',
                }}
              >
                {profile.photoPreview ? (
                  <img src={profile.photoPreview} alt="Photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 16a4 4 0 100-8 4 4 0 000 8z" stroke="#fff" strokeWidth="1.5"/><path d="M3 16V8a2 2 0 012-2h1.93a2 2 0 001.66-.9l.82-1.2A2 2 0 0111.07 3h1.86a2 2 0 011.66.9l.82 1.2A2 2 0 0017.07 6H19a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="#fff" strokeWidth="1.5"/></svg>
                )}
              </div>
              <div>
                <button type="button" className="btn btn--outline btn--sm" onClick={() => photoRef.current?.click()}>Upload Photo</button>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>A professional headshot helps build trust.</div>
              </div>
              <input ref={photoRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label className="form-label">First Name</label>
                <input className="form-input" value={profile.firstName} onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))} />
              </div>
              <div>
                <label className="form-label">Last Name</label>
                <input className="form-input" value={profile.lastName} onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))} />
              </div>
            </div>

            <div>
              <label className="form-label">Bio</label>
              <textarea
                className="form-textarea"
                placeholder="Tell clients about your approach, experience, and what they can expect..."
                value={profile.bio}
                onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                style={{ minHeight: 100, borderRadius: 10, border: '1.5px solid #e2e8f0', padding: '12px 16px', fontSize: 14, fontFamily: 'inherit', width: '100%', resize: 'vertical' }}
              />
            </div>

            <div>
              <label className="form-label">Specialities</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {SPECIALITY_OPTIONS.map(spec => {
                  const sel = profile.specialities.includes(spec);
                  return (
                    <button key={spec} type="button" onClick={() => toggleSpeciality(spec)}
                      style={{
                        padding: '6px 14px', borderRadius: 9999, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                        border: sel ? '2px solid #6366f1' : '2px solid #e2e8f0',
                        background: sel ? '#eef2ff' : '#fff', color: sel ? '#4338ca' : '#1e1b4b',
                        transition: 'all 0.15s',
                      }}
                    >{spec}</button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label className="form-label">Languages</label>
                <input className="form-input" value={profile.languages} onChange={e => setProfile(p => ({ ...p, languages: e.target.value }))} />
              </div>
              <div>
                <label className="form-label">Years of Experience</label>
                <input className="form-input" type="number" min="0" placeholder="e.g. 8" value={profile.yearsExperience} onChange={e => setProfile(p => ({ ...p, yearsExperience: e.target.value }))} />
              </div>
            </div>
          </div>
        )}

        {/* ──── STEP 2: Identity ──── */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Identity verification</h3>
            <p style={{ fontSize: 14, color: '#64748b', marginTop: -8 }}>We need to verify your identity for safeguarding. This is kept securely and never shared.</p>

            <div>
              <label className="form-label">Legal Full Name</label>
              <input className="form-input" value={identity.legalName} onChange={e => setIdentity(i => ({ ...i, legalName: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Date of Birth</label>
              <input className="form-input" type="date" value={identity.dob} onChange={e => setIdentity(i => ({ ...i, dob: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Address</label>
              <input className="form-input" placeholder="Full address" value={identity.address} onChange={e => setIdentity(i => ({ ...i, address: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Upload ID Document</label>
              <div
                onClick={() => idRef.current?.click()}
                style={{
                  border: '2px dashed #e2e8f0', borderRadius: 10, padding: '24px 16px', textAlign: 'center',
                  cursor: 'pointer', color: '#94a3b8', transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
              >
                {identity.idFileName ? (
                  <div style={{ color: '#1e1b4b', fontWeight: 500 }}>{identity.idFileName}</div>
                ) : (
                  <>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ marginBottom: 4 }}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <div style={{ fontSize: 13 }}>Passport, driving licence, or national ID</div>
                  </>
                )}
              </div>
              <input ref={idRef} type="file" accept="image/*,.pdf" onChange={handleIdUpload} style={{ display: 'none' }} />
            </div>
          </div>
        )}

        {/* ──── STEP 3: Credentials ──── */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Professional credentials</h3>
            <p style={{ fontSize: 14, color: '#64748b', marginTop: -8 }}>UK-based therapists must be registered with an approved body.</p>

            <div>
              <label className="form-label">Accreditation Body</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {UK_BODIES.map(body => {
                  const sel = credentials.body === body.key;
                  return (
                    <div key={body.key} onClick={() => setCredentials(c => ({ ...c, body: body.key }))}
                      style={{
                        padding: 14, borderRadius: 10, cursor: 'pointer',
                        border: sel ? '2px solid #6366f1' : '2px solid #e2e8f0',
                        background: sel ? '#eef2ff' : '#fff', transition: 'all 0.15s',
                      }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                          border: sel ? '5px solid #6366f1' : '2px solid #e2e8f0', background: '#fff',
                        }} />
                        <span style={{ fontSize: 14, fontWeight: sel ? 600 : 400, color: sel ? '#4338ca' : '#1e1b4b' }}>{body.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label className="form-label">Registration / Membership ID</label>
                <input className="form-input" placeholder="e.g. 123456" value={credentials.registrationId} onChange={e => setCredentials(c => ({ ...c, registrationId: e.target.value }))} />
              </div>
              <div>
                <label className="form-label">Membership Type</label>
                <select className="form-input" value={credentials.membershipType} onChange={e => setCredentials(c => ({ ...c, membershipType: e.target.value }))}>
                  <option value="">Select...</option>
                  <option>Registered Member</option>
                  <option>Accredited Member</option>
                  <option>Fellow</option>
                  <option>Chartered</option>
                </select>
              </div>
            </div>

            <div>
              <label className="form-label">Upload Certificate / Proof of Registration</label>
              <div
                onClick={() => certRef.current?.click()}
                style={{
                  border: '2px dashed #e2e8f0', borderRadius: 10, padding: '24px 16px', textAlign: 'center',
                  cursor: 'pointer', color: '#94a3b8', transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
              >
                {credentials.certFileName ? (
                  <div style={{ color: '#1e1b4b', fontWeight: 500 }}>{credentials.certFileName}</div>
                ) : (
                  <>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ marginBottom: 4 }}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <div style={{ fontSize: 13 }}>PDF, JPG or PNG of your certificate</div>
                  </>
                )}
              </div>
              <input ref={certRef} type="file" accept="image/*,.pdf" onChange={handleCertUpload} style={{ display: 'none' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label className="form-label">Insurance Provider</label>
                <input className="form-input" placeholder="e.g. Hiscox, Balens" value={credentials.insuranceProvider} onChange={e => setCredentials(c => ({ ...c, insuranceProvider: e.target.value }))} />
              </div>
              <div>
                <label className="form-label">Insurance Expiry</label>
                <input className="form-input" type="date" value={credentials.insuranceExpiry} onChange={e => setCredentials(c => ({ ...c, insuranceExpiry: e.target.value }))} />
              </div>
            </div>
          </div>
        )}

        {/* ──── STEP 4: Stripe ──── */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Payment setup</h3>
            <p style={{ fontSize: 14, color: '#64748b', marginTop: -8 }}>Connect your Stripe account to receive payments for sessions.</p>

            <div>
              <label className="form-label">Hourly Rate (&pound;)</label>
              <input className="form-input" type="number" min="20" placeholder="e.g. 80" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} />
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>You can adjust this later. Feelya takes a 15% platform fee.</div>
            </div>

            {!stripeConnected ? (
              <button
                type="button"
                onClick={() => setStripeConnected(true)}
                style={{
                  padding: '16px 24px', borderRadius: 10, border: '2px solid #635bff',
                  background: '#635bff', color: '#fff', fontWeight: 600, fontSize: 15,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.918 3.757 7.11c0 4.46 2.72 5.97 5.603 7.166 2.516.99 3.39 1.738 3.39 2.77 0 .991-.795 1.573-2.277 1.573-1.885 0-4.65-.83-6.717-1.96L2.864 22.1C4.55 23.028 7.41 24 10.497 24c2.624 0 4.77-.622 6.293-1.79C18.399 20.88 19.243 19 19.243 16.668c0-4.59-2.797-6.063-5.267-7.518z" fill="white"/></svg>
                Connect with Stripe
              </button>
            ) : (
              <div style={{ padding: 16, background: '#ecfdf5', borderRadius: 10, border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="#10b981"/><path d="M6.5 10l2.5 2.5 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#065f46' }}>Stripe connected</div>
                  <div style={{ fontSize: 12, color: '#047857' }}>You&rsquo;ll receive payments directly to your Stripe account.</div>
                </div>
              </div>
            )}

            <div style={{ padding: 12, background: '#eef2ff', borderRadius: 8, border: '1px solid #e0e7ff', fontSize: 13, color: '#4338ca' }}>
              Payments are processed securely through Stripe. Feelya never stores your bank details.
            </div>
          </div>
        )}

        {/* ──── STEP 5: Review & Submit ──── */}
        {step === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Review &amp; submit for approval</h3>
            <p style={{ fontSize: 14, color: '#64748b', marginTop: -8 }}>Double-check everything before submitting. Our team will review within 2&ndash;3 business days.</p>

            <div style={{ padding: 16, background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, fontSize: 14 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#94a3b8', marginBottom: 2 }}>Name</div>
                  <div style={{ fontWeight: 600 }}>{profile.firstName} {profile.lastName}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#94a3b8', marginBottom: 2 }}>Accreditation</div>
                  <div style={{ fontWeight: 600 }}>{credentials.body} — {credentials.registrationId}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#94a3b8', marginBottom: 2 }}>Experience</div>
                  <div>{profile.yearsExperience ? `${profile.yearsExperience} years` : 'Not specified'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#94a3b8', marginBottom: 2 }}>Hourly Rate</div>
                  <div style={{ fontWeight: 600 }}>&pound;{hourlyRate}/hr</div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#94a3b8', marginBottom: 4 }}>Specialities</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {profile.specialities.map(s => (
                      <span key={s} style={{ padding: '3px 10px', background: '#eef2ff', color: '#4338ca', borderRadius: 9999, fontSize: 12, fontWeight: 500 }}>{s}</span>
                    ))}
                  </div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#94a3b8', marginBottom: 2 }}>Documents</div>
                  <div style={{ fontSize: 13, color: '#64748b' }}>ID: {identity.idFileName} &middot; Certificate: {credentials.certFileName}</div>
                </div>
              </div>
            </div>

            <div style={{ padding: 14, background: '#fffbeb', borderRadius: 10, border: '1px solid #fde68a', fontSize: 13, color: '#92400e' }}>
              <strong>What happens next:</strong> Our verification team will review your profile, check your credentials with {credentials.body}, and contact you if anything is needed. You&rsquo;ll receive an email once approved.
            </div>
          </div>
        )}

        {/* ──── STEP 6: Submitted / Pending ──── */}
        {step === 6 && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Application submitted</h3>
            <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.6, maxWidth: 400, margin: '0 auto 20px' }}>
              Your profile is now under review. Our team will verify your credentials and get back to you within 2&ndash;3 business days. You&rsquo;ll receive an email at <strong>{user?.email}</strong>.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#fef3c7', borderRadius: 9999, fontSize: 13, fontWeight: 600, color: '#92400e' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Status: Pending Review
            </div>
          </div>
        )}

        {/* ──── Navigation ──── */}
        {step <= 5 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
            {step > 1 ? (
              <button className="btn btn--ghost btn--md" type="button" onClick={() => setStep(s => s - 1)}>Back</button>
            ) : <div />}
            {step < 5 && (
              <button className="btn btn--primary btn--md" type="button" onClick={() => setStep(s => s + 1)}
                disabled={
                  (step === 1 && !step1Valid) || (step === 2 && !step2Valid) ||
                  (step === 3 && !step3Valid) || (step === 4 && !step4Valid)
                }
              >Continue</button>
            )}
            {step === 5 && (
              <button className="btn btn--primary btn--md" type="button" onClick={handleSubmitForReview}>
                Submit for Review
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
