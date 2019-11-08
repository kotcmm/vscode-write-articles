import { Account, LoginStatus, LoginHelper, Cookie } from "../account.api";
import { EventEmitter } from "vscode";
import { BrowserCookies } from "../browser-cookies";
import * as request from 'request-promise';

interface AccountWriteable extends Account {
    userName: string;
    status: LoginStatus;
}

export abstract class AbstractLoginHelper implements LoginHelper {

    abstract iconPath: string;

    abstract name: string;

    private onStatusChanged = new EventEmitter<LoginHelper>();

    protected browserCookies: BrowserCookies = new BrowserCookies();

    constructor() {
        this.initialize().catch(console.error);
    }

    account: Account = {
        userName: "未登录",
        status: "Initializing",
        onStatusChanged: this.onStatusChanged.event,
        getCookies: this.getCookies
    };

    protected abstract initialize(): Promise<void>;

    abstract login(): Promise<void>;

    protected abstract getCookies(): Promise<string>;

    protected async getCookiesJoinStr(domain: string): Promise<string> {
        const cookies = await this.browserCookies.getCookies(domain);
        return cookies.map(cookie => `${cookie.name}=${cookie.value}`)
            .join(";");
    }

    protected beginLoggingIn() {
        if (this.account.status !== 'LoggedIn') {
            let account = <AccountWriteable>this.account;
            account.userName = "登录中";
            account.status = "LoggingIn";
            this.onStatusChanged.fire(this);
        }
    }

    protected updateSuccessful(userName: string) {
        let account = <AccountWriteable>this.account;
        account.userName = userName;
        account.status = "LoggedIn";
        this.onStatusChanged.fire(this);
    }

    protected updateFailure() {
        let account = <AccountWriteable>this.account;
        account.userName = "未登录";
        account.status = "LoggedOut";
        this.onStatusChanged.fire(this);
    }

    protected async requestUserInfo(uri: string): Promise<any> {
        const cookies = await this.getCookies();
        if (cookies === "") {
            return undefined;
        }
        const response = await request({
            uri: uri,
            method: 'GET',
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36',
                'cookie': `${cookies}`
            },
            simple: false,
            resolveWithFullResponse: true,
            json: true,
        });

        return response.body;
    }
}