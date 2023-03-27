const { readFile } = require('fs')
var jsonfile



readFile(`./release.json`, `utf8`, (err, jsonString) => {

    if (err) {
        console.log(`File read failed:`, err)
        // exports.error = err
        resolve(err)

    }
    try {

        jsonfile = JSON.parse(jsonString)
        console.log(jsonfile['assets'])
        var count = 0
        var myARR = jsonfile['assets'].map((element) => {
           console.log(element['name'],element['download_count'])
           count = count + element['download_count']
        });
        console.log(count)
    }
    catch (err) {
        console.log(`Parsing failed:`, err)

    }

})

