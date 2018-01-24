import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'

export default {
  input: 'src/react/index.js',
  output: {
    name: 'k-simple-state-react',
    file: 'react.js',
    format: process.env.FORMAT || 'umd',
    sourcemap: 'react.js',
    globals: {
      react: 'React',
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
  external: ['react'],
}
