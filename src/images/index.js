import { svg } from 'lit-element'

export const warning = (svg`<svg id="warninig" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
  <g fill-rule="evenodd">
    <path fill-rule="nonzero" d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12zm0 2A8 8 0 1 1 8 0a8 8 0 0 1 0 16z"/>
    <path d="M9 9H7V4h2zM9 12H7v-2h2z"/>
  </g>
</svg>`)

export const del = (svg`<svg id="delete" xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18">
  <g fill-rule="evenodd">
    <path fill-rule="nonzero" d="M9 7h2v7H9zM5 7h2v7H5z"/>
    <path fill-rule="nonzero" d="M3 5v11h10V5H3zM1 3h14v15H1V3z"/>
    <path d="M4 0h8v5H4V0zm2 2v1h4V2H6z"/>
    <path fill-rule="nonzero" d="M0 5h16V3H0z"/>
  </g>
</svg>`)

export const lock = (svg`<svg width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M5 0C2.23859 0 0 2.23859 0 5V8H10V5C10 2.23859 7.76147 0 5 0ZM5 2C3.34314 2 2 3.34314 2 5V6H8V5C8 3.34314 6.65686 2 5 2Z" transform="translate(3)" fill="#B8B8B8"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M13.0909 0H2.90912C1.30243 0 0 1.30243 0 2.90912V10.1818C0 13.3951 2.60486 16 5.81818 16H10.1818C13.3951 16 16 13.3951 16 10.1818V2.90912C16 1.30243 14.6975 0 13.0909 0ZM2 2.90912C2 2.40704 2.40704 2 2.90912 2H13.0909C13.593 2 14 2.40704 14 2.90912V10.1818C14 12.2905 12.2905 14 10.1818 14H5.81818C3.70947 14 2 12.2905 2 10.1818V2.90912Z" transform="translate(0 6)" fill="#B8B8B8"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M2.18188 2.64374C2.61658 2.3988 2.90906 1.94104 2.90906 1.41669C2.90906 0.634277 2.25781 0 1.45459 0C0.651245 0 0 0.634277 0 1.41669C0 1.94104 0.29248 2.39886 0.727295 2.6438V3.52277C0.727295 3.92444 1.05286 4.25 1.45459 4.25C1.8562 4.25 2.18188 3.92444 2.18188 3.52277V2.64374Z" transform="translate(6.54541 11.375)" fill="#B8B8B8"/>
</svg>`)

export const locked = (svg`<svg width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M5 0C2.23853 0 0 2.23859 0 5V8H10V5C10 2.23859 7.76147 0 5 0ZM5 2C3.34314 2 2 3.34314 2 5V6H8V5C8 3.34314 6.65686 2 5 2Z" transform="translate(3)" fill="#48A1E6"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M13.0909 0H2.90906C1.30249 0 0 1.30243 0 2.90912V10.1818C0 13.3951 2.60486 16 5.81824 16H10.1818C13.3951 16 16 13.3951 16 10.1818V2.90912C16 1.30243 14.6975 0 13.0909 0ZM9.45447 6.79169C9.45447 7.31604 9.16199 7.7738 8.72729 8.01874V8.89777C8.72729 9.29944 8.40161 9.625 8 9.625C7.59827 9.625 7.27271 9.29944 7.27271 8.89777V8.0188C6.83789 7.77386 6.54541 7.31604 6.54541 6.79169C6.54541 6.00928 7.19666 5.375 8 5.375C8.80322 5.375 9.45447 6.00928 9.45447 6.79169Z" transform="translate(0 6)" fill="#48A1E6"/>
</svg>`)

export const amend = (svg`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="15" viewBox="0 0 16 15">
  <defs>
    <path id="a" d="M0 0h16v16H0z"/>
  </defs>
  <g fill="none" fill-rule="evenodd" transform="translate(0 -1)">
    <mask id="b" fill="#fff">
      <use xlink:href="#a"/>
    </mask>
    <path fill="#B8B8B8" fill-rule="nonzero" d="M6.121 2.485v12.172l1 1 1-1V2.485h-2zm-2-2h6v15l-3 3-3-3v-15z" mask="url(#b)" transform="rotate(45 7.121 9.485)"/>
    <path fill="#B8B8B8" fill-rule="nonzero" d="M9 16v-2h7v2z" mask="url(#b)"/>
  </g>
</svg>`)

export const entry = (svg`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <g fill="none" fill-rule="evenodd" transform="rotate(-90 12 12)">
    <circle cx="12" cy="12" r="12" fill="#48A1E6"/>
    <path fill="#FFF" fill-rule="nonzero" d="M10.2 8.649l.849-.849 4.024 4.024-4.024 4.025L10.2 15l3.176-3.176z"/>
  </g>
</svg>`)

