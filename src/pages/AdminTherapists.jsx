import { useState } from 'react';
import { useToast } from '../components/Toast';
import '../styles/app.css';

const initialTherapists = [
  { id: 1, name: 'Dr. Sarah Mitchell', title: 'Clinical Psychologist', accreditation: 'HCPC', specialisations: 'Anxiety, Depression, Stress, CBT', sessions: 248, rating: 4.9, status: 'live', email: 'sarah.mitchell@email.com', phone: '+44 7700 900123', bank_sort: '20-30-40', bank_account: '****4521', balance_owed: 0, hourlyRate: 85, languages: 'English', yearsExperience: 12 },
  { id: 2, name: 'Dr. James Cooper', title: 'Counselling Psychologist', accreditation: 'BACP', specialisations: 'Relationships, Trauma, Self-esteem', sessions: 189, rating: 4.8, status: 'live', email: 'james.cooper@email.com', phone: '+44 7700 900456', bank_sort: '40-20-10', bank_account: '****8832', balance_owed: 240, hourlyRate: 75, languages: 'English, French', yearsExperience: 9 },
  { id: 3, name: 'Dr. Amara Okafor', title: 'Psychotherapist', accreditation: 'UKCP', specialisations: 'Depression, Cultural Identity, LGBTQ+', sessions: 164, rating: 5.0, status: 'live', email: 'amara.okafor@email.com', phone: '+44 7700 900789', bank_sort: '30-10-50', bank_account: '****6743', balance_owed: 475, hourlyRate: 90, languages: 'English, Yoruba', yearsExperience: 14 },
  { id: 4, name: 'Dr. Michael Chen', title: 'Clinical Psychologist', accreditation: 'HCPC', specialisations: 'OCD, Phobias, Panic Disorder', sessions: 312, rating: 4.7, status: 'live', email: 'michael.chen@email.com', phone: '+44 7700 900321', bank_sort: '10-40-30', bank_account: '****2298', balance_owed: 170, hourlyRate: 80, languages: 'English, Mandarin', yearsExperience: 16 },
  { id: 5, name: 'Emma Richardson', title: 'Integrative Therapist', accreditation: 'BACP', specialisations: 'Stress, Burnout, Mindfulness', sessions: 98, rating: 4.9, status: 'live', email: 'emma.r@email.com', phone: '+44 7700 900654', bank_sort: '50-20-10', bank_account: '****9912', balance_owed: 0, hourlyRate: 65, languages: 'English', yearsExperience: 5 },
  { id: 6, name: 'Dr. Robert Hayes', title: 'Psychiatrist', accreditation: 'HCPC', specialisations: 'Depression, PTSD, Complex Trauma', sessions: 267, rating: 4.8, status: 'paused', email: 'robert.hayes@email.com', phone: '+44 7700 900987', bank_sort: '20-50-30', bank_account: '****3341', balance_owed: 720, hourlyRate: 110, languages: 'English', yearsExperience: 20 },
  { id: 7, name: 'Priya Sharma', title: 'Counsellor', accreditation: 'BACP', specialisations: 'Anxiety, Self-esteem, Young Adults', sessions: 72, rating: 4.9, status: 'live', email: 'priya.s@email.com', phone: '+44 7700 900111', bank_sort: '30-40-20', bank_account: '****7765', balance_owed: 130, hourlyRate: 60, languages: 'English, Hindi', yearsExperience: 4 },
  { id: 8, name: 'Dr. William Foster', title: 'Psychoanalyst', accreditation: 'BPS', specialisations: 'Personality, Childhood Trauma, Identity', sessions: 201, rating: 4.6, status: 'live', email: 'william.f@email.com', phone: '+44 7700 900222', bank_sort: '40-10-50', bank_account: '****5543', balance_owed: 0, hourlyRate: 95, languages: 'English', yearsExperience: 18 },
  // Pending approval — full onboarding data
  {
    id: 101, name: 'Dr. Olivia Grant', title: 'Clinical Psychologist', accreditation: 'HCPC',
    specialisations: 'Eating Disorders, Body Image, Anxiety', sessions: 0, rating: null,
    status: 'pending', email: 'olivia.grant@email.com', phone: '+44 7700 900333',
    bank_sort: '', bank_account: '', balance_owed: 0, applied: '2026-02-20',
    // Onboarding profile data
    bio: 'I specialise in eating disorders and body image issues, with 10 years of experience in both NHS and private practice. My approach combines CBT with compassion-focused therapy to help clients build a healthier relationship with food and their bodies.',
    languages: 'English, Spanish', yearsExperience: 10, hourlyRate: 85,
    legalName: 'Olivia Jane Grant', dob: '1988-03-15', address: '42 Harley Street, London W1G 9PR',
    registrationId: 'PYL35821', membershipType: 'Chartered', certFileName: 'hcpc_cert_grant.pdf',
    idFileName: 'passport_grant.jpg', insuranceProvider: 'Hiscox', insuranceExpiry: '2027-01-15',
    stripeConnected: true, adminNotes: [],
  },
  {
    id: 102, name: 'Tom Reynolds', title: 'Counsellor', accreditation: 'BACP',
    specialisations: 'Addiction, Recovery, Relationships', sessions: 0, rating: null,
    status: 'pending', email: 'tom.reynolds@email.com', phone: '+44 7700 900444',
    bank_sort: '', bank_account: '', balance_owed: 0, applied: '2026-02-19',
    bio: 'I have worked in addiction recovery services for 7 years. My person-centred approach focuses on building trust and helping clients discover their own pathways to healing and sustained recovery.',
    languages: 'English', yearsExperience: 7, hourlyRate: 65,
    legalName: 'Thomas James Reynolds', dob: '1991-07-22', address: '15 Church Lane, Manchester M2 1HN',
    registrationId: 'MBACP-409821', membershipType: 'Registered Member', certFileName: 'bacp_cert_reynolds.pdf',
    idFileName: 'driving_licence_reynolds.jpg', insuranceProvider: 'Balens', insuranceExpiry: '2026-11-30',
    stripeConnected: true, adminNotes: [],
  },
  {
    id: 103, name: 'Dr. Fatima Al-Rashid', title: 'Psychotherapist', accreditation: 'UKCP',
    specialisations: 'Trauma, Grief, Cross-cultural Therapy', sessions: 0, rating: null,
    status: 'pending', email: 'fatima.ar@email.com', phone: '+44 7700 900555',
    bank_sort: '', bank_account: '', balance_owed: 0, applied: '2026-02-18',
    bio: 'As a bilingual therapist fluent in Arabic and English, I provide culturally sensitive therapy for individuals navigating grief, trauma, and cross-cultural identity challenges. I draw on psychodynamic and narrative therapy techniques.',
    languages: 'English, Arabic', yearsExperience: 13, hourlyRate: 90,
    legalName: 'Fatima Al-Rashid', dob: '1985-11-08', address: '88 Queen Square, Bristol BS1 4NH',
    registrationId: 'UKCP-22891', membershipType: 'Accredited Member', certFileName: 'ukcp_cert_alrashid.pdf',
    idFileName: 'passport_alrashid.jpg', insuranceProvider: 'Hiscox', insuranceExpiry: '2027-03-01',
    stripeConnected: true, adminNotes: [],
  },
  {
    id: 104, name: "Liam O'Brien", title: 'CBT Therapist', accreditation: 'BABCP',
    specialisations: 'Anxiety, Insomnia, Social Phobia', sessions: 0, rating: null,
    status: 'needs_changes', email: 'liam.ob@email.com', phone: '+44 7700 900666',
    bank_sort: '', bank_account: '', balance_owed: 0, applied: '2026-02-15',
    bio: 'I use evidence-based CBT to help clients overcome anxiety-related difficulties including insomnia and social phobia.',
    languages: 'English', yearsExperience: 3, hourlyRate: 55,
    legalName: "Liam Patrick O'Brien", dob: '1994-05-30', address: '7 Castle Road, Birmingham B1 2HR',
    registrationId: 'BABCP-8812', membershipType: 'Accredited Member', certFileName: 'babcp_cert_obrien.pdf',
    idFileName: 'passport_obrien.jpg', insuranceProvider: 'Howden', insuranceExpiry: '2026-08-01',
    stripeConnected: false,
    adminNotes: [
      { date: '2026-02-16', author: 'Jordan Lee', text: 'BABCP registration ID could not be verified. Please re-upload your certificate or provide an updated registration number.' },
    ],
  },
  {
    id: 105, name: 'Rachel Adams', title: 'Art Therapist', accreditation: 'HCPC',
    specialisations: 'Trauma, Children & Young People, Autism', sessions: 0, rating: null,
    status: 'declined', email: 'rachel.a@email.com', phone: '+44 7700 900777',
    bank_sort: '', bank_account: '', balance_owed: 0, applied: '2026-02-10',
    bio: 'Art therapist working primarily with children.',
    languages: 'English', yearsExperience: 2, hourlyRate: 50,
    legalName: 'Rachel Adams', dob: '1996-09-14', address: '3 Oak Drive, Leeds LS1 4AP',
    registrationId: 'AS12345', membershipType: 'Registered Member', certFileName: 'hcpc_cert_adams.pdf',
    idFileName: 'id_adams.jpg', insuranceProvider: '', insuranceExpiry: '',
    stripeConnected: false,
    adminNotes: [
      { date: '2026-02-12', author: 'Jordan Lee', text: 'Application declined: No valid professional indemnity insurance. Stripe not connected. Minimum 3 years experience required for Feelya platform.' },
    ],
  },
];

