import { html, LitElement } from '@polymer/lit-element'
import { withStyle } from '@netology-group/wc-utils/lib/mixins/mixins'

import Input from '../organisms/input'
import Messages from '../organisms/messages-extended'
import Scroll from '../molecules/scrollable'
import Reactions from '../molecules/reactions'
import { registerCustomElement } from '../utils/index'

import style from './chat.css'

const EVENT = 'did-update'

export class Chat extends LitElement {
  static get properties () {
    return {
      actions: Array,
      actionsallowed: Array,
      delay: Number,
      enablegap: Boolean,
      list: Array,
      maxrows: Number,
      message: String,
      placeholder: String,
      placeholderdisabled: String,
      reverse: Boolean,
      user: Number,
      users: Array,
      watch: Boolean,
    }
  }

  constructor (props) {
    super(props)

    this.boundedMessageSubmit = this._handleSubmit.bind(this)
    this.boundedMessageDelete = this._handleDelete.bind(this)
    this.boundedUserDisable = this._handleUserDisable.bind(this)
    this.boundedMessageReaction = this._handleMessageReaction.bind(this)

    registerCustomElement('wc-chat-scrollable', Scroll)
    registerCustomElement('wc-chat-input', Input)
    registerCustomElement('wc-chat-messages', Messages)
    registerCustomElement('wc-chat-reactions', Reactions)
  }

  disconnectedCallback () {
    this.boundedMessageSubmit = null
    this.boundedMessageDelete = null
    this.boundedUserDisable = null
    this.boundedMessageReaction = null
  }

  _handleSubmit (e) {
    this.dispatchEvent(new CustomEvent('chat-message-submit', { detail: e.detail }))
  }

  _handleDelete (e) {
    this.dispatchEvent(new CustomEvent('chat-message-delete', { detail: e.detail }))
  }

  _handleUserDisable (e) {
    this.dispatchEvent(new CustomEvent('chat-user-disable', { detail: e.detail }))
  }

  _handleMessageReaction (e) {
    this.dispatchEvent(new CustomEvent('chat-message-reaction', { detail: e.detail }))
  }

  _render (props) {
    return (html`
      <wc-chat-scrollable
        enablegap='${props.enablegap}'
        listen='${EVENT}'
        watch='${props.watch}'
      >
        <div>
          <wc-chat-messages
            actions='${props.actions}'
            actionsallowed='${props.actionsallowed}'
            invoke='${EVENT}'
            list='${props.list}'
            on-message-delete='${this.boundedMessageDelete}'
            on-message-reaction='${this.boundedMessageReaction}'
            on-user-disable='${this.boundedUserDisable}'
            reverse='${props.reverse}'
            user='${props.user}'
            users='${props.users}'
          />
        </div>
      </wc-chat-scrollable>
      <wc-chat-input
        delay='${props.delay || 0}'
        maxrows='${props.maxrows || 10}'
        on-message-submit='${this.boundedMessageSubmit}'
        placeholder='${props.placeholder}'
        placeholderdisabled='${props.placeholderdisabled}'
        value='${props.message}'
      />
    `)
  }
}

export default withStyle(html)(Chat, style)
