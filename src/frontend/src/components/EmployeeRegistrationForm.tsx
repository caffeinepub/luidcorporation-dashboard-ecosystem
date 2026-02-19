import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateEmployee } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff, UserPlus } from 'lucide-react';

export default function EmployeeRegistrationForm() {
  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    password: '',
    role: 'Employee',
  });
  const [showPassword, setShowPassword] = useState(false);

  const createEmployee = useCreateEmployee();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.employeeId || !formData.name || !formData.password || !formData.role) {
      toast.error('Todos os campos são obrigatórios');
      return;
    }

    try {
      await createEmployee.mutateAsync(formData);
      setFormData({
        employeeId: '',
        name: '',
        password: '',
        role: 'Employee',
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <Card className="border-neon-green/20 bg-card-dark">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-neon-green">
          <UserPlus className="h-5 w-5" />
          Cadastrar Funcionário
        </CardTitle>
        <CardDescription>Adicione um novo funcionário ao sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employeeId">ID do Funcionário</Label>
            <Input
              id="employeeId"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              placeholder="Ex: joao.silva"
              className="border-neon-green/30 bg-carbon-black focus:border-neon-green"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: João Silva"
              className="border-neon-green/30 bg-carbon-black focus:border-neon-green"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Digite a senha"
                className="border-neon-green/30 bg-carbon-black focus:border-neon-green pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-neon-green"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Cargo</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger className="border-neon-green/30 bg-carbon-black focus:border-neon-green">
                <SelectValue placeholder="Selecione o cargo" />
              </SelectTrigger>
              <SelectContent className="border-neon-green/20 bg-card-dark">
                <SelectItem value="Employee">Employee</SelectItem>
                <SelectItem value="Master">Master</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={createEmployee.isPending}
            className="w-full bg-neon-green text-carbon-black hover:bg-neon-green/90"
          >
            {createEmployee.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cadastrando...
              </>
            ) : (
              'Cadastrar Funcionário'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
