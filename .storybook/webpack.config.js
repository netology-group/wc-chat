const defaultConfig = require('@open-wc/demoing-storybook/default-storybook-webpack-config.js');

module.exports = ({ config }) => {

  const { rules: defaultModuleRules } = config.module

  config.module.rules[0] = {
    ...defaultModuleRules[0],
    exclude: /node_modules\/(?!(lit-html|@polymer)\/).*/
    // exclude: /node_modules\/(?!(@polymer)\/).*/
  }

  return defaultConfig({ config, transpilePackages: ['lit-html', 'lit-element', '@open-wc'] });
};
