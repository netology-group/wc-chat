import { html, classString as cs } from '@polymer/lit-element'

import { stampToDate, formatDate, classnames as cn } from '../utils/index'
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
  aggregated,
  classname,
  image,
}) => (html`
  <div class$='${cn(classname, 'avatar', { aggregated })}'>
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
    <div class$='${cs({ 'meta': true, [classname]: classname })}'>
      <span class='author' title='${identity || ''}'>${username}</span>
      <span class='icon'>${icon({ name: iconname })}</span>
      <span class='stamp'><span>${formatDate(stampToDate(timestamp))}</span></span>
    </div>
  `)

export const section = ({
  body,
  classname,
  me,
}) => (html`
  <section class$='${cn(classname, { [classname]: classname, me })}'>
    <div class='body'>${body}</div>
  </section>
`)
