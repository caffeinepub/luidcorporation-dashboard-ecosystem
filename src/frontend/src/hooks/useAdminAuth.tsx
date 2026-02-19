import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (id: string, password: string, rememberMe: boolean) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_ID = 'SidneiCosta00';
const ADMIN_PASSWORD = 'Nikebolado@4';
const AUTH_KEY = 'luid_admin_auth';

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY);
    if (stored === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (id: string, password: string, rememberMe: boolean): boolean => {
    if (id === ADMIN_ID && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      if (rememberMe) {
        localStorage.setItem(AUTH_KEY, 'authenticated');
      } else {
        sessionStorage.setItem(AUTH_KEY, 'authenticated');
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}
