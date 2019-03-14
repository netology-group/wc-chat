import { fromEvent } from 'most/src/source/fromEvent'
import { html, LitElement } from '@polymer/lit-element'
import { withStyle } from '@netology-group/wc-utils'
import compose from 'ramda/es/compose'

import { Invariant, debug as Debug } from '../utils/index'
import { observeC as observe, throttleC as throttle } from '../utils/most'

import style from './scrollable.css'

const invariant = Invariant()
const debug = Debug('@netology-group/wc-chat/Scrollable')

const DELAY = 50
const DELTA = 20

const isNumber = it => typeof it === 'number'

export class Scrollable extends LitElement {
  static get properties () {
    return {
      delay: Number,
      freeze: Boolean,
      listen: String,
      reverse: Boolean,
      scrolltarget: String,
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

    this.__boundScrollHandler = this._onScrollHandler.bind(this)
  }

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
  }

  _onChildrenUpdate (e) {
    this._shouldScrollTo(e)
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
      /**
       * To distinguish update on initial data loading
       *  agaist update on user interaction `this._maybeManualScroll` was added.
       * It implements normal user's behaviour check
       *  which is used to change `this.__manual` property
       */
      scrollTo = (this.__manual || this.freeze) ? Y.current : Y.height
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
      this._defineCoordinates(x, y, el.scrollWidth, el.scrollHeight)
    }

    if (!el.scrollTo) {
      el.scrollLeft = x
      el.scrollTop = y
    } else {
      el.scrollTo(x, y)
    }
  }

  _render () {
    return (html`
      <div class='wrapper'>
        <div class='scrollable' id="scrollable" on-scroll='${this.__boundScrollHandler}'>
          <div class='inner'>
            <slot></slot>
          </div>
        </div>
      </div>
    `)
  }
}

export default withStyle(html)(Scrollable, style)
