import { LitElement, html } from 'lit-element';
import cs from 'classnames-es';

import { avatar } from '../atoms/avatar.js';
import { messageBody } from '../atoms/message-body.js';
import { meta } from '../atoms/meta.js';
import { section } from '../atoms/section.js';
import { withStyle } from '../mixins/with-style.js';

import { style } from './message.css.js';

export class _PinnedMessageElement extends LitElement {
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
      text: String,
      theme: String,
      uid: String,
      username: String,
    };
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
      uid,
      unsafe,
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
                username,
              })}
          ${section({
            body: messageBody(text, { unsafe }),
            cname: cs({ [`parser-${parser}`]: parser }),
          })}
          <slot name="message-epilogue"></slot>
        </div>
      </div>
    `;
  }
}

export const PinnedMessageElement = withStyle()(_PinnedMessageElement, style);
