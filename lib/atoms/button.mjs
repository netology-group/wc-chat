import { html } from '@polymer/lit-element'
import { withStyle } from '@netology-group/webcomponents-utils/lib/mixins/template-mixins'

import entry from '../images/entry.svg'

export const styles = `
  .enter:active{
    transform:translateY(1px);
  }
  .enter:disabled {
    cursor: not-allowed;
    filter: grayscale(100%);
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
  >${children || html`<img src="${entry}" />`}</button>
`

const Button = withStyle(button, styles)

export default Button

export { Button }
