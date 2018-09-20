import { html } from '@polymer/lit-element'

import style from './actions.css'

const _reactions = props => (html`
  <div class='action-group action-group-reactions'>
    ${props.children}
  </div>
`)

const _actions = props => (html`
  <div class='action-group action-group-actions'>
    <span>...</span>
    <div class='action-subgroup'>
      <div class='action-subgroup-inner'>
        ${props.children}
      </div>
    </div>
  </div>
`)

export const actions = props => (html`
  <div class='actions'>
    ${props.reactions.length ? _reactions({ children: props.reactions }) : null}
    ${props.children.length ? _actions(props) : null}
  </div>
`)

export { style }
