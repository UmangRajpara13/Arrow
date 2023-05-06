`use strict`
import installExtension, { REACT_DEVELOPER_TOOLS } from `electron-devtools-installer`;

import { app, BrowserWindow, ipcMain, Menu, session } from `electron`
import { join } from `path`
import { format as formatUrl } from `url`
import { template } from './menu'
import { CheckForUpdates,  } from './fetch.js'

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import './ipc'
import './PTY'

const argv = yargs(hideBin(process.argv)).parse();
console.log(argv  ,join(__dirname));
const isDevelopment = process.env.NODE_ENV !== `production`

var fetchLock = false
    , initialPosition = { x: 30, y: 40 }

let window = null
let windowsMap = new Map()

// TODO: windowsMap.forEach is probably not helpfull here
process.on('uncaughtException', function (error) {
    if (error.code == 'EADDRINUSE') {
        windowsMap.forEach(function (value, key) {
            windowsMap.get(parseInt(key)).webContents.send('ws_error', error.code);
        })
    }
})

var browserWindowOptions = {
    frame: false,
    // center: true,
    show: false,
    width: 1165, 
    height: 555,
    hasShadow: false,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: isDevelopment ? false : true,
        nativeWindowOpen: true
    }
}
var darwinWindowOptions = {
    titleBarStyle: 'hidden',
    backgroundColor:'#a0a0a087',
    visualEffectState: 'active',
}
var linuxWindowOptions = {

}

app.setAsDefaultProtocolClient('arrow');


function createwindow(url, arg = '') {
    return new Promise((resolve, reject) => {
        window = new BrowserWindow(
            Object.assign({}, browserWindowOptions,
                process.platform === 'darwin' ? darwinWindowOptions : linuxWindowOptions,
                initialPosition))

        initialPosition.x += 10
        initialPosition.y += 10

        windowsMap.set(window.id, window)

        windowsMap.get(window.id).once('ready-to-show', () => {
            windowsMap.get(window.id).show()
        })

        if (process.platform === 'darwin') {
            const menu = Menu.buildFromTemplate(template)
            Menu.setApplicationMenu(menu)
        }

        windowsMap.get(window.id).loadURL(url)

        windowsMap.get(window.id).webContents.on('did-finish-load', async () => {
            if (!fetchLock) {
                fetchLock = true;
                CheckForUpdates()
            }
            if (isDevelopment) {
                windowsMap.get(window.id).webContents.openDevTools()
                // windowsMap.get(window.id).maximize()  
                windowsMap.get(window.id).webContents.on(`devtools-opened`, () => {
                    windowsMap.get(window.id).focus()
                })
            } else {
                // prod  
                // windowsMap.get(window.id).webContents.openDevTools()
                if (process.platform !== 'darwin') {
                    // windowsMap.get(window.id).removeMenu()
                }
            }
        })

        windowsMap.get(window.id).on(`closed`, () => {
            windowsMap.forEach((value, key) => {
                if (windowsMap.get(key).isDestroyed()) {
                    windowsMap.delete(key)
                } else {
                    // assign last window to window
                    window = windowsMap.get(key)
                }
            })
        })
        resolve(window)
    })
}

if (process.platform === 'darwin') {
    const dockMenu = Menu.buildFromTemplate([{
        label: 'New Window',
        click() {
            createwindow();
        }
    }]);
    app.dock.setMenu(dockMenu);
}

ipcMain.on(`create_new_window`, (event, dir) => {
    url = isDevelopment ? `http://localhost:9080` :
        formatUrl({
            pathname: join(__dirname, `index.html`),
            protocol: `file`,
            slashes: true
        })
    // setting arg for new window from prev window
    process.argv[1] = dir
    createwindow(url, dir);
})

if (!isDevelopment) {
    const gotTheLock = app.requestSingleInstanceLock()
    if (!gotTheLock) {
        app.quit()
    } else {
        app.on(`second-instance`, (event, commandLine, workingDirectory) => {
            // Someone tried to run a second instance, we should focus our window.
            if (windowsMap.size > 0) {
                if (windowsMap.get(window.id).isMinimized()) windowsMap.get(window.id).restore()

                process.platform != 'darwin' ?
                    windowsMap.get(window.id).focus() :
                    windowsMap.get(window.id).show()

                windowsMap.get(window.id).webContents.send(`open_in_arrow`, commandLine, workingDirectory)

            } else {
                url = formatUrl({
                    pathname: join(__dirname, `index.html`),
                    protocol: `file`,
                    slashes: true
                })
                // here use commandLine from second instance
                createwindow(url, commandLine[1])
            }
        })

        app.whenReady().then(async () => {
            url = formatUrl({
                pathname: join(__dirname, `index.html`),
                protocol: `file`,
                slashes: true
            })
            createwindow(url, process.argv[1])
        });
    }
} else {
    //development   

    app.whenReady().then(async () => {
        // installExtension(REACT_DEVELOPER_TOOLS) 
        //     .then((name) => // console.log(`Added Extension:  ${name}`))
        //     .catch((err) => // console.log('An error occurred: ', err));
        url = `http://localhost:9080`
        createwindow(url)
    });
}


if (!isDevelopment) {
    app.on('activate', () => {

        url = formatUrl({
            pathname: join(__dirname, `index.html`),
            protocol: `file`,
            slashes: true
        })
        if (windowsMap.size == 0) createwindow(url)
    })
}

// quit application when all windows are closed
app.on(`window-all-closed`, () => {
    window = null
    windowsMap.clear()
    // on macOS it is common for applications to stay open until the response
    // explicitly quits
    if (process.platform !== `darwin`) {
        app.quit()
    }
})

export { windowsMap, createwindow, window }  