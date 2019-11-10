import { css } from 'lit-element';

export const style = css`
  /* stylelint-disable selector-type-no-unknown */
  wc-chat-reactions {
    --reaction-count-left: 0;
  }

  :host {
    --message-avatar-margin: 8px;
    --message-avatar-size: 32px;
    --message-border-radius: 5px;
    --message-color-deleted-hover: var(--chat-message-color-deleted-hover, #eeeeeeb3);
    --message-color-deleted: var(--chat-message-color-watchdog, var(--gallery, #eee));
    --message-color-hover: var(--chat-message-color-hover, #ffffff80);
    --message-color-me-hover: var(--chat-message-color-me-hover, #ebf2f7b3);
    --message-color-me: var(--chat-message-color-me, var(--cornflowerBlue, #ebf2f7));
    --message-color-watchdog-hover: var(--chat-message-color-watchdog-hover, #faefebb3);
    --message-color-watchdog: var(--chat-message-color-watchdog, var(--whiteLinen, #faefeb));
    --message-status-color: var(--chat-message-status-color, var(--silver, #b8b8b8));

    display: block;
  }

  :host .inner .avatar {
    float: left;
    margin-right: var(--message-avatar-margin);
    overflow: hidden;
    user-select: none;
    vertical-align: top;
    width: var(--message-avatar-size);
  }

  :host .inner .avatar > div:first-child {
    background: no-repeat center center;
    background-color: var(--message-avatar-color-moderator, transparent);
    background-size: contain;
    border-radius: 100%;
    height: var(--message-avatar-size);
    width: var(--message-avatar-size);
  }

  :host .inner.theme-red .avatar {
    background-color: var(--message-avatar-color, transparent);
  }

  :host .inner.aggregated .avatar {
    height: 1px;
    visibility: hidden;
  }

  :host .content {
    background-color: #fff;
    border-radius: var(--message-border-radius);
    box-sizing: border-box;
    display: inline-block;
    padding: 8px 16px 8px 14px;
    text-align: left;
    width: calc(100% - var(--message-avatar-size) - var(--message-avatar-margin));
  }

  :host .content > [class^='actions'] {
    opacity: 0;
  }

  :host .content:hover > [class^='actions'] {
    opacity: 1;
  }

  :host .inner.aggregated .content {
    border-radius: var(--message-border-radius);
  }

  :host .inner.deleted .avatar,
  :host .inner.deleted .content {
    filter: grayscale(75%);
  }

  :host .inner.deleted .content {
    background: var(--message-color-deleted);
  }

  :host .inner.me .content {
    background-color: var(--message-color-me);
  }

  :host .inner.theme-red .content {
    background-color: var(--message-color-watchdog);
  }

  :host .inner:hover .content {
    background-color: var(--message-color-hover);
  }

  :host .inner.deleted:hover .content {
    background: var(--message-color-deleted-hover);
  }

  :host .inner:hover.me .content {
    background-color: var(--message-color-me-hover);
  }

  :host .inner:hover.theme-red .content {
    background-color: var(--message-color-watchdog-hover);
  }

  /** Meta */

  :host .meta {
    display: flex;
    line-height: 19px;
    padding-bottom: 5px;
  }

  :host .meta .author,
  :host .meta .icon,
  :host .meta .stamp {
    vertical-align: top;
  }

  :host .meta .author {
    font-weight: bold;
    padding-right: 8px;
  }

  :host .meta .icon {
    padding-right: 8px;
  }

  /* stylelint-disable-next-line no-duplicate-selectors */
  :host .meta .author {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :host .meta .stamp {
    color: var(--message-status-color);
    padding-right: 15px;
  }

  :host .meta .stamp > span {
    font-size: 0.75em;
  }

  /** /Meta */

  /** Markdown */

  :host .body {
    line-height: 19px;
    overflow-wrap: anywhere;
    padding-bottom: 5px;
    padding-right: 24px;
    word-break: break-word;
  }

  :host .body h1,
  :host .body h2 {
    margin-bottom: 7px;
    margin-top: 5px;
  }

  :host .body h3,
  :host .body h4,
  :host .body h5,
  :host .body h6 {
    margin-bottom: 5px;
    margin-top: 3px;
  }

  :host .body p,
  :host .body ol,
  :host .body ul {
    margin: 0;
    padding: 0;
  }

  :host .body p {
    display: inline-block;
    white-space: pre-line;
    word-break: break-word;
  }

  :host .body p + p {
    display: block;
  }

  :host .body ol,
  :host .body ul {
    display: inline-block;
    padding-left: 10px;
  }

  :host .body pre {
    overflow-x: scroll;
  }

  :host .body pre > code {
    background-color: #e8e2e2;
    border: 1px solid #c7c1c1;
    border-radius: var(--message-border-radius);
    display: inline-block;
    padding: 5px 10px;
  }

  :host .body p > code {
    background-color: #e8e2e2;
    border: 1px solid #d6cbcb;
    border-radius: var(--message-border-radius);
    color: #ff732b;
    padding: 0 2px;
  }

  /** blockquote */

  :host .body blockquote {
    margin: 0;
    margin-bottom: 5px;
    position: relative;
  }

  :host .body blockquote::before {
    border-left: 5px solid #c6c6c66c;
    border-radius: var(--message-border-radius);
    box-sizing: border-box;
    content: ' ';
    height: 100%;
    margin: 0;
    position: absolute;
  }

  :host .body blockquote p {
    margin-left: 15px;
  }

  :host .section.parser-markdown .body blockquote {
    white-space: normal;
  }

  /** /blockquote */

  :host .section.parser-markdown .body pre {
    white-space: normal;
  }

  :host .section.parser-markdown .body pre code {
    white-space: pre;
  }

  /** /Markdown */
`;
