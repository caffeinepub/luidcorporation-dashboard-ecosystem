import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useNetworkMonitoringStatus, useUpdateNetworkMonitoringStatus } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Activity, Loader2 } from 'lucide-react';

export default function NetworkMonitoringToggle() {
  const { data: status, isLoading } = useNetworkMonitoringStatus();
  const setStatus = useUpdateNetworkMonitoringStatus();

  const handleStatusChange = async (newStatus: string) => {
    try {
      await setStatus.mutateAsync(newStatus);
      toast.success(`Monitoramento alterado para ${newStatus === 'normal' ? 'Normal' : 'Offline'}`);
    } catch (error) {
      toast.error('Erro ao alterar status do monitoramento');
    }
  };

  return (
    <Card className="border-neon-green/20 bg-card-dark">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-neon-green">
          <Activity className="h-5 w-5" />
          Monitoramento de Rede
        </CardTitle>
        <CardDescription>
          Controle o status do monitoramento de velocidade da rede
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-neon-green" />
          </div>
        ) : (
          <RadioGroup
            value={status || 'normal'}
            onValueChange={handleStatusChange}
            disabled={setStatus.isPending}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border border-neon-green/20 p-4 transition-colors hover:bg-neon-green/5">
              <RadioGroupItem value="normal" id="normal" className="border-neon-green text-neon-green" />
              <Label
                htmlFor="normal"
                className="flex-1 cursor-pointer text-base font-medium text-foreground"
              >
                Normal
                <span className="block text-sm font-normal text-muted-foreground">
                  Monitoramento ativo com velocidade oscilando entre 2.5-4.8 Gbps
                </span>
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border border-neon-green/20 p-4 transition-colors hover:bg-neon-green/5">
              <RadioGroupItem value="offline" id="offline" className="border-neon-green text-neon-green" />
              <Label
                htmlFor="offline"
                className="flex-1 cursor-pointer text-base font-medium text-foreground"
              >
                Offline
                <span className="block text-sm font-normal text-muted-foreground">
                  Monitoramento desativado - velocidade em 0 Gbps
                </span>
              </Label>
            </div>
          </RadioGroup>
        )}
      </CardContent>
    </Card>
  );
}
