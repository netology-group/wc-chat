import { LitElement, html } from 'lit-element';

import { debug as Debug } from '../utils/index.js';
import { style } from './chat.css.js';
import { withStyle } from '../mixins/with-style.js';

const EVENT = 'did-update';
const debug = Debug('@netology-group/wc-chat/ChatElement');

export class _ChatElement extends LitElement {
  static get properties() {
    return {
      actions: { type: Array },
      delaysubmit: { type: Number },
      delayupdate: { type: Number },
      delayresize: { type: Number },
      delayscroll: { type: Number },
      disabled: { type: Boolean },
      language: String,
      lastseen: String,
      list: { type: Array },
      maxlength: { type: Number },
      maxrows: { type: Number },
      message: String,
      noinput: { type: Boolean },
      omni: { type: Boolean },
      placeholder: String,
      placeholderdisabled: String,
      reactions: { type: Array },
      scrollabledisabled: { type: Boolean },
      user: { type: Number },
      users: { type: Array },
    };
  }

  constructor() {
    super();

    this.list = [];
    this.message = '';

    this._handleSubmitBounded = this._handleSubmit.bind(this);
    this._handleDeleteBounded = this._handleDelete.bind(this);
    this._handleUserDisableBounded = this._handleUserDisable.bind(this);
    this._handleMessageReactionBounded = this._handleMessageReaction.bind(this);
    this._handleLastSeenChangeBounded = this._handleLastSeenChange.bind(this);
    this._handleSeekBeforeBounded = this._handleSeekBefore.bind(this);
    this._handleSeekAfterBounded = this._handleSeekAfter.bind(this);
    this._scrollable = undefined;
    this._listdir = 0;
  }

  firstUpdated() {
    if (this.shadowRoot) this._scrollable = this.shadowRoot.querySelector('wc-chat-scrollable');
  }

  connectedCallback() {
    super.connectedCallback();
    this.dispatchEvent(new Event('connected'));
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this._handleSubmitBounded = undefined;
    this._handleDeleteBounded = undefined;
    this._handleUserDisableBounded = undefined;
    this._handleMessageReactionBounded = undefined;
    this._handleLastSeenChangeBounded = undefined;
    this._handleSeekBeforeBounded = undefined;
    this._handleSeekAfterBounded = undefined;
  }

  appendList(list) {
    if (!list || !Array.isArray(list)) throw new TypeError('List has wrong type');

    this.list = list;
    this._listdir = 1;
  }

  prependList(list) {
    if (!list || !Array.isArray(list)) throw new TypeError('List has wrong type');

    this.list = list;
    this._listdir = -1;
  }

  updateList(list) {
    if (!list || !Array.isArray(list)) throw new TypeError('List has wrong type');

    this.list = list;
    this._listdir = 0;
  }

  scrollTo(x, y) {
    debug('Maybe manual scroll to', x, y);
    // eslint-disable-next-line no-unused-expressions
    this._scrollable.scrollTo && this._scrollable.scrollTo(x, y);
  }

  _handleSubmit(e) {
    this.dispatchEvent(new CustomEvent('chat-message-submit', { detail: e.detail }));
  }

  _handleDelete(e) {
    this.dispatchEvent(new CustomEvent('chat-message-delete', { detail: e.detail }));
  }

  _handleUserDisable(e) {
    this.dispatchEvent(new CustomEvent('chat-user-disable', { detail: e.detail }));
  }

  _handleMessageReaction(e) {
    this.dispatchEvent(new CustomEvent('chat-message-reaction', { detail: e.detail }));
  }

  _handleLastSeenChange() {
    if (
      this.list &&
      this.list.length > 0 &&
      this.lastseen !== undefined &&
      this.lastseen !== this.list[this.list.length - 1].id
    ) {
      this.dispatchEvent(
        new CustomEvent('chat-last-seen-change', { detail: this.list[this.list.length - 1].id }),
      );
    }
  }

  _handleSeekBefore() {
    if (!(Array.isArray(this.list) && this.list.length)) return;
    const { offset, id: last_id, timestamp } = this.list[0];

    this.dispatchEvent(
      new CustomEvent('chat-messages-seek-before', {
        detail: {
          before: Math.ceil(timestamp),
          last_id,
          offset,
        },
      }),
    );
  }

  _handleSeekAfter() {
    if (!(Array.isArray(this.list) && this.list.length)) return;
    const { offset, id: last_id, timestamp } = this.list[this.list.length - 1];

    this.dispatchEvent(
      new CustomEvent('chat-messages-seek-after', {
        detail: {
          after: Math.round(timestamp),
          last_id,
          offset,
        },
      }),
    );
  }

  render() {
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
      placeholder,
      placeholderdisabled,
      reactions,
      scrollabledisabled,
      user,
      users,
    } = this;

    return html`
      <div class="wrapper">
        <wc-chat-scrollable
          ?freeze=${scrollabledisabled}
          ?omni=${omni}
          .delay=${delayupdate}
          .delayresize=${delayresize}
          .delayscroll=${delayscroll}
          @last-seen-change=${this._handleLastSeenChangeBounded}
          @seek-after=${this._handleSeekAfterBounded}
          @seek-before=${this._handleSeekBeforeBounded}
          listen=${EVENT}
          unseenSelector=".message.unseen"
        >
          <wc-chat-messages
            .actions=${actions}
            .list=${list}
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
        ${noinput
          ? undefined
          : html`
              <div class="input">
                <wc-chat-input
                  .delay=${delaysubmit || 0}
                  .maxlength=${maxlength}
                  .maxrows=${maxrows || 10}
                  @message-submit=${this._handleSubmitBounded}
                  disabled=${disabled}
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

export const ChatElement = withStyle()(_ChatElement, style);
