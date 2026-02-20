import { useToast } from '../components/Toast';

const employees = [
  { name: 'Anonymous Employee #1', dept: 'Engineering', sessions: 4, status: 'Active', lastSession: '2026-02-05' },
  { name: 'Anonymous Employee #2', dept: 'Marketing', sessions: 2, status: 'Active', lastSession: '2026-02-07' },
  { name: 'Anonymous Employee #3', dept: 'Sales', sessions: 6, status: 'Active', lastSession: '2026-02-08' },
  { name: 'Anonymous Employee #4', dept: 'Operations', sessions: 1, status: 'New', lastSession: '2026-02-01' },
  { name: 'Anonymous Employee #5', dept: 'HR', sessions: 3, status: 'Active', lastSession: '2026-02-06' },
  { name: 'Anonymous Employee #6', dept: 'Finance', sessions: 0, status: 'Invited', lastSession: '-' },
];

export default function Employees() {
  const showToast = useToast();

  const activeCount = employees.filter(e => e.status === 'Active').length;
  const totalSessions = employees.reduce((a, e) => a + e.sessions, 0);

  return (
    <>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-header__title">Employees</h1>
          <p className="page-header__subtitle">
            Anonymous overview of employee engagement with therapy sessions. Individual identities are never revealed.
          </p>
        </div>
        <button
          className="btn btn--primary btn--sm"
          onClick={() => showToast('Invite link copied to clipboard!')}
        >
          Invite Employees
        </button>
      </div>

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--primary">
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
              <path
                d="M17 17v-1a4 4 0 00-3-3.87M13 3.13a4 4 0 010 7.75M9 9a4 4 0 100-8 4 4 0 000 8zm0 2c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <div className="stat-card__value">{employees.length}</div>
            <div className="stat-card__label">Total Employees</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--success">
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
              <path
                d="M6.5 10l2.5 2.5 5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
          <div>
            <div className="stat-card__value">{activeCount}</div>
            <div className="stat-card__label">Actively Engaged</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--warning">
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M10 6v4l2.5 1.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <div className="stat-card__value">{totalSessions}</div>
            <div className="stat-card__label">Total Sessions Used</div>
          </div>
        </div>
      </div>

      <div className="card card--no-hover">
        <div className="card__title">Employee Engagement (Anonymous)</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text)' }}>Employee</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text)' }}>Department</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text)' }}>Sessions</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text)' }}>Status</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text)' }}>Last Session</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '12px 16px', color: 'var(--text-sec)' }}>{emp.name}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-sec)' }}>{emp.dept}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{emp.sessions}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      className={
                        'tag' +
                        (emp.status === 'Active'
                          ? ' tag--success'
                          : emp.status === 'Invited'
                            ? ' tag--warning'
                            : '')
                      }
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{emp.lastSession}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12, textAlign: 'center' }}>
        All employee data is anonymised. Feelya does not share individual employee session details with employers.
      </p>
    </>
  );
}
