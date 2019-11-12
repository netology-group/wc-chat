import { createCompatibilityConfig } from '@open-wc/building-rollup';

// if you need to support IE11 use "modern-and-legacy-config" instead.
// import { createCompatibilityConfig } from '@open-wc/building-rollup';
// export default createCompatibilityConfig({ input: './index.html' });

// export default createDefaultConfig({ input: './index.html' });

const config = createCompatibilityConfig({
  input: './index.html',
  outputDir: 'dist',
  indexHTMLPlugin: {
    loader: 'external',
    polyfills: {
      'core-js': true,
    },
  },
});

console.info(config); // eslint-disable-line no-console

export default config;
