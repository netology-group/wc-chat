import MarkdownIt from 'markdown-it'

const sanitize = (input) => {
  let tmp = document.createElement('div')

  tmp.textContent = input
  const { innerHTML } = tmp

  tmp = undefined

  return innerHTML
}

export function Message () {
  return _ => _
}

export function HTMLEntityMessage () {
  return input => sanitize(input).replace(/\n{2,}/g, '\n')
}

export function MarkdownMessage (opts = {}) {
  const { preset, rules } = opts.parser

  const isStrict = preset && preset === 'strict'

  const options = isStrict
    ? ['zero', { linkify: true, typographer: true }]
    : [
      (preset || {
        linkify: true,
        typographer: true,
        ...(opts.markdownit || {}),
      }),
    ]

  const md = new MarkdownIt(...options)

  const hasExternalRules = rules && Array.isArray(rules) && rules.length

  md.enable(hasExternalRules
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
      : [])

  return input => md.render(input)
}
