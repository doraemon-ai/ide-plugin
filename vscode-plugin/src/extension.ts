// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import path from 'node:path'

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "vscode-plugin" is now active!')

  let disposable = vscode.commands.registerCommand('vscode-plugin.helloWorld', () => {
    vscode.window.showInformationMessage('Hello World from my-vscode-extendsion!')

    const panel = vscode.window.createWebviewPanel(
      'catCoding',
      'Cat Coding',
      vscode.ViewColumn.One,
      {
        retainContextWhenHidden: true, // 保证 Webview 所在页面进入后台时不被释放
        enableScripts: true, // 运行 JS 执行
      },
    )

    const isProduction = context.extensionMode === vscode.ExtensionMode.Production

    let srcUrl = ''

    if (false) {
      const filePath = vscode.Uri.file(
        path.join(context.extensionPath, 'dist', 'static/js/main.js'),
      )
      srcUrl = panel.webview.asWebviewUri(filePath).toString()
    } else {
      srcUrl = 'http://localhost:3000/static/js/bundle.js'
    }
    panel.webview.html = getWebviewContent(srcUrl)

    const updateWebview = () => {
      panel.webview.html = getWebviewContent(srcUrl)
    }

    updateWebview()
    const interval = setInterval(updateWebview, 1000)

    panel.onDidDispose(
      () => {
        clearInterval(interval)
      },
      null,
      context.subscriptions,
    )
  })

  context.subscriptions.push(disposable)
}

function getWebviewContent(jsUrl: string) {
  return `<!DOCTYPE html>
		<html lang="en">
			<head>
			  <meta charset="UTF-8">
			  <meta name="viewport" content="width=device-width, initial-scale=1.0">
			  <title>Doraemon</title>

        <script>
          localStorage.setItem('doraemon_global_config', 'https://gadgets-server-mss-dev.marmot-cloud.com/config.json')
        </script>
			  <script defer="defer" src="${jsUrl}"></script>
			</head>

			<body>
        <div id="gadgets-container"/>
        <div id="root"/>
			</body>
	  </html>`
}


// This method is called when your extension is deactivated
export function deactivate() {
}
