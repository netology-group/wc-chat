import '@polymer/iron-autogrow-textarea';
import { html } from 'lit-element';

/* eslint-disable no-unused-expressions */
export const textarea = ({
  disabled,
  id,
  maxlength,
  maxRows = 10,
  onInput,
  onKeyPress,
  placeholder = 'Just type something...',
  value = '',
} = {}) => html`
  <iron-autogrow-textarea
    .disabled=${disabled}
    .maxRows=${maxRows}
    @input=${function oninput(e) {
      onInput && onInput(e);
    }}
    @keypress=${function onkeypress(e) {
      onKeyPress && onKeyPress(e);
    }}
    id=${id}
    maxlength=${maxlength}
    placeholder=${placeholder}
    value=${value}
  />
`;
/* eslint-enable no-unused-expressions */
