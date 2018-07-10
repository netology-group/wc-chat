import { html } from '@polymer/lit-element'
import { withStyle } from '@netology-group/webcomponents-utils/lib/mixins/template-mixins'

import entry from '../images/entry.svg'

export const styles = `
  .enter:hover:not(disabled){
    filter: brightness(var(--darken-hover, 95%));
  }
  .enter:active:not(disabled){
    transform:translateY(1px);
    filter: brightness(var(--darken-hover, 85%));
  }
  .enter:disabled {
    cursor: not-allowed;
    transform: none !important;
    filter: grayscale(100%) !important;
  }
`

export const button = ({
  disabled,
  type = 'click',
  children,
}) => html`
  <button
    class="enter"
    disabled="${disabled}"
    type="${type}"
  >
    ${children || html`<img src="${entry}" />`}
  </button>
`

const Button = withStyle(button, styles)

export default Button

export { Button }
