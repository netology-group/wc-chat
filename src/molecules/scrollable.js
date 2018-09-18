import { fromEvent } from 'most/src/source/fromEvent'
import { html, LitElement } from '@polymer/lit-element'
import { withStyle } from '@netology-group/wc-utils/lib/mixins/mixins'
import compose from 'ramda/es/compose'

import { Debug } from '../utils/index'
import style from '../molecules/scrollable.css'
import { observeC as observe, throttleC as throttle } from '../utils/most'

const debug = Debug('wc:scrollable')

const isNumber = it => typeof it === 'number'

export class Scrollable extends LitElement {
  static get properties () {
    return {
      scrolltarget: String,
      scrollgap: Number,
      listen: String,
      reverse: Boolean,
      debounce: Number,
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

    this.__boundScrollHandler = this._onScrollHandler.bind(this)
  }

  get _rootElement () {
    return !this.shadowRoot ? undefined : this.shadowRoot
  }

  get _scrollable () {
    return this._rootElement ? this._rootElement.querySelector(`${this.scrolltarget || '.scrollable'}`) : this._rootElement
  }

  get _isTarget () {
    return this._scrollable instanceof HTMLElement
  }

  _firstRendered () {
    // eslint-disable-next-line padding-line-between-statements
    if (!this._isTarget) { debug('Target is not valid HTMLElement'); return }

    this.listen && compose(
      observe(e => this._onChildrenUpdate(e)),
      throttle(this.debounce || 50),
    )(fromEvent(this.listen, this._scrollable, true))
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
  }

  _onChildrenUpdate (e) { this._shouldScrollTo(e) }

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

  _render () {
    return (html`
      <div class='scrollable' on-scroll='${this.__boundScrollHandler}'>
        ${this.children}
      </div>
    `)
  }
}

export default withStyle(html)(Scrollable, style)

