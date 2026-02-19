import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useActor } from './useActor';
import { useQueryClient } from '@tanstack/react-query';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  employeeId: string | null;
  employeeRole: string | null;
  login: (id: string, password: string, rememberMe: boolean) => Promise<boolean>;
  logout: () => void;
  isMaster: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const AUTH_KEY = 'luid_admin_auth';
const EMPLOYEE_ID_KEY = 'luid_employee_id';
const EMPLOYEE_ROLE_KEY = 'luid_employee_role';

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [employeeRole, setEmployeeRole] = useState<string | null>(null);
  const { actor } = useActor();
  const queryClient = useQueryClient();

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY);
    const storedId = localStorage.getItem(EMPLOYEE_ID_KEY) || sessionStorage.getItem(EMPLOYEE_ID_KEY);
    const storedRole = localStorage.getItem(EMPLOYEE_ROLE_KEY) || sessionStorage.getItem(EMPLOYEE_ROLE_KEY);
    
    if (stored === 'authenticated' && storedId && storedRole) {
      setIsAuthenticated(true);
      setEmployeeId(storedId);
      setEmployeeRole(storedRole);
    }
  }, []);

  const login = async (id: string, password: string, rememberMe: boolean): Promise<boolean> => {
    if (!actor) return false;

    try {
      const authenticated = await actor.authenticateEmployee(id, password);
      
      if (authenticated) {
        // Fetch employee profile to get role
        const profile = await actor.getCallerUserProfile();
        
        if (profile) {
          setIsAuthenticated(true);
          setEmployeeId(profile.employeeId);
          setEmployeeRole(profile.role);

          const storage = rememberMe ? localStorage : sessionStorage;
          storage.setItem(AUTH_KEY, 'authenticated');
          storage.setItem(EMPLOYEE_ID_KEY, profile.employeeId);
          storage.setItem(EMPLOYEE_ROLE_KEY, profile.role);
          
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setEmployeeId(null);
    setEmployeeRole(null);
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(EMPLOYEE_ID_KEY);
    localStorage.removeItem(EMPLOYEE_ROLE_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(EMPLOYEE_ID_KEY);
    sessionStorage.removeItem(EMPLOYEE_ROLE_KEY);
    queryClient.clear();
  };

  const isMaster = employeeRole === 'Master';

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, employeeId, employeeRole, login, logout, isMaster }}>
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