const tabs = ['live', 'pending', 'needs_changes', 'paused', 'declined'];

const statusColors = {
  live: 'tag--success',
  pending: 'tag--warning',
  needs_changes: 'tag--info',
  paused: '',
  declined: 'tag--danger',
};

const statusLabels = {
  live: 'Live',
  pending: 'Pending',
  needs_changes: 'Needs Changes',
  paused: 'Paused',
  declined: 'Declined',
};

export default function AdminTherapists() {
  const showToast = useToast();
  const [therapists, setTherapists] = useState(initialTherapists);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [search, setSearch] = useState('');

  // Review modal state
  const [reviewModal, setReviewModal] = useState(null); // therapist object when open
  const [reviewTab, setReviewTab] = useState('profile'); // profile | identity | credentials | payment
  const [actionModal, setActionModal] = useState(null); // 'approve' | 'decline' | 'needs_changes' | null
  const [adminComment, setAdminComment] = useState('');

  const filtered = therapists
    .filter(t => t.status === activeTab)
    .filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.specialisations.toLowerCase().includes(search.toLowerCase()));

  function updateStatus(id, newStatus, comment) {
    setTherapists(prev => prev.map(t => {
      if (t.id !== id) return t;
      const notes = [...(t.adminNotes || [])];
      if (comment) {
        notes.push({ date: new Date().toISOString().slice(0, 10), author: 'Jordan Lee', text: comment });
      }
      return { ...t, status: newStatus, adminNotes: notes };
    }));
    setReviewModal(null);
    setActionModal(null);
    setAdminComment('');
    const labels = { live: 'approved and made live', paused: 'paused', declined: 'declined', pending: 'set to pending', needs_changes: 'sent back for changes' };
    showToast(`Therapist ${labels[newStatus]}`);
  }

  function openReview(therapist) {
    setReviewModal(therapist);
    setReviewTab('profile');
    setActionModal(null);
    setAdminComment('');
  }

  const totalOwed = therapists.reduce((s, t) => s + t.balance_owed, 0);
  const pendingCount = therapists.filter(t => t.status === 'pending').length;
  const needsChangesCount = therapists.filter(t => t.status === 'needs_changes').length;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-header__title">Therapists</h1>
        <p className="page-header__subtitle">Review applications, approve therapists, and manage the platform roster.</p>
      </div>

      {/* Stats */}
      <div className="org-stats-grid" style={{ marginBottom: 24 }}>
        <div className="org-stat">
          <div className="org-stat__label">Live</div>
          <div className="org-stat__value" style={{ color: 'var(--success)' }}>{therapists.filter(t => t.status === 'live').length}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Pending Review</div>
          <div className="org-stat__value" style={{ color: '#f59e0b' }}>{pendingCount}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Needs Changes</div>
          <div className="org-stat__value" style={{ color: '#3b82f6' }}>{needsChangesCount}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Balance Owed</div>
          <div className="org-stat__value" style={{ color: totalOwed > 0 ? 'var(--danger)' : 'var(--success)' }}>&pound;{totalOwed.toLocaleString()}</div>
        </div>
      </div>

      {/* Urgent banner */}
      {pendingCount > 0 && (
        <div style={{ padding: '12px 16px', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 10, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span style={{ fontSize: 14, color: '#92400e' }}><strong>{pendingCount} therapist{pendingCount > 1 ? 's' : ''}</strong> waiting for review. Click &ldquo;Review Application&rdquo; to view their full profile and credentials.</span>
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input className="form-input" placeholder="Search therapists by name or specialisation..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 400 }} />
      </div>

      {/* Tabs */}
      <div className="sessions-tabs" style={{ marginBottom: 16 }}>
        {tabs.map(tab => {
          const count = therapists.filter(t => t.status === tab).length;
          return (
            <button key={tab} className={`sessions-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {statusLabels[tab]}
              {(tab === 'pending' || tab === 'needs_changes') && count > 0 ? (
                <span style={{ marginLeft: 6, background: tab === 'pending' ? '#f59e0b' : '#3b82f6', color: '#fff', borderRadius: 9999, padding: '1px 7px', fontSize: 11, fontWeight: 700 }}>{count}</span>
              ) : (
                <span style={{ marginLeft: 6, opacity: 0.7 }}>({count})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__title">No {statusLabels[activeTab].toLowerCase()} therapists</div>
          <div className="empty-state__desc">{search ? 'Try a different search term.' : `No therapists with status "${statusLabels[activeTab]}".`}</div>
        </div>
      ) : (
        <div className="card card--no-hover">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Therapist</th>
                <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Accreditation</th>
                {(activeTab === 'pending' || activeTab === 'needs_changes') && <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Experience</th>}
                {activeTab === 'live' && <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Sessions</th>}
                {activeTab === 'live' && <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Rating</th>}
                {activeTab === 'live' && <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Balance</th>}
                {(activeTab === 'pending' || activeTab === 'needs_changes' || activeTab === 'declined') && <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Applied</th>}
                <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--primary)', cursor: 'pointer' }} onClick={() => openReview(t)}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.title}</div>
                  </td>
                  <td style={{ padding: '12px' }}><span className="tag">{t.accreditation}</span></td>
                  {(activeTab === 'pending' || activeTab === 'needs_changes') && (
                    <td style={{ padding: '12px', fontSize: 13 }}>{t.yearsExperience ? `${t.yearsExperience} yrs` : '—'}</td>
                  )}
                  {activeTab === 'live' && <td style={{ padding: '12px', fontWeight: 600 }}>{t.sessions}</td>}
                  {activeTab === 'live' && (
                    <td style={{ padding: '12px' }}>
                      {t.rating ? <span style={{ color: 'var(--warning)', fontWeight: 600 }}>{t.rating}</span> : '—'}
                    </td>
                  )}
                  {activeTab === 'live' && (
                    <td style={{ padding: '12px', fontWeight: 600, color: t.balance_owed > 0 ? 'var(--danger)' : 'var(--success)' }}>
                      {t.balance_owed > 0 ? `£${t.balance_owed}` : 'Settled'}
                    </td>
                  )}
                  {(activeTab === 'pending' || activeTab === 'needs_changes' || activeTab === 'declined') && (
                    <td style={{ padding: '12px', color: 'var(--text-sec)', fontSize: 13 }}>{t.applied}</td>
                  )}
                  <td style={{ padding: '12px' }}>
                    <span className={`tag ${statusColors[t.status]}`}>{statusLabels[t.status]}</span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {(t.status === 'pending' || t.status === 'needs_changes') && (
                        <button className="btn btn--primary btn--xs" onClick={() => openReview(t)}>Review Application</button>
                      )}
                      {t.status === 'live' && (
                        <button className="btn btn--outline btn--xs" onClick={() => updateStatus(t.id, 'paused')}>Pause</button>
                      )}
                      {t.status === 'paused' && (
                        <button className="btn btn--primary btn--xs" onClick={() => updateStatus(t.id, 'live')}>Make Live</button>
                      )}
                      {t.status === 'declined' && (
                        <button className="btn btn--outline btn--xs" onClick={() => updateStatus(t.id, 'pending')}>Reconsider</button>
                      )}
                      <button className="btn btn--ghost btn--xs" onClick={() => openReview(t)}>View</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ──── Full Application Review Modal ──── */}
      {reviewModal && !actionModal && (
        <div className="modal-overlay" onClick={() => setReviewModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 720, maxHeight: '90vh', overflow: 'auto' }}>
            <button className="modal__close" onClick={() => setReviewModal(null)}>&times;</button>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
                {reviewModal.name.charAt(0)}
              </div>
              <div>
                <h3 className="modal__title" style={{ marginBottom: 2 }}>{reviewModal.name}</h3>
                <div style={{ fontSize: 13, color: 'var(--text-sec)' }}>
                  {reviewModal.title} &middot; {reviewModal.email}
                  <span className={`tag ${statusColors[reviewModal.status]}`} style={{ marginLeft: 8, fontSize: 11, padding: '2px 8px' }}>{statusLabels[reviewModal.status]}</span>
                </div>
              </div>
            </div>

            {/* Review Tabs */}
            <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid var(--border-light)', marginBottom: 20 }}>
              {[
                { key: 'profile', label: 'Profile' },
                { key: 'identity', label: 'Identity' },
                { key: 'credentials', label: 'Credentials' },
                { key: 'payment', label: 'Payment' },
                { key: 'notes', label: `Notes${(reviewModal.adminNotes || []).length > 0 ? ` (${reviewModal.adminNotes.length})` : ''}` },
              ].map(tab => (
                <button key={tab.key} type="button" onClick={() => setReviewTab(tab.key)}
                  style={{
                    padding: '10px 18px', fontSize: 13, fontWeight: reviewTab === tab.key ? 600 : 400, cursor: 'pointer',
                    border: 'none', background: 'none', color: reviewTab === tab.key ? 'var(--primary)' : 'var(--text-sec)',
                    borderBottom: reviewTab === tab.key ? '2px solid var(--primary)' : '2px solid transparent',
                    marginBottom: -2, transition: 'all 0.15s',
                  }}
                >{tab.label}</button>
              ))}
            </div>

            {/* ── Profile Tab ── */}
            {reviewTab === 'profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {reviewModal.bio && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>Bio</div>
                    <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-sec)', padding: 14, background: 'var(--bg)', borderRadius: 8 }}>{reviewModal.bio}</div>
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Specialisations</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {reviewModal.specialisations.split(', ').map(s => (
                        <span key={s} style={{ padding: '2px 8px', background: '#eef2ff', color: '#4338ca', borderRadius: 9999, fontSize: 11, fontWeight: 500 }}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Languages</div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{reviewModal.languages || 'English'}</div>
                  </div>
                  <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Experience</div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{reviewModal.yearsExperience ? `${reviewModal.yearsExperience} years` : 'Not specified'}</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Email</div>
                    <div style={{ fontSize: 14 }}>{reviewModal.email}</div>
                  </div>
                  <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Phone</div>
                    <div style={{ fontSize: 14 }}>{reviewModal.phone}</div>
                  </div>
                </div>
                {reviewModal.applied && (
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Applied on: {reviewModal.applied}</div>
                )}
              </div>
            )}

            {/* ── Identity Tab ── */}
            {reviewTab === 'identity' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {reviewModal.legalName ? (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Legal Name</div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{reviewModal.legalName}</div>
                      </div>
                      <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Date of Birth</div>
                        <div style={{ fontSize: 14 }}>{reviewModal.dob}</div>
                      </div>
                    </div>
                    <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Address</div>
                      <div style={{ fontSize: 14 }}>{reviewModal.address}</div>
                    </div>
                    <div style={{ padding: 14, background: '#eef2ff', borderRadius: 8, border: '1px solid #e0e7ff' }}>
                      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#4338ca', marginBottom: 6 }}>ID Document</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2v6h6M16 13H8m8 4H8m2-8H8" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        <span style={{ fontSize: 14, fontWeight: 500, color: '#4338ca' }}>{reviewModal.idFileName}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>(Click to view in production)</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                    Identity verification data not available for this therapist.
                  </div>
                )}
              </div>
            )}

            {/* ── Credentials Tab ── */}
            {reviewTab === 'credentials' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {reviewModal.registrationId ? (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div style={{ padding: 14, background: '#ecfdf5', borderRadius: 8, border: '1px solid #a7f3d0' }}>
                        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#065f46', marginBottom: 4 }}>Accreditation Body</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#065f46' }}>{reviewModal.accreditation}</div>
                      </div>
                      <div style={{ padding: 14, background: '#ecfdf5', borderRadius: 8, border: '1px solid #a7f3d0' }}>
                        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#065f46', marginBottom: 4 }}>Registration ID</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#065f46', fontFamily: 'monospace' }}>{reviewModal.registrationId}</div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Membership Type</div>
                        <div style={{ fontSize: 14, fontWeight: 500 }}>{reviewModal.membershipType || 'Not specified'}</div>
                      </div>
                      <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Certificate</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="var(--primary)" strokeWidth="1.5"/><path d="M14 2v6h6" stroke="var(--primary)" strokeWidth="1.5"/></svg>
                          <span style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 500 }}>{reviewModal.certFileName || 'Not uploaded'}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Insurance Provider</div>
                        <div style={{ fontSize: 14, fontWeight: 500 }}>{reviewModal.insuranceProvider || 'Not provided'}</div>
                      </div>
                      <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Insurance Expiry</div>
                        <div style={{ fontSize: 14, fontWeight: 500, color: reviewModal.insuranceExpiry ? 'inherit' : 'var(--danger)' }}>
                          {reviewModal.insuranceExpiry || 'Not provided'}
                        </div>
                      </div>
                    </div>

                    {/* Verification checklist */}
                    <div style={{ padding: 14, background: '#fffbeb', borderRadius: 10, border: '1px solid #fde68a' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#92400e', marginBottom: 10 }}>Verification Checklist</div>
                      {[
                        { label: `${reviewModal.accreditation} registration verified`, done: reviewModal.status === 'live' },
                        { label: 'Certificate document uploaded', done: !!reviewModal.certFileName },
                        { label: 'ID document uploaded', done: !!reviewModal.idFileName },
                        { label: 'Professional indemnity insurance', done: !!reviewModal.insuranceProvider && !!reviewModal.insuranceExpiry },
                        { label: 'Stripe payment connected', done: reviewModal.stripeConnected },
                      ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <div style={{
                            width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: item.done ? '#10b981' : '#e2e8f0', color: '#fff', fontSize: 10, fontWeight: 700,
                          }}>
                            {item.done ? '\u2713' : ''}
                          </div>
                          <span style={{ fontSize: 13, color: item.done ? '#065f46' : '#92400e' }}>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                    Credential data not available for this therapist.
                  </div>
                )}
              </div>
            )}

            {/* ── Payment Tab ── */}
            {reviewTab === 'payment' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ padding: 14, background: 'var(--bg)', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Hourly Rate</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--primary)' }}>&pound;{reviewModal.hourlyRate || '—'}<span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-sec)' }}>/hr</span></div>
                  </div>
                  <div style={{ padding: 14, background: 'var(--bg)', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Stripe Status</div>
                    {reviewModal.stripeConnected ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="#10b981"/><path d="M6.5 10l2.5 2.5 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#065f46' }}>Connected</span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="#ef4444"/><path d="M7 7l6 6m0-6l-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#dc2626' }}>Not connected</span>
                      </div>
                    )}
                  </div>
                </div>
                {reviewModal.bank_sort && (
                  <div style={{ padding: 16, background: '#fef3c7', borderRadius: 10, border: '1px solid #fde68a' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', color: '#92400e', marginBottom: 8 }}>Bank Details</div>
                    <div style={{ display: 'flex', gap: 24, fontSize: 14 }}>
                      <div><span style={{ color: '#92400e' }}>Sort Code: </span><strong>{reviewModal.bank_sort}</strong></div>
                      <div><span style={{ color: '#92400e' }}>Account: </span><strong>{reviewModal.bank_account}</strong></div>
                    </div>
                    {reviewModal.balance_owed > 0 && (
                      <div style={{ marginTop: 8, fontSize: 14 }}>
                        <span style={{ color: '#92400e' }}>Balance Owed: </span>
                        <strong style={{ color: '#dc2626' }}>&pound;{reviewModal.balance_owed}</strong>
                      </div>
                    )}
                  </div>
                )}
                <div style={{ padding: 12, background: '#eef2ff', borderRadius: 8, border: '1px solid #e0e7ff', fontSize: 13, color: '#4338ca' }}>
                  Feelya takes a 15% platform fee. The therapist receives 85% of each session fee, paid via Stripe.
                </div>
              </div>
            )}

            {/* ── Notes Tab ── */}
            {reviewTab === 'notes' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {(reviewModal.adminNotes || []).length === 0 ? (
                  <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                    No admin notes yet. Notes will appear here when you approve, decline, or request changes.
                  </div>
                ) : (
                  (reviewModal.adminNotes || []).map((note, i) => (
                    <div key={i} style={{ padding: 14, background: 'var(--bg)', borderRadius: 8, borderLeft: '3px solid var(--primary)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)' }}>{note.author}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{note.date}</span>
                      </div>
                      <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-sec)' }}>{note.text}</div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ── Action Buttons ── */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
              <span className={`tag ${statusColors[reviewModal.status]}`} style={{ fontSize: 13, padding: '6px 14px' }}>
                {statusLabels[reviewModal.status]}
              </span>
              <div style={{ flex: 1 }} />

              {(reviewModal.status === 'pending' || reviewModal.status === 'needs_changes') && (
                <>
                  <button className="btn btn--primary btn--sm" onClick={() => { setActionModal('approve'); setAdminComment(''); }}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ marginRight: 6 }}><path d="M6.5 10l2.5 2.5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Approve &amp; Go Live
                  </button>
                  <button className="btn btn--outline btn--sm" style={{ borderColor: '#3b82f6', color: '#3b82f6' }} onClick={() => { setActionModal('needs_changes'); setAdminComment(''); }}>
                    Needs Changes
                  </button>
                  <button className="btn btn--danger-outline btn--sm" onClick={() => { setActionModal('decline'); setAdminComment(''); }}>
                    Decline
                  </button>
                </>
              )}
              {reviewModal.status === 'live' && (
                <button className="btn btn--outline btn--sm" onClick={() => updateStatus(reviewModal.id, 'paused')}>Pause Therapist</button>
              )}
              {reviewModal.status === 'paused' && (
                <button className="btn btn--primary btn--sm" onClick={() => updateStatus(reviewModal.id, 'live')}>Make Live</button>
              )}
              {reviewModal.status === 'declined' && (
                <button className="btn btn--outline btn--sm" onClick={() => updateStatus(reviewModal.id, 'pending')}>Reconsider</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ──── Action Confirmation Modal ──── */}
      {actionModal && reviewModal && (
        <div className="modal-overlay" onClick={() => setActionModal(null)} style={{ zIndex: 1001 }}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <button className="modal__close" onClick={() => setActionModal(null)}>&times;</button>

            {actionModal === 'approve' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6.5 10l2.5 2.5 5-5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>Approve {reviewModal.name}?</h3>
                    <p style={{ fontSize: 13, color: 'var(--text-sec)' }}>This will make the therapist live on the platform immediately.</p>
                  </div>
                </div>
                <div style={{ padding: 12, background: '#ecfdf5', borderRadius: 8, border: '1px solid #a7f3d0', fontSize: 13, color: '#065f46', marginBottom: 16 }}>
                  The therapist will receive an email notification that their account is now live. They can start accepting session bookings right away.
                </div>
                <div>
                  <label className="form-label">Admin note (optional)</label>
                  <textarea
                    className="form-textarea"
                    placeholder="e.g. Credentials verified with HCPC. Welcome to Feelya!"
                    value={adminComment}
                    onChange={e => setAdminComment(e.target.value)}
                    style={{ minHeight: 70, borderRadius: 10, border: '1.5px solid #e2e8f0', padding: '10px 14px', fontSize: 14, fontFamily: 'inherit', width: '100%', resize: 'vertical' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
                  <button className="btn btn--ghost btn--sm" onClick={() => setActionModal(null)}>Cancel</button>
                  <button className="btn btn--primary btn--sm" onClick={() => updateStatus(reviewModal.id, 'live', adminComment || `Application approved. Welcome to Feelya, ${reviewModal.name.split(' ')[0]}!`)}>
                    Confirm Approval
                  </button>
                </div>
              </>
            )}

            {actionModal === 'needs_changes' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>Request changes from {reviewModal.name.split(' ')[0]}</h3>
                    <p style={{ fontSize: 13, color: 'var(--text-sec)' }}>The therapist will be notified and can update their application.</p>
                  </div>
                </div>
                <div>
                  <label className="form-label">What needs to change? <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <textarea
                    className="form-textarea"
                    placeholder="e.g. We couldn't verify your registration ID with BACP. Please double-check and re-upload your certificate..."
                    value={adminComment}
                    onChange={e => setAdminComment(e.target.value)}
                    style={{ minHeight: 100, borderRadius: 10, border: '1.5px solid #e2e8f0', padding: '10px 14px', fontSize: 14, fontFamily: 'inherit', width: '100%', resize: 'vertical' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
                  <button className="btn btn--ghost btn--sm" onClick={() => setActionModal(null)}>Cancel</button>
                  <button className="btn btn--primary btn--sm" disabled={!adminComment.trim()} style={{ background: '#3b82f6', borderColor: '#3b82f6' }}
                    onClick={() => updateStatus(reviewModal.id, 'needs_changes', adminComment)}>
                    Send to Therapist
                  </button>
                </div>
              </>
            )}

            {actionModal === 'decline' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 6l8 8m0-8l-8 8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/></svg>
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>Decline {reviewModal.name}?</h3>
                    <p style={{ fontSize: 13, color: 'var(--text-sec)' }}>This will reject the application. The therapist will be notified.</p>
                  </div>
                </div>
                <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8, border: '1px solid #fecaca', fontSize: 13, color: '#991b1b', marginBottom: 16 }}>
                  This action can be reversed by clicking &ldquo;Reconsider&rdquo; on the declined therapists list.
                </div>
                <div>
                  <label className="form-label">Reason for declining <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <textarea
                    className="form-textarea"
                    placeholder="e.g. Insufficient experience for our platform requirements. Missing professional indemnity insurance..."
                    value={adminComment}
                    onChange={e => setAdminComment(e.target.value)}
                    style={{ minHeight: 100, borderRadius: 10, border: '1.5px solid #e2e8f0', padding: '10px 14px', fontSize: 14, fontFamily: 'inherit', width: '100%', resize: 'vertical' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
                  <button className="btn btn--ghost btn--sm" onClick={() => setActionModal(null)}>Cancel</button>
                  <button className="btn btn--danger-outline btn--sm" disabled={!adminComment.trim()}
                    onClick={() => updateStatus(reviewModal.id, 'declined', adminComment)}>
                    Confirm Decline
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
