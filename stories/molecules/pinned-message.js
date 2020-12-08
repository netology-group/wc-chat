import { html } from '@open-wc/demoing-storybook'; // eslint-disable-line import/no-extraneous-dependencies

import { avatarUrl } from '../mocks.js';

export const message = (text = '') => html`
  <wc-chat-message-pinned
    image="${avatarUrl}"
    parser="markdown"
    parserpreset="strict"
    text="${text}"
    theme="gray"
    timestamp="${Date.now()}"
    user_role="user"
    username="Marco Polo"
  ></wc-chat-message-pinned>
`;

export const messageWithAction = (text = '') => html`
  <wc-chat-message-pinned
    image="${avatarUrl}"
    parser="markdown"
    parserpreset="strict"
    text="${text}"
    theme="gray"
    timestamp="${Date.now()}"
    user_role="user"
    username="Marco Polo"
  >
    <div slot="message-prologue">
      <div class="actions-group"></div>
    </div>
  </wc-chat-message-pinned>
`;
