import { html } from 'lit-element';
import cs from 'classnames-es';

import { readableTime } from '../utils/index.js';
import { blocked as blockedsvg, human as humansvg } from '../images/index.js';

export const icon = ({ name }) => {
  switch (name) {
    case 'man':
      return humansvg;

    case 'blocked':
      return blockedsvg;
    default:
      return undefined;
  }
};

export const meta = ({ classname, icon: iconname, identity, timestamp, username } = {}) => {
  const [dateortime, fulldate] = readableTime(timestamp);

  return html`
    <div class=${cs({ meta: true, [classname]: classname })}>
      <span class="author" title=${identity || username}>${username}</span>
      ${iconname
        ? html`
            <span class="icon">${icon({ name: iconname })}</span>
          `
        : undefined}
      ${dateortime
        ? html`
            <span class="stamp"><span title=${fulldate}>${dateortime}</span></span>
          `
        : undefined}
    </div>
  `;
};
