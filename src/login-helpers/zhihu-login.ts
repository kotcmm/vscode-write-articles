import { LoginHelper } from "../account.api";
import { AbstractLoginHelper } from "./abstract-login";

const protocol = "https://";
const baseHost = "zhihu.com";
const loginUri = `${protocol}${baseHost}`;
const getUserUri = `${protocol}${baseHost}/api/v4/me`;

export class ZhihuLoginHelper extends AbstractLoginHelper implements LoginHelper {

    iconPath: string = "resources/zhihu.svg";

    name: string = "知乎";

    loginUri: string = loginUri;

    constructor() {
        super();
    }

    protected async getUserName(): Promise<string> {
        let userInfo = await this.getUserInfo();
        if (userInfo && userInfo.name) {
            return userInfo.name;
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