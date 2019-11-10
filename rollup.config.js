import { createDefaultConfig } from '@open-wc/building-rollup';

// import cssimport from 'postcss-import'
// import postcss from 'rollup-plugin-postcss'
// import cssfonts from 'postcss-fontpath'
// import cssurl from 'postcss-url'
// import env from 'postcss-preset-env'

import litcss from 'rollup-plugin-lit-css';

// if you need to support IE11 use "modern-and-legacy-config" instead.
// import { createCompatibilityConfig } from '@open-wc/building-rollup';
// export default createCompatibilityConfig({ input: './index.html' });

// export default createDefaultConfig({ input: './index.html' });
// eslint-disable-next-line import/no-mutable-exports
let config = createDefaultConfig({
  input: './index.html',
  indexHTMLPlugin: {
    polyfills: {
      'core-js': true,
    },
    loader: 'external',
  },
});

// const css = () => postcss({
//     extract: false,
//     modules: false,
//     namedExports: function namedExports (name) {
//       return `_$${name.replace(/-/g, '_')}`
//     },
//     plugins: [
//       cssimport({ addModulesDirectories: ['node_modules'] }),
//       cssurl({ url: 'inline' }),
//       cssfonts(),
//       env(),
//       // cssdupl(),
//     ],
//   })

config = {
  ...config,
  plugins: [
    ...config.plugins,
    litcss({
      include: ['./src/ecosystems/chat.module.css'],
    }),
  ],
  output: {
    ...config.output,
    filename: '[name].js',
    chunkFilename: '[name].js',
  },
};

// eslint-disable-next-line no-console
console.log(config);

export default config;
