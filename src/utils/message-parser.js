import { debug as Debug } from './index.js';

const debug = Debug('@ulms/wc-chat/util/message-parser');

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
  const isCustomLinkify = Object.hasOwnProperty.call(opts, 'linkify');

  const options = isStrict
    ? ['zero', { linkify: !isCustomLinkify, typographer: true }]
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
          'normalize',
          'blockquote',
          'paragraph',
          'smartquotes',
          'emphasis',
          'backticks',
          'fence',
        ].concat(isCustomLinkify ? [] : 'linkify')
      : [],
  );

  return _input => {
    const outputArr = [];
    let last = 0;

    const output = md.render(_input);

    if (opts.linkify && opts.linkify.blanklink) {
      const matches = md.linkify.match(output);

      if (matches && matches.length) {
        matches.forEach(match => {
          if (last < match.index) outputArr.push(output.slice(last, match.index));

          outputArr.push(`<a target="_blank" href="${match.url}">${match.text}</a>`);

          last = match.lastIndex;
        });
      }

      if (last < output.length) outputArr.push(output.slice(last));
    } else {
      outputArr.push(output);
    }

    return outputArr.join('');
  };
}
