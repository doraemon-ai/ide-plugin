// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import path from 'node:path'
import { WebviewProvider } from './WebviewProvider'
import { IContextMenu } from './interface'
import { registerMenuList, registerWebView, registerRightMenu } from './utils'
import axios, { AxiosResponse } from 'axios'
import { remove } from 'lodash'

/**
 * This method is called when your extension is activated.
 * This line of code will only be executed once when your extension is activated
 */
export function activate(context: vscode.ExtensionContext) {
  const contextMenuList: IContextMenu[] = []

  const config = vscode.workspace.getConfiguration('doraemon')
  // 获取配置项中的文本
  const websiteUrl = config.get('websiteUrl') as string ?? 'https://doraemon-ai.netlify.app'

  axios.get<string, AxiosResponse<string>>(websiteUrl, { timeout: 3000 })
    .then(({ data: htmlTemplate }) => {
      const webviewProvider = createWebView(context, htmlTemplate, contextMenuList)

      registerWebView(context, webviewProvider)

      registerRightMenu(context, contextMenuList)
    })
    .catch(err => {
      console.error(err)
      vscode.window.showErrorMessage('下载html资源失败')
    })
}

/**
 * 注册webview
 */
function createWebView(context: vscode.ExtensionContext, htmlTemplate: string, contextMenus: IContextMenu[]) {
  const webviewProvider = new WebviewProvider(context.extensionUri, htmlTemplate, {
      // 注册右键菜单
      onRegisterContextMenus: menus => {
        registerMenuList(context, webviewProvider, contextMenus, menus)
      },
      onUnRegisterContextMenus: menus => {
        remove(contextMenus, menu => {
          const obj = menus.find(item => item.label === menu.label)
          return !obj
        })
      },
    },
  )

  return webviewProvider
}


/**
 * This method is called when your extension is deactivated
 */
export function deactivate() {
}
