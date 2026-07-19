import * as vscode from 'vscode';
import { ProfileManager } from './profiles';

// These will be provided by Developer 2 and Developer 3
import { DashboardView } from './dashboard';
import { VisualDecorationsManager } from './visualDecorations';

export function activate(context: vscode.ExtensionContext) {
    let panel: vscode.WebviewPanel | undefined = undefined;

    // Register the command to open the dashboard
    let dashboardCmd = vscode.commands.registerCommand('focusflow.openDashboard', () => {
        if (panel) {
            panel.reveal(vscode.ViewColumn.One);
            return;
        }

        panel = vscode.window.createWebviewPanel(
            'focusFlowView',
            'FocusFlow Dashboard',
            vscode.ViewColumn.One,
            { 
                enableScripts: true, 
                retainContextWhenHidden: true 
            }
        );

        // Fetch the HTML from Developer 2's dashboard file
        panel.webview.html = DashboardView.getHtml();

        // Listen for button clicks from the dashboard
        panel.webview.onDidReceiveMessage(async (message) => {
            const activeEditor = vscode.window.activeTextEditor;
            
            // Reset any running visual decorations from Developer 3
            if (activeEditor) {
                VisualDecorationsManager.clearDecorations(activeEditor);
            }

            switch (message.command) {
                case 'selectProfile':
                    if (message.choice === 'hyper') {
                        await ProfileManager.activateHyperFocus();
                        vscode.window.showInformationMessage('FocusFlow: Hyper-Focus Configured.');
                    } 
                    else if (message.choice === 'readability') {
                        await ProfileManager.activateReadability();
                        if (activeEditor) {
                            VisualDecorationsManager.triggerLineBanding(activeEditor);
                        }
                        vscode.window.showInformationMessage('FocusFlow: Readability Engine active.');
                    } 
                    else if (message.choice === 'lowstim') {
                        await ProfileManager.activateLowStimulus();
                        if (activeEditor) {
                            VisualDecorationsManager.triggerLineFocus(activeEditor);
                        }
                        vscode.window.showInformationMessage('FocusFlow: Low-Stimulus environment deployed.');
                    } 
                    else if (message.choice === 'colorblind') {
                        const variant = await vscode.window.showQuickPick(['protanopia', 'deuteranopia', 'tritanopia'], {
                            placeHolder: 'Select your visual adaptation profile'
                        });
                        if (variant) {
                            await ProfileManager.activateColorSafe(variant as any);
                            vscode.window.showInformationMessage(`FocusFlow: Colors optimized for ${variant}.`);
                        }
                    }
                    return;
            }
        });

        panel.onDidDispose(() => { 
            panel = undefined; 
        }, null, context.subscriptions);
    });

    // Register a command to hard-reset everything back to normal
    let resetCmd = vscode.commands.registerCommand('focusflow.resetWorkspace', async () => {
        await ProfileManager.clearAllOverrides();
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            VisualDecorationsManager.clearDecorations(activeEditor);
        }
        vscode.window.showInformationMessage('FocusFlow: Workspace reset to default.');
    });

    context.subscriptions.push(dashboardCmd, resetCmd);
}

// When the extension is deactivated (VS Code closed), clear overrides
export function deactivate() {
    ProfileManager.clearAllOverrides();
}