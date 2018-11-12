import { html } from '@polymer/lit-element'
import { withStyle } from '@netology-group/wc-utils'

import { actions as Actions, style as actionStyle } from '../atoms/actions'
import { messageExtended as Message } from '../molecules/message-extended'
import { MessagesElement } from '../organisms/messages'
import { style as messageStyle } from '../molecules/message'
import * as actions from '../atoms/action'

import style from './messages.css'

const config = message => new Map([['thumbsup', { name: ':thumbsup', count: message.rating }]])

export class XMessagesElement extends MessagesElement {
  static get properties () {
    return {
      ...super.properties,
      actions: Array,
      actionsallowed: Array,
    }
  }

  get _actions () {
    return new Map(this.actions)
  }

  __renderMessage (message) {
    return Message({
      message,
      actions: this.__renderActions({ ...message }),
      children: (html`<wc-chat-reactions config='${config(message)}' showcount></wc-chat-reactions>`),
    })
  }

  __renderActions (data) {
    const children = new Map()
    const reactions = new Map()
    const actionsOpts = new Map()

    const isAllowed = (action, d) => d.current_user_id !== d.user_id
      || (d.current_user_id === d.user_id && action.self)

    this.actionsallowed.forEach((key) => {
      const _action = this._actions.get(key) || {}
      const actionOpts = {
        message: data,
        allowed: isAllowed(_action, data) || undefined,
        children: actions.actionImages.get(key),
        handler: (e, detail) => { this.dispatchEvent(new CustomEvent(key, { detail })) },
      }

      actionsOpts.set(key, actionOpts)

      if (key === 'message-reaction') {
        reactions.set(key, actions.reaction(actionOpts))
      } else {
        children.set(key, actions.action(actionOpts))
      }
    })

    // eslint-disable-next-line object-curly-newline
    return Actions({ children, reactions, actions: actionsOpts })
  }
}

export default withStyle(html)(XMessagesElement, style, messageStyle, actionStyle)
