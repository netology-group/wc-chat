import { LitElement, html } from 'lit-element';

import { resolveLanguage } from '../utils/resolve-language.js';
import i18n from '../i18n.js';

export class ChatFilteredElement extends LitElement {
  static get properties() {
    return {
      quantity: { type: Number },
    };
  }

  constructor() {
    super();

    // this.attachShadow({ mode: 'open' });
    this._filtersActive = false;
    this._i18n = undefined;
    this._lexicon = new Map([]);

    this._i18nEngine = this.ownerDocument.defaultView.IntlMessageFormat;
    this._language = 'en-US';
    this._quantity = 0;
  }

  /* static get observedAttributes() {
    return ['quantity'];
  } */

  get I18ne() {
    return this._i18nEngine;
  }

  set I18ne(engine) {
    if (engine) this._i18nEngine = engine;
  }

  get language() {
    return this._language;
  }

  set language(value) {
    const prev = this._language;
    const next = value;

    if (prev !== value) {
      this._i18n = undefined;
      this._lexicon = undefined;

      const lexiconLang = resolveLanguage(this.ownerDocument.defaultView, this.I18ne, i18n, next);

      this._lexicon = new Map([
        ['pinned', new this.I18ne(i18n[lexiconLang].PIN_MESSAGES_COUNT, lexiconLang)],
      ]);
    }

    this.setAttribute('language', next);
    this._language = next;
  }

  get quantity() {
    return this._quantity;
  }

  set quantity(value) {
    this._quantity = isNaN(parseInt(value)) ? 0 : parseInt(value);
  }

  /* attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal !== newVal) {
      switch (name) {
        case 'quantity':
          this.quantity = newVal;
          break;

        default:
      }
    }
  } */

  /* update() {
    // render(this.template(), this.shadowRoot, { eventContext: this, scopeName: this.tagName.toLowerCase() });
  } */

  connectedCallback() {
    this.I18ne = this.ownerDocument.defaultView.IntlMessageFormat;
    this.language = this.getAttribute('language');
    this.quantity = this.getAttribute('quantity');

    this.shadowRoot.addEventListener(
      'chat-pinned-update',
      e => {
        const {
          detail: { count: quantity = 0 },
        } = e;

        if (this.quantity !== quantity) {
          this.setAttribute('quantity', quantity);
        }
      },
      true,
    );
  }

  /* eslint-disable */
  __template() {
    /* const text = this._lexicon.has('pinned')
      ? this._lexicon.get('pinned').format({ count: q })
      : '';
    */

    // <!--n-slot-manager quantity="${q}" text="${text}" /-->

    return html`
      <style>
        :host {
          display: block;
          height: 100%;
        }
        :host div[slot='filtered-view'] {
          height: inherit;
        }
      </style>
      <div slot="filtered-view">
        <wc-chat
          id="messenger"
          parser="markdown"
          parserpreset="strict"
          placeholder="Write something…"
          placeholderdisabled="Chat is blocked now"
        />
      </div>
    `;
  }
  /* eslint-enable */

  render() {
    return this.__template();
  }
}
