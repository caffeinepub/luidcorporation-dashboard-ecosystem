import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import ClientLogin from './pages/ClientLogin';
import ClientDashboard from './pages/ClientDashboard';
import Footer from './components/Footer';
import { AdminAuthProvider } from './hooks/useAdminAuth';
import { ClientAuthProvider } from './hooks/useClientAuth';
import ProtectedRoute from './components/ProtectedRoute';
import ClientProtectedRoute from './components/ClientProtectedRoute';

function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin-login',
  component: AdminLogin,
});

const adminPanelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/luid-master-panel',
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
  path: '/client-dashboard',
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

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
      <AdminAuthProvider>
        <ClientAuthProvider>
          <RouterProvider router={router} />
          <Toaster />
        </ClientAuthProvider>
      </AdminAuthProvider>
    </ThemeProvider>
  );
}
