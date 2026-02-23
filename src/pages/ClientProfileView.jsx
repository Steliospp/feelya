import { useParams, useNavigate } from 'react-router-dom';
import { mockSessions } from './TherapistSessions';
import '../styles/app.css';

const mockClientProfiles = {
  'A. Taylor': {
    fullName: 'Alex Taylor',
    initial: 'A',
    email: 'a.taylor@acmecorp.com',
    department: 'Engineering',
    joinedProgramme: 'Oct 2025',
    sessionsCompleted: 12,
    preferredFormat: 'Video',
    onboarding: {
      primaryConcerns: ['Work-related stress', 'Difficulty switching off after work'],
      goals: 'I want to develop better boundaries between work and personal life, and learn techniques to manage stress during high-pressure periods.',
      previousTherapy: 'No previous therapy experience.',
      preferredApproach: 'Open to suggestions, interested in practical techniques.',
      additionalNotes: 'Prefers evening sessions due to work schedule.',
    },
  },
  'M. Johnson': {
    fullName: 'Morgan Johnson',
    initial: 'M',
    email: 'm.johnson@acmecorp.com',
    department: 'Marketing',
    joinedProgramme: 'Nov 2025',
    sessionsCompleted: 8,
    preferredFormat: 'Audio',
    onboarding: {
      primaryConcerns: ['Anxiety', 'Perfectionism'],
      goals: 'I would like to manage my anxiety better, especially around presentations and public speaking at work.',
      previousTherapy: 'Had CBT sessions 2 years ago for 6 months.',
      preferredApproach: 'Previously found CBT helpful. Open to trying other approaches.',
      additionalNotes: 'Sometimes needs to reschedule due to client meetings.',
    },
  },
  'R. Patel': {
    fullName: 'Riya Patel',
    initial: 'R',
    email: 'r.patel@acmecorp.com',
    department: 'Product',
    joinedProgramme: 'Jan 2026',
    sessionsCompleted: 2,
    preferredFormat: 'Video',
    onboarding: {
      primaryConcerns: ['Burnout', 'Imposter syndrome'],
      goals: 'I recently got promoted and I\u2019m struggling with feeling like I don\u2019t deserve it. I also feel very burnt out from the transition period.',
      previousTherapy: 'No previous therapy.',
      preferredApproach: 'No preference \u2013 first time seeking support.',
      additionalNotes: 'New to therapy, may need extra reassurance in early sessions.',
    },
  },
  'S. Williams': {
    fullName: 'Sam Williams',
    initial: 'S',
    email: 's.williams@acmecorp.com',
    department: 'Operations',
    joinedProgramme: 'Sep 2025',
    sessionsCompleted: 16,
    preferredFormat: 'Video',
    onboarding: {
      primaryConcerns: ['Relationship difficulties', 'Low mood'],
      goals: 'Going through a difficult period in my personal relationship and it\u2019s starting to affect my work. Want to talk things through and develop coping strategies.',
      previousTherapy: 'Couples counselling briefly, about a year ago.',
      preferredApproach: 'Person-centred approach preferred. Wants a safe space to talk.',
      additionalNotes: 'Very private person \u2013 confidentiality is extremely important.',
    },
  },
  'J. Brown': {
    fullName: 'Jordan Brown',
    initial: 'J',
    email: 'j.brown@acmecorp.com',
    department: 'Sales',
    joinedProgramme: 'Dec 2025',
    sessionsCompleted: 5,
    preferredFormat: 'Video',
    onboarding: {
      primaryConcerns: ['Performance anxiety', 'Sleep difficulties'],
      goals: 'Struggling to sleep before big sales pitches. Want to learn relaxation techniques and manage the pressure better.',
      previousTherapy: 'No previous therapy.',
      preferredApproach: 'Interested in mindfulness and practical strategies.',
      additionalNotes: 'Travels frequently for work. Flexible with scheduling.',
    },
  },
  'L. Chen': {
    fullName: 'Lin Chen',
    initial: 'L',
    email: 'l.chen@acmecorp.com',
    department: 'Finance',
    joinedProgramme: 'Nov 2025',
    sessionsCompleted: 9,
    preferredFormat: 'Audio',
    onboarding: {
      primaryConcerns: ['Workplace conflict', 'Stress management'],
      goals: 'Having ongoing difficulties with a colleague and it\u2019s causing a lot of stress. Want to develop better coping strategies.',
      previousTherapy: 'Accessed EAP counselling once before.',
      preferredApproach: 'Practical, solution-focused approach preferred.',
      additionalNotes: 'Prefers audio calls \u2013 finds video too formal.',
    },
  },
  'K. Davies': {
    fullName: 'Kim Davies',
    initial: 'K',
    email: 'k.davies@acmecorp.com',
    department: 'HR',
    joinedProgramme: 'Feb 2026',
    sessionsCompleted: 1,
    preferredFormat: 'Video',
    onboarding: {
      primaryConcerns: ['Anxiety', 'Sleep difficulties'],
      goals: 'Recently started experiencing anxiety and it\u2019s new for me. Want to understand what\u2019s happening and get on top of it early.',
      previousTherapy: 'No previous therapy.',
      preferredApproach: 'Open to any approach. Wants to learn about anxiety.',
      additionalNotes: 'Brand new to therapy \u2013 initial assessment completed.',
    },
  },
  'P. Evans': {
    fullName: 'Pat Evans',
    initial: 'P',
    email: 'p.evans@acmecorp.com',
    department: 'Design',
    joinedProgramme: 'Oct 2025',
    sessionsCompleted: 10,
    preferredFormat: 'Video',
    onboarding: {
      primaryConcerns: ['Creative block', 'Self-confidence'],
      goals: 'Feeling creatively stuck and it\u2019s affecting my confidence at work. Want to explore what\u2019s behind this and find ways to move forward.',
      previousTherapy: 'Art therapy, 3 years ago.',
      preferredApproach: 'Integrative approach. Open to creative techniques.',
      additionalNotes: 'Cancelled last session \u2013 check in on how they\u2019re doing.',
    },
  },
};

