import { LoginHelper } from "../account.api";
import { AbstractLoginHelper } from "./abstract-login";

export class ZhihuLoginHelper extends AbstractLoginHelper implements LoginHelper {

    iconPath: string = "resources/zhihu.svg";

    name: string = "知乎";

    constructor() {
        super();
    }

    protected async initialize() {
        let userInfo = await this.getUserInfo();
        if (userInfo && userInfo.name) {
            this.updateSuccessful(userInfo.name);
        } else {
            this.updateFailure();
        }
    }

    async login(): Promise<void> {

    }

    protected async getCookies(): Promise<string> {
        return this.getCookiesJoinStr("zhihu.com");
    }

    private async getUserInfo() {
        let userInfoData = await this.requestUserInfo("https://www.zhihu.com/api/v4/me");

        return userInfoData;
    }
}