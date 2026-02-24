import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, getProfile } from '../lib/supabaseClient';
import { ROLES } from '../lib/roles';

const AuthContext = createContext(null);

const ONBOARDING_KEY = 'feelya_onboarding';

/* ── Map a profiles row → the app-wide user shape ── */
function profileToUser(profile) {
  return {
    id: profile.id,
    email: profile.email,
    role: profile.role || ROLES.EMPLOYEE,
    companyId: profile.company_id || null,
    companyName: null,
    first_name: profile.email?.split('@')[0] || '',
    last_name: '',
    avatar_color: '#6366f1',
  };
}

/* ── Fetch existing profile or auto-create with role=EMPLOYEE ── */
async function ensureProfile(sessionUser) {
  const existing = await getProfile(sessionUser.id);
  if (existing) return existing;

  // No row → insert a default EMPLOYEE profile
  const { data, error } = await supabase
    .from('profiles')
    .insert({ id: sessionUser.id, email: sessionUser.email, role: ROLES.EMPLOYEE })
    .select()
    .single();
  if (error) throw error;
  return data;
}

/* ── Onboarding persistence (stays in localStorage) ── */
function loadOnboarding() {
  try {
    const stored = localStorage.getItem(ONBOARDING_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return {};
}

function saveOnboarding(state) {
  localStorage.setItem(ONBOARDING_KEY, JSON.stringify(state));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onboarding, setOnboarding] = useState(() => loadOnboarding());

  /* ── Bootstrap: resolve existing Supabase session ── */
  useEffect(() => {
    let cancelled = false;

    // 1. Check for an existing session (page reload / returning visitor)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (cancelled) return;
      if (session?.user) {
        try {
          const profile = await ensureProfile(session.user);
          if (!cancelled) setUser(profileToUser(profile));
        } catch (err) {
          console.error('[Auth] failed to load profile:', err);
        }
      }
      if (!cancelled) setLoading(false);
    });

    // 2. React to auth changes (sign-out from another tab, token refresh, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (cancelled) return;
        if (event === 'SIGNED_OUT' || !session?.user) {
          setUser(null);
          return;
        }
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          try {
            const profile = await ensureProfile(session.user);
            if (!cancelled) setUser(profileToUser(profile));
          } catch (err) {
            console.error('[Auth] auth-state-change profile error:', err);
          }
        }
      },
    );

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  /* ── WhoAmI: dev-only debug log whenever user changes ── */
  useEffect(() => {
    if (import.meta.env.DEV && user) {
      console.log(
        '%c[WhoAmI]',
        'color:#6366f1;font-weight:bold',
        { email: user.email, role: user.role, companyId: user.companyId },
      );
    }
  }, [user]);

  /* ── Login (returns { success, user } or { success, error }) ── */
  const login = useCallback(async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };

      const profile = await ensureProfile(data.user);
      const appUser = profileToUser(profile);
      setUser(appUser);
      return { success: true, user: appUser };
    } catch (err) {
      return { success: false, error: err.message || 'Login failed' };
    }
  }, []);

  /* ── Logout ── */
  const logout = useCallback(async () => {
    setUser(null); // clear immediately so UI redirects right away
    await supabase.auth.signOut().catch(() => {});
  }, []);

  /* ── Dev-only role switch (local override — no Supabase mutation) ── */
  const switchRole = useCallback((role) => {
    setUser((prev) => (prev ? { ...prev, role } : prev));
  }, []);

  const updateUser = useCallback(() => {}, []);

  /* ── Onboarding helpers (unchanged — localStorage) ── */
  const getOnboardingStatus = useCallback(
    (role, userId) => {
      const key = `${role}:${userId}`;
      return onboarding[key] || null;
    },
    [onboarding],
  );

  const completeOnboarding = useCallback((role, userId, data) => {
    setOnboarding((prev) => {
      const key = `${role}:${userId}`;
      const next = { ...prev, [key]: { completed: true, ...data, completedAt: new Date().toISOString() } };
      saveOnboarding(next);
      return next;
    });
  }, []);

  const resetOnboarding = useCallback((role, userId) => {
    setOnboarding((prev) => {
      const key = `${role}:${userId}`;
      const next = { ...prev };
      delete next[key];
      saveOnboarding(next);
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        switchRole,
        updateUser,
        getOnboardingStatus,
        completeOnboarding,
        resetOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
