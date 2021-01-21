import { html } from '@open-wc/demoing-storybook'; // eslint-disable-line import/no-extraneous-dependencies

export const messages = ([list = [], user = '3'] = []) => html`
  <wc-chat-messages
    .actions=${[['message-delete', 100], ['message-pin', 100], ['message-unpin', 100]]}
    .aggregateperinterval=${60}
    .i18n=${window.IntlMessageFormat}
    .list=${list}
    .parserengine=${window.markdownit}
    .users=${[]}
    @message-delete=${() => alert('message deleted')}
    @message-pin=${() => alert('message-pin')}
    @message-unpin=${() => alert('message-unpin')}
    @user-disable=${() => alert('disable user')}
    pagesize=${15}
    parser="markdown"
    parserpreset="strict"
    parserrules=""
    user=${user}
  />
`;
