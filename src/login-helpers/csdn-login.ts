import { LoginHelper } from "../account.api";
import { AbstractLoginHelper } from "./abstract-login";

const protocol = "https://";
const baseHost = "csdn.net";
const loginUri = `${protocol}passport.${baseHost}/login`;
const getUserUri = `${protocol}me.${baseHost}/api/user/show`;

export class CsdnLoginHelper extends AbstractLoginHelper implements LoginHelper {

    iconPath: string = "resources/csdn.svg";

    name: string = "CSDN";

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