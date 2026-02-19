import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useAllClientRecords, useDeleteClientRecord } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Trash2, Users, Loader2, Edit } from 'lucide-react';
import ClientEditModal from './ClientEditModal';
import type { ClientRecord } from '../backend';

interface ClientListProps {
  isMasterRole?: boolean;
}

export default function ClientList({ isMasterRole = true }: ClientListProps) {
  const { data: clients, isLoading } = useAllClientRecords();
  const deleteClient = useDeleteClientRecord();
  const [editingClient, setEditingClient] = useState<ClientRecord | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = async (idLuid: string) => {
    try {
      await deleteClient.mutateAsync(idLuid);
      toast.success(`Cliente ${idLuid} excluído com sucesso!`);
    } catch (error) {
      toast.error('Erro ao excluir cliente');
    }
  };

  const handleEdit = (client: ClientRecord) => {
    setEditingClient(client);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingClient(null);
  };

  return (
    <>
      <Card className="border-neon-green/20 bg-card-dark">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-neon-green">
            <Users className="h-5 w-5" />
            Clientes Cadastrados
          </CardTitle>
          <CardDescription>
            Lista de todos os clientes registrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-neon-green" />
            </div>
          ) : clients && clients.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-neon-green/20 hover:bg-neon-green/5">
                    <TableHead className="text-neon-green">ID Luid</TableHead>
                    <TableHead className="text-neon-green">Nome</TableHead>
                    <TableHead className="text-neon-green">IP VPS</TableHead>
                    <TableHead className="text-neon-green">Usuário VPS</TableHead>
                    <TableHead className="text-neon-green">Plano</TableHead>
                    {isMasterRole && <TableHead className="text-right text-neon-green">Ações</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow
                      key={client.idLuid}
                      className="border-neon-green/10 hover:bg-neon-green/5"
                    >
                      <TableCell className="font-medium text-foreground">
                        {client.idLuid}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{client.nome}</TableCell>
                      <TableCell className="text-muted-foreground">{client.ipVps}</TableCell>
                      <TableCell className="text-muted-foreground">{client.userVps}</TableCell>
                      <TableCell className="text-muted-foreground">{client.plano}</TableCell>
                      {isMasterRole && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(client)}
                              className="border-neon-green/30 text-neon-green hover:bg-neon-green/10"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(client.idLuid)}
                              disabled={deleteClient.isPending}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {deleteClient.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              Nenhum cliente cadastrado ainda
            </div>
          )}
        </CardContent>
      </Card>

      {editingClient && isMasterRole && (
        <ClientEditModal
          client={editingClient}
          open={isEditModalOpen}
          onOpenChange={handleCloseEditModal}
        />
      )}
    </>
  );
}
