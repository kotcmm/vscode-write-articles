import { LoginHelper } from "../account.api";
import { AbstractLoginHelper } from "./abstract-login";

const protocol = "https://";
const baseHost = "cnblogs.com";
const loginUri = `${protocol}i-beta.${baseHost}`;
const getUserUri = `${protocol}i-beta.${baseHost}/api/user`;

export class CnblogLoginHelper extends AbstractLoginHelper implements LoginHelper {

    iconPath: string = "resources/cnblogs.svg";

    name: string = "博客园";

    loginUri: string = loginUri;

    constructor() {
        super();
    }

    protected async getUserName(): Promise<string> {
        let userInfo = await this.getUserInfo();
        if (userInfo && userInfo.displayName) {
            return userInfo.displayName;
        }
        return "";
    }

    protected async getCookies(): Promise<string> {
        return this.getCookiesJoinStr(baseHost);
    }

    private async getUserInfo() {
        return await this.requestGetWithCookie(getUserUri);
    }
}