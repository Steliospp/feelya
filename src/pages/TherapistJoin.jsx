import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const SPECIALITY_OPTIONS = [
  'Anxiety', 'Depression', 'Stress', 'Burnout', 'Trauma & PTSD',
  'Grief & Loss', 'Relationships', 'Self-esteem', 'CBT',
  'Mindfulness', 'Workplace Issues', 'Sleep', 'Anger Management',
  'OCD', 'Eating Disorders', 'Addiction', 'ADHD', 'Couples Therapy',
  'Family Therapy', 'Phobias', 'Personality Disorders',
];

export default function TherapistJoin() {
  const [mode, setMode] = useState('signup'); // 'signup' | 'signin'
  const { login } = useAuth();
  const navigate = useNavigate();

  // Signup state
  const [signupForm, setSignupForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    accreditation: '', accreditationNumber: '',
    specialities: [], password: '', confirmPassword: '',
    agreeTerms: false,
  });
  const [signupSubmitted, setSignupSubmitted] = useState(false);
  const [specDropdownOpen, setSpecDropdownOpen] = useState(false);
  const specRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (specRef.current && !specRef.current.contains(e.target)) {
        setSpecDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function toggleSpeciality(spec) {
    setSignupForm(f => ({
      ...f,
      specialities: f.specialities.includes(spec)
        ? f.specialities.filter(s => s !== spec)
        : [...f.specialities, spec],
    }));
  }

  function removeSpeciality(spec) {
    setSignupForm(f => ({ ...f, specialities: f.specialities.filter(s => s !== spec) }));
  }

  // Signin state
  const [signinEmail, setSigninEmail] = useState('');
  const [signinPassword, setSigninPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSignupField(key, val) {
    setSignupForm(f => ({ ...f, [key]: val }));
  }

  function handleSignupSubmit(e) {
    e.preventDefault();
    setSignupSubmitted(true);
  }

  function handleSigninSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = login(signinEmail, signinPassword);
      if (result.success) {
        navigate(result.user.role === 'THERAPIST' ? '/therapist' : '/therapist');
      } else {
        setError(result.error || 'Invalid credentials');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const signupValid = signupForm.firstName.trim() && signupForm.lastName.trim() &&
    signupForm.email.trim() && signupForm.accreditation &&
    signupForm.specialities.length > 0 &&
    signupForm.password.length >= 8 && signupForm.password === signupForm.confirmPassword &&
    signupForm.agreeTerms;

  return (
    <div className="auth">
      <div className="auth__left">
        <div className="auth__left-content">
          <Link to="/" className="auth__logo">
            <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="14" fill="url(#lg2)" />
              <path d="M8 14.5C8 14.5 10.5 9 14 9C17.5 9 20 14.5 20 14.5C20 14.5 17.5 20 14 20C10.5 20 8 14.5 8 14.5Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="14" cy="14.5" r="2.5" fill="#fff" />
              <defs>
                <linearGradient id="lg2" x1="0" y1="0" x2="28" y2="28">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <span>feelya</span>
          </Link>
          <h1 className="auth__hero-title">
            {mode === 'signup' ? 'Join our therapist network' : 'Welcome back, therapist'}
          </h1>
          <p className="auth__hero-sub">
            {mode === 'signup'
              ? 'Grow your practice by connecting with corporate clients through Feelya. Flexible hours, guaranteed payments, and a dedicated portal to manage your sessions.'
              : 'Sign in to your therapist portal to manage sessions, clients, blogs, and your profile.'}
          </p>
          <div className="auth__trust-items">
            <div className="auth__trust-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M6.5 10l2.5 2.5 5-5" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="10" cy="10" r="8" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
              </svg>
              <span>Steady corporate client referrals</span>
            </div>
            <div className="auth__trust-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 9V7a5 5 0 0110 0v2m-8 0h6a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2v-5a2 2 0 012-2z" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span>Guaranteed on-time payments</span>
            </div>
            <div className="auth__trust-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2v4m0 8v4m8-8h-4M6 10H2m13.07-5.07l-2.83 2.83M7.76 12.24l-2.83 2.83m0-10.14l2.83 2.83m4.48 4.48l2.83 2.83" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span>Flexible schedule &mdash; you choose your hours</span>
            </div>
          </div>

          <div className="auth__demo-hint">
            <div className="auth__demo-hint-title">Demo account</div>
            <div className="auth__demo-hint-item"><strong>therapist@demo.com</strong> &mdash; Therapist</div>
            <div className="auth__demo-hint-note">Any password works</div>
          </div>
        </div>
      </div>

      <div className="auth__right">
        <div className="auth__form-container">
          {/* ─── SIGNUP MODE ─── */}
          {mode === 'signup' && !signupSubmitted && (
            <>
              <h2 className="auth__title">Create your therapist account</h2>
              <p className="auth__subtitle">Fill in your details to apply to join the Feelya therapist network.</p>

              <form className="auth__form" onSubmit={handleSignupSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input className="form-input" placeholder="Sarah" required value={signupForm.firstName} onChange={e => handleSignupField('firstName', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input className="form-input" placeholder="Mitchell" required value={signupForm.lastName} onChange={e => handleSignupField('lastName', e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" placeholder="you@example.com" required value={signupForm.email} onChange={e => handleSignupField('email', e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" type="tel" placeholder="+44 7700 900000" value={signupForm.phone} onChange={e => handleSignupField('phone', e.target.value)} />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Accreditation Body</label>
                    <select className="form-input" required value={signupForm.accreditation} onChange={e => handleSignupField('accreditation', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="BACP">BACP</option>
                      <option value="HCPC">HCPC</option>
                      <option value="UKCP">UKCP</option>
                      <option value="BPS">BPS</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Registration Number</label>
                    <input className="form-input" placeholder="e.g. 123456" value={signupForm.accreditationNumber} onChange={e => handleSignupField('accreditationNumber', e.target.value)} />
                  </div>
                </div>

                <div className="form-group" ref={specRef} style={{ position: 'relative' }}>
                  <label className="form-label">Specialities</label>
                  <div
                    onClick={() => setSpecDropdownOpen(!specDropdownOpen)}
                    style={{
                      width: '100%', minHeight: 46, padding: '8px 12px', border: '1.5px solid var(--border)',
                      borderRadius: 10, background: '#fff', cursor: 'pointer', display: 'flex', flexWrap: 'wrap',
                      gap: 6, alignItems: 'center', transition: 'border-color 0.2s',
                      borderColor: specDropdownOpen ? '#6366f1' : undefined,
                      boxShadow: specDropdownOpen ? '0 0 0 3px rgba(99,102,241,0.1)' : undefined,
                    }}
                  >
                    {signupForm.specialities.length === 0 && (
                      <span style={{ color: '#94a3b8', fontSize: 15 }}>Select your specialities...</span>
                    )}
                    {signupForm.specialities.map(spec => (
                      <span key={spec} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px',
                        background: '#eef2ff', color: '#4338ca', borderRadius: 9999, fontSize: 13, fontWeight: 500,
                      }}>
                        {spec}
                        <button type="button" onClick={e => { e.stopPropagation(); removeSpeciality(spec); }} style={{
                          background: 'none', border: 'none', cursor: 'pointer', color: '#6366f1', fontSize: 15,
                          padding: 0, lineHeight: 1, fontWeight: 700,
                        }}>&times;</button>
                      </span>
                    ))}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: 'auto', flexShrink: 0, transform: specDropdownOpen ? 'rotate(180deg)' : '', transition: 'transform 0.2s' }}>
                      <path d="M4 6l4 4 4-4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {specDropdownOpen && (
                    <div style={{
                      position: 'absolute', zIndex: 50, left: 0, right: 0, marginTop: 4,
                      background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 10,
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)', maxHeight: 220, overflowY: 'auto',
                      padding: '6px 0',
                    }}>
                      {SPECIALITY_OPTIONS.map(spec => {
                        const selected = signupForm.specialities.includes(spec);
                        return (
                          <div
                            key={spec}
                            onClick={() => toggleSpeciality(spec)}
                            style={{
                              padding: '9px 14px', fontSize: 14, cursor: 'pointer', display: 'flex',
                              alignItems: 'center', justifyContent: 'space-between',
                              background: selected ? '#eef2ff' : 'transparent',
                              color: selected ? '#4338ca' : '#1e1b4b', fontWeight: selected ? 600 : 400,
                              transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => { if (!selected) e.currentTarget.style.background = '#f8fafc'; }}
                            onMouseLeave={e => { if (!selected) e.currentTarget.style.background = 'transparent'; }}
                          >
                            {spec}
                            {selected && (
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M4 8l3 3 5-5" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <span style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, display: 'block' }}>
                    {signupForm.specialities.length === 0 ? 'Choose at least one' : `${signupForm.specialities.length} selected`}
                  </span>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input className="form-input" type="password" placeholder="Min 8 characters" required value={signupForm.password} onChange={e => handleSignupField('password', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <input className="form-input" type="password" placeholder="Confirm password" required value={signupForm.confirmPassword} onChange={e => handleSignupField('confirmPassword', e.target.value)} />
                    {signupForm.confirmPassword && signupForm.password !== signupForm.confirmPassword && (
                      <span className="form-hint form-hint--weak">Passwords don&rsquo;t match</span>
                    )}
                  </div>
                </div>

                <label className="form-checkbox">
                  <input type="checkbox" checked={signupForm.agreeTerms} onChange={e => handleSignupField('agreeTerms', e.target.checked)} />
                  I agree to the Terms of Service and Privacy Policy, and confirm I hold a valid UK therapy accreditation.
                </label>

                <button type="submit" className="btn btn--primary btn--lg btn--full" disabled={!signupValid}>
                  Apply to Join Feelya
                </button>
              </form>

              <p className="auth__switch">
                Already a therapist on Feelya? <button type="button" onClick={() => { setMode('signin'); setError(''); }} style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: 600, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit', padding: 0 }}>Sign in here</button>
              </p>
            </>
          )}

          {/* ─── SIGNUP SUBMITTED ─── */}
          {mode === 'signup' && signupSubmitted && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <svg width="56" height="56" viewBox="0 0 48 48" fill="none" style={{ margin: '0 auto 20px', display: 'block' }}>
                <circle cx="24" cy="24" r="22" stroke="#10b981" strokeWidth="3" />
                <path d="M15 24l6 6 12-12" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h2 className="auth__title" style={{ marginBottom: 12 }}>Application Submitted</h2>
              <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.7, maxWidth: 360, margin: '0 auto 24px' }}>
                Thank you, {signupForm.firstName}! Our team will review your application and verify your accreditation. You&rsquo;ll hear from us within 2&ndash;3 business days.
              </p>
              <Link to="/" className="btn btn--primary btn--lg">Back to Home</Link>
            </div>
          )}

          {/* ─── SIGNIN MODE ─── */}
          {mode === 'signin' && (
            <>
              <h2 className="auth__title">Therapist Sign In</h2>
              <p className="auth__subtitle">Enter your credentials to access your therapist portal.</p>

              {error && <div className="auth__error">{error}</div>}

              <form className="auth__form" onSubmit={handleSigninSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="t-email">Email address</label>
                  <input className="form-input" type="email" id="t-email" placeholder="you@example.com" required value={signinEmail} onChange={e => setSigninEmail(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="t-password">Password</label>
                  <div className="form-input-wrapper">
                    <input
                      className="form-input"
                      type={showPassword ? 'text' : 'password'}
                      id="t-password"
                      placeholder="Enter your password"
                      required
                      value={signinPassword}
                      onChange={e => setSigninPassword(e.target.value)}
                    />
                    <button type="button" className="form-toggle-pw" onClick={() => setShowPassword(!showPassword)}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M2.5 10s3-6 7.5-6 7.5 6 7.5 6-3 6-7.5 6S2.5 10 2.5 10z" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </button>
                  </div>
                </div>
                <button type="submit" className="btn btn--primary btn--lg btn--full" disabled={loading}>
                  <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                  {loading && <span className="spinner"></span>}
                </button>
              </form>

              <p className="auth__switch">
                Don&rsquo;t have an account? <button type="button" onClick={() => { setMode('signup'); setError(''); }} style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: 600, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit', padding: 0 }}>Apply to join</button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
