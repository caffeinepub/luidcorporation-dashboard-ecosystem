import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { toast } from 'sonner';
import { Shield, Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate({ to: '/luid-master-panel' });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    const success = login(id, password, rememberMe);

    if (success) {
      toast.success('Login realizado com sucesso!');
      navigate({ to: '/luid-master-panel' });
    } else {
      toast.error('Credenciais inválidas. Verifique seu ID e senha.');
    }

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-neon-green/20 bg-card-dark">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neon-green/10">
            <Shield className="h-8 w-8 text-neon-green" />
          </div>
          <CardTitle className="text-2xl font-bold text-neon-green">Painel de Administração</CardTitle>
          <CardDescription>Acesso restrito - LuidCorporation Master Panel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="id">ID de Administrador</Label>
              <Input
                id="id"
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Digite seu ID"
                required
                className="border-neon-green/30 bg-carbon-black focus:border-neon-green"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
                className="border-neon-green/30 bg-carbon-black focus:border-neon-green"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="border-neon-green/30 data-[state=checked]:bg-neon-green data-[state=checked]:text-carbon-black"
              />
              <Label htmlFor="remember" className="cursor-pointer text-sm font-normal">
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
                  Autenticando...
                </>
              ) : (
                'Acessar Painel'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
