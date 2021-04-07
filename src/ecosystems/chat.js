import { LitElement, html } from 'lit-element';

import { debug as Debug } from '../utils/index.js';
import { withStyle } from '../mixins/with-style.js';

import { style } from './chat.css.js';

const debug = Debug('@ulms/wc-chat/ChatElement');
const EVENT = 'did-update';

export class _ChatElement extends LitElement {
  static get properties() {
    return {
      actions: { type: Array },
      aggregateperinterval: String,
      connectedeventname: String,
      delayrender: { type: Number },
      delayresize: { type: Number },
      delayscroll: { type: Number },
      delaysubmit: { type: Number },
      delayupdate: { type: Number },
      disabled: { type: Boolean },
      language: String,
      lastseen: String,
      list: { type: Array },
      maxlength: { type: Number },
      maxrows: { type: Number },
      message: String,
      noinput: { type: Boolean },
      omni: { type: Boolean },
      pagesize: String,
      parser: String,
      parserengine: { type: Object },
      parserpreset: String,
      parserrules: String,
      placeholder: String,
      placeholderdisabled: String,
      preprocessors: String,
      ratelimit: { type: Number },
      reactions: { type: Array },
      scrollabledisabled: { type: Boolean },
      user: String,
      users: { type: Array },
    };
  }

  // eslint-disable-next-line class-methods-use-this
  get className() {
    return '_ChatElement';
  }

  constructor() {
    super();

    this.delayrender = 1e3;
    this.list = [];
    this.message = '';
    this.parser = '';
    this.parserengine = null;
    this.parserpreset = '';
    this.parserrules = '';
    this.visiblelength = undefined;

    this._scrollable = undefined;

    this.__timer = null;
    this.__timerId = null;
    this.__forceUpdate = false;
  }

  attributeChangedCallback(name, old, value) {
    super.attributeChangedCallback(name, old, value);

    if (name === 'ratelimit' && old !== value) {
      this._clearTimerId();

      if (value !== null) {
        this._setTimerId(value);
      }
    }
  }

  firstUpdated() {
    if (this.shadowRoot) this._scrollable = this.shadowRoot.querySelector('wc-chat-scrollable');
  }

