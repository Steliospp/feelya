import { useState } from 'react';
import { downloadCSV } from '../lib/csv';
import '../styles/app.css';

const mockSessions = [
  { id: 1, client: 'A. Taylor', therapist: 'Dr. Sarah Mitchell', company: 'Acme Corp', date: '2026-02-23', time: '10:00 AM', duration: 50, price: 90, format: 'Video', status: 'upcoming', paid: true },
  { id: 2, client: 'M. Johnson', therapist: 'James Thompson', company: 'Acme Corp', date: '2026-02-23', time: '10:30 AM', duration: 50, price: 90, format: 'Audio', status: 'upcoming', paid: true },
  { id: 3, client: 'R. Patel', therapist: 'Dr. Priya Sharma', company: 'TechFlow Ltd', date: '2026-02-23', time: '11:00 AM', duration: 30, price: 45, format: 'Video', status: 'in-progress', paid: true },
  { id: 4, client: 'J. Brown', therapist: 'Emma Richardson', company: 'Nova Health', date: '2026-02-23', time: '9:00 AM', duration: 50, price: 90, format: 'Video', status: 'completed', paid: true },
  { id: 5, client: 'S. Williams', therapist: 'Dr. Michael Chen', company: 'GreenLeaf', date: '2026-02-23', time: '9:30 AM', duration: 50, price: 90, format: 'Video', status: 'completed', paid: true },
  { id: 6, client: 'L. Chen', therapist: 'Dr. Amara Okafor', company: 'Acme Corp', date: '2026-02-23', time: '2:00 PM', duration: 50, price: 95, format: 'Video', status: 'upcoming', paid: true },
  { id: 7, client: 'K. Davies', therapist: 'Dr. Robert Hayes', company: 'BlueStar', date: '2026-02-23', time: '3:00 PM', duration: 50, price: 120, format: 'Video', status: 'upcoming', paid: false },
  { id: 8, client: 'P. Evans', therapist: 'Dr. William Foster', company: 'Acme Corp', date: '2026-02-22', time: '4:00 PM', duration: 50, price: 100, format: 'Video', status: 'completed', paid: true },
  { id: 9, client: 'H. Morris', therapist: 'Priya Sharma', company: 'TechFlow Ltd', date: '2026-02-22', time: '11:00 AM', duration: 50, price: 65, format: 'Audio', status: 'completed', paid: true },
  { id: 10, client: 'D. Robinson', therapist: 'Dr. Sarah Mitchell', company: 'Nova Health', date: '2026-02-22', time: '2:00 PM', duration: 50, price: 90, format: 'Video', status: 'cancelled', paid: false },
  { id: 11, client: 'F. Ahmed', therapist: 'James Thompson', company: 'GreenLeaf', date: '2026-02-21', time: '10:00 AM', duration: 50, price: 80, format: 'Video', status: 'completed', paid: true },
  { id: 12, client: 'N. Cooper', therapist: 'Emma Richardson', company: 'Acme Corp', date: '2026-02-21', time: '3:00 PM', duration: 50, price: 70, format: 'Audio', status: 'completed', paid: true },
  { id: 13, client: 'B. Wright', therapist: 'Dr. Priya Sharma', company: 'BlueStar', date: '2026-02-20', time: '9:00 AM', duration: 30, price: 45, format: 'Video', status: 'completed', paid: true },
  { id: 14, client: 'C. Murphy', therapist: 'Dr. Michael Chen', company: 'TechFlow Ltd', date: '2026-02-20', time: '1:00 PM', duration: 50, price: 85, format: 'Video', status: 'cancelled', paid: false },
];

const weeklyStats = [
  { day: 'Mon', sessions: 18 },
  { day: 'Tue', sessions: 22 },
  { day: 'Wed', sessions: 15 },
  { day: 'Thu', sessions: 24 },
  { day: 'Fri', sessions: 20 },
  { day: 'Sat', sessions: 8 },
  { day: 'Sun', sessions: 4 },
];

const tabs = ['all', 'upcoming', 'in-progress', 'completed', 'cancelled'];

