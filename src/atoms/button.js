import { html } from '@polymer/lit-element'

import entry from '../images/entry.svg'

import style from './button.css'

export const button = ({
  disabled,
  children,
}) => (html`
  <button
    class='enter'
    disabled=${disabled}
  >${children || html`<img src='${entry}' />`}</button>
`)

export { style }
