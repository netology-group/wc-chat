import { html } from '@open-wc/demoing-storybook'; // eslint-disable-line import/no-extraneous-dependencies

import '../../src/n-slot-manager.index.js';

export const imElement = ([messages, users]) => html`
  <wc-chat
    delayrender="1.1e3"
    delayresize="400"
    delayupdate="200"
    disablerecentbanner="1"
    language="en-US"
    placeholder="Awaits input"
    placeholderdisabled="Disabled"
    scrollabledisabled
    user="3"
    .users=${users}
    .list=${messages}
  ></wc-chat>
`;

// eslint-disable-next-line no-unused-vars
export const imWithFiltersElement = ([list, users, user = '3'] = []) => html`
  <wc-chat-filtered language="ru" quantity="1">
    <wc-chat
      delayrender="1.1e3"
      delayresize="400"
      delayupdate="200"
      disablerecentbanner="1"
      language="en-US"
      placeholder="Awaits input"
      placeholderdisabled="Disabled"
      scrollabledisabled
      user=${user}
      .users=${users}
      .list=${[]}
    />
  </wc-chat-filtered>
`;
