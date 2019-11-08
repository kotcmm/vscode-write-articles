import { TreeDataProvider, Event, TreeItem, ProviderResult, EventEmitter, ExtensionContext } from "vscode";
import { LoginHelper } from "./account.api";

export class LoginProvider implements TreeDataProvider<LoginHelper>{

    private _onDidChangeTreeData: EventEmitter<any> = new EventEmitter<any>();
    readonly onDidChangeTreeData: Event<any> = this._onDidChangeTreeData.event;

    public async refresh(): Promise<any> {
        this._onDidChangeTreeData.fire();
    }

    constructor(private helpers: Array<LoginHelper>,
        private context: ExtensionContext) {
        helpers.forEach(helper => {
            helper.account.onStatusChanged(s => this._onDidChangeTreeData.fire(s));
        });
    }

    getTreeItem(element: LoginHelper): TreeItem | Thenable<TreeItem> {
        return {
            label: `${element.name}:${element.account.userName}`,
            iconPath: this.context.asAbsolutePath(element.iconPath)
        };
    }

    getChildren(element?: LoginHelper | undefined): ProviderResult<LoginHelper[]> {

        return this.helpers;
    }
}