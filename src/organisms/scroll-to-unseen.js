import { html, classString as cs } from '@polymer/lit-element'
import { withStyle } from '@netology-group/wc-utils'

import { debug as Debug, requestAnimation } from '../utils/index'

import { Scrollable } from './scrollable'
import style from './scrollable.css'
import styleUnseen from './scroll-to-unseen.css'

const debug = Debug('@netology-group/wc-chat/ScrollableUnseen')

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
    <div class$='${cname}' on-click='${!active ? undefined : onClick}'>
      <div class='row'>
        <div>${i18n.NEW_MESSAGES_COUNT}</div>
        <div>${i18n.SEE}</div>
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
    <div class$='${cname}' on-click='${!active ? undefined : onClick}'>
      ${i18n.GO_TO_RECENT_MESSAGE}
    </div>`
  )
}

export class ScrollToUnseen extends Scrollable {
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

      requestAnimation(() => this.requestRender())
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

  _render (props) {
    const detachedNewBanner = freshBanner({
      active: Boolean(this._detached && props.showbannernew),
      i18n: this.i18n,
      onClick: () => this.__scrollToUnseen(),
    })

    const detachedBanner = recentBanner({
      active: Boolean(this._detached && !props.showbannernew),
      i18n: this.i18n,
      onClick: () => this.scrollTo(),
    })

    return (html`
      <div class='wrapper'>
        <div class='scrollable' id="scrollable">
          <div class='inner'>
            <slot></slot>
          </div>
        </div>
        ${detachedNewBanner}
        ${detachedBanner}
      </div>
    `)
  }
}

export default withStyle(html)(ScrollToUnseen, style, styleUnseen)
