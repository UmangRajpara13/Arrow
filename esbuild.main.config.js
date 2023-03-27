import path from 'path'

/**
 * @var {Partial<import('esbuild').BuildOptions>}
 */
export default {
  platform: 'node',
  entryPoints: [path.resolve('src/main/main.js')],
  bundle: true,
  minify:true,
  target: 'node14.17.3', // electron version target
  loader: {
    '.js': 'js',
  },
  external: ["node-pty", "@popperjs/core",'fsevents']
}
