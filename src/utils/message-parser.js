import { debug as Debug } from './index.js';

const debug = Debug('@netology-group/wc-chat/util/message-parser');

const sanitize = input => {
  let tmp = document.createElement('div');

  tmp.textContent = input;
  const { innerHTML } = tmp;

  tmp = undefined;

  return innerHTML;
};

export function Message() {
  return _ => _;
}

export function HTMLEntityMessage() {
  return input => sanitize(input).replace(/\n{2,}/g, '\n');
}

export function MarkdownMessage(opts = {}) {
  const { preset, rules, engine: Engine } = opts.parser;

  if (!Engine) {
    debug('Parser is absent');
    return a => a;
  }

  const isStrict = preset && preset === 'strict';

  const options = isStrict
    ? ['zero', { linkify: true, typographer: true }]
    : [
        preset || {
          linkify: true,
          typographer: true,
          ...(opts.markdownit || {}),
        },
      ];

  const md = new Engine(...options); // eslint-disable-line new-cap

  const hasExternalRules = rules && Array.isArray(rules) && rules.length;

  md.enable(
    hasExternalRules
      ? rules
      : isStrict
      ? [
          'linkify',
          'normalize',
          'blockquote',
          'paragraph',
          'smartquotes',
          'emphasis',
          'backticks',
          'fence',
        ]
      : [],
  );

  return input => md.render(input);
}
