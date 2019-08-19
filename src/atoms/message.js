import { html, classString as cs } from '@polymer/lit-element'

import { stampToDate, formatDate } from '../utils/index'
import { human as humansvg } from '../images/index'

export const icon = ({ name }) => {
  switch (name) {
    case 'man':
      return humansvg
    default:
      return undefined
  }
}

export const avatar = ({
  classname,
  image,
}) => (html`
  <div class$='${cs({ classname, 'avatar': true })}'>
    <div style$='${!image ? '' : `background-image: url(${image});`}'></div>
  </div>
`)

export const meta = ({
  classname,
  icon: iconname,
  identity,
  timestamp,
  username,
}) => (html`
    <div class$='${cs({ meta: true, [classname]: classname })}'>
      <span class='author' title='${identity || username}'>${username}</span>
      ${iconname ? html`<span class='icon'>${icon({ name: iconname })}</span>` : undefined}
      <span class='stamp'><span>${formatDate(stampToDate(timestamp))}</span></span>
    </div>
  `)

export const section = ({
  body,
  classname,
}) => (html`
  <section class$='${cs({ section: true, [classname]: classname })}'>
    <div class='body'>${body}</div>
  </section>
`)
