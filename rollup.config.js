import autoprefixer from 'autoprefixer'
import babel from 'rollup-plugin-babel'
import cjs from 'rollup-plugin-commonjs'
import copy from 'rollup-plugin-copy'
import cssfonts from 'postcss-fontpath'
import cssimport from 'postcss-import'
import cssurl from 'postcss-url'
import env from 'postcss-preset-env'
import json from 'rollup-plugin-json'
import postcss from 'rollup-plugin-postcss'
import nodeResolve from 'rollup-plugin-node-resolve'
import svg from 'rollup-plugin-svg'

import { shouldUglify } from './rollup.utils'
import { directories } from './package.json'

const entry = process.env.ENTRY || 'index'
const ns = process.env.NAMESPACE || 'WCChat'
const noCssTransform = process.env.SKIPCSS

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
      autoprefixer(),
    ],
  })

const dist = (name = ns) => ({
  input: `${directories.lib}/${entry}.js`,
  output: {
    format: 'umd',
    exports: 'named',
    name,
  },
  plugins: [
    nodeResolve(),
    css(),
    svg(),
    json(),
    cjs(),
    babel(),
    shouldUglify(),
    copy({ './fonts': 'public/fonts' }),
  ],
})

export default dist()
