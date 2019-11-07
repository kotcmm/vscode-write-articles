import { ExtensionContext, commands } from "vscode";
import { LoginHelper } from "./account.api";
import { CnblogLoginHelper } from "./login-helpers/cnblog-login";

export class AccountsHelper {

    constructor(private context: ExtensionContext) {
        this.helpers.push(new CnblogLoginHelper());

        context.subscriptions.push(commands.registerCommand('cnblog-account.login',
            (loginHelper: LoginHelper) => loginHelper.login().catch(console.error)));
    }

    helpers: Array<LoginHelper> = [];
}