import { css } from 'lit-element';

export const style = css`
  :host {
    --messages-width: var(--chat-messages-list-width, 100%);
    --messages-height: var(--chat-messages-list-height, 100%);
    /* stylelint-disable-next-line declaration-colon-newline-after */
    --messages-item-aggregated-margin: var(
      --chat-message-aggregated-margin,
      var(--messages-item-border-radius)
    );
    --messages-item-border-radius: 5px;
    --messages-item-margin-between: 16px;
  }

  :host .messages-separator {
    position: relative;
  }

  :host .messages {
    box-sizing: border-box;
    font-size: var(--messages-font-size, inherit);
    height: var(--messages-height);
    width: var(--messages-width);
  }

  :host .message {
    box-sizing: border-box;
    padding-bottom: var(--messages-item-aggregated-margin);
    position: relative;
  }

  :host .message + .message:not(.aggregated) {
    margin-top: calc(var(--messages-item-margin-between) - var(--messages-item-aggregated-margin));
  }
`;
