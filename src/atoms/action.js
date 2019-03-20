import { html, classString as cs } from '@polymer/lit-element'

import * as images from '../images'
import { cn } from '../utils/index'

export const actionImages = new Map([['message-delete', images.del], ['user-disable', images.lock]])

export const action = ({
  allowed,
  children,
  classname,
  disabled,
  handler,
  key,
  message,
  name,
}) => {
  const cls = cn(
    'action',
    classname,
    key,
    name,
    cs({ disabled, allowed }),
  )

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
}) => {
  const cls = cn('reaction-add', cs({ disabled }))
  const config = () => new Map([['thumbsup', { name: ':thumbsup' }]])

  return (html`
    <button
      class$='${cls}'
      disabled='${disabled}'
      on-click='${e => handler && handler(e, { message })}'
    >
      <wc-chat-reactions direction='column' config='${config()}' showall></wc-chat-reactions>
    </button>
`)
}
