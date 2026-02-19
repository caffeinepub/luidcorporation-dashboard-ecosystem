import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Monitor, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface RdpInstructionsCardProps {
  ipVps: string;
  userVps: string;
  senhaVps: string;
}

export default function RdpInstructionsCard({ ipVps, userVps, senhaVps }: RdpInstructionsCardProps) {
  const copyIpToClipboard = () => {
    navigator.clipboard.writeText(ipVps);
    toast.success('IP copiado para a área de transferência!');
  };

  return (
    <Card className="border-neon-green/20 bg-card-dark">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Monitor className="h-5 w-5 text-neon-green" />
          <CardTitle className="text-neon-green">Instruções de Conexão RDP</CardTitle>
        </div>
        <CardDescription>Como conectar ao seu servidor Windows via Remote Desktop</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-carbon-black/50 p-4 border border-neon-green/20">
          <p className="text-sm text-muted-foreground mb-3">
            RDP (Remote Desktop Protocol) permite que você acesse e controle seu servidor Windows remotamente com interface gráfica completa.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Passos para conectar:</h4>
          <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            <li>Pressione <kbd className="px-2 py-1 text-xs bg-carbon-black border border-neon-green/30 rounded">Windows + R</kbd> no seu teclado</li>
            <li>Digite <code className="text-neon-green font-mono">mstsc</code> e pressione Enter</li>
            <li>Na janela de Conexão de Área de Trabalho Remota, insira o IP do servidor:</li>
          </ol>

          <div className="relative rounded-lg bg-carbon-black border border-neon-green/30 p-3">
            <code className="text-neon-green text-sm font-mono">{ipVps}</code>
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-2 top-2 h-7 w-7 p-0 hover:bg-neon-green/10"
              onClick={copyIpToClipboard}
            >
              <Copy className="h-3.5 w-3.5 text-neon-green" />
            </Button>
          </div>

          <ol start={4} className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            <li>Clique em <strong>Conectar</strong></li>
            <li>Quando solicitado, insira suas credenciais VPS:
              <ul className="ml-6 mt-1 space-y-1 list-disc">
                <li>Usuário: <code className="text-neon-green font-mono">{userVps}</code></li>
                <li>Senha: (use a senha VPS fornecida)</li>
              </ul>
            </li>
            <li>Clique em OK para estabelecer a conexão</li>
          </ol>
        </div>

        <div className="rounded-lg bg-neon-green/10 p-3 border border-neon-green/30">
          <p className="text-xs text-neon-green">
            💡 Dica: Você pode salvar a conexão para acesso rápido futuro clicando em "Salvar" antes de conectar.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
