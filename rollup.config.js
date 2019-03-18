import babel from 'rollup-plugin-babel'
import cssdupl from 'postcss-discard-duplicates'
import cjs from 'rollup-plugin-commonjs'
import cssfonts from 'postcss-fontpath'
import cssimport from 'postcss-import'
import cssurl from 'postcss-url'
import env from 'postcss-preset-env'
import json from 'rollup-plugin-json'
import npm from 'rollup-plugin-node-resolve'
import postcss from 'rollup-plugin-postcss'
import svg from 'rollup-plugin-svg'

import { shouldUglify } from './util/rollup-uglify'
import { name as pkgname, directories, peerDependencies } from './package.json'

const copy = require('./util/copy')
const moduleName = require('./util/module-name')

const entry = process.env.ENTRY || 'index'
const noCssTransform = process.env.SKIPCSS

const copyModule = (to, ...argv) => argv.reduce((acc, it) => {
  acc[it] = `${to}/${it}`

  console.info('Copying', it, 'to', acc[it]) // eslint-disable-line no-console

  return acc
}, {})

const copyToPublic = (...list) => copyModule('public', ...list)

const css = () => postcss(noCssTransform
  ? {}
  : {
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
      cssdupl(),
    ],
  })

const dist = (name = moduleName(pkgname, true)) => ({
  input: `${directories.lib}/${entry}.js`,
  output: {
    exports: 'named',
    format: 'umd',
    name,
    globals: {
      'markdown-it': 'markdownit',
      'intl-messageformat': 'IntlMessageFormat',
    },
  },
  external: _ => Object.keys(peerDependencies || {}).includes(_),
  plugins: [
    npm({
      browser: true,
      node: true,
    }),
    cjs(),
    css(),
    svg(),
    json(),
    babel(),
    shouldUglify(),
    copy(copyToPublic(
      'node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js',
      'node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js',
      'node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js.map',
    )),
  ],
})

export default dist()
