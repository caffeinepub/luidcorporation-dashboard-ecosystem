import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAddAdminAccount } from '../hooks/useQueries';
import { toast } from 'sonner';
import { UserPlus, Loader2, Users } from 'lucide-react';

export default function AdminMemberManagement() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const addAdmin = useAddAdminAccount();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      toast.error('Todos os campos são obrigatórios');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      await addAdmin.mutateAsync(formData);
      toast.success('Administrador adicionado com sucesso!');
      setFormData({
        username: '',
        password: '',
      });
    } catch (error) {
      toast.error('Erro ao adicionar administrador. Verifique se o usuário já existe.');
    }
  };

  return (
    <Card className="border-neon-green/20 bg-card-dark">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-neon-green">
          <Users className="h-5 w-5" />
          Gerenciar Administradores
        </CardTitle>
        <CardDescription>
          Adicione novos administradores ao painel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-username">Nome de Usuário</Label>
            <Input
              id="admin-username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Ex: admin123"
              className="border-neon-green/30 bg-carbon-black focus:border-neon-green"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-password">Senha</Label>
            <Input
              id="admin-password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Digite a senha (mínimo 6 caracteres)"
              className="border-neon-green/30 bg-carbon-black focus:border-neon-green"
            />
          </div>

          <Button
            type="submit"
            disabled={addAdmin.isPending}
            className="w-full bg-neon-green text-carbon-black hover:bg-neon-green/90"
          >
            {addAdmin.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adicionando...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Adicionar Administrador
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
