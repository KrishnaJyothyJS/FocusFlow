export class DashboardView {
    public static getHtml(): string {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        /* Base Dark Theme matching standard VS Code */
        body { 
            background-color: var(--vscode-editor-background); 
            color: var(--vscode-editor-foreground); 
            font-family: var(--vscode-font-family); 
            padding: 40px; 
            margin: 0;
        }
        
        .header { margin-bottom: 40px; text-align: center; }
        .header h1 { margin-bottom: 5px; font-size: 2rem; font-weight: 600; }
        .header p { color: var(--vscode-descriptionForeground); font-size: 1.1rem; }
        
        /* Grid Layout for the 4 profiles */
        .grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); 
            gap: 25px; 
            max-width: 1200px;
            margin: 0 auto;
        }

        /* Card Styling */
        .card { 
            background-color: var(--vscode-editorWidget-background); 
            border: 1px solid var(--vscode-widget-border); 
            border-radius: 12px; 
            padding: 24px; 
            display: flex; 
            flex-direction: column; 
            justify-content: space-between; 
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        }
        
        /* Top Border Accents */
        .card.hyper { border-top: 4px solid #bd93f9; }
        .card.read { border-top: 4px solid #50fa7b; }
        .card.low { border-top: 4px solid #8be9fd; }
        .card.color { border-top: 4px solid #ff5555; }

        .card h3 { margin: 0 0 10px 0; font-size: 1.3rem; color: var(--vscode-editor-foreground); }
        .card p { margin: 0 0 20px 0; font-size: 0.95rem; color: var(--vscode-descriptionForeground); line-height: 1.5; }
        
        /* Button Styling */
        button { 
            background-color: var(--vscode-button-background); 
            color: var(--vscode-button-foreground); 
            border: none; 
            padding: 12px; 
            border-radius: 6px; 
            cursor: pointer; 
            font-weight: 600; 
            font-size: 1rem;
            width: 100%; 
            transition: background-color 0.2s;
        }
        button:hover { background-color: var(--vscode-button-hoverBackground); }
        .active-btn { background-color: var(--vscode-button-secondaryBackground); color: var(--vscode-button-secondaryForeground); border: 1px solid var(--vscode-button-border); }
    </style>
</head>
<body>
    <div class="header">
        <h1>FocusFlow</h1>
        <p>Tailor your development space to fit your cognitive processing flow.</p>
    </div>
    
    <div class="grid">
        <div class="card hyper">
            <h3>Hyper-Focus</h3>
            <p>ADHD Optimization. Toggles distraction-blocking, isolates active workfiles, and strips status elements.</p>
            <button onclick="sendAction('hyper', this)">Activate ⚡</button>
        </div>
        <div class="card read">
            <h3>Readability Engine</h3>
            <p>Dyslexia Optimization. Switches to specialized typefaces with high tracking height and zebra line-bands.</p>
            <button onclick="sendAction('readability', this)">Activate 👁️</button>
        </div>
        <div class="card low">
            <h3>Low-Stimulus</h3>
            <p>Autistic Optimization. Dampens volatile light levels, removes movement animations, and dims inactive code blocks.</p>
            <button onclick="sendAction('lowstim', this)">Activate ☁️</button>
        </div>
        <div class="card color">
            <h3>Color-Safe Maps</h3>
            <p>Visual Adaptation. Provides high-contrast, colorblind-safe configurations across color spectra.</p>
            <button onclick="sendAction('colorblind', this)">Activate 🎨</button>
        </div>
    </div>

    <script>
        // Connect the Webview to the VS Code backend
        const vscode = acquireVsCodeApi();

        function sendAction(profile, buttonElement) {
            // Send the message back to extension.ts
            vscode.postMessage({ command: 'selectProfile', choice: profile });
            
            // UI Polish: Remove 'active' state from all buttons
            document.querySelectorAll('button').forEach(btn => {
                btn.classList.remove('active-btn');
                btn.innerHTML = btn.innerHTML.replace(' (Active)', '');
            });
            
            // Add 'active' state to the clicked button
            buttonElement.classList.add('active-btn');
            buttonElement.innerHTML += ' (Active)';
        }
    </script>
</body>
</html>`;
    }
}