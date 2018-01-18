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
      redux: 'Redux',
      'k-redux-factory': 'k-redux-factory',
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
  external: ['k-redux-factory', 'redux'],
}
