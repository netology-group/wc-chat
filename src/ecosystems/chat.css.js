import { css } from 'lit-element';

export const style = css`
  :host {
    background-color: var(--chat-background-color, #f8f8f8);
    display: block;
    font-size: var(--chat-font-size, inherit);
    height: var(--chat-height, 100%);
    min-height: var(--chat-min-height, 400px);
    min-width: var(--chat-min-width, 280px);
    width: var(--chat-width, auto);
  }

  :host .wrapper {
    background: var(--alabaster, #f8f8f8);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 20px;
  }

  /* stylelint-disable selector-type-no-unknown */
  :host .wrapper wc-chat-scrollable {
    flex: 1 1 auto;

    /*overflow: scroll;*/
  }
`;
