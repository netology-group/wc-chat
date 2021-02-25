/**
 * Uses:
 * ./input.index.js
 * ./message.index.js
 * ./messages.index.js
 * ./scrollable.index.js
 * ./reactions.index.js
 */
import { ChatElement } from './ecosystems/chat.js';

customElements.define('wc-chat', ChatElement);
