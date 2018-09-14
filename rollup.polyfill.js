/* eslint-disable import/no-extraneous-dependencies */
import babel from 'rollup-plugin-babel'
import copy from 'rollup-plugin-copy'
import nodeResolve from 'rollup-plugin-node-resolve'

import { shouldUglify } from './rollup.config'
import { directories } from './package.json'

const copyPublicModules = (entries = []) => entries.reduce((acc, it) => {
  acc[it] = `public/${it}`

  return acc
}, {})

const polyfill = () => ({
  input: `${directories.lib}/polyfill.js`,
  output: {
    format: 'iife',
  },
  plugins: [
    babel(),
    copy(copyPublicModules([
      'node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js',
      'node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js',
      'node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js.map',
      'node_modules/core-js/client',
    ])),
    nodeResolve(),
    shouldUglify(),
  ],
})

export default polyfill()
