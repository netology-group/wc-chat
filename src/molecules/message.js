import { html, LitElement, classString as cs } from '@polymer/lit-element'
import { unsafeHTML } from 'lit-html/lib/unsafe-html'
import { withStyle } from '@netology-group/wc-utils'

import { section, avatar } from '../atoms/message'

import { HTMLEntityMessage, MarkdownMessage } from '../utils/message-parser'

import style from './message.css'

export { style }

function getMessageBody (message, parsername, parse) {
  let body = message

  const isMd = parsername === 'markdown'

  if (parsername === 'html-entities') body = parse(body)
  if (isMd) body = parse(body)

  return isMd ? (html`${unsafeHTML(body)}`) : body
}

export class MessageFactory extends LitElement {
  static get properties () {
    return {
      aggregated: Boolean,
      body: String,
      classname: String,
      deleted: Boolean,
      uid: String,
      image: String,
      me: Boolean,
      parsername: String,
      reversed: Boolean,
    }
  }

  constructor (...argv) {
    super(...argv)

    this.parser = undefined
  }

  _shouldRender (...argv) {
    if (!this.parser && argv[0].parsername) {
      this.parser = this.parsers.get(argv[0].parsername)()
    }

    return super._shouldRender(...argv)
  }

  get parsers () { // eslint-disable-line class-methods-use-this
    return new Map([['markdown', () => MarkdownMessage()], ['html-entities', () => HTMLEntityMessage()]])
  }

  _render (props) { // eslint-disable-line class-methods-use-this
    const {
      aggregated,
      classname,
      me,
      uid,
      image,
      user_role,
    } = props

    const body = getMessageBody(props.body, props.parsername, this.parser)

    const sectionTpl = section({
      body,
      classname,
      me,
    })

    const avatarTpl = avatar({
      aggregated,
      classname: user_role,
      image,
    })

    const className = cs({ 'message-inner': true, aggregated })

    return (html`
      <div class$='${className}'>
        <slot name$=${`message-${uid || Math.ceil(Math.random() * 1e3)}`}></slot>
        ${avatarTpl}
        ${sectionTpl}
        <slot name$=${`message-rev-${uid || Math.ceil(Math.random() * 1e3)}`}></slot>
      </div>
    `)
  }
}

export const Message = withStyle(html)(MessageFactory, style)
