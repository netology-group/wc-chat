import { html } from '@open-wc/demoing-storybook'; // eslint-disable-line import/no-extraneous-dependencies

export const imElement = ([messages, users]) => html`
  <wc-chat
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
