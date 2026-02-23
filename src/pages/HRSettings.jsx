import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/app.css';

export default function HRSettings() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    companyName: user.companyName || 'Acme Corp',
    sessionBudget: '500',
    maxSessionsPerEmployee: '12',
    allowTopicSuggestions: true,
    anonymiseReporting: true,
    notifyNewRegistrations: true,
    notifySessionThreshold: true,
    inviteCode: 'ACME2026',
  });

  function handleSave(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function update(key, value) {
    setSettings(prev => ({ ...prev, [key]: value }));
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-header__title">Settings</h1>
        <p className="page-header__subtitle">Configure your organisation's wellbeing programme settings.</p>
      </div>

      {saved && (
        <div style={{
          padding: '12px 20px',
          background: 'var(--success-bg)',
          color: '#059669',
          borderRadius: 'var(--radius)',
          fontWeight: 500,
          fontSize: 14,
          marginBottom: 24,
        }}>
          Settings saved successfully.
        </div>
      )}

      <form onSubmit={handleSave}>
        <div className="profile-grid">
          <div className="card card--no-hover">
            <div className="card__title">Organisation</div>
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input className="form-input" value={settings.companyName} onChange={e => update('companyName', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Invite Code</label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input className="form-input" value={settings.inviteCode} readOnly style={{ fontFamily: 'monospace', letterSpacing: 2, fontWeight: 600 }} />
                <button type="button" className="btn btn--outline btn--xs" onClick={() => navigator.clipboard?.writeText(settings.inviteCode)}>Copy</button>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Share this code with employees to join your programme.</div>
            </div>
          </div>

          <div className="card card--no-hover">
            <div className="card__title">Session Limits</div>
            <div className="form-group">
              <label className="form-label">Monthly Budget per Employee (£)</label>
              <input className="form-input" type="number" value={settings.sessionBudget} onChange={e => update('sessionBudget', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Max Sessions per Employee (per year)</label>
              <input className="form-input" type="number" value={settings.maxSessionsPerEmployee} onChange={e => update('maxSessionsPerEmployee', e.target.value)} />
            </div>
          </div>

          <div className="card card--no-hover">
            <div className="card__title">Programme Features</div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
                <input type="checkbox" checked={settings.allowTopicSuggestions} onChange={e => update('allowTopicSuggestions', e.target.checked)} style={{ accentColor: 'var(--primary)', width: 18, height: 18 }} />
                Allow employees to suggest workshop topics
              </label>
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
                <input type="checkbox" checked={settings.anonymiseReporting} onChange={e => update('anonymiseReporting', e.target.checked)} style={{ accentColor: 'var(--primary)', width: 18, height: 18 }} />
                Anonymise all employee reporting data
              </label>
            </div>
          </div>

          <div className="card card--no-hover">
            <div className="card__title">Billing</div>
            <div className="form-group">
              <label className="form-label">Current Plan</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="tag tag--success">Professional</span>
                <span style={{ fontSize: 13, color: 'var(--text-sec)' }}>£4.50/employee/month</span>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  padding: '6px 12px',
                  background: 'var(--bg)',
                  borderRadius: 8,
                  fontSize: 13,
                  fontFamily: 'monospace',
                  fontWeight: 600,
                }}>
                  **** **** **** 4242
                </div>
                <button type="button" className="btn btn--ghost btn--xs">Update</button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Next Invoice</label>
              <div style={{ fontSize: 14, color: 'var(--text-sec)' }}>1 Mar 2026 — £{(247 * 4.5).toFixed(2)}</div>
            </div>
          </div>

          <div className="card card--no-hover">
            <div className="card__title">Notifications</div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
                <input type="checkbox" checked={settings.notifyNewRegistrations} onChange={e => update('notifyNewRegistrations', e.target.checked)} style={{ accentColor: 'var(--primary)', width: 18, height: 18 }} />
                Notify when employees register for workshops
              </label>
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
                <input type="checkbox" checked={settings.notifySessionThreshold} onChange={e => update('notifySessionThreshold', e.target.checked)} style={{ accentColor: 'var(--primary)', width: 18, height: 18 }} />
                Alert when session budget is 80% used
              </label>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <button className="btn btn--primary btn--md" type="submit">Save Settings</button>
        </div>
      </form>
    </div>
  );
}
