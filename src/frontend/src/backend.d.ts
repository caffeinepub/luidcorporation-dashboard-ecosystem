import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Employee {
    password: string;
    name: string;
    role: string;
    employeeId: string;
}
export interface UserProfile {
    name: string;
    role: string;
    employeeId: string;
}
export interface ClientRecord {
    senhaCliente: string;
    senhaVps: string;
    nome: string;
    userVps: string;
    ipVps: string;
    idLuid: string;
    plano: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    authenticateEmployee(employeeId: string, password: string): Promise<boolean>;
    clearGlobalAnnouncement(): Promise<void>;
    createClientRecord(idLuid: string, nome: string, senhaCliente: string, ipVps: string, userVps: string, senhaVps: string, plano: string): Promise<void>;
    createEmployee(employeeId: string, name: string, password: string, role: string): Promise<void>;
    deleteClientRecord(idLuid: string): Promise<void>;
    deleteEmployee(employeeId: string): Promise<void>;
    getAllClientRecords(): Promise<Array<ClientRecord>>;
    getAllEmployees(): Promise<Array<Employee>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getClientRecord(idLuid: string): Promise<ClientRecord>;
    getGlobalAnnouncement(): Promise<string>;
    getNetworkMonitoringStatus(): Promise<string>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setGlobalAnnouncement(announcement: string): Promise<void>;
    updateClientRecord(idLuid: string, nome: string, senhaCliente: string, ipVps: string, userVps: string, senhaVps: string, plano: string): Promise<void>;
    updateEmployee(employeeId: string, name: string, password: string, role: string): Promise<void>;
    updateNetworkMonitoringStatus(status: string): Promise<void>;
}
