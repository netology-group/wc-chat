import { html, classString as cs } from '@polymer/lit-element'

import styles from './separator.css'

const isTruthy = a => Boolean(a)

export const separator = ({ className, text }) => (html`
  <div class$=${cs({ 'separator': true, [className]: className })}>
    <hr><span>${text}</span>
  </div>
`)

export const slot = ({ id, text }) => (html`
  <div slot$=${`message-${id}`} class='messages-separator'>
    ${separator({ text })}
  </div>
`)

export const maybeSeparator = (props) => {
  const { enabled, ...p } = props

  return isTruthy(enabled) ? slot(p) : undefined
}

export { styles }
