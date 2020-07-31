import { fixture, html } from '@open-wc/testing';

import { ChatElement } from '../src/ecosystems/chat.js';

customElements.define('wc-chat-test', ChatElement);

describe('chat-test', () => {
  it('works', async () => {
    const el = await fixture(
      html`
        <wc-chat-test></wc-chat-test>
      `,
    ); // eslint-disable-line no-unused-vars
  });
});
