import { html, LitElement } from '@polymer/lit-element'

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

    this.__boundScrollHandler = this._onScrollHandler.bind(this)
  }

  get _targetNode () {
    return !this.shadowRoot ? null : this.shadowRoot.querySelector(`${this.scrolltarget || '.scrollable'}`)
  }

  get _isTarget () {
    return this._targetNode instanceof HTMLElement
  }

  invokeUpdate () {
    this.hasAttribute('watch') && this._shouldScrollTo()
  }

  disconnectedCallback () {
    if (!this._isTarget) return

    this.hasAttribute('listen') && this._targetNode.removeEventListener(this.listen, this._onChildrenUpdate.bind(this), true)
  }

  _firstRendered () {
    if (!this._isTarget) return

    this.hasAttribute('listen') && this._targetNode.addEventListener(this.listen, this._onChildrenUpdate.bind(this), true)
  }

  _onScrollHandler (e) { } // eslint-disable-line class-methods-use-this,no-unused-vars

  _onChildrenUpdate (e) {
    this._shouldScrollTo(e)
  }

  _shouldScrollTo (e) { // eslint-disable-line no-unused-vars
    const gap = this.scrollgap || 666
    // pixel gap
    const {
      scrollTop: top, scrollLeft: left, scrollHeight: height,
    } = this._targetNode

    const contendLoaded = top !== height
    // initial render has 0/0

    if (!contendLoaded) return
    // skip scrolling on empty children

    const onEdge = this.reverse ? top === height : top === 0
    // bottom 4 generic list; top 4 reversed list
    const withinGap = this.enablegap
      ? this.reverse ? gap > top : (top > height - gap)
    // between 0 and gap 4 generic list; between height and height-gap
      : true;
    // scroll on every update

    (
      onEdge // follow the edge when content is loading
      || withinGap // autoscroll when user is watching latest messages
    ) && this._scrollTo(left, this.reverse ? 0 : height)
  }

  _scrollTo (l, t) {
    const { scrollLeft, scrollHeight } = this._targetNode
    const left = typeof l !== 'undefined' ? l : scrollLeft
    const top = typeof t !== 'undefined' ? t : scrollHeight

    this._targetNode.scrollTo(left, top)
  }

  _render () {
    return html`
      <style>
        :host{
          height: 100%;
        }
        .scrollable{
          height: 100%;
          overflow-y: scroll;
        }
      </style>
      <div class="scrollable" on-scroll="${this.__boundScrollHandler}">
        ${this.children}
      </div>
    `
  }
}

