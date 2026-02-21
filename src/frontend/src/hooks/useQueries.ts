import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ClientRecord, Notification, ChatMessage, ChatSystemStatus, OperatingSystem, Time, AccessLog } from '../backend';
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
      operatingSystem: OperatingSystem;
      planExpiry: Time;
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
        VMStatus.online,
        data.operatingSystem,
        data.planExpiry
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
      operatingSystem: OperatingSystem;
      planExpiry: Time;
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
        data.vmStatus,
        data.operatingSystem,
        data.planExpiry
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
    refetchInterval: 10000,
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

export function useGlobalAnnouncement() {
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

export function useUpdateNetworkMonitoringStatus() {
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

export function useNetworkMonitoringStatus() {
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

export function useAddNotification() {
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

export function useNotifications(clientId: string | null) {
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

export function useChatMessages(clientId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<ChatMessage[]>({
    queryKey: ['chatMessages', clientId],
    queryFn: async () => {
      if (!actor || !clientId) return [];
      return await actor.getMessages(clientId);
    },
    enabled: !!actor && !isFetching && !!clientId,
    refetchInterval: 3000,
  });
}

export function useSetChatSystemStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: ChatSystemStatus) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.setChatSystemStatus(status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatSystemStatus'] });
    },
  });
}

export function useChatSystemStatus() {
  const { actor, isFetching } = useActor();

  return useQuery<ChatSystemStatus>({
    queryKey: ['chatSystemStatus'],
    queryFn: async () => {
      if (!actor) return 'offline' as ChatSystemStatus;
      return await actor.getChatSystemStatus();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

export function useLogAccess() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clientId, ipAddress }: { clientId: string; ipAddress: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.logAccess(clientId, ipAddress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accessLogs'] });
    },
  });
}

export function useAccessLogs() {
  const { actor, isFetching } = useActor();

  return useQuery<AccessLog[]>({
    queryKey: ['accessLogs'],
    queryFn: async () => {
      if (!actor) return [];
      return await actor.getAccessLogs();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}
