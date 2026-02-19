import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Server, User, Lock, Package } from 'lucide-react';

interface VpsCredentialsCardProps {
  ipVps: string;
  userVps: string;
  senhaVps: string;
  plano: string;
}

export default function VpsCredentialsCard({ ipVps, userVps, senhaVps, plano }: VpsCredentialsCardProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card className="border-neon-green/20 bg-card-dark">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-neon-green">
          <Server className="h-5 w-5" />
          Credenciais VPS
        </CardTitle>
        <CardDescription>Informações de acesso ao seu servidor</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Server className="h-4 w-4" />
            <span>Endereço IP</span>
          </div>
          <div className="rounded-md border border-neon-green/30 bg-carbon-black p-3 font-mono text-sm text-foreground">
            {ipVps}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Usuário</span>
          </div>
          <div className="rounded-md border border-neon-green/30 bg-carbon-black p-3 font-mono text-sm text-foreground">
            {userVps}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span>Senha</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-md border border-neon-green/30 bg-carbon-black p-3 font-mono text-sm text-foreground">
              {showPassword ? senhaVps : '••••••••••••'}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowPassword(!showPassword)}
              className="border-neon-green/30 bg-carbon-black hover:bg-neon-green/10 hover:text-neon-green"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Package className="h-4 w-4" />
            <span>Plano Contratado</span>
          </div>
          <div className="rounded-md border border-neon-green/30 bg-carbon-black p-3 text-sm font-semibold text-neon-green">
            {plano}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
