import { html } from 'lit-element';
import cs from 'classnames-es';

const isTruthy = a => Boolean(a);

export const separator = ({ className, text }) => html`
  <div class=${cs({ separator: true, [className]: className })}>
    <hr />
    <span>${text}</span>
  </div>
`;

export const slot = ({ id, text }) => html`
  <div slot=${`message-${id}`} class="messages-separator">
    ${separator({ text })}
  </div>
`;

export const maybeSeparator = props => {
  const { enabled, ...p } = props;

  return isTruthy(enabled) ? slot(p) : undefined;
};
