// ============ FEELYA APP — B2B ============

let currentUser = null;
let currentPage = '';

// ---- Init ----
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('/api/me');
    if (!res.ok) { window.location.href = '/login'; return; }
    currentUser = await res.json();
    updateUserUI();
    navigateFromURL();
  } catch {
    window.location.href = '/login';
  }

  // Sidebar nav
  document.querySelectorAll('.sidebar__link[data-page]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const page = link.dataset.page;
      navigate(page);
    });
  });

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login';
  });

  // Mobile sidebar toggle
  document.getElementById('sidebarToggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  // Close sidebar on overlay click (mobile)
  document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('sidebarToggle');
    if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !toggle.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });

  // Popstate
  window.addEventListener('popstate', navigateFromURL);

  // Load unread count
  loadNotifCount();
});

function navigateFromURL() {
  const path = window.location.pathname.replace('/app/', '').replace('/app', '') || 'dashboard';
  navigate(path, false);
}

function navigate(page, pushState = true) {
  currentPage = page;
  if (pushState) history.pushState(null, '', `/app/${page}`);

  // Update sidebar active
  document.querySelectorAll('.sidebar__link[data-page]').forEach(l => {
    l.classList.toggle('active', l.dataset.page === page);
  });

  // Close mobile sidebar
  document.getElementById('sidebar').classList.remove('open');

  // Update title
  const titles = {
    dashboard: 'Dashboard', therapists: 'Therapist Network', employees: 'Employees', sessions: 'Company Sessions',
    resources: 'Resources', notifications: 'Notifications', profile: 'Company Settings',
    'self-test': 'Workplace Wellbeing Assessment', org: 'Organisation Dashboard', team: 'Team Management'
  };
  document.title = `${titles[page] || 'Dashboard'} | feelya for Business`;

  // Render page
  const el = document.getElementById('pageContent');
  switch(page) {
    case 'dashboard': renderDashboard(el); break;
    case 'therapists': renderTherapists(el); break;
    case 'employees': renderEmployees(el); break;
    case 'sessions': renderSessions(el); break;
    case 'resources': renderResources(el); break;
    case 'notifications': renderNotifications(el); break;
    case 'profile': renderProfile(el); break;
    case 'self-test': renderSelfTest(el); break;
    case 'org': renderOrgDashboard(el); break;
    case 'team': renderTeam(el); break;
    default: renderDashboard(el);
  }
}

function updateUserUI() {
  if (!currentUser) return;
  const initial = currentUser.first_name[0].toUpperCase();
  document.getElementById('sidebarAvatar').textContent = initial;
  document.getElementById('sidebarAvatar').style.background = currentUser.avatar_color;
  document.getElementById('sidebarName').textContent = `${currentUser.first_name} ${currentUser.last_name}`;
  const mobileAv = document.getElementById('mobileAvatar');
  if (mobileAv) { mobileAv.textContent = initial; mobileAv.style.background = currentUser.avatar_color; }

  // Show org badge and admin section if applicable
  if (currentUser.org_name) {
    const orgEl = document.getElementById('sidebarOrg');
    const orgNameEl = document.getElementById('sidebarOrgName');
    if (orgEl) { orgEl.style.display = 'block'; orgNameEl.textContent = currentUser.org_name; }
  }

  if (currentUser.role === 'admin') {
    const adminSection = document.getElementById('adminSection');
    if (adminSection) adminSection.style.display = 'block';
  }

  // Show "Personal" label only if admin (to distinguish sections)
  const personalLabel = document.getElementById('personalLabel');
  if (personalLabel) {
    personalLabel.style.display = currentUser.role === 'admin' ? 'block' : 'none';
  }
}

async function loadNotifCount() {
  try {
    const res = await fetch('/api/notifications');
    const notifs = await res.json();
    const unread = notifs.filter(n => !n.read).length;
    const badge = document.getElementById('notifBadge');
    if (unread > 0) { badge.textContent = unread; badge.style.display = 'flex'; }
    else { badge.style.display = 'none'; }
  } catch {}
}

