import { html, classString as cs } from '@polymer/lit-element'
import { withStyle } from '@netology-group/wc-utils'

import { debug as Debug } from '../utils/index'

import { Scrollable } from './scrollable'
import style from './scrollable.css'

const debug = Debug('@netology-group/wc-chat/Scrollable')

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
      : null

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

  _shouldScrollTo (e) { // eslint-disable-line no-unused-vars
    const X = this._xScroll(this._scrollable)
    const Y = this._yScroll(this._scrollable)

    debug('X', X)
    debug('Y', Y)

    /**
     * At the moment `Y.height` and `this._height` are not the same.
     * - `Y.height` is equal to the new container height (new message has been appended already)
     * - `this._height` is equal to the old container height (
     *  before new element was appended and no scroll behaviour has been present
     * )
     */
    if (!this._height || (Y.height / this._height) >= 2) {
      this._defineCoordinates([
        X.current,
        Y.current,
        X.width,
        Y.height,
        X.left,
        Y.top,
      ])
    }

    if (Y.top === Y.height) return // eslint-disable-line padding-line-between-statements
    // skip scrolling on empty children (initial render might has 0/0)

    const head = Y.height - Y.tail // eslint-disable-line no-unused-vars
    const prevhead = ((Y.height - Y.prevtail) < 0) ? 0 : (Y.height - Y.prevtail)

    const { _y: y } = this
    let scrollTo

    if (this.reverse) scrollTo = (!this.freeze && y === 0) ? y : prevhead
    /**
     * for unfreezed scroll we preserve top position (y=0)
     * otherwise scroll to the tail
     */

    if (!this.reverse) {
      const { offsetHeight } = this._scrollable
      const viewingOld = (y + offsetHeight) < this._height

      /**
       * To distinguish update on initial data loading
       *  agaist update on user interaction `this._maybeManualScroll` was added.
       * It implements normal user's behaviour check
       *  which is used to change `this.__manual` property
       */
      scrollTo = ((viewingOld && this.__manual) || this.freeze) ? Y.current : Y.height
    }

    this._scrollTo(X.current, scrollTo)
  }

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
        <div class='scrollable' id="scrollable" on-scroll='${this.__boundScrollHandler}'>
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
