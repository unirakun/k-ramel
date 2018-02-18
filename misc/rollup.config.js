import fs from 'fs'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'
import sourcemaps from 'rollup-plugin-sourcemaps'

const pkg = JSON.parse(fs.readFileSync('./package.json'))

export default {
  input: 'src/index.js',
  output: {
    name: pkg.name,
    file: `dist/index.${process.env.FORMAT}.js`,
    format: process.env.FORMAT,
    sourcemap: true,
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
    sourcemaps(),
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
