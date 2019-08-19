import { html, LitElement } from '@polymer/lit-element'
import IntlMessageFormat from 'intl-messageformat'
import { withStyle } from '@netology-group/wc-utils'
import { registerCustomElement } from '@netology-group/wc-utils/lib/utils'
import { ReactionList as Reactions } from '@netology-group/wc-reaction/es/organisms/reaction-list'
import Debug from 'debug'

import Input from '../organisms/input'
import Messages from '../organisms/messages-extended'
import { Message } from '../molecules/message'
import Scrollable from '../organisms/scroll-to-unseen'
import i18n from '../i18n'

import style from './chat.css'

const EVENT = 'did-update'
const debug = Debug('@netology-group/wc-chat/chat')

export class ChatElement extends LitElement {
  static get properties () {
    return {
      actions: Array,
      delaysubmit: Number,
      delayupdate: Number,
      disabled: Boolean,
      language: String,
      lastseen: String,
      list: Array,
      maxlength: Number,
      maxrows: Number,
      message: String,
      noinput: Boolean,
      omni: Boolean,
      parser: String,
      parserpreset: String,
      parserrules: String,
      placeholder: String,
      placeholderdisabled: String,
      reactions: Array,
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
    this.boundedSeekBefore = this._handleSeekBefore.bind(this)
    this.boundedSeekAfter = this._handleSeekAfter.bind(this)

    this._scrollable = undefined

    this._listdir = 0
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

    this.boundedMessageSubmit = undefined
    this.boundedMessageDelete = undefined
    this.boundedUserDisable = undefined
    this.boundedMessageReaction = undefined
    this.boundedLastSeenChange = undefined
    this.boundedSeekBefore = undefined
    this.boundedSeekAfter = undefined
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
      ['wc-chat-message', Message],
    ])
  }

  append (list) {
    if (!list || !Array.isArray(list)) throw new TypeError('List has wrong type')

    this.list = list
    this._listdir = 1
  }

  prepend (list) {
    if (!list || !Array.isArray(list)) throw new TypeError('List has wrong type')

    this.list = list
    this._listdir = -1
  }

  update (list) {
    if (!list || !Array.isArray(list)) throw new TypeError('List has wrong type')

    this.list = list
    this._listdir = 0
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

  scrollTo (x, y) {
    debug('Maybe manual scroll to', x, y)
    this._scrollable.scrollTo && this._scrollable.scrollTo(x, y)
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

  _handleSeekBefore () {
    if (!(Array.isArray(this.list) && this.list.length)) return
    const {
      offset, id: last_id, timestamp,
    } = this.list[0]

    this.dispatchEvent(new CustomEvent('chat-messages-seek-before', {
      detail: {
        before: Math.ceil(timestamp),
        last_id,
        offset,
      },
    }))
  }

  _handleSeekAfter () {
    if (!(Array.isArray(this.list) && this.list.length)) return
    const {
      offset, id: last_id, timestamp,
    } = this.list[this.list.length - 1]

    this.dispatchEvent(new CustomEvent('chat-messages-seek-after', {
      detail: {
        after: Math.round(timestamp),
        last_id,
        offset,
      },
    }))
  }

  _render (props) {
    const input = props.noinput
      ? undefined
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
      ? props.list.findIndex(_ => _.id === props.lastseen)
      : undefined
    // eslint-disable-next-line max-len
    const newMessageCount = props.list && props.lastseen !== undefined && lastSeenIndex !== undefined
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

    /**
     *  Scrollable & messages are ment to work together
     */
    return (html`
      <div class='wrapper'>
        <wc-chat-scrollable
          delay='${props.delayupdate}'
          i18n='${scrollableI18n}'
          freeze='${props.scrollabledisabled}'
          listen='${EVENT}'
          omni='${props.omni}'
          on-last-seen-change='${this.boundedLastSeenChange}'
          on-seek-before='${this.boundedSeekBefore}'
          on-seek-after='${this.boundedSeekAfter}'
          reverse='${props.reverse}'
          showbannernew='${newMessageCount > 0}'
          unseenSelector='.message.unseen'
        >
          <wc-chat-messages
            actions='${this.actions}'
            i18n='${messagesI18n}'
            invoke='${EVENT}'
            lastseen='${props.lastseen}'
            list='${list}'
            listdir='${this._listdir}'
            on-message-delete='${this.boundedMessageDelete}'
            on-message-reaction='${this.boundedMessageReaction}'
            on-user-disable='${this.boundedUserDisable}'
            parser='${this.parser}'
            parserpreset='${this.parserpreset}'
            parserrules='${this.parserrules}'
            reactions='${this.reactions}'
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
