/* eslint-disable import/no-extraneous-dependencies */
import { terser as uglify } from 'rollup-plugin-terser'

const uglifyOptions = {
  compress: {
    drop_console: true,
    pure_getters: true,
    unsafe_comps: true,
    warnings: false,
  },
}

export const shouldUglify = (options = uglifyOptions, minifier) => process.env.NODE_ENV === 'production' ? uglify(options, minifier) : []
