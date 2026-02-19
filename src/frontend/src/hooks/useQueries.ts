import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ClientRecord, Notification, ChatMessage, VMStatus } from '../backend';

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
      vmStatus: VMStatus;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.createClientRecord(
        data.idLuid,
        data.nome,
        data.senhaCliente,
        data.ipVps,
        data.userVps,
        data.senhaVps,
        data.plano,
        data.vmStatus
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
      vmStatus: VMStatus;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.updateClientRecord(
        data.idLuid,
        data.nome,
        data.senhaCliente,
        data.ipVps,
        data.userVps,
        data.senhaVps,
        data.plano,
        data.vmStatus
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

export function useSendNotification() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clientId, message }: { clientId: string; message: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addNotification(clientId, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useGetNotifications(clientId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Notification[]>({
    queryKey: ['notifications', clientId],
    queryFn: async () => {
      if (!actor || !clientId) return [];
      return await actor.getNotifications(clientId);
    },
    enabled: !!actor && !isFetching && !!clientId,
    refetchInterval: 10000,
  });
}

export function useClearNotifications() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clientId: string) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.clearNotifications(clientId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useSendChatMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sender, message }: { sender: string; message: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.sendMessage(sender, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
    },
  });
}

export function useGetChatMessages(userId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<ChatMessage[]>({
    queryKey: ['chatMessages', userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return await actor.getChatMessages(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
    refetchInterval: 5000,
  });
}

export function useAddAdminAccount() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addAdminAccount(username, password);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAccounts'] });
    },
  });
}

export function useAdminLogin() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return await actor.adminLogin(username, password);
    },
  });
}
