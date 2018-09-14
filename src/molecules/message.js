import { html, classString } from '@polymer/lit-element'

const stampToDate = stamp => new Date(stamp * 1e3)

const formatDate = (date, pattern = /\d{2}:\d{2}/) => date.toTimeString().match(pattern)

export const message = (props) => {
  const { message: msg } = props
  const text = (msg.body || '').split('\n').map(it => html`
    <p class="message-line">${it}</p>
  `)

  return html`
    <div class$="${classString({ 'message-block': true, deleted: props.deleted })}">
      <div
        class="avatar"
        style="background-image: url(${msg.avatar});"
        title="${msg.user_name}"
      ></div>
      <section class$="message ${msg.user_role}">
        <div class="message-meta">
          <span class="message-author">${msg.user_name}</span>
          <span class="message-status">${msg.status || formatDate(stampToDate(msg.timestamp))}</span>
        </div>
        <div>${text}</div>
        ${props.children}
      </section>
    </div>
  `
}

export default message
