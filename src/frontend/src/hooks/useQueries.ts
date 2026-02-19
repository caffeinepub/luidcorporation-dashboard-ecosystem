import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ClientRecord, Employee } from '../backend';
import { toast } from 'sonner';

export function useCreateClientRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      idLuid: string;
      nome: string;
      senhaCliente: string;
      ipVps: string;
      userVps: string;
      senhaVps: string;
      plano: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.createClientRecord(
        data.idLuid,
        data.nome,
        data.senhaCliente,
        data.ipVps,
        data.userVps,
        data.senhaVps,
        data.plano
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['allClientRecords'] });
    },
  });
}

export function useUpdateClientRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      idLuid: string;
      nome: string;
      senhaCliente: string;
      ipVps: string;
      userVps: string;
      senhaVps: string;
      plano: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.updateClientRecord(
        data.idLuid,
        data.nome,
        data.senhaCliente,
        data.ipVps,
        data.userVps,
        data.senhaVps,
        data.plano
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allClientRecords'] });
      queryClient.invalidateQueries({ queryKey: ['client'] });
    },
  });
}

export function useGetClientRecord(idLuid: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<ClientRecord | null>({
    queryKey: ['client', idLuid],
    queryFn: async () => {
      if (!actor || !idLuid) return null;
      try {
        return await actor.getClientRecord(idLuid);
      } catch (error) {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!idLuid,
  });
}

export function useAllClientRecords() {
  const { actor, isFetching } = useActor();

  return useQuery<ClientRecord[]>({
    queryKey: ['allClientRecords'],
    queryFn: async () => {
      if (!actor) return [];
      return await actor.getAllClientRecords();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDeleteClientRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (idLuid: string) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.deleteClientRecord(idLuid);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allClientRecords'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useSetGlobalAnnouncement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (announcement: string) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.setGlobalAnnouncement(announcement);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['globalAnnouncement'] });
    },
  });
}

export function useClearGlobalAnnouncement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.clearGlobalAnnouncement();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['globalAnnouncement'] });
    },
  });
}

export function useGetGlobalAnnouncement() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['globalAnnouncement'],
    queryFn: async () => {
      if (!actor) return '';
      return await actor.getGlobalAnnouncement();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

export function useGetNetworkMonitoringStatus() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['networkMonitoringStatus'],
    queryFn: async () => {
      if (!actor) return 'normal';
      return await actor.getNetworkMonitoringStatus();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

export function useSetNetworkMonitoringStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: string) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.updateNetworkMonitoringStatus(status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['networkMonitoringStatus'] });
    },
  });
}

// Employee Management Hooks
export function useGetAllEmployees() {
  const { actor, isFetching } = useActor();

  return useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: async () => {
      if (!actor) return [];
      return await actor.getAllEmployees();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateEmployee() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      employeeId: string;
      name: string;
      password: string;
      role: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.createEmployee(data.employeeId, data.name, data.password, data.role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Funcionário cadastrado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao cadastrar funcionário');
    },
  });
}

export function useUpdateEmployee() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      employeeId: string;
      name: string;
      password: string;
      role: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.updateEmployee(data.employeeId, data.name, data.password, data.role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Funcionário atualizado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar funcionário');
    },
  });
}

export function useDeleteEmployee() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employeeId: string) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.deleteEmployee(employeeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Funcionário excluído com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao excluir funcionário');
    },
  });
}
