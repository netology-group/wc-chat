import { html, classString as cs } from '@polymer/lit-element'

import style from './message.css'

const cn = (...argv) => argv.join(' ').trim()

export const stampToDate = stamp => new Date(stamp * 1e3)

export const formatDate = (date, pattern = /\d{2}:\d{2}/) => date.toTimeString().match(pattern)

export const text = (message = '') => message.split('\n').map(it => (html`<p class='message-line'>${it}</p>`))

export const messageDefault = (props) => {
  const { message } = props

  return (html`
    <div class$='${cs({
      message: true, deleted: props.deleted, aggregated: message.aggregated,
    })}'>
      <div
        class$='${cn(message.user_role, 'avatar', cs({ me: message.user_id === message.current_user_id }))}'
        style$='background-image: url(${message.avatar});'
      ></div>
      <section class$='${cn(message.user_role, 'content')}'>
        <div class='message-meta'>
          <span class='message-author'>${message.user_name}</span>
          <span class='message-status'>${message.status || formatDate(stampToDate(message.timestamp))}</span>
        </div>
        <div>${text(message.body)}</div>
        ${props.children}
      </section>
    </div>
  `)
}

export { style }
