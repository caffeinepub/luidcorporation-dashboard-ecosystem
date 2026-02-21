import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAllClientRecords } from '../hooks/useQueries';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DatabaseExportButton() {
  const { data: clients = [] } = useAllClientRecords();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const exportData = clients.map(client => ({
        idLuid: client.idLuid,
        nome: client.nome,
        senhaCliente: client.senhaCliente,
        ipVps: client.ipVps,
        userVps: client.userVps,
        senhaVps: client.senhaVps,
        plano: client.plano,
        vmStatus: client.vmStatus,
        operatingSystem: client.operatingSystem,
        planExpiry: client.planExpiry.toString(),
      }));

      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const today = new Date();
      const dateString = today.toISOString().split('T')[0];
      const filename = `luid-database-export-${dateString}.json`;
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Base de dados exportada com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar base de dados');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={isExporting || clients.length === 0}
      className="border-neon-green/30 text-neon-green hover:bg-neon-green/10"
    >
      {isExporting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Exportando...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Exportar Base de Dados
        </>
      )}
    </Button>
  );
}
