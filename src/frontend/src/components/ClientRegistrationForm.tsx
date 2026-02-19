import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateClientRecord } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function ClientRegistrationForm() {
  const [formData, setFormData] = useState({
    idLuid: '',
    nome: '',
    senhaCliente: '',
    ipVps: '',
    userVps: '',
    senhaVps: '',
    plano: '',
  });

  const createClient = useCreateClientRecord();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.idLuid || !formData.nome || !formData.senhaCliente || !formData.ipVps || !formData.userVps || !formData.senhaVps || !formData.plano) {
      toast.error('Todos os campos são obrigatórios');
      return;
    }

    try {
      await createClient.mutateAsync(formData);
      toast.success('Cliente cadastrado com sucesso!');
      setFormData({
        idLuid: '',
        nome: '',
        senhaCliente: '',
        ipVps: '',
        userVps: '',
        senhaVps: '',
        plano: '',
      });
    } catch (error) {
      toast.error('Erro ao cadastrar cliente. Verifique se o ID já existe.');
    }
  };

  return (
    <Card className="border-neon-green/20 bg-card-dark">
      <CardHeader>
        <CardTitle className="text-neon-green">Cadastrar Novo Cliente</CardTitle>
        <CardDescription>Preencha todos os campos para adicionar um cliente</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="idLuid">ID Luid</Label>
            <Input
              id="idLuid"
              value={formData.idLuid}
              onChange={(e) => setFormData({ ...formData, idLuid: e.target.value })}
              placeholder="Ex: cliente001"
              className="border-neon-green/30 bg-carbon-black focus:border-neon-green"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Cliente</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Ex: João Silva"
              className="border-neon-green/30 bg-carbon-black focus:border-neon-green"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="senhaCliente">Senha do Cliente</Label>
            <Input
              id="senhaCliente"
              type="password"
              value={formData.senhaCliente}
              onChange={(e) => setFormData({ ...formData, senhaCliente: e.target.value })}
              placeholder="Digite a senha de acesso"
              className="border-neon-green/30 bg-carbon-black focus:border-neon-green"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ipVps">IP VPS</Label>
            <Input
              id="ipVps"
              value={formData.ipVps}
              onChange={(e) => setFormData({ ...formData, ipVps: e.target.value })}
              placeholder="Ex: 192.168.1.100"
              className="border-neon-green/30 bg-carbon-black focus:border-neon-green"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userVps">Usuário VPS</Label>
            <Input
              id="userVps"
              value={formData.userVps}
              onChange={(e) => setFormData({ ...formData, userVps: e.target.value })}
              placeholder="Ex: root"
              className="border-neon-green/30 bg-carbon-black focus:border-neon-green"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="senhaVps">Senha VPS</Label>
            <Input
              id="senhaVps"
              type="password"
              value={formData.senhaVps}
              onChange={(e) => setFormData({ ...formData, senhaVps: e.target.value })}
              placeholder="Digite a senha"
              className="border-neon-green/30 bg-carbon-black focus:border-neon-green"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="plano">Plano</Label>
            <Input
              id="plano"
              value={formData.plano}
              onChange={(e) => setFormData({ ...formData, plano: e.target.value })}
              placeholder="Ex: Premium, Basic, Enterprise"
              className="border-neon-green/30 bg-carbon-black focus:border-neon-green"
            />
          </div>

          <Button
            type="submit"
            disabled={createClient.isPending}
            className="w-full bg-neon-green text-carbon-black hover:bg-neon-green/90"
          >
            {createClient.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cadastrando...
              </>
            ) : (
              'Cadastrar Cliente'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
