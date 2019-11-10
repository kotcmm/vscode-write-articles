import { ExtensionContext, commands } from "vscode";
import { LoginHelper } from "./account.api";
import { CnblogLoginHelper } from "./login-helpers/cnblog-login";
import { WeixinLoginHelper } from "./login-helpers/weixin-login";
import { CsdnLoginHelper } from "./login-helpers/csdn-login";
import { JianshuLoginHelper } from "./login-helpers/jianshu-login";
import { JuejinLoginHelper } from "./login-helpers/juejin-login";
import { OschinaLoginHelper } from "./login-helpers/oschina-login";
import { ToutiaoLoginHelper } from "./login-helpers/toutiao-login";
import { ZhihuLoginHelper } from "./login-helpers/zhihu-login";
import { SegmentfaultLoginHelper } from "./login-helpers/segmentfault-login";

export class AccountsHelper {

    constructor(private context: ExtensionContext) {
        this.helpers.push(new WeixinLoginHelper());
        this.helpers.push(new CnblogLoginHelper());
        this.helpers.push(new JianshuLoginHelper());
        this.helpers.push(new JuejinLoginHelper());
        this.helpers.push(new OschinaLoginHelper());
        this.helpers.push(new SegmentfaultLoginHelper());
        this.helpers.push(new ToutiaoLoginHelper());
        this.helpers.push(new CsdnLoginHelper());
        this.helpers.push(new ZhihuLoginHelper());

        context.subscriptions.push(commands.registerCommand('write-articles.login',
            (loginHelper: LoginHelper) => loginHelper.login().catch(console.error)));
    }

    helpers: Array<LoginHelper> = [];
}