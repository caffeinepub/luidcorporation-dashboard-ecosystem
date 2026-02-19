import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useGetAllEmployees, useDeleteEmployee } from '../hooks/useQueries';
import { Loader2, Edit, Trash2, Users } from 'lucide-react';
import EmployeeEditModal from './EmployeeEditModal';
import type { Employee } from '../backend';

export default function EmployeeList() {
  const { data: employees, isLoading } = useGetAllEmployees();
  const deleteEmployee = useDeleteEmployee();
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingEmployee(null);
  };

  const handleDeleteClick = (employeeId: string) => {
    setEmployeeToDelete(employeeId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (employeeToDelete) {
      try {
        await deleteEmployee.mutateAsync(employeeToDelete);
        setDeleteConfirmOpen(false);
        setEmployeeToDelete(null);
      } catch (error) {
        // Error handled by mutation
      }
    }
  };

  return (
    <>
      <Card className="border-neon-green/20 bg-card-dark">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-neon-green">
            <Users className="h-5 w-5" />
            Funcionários Cadastrados
          </CardTitle>
          <CardDescription>
            Lista de todos os funcionários com acesso ao painel
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-neon-green" />
            </div>
          ) : employees && employees.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-neon-green/20 hover:bg-neon-green/5">
                    <TableHead className="text-neon-green">ID do Funcionário</TableHead>
                    <TableHead className="text-neon-green">Nome</TableHead>
                    <TableHead className="text-neon-green">Cargo</TableHead>
                    <TableHead className="text-right text-neon-green">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow
                      key={employee.employeeId}
                      className="border-neon-green/10 hover:bg-neon-green/5"
                    >
                      <TableCell className="font-medium text-foreground">
                        {employee.employeeId}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{employee.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        <span
                          className={
                            employee.role === 'Master'
                              ? 'rounded-full bg-neon-green/20 px-2 py-1 text-xs font-semibold text-neon-green'
                              : 'rounded-full bg-muted/20 px-2 py-1 text-xs font-semibold text-muted-foreground'
                          }
                        >
                          {employee.role}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(employee)}
                            className="border-neon-green/30 text-neon-green hover:bg-neon-green/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {employee.employeeId !== 'SidneiCosta00' && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteClick(employee.employeeId)}
                              disabled={deleteEmployee.isPending}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {deleteEmployee.isPending && employeeToDelete === employee.employeeId ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              Nenhum funcionário cadastrado ainda
            </div>
          )}
        </CardContent>
      </Card>

      {editingEmployee && (
        <EmployeeEditModal
          employee={editingEmployee}
          open={isEditModalOpen}
          onOpenChange={handleCloseEditModal}
        />
      )}

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="border-neon-green/20 bg-card-dark">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-neon-green">Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este funcionário? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-neon-green/30 text-neon-green hover:bg-neon-green/10">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
