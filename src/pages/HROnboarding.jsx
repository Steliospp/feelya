import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/app.css';

const INVITE_METHODS = ['domain', 'code', 'both'];
const NOTIFICATION_DEFAULTS = { weeklyDigest: true, newSignups: true, sessionAlerts: false, monthlyReport: true };

export default function HROnboarding() {
  const { user, completeOnboarding } = useAuth();
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Step 1: Company details (pre-filled, confirm)
  const [company, setCompany] = useState({
    name: user?.companyName || '',
    domain: user?.email?.split('@')[1] || '',
    industry: '',
    size: '51-200',
    hrName: `${user?.first_name || ''} ${user?.last_name || ''}`.trim(),
    hrEmail: user?.email || '',
  });

  // Step 2: Session policy
  const [policy, setPolicy] = useState({
    sessionsPerEmployee: 5,
    sessionsPerQuarter: true,
    rollover: false,
    sessionTypes: ['video', 'audio'],
  });

  // Step 3: Onboarding method
  const [accessMethod, setAccessMethod] = useState('domain');
  const [inviteCode, setInviteCode] = useState('');

  // Step 4: Invite employees
  const [inviteMode, setInviteMode] = useState('link'); // 'link' | 'csv'
  const [linkCopied, setLinkCopied] = useState(false);
  const [csvFileName, setCsvFileName] = useState('');

  // Step 5: Notification defaults
  const [notifications, setNotifications] = useState({ ...NOTIFICATION_DEFAULTS });

  function handleCopyLink() {
    navigator.clipboard?.writeText(`https://app.feelya.com/join/${company.domain}`).catch(() => {});
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  }

  function handleCsvUpload(e) {
    const file = e.target.files?.[0];
    if (file) setCsvFileName(file.name);
  }

  function handleComplete() {
    completeOnboarding('HR_ADMIN', user.id, {
      company,
      policy,
      accessMethod,
      inviteCode,
      notifications,
    });
  }

  function StepIndicator() {
    const labels = ['Company', 'Sessions', 'Access', 'Invite', 'Notifications', 'Complete'];
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 32 }}>
        {labels.map((label, i) => {
          const num = i + 1;
          const done = step > num;
          const active = step === num;
          return (
            <div key={num} style={{ display: 'flex', alignItems: 'center', flex: i < labels.length - 1 ? 1 : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                  background: done || active ? 'var(--primary)' : 'var(--bg)',
                  color: done || active ? '#fff' : 'var(--text-muted)',
                  border: done || active ? 'none' : '2px solid var(--border)',
                }}>
                  {done ? '\u2713' : num}
                </div>
                <span style={{ fontSize: 12, fontWeight: active ? 600 : 400, color: active ? 'var(--text)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>{label}</span>
              </div>
              {i < labels.length - 1 && (
                <div style={{ flex: 1, height: 2, background: done ? 'var(--primary)' : 'var(--border)', margin: '0 8px', borderRadius: 1 }} />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 680, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="14" fill="url(#olg)"/><path d="M8 14.5C8 14.5 10.5 9 14 9C17.5 9 20 14.5 20 14.5C20 14.5 17.5 20 14 20C10.5 20 8 14.5 8 14.5Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="14" cy="14.5" r="2.5" fill="#fff"/><defs><linearGradient id="olg" x1="0" y1="0" x2="28" y2="28"><stop stopColor="#6366f1"/><stop offset="1" stopColor="#8b5cf6"/></linearGradient></defs></svg>
          <span style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: 22, fontWeight: 700 }}>feelya</span>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Set up your organisation</h2>
        <p style={{ fontSize: 14, color: 'var(--text-sec)', marginBottom: 24 }}>Let&rsquo;s get {company.name || 'your company'} ready. This takes about 2 minutes.</p>

        <StepIndicator />

        {/* ──── STEP 1: Company Details ──── */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Confirm your company details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label className="form-label">Company Name</label>
                <input className="form-input" value={company.name} onChange={e => setCompany(c => ({ ...c, name: e.target.value }))} />
              </div>
              <div>
                <label className="form-label">Email Domain</label>
                <input className="form-input" value={company.domain} onChange={e => setCompany(c => ({ ...c, domain: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label className="form-label">Industry</label>
                <select className="form-input" value={company.industry} onChange={e => setCompany(c => ({ ...c, industry: e.target.value }))}>
                  <option value="">Select...</option>
                  <option>Technology</option>
                  <option>Finance</option>
                  <option>Healthcare</option>
                  <option>Legal</option>
                  <option>Education</option>
                  <option>Retail</option>
                  <option>Manufacturing</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="form-label">Company Size</label>
                <select className="form-input" value={company.size} onChange={e => setCompany(c => ({ ...c, size: e.target.value }))}>
                  <option value="1-50">1 – 50</option>
                  <option value="51-200">51 – 200</option>
                  <option value="201-500">201 – 500</option>
                  <option value="501-1000">501 – 1,000</option>
                  <option value="1000+">1,000+</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label className="form-label">HR Contact Name</label>
                <input className="form-input" value={company.hrName} onChange={e => setCompany(c => ({ ...c, hrName: e.target.value }))} />
              </div>
              <div>
                <label className="form-label">HR Contact Email</label>
                <input className="form-input" value={company.hrEmail} readOnly style={{ background: '#f8fafc' }} />
              </div>
            </div>
          </div>
        )}

        {/* ──── STEP 2: Session Policy ──── */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Session policy</h3>
            <p style={{ fontSize: 14, color: 'var(--text-sec)', marginTop: -8 }}>These settings are based on your plan. Contact us to customise.</p>
            <div>
              <label className="form-label">Sessions per employee</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input className="form-input" type="number" min="1" max="20" value={policy.sessionsPerEmployee} readOnly style={{ width: 80, background: '#f8fafc', textAlign: 'center' }} />
                <span style={{ fontSize: 14, color: 'var(--text-sec)' }}>per quarter</span>
              </div>
            </div>
            <div>
              <label className="form-label">Allowed session types</label>
              <div style={{ display: 'flex', gap: 12 }}>
                {['video', 'audio'].map(t => (
                  <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, cursor: 'pointer' }}>
                    <input type="checkbox" checked={policy.sessionTypes.includes(t)} readOnly style={{ accentColor: '#6366f1' }} />
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ padding: 14, background: '#eef2ff', borderRadius: 10, border: '1px solid #e0e7ff', fontSize: 13, color: '#4338ca' }}>
              These are set by your package. To adjust session limits or types, speak to your account manager.
            </div>
          </div>
        )}

        {/* ──── STEP 3: Access Method ──── */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>How should employees join?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { key: 'domain', title: 'Domain auto-join', desc: `Anyone with an @${company.domain} email can sign up automatically.` },
                { key: 'code', title: 'Invite code only', desc: 'Employees need a code to register. You control who gets access.' },
                { key: 'both', title: 'Domain + invite code', desc: 'Employees need both the right domain and a code.' },
              ].map(opt => (
                <div
                  key={opt.key}
                  onClick={() => setAccessMethod(opt.key)}
                  style={{
                    padding: 16, borderRadius: 10, cursor: 'pointer',
                    border: accessMethod === opt.key ? '2px solid var(--primary)' : '2px solid var(--border)',
                    background: accessMethod === opt.key ? '#eef2ff' : '#fff',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%', border: accessMethod === opt.key ? '5px solid var(--primary)' : '2px solid var(--border)',
                      background: accessMethod === opt.key ? '#fff' : '#fff', flexShrink: 0,
                    }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{opt.title}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-sec)' }}>{opt.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {(accessMethod === 'code' || accessMethod === 'both') && (
              <div>
                <label className="form-label">Invite Code</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input className="form-input" placeholder="e.g. ACME-2026" value={inviteCode} onChange={e => setInviteCode(e.target.value)} style={{ flex: 1 }} />
                  <button className="btn btn--outline btn--sm" type="button" onClick={() => {
                    const prefix = company.name.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 4) || 'CODE';
                    setInviteCode(`${prefix}-${new Date().getFullYear()}`);
                  }}>Generate</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ──── STEP 4: Invite Employees ──── */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Invite your team</h3>
            <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
              <button className={`btn ${inviteMode === 'link' ? 'btn--primary' : 'btn--outline'} btn--sm`} type="button" onClick={() => setInviteMode('link')}>Share Link</button>
              <button className={`btn ${inviteMode === 'csv' ? 'btn--primary' : 'btn--outline'} btn--sm`} type="button" onClick={() => setInviteMode('csv')}>Upload CSV</button>
            </div>

            {inviteMode === 'link' && (
              <div>
                <label className="form-label">Signup Link</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input className="form-input" readOnly value={`https://app.feelya.com/join/${company.domain}`} style={{ flex: 1, background: '#f8fafc', fontSize: 13 }} />
                  <button className="btn btn--primary btn--sm" type="button" onClick={handleCopyLink}>
                    {linkCopied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Share this link with your team via email, Slack, or your intranet.</p>
              </div>
            )}

            {inviteMode === 'csv' && (
              <div>
                <label className="form-label">Upload employee list</label>
                <div
                  onClick={() => document.getElementById('csv-upload')?.click()}
                  style={{
                    border: '2px dashed var(--border)', borderRadius: 10, padding: '28px 16px', textAlign: 'center',
                    cursor: 'pointer', color: 'var(--text-muted)', transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = ''}
                >
                  {csvFileName ? (
                    <div style={{ color: 'var(--text)', fontWeight: 500 }}>{csvFileName}</div>
                  ) : (
                    <>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ marginBottom: 6 }}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>Click to upload CSV</div>
                      <div style={{ fontSize: 11, marginTop: 2 }}>Columns: name, email</div>
                    </>
                  )}
                </div>
                <input id="csv-upload" type="file" accept=".csv" onChange={handleCsvUpload} style={{ display: 'none' }} />
              </div>
            )}

            <div style={{ padding: 12, background: '#ecfdf5', borderRadius: 8, border: '1px solid #a7f3d0', fontSize: 13, color: '#065f46' }}>
              You can always invite more employees later from the HR dashboard. This step is optional.
            </div>
          </div>
        )}

        {/* ──── STEP 5: Notification Defaults ──── */}
        {step === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Notification preferences</h3>
            <p style={{ fontSize: 14, color: 'var(--text-sec)', marginTop: -8 }}>Choose which updates you&rsquo;d like to receive. You can change these anytime.</p>
            {[
              { key: 'weeklyDigest', label: 'Weekly engagement digest', desc: 'Summary of engagement metrics every Monday.' },
              { key: 'newSignups', label: 'New employee signups', desc: 'Get notified when employees join the platform.' },
              { key: 'sessionAlerts', label: 'Session usage alerts', desc: 'Alert when session utilisation passes 80%.' },
              { key: 'monthlyReport', label: 'Monthly board report', desc: 'Auto-generated PDF report for leadership.' },
            ].map(opt => (
              <label key={opt.key} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12, padding: 14, borderRadius: 10,
                border: '1px solid var(--border)', cursor: 'pointer', transition: 'border-color 0.15s',
              }}>
                <input
                  type="checkbox"
                  checked={notifications[opt.key]}
                  onChange={e => setNotifications(n => ({ ...n, [opt.key]: e.target.checked }))}
                  style={{ accentColor: '#6366f1', width: 18, height: 18, marginTop: 2, flexShrink: 0 }}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{opt.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-sec)' }}>{opt.desc}</div>
                </div>
              </label>
            ))}
          </div>
        )}

        {/* ──── STEP 6: Complete ──── */}
        {step === 6 && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <svg width="56" height="56" viewBox="0 0 48 48" fill="none" style={{ margin: '0 auto 16px', display: 'block' }}>
              <circle cx="24" cy="24" r="22" stroke="#10b981" strokeWidth="3" />
              <path d="M15 24l6 6 12-12" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>You&rsquo;re all set!</h3>
            <p style={{ fontSize: 15, color: 'var(--text-sec)', lineHeight: 1.6, maxWidth: 400, margin: '0 auto 8px' }}>
              {company.name} is ready to go. Your employees can start signing up and booking therapy sessions immediately.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 320, margin: '20px auto', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--text-sec)' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 8l3 3 5-5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Company details confirmed
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--text-sec)' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 8l3 3 5-5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Session policy set — {policy.sessionsPerEmployee} sessions/employee/quarter
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--text-sec)' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 8l3 3 5-5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Access: {accessMethod === 'domain' ? `@${company.domain} auto-join` : accessMethod === 'code' ? 'Invite code only' : 'Domain + invite code'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--text-sec)' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 8l3 3 5-5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Notifications configured
              </div>
            </div>
          </div>
        )}

        {/* ──── Navigation ──── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
          {step > 1 && step < 6 ? (
            <button className="btn btn--ghost btn--md" type="button" onClick={() => setStep(s => s - 1)}>Back</button>
          ) : <div />}
          {step < 5 && (
            <button className="btn btn--primary btn--md" type="button" onClick={() => setStep(s => s + 1)}>
              Continue
            </button>
          )}
          {step === 5 && (
            <button className="btn btn--primary btn--md" type="button" onClick={() => setStep(6)}>
              Finish Setup
            </button>
          )}
          {step === 6 && (
            <button className="btn btn--primary btn--md" type="button" onClick={handleComplete} style={{ margin: '0 auto' }}>
              Go to HR Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
