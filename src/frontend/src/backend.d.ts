import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ClientRecord {
    senhaCliente: string;
    senhaVps: string;
    nome: string;
    userVps: string;
    ipVps: string;
    idLuid: string;
    plano: string;
}
export interface backendInterface {
    clearGlobalAnnouncement(): Promise<void>;
    createClientRecord(idLuid: string, nome: string, senhaCliente: string, ipVps: string, userVps: string, senhaVps: string, plano: string): Promise<void>;
    deleteClientRecord(idLuid: string): Promise<void>;
    getAllClientRecords(): Promise<Array<ClientRecord>>;
    getClientRecord(idLuid: string): Promise<ClientRecord>;
    getGlobalAnnouncement(): Promise<string>;
    getNetworkMonitoringStatus(): Promise<string>;
    setGlobalAnnouncement(announcement: string): Promise<void>;
    updateClientRecord(idLuid: string, nome: string, senhaCliente: string, ipVps: string, userVps: string, senhaVps: string, plano: string): Promise<void>;
    updateNetworkMonitoringStatus(status: string): Promise<void>;
}
