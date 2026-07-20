import * as vscode from 'vscode';

export class ProfileManager {
    // Stores original settings before changes are applied, allowing an exact rollback
    private static originalSettings: Map<string, any> = new Map();

    private static async backupAndSet(key: string, value: any) {
        const config = vscode.workspace.getConfiguration();
        if (!this.originalSettings.has(key)) {
            // Check if the setting exists globally, otherwise back up undefined
            const currentVal = config.inspect(key)?.globalValue;
            this.originalSettings.set(key, currentVal);
        }
        await config.update(key, value, vscode.ConfigurationTarget.Global);
    }

    public static async clearAllOverrides() {
        const config = vscode.workspace.getConfiguration();
        for (const [key, originalValue] of this.originalSettings.entries()) {
            await config.update(key, originalValue, vscode.ConfigurationTarget.Global);
        }
        this.originalSettings.clear();
    }

    public static async activateHyperFocus() {
        await this.clearAllOverrides();
        
        // ADHD: Remove UI noise by modifying core settings
        await this.backupAndSet('workbench.activityBar.visible', false);
        await this.backupAndSet('editor.minimap.enabled', false);
        await this.backupAndSet('workbench.statusBar.visible', false);
        
        // Forcefully collapse the sidebar explorer programmatically
        await vscode.commands.executeCommand('workbench.action.closeSidebar');
    }

    public static async activateReadability() {
        await this.clearAllOverrides();
        
        // Dyslexia: Improve typographic decoding
        await this.backupAndSet('editor.fontFamily', '"OpenDyslexic", "Atkinson Hyperlegible", monospace');
        await this.backupAndSet('editor.lineHeight', 36);
        await this.backupAndSet('editor.letterSpacing', 1.8);
    }

    public static async activateLowStimulus() {
        await this.clearAllOverrides();
        
        // Autism: Calm, low-contrast visual environment
        await this.backupAndSet('editor.cursorBlinking', 'solid');
        await this.backupAndSet('editor.cursorSmoothCaretAnimation', 'off');
        await this.backupAndSet('workbench.colorCustomizations', {
            "editorError.foreground": "#d98880", 
            "editorWarning.foreground": "#f7dc6f", 
            "editor.selectionBackground": "#34495e"
        });
    }

    public static async activateColorSafe(type: 'protanopia' | 'deuteranopia' | 'tritanopia') {
        await this.clearAllOverrides();
        
        let errorColor = "#0088FF"; 
        let warningColor = "#FFaa00"; 

        if (type === 'tritanopia') {
            errorColor = "#FF5555";
            warningColor = "#00FFFF";
        }

        // Colorblind Maps: Override error/warning squiggles
        await this.backupAndSet('workbench.colorCustomizations', {
            "editorError.foreground": errorColor,
            "editorWarning.foreground": warningColor,
            "editorError.border": errorColor, 
            "editorError.background": "#1a1a1a"
        });
    }
}