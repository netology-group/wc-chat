import { html, LitElement } from '@polymer/lit-element'
import { withStyle } from '@netology-group/wc-utils/lib/mixins/mixins'

import style from './scrollable.css'

export class Scrollable extends LitElement {
  static get properties () {
    return {
      enablegap: Boolean,
      scrolltarget: String,
      scrollgap: Number,
      watch: Boolean,
      listen: String,
      reverse: Boolean,
    }
  }

  constructor (props) {
    super(props)

    this._x = 0
    this._y = 0
    this._xmax = 0
    this._xmin = 0
    this._ymax = 0
    this._ymin = 0

    this.__boundScrollHandler = this._onScrollHandler.bind(this)
  }

  get _targetNode () {
    return !this.shadowRoot ? null : this.shadowRoot.querySelector(`${this.scrolltarget || '.scrollable'}`)
  }

  get _isTarget () {
    return this._targetNode instanceof HTMLElement
  }

  disconnectedCallback () {
    if (!this._isTarget) return

    this.listen
      && this._targetNode.removeEventListener(this.listen, this._onChildrenUpdate.bind(this), true)
  }

  _firstRendered () {
    if (!this._isTarget) return

    this.listen
      && this._targetNode.addEventListener(this.listen, this._onChildrenUpdate.bind(this), true)
  }

  _onScrollHandler (e) {
    const {
      scrollTop,
      scrollLeft,
      scrollHeight,
      scrollWidth,
    } = e.currentTarget

    this._y = scrollTop
    this._x = scrollLeft

    this._ymax = this.reverse ? 0 : scrollHeight
    this._xmax = scrollWidth

    this._ymin = this.reverse ? scrollHeight : 0
    this._xmin = 0
  }

  _onChildrenUpdate (e) {
    this._shouldScrollTo(e)
  }

  _yScroll (el) {
    const { scrollTop: top, scrollHeight: height } = el

    return {
      current: this._y || top,
      max: this._ymax || (this.reverse ? 0 : height),
      min: this._ymin || (this.reverse ? height : 0),
    }
  }

  _xScroll (el) {
    const { scrollLeft: left, scrollWidth: width } = el

    return {
      current: this._x || left,
      max: this._xmax || width,
      min: this._xmin || 0,
    }
  }

  _shouldScrollTo (e) { // eslint-disable-line no-unused-vars
    /**
     * pixel gap
     *
     * For generic lists (fifo) any new item invokes situation when
     * user browses old ones. In that case we use gap
     */
    const gap = this.scrollgap || 1e3

    const X = this._xScroll(this._targetNode)
    const Y = this._yScroll(this._targetNode)
    // get unified scroll positions

    const { scrollTop: top, scrollHeight: height } = this._targetNode
    // use container scroll in case that there is no user scroll on load

    const contentLoaded = top !== height
    // initial render has 0/0

    if (!contentLoaded) return
    // skip scrolling on empty children

    const onEdge = this.reverse ? top === height : top === 0
    // bottom 4 generic list; top 4 reversed list

    const withinGap = !this.enablegap
      ? true // should scroll every time if gap is disabled
      : (
        this.reverse
          ? (Y.current < gap)
          : ((Y.max - Y.current) < gap)
      );

    (
      onEdge // follow the edge when content is loading
      || withinGap // autoscroll when user is watching latest messages
    ) && this._scrollTo(Number(X.current), Number(Y.max))
  }

  _scrollTo (x, y) {
    const el = this._targetNode
    if (typeof x !== 'number' || typeof y !== 'number') return

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

