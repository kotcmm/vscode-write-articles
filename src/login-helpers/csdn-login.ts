import { LoginHelper } from "../account.api";
import { AbstractLoginHelper } from "./abstract-login";

export class CsdnLoginHelper extends AbstractLoginHelper implements LoginHelper {

    iconPath: string = "resources/csdn.svg";

    name: string = "CSDN";

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
        return this.getCookiesJoinStr("csdn.net");
    }

    private async getUserInfo() {
        let userInfoData = await this.requestUserInfo("https://me.csdn.net/api/user/show");
        if (userInfoData) {
            return userInfoData.data;
        }
        return undefined;
    }
}