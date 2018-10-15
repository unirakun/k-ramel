import fs from 'fs'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import sourcemaps from 'rollup-plugin-sourcemaps'

const pkg = JSON.parse(fs.readFileSync('./package.json'))

export default {
  input: 'src/index.js',
  output: {
    name: pkg.name,
    file: `dist/index.${process.env.FORMAT}.js`,
    format: process.env.FORMAT,
    sourcemap: false,
    globals: {
      react: 'React',
      redux: 'Redux',
      'k-redux-factory': 'k-redux-factory',
      'fbjs/lib/shallowEqual': 'fbjs/lib/shallowEqual',
      '@k-ramel/driver-http': '@k-ramel/driver-http',
      'redux-little-router': 'redux-little-router',
      'redux-form': 'reduxForm',
      'k-ramel': 'kRamel',
    },
  },
  plugins: [
    sourcemaps(),
    babel({
      configFile: process.env.BABEL_CONFIG,
    }),
    commonjs({
      include: 'node_modules/**',
      extensions: ['.js', '.jsx'],
    }),
    terser(),
  ],
  external: [
    '@k-ramel/driver-http',
    'fbjs/lib/shallowEqual',
    'react',
    'k-redux-factory',
    'redux',
    'redux-form',
    'redux-little-router',
  ],
}
