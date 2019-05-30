import { html, classString as cs } from '@polymer/lit-element'

export const separator = ({
  className,
  reversed,
  text,
}) => (html`
  <div class$=${cs({
    'separator': true,
    [className]: className,
    reversed,
  })}>
    <hr><span>${text}</span>
  </div>
`)
