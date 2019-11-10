export class UnsafeContentElement extends HTMLElement {
  connectedCallback(){
    this.innerHTML = this.textContent
  }
}
