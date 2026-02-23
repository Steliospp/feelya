import { ROLES } from './roles';

// SVG icons used across nav
const icons = {
  home: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 10l7-7 7 7M5 8.5V16a1 1 0 001 1h3v-4h2v4h3a1 1 0 001-1V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  therapists: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M17 17v-1a4 4 0 00-3-3.87M13 3.13a4 4 0 010 7.75M9 9a4 4 0 100-8 4 4 0 000 8zm0 2c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  sessions: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M13 2v4M7 2v4M3 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  workshops: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M14 17v-1a3 3 0 00-3-3H6a3 3 0 00-3 3v1m15-1v-1a3 3 0 00-2.25-2.9M11.5 3.1a3 3 0 010 5.8M8.5 9a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  resources: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4h5l2 2h5a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  employees: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 17v-1a3 3 0 00-3-3H8a3 3 0 00-3 3v1M10 10a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  requests: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4h12a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1zm0 3h12M7 4v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  insights: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 17V9m4.5 8V5M12 17v-5m4.5 5V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  settings: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M10 2v2m0 12v2M4.22 4.22l1.42 1.42m8.72 8.72l1.42 1.42M2 10h2m12 0h2M4.22 15.78l1.42-1.42m8.72-8.72l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
};

// ── Company portal nav (/app/*) ──
// Each section has a label (null = no header) and items with allowed roles.
export const companyNav = [
  {
    label: null,
    items: [
      { to: '/app/dashboard', label: 'Dashboard', icon: icons.home, roles: [ROLES.EMPLOYEE, ROLES.HR_ADMIN] },
    ],
  },
  {
    label: 'Therapy',
    roles: [ROLES.EMPLOYEE, ROLES.HR_ADMIN],
    items: [
      { to: '/app/therapists', label: 'Therapists', icon: icons.therapists, roles: [ROLES.EMPLOYEE, ROLES.HR_ADMIN] },
      { to: '/app/sessions',   label: 'Sessions',   icon: icons.sessions,   roles: [ROLES.EMPLOYEE, ROLES.HR_ADMIN] },
    ],
  },
  {
    label: 'Wellbeing',
    roles: [ROLES.EMPLOYEE, ROLES.HR_ADMIN],
    items: [
      { to: '/app/workshops', label: 'Workshops', icon: icons.workshops, roles: [ROLES.EMPLOYEE, ROLES.HR_ADMIN] },
      { to: '/app/resources', label: 'Resources', icon: icons.resources, roles: [ROLES.EMPLOYEE, ROLES.HR_ADMIN] },
    ],
  },
  {
    label: 'Programme',
    roles: [ROLES.HR_ADMIN],
    items: [
      { to: '/app/hr/therapists', label: 'Therapists', icon: icons.therapists, roles: [ROLES.HR_ADMIN] },
      { to: '/app/hr/workshops',  label: 'Workshops',  icon: icons.workshops,  roles: [ROLES.HR_ADMIN] },
      { to: '/app/hr/requests',   label: 'Requests',   icon: icons.requests,   roles: [ROLES.HR_ADMIN] },
    ],
  },
  {
    label: 'Analytics',
    roles: [ROLES.HR_ADMIN],
    items: [
      { to: '/app/hr/employees', label: 'Employees', icon: icons.employees, roles: [ROLES.HR_ADMIN] },
      { to: '/app/hr/insights',  label: 'Insights',  icon: icons.insights,  roles: [ROLES.HR_ADMIN] },
    ],
  },
  {
    label: 'Admin',
    roles: [ROLES.HR_ADMIN],
    items: [
      { to: '/app/hr/settings', label: 'Settings', icon: icons.settings, roles: [ROLES.HR_ADMIN] },
    ],
  },
];

// Filter nav for a given role. SUPER_ADMIN sees everything.
export function getNavForRole(navConfig, role) {
  if (role === ROLES.SUPER_ADMIN) return navConfig;
  return navConfig
    .filter(section => {
      if (section.roles && !section.roles.includes(role)) return false;
      return true;
    })
    .map(section => ({
      ...section,
      items: section.items.filter(item => !item.roles || item.roles.includes(role)),
    }))
    .filter(section => section.items.length > 0);
}
