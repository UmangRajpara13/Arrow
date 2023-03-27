// const { promises: { readdir } } = require('fs')
// // import { readdir } from 'fs'
// const getDirectories = async source =>
//     (await readdir(source, { withFileTypes: true }))
//         .filter(dirent => dirent.isDirectory())
//         .map(dirent => { console.log(dirent.name), dirent.name })

// console.log(getDirectories('./'))
const fs = require("fs")
const path = require("path")
const ignore_folders = ['.git','node_modules','.vs']
const getAllFiles = function (dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath)
    // console.log('files',__dirname)
    arrayOfFiles = arrayOfFiles || []

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory() && !ignore_folders.includes(file)) {
            arrayOfFiles.push(path.join(__dirname, dirPath, "/", file))

            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
        }
    })

    return arrayOfFiles
}

console.log(getAllFiles('/home/umang/Desktop', []))