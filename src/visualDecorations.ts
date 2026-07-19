import * as vscode from 'vscode';

export class VisualDecorationsManager {
    private static dimDecoration: vscode.TextEditorDecorationType | null = null;
    private static bandingDecorations: vscode.TextEditorDecorationType[] = [];
    private static listenerDisposables: vscode.Disposable[] = [];

    // Clears any active visual effects from the screen
    public static clearDecorations(editor: vscode.TextEditor) {
        // Remove active event listeners
        this.listenerDisposables.forEach(d => d.dispose());
        this.listenerDisposables = [];

        // Clear the ADHD dimming effect
        if (this.dimDecoration) {
            editor.setDecorations(this.dimDecoration, []);
            this.dimDecoration.dispose();
            this.dimDecoration = null;
        }

        // Clear the Dyslexia line bands
        this.bandingDecorations.forEach(d => {
            editor.setDecorations(d, []);
            d.dispose();
        });
        this.bandingDecorations = [];
    }

    // ADHD Mode: Keeps the active line bright, dims everything else
    public static triggerLineFocus(editor: vscode.TextEditor) {
        this.clearDecorations(editor);

        // Define what the "dimmed" text looks like
        this.dimDecoration = vscode.window.createTextEditorDecorationType({
            opacity: '0.3', // Fades out the text
            backgroundColor: 'rgba(0, 0, 0, 0.2)' // Slightly darkens the background
        });

        const updateFocus = () => {
            if (!editor || !this.dimDecoration) return;
            const activeLine = editor.selection.active.line;
            const totalLines = editor.document.lineCount;
            const dimRanges: vscode.Range[] = [];

            // Dim all lines above the active cursor
            if (activeLine > 0) {
                dimRanges.push(new vscode.Range(0, 0, activeLine - 1, 999));
            }
            
            // Dim all lines below the active cursor
            if (activeLine < totalLines - 1) {
                dimRanges.push(new vscode.Range(activeLine + 1, 0, totalLines - 1, 999));
            }

            editor.setDecorations(this.dimDecoration, dimRanges);
        };

        // Apply immediately, then listen for cursor movement to update it
        updateFocus();
        this.listenerDisposables.push(
            vscode.window.onDidChangeTextEditorSelection(() => updateFocus())
        );
    }

    // Dyslexia Mode: Alternating background colors (Zebra stripes) to track lines
    public static triggerLineBanding(editor: vscode.TextEditor) {
        this.clearDecorations(editor);

        // Define a very subtle background color for the bands
        const evenRowDec = vscode.window.createTextEditorDecorationType({
            backgroundColor: 'rgba(255, 255, 255, 0.04)', 
            isWholeLine: true
        });
        this.bandingDecorations.push(evenRowDec);

        const updateBanding = () => {
            if (!editor) return;
            const totalLines = editor.document.lineCount;
            const evenRanges: vscode.Range[] = [];

            // Apply the decoration only to even-numbered lines
            for (let i = 0; i < totalLines; i += 2) {
                evenRanges.push(new vscode.Range(i, 0, i, 999));
            }
            
            editor.setDecorations(evenRowDec, evenRanges);
        };

        // Apply immediately, then listen for document edits to update the bands if lines are added
        updateBanding();
        this.listenerDisposables.push(
            vscode.workspace.onDidChangeTextDocument(() => updateBanding())
        );
    }
}