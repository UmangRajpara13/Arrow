const { resolve } = require("path")

var somepath = 'C:\\users\\umang'

//  for git
console.log(somepath.replace(/[\:]/g, '').replace(/[\\]/g, '/'))

var gitpath = '/c'
console.log(resolve(gitpath.replace(/[\/]/g, '\\')))
console.log(resolve(gitpath.replace(/[\/]/g, '\\')))