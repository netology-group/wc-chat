import compose from 'ramda/es/compose.js';
import cs from 'classnames-es';
import { fromEvent } from 'most/src/source/fromEvent.js';
import { LitElement, html } from 'lit-element';

import { debug as Debug, isAggregatedBy, isAggregatedByDate } from '../utils/index.js';
import { MessageFactory } from '../domain/message-factory.js';
import { observeC as observe, debounceC as debounce } from '../utils/most.js';
import { style as actionStyle } from '../molecules/actions.css.js';
import { withStyle } from '../mixins/with-style.js';

import { style } from './messages.css.js';

const debug = Debug('@ulms/wc-chat/MessagesElement');

const relativeShiftTop = (anc, desc) => {
  const { top: ancTop } = anc.getBoundingClientRect();
  const { top: descTop } = desc.getBoundingClientRect();

  return ancTop - descTop;
};

class VirtualList {
  constructor({ size = 24, accessEl }) {
    this.__data = [];
    this.__list = [];
    this.__activeIds = [];
    this.__size = size;
    this.__accessElFn =
      accessEl ||
      function acEl(a) {
        return a.id;
      };
    this.__updateFn = undefined;

    /* computed */
    this.__onEdge = true;
    this.__isLatestReached = true;
    this.__latestReachedElId = undefined;
  }

  set list(a) {
    const latestNextId = a.length && this.__accessElFn(a[a.length - 1]);
    const latestActiveId = this.__activeIds && this.__activeIds.slice(-1)[0];

    this.__data = a;

    // Turn `latestReached` flag off
    if (latestActiveId && latestActiveId !== latestNextId) {
      this.__isLatestReached = false;
      this.__latestReachedElId = undefined;
    }
  }

  get list() {
    const [firstVisibleId] = this.__activeIds;
    const numberRemainsToStart = this.__data.findIndex(
      a => this.__accessElFn(a) === firstVisibleId,
    );

    if (!firstVisibleId) {
      const prevList = this.__list;

      this.__list = this.__data.slice(-1 * this.__size);
      this.__updateFn && this.__updateFn(this.__list, prevList);

      return this.__list;
    }

    const numberAhead = numberRemainsToStart - this.__size;
    const prevList = this.__list;

    const sliceFrom = numberAhead < 0 ? 0 : numberAhead;

    if (this.__latestReachedElId) {
      const latestReachedElIndex = this.__data.findIndex(
        a => this.__accessElFn(a) === this.__latestReachedElId,
      );

      this.__list = this.__data.slice(sliceFrom, latestReachedElIndex + 1);
    } else {
      this.__list = this.__data.slice(sliceFrom);
    }

    this.__updateFn && this.__updateFn(this.__list, prevList);

    return this.__list;
  }

  get forward() {
    return this.__onEdge;
  }

  set size(a) {
    if (!isNaN(a)) {
      this.__size = a;
    } else {
      debug('Can not change size');
    }
  }

  adjust(ids = [], auto = false) {
    const oldIds = this.__activeIds;

    // Toggle `latestReached` flag on if latest id matches the last item
    const latestVisibleId = ids[ids.length - 1];
    const latestExistedEl = this.__data[this.__data.length - 1];

    if (
      latestVisibleId &&
      latestExistedEl &&
      latestVisibleId === this.__accessElFn(latestExistedEl)
    ) {
      this.__isLatestReached = true;
      this.__latestReachedElId = latestVisibleId;
    }

    const currentList = this.list;

    const lastVisibleId = oldIds[oldIds.length - 1];
    const prevVisisbleId = oldIds[oldIds.length - 2];

    const lastExistedEl = currentList[currentList.length - 1];
    const prevExistedEl = currentList[currentList.length - 2];
    // access last and prevous elements at the list as adjust meant to be called multiple times on update when the list is actual

    if (!lastExistedEl || !lastVisibleId || auto) {
      this.__onEdge = true;
    } else if (
      this.__accessElFn(lastExistedEl) === lastVisibleId ||
      this.__accessElFn(prevExistedEl) === lastVisibleId ||
      this.__accessElFn(lastExistedEl) === prevVisisbleId // is needed on element delete from list
    ) {
      this.__onEdge = true;
    } else {
      this.__onEdge = false;
    }

    const cleanupIds = a => {
      const end = a[a.length - 1];

      if (end === 'undefined') {
        a.splice(-1);
      }

      return a;
    };

    this.__activeIds = cleanupIds(ids);
  }

