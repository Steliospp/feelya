import { useState } from 'react';
import { downloadCSV } from '../lib/csv';
import '../styles/app.css';

const monthlyData = [
  { month: 'Sep', sessions: 210, engagement: 72, wellbeing: 68, workshops: 2 },
  { month: 'Oct', sessions: 248, engagement: 76, wellbeing: 71, workshops: 3 },
  { month: 'Nov', sessions: 276, engagement: 79, wellbeing: 73, workshops: 3 },
  { month: 'Dec', sessions: 258, engagement: 77, wellbeing: 72, workshops: 2 },
  { month: 'Jan', sessions: 310, engagement: 84, wellbeing: 76, workshops: 4 },
  { month: 'Feb', sessions: 342, engagement: 89, wellbeing: 78, workshops: 4 },
];

const departmentData = [
  { dept: 'Engineering', engagement: 92, sessions: 128, employees: 64 },
  { dept: 'Marketing', engagement: 86, sessions: 52, employees: 28 },
  { dept: 'Sales', engagement: 78, sessions: 48, employees: 35 },
  { dept: 'Product', engagement: 91, sessions: 44, employees: 22 },
  { dept: 'HR', engagement: 95, sessions: 28, employees: 12 },
  { dept: 'Finance', engagement: 72, sessions: 24, employees: 18 },
  { dept: 'Operations', engagement: 68, sessions: 18, employees: 20 },
];

const topTopics = [
  { topic: 'Anxiety', percentage: 28 },
  { topic: 'Stress', percentage: 24 },
  { topic: 'Burnout', percentage: 18 },
  { topic: 'Depression', percentage: 14 },
  { topic: 'Relationships', percentage: 10 },
  { topic: 'Other', percentage: 6 },
];

export default function HRInsights() {
  const maxSessions = Math.max(...monthlyData.map(m => m.sessions));
  const maxDeptEngagement = 100;

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  function handleExport() {
    downloadCSV('insights-report.csv', monthlyData, [
      { key: 'month', label: 'Month' },
      { key: 'sessions', label: 'Sessions' },
      { key: 'engagement', label: 'Engagement %' },
      { key: 'wellbeing', label: 'Wellbeing Score' },
      { key: 'workshops', label: 'Workshops' },
    ]);
  }

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="page-header__title">Insights</h1>
          <p className="page-header__subtitle">Aggregated trends and analytics for your organisation's wellbeing programme.</p>
        </div>
        <div className="export-bar">
          <input type="date" className="export-bar__date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          <span className="export-bar__sep">to</span>
          <input type="date" className="export-bar__date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
          <button className="btn btn--outline btn--sm" onClick={handleExport}>Export CSV</button>
        </div>
      </div>

      {/* Trend Charts */}
      <div className="org-charts">
        <div className="org-chart-card">
          <div className="org-chart-card__title">Sessions Trend (6 months)</div>
          <div className="org-bar-chart">
            {monthlyData.map(m => (
              <div className="org-bar" key={m.month}>
                <div className="org-bar__label">{m.month}</div>
                <div className="org-bar__track">
                  <div className="org-bar__fill" style={{ width: `${(m.sessions / maxSessions) * 100}%` }} />
                </div>
                <div className="org-bar__value">{m.sessions}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="org-chart-card">
          <div className="org-chart-card__title">Engagement Rate Trend</div>
          <div className="org-bar-chart">
            {monthlyData.map(m => (
              <div className="org-bar" key={m.month}>
                <div className="org-bar__label">{m.month}</div>
                <div className="org-bar__track">
                  <div className="org-bar__fill" style={{ width: `${m.engagement}%`, background: 'linear-gradient(90deg, #10b981, #14b8a6)' }} />
                </div>
                <div className="org-bar__value">{m.engagement}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="org-chart-card" style={{ marginTop: 24 }}>
        <div className="org-chart-card__title">Department Engagement</div>
        <div className="org-bar-chart">
          {departmentData.sort((a, b) => b.engagement - a.engagement).map(d => (
            <div className="org-bar" key={d.dept}>
              <div className="org-bar__label" style={{ width: 120 }}>{d.dept}</div>
              <div className="org-bar__track">
                <div className="org-bar__fill" style={{
                  width: `${(d.engagement / maxDeptEngagement) * 100}%`,
                  background: d.engagement >= 90 ? 'linear-gradient(90deg, #10b981, #14b8a6)' :
                    d.engagement >= 75 ? 'linear-gradient(90deg, #6366f1, #8b5cf6)' :
                    'linear-gradient(90deg, #f59e0b, #fbbf24)',
                }} />
              </div>
              <div className="org-bar__value">{d.engagement}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Topics & Wellbeing */}
      <div className="org-charts" style={{ marginTop: 24 }}>
        <div className="org-chart-card">
          <div className="org-chart-card__title">Most Requested Topics</div>
          <div className="org-bar-chart">
            {topTopics.map(t => (
              <div className="org-bar" key={t.topic}>
                <div className="org-bar__label">{t.topic}</div>
                <div className="org-bar__track">
                  <div className="org-bar__fill" style={{ width: `${(t.percentage / 30) * 100}%` }} />
                </div>
                <div className="org-bar__value">{t.percentage}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="org-chart-card">
          <div className="org-chart-card__title">Wellbeing Score Trend</div>
          <div className="org-bar-chart">
            {monthlyData.map(m => (
              <div className="org-bar" key={m.month}>
                <div className="org-bar__label">{m.month}</div>
                <div className="org-bar__track">
                  <div className="org-bar__fill" style={{
                    width: `${m.wellbeing}%`,
                    background: m.wellbeing >= 75 ? 'linear-gradient(90deg, #10b981, #14b8a6)' :
                      m.wellbeing >= 60 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' :
                      'linear-gradient(90deg, #ef4444, #f87171)',
                  }} />
                </div>
                <div className="org-bar__value">{m.wellbeing}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div style={{ marginTop: 32, padding: 24, background: '#eef2ff', borderRadius: 12, border: '1px solid #e0e7ff' }}>
        <div style={{ fontWeight: 600, color: '#1e1b4b', marginBottom: 4 }}>Data Privacy</div>
        <div style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
          All insights are based on aggregated, anonymised data. Individual employee information is never disclosed. Department data is only shown when there are 5 or more employees to prevent identification.
        </div>
      </div>
    </div>
  );
}
