import { html } from 'lit-element';

import { entry as entrysvg } from '../images/index.js';

export const button = ({ children, disabled, type = 'button' } = {}) => html`
  <button .disabled=${disabled} class="enter" type=${type}>
    ${children && children.length ? children : entrysvg}
  </button>
`;
