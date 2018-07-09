import svg from 'rollup-plugin-svg'
import cjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import polyfill from 'rollup-plugin-polyfill'

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
    svg(),
    cjs({
      extensions: ['.js', '.mjs'],
    }),
  ],
}
