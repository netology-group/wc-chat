import { html, LitElement } from '@polymer/lit-element'
import IntlMessageFormat from 'intl-messageformat'
import { withStyle } from '@netology-group/wc-utils/lib/mixins/mixins'
import { ReactionList as Reactions } from '@netology-group/wc-reaction/es/organisms/reaction-list'

import Input from '../organisms/input'
import Messages from '../organisms/messages-extended'
import Scroll from '../molecules/scrollable'
import { getIndexById, registerCustomElement } from '../utils/index'
import style from '../ecosystems/chat.css'
import i18n from '../i18n'

const EVENT = 'did-update'

export class Chat extends LitElement {
  static get properties () {
    return {
      actions: Array,
      actionsallowed: Array,
      delaysubmit: Number,
      delayupdate: Number,
      disabled: Boolean,
      lang: String,
      lastseen: Number,
      list: Array,
      maxrows: Number,
      message: String,
      noinput: Boolean,
      placeholder: String,
      placeholderdisabled: String,
      reverse: Boolean,
      scrollabledisabled: Boolean,
      user: Number,
      users: Array,
    }
  }

  constructor (props) {
    super(props)

    this._lang = this.lang || IntlMessageFormat.prototype._resolveLocale(navigator.language)

    if (!this.i18n[this._lang]) {
      this._lang = 'en-US'
    }

    this._strNewMessages = new IntlMessageFormat(this.i18n[this._lang].NEW_MESSAGES_COUNT, this._lang)

    this.boundedMessageSubmit = this._handleSubmit.bind(this)
    this.boundedMessageDelete = this._handleDelete.bind(this)
    this.boundedUserDisable = this._handleUserDisable.bind(this)
    this.boundedMessageReaction = this._handleMessageReaction.bind(this)
    this.boundedLastSeenChange = this._handleLastSeenChange.bind(this)

    registerCustomElement('wc-chat-scrollable', Scroll)
    registerCustomElement('wc-chat-input', Input)
    registerCustomElement('wc-chat-messages', Messages)
    registerCustomElement('wc-chat-reactions', Reactions)

    this._scrollable = null
  }

  disconnectedCallback () {
    this.boundedMessageSubmit = null
    this.boundedMessageDelete = null
    this.boundedUserDisable = null
    this.boundedMessageReaction = null
  }

  get i18n () {
    return i18n
  }

  scrollTo () {
    this._scrollable.scrollTo && this._scrollable.scrollTo()
  }

  _firstRendered () {
    if (this.shadowRoot) this._scrollable = this.shadowRoot.querySelector('wc-chat-scrollable')
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

  _handleLastSeenChange (e) {
    if (this.list && this.list.length > 0 && this.lastseen !== undefined && this.lastseen !== this.list[this.list.length - 1].id) {
      this.dispatchEvent(new CustomEvent('chat-last-seen-change', { detail: this.list[this.list.length - 1].id }))
    }
  }

  _render (props) {
    const input = props.noinput
      ? null
      : (html`
        <div class='input'>
          <wc-chat-input
            delay='${props.delaysubmit || 0}'
            maxrows='${props.maxrows || 10}'
            disabled='${props.disabled}'
            on-message-submit='${this.boundedMessageSubmit}'
            placeholder='${props.placeholder}'
            placeholderdisabled='${props.placeholderdisabled}'
            value='${props.message}'
          />
        </div>
      `)
    const list = props.list
      ? props.reverse
        ? props.list.slice().reverse()
        : props.list
      : undefined
    const lastSeenIndex = props.list && props.lastseen !== undefined
      ? getIndexById(props.lastseen, props.list)
      : null
    const newMessageCount = props.list && props.lastseen !== undefined && lastSeenIndex !== null
      ? props.list.length - 1 - lastSeenIndex
      : 0

    return (html`
      <div class='wrapper'>
        <wc-chat-scrollable
          delay='${props.delayupdate}'
          i18n='${{
            GO_TO_RECENT_MESSAGE: this.i18n[this._lang].GO_TO_RECENT_MESSAGE,
            NEW_MESSAGES_COUNT: this._strNewMessages.format({count: newMessageCount}),
            SEE: this.i18n[this._lang].SEE
          }}'
          freeze='${props.scrollabledisabled}'
          listen='${EVENT}'
          on-last-seen-change='${this.boundedLastSeenChange}'
          reverse='${props.reverse}'
          showbannernew='${newMessageCount > 0}'
        >
          <wc-chat-messages
            actions='${props.actions}'
            actionsallowed='${props.actionsallowed}'
            i18n='${{
              NEW_MESSAGES: this.i18n[this._lang].NEW_MESSAGES
            }}'
            invoke='${EVENT}'
            lastseen='${props.lastseen}'
            list='${list}'
            on-message-delete='${this.boundedMessageDelete}'
            on-message-reaction='${this.boundedMessageReaction}'
            on-user-disable='${this.boundedUserDisable}'
            reverse='${props.reverse}'
            user='${props.user}'
            users='${props.users}'
          />
        </wc-chat-scrollable>
        ${input}
      </div>
    `)
  }
}

export default withStyle(html)(Chat, style)
