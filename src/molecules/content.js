export class UnsafeContentElement extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<div>${this.textContent}</div>`;
  }
}
