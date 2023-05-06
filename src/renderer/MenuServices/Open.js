import './Open.css'
import './Settings.css'

import $ from `jquery`
import { sep } from 'path';
import { active_term, xtermMap } from 'xTerm';
import { ipcRenderer, shell } from 'electron';
import { openDirectory } from 'StatusBar'
import { globals } from 'App'
import { settings } from 'Init'

// ipcRenderer.on('code_open_in_arrow', (event, arg) => {
//     // console.log('code_open_in_arrow',)
//     openDirectory = existsSync(arg) ? arg : homedir()
// })

function Open() {
    function createSomeMenu() {
        // console.log(`creatimg items for open menu`)
        var defaults = {

            "split": {
                className: `terminal-menu-item`,
                name: `split right`,
                icon: `bi bi-layout-split`,
                callback: () => {
                    ipcRenderer.send('spawn', {
                        process: settings['terminal.profiles'][settings['terminal.defaultProfile']][`path`],
                        args: settings['terminal.profiles'][settings['terminal.defaultProfile']][`args`],
                        workingDirectory: openDirectory,
                        view: 'newPane',
                        windowID: globals.windowID,
                        action: null,
                    })
                }
            },
            "current_terminal":
            {
                className: `terminal-menu-item`,
                name: `in current pane`,
                icon: `bi bi-arrow-return-right`,
                callback: () => {
                    if (openDirectory.includes(' ')) {
                        temp_array = openDirectory.split(' ')
                        for (let index = 0; index < temp_array.length - 1; index++) {
                            temp_array[index] = `${temp_array[index]}\\`
                        }
                        // console.log(temp_array.join(' '))
                        command = `cd; cd ${temp_array.join(' ')}`
                        ipcRenderer.send('write_pty', active_term, command + `\r`)

                    } else {
                        command = `cd; cd ${openDirectory}`
                        ipcRenderer.send('write_pty', active_term, command + `\r`)

                    }
                    xtermMap.get(active_term).focus()
                }
            },
            // "new_window": {
            //     className: `terminal-menu-item`,
            //     name: `in new window`,
            //     icon: `bi bi-window-plus`,
            //     callback: () => {
            //         ipcRenderer.send('create_new_window', openDirectory)
            //     }
            // }
        }
        appmenu = Object.assign({}, defaults);

        return {
            list: appmenu
        };
    }

    $(`#open`).on(`click`, function (event) {
        var $this = $(this);

        // console.log(`onclick`, event, $this.position())
        // store a callback on the trigger
        $this.data(`runCallbackThingie`, createSomeMenu);
        // open the contextMenu asynchronously
        $this.contextMenu();
    })

    // console.log(`creating Open menu`)
    $.contextMenu({
        selector: `li#open`,
        trigger: `none`,
        className: 'data-title',
        position: function (opt, x, y) {
            opt.$menu.css('display', 'block')
                .position({ my: "center center", at: "center center", of: '#container' })
        },
        build: function ($trigger, e) {
            e.preventDefault();

            // pull a callback from the trigger
            return $trigger.data(`runCallbackThingie`)();
        },
        events: {

            show: function (opt, x, y) {
                // console.log(`menu shown`, opt, openDirectory,openDirectory.split(sep),openDirectory.split(sep).length)
                var dirName = process.platform == 'darwin' ?
                    openDirectory.split(sep)[openDirectory.split(sep).length - 2]
                    : openDirectory.split(sep).pop()

                $('.data-title').attr('data-menutitle', `${sep}${dirName}`)

            },
            hide: async function (opt) {

            }
        }

    });


}

export { Open }