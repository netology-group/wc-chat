import { fromEvent } from 'most/src/source/fromEvent'
import { html, LitElement, classString } from '@polymer/lit-element'
import { withStyle } from '@netology-group/webcomponents-utils/lib/mixins/mixins'
import compose from 'ramda/es/compose'
import cond from 'ramda/es/cond'
import F from 'ramda/es/F'
import T from 'ramda/es/T'

import { Button } from '../atoms/button.mjs'
import { Textarea } from '../atoms/textarea.mjs'
import {
  combineC as combine,
  observeC as observe,
  filterC as filter,
  delayC as delay,
  mapC as map, // eslint-disable-line no-unused-vars
  debounceC as debounce, // eslint-disable-line no-unused-vars
  throttleC as throttle,
} from '../utils/most.mjs'

const isMetaBtn = ({ key }) => key.toLowerCase() === 'meta'
const isEnterBtn = ({ key, keyCode }) => key.toLowerCase() === 'enter' || keyCode === 13
const isControlBtn = ({ key }) => key.toLowerCase() === 'control'
const isShiftBtn = ({ key, keyCode }) => key.toLowerCase === 'shift' || keyCode === 16

export const styles = `
  .input {
    padding: 0 20px 10px;
    height: initial;
  }
  .input > * {
    line-height: 0;
    position: relative;
  }
  .enter {
    background: no-repeat center center;
    border: none;
    bottom: 14px;
    cursor: pointer;
    height: 24px;
    outline: none;
    padding: 0;
    position: absolute;
    right: 14px
  }
  .enter:active:not(:disabled): {
    transform: translateY(1px);
  }
`

class MessageInput extends LitElement {
  static get properties () {
    return {
      disabled: Boolean,
      placeholder: String,
      placeholderdisabled: String,
      value: String,
    }
  }

  constructor (props) {
    super(props)

    this._boundValueChange = this._onValueChanged.bind(this)
  }

  connectedCallback () {
    super.connectedCallback()

    this.addEventListener('bind-value-changed', this._boundValueChange)
  }

  disconnectedCallback () {
    super.disconnectedCallback()

    this.removeEventListener('bind-value-changed', this._boundValueChange)
  }

  changeValue (value = '') {
    this.value = value
  }

  _onValueChanged (e) {
    this.value = e.detail.value
  }

  _onFormActivate (currentTarget) { // eslint-disable-line class-methods-use-this
    compose(
      observe(([e]) => this._handleSubmit(e)),
      x => delay(50, x),
      filter(([up$, down$]) => cond([
        [(u, d) => isMetaBtn(u) && isEnterBtn(d), T],
        [(u, d) => isControlBtn(u) && isEnterBtn(d), T],
        [T, F],
      ])(up$, down$)),
      filter(([up, down]) => up.key !== down.key),
      (up$, down$) => combine((x, y) => [x, y], up$, down$),
    )(fromEvent('keyup', currentTarget), fromEvent('keydown', currentTarget))
    // allow to submit on cmd+enter || control+enter
  }

  _handleSubmit (e) {
    e && e.preventDefault()

    this.dispatchEvent(new CustomEvent('message-submit', { detail: { message: this._processMessage(this.value) } }))
  }

  _processMessage (value) { // eslint-disable-line class-methods-use-this
    return value.trim ? value.trim() : value
  }

  _firstRendered () {
    this._onFormActivate(this.shadowRoot.querySelector('form'))
  }

  _render (props) {
    const {
      disabled, placeholder, placeholderdisabled, value,
    } = props

    const button = Button({
      disabled: !value || disabled,
      type: 'submit',
    })

    const textarea = Textarea({
      disabled,
      placeholder: this.hasAttribute('disabled')
        ? placeholderdisabled
        : placeholder,
      value,
    })

    return html`
      <section class$="${classString({ input: true, disabled })}">
        <form on-submit="${e => this._handleSubmit(e)}">
          ${textarea}
          ${button}
        <form>
      </section>
    `
  }
}

const Input = withStyle(MessageInput, styles)

export default Input

export { Input }
