import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getWorkshops, updateWorkshop } from '../lib/workshopStore';
import { mockSessions } from './TherapistSessions';
import '../styles/app.css';

function isWithin48Hours(dateStr, timeStr) {
  const workshopDate = new Date(`${dateStr}T${timeStr}`);
  const now = new Date();
  const diffMs = workshopDate.getTime() - now.getTime();
  return diffMs >= 0 && diffMs < 48 * 60 * 60 * 1000;
}

// Parse both "6:00 PM" and "12:00" (24h) formats to minutes since midnight
function parseTimeToMinutes(timeStr) {
  const ampm = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampm) {
    let h = parseInt(ampm[1]);
    const m = parseInt(ampm[2]);
    if (ampm[3].toUpperCase() === 'PM' && h !== 12) h += 12;
    if (ampm[3].toUpperCase() === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  }
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function hasTimeConflict(date1, time1, dur1, date2, time2, dur2) {
  if (date1 !== date2) return false;
  const s1 = parseTimeToMinutes(time1);
  const s2 = parseTimeToMinutes(time2);
  return s1 < s2 + dur2 && s2 < s1 + dur1;
}

export default function TherapistWorkshops() {
  const { user } = useAuth();
  const [workshops, setWorkshops] = useState(() => getWorkshops());
  const [activeTab, setActiveTab] = useState('available');
  const [cancelConfirm, setCancelConfirm] = useState(null); // workshop id being confirmed
  const [claimError, setClaimError] = useState(null); // { workshopId, message }

  function refresh() { setWorkshops(getWorkshops()); }

  const available = workshops.filter(w => w.status === 'published');
  const mine = workshops.filter(w => w.therapist?.id === user.therapistId?.toString() || w.therapist?.id === user.id);

  const filtered = activeTab === 'available' ? available : mine;

  function handleClaim(id) {
    const workshop = workshops.find(w => w.id === id);
    setClaimError(null);

    // Check against already-claimed workshops
    const workshopConflict = mine.find(w =>
      w.status === 'scheduled' &&
      hasTimeConflict(workshop.date, workshop.time, workshop.duration, w.date, w.time, w.duration)
    );
    if (workshopConflict) {
      setClaimError({ workshopId: id, message: `This overlaps with your workshop "${workshopConflict.title}" on ${workshopConflict.date} at ${workshopConflict.time}.` });
      return;
    }

    // Check against upcoming therapy sessions
    const sessionConflict = mockSessions.find(s =>
      s.status === 'upcoming' &&
      hasTimeConflict(workshop.date, workshop.time, workshop.duration, s.date, s.time, s.duration)
    );
    if (sessionConflict) {
      setClaimError({ workshopId: id, message: `This overlaps with your session with ${sessionConflict.clientName} on ${sessionConflict.date} at ${sessionConflict.time}.` });
      return;
    }

    updateWorkshop(id, {
      status: 'scheduled',
      therapist: { id: user.id, name: `${user.first_name} ${user.last_name}` },
    });
    refresh();
  }

  function handleCancelClick(w) {
    setCancelConfirm(w.id);
  }

  function handleCancelConfirm(w) {
    const lateFee = isWithin48Hours(w.date, w.time);
    updateWorkshop(w.id, {
      status: 'published',
      therapist: null,
      cancelledBy: { id: user.id, name: `${user.first_name} ${user.last_name}`, at: new Date().toISOString(), lateFee },
    });
    setCancelConfirm(null);
    refresh();
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
          {filtered.map(w => {
            const late = isWithin48Hours(w.date, w.time);
            return (
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
                    <div style={{ display: 'flex', gap: 8, flexDirection: 'column', alignItems: 'flex-end' }}>
                      <button className="btn btn--primary btn--sm" onClick={() => handleClaim(w.id)}>Claim</button>
                      {claimError?.workshopId === w.id && (
                        <div style={{ fontSize: 13, color: 'var(--danger)', background: 'rgba(239,68,68,0.06)', border: '1px solid var(--danger)', borderRadius: 8, padding: '8px 12px', maxWidth: 340 }}>
                          {claimError.message}
                        </div>
                      )}
                    </div>
                  )}
                  {activeTab === 'mine' && w.status === 'scheduled' && cancelConfirm !== w.id && (
                    <button className="btn btn--outline btn--sm" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => handleCancelClick(w)}>
                      Cancel Workshop
                    </button>
                  )}
                </div>
                {/* Cancel confirmation */}
                {cancelConfirm === w.id && (
                  <div style={{ marginTop: 12, padding: 16, background: late ? 'rgba(239,68,68,0.06)' : 'var(--bg)', border: late ? '1px solid var(--danger)' : '1px solid var(--border-light)', borderRadius: 8 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, color: late ? 'var(--danger)' : 'var(--text)' }}>
                      {late ? 'Late Cancellation — Fee Applies' : 'Cancel this workshop?'}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-sec)', marginBottom: 12 }}>
                      {late
                        ? 'This workshop is within 48 hours. A late cancellation fee of £50 will be charged to your account. The workshop will be released for another therapist to claim.'
                        : 'The workshop will be released back to the available pool for another therapist to claim.'}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn--sm" style={{ background: 'var(--danger)', color: '#fff', border: 'none' }} onClick={() => handleCancelConfirm(w)}>
                        {late ? 'Cancel & Accept Fee' : 'Yes, Cancel'}
                      </button>
                      <button className="btn btn--outline btn--sm" onClick={() => setCancelConfirm(null)}>Keep Workshop</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
