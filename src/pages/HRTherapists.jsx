import { useState } from 'react';
import '../styles/app.css';

const mockTherapists = [
  { id: 1, name: 'Dr. Sarah Mitchell', title: 'Clinical Psychologist', accreditation: 'HCPC', specialisations: 'Anxiety, Depression, Stress, CBT', sessions: 48, rating: 4.9, status: 'active' },
  { id: 2, name: 'Dr. James Cooper', title: 'Counselling Psychologist', accreditation: 'BACP', specialisations: 'Relationships, Trauma, Self-esteem', sessions: 32, rating: 4.8, status: 'active' },
  { id: 3, name: 'Dr. Amara Okafor', title: 'Psychotherapist', accreditation: 'UKCP', specialisations: 'Depression, Cultural Identity, LGBTQ+', sessions: 21, rating: 5.0, status: 'active' },
  { id: 4, name: 'Dr. Michael Chen', title: 'Clinical Psychologist', accreditation: 'HCPC', specialisations: 'OCD, Phobias, Panic Disorder', sessions: 56, rating: 4.7, status: 'active' },
  { id: 5, name: 'Emma Richardson', title: 'Integrative Therapist', accreditation: 'BACP', specialisations: 'Stress, Burnout, Mindfulness', sessions: 29, rating: 4.9, status: 'active' },
  { id: 6, name: 'Dr. Robert Hayes', title: 'Psychiatrist', accreditation: 'HCPC', specialisations: 'Depression, PTSD, Complex Trauma', sessions: 67, rating: 4.8, status: 'paused' },
  { id: 7, name: 'Priya Sharma', title: 'Counsellor', accreditation: 'BACP', specialisations: 'Anxiety, Self-esteem, Young Adults', sessions: 18, rating: 4.9, status: 'active' },
  { id: 8, name: 'Dr. William Foster', title: 'Psychoanalyst', accreditation: 'BPS', specialisations: 'Personality, Childhood Trauma, Identity', sessions: 41, rating: 4.6, status: 'active' },
];

export default function HRTherapists() {
  const [therapists] = useState(mockTherapists);

  const active = therapists.filter(t => t.status === 'active').length;
  const totalSessions = therapists.reduce((sum, t) => sum + t.sessions, 0);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-header__title">Therapists</h1>
        <p className="page-header__subtitle">Manage your company's approved therapist programme. All therapists are licensed professionals.</p>
      </div>

      <div className="org-stats-grid" style={{ marginBottom: 24 }}>
        <div className="org-stat">
          <div className="org-stat__label">Total Therapists</div>
          <div className="org-stat__value">{therapists.length}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Active</div>
          <div className="org-stat__value" style={{ color: 'var(--success)' }}>{active}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Total Sessions Delivered</div>
          <div className="org-stat__value">{totalSessions}</div>
        </div>
      </div>

      <div className="card card--no-hover">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
              <th style={{ padding: '12px 16px', color: 'var(--text-sec)', fontWeight: 600 }}>Therapist</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-sec)', fontWeight: 600 }}>Accreditation</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-sec)', fontWeight: 600 }}>Specialisations</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-sec)', fontWeight: 600 }}>Sessions</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-sec)', fontWeight: 600 }}>Rating</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-sec)', fontWeight: 600 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {therapists.map(t => (
              <tr key={t.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.title}</div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span className="tag">{t.accreditation}</span>
                </td>
                <td style={{ padding: '14px 16px', color: 'var(--text-sec)', fontSize: 13, maxWidth: 200 }}>{t.specialisations}</td>
                <td style={{ padding: '14px 16px', fontWeight: 600 }}>{t.sessions}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ color: 'var(--warning)', fontWeight: 600 }}>{t.rating}</span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span className={`tag ${t.status === 'active' ? 'tag--success' : 'tag--warning'}`}>
                    {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 24, padding: 20, background: 'var(--primary-50)', borderRadius: 'var(--radius)', border: '1px solid var(--primary-100)' }}>
        <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Licensed Professionals Only</div>
        <div style={{ color: 'var(--text-sec)', fontSize: 13, lineHeight: 1.6 }}>
          All therapists on the Feelya platform are licensed, accredited professionals. Session details between employees and therapists remain strictly confidential.
        </div>
      </div>
    </div>
  );
}
