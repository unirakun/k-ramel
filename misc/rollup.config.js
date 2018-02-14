import path from 'path'
import fs from 'fs'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'

const pkg = JSON.parse(fs.readFileSync('./package.json'))

export default {
  input: pkg['jsnext:main'] || 'src/index.js',
  output: {
    name: pkg.amdName || pkg.name,
    file: pkg.main,
    format: process.env.FORMAT || 'umd',
    sourcemap: path.resolve(pkg.main),
    globals: {
      react: 'React',
      redux: 'Redux',
      'k-redux-factory': 'k-redux-factory',
      lodash: '_',
      'fbjs/lib/shallowEqual': 'fbjs/lib/shallowEqual',
      '@k-ramel/driver-http': '@k-ramel/driver-http',
    },
  },
  plugins: [
    babel(),
    commonjs({
      include: 'node_modules/**',
      extensions: ['.js', '.jsx'],
    }),
    uglify(),
  ],
  external: [
    '@k-ramel/driver-http',
    'fbjs/lib/shallowEqual',
    'react',
    'k-redux-factory',
    'redux',
    'lodash',
  ],
}
