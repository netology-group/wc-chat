/* eslint-disable import/no-extraneous-dependencies */
import { uglify } from 'rollup-plugin-uglify'

const uglifyOptions = {
  compress: {
    drop_console: true,
    pure_getters: true,
    unsafe_comps: true,
    warnings: false,
  },
}

export const shouldUglify = (options = uglifyOptions, minifier) => process.env.NODE_ENV === 'production' ? uglify(options, minifier) : []
