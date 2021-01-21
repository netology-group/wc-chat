import { html } from '@open-wc/demoing-storybook'; // eslint-disable-line import/no-extraneous-dependencies

import { avatarUrl } from '../mocks.js';

export const message = (text = '') => html`
  <wc-chat-message
    image="${avatarUrl}"
    parser="markdown"
    parserpreset="strict"
    text="${text}"
    theme="gray"
    timestamp="${Date.now()}"
    user_role="user"
    username="Marco Polo"
  ></wc-chat-message>
`;

export const messageWithPin = (text = '') => html`
  <wc-chat-message
    image="${avatarUrl}"
    parser="markdown"
    parserpreset="strict"
    pinned
    text="${text}"
    theme="gray"
    timestamp="${Date.now()}"
    user_role="user"
    username="Marco Polo"
  ></wc-chat-message>
  <br />
  <wc-chat-message
    image="${avatarUrl}"
    parser="markdown"
    parserpreset="strict"
    pinned
    text="${text}"
    theme="red"
    timestamp="${Date.now()}"
    user_role="user"
    icon="man"
    username="Marco Polo"
  ></wc-chat-message>
`;
