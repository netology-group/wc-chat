import { html } from 'lit-element'
import cs from 'classnames-es'

export const section = ({
  body,
  classname,
}) => (html`
  <section class=${cs({ section: true, [classname]: classname })}>
    <div class='body'>${body}</div>
  </section>
`)
