import { LoginHelper } from "../account.api";
import { AbstractLoginHelper } from "./abstract-login";

const protocol = "https://";
const baseHost = "jianshu.com";
const loginUri = `${protocol}www.${baseHost}/sign_in`;
const getUserUri = `${protocol}www.${baseHost}/settings/basic.json`;

export class JianshuLoginHelper extends AbstractLoginHelper implements LoginHelper {

    iconPath: string = "resources/jianshu.svg";

    name: string = "简书";

    loginUri: string = loginUri;

    constructor() {
        super();
    }

    protected async getUserName(): Promise<string> {
        let userInfo = await this.getUserInfo();
        if (userInfo && userInfo.nickname) {
            return userInfo.nickname;
        }
        return "";
    }

    protected async getCookies(): Promise<string> {
        return this.getCookiesJoinStr(baseHost);
    }

    private async getUserInfo() {
        let userInfoData = await this.requestGetWithCookie(getUserUri);
        if (userInfoData) {
            return userInfoData.data;
        }
        return undefined;
    }
}