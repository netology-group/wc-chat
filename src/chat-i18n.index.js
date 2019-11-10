import './content.index.js';
import './input.index.js';
import './message.index.js';
import './messages-extended.index.js';
import './reactions.index.js';
import './scrollable-unseen.index.js';
import { ChatI18NElement } from './ecosystems/chat-i18n.js';

customElements.define('wc-chat', ChatI18NElement);
