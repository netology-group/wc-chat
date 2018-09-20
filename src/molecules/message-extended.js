import { html, classString as cs } from '@polymer/lit-element'

import { stampToDate, formatDate, text } from './message'

const cn = (...argv) => argv.join(' ').trim()

export const messageExtended = (props) => {
  const { message } = props

  const config = new Map([['thumbsup', { name: ':thumbsup', count: message.rating }]])

  return (html`
    <div class$='${cs({ 'message-block': true, deleted: props.deleted })}'>
      <div
        class$='${cn(message.user_role, 'avatar')}'
        style$='${!message.avatar ? '' : `background-image: url(${message.avatar});`}'
      ></div>
      <section class$='${cn(message.user_role, 'message')}'>
        <div class='message-meta'>
          <span class='message-author'>${message.user_name}</span>
          <span class='message-stamp'>${formatDate(stampToDate(message.timestamp))}</span>
          <div class='message-status'>${message.status}</div>
        </div>
        <div>${text(message.body)}</div>
        <wc-chat-reactions config=${config} showcount></wc-chat-reactions>
        ${props.children}
      </section>
    </div>
  `)
}
