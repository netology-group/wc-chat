import { html, classString as cs } from '@polymer/lit-element'
import { withStyle } from '@netology-group/wc-utils'

import { debug as Debug } from '../utils/index'

import { Scrollable } from './scrollable'
import style from './scrollable.css'

const debug = Debug('@netology-group/wc-chat/ScrollableUnseen')

export class ScrollToUnseen extends Scrollable {
  static get properties () {
    return {
      ...super.properties,
      i18n: Object,
      showbannernew: Boolean,
      unseenSelector: String,
    }
  }

  constructor (...argv) {
    super(...argv)
    this._detached = undefined
  }

  _updateDetachedValue (element) {
    const {
      offsetHeight,
      scrollTop,
      scrollHeight,
    } = element

    const newDetachedValue = this.reverse
      ? scrollTop > 0
      : (scrollHeight - scrollTop) > offsetHeight

    if (!newDetachedValue) {
      debug('Changed last-seen')
      this.dispatchEvent(new CustomEvent('last-seen-change'))
    }

    if (newDetachedValue !== this._detached) {
      this._detached = newDetachedValue

      this.requestRender()
    }
  }

  _scrollToUnseen () {
    const slot = this._scrollable.querySelector('slot')

    const el = slot.assignedNodes() && slot.assignedNodes()[1] && slot.assignedNodes()[1].shadowRoot
      ? slot.assignedNodes()[1].shadowRoot.querySelector(this.unseenSelector)
      : undefined

    if (el) {
      this._scrollTo(0, el.offsetTop - this._scrollable.offsetHeight / 2)
    }
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

  // NOTE: it seems super method covers all the needed logic

  _render (props) {
    const showNewBanner = this._detached && props.showbannernew
    const detachedNewBanner = (html`<div
      class$='${cs({
        banner: true,
        'new': true,
        [props.reverse ? 'bottom' : 'top']: true,
        inactive: !showNewBanner,
        reverse: props.reverse,
      })}'
      on-click='${!showNewBanner ? undefined : () => this._scrollToUnseen()}'>
        <div class='row'>
          <div>${this.i18n.NEW_MESSAGES_COUNT}</div>
          <div>${this.i18n.SEE}</div>
        </div>
      </div>`)

    const showRecentBanner = this._detached && !props.showbannernew
    const detachedBanner = (html`<div
      class$='${cs({
        banner: true,
        recent: true,
        [props.reverse ? 'top' : 'bottom']: true,
        inactive: !showRecentBanner,
        reverse: props.reverse,
      })}'
      on-click='${!showRecentBanner ? undefined : () => this.scrollTo()}'>${this.i18n.GO_TO_RECENT_MESSAGE}</div>`)

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

export default withStyle(html)(ScrollToUnseen, style)
