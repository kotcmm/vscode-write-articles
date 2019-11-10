import { LoginHelper } from "../account.api";
import { AbstractLoginHelper } from "./abstract-login";

const userPagePathRegExp = /(?<=(<a href="))(\S+)(?=(">我的主页<\/a>))/;
const userNicknameRegExp = /(?<=(<title>))(\S+)(?=( - SegmentFault 思否<\/title>))/;
const protocol = "https://";
const baseHost = "segmentfault.com";
const loginUri = `${protocol}${baseHost}/user/login`;
const getUserUri = `${protocol}${baseHost}`;

export class SegmentfaultLoginHelper extends AbstractLoginHelper implements LoginHelper {

    iconPath: string = "resources/segmentfault.svg";

    name: string = "思否";

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
        let homeHtml = await this.requestGetWithCookie(getUserUri);
        let userPagePath = homeHtml.match(userPagePathRegExp);
        if (userPagePath) {
            let userPageUri = `${protocol}${baseHost}${userPagePath[0]}`;
            let userHtml = await this.requestGetWithCookie(userPageUri);
            let nickname = userHtml.match(userNicknameRegExp);
            if (nickname) {
                return { nickname: nickname[0] };
            }
        }

        return undefined;
    }
}