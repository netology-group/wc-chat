import { html, LitElement } from '@polymer/lit-element'
import { withStyle } from '@netology-group/wc-utils/lib/mixins/mixins'

import { style as actionStyle } from '../atoms/actions'
import { messageExtended as Message } from '../molecules/message-extended'
import { style as messageStyle } from '../molecules/message'

import style from './messages.css'

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

  _render ({ list = [] }) {
    if (!list.length) return (html`<div class='messages'></div>`)

    return (html`
      <div class='messages'>
        <div class='messages-inner'>
          ${list.map(it => this.__renderMessage(it))}
        </div>
      </div>
    `)
  }

  _didRender () {
    this.dispatchEvent(new CustomEvent(this.invoke))
  }
}

export default withStyle(html)(MessagesElement, style, messageStyle, actionStyle)
