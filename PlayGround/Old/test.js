const { join } = require('path')
const { existsSync } = require('fs')
const { resolve } = require('path')

console.log(existsSync(resolve('dist')))
console.log(resolve('dist'))
console.log(join('/home','/umang'))