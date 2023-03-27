import { readFile } from 'fs'

var jsonfile

function getjsonfile(file_path) {
    // console.log(`reading... ${file_path}`)

    return new Promise((resolve, reject) => {

        readFile(`${file_path}.json`, `utf8`, (err, jsonString) => {

            if (err) {
                // console.log(`File read failed:`, err)
                reject(err)

            } else {
                try {

                    jsonfile = JSON.parse(jsonString)
                    resolve(jsonfile)
                }
                catch (err) {
                    // console.log(`Parsing failed:`, err)
                    reject(err)

                }
            }

        })
    });
}

export { getjsonfile, jsonfile }