  connectedCallback() {
    super.connectedCallback();

    this._setup();

    this.dispatchEvent(
      new CustomEvent(this.connectedeventname || 'chat-connected', {
        bubbles: true,
        cancelable: false,
        composed: true,
      }),
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this._destroy();
  }

  updateList(list, forceUpdate = false) {
    if (!list || !Array.isArray(list)) throw new TypeError('List has wrong type');

    debug('Update list', list);

    this.__forceUpdate = forceUpdate;

    this._handleListUpdate(list);
  }

  updatePinned(count) {
    this.dispatchEvent(new CustomEvent('chat-pinned-update', { detail: { count } }));

    const prevQuantity = this.quantity;

    if (prevQuantity !== count) {
      this.quantity = count;
      this.requestUpdate('quantity', prevQuantity);
    }
  }

  scrollTo(x, y) {
    debug('Maybe manual scroll to', x, y);
    // eslint-disable-next-line no-unused-expressions
    this._scrollable.scrollTo && this._scrollable.scrollTo(x, y);
  }

  scrollToEnd(x, y) {
    debug('Maybe manual scroll to end', x, y);
    // eslint-disable-next-line no-unused-expressions
    this._scrollable.scrollTo && this._scrollable.scrollTo(x, y);
  }

  _clearTimerId() {
    if (this.__timerId) {
      clearInterval(this.__timerId);

      this.__timerId = null;
      this.__timer = null;
    }
  }

  _destroy() {
    this._handleSubmit = undefined;
    this._handleDelete = undefined;
    this._handleUserDisable = undefined;
    this._handleMessageReaction = undefined;
    this._handleLastSeenChange = undefined;
    this._handleSeekBefore = undefined;
    this._handleSeekAfter = undefined;
    this._handleMessagePin = undefined;
    this._handleMessageReachedBefore = undefined;
    this._handleMessageUnpin = undefined;
    this._handleViewportChange = undefined;
  }

  _setTimerId(value) {
    this.__timer = value;

    this.__timerId = setInterval(() => {
      this.__timer -= 1;

      if (this.__timer === 0) {
        clearInterval(this.__timerId);

        this.__timerId = null;
        this.__timer = null;
      }

      this.requestUpdate();
    }, 1000);

    this.requestUpdate();
  }

  _setup() {
    this._handleDelete = this._handleDelete.bind(this);
    this._handleLastSeenChange = this._handleLastSeenChange.bind(this);
    this._handleListUpdate = this._handleListUpdate.bind(this);
    this._handleMessageReaction = this._handleMessageReaction.bind(this);
    this._handleSeekAfter = this._handleSeekAfter.bind(this);
    this._handleSeekBefore = this._handleSeekBefore.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleUserDisable = this._handleUserDisable.bind(this);
    this._handleMessagePin = this.__handleMessagePin.bind(this);
    this._handleReachedBefore = this._handleReachedBefore.bind(this);
    this._handleMessageUnpin = this._handleMessageUnpin.bind(this);
    this._handleViewportChange = this._handleViewportChange.bind(this);
  }

  _handleListUpdate(list) {
    const prevList = this.list;

    this.list = list;

    const latest = list[list.length - 1];

    if (latest && this.lastseen === latest.id) {
      this._changeLastseen(latest.id);
    }

    this.requestUpdate('list', prevList);
  }

  _handleSubmit(e) {
    if (this.ratelimit) {
      this._clearTimerId();
      this._setTimerId(this.ratelimit);
    }

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
    if (!this.list) return;

    const latest = this.list[this.list.length - 1];

    if (latest && this.lastseen !== latest.id) {
      const { id } = latest;

      this._changeLastseen(id);
      this.dispatchEvent(new CustomEvent('chat-last-seen-change', { detail: { id } }));
    }
  }

  _handleViewportChange(e) {
    const {
      detail: { length },
    } = e;

    this.visiblelength = length;
  }

  _handleSeekBefore() {
    if (!(Array.isArray(this.list) && this.list.length)) return;

    const { id: last_id, occurred_at, offset, original_occurred_at, timestamp } = this.list[0];

    this.dispatchEvent(
      new CustomEvent('chat-messages-seek-before', {
        detail: {
          before: Math.ceil(timestamp),
          last_id,
          occurred_at,
          offset,
          original_occurred_at,
        },
      }),
    );
  }

  _handleSeekAfter() {
    if (!(Array.isArray(this.list) && this.list.length)) return;

    const list = this.list[this.list.length - 1];
    const { id: last_id, occurred_at, offset, original_occurred_at, timestamp } = list;

    this.dispatchEvent(
      new CustomEvent('chat-messages-seek-after', {
        detail: {
          after: Math.round(timestamp),
          last_id,
          occurred_at,
          offset,
          original_occurred_at,
        },
      }),
    );
  }

  __handleMessagePin(e) {
    const {
      detail: { id },
    } = e;

    this.dispatchEvent(new CustomEvent('chat-message-pin', { detail: { id } }));
  }

  _handleMessageUnpin(e) {
    const {
      detail: { id },
    } = e;

    this.dispatchEvent(new CustomEvent('chat-message-unpin', { detail: { id } }));
  }

  _handleReachedBefore(e) {
    const {
      detail: { id },
    } = e;

    this.dispatchEvent(new CustomEvent('chat-message-reached-before', { detail: { id } }));
  }

  _changeLastseen(nextseen) {
    this.lastseen = nextseen;
  }

  update(changedProperties) {
    super.update(changedProperties);

    this.updateComplete
      .then(result => {
        if (this.__forceUpdate) this.__forceUpdate = false;

        return result;
      })
      .catch(console.error); // eslint-disable-line no-console
  }

  render() {
    const {
      actions,
      aggregateperinterval,
      delayresize,
      delayscroll,
      delaysubmit,
      delayupdate,
      disabled,
      lastseen,
      list,
      maxlength,
      maxrows,
      message,
      noinput,
      omni,
      pagesize = 15,
      parser,
      parserpreset,
      parserrules,
      placeholder,
      placeholderdisabled,
      preprocessors,
      reactions,
      scrollabledisabled,
      user,
      users,
    } = this;

    const shouldForceUpdate = this.__forceUpdate;

    const filtersWereActive = this.__filtersWereActive;

    this.__filtersWereActive = false;

    return html`
      <div class="wrapper">
        <wc-chat-scrollable
          ?freeze=${scrollabledisabled}
          ?omni=${omni}
          .delay=${delayupdate}
          .delayresize=${delayresize}
          .delayscroll=${delayscroll}
          @last-seen-change=${this._handleLastSeenChange}
          @seek-after=${this._handleSeekAfter}
          @seek-before=${this._handleSeekBefore}
          listen=${EVENT}
          unseenSelector=".message.unseen"
        >
          <wc-chat-messages
            .actions=${actions}
            .aggregateperinterval=${aggregateperinterval}
            .disablevl=${filtersWereActive}
            .forceUpdate=${shouldForceUpdate}
            .list=${list}
            .parserengine=${this.parserengine}
            .reactions=${reactions}
            .users=${users}
            @message-delete=${this._handleDelete}
            @message-pin=${this._handleMessagePin}
            @message-reaction=${this._handleMessageReaction}
            @message-unpin=${this._handleMessageUnpin}
            @reached-before=${this._handleReachedBefore}
            @user-disable=${this._handleUserDisable}
            @viewport-list-change=${this._handleViewportChange}
            invoke=${EVENT}
            lastseen=${lastseen}
            pagesize=${pagesize}
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
                  .delay=${delaysubmit || 0}
                  .maxlength=${maxlength}
                  .maxrows=${maxrows || 10}
                  @message-submit=${this._handleSubmit}
                  placeholder=${placeholder}
                  placeholderdisabled=${placeholderdisabled}
                  preprocessors=${preprocessors}
                  timer=${this.__timer}
                  value=${message}
                />
              </div>
            `}
      </div>
    `;
  }
}

export const ChatElement = withStyle()(_ChatElement, style);
