import { html, classString as cs } from '@polymer/lit-element'

import { stampToDate, formatDate, text } from './message'

const cn = (...argv) => argv.join(' ').trim()

const meta = ({ message, isWatchdog }) => (html`
  <div class='message-meta'>
    <span class='message-author' title='${isWatchdog ? message.identity : ''}'>${message.user_name}</span>
    <span class='message-stamp'>${formatDate(stampToDate(message.timestamp))}</span>
    ${!isWatchdog ? (html`<div class='message-status'>${message.status}</div>`) : null}
  </div>
`)

export const messageExtended = (props) => {
  const { message, deleted } = props
  const {
    aggregated, i18n, unseen, reversed,
  } = message

  const isWatchdog = message.user_role === 'moderator'

  const voidEl = undefined

  const _separator = unseen ? (html`<div class='separator'><hr><span>${i18n.NEW_MESSAGES}</span></div>`) : voidEl

  const _identity = !isWatchdog ? (html`<div class='message-identity'>${message.identity}</div>`) : voidEl

  const _messagemeta = !message.aggregated ? (html`${meta({ message, isWatchdog })}`) : voidEl

  const _messagebody = message.body ? (html`${text(message.body)}`) : voidEl

  const _children = props.children ? (html`${props.children}`) : voidEl

  return (html`
    <div class$='${cs({
      message: true, deleted, aggregated, unseen, reversed, normal: !reversed,
    })}'>
      ${_separator}
      <div class$='${cn(message.user_role, 'avatar')}'>
        <div style$='${!message.avatar ? '' : `background-image: url(${message.avatar});`}'></div>
        ${_identity}
      </div>
      <section class$='${cn(message.user_role, 'content', cs({ me: message.user_id === message.current_user_id }))}'>
        ${props.actions ? props.actions : undefined}
        ${_messagemeta}
        <div class='message-body'>${_messagebody}</div>
        ${_children}
      </section>
    </div>
  `)
}
