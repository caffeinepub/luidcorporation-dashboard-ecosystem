import { useClientAuth } from '../hooks/useClientAuth';
import { useGetClientRecord } from '../hooks/useQueries';
import VpsCredentialsCard from '../components/VpsCredentialsCard';
import NetworkSpeedChart from '../components/NetworkSpeedChart';
import GlobalAnnouncementBanner from '../components/GlobalAnnouncementBanner';
import ClientProfileMenu from '../components/ClientProfileMenu';
import NotificationBell from '../components/NotificationBell';
import ChatWidget from '../components/ChatWidget';
import VMStatusIndicator from '../components/VMStatusIndicator';
import SshInstructionsCard from '../components/SshInstructionsCard';
import RdpInstructionsCard from '../components/RdpInstructionsCard';
import ThemeToggle from '../components/ThemeToggle';
import { Cloud, Loader2 } from 'lucide-react';

export default function ClientDashboard() {
  const { clientData } = useClientAuth();
  const { data: clientRecord, isLoading } = useGetClientRecord(clientData?.idLuid || null);

  if (!clientData) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-background">
      <GlobalAnnouncementBanner />

      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Cloud className="h-6 w-6 text-neon-green" />
            <div>
              <h1 className="text-xl font-bold text-neon-green">LuidCloud Dashboard</h1>
              <p className="text-xs text-muted-foreground">ID: {clientData.idLuid}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <NotificationBell />
            <ClientProfileMenu />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold text-foreground">Bem-vindo, {clientData.nome}</h2>
          <p className="text-muted-foreground">
            Visualize suas credenciais e monitore o desempenho da rede
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-neon-green" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-6">
                <VpsCredentialsCard
                  ipVps={clientData.ipVps}
                  userVps={clientData.userVps}
                  senhaVps={clientData.senhaVps}
                  plano={clientData.plano}
                />
                {clientRecord && <VMStatusIndicator vmStatus={clientRecord.vmStatus} />}
              </div>
              <div>
                <NetworkSpeedChart />
              </div>
            </div>

            {clientRecord && clientRecord.operatingSystem === 'ubuntu' && (
              <SshInstructionsCard ipVps={clientData.ipVps} userVps={clientData.userVps} />
            )}

            {clientRecord && clientRecord.operatingSystem === 'windows' && (
              <RdpInstructionsCard
                ipVps={clientData.ipVps}
                userVps={clientData.userVps}
                senhaVps={clientData.senhaVps}
              />
            )}
          </div>
        )}
      </main>

      <ChatWidget />
    </div>
  );
}
