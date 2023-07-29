/**
 * @author kale
 *
 * @date 2023/7/29
 */
export interface IContextMenu {
  label: string,
  command: string,
  callback: string
}

export interface IMessageInfo {
  type: MessageType,
  data: any
}

export enum MessageType {
  registerContextMenu = 'REGISTER_CONTEXT_MENU',
  unRegisterContextMenu = 'UNREGISTER_CONTEXT_MENU'
}

export enum Command {
  getSelectedText = 'GET_SELECTED_TEXT'
}
