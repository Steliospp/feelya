import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Team() {
  const { user } = useAuth();
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    fetch('/api/org/team')
      .then(r => r.json())
      .then(d => { setTeam(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  if (user?.role !== 'admin') {
    return (
      <div className="empty-state">
        <div className="empty-state__title">Access Denied</div>
        <p className="empty-state__desc">You need admin access to manage the team.</p>
      </div>
    );
  }
  if (loading) return <div className="page-loading">Loading team...</div>;

  return (
    <>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-header__title">Team Management</h1>
          <p className="page-header__subtitle">{team.length} member{team.length !== 1 ? 's' : ''} in your organisation</p>
        </div>
      </div>

      <div className="invite-box" style={{ marginBottom: '32px' }}>
        <div className="invite-box__label">Invite employees to join</div>
        <div className="invite-box__code">{user.org_invite_code || 'N/A'}</div>
        <div className="invite-box__hint">Employees can join at signup or from their profile settings</div>
      </div>

      <div className="team-list">
        {team.map(m => (
          <div key={m.id} className="team-member">
            <div className="team-member__avatar" style={{ background: m.avatar_color }}>
              {m.first_name[0].toUpperCase()}
            </div>
            <div className="team-member__info">
              <div className="team-member__name">{m.first_name} {m.last_name}</div>
              <div className="team-member__email">{m.email}</div>
            </div>
            <span className={`team-member__role team-member__role--${m.role}`}>
              {m.role === 'admin' ? 'Admin' : 'Employee'}
            </span>
            <div className="team-member__date">
              {new Date(m.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
