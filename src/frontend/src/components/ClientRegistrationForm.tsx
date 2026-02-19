import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useCreateClientRecord } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Loader2, CalendarIcon } from 'lucide-react';
import { OperatingSystem } from '../backend';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function ClientRegistrationForm() {
  const [formData, setFormData] = useState({
    idLuid: '',
    nome: '',
    senhaCliente: '',
    ipVps: '',
    userVps: '',
    senhaVps: '',
    plano: '',
    operatingSystem: 'windows' as 'windows' | 'ubuntu',
  });
  const [planExpiry, setPlanExpiry] = useState<Date | undefined>(undefined);

  const createClient = useCreateClientRecord();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.idLuid || !formData.nome || !formData.senhaCliente || !formData.ipVps || !formData.userVps || !formData.senhaVps || !formData.plano || !planExpiry) {
      toast.error('Todos os campos são obrigatórios');
      return;
    }

    try {
      const planExpiryTimestamp = BigInt(planExpiry.getTime() * 1000000);
      await createClient.mutateAsync({
        ...formData,
        operatingSystem: formData.operatingSystem as OperatingSystem,
        planExpiry: planExpiryTimestamp,
      });
      toast.success('Cliente cadastrado com sucesso!');
      setFormData({
        idLuid: '',
        nome: '',
        senhaCliente: '',
        ipVps: '',
        userVps: '',
        senhaVps: '',
        plano: '',
        operatingSystem: 'windows',
      });
      setPlanExpiry(undefined);
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

          <div className="space-y-2">
            <Label htmlFor="operatingSystem">Sistema Operacional</Label>
            <Select
              value={formData.operatingSystem}
              onValueChange={(value: 'windows' | 'ubuntu') =>
                setFormData({ ...formData, operatingSystem: value })
              }
            >
              <SelectTrigger className="border-neon-green/30 bg-carbon-black focus:border-neon-green">
                <SelectValue placeholder="Selecione o sistema" />
              </SelectTrigger>
              <SelectContent className="border-neon-green/20 bg-card-dark">
                <SelectItem value="windows">Windows</SelectItem>
                <SelectItem value="ubuntu">Ubuntu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="planExpiry">Validade do Plano</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal border-neon-green/30 bg-carbon-black hover:bg-carbon-black/80',
                    !planExpiry && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {planExpiry ? format(planExpiry, 'PPP') : <span>Selecione a data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-neon-green/20 bg-card-dark" align="start">
                <Calendar
                  mode="single"
                  selected={planExpiry}
                  onSelect={setPlanExpiry}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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
