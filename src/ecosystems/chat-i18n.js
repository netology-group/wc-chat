import { html } from 'lit-element'

import { _ChatElement } from './chat.js'
import { style } from './chat.css.js'
import { withStyle } from '../mixins/with-style.js'
import i18n from '../i18n.js'

const EVENT = 'did-update'

export class _ChatI18NElement extends _ChatElement {
  static get properties () {
    return {
      actions: Array,
      delaysubmit: Number,
      delayupdate: Number,
      delayresize: Number,
      delayscroll: Number,
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
      scrollabledisabled: Boolean,
      user: Number,
      users: Array,
    }
  }

  get i18n () { // eslint-disable-line class-methods-use-this
    return i18n
  }

  constructor () {
    super()

    this._lang = this._resolveLanguage(this.language)

    // eslint-disable-next-line max-len
    this._strNewMessages = new globalThis.IntlMessageFormat(this.i18n[this._lang].NEW_MESSAGES_COUNT, this._lang)
  }

  _resolveLanguage (language) {
    // eslint-disable-next-line max-len
    let resolvedLanguage = language || globalThis.IntlMessageFormat.prototype._resolveLocale(navigator.language)

    if (!this.i18n[resolvedLanguage]) {
      resolvedLanguage = 'en-US'
    }

    return resolvedLanguage
  }

  render () {
    const {
      actions,
      delayresize,
      delayscroll,
      delaysubmit,
      delayupdate,
      disabled,
      lastseen,
      list = [],
      maxlength,
      maxrows,
      message = '',
      noinput,
      omni,
      parser,
      parserpreset,
      parserrules,
      placeholder,
      placeholderdisabled,
      reactions,
      scrollabledisabled,
      user,
      users,
    } = this

    const lastSeenIndex = list && lastseen !== undefined
      ? list.findIndex(_ => _.id === lastseen)
      : undefined
    // eslint-disable-next-line max-len
    const newMessageCount = list && lastseen !== undefined && lastSeenIndex !== undefined
      ? list.length - 1 - lastSeenIndex
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
          .delay=${delayupdate}
          .delayresize=${delayresize}
          .delayscroll=${delayscroll}
          .freeze=${scrollabledisabled}
          .i18n=${scrollableI18n}
          .omni=${omni}
          .showbannernew=${newMessageCount > 0}
          @last-seen-change=${this._handleLastSeenChangeBounded}
          @seek-after=${this._handleSeekAfterBounded}
          @seek-before=${this._handleSeekBeforeBounded}
          listen=${EVENT}
          unseenSelector='.message.unseen'
        >
          <wc-chat-messages
            .actions=${actions}
            .i18n=${messagesI18n}
            .list=${list}
            .parser=${parser}
            .parserpreset=${parserpreset}
            .parserrules=${parserrules}
            .reactions=${reactions}
            .users=${users}
            @message-delete=${this._handleDeleteBounded}
            @message-reaction=${this._handleMessageReactionBounded}
            @user-disable=${this._handleUserDisableBounded}
            invoke=${EVENT}
            lastseen=${lastseen}
            listdir=${this._listdir}
            user=${user}
          />
        </wc-chat-scrollable>
        ${noinput ? undefined : (html`
          <div class='input'>
            <wc-chat-input
              .delay=${delaysubmit || 0}
              .disabled=${disabled}
              .maxlength=${maxlength}
              .maxrows=${maxrows || 10}
              @message-submit=${this._handleSubmitBounded}
              placeholder=${placeholder}
              placeholderdisabled=${placeholderdisabled}
              value=${message}
            />
          </div>
        `)}
      </div>
    `)
  }
}

export const ChatI18NElement = withStyle(html)(_ChatI18NElement, style)
