import '@polymer/iron-autogrow-textarea'
import { html } from '@polymer/lit-element'
import { withStyle } from '@netology-group/webcomponents-utils/lib/mixins/template-mixins'

export const styles = `
  iron-autogrow-textarea {
    -webkit-appearance: none;
    background: var(--bg-color, var(--theme-color-white, #fff));
    border-radius: 5px;
    border: 1px solid var(--border-color, var(--theme-color-alto, #d4d4d4));
    box-sizing: border-box;
    caret-color: var(--caret-color, var(--theme-color-pictonblue, #48a1e6));
    font-size: var(--font-size, var(--theme-font-size, 16px));
    height: inherit;
    line-height: 1.2em;
    min-height: 52px;
    outline: none;
    width: 100%;

    --iron-autogrow-textarea: {
      padding: 16px 70px 0px 20px;
    };

    --iron-autogrow-textarea-placeholder: {
      color: var(--ph-color, var(--theme-color-alto, #d4d4d4));
    };
  }

  iron-autogrow-textarea:hover {
    border-color: var(--border-color-hover, var(--theme-color-silver, #b8b8b8));
  }

  iron-autogrow-textarea:focus-within {
    border-color: var(--border-color-focus, var(--theme-color-pictonblue, #48a1e6));
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
