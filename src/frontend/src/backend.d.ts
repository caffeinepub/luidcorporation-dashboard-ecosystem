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
    receiver: string;
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
export enum ChatSystemStatus {
    offline = "offline",
    online = "online"
}
export enum VMStatus {
    maintenance = "maintenance",
    offline = "offline",
    online = "online"
}
export interface backendInterface {
    addNotification(clientId: string, message: string): Promise<void>;
    clearGlobalAnnouncement(): Promise<void>;
    clearMessages(clientId: string): Promise<void>;
    clearNotifications(clientId: string): Promise<void>;
    createClientRecord(idLuid: string, nome: string, senhaCliente: string, ipVps: string, userVps: string, senhaVps: string, plano: string, vmStatus: VMStatus): Promise<void>;
    deleteClientRecord(idLuid: string): Promise<void>;
    getAllClientRecords(): Promise<Array<ClientRecord>>;
    getChatSystemStatus(): Promise<ChatSystemStatus>;
    getClientRecord(idLuid: string): Promise<ClientRecord>;
    getGlobalAnnouncement(): Promise<string>;
    getMessages(clientId: string): Promise<Array<ChatMessage>>;
    getNetworkMonitoringStatus(): Promise<string>;
    getNotifications(clientId: string): Promise<Array<Notification>>;
    sendMessage(sender: string, receiver: string, message: string): Promise<void>;
    setChatSystemStatus(status: ChatSystemStatus): Promise<void>;
    setGlobalAnnouncement(announcement: string): Promise<void>;
    updateClientRecord(idLuid: string, nome: string, senhaCliente: string, ipVps: string, userVps: string, senhaVps: string, plano: string, vmStatus: VMStatus): Promise<void>;
    updateNetworkMonitoringStatus(status: string): Promise<void>;
    updateVMStatus(idLuid: string, vmStatus: VMStatus): Promise<void>;
}
