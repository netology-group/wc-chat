import { html, classString } from '@polymer/lit-element'

export const action = ({
  allowed = true,
  children,
  classname,
  disabled,
  fn,
  message,
  name,
}) => {
  const $class = classString(Object.assign(
    { 'action-subgroup-item': true, [name]: true },
    classname ? { [classname]: true } : {},
    disabled ? { disabled: true } : {},
    allowed ? { allowed: true } : {}
  ))

  if (!allowed) return null

  return html`<div class$="${$class}" on-click="${allowed ? e => fn(e, message) : undefined}">${children}</div>`
}

export default action
