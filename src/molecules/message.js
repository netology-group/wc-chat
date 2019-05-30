import { html, LitElement, classString as cs } from '@polymer/lit-element'
import { unsafeHTML } from 'lit-html/lib/unsafe-html'
import { withStyle } from '@netology-group/wc-utils'

import { section, avatar, meta } from '../atoms/message'
import { classnames as cn } from '../utils/index'
import { HTMLEntityMessage, MarkdownMessage } from '../utils/message-parser'

import style from './message.css'

export { style }

function getMessageBody (message, parsername, parse) {
  let body = message

  const isMd = parsername === 'markdown'

  if (parsername === 'html-entities') body = parse(body)
  if (isMd) body = parse(body)

  return isMd ? (html`${unsafeHTML(body)}`) : (html`<p>${body}</p>`)
}

export class MessageFactory extends LitElement {
  static get properties () {
    return {
      aggregated: Boolean,
      deleted: Boolean,
      icon: String,
      identity: String,
      image: String,
      me: Boolean,
      parsername: String,
      parserpreset: String,
      parserrules: String,
      reversed: Boolean,
      text: String,
      theme: String,
      timestamp: Number,
      username: String,
      uid: String,
    }
  }

  constructor (...argv) {
    super(...argv)

    this.parser = undefined
  }

  _shouldRender (...argv) {
    if (!this.parser && argv[0].parsername) {
      this.parser = this.parsers.get(argv[0].parsername)({
        parser: {
          preset: argv[0].parserpreset,
          rules: argv[0].parserrules ? argv[0].parserrules.split(',') : [],
        },
      })
    }

    return super._shouldRender(...argv)
  }

  get parsers () { // eslint-disable-line class-methods-use-this
    return new Map([['markdown', opts => MarkdownMessage(opts)], ['html-entities', opts => HTMLEntityMessage(opts)]])
  }

  _render (props) { // eslint-disable-line class-methods-use-this
    const {
      aggregated,
      deleted,
      icon,
      image,
      identity,
      me,
      parsername,
      text,
      theme,
      timestamp,
      uid,
      user_role,
      username,
    } = props

    const avatarTpl = avatar({
      aggregated,
      classname: user_role,
      image,
    })

    const metaTpl = aggregated
      ? undefined
      : meta({
        icon,
        identity,
        timestamp,
        username,
      })

    const sectionTpl = section({
      body: getMessageBody(text, parsername, this.parser),
      classname: cn(`parser-${parsername}`),
      me,
    })

    const cname = cs({
      [`theme-${theme}`]: theme,
      deleted,
      inner: true,
      me,
    })

    return (html`
      <div class$='${cname}'>
        <slot name$=${`message-${uid || Math.ceil(Math.random() * 1e3)}`}></slot>
        ${avatarTpl}
        <div class="content">
          <slot name="message-prologue"></slot>
          ${metaTpl}
          ${sectionTpl}
          <slot name="message-epilogue"></slot>
        </div>
        <slot name$=${`message-rev-${uid || Math.ceil(Math.random() * 1e3)}`}></slot>
      </div>
    `)
  }
}

export const Message = withStyle(html)(MessageFactory, style)
