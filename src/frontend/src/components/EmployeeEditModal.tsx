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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateEmployee } from '../hooks/useQueries';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import type { Employee } from '../backend';

interface EmployeeEditModalProps {
  employee: Employee;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EmployeeEditModal({ employee, open, onOpenChange }: EmployeeEditModalProps) {
  const [formData, setFormData] = useState({
    employeeId: employee.employeeId,
    name: employee.name,
    password: employee.password,
    role: employee.role,
  });
  const [showPassword, setShowPassword] = useState(false);

  const updateEmployee = useUpdateEmployee();

  useEffect(() => {
    setFormData({
      employeeId: employee.employeeId,
      name: employee.name,
      password: employee.password,
      role: employee.role,
    });
  }, [employee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.password || !formData.role) {
      return;
    }

    try {
      await updateEmployee.mutateAsync(formData);
      onOpenChange(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const isMasterEmployee = employee.employeeId === 'SidneiCosta00';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-neon-green/20 bg-card-dark sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-neon-green">Editar Funcionário</DialogTitle>
          <DialogDescription>
            Atualize as informações do funcionário {employee.employeeId}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-employeeId">ID do Funcionário</Label>
            <Input
              id="edit-employeeId"
              value={formData.employeeId}
              disabled
              className="border-neon-green/30 bg-carbon-black/50 text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-name">Nome Completo</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: João Silva"
              className="border-neon-green/30 bg-carbon-black focus:border-neon-green"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-password">Senha</Label>
            <div className="relative">
              <Input
                id="edit-password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Digite a nova senha"
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
            <Label htmlFor="edit-role">Cargo</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
              disabled={isMasterEmployee}
            >
              <SelectTrigger
                className={`border-neon-green/30 bg-carbon-black focus:border-neon-green ${
                  isMasterEmployee ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <SelectValue placeholder="Selecione o cargo" />
              </SelectTrigger>
              <SelectContent className="border-neon-green/20 bg-card-dark">
                <SelectItem value="Employee">Employee</SelectItem>
                <SelectItem value="Master">Master</SelectItem>
              </SelectContent>
            </Select>
            {isMasterEmployee && (
              <p className="text-xs text-muted-foreground">
                O cargo do Master não pode ser alterado
              </p>
            )}
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
              disabled={updateEmployee.isPending}
              className="bg-neon-green text-carbon-black hover:bg-neon-green/90"
            >
              {updateEmployee.isPending ? (
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
