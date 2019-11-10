import { LoginHelper } from "../account.api";
import { AbstractLoginHelper } from "./abstract-login";

const protocol = "https://";
const baseHost = "juejin.im";
const loginUri = `${protocol}${baseHost}/login`;
const getUserUri = `${protocol}${baseHost}/auth`;

export class JuejinLoginHelper extends AbstractLoginHelper implements LoginHelper {

    iconPath: string = "resources/juejin.svg";

    name: string = "掘金";

    loginUri: string = loginUri;

    constructor() {
        super();
    }

    protected async getUserName(): Promise<string> {
        let userInfo = await this.getUserInfo();
        if (userInfo && userInfo.user && userInfo.user.username) {
            return userInfo.user.username;
        }
        return "";
    }

    protected async getCookies(): Promise<string> {
        return this.getCookiesJoinStr(baseHost);
    }

    private async getUserInfo() {
        let userInfoData = await this.requestGetWithCookie(getUserUri);
        return userInfoData;
    }
}