export function getClientProfile(clientName) {
  return mockClientProfiles[clientName] || null;
}

export default function ClientProfileView() {
  const { clientName } = useParams();
  const navigate = useNavigate();
  const decodedName = decodeURIComponent(clientName);
  const profile = mockClientProfiles[decodedName];

  if (!profile) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-state__title">Client not found</div>
          <p className="empty-state__desc">Could not find a profile for this client.</p>
          <button className="btn btn--primary btn--sm" onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  const clientSessions = mockSessions.filter(s => s.clientName === decodedName);

  return (
    <div className="page">
      <div style={{ marginBottom: 24 }}>
        <button className="btn btn--ghost btn--sm" onClick={() => navigate(-1)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
      </div>

      {/* Header */}
      <div className="profile-header">
        <div className="profile-avatar" style={{ background: 'linear-gradient(135deg, var(--primary), var(--violet))' }}>
          {profile.initial}
        </div>
        <div>
          <div className="profile-info__name">{profile.fullName}</div>
          <div className="profile-info__email">{profile.department}</div>
          <div className="profile-info__since">Member since {profile.joinedProgramme} &middot; {profile.sessionsCompleted} sessions completed &middot; Prefers {profile.preferredFormat}</div>
        </div>
      </div>

      <div className="profile-grid">
        {/* Onboarding Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="tp__section">
            <h3 className="tp__section-title">Primary Concerns</h3>
            <div className="tp__tags">
              {profile.onboarding.primaryConcerns.map(c => (
                <span key={c} className="tag">{c}</span>
              ))}
            </div>
          </div>

          <div className="tp__section">
            <h3 className="tp__section-title">Goals</h3>
            <p className="tp__section-text">{profile.onboarding.goals}</p>
          </div>

          <div className="tp__section">
            <h3 className="tp__section-title">Previous Therapy Experience</h3>
            <p className="tp__section-text">{profile.onboarding.previousTherapy}</p>
          </div>

          <div className="tp__section">
            <h3 className="tp__section-title">Preferred Approach</h3>
            <p className="tp__section-text">{profile.onboarding.preferredApproach}</p>
          </div>

          {profile.onboarding.additionalNotes && (
            <div className="tp__section">
              <h3 className="tp__section-title">Additional Notes</h3>
              <p className="tp__section-text">{profile.onboarding.additionalNotes}</p>
            </div>
          )}
        </div>

        {/* Session History */}
        <div>
          <div className="card card--no-hover">
            <div className="card__title">Session History</div>
            {clientSessions.length === 0 ? (
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>No sessions recorded yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {clientSessions.map(s => (
                  <div key={s.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 16px', background: 'var(--bg)', borderRadius: 'var(--radius)',
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{s.date} at {s.time}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-sec)', marginTop: 2 }}>{s.format} &middot; {s.type} &middot; {s.duration}min</div>
                      {s.notes && (
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, fontStyle: 'italic' }}>{s.notes}</div>
                      )}
                    </div>
                    <span className={`tag ${s.status === 'completed' ? 'tag--success' : s.status === 'cancelled' ? 'tag--danger' : ''}`}>
                      {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginTop: 16, padding: 20, background: '#eef2ff', borderRadius: 12, border: '1px solid #e0e7ff' }}>
            <div style={{ fontWeight: 600, color: '#1e1b4b', marginBottom: 4, fontSize: 13 }}>Privacy Notice</div>
            <div style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6 }}>
              This information was provided by the client during onboarding. It is confidential and intended solely to support your therapeutic work together.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
