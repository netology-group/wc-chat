import { fromEvent } from 'most/src/source/fromEvent'
import { html, LitElement, classString as cs } from '@polymer/lit-element'
import { withStyle } from '@netology-group/wc-utils/lib/mixins/mixins'
import compose from 'ramda/es/compose'

import { Debug } from '../utils/index'
import style from '../molecules/scrollable.css'
import { observeC as observe, throttleC as throttle } from '../utils/most'

const debug = Debug('wc:scrollable')

const DELAY = 50

const isNumber = it => typeof it === 'number'

export class Scrollable extends LitElement {
  static get properties () {
    return {
      delay: Number,
      i18n: Object,
      listen: String,
      reverse: Boolean,
      scrolltarget: String,
      showbannernew: Boolean,
    }
  }

  constructor (props) {
    super(props)

    this._height = 0
    this._width = 0
    this._left = 0
    this._top = 0
    this._x = 0
    this._y = 0
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

  scrollTo (x, y) {
    let el
    if (!isNumber(x) || !isNumber(y)) el = this._scrollable

    const _x = 0
    const _y = this.reverse ? 0 : el.scrollHeight

    this._scrollTo(x || _x, y || _y)
  }

  _firstRendered () {
    // eslint-disable-next-line padding-line-between-statements
    if (!this._isTarget) { debug('Target is not valid HTMLElement'); return }

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

    const newDetachedValue = this.reverse ? scrollTop > 0 : (scrollHeight - scrollTop) > offsetHeight

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

  _onResizeHandler (e) {
    this._onScrollHandler({currentTarget: this._scrollable})
  }

  _onScrollHandler (e) {
    const {
      scrollTop,
      scrollLeft,
      scrollHeight,
      scrollWidth,
    } = e.currentTarget

    this._top = scrollTop
    this._left = scrollLeft
    this._width = scrollWidth
    this._height = scrollHeight
    this._y = scrollTop
    this._x = scrollLeft

    this._updateDetachedValue(e.currentTarget)
  }

  _onChildrenUpdate (e) {
    this._shouldScrollTo(e)

    if (e.currentTarget) {
      this._updateDetachedValue(e.currentTarget)
    }
  }

  _yScroll (el) {
    const { scrollTop: top, scrollHeight: height } = el

    return {
      current: this._y || top,
      height,
      tail: this._height - this._y,
      top,
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

    if (Y.top === Y.height) return
    // skip scrolling on empty children (initial render might has 0/0)

    const { _y: y } = this
    const { offsetHeight } = this._scrollable

    const scrollTo = this.reverse
      ? y === 0 ? y : Y.height - Y.tail
      : (y + offsetHeight) < this._height ? null : Y.height

    scrollTo && this._scrollTo(X.current, scrollTo)
  }

  _scrollTo (x, y) {
    const el = this._scrollable

    // eslint-disable-next-line padding-line-between-statements
    if (!isNumber(x) || !isNumber(y)) { debug('Wrong coordinate type'); return }

    if (!el.scrollTo) {
      el.scrollLeft = x
      el.scrollTop = y
    } else {
      el.scrollTo(x, y)
    }
  }

  _render (props) {
    return (html`
      <div class='wrapper'>
        <div class='scrollable' id="scrollable" on-scroll='${this.__boundScrollHandler}'>
          <div class='inner'>
            <slot></slot>
          </div>
        </div>
        ${
          this._detached && props.showbannernew
            ? html`<div class$='${cs({
              banner: true,
              new: true,
              [props.reverse ? 'bottom' : 'top']: true,
              reverse: props.reverse
            })}' on-click='${() => this._scrollToUnseen()}'>
              <div class='row'>
                <div>${this.i18n.NEW_MESSAGES_COUNT}</div>
                <div>${this.i18n.SEE}</div>
              </div>
            </div>`
            : null
        }
        ${
          this._detached && !props.showbannernew
            ? html`<div class$='${cs({
              banner: true,
              recent: true,
              [props.reverse ? 'top' : 'bottom']: true,
              reverse: props.reverse
            })}' on-click='${() => this.scrollTo()}'>${this.i18n.GO_TO_RECENT_MESSAGE}</div>`
            : null
        }
      </div>
    `)
  }
}

export default withStyle(html)(Scrollable, style)

