import * as path from 'path';
import * as fs from 'fs';
import { env } from 'vscode';
import * as crypto from 'crypto';
import * as keytarType from 'keytar';
import * as sqlite3Type from 'sqlite3';
import { Cookie } from '../account.api';

const KEYLENGTH = 16;
const SALT = 'saltysalt';
const keytar = getNodeModule<typeof keytarType>('keytar');
const sqlite3 = getNodeModule<typeof sqlite3Type>('vscode-sqlite3');

function getNodeModule<T>(moduleName: string): T | undefined {
    try {
        return require(`${env.appRoot}/node_modules.asar/${moduleName}`);
    } catch (err) {
        // Not in ASAR.
    }
    try {
        return require(`${env.appRoot}/node_modules/${moduleName}`);
    } catch (err) {
        // Not available.
    }
    return undefined;
}

export class ChromeCookies {

    public async getCookies(hostKey: string): Promise<Array<Cookie>> {
        let cookies = await this.getOriginalCookies(hostKey);
        let decryptCookies = new Array<Cookie>();
        if (cookies) {
            for (let index = 0; index < cookies.length; index++) {
                const cookie = cookies[index];
                if (cookie.value === '' && cookie.encrypted_value.length > 0) {
                    cookie.value = await this.decrypt(cookie.encrypted_value);
                }
                decryptCookies.push({
                    creation_utc: cookie.creation_utc,
                    host_key: cookie.host_key,
                    name: cookie.name,
                    value: cookie.value,
                    path: cookie.path,
                    expires_utc: cookie.expires_utc,
                    is_secure: cookie.is_secure,
                    is_httponly: cookie.is_httponly,
                    last_access_utc: cookie.last_access_utc,
                    has_expires: cookie.has_expires,
                    is_persistent: cookie.is_persistent,
                    priority: cookie.priority,
                    samesite: cookie.samesite
                });
            }
        }
        return decryptCookies;
    }

    private getOriginalCookies(hostKey: string): Promise<any[] | undefined> {
        if (!sqlite3) {
            return Promise.resolve(undefined);
        }
        return new Promise((resolve, reject) => {
            let cookiesPath = this.getCookiesPath();
            if (fs.existsSync(cookiesPath)) {
                let cookies: any[] = [];
                let db = new sqlite3.Database(cookiesPath);
                db.each(`SELECT * FROM cookies where host_key like '%${hostKey}%';`,
                    (err: Error | null, row: any) => {
                        if (err) {
                            reject(err);
                        }
                        cookies.push(row);
                    }, (err: Error | null, count: number) => {
                        if (err) {
                            reject(err);
                        }
                        resolve(cookies);
                    });
                db.close();
            }
        });
    }

    private async decrypt(encryptedData: any): Promise<string | undefined> {
        if (process.platform === 'win32') {
            return this.decryptWin32(encryptedData);
        }
        let key = await this.getDerivedKey();
        if (key) {
            return this.decryptOsOrLinux(key, encryptedData);
        }
        return undefined;
    }

    private getCookiesPath(): string {
        let localAppdata = process.env["LOCALAPPDATA"]!;
        let chomePath = "\\Google\\Chrome\\User Data\\Default";

        if (process.platform === 'darwin') {
            localAppdata = process.env["HOME"]!;
            chomePath = "/Library/Application Support/Google/Chrome/Default";
        } else if (process.platform === 'linux') {
            localAppdata = process.env["HOME"]!;
            chomePath = "/.config/google-chrome/Default";
        }

        return path.join(localAppdata, chomePath, "Cookies");
    }

    private async getDerivedKey(): Promise<Buffer | null> {
        let chromePassword: string | null = null;
        let iterations = 0;
        if (process.platform === 'darwin') {
            if (keytar) {
                chromePassword = await keytar.getPassword('Chrome Safe Storage', 'Chrome');
            }
            iterations = 1003;
        } else if (process.platform === 'linux') {
            chromePassword = 'peanuts';
            iterations = 1;
        }
        return new Promise((resolve, reject) => {
            if (chromePassword) {
                crypto.pbkdf2(chromePassword, SALT, iterations, KEYLENGTH, 'sha1',
                    (err: Error | null, derivedKey: Buffer) => {
                        if (err) {
                            reject(err);
                        }
                        resolve(derivedKey);
                    });
            }
            resolve(null);
        });
    }

    private decryptOsOrLinux(key: Buffer, encryptedData: any): string {

        let iv = Buffer.from(new Array(KEYLENGTH + 1).join(' '), 'binary');

        let decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        decipher.setAutoPadding(false);

        encryptedData = encryptedData.slice(3);

        let decoded = decipher.update(encryptedData);

        let final = decipher.final();
        final.copy(decoded, decoded.length - 1);

        let padding = decoded[decoded.length - 1];
        if (padding) {
            decoded = decoded.slice(0, decoded.length - padding);
        }

        return decoded.toString('utf8');
    }

    private decryptWin32(encryptedData: any) {
        const ffi = require('ffi-napi');
        const Struct = require('ref-struct-napi');
        const ref = require('ref-napi');
        const DATA_BLOB = Struct({
            cbData: ref.types.uint32,
            pbData: 'string' // ref.refType(ref.types.byte)
        });
        const PDATA_BLOB = new ref.refType(DATA_BLOB);
        const Crypto = new ffi.Library('Crypt32', {
            'CryptUnprotectData': ['bool', [PDATA_BLOB, 'string', 'string', 'void *', 'string', 'int', PDATA_BLOB]],
        });
        const data_blob_input = new DATA_BLOB();
        data_blob_input.cbData = encryptedData.length;
        data_blob_input.pbData = encryptedData;
        const data_blob_output = new DATA_BLOB();
        const result = Crypto.CryptUnprotectData(data_blob_input.ref(), null, null, null, null, 0, data_blob_output.ref());
        return data_blob_output.pbData.slice(0, data_blob_output.cbData);
    }
}