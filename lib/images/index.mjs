import { html } from '@polymer/lit-element'

export const warning = html`<svg id="warninig" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
  <g fill-rule="evenodd">
      <path fill-rule="nonzero" d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12zm0 2A8 8 0 1 1 8 0a8 8 0 0 1 0 16z"/>
      <path d="M9 9H7V4h2zM9 12H7v-2h2z"/>
  </g>
</svg>`

export const del = html`<svg id="delete" xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18">
  <g fill-rule="evenodd">
      <path fill-rule="nonzero" d="M9 7h2v7H9zM5 7h2v7H5z"/>
      <path fill-rule="nonzero" d="M3 5v11h10V5H3zM1 3h14v15H1V3z"/>
      <path d="M4 0h8v5H4V0zm2 2v1h4V2H6z"/>
      <path fill-rule="nonzero" d="M0 5h16V3H0z"/>
  </g>
</svg>`
