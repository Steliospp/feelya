import { useState } from 'react';
import { useToast } from '../components/Toast';
import '../styles/app.css';

const initialTherapists = [
  { id: 1, name: 'Dr. Sarah Mitchell', title: 'Clinical Psychologist', accreditation: 'HCPC', specialisations: 'Anxiety, Depression, Stress, CBT', sessions: 248, rating: 4.9, status: 'live', email: 'sarah.mitchell@email.com', phone: '+44 7700 900123', bank_sort: '20-30-40', bank_account: '****4521', balance_owed: 0 },
  { id: 2, name: 'Dr. James Cooper', title: 'Counselling Psychologist', accreditation: 'BACP', specialisations: 'Relationships, Trauma, Self-esteem', sessions: 189, rating: 4.8, status: 'live', email: 'james.cooper@email.com', phone: '+44 7700 900456', bank_sort: '40-20-10', bank_account: '****8832', balance_owed: 240 },
  { id: 3, name: 'Dr. Amara Okafor', title: 'Psychotherapist', accreditation: 'UKCP', specialisations: 'Depression, Cultural Identity, LGBTQ+', sessions: 164, rating: 5.0, status: 'live', email: 'amara.okafor@email.com', phone: '+44 7700 900789', bank_sort: '30-10-50', bank_account: '****6743', balance_owed: 475 },
  { id: 4, name: 'Dr. Michael Chen', title: 'Clinical Psychologist', accreditation: 'HCPC', specialisations: 'OCD, Phobias, Panic Disorder', sessions: 312, rating: 4.7, status: 'live', email: 'michael.chen@email.com', phone: '+44 7700 900321', bank_sort: '10-40-30', bank_account: '****2298', balance_owed: 170 },
  { id: 5, name: 'Emma Richardson', title: 'Integrative Therapist', accreditation: 'BACP', specialisations: 'Stress, Burnout, Mindfulness', sessions: 98, rating: 4.9, status: 'live', email: 'emma.r@email.com', phone: '+44 7700 900654', bank_sort: '50-20-10', bank_account: '****9912', balance_owed: 0 },
  { id: 6, name: 'Dr. Robert Hayes', title: 'Psychiatrist', accreditation: 'HCPC', specialisations: 'Depression, PTSD, Complex Trauma', sessions: 267, rating: 4.8, status: 'paused', email: 'robert.hayes@email.com', phone: '+44 7700 900987', bank_sort: '20-50-30', bank_account: '****3341', balance_owed: 720 },
  { id: 7, name: 'Priya Sharma', title: 'Counsellor', accreditation: 'BACP', specialisations: 'Anxiety, Self-esteem, Young Adults', sessions: 72, rating: 4.9, status: 'live', email: 'priya.s@email.com', phone: '+44 7700 900111', bank_sort: '30-40-20', bank_account: '****7765', balance_owed: 130 },
  { id: 8, name: 'Dr. William Foster', title: 'Psychoanalyst', accreditation: 'BPS', specialisations: 'Personality, Childhood Trauma, Identity', sessions: 201, rating: 4.6, status: 'live', email: 'william.f@email.com', phone: '+44 7700 900222', bank_sort: '40-10-50', bank_account: '****5543', balance_owed: 0 },
  // Pending approval
  { id: 101, name: 'Dr. Olivia Grant', title: 'Clinical Psychologist', accreditation: 'HCPC', specialisations: 'Eating Disorders, Body Image, Anxiety', sessions: 0, rating: null, status: 'pending', email: 'olivia.grant@email.com', phone: '+44 7700 900333', bank_sort: '', bank_account: '', balance_owed: 0, applied: '2026-02-20' },
  { id: 102, name: 'Tom Reynolds', title: 'Counsellor', accreditation: 'BACP', specialisations: 'Addiction, Recovery, Relationships', sessions: 0, rating: null, status: 'pending', email: 'tom.reynolds@email.com', phone: '+44 7700 900444', bank_sort: '', bank_account: '', balance_owed: 0, applied: '2026-02-19' },
  { id: 103, name: 'Dr. Fatima Al-Rashid', title: 'Psychotherapist', accreditation: 'UKCP', specialisations: 'Trauma, Grief, Cross-cultural Therapy', sessions: 0, rating: null, status: 'pending', email: 'fatima.ar@email.com', phone: '+44 7700 900555', bank_sort: '', bank_account: '', balance_owed: 0, applied: '2026-02-18' },
  { id: 104, name: 'Liam O\'Brien', title: 'CBT Therapist', accreditation: 'BABCP', specialisations: 'Anxiety, Insomnia, Social Phobia', sessions: 0, rating: null, status: 'declined', email: 'liam.ob@email.com', phone: '+44 7700 900666', bank_sort: '', bank_account: '', balance_owed: 0, applied: '2026-02-15' },
];

