import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAccessLogs } from '../hooks/useQueries';
import { Loader2, Activity } from 'lucide-react';

export default function ActivityLogsTable() {
  const { data: logs = [], isLoading } = useAccessLogs();

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const sortedLogs = [...logs].sort((a, b) => Number(b.timestamp - a.timestamp));

  return (
    <Card className="border-neon-green/20 bg-card-dark card-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-neon-green">
          <Activity className="h-5 w-5" />
          Logs de Atividade
        </CardTitle>
        <CardDescription>
          Monitoramento de acessos ao sistema em tempo real
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-neon-green" />
          </div>
        ) : logs.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            Nenhum log de acesso registrado ainda
          </div>
        ) : (
          <div className="rounded-md border border-neon-green/20">
            <Table>
              <TableHeader>
                <TableRow className="border-neon-green/20 hover:bg-neon-green/5">
                  <TableHead className="text-neon-green">ID do Cliente</TableHead>
                  <TableHead className="text-neon-green">Data/Hora do Acesso</TableHead>
                  <TableHead className="text-neon-green">Endereço IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedLogs.map((log, index) => (
                  <TableRow key={index} className="border-neon-green/10 hover:bg-neon-green/5">
                    <TableCell className="font-mono text-foreground">{log.clientId}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatTimestamp(log.timestamp)}
                    </TableCell>
                    <TableCell className="font-mono text-foreground">{log.ipAddress}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
