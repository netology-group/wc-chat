import { fromEvent } from 'most/src/source/fromEvent'
import { html, LitElement, classString } from '@polymer/lit-element'
import { withStyle } from '@netology-group/wc-utils/lib/mixins/mixins'
import compose from 'ramda/es/compose'

import { Button } from '../atoms/button.mjs'
import { Textarea } from '../atoms/textarea.mjs'
import {
  observeC as observe,
  filterC as filter,
  throttleC as throttle,
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
    right: 18px
  }
  .enter:active:not(:disabled): {
    transform: translateY(1px);
  }
`

class MessageInput extends LitElement {
  static get properties () {
    return {
      disabled: Boolean,
      maxrows: Number,
      placeholder: String,
      placeholderdisabled: String,
      value: String,
      delay: Number,
    }
  }

  constructor (props) {
    super(props)

    this._boundValueChange = this._onValueChanged.bind(this)
    this._boundKeyPress = this._onKeyPress.bind(this)
    this._boundOnInput = this._onInput.bind(this)
    this._underlyingTextarea = null
    this.__pre = null
    this.__post = null
  }

  connectedCallback () {
    super.connectedCallback()

    this.addEventListener('bind-value-changed', this._boundValueChange)
  }

  disconnectedCallback () {
    super.disconnectedCallback()

    this._underlyingTextarea = null
    this.__pre = null
    this.__post = null

    this.removeEventListener('bind-value-changed', this._boundValueChange)
  }

  changeValue (value = '') {
    this.value = value
  }

  _onValueChanged (e) {
    this.value = e.detail.value

    if (this._underlyingTextarea && this.__pre && this.__post) {
      this._underlyingTextarea.setSelectionRange(this.__pre, this.__post)
      this.__pre = null
      this.__post = null
    }
  }

  _onFormActivate (currentTarget) { // eslint-disable-line class-methods-use-this
    const keyup$ = fromEvent('keyup', currentTarget)
    const keydown$ = fromEvent('keydown', currentTarget)
    const enter$ = filter(isEnterBtn, keydown$)

    const special = {
      shift: false, meta: false, control: false,
    }
    const isSpecialPressed = () => special.shift || special.meta || special.control

    compose(
      observe(this._handleSubmit.bind(this)),
      throttle(this.delay || 0),
      filter(() => !isSpecialPressed())
    )(enter$)

    observe((e) => { isEnterBtn(e) && isSpecialPressed() && this._insertLinebreak() }, keydown$)

    compose(
      observe(({ key }) => { special[key.toLowerCase()] = true }),
      filter(e => isShiftBtn(e) || isControlBtn(e) || isMetaBtn(e))
    )(keydown$)

    compose(
      observe(({ key }) => { special[key.toLowerCase()] = false }),
      filter(e => isShiftBtn(e) || isControlBtn(e) || isMetaBtn(e))
    )(keyup$)
  }

  _onKeyPress (e) { // eslint-disable-line class-methods-use-this
    isEnterBtn(e) && e.preventDefault()
    // prevent native textarea's enter event
  }

  _onInput (e, textarea) {
    if (!this._underlyingTextarea) this._underlyingTextarea = textarea
  }

  _insertLinebreak () {
    if (!this._underlyingTextarea) {
      this.changeValue(`${this.value || ''}\n`)

      return
    }
    const { selectionStart: pre, selectionEnd: post } = this._underlyingTextarea

    this.__pre = pre + 1
    this.__post = pre + 1

    this.changeValue(`${this.value.slice(0, pre)}\n${this.value.slice(post)}`)
  }

  _handleSubmit (e) {
    e && e.preventDefault()
    const message = this._processMessage(this.value)

    if (message) {
      this.dispatchEvent(new CustomEvent('message-submit', { detail: { message } }))
      this.changeValue('')
    }
  }

  _processMessage (value) { // eslint-disable-line class-methods-use-this
    return (value && value.trim) ? value.trim() : value
  }

  _firstRendered () {
    this._onFormActivate(this.shadowRoot.querySelector('form'))
  }

  _render (props) {
    const {
      disabled, placeholder, placeholderdisabled, value, maxrows,
    } = props

    const button = Button({
      disabled: !this._processMessage(value) || disabled,
      type: 'submit',
    })

    const textarea = Textarea({
      disabled,
      maxRows: maxrows || 5,
      onKeyPress: this._boundKeyPress,
      onInput: this._boundOnInput,
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
