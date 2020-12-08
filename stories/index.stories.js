/* eslint-disable max-classes-per-file */
import { LitElement } from 'lit-element';
import { storiesOf, html } from '@open-wc/demoing-storybook'; // eslint-disable-line import/no-extraneous-dependencies

import { button } from '../src/atoms/button.js';
import { textarea } from '../src/atoms/textarea.js';

import '../src/chat-i18n.index.js';
import '../src/chat-with-filters.index.js';
import '../src/input.index.js';
import '../src/message.index.js';
import '../src/messages-extended.index.js';
import '../src/scrollable-unseen.index.js';

import { imElement, imWithFiltersElement } from './ecosystems/im-element.js';
import * as messageMolecules from './molecules/message.js';
import * as pinnedMessageMolecules from './molecules/pinned-message.js';
import * as richMessageMolecules from './molecules/rich-message.js';
import * as messagesWithPinnedOrganisms from './organisms/messages.js';

import { _messages, _users } from './mocks.js';

const messages = _messages.map(a => ({
  ..._users[parseInt(a.user_id) - 1],
  ...a,
}));

customElements.define(
  'textarea-atom',
  class Textarea extends LitElement {
    static get properties() {
      return {
        disabled: String,
        id: String,
        maxlength: { type: Number },
        maxrows: { type: Number },
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
          console.info(...argv); // eslint-disable-line no-console
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

/* Atoms */

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
      disabled="disabled"
      id="textarea"
      maxlength="50"
      maxrows="10"
      value="disabled"
    ></textarea-atom>
    <textarea-atom maxrows="10" id="textarea" maxlength="50"></textarea-atom>
  `,
);

/* Molecules */

const messageStory = storiesOf(`molecules|message`, module);

Object.keys(messageMolecules).forEach(a => {
  messageStory.add(a, () => messageMolecules[a]('The message'));
});

const pinnedMessageStory = storiesOf(`molecules|pinned-message`, module);

Object.keys(pinnedMessageMolecules).forEach(a => {
  pinnedMessageStory.add(a, () => pinnedMessageMolecules[a]('The message'));
});

const richMessageStory = storiesOf(`molecules|rich-message`, module);

Object.keys(richMessageMolecules).forEach(a => {
  richMessageStory.add(a, () => richMessageMolecules[a]());
});

/* Organisms */

storiesOf('organisms|input-element', module).add(
  'basic',
  () => html`
    <wc-chat-input
      disabled="disabled"
      placeholder="Awaits input"
      placeholderdisabled="Disabled"
    ></wc-chat-input>
    <br />
    <wc-chat-input placeholder="Awaits input" placeholderdisabled="Disabled"></wc-chat-input>
  `,
);

const messagesWithActionsStory = storiesOf('organisms|messages', module);

Object.keys(messagesWithPinnedOrganisms).forEach(a => {
  messagesWithActionsStory.add(a, () => messagesWithPinnedOrganisms[a]([messages]));
});

const pinnedMessagesWithActionsStory = storiesOf('organisms|pinned-messages', module);

Object.keys(messagesWithPinnedOrganisms).forEach(a => {
  pinnedMessagesWithActionsStory.add(a, () =>
    messagesWithPinnedOrganisms[a]([messages.map(b => ({ ...b, pinned: true }))]),
  );
});

/* Ecosystems */

storiesOf('ecosystems|im', module).add('basic', () => imElement(messages));

storiesOf('ecosystems|im-with-pinned-filter', module).add('basic', () =>
  imWithFiltersElement([messages]),
);
