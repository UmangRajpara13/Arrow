import './Profile.css'
import $ from 'jquery';

import { ipcRenderer, shell } from `electron`
import { globals } from `App`;
import { join } from `path`;
import { settings } from "Init";

var wsConnected = true;
var ws_error
ipcRenderer.on(`ws_error`, (event, error) => {
    // console.log(`ws_error`, typeof error)
    ws_error = error
    wsConnected = false
    alert(`${error}:${settings?.sonicPort || 3030}`)
})

function LoadProfileMenu() {
    $(`#toolbar`).contextMenu({
        selector: `.settings`,
        trigger: `left`,
        autohide: false,
        build: function ($trigger, e) {

            var defaultItems = {
                help: {
                    className: `settings`,
                    name: `Help`,
                    callback: () => {
                        shell.openExternal('https://github.com/thevoyagingstar/sonic')
                    }
                },
                feedback: {
                    className: `settings`,
                    name: `Feedback`,
                    callback: () => { shell.openExternal('https://github.com/thevoyagingstar/sonic/issues') }
                },
                About: {
                    className: `settings`,
                    name: `About`,
                    list: {
                        'about': {
                            name: `Version ${globals.version}`,
                            className: `disabled`
                        }

                    }
                },
                ws: {
                    className: `disabled`,
                    icon: `bi bi-broadcast`
                },
                settings: {
                    className: `settings`,
                    name: `Settings`,
                    callback: () => {
                        shell.openPath(join(globals.userData, `settings`))
                    }
                },
                reload: {
                    className: `settings`,
                    name: `Reload`,
                    callback: () => {
                        // console.log(`reload`, globals.windowID)
                        ipcRenderer.send(`reload`, globals.windowID)
                    }
                },
                fullscreen: {
                    className: `settings`,
                    name: `Toggle Fullscreen`,
                    callback: () => {
                        ipcRenderer.send('toggle_fullscreen', globals.windowID)
                    }
                },
            }
            if (!wsConnected) defaultItems.ws.name = `${ws_error}`
            else defaultItems.ws.name = `Listening on ${settings?.sonicPort}`

            if (process.platform === 'darwin') appmenu = Object.assign({}, defaultItems)
            else appmenu = Object.assign({}, defaultItems)

            return {
                list: appmenu
            };
        },
    })

}
export { LoadProfileMenu }