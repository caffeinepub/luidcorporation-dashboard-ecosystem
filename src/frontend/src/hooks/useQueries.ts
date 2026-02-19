import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ClientRecord, Notification, ChatMessage } from '../backend';
import { VMStatus } from '../backend';

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
        data.plano,
        VMStatus.online
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

export function useUpdateVMStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ idLuid, vmStatus }: { idLuid: string; vmStatus: VMStatus }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.updateVMStatus(idLuid, vmStatus);
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
    refetchInterval: 10000, // Refetch every 10 seconds for VM status updates
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
    refetchInterval: 30000, // Refetch every 30 seconds
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
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
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
    refetchInterval: 15000, // Refetch every 15 seconds
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

export function useChatMessages(clientId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<ChatMessage[]>({
    queryKey: ['chatMessages', clientId],
    queryFn: async () => {
      if (!actor || !clientId) return [];
      return await actor.getMessages(clientId);
    },
    enabled: !!actor && !isFetching && !!clientId,
    refetchInterval: 5000, // Refetch every 5 seconds for real-time chat
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sender, receiver, message }: { sender: string; receiver: string; message: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.sendMessage(sender, receiver, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
    },
  });
}

export function useAllChatMessages() {
  const { actor, isFetching } = useActor();

  return useQuery<{ clientId: string; messages: ChatMessage[] }[]>({
    queryKey: ['allChatMessages'],
    queryFn: async () => {
      if (!actor) return [];
      const clients = await actor.getAllClientRecords();
      const chatData = await Promise.all(
        clients.map(async (client) => ({
          clientId: client.idLuid,
          messages: await actor.getMessages(client.idLuid),
        }))
      );
      return chatData;
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000, // Refetch every 5 seconds
  });
}
