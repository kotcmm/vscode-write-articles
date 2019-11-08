import { Event } from "vscode";

export type LoginStatus = 'Initializing' | 'LoggingIn' | 'LoggedIn' | 'LoggedOut';

export interface Account {
    readonly userName: string;
    readonly status: LoginStatus;
    readonly onStatusChanged: Event<LoginHelper>;
    readonly getCookies: () => Promise<string>;
}

export interface Cookie {
    readonly creation_utc: number;
    readonly host_key: string;
    readonly name: string;
    readonly value: string;
    readonly path: string;
    readonly expires_utc: number;
    readonly is_secure: boolean;
    readonly is_httponly: boolean;
    readonly last_access_utc: number;
    readonly has_expires: boolean;
    readonly is_persistent: boolean;
    readonly priority: boolean;
    readonly samesite: boolean;
}

export interface LoginHelper {
    readonly name: string;
    readonly iconPath: string;
    readonly account: Account;
    readonly login: () => Promise<void>;
}