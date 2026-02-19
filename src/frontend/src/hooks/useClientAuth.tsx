import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { ClientRecord } from '../backend';

interface ClientAuthContextType {
  isAuthenticated: boolean;
  clientData: ClientRecord | null;
  login: (clientData: ClientRecord) => void;
  logout: () => void;
}

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(undefined);

const CLIENT_AUTH_KEY = 'luid_client_auth';

export function ClientAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [clientData, setClientData] = useState<ClientRecord | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(CLIENT_AUTH_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setClientData(data);
        setIsAuthenticated(true);
      } catch (e) {
        sessionStorage.removeItem(CLIENT_AUTH_KEY);
      }
    }
  }, []);

  const login = (data: ClientRecord) => {
    setClientData(data);
    setIsAuthenticated(true);
    sessionStorage.setItem(CLIENT_AUTH_KEY, JSON.stringify(data));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setClientData(null);
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
