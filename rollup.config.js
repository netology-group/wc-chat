import { createDefaultConfig } from '@open-wc/building-rollup';
import nodeBuiltins from 'rollup-plugin-node-builtins'

// if you need to support IE11 use "modern-and-legacy-config" instead.
// import { createCompatibilityConfig } from '@open-wc/building-rollup';
// export default createCompatibilityConfig({ input: './index.html' });

// export default createDefaultConfig({ input: './index.html' });
const config = createDefaultConfig({ input: './index.html' });

import cssimport from 'postcss-import'
import postcss from 'rollup-plugin-postcss'
import cssfonts from 'postcss-fontpath'
import cssurl from 'postcss-url'
import env from 'postcss-preset-env'
import json from 'rollup-plugin-json'

import litcss from 'rollup-plugin-lit-css'

const css = () => {
  return postcss({
    extract: false,
    modules: false,
    namedExports: function namedExports (name) {
      return `_$${name.replace(/-/g, '_')}`
    },
    plugins: [
      cssimport({ addModulesDirectories: ['node_modules'] }),
      cssurl({ url: 'inline' }),
      cssfonts(),
      env(),
      // cssdupl(),
    ],
  })
}

// config.plugins = config.plugins.concat([
//   // nodeBuiltins()
//   css()
// ])

// config.plugins = [css()].concat(config.plugins)

console.log(config)

export default {
  ...config,
  plugins: [
    ...config.plugins,
    litcss({
      include: [
        './src/ecosystems/chat.module.css'
      ]
    })
  ]
}
