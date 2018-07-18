import { html, LitElement } from '@polymer/lit-element'
import { withStyle } from '@netology-group/wc-utils/lib/mixins/mixins'

import { actions, styles as actionStyles } from '../atoms/actions.mjs'
import { withPermissions, withActions } from '../utils/mixins'
import Message from '../molecules/message.mjs'

import styles from './messages.css'

export class MessageList extends LitElement {
  static get properties () {
    return {
      list: Array,
      permissions: String,
      sheet: Object,
      user: Number,
      users: Array,
    }
  }

  _onMessageDelete (e, message) {
    this.dispatchEvent(new CustomEvent('message-delete', { detail: { id: message.id } }))
  }

  _renderMessage (message) {
    return Message({ message, children: this._renderActions(message) })
  }

  _render ({ list = [] }) {
    if (!list.length) return html`<div class="messages"></div>`

    return html`
      <div class="messages">
        <div class="messages-inner">
          ${list.map(it => this._renderMessage(it))}
        </div>
      </div>
    `
  }

  _didRender () {
    this.dispatchEvent(new CustomEvent('did-update'))
  }
}

const Messages = withStyle(withActions(withPermissions(MessageList), actions), styles, actionStyles)

export default Messages

export { Messages, styles }
