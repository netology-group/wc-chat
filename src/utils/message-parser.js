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
  return input => sanitize(input)
}

export function MarkdownMessage (opts = {}) {
  const md = new MarkdownIt({
    html: false,
    linkify: true,
    typographer: true,
    ...(opts.markdownit || {}),
  })

  return input => md.render(input)
}
