import { LitElement, html } from 'lit-element';
import cs from 'classnames-es';

import { debug as Debug, isAggregatedBy } from '../utils/index.js';
import { style } from './messages.css.js';
import { style as actionStyle } from '../molecules/actions.css.js';
import { withStyle } from '../mixins/with-style.js';

const debug = Debug('@ulms/wc-chat/MessagesElement');

/**
 * Check a place where new messages should be placed
 *
 * We do not expect insertions inside the list.
 * So the direction might be calculated via edge checking.
 *
 * @function predictDirection
 * @param  {type} list      {description}
 * @param  {type} prevList  {description}
 * @param  {type} predicate {description}
 * @return {type} {description}
 */
function predictDirection(list, prevList, predicate) {
  if (!Array.isArray(list) || !Array.isArray(prevList)) throw new TypeError("Wrong list's format");
  if (typeof preedicate === 'function') return predicate(list, prevList);

  if (!prevList.length || !list.length) return 0;

  if (list.length !== prevList.length) {
    const first = _ => _[0];
    const last = _ => _[_.length - 1];
    const stamp = _ => _.timestamp;
    // we compare messages by the timestamp as any message contains `created_at`

    if (stamp(first(list)) !== stamp(first(prevList))) return -1;
    // means that messages were placed to the start of the list

    if (stamp(last(list)) !== stamp(last(prevList))) return 1;
    // means that messages were placed to the end of the list
  }

  return 0;
  // 0 means that list was not changed
}

export class _MessagesElement extends LitElement {
  static get properties() {
    return {
      classname: String,
      invoke: String,
      list: { type: Array },
      listdir: { type: Number },
      user: { type: Number },
      users: { type: Array },
    };
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
          ${this.__renderMessages(list)}
        </div>
      </div>
    `;
  }

  updated(changed) {
    super.updated(changed);

    const prev = (changed || new Map()).get('list') || [];
    const next = this.list || [];
    const shouldDispatch = Array.isArray(next);

    /* eslint-disable max-len */
    /**
     *  Scrollable and messages elements meant to work together:
        - the messages element renders bypassed data (messages),
        - the scrollable element maintains a scroll position;

        ** Scenarios:
        - User should be moved to the latest message when entered a new one,
        - User should stay where he is (he might be near the latest message or not if browsing old messages) when a new message or messages were added,
        - All previous scenarios are valid for a `reverse` (lifo) mode (new messages are on top, old ones at the bottom),
        - Scroll position should not be changed on any event where the cursor is over the element;
        // TODO: reverse mode was deprecated. Remove this scenario from docs

        ** Interoperability:
        The messages element just renders data. It does not have any info about the scroll position.
        The scrollable element directs the scroll position. It does not have (should not have at all) any info about the kind of elements which lays inside.

        Messages element and scrollable element work together via events:
        - the message element dispatch a `did-update` event on any `list` change,
        - the scrollable element might dispatch `seek-before` and `seek-after`  events when the user reaches the top or the bottom of the list respectively.

        *** Pagination
        The messages element will dispatch the `did-update` event on any list's update.
        Next page loading works the same as the standard update (e.g. user added new message,..). We bypass the updated list to the messages element (a new piece of data is pushed to the end of the old list).
        Previous page loading works slightly different. A new piece of data is pushed to the start of the list but the scrollable element cannot separate the previous page's update event from the next page's update event.
        So the messages element should provide some details inside the `did-update` event.

        ** Possible problems
        There might be an issue with recovering any message somewhere inside the list.
        At that case we have to know an active message to understand where an old (deleted or something) message was recovered.
     */
    /* eslint-enable max-len */
    // eslint-disable-next-line no-unused-expressions
    !shouldDispatch && debug('Skip dispatching');

    // eslint-disable-next-line no-unused-expressions
    shouldDispatch &&
      this.updateComplete
        .then(result => {
          if (!result)
            return new Error('Could not perform the update. Nested changing was detected');

          debug(`dispatch '${this.invoke}' event`);

          return this.dispatchEvent(
            new CustomEvent(this.invoke, { detail: { direction: predictDirection(next, prev) } }),
          );
        })
        .catch(error => debug(error.message));
  }

  __renderMessages(list) {
    return list.map((it, i, arr) => this.__renderEach(it, i, arr));
  }

  __renderEach(it, i, arr) {
    return this.__renderMessage(this.__hydrateEach(it, i, arr));
  }

  __hydrateEach(it, i, arr) {
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

    return {
      aggregated: isAggregatedBy('user_id', i, arr),
      avatar,
      classname,
      current_user_id: this.user,
      deleted,
      icon,
      id,
      identity,
      me: this.user === user_id,
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
}

export const MessagesElement = withStyle()(_MessagesElement, style, actionStyle);
