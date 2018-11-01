import Debug from 'debug'
import invariant from 'invariant'

// eslint-disable-next-line no-unused-vars
const _ = ns => (cond, ...argv) => invariant(cond, ...argv)

export const registerCustomElement = (key, value) => {
  if (!key || !value) throw new Error('CustomElement is not specified')
  !window.customElements.get(key) && window.customElements.define(key, value)
}

export const Invariant = (namespace) => {
  const nvrnt = _(namespace)

  return (...argv) => nvrnt(process.env.NODE_ENV === 'production', ...argv)
}

export const debug = (namespace) => {
  const deb = Debug(namespace)

  return (...argv) => process.env.NODE_ENV !== 'production' ? deb(...argv) : null
}

export const getIndexById = (id, array) => {
  let index = null

  for (let i = 0; i < array.length; i++) {
    if (array[i].id === id) {
      index = i

      break
    }
  }

  return index
}
