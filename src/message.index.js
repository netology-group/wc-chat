import { MessageElement } from './molecules/message.js';
import { PinnedMessageElement } from './molecules/message-pinned.js';

customElements.define('wc-chat-message', MessageElement);
customElements.define('wc-chat-message-pinned', PinnedMessageElement);
