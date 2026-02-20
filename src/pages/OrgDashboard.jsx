import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function OrgDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    fetch('/api/org/dashboard')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [user]);

  if (user?.role !== 'admin') {
    return (
      <div className="empty-state">
        <div className="empty-state__title">Access Denied</div>
        <p className="empty-state__desc">You need admin access to view the organisation dashboard.</p>
      </div>
    );
  }
  if (loading) return <div className="page-loading">Loading organisation data...</div>;
  if (error || !data) return <p>Error loading organisation dashboard.</p>;

  const widths = [85, 72, 60, 45, 35];
  const wellbeingColor = data.avgWellbeing >= 70 ? '#d1fae5' : data.avgWellbeing >= 50 ? '#fef3c7' : '#fee2e2';

  return (
    <>
      <div className="page-header">
        <h1 className="page-header__title">{data.org.name}</h1>
        <p className="page-header__subtitle">
          Organisation wellbeing dashboard &middot; {data.org.plan.charAt(0).toUpperCase() + data.org.plan.slice(1)} plan
        </p>
      </div>

      <div className="invite-box">
        <div className="invite-box__label">Team Invite Code</div>
        <div className="invite-box__code">{data.org.invite_code}</div>
        <div className="invite-box__hint">Share this code with employees to join your organisation</div>
      </div>

      <div className="org-stats-grid">
        {[
          { label: 'Total Employees', value: data.totalEmployees },
          { label: 'Active Users', value: data.activeEmployees },
          { label: 'Engagement Rate', value: `${data.engagementRate}%`, change: 'Healthy' },
          { label: 'Total Sessions', value: data.totalSessions },
          { label: 'Upcoming Sessions', value: data.upcomingSessions },
          { label: 'Completed Sessions', value: data.completedSessions },
        ].map((s, i) => (
          <div key={i} className="org-stat">
            <div className="org-stat__label">{s.label}</div>
            <div className="org-stat__value">{s.value}</div>
            {s.change && <div className="org-stat__change org-stat__change--up">{s.change}</div>}
          </div>
        ))}
      </div>

      <div className="org-charts">
        <div className="org-chart-card">
          <div className="org-chart-card__title">Top Specialisations Used</div>
          <div className="org-bar-chart">
            {data.topSpecialisations.map((spec, i) => (
              <div key={i} className="org-bar">
                <div className="org-bar__label">{spec}</div>
                <div className="org-bar__track">
                  <div className="org-bar__fill" style={{ width: `${widths[i] || 30}%` }}></div>
                </div>
                <div className="org-bar__value">{widths[i] || 30}%</div>
              </div>
            ))}
          </div>
        </div>
        <div className="org-chart-card">
          <div className="org-chart-card__title">Team Wellbeing Score</div>
          <div className="org-wellbeing-ring">
            <div className="org-wellbeing-ring__circle" style={{ borderColor: wellbeingColor, background: `linear-gradient(135deg, ${wellbeingColor}, #fff)` }}>
              <div className="org-wellbeing-ring__value">{data.avgWellbeing}</div>
            </div>
            <div className="org-wellbeing-ring__label">
              out of 100 &middot; {data.avgWellbeing >= 70 ? 'Good' : data.avgWellbeing >= 50 ? 'Fair' : 'Needs Attention'}
            </div>
          </div>
        </div>
      </div>

      {data.recentActivity.length > 0 && (
        <div className="card card--no-hover">
          <div className="card__title">Recent Team Activity (Anonymised)</div>
          <div className="activity-list">
            {data.recentActivity.map((a, i) => (
              <div key={i} className="activity-item">
                <div className={`activity-item__dot activity-item__dot--${a.status === 'upcoming' ? 'booked' : a.status === 'completed' ? 'completed' : 'cancelled'}`}></div>
                <span>{a.session_format} session {a.status === 'upcoming' ? 'booked' : a.status} &middot; {a.date} at {a.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
