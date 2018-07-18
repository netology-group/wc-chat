import autoprefixer from 'autoprefixer'
import cjs from 'rollup-plugin-commonjs'
import env from 'postcss-preset-env'
import polyfill from 'rollup-plugin-polyfill'
import postcss from 'rollup-plugin-postcss'
import resolve from 'rollup-plugin-node-resolve'
import svg from 'rollup-plugin-svg'

const input = `lib/organisms/${process.env.entry}.mjs`

export default {
  input,
  output: {
    file: `dist/${process.env.entry}.js`,
    format: 'umd',
    name: `${process.env.entry}`,
  },
  plugins: [
    polyfill(input, ['../../dist/polyfill']),
    resolve(),
    postcss({ plugins: [env(), autoprefixer()] }),
    svg(),
    cjs({
      extensions: ['.js', '.mjs'],
    }),
  ],
}
