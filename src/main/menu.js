import { app, shell } from `electron`
import { windowsMap, window } from './main'
const isMac = process.platform === 'darwin'
const isDevelopment = process.env.NODE_ENV !== `production`
 
const template = [
    // { role: 'appMenu' }
    ...(isMac ? [{   
        label: app.name,
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
        ]
    }] : []),
    // { role: 'fileMenu' }
    {
        label: 'File',
        submenu: [
            isMac ? { role: 'close' } : { role: 'quit' }
        ]
    },
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forceReload' },
            { type: 'separator' },
            { role: 'resetZoom' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    },
    // { role: 'windowMenu' }
    {
        label: 'Window',
        submenu: [
            {
                label: 'Maximize/UnMaximize',
                click: async () => {
                    if (windowsMap.get(window.id).isFullScreen()) windowsMap.get(window.id).setFullScreen(false)
                    windowsMap.get(window.id).isMaximized() ? windowsMap.get(window.id).unmaximize() : windowsMap.get(window.id).maximize()
                }
            },
            { type: 'separator' },
            // isDevelopment ? { role: 'toggleDevTools' } : { role: 'zoom' },
            // { role: 'toggleDevTools' },
            { type: 'separator' },
            { role: 'window' }
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click: async () => {
                    const { shell } = require('electron')
                    await shell.openExternal('https://github.com/umangrajpara13/sonic')
                }
            }
        ]
    }
]

export { template }