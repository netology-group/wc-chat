/**
 * Uses:
 * ./content.index.js
 * ./input.index.js
 * ./message.index.js
 * ./messages-extended.index.js
 * ./reactions.index.js
 * ./scrollable-unseen.index.js
 */
import { ChatI18NElement } from './ecosystems/chat-i18n.js';

customElements.define('wc-chat', ChatI18NElement);
