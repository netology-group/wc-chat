import { html } from '@polymer/lit-element'
import { withStyle } from '@netology-group/wc-utils/lib/mixins/template-mixins'

import entry from '../images/entry.svg'

import styles from './button.css'

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

export default withStyle(button, styles)

export { styles }
