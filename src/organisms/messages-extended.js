import { html, classString as cs } from '@polymer/lit-element'
import { withStyle } from '@netology-group/wc-utils'

import { actions as Actions, style as actionStyle } from '../atoms/actions'
import { isAggregatedBy } from '../utils/index'
import * as actions from '../atoms/action'
import { meta } from '../atoms/message'

import { MessagesElement } from './messages'
import style from './messages.css'

const config = message => new Map([['thumbsup', { name: ':thumbsup', count: message.rating }]])

export class XMessagesElement extends MessagesElement {
  static get properties () {
    return {
      ...super.properties,
      i18n: Object,
      actions: Array,
      actionsallowed: Array,
      parser: String,
    }
  }

  get _actions () {
    return new Map(this.actions)
  }

  _renderMessage (message) { // eslint-disable-line class-methods-use-this
    const {
      aggregated,
      avatar,
      body,
      current_user_id,
      deleted,
      id,
      reversed,
      timestamp,
      unseen,
      user_id,
      user_name,
      user_role,
    } = message

    const sepClass = cs({
      'message-separator': true,
      reversed,
    })

    const unseenTpl = unseen && (current_user_id !== user_id)
      ? (html`
        <div slot$=${`message-${reversed ? 'rev-' : ''}${id}`} class='separator-ph'>
          <div class$=${sepClass}>
            <hr><span>${this.i18n.NEW_MESSAGES}</span>
          </div>
        </div>
      `)
      : undefined

    const metaTpl = aggregated
      ? undefined
      : meta({
        classname: user_role,
        display_role: user_role,
        timestamp,
        user_name,
      })

    const className = cs({
      aggregated,
      deleted,
      message: true,
      normal: !reversed,
      reversed,
      unseen,
    })

    return (html`
      <wc-message
        class$='${className}'
        aggregated='${aggregated}'
        body='${body}'
        classname='${user_role}'
        deleted='${deleted}'
        uid='${id}'
        image='${avatar}'
        me='${user_id === current_user_id}'
        parsername='${this.parser}'
        reversed='${reversed}'
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

  _renderEachMessage (it, i, arr) {
    const aggregated = isAggregatedBy('user_id', i, arr)
    const message = { ...it, current_user_id: this.user }

    const idx = this.reverse ? i + 1 : i - 1
    const unseen = this.lastseen !== undefined
      ? arr[idx]
        ? arr[idx].id === this.lastseen
        : null
      : null

    const messageTpl = this._renderMessage({
      ...message,
      aggregated,
      reversed: this.reverse,
      unseen,
    })

    const className = cs({
      aggregated,
      deleted: message.deleted,
      [this.classname || 'messages-item']: true,
      normal: !this.reverse,
      reversed: this.reverse,
      unseen,
    })

    return (html`
      <div class$='${className}'>${messageTpl}</div>
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

export default withStyle(html)(XMessagesElement, style, actionStyle)
