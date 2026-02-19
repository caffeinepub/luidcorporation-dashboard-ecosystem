import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Circle, Server } from 'lucide-react';
import { VMStatus } from '../backend';
import type { VMStatus as VMStatusType } from '../backend';

interface VMStatusIndicatorProps {
  vmStatus: VMStatusType;
}

export default function VMStatusIndicator({ vmStatus }: VMStatusIndicatorProps) {
  const getStatusDisplay = () => {
    switch (vmStatus) {
      case VMStatus.online:
        return {
          label: 'Online',
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/30',
          description: 'Sua VM está operacional e funcionando normalmente',
        };
      case VMStatus.offline:
        return {
          label: 'Offline',
          color: 'text-red-500',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
          description: 'Sua VM está temporariamente indisponível',
        };
      case VMStatus.maintenance:
        return {
          label: 'Em Manutenção',
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/30',
          description: 'Sua VM está em manutenção programada',
        };
      default:
        return {
          label: 'Online',
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/30',
          description: 'Sua VM está operacional e funcionando normalmente',
        };
    }
  };

  const status = getStatusDisplay();

  return (
    <Card className={`border-neon-green/20 bg-card-dark ${status.borderColor}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-neon-green">
          <Server className="h-5 w-5" />
          Status da VM
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`flex items-center gap-3 rounded-lg ${status.bgColor} p-4`}>
          <Circle className={`h-4 w-4 fill-current ${status.color}`} />
          <div>
            <div className={`text-lg font-bold ${status.color}`}>{status.label}</div>
            <div className="text-sm text-muted-foreground">{status.description}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
