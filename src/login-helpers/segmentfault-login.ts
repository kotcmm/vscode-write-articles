import { LoginHelper } from "../account.api";
import { AbstractLoginHelper } from "./abstract-login";

export class SegmentfaultLoginHelper extends AbstractLoginHelper implements LoginHelper {

    iconPath: string = "resources/segmentfault.svg";

    name: string = "思否";

    constructor() {
        super();
    }

    protected async initialize() {
        // let userInfo = await this.getUserInfo();
        // if (userInfo && userInfo.nickname) {
        //     this.updateSuccessful(userInfo.nickname);
        // } else {
        //     this.updateFailure();
        // }
    }

    async login(): Promise<void> {

    }

    protected async getCookies(): Promise<string> {
        const cookies = await this.browserCookies.getCookies("csdn.net");
        return cookies
            .map(cookie => `${cookie.name}=${cookie.value}`)
            .join(";");
    }

    private async getUserInfo() {
        let userInfoData = await this.requestUserInfo("https://www.jianshu.com/settings/basic.json");
        if (userInfoData) {
            return userInfoData.data;
        }
        return undefined;
    }
}