import { html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

export const messageBody = (message, { unsafe }) =>
  unsafe
    ? html`
        ${unsafeHTML(message)}
      `
    : html`
        <p>${message}</p>
      `;
