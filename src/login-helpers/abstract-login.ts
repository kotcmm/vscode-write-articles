import { Account, LoginStatus, LoginHelper, Cookie } from "../account.api";
import { EventEmitter, env, Uri } from "vscode";
import { BrowserCookies } from "../browser-cookies";
import * as request from 'request-promise';

interface AccountWriteable extends Account {
    userName: string;
    status: LoginStatus;
}

export abstract class AbstractLoginHelper implements LoginHelper {

    abstract iconPath: string;

    abstract name: string;

    abstract loginUri: string;

    private waitLogin: NodeJS.Timeout | undefined;

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

    protected abstract getUserName(): Promise<string>;

    protected async initialize(): Promise<void> {
        this.beginLoggingIn();
        let userName = await this.getUserName();
        if (userName) {
            this.updateSuccessful(userName);
        } else {
            this.updateFailure();
        }
    }

    async login(): Promise<void> {
        await env.openExternal(Uri.parse(this.loginUri));
        let runCount = 0;

        this.tryStopWaitLogin();

        this.waitLogin = setInterval(async () => {
            if (this.account.status === "LoggedIn" || runCount >= 500) {
                this.tryStopWaitLogin();
            } else if (this.account.status !== "LoggingIn") {
                await this.initialize();
            }
            runCount++;
        }, 2 * 1000);
    }

    private tryStopWaitLogin() {
        if (this.waitLogin) {
            clearInterval(this.waitLogin);
        }
    }

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
        if (this.account.userName !== "未登录") {
            let account = <AccountWriteable>this.account;
            account.userName = "未登录";
            account.status = "LoggedOut";
            this.onStatusChanged.fire(this);
        }
    }

    protected async requestGetWithCookie(uri: string): Promise<any> {
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