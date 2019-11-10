import { html } from 'lit-element'
import cs from 'classnames-es'

import { _ScrollableElement } from './scrollable.js'
import { debug as Debug, requestAnimation } from '../utils/index.js'
import { withStyle } from '../mixins/with-style.js'
import { arrowDown as arrowDownSvg } from '../images/index.js'

import { style } from './scrollable.css.js'
import { style as styleUnseen } from './scroll-to-unseen.css.js'

const debug = Debug('@netology-group/wc-chat/ScrollableUnseenElement')

const freshBanner = ({
  active,
  i18n,
  onClick,
}) => {
  const cname = cs({
    banner: true,
    'new': true,
    top: true,
    inactive: !active,
  })

  return (html`
    <div class=${cname} @click=${!active ? undefined : onClick}>
      <div class='row'>
        <div>${i18n.NEW_MESSAGES_COUNT}</div>
        <div>
          ${i18n.SEE}
          <span class='icon'>${arrowDownSvg}</span>
        </div>
      </div>
    </div>
  `)
}

const recentBanner = ({
  active,
  i18n,
  onClick,
}) => {
  const cname = cs({
    banner: true,
    recent: true,
    bottom: true,
    inactive: !active,
  })

  return (html`
    <div class=${cname} @click=${!active ? undefined : onClick}>
      ${i18n.GO_TO_RECENT_MESSAGE}
      <span class='icon'>${arrowDownSvg}</span>
    </div>`
  )
}

export { wasAtHeadSym } from './scrollable.js'

export class _ScrollableUnseenElement extends _ScrollableElement {
  static get properties () {
    return {
      ...super.properties,
      i18n: Object,
      showbannernew: Boolean,
      unseenSelector: String,
    }
  }

  constructor () {
    super()

    this._detached = undefined
  }

  _updateDetachedValue (element) {
    const {
      offsetHeight,
      scrollTop,
      scrollHeight,
    } = element

    const newDetachedValue = (scrollHeight - scrollTop) > offsetHeight

    if (!newDetachedValue) {
      debug('Changed last-seen')
      this.dispatchEvent(new CustomEvent('last-seen-change'))
    }

    if (newDetachedValue !== this._detached) {
      this._detached = newDetachedValue

      requestAnimation(() => this.requestUpdate())
    }
  }

  __scrollToUnseen () {
    const slot = this._scrollable.querySelector('slot')

    const el = slot.assignedNodes() && slot.assignedNodes()[1] && slot.assignedNodes()[1].shadowRoot
      ? slot.assignedNodes()[1].shadowRoot.querySelector(this.unseenSelector)
      : undefined

    if (!el) return

    const nextPoint = [0, el.offsetTop - this._scrollable.offsetHeight / 2]

    requestAnimation(() => this.__scrollTo(...nextPoint))
  }

  _onScrollHandler (e) {
    super._onScrollHandler(e)

    this._updateDetachedValue(e.currentTarget)
  }

  _onChildrenUpdate (e) {
    super._onChildrenUpdate(e)

    if (e.currentTarget) {
      this._updateDetachedValue(e.currentTarget)
    }
  }

  render () {
    const {
      showbannernew,
    } = this

    return (html`
      <div class='wrapper'>
        <div class='scrollable' id="scrollable">
          <div class='inner'>
            <slot></slot>
          </div>
        </div>
        ${freshBanner({
          active: Boolean(this._detached && showbannernew),
          i18n: this.i18n,
          onClick: () => this.__scrollToUnseen(),
        })}
        ${recentBanner({
          active: Boolean(this._detached && showbannernew),
          i18n: this.i18n,
          onClick: () => this.scrollTo(),
        })}
      </div>
    `)
  }
}

export const ScrollableUnseenElement = withStyle(html)(
  _ScrollableUnseenElement,
  style,
  styleUnseen
)
