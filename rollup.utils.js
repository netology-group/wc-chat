/* eslint-disable import/no-extraneous-dependencies */
import { uglify } from 'rollup-plugin-uglify'

const uglifyOptions = {
  compress: {
    drop_console: true,
    pure_getters: true,
    unsafe: true,
    unsafe_comps: true,
    warnings: false,
    toplevel: true,
  },
}

export const shouldUglify = (options = uglifyOptions, minifier) => (process.env.NODE_ENV === 'production' && !process.env.DEBUG) ? uglify(options, minifier) : []
