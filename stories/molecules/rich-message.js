import { html } from '@open-wc/demoing-storybook'; // eslint-disable-line import/no-extraneous-dependencies

import { avatarUrl, _richMessages } from '../mocks.js';

export const messages = () => html`
  ${_richMessages.map(
    ({ body: text }) => html`
      <wc-chat-message
        .parserengine=${globalThis.markdownit}
        image="${avatarUrl}"
        parser="markdown"
        parserpreset="strict"
        text="${text}"
        theme="gray"
        timestamp="${Date.now()}"
        user_role="user"
        username="Marco Polo"
      ></wc-chat-message>
      <br />
    `,
  )}
`;
