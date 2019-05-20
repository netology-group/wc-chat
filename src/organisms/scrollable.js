import { fromEvent } from 'most/src/source/fromEvent'
import { html, LitElement } from '@polymer/lit-element'
import { withStyle } from '@netology-group/wc-utils'
import compose from 'ramda/es/compose'

import { Invariant, debug as Debug } from '../utils/index'
import { observeC as observe, throttleC as throttle } from '../utils/most'

import style from './scrollable.css'

const invariant = Invariant()
const debug = Debug('@netology-group/wc-chat/Scrollable')

const DELTA = 20
const THROTTLE_RESIZE = 50
const THROTTLE_DELAY = 50

const isNumber = it => typeof it === 'number'

/**
 *  .________________ ... zero
 *  |                |
 *  |                |
 *  |                |
 *  |----------------|... current
 *  |                |
 *  |                |  A
 *  |                |  |
 *  |                |  |
 *  |                |  | frame height
 *  |                |  |
 *  |                |  |
 *  |                |  V
 *  |                |
 *  |----------------|... frame head
 *  |                |
 *  |                |
 *  |________________|... head
 *
 */

export class Scrollable extends LitElement {
  static get properties () {
    return {
      delay: Number,
      freeze: Boolean,
      listen: String,
      omni: Boolean,
      reverse: Boolean,
      scrolltarget: String,
    }
  }

  constructor (props) {
    super(props)

    this.__manual = false

    this.__y = undefined
    this.__x = undefined
    // _x & _y

    this.delay = undefined
    this._throttleResize = undefined
    this._detached = false

    this._height = 0
    this._width = 0
  }

  get _rootDocument () {
    return this.ownerDocument
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

  get _x () {
    return this.__x ? this.__x : this._scrollable.scrollLeft
  }

  set _x (x = 0) {
    this.__x = x
  }

  get _y () {
    return this.__y ? this.__y : (this.reverse ? 0 : this._scrollable.scrollHeight)
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
    if (!this._isTarget) { invariant('Target is not a valid HTMLElement'); return }

    this.listen && compose(
      observe(e => this._onChildrenUpdate(e)),
      throttle(this.delay === 0 ? 0 : this.delay || THROTTLE_DELAY),
    )(fromEvent(this.listen, this._scrollable, true))

    compose(
      observe(e => this._onResizeHandler(e)),
      throttle(this._throttleResize === 0 ? 0 : this._throttleResize || THROTTLE_RESIZE),
    )(fromEvent('resize', this._rootDocument.defaultView))

    /* eslint-disable function-paren-newline */
    compose(
      observe(e => this._onScrollHandler(e)),
    )(fromEvent('scroll', this._scrollable))
    /* eslint-enable function-paren-newline */

    this._scrollTo(this._x, this._y)
  }

  _shouldThrowSeekEvents (position) {
    const {
      frameHeight,
      height,
      top,
    } = position

    const frameHead = top + frameHeight
    const atHead = frameHead === height
    const atTail = top === 0

    // seek before
    if (
      (this.reverse && atHead)
      || (!this.reverse && atTail)
    ) {
      debug('Seek before')
      this.dispatchEvent(new CustomEvent('seek-before'))
    }

    // seek after
    if (
      this.omni && (
        (this.reverse && atTail)
        || (!this.reverse && atHead)
      )
    ) {
      debug('Seek after')
      this.dispatchEvent(new CustomEvent('seek-after'))
    }
  }

  _defineCoordinates (position) {
    // eslint-disable-next-line array-element-newline, array-bracket-newline
    const [x, y, width, height] = position

    this._x = x
    this._y = y
    this._width = width
    this._height = height
  }

  _onResizeHandler () {
    this._onScrollHandler({ currentTarget: this._scrollable })
  }

  _onScrollHandler (e) {
    const {
      scrollLeft, scrollTop, scrollWidth, scrollHeight, offsetHeight,
    } = e.currentTarget

    this._defineCoordinates([
      scrollLeft,
      scrollTop,
      scrollWidth,
      scrollHeight,
    ])

    this._shouldThrowSeekEvents({
      frameHeight: offsetHeight,
      height: scrollHeight,
      top: scrollTop,
    })
  }

  _onChildrenUpdate (e) {
    this._shouldScrollTo(e, e.detail.direction)
  }

  _yScroll (el) {
    const { scrollTop: top, scrollHeight: height } = el

    return {
      current: top,
      height,
      top,
      y: this._y,
    }
  }

  _xScroll (el) {
    const { scrollLeft: left, scrollWidth: width } = el

    return {
      current: left,
      left,
      width,
      x: this._x,
    }
  }

  __shouldScrollByYAxis (params, changedParams, prevParams) {
    const {
      direction, current, top, y,
    } = changedParams

    const prevHead = prevParams.height - current

    const atHead = current + this._scrollable.offsetHeight === prevParams.height
    // means that user is seeing the latest message

    const atZero = top === 0 && top === y

    if (this.reverse && this.freeze) {
      return (!atHead && !atZero)
        ? params.height - prevHead
        : undefined
    }
    // preserve top position in reverse & freezed mode unless at the edge

    if (this.reverse) {
      return atZero
        ? top
        : atHead ? top : params.height - prevHead
    }
    // preserve top position in `reverse` mode

    if (this.freeze) return top
    // preserve top position if is freezed

    if (direction === -1) return params.height - prevHead
    // calculate top position according the previous distance
    // between hight (head) and current position

    return atHead ? params.height - prevHead : y
    // preserve current position unless user is near the latest message
  }

  // eslint-disable-next-line class-methods-use-this
  __shouldScrollByXAxis (params, changed) {
    return changed.current
  }

  _shouldScrollTo (e, direction = 0) { // eslint-disable-line no-unused-vars
    /**
     * At the moment `Y.height` and `this._height` are not the same.
     * - `Y.height` is equal to the new container height (new message has been appended already)
     * - `this._height` is equal to the old container height (
     *  before new element was appended and no scroll behaviour has been present
     * )
     */
    const X = this._xScroll(this._scrollable)
    const Y = this._yScroll(this._scrollable)

    debug('X', X)
    debug('Y', Y)

    if (Y.top === Y.height) return debug('Skip scrolling') // eslint-disable-line padding-line-between-statements
    // skip scrolling on empty children (initial render might has 0/0)

    const y = this.__shouldScrollByYAxis(
      { height: Y.height },
      {
        direction,
        current: Y.current,
        top: Y.top,
        y: Y.y,
      },
      { height: this._height }
    )
    const x = this.__shouldScrollByXAxis({}, { current: X.current })

    return (typeof y !== 'undefined' && typeof x !== 'undefined') && this._scrollTo(x, y)
  }

  _scrollTo (x, y) {
    const el = this._scrollable

    // eslint-disable-next-line padding-line-between-statements
    if (!isNumber(x) || !isNumber(y)) { invariant('Wrong coordinate type'); return }

    debug('Maybe scroll to:', x, y)

    if (!el.scrollTo) {
      el.scrollLeft = x
      el.scrollTop = y
    } else {
      el.scrollTo(x, y)
    }
  }

  // eslint-disable-next-line class-methods-use-this
  _render () {
    return (html`
      <div class='wrapper'>
        <div class='scrollable' id="scrollable">
          <div class='inner'>
            <slot></slot>
          </div>
        </div>
      </div>
    `)
  }
}

export default withStyle(html)(Scrollable, style)
