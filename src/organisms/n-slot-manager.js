import { html } from 'lit-element';
import { render } from 'lit-html';

import { slotSwitcher as view } from '../molecules/slot-switcher.js';
import { style } from '../molecules/slot-switcher.css.js';

export class NSlotManagerElement extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
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
    this.render();
  }

  get text() {
    return this._text;
  }

  set text(value) {
    this._text = value;
    this.setAttribute('text', value);
    this.render();
  }

  connectedCallback() {
    this.quantity = this.getAttribute('quantity');
    this.text = this.getAttribute('text');
  }

  _handleViewChange() {
    this._filterActive = !this._filterActive;
    this.render();
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

    render(this.template(), this.shadowRoot, { eventContext: this });

    const [slotChild] = this.shadowRoot.querySelector('slot').assignedNodes();

    if (slotChild && slotChild.children[0]) {
      if (active) {
        slotChild.children[0].setAttribute('filters', 'pinned=1');
      } else {
        slotChild.children[0].removeAttribute('filters');
      }
    }
  }
}
