import '@polymer/iron-autogrow-textarea'
import { html } from '@polymer/lit-element'
import { withStyle } from '@netology-group/wc-utils/lib/mixins/template-mixins'

import styles from './textarea.css'

export const textarea = ({
  disabled,
  id,
  maxRows,
  onInput,
  onKeyPress,
  placeholder,
  value,
}) => html`
  <iron-autogrow-textarea
    disabled="${disabled}"
    id="${id}"
    maxRows="${maxRows}"
    on-input="${function oninput (e) { onInput(e, this.textarea) }}"
    on-keypress="${onKeyPress}"
    placeholder="${placeholder || 'Just type something...'}"
    value="${value}"
  />
`

export default withStyle(textarea, styles)

export { styles }
