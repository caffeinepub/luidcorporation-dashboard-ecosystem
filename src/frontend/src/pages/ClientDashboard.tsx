import { useClientAuth } from '../hooks/useClientAuth';
import VpsCredentialsCard from '../components/VpsCredentialsCard';
import NetworkSpeedChart from '../components/NetworkSpeedChart';
import GlobalAnnouncementBanner from '../components/GlobalAnnouncementBanner';
import ClientProfileMenu from '../components/ClientProfileMenu';
import NotificationBell from '../components/NotificationBell';
import { Cloud } from 'lucide-react';

export default function ClientDashboard() {
  const { clientData } = useClientAuth();

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
          <div className="flex items-center gap-3">
            <NotificationBell />
            <ClientProfileMenu />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="mb-2 text-2xl font-bold text-foreground">Bem-vindo, {clientData.nome}</h2>
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
