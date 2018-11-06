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

  return (html`
    <div class$='${cs({
      message: true, deleted, aggregated, unseen, reversed, normal: !reversed,
    })}'>
      ${unseen ? html`<div class='separator'><hr><span>${i18n.NEW_MESSAGES}</span></div>` : null}
      <div class$='${cn(message.user_role, 'avatar')}'>
        <div style$='${!message.avatar ? '' : `background-image: url(${message.avatar});`}'></div>
        ${!isWatchdog ? (html`<div class='message-identity'>${message.identity}</div>`) : null}
      </div>
      <section class$='${cn(message.user_role, 'content', cs({ me: message.user_id === message.current_user_id }))}'>
        ${props.actions}
        ${!message.aggregated ? meta({ message, isWatchdog }) : undefined}
        <div class='message-body'>${text(message.body)}</div>
        ${props.children}
      </section>
    </div>
  `)
}
