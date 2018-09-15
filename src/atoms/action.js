import { html, classString as cs } from '@polymer/lit-element'

import * as images from '../images'

export const actionImages = new Map([['message-delete', images.del], ['user-disable', images.lock], ['message-react', null]])

export const action = ({
  allowed,
  children,
  classname,
  disabled,
  handler,
  message,
  name,
}) => {
  const cls = cs(Object.assign(
    { 'action-subgroup-item': true, [name]: true },
    classname ? { [classname]: true } : {},
    disabled ? { disabled: true } : {},
    allowed ? { allowed: true } : {}
  ))

  if (!allowed) return null

  return (html`
    <button
      class$='${cls}'
      on-click='${e => handler && handler(e, message)}'
    >${children}</button>
  `)
}

export const reaction = ({
  disabled,
  handler,
  message,
  standalone,
}) => {
  const cls = cs({
    'reaction-add': true,
    disabled,
    standalone,
  })

  return (html`
    <button
      class$='${cls}'
      disabled='${disabled}'
      on-click='${e => handler && handler(e, { message })}'
    >${images.smile}</button>
`)
}