function showToast(msg, type = 'success') {
  const t = document.createElement('div');
  t.className = `toast toast--${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

function timeAgo(dateStr) {
  const now = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

// ============ ORG DASHBOARD (ADMIN) ============
async function renderOrgDashboard(el) {
  if (currentUser.role !== 'admin') {
    el.innerHTML = `<div class="empty-state"><div class="empty-state__title">Access Denied</div><p class="empty-state__desc">You need admin access to view the organisation dashboard.</p></div>`;
    return;
  }

  el.innerHTML = '<div class="page-loading">Loading organisation data...</div>';

  try {
    const res = await fetch('/api/org/dashboard');
    const data = await res.json();

    el.innerHTML = `
      <div class="page-header">
        <h1 class="page-header__title">${data.org.name}</h1>
        <p class="page-header__subtitle">Organisation wellbeing dashboard &middot; ${data.org.plan.charAt(0).toUpperCase() + data.org.plan.slice(1)} plan</p>
      </div>

      <div class="invite-box">
        <div class="invite-box__label">Team Invite Code</div>
        <div class="invite-box__code">${data.org.invite_code}</div>
        <div class="invite-box__hint">Share this code with employees to join your organisation</div>
      </div>

      <div class="org-stats-grid">
        <div class="org-stat">
          <div class="org-stat__label">Total Employees</div>
          <div class="org-stat__value">${data.totalEmployees}</div>
        </div>
        <div class="org-stat">
          <div class="org-stat__label">Active Users</div>
          <div class="org-stat__value">${data.activeEmployees}</div>
        </div>
        <div class="org-stat">
          <div class="org-stat__label">Engagement Rate</div>
          <div class="org-stat__value">${data.engagementRate}%</div>
          <div class="org-stat__change org-stat__change--up">Healthy</div>
        </div>
        <div class="org-stat">
          <div class="org-stat__label">Total Sessions</div>
          <div class="org-stat__value">${data.totalSessions}</div>
        </div>
        <div class="org-stat">
          <div class="org-stat__label">Upcoming Sessions</div>
          <div class="org-stat__value">${data.upcomingSessions}</div>
        </div>
        <div class="org-stat">
          <div class="org-stat__label">Completed Sessions</div>
          <div class="org-stat__value">${data.completedSessions}</div>
        </div>
      </div>

      <div class="org-charts">
        <div class="org-chart-card">
          <div class="org-chart-card__title">Top Specialisations Used</div>
          <div class="org-bar-chart">
            ${data.topSpecialisations.map((spec, i) => {
              const widths = [85, 72, 60, 45, 35];
              return `
                <div class="org-bar">
                  <div class="org-bar__label">${spec}</div>
                  <div class="org-bar__track"><div class="org-bar__fill" style="width:${widths[i] || 30}%"></div></div>
                  <div class="org-bar__value">${widths[i] || 30}%</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        <div class="org-chart-card">
          <div class="org-chart-card__title">Team Wellbeing Score</div>
          <div class="org-wellbeing-ring">
            <div class="org-wellbeing-ring__circle" style="border-color: ${data.avgWellbeing >= 70 ? '#d1fae5' : data.avgWellbeing >= 50 ? '#fef3c7' : '#fee2e2'}; background: linear-gradient(135deg, ${data.avgWellbeing >= 70 ? '#d1fae5' : data.avgWellbeing >= 50 ? '#fef3c7' : '#fee2e2'}, #fff);">
              <div class="org-wellbeing-ring__value">${data.avgWellbeing}</div>
            </div>
            <div class="org-wellbeing-ring__label">out of 100 &middot; ${data.avgWellbeing >= 70 ? 'Good' : data.avgWellbeing >= 50 ? 'Fair' : 'Needs Attention'}</div>
          </div>
        </div>
      </div>

      ${data.recentActivity.length > 0 ? `
        <div class="card card--no-hover">
          <div class="card__title">Recent Team Activity (Anonymised)</div>
          <div class="activity-list">
            ${data.recentActivity.map(a => `
              <div class="activity-item">
                <div class="activity-item__dot activity-item__dot--${a.status === 'upcoming' ? 'booked' : a.status === 'completed' ? 'completed' : 'cancelled'}"></div>
                <span>${a.session_format} session ${a.status === 'upcoming' ? 'booked' : a.status} &middot; ${a.date} at ${a.time}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    `;
  } catch {
    el.innerHTML = '<p>Error loading organisation dashboard.</p>';
  }
}

// ============ TEAM MANAGEMENT (ADMIN) ============
async function renderTeam(el) {
  if (currentUser.role !== 'admin') {
    el.innerHTML = `<div class="empty-state"><div class="empty-state__title">Access Denied</div><p class="empty-state__desc">You need admin access to manage the team.</p></div>`;
    return;
  }

  el.innerHTML = '<div class="page-loading">Loading team...</div>';

  try {
    const res = await fetch('/api/org/team');
    const team = await res.json();

    el.innerHTML = `
      <div class="page-header" style="display:flex;align-items:center;justify-content:space-between;">
        <div>
          <h1 class="page-header__title">Team Management</h1>
          <p class="page-header__subtitle">${team.length} member${team.length !== 1 ? 's' : ''} in your organisation</p>
        </div>
      </div>

      <div class="invite-box" style="margin-bottom:32px;">
        <div class="invite-box__label">Invite employees to join</div>
        <div class="invite-box__code">${currentUser.org_invite_code || 'N/A'}</div>
        <div class="invite-box__hint">Employees can join at signup or from their profile settings</div>
      </div>

      <div class="team-list">
        ${team.map(m => `
          <div class="team-member">
            <div class="team-member__avatar" style="background:${m.avatar_color};">
              ${m.first_name[0].toUpperCase()}
            </div>
            <div class="team-member__info">
              <div class="team-member__name">${m.first_name} ${m.last_name}</div>
              <div class="team-member__email">${m.email}</div>
            </div>
            <span class="team-member__role team-member__role--${m.role}">${m.role === 'admin' ? 'Admin' : 'Employee'}</span>
            <div class="team-member__date">${new Date(m.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
          </div>
        `).join('')}
      </div>
    `;
  } catch {
    el.innerHTML = '<p>Error loading team data.</p>';
  }
}

// ============ DASHBOARD ============
async function renderDashboard(el) {
  el.innerHTML = '<div class="page-loading">Loading...</div>';
  try {
    const res = await fetch('/api/dashboard');
    const data = await res.json();

    const greeting = getGreeting();
    const isAdmin = currentUser.role === 'admin';

    el.innerHTML = `
      <div class="page-header">
        <div class="page-header__greeting">${greeting}</div>
        <h1 class="page-header__title">Welcome back, ${currentUser.first_name}</h1>
        ${currentUser.org_name ? `<p class="page-header__subtitle">${currentUser.org_name}${isAdmin ? ' &middot; Admin' : ''}</p>` : ''}
      </div>

      ${isAdmin ? `
        <div style="margin-bottom:24px;">
          <div class="card" style="background:linear-gradient(135deg, var(--primary-50), #ede9fe); border-color:var(--primary-100); cursor:pointer;" onclick="navigate('org')">
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <div>
                <div style="font-weight:600;font-size:16px;margin-bottom:4px;">Organisation Dashboard</div>
                <div style="font-size:14px;color:var(--text-sec);">View team analytics, engagement metrics, and wellbeing trends</div>
              </div>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
          </div>
        </div>
      ` : ''}

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--primary">
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M13 2v4M7 2v4M3 8h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <div>
            <div class="stat-card__value">${data.upcomingSessions}</div>
            <div class="stat-card__label">Upcoming Sessions</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--success">
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M6.5 10l2.5 2.5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5"/></svg>
          </div>
          <div>
            <div class="stat-card__value">${data.completedSessions}</div>
            <div class="stat-card__label">Completed Sessions</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--warning">
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M10 2a6 6 0 00-6 6v3l-1.5 2.5h15L16 11V8a6 6 0 00-6-6z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 15.5a2.5 2.5 0 005 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <div>
            <div class="stat-card__value">${data.unreadNotifications}</div>
            <div class="stat-card__label">Unread Notifications</div>
          </div>
        </div>
      </div>

      <div class="dash-grid">
        <div class="card">
          <div class="card__title">
            Next Session
            ${data.nextSession ? `<span class="tag tag--success">Confirmed</span>` : ''}
          </div>
          ${data.nextSession ? `
            <div class="session-item" style="border:none;padding:0;">
              <div class="session-item__left">
                <div class="session-item__avatar">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 12c2.5 0 4.5-2 4.5-4.5S14.5 3 12 3 7.5 5 7.5 7.5 9.5 12 12 12zm0 2c-3 0-9 1.5-9 4.5V21h18v-2.5c0-3-6-4.5-9-4.5z" fill="white"/></svg>
                </div>
                <div>
                  <div class="session-item__name">${data.nextSession.therapist_name}</div>
                  <div class="session-item__detail">${data.nextSession.therapist_title} &middot; ${data.nextSession.session_format} session</div>
                </div>
              </div>
              <div class="session-item__right">
                <div class="session-item__date">
                  <div class="session-item__date-day">${data.nextSession.date}</div>
                  <div class="session-item__date-time">${data.nextSession.time} &middot; ${data.nextSession.duration}min</div>
                </div>
              </div>
            </div>
          ` : `
            <div class="empty-state" style="padding:30px 10px;">
              <p class="empty-state__desc">No upcoming sessions. Find a therapist to get started.</p>
              <button class="btn btn--primary btn--sm" onclick="navigate('therapists')">Find a Therapist</button>
            </div>
          `}
        </div>

        <div class="card">
          <div class="card__title">
            Recent Notifications
            <a href="#" onclick="navigate('notifications');return false;" style="font-size:13px;color:var(--primary);font-weight:500;">View All</a>
          </div>
          ${data.recentNotifications.length > 0 ? data.recentNotifications.slice(0, 4).map(n => `
            <div class="notif-item ${n.read ? '' : 'unread'}" style="margin-bottom:6px;border:none;background:${n.read ? 'var(--bg)' : 'var(--primary-50)'};">
              <div class="notif-item__icon notif-item__icon--${n.type === 'success' ? 'success' : n.type === 'warning' ? 'warning' : 'info'}">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 8l3 3 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <div class="notif-item__content">
                <div class="notif-item__title">${n.title}</div>
                <div class="notif-item__time">${timeAgo(n.created_at)}</div>
              </div>
            </div>
          `).join('') : '<p style="color:var(--text-muted);font-size:14px;">No notifications yet.</p>'}
        </div>
      </div>

      <div style="margin-top:24px;">
        <div class="self-test-card">
          <h3>How are you feeling?</h3>
          <p>Take our free, confidential 5-minute mood assessment to better understand your emotional wellbeing.</p>
          <button class="btn btn--white btn--md" onclick="navigate('self-test')">Take the Self-Test</button>
        </div>
      </div>
    `;
  } catch {
    el.innerHTML = '<p>Error loading dashboard.</p>';
  }
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

// ============ THERAPISTS ============
async function renderTherapists(el) {
  el.innerHTML = `
    <div class="page-header">
      <h1 class="page-header__title">Find Your Therapist</h1>
      <p class="page-header__subtitle">Browse our accredited, carefully vetted UK-based therapists and find the right match for you.</p>
    </div>
    <div class="content-with-filters">
      <div class="filters" id="filtersPanel">
        <div class="filters__title">Filters</div>
        <div class="filter-group open">
          <button class="filter-group__header" onclick="this.parentElement.classList.toggle('open')">
            Price Range
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="filter-group__body">
            <div class="filter-option">
              <select id="filterPrice">
                <option value="">Any price</option>
                <option value="70">Up to &pound;70/session</option>
                <option value="90">Up to &pound;90/session</option>
                <option value="120">Up to &pound;120/session</option>
              </select>
            </div>
          </div>
        </div>
        <div class="filter-group open">
          <button class="filter-group__header" onclick="this.parentElement.classList.toggle('open')">
            Gender
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="filter-group__body">
            <div class="filter-option">
              <select id="filterGender">
                <option value="">Any</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
        </div>
        <div class="filter-group open">
          <button class="filter-group__header" onclick="this.parentElement.classList.toggle('open')">
            Specialisations
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="filter-group__body">
            <div class="filter-option">
              <select id="filterSpec">
                <option value="">All</option>
                <option value="Anxiety">Anxiety</option>
                <option value="Depression">Depression</option>
                <option value="Stress">Stress</option>
                <option value="Burnout">Burnout</option>
                <option value="Relationships">Relationships</option>
                <option value="Trauma">Trauma</option>
                <option value="OCD">OCD</option>
                <option value="Self-esteem">Self-esteem</option>
                <option value="LGBTQ+">LGBTQ+</option>
                <option value="Grief">Grief</option>
              </select>
            </div>
          </div>
        </div>
        <div class="filter-group open">
          <button class="filter-group__header" onclick="this.parentElement.classList.toggle('open')">
            Languages
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="filter-group__body">
            <div class="filter-option">
              <select id="filterLang">
                <option value="">Any language</option>
                <option value="English">English</option>
                <option value="French">French</option>
                <option value="Mandarin">Mandarin</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>
          </div>
        </div>
        <div class="filter-group open">
          <button class="filter-group__header" onclick="this.parentElement.classList.toggle('open')">
            Session Type
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="filter-group__body">
            <div class="filter-option">
              <select id="filterType">
                <option value="">Video &amp; Audio</option>
                <option value="video">Video only</option>
                <option value="audio">Audio only</option>
              </select>
            </div>
          </div>
        </div>
        <button class="filters__reset" onclick="resetFilters()">Reset Filters</button>
      </div>
      <div id="therapistsList">
        <div style="text-align:center;padding:60px;color:var(--text-muted);">Loading therapists...</div>
      </div>
    </div>
  `;

  ['filterPrice', 'filterGender', 'filterSpec', 'filterLang', 'filterType'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', loadTherapists);
  });

  await loadTherapists();
}

async function loadTherapists() {
  const params = new URLSearchParams();
  const price = document.getElementById('filterPrice')?.value;
  const gender = document.getElementById('filterGender')?.value;
  const spec = document.getElementById('filterSpec')?.value;
  const lang = document.getElementById('filterLang')?.value;
  const type = document.getElementById('filterType')?.value;

  if (price) params.set('maxPrice', price);
  if (gender) params.set('gender', gender);
  if (spec) params.set('specialisation', spec);
  if (lang) params.set('language', lang);
  if (type) params.set('sessionType', type);

  try {
    const res = await fetch(`/api/therapists?${params}`);
    const therapists = await res.json();
    const container = document.getElementById('therapistsList');

    if (therapists.length === 0) {
      container.innerHTML = `<div class="empty-state"><div class="empty-state__title">No therapists found</div><p class="empty-state__desc">Try adjusting your filters.</p></div>`;
      return;
    }

    container.innerHTML = `<div class="therapist-grid">${therapists.map(t => renderTherapistCard(t)).join('')}</div>`;
  } catch {
    document.getElementById('therapistsList').innerHTML = '<p>Error loading therapists.</p>';
  }
}

function renderTherapistCard(t) {
  const specs = t.specialisations.split(',');

  return `
    <div class="therapist-card">
      <div class="therapist-card__header">
        <div class="therapist-card__avatar">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M12 12c2.5 0 4.5-2 4.5-4.5S14.5 3 12 3 7.5 5 7.5 7.5 9.5 12 12 12zm0 2c-3 0-9 1.5-9 4.5V21h18v-2.5c0-3-6-4.5-9-4.5z" fill="white"/></svg>
          <div class="therapist-card__status"></div>
        </div>
        <div>
          <div class="therapist-card__name">${t.name}</div>
          <div class="therapist-card__title">${t.title} &middot; ${t.accreditation}</div>
          <div class="therapist-card__rating">
            ${'&#9733;'.repeat(Math.round(t.rating))} <span>(${t.review_count} reviews)</span>
          </div>
        </div>
      </div>
      <div class="therapist-card__tags">
        ${specs.map(s => `<span class="tag">${s.trim()}</span>`).join('')}
      </div>
      <div class="therapist-card__pricing">
        ${t.intro_video_price ? `
        <div class="therapist-card__price-row">
          <div class="therapist-card__price-type">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" stroke-width="1.3"/><circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.3"/></svg>
            Introductory Video
          </div>
          <div class="therapist-card__price-amount">&pound;${t.intro_video_price}<span class="therapist-card__price-duration">/${t.intro_duration}min</span></div>
        </div>
        ` : ''}
        ${t.intro_audio_price ? `
        <div class="therapist-card__price-row">
          <div class="therapist-card__price-type">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v8M5 6v4m6-4v4M3 7v2m10-2v2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
            Introductory Audio
          </div>
          <div class="therapist-card__price-amount">&pound;${t.intro_audio_price}<span class="therapist-card__price-duration">/${t.intro_duration}min</span></div>
        </div>
        ` : ''}
        <div class="therapist-card__price-row">
          <div class="therapist-card__price-type">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" stroke-width="1.3"/><circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.3"/></svg>
            Video session
          </div>
          <div class="therapist-card__price-amount">&pound;${t.video_price}<span class="therapist-card__price-duration">/${t.video_duration}min</span></div>
        </div>
        <div class="therapist-card__price-row">
          <div class="therapist-card__price-type">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v8M5 6v4m6-4v4M3 7v2m10-2v2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
            Audio session
          </div>
          <div class="therapist-card__price-amount">&pound;${t.audio_price}<span class="therapist-card__price-duration">/${t.audio_duration}min</span></div>
        </div>
      </div>
      <div class="therapist-card__next">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.2"/><path d="M7 4v3l2 1" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
        Next available: ${t.next_available}
      </div>
      <div class="therapist-card__actions">
        <button class="btn btn--outline btn--sm" onclick="viewTherapistProfile(${t.id})">View Profile</button>
        <button class="btn btn--primary btn--sm" onclick="openBookingModal(${t.id})">Book Now</button>
      </div>
    </div>
  `;
}

function resetFilters() {
  ['filterPrice', 'filterGender', 'filterSpec', 'filterLang', 'filterType'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  loadTherapists();
}

// ============ THERAPIST PROFILE MODAL ============
async function viewTherapistProfile(id) {
  const res = await fetch(`/api/therapists/${id}`);
  const t = await res.json();
  const specs = t.specialisations.split(',');
  const langs = t.languages.split(',');

  document.getElementById('therapistProfileContent').innerHTML = `
    <div style="display:flex;align-items:center;gap:20px;margin-bottom:24px;">
      <div class="therapist-card__avatar" style="width:72px;height:72px;">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M12 12c2.5 0 4.5-2 4.5-4.5S14.5 3 12 3 7.5 5 7.5 7.5 9.5 12 12 12zm0 2c-3 0-9 1.5-9 4.5V21h18v-2.5c0-3-6-4.5-9-4.5z" fill="white"/></svg>
      </div>
      <div>
        <h2 style="font-family:var(--font-serif);font-size:24px;font-weight:600;">${t.name}</h2>
        <p style="color:var(--text-sec);font-size:14px;">${t.title} &middot; ${t.accreditation}</p>
        <div class="therapist-card__rating" style="margin-top:4px;">
          ${'&#9733;'.repeat(Math.round(t.rating))} <span>${t.rating}/5 (${t.review_count} reviews)</span>
        </div>
      </div>
    </div>
    <div style="margin-bottom:20px;">
      <h4 style="font-size:15px;font-weight:600;margin-bottom:8px;">About</h4>
      <p style="font-size:14px;color:var(--text-sec);line-height:1.7;">${t.bio}</p>
    </div>
    <div style="margin-bottom:20px;">
      <h4 style="font-size:15px;font-weight:600;margin-bottom:8px;">Specialisations</h4>
      <div style="display:flex;flex-wrap:wrap;gap:6px;">${specs.map(s => `<span class="tag">${s.trim()}</span>`).join('')}</div>
    </div>
    <div style="margin-bottom:20px;">
      <h4 style="font-size:15px;font-weight:600;margin-bottom:8px;">Languages</h4>
      <div style="display:flex;flex-wrap:wrap;gap:6px;">${langs.map(l => `<span class="tag">${l.trim()}</span>`).join('')}</div>
    </div>
    <div style="margin-bottom:24px;">
      <h4 style="font-size:15px;font-weight:600;margin-bottom:8px;">Session Pricing</h4>
      <div class="therapist-card__pricing" style="background:var(--bg);border-radius:12px;padding:16px;">
        ${t.intro_video_price ? `<div class="therapist-card__price-row"><span style="color:var(--text-sec);font-size:14px;">Introductory Video</span><strong>&pound;${t.intro_video_price}/${t.intro_duration}min</strong></div>` : ''}
        ${t.intro_audio_price ? `<div class="therapist-card__price-row"><span style="color:var(--text-sec);font-size:14px;">Introductory Audio</span><strong>&pound;${t.intro_audio_price}/${t.intro_duration}min</strong></div>` : ''}
        <div class="therapist-card__price-row"><span style="color:var(--text-sec);font-size:14px;">Video Session</span><strong>&pound;${t.video_price}/${t.video_duration}min</strong></div>
        <div class="therapist-card__price-row"><span style="color:var(--text-sec);font-size:14px;">Audio Session</span><strong>&pound;${t.audio_price}/${t.audio_duration}min</strong></div>
      </div>
    </div>
    <button class="btn btn--primary btn--lg btn--full" onclick="closeProfileModal();openBookingModal(${t.id})">Book a Session</button>
  `;

  document.getElementById('profileModal').style.display = 'flex';
}

function closeProfileModal() {
  document.getElementById('profileModal').style.display = 'none';
}

// ============ BOOKING MODAL ============
let bookingTherapist = null;

async function openBookingModal(id) {
  const res = await fetch(`/api/therapists/${id}`);
  bookingTherapist = await res.json();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  document.getElementById('bookingContent').innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;padding-bottom:20px;border-bottom:1px solid var(--border);">
      <div class="therapist-card__avatar" style="width:48px;height:48px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 12c2.5 0 4.5-2 4.5-4.5S14.5 3 12 3 7.5 5 7.5 7.5 9.5 12 12 12zm0 2c-3 0-9 1.5-9 4.5V21h18v-2.5c0-3-6-4.5-9-4.5z" fill="white"/></svg>
      </div>
      <div>
        <div style="font-weight:600;">${bookingTherapist.name}</div>
        <div style="font-size:13px;color:var(--text-sec);">${bookingTherapist.title}</div>
      </div>
    </div>
    <form id="bookingForm">
      <div class="form-group">
        <label class="form-label">Session Type</label>
        <select class="form-input" id="bookSessionType" onchange="updateBookingPrice()">
          ${bookingTherapist.intro_video_price ? `<option value="intro_video">Introductory Video (&pound;${bookingTherapist.intro_video_price}/${bookingTherapist.intro_duration}min)</option>` : ''}
          ${bookingTherapist.intro_audio_price ? `<option value="intro_audio">Introductory Audio (&pound;${bookingTherapist.intro_audio_price}/${bookingTherapist.intro_duration}min)</option>` : ''}
          <option value="video">Video Session (&pound;${bookingTherapist.video_price}/${bookingTherapist.video_duration}min)</option>
          <option value="audio">Audio Session (&pound;${bookingTherapist.audio_price}/${bookingTherapist.audio_duration}min)</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Date</label>
        <input class="form-input" type="date" id="bookDate" min="${minDate}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Time</label>
        <select class="form-input" id="bookTime">
          <option value="09:00">09:00</option>
          <option value="10:00">10:00</option>
          <option value="11:00">11:00</option>
          <option value="12:00">12:00</option>
          <option value="14:00">14:00</option>
          <option value="15:00">15:00</option>
          <option value="16:00">16:00</option>
          <option value="17:00">17:00</option>
          <option value="18:00" selected>18:00</option>
          <option value="19:00">19:00</option>
          <option value="20:00">20:00</option>
        </select>
      </div>
      <div style="background:var(--bg);border-radius:12px;padding:16px;margin-bottom:20px;">
        <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:8px;">
          <span style="color:var(--text-sec);">Session fee</span>
          <span id="bookingPrice" style="font-weight:700;">&pound;${bookingTherapist.intro_video_price || bookingTherapist.video_price}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:14px;">
          <span style="color:var(--text-sec);">Duration</span>
          <span id="bookingDuration" style="font-weight:700;">${bookingTherapist.intro_video_price ? bookingTherapist.intro_duration : bookingTherapist.video_duration} min</span>
        </div>
        ${currentUser.org_name ? `<div style="display:flex;justify-content:space-between;font-size:14px;margin-top:8px;padding-top:8px;border-top:1px solid var(--border);">
          <span style="color:var(--text-sec);">Covered by</span>
          <span style="font-weight:600;color:var(--primary);">${currentUser.org_name}</span>
        </div>` : ''}
      </div>
      <button type="submit" class="btn btn--primary btn--lg btn--full">Confirm Booking</button>
      <p style="font-size:12px;color:var(--text-muted);text-align:center;margin-top:12px;">Free cancellation up to 48 hours before your session.</p>
    </form>
  `;

  document.getElementById('bookingForm').addEventListener('submit', submitBooking);
  document.getElementById('bookingModal').style.display = 'flex';
}

function updateBookingPrice() {
  const type = document.getElementById('bookSessionType').value;
  const t = bookingTherapist;
  let price, duration;
  if (type === 'intro_video') { price = t.intro_video_price; duration = t.intro_duration; }
  else if (type === 'intro_audio') { price = t.intro_audio_price; duration = t.intro_duration; }
  else if (type === 'video') { price = t.video_price; duration = t.video_duration; }
  else { price = t.audio_price; duration = t.audio_duration; }
  document.getElementById('bookingPrice').textContent = `\u00A3${price}`;
  document.getElementById('bookingDuration').textContent = `${duration} min`;
}

async function submitBooking(e) {
  e.preventDefault();
  const typeRaw = document.getElementById('bookSessionType').value;
  const date = document.getElementById('bookDate').value;
  const time = document.getElementById('bookTime').value;
  if (!date) { showToast('Please select a date', 'error'); return; }

  const t = bookingTherapist;
  let sessionType, sessionFormat, price, duration;
  if (typeRaw === 'intro_video') { sessionType = 'introductory'; sessionFormat = 'Video'; price = t.intro_video_price; duration = t.intro_duration; }
  else if (typeRaw === 'intro_audio') { sessionType = 'introductory'; sessionFormat = 'Audio'; price = t.intro_audio_price; duration = t.intro_duration; }
  else if (typeRaw === 'video') { sessionType = 'regular'; sessionFormat = 'Video'; price = t.video_price; duration = t.video_duration; }
  else { sessionType = 'regular'; sessionFormat = 'Audio'; price = t.audio_price; duration = t.audio_duration; }

  try {
    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ therapistId: t.id, sessionType, sessionFormat, date, time, duration, price })
    });
    const data = await res.json();
    if (data.success) {
      closeBookingModal();
      showToast('Session booked successfully!');
      loadNotifCount();
      if (currentPage === 'dashboard') navigate('dashboard', false);
      if (currentPage === 'sessions') navigate('sessions', false);
    }
  } catch {
    showToast('Failed to book session', 'error');
  }
}

function closeBookingModal() {
  document.getElementById('bookingModal').style.display = 'none';
}

// ============ EMPLOYEES ============
function renderEmployees(el) {
  const employees = [
    { name: 'Anonymous Employee #1', dept: 'Engineering', sessions: 4, status: 'Active', lastSession: '2026-02-05' },
    { name: 'Anonymous Employee #2', dept: 'Marketing', sessions: 2, status: 'Active', lastSession: '2026-02-07' },
    { name: 'Anonymous Employee #3', dept: 'Sales', sessions: 6, status: 'Active', lastSession: '2026-02-08' },
    { name: 'Anonymous Employee #4', dept: 'Operations', sessions: 1, status: 'New', lastSession: '2026-02-01' },
    { name: 'Anonymous Employee #5', dept: 'HR', sessions: 3, status: 'Active', lastSession: '2026-02-06' },
    { name: 'Anonymous Employee #6', dept: 'Finance', sessions: 0, status: 'Invited', lastSession: '-' },
  ];

  el.innerHTML = `
    <div class="page-header" style="display:flex;align-items:center;justify-content:space-between;">
      <div>
        <h1 class="page-header__title">Employees</h1>
        <p class="page-header__subtitle">Anonymous overview of employee engagement with therapy sessions. Individual identities are never revealed.</p>
      </div>
      <button class="btn btn--primary btn--sm" onclick="showToast('Invite link copied to clipboard!')">Invite Employees</button>
    </div>

    <div class="stats-grid" style="margin-bottom:24px;">
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--primary">
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M17 17v-1a4 4 0 00-3-3.87M13 3.13a4 4 0 010 7.75M9 9a4 4 0 100-8 4 4 0 000 8zm0 2c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div>
          <div class="stat-card__value">${employees.length}</div>
          <div class="stat-card__label">Total Employees</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--success">
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M6.5 10l2.5 2.5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5"/></svg>
          </div>
        <div>
          <div class="stat-card__value">${employees.filter(e => e.status === 'Active').length}</div>
          <div class="stat-card__label">Actively Engaged</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--warning">
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5"/><path d="M10 6v4l2.5 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        </div>
        <div>
          <div class="stat-card__value">${employees.reduce((a, e) => a + e.sessions, 0)}</div>
          <div class="stat-card__label">Total Sessions Used</div>
        </div>
      </div>
    </div>

    <div class="card card--no-hover">
      <div class="card__title">Employee Engagement (Anonymous)</div>
      <div style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <thead>
            <tr style="border-bottom:2px solid var(--border);text-align:left;">
              <th style="padding:12px 16px;font-weight:600;color:var(--text);">Employee</th>
              <th style="padding:12px 16px;font-weight:600;color:var(--text);">Department</th>
              <th style="padding:12px 16px;font-weight:600;color:var(--text);">Sessions</th>
              <th style="padding:12px 16px;font-weight:600;color:var(--text);">Status</th>
              <th style="padding:12px 16px;font-weight:600;color:var(--text);">Last Session</th>
            </tr>
          </thead>
          <tbody>
            ${employees.map(emp => `
              <tr style="border-bottom:1px solid var(--border-light);">
                <td style="padding:12px 16px;color:var(--text-sec);">${emp.name}</td>
                <td style="padding:12px 16px;color:var(--text-sec);">${emp.dept}</td>
                <td style="padding:12px 16px;font-weight:600;">${emp.sessions}</td>
                <td style="padding:12px 16px;">
                  <span class="tag ${emp.status === 'Active' ? 'tag--success' : emp.status === 'New' ? '' : 'tag--warning'}">${emp.status}</span>
                </td>
                <td style="padding:12px 16px;color:var(--text-muted);">${emp.lastSession}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
    <p style="font-size:12px;color:var(--text-muted);margin-top:12px;text-align:center;">
      All employee data is anonymised. Feelya does not share individual employee session details with employers.
    </p>
  `;
}

// ============ SESSIONS ============
async function renderSessions(el) {
  el.innerHTML = `
    <div class="page-header">
      <h1 class="page-header__title">Your Sessions</h1>
      <p class="page-header__subtitle">View and manage your therapy sessions.</p>
    </div>
    <div class="sessions-tabs">
      <button class="sessions-tab active" data-tab="upcoming" onclick="filterSessions('upcoming')">Upcoming</button>
      <button class="sessions-tab" data-tab="completed" onclick="filterSessions('completed')">Completed</button>
      <button class="sessions-tab" data-tab="cancelled" onclick="filterSessions('cancelled')">Cancelled</button>
    </div>
    <div id="sessionsList"><div style="text-align:center;padding:40px;color:var(--text-muted);">Loading sessions...</div></div>
  `;
  await loadSessions('upcoming');
}

let allSessions = [];

async function loadSessions(filter) {
  try {
    const res = await fetch('/api/sessions');
    allSessions = await res.json();
    filterSessions(filter || 'upcoming');
  } catch {
    document.getElementById('sessionsList').innerHTML = '<p>Error loading sessions.</p>';
  }
}

function filterSessions(tab) {
  document.querySelectorAll('.sessions-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  const filtered = allSessions.filter(s => s.status === tab);
  const container = document.getElementById('sessionsList');

  if (filtered.length === 0) {
    const msgs = { upcoming: 'No upcoming sessions', completed: 'No completed sessions yet', cancelled: 'No cancelled sessions' };
    container.innerHTML = `
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M13 2v4M7 2v4M3 8h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        <div class="empty-state__title">${msgs[tab]}</div>
        <p class="empty-state__desc">${tab === 'upcoming' ? 'Find a therapist to book your first session.' : ''}</p>
        ${tab === 'upcoming' ? '<button class="btn btn--primary btn--sm" onclick="navigate(\'therapists\')">Find a Therapist</button>' : ''}
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(s => `
    <div class="session-item">
      <div class="session-item__left">
        <div class="session-item__avatar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 12c2.5 0 4.5-2 4.5-4.5S14.5 3 12 3 7.5 5 7.5 7.5 9.5 12 12 12zm0 2c-3 0-9 1.5-9 4.5V21h18v-2.5c0-3-6-4.5-9-4.5z" fill="white"/></svg>
        </div>
        <div>
          <div class="session-item__name">${s.therapist_name}</div>
          <div class="session-item__detail">${s.therapist_title} &middot; ${s.session_format} &middot; ${s.duration}min &middot; &pound;${s.price}</div>
        </div>
      </div>
      <div class="session-item__right">
        <div class="session-item__date">
          <div class="session-item__date-day">${s.date}</div>
          <div class="session-item__date-time">${s.time}</div>
        </div>
        ${s.status === 'upcoming' ? `
          <span class="tag tag--success">Confirmed</span>
          <button class="btn btn--danger-outline btn--xs" onclick="cancelSession(${s.id})">Cancel</button>
        ` : s.status === 'completed' ? '<span class="tag tag--success">Completed</span>' : '<span class="tag tag--danger">Cancelled</span>'}
      </div>
    </div>
  `).join('');
}

async function cancelSession(id) {
  if (!confirm('Are you sure you want to cancel this session?')) return;
  try {
    await fetch(`/api/sessions/${id}/cancel`, { method: 'PUT' });
    showToast('Session cancelled');
    loadNotifCount();
    await loadSessions('upcoming');
  } catch {
    showToast('Failed to cancel session', 'error');
  }
}

// ============ RESOURCES ============
function renderResources(el) {
  const resources = [
    { cat: 'Workplace', title: 'Dealing with Burnout at Work', desc: 'Recognise the signs of burnout and practical strategies for recovery and prevention in the workplace.', grad: 'linear-gradient(135deg, #ede9fe, #e0e7ff)', icon: '#6366f1' },
    { cat: 'Self-Help', title: 'Managing Anxiety: Practical Tips', desc: 'Evidence-based strategies you can use today to better manage anxious thoughts and feelings.', grad: 'linear-gradient(135deg, #d1fae5, #e0f2fe)', icon: '#10b981' },
    { cat: 'Wellbeing', title: 'Building Resilience in Everyday Life', desc: 'How to develop mental resilience and bounce back from life\'s setbacks with greater strength.', grad: 'linear-gradient(135deg, #fef3c7, #fce7f3)', icon: '#f59e0b' },
    { cat: 'Guide', title: 'Understanding Depression', desc: 'Learn about the signs, symptoms, and treatment options for depression, and when to seek professional help.', grad: 'linear-gradient(135deg, #e0e7ff, #ede9fe)', icon: '#6366f1' },
    { cat: 'Workplace', title: 'Healthy Work-Life Balance', desc: 'Practical tips for setting boundaries, managing your time, and maintaining wellbeing alongside a demanding job.', grad: 'linear-gradient(135deg, #fce7f3, #fef3c7)', icon: '#ec4899' },
    { cat: 'Workplace', title: 'Stress Management Techniques', desc: 'Simple, evidence-based tools you can use anywhere to reduce stress and regain calm during busy periods.', grad: 'linear-gradient(135deg, #d1fae5, #ccfbf1)', icon: '#14b8a6' },
    { cat: 'Self-Help', title: 'Mindfulness for Beginners', desc: 'A simple introduction to mindfulness practice and how it can improve your mental wellbeing.', grad: 'linear-gradient(135deg, #e0f2fe, #d1fae5)', icon: '#0ea5e9' },
    { cat: 'Wellbeing', title: 'Sleep and Mental Health', desc: 'Explore the connection between sleep quality and mental health, with tips for better rest.', grad: 'linear-gradient(135deg, #ede9fe, #fce7f3)', icon: '#8b5cf6' },
    { cat: 'Relationships', title: 'Communicating Better at Work', desc: 'Expert advice on improving workplace communication, resolving conflict, and building stronger professional relationships.', grad: 'linear-gradient(135deg, #fef3c7, #e0e7ff)', icon: '#f59e0b' },
  ];

  el.innerHTML = `
    <div class="page-header">
      <h1 class="page-header__title">Resources</h1>
      <p class="page-header__subtitle">Expert articles and guides to support your mental health and workplace wellbeing.</p>
    </div>
    <div class="resources-grid">
      ${resources.map(r => `
        <div class="resource-card" onclick="showToast('Article coming soon!')">
          <div class="resource-card__img" style="background:${r.grad};">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M12 6.5a.5.5 0 11-1 0 .5.5 0 011 0zM12 12a.5.5 0 11-1 0 .5.5 0 011 0zM12 17.5a.5.5 0 11-1 0 .5.5 0 011 0z" stroke="${r.icon}" stroke-width="1.5"/><rect x="3" y="3" width="18" height="18" rx="3" stroke="${r.icon}" stroke-width="1.5"/></svg>
          </div>
          <div class="resource-card__body">
            <div class="resource-card__cat">${r.cat}</div>
            <div class="resource-card__title">${r.title}</div>
            <div class="resource-card__desc">${r.desc}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ============ NOTIFICATIONS ============
async function renderNotifications(el) {
  el.innerHTML = `
    <div class="page-header" style="display:flex;align-items:center;justify-content:space-between;">
      <div>
        <h1 class="page-header__title">Notifications</h1>
        <p class="page-header__subtitle">Stay updated on your sessions and account activity.</p>
      </div>
      <button class="btn btn--ghost btn--sm" onclick="markAllRead()">Mark all as read</button>
    </div>
    <div id="notifList"><div style="text-align:center;padding:40px;color:var(--text-muted);">Loading...</div></div>
  `;

  try {
    const res = await fetch('/api/notifications');
    const notifs = await res.json();
    const container = document.getElementById('notifList');

    if (notifs.length === 0) {
      container.innerHTML = `<div class="empty-state"><div class="empty-state__title">No notifications</div><p class="empty-state__desc">You're all caught up!</p></div>`;
      return;
    }

    container.innerHTML = notifs.map(n => `
      <div class="notif-item ${n.read ? '' : 'unread'}" onclick="markNotifRead(${n.id}, this)">
        <div class="notif-item__icon notif-item__icon--${n.type === 'success' ? 'success' : n.type === 'warning' ? 'warning' : 'info'}">
          ${n.type === 'success' ? '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 8l3 3 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' :
            n.type === 'warning' ? '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 5v3m0 2.5v.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' :
            '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 5v3m0 2.5v.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'}
        </div>
        <div class="notif-item__content">
          <div class="notif-item__title">${n.title}</div>
          <div class="notif-item__message">${n.message}</div>
          <div class="notif-item__time">${timeAgo(n.created_at)}</div>
        </div>
      </div>
    `).join('');
  } catch {
    document.getElementById('notifList').innerHTML = '<p>Error loading notifications.</p>';
  }
}

async function markNotifRead(id, el) {
  await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
  el.classList.remove('unread');
  loadNotifCount();
}

async function markAllRead() {
  await fetch('/api/notifications/read-all', { method: 'PUT' });
  document.querySelectorAll('.notif-item.unread').forEach(el => el.classList.remove('unread'));
  loadNotifCount();
  showToast('All notifications marked as read');
}

// ============ PROFILE ============
async function renderProfile(el) {
  el.innerHTML = `
    <div class="page-header">
      <h1 class="page-header__title">My Profile</h1>
      <p class="page-header__subtitle">Manage your account details and preferences.</p>
    </div>

    <div class="profile-header">
      <div class="profile-avatar" style="background:${currentUser.avatar_color};">
        ${currentUser.first_name[0].toUpperCase()}
      </div>
      <div class="profile-info">
        <div class="profile-info__name">${currentUser.first_name} ${currentUser.last_name}</div>
        <div class="profile-info__email">${currentUser.email}</div>
        <div class="profile-info__since">
          ${currentUser.org_name ? `${currentUser.org_name} &middot; ${currentUser.role === 'admin' ? 'Admin' : 'Employee'} &middot; ` : ''}
          Member since ${new Date(currentUser.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
        </div>
      </div>
    </div>

    <div class="profile-grid">
      <div class="card card--no-hover">
        <div class="card__title">Personal Information</div>
        <form id="profileForm">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="form-group">
              <label class="form-label">First Name</label>
              <input class="form-input" type="text" id="profFirstName" value="${currentUser.first_name}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Last Name</label>
              <input class="form-input" type="text" id="profLastName" value="${currentUser.last_name}" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Phone</label>
            <input class="form-input" type="tel" id="profPhone" value="${currentUser.phone || ''}" placeholder="+44 7XXX XXXXXX">
          </div>
          <div class="form-group">
            <label class="form-label">About Me</label>
            <textarea class="form-textarea" id="profDesc" placeholder="Tell your therapist a little about yourself...">${currentUser.description || ''}</textarea>
          </div>
          <button type="submit" class="btn btn--primary btn--md">Save Changes</button>
        </form>
      </div>

      <div style="display:flex;flex-direction:column;gap:24px;">
        <div class="card card--no-hover">
          <div class="card__title">Change Password</div>
          <form id="passwordForm">
            <div class="form-group">
              <label class="form-label">Current Password</label>
              <input class="form-input" type="password" id="currentPw" required>
            </div>
            <div class="form-group">
              <label class="form-label">New Password</label>
              <input class="form-input" type="password" id="newPw" required minlength="8" placeholder="At least 8 characters">
            </div>
            <button type="submit" class="btn btn--outline btn--md">Update Password</button>
          </form>
        </div>

        <div class="self-test-card" style="cursor:pointer;" onclick="navigate('self-test')">
          <h3>Take the Self-Test</h3>
          <p>A free, confidential 5-minute mood assessment to understand how you've been feeling.</p>
          <button class="btn btn--white btn--sm">Start Assessment</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: document.getElementById('profFirstName').value,
          lastName: document.getElementById('profLastName').value,
          phone: document.getElementById('profPhone').value,
          description: document.getElementById('profDesc').value,
        })
      });
      if (res.ok) {
        const meRes = await fetch('/api/me');
        currentUser = await meRes.json();
        updateUserUI();
        showToast('Profile updated!');
      }
    } catch { showToast('Failed to update profile', 'error'); }
  });

  document.getElementById('passwordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/me/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: document.getElementById('currentPw').value,
          newPassword: document.getElementById('newPw').value,
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Password updated!');
        document.getElementById('passwordForm').reset();
      } else {
        showToast(data.error, 'error');
      }
    } catch { showToast('Failed to update password', 'error'); }
  });
}

// ============ SELF-TEST ============
const selfTestQuestions = [
  { q: 'How often have you felt down, depressed, or hopeless?', options: ['Not at all', 'Several days', 'More than half', 'Nearly every day'] },
  { q: 'How often have you felt nervous, anxious, or on edge?', options: ['Not at all', 'Several days', 'More than half', 'Nearly every day'] },
  { q: 'How often have you had trouble relaxing?', options: ['Not at all', 'Several days', 'More than half', 'Nearly every day'] },
  { q: 'How often have you felt little interest or pleasure in doing things?', options: ['Not at all', 'Several days', 'More than half', 'Nearly every day'] },
  { q: 'How often have you had trouble sleeping (too much or too little)?', options: ['Not at all', 'Several days', 'More than half', 'Nearly every day'] },
  { q: 'How often have you felt tired or had little energy?', options: ['Not at all', 'Several days', 'More than half', 'Nearly every day'] },
  { q: 'How often have you had difficulty concentrating on things?', options: ['Not at all', 'Several days', 'More than half', 'Nearly every day'] },
  { q: 'How often have you felt bad about yourself, or that you\'ve let yourself or your family down?', options: ['Not at all', 'Several days', 'More than half', 'Nearly every day'] },
  { q: 'How often have you been bothered by worrying too much about different things?', options: ['Not at all', 'Several days', 'More than half', 'Nearly every day'] },
  { q: 'How would you rate your overall emotional wellbeing right now?', options: ['Very good', 'Good', 'Fair', 'Poor'] },
];

let selfTestAnswers = [];

function renderSelfTest(el) {
  selfTestAnswers = new Array(selfTestQuestions.length).fill(-1);

  el.innerHTML = `
    <div class="page-header">
      <h1 class="page-header__title">Self-Assessment</h1>
      <p class="page-header__subtitle">This confidential mood assessment takes about 5 minutes. Answer honestly — there are no right or wrong answers.${currentUser.org_name ? ' Your responses are completely private and never shared with your employer.' : ''}</p>
    </div>
    <div id="selfTestQuestions">
      ${selfTestQuestions.map((q, i) => `
        <div class="self-test-q">
          <div class="self-test-q__text">${i + 1}. ${q.q}</div>
          <div class="self-test-q__options">
            ${q.options.map((opt, j) => `
              <button type="button" class="self-test-q__opt" data-q="${i}" data-v="${j}" onclick="selectTestAnswer(${i}, ${j}, this)">${opt}</button>
            `).join('')}
          </div>
        </div>
      `).join('')}
      <button class="btn btn--primary btn--lg btn--full" onclick="submitSelfTest()" style="margin-top:16px;">Submit Assessment</button>
      <p style="font-size:13px;color:var(--text-muted);text-align:center;margin-top:12px;line-height:1.6;">
        This is a screening tool, not a clinical diagnosis. If you're in crisis, please contact the Samaritans at 116 123 (UK) or your local emergency services.
      </p>
    </div>
    <div id="selfTestResult" style="display:none;"></div>
  `;
}

function selectTestAnswer(qIdx, val, btn) {
  selfTestAnswers[qIdx] = val;
  btn.parentElement.querySelectorAll('.self-test-q__opt').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

async function submitSelfTest() {
  if (selfTestAnswers.includes(-1)) {
    showToast('Please answer all questions', 'error');
    return;
  }

  const score = selfTestAnswers.reduce((a, b) => a + b, 0);
  let resultText, resultClass;

  if (score <= 8) {
    resultText = 'Your results suggest you\'re doing well. Keep prioritising your mental health!';
    resultClass = 'success';
  } else if (score <= 16) {
    resultText = 'Your results suggest mild difficulties. Speaking with a therapist could provide helpful support and strategies.';
    resultClass = 'warning';
  } else if (score <= 24) {
    resultText = 'Your results suggest moderate difficulties. We recommend speaking with a professional therapist who can help.';
    resultClass = 'warning';
  } else {
    resultText = 'Your results suggest significant difficulties. We strongly recommend connecting with a therapist for professional support.';
    resultClass = 'danger';
  }

  try {
    await fetch('/api/self-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: selfTestAnswers, score, resultText })
    });
    loadNotifCount();
  } catch {}

  document.getElementById('selfTestQuestions').style.display = 'none';
  document.getElementById('selfTestResult').style.display = 'block';
  document.getElementById('selfTestResult').innerHTML = `
    <div class="card card--no-hover" style="text-align:center;padding:48px 32px;">
      <div style="width:80px;height:80px;border-radius:50%;background:var(--${resultClass === 'success' ? 'success-bg' : resultClass === 'warning' ? 'warning-bg' : 'danger-bg'});display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">
        <span style="font-size:36px;font-weight:700;color:var(--${resultClass === 'success' ? 'success' : resultClass === 'warning' ? 'warning' : 'danger'});">${score}</span>
      </div>
      <h2 style="font-family:var(--font-serif);font-size:24px;margin-bottom:12px;">Your Score: ${score}/40</h2>
      <p style="font-size:16px;color:var(--text-sec);line-height:1.7;max-width:500px;margin:0 auto 24px;">${resultText}</p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
        ${score > 8 ? '<button class="btn btn--primary btn--md" onclick="navigate(\'therapists\')">Find a Therapist</button>' : ''}
        <button class="btn btn--ghost btn--md" onclick="navigate('self-test')">Take Again</button>
        <button class="btn btn--ghost btn--md" onclick="navigate('dashboard')">Back to Dashboard</button>
      </div>
      <p style="font-size:12px;color:var(--text-muted);margin-top:24px;line-height:1.6;">
        This assessment is for informational purposes only and is not a clinical diagnosis.${currentUser.org_name ? ' Your results are completely private and never shared with your employer.' : ''}<br>
        If you're experiencing a mental health emergency, please contact the Samaritans at 116 123 or your local emergency services.
      </p>
    </div>
  `;
}
