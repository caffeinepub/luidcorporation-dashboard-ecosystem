import { useClientAuth } from '../hooks/useClientAuth';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import VpsCredentialsCard from '../components/VpsCredentialsCard';
import NetworkSpeedChart from '../components/NetworkSpeedChart';
import GlobalAnnouncementBanner from '../components/GlobalAnnouncementBanner';
import { LogOut, Cloud } from 'lucide-react';

export default function ClientDashboard() {
  const { clientData, logout } = useClientAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: '/' });
  };

  if (!clientData) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-background">
      <GlobalAnnouncementBanner />

      <header className="border-b border-neon-green/20 bg-carbon-black">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Cloud className="h-6 w-6 text-neon-green" />
            <div>
              <h1 className="text-xl font-bold text-neon-green">LuidCloud Dashboard</h1>
              <p className="text-xs text-muted-foreground">ID: {clientData.idLuid}</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-neon-green/30 text-neon-green hover:bg-neon-green/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="mb-2 text-2xl font-bold text-foreground">Bem-vindo ao seu Dashboard</h2>
          <p className="text-muted-foreground">
            Visualize suas credenciais e monitore o desempenho da rede
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <VpsCredentialsCard
              ipVps={clientData.ipVps}
              userVps={clientData.userVps}
              senhaVps={clientData.senhaVps}
              plano={clientData.plano}
            />
          </div>
          <div>
            <NetworkSpeedChart />
          </div>
        </div>
      </main>
    </div>
  );
}
