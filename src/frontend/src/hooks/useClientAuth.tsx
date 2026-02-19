import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { ClientRecord } from '../backend';

interface ClientAuthContextType {
  isAuthenticated: boolean;
  clientData: ClientRecord | null;
  login: (clientData: ClientRecord, rememberMe?: boolean) => void;
  logout: () => void;
}

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(undefined);

const CLIENT_AUTH_KEY = 'luid_client_auth';

export function ClientAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [clientData, setClientData] = useState<ClientRecord | null>(null);

  useEffect(() => {
    // Check localStorage first (remember me), then sessionStorage
    const storedLocal = localStorage.getItem(CLIENT_AUTH_KEY);
    const storedSession = sessionStorage.getItem(CLIENT_AUTH_KEY);
    const stored = storedLocal || storedSession;
    
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setClientData(data);
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem(CLIENT_AUTH_KEY);
        sessionStorage.removeItem(CLIENT_AUTH_KEY);
      }
    }
  }, []);

  const login = (data: ClientRecord, rememberMe: boolean = false) => {
    setClientData(data);
    setIsAuthenticated(true);
    
    if (rememberMe) {
      localStorage.setItem(CLIENT_AUTH_KEY, JSON.stringify(data));
      sessionStorage.removeItem(CLIENT_AUTH_KEY);
    } else {
      sessionStorage.setItem(CLIENT_AUTH_KEY, JSON.stringify(data));
      localStorage.removeItem(CLIENT_AUTH_KEY);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setClientData(null);
    localStorage.removeItem(CLIENT_AUTH_KEY);
    sessionStorage.removeItem(CLIENT_AUTH_KEY);
  };

  return (
    <ClientAuthContext.Provider value={{ isAuthenticated, clientData, login, logout }}>
      {children}
    </ClientAuthContext.Provider>
  );
}

export function useClientAuth() {
  const context = useContext(ClientAuthContext);
  if (!context) {
    throw new Error('useClientAuth must be used within ClientAuthProvider');
  }
  return context;
}
