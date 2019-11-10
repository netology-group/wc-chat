import { LitElement, html } from 'lit-element'
import cs from 'classnames-es'

import { avatar } from '../atoms/avatar.js'
import { HTMLEntityMessage, MarkdownMessage } from '../utils/message-parser.js'
import { meta } from '../atoms/meta.js'
import { section } from '../atoms/section.js'
import { withStyle } from '../mixins/with-style.js'

import { style } from './message.css.js'

function getMessageBody (message, parsername, parse) {
  let body = message
  const isMd = parsername === 'markdown'

  if (parsername === 'html-entities' && parse) body = parse(body)
  if (isMd && parse) body = parse(body)

  return isMd ? (html`<wc-chat-content>${body}</wc-chat-content>`) : (html`<p>${body}</p>`)
}

const parserSym = Symbol('parser')

export class _MessageElement extends LitElement {
  static get properties () {
    return {
      aggregated: Boolean,
      deleted: Boolean,
      body: String,
      icon: String,
      identity: String,
      image: String,
      me: Boolean,
      parser: String,
      parserpreset: String,
      parserrules: String,
      text: String,
      theme: String,
      timestamp: Number,
      username: String,
      uid: String,
    }
  }

  get _parsers () { // eslint-disable-line class-methods-use-this
    return new Map([['markdown', opts => MarkdownMessage(opts)], ['html-entities', opts => HTMLEntityMessage(opts)]])
  }

  constructor () {
    super()

    this[parserSym] = undefined
  }

  connectedCallback(){
    super.connectedCallback()

    this.__initializeParser()
  }

  render () { // eslint-disable-line class-methods-use-this
    const {
      aggregated = false,
      deleted = false,
      icon,
      image,
      identity,
      me,
      parser,
      text,
      theme,
      timestamp,
      uid,
      user_role,
      username,
    } = this

    const cname = cs({
      [`theme-${theme}`]: theme,
      aggregated,
      deleted,
      inner: true,
      me,
    })

    return (html`
      <div class='${cname}'>
        <slot
          name=${`message-${uid || Math.ceil(Math.random() * 1e3)}`}
        ></slot>
        ${avatar({
          classname: user_role,
          image,
        })}
        <div class="content">
          <slot name="message-prologue"></slot>
          ${aggregated
            ? undefined
            : meta({
              icon,
              identity,
              timestamp,
              username,
            })}
          ${section({
            body: getMessageBody(text, parser, this[parserSym]),
            classname: `parser-${parser}`,
          })}
          <slot name="message-epilogue"></slot>
        </div>
      </div>
    `)
  }

  __initializeParser (){
    const {
      parser,
      parserpreset,
      parserrules,
    } = this

    if (!this[parserSym] && parser) {
      this[parserSym] = this._parsers.get(parser)({
        parser: {
          preset: parserpreset,
          rules: parserrules ? parserrules.split(',') : [],
        },
      })
    }
  }
}

export const MessageElement = withStyle(html)(
  _MessageElement,
  style
)
