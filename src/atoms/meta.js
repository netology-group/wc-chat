import { html } from 'lit-element'
import cs from 'classnames-es'

import { stampToDate, formatDate } from '../utils/index.js'
import { human as humansvg } from '../images/index.js'

export const icon = ({ name }) => {
  switch (name) {
    case 'man':
      return humansvg
    default:
      return undefined
  }
}

export const meta = ({
  classname,
  icon: iconname,
  identity,
  timestamp,
  username,
} = {}) => (html`
    <div class=${cs({ meta: true, [classname]: classname })}>
      <span class='author' title=${identity || username}>${username}</span>
      ${iconname ? html`<span class='icon'>${icon({ name: iconname })}</span>` : undefined}
      <span class='stamp'>
        <span>${formatDate(stampToDate(timestamp))}</span>
      </span>
    </div>
  `)
