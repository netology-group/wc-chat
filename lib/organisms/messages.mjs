import { html, LitElement } from '@polymer/lit-element'
import { withStyle } from '@netology-group/webcomponents-utils/lib/mixins/mixins'

import { actions, styles as actionStyles } from '../atoms/actions.mjs'
import { withPermissions, withActions } from '../utils/mixins'
import Message from '../molecules/message.mjs'

export const styles = `
  .messages {
    width: 93%;
    height: 87%;
    padding: 20px 0 20px 20px;
    min-height: 200px;
    border-radius: 5px;
  }
  .message-block.deleted .message {
    background: rgba(0,0,0,0.04);
  }
  .message-block.deleted .avatar, .message-block.deleted .message {
    filter: grayscale(75%);
  }
  .avatar {
    width: 32px;
    height: 32px;
    display: inline-block;
    overflow: hidden;
    background: no-repeat center center;
    margin-right: 8px;
    vertical-align: top;
    background-size: contain;
  }
  .message {
    display: inline-block;
    padding: 8px 22px 8px 14px;
    position: relative;
    max-width: 80%;
    text-align: left;
    border-radius: 5px;
    margin-bottom: 16px;
    background-color: #fff;
  }
  .message-meta {
    margin-bottom: 3px;
  }
  .message-line {
    margin: 0;
    line-height: 1.25em;
    margin-bottom: 12px;
  }
  .message-line:last-child {
    margin-bottom: 0;
  }
  .message-status {
    color: #b8b8b8;
    font-size: 0.8em;
  }
  .message-author {
    font-weight: bold;
    margin-right: 8px;
  }
`

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

export { Messages }
