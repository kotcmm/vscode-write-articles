import { LoginHelper } from "../account.api";
import { AbstractLoginHelper } from "./abstract-login";

const nickNameRegExp = /(?<=(<h3 class="ui centered header">))(\S+)(?=(<\/h3>))/;
const protocol = "https://";
const baseHost = "oschina.net";
const loginUri = `${protocol}${baseHost}/home/login`;
const getUserUri = `${protocol}${baseHost}`;

export class OschinaLoginHelper extends AbstractLoginHelper implements LoginHelper {

    iconPath: string = "resources/oschina.svg";

    name: string = "开源中国";

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
        const cookies = await this.browserCookies.getCookies(baseHost);
        return cookies
            .map(cookie => `${cookie.name}=${cookie.value}`)
            .join(";");
    }

    private async getUserInfo() {
        let homeHtml: string = await this.requestGetWithCookie(getUserUri);
        let nickname = homeHtml.match(nickNameRegExp);
        if (nickname) {
            return { nickname: nickname[0] };
        }
        return undefined;
    }
}