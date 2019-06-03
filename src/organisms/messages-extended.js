import { html, classString as cs } from '@polymer/lit-element'
import { withStyle } from '@netology-group/wc-utils'

import { Actions, style as actionStyle } from '../molecules/actions'
import { isAggregatedBy, isLastseen } from '../utils/index'
import { actionImages } from '../atoms/action'
import { separator } from '../atoms/separator'

import separatorStyle from '../atoms/separator.css'

import { MessagesElement } from './messages'
import style from './messages.css'
import styleExt from './messages-extended.css'

export class XMessagesElement extends MessagesElement {
  static get properties () {
    return {
      ...super.properties,
      actions: Array,
      i18n: Object,
      lastseen: Number,
      parser: String,
      parserpreset: String,
      parserrules: String,
      reactions: Array,
    }
  }

  get __actions () {
    return new Map(Array.isArray(this.actions) ? this.actions : [])
  }

  get __reactions () {
    const rctns = new Map([])

    Array.isArray(this.reactions) && this.reactions.forEach((it) => {
      rctns.set(it[0], { name: `:${it[0]}:`, count: it[1] || 0 })
    })

    return rctns
  }

  // eslint-disable-next-line class-methods-use-this
  __renderReactions (opts) {
    const { rating } = opts
    let config

    if (typeof rating === 'number') {
      config = new Map([['thumbsup', { name: ':thumbsup:', count: rating }]])
    } else if (Array.isArray(rating)) {
      config = new Map([])
      rating.forEach((it) => {
        config.set(it[0], { name: `:${it[0]}:`, count: it[1] || 0 })
      })
    } else if (opts.rating !== undefined) {
      throw new TypeError('Wrong rating type')
    }

    if (!config) return undefined

    return (html`
      <wc-chat-reactions
        config='${config}'
        showcount
      />
    `)
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
      lastseen,
      rating,
      reversed,
      text,
      theme,
      timestamp,
      user_id,
      user_name,
      visible,
    } = message

    const maybeUnseen = lastseen && (current_user_id !== user_id)
    const unseenTpl = !maybeUnseen
      ? undefined
      : (html`
          <div slot$=${`message-${reversed ? 'rev-' : ''}${id}`} class='messages-separator'>
            ${separator({ reversed, text: this.i18n.NEW_MESSAGES })}
          </div>
        `)

    const className = cs({
      [classname]: classname,
      aggregated,
      message: true,
      unseen: lastseen,
    })

    if (!visible) return undefined
    // skip unless visible

    return (html`
      <wc-chat-message
        aggregated='${aggregated}'
        class$='${className}'
        deleted='${deleted}'
        icon='${icon}'
        identity='${identity}'
        image='${avatar}'
        me='${user_id === current_user_id}'
        parsername='${this.parser}'
        parserpreset='${this.parserpreset}'
        parserrules='${this.parserrules}'
        rating='${this.rating}'
        reversed='${reversed}'
        text='${text}'
        theme='${theme}'
        timestamp='${timestamp}'
        uid='${id}'
        username='${user_name}'
      >
        ${unseenTpl}
        <div slot='message-prologue'>
          ${this.__renderActions(message)}
        </div>
        <div slot='message-epilogue'>
          ${this.__renderReactions({ rating })}
        </div>
      </wc-chat-message>
    `)
  }

  _renderEach (message, i, arr) {
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
    } = message

    return this.__renderMessage({
      aggregated: isAggregatedBy('user_id', i, arr),
      avatar,
      classname,
      current_user_id: this.user,
      deleted,
      icon,
      id,
      identity,
      lastseen: isLastseen({
        index: i,
        lastseen: this.lastseen,
        list: arr,
        reverse: this.reverse,
      }),
      rating,
      reversed: this.reverse,
      text,
      theme,
      timestamp,
      user_id,
      user_icon: icon,
      user_name,
      visible,
    })
  }

  __renderActions (data) {
    const children = new Map()
    const reactions = new Map()

    // eslint-disable-next-line no-bitwise
    const isAllowed4Other = (a, b) => (b.current_user_id !== b.user_id && (a & 1))
    // eslint-disable-next-line no-bitwise
    const isAllowed4Group = (a, b) => (b.current_user_id !== b.user_id && (a & 10))
    // eslint-disable-next-line no-bitwise
    const isAllowed4Self = (a, b) => (b.current_user_id === b.user_id && (a & 100))

    const isAllowed = (a, b) => isAllowed4Other(a, b)
      || isAllowed4Group(a, b)
      || isAllowed4Self(a, b)

    Array.isArray(this.actions) && this.actions.forEach((_) => {
      const key = _[0]
      const _action = this.__actions.get(key) || {}

      const actionOpts = {
        message: data,
        allowed: isAllowed(_action, data),
        children: actionImages.get(key),
        handler: (e, detail) => { this.dispatchEvent(new CustomEvent(key, { detail })) },
      }

      if (key === 'message-reaction' && isAllowed(_action, data)) {
        reactions.set(key, (actionOpts))
      } else {
        children.set(key, (actionOpts))
      }
    })

    // eslint-disable-next-line object-curly-newline
    return Actions({ children, reactions })
  }

  _render (props) {
    return super._render(props)
  }
}

export default withStyle(html)(
  XMessagesElement,
  style,
  separatorStyle,
  actionStyle,
  styleExt
)
