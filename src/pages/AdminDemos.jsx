import { useState, useCallback } from 'react';
import '../styles/app.css';

const LEADS_KEY = 'feelya_demo_leads';

function loadLeads() {
  try {
    return JSON.parse(localStorage.getItem(LEADS_KEY)) || [];
  } catch { return []; }
}

function saveLeads(leads) {
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
}

const STATUS_FLOW = ['new', 'contacted', 'qualified'];
const STATUS_COLORS = {
  new: { bg: '#fef3c7', color: '#92400e' },
  contacted: { bg: '#e0e7ff', color: '#3730a3' },
  qualified: { bg: '#d1fae5', color: '#065f46' },
};

export default function AdminDemos() {
  const [leads, setLeads] = useState(() => loadLeads());

  const advanceStatus = useCallback((id) => {
    setLeads((prev) => {
      const updated = prev.map((lead) => {
        if (lead.id !== id) return lead;
        const currentIdx = STATUS_FLOW.indexOf(lead.status);
        if (currentIdx < STATUS_FLOW.length - 1) {
          return { ...lead, status: STATUS_FLOW[currentIdx + 1] };
        }
        return lead;
      });
      saveLeads(updated);
      return updated;
    });
  }, []);

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Demo Leads</h1>
        <p className="page__subtitle">{leads.length} total leads</p>
      </div>

      {leads.length === 0 ? (
        <div className="dash-card" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm13 0l-4 4m0 0l-4-4m4 4V3" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div style={{ fontWeight: 600, color: '#1e1b4b', marginBottom: 4 }}>No demo leads yet</div>
          <div style={{ color: '#64748b', fontSize: 14 }}>Leads will appear here when someone submits the Book a Demo form.</div>
        </div>
      ) : (
        <div className="dash-card">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 500 }}>Name</th>
                <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 500 }}>Email</th>
                <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 500 }}>Company</th>
                <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 500 }}>Size</th>
                <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 500 }}>Plan</th>
                <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 500 }}>Date</th>
                <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 500 }}></th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => {
                const statusStyle = STATUS_COLORS[lead.status] || STATUS_COLORS.new;
                const canAdvance = STATUS_FLOW.indexOf(lead.status) < STATUS_FLOW.length - 1;
                return (
                  <tr key={lead.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 500 }}>{lead.name}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{lead.email}</td>
                    <td style={{ padding: '12px 16px' }}>{lead.company}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{lead.teamSize || '—'}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{lead.planInterest || '—'}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{new Date(lead.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className="tag" style={{ background: statusStyle.bg, color: statusStyle.color }}>
                        {lead.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {canAdvance && (
                        <button
                          className="btn btn--outline btn--xs"
                          onClick={() => advanceStatus(lead.id)}
                        >
                          {lead.status === 'new' ? 'Mark Contacted' : 'Mark Qualified'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
