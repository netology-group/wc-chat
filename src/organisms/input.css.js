import { css } from 'lit-element';

export const style = css`
  :host {
    --input-font-size: var(--chat-input-font-size, 14px);

    display: block;
    width: 100%;
    z-index: var(--chat-input-z-index, initial);
  }

  :host .input {
    background: var(--alabaster, #f8f8f8);
    bottom: 0;
    box-sizing: border-box;
    font-size: var(--input-font-size);
    width: 100%;
  }

  :host .input.disabled {
    color: var(--silver, #b8b8b8);
  }

  :host .input > * {
    line-height: 0;
    position: relative;
  }

  :host .input button {
    background: no-repeat center center;
    border: none;
    bottom: 14px;
    cursor: pointer;
    height: 24px;
    outline: none;
    padding: 0;
    position: absolute;
    right: 18px;
  }

  :host .input button:disabled {
    cursor: not-allowed;
  }

  :host .input button:active:not(:disabled) {
    transform: translateY(1px);
  }

  :host .input .timer {
    position: absolute;
    bottom: 26px;
    right: 20px;
    font-size: 16px;
    color: #b8b8b8;
  }

  @keyframes shakeX {
    from,
    to {
      transform: translate3d(0, 0, 0);
    }

    10%,
    30%,
    50%,
    70%,
    90% {
      transform: translate3d(-10px, 0, 0);
    }

    20%,
    40%,
    60%,
    80% {
      transform: translate3d(10px, 0, 0);
    }
  }

  .shakeX {
    animation: shakeX 1s;
  }
`;
