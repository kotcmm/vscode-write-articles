import { LoginHelper } from "../account.api";
import { AbstractLoginHelper } from "./abstract-login";

const dataRegexp = /data:([ \r\n]*)\{(.|\n)*?\}/;
const protocol = "https://";
const baseHost = "mp.weixin.qq.com";
const loginUri = `${protocol}${baseHost}`;
const getUserUri = `${protocol}${baseHost}`;

export class WeixinLoginHelper extends AbstractLoginHelper implements LoginHelper {

    iconPath: string = "resources/weixin.svg";

    name: string = "微信公众号";

    loginUri: string = loginUri;

    constructor() {
        super();
    }

    protected async getUserName(): Promise<string> {
        let userInfo = await this.getUserInfo();
        if (userInfo && userInfo.nickName && userInfo.token) {
            return userInfo.nickName;
        }
        return "";
    }

    protected async getCookies(): Promise<string> {
        return this.getCookiesJoinStr(baseHost);
    }

    private async getUserInfo() {
        let userInfoData = await this.requestGetWithCookie(getUserUri);
        if (userInfoData) {
            let datas = userInfoData.match(dataRegexp);

            if (datas) {
                let token = this.getValue(datas, "t");
                let nickName = this.getValue(datas, "nick_name");
                return { token, nickName };
            }
        }
        return undefined;
    }

    private getValue(datas: any, matcher: string) {
        let data: string = datas[0];
        let values = data.match(new RegExp(`(?<=[ \n])${matcher}:(.*?)(?=,)`, "gm"));
        if (values) {
            return values[0]
                .replace(/ /g, '')
                .replace(/"/g, '')
                .replace(/'/g, '')
                .split(":")[1];
        }
    }
}