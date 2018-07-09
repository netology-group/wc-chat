import { html, LitElement } from '@polymer/lit-element'
import { withStyle } from '@netology-group/webcomponents-utils/lib/mixins/mixins'

import { del } from '../images'
import Action from '../atoms/action.mjs'
import Actions, { notAllowed, toBinary } from '../atoms/actions.mjs'
import Message from '../molecules/message.mjs'

export const styles = `
  .messages {
    width: 93%;
    height: 87%;
    padding: 20px 0 20px 20px;
    min-height: 200px;
    overflow-y: scroll;
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

  _getPermissions () { return this.permissions || notAllowed }

  _enrichMessage (message) {
    const user = this.users.filter(it => it.user_id === message.user_id)

    if (user) {
      message.user_name = user[0].name // eslint-disable-line no-param-reassign
    }

    return this._renderMessage(message)
  }

  _selectMessageTemplate (props, permissions) {
    const children = this._renderActions(props, permissions)

    return Message(Object.assign({}, props, { permissions, children }))
    // return Message(Object.assign({}, props))
  }

  _renderMessage (message) {
    const permissions = this._getPermissions()

    return this._selectMessageTemplate({ message }, permissions)
  }

  _getActions () {
    return new Map([
      [
        'delete',
        {
          getTemplate: message => Action({
            children: del,
            fn: this._onMessageDelete.bind(this),
            message,
          }),
          permission: '00010',
        },
      ],
    ])
  }

  _renderActions (props, permissions) {
    let children = []

    this._getActions().forEach(({
      getTemplate,
      permission,
    }) => {
      // eslint-disable-next-line no-bitwise
      if (toBinary(permission) & toBinary(permissions)) {
        children = children.concat(getTemplate(props.message))
      }
    })

    return Actions({ children })
  }

  _render ({ list = [] }) {
    if (!list.length) return html`<div class="messages"></div>`

    return html`
      <div class="messages">
        <div class="messages-inner">
          ${list.map(it => this._enrichMessage(it))}
        </div>
      </div>
    `
  }
}

const Messages = withStyle(MessageList, styles)

export default Messages

export { Messages }
