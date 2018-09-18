import invariant from 'invariant'

const _ = ns => (cond, ...argv) => invariant(cond, ...argv) // eslint-disable-line no-unused-vars

export const registerCustomElement = (key, value) => {
  if (!key || !value) throw new Error('CustomElement is not specified')
  !window.customElements.get(key) && window.customElements.define(key, value)
}

export const Debug = (namespace) => {
  const debug = _(namespace)

  return (...argv) => debug(process.env.NODE_ENV === 'production', ...argv)
}
