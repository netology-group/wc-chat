import { html, classString as cs } from '@polymer/lit-element'
import { withStyle } from '@netology-group/wc-utils'

import { XLitElement as LitElement } from '../utils/rendered-lit-element'
import { debug as Debug, isAggregatedBy } from '../utils/index'
import { style as actionStyle } from '../molecules/actions'

import style from './messages.css'

const debug = Debug('@netology-group/wc-chat/MessagesElement')

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
function predictDirection (list, prevList, predicate) {
  if (!Array.isArray(list) || !Array.isArray(prevList)) throw new TypeError('Wrong list\'s format')
  if (typeof preedicate === 'function') return predicate(list, prevList)

  if (!prevList.length || !list.length) return 0

  if (list.length !== prevList.length) {
    const first = _ => _[0]
    const last = _ => _[_.length - 1]
    const stamp = _ => _.timestamp
    // we compare messages by the timestamp as any message contains `created_at`

    if (stamp(first(list)) !== stamp(first(prevList))) return -1
    // means that messages were placed to the start of the list

    if (stamp(last(list)) !== stamp(last(prevList))) return 1
    // means that messages were placed to the end of the list
  }

  return 0
  // 0 means that list was not changed
}

export class MessagesElement extends LitElement {
  static get properties () {
    return {
      classname: String,
      invoke: String,
      list: Array,
      listdir: Number,
      reverse: Boolean,
      user: Number,
      users: Array,
    }
  }

  _render (props) {
    const { list = [] } = props
    const contentTpl = !list.length
      ? undefined
      : (html`
        <div class='messages-inner'>
          ${this.__renderMessages(list)}
        </div>
      `)

    return (html`<div class='messages'>${contentTpl}</div>`)
  }

  _didRender (props, changed, prevProps) {
    const prev = prevProps.list || [] // use empty list on initial render
    const next = props.list

    const shouldDispatch = props.list && Array.isArray(props.list)

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

    if (shouldDispatch) {
      debug(`dispatch '${this.invoke}' event`)
      this.renderComplete
        .then(() => this.dispatchEvent(new CustomEvent(
          this.invoke,
          { detail: { direction: predictDirection(next, prev) } }
        )))
        .catch(error => debug(error.message))
    } else {
      debug('Skip dispatching')
    }
  }

  __renderMessages (list) {
    return list.map((it, i, arr) => this.__renderEach(it, i, arr))
  }

  __renderEach (it, i, arr) {
    const {
      avatar,
      body: text,
      classname,
      deleted,
      icon,
      id,
      identity,
      rating,
      theme,
      timestamp,
      user_id,
      user_name,
      visible,
    } = it

    return this.__renderMessage({
      aggregated: isAggregatedBy('user_id', i, arr),
      avatar,
      classname,
      current_user_id: this.user,
      deleted,
      icon,
      id,
      identity,
      reversed: this.reverse,
      rating,
      text,
      theme,
      timestamp,
      user_id,
      user_icon: icon,
      user_name,
      visible,
    })
  }

  __renderMessage (message) { // eslint-disable-line class-methods-use-this
    const {
      aggregated,
      avatar,
      classname,
      current_user_id,
      deleted,
      icon,
      id,
      identity,
      reversed,
      text,
      theme,
      timestamp,
      user_id,
      user_name,
    } = message

    const className = cs({
      [classname]: classname,
      aggregated,
      message: true,
    })

    return (html`
      <wc-chat-message
        aggregated='${aggregated}'
        class$='${className}'
        deleted='${deleted}'
        icon='${icon}'
        identity='${identity}'
        image='${avatar}'
        me='${user_id === current_user_id}'
        reversed='${reversed}'
        text='${text}'
        theme='${theme}'
        timestamp='${timestamp}'
        uid='${id}'
        username='${user_name}'
      />
    `)
  }
}

export default withStyle(html)(
  MessagesElement,
  style,
  actionStyle
)
