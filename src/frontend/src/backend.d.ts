import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ChatMessage {
    sender: string;
    message: string;
    timestamp: bigint;
}
export interface Notification {
    message: string;
    timestamp: bigint;
}
export interface ClientRecord {
    senhaCliente: string;
    senhaVps: string;
    nome: string;
    vmStatus: VMStatus;
    userVps: string;
    ipVps: string;
    idLuid: string;
    plano: string;
}
export enum VMStatus {
    maintenance = "maintenance",
    offline = "offline",
    online = "online"
}
export interface backendInterface {
    addAdminAccount(username: string, password: string): Promise<void>;
    addNotification(clientId: string, message: string): Promise<void>;
    adminLogin(username: string, password: string): Promise<boolean>;
    clearChatMessages(userId: string): Promise<void>;
    clearGlobalAnnouncement(): Promise<void>;
    clearNotifications(clientId: string): Promise<void>;
    createClientRecord(idLuid: string, nome: string, senhaCliente: string, ipVps: string, userVps: string, senhaVps: string, plano: string, vmStatus: VMStatus): Promise<void>;
    deleteClientRecord(idLuid: string): Promise<void>;
    getAllClientRecords(): Promise<Array<ClientRecord>>;
    getChatMessages(userId: string): Promise<Array<ChatMessage>>;
    getClientRecord(idLuid: string): Promise<ClientRecord>;
    getGlobalAnnouncement(): Promise<string>;
    getNetworkMonitoringStatus(): Promise<string>;
    getNotifications(clientId: string): Promise<Array<Notification>>;
    sendMessage(sender: string, message: string): Promise<void>;
    setGlobalAnnouncement(announcement: string): Promise<void>;
    updateClientRecord(idLuid: string, nome: string, senhaCliente: string, ipVps: string, userVps: string, senhaVps: string, plano: string, vmStatus: VMStatus): Promise<void>;
    updateNetworkMonitoringStatus(status: string): Promise<void>;
    updateVMStatus(idLuid: string, status: VMStatus): Promise<void>;
}
