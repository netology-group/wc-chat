import { html } from '@polymer/lit-element'
import { withStyle } from '@netology-group/wc-utils/lib/mixins/mixins'

import { actions as Actions, style as actionStyle } from '../atoms/actions'
import { messageExtended as Message } from '../molecules/message-extended'
import { MessagesElement } from '../organisms/messages'
import { style as messageStyle } from '../molecules/message'
import * as actions from '../atoms/action'

import style from './messages.css'

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
    return Message({ message, children: this.__renderActions({ ...message }) })
  }

  __renderActions (data) {
    let children = []
    let reactions = []

    const isAllowed = (action, d) => d.current_user_id !== d.user_id
      || (d.current_user_id === d.user_id && action.self)

    const hasOnlyReactions = this.actionsallowed
      .filter(key => key !== 'message-reaction')
      .filter(key => isAllowed(this._actions.get(key) || {}, data))

    this.actionsallowed.forEach((key) => {
      const _action = this._actions.get(key) || {}

      if (key === 'message-reaction') {
        reactions = reactions.concat(actions.reaction({
          message: data,
          allowed: isAllowed(_action, data) || undefined,
          children: actions.actionImages.get(key),
          standalone: hasOnlyReactions.length === 0,
          handler: (e, detail) => { this.dispatchEvent(new CustomEvent(key, { detail })) },
        }))
      } else {
        children = children.concat(actions.action({
          message: data,
          allowed: isAllowed(_action, data) || undefined,
          children: actions.actionImages.get(key),
          handler: (e, detail) => { this.dispatchEvent(new CustomEvent(key, { detail })) },
        }))
      }
    })

    return Actions({ children, reactions })
  }
}

export default withStyle(html)(XMessagesElement, style, messageStyle, actionStyle)
