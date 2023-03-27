const fs = require('fs-extra')

// With a callback:
fs.readJson('./master.json', (err, master) => {
    if (err) return console.error(err)
    console.log(master)
    fs.readJson('./setting.json', (err, setting) => {
        if (err) return console.error(err)
        // console.log(setting) // => 0.1.3
        console.log('-----')
        console.log({ ...master, ...setting })
    })
})