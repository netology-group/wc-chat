import { html, classString } from '@polymer/lit-element'

const stampToDate = stamp => new Date(stamp * 1e3)

const formatDate = (date, pattern = /\d{2}:\d{2}/) => date.toTimeString().match(pattern)

export default (props) => {
  const { message } = props
  const text = (message.body || '').split('\n').map(it => html`
    <p class="message-line">${it}</p>
  `)

  return html`
    <div class$="${classString({ 'message-block': true, deleted: props.deleted })}">
      <div
        class="avatar"
        style="background-image: url(${message.avatar});"
        title="${message.user_name}"
      ></div>
      <section class$="message ${message.user_role}">
        <div class="message-meta">
          <span class="message-author">${message.user_name}</span>
          <span class="message-status">${message.status || formatDate(stampToDate(message.timestamp))}</span>
        </div>
        <div>${text}</div>
        ${props.children}
      </section>
    </div>
  `
}
