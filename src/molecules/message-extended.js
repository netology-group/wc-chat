import { html, classString as cs } from '@polymer/lit-element'

import { stampToDate, formatDate, text } from './message'

const cn = (...argv) => argv.join(' ').trim()

export const messageExtended = (props) => {
  const { message } = props

  const isWatchdog = message.user_role === 'moderator'

  return (html`
    <div class$='${cs({
      message: true, deleted: props.deleted, aggregated: message.aggregated,
    })}'>
      <div
        class$='${cn(message.user_role, 'avatar')}'
        style$='${!message.avatar ? '' : `background-image: url(${message.avatar});`}'
      ></div>
      <section class$='${cn(message.user_role, 'content', cs({ me: message.user_id === message.current_user_id }))}'>
        ${props.actions}
        <div class='message-meta'>
          <span class='message-author' title='${isWatchdog ? message.status : ''}'>${message.user_name}</span>
          <span class='message-stamp'>${formatDate(stampToDate(message.timestamp))}</span>
          ${!isWatchdog ? (html`<div class='message-status'>${message.status}</div>`) : null}
        </div>
        <div class='message-body'>${text(message.body)}</div>
        ${props.children}
      </section>
    </div>
  `)
}
