import { LoginHelper } from "../account.api";
import { AbstractLoginHelper } from "./abstract-login";

export class JianshuLoginHelper extends AbstractLoginHelper implements LoginHelper {

    iconPath: string = "resources/jianshu.svg";

    name: string = "简书";

    constructor() {
        super();
    }

    protected async initialize() {
        let userInfo = await this.getUserInfo();
        if (userInfo && userInfo.nickname) {
            this.updateSuccessful(userInfo.nickname);
        } else {
            this.updateFailure();
        }
    }

    async login(): Promise<void> {

    }

    protected async getCookies(): Promise<string> {
        return this.getCookiesJoinStr("jianshu.com");
    }

    private async getUserInfo() {
        let userInfoData = await this.requestUserInfo("https://www.jianshu.com/settings/basic.json");
        if (userInfoData) {
            return userInfoData.data;
        }
        return undefined;
    }
}