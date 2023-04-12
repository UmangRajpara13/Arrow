import './Compass.css'
import $ from `jquery`

import { writejsonfile } from `writeJSON`
import { directory_switch, UpdateDirectoryLink } from `xTerm`
import { shell } from `electron`
import { readdirSync, statSync, } from `fs`
import { join, relative, sep } from `path`
import { active_term, xtermMap } from `xTerm`;
import { globals } from `App`
import { homedir } from 'os'
import { clickPosition } from 'TerminalMenu'
import { ipcRenderer } from 'electron'
import { settings } from "Init"

function Compass() {

    $.contextMenu.types.compass = function (item, opt, root) {
        // this === item.$node

        $(`<div class="compass"><div class="compass-label">` +
            `<div class="compass-span"><span>${item.customName}</span></div></div>` +
            `<div class="compass-controls"><div class="compass-controls-split"><i class="bi bi-layout-split"></i></div>` +
            `<div class="compass-controls-arrow-return-right"><i class="bi bi-arrow-return-right"></i></div>` +
            `<div class="compass-controls-folder-symlink-fill"><i class="bi bi-folder-symlink-fill"></i></div></div>`)
            .appendTo(this)

        this.addClass(`compass-menu`).on(`contextmenu:focus`, function (e) {
            // setup some awesome stuff
        }).on(`contextmenu:blur`, function (e) {
            // tear down whatever you did
        }).on(`keydown`, function (e) {
            // some funky key handling, maybe?
            // console.log(e)
        })

    };

    var explore_folder_flag = false,
        split_flag = false,
        switch_term_dir_flag = false

    function createSomeMenu() {
        // console.log(`directory_switch`, directory_switch)

        var parentDirectory = new Object()
        // console.log(`parent`, directory_switch.split(sep).pop())

        parentDirectory[`parent-${directory_switch.split(sep).pop()}`] = {
            customName: `${directory_switch.split(sep).pop()} /`,
            type: `compass`,
            className: `compass-menu-parent`,
            callback: (key) => {
                var change_dir = directory_switch
                // console.log(`parentDirectory Action`, change_dir)

                if (explore_folder_flag) {
                    explore_folder_flag = false
                    shell.openPath(directory_switch, { activate: true })
                }
                else if (switch_term_dir_flag) {
                    switch_term_dir_flag = false
                    change_dir = directory_switch.startsWith(homedir()) ? `~/${relative(homedir(), directory_switch)}` : directory_switch

                    // console.log(change_dir)

                    if (change_dir.includes(' ')) {
                        temp_array = change_dir.split(' ')
                        for (let index = 0; index < temp_array.length - 1; index++) {
                            temp_array[index] = `${temp_array[index]}\\`
                        }
                        command = `cd; cd ${temp_array.join(' ')}`
                        ipcRenderer.send('write_pty', active_term, command + `\r`)

                    } else {
                        command = `cd; cd ${change_dir}`
                        ipcRenderer.send('write_pty', active_term, command + `\r`)

                    }

                    xtermMap.get(active_term).focus()
                }
                else if (split_flag) {
                    split_flag = false
                    ipcRenderer.send('spawn', {
                        process: settings['terminal.profiles'][settings['terminal.defaultProfile']][`path`],
                        args: settings['terminal.profiles'][settings['terminal.defaultProfile']][`args`],
                        workingDirectory: directory_switch,
                        view: 'newPane',
                        windowID: globals.windowID,
                        action: null
                    })
                }
                else {
                    // when you click on the parent directory
                    if (`parent-${directory_switch.split(sep).pop()}` != key) {
                        UpdateDirectoryLink(directory_switch)
                        // console.log(directory_switch)
                        setTimeout(function () {
                            $(`ul#hidden_menu_list li#compass`).contextMenu(clickPosition)
                        }, 0);
                    } else {
                        setTimeout(function () {
                            $(`ul#hidden_menu_list li#compass`).contextMenu(clickPosition)
                        }, 0);
                    }
                }

            }
        }

        var back = new Object()
        back[`back-${directory_switch.split(sep).slice(-2, -1)[0]}`] =
        {
            customName: `&#x2190 ${directory_switch.split(sep).slice(-2, -1)[0]}`,
            type: `compass`,
            className: `compass-menu-item`,
            callback: (key) => {
                var change_dir = directory_switch.substring(0, directory_switch.lastIndexOf(sep))
                // console.log(`back Action`, change_dir)
                change_dir = change_dir.startsWith(homedir()) ? `~/${relative(homedir(), change_dir)}` : change_dir
                // if path is empty, set it to root(/)
                if (change_dir.length == 0) change_dir = `/`
                // console.log(change_dir)

                if (explore_folder_flag) {
                    explore_folder_flag = false
                    if (change_dir == `/`) { shell.openPath(`/`, { activate: true }); return }
                    shell.openPath(directory_switch.substring(0, directory_switch.lastIndexOf(sep)), { activate: true })
                }
                else if (switch_term_dir_flag) {
                    switch_term_dir_flag = false

                    if (change_dir.includes(' ')) {
                        temp_array = change_dir.split(' ')
                        for (let index = 0; index < temp_array.length - 1; index++) {
                            temp_array[index] = `${temp_array[index]}\\`
                        }
                        command = `cd; cd ${temp_array.join(' ')}`
                        ipcRenderer.send('write_pty', active_term, command + `\r`)

                    } else {
                        command = `cd; cd ${change_dir}`
                        ipcRenderer.send('write_pty', active_term, command + `\r`)

                    }
                    xtermMap.get(active_term).focus()
                }
                else if (split_flag) {
                    split_flag = false
                    ipcRenderer.send('spawn', {
                        process: settings['terminal.profiles'][settings['terminal.defaultProfile']][`path`],
                        args: settings['terminal.profiles'][settings['terminal.defaultProfile']][`args`],
                        workingDirectory: directory_switch.substring(0, directory_switch.lastIndexOf(sep)),
                        view: 'newPane',
                        windowID: globals.windowID,
                        action: null
                    })
                }
                else {
                    // console.log(directory_switch.lastIndexOf(sep))
                    directory_switch.lastIndexOf(sep) ?
                        UpdateDirectoryLink(directory_switch.substring(0, directory_switch.lastIndexOf(sep))) :
                        UpdateDirectoryLink(sep)
                    setTimeout(() => {
                        $(`ul#hidden_menu_list li#compass`).contextMenu(clickPosition)
                    }, 0);
                }
            }
        }
        var dirStack = new Object()
        try {
            var files = readdirSync(directory_switch)
            files.forEach(function (file) {
                try {
                    if (statSync(join(directory_switch, file)).isDirectory()) {
                        dirStack[`${file}`] = {
                            customName: `${file}`,
                            type: `compass`,
                            className: `${file} compass-menu-item`,
                            callback: (key) => {
                                var change_dir = join(directory_switch, key)

                                if (explore_folder_flag) {
                                    explore_folder_flag = false
                                    shell.openPath(change_dir, { activate: true })
                                }
                                else if (switch_term_dir_flag) {
                                    switch_term_dir_flag = false

                                    change_dir = directory_switch.startsWith(homedir()) ? `~/${relative(homedir(), change_dir)}` : change_dir

                                    // console.log(change_dir)

                                    if (change_dir.includes(' ')) {
                                        temp_array = change_dir.split(' ')
                                        for (let index = 0; index < temp_array.length - 1; index++) {
                                            temp_array[index] = `${temp_array[index]}\\`
                                        }
                                        command = `cd; cd ${temp_array.join(' ')}`
                                        ipcRenderer.send('write_pty', active_term, command + `\r`)

                                    } else {
                                        command = `cd; cd ${change_dir}`
                                        ipcRenderer.send('write_pty', active_term, command + `\r`)

                                    }

                                    xtermMap.get(active_term).focus()
                                }
                                else if (split_flag) {
                                    split_flag = false
                                    ipcRenderer.send('spawn', {
                                        process: settings['terminal.profiles'][settings['terminal.defaultProfile']][`path`],
                                        args: settings['terminal.profiles'][settings['terminal.defaultProfile']][`args`],
                                        workingDirectory: join(directory_switch, key),
                                        view: 'newPane',
                                        windowID: globals.windowID,
                                        action: null
                                    })
                                }
                                else {
                                    UpdateDirectoryLink(join(directory_switch, key))
                                    setTimeout(function () {
                                        $(`ul#hidden_menu_list li#compass`).contextMenu(clickPosition)
                                    }, 0);

                                }
                            }
                        }
                    }
                } catch (error) {
                    // console.error(error)

                }

            })
        } catch (error) {
            // console.error(error)
        }

        appmenu = Object.assign({}, back, parentDirectory, dirStack);

        return {
            list: appmenu
        };
    }

    $(`#compass`).on(`click`, function (event) {
        var $this = $(this);

        console.log(`onclick`, event, $this.position())
        // store a callback on the trigger
        $this.data(`runCallbackThingie`, createSomeMenu);

        // open the contextMenu asynchronously
        $this.contextMenu();
    })

    // console.log(`creating compass`)
    $.contextMenu({
        selector: `li#compass`,
        trigger: `none`,
        className: `compass-menu`,
        position: function (opt, x, y) {
            opt.$menu.css('display', 'block')
                .position({ my: "center center", at: "center center", of: '#container' })
        },
        build: function ($trigger, e) {
            // console.log('building menu')
            // e.preventDefault();
            // return createSomeMenu()
            // pull a callback from the trigger
            return $trigger.data(`runCallbackThingie`)();
        },
        events: {

            show: function (opt, x, y) {
                // console.log(`menu shown`, opt)
                $(".pane-titlebar-title").addClass("undragable")

                document.querySelectorAll(`.compass-controls-split`).forEach(ele => {
                    ele.addEventListener(`mousedown`, (e) => {
                        // console.log(`split`, e)
                        // e.toElement.offsetParent.remove()
                        split_flag = true
                    })
                })
                document.querySelectorAll(`.compass-controls-arrow-return-right`).forEach(ele => {
                    ele.addEventListener(`mousedown`, (e) => {
                        // console.log(`new Dir`, e)
                        // e.toElement.offsetParent.remove()
                        switch_term_dir_flag = true
                    })
                })
                document.querySelectorAll(`.compass-controls-folder-symlink-fill`).forEach(ele => {
                    ele.addEventListener(`mousedown`, (e) => {
                        // console.log(`open dir`, e)
                        // e.toElement.offsetParent.remove()
                        explore_folder_flag = true
                    })
                })

            },
            hide: async function (opt) {
                $(".pane-titlebar-title").removeClass("undragable")
            }
        }

    });


}

export { Compass }