import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAdminLogin } from './useQueries';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (id: string, password: string, rememberMe: boolean) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const AUTH_KEY = 'luid_admin_auth';

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const adminLoginMutation = useAdminLogin();

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY);
    if (stored === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (id: string, password: string, rememberMe: boolean): Promise<boolean> => {
    try {
      const result = await adminLoginMutation.mutateAsync({ username: id, password });
      
      if (result) {
        setIsAuthenticated(true);
        if (rememberMe) {
          localStorage.setItem(AUTH_KEY, 'authenticated');
        } else {
          sessionStorage.setItem(AUTH_KEY, 'authenticated');
        }
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
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
