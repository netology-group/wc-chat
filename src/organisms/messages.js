import { html, LitElement } from '@polymer/lit-element'
import { withStyle } from '@netology-group/wc-utils/lib/mixins/mixins'

import { style as actionStyle } from '../atoms/actions'
import { messageExtended as Message } from '../molecules/message-extended'
import { style as messageStyle } from '../molecules/message'
import style from '../organisms/messages.css'

export class MessagesElement extends LitElement {
  static get properties () {
    return {
      invoke: String,
      list: Array,
      user: Number,
      users: Array,
    }
  }

  __renderMessage (message) { // eslint-disable-line class-methods-use-this
    return Message({ message })
  }

  __renderMessages (list) {
    return list.map((it, i, arr) => {
      const aggregated = !i ? false : arr[i].user_id === arr[i - 1].user_id
      const message = { ...it, current_user_id: this.user }

      return this.__renderMessage(aggregated ? { ...message, aggregated } : message)
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
