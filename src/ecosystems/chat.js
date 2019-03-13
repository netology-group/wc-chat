import { html, LitElement } from '@polymer/lit-element'
import IntlMessageFormat from 'intl-messageformat'
import 'intl-messageformat/lib/locales'
import { withStyle } from '@netology-group/wc-utils'
import { registerCustomElement } from '@netology-group/wc-utils/lib/utils'
import { ReactionList as Reactions } from '@netology-group/wc-reaction/es/organisms/reaction-list'
import Debug from 'debug'

import Input from '../organisms/input'
import Messages from '../organisms/messages-extended'
import Scrollable from '../molecules/scrollable'
import { getIndexById } from '../utils/index'
import style from '../ecosystems/chat.css'
import i18n from '../i18n'

const EVENT = 'did-update'
const debug = Debug('@netology-group/wc-chat/chat')

export class ChatElement extends LitElement {
  static get properties () {
    return {
      actions: Array,
      actionsallowed: Array,
      delaysubmit: Number,
      delayupdate: Number,
      disabled: Boolean,
      language: String,
      lastseen: Number,
      list: Array,
      maxlength: Number,
      maxrows: Number,
      message: String,
      noinput: Boolean,
      parser: String,
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

    this._lang = this._resolveLanguage(this.language)

    // eslint-disable-next-line max-len
    this._strNewMessages = new IntlMessageFormat(this.i18n[this._lang].NEW_MESSAGES_COUNT, this._lang)

    this.boundedMessageSubmit = this._handleSubmit.bind(this)
    this.boundedMessageDelete = this._handleDelete.bind(this)
    this.boundedUserDisable = this._handleUserDisable.bind(this)
    this.boundedMessageReaction = this._handleMessageReaction.bind(this)
    this.boundedLastSeenChange = this._handleLastSeenChange.bind(this)

    this._scrollable = null
  }

  connectedCallback () {
    if (!this.__setup) {
      debug('`__setup` is not present. Registering customElements...')
      this._childrenElements.forEach((el, k) => { registerCustomElement(k, el) })
    }

    super.connectedCallback()
  }

  disconnectedCallback () {
    super.disconnectedCallback()

    this.boundedMessageSubmit = null
    this.boundedMessageDelete = null
    this.boundedUserDisable = null
    this.boundedMessageReaction = null
  }

  get i18n () { // eslint-disable-line class-methods-use-this
    return i18n
  }

  get _childrenElements () { // eslint-disable-line class-methods-use-this
    return new Map([
      ['wc-chat-scrollable', Scrollable],
      ['wc-chat-input', Input],
      ['wc-chat-messages', Messages],
      ['wc-chat-reactions', Reactions],
    ])
  }

  _propertiesChanged (props, changedProps, prevProps) {
    super._propertiesChanged(props, changedProps, prevProps)

    if (changedProps && changedProps.language !== prevProps.language) {
      this._lang = this._resolveLanguage(this.language)
      // eslint-disable-next-line max-len
      this._strNewMessages = new IntlMessageFormat(this.i18n[this._lang].NEW_MESSAGES_COUNT, this._lang)

      this.requestRender()
    }
  }

  _resolveLanguage (language) {
    // eslint-disable-next-line max-len
    let resolvedLanguage = language || IntlMessageFormat.prototype._resolveLocale(navigator.language)

    if (!this.i18n[resolvedLanguage]) {
      resolvedLanguage = 'en-US'
    }

    return resolvedLanguage
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

  _handleLastSeenChange () {
    if (this.list
      && this.list.length > 0
      && this.lastseen !== undefined
      && this.lastseen !== this.list[this.list.length - 1].id
    ) {
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
            maxlength='${props.maxlength}'
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

    const scrollableI18n = {
      GO_TO_RECENT_MESSAGE: this.i18n[this._lang].GO_TO_RECENT_MESSAGE,
      NEW_MESSAGES_COUNT: this._strNewMessages.format({ count: newMessageCount }),
      SEE: this.i18n[this._lang].SEE,
    }

    const messagesI18n = {
      NEW_MESSAGES: this.i18n[this._lang].NEW_MESSAGES,
    }

    return (html`
      <div class='wrapper'>
        <wc-chat-scrollable
          delay='${props.delayupdate}'
          i18n='${scrollableI18n}'
          freeze='${props.scrollabledisabled}'
          listen='${EVENT}'
          on-last-seen-change='${this.boundedLastSeenChange}'
          reverse='${props.reverse}'
          showbannernew='${newMessageCount > 0}'
          unseenSelector='.messages-item.unseen'
        >
          <wc-chat-messages
            actions='${props.actions}'
            actionsallowed='${props.actionsallowed}'
            i18n='${messagesI18n}'
            invoke='${EVENT}'
            lastseen='${props.lastseen}'
            list='${list}'
            on-message-delete='${this.boundedMessageDelete}'
            on-message-reaction='${this.boundedMessageReaction}'
            on-user-disable='${this.boundedUserDisable}'
            parser='${this.parser}'
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

export default withStyle(html)(ChatElement, style)
