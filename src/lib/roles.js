// ── Role constants ──
export const ROLES = {
  EMPLOYEE: 'EMPLOYEE',
  HR_ADMIN: 'HR_ADMIN',
  THERAPIST: 'THERAPIST',
  SUPER_ADMIN: 'SUPER_ADMIN',
};

// ── Permission checks ──
export function hasRole(user, role) {
  if (!user) return false;
  if (user.role === ROLES.SUPER_ADMIN) return true; // super admin sees everything
  return user.role === role;
}

export function hasAnyRole(user, roles) {
  if (!user) return false;
  if (user.role === ROLES.SUPER_ADMIN) return true;
  return roles.includes(user.role);
}

export function isEmployee(user) {
  return hasRole(user, ROLES.EMPLOYEE);
}

export function isHRAdmin(user) {
  return hasAnyRole(user, [ROLES.HR_ADMIN]);
}

export function isCompanyUser(user) {
  return hasAnyRole(user, [ROLES.EMPLOYEE, ROLES.HR_ADMIN]);
}

// ── Default landing path per role ──
export function homePathForRole(role) {
  switch (role) {
    case ROLES.THERAPIST:    return '/therapist';
    case ROLES.SUPER_ADMIN:  return '/admin';
    default:                 return '/app';
  }
}
