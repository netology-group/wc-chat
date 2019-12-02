import { html } from 'lit-element';
import cs from 'classnames-es';

export const section = ({ body, cname }) => html`
  <section class=${cs({ section: true, [cname]: cname })}>
    <div class="body">${body}</div>
  </section>
`;
