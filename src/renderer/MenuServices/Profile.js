import './Profile.css'
import $ from 'jquery';

import { ipcRenderer, shell } from `electron`
import { globals } from `App`;
import { join } from `path`;



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
                        shell.openExternal('https://github.com/umangrajpara13/sonic')
                    }
                },
                feedback: {
                    className: `settings`,
                    name: `Feedback`,
                    callback: () => { shell.openExternal('https://github.com/umangrajpara13/sonic/issues') }
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

            if (process.platform === 'darwin') appmenu = Object.assign({}, defaultItems)
            else appmenu = Object.assign({}, defaultItems)

            return {
                list: appmenu
            };
        },
    })

}
export { LoadProfileMenu }