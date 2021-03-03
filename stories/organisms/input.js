/* eslint-disable no-console */
import { html } from '@open-wc/demoing-storybook'; // eslint-disable-line import/no-extraneous-dependencies

export const input = () => html`
  <wc-chat-input
    placeholder="Awaits input"
    placeholderdisabled="Disabled"
    preprocessors="strict"
    @message-submit=${e => {
      console.info(e.detail.message);
    }}
  ></wc-chat-input>
`;

export const inputDisabled = () => html`
  <wc-chat-input
    disabled="disabled"
    placeholder="Awaits input"
    placeholderdisabled="Disabled"
  ></wc-chat-input>
`;