  destroy() {
    this.__data = [];
    this.__updateFn = undefined;
  }

  onUpdate(listener) {
    this.__updateFn = listener;
  }
}

export class _MessagesElement extends LitElement {
  static get properties() {
    return {
      aggregateperinterval: String,
      classname: String,
      invoke: String,
      list: { type: Array },
      visiblelist: { type: Array },
      pagesize: { type: Number },
      parser: String,
      parserengine: { type: Object },
      parserpreset: String,
      parserrules: String,
      user: String,
      users: { type: Array },
    };
  }

  constructor(...argv) {
    super(...argv);

    this.visiblelist = [];

    this.__afterRenderFn = undefined;
    this.__vlist = new VirtualList({ size: this.pagesize });
    this.__vlist.onUpdate(this.__handleVirtualListUpdate.bind(this));
  }

  get _factory() {
    return this.__messageFactory;
  }

  set _factory(a) {
    this.__messageFactory = a;
  }

  get _rootNode() {
    return this.shadowRoot && this.shadowRoot.children.length
      ? this.shadowRoot.children[0]
      : undefined;
  }

  get _parentEl() {
    return this.parentElement;
  }

  __handleVirtualListUpdate(next, prev) {
    if (next.length === prev.length) return;

    const rootHeight = this._rootNode.offsetHeight;
    const outerHeight = this._parentEl.offsetHeight;
    const relativeHeight = relativeShiftTop(this._parentEl, this._rootNode);

    const isEdgeReached = rootHeight <= relativeHeight + outerHeight;

    if (isEdgeReached) requestAnimationFrame(() => this.requestUpdate('visiblelist', next));
    // change visiblelist on reaching the `head` of list
  }

  connectedCallback() {
    super.connectedCallback();

    const seek$ = fromEvent('seek', this.parentElement);
    const seekBefore$ = fromEvent('seek-before', this.parentElement);

    compose(
      observe(() => {
        const activeitems = this.__discoverMessageVisibility();

        if (this.__vlist) {
          this.__vlist.adjust(activeitems);
        } else {
          debug('Can not adjust.List is absent');
        }
      }),
      debounce(50),
    )(seek$);

    compose(
      observe(() => {
        if (this._rootNode) {
          const currentHeight = this._rootNode.offsetHeight;

          // save fn to perform scroll updating to previous position
          this.__afterRenderFn = () => {
            const presentHeight = this._rootNode.offsetHeight;

            this.parentElement.scrollTo2(0, presentHeight - currentHeight);
          };
        }
      }),
    )(seekBefore$);

    this.__initFactory();
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.__vlist = undefined;

    this._factory.destroy();
    this._factory = undefined;
  }

  shouldUpdate(changedProps) {
    if (changedProps.has('parserengine')) this.__initFactory();

    if (changedProps.has('pagesize') && this.__vlist) this.__vlist.size = Number(this.pagesize);
    // update page size from props

    if (changedProps.has('list') && this._rootNode && this.__vlist) {
      if (this.list.length !== this.visiblelist.length) {
        this.__vlist.list = this.list;

        const nextList = this.__vlist.list;

        this.visiblelist = nextList;
      }
    }

    if (changedProps.has('visiblelist') && this._rootNode) {
      this.__tailHeight =
        this._rootNode.offsetHeight - relativeShiftTop(this._parentEl, this._rootNode);
    }

    return true;
  }

