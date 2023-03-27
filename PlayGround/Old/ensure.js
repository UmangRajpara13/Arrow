const fs = require('fs-extra')

const dir = '/home/umang/.config/temp'
const desiredMode = 0o2775
const options = {
  mode: 0o2775
}

fs.ensureDir(dir)
.then(() => {
  console.log('success!')
})
.catch(err => {
  console.error(err)
})