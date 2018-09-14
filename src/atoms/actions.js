import { html } from '@polymer/lit-element'
import { withStyle } from '@netology-group/wc-utils/lib/mixins/template-mixins'

import styles from './actions.css'

// eslint-disable-next-line multiline-ternary
export const actions = (props = {}) => !props.children.length ? null : html`
  <div class="actions">
    <div class="action-group">
      <span>...</span>
      <div class="action-subgroup">
        <div class="action-subgroup-inner">
          ${props.children}
        </div>
      </div>
    </div>
  </div>
`

export default withStyle(actions, styles)

export { styles }
