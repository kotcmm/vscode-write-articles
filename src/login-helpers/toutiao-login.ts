import { LoginHelper } from "../account.api";
import { AbstractLoginHelper } from "./abstract-login";

const protocol = "https://";
const baseHost = "toutiao.com";
const loginUri = `${protocol}sso.${baseHost}`;
const getUserUri = `${protocol}${baseHost}`;

export class ToutiaoLoginHelper extends AbstractLoginHelper implements LoginHelper {

    iconPath: string = "resources/toutiao-light.svg";

    name: string = "今日头条";

    loginUri: string = loginUri;

    constructor() {
        super();
    }

    protected async getUserName(): Promise<string> {
        // let userInfo = await this.getUserInfo();
        // if (userInfo && userInfo.nickname) {
        //     this.updateSuccessful(userInfo.nickname);
        // } else {
        //     this.updateFailure();
        // }
        return "";
    }

    protected async getCookies(): Promise<string> {
        const cookies = await this.browserCookies.getCookies(baseHost);
        return cookies
            .map(cookie => `${cookie.name}=${cookie.value}`)
            .join(";");
    }

    private async getUserInfo() {
        let userInfoData = await this.requestGetWithCookie(getUserUri);
        if (userInfoData) {
            return userInfoData.data;
        }
        return undefined;
    }
}