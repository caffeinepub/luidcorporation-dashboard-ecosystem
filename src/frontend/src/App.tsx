import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from './hooks/useTheme';
import { AdminAuthProvider } from './hooks/useAdminAuth';
import { ClientAuthProvider } from './hooks/useClientAuth';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import ClientLogin from './pages/ClientLogin';
import ClientDashboard from './pages/ClientDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ClientProtectedRoute from './components/ClientProtectedRoute';
import Footer from './components/Footer';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const rootRoute = createRootRoute({
  component: () => (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <Toaster />
    </div>
  ),
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin-login',
  component: AdminLogin,
});

const adminPanelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin-panel',
  component: () => (
    <ProtectedRoute>
      <AdminPanel />
    </ProtectedRoute>
  ),
});

const clientLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: ClientLogin,
});

const clientDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    <ClientProtectedRoute>
      <ClientDashboard />
    </ClientProtectedRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  adminLoginRoute,
  adminPanelRoute,
  clientLoginRoute,
  clientDashboardRoute,
]);

const router = createRouter({ routeTree });

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AdminAuthProvider>
          <ClientAuthProvider>
            <RouterProvider router={router} />
          </ClientAuthProvider>
        </AdminAuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
