import { LitElement, html } from 'lit-element';
import cs from 'classnames-es';

import { mapToJSON } from '../utils/index.js';
import { style } from './reactions.css.js';
import { withStyle } from '../mixins/with-style.js';
import emojiJSON from '../misc/emoji.json.js'; // eslint-disable-line import/extensions

export class _ReactionsElement extends LitElement {
  static get properties() {
    return {
      config: Map,
      direction: String,
      displayname: String,
      showcount: Boolean,
      showall: Boolean,
    };
  }

  constructor() {
    super();

    this.emoji = {
      get(name) {
        return emojiJSON[String(name).replace(/:/g, '')];
      },
    };

    this.config = new Map();
    this.direction = 'row';
    this.displayname = 'reactions';
    this.showall = false;
    this.showcount = false;

    this._handleClickBounded = this._handleClick.bind(this);
  }

  _renderIcon(data) {
    return data.icon
      ? html`
          <img alt=${data.name} src=${data.icon} />
        `
      : this.emoji.get(data.name);
  }

  _handleClick(e) {
    this.dispatchEvent(
      new CustomEvent(`${this.displayname}-toggle`, {
        detail: { reaction: e.currentTarget.getAttribute('name') },
      }),
    );
  }

  _renderAll(config) {
    return mapToJSON(config).map(_ => this._renderEach(_));
  }

  _renderEach([k, v]) {
    const { showall, showcount } = this;

    const count = Number(v.count || 0);
    const shouldRender = count || showall;
    const shouldCount = count > 0 && showcount;

    return !shouldRender
      ? undefined
      : html`
          <div class="icon" name=${k} @click=${this._handleClickBounded}>
            <span>${this._renderIcon(v)}</span>
            ${shouldCount
              ? html`
                  <span class="count">${count}</span>
                `
              : undefined}
          </div>
        `;
  }

  render() {
    const { config, direction } = this;

    return html`
      <div class=${cs({ icons: true, vertical: direction === 'column' })}>
        ${this._renderAll(config)}
      </div>
    `;
  }
}

export const ReactionsElement = withStyle()(_ReactionsElement, style);
