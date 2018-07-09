import svg from 'rollup-plugin-svg'
import cjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'

export default {
  input: `lib/organisms/${process.env.entry}.mjs`,
  output: {
    file: `es/${process.env.entry}.js`,
    format: 'es',
  },
  plugins: [
    resolve(),
    svg(),
    cjs({
      extensions: ['.js', '.mjs'],
    }),
  ],
}
