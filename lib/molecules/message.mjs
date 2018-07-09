import { html } from '@polymer/lit-element'
import cond from 'ramda/es/cond'
import T from 'ramda/es/T'
import F from 'ramda/es/F'

import { toBinary } from '../atoms/actions.mjs'

const stampToDate = stamp => new Date(stamp * 1e3)

const formatDate = (date, pattern = /\d{2}:\d{2}/) => date.toTimeString().match(pattern)

const body = (props) => {
  const { message } = props
  const text = (message.body || '').split('\n').map(it => html`
    <p class="message-line">${it}</p>
  `)

  return html`
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
  `
}

export default (props) => {
  const { message, permissions } = props
  const allowDelete = toBinary('00010') & toBinary(permissions) // eslint-disable-line no-bitwise

  return cond([
    [() => message.deleted && allowDelete, () => html`<div class="message-block deleted">${body(props)}</div>`],
    [() => message.deleted, () => null],
    [T, () => html`<div class="message-block">${body(props)}</div>`],
    [F, F],
  ])(props)
}
