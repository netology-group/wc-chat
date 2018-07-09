import '@polymer/iron-autogrow-textarea'
import { html } from '@polymer/lit-element'
import { withStyle } from '@netology-group/webcomponents-utils/lib/mixins/template-mixins'

export const styles = `
  iron-autogrow-textarea {
    border: 0px transparent;
    -webkit-appearance: none;
    outlibe: none;
    width: 100%;
    --iron-autogrow-textarea: {
      box-sizing: border-box;
      width: 100%;
      padding: 16px 70px 0px 20px;
      border: 1px solid #d4d4d4;
      border-radius: 5px;
      min-height: 48px;
      line-height: 1.2em;
      background: #fff;
    };
    --iron-autogrow-textarea-placeholder: {
      color: #d4d4d4
    };
  }
`

export const textarea = ({
  disabled,
  id,
  placeholder,
  value,
}) => html`
  <iron-autogrow-textarea
    disabled="${disabled}"
    id="${id}"
    placeholder="${placeholder || 'Just type something...'}"
    value="${value}"
  />
`

const Textarea = withStyle(textarea, styles)

export default Textarea

export { Textarea }
