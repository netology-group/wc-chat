import svg from 'rollup-plugin-svg'
import cjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'

export default {
  input: `lib/polyfill/index.js`,
  output: {
    file: `dist/polyfill.js`,
    format: 'umd',
  },
  plugins: [
    resolve(),
    cjs({
      extensions: ['.js'],
    }),
  ],
}
