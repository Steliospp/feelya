import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'feelya_auth';

const MOCK_USERS = {
  'employee@demo.com': { id: 'emp-1', email: 'employee@demo.com', role: 'EMPLOYEE', companyId: 'comp-1', companyName: 'Acme Corp', first_name: 'Alex', last_name: 'Taylor', avatar_color: '#6366f1' },
  'hr@demo.com': { id: 'hr-1', email: 'hr@demo.com', role: 'HR_ADMIN', companyId: 'comp-1', companyName: 'Acme Corp', first_name: 'Sam', last_name: 'Rivera', avatar_color: '#8b5cf6' },
  'therapist@demo.com': { id: 'th-1', email: 'therapist@demo.com', role: 'THERAPIST', companyId: 'feelya', companyName: 'Feelya', first_name: 'Sarah', last_name: 'Chen', avatar_color: '#c4b5fd', credentials: 'Clinical Psychologist, PhD', specialties: ['Anxiety', 'CBT', 'Stress'] },
  'admin@feelya.com': { id: 'sa-1', email: 'admin@feelya.com', role: 'SUPER_ADMIN', companyId: 'feelya', companyName: 'Feelya', first_name: 'Jordan', last_name: 'Lee', avatar_color: '#10b981' },
};

function loadAuth() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.isAuthed && parsed.user) return parsed.user;
    }
  } catch {}
  return null;
}

function saveAuth(user) {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ isAuthed: true, user }));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadAuth());
  const loading = false;

  const login = useCallback((email, _password) => {
    const mockUser = MOCK_USERS[email.toLowerCase()];
    if (mockUser) {
      setUser(mockUser);
      saveAuth(mockUser);
      return { success: true, user: mockUser };
    }
    // For any other email, default to EMPLOYEE
    const fallbackUser = {
      id: 'user-' + Date.now(),
      email,
      role: 'EMPLOYEE',
      companyId: 'comp-1',
      companyName: 'Acme Corp',
      first_name: email.split('@')[0],
      last_name: '',
      avatar_color: '#6366f1',
    };
    setUser(fallbackUser);
    saveAuth(fallbackUser);
    return { success: true, user: fallbackUser };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    saveAuth(null);
  }, []);

  const switchRole = useCallback((role) => {
    const roleMap = {
      EMPLOYEE: MOCK_USERS['employee@demo.com'],
      HR_ADMIN: MOCK_USERS['hr@demo.com'],
      THERAPIST: MOCK_USERS['therapist@demo.com'],
      SUPER_ADMIN: MOCK_USERS['admin@feelya.com'],
    };
    const newUser = roleMap[role];
    if (newUser) {
      setUser(newUser);
      saveAuth(newUser);
    }
    return newUser;
  }, []);

  const updateUser = useCallback(() => {}, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, switchRole, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
