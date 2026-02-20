import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

function getPasswordStrength(value) {
  if (value.length === 0) return { text: '', className: 'form-hint' };
  if (value.length < 8) return { text: 'Too short', className: 'form-hint form-hint--weak' };
  if (value.length < 12 || !/[A-Z]/.test(value) || !/[0-9]/.test(value)) return { text: 'Good', className: 'form-hint form-hint--ok' };
  return { text: 'Strong', className: 'form-hint form-hint--strong' };
}

export default function Signup() {
  const [formData, setFormData] = useState({
    companyName: '',
    companySize: '',
    firstName: '',
    lastName: '',
    role: '',
    email: '',
    password: '',
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signup(formData);
      if (result.success) {
        navigate('/app/dashboard');
      } else {
        setError(result.error);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth__left">
        <div className="auth__left-content">
          <Link to="/" className="auth__logo">
            <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="14" fill="url(#lg)" />
              <path d="M8 14.5C8 14.5 10.5 9 14 9C17.5 9 20 14.5 20 14.5C20 14.5 17.5 20 14 20C10.5 20 8 14.5 8 14.5Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="14" cy="14.5" r="2.5" fill="#fff" />
              <defs>
                <linearGradient id="lg" x1="0" y1="0" x2="28" y2="28">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <span>feelya</span>
          </Link>
          <h1 className="auth__hero-title">Empower your team's mental health</h1>
          <p className="auth__hero-sub">Set up your organisation's account in under a minute. Give your employees access to accredited therapists through a secure, private platform.</p>
          <div className="auth__trust-items">
            <div className="auth__trust-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 9V7a5 5 0 0110 0v2m-8 0h6a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2v-5a2 2 0 012-2z" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span>SOC 2 &amp; GDPR compliant</span>
            </div>
            <div className="auth__trust-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M6.5 10l2.5 2.5 5-5" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="10" cy="10" r="8" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
              </svg>
              <span>100% anonymous employee usage</span>
            </div>
            <div className="auth__trust-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2v4m0 8v4m8-8h-4M6 10H2m13.07-5.07l-2.83 2.83M7.76 12.24l-2.83 2.83m0-10.14l2.83 2.83m4.48 4.48l2.83 2.83" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span>Launch in under a week</span>
            </div>
          </div>
        </div>
      </div>
      <div className="auth__right">
        <div className="auth__form-container">
          <h2 className="auth__title">Create your account</h2>
          <p className="auth__subtitle">Set up your organisation and start supporting your team.</p>
          {error && <div className="auth__error">{error}</div>}
          <form className="auth__form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="companyName">Company name</label>
              <input
                className="form-input"
                type="text"
                id="companyName"
                name="companyName"
                placeholder="Acme Corp"
                required
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="companySize">Company size</label>
              <select
                className="form-input"
                id="companySize"
                name="companySize"
                required
                value={formData.companySize}
                onChange={handleChange}
              >
                <option value="" disabled>Select team size</option>
                <option value="1-50">1 – 50 employees</option>
                <option value="51-200">51 – 200 employees</option>
                <option value="201-500">201 – 500 employees</option>
                <option value="501-1000">501 – 1,000 employees</option>
                <option value="1000+">1,000+ employees</option>
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="firstName">First name</label>
                <input
                  className="form-input"
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="lastName">Last name</label>
                <input
                  className="form-input"
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Smith"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="role">Your role</label>
              <select
                className="form-input"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="" disabled>Select your role</option>
                <option value="hr">HR / People</option>
                <option value="ceo">CEO / Founder</option>
                <option value="cfo">CFO / Finance</option>
                <option value="ops">Operations</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Work email</label>
              <input
                className="form-input"
                type="email"
                id="email"
                name="email"
                placeholder="you@company.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="form-input-wrapper">
                <input
                  className="form-input"
                  type="password"
                  id="password"
                  name="password"
                  placeholder="At least 8 characters"
                  required
                  minLength="8"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button type="button" className="form-toggle-pw" onClick={() => {
                  const pw = document.getElementById('password');
                  pw.type = pw.type === 'password' ? 'text' : 'password';
                }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M2.5 10s3-6 7.5-6 7.5 6 7.5 6-3 6-7.5 6S2.5 10 2.5 10z" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
              </div>
              {passwordStrength.text && (
                <div className={passwordStrength.className}>{passwordStrength.text}</div>
              )}
            </div>
            <div className="form-group">
              <label className="form-checkbox">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <span className="form-checkbox__mark"></span>
                <span>I agree to the <a href="#">Terms of Service</a>, <a href="#">Privacy Policy</a>, and <a href="#">Data Processing Agreement</a></span>
              </label>
            </div>
            <button type="submit" className="btn btn--primary btn--lg btn--full" disabled={loading}>
              <span>{loading ? 'Creating account...' : 'Create Organisation Account'}</span>
              {loading && <span className="spinner"></span>}
            </button>
          </form>
          <p className="auth__switch">Already have an account? <Link to="/login">Log in</Link></p>
        </div>
      </div>
    </div>
  );
}
