/**
 * @author kale
 *
 * @date 2023/7/29
 */
export interface IContextMenu {
  label: string,
  action: string,
  expectation: string
}

export interface IMessageInfo {
  type: MessageType,
  data: any
}

export enum MessageType {
  registerContextMenu = 'REGISTER_CONTEXT_MENU',
  unRegisterContextMenu = 'UNREGISTER_CONTEXT_MENU'
}

export enum Action {
  getSelectedText = 'SYS_ACT:GET_SELECTED_TEXT'
}

export enum Command {
  showContextMenu = 'showContextMenu'
}
