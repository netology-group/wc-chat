import { fromEvent } from 'most/src/source/fromEvent.js';
import { LitElement, html } from 'lit-element';
import compose from 'ramda/es/compose.js';

import { withStyle } from '../mixins/with-style.js';
import { debug as Debug, requestAnimation } from '../utils/index.js';
import { observeC as observe, throttleC as throttle } from '../utils/most.js';

import { style } from './scrollable.css.js';

const debug = Debug('@ulms/wc-chat/ScrollableElement');

const DELTA = 20;
const THROTTLE_RESIZE = 33;
const THROTTLE_DELAY = 33;
const THROTTLE_SCROLL = 14;

const xSym = Symbol('x');
const ySym = Symbol('y');

const isNumber = it => typeof it === 'number';

const scrollTo = (el, [x, y]) => {
  if (!el.scrollTo) {
    el.scrollLeft = x; // eslint-disable-line no-param-reassign
    el.scrollTop = y; // eslint-disable-line no-param-reassign
  } else {
    el.scrollTo(x, y);
  }
};

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

const delaySym = Symbol('delay');
const delayresizeSym = Symbol('delayresize');
const delayscrollSym = Symbol('delayscroll');

export const wasAtHeadSym = Symbol('wasAtHead');

export class _ScrollableElement extends LitElement {
  static get properties() {
    return {
      delay: { type: Number },
      delayresize: { type: Number },
      delayscroll: { type: Number },
      freeze: { type: Boolean },
      listen: String,
      omni: { type: Boolean },
      scrolltarget: String,
    };
  }

  constructor() {
    super();

    this.__manual = false;

    this[ySym] = undefined;
    this[xSym] = undefined;
    // _x & _y

    this[delaySym] = undefined;
    this[delayresizeSym] = undefined;
    this[delayscrollSym] = undefined;
    this._detached = false;
    this[wasAtHeadSym] = undefined;

    this._height = 0;
    this._width = 0;
  }

  get _rootDocument() {
    return this.ownerDocument;
  }

  get _rootElement() {
    return !this.shadowRoot ? undefined : this.shadowRoot;
  }

  get _scrollable() {
    return this._rootElement
      ? this._rootElement.querySelector(`${this.scrolltarget || '#scrollable'}`)
      : this._rootElement;
  }

  get _isTarget() {
    return this._scrollable instanceof HTMLElement;
  }

  get _x() {
    return this[xSym] ? this[xSym] : this._scrollable.scrollLeft;
  }

  set _x(x = 0) {
    this[xSym] = x;
  }

  get _y() {
    return this[ySym] ? this[ySym] : this._scrollable.scrollHeight;
  }

  set _y(y = 0) {
    if (typeof y !== 'number') return;

    const shift = Math.abs(this._y - y);

    this.__manual = this._y !== 0 && this._scrollMinMax(shift);
    /**
     * separate manual scroll from scroll done by the script:
     * - shift might be equal to zero but has non-zero value
     * - shift is in range
     */

    this[ySym] = y;
  }

  scrollTo(x, y) {
    this.__scrollTo(isNumber(x) ? x : 0, isNumber(y) ? y : this._scrollable.scrollHeight);
  }

  // eslint-disable-next-line class-methods-use-this
  _scrollMinMax(shift, min = 1, max = DELTA) {
    return shift === 0 || (shift >= min && shift <= max);
    /**
     * 2 scenarious:
     * - shift is in range (generic scrolling)
     * - zero shift means that user wanna stay on the same position
     */
  }

  firstUpdated() {
    const {
      delay = THROTTLE_DELAY,
      delayresize = THROTTLE_RESIZE,
      delayscroll = THROTTLE_SCROLL,
    } = this;

    this[delaySym] = Number(delay);
    this[delayresizeSym] = Number(delayresize);
    this[delayscrollSym] = Number(delayscroll);

    if (!this._isTarget) {
      // eslint-disable-next-line no-console
      console.error('Target is not a valid HTMLElement');
      return;
    }

    // eslint-disable-next-line no-unused-expressions
    this.listen &&
      compose(
        observe(e => this._onChildrenUpdate(e)),
        throttle(this[delaySym]),
      )(fromEvent(this.listen, this._scrollable, true));

    compose(
      observe(e => this._onResizeHandler(e)),
      throttle(this[delayresizeSym]),
    )(fromEvent('resize', this._rootDocument.defaultView));

    /* eslint-disable function-paren-newline */
    compose(
      observe(e => this._onScrollHandler(e)),
      throttle(this[delayscrollSym]),
    )(fromEvent('scroll', this._scrollable));
    /* eslint-enable function-paren-newline */
  }

