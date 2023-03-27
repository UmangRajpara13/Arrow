import path from 'path'

/**
 * @var {Partial<import('esbuild').BuildOptions>}
 */
export default {
  platform: 'browser',
  entryPoints: [path.resolve('src/renderer/index.jsx')],
  bundle: true,
  // minify: true, minifySyntax: true, minifyWhitespace: true, minifyIdentifiers: true,
  target: 'chrome89', // electron version target
  loader: {
    '.js': 'js',
    '.png': 'dataurl',
    '.woff2': 'dataurl',
    '.woff': 'dataurl',
    '.css': 'css',
    '.svg': 'dataurl'
    },
  external: ['fsevents']

}
