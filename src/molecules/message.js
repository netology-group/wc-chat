import { LitElement, html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import cs from 'classnames-es';

import { avatar } from '../atoms/avatar.js';
import { HTMLEntityMessage, MarkdownMessage } from '../utils/message-parser.js';
import { meta } from '../atoms/meta.js';
import { section } from '../atoms/section.js';
import { withStyle } from '../mixins/with-style.js';

import { style } from './message.css.js';

function getMessageBody(message, parsername, parse) {
  let body = message;
  const isMd = parsername === 'markdown' && parse;

  if (parsername === 'html-entities' && parse) body = parse(body);
  if (isMd) body = parse(body);

  return isMd
    ? html`
        ${unsafeHTML(body)}
      `
    : html`
        <p>${body}</p>
      `;
}

const parserSym = Symbol('parser');

export class _MessageElement extends LitElement {
  static get properties() {
    return {
      aggregated: String,
      body: String,
      deleted: { type: Boolean },
      icon: String,
      identity: String,
      image: String,
      me: { type: Boolean },
      parser: String,
      parserpreset: String,
      parserrules: String,
      parserengine: { type: Object },
      text: String,
      theme: String,
      timestamp: { type: Number },
      uid: String,
      username: String,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  get _parsers() {
    return new Map([
      ['markdown', opts => MarkdownMessage(opts)],
      ['html-entities', opts => HTMLEntityMessage(opts)],
    ]);
  }

  constructor() {
    super();

    this[parserSym] = undefined;
  }

  connectedCallback() {
    super.connectedCallback();

    this.__initializeParser();
  }

  disconnectedCallback() {
    this[parserSym] = undefined;
  }

  render() {
    // eslint-disable-line class-methods-use-this
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
    } = this;

    const cname = cs({
      [`theme-${theme}`]: theme,
      aggregated,
      deleted,
      inner: true,
      me,
    });

    // FIXME: Fix "Element has insufficient color contrast"
    return html`
      <div class="${cname}">
        <slot name=${`message-${uid || Math.ceil(Math.random() * 1e3)}`}></slot>
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
            cname: cs({ [`parser-${parser}`]: parser }),
          })}
          <slot name="message-epilogue"></slot>
        </div>
      </div>
    `;
  }

  __initializeParser() {
    const { parser, parserpreset, parserrules, parserengine } = this;

    if (!this[parserSym] && parserengine && parser) {
      this[parserSym] = this._parsers.get(parser)({
        parser: {
          preset: parserpreset,
          rules: parserrules ? parserrules.split(',') : [],
          engine: parserengine,
        },
        linkify: {
          blanklink: true,
        },
      });
    }
  }
}

export const MessageElement = withStyle()(_MessageElement, style);
