const Fs = require('fs')

function createdDate(file) {
               const { birthtime } = Fs.statSync(file)

               return Fs.statSync(file)
}

console.log(
               createdDate('/home/umang/.config/sonic/remote/user.json')
               // createdDate('/home/umang/Desktop/test/app.js')
)