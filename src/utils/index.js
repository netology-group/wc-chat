export const registerCustomElement = (key, value) => {
  if (!key || !value) throw new Error('CustomElement is not specified')
  !window.customElements.get(key) && window.customElements.define(key, value)
}
