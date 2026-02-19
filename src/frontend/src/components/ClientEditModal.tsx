import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateClientRecord } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import type { ClientRecord } from '../backend';

interface ClientEditModalProps {
  client: ClientRecord;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ClientEditModal({ client, open, onOpenChange }: ClientEditModalProps) {
  const [formData, setFormData] = useState({
    idLuid: client.idLuid,
    nome: client.nome,
    senhaCliente: client.senhaCliente,
    ipVps: client.ipVps,
    userVps: client.userVps,
    senhaVps: client.senhaVps,
    plano: client.plano,
  });

  const updateClient = useUpdateClientRecord();

  useEffect(() => {
    setFormData({
      idLuid: client.idLuid,
      nome: client.nome,
      senhaCliente: client.senhaCliente,
      ipVps: client.ipVps,
      userVps: client.userVps,
      senhaVps: client.senhaVps,
      plano: client.plano,
    });
  }, [client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.senhaCliente || !formData.ipVps || !formData.userVps || !formData.senhaVps || !formData.plano) {
      toast.error('Todos os campos são obrigatórios');
      return;
    }

    try {
      await updateClient.mutateAsync(formData);
      toast.success('Cliente atualizado com sucesso!');
      onOpenChange(false);
    } catch (error) {
      toast.error('Erro ao atualizar cliente');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-neon-green/20 bg-card-dark sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-neon-green">Editar Cliente</DialogTitle>
          <DialogDescription>
            Atualize as informações do cliente {client.idLuid}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-idLuid">ID Luid</Label>
            <Input
              id="edit-idLuid"
              value={formData.idLuid}
              disabled
              className="border-neon-green/30 bg-carbon-black/50 text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-nome">Nome do Cliente</Label>
            <Input
              id="edit-nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Ex: João Silva"
              className="border-neon-green/30 bg-carbon-black focus:border-neon-green"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-senhaCliente">Senha do Cliente</Label>
            <Input
              id="edit-senhaCliente"
              type="password"
              value={formData.senhaCliente}
              onChange={(e) => setFormData({ ...formData, senhaCliente: e.target.value })}
              placeholder="Digite a senha de acesso"
              className="border-neon-green/30 bg-carbon-black focus:border-neon-green"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-ipVps">IP VPS</Label>
            <Input
              id="edit-ipVps"
              value={formData.ipVps}
              onChange={(e) => setFormData({ ...formData, ipVps: e.target.value })}
              placeholder="Ex: 192.168.1.100"
              className="border-neon-green/30 bg-carbon-black focus:border-neon-green"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-userVps">Usuário VPS</Label>
            <Input
              id="edit-userVps"
              value={formData.userVps}
              onChange={(e) => setFormData({ ...formData, userVps: e.target.value })}
              placeholder="Ex: root"
              className="border-neon-green/30 bg-carbon-black focus:border-neon-green"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-senhaVps">Senha VPS</Label>
            <Input
              id="edit-senhaVps"
              type="password"
              value={formData.senhaVps}
              onChange={(e) => setFormData({ ...formData, senhaVps: e.target.value })}
              placeholder="Digite a senha"
              className="border-neon-green/30 bg-carbon-black focus:border-neon-green"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-plano">Plano</Label>
            <Input
              id="edit-plano"
              value={formData.plano}
              onChange={(e) => setFormData({ ...formData, plano: e.target.value })}
              placeholder="Ex: Premium, Basic, Enterprise"
              className="border-neon-green/30 bg-carbon-black focus:border-neon-green"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-neon-green/30 text-neon-green hover:bg-neon-green/10"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={updateClient.isPending}
              className="bg-neon-green text-carbon-black hover:bg-neon-green/90"
            >
              {updateClient.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