  async performUpdate() {
    await new Promise(resolve => requestAnimationFrame(() => resolve()));

    if (this.__vlist) {
      const updatedList = this.__vlist.list; // eslint-disable-line no-unused-vars
      // update virtual list on update
    } else {
      debug('Can not access vlist');
    }

    // this.visiblelist = nextList;
    // NOTE: seems unnecessary. figure out later

    super.performUpdate();
  }

  render() {
    const { list = [] } = this;

    if (!list.length)
      return html`
        <div class="messages"></div>
      `;

    return html`
      <div class="messages">
        <div class="messages-inner">
          ${this.__renderMessages(this.visiblelist)}
        </div>
      </div>
    `;
  }

  updated(changed) {
    super.updated(changed);

    let shouldDispatch = false;
    if (changed.has('list')) shouldDispatch = true;

    // eslint-disable-next-line no-unused-expressions
    !shouldDispatch && debug('Skip dispatching');

    return (
      shouldDispatch &&
      this.updateComplete
        .then(result => {
          if (!result)
            return new Error('Could not perform the update. Nested changing was detected');

          const visibleEls = this.__discoverMessageVisibility();

          this.__vlist && this.__vlist.adjust(visibleEls);

          if (this.__tailHeight) {
            this._parentEl.scrollTo2(0, this._rootNode.offsetHeight - this.__tailHeight);
            // needed to be called at current frame

            this.__tailHeight = undefined;
          }

          /* request scroll change */
          this.__afterRenderFn &&
            requestAnimationFrame(() => {
              const afterrenderFn = this.__afterRenderFn;

              afterrenderFn();
              this.__afterRenderFn = undefined;
            });

          debug('Element was updated');

          return true;
        })
        .catch(error => debug(error.message))
    );
  }

  __initFactory() {
    if (this._factory) this._factory.destroy();

    this._factory = new MessageFactory({
      parserengine: this.parserengine,
      parser: this.parser,
      parserpreset: this.parserpreset,
      parserrules: this.parserrules,
    });
  }

  __renderMessages(list) {
    return list.map((it, i, arr) => this.__renderEach(it, i, arr));
  }

  __renderEach(it, i, arr) {
    return this.__renderMessage(this.__hydrateEach(it, i, arr));
  }

  __hydrateEach(it, i, arr) {
    const { user, aggregateperinterval } = this;
    const {
      avatar,
      body, // .body should be depracated later on
      classname,
      deleted,
      icon,
      id,
      identity,
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
        isAggregatedBy('user_id', i, arr) &&
        isAggregatedByDate(
          'timestamp',
          i,
          arr,
          aggregateperinterval ? Number(aggregateperinterval) : undefined,
        ),
      avatar,
      classname,
      deleted,
      icon,
      id,
      identity,
      me: user === user_id,
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

  // eslint-disable-next-line class-methods-use-this
  __renderMessage(message) {
    const {
      aggregated,
      avatar,
      classname,
      deleted,
      icon,
      id,
      identity,
      me,
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
    });

    return html`
      <wc-chat-message
        ?aggregated=${aggregated}
        ?deleted=${deleted}
        ?me=${me}
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
      />
    `;
  }

  __discoverMessageVisibility() {
    const parentEl = this.parentElement;
    const childrenEls = this.shadowRoot.querySelector('.messages-inner').children;

    const { top, bottom } = parentEl.getBoundingClientRect();

    const listVisibility = [...childrenEls].map(el => {
      const { top: elTop, bottom: elBot } = el.getBoundingClientRect();

      const elTopR = Math.round(elTop);
      const elBotR = Math.round(elBot);
      const topR = Math.round(top);
      const bottomR = Math.round(bottom);

      return {
        id: el.uid,
        visible: topR <= elTopR && elTopR <= bottomR && (topR <= elBotR && elBotR <= bottomR),
      };
    });

    const visibleMessages = listVisibility.filter(a => a.visible === true).map(a => a.id);

    return visibleMessages;
  }
}

export const MessagesElement = withStyle()(_MessagesElement, style, actionStyle);
