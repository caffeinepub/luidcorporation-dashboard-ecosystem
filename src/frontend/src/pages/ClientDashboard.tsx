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
import Footer from '../components/Footer';
import { Cloud, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ClientDashboard() {
  const { clientData, login } = useClientAuth();
  const { data: clientRecord, isLoading, refetch, isFetching } = useGetClientRecord(clientData?.idLuid || null);

  if (!clientData) {
    return null;
  }

  const handleRefresh = async () => {
    try {
      const result = await refetch();
      if (result.data) {
        // Update the auth context with fresh data
        const rememberMe = localStorage.getItem('luid_client_auth') !== null;
        login(result.data, rememberMe);
        toast.success('Dados atualizados com sucesso!');
      }
    } catch (error) {
      toast.error('Erro ao atualizar dados. Tente novamente.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
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
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isFetching}
              className="border-neon-green/30 text-neon-green hover:bg-neon-green/10 hover:text-neon-green"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              <span className="ml-2 hidden sm:inline">Recarregar</span>
            </Button>
            <NotificationBell />
            <ClientProfileMenu />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="mb-2 text-2xl font-bold text-foreground">Bem-vindo, {clientData.nome}</h2>
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
                  ipVps={clientRecord?.ipVps || clientData.ipVps}
                  userVps={clientRecord?.userVps || clientData.userVps}
                  senhaVps={clientRecord?.senhaVps || clientData.senhaVps}
                  plano={clientRecord?.plano || clientData.plano}
                />
                {clientRecord && <VMStatusIndicator vmStatus={clientRecord.vmStatus} />}
              </div>
              <div>
                <NetworkSpeedChart />
              </div>
            </div>

            {clientRecord && clientRecord.operatingSystem === 'ubuntu' && (
              <SshInstructionsCard 
                ipVps={clientRecord.ipVps} 
                userVps={clientRecord.userVps} 
              />
            )}

            {clientRecord && clientRecord.operatingSystem === 'windows' && (
              <RdpInstructionsCard
                ipVps={clientRecord.ipVps}
                userVps={clientRecord.userVps}
                senhaVps={clientRecord.senhaVps}
              />
            )}
          </div>
        )}
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
}
