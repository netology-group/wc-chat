import { html as lithtml } from 'lit-element';

export const withStyleLink = html => {
  html = html || lithtml; // eslint-disable-line no-param-reassign

  return (base, ...styleLinks) =>
    class extends base {
      render() {
        return html`
          ${styleLinks.map(
            link => html`<link rel="stylesheet" type="text/css" href=${link}></link>`,
          )}
          ${super.render()}
        `;
      }
    };
};
