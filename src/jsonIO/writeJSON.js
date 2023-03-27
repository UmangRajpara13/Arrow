import { writeFile } from 'fs'

function writejsonfile(file_path, file) {
    // console.log(`writing... ${file_path}`)

    writeFile(`${file_path}.json`, JSON.stringify(file, undefined, 4),
        function (err) {
            if (err) return // console.log(err)
        })
}

export { writejsonfile }