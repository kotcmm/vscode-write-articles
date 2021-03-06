import { AccountsHelper } from './accounts-helper';
import { window, ExtensionContext } from 'vscode';
import { LoginProvider } from './login-provider';

export function activate(context: ExtensionContext) {

	const helper = new AccountsHelper(context);
	const loginProvider = new LoginProvider(helper.helpers, context);
	const loginTree = window.createTreeView('loginExplorer', { treeDataProvider: loginProvider });

	context.subscriptions.push(loginTree);

	return Promise.resolve(helper.helpers);
}

export function deactivate() { }
