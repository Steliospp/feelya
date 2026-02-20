import '../styles/app.css';

const mockEmployees = [
  { id: 1, name: 'Employee #001', department: 'Engineering', joinedDate: '2025-01-15', status: 'active' },
  { id: 2, name: 'Employee #002', department: 'Marketing', joinedDate: '2025-01-20', status: 'active' },
  { id: 3, name: 'Employee #003', department: 'Sales', joinedDate: '2025-02-01', status: 'active' },
  { id: 4, name: 'Employee #004', department: 'Engineering', joinedDate: '2025-02-10', status: 'active' },
  { id: 5, name: 'Employee #005', department: 'HR', joinedDate: '2025-02-15', status: 'invited' },
  { id: 6, name: 'Employee #006', department: 'Product', joinedDate: '2025-03-01', status: 'active' },
  { id: 7, name: 'Employee #007', department: 'Finance', joinedDate: '2025-03-05', status: 'invited' },
  { id: 8, name: 'Employee #008', department: 'Engineering', joinedDate: '2025-03-10', status: 'active' },
];

export default function HREmployees() {
  const active = mockEmployees.filter((e) => e.status === 'active').length;
  const invited = mockEmployees.filter((e) => e.status === 'invited').length;

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Employees</h1>
        <p className="page__subtitle">Manage your team's access to Feelya</p>
      </div>

      <div className="dash-grid" style={{ marginBottom: 24 }}>
        <div className="dash-card">
          <div className="dash-card__label">Total</div>
          <div className="dash-card__value">{mockEmployees.length}</div>
        </div>
        <div className="dash-card">
          <div className="dash-card__label">Active</div>
          <div className="dash-card__value" style={{ color: '#10b981' }}>{active}</div>
        </div>
        <div className="dash-card">
          <div className="dash-card__label">Invited</div>
          <div className="dash-card__value" style={{ color: '#f59e0b' }}>{invited}</div>
        </div>
      </div>

      <div className="dash-card">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
              <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 500 }}>Employee</th>
              <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 500 }}>Department</th>
              <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 500 }}>Joined</th>
              <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 500 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {mockEmployees.map((emp) => (
              <tr key={emp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', fontWeight: 500 }}>{emp.name}</td>
                <td style={{ padding: '12px 16px', color: '#64748b' }}>{emp.department}</td>
                <td style={{ padding: '12px 16px', color: '#64748b' }}>{emp.joinedDate}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span className="tag" style={{
                    background: emp.status === 'active' ? '#d1fae5' : '#fef3c7',
                    color: emp.status === 'active' ? '#065f46' : '#92400e',
                  }}>
                    {emp.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 24, padding: 24, background: '#eef2ff', borderRadius: 12, border: '1px solid #e0e7ff' }}>
        <div style={{ fontWeight: 600, color: '#1e1b4b', marginBottom: 4 }}>Privacy Note</div>
        <div style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
          Employee names are anonymised. You can see department and status information but never individual session data, therapist choices, or wellbeing scores.
        </div>
      </div>
    </div>
  );
}
