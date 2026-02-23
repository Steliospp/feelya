import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getWorkshops, updateWorkshop } from '../lib/workshopStore';
import '../styles/app.css';

export default function TherapistWorkshops() {
  const { user } = useAuth();
  const [workshops, setWorkshops] = useState(() => getWorkshops());
  const [activeTab, setActiveTab] = useState('available');

  function refresh() { setWorkshops(getWorkshops()); }

  const available = workshops.filter(w => w.status === 'published');
  const mine = workshops.filter(w => w.therapist?.id === user.therapistId?.toString() || w.therapist?.id === user.id);

  const filtered = activeTab === 'available' ? available : mine;

  function handleClaim(id) {
    updateWorkshop(id, {
      status: 'scheduled',
      therapist: { id: user.id, name: `${user.first_name} ${user.last_name}` },
    });
    refresh();
  }

  function handleDecline(id) {
    // Just remove from published — admin can re-publish
    // For now just do nothing visible (therapist ignores it)
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-header__title">Workshops</h1>
        <p className="page-header__subtitle">Claim available workshops or manage your upcoming workshop sessions.</p>
      </div>

      <div className="sessions-tabs" style={{ marginBottom: 24 }}>
        <button className={`sessions-tab ${activeTab === 'available' ? 'active' : ''}`} onClick={() => setActiveTab('available')}>
          Available ({available.length})
        </button>
        <button className={`sessions-tab ${activeTab === 'mine' ? 'active' : ''}`} onClick={() => setActiveTab('mine')}>
          My Workshops ({mine.length})
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__title">
            {activeTab === 'available' ? 'No workshops available' : 'No claimed workshops yet'}
          </div>
          <p className="empty-state__desc">
            {activeTab === 'available'
              ? 'New workshops will appear here once organisations publish them.'
              : 'Claim an available workshop to get started.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(w => (
            <div className="card card--no-hover" key={w.id} style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 16 }}>{w.title}</span>
                    <span className="tag">{w.category}</span>
                    {w.status === 'scheduled' && <span className="tag tag--success">Scheduled</span>}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-sec)', marginBottom: 8 }}>{w.description}</div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                    <span>{w.companyName}</span>
                    <span>{w.date} at {w.time}</span>
                    <span>{w.duration}min</span>
                    <span>{w.capacity} capacity</span>
                    {w.attendees.length > 0 && <span>{w.attendees.length} registered</span>}
                  </div>
                </div>
                {activeTab === 'available' && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn--primary btn--sm" onClick={() => handleClaim(w.id)}>Claim</button>
                    <button className="btn btn--ghost btn--sm" onClick={() => handleDecline(w.id)}>Decline</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
