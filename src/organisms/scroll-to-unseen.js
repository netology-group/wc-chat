import { html } from 'lit-element';
import cs from 'classnames-es';

import { debug as Debug, requestAnimation } from '../utils/index.js';
import { withStyle } from '../mixins/with-style.js';
import { arrowDown as arrowDownSvg } from '../images/index.js';

import { _ScrollableElement } from './scrollable.js';
import { style } from './scrollable.css.js';
import { style as styleUnseen } from './scroll-to-unseen.css.js';

const debug = Debug('@ulms/wc-chat/ScrollableUnseenElement');

const freshBanner = ({ active, i18n, onClick }) => {
  const cname = cs({
    banner: true,
    new: true,
    top: true,
    inactive: !active,
  });

  return html`
    <div class=${cname} @click=${!active ? undefined : onClick}>
      <div class="row">
        <div>${i18n.NEW_MESSAGES_COUNT}</div>
        <div class="action">
          ${i18n.SEE}
          <span class="icon">${arrowDownSvg}</span>
        </div>
      </div>
    </div>
  `;
};

const recentBanner = ({ active, i18n, onClick }) => {
  const cname = cs({
    banner: true,
    recent: true,
    bottom: true,
    inactive: !active,
  });

  return html`
    <div class=${cname} @click=${!active ? undefined : onClick}>
      ${i18n.GO_TO_RECENT_MESSAGE}
      <span class="icon">${arrowDownSvg}</span>
    </div>
  `;
};

export { wasAtHeadSym } from './scrollable.js';

export class _ScrollableUnseenElement extends _ScrollableElement {
  static get properties() {
    return {
      ...super.properties,
      disablerecentbanner: { type: Boolean },
      disableunseenbanner: { type: Boolean },
      i18n: { type: Object },
      showbannernew: { type: Boolean },
      unseenSelector: String,
    };
  }

  constructor() {
    super();

    this._detached = undefined;
  }

  _updateDetachedValue(element) {
    const { offsetHeight, scrollTop, scrollHeight } = element;

    const newDetachedValue = scrollHeight - scrollTop > offsetHeight;

    if (!newDetachedValue) {
      debug('Changed last-seen');
      this.dispatchEvent(new CustomEvent('last-seen-change'));
    }

    if (newDetachedValue !== this._detached) {
      this._detached = newDetachedValue;

      requestAnimation(() => this.requestUpdate());
    }
  }

  __scrollToUnseen() {
    const slot = this._scrollable.querySelector('slot');
    const [child] = slot.assignedElements();

    const unseenEl =
      child && child.shadowRoot ? child.shadowRoot.querySelector(this.unseenSelector) : undefined;

    if (!unseenEl) {
      debug('Unseen element is absent');

      return;
    }

    const nextPoint = [0, unseenEl.offsetTop - this._scrollable.offsetHeight / 2];

    requestAnimation(() => this.__scrollTo(...nextPoint));
  }

  _onScrollHandler(e) {
    super._onScrollHandler(e);

    this._updateDetachedValue(e.currentTarget);
  }

  _onChildrenUpdate(e) {
    super._onChildrenUpdate(e);

    if (e.currentTarget) {
      this._updateDetachedValue(e.currentTarget);
    }
  }

  render() {
    const { disablerecentbanner = false, disableunseenbanner = false, showbannernew } = this;

    return html`
      <div class="wrapper">
        <div class="scrollable" id="scrollable">
          <div class="inner">
            <slot></slot>
          </div>
        </div>
        ${disableunseenbanner
          ? undefined
          : freshBanner({
              active: Boolean(this._detached && showbannernew),
              i18n: this.i18n,
              onClick: () => this.__scrollToUnseen(),
            })}
        ${disablerecentbanner
          ? undefined
          : recentBanner({
              active: Boolean(this._detached && showbannernew),
              i18n: this.i18n,
              onClick: () => this.scrollTo(),
            })}
      </div>
    `;
  }
}

export const ScrollableUnseenElement = withStyle()(_ScrollableUnseenElement, style, styleUnseen);
