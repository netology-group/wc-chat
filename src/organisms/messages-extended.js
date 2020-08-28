import { html } from 'lit-element';
import cs from 'classnames-es';

import { withStyle } from '../mixins/with-style.js';
import { Actions as actionsFactory } from '../molecules/actions.js';
import { debug as Debug, isAggregatedBy, isAggregatedByDate } from '../utils/index.js';
import { actionImages } from '../atoms/action.js';
import { maybeSeparator } from '../atoms/separator.js';
import { style as actionsStyle } from '../molecules/actions.css.js';
import { style as separatorStyle } from '../atoms/separator.css.js';
import { RichMessageFactory } from '../domain/rich-message-factory.js';

import { MessagesElement } from './messages.js';
import { wasAtHeadSym } from './scrollable.js';
import { style } from './messages.css.js';
import { style as styleExt } from './messages-extended.css.js';

const debug = Debug('@ulms/wc-chat/XMessagesElement');

const showPosHelpers = element =>
  element && typeof element[wasAtHeadSym] !== 'undefined' && !element[wasAtHeadSym];

const actionsSym = Symbol('actions');
const reactionsSym = Symbol('reactions');

export class _XMessagesElement extends MessagesElement {
  static get properties() {
    return {
      ...super.properties,
      actions: { type: Array },
      i18n: { type: Object },
      lastseen: String,
      reactions: { type: Array },
    };
  }

  get _actions() {
    return this[actionsSym];
  }

  set _actions(_) {
    this[actionsSym] = new Map(Array.isArray(_) ? _ : []);
  }

  get _reactions() {
    return this[reactionsSym];
  }

  set _reactions(_) {
    this[reactionsSym] = new Map(Array.isArray(_) ? _ : []);
  }

  constructor() {
    super();

    this.i18n = {};

    this[actionsSym] = new Map();
    this[reactionsSym] = new Map();
  }

  firstUpdated() {
    const { actions = [], reactions = [] } = this;

    this._actions = actions;
    this._reactions = reactions;

    // eslint-disable-next-line no-unused-expressions
    Array.isArray(reactions) &&
      reactions.forEach(it => {
        this[reactionsSym].set(it[0], { name: `:${it[0]}:`, count: it[1] || 0 });
      });
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this[actionsSym] = undefined;
    this[reactionsSym] = undefined;
  }

  render() {
    return super.render();
  }

  __initFactory() {
    this._factory = new RichMessageFactory({
      parserengine: this.parserengine,
      parser: this.parser,
      parserpreset: this.parserpreset,
      parserrules: this.parserrules,
    });
  }

  __outputTplAccordingParentPosition() {
    return showPosHelpers(this.parentElement);
  }

  __renderMessages(list) {
    const { lastseen: ls, user } = this;
    let lastseen;

    const nextList = list.map(a => {
      let is_lastseen = false;

      if (lastseen && String(a.user_id) !== user) {
        is_lastseen = true;
        lastseen = false;
      }

      if (typeof lastseen === 'undefined' && a.id === ls) lastseen = a.id;

      return {
        ...a,
        lastseen: is_lastseen,
      };
    });

    return super.__renderMessages(nextList);
  }

  __renderEach(it, i, arr) {
    return this.__renderMessage(this.__hydrateEach(it, i, arr));
  }

  __hydrateEach(it, index, list) {
    const { user, aggregateperinterval } = this;
    const {
      avatar,
      body, // .body should be depracated later on
      classname,
      deleted,
      icon,
      id,
      identity,
      invisible,
      lastseen,
      rating,
      text,
      theme,
      timestamp,
      user_id,
      user_name,
      visible,
    } = it;

    const { body: messageText, unsafe } = this._factory.make({ body: body || text });

    return {
      aggregated:
        isAggregatedBy('user_id', index, list) &&
        isAggregatedByDate(
          'timestamp',
          index,
          list,
          aggregateperinterval ? Number(aggregateperinterval) : undefined,
        ),
      avatar,
      classname,
      deleted,
      icon,
      id,
      identity,
      me: user === String(user_id),
      invisible,
      is_lastseen: lastseen,
      rating,
      text: messageText,
      theme,
      timestamp,
      unsafe,
      user_icon: icon,
      user_id,
      user_name,
      visible,
    };
  }

