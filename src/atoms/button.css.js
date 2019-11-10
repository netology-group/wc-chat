import { css } from 'lit-element'

export const style = css`
:host .enter:disabled {
  cursor: not-allowed;
  filter: grayscale(100%) !important;
  transform: none !important;
}

:host .enter:hover:not(:disabled) {
  filter: brightness(var(--darken-hover, 95%));
}

:host .enter:active:not(:disabled) {
  filter: brightness(var(--darken-active, 85%));
  transform: translateY(1px);
}
`
