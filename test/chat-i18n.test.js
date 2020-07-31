import { fixture, html } from '@open-wc/testing';
import '../src/chat-i18n.index.js';

describe('chat-i18n-test', () => {
  it('works', async () => {
    const el = await fixture(
      html`
        <wc-chat></wc-chat>
      `,
    ); // eslint-disable-line no-unused-vars
  });
});