  _shouldThrowSeekEvents(position) {
    const { frameHeight, height, top } = position;

    const frameHead = top + frameHeight;
    const atHead = frameHead === height;
    const atTail = top === 0;

    // seek before
    if (atTail) {
      debug('Seek before');
      this.dispatchEvent(new CustomEvent('seek-before'));
    }

    // seek after
    if (this.omni && atHead) {
      debug('Seek after');
      this.dispatchEvent(new CustomEvent('seek-after'));
    }
  }

  _defineCoordinates(position) {
    // eslint-disable-next-line array-element-newline, array-bracket-newline
    const [x, y, width, height] = position;

    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
  }

  _onResizeHandler() {
    debug('onResize');
    this.__handleScroll(this._scrollable);
  }

  _onScrollHandler(e) {
    debug('onScroll');
    this.__handleScroll(e.currentTarget);
  }

  _onChildrenUpdate(e) {
    debug('onUpdate');
    this._shouldScrollTo(e, e.detail.direction);
  }

  _yScroll(el) {
    const { scrollTop: top, scrollHeight: height } = el;

    return {
      height,
      top,
      prevTop: this._y,
      prevHeight: this._height,
    };
  }

  _xScroll(el) {
    const { scrollLeft: left, scrollWidth: width } = el;

    return {
      left,
      width,
      prevLeft: this._x,
      prevWidth: this._width,
    };
  }

  /**
   * Update position on scroll
   *
   * @function __handleScroll
   * @param  {} target
   * @return {} undefined
   */
  __handleScroll(target) {
    const { scrollLeft, scrollTop, scrollWidth, scrollHeight, offsetHeight } = target;

    this._defineCoordinates([scrollLeft, scrollTop, scrollWidth, scrollHeight]);

    this._shouldThrowSeekEvents({
      frameHeight: offsetHeight,
      height: scrollHeight,
      top: scrollTop,
    });
  }

  __shouldScrollByYAxis(params, changed, prevParams) {
    const { direction, top, viewHeight } = changed;

    let prevHead = prevParams.height - prevParams.top - viewHeight;

    prevHead = prevHead < 0 ? 0 : prevHead;
    // got value below zero on initial render (prevPrams.height == 0)

    if (prevParams.height === 0) return params.height;
    // scroll to top/bottom on initial render

    if (this.freeze) return top;
    // preserve top position if is freezed

    const _wasAtHead = prevParams.height - viewHeight === prevParams.top;

    this[wasAtHeadSym] = _wasAtHead;

    const atZero = top === 0;
    // means that user is seeing the top message ↑

    if (prevParams.height !== 0 && atZero) return top;
    // preserve position on top unless initial render

    if (direction === -1) return params.height - prevHead;
    // calculate top position according the previous distance
    //  between hight (head) and current position

    const result = _wasAtHead ? params.height - viewHeight : prevParams.top;
    // preserve current position unless user is near the latest message

    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  __shouldScrollByXAxis(params, changed, prevParams) {
    debug('calcX', params, prevParams, changed);

    return params.left;
  }

  _shouldScrollTo(e, direction = 0) {
    /**
     * At the moment `Y.height` and `this._height` are not the same.
     * - `Y.height` is equal to the new container height (new message has been appended already)
     * - `this._height` is equal to the old container height (
     *  before new element was appended and no scroll behaviour has been present
     * )
     */
    const X = this._xScroll(this._scrollable);
    const Y = this._yScroll(this._scrollable);
    const { offsetHeight } = this._scrollable;

    debug('XY x:', X, 'y:', Y);

    if (Y.top === Y.height || Y.height === Y.prevHeight) return debug('Skip scrolling');
    // skip scrolling on empty children (initial render might has 0/0 or equal values)

    const y = this.__shouldScrollByYAxis(
      { height: Y.height, top: Y.top },
      {
        direction,
        top: Y.top,
        viewHeight: offsetHeight,
      },
      { height: Y.prevHeight, top: Y.prevTop },
    );
    const x = this.__shouldScrollByXAxis(
      { left: X.left, width: X.width },
      { left: X.left, viewHeight: offsetHeight },
      { left: X.prevLeft, width: X.prevWidth },
    );

    return this.__scrollTo(x, y);
  }

  __scrollTo(x, y) {
    debug('Maybe scroll to:', x, y);

    if (!isNumber(x) || !isNumber(y)) {
      // eslint-disable-next-line no-console
      console.error('Wrong coordinate type');
      return;
    }

    requestAnimation(() => scrollTo(this._scrollable, [x, y]));
  }

  // eslint-disable-next-line class-methods-use-this
  render() {
    return html`
      <div class="wrapper">
        <div class="scrollable" id="scrollable">
          <div class="inner">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
}

export const ScrollableElement = withStyle()(_ScrollableElement, style);
