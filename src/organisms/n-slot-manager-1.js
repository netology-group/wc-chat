import { html, LitElement } from 'lit-element';

import { slotSwitcher as view } from '../molecules/slot-switcher.js';
import { style } from '../molecules/slot-switcher.css.js';

export class NSlotManagerElement extends LitElement {
  static get properties() {
    return {};
  }

  constructor() {
    super();

    // this.attachShadow({ mode: 'open' });
    this._filterActive = false;
    this._quantity = 0;
    this._text = '';
  }

  get quantity() {
    return this._quantity;
  }

  set quantity(value) {
    this._quantity = isNaN(parseInt(value)) ? 0 : parseInt(value);
    this.setAttribute('quantity', String(this._quantity));

    // this.render();
  }

  get text() {
    return this._text;
  }

  set text(value) {
    this._text = value;
    this.setAttribute('text', value);

    // this.render();
  }

  connectedCallback() {
    this.quantity = this.getAttribute('quantity');
    this.text = this.getAttribute('text');
  }

  _handleViewChange() {
    this._filterActive = !this._filterActive;

    // this.render();
  }

  template() {
    const { _filterActive: active, _handleViewChange: handleChange } = this;

    return html`
      <style>
        ${style}
      </style>
      ${view(this.quantity, this.text, active, handleChange)}
    `;
  }

  render() {
    const { _filterActive: active } = this;

    // render(this.template(), this.shadowRoot, { eventContext: this });

    const hasSlot = this.shadowRoot.querySelector('slot');

    if (hasSlot) {
      const [slotChild] = hasSlot.assignedNodes();

      if (slotChild && slotChild.children[0]) {
        if (active) {
          slotChild.children[0].setAttribute('filters', 'pinned=1');
        } else {
          slotChild.children[0].removeAttribute('filters');
        }
      }
    }

    return this.template();
  }
}