const statusTag = {
  'upcoming': 'tag--success',
  'in-progress': 'tag--warning',
  'completed': '',
  'cancelled': 'tag--danger',
};

export default function AdminSessions() {
  const [activeTab, setActiveTab] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filtered = activeTab === 'all'
    ? mockSessions
    : mockSessions.filter(s => s.status === activeTab);

  const todaySessions = mockSessions.filter(s => s.date === '2026-02-23').length;
  const weekSessions = mockSessions.length;
  const totalRevenue = mockSessions.filter(s => s.paid).reduce((sum, s) => sum + s.price, 0);
  const maxDay = Math.max(...weeklyStats.map(d => d.sessions));

  function handleExport() {
    downloadCSV('sessions-report.csv', filtered, [
      { key: 'date', label: 'Date' },
      { key: 'time', label: 'Time' },
      { key: 'client', label: 'Client' },
      { key: 'therapist', label: 'Therapist' },
      { key: 'company', label: 'Company' },
      { key: 'format', label: 'Format' },
      { key: 'duration', label: 'Duration (min)' },
      { key: 'price', label: 'Price (£)' },
      { key: 'status', label: 'Status' },
      { key: 'paid', label: 'Paid' },
    ]);
  }

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="page-header__title">Sessions</h1>
          <p className="page-header__subtitle">Monitor all platform sessions in real-time.</p>
        </div>
        <div className="export-bar">
          <input type="date" className="export-bar__date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          <span className="export-bar__sep">to</span>
          <input type="date" className="export-bar__date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
          <button className="btn btn--outline btn--sm" onClick={handleExport}>Export CSV</button>
        </div>
      </div>

      {/* Stats */}
      <div className="org-stats-grid" style={{ marginBottom: 24 }}>
        <div className="org-stat">
          <div className="org-stat__label">Sessions Today</div>
          <div className="org-stat__value">{todaySessions}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">This Week</div>
          <div className="org-stat__value">{weekSessions}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Revenue (Paid)</div>
          <div className="org-stat__value" style={{ color: 'var(--success)' }}>£{totalRevenue.toLocaleString()}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label">Cancellations</div>
          <div className="org-stat__value" style={{ color: 'var(--danger)' }}>{mockSessions.filter(s => s.status === 'cancelled').length}</div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="org-chart-card" style={{ marginBottom: 24 }}>
        <div className="org-chart-card__title">Sessions This Week</div>
        <div className="org-bar-chart">
          {weeklyStats.map(d => (
            <div className="org-bar" key={d.day}>
              <div className="org-bar__label">{d.day}</div>
              <div className="org-bar__track">
                <div className="org-bar__fill" style={{ width: `${(d.sessions / maxDay) * 100}%` }} />
              </div>
              <div className="org-bar__value">{d.sessions}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="sessions-tabs" style={{ marginBottom: 16 }}>
        {tabs.map(tab => (
          <button
            key={tab}
            className={`sessions-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'all' ? 'All' : tab === 'in-progress' ? 'In Progress' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span style={{ marginLeft: 6, opacity: 0.7 }}>
              ({tab === 'all' ? mockSessions.length : mockSessions.filter(s => s.status === tab).length})
            </span>
          </button>
        ))}
      </div>

      {/* Sessions Table */}
      <div className="card card--no-hover">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Date</th>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Time</th>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Client</th>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Therapist</th>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Company</th>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Format</th>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Price</th>
              <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '12px' }}>{s.date}</td>
                <td style={{ padding: '12px' }}>{s.time}</td>
                <td style={{ padding: '12px', fontWeight: 500 }}>{s.client}</td>
                <td style={{ padding: '12px', color: 'var(--primary)' }}>{s.therapist}</td>
                <td style={{ padding: '12px', color: 'var(--text-sec)' }}>{s.company}</td>
                <td style={{ padding: '12px' }}>{s.format}</td>
                <td style={{ padding: '12px', fontWeight: 600 }}>£{s.price}</td>
                <td style={{ padding: '12px' }}>
                  <span className={`tag ${statusTag[s.status] || ''}`}>
                    {s.status === 'in-progress' ? 'In Progress' : s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
