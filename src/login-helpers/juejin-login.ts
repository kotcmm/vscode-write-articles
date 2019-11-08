import { LoginHelper } from "../account.api";
import { AbstractLoginHelper } from "./abstract-login";

export class JuejinLoginHelper extends AbstractLoginHelper implements LoginHelper {

    iconPath: string = "resources/juejin.svg";

    name: string = "掘金";

    constructor() {
        super();
    }

    protected async initialize() {
        let userInfo = await this.getUserInfo();
        if (userInfo && userInfo.user && userInfo.user.username) {
            this.updateSuccessful(userInfo.user.username);
        } else {
            this.updateFailure();
        }
    }

    async login(): Promise<void> {

    }

    protected async getCookies(): Promise<string> {
        return this.getCookiesJoinStr("juejin.im");
    }

    private async getUserInfo() {
        let userInfoData = await this.requestUserInfo("https://juejin.im/auth");
        return userInfoData;

    }
}