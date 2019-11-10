/* eslint-disable max-classes-per-file */
import { LitElement } from 'lit-element';
import { storiesOf, html } from '@open-wc/demoing-storybook';

import { button } from '../src/atoms/button.js';
import { textarea } from '../src/atoms/textarea.js';

import '../src/input.index.js';
import '../src/message.index.js';
import '../src/chat.index.js';

customElements.define(
  'textarea-atom',
  class Textarea extends LitElement {
    static get properties() {
      return {
        disabled: String,
        id: String,
        maxlength: Number,
        maxrows: Number,
        placeholder: String,
        value: String,
      };
    }

    render() {
      return textarea({
        disabled: this.disabled,
        id: this.id,
        maxlength: this.maxlength,
        maxRows: this.maxrows,
        placeholder: this.placeholer,
        value: this.value,
        onInput(...argv) {
          console.info(...argv);
        },
      });
    }
  },
);

customElements.define(
  'button-atom',
  class Button extends LitElement {
    static get properties() {
      return {
        disabled: String,
        text: String,
      };
    }

    render() {
      return button({
        children: this.text || this.children,
        disabled: this.disabled,
      });
    }
  },
);

storiesOf('ecosystems|chat-element', module).add(
  'basic',
  () => html`
    <wc-chat
      placeholder="Awaits input"
      placeholderdisabled="Disabled"
      .list=${[
        {
          avatar: 'https://about.gitlab.com/images/devops-tools/gitlab-logo.svg',
          text: 'Hello World!',
          icon: 'man',
          id: 'asdasgdfuba6sdtnaiusd',
          identity: 'Administrator', // eslint-disable-line no-unused-vars
          rating: 0,
          theme: 'red',
          timestamp: Math.round(Date.now() / 1e3),
          user_id: 3,
          user_name: 'Alan Mathison Turing',
          visible: true,
        },
        {
          avatar: 'https://about.gitlab.com/images/devops-tools/gitlab-logo.svg',
          text: 'Hello World!',
          icon: 'man',
          id: 'asdasgdfuba6sdtnaiusd',
          identity: 'Administrator', // eslint-disable-line no-unused-vars
          rating: 0,
          theme: 'red',
          timestamp: Math.round(Date.now() / 1e3),
          user_id: 3,
          user_name: 'Alan Mathison Turing',
          visible: true,
        },
      ]}
    ></wc-chat>
  `,
);

storiesOf('organisms|input-element', module).add(
  'basic',
  () => html`
    <wc-chat-input
      disabled="disabled"
      placeholder="Awaits input"
      placeholderdisabled="Disabled"
    ></wc-chat-input>
    <wc-chat-input placeholder="Awaits input" placeholderdisabled="Disabled"></wc-chat-input>
  `,
);

storiesOf('organisms|message-element', module).add(
  'basic',
  () => html`
    <wc-chat-message
      text="message text"
      username="Marco Polo"
      timestamp="1572515613205"
      user_role="user"
    ></wc-chat-message>
  `,
);

storiesOf('atoms|button', module).add(
  'basic',
  () => html`
    <button-atom text="active"></button-atom>
    <button-atom text="disabled" disabled="disabled">disabled</button-atom>
  `,
);

storiesOf('atoms|button', module).add(
  'other',
  () => html`
    <button-atom></button-atom>
    <button-atom><span>rich text</span></button-atom>
  `,
);

storiesOf('atoms|textarea', module).add(
  'basic',
  () => html`
    <textarea-atom
      maxrows="10"
      id="textarea"
      maxlength="50"
      disabled="disabled"
      value="disabled"
    ></textarea-atom>
    <textarea-atom maxrows="10" id="textarea" maxlength="50"></textarea-atom>
  `,
);
