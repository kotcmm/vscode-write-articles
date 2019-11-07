import { TreeDataProvider, Event, TreeItem, ProviderResult, EventEmitter } from "vscode";
import { LoginHelper } from "./account.api";

export class LoginProvider implements TreeDataProvider<LoginHelper>{

    private _onDidChangeTreeData: EventEmitter<any> = new EventEmitter<any>();
    readonly onDidChangeTreeData: Event<any> = this._onDidChangeTreeData.event;

    public async refresh(): Promise<any> {
        this._onDidChangeTreeData.fire();
    }

    constructor(private helpers: Array<LoginHelper>) {

    }

    getTreeItem(element: LoginHelper): TreeItem | Thenable<TreeItem> {
        return {
            label: element.name
        };
    }

    getChildren(element?: LoginHelper | undefined): ProviderResult<LoginHelper[]> {

        return this.helpers;
    }
}