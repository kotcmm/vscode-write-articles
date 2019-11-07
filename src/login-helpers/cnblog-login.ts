import { Account, LoginStatus, LoginHelper } from "../account.api";
import { EventEmitter } from "vscode";
import { BrowserCookies } from "../browser-cookies";
import * as request from 'request-promise';

export class CnblogLoginHelper implements LoginHelper {

    name: string = "博客园";

    private onStatusChanged = new EventEmitter<LoginStatus>();

    browserCookies: BrowserCookies = new BrowserCookies();

    constructor() {
        this.initialize().catch(console.error);
    }

    account: Account = {
        status: "Initializing",
        onStatusChanged: this.onStatusChanged.event
    };

    private async initialize() {
        let userInfo = await this.getUserInfo();
        if (userInfo.displayName) {

        }
    }

    async login(): Promise<void> {

    }

    private async getUserInfo() {
        let cookies = await this.browserCookies.getCookies("cnblogs.com");

        const hosts = [".cnblogs.com", "account.cnblogs.com"];
        let cookiesStr = cookies.filter(cookie => hosts.includes(cookie.host_key))
            .map(cookie => `${cookie.name}=${cookie.value}`)
            .join(";");

        const response = await request({
            uri: "https://i-beta.cnblogs.com/api/user",
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'accept-language': 'zh-CN,zh;q=0.9',
                'cookie': `${cookiesStr}`
            },
            simple: false,
            resolveWithFullResponse: true,
            json: true,
        });

        return response.body;
    }
}