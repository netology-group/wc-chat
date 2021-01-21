import { MessagesElement as _XMessagesElement } from './src/organisms/messages.js';

import { EventEmitter, withStyle, withStyleLink } from './src/index.js';

export { ChatElement } from './src/ecosystems/chat.js';

export { ChatI18NElement } from './src/ecosystems/chat-i18n.js';

export { ChatFilteredElement } from './src/ecosystems/chat-with-filters.js';

export { InputElement } from './src/organisms/input.js';

export { MessageElement } from './src/molecules/message.js';

export { PinnedMessageElement } from './src/molecules/message-pinned.js';

export { MessagesElement } from './src/organisms/messages.js';

export { ReactionsElement } from './src/organisms/reactions.js';

export { ScrollableElement } from './src/organisms/scrollable.js';

export { ScrollableUnseenElement } from './src/organisms/scroll-to-unseen.js';

export class XMessagesElement extends _XMessagesElement {
  constructor(...argv) {
    super(...argv);

    // eslint-disable-next-line no-console
    console.warn(
      'XMessagesElement is deprecated and will be removed at next major release. Use MessagesElement instead.',
    );
  }
}

export const mixins = {
  withStyle,
  withStyleLink,
};

export { EventEmitter };
