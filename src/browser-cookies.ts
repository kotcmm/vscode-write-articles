import { ChromeCookies } from "./cookies/chrome-cookies";
import { Cookie } from "./account.api";

export class BrowserCookies {
    //TODO:支持多种浏览器
    public async getCookies(hostKey: string): Promise<Array<Cookie>> {
        let chromeCookies: ChromeCookies = new ChromeCookies();
        return await chromeCookies.getCookies(hostKey);
    }
}