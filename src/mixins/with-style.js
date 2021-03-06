import { html as lithtml, css as litcss } from 'lit-element';

export const withStyle = (html, css) => {
  html = html || lithtml; // eslint-disable-line no-param-reassign
  css = css || litcss; // eslint-disable-line no-param-reassign

  return (base, ...styles) =>
    class extends base {
      static get styles() {
        return (base.styles || []).concat(styles || css(''));
        // return (base.styles || []).concat(styles.length ? styles.map((style) => style instanceof TemplateResult ? style : css(style)) : css(''));
      }
    };
};
