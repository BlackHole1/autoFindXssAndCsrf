const buble = require('rollup-plugin-buble')
const cjs = require('rollup-plugin-commonjs')
const node = require('rollup-plugin-node-resolve')
const flow = require('rollup-plugin-flow-no-whitespace')
const resolve = require('rollup-plugin-node-resolve')
const { uglify } = require('rollup-plugin-uglify');
const version = require('./package.json').version;
const author = require('./package.json').author;

const env = process.env.NODE_ENV;

const banner =
  '/*!\n' +
  ' * AutoFindXss v' + version + '\n' +
  ' * (c) 2014-' + new Date().getFullYear() + ' ' + author + '\n' +
  ' * Released under the MIT License.\n' +
  ' */';

const plugins = [
  resolve({
    jsnext: true,
    main: true,
    browser: true
  }),
  flow(),
  buble({
    transforms: {
      dangerousForOf: true
    }
  }),
  node(),
  cjs(),
  (env === 'production' && uglify())
]

const output = (file, global) => ({
  file,
  banner,
  env,
  global,
  plugins: plugins,
  format: 'umd',
  name: 'findXss',
  sourcemap: env === 'development' ? 'inline' : false,
})

export default [{
  input: 'src/chrome/background/background.js',
  plugins: plugins,
  output: output('build/chrome/find-xss.chrome.background.js', [ "deep-eql" ])
}, {
  input: 'src/chrome/injection/injection.js',
  plugins: plugins,
  output: output('build/chrome/find-xss.chrome.injection.js')
}]
