const { lstatSync,existsSync } = require('fs')

console.log(lstatSync("/home/user/Desktop/sonic/dist").isDirectory())
console.log(existsSync("/home/user/Desktop/sonic/dist/sonic_0.0.1_amd64.deb"))