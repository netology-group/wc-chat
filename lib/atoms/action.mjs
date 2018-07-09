import { html } from '@polymer/lit-element'

export const action = ({
  children, fn, message,
}) => html`
  <div
    class="action-subgroup-item"
    on-click="${e => fn(e, message)}"
  >
    ${children}
  </div>
`

const Action = action

export default Action

export { Action }