const tabs = ['live', 'pending', 'paused', 'declined'];

const statusColors = {
  live: 'tag--success',
  pending: 'tag--warning',
  paused: '',
  declined: 'tag--danger',
};

export default function AdminTherapists() {
  const showToast = useToast();
  const [therapists, setTherapists] = useState(initialTherapists);
  const [activeTab, setActiveTab] = useState('live');
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = therapists
    .filter(t => t.status === activeTab)
    .filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.specialisations.toLowerCase().includes(search.toLowerCase()));

  function updateStatus(id, newStatus) {
    setTherapists(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    setSelectedTherapist(null);
    const labels = { live: 'made live', paused: 'paused', declined: 'declined', pending: 'set to pending' };
    showToast(`Therapist ${labels[newStatus]}`);
  }

  const totalOwed = therapists.reduce((s, t) => s + t.balance_owed, 0);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-header__title">Therapists</h1>
        <p className="page-header__subtitle">Approve, manage, and monitor all platform therapists.</p>
      </div>

      {/* Stats */}
      <div className="org-stats-grid" style={{ marginBottom: 24 }}>
        <div className="org-stat">
          <div className="org-stat__label">Live</div>
          <div className="org-stat__value" style={{ color: 'var(--success)' }}>{therapists.filter(t => t.status === 'live').length}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Pending Approval</div>
          <div className="org-stat__value" style={{ color: '#f59e0b' }}>{therapists.filter(t => t.status === 'pending').length}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Total Sessions</div>
          <div className="org-stat__value">{therapists.reduce((s, t) => s + t.sessions, 0).toLocaleString()}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Balance Owed</div>
          <div className="org-stat__value" style={{ color: totalOwed > 0 ? 'var(--danger)' : 'var(--success)' }}>£{totalOwed.toLocaleString()}</div>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input className="form-input" placeholder="Search therapists by name or specialisation..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 400 }} />
      </div>

      {/* Tabs */}
      <div className="sessions-tabs" style={{ marginBottom: 16 }}>
        {tabs.map(tab => (
          <button key={tab} className={`sessions-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span style={{ marginLeft: 6, opacity: 0.7 }}>({therapists.filter(t => t.status === tab).length})</span>
          </button>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__title">No {activeTab} therapists</div>
          <div className="empty-state__desc">{search ? 'Try a different search term.' : `No therapists with status "${activeTab}".`}</div>
        </div>
      ) : (
        <div className="card card--no-hover">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Therapist</th>
                <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Accreditation</th>
                <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Sessions</th>
                {activeTab === 'live' && <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Rating</th>}
                {activeTab === 'live' && <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Balance Owed</th>}
                {activeTab === 'pending' && <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Applied</th>}
                <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--primary)', cursor: 'pointer' }} onClick={() => setSelectedTherapist(t)}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.title}</div>
                  </td>
                  <td style={{ padding: '12px' }}><span className="tag">{t.accreditation}</span></td>
                  <td style={{ padding: '12px', fontWeight: 600 }}>{t.sessions}</td>
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
                  {activeTab === 'pending' && (
                    <td style={{ padding: '12px', color: 'var(--text-sec)' }}>{t.applied}</td>
                  )}
                  <td style={{ padding: '12px' }}>
                    <span className={`tag ${statusColors[t.status]}`}>{t.status.charAt(0).toUpperCase() + t.status.slice(1)}</span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {t.status === 'pending' && (
                        <>
                          <button className="btn btn--primary btn--xs" onClick={() => updateStatus(t.id, 'live')}>Accept</button>
                          <button className="btn btn--danger-outline btn--xs" onClick={() => updateStatus(t.id, 'declined')}>Decline</button>
                        </>
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
                      <button className="btn btn--ghost btn--xs" onClick={() => setSelectedTherapist(t)}>View</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selectedTherapist && (
        <div className="modal-overlay" onClick={() => setSelectedTherapist(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
            <button className="modal__close" onClick={() => setSelectedTherapist(null)}>&times;</button>
            <h3 className="modal__title">{selectedTherapist.name}</h3>
            <p style={{ color: 'var(--text-sec)', fontSize: 14, marginBottom: 16 }}>{selectedTherapist.title} &middot; {selectedTherapist.accreditation}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Email</div>
                <div style={{ fontSize: 14 }}>{selectedTherapist.email}</div>
              </div>
              <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Phone</div>
                <div style={{ fontSize: 14 }}>{selectedTherapist.phone}</div>
              </div>
              <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Sessions Delivered</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{selectedTherapist.sessions}</div>
              </div>
              <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Rating</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--warning)' }}>{selectedTherapist.rating || 'N/A'}</div>
              </div>
            </div>

            <div style={{ fontSize: 13, color: 'var(--text-sec)', marginBottom: 16 }}>
              <strong>Specialisations:</strong> {selectedTherapist.specialisations}
            </div>

            {/* Bank Details */}
            <div style={{ padding: 16, background: '#fef3c7', borderRadius: 10, border: '1px solid #fde68a', marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', color: '#92400e', marginBottom: 8 }}>Bank Account</div>
              <div style={{ display: 'flex', gap: 24, fontSize: 14 }}>
                <div>
                  <span style={{ color: '#92400e' }}>Sort Code: </span>
                  <strong>{selectedTherapist.bank_sort || 'Not provided'}</strong>
                </div>
                <div>
                  <span style={{ color: '#92400e' }}>Account: </span>
                  <strong>{selectedTherapist.bank_account || 'Not provided'}</strong>
                </div>
              </div>
              <div style={{ marginTop: 8, fontSize: 14 }}>
                <span style={{ color: '#92400e' }}>Balance Owed: </span>
                <strong style={{ color: selectedTherapist.balance_owed > 0 ? '#dc2626' : '#059669' }}>
                  {selectedTherapist.balance_owed > 0 ? `£${selectedTherapist.balance_owed}` : 'Settled'}
                </strong>
              </div>
            </div>

            {/* Status Actions */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className={`tag ${statusColors[selectedTherapist.status]}`} style={{ fontSize: 14, padding: '6px 14px' }}>
                {selectedTherapist.status.charAt(0).toUpperCase() + selectedTherapist.status.slice(1)}
              </span>
              <div style={{ flex: 1 }} />
              {selectedTherapist.status === 'pending' && (
                <>
                  <button className="btn btn--primary btn--sm" onClick={() => updateStatus(selectedTherapist.id, 'live')}>Accept & Make Live</button>
                  <button className="btn btn--danger-outline btn--sm" onClick={() => updateStatus(selectedTherapist.id, 'declined')}>Decline</button>
                </>
              )}
              {selectedTherapist.status === 'live' && (
                <button className="btn btn--outline btn--sm" onClick={() => updateStatus(selectedTherapist.id, 'paused')}>Pause Therapist</button>
              )}
              {selectedTherapist.status === 'paused' && (
                <button className="btn btn--primary btn--sm" onClick={() => updateStatus(selectedTherapist.id, 'live')}>Make Live</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
