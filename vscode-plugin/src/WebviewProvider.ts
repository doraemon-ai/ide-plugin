import { WebviewViewProvider, WebviewView, Uri, WebviewViewResolveContext, Webview } from 'vscode'

/**
 * @author kale
 *
 * @date 2023/7/28
 */
export class WebviewProvider implements WebviewViewProvider {

  private _view?: WebviewView;

  constructor(
    private readonly _extensionUri: Uri,
    private readonly extensionPath: string,
  ) {
    // 获取配置项
  }

  public resolveWebviewView(webviewView: WebviewView, context: WebviewViewResolveContext) {
    this._view = webviewView;

    // webview的配置项
    webviewView.webview.options = {
      enableScripts: true, // Allow scripts in the webview
    };

    // webview的html
    webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);

    // 监听h5中的message事件
    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case 'clear': {
          break;
        }
      }
    });
  }

  private getHtmlForWebview(webview: Webview) {
    return `<!DOCTYPE html>
		<html lang="en">
			<head>
			  <meta charset="UTF-8">
			  <meta name="viewport" content="width=device-width, initial-scale=1.0">
			  <title>Doraemon</title>

        <script>
          localStorage.setItem('doraemon_global_config', 'https://gadgets-server-mss-dev.marmot-cloud.com/config.json')
        </script>
			  <script defer="defer" src="${'http://localhost:3000/static/js/bundle.js'}"></script>
			</head>

			<body>
        <div id="gadgets-container"></div>
        <div id="doraemon-root"/></div>
			</body>
	  </html>`;
  }
}

