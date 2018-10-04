import { html } from '@polymer/lit-element'

import { menu, smiley } from '../images'

import style from './actions.css'

const _reactions = props => (html`
  <div class='reactions'>
    <div class='reaction'>${smiley}</div>
    <div class='reactions-group'>
      ${props.children}
    </div>
</div>
`)

const _actions = props => (html`
  <div class='actions-group'>
    ${props.children}
    ${props.reactions.length ? _reactions({ children: props.reactions }) : null}
  </div>
`)

export const actions = props => (html`
  <div class='actions'>
    ${menu}
    <div class='actions-inner'>
      ${_actions(props)}
    </div>
  </div>
`)

export { style }
