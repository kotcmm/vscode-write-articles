import { LoginHelper } from "../account.api";
import { AbstractLoginHelper } from "./abstract-login";

export class CnblogLoginHelper extends AbstractLoginHelper implements LoginHelper {

    iconPath: string = "resources/cnblogs.svg";

    name: string = "博客园";

    constructor() {
        super();
    }

    protected async initialize() {
        let userInfo = await this.getUserInfo();
        if (userInfo && userInfo.displayName) {
            this.updateSuccessful(userInfo.displayName);
        } else {
            this.updateFailure();
        }
    }

    async login(): Promise<void> {

    }

    protected async getCookies(): Promise<string> {
        return this.getCookiesJoinStr("cnblogs.com");
    }

    private async getUserInfo() {
        let userInfoData = await this.requestUserInfo("https://i-beta.cnblogs.com/api/user");
        return userInfoData;
    }
}