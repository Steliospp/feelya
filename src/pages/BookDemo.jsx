import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import '../styles/auth.css';

const LEADS_KEY = 'feelya_demo_leads';

function loadLeads() {
  try {
    return JSON.parse(localStorage.getItem(LEADS_KEY)) || [];
  } catch { return []; }
}

function saveLead(lead) {
  const leads = loadLeads();
  leads.push(lead);
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
}

export default function BookDemo() {
  const [searchParams] = useSearchParams();
  const planFromUrl = searchParams.get('plan') || '';

  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    teamSize: '',
    planInterest: planFromUrl,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const lead = {
      id: 'lead-' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'new',
      ...form,
    };
    saveLead(lead);
    setSubmitted(true);
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
          <h1 className="auth__hero-title">Book a demo</h1>
          <p className="auth__hero-sub">See how Feelya can support your team's mental health. We'll walk you through the platform and help you find the right plan.</p>
          <div className="auth__trust-items">
            <div className="auth__trust-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M6.5 10l2.5 2.5 5-5" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="10" cy="10" r="8" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
              </svg>
              <span>No commitment required</span>
            </div>
            <div className="auth__trust-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2v4m0 8v4m8-8h-4M6 10H2m13.07-5.07l-2.83 2.83M7.76 12.24l-2.83 2.83m0-10.14l2.83 2.83m4.48 4.48l2.83 2.83" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span>15-minute personalised walkthrough</span>
            </div>
            <div className="auth__trust-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 9V7a5 5 0 0110 0v2m-8 0h6a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2v-5a2 2 0 012-2z" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span>Launch in under a week</span>
            </div>
          </div>
        </div>
      </div>
      <div className="auth__right">
        <div className="auth__form-container">
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ margin: '0 auto 16px', display: 'block' }}>
                <circle cx="24" cy="24" r="22" stroke="#10b981" strokeWidth="3" />
                <path d="M15 24l6 6 12-12" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h2 className="auth__title">Thank you!</h2>
              <p className="auth__subtitle" style={{ marginTop: 8 }}>We've received your request and will be in touch within 24 hours to schedule your demo.</p>
              <Link to="/" className="btn btn--primary btn--lg" style={{ marginTop: 24 }}>Back to Home</Link>
            </div>
          ) : (
            <>
              <h2 className="auth__title">Request a demo</h2>
              <p className="auth__subtitle">Fill in your details and we'll be in touch within 24 hours.</p>
              <form className="auth__form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Your name</label>
                  <input className="form-input" type="text" id="name" name="name" placeholder="John Smith" required value={form.name} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Work email</label>
                  <input className="form-input" type="email" id="email" name="email" placeholder="you@company.com" required value={form.email} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="company">Company name</label>
                  <input className="form-input" type="text" id="company" name="company" placeholder="Acme Corp" required value={form.company} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="teamSize">Team size</label>
                  <select className="form-input" id="teamSize" name="teamSize" required value={form.teamSize} onChange={handleChange}>
                    <option value="" disabled>Select team size</option>
                    <option value="1-50">1 – 50 employees</option>
                    <option value="51-200">51 – 200 employees</option>
                    <option value="201-500">201 – 500 employees</option>
                    <option value="501-1000">501 – 1,000 employees</option>
                    <option value="1000+">1,000+ employees</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="planInterest">Plan interest</label>
                  <select className="form-input" id="planInterest" name="planInterest" value={form.planInterest} onChange={handleChange}>
                    <option value="">Not sure yet</option>
                    <option value="pilot">Pilot — £299/mo</option>
                    <option value="growth">Growth — £799/mo</option>
                    <option value="custom">Custom pricing</option>
                  </select>
                </div>
                <button type="submit" className="btn btn--primary btn--lg btn--full">
                  <span>Book Your Demo</span>
                </button>
              </form>
              <p className="auth__switch">Already have an account? <Link to="/login">Log in</Link></p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
