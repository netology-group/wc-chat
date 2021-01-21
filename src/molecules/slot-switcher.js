import { html } from 'lit-element';

import { arrowLeft as lasvg, pin as pinsvg } from '../images/index.js';

export const slotSwitcher = (quantity, text, active, handleClick) => {
  let inner;

  const q = parseInt(quantity);

  if (isNaN(q) || q === 0) {
    inner = undefined;
  } else if (!active) {
    inner = html`
      <div class="inner">
        <button class="link" type="button" @click=${handleClick}>
          <i class="svg pin">${pinsvg}</i>${text}
        </button>
      </div>
    `;
  } else {
    inner = html`
      <div class="inner">
        <button class="link" type="button" @click=${handleClick}>
          <i class="svg left-arrow">${lasvg}</i> Назад к чату
        </button>
      </div>
    `;
  }

  return html`
    <div class="slot-switcher">${inner}</div>
  `;
};
