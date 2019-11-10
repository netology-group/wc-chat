import { createDefaultConfig } from '@open-wc/building-rollup';

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

config = {
  ...config,
  output: {
    ...config.output,
    filename: '[name].js',
    chunkFilename: '[name].js',
  },
};

export default config;
