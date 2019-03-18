import '@polymer/iron-autogrow-textarea'
import { html } from '@polymer/lit-element'

import style from './textarea.css'

const _placeholder = 'Just type something...'

export const textarea = ({
  disabled,
  id,
  maxlength,
  maxRows,
  onInput,
  onKeyPress,
  placeholder,
  value,
}) => (html`
  <iron-autogrow-textarea
    disabled='${disabled}'
    maxlength='${maxlength}'
    id='${id}'
    maxRows='${maxRows}'
    on-input='${function oninput (e) { onInput(e, this.textarea) }}'
    on-keypress='${onKeyPress}'
    placeholder='${placeholder || _placeholder}'
    value='${value}'
  />
`)

export { style }
