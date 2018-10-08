import { html } from '@polymer/lit-element'

import { menu, smiley, cross } from '../images'
import { action } from '../atoms/action'

import style from './actions.css'

const toList = map => map.toJSON().map(tuple => tuple[1])

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
    ${toList(props.children)}
    ${props.reactions.size ? _reactions({ children: toList(props.reactions) }) : null}
  </div>
`)

export const actions = props => (html`
  ${props.children.has('message-delete')
    ? (html`${action({
      ...props.actions.get('message-delete'),
      classname: 'quickdelete',
      children: cross,
    })}`)
    : null}
  <div class='actions'>
    ${menu}
    <div class='actions-inner'>
      ${_actions(props)}
    </div>
  </div>
`)

export { style }
