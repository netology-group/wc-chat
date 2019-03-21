import { html } from '@polymer/lit-element'

import { stampToDate, formatDate, classnames as cn } from '../utils/index'

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
  display_role,
  timestamp,
  user_name,
}) => (html`
  <div class$='${cn(classname, 'message-meta')}'>
    <span class='message-author' title='${display_role || ''}'>${user_name}</span>
    <span class='message-stamp'>${formatDate(stampToDate(timestamp))}</span>
  </div>
`)

export const section = ({
  body,
  classname,
  me,
}) => (html`
  <section class$='${cn(classname, 'message-content', { me })}'>
    <slot name="message-prologue"></slot>
    <div class='message-body'>${body}</div>
    <slot name="message-epilogue"></slot>
  </section>
`)
