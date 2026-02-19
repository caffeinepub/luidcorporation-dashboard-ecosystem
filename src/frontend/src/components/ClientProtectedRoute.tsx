import { ReactNode, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useClientAuth } from '../hooks/useClientAuth';

export default function ClientProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useClientAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