export const smile = (svg`<svg width="26" height="16" viewBox="0 0 26 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0 8C0 12.4182 3.58167 16 8 16C12.4183 16 16 12.4182 16 8C16 3.58179 12.4183 0 8 0C3.58167 0 0 3.58179 0 8ZM15 8C15 11.866 11.866 15 8 15C4.13403 15 1 11.866 1 8C1 4.13403 4.13403 1 8 1C11.866 1 15 4.13403 15 8Z" fill="#B8B8B8"/>
<path d="M0.0684113 0.760408C-0.0678355 0.522532 0.00581659 0.213915 0.232567 0.0713954C0.458845 -0.0708268 0.752265 0.00601634 0.888225 0.243391C1.18372 0.759298 1.53889 0.996346 2 0.996346C2.46111 0.996346 2.81628 0.759298 3.11177 0.243391C3.24773 0.00601634 3.54116 -0.0708268 3.76743 0.0713954C3.99418 0.213915 4.06784 0.522532 3.93159 0.760408C3.46598 1.57332 2.8061 2 2 2C1.1939 2 0.534021 1.57332 0.0684113 0.760408Z" transform="translate(6 9)" fill="#B8B8B8"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M1 2C1.55228 2 2 1.55228 2 1C2 0.447715 1.55228 0 1 0C0.447715 0 0 0.447715 0 1C0 1.55228 0.447715 2 1 2Z" transform="translate(4 6)" fill="#B8B8B8"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M1 2C1.55228 2 2 1.55228 2 1C2 0.447715 1.55228 0 1 0C0.447715 0 0 0.447715 0 1C0 1.55228 0.447715 2 1 2Z" transform="translate(10 6)" fill="#B8B8B8"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M4.5 0H3.5V3.5H0V4.5H3.5V8H4.5V4.5H8V3.5H4.5V0Z" transform="translate(18 4)" fill="#B8B8B8"/>
</svg>`)

export const menu = (svg`<svg width="14" height="3" viewBox="0 0 14 3" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 3C2.32843 3 3 2.32843 3 1.5C3 0.671573 2.32843 0 1.5 0C0.671573 0 0 0.671573 0 1.5C0 2.32843 0.671573 3 1.5 3Z" fill="#B8B8B8"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 3C13.3284 3 14 2.32843 14 1.5C14 0.671573 13.3284 0 12.5 0C11.6716 0 11 0.671573 11 1.5C11 2.32843 11.6716 3 12.5 3Z" fill="#B8B8B8"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M7 3C7.82843 3 8.5 2.32843 8.5 1.5C8.5 0.671573 7.82843 0 7 0C6.17157 0 5.5 0.671573 5.5 1.5C5.5 2.32843 6.17157 3 7 3Z" fill="#B8B8B8"/>
</svg>`)

export const smiley = (svg`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0 8C0 12.4183 3.58203 16 8 16C12.418 16 16 12.4183 16 8C16 3.58167 12.418 0 8 0C3.58203 0 0 3.58167 0 8ZM14 8C14 11.3137 11.3135 14 8 14C4.68652 14 2 11.3137 2 8C2 4.68628 4.68652 2 8 2C11.3135 2 14 4.68628 14 8Z" fill="#B8B8B8"/>
<path d="M5.85148 9.88464C5.6492 9.53148 5.75819 9.07425 6.09953 8.85971C6.4473 8.64113 6.89926 8.75963 7.10516 9.11911C7.35768 9.55998 7.63379 9.74632 8 9.74632C8.36622 9.74632 8.64233 9.55998 8.89484 9.11911C9.10074 8.75963 9.55271 8.64113 9.90047 8.85971C10.2418 9.07425 10.3508 9.53148 10.1485 9.88464C9.63928 10.7737 8.8986 11.25 8 11.25C7.1014 11.25 6.36072 10.7737 5.85148 9.88464Z" fill="#B8B8B8"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M5 8C5.55228 8 6 7.55228 6 7C6 6.44772 5.55228 6 5 6C4.44772 6 4 6.44772 4 7C4 7.55228 4.44772 8 5 8Z" fill="#B8B8B8"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M11 8C11.5523 8 12 7.55228 12 7C12 6.44772 11.5523 6 11 6C10.4477 6 10 6.44772 10 7C10 7.55228 10.4477 8 11 8Z" fill="#B8B8B8"/>
</svg>`)

export const cross = (svg`<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
<mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="10" height="10">
<rect width="10" height="10" fill="#C4C4C4"/>
</mask>
<g mask="url(#mask0)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8.29297 9.70706L0.292969 1.70706L1.70718 0.292847L9.70718 8.29285L8.29297 9.70706Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M0.292969 8.29285L8.29297 0.292847L9.70718 1.70706L1.70718 9.70706L0.292969 8.29285Z" fill="white"/>
</g>
</svg>`)

export const human = (svg`<svg width="8" height="9" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6 2C6 3.10457 5.10457 4 4 4C2.89543 4 2 3.10457 2 2C2 0.895431 2.89543 0 4 0C5.10457 0 6 0.895431 6 2Z" fill="#B8B8B8"/>
<path d="M0 7C0 5.89543 0.895431 5 2 5H6C7.10457 5 8 5.89543 8 7V9H0V7Z" fill="#B8B8B8"/>
</svg>`)

export const arrowDown = (svg`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.1295 4L14.5 5.39309L8 12L1.5 5.39309L2.87054 4L8 9.21383L13.1295 4Z" fill="white"/>
</svg>`)