  __renderMessage(message) {
    // eslint-disable-line class-methods-use-this
    const {
      aggregated,
      avatar,
      classname,
      me,
      deleted,
      icon,
      id,
      identity,
      invisible,
      is_lastseen,
      rating,
      text,
      theme,
      timestamp,
      unsafe,
      user_name,
    } = message;

    const className = cs({
      [classname]: classname,
      aggregated,
      message: true,
      unseen: is_lastseen,
    });

    if (invisible) return undefined;
    // skip unless visible

    return html`
      <wc-chat-message
        ?deleted=${deleted}
        ?me=${me}
        .aggregated=${aggregated}
        .identity=${identity}
        .parser=${this.parser}
        .unsafe=${unsafe}
        class=${className}
        icon=${icon || ''}
        image=${avatar}
        text=${text}
        theme=${theme || ''}
        timestamp=${timestamp}
        uid=${id}
        username=${user_name}
      >
        ${maybeSeparator({
          id,
          text: this.i18n.NEW_MESSAGES,
          enabled: is_lastseen && this.__outputTplAccordingParentPosition(), // show chunks according the parentElement
        })}
        <div slot="message-prologue">
          ${this.__renderActions(message)}
        </div>
        <div slot="message-epilogue">
          ${this.__renderReactions({ rating, text })}
        </div>
      </wc-chat-message>
    `;
  }

  __renderActions(data) {
    const actions = new Map();
    const reactions = new Map();

    this._actions = this.actions;

    const isAllowed4Other = (a, b) =>
      // eslint-disable-next-line no-bitwise,max-len
      !b.me && Boolean(a & 1);
    const isAllowed4Group = (a, b) =>
      // eslint-disable-next-line no-bitwise,max-len
      !b.me && Boolean(a & 10);
    const isAllowed4Self = (a, b) =>
      // eslint-disable-next-line no-bitwise,max-len
      b.me && Boolean(a & 100);

    const isAllowed = (a, b) =>
      isAllowed4Other(a, b) || isAllowed4Group(a, b) || isAllowed4Self(a, b);

    // eslint-disable-next-line no-unused-expressions
    Array.isArray(this.actions) &&
      this.actions.forEach(_ => {
        const key = _[0];
        const _action =
          key && this._actions && this._actions.has(key) ? this._actions.get(key) || 0 : 0;

        if (!isAllowed(_action, data)) {
          debug('Action is not allowed');

          return;
        }

        const actionOpts = {
          message: data,
          children: actionImages.get(key),
          handler: (e, detail) => {
            this.dispatchEvent(new CustomEvent(key, { detail }));
          },
        };

        if (key === 'message-reaction') {
          reactions.set(key, actionOpts);
        } else {
          actions.set(key, actionOpts);
        }
      });

    return actionsFactory({ actions, reactions });
  }

  // eslint-disable-next-line class-methods-use-this
  __renderReactions(opts) {
    const { rating } = opts;
    let config;

    if (typeof rating === 'number') {
      config = new Map([['thumbsup', { name: ':thumbsup:', count: rating }]]);
    } else if (Array.isArray(rating)) {
      config = new Map([]);
      rating.forEach(it => {
        config.set(it[0], { name: `:${it[0]}:`, count: it[1] || 0 });
      });
    } else if (opts.rating !== undefined) {
      throw new TypeError('Wrong rating type');
    }

    return !config
      ? undefined
      : html`
          <wc-chat-reactions ?showcount=${true} .config=${config} />
        `;
  }
}

export const XMessagesElement = withStyle()(
  _XMessagesElement,
  style,
  separatorStyle,
  actionsStyle,
  styleExt,
);
