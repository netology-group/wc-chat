import { Message } from '../utils/message-parser.js';
import { debug as Debug } from '../utils/index.js';

const debug = Debug('@ulms/wc-chat/message-factory');
const parserSym = Symbol('parser');
const RAW = 'raw';

export class MessageFactory {
  constructor(props = {}) {
    const { parserengine, parser, parserpreset, parserrules } = props;

    this.__parsername = parser;

    const hasNeededParser = this._parsers.has(this.__parsername);

    if (!hasNeededParser) {
      debug(`Use Raw parser instead of ${this.__parsername}`);

      this.parser = this._parsers.get(RAW)();
    } else {
      const parserFn = this._parsers.get(this.__parsername);

      if (typeof parserFn !== 'function') {
        debug('Can not instantinate a parser');
      } else {
        this.parser = parserFn({
          parser: {
            engine: parserengine,
            preset: parserpreset,
            rules: parserrules ? parserrules.split(',') : [],
          },
          linkify: {
            blanklink: true,
          },
        });
      }
    }
  }

  get parser() {
    return this[parserSym];
  }

  set parser(a) {
    this[parserSym] = a;
  }

  // eslint-disable-next-line class-methods-use-this
  get _parsers() {
    return new Map([['raw', Message]]);
  }

  destroy() {
    this.parser = undefined;
  }

  make(data = {}) {
    const { body, unsafe = false } = data;

    return {
      body: this.parser(body),
      unsafe,
    };
  }
}
