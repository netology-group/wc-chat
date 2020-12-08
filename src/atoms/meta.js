import { html } from 'lit-element';
import cs from 'classnames-es';

import { readableTime } from '../utils/index.js';
import { blocked as blockedsvg, human as humansvg, pin as pinsvg } from '../images/index.js';

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

const icons = ({ name, pinned }) => {
  const statusIcon = name
    ? html`
        <span class="icon">${icon({ name })}</span>
      `
    : undefined;

  return !pinned
    ? statusIcon
    : html`
        <span class="icon">${pinsvg}</span>
        ${statusIcon}
      `;
};

export const meta = ({ classname, icon: iconname, identity, pinned, timestamp, username } = {}) => {
  const [dateortime, fulldate] = readableTime(timestamp);

  return html`
    <div class=${cs({ meta: true, [classname]: classname })}>
      <span class="author" title=${identity || username}>${username}</span>
      ${icons({ name: iconname })}
      ${dateortime
        ? html`
            <span class="stamp"><span title=${fulldate}>${dateortime}</span></span>
          `
        : undefined}
      ${icons({ pinned })}
    </div>
  `;
};
