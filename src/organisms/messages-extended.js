import { html } from 'lit-element';
import cs from 'classnames-es';

import { withStyle } from '../mixins/with-style.js';
import { Actions as actionsFactory } from '../molecules/actions.js';
import { isAggregatedBy, isLastseen, debug as Debug } from '../utils/index.js';
import { actionImages } from '../atoms/action.js';
import { maybeSeparator } from '../atoms/separator.js';
import { MessagesElement } from './messages.js';
import { wasAtHeadSym } from './scrollable.js';

import { style } from './messages.css.js';
import { style as actionsStyle } from '../molecules/actions.css.js';
import { style as styleExt } from './messages-extended.css.js';
import { style as separatorStyle } from '../atoms/separator.css.js';

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
      lastseen: { type: Number },
      parser: String,
      parserengine: { type: Object },
      parserpreset: String,
      parserrules: String,
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

  get __prsrengine() {
    return this.parserengine;
  }

  constructor() {
    super();

    this.i18n = {};

    this[actionsSym] = new Map();
    this[reactionsSym] = new Map();
  }

  firstUpdated() {
    const { actions = [], reactions = [], parserengine, parser } = this;

    this._actions = actions;
    this._reactions = reactions;

    if (parser && !parserengine) debug('Can not use parser');

    // eslint-disable-next-line no-unused-expressions
    Array.isArray(reactions) &&
      reactions.forEach(it => {
        this[reactionsSym].set(it[0], { name: `:${it[0]}:`, count: it[1] || 0 });
      });
  }

  disconnectedCallback() {
    this[actionsSym] = undefined;
    this[reactionsSym] = undefined;
  }

  render() {
    return super.render();
  }

  __outputTplAccordingParentPosition() {
    return showPosHelpers(this.parentElement);
  }

  __renderEach(it, i, arr) {
    return this.__renderMessage(this.__hydrateEach(it, i, arr));
  }

  __hydrateEach(it, index, list) {
    const { lastseen, user } = this;
    const {
      avatar,
      body, // .body should be depracated later on
      classname,
      deleted,
      icon,
      id,
      identity,
      invisible,
      rating,
      text,
      theme,
      timestamp,
      user_id,
      user_name,
      visible,
    } = it;

    return {
      aggregated: isAggregatedBy('user_id', index, list),
      avatar,
      classname,
      current_user_id: user,
      deleted,
      icon,
      id,
      identity,
      me: user === user_id,
      invisible,
      is_lastseen: isLastseen({ index, lastseen, list }),
      rating,
      text: body || text,
      theme,
      timestamp,
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
        .parserpreset=${this.parserpreset}
        .parserrules=${this.parserrules}
        .parserengine=${this.parserengine}
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
          enabled: is_lastseen && !me && this.__outputTplAccordingParentPosition(), // show chunks according the parentElement
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

    const isAllowed4Other = (a, b) =>
      // eslint-disable-next-line no-bitwise,max-len
      b.current_user_id && b.user_id && b.current_user_id !== b.user_id && Boolean(a & 1);
    const isAllowed4Group = (a, b) =>
      // eslint-disable-next-line no-bitwise,max-len
      b.current_user_id && b.user_id && b.current_user_id !== b.user_id && Boolean(a & 10);
    const isAllowed4Self = (a, b) =>
      // eslint-disable-next-line no-bitwise,max-len
      b.current_user_id && b.user_id && b.current_user_id === b.user_id && Boolean(a & 100);

    const isAllowed = (a, b) =>
      isAllowed4Other(a, b) || isAllowed4Group(a, b) || isAllowed4Self(a, b);

    // eslint-disable-next-line no-unused-expressions
    Array.isArray(this.actions) &&
      this.actions.forEach(_ => {
        const key = _[0];
        const _action = this._actions.get(key) || {};

        if (!isAllowed(_action, data)) {
          debug('Action is not alllowed');

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
          <wc-chat-reactions ?showcount="showcount" .config=${config} />
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
