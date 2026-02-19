import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useClientAuth } from '../hooks/useClientAuth';
import { useActor } from '../hooks/useActor';
import { toast } from 'sonner';
import { Cloud, Loader2 } from 'lucide-react';

export default function ClientLogin() {
  const [idLuid, setIdLuid] = useState('');
  const [senha, setSenha] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useClientAuth();
  const { actor } = useActor();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate({ to: '/client-dashboard' });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!idLuid.trim() || !senha.trim()) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);

    try {
      if (!actor) {
        toast.error('Sistema não inicializado. Tente novamente.');
        setIsLoading(false);
        return;
      }

      const clientData = await actor.getClientRecord(idLuid);
      
      if (clientData.senhaCliente !== senha) {
        toast.error('Credenciais inválidas. Verifique seu ID e senha.');
        setIsLoading(false);
        return;
      }

      login(clientData, rememberMe);
      toast.success('Login realizado com sucesso!');
      navigate({ to: '/client-dashboard' });
    } catch (error) {
      toast.error('ID Luid não encontrado. Verifique e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-neon-green/20 bg-card-dark">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neon-green/10">
            <Cloud className="h-8 w-8 text-neon-green" />
          </div>
          <CardTitle className="text-2xl font-bold text-neon-green">Portal do Cliente</CardTitle>
          <CardDescription>Acesse seu dashboard LuidCloud</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="idLuid">ID Luid</Label>
              <Input
                id="idLuid"
                type="text"
                value={idLuid}
                onChange={(e) => setIdLuid(e.target.value)}
                placeholder="Digite seu ID Luid"
                required
                className="border-neon-green/30 bg-carbon-black focus:border-neon-green"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                required
                className="border-neon-green/30 bg-carbon-black focus:border-neon-green"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="border-neon-green/30 data-[state=checked]:bg-neon-green data-[state=checked]:text-carbon-black"
              />
              <Label
                htmlFor="rememberMe"
                className="text-sm font-normal text-muted-foreground cursor-pointer"
              >
                Manter conectado
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-neon-green text-carbon-black hover:bg-neon-green/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Conectando...
                </>
              ) : (
                'Acessar Dashboard'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
