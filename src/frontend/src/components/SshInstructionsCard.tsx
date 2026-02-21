import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SshInstructionsCardProps {
  ipVps: string;
  userVps: string;
}

export default function SshInstructionsCard({ ipVps, userVps }: SshInstructionsCardProps) {
  const sshCommand = `ssh ${userVps}@${ipVps}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sshCommand);
    toast.success('Comando copiado para a área de transferência!');
  };

  return (
    <Card className="border-neon-green/20 bg-card-dark card-glow">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-neon-green" />
          <CardTitle className="text-neon-green">Instruções de Conexão SSH</CardTitle>
        </div>
        <CardDescription>Como conectar ao seu servidor Ubuntu via SSH</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-carbon-black/50 p-4 border border-neon-green/20">
          <p className="text-sm text-muted-foreground mb-3">
            SSH (Secure Shell) é um protocolo de rede que permite acesso seguro ao seu servidor Ubuntu através da linha de comando.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Passos para conectar:</h4>
          <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            <li>Abra o terminal no seu computador</li>
            <li>Execute o comando SSH abaixo:</li>
          </ol>

          <div className="relative rounded-lg bg-carbon-black border border-neon-green/30 p-3">
            <code className="text-neon-green text-sm font-mono">{sshCommand}</code>
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-2 top-2 h-7 w-7 p-0 hover:bg-neon-green/10"
              onClick={copyToClipboard}
            >
              <Copy className="h-3.5 w-3.5 text-neon-green" />
            </Button>
          </div>

          <ol start={3} className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            <li>Quando solicitado, digite a senha VPS fornecida</li>
            <li>Pressione Enter para conectar</li>
          </ol>
        </div>

        <div className="rounded-lg bg-neon-green/10 p-3 border border-neon-green/30">
          <p className="text-xs text-neon-green">
            💡 Dica: No Windows, você pode usar o PowerShell ou instalar o Windows Terminal para uma melhor experiência.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
