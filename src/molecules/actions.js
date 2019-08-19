import { html } from '@polymer/lit-element'

import { menu, cross } from '../images'
import {
  action as actionEl,
  actions as actionsEl,
  reaction as reactionEl,
} from '../atoms/action'

import style from './actions.css'

export { style }

export const Actions = ({
  reactions,
  actions,
}) => {
  const rctns = new Map([])
  const actns = new Map([])

  reactions.forEach((v, k) => { rctns.set(k, reactionEl(v)) })
  actions.forEach((v, k) => { actns.set(k, actionEl(v)) })

  const renderChildren = actns.size || rctns.size
  const renderQuickDelete = actions.has('message-delete')

  return (html`
    ${renderQuickDelete
      ? (html`
        ${actionEl({
          ...actions.get('message-delete'),
          classname: 'quickdelete',
          children: cross,
        })}
      `)
      : undefined
    }
    ${renderChildren
      ? (html`
        <div class='actions'>
          ${menu}
          <div class='actions-inner'>
            ${actionsEl({ actions: actns, reactions: rctns })}
          </div>
        </div>
      `)
      : undefined
    }
  `)
}
