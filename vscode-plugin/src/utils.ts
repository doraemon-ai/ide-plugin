/**
 * @author kale
 *
 * @date 2023/7/29
 */
import * as vscode from 'vscode'
import { Command, IContextMenu } from './interface'
import { WebviewProvider } from './WebviewProvider'

/**
 * 得到用户选中的文本内容
 */
export const getSelectText = (): string => {
  // 获取当前激活的文本编辑器
  const editor = vscode.window.activeTextEditor

// 如果编辑器可用，则获取用户选中的文本信息
  if (!editor) {
    console.log('No active text editor found.')
    vscode.window.showWarningMessage(
      'Doraemon：请先打开一个文件，并选择部分代码',
    )
    return
  }

  const selection = editor.selection
  return editor.document.getText(selection)
}

/**
 * 注册webview的provider
 */
export const registerWebView = (context: vscode.ExtensionContext, provider: WebviewProvider) => {
  const webviewDispose = vscode.window.registerWebviewViewProvider(
    'doraemon.webview',
    provider,
    {
      webviewOptions: { retainContextWhenHidden: false },
    },
  )

  context.subscriptions.push(webviewDispose)
}


/**
 * 注册Select Menu的命令
 */
export const registerMenuList = (context: vscode.ExtensionContext, webview: WebviewProvider, curContextMenus: IContextMenu[], newMenus: IContextMenu[]) => {
  newMenus.forEach(menu => {
    if (!curContextMenus.find(item => item.label === menu.label)) {
      curContextMenus.push(menu)

      const disposable = vscode.commands.registerCommand(menu.action, (event) => {
        // 执行右键菜单命令的逻辑
        switch (menu.action) {
          case Command.getSelectedText:
            const text = getSelectText()
            if (text) {
              webview.receiveValues(menu.label, menu.action, menu.expectation, text)
            } else {
              vscode.window.showErrorMessage('未选中任何文本')
            }
            break
          default:
            vscode.window.showInformationMessage('该功能还未实现')
        }
      })

      context.subscriptions.push(disposable)
    }
  })
}

/**
 * 注册主右键菜单
 */
export function registerRightMenu(context: vscode.ExtensionContext, contextMenus: IContextMenu[]) {
  const disposable = vscode.commands.registerCommand('doraemon.rightMenu', () => {
    vscode.window.showQuickPick(contextMenus).then(selectionMenu => {
      if (selectionMenu) {
        vscode.commands.executeCommand(selectionMenu.action)
      }
    })

    context.subscriptions.push(disposable)
  })
}
