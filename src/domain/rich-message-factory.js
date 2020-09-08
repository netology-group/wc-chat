import { HTMLEntityMessage, MarkdownMessage } from '../utils/message-parser.js';

import { MessageFactory } from './message-factory.js';

const MARKDOWN = 'markdown';

export class RichMessageFactory extends MessageFactory {
  // eslint-disable-next-line class-methods-use-this
  get _parsers() {
    const parsers = new Map([...super._parsers]);

    parsers.set(MARKDOWN, MarkdownMessage);
    parsers.set('html-entities', HTMLEntityMessage);

    return parsers;
  }

  make(data) {
    return {
      ...super.make(data),
      unsafe: this.__parsername === MARKDOWN,
    };
  }
}
