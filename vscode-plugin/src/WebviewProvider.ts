import * as vscode from 'vscode'
import { IContextMenu, IMessageInfo, MessageType } from './interface'

/**
 * @author kale
 *
 * @date 2023/7/28
 */
export class WebviewProvider implements vscode.WebviewViewProvider {

  private _webview?: vscode.Webview

  private readonly _htmlTemplate: string

  private _globalConfig: string

  private _javascript: string

  private readonly _callback: {
    onRegisterContextMenus: (menus: IContextMenu[]) => void,
    onUnRegisterContextMenus: (menus: IContextMenu[]) => void,
  }

  constructor(
    _extensionUri: vscode.Uri,
    htmlTemplate: string,
    registerCallback: {
      onRegisterContextMenus: (menus: IContextMenu[]) => void,
      onUnRegisterContextMenus: (menus: IContextMenu[]) => void,
    },
  ) {
    // 获取配置项
    const config = vscode.workspace.getConfiguration('doraemon');
    // 获取配置项中的文本
    this._globalConfig = config.get('globalConfig') as string ?? 'https://raw.githubusercontent.com/doraemon-ai/4th-dimensional-pocket/main/config.json'
    this._javascript = config.get('javascript') as string

    this._htmlTemplate = this.modifyTemplate(htmlTemplate)

    console.log('htmlTemplate', this._htmlTemplate)
    this._callback = registerCallback
  }

  /**
   * 修改html的模板内容
   */
  private modifyTemplate(htmlTemplate: string) {
    if (true) {
      // 替换js文件
      htmlTemplate = htmlTemplate.replace(
        'https://doraemon-ai.netlify.app/static/js/main.d800d32e.js',
        'http://localhost:3000/static/js/bundle.js'
        // this._javascript,
      )
    }

    if (this._globalConfig) {
      // 插入global-config的配置
      const start = htmlTemplate.indexOf('<style>')
      const newStr = `<script>localStorage.setItem('doraemon_global_config', '${this._globalConfig}')</script>`
      return htmlTemplate.slice(0, start) + newStr + htmlTemplate.slice(start)
    }
  }

  public resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext) {
    this._webview = webviewView.webview

    // webview的配置项
    this._webview.options = {
      enableScripts: true, // Allow scripts in the webview
    }

    // webview的html
    this._webview.html = this._htmlTemplate

    // 监听h5中的message事件
    this._webview.onDidReceiveMessage(async (message: IMessageInfo) => {
      switch (message.type) {
        case MessageType.registerContextMenu: {
          this._callback.onRegisterContextMenus(message.data)
          break
        }
        case MessageType.unRegisterContextMenu:
          this._callback.onUnRegisterContextMenus(message.data)
          break
      }
    })
  }

  public receiveValues(label: string, action: string, expectation: string, values: any) {
    this._webview?.postMessage({
      label,
      action,
      expectation,
      values,
      fileName: vscode.window.activeTextEditor?.document.fileName,
    })
  }

}

