import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAllClientRecords, useDeleteClientRecord, useUpdateVMStatus } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Trash2, Users, Loader2, Edit, Bell, Circle } from 'lucide-react';
import ClientEditModal from './ClientEditModal';
import SendNotificationModal from './SendNotificationModal';
import { VMStatus } from '../backend';
import type { ClientRecord } from '../backend';

export default function ClientList() {
  const { data: clients, isLoading } = useAllClientRecords();
  const deleteClient = useDeleteClientRecord();
  const updateVMStatus = useUpdateVMStatus();
  const [editingClient, setEditingClient] = useState<ClientRecord | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [notificationClient, setNotificationClient] = useState<{ id: string; name: string } | null>(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

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

  const handleSendNotification = (client: ClientRecord) => {
    setNotificationClient({ id: client.idLuid, name: client.nome });
    setIsNotificationModalOpen(true);
  };

  const handleCloseNotificationModal = () => {
    setIsNotificationModalOpen(false);
    setNotificationClient(null);
  };

  const handleVMStatusChange = async (idLuid: string, status: string) => {
    try {
      const vmStatus = status as VMStatus;
      await updateVMStatus.mutateAsync({ idLuid, vmStatus });
      toast.success('Status da VM atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar status da VM');
    }
  };

  const getVMStatusDisplay = (vmStatus: VMStatus) => {
    switch (vmStatus) {
      case VMStatus.online:
        return { label: 'Online', color: 'text-green-500', icon: 'bg-green-500' };
      case VMStatus.offline:
        return { label: 'Offline', color: 'text-red-500', icon: 'bg-red-500' };
      case VMStatus.maintenance:
        return { label: 'Manutenção', color: 'text-yellow-500', icon: 'bg-yellow-500' };
      default:
        return { label: 'Online', color: 'text-green-500', icon: 'bg-green-500' };
    }
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
                    <TableHead className="text-neon-green">Status VM</TableHead>
                    <TableHead className="text-right text-neon-green">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => {
                    const statusDisplay = getVMStatusDisplay(client.vmStatus);
                    return (
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
                        <TableCell>
                          <Select
                            value={client.vmStatus}
                            onValueChange={(value) => handleVMStatusChange(client.idLuid, value)}
                          >
                            <SelectTrigger className="w-[140px] border-neon-green/30 bg-carbon-black">
                              <div className="flex items-center gap-2">
                                <Circle className={`h-2 w-2 fill-current ${statusDisplay.icon}`} />
                                <SelectValue />
                              </div>
                            </SelectTrigger>
                            <SelectContent className="border-neon-green/30 bg-carbon-black">
                              <SelectItem value={VMStatus.online}>
                                <div className="flex items-center gap-2">
                                  <Circle className="h-2 w-2 fill-current bg-green-500 text-green-500" />
                                  <span>Online</span>
                                </div>
                              </SelectItem>
                              <SelectItem value={VMStatus.offline}>
                                <div className="flex items-center gap-2">
                                  <Circle className="h-2 w-2 fill-current bg-red-500 text-red-500" />
                                  <span>Offline</span>
                                </div>
                              </SelectItem>
                              <SelectItem value={VMStatus.maintenance}>
                                <div className="flex items-center gap-2">
                                  <Circle className="h-2 w-2 fill-current bg-yellow-500 text-yellow-500" />
                                  <span>Manutenção</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSendNotification(client)}
                              className="border-neon-green/30 text-neon-green hover:bg-neon-green/10"
                              title="Enviar notificação"
                            >
                              <Bell className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(client)}
                              className="border-neon-green/30 text-neon-green hover:bg-neon-green/10"
                              title="Editar cliente"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(client.idLuid)}
                              disabled={deleteClient.isPending}
                              className="bg-red-600 hover:bg-red-700"
                              title="Excluir cliente"
                            >
                              {deleteClient.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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

      {editingClient && (
        <ClientEditModal
          client={editingClient}
          open={isEditModalOpen}
          onOpenChange={handleCloseEditModal}
        />
      )}

      {notificationClient && (
        <SendNotificationModal
          clientId={notificationClient.id}
          clientName={notificationClient.name}
          open={isNotificationModalOpen}
          onOpenChange={handleCloseNotificationModal}
        />
      )}
    </>
  );
}
