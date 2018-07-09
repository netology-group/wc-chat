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
  debounceC as debounce,
} from '../utils/most.mjs'

const isMetaBtn = ({ key, keyCode }) => key.toLowerCase() === 'meta' || keyCode === 91 // eslint-disable-line
const isEnterBtn = ({ key, keyCode }) => key.toLowerCase() === 'enter' || keyCode === 13
const isControlBtn = ({ key, keyCode }) => key.toLowerCase() === 'control' || keyCode === 17
const isShiftBtn = ({ key, keyCode }) => key.toLowerCase() === 'shift' || keyCode === 16

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
      debounce: Number,
    }
  }

  constructor (props) {
    super(props)

    this._boundValueChange = this._onValueChanged.bind(this)
    this._boundKeyPress = this._onKeyPress.bind(this)
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
    let previous
    const combineTuple = (a$, b$) => combine((x, y) => [x, y], a$, b$)
    const keyup = fromEvent('keyup', currentTarget)
    const keydown = fromEvent('keydown', currentTarget)
    const wasPrevSpecial = _ => _ && (
      isShiftBtn(_[0])
      || isShiftBtn(_[1])
      || isControlBtn(_[0])
      || isControlBtn(_[1])
    )

    compose(
      observe((_) => {
        const shouldSubmit = cond([[([a, b]) => !wasPrevSpecial(previous) && isEnterBtn(a) && isEnterBtn(b), T], [T, F]])

        shouldSubmit(_) && this._handleSubmit(_[0])

        previous = _
        // memorize tuple
      }),
      debounce(this.debounce || 25), // skip noisy events which are invokend on special+enter chord, e.g. new line
      filter(() => this.value),
      combineTuple,
    )(keydown, keydown)
    // allow to submit on cmd+enter || control+enter || enter

    compose(
      observe(() => { this.changeValue(`${this.value || ''}\n`) }),
      filter(cond([
        [([up, down]) => isControlBtn(up) && isEnterBtn(down), T],
        [([up, down]) => isShiftBtn(up) && isEnterBtn(down), T],
        [T, F],
        [F, F],
      ])),
      filter(([up, down]) => up.key !== down.key),
      combineTuple,
    )(keyup, keydown)
    // allow to input newline on shift+enter || control+enter
  }

  _onKeyPress (e) { // eslint-disable-line class-methods-use-this
    isEnterBtn(e) && e.preventDefault()
    // prevent native textarea's enter event
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
      onKeyPress: this._boundKeyPress,
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
