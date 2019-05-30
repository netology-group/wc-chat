import { LitElement } from '@polymer/lit-element'

/* eslint-disable */
export class XLitElement extends LitElement {
  get renderComplete () {
    if (!this.__renderComplete) {
      this.__renderComplete = new Promise((resolve) => {
        this.__resolveRenderComplete = (value) => {
          this.__resolveRenderComplete = this.__renderComplete = undefined
          resolve(value)
        }
      })
      if (!this.__isInvalid && this.__resolveRenderComplete) {
        Promise.resolve().then(() => {
          this.__resolveRenderComplete && this.__resolveRenderComplete(false)
        })
      }
    }

    return this.__renderComplete
  }
}
/* eslint-enable */
