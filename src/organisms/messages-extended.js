import { html, classString as cs } from '@polymer/lit-element'
import { withStyle } from '@netology-group/wc-utils'

import { actions as Actions, style as actionStyle } from '../atoms/actions'
import { MessagesElement } from '../organisms/messages'
import { style as messageStyle } from '../molecules/message'
import * as actions from '../atoms/action'

import { meta } from '../atoms/message'

import style from './messages.css'

const config = message => new Map([['thumbsup', { name: ':thumbsup', count: message.rating }]])

export class XMessagesElement extends MessagesElement {
  static get properties () {
    return {
      ...super.properties,
      actions: Array,
      actionsallowed: Array,
      parser: String,
    }
  }

  get _actions () {
    return new Map(this.actions)
  }

  __renderMessage (message) { // eslint-disable-line class-methods-use-this
    const metaTpl = message.aggregated
      ? undefined
      : (html`${
        meta({
          classname: message.user_role,
          display_role: message.user_role,
          timestamp: message.timestamp,
          user_name: message.user_name,
        })
      }`)

    const sepClass = cs({
      'message-separator': true,
      'reversed': message.reversed,
    })

    const unseenTpl = !message.unseen
      ? undefined
      : (html`
        <div slot$=${`message-${message.id}`}>
          <div class$=${sepClass}>
            <hr><span>${message.i18n.NEW_MESSAGES}</span>
          </div>
        </div>
      `)

    const className = cs({
      aggregated: message.aggregated,
      deleted: message.deleted,
      message: true,
      normal: !message.reversed,
      reversed: message.reversed,
      unseen: message.unseen,
    })

    return (html`
      <wc-message
        class$='${className}'
        aggregated='${message.aggregated}'
        body='${message.body}'
        classname='${message.user_role}'
        deleted='${message.deleted}'
        uid='${message.id}'
        image='${message.avatar}'
        me='${message.user_id === message.current_user_id}'
        parserName='${this.parser}'
        reversed='${message.reversed}'
        unseen='${message.unseen}'
      >
        ${unseenTpl}
        <div slot='message-prologue'>
          ${this.__renderActions({ ...message })}
          ${metaTpl}
        </div>
        <div slot='message-epilogue'>
          <wc-chat-reactions config='${config(message)}' showcount></wc-chat-reactions>
        </div>
      </wc-message>
    `)
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
