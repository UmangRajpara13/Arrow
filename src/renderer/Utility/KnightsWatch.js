import { exec } from 'child_process'
import { readdirSync, statSync, existsSync } from `fs`
import { readJson, readJsonSync } from 'fs-extra';

var files = []
    , branches = []
    , nodeScripts = {}
    , scriptRunner

function Watch(pwd) {
    // console.log('Watching', pwd)

    files = [], nodeScripts = {}, branches = []
    var data = readdirSync(pwd)
    if (data.includes('package.json')) {
        packageObj = readJsonSync(`${pwd}/package.json`)
        nodeScripts = packageObj.scripts ? packageObj.scripts : {}
        scriptRunner = data.includes('yarn.lock') ? 'yarn' : 'npm'
        // console.log(nodeScripts, scriptRunner)
    }
    // if (file == '.git') {
    //     // console.log('// read git branches')
    //     var git_read = readdirSync(`${pwd}/.git/refs/heads`)
    //     // console.log(git_read)
    //     git_read.forEach(function (branch) {
    //         branches.push(branch)
    //         // console.log(branch)
    //     })
    // }
    data.forEach(function (file) {
        try {
            if (!statSync(`${pwd}/${file}`).isDirectory()) {
                // console.log('// read files')

                files.push(file)
            }
        } catch (error) {
            // console.error(error)
        }
    })
    // console.log(files)

}
export { Watch, files, branches, nodeScripts, scriptRunner }