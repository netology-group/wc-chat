import { fromEvent } from 'most/src/source/fromEvent'
import { html, LitElement, classString as cs } from '@polymer/lit-element'
import { withStyle } from '@netology-group/wc-utils'
import compose from 'ramda/es/compose'

import { Invariant, debug as Debug } from '../utils/index'
import style from '../molecules/scrollable.css'
import { observeC as observe, throttleC as throttle } from '../utils/most'

import { Scrollable } from './scrollable'

const invariant = Invariant()
const debug = Debug('@netology-group/wc-chat/Scrollable')

const DELAY = 50
const DELTA = 20

const isNumber = it => typeof it === 'number'

export class ScrollToUnseen extends Scrollable {
  static get properties () {
    return {
      delay: Number,
      i18n: Object,
      freeze: Boolean,
      listen: String,
      reverse: Boolean,
      scrolltarget: String,
      showbannernew: Boolean,
    }
  }

  constructor (props) {
    super(props)

    this.__y = undefined
    // get/set _y

    this.__manual = false
    this._height = 0
    this._width = 0
    this._left = 0
    this._top = 0
    this._x = 0
    this._detached = false

    // this._oldChildrenHeight = 0

    this.__boundScrollHandler = this._onScrollHandler.bind(this)
  }

  // set __childrenHeight (val) {
  //   if (this._height === val) return
  //   this._oldChildrenHeight = this._height

  //   this._height = val

  //   debug('777 NEXT innerheight', val, this._oldChildrenHeight)
  // }

  get _rootElement () {
    return !this.shadowRoot ? undefined : this.shadowRoot
  }

  get _scrollable () {
    return this._rootElement ? this._rootElement.querySelector(`${this.scrolltarget || '#scrollable'}`) : this._rootElement
  }

  get _isTarget () {
    return this._scrollable instanceof HTMLElement
  }

  get _y () {
    return this.__y
  }

  set _y (y = 0) {
    if (typeof y !== 'number') return

    const shift = Math.abs(this._y - y)

    this.__manual = this._y !== 0 && this._scrollMinMax(shift)
    /**
     * separate manual scroll from scroll done by the script:
     * - shift might be equal to zero but has non-zero value
     * - shift is in range
     */

    this.__y = y
  }

  scrollTo (x, y) {
    const el = this._scrollable

    const _x = 0
    const _y = this.reverse ? 0 : el.scrollHeight

    this._scrollTo(isNumber(x) ? x : _x, isNumber(y) ? y : _y)
  }

  _scrollMinMax (shift, min = 1, max = DELTA) { // eslint-disable-line class-methods-use-this
    return shift === 0 || (shift >= min && shift <= max)
    /**
     * 2 scenarious:
     * - shift is in range (generic scrolling)
     * - zero shift means that user wanna stay on the same position
     */
  }

  _firstRendered () {
    // eslint-disable-next-line padding-line-between-statements
    if (!this._isTarget) { invariant('Target is not valid HTMLElement'); return }

    this.listen && compose(
      observe(e => this._onChildrenUpdate(e)),
      throttle(this.delay === 0 ? 0 : this.delay || DELAY),
    )(fromEvent(this.listen, this._scrollable, true))

    compose(
      observe(e => this._onResizeHandler(e)),
      throttle(100),
    )(fromEvent('resize', window))
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
      ? slot.assignedNodes()[1].shadowRoot.querySelector('.message.unseen')
      : null

    if (el) {
      this._scrollTo(0, el.offsetTop - this._scrollable.offsetHeight / 2)
    }
  }

  _onResizeHandler () {
    this._onScrollHandler({ currentTarget: this._scrollable })
  }

  _onScrollHandler (e) {
    this._defineCoordinates(...[
      e.currentTarget.scrollLeft,
      e.currentTarget.scrollTop,
      e.currentTarget.scrollWidth,
      e.currentTarget.scrollHeight,
    ])

    this._updateDetachedValue(e.currentTarget)
  }

  _defineCoordinates (x, y, width, height, left, top, fn) {
    if (!left) left = x // eslint-disable-line no-param-reassign
    if (!top) top = y // eslint-disable-line no-param-reassign

    debug('Updating current scroll coordinates', {
      x, y, width, height, left, top,
    })

    this._x = x
    this._y = y
    this._width = width
    this._height = height
    this._left = left
    this._top = top

    if (typeof fn === 'function') {
      this.__childrenHeight = height

      fn({
        x, y, width, height, left, top,
      })
    }
  }

  _onChildrenUpdate (e) {
    this._shouldScrollTo(e)

    if (e.currentTarget) {
      this._updateDetachedValue(e.currentTarget)
    }
  }

  _yScroll (el) {
    const { _y: y } = this
    const { scrollTop: top, scrollHeight: height } = el

    debug(`Prev height: ${this._height}`, `Next height: ${height}`)

    return {
      current: y || top,
      height,
      tail: height - y,
      prevtail: this._height - y,
      top,
      y,
    }
  }

  _xScroll (el) {
    const { scrollLeft: left, scrollWidth: width } = el

    return {
      current: this._x || left,
      left,
      width,
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
      this._defineCoordinates(
        X.current,
        Y.current,
        X.width,
        Y.height,
        X.left,
        Y.top,
      )
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

  _scrollTo (x, y) {
    const el = this._scrollable

    // eslint-disable-next-line padding-line-between-statements
    if (!isNumber(x) || !isNumber(y)) { invariant('Wrong coordinate type'); return }

    debug('Maybe scroll to:', x, y)

    if (el.scrollLeft === x && el.scrollTop === y) {
      debug('Scroll position is the same. Update coordinates manually...')
      this._defineCoordinates(...[
        x,
        y,
        el.scrollWidth,
        el.scrollHeight,
        undefined,
        undefined,
      ])
    }

    if (!el.scrollTo) {
      el.scrollLeft = x
      el.scrollTop = y
    } else {
      el.scrollTo(x, y)
    }
    // this.__childrenHeight = el.scrollHeight

    // Promise.resolve()
    //   .then(() => {
    //     if (!el.scrollTo) {
    //       el.scrollLeft = x
    //       el.scrollTop = y
    //     } else {
    //       el.scrollTo(x, y)
    //     }

    //     return undefined
    //   })
    //   .then(() => {
    //     // this.__childrenHeight = el.scrollHeight

    //     // console.log('Afterupdate', this._height)
    //   })
    //   .catch(console.info)
  }

  _render (props) {
    const detachedNewBanner = this._detached && props.showbannernew
      ? (html`<div
        class$='${cs({
          banner: true,
          'new': true,
          [props.reverse ? 'bottom' : 'top']: true,
          reverse: props.reverse,
        })}'
        on-click='${() => this._scrollToUnseen()}'>
          <div class='row'>
            <div>${this.i18n.NEW_MESSAGES_COUNT}</div>
            <div>${this.i18n.SEE}</div>
          </div>
        </div>`)
      : null

    const detachedBanner = this._detached && !props.showbannernew
      ? (html`<div
        class$='${cs({
          banner: true,
          recent: true,
          [props.reverse ? 'top' : 'bottom']: true,
          reverse: props.reverse,
        })}'
        on-click='${() => this.scrollTo()}'>${this.i18n.GO_TO_RECENT_MESSAGE}</div>`)
      : null

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
