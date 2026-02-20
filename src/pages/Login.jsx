import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

function redirectForRole(role) {
  if (role === 'SUPER_ADMIN') return '/admin';
  if (role === 'HR_ADMIN') return '/hr';
  return '/app';
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = login(email, password);
      if (result.success) {
        navigate(redirectForRole(result.user.role));
      } else {
        setError(result.error || 'Invalid credentials');
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
          <h1 className="auth__hero-title">Welcome back</h1>
          <p className="auth__hero-sub">Log in to manage your organisation's wellbeing programme, view analytics, or access your therapy sessions.</p>
          <div className="auth__trust-items">
            <div className="auth__trust-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 9V7a5 5 0 0110 0v2m-8 0h6a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2v-5a2 2 0 012-2z" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span>End-to-end encrypted</span>
            </div>
            <div className="auth__trust-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M6.5 10l2.5 2.5 5-5" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="10" cy="10" r="8" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
              </svg>
              <span>BACP &amp; HCPC accredited therapists</span>
            </div>
            <div className="auth__trust-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2v4m0 8v4m8-8h-4M6 10H2m13.07-5.07l-2.83 2.83M7.76 12.24l-2.83 2.83m0-10.14l2.83 2.83m4.48 4.48l2.83 2.83" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span>500+ organisations trust Feelya</span>
            </div>
          </div>

          <div className="auth__demo-hint">
            <div className="auth__demo-hint-title">Demo accounts</div>
            <div className="auth__demo-hint-item"><strong>employee@demo.com</strong> &mdash; Employee</div>
            <div className="auth__demo-hint-item"><strong>hr@demo.com</strong> &mdash; HR Admin</div>
            <div className="auth__demo-hint-item"><strong>admin@feelya.com</strong> &mdash; Super Admin</div>
            <div className="auth__demo-hint-note">Any password works</div>
          </div>
        </div>
      </div>
      <div className="auth__right">
        <div className="auth__form-container">
          <h2 className="auth__title">Log in to your account</h2>
          <p className="auth__subtitle">Enter your credentials to continue</p>
          {error && <div className="auth__error">{error}</div>}
          <form className="auth__form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email address</label>
              <input
                className="form-input"
                type="email"
                id="email"
                name="email"
                placeholder="you@company.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="form-input-wrapper">
                <input
                  className="form-input"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              <span>{loading ? 'Logging in...' : 'Log In'}</span>
              {loading && <span className="spinner"></span>}
            </button>
          </form>
          <p className="auth__switch">Don't have an account? <Link to="/book-demo">Book a demo</Link></p>
        </div>
      </div>
    </div>
  );
}
