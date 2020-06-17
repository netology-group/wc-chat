import { html } from 'lit-element';

import { withStyle } from '../mixins/with-style.js';
import i18n from '../i18n.js';

import { _ChatElement } from './chat.js';
import { style } from './chat.css.js';

const EVENT = 'did-update';

const i18nSym = Symbol('i18nengine');
const parserSym = Symbol('parsearengine');

const format = (Engine, i = {}, o = {}) => {
  if (!Engine) return i.message;

  const lexem = new Engine(i.message, i.language);

  return lexem && lexem.format ? lexem.format(o) : i.message;
};

export class _ChatI18NElement extends _ChatElement {
  static get properties() {
    return {
      connectedeventname: String,
      actions: { type: Array },
      delayrender: { type: Number },
      delayresize: { type: { type: Number } },
      delayscroll: { type: Number },
      delaysubmit: { type: Number },
      delayupdate: { type: Number },
      disabled: { type: Boolean },
      disablerecentbanner: { type: Number },
      disableunseenbanner: { type: Number },
      i18nengine: Function,
      language: String,
      lastseen: String,
      list: { type: Array },
      maxlength: { type: Number },
      maxrows: { type: Number },
      message: String,
      noinput: { type: Boolean },
      omni: { type: Boolean },
      parser: String,
      parserengine: { type: Object },
      parserpreset: String,
      parserrules: String,
      placeholder: String,
      placeholderdisabled: String,
      reactions: { type: Array },
      scrollabledisabled: { type: Boolean },
      user: String,
      users: { type: Array },
    };
  }

  constructor() {
    super();

    this.delaysubmit = 0;
    this.list = [];
    this.message = '';
    this.parser = '';
    this.parserpreset = '';
    this.parserrules = '';
  }

  // eslint-disable-next-line class-methods-use-this
  get i18n() {
    return i18n;
  }

  set ParserEngine(e) {
    this[parserSym] = e;
  }

  get ParserEngine() {
    return this[parserSym] || this.parserengine;
  }

  set I18nEngine(e) {
    this[i18nSym] = e;
  }

  get I18nEngine() {
    return this[i18nSym] || this.i18nengine;
  }

  _resolveLanguage(language) {
    let resolvedLanguage =
      !language &&
      this.I18nEngine &&
      this.I18nEngine.prototope &&
      this.I18nEngine.prototope._resolveLocale
        ? this.I18nEngine.prototype._resolveLocale(navigator.language)
        : language;

    if (!this.i18n[resolvedLanguage]) {
      resolvedLanguage = 'en-US';
    }

    return resolvedLanguage;
  }

  render() {
    const {
      actions,
      delayresize,
      delayscroll,
      delaysubmit,
      delayupdate,
      disabled,
      disablerecentbanner,
      disableunseenbanner,
      language,
      lastseen,
      list,
      maxlength,
      maxrows,
      message,
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
    } = this;

    const currentLanguage = this._resolveLanguage(language);

    const { GO_TO_RECENT_MESSAGE, NEW_MESSAGES_COUNT, NEW_MESSAGES, SEE } =
      this.i18n[currentLanguage] || {};

    const lastSeenIndex =
      list && lastseen !== undefined ? list.findIndex(_ => _.id === lastseen) : undefined;
    // eslint-disable-next-line max-len
    const newMessageCount =
      list && lastseen !== undefined && lastSeenIndex !== undefined
        ? list.slice(lastSeenIndex + 1).filter(a => String(a.user_id) !== user).length
        : 0;

    const scrollableI18n = {
      GO_TO_RECENT_MESSAGE,
      NEW_MESSAGES_COUNT: format(
        this.I18nEngine,
        {
          message: NEW_MESSAGES_COUNT,
          language: currentLanguage,
        },
        { count: newMessageCount },
      ),
      SEE,
    };

    const messagesI18n = { NEW_MESSAGES };

    /**
     *  Scrollable & messages are ment to work together
     */
    return html`
      <div class="wrapper">
        <wc-chat-scrollable
          ?disablerecentbanner=${Boolean(Number(disablerecentbanner))}
          ?disableunseenbanner=${Boolean(Number(disableunseenbanner))}
          ?freeze=${scrollabledisabled}
          ?omni=${omni}
          ?showbannernew=${newMessageCount > 0}
          .delay=${delayupdate}
          .delayresize=${delayresize}
          .delayscroll=${delayscroll}
          .i18n=${scrollableI18n}
          @last-seen-change=${this._handleLastSeenChangeBounded}
          @seek-after=${this._handleSeekAfterBounded}
          @seek-before=${this._handleSeekBeforeBounded}
          listen=${EVENT}
          unseenSelector=".message.unseen"
        >
          <wc-chat-messages
            .actions=${actions}
            .i18n=${messagesI18n}
            .list=${list}
            .parserengine=${this.ParserEngine}
            .reactions=${reactions}
            .users=${users}
            @message-delete=${this._handleDeleteBounded}
            @message-reaction=${this._handleMessageReactionBounded}
            @user-disable=${this._handleUserDisableBounded}
            invoke=${EVENT}
            lastseen=${lastseen}
            listdir=${this._listdir}
            parser=${parser}
            parserrules=${parserrules}
            parserpreset=${parserpreset}
            user=${user}
          />
        </wc-chat-scrollable>
        ${noinput
          ? undefined
          : html`
              <div class="input">
                <wc-chat-input
                  ?disabled=${disabled}
                  .delay=${delaysubmit}
                  .maxlength=${maxlength}
                  .maxrows=${maxrows}
                  @message-submit=${this._handleSubmitBounded}
                  placeholder=${placeholder}
                  placeholderdisabled=${placeholderdisabled}
                  value=${message}
                />
              </div>
            `}
      </div>
    `;
  }
}

export const ChatI18NElement = withStyle()(_ChatI18NElement, style);
