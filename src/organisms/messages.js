import { html, LitElement, classString as cs } from '@polymer/lit-element'
import { registerCustomElement } from '@netology-group/wc-utils/lib/utils'
import { withStyle } from '@netology-group/wc-utils'

import { style as actionStyle } from '../atoms/actions'
import { style as messageStyle, Message } from '../molecules/message'
import style from '../organisms/messages.css'

import { meta } from '../atoms/message'

export class MessagesElement extends LitElement {
  static get properties () {
    return {
      i18n: Object,
      invoke: String,
      lastseen: Number,
      list: Array,
      reverse: Boolean,
      user: Number,
      users: Array,
    }
  }

  connectedCallback () {
    if (!this.__setup) {
      // debug('`__setup` is not present. Registering customElements...')
      this._childrenElements.forEach((el, k) => { registerCustomElement(k, el) })
    }

    super.connectedCallback()
  }

  get _childrenElements () { // eslint-disable-line class-methods-use-this
    return new Map([['wc-message', Message]])
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

    const className = cs({
      aggregated: message.aggregated,
      deleted: message.deleted,
      message: true,
      normal: !message.reversed,
      reversed: message.reversed,
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
        reversed='${message.reversed}'
      >
        <div slot='message-prologue'>
          ${metaTpl}
        </div>
      </wc-message>
    `)
  }

  __renderMessages (list) {
    return list.map((it, i, arr) => {
      const aggregated = !i ? false : arr[i].user_id === arr[i - 1].user_id
      const idx = this.reverse ? i + 1 : i - 1
      const unseen = this.lastseen !== undefined
        ? arr[idx]
          ? arr[idx].id === this.lastseen
          : null
        : null
      const message = { ...it, current_user_id: this.user }

      const messageTpl = this.__renderMessage({
        ...message, aggregated, i18n: this.i18n, unseen, reversed: this.reverse,
      })

      const className = cs({
        aggregated,
        deleted: message.deleted,
        message: true,
        normal: !this.reverse,
        reversed: this.reverse,
        unseen,
      })

      return (html`
        <div class$='${className}'>${messageTpl}</div>
      `)
    })
  }

  _render ({ list = [] }) {
    const content = !list.length
      ? null
      : (html`<div class='messages-inner'>
        ${this.__renderMessages(list)}
      </div>`)

    return (html`<div class='messages'>${content}</div>`)
  }

  _didRender () {
    this.dispatchEvent(new CustomEvent(this.invoke))
  }
}

export default withStyle(html)(MessagesElement, style, messageStyle, actionStyle)
