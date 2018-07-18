import autoprefixer from 'autoprefixer'
import cjs from 'rollup-plugin-commonjs'
import env from 'postcss-preset-env'
import postcss from 'rollup-plugin-postcss'
import resolve from 'rollup-plugin-node-resolve'
import svg from 'rollup-plugin-svg'

export default {
  input: `lib/organisms/${process.env.entry}.mjs`,
  output: {
    file: `es/${process.env.entry}.js`,
    format: 'es',
  },
  plugins: [
    resolve(),
    postcss({ plugins: [env(), autoprefixer()] }),
    svg(),
    cjs({
      extensions: ['.js', '.mjs'],
    }),
  ],
}
