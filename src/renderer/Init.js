import { getjsonfile } from 'readJSON'
import { writejsonfile } from 'writeJSON'
import { ipcRenderer } from 'electron'
import { existsSync, writeFileSync, readFile } from 'fs';
import { globals, watcher } from "App";
import { ThemeSetup } from 'ColorSetup'
import { SetMessageOutside } from "Messages";
import { join, sep } from 'path';
import { ensureDir, readJsonSync, writeJsonSync, ensureDirSync, writeJson, readJson } from 'fs-extra';
// import { watch } from "chokidar"

var bookmarks = []
let settings, defaultSettings

function Init() {
    return new Promise(async (resolve) => {

        ipcRenderer.send(`set_minimum_dimensions`, window.screen.width / 2, window.screen.height / 2, globals.windowID)


        var configPath = globals.isDev ?
            join(process.cwd(), 'build', `${process.platform}`, 'settings.json')
            : process.platform === 'darwin' ?
                join(globals.exePath, `../../Resources/${process.platform}/settings.json`)
                : join(globals.exePath, `../resources/${process.platform}/settings.json`)

        defaultSettings = readJsonSync(configPath)

        if (!existsSync(join(globals.settingsPath, 'settings.json'))) {

            writeJsonSync(join(globals.settingsPath, 'settings.json'), defaultSettings, {
                spaces: 4
            })
        }

        defaultSettings = readJsonSync(configPath)

        // watcher.add(join(globals.settingsPath, 'settings.json'));

        await getjsonfile(join(globals.userData, 'bookmarks')).then(async (jsonfile) => {
            // MakeBookmarksObject(jsonfile)
            bookmarks = jsonfile['bookmarks'] || []
        }, () => {
            // console.log('no bookmarks')
            ensureDir(join(globals.userData), err => {
                // console.log(err) // => null
                writejsonfile(join(globals.userData, `bookmarks`), { bookmarks: [] })
            })
        })

        watcher.on('all', async (event, path) => {
            if (path !== join(globals.settingsPath, 'settings.json')) return

            if ((event === 'add' || event === 'change')) {
            // console.log('chokidar', event, path);

                readJson(path, (err, userSettings) => {
                    if (err) return //console.error(err)
                    settings = { ...defaultSettings, ...userSettings }
                    // console.log(settings)
                    resolve()

                })
            }
        });

       
    })
}
function AddBookmark(directory) {
    if (!bookmarks.includes(directory)) bookmarks.push(directory)
    writejsonfile(join(globals.userData, 'bookmarks'), { "bookmarks": bookmarks })
    setTimeout(() => {
        SetMessageOutside(`(+1) Bookmarks : ${directory}`, 'disappear')
    }, 100)
    // name = `${directory.split(sep).pop()}`
    // if (directory.split(sep).slice(-2, -1)[0].length == 0) name = `${directory.split(sep).pop()} ( / )`
    // else {    name = directory.startsWith(homedir()) ? `~/${relative(homedir(), directory).split(sep).pop()}` : `${directory.split(sep).pop()} (${directory.split(sep).slice(-2, -1)[0]})`
    // }
}
function RemoveBookmark(bookmark) {
    bookmarks.splice(bookmarks.indexOf(bookmark), 1)
    writejsonfile(join(globals.userData, 'bookmarks'), { "bookmarks": bookmarks })
}


export { Init, AddBookmark, settings, defaultSettings, RemoveBookmark, bookmarks }