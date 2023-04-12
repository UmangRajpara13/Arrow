import './TerminalMenu.css'
import $ from 'jquery';
import { settings } from 'Init'

import { existsSync } from "fs"
import { xtermMap, active_term, UpdateSentenceOnPaste,  currentPWD } from "xTerm"
import { writejsonfile } from "writeJSON";
import { join, sep, relative } from "path"
import { shell, clipboard, ipcRenderer } from 'electron';
import { urlActions } from "urlSchemes";
import { nodeScripts, scriptRunner } from "KnightsWatch"
import { homedir } from "os";
import { globals } from "App";
import { SetMessageOutside } from "Messages";
import { bookmarks, AddBookmark, RemoveBookmark } from 'Init';
import { e_processTitle } from 'TitleBar';
var appmenu = {},
    explore_folder_flag = false,
    split_flag = false,
    switch_term_dir_flag = false,
    clickPosition = {}

function LoadTerminalMenu() {

    $.contextMenu.types.paneControls = function (item, opt, root) {
        // this === item.$node
        $(`<div class="paneControls">` +
            `<div class="paneControls-list-nested"><i class="bi bi-list-nested"></i></div>` +
            `<div class="paneControls-sort-down"><i class="bi bi-sort-down"></i></div>` +
            `<div class="paneControls-folder-symlink-fill"><i class="bi bi-folder-symlink-fill"></i></div>`).appendTo(this)

        this.addClass(`terminal-menu-paneControls`).on(`contextmenu:focus`, function (e) {
            // setup some awesome stuff
        }).on(`contextmenu:blur`, function (e) {
            // tear down whatever you did
        }).on(`keydown`, function (e) {
            // some funky key handling, maybe?
            // console.log(e)
        })

    };
    $.contextMenu.types.selectionControls = function (item, opt, root) {
        // this === item.$node
        $(`<div class="selectionControls">` +
            `<div class="selectionControls-clipboard"><i class="bi bi-clipboard"></i></div>` +
            `<div class="selectionControls-bi-globe2"><i class="bi bi-globe2"></i></div>` +
            `</div>`)
            .appendTo(this)

        this.addClass(`terminal-menu-selectionControls`).on(`contextmenu:focus`, function (e) {
            // setup some awesome stuff
        }).on(`contextmenu:blur`, function (e) {
            // tear down whatever you did
        }).on(`keydown`, function (e) {
            // some funky key handling, maybe?
            // console.log(e)
        })

    };
    // $.contextMenu.types.terminalControls = function (item, opt, root) {
    //     // this === item.$node
    //     $(`<div class="terminalControls"><div class="terminalControls-layout-split"><i class="bi bi-layout-split"></i></div>` +
    //         // `<div class="terminalControls-file-plus"><i class="bi bi-file-plus"></i></div>` +
    //         `<div class="terminalControls-window-plus"><i class="bi bi-window-plus"></i></div>`
    //     )
    //         .appendTo(this)

    //     this.addClass(`terminal-menu-terminalControls`).on(`contextmenu:focus`, function (e) {
    //         // setup some awesome stuff
    //     }).on(`contextmenu:blur`, function (e) {
    //         // tear down whatever you did
    //     }).on(`keydown`, function (e) {
    //         // some funky key handling, maybe?
    //         // console.log(e)
    //     })

    // };
    $.contextMenu.types.bookmark = function (item, opt, root, key) {
        // this === item.$node
        // console.log('bookmarks item', item, opt, root, key)
        $(`<div class="bookmark"><div class="bookmark-label">` +
            `<div class="bookmark-remove" value=${item.dataAttr.value}><i class="bi bi-dash"></i></div>` +
            `<div class="bookmark-span"><span>${item.customName}</span></div></div>` +
            `<div class="bookmark-controls"><div class="bookmark-controls-split"><i class="bi bi-layout-split"></i></div>` +
            `<div class="bookmark-controls-arrow-return-right"><i class="bi bi-arrow-return-right"></i></div>` +
            `<div class="bookmark-controls-folder-symlink-fill"><i class="bi bi-folder-symlink-fill"></i></div></div>`)
            .appendTo(this)

        this.addClass(`terminal-menu-bookmark`).on(`contextmenu:focus`, function (e) {
            // setup some awesome stuff
        }).on(`contextmenu:blur`, function (e) {
            // tear down whatever you did
        }).on(`keydown`, function (e) {
            // some funky key handling, maybe?
            // console.log(e)
        })

    };
    function createSomeMenu(options) {
        // console.log(e_processTitle, parent_term)
        var bookMarksObj = new Object()
        bookmarks.forEach((bookmark) => {
            var name = `${bookmark.split(sep).pop()}`
            bookMarksObj[bookmark] = {
                customName: name,
                icon: 'bi bi-bookmark-dash',
                type: 'bookmark',
                className: `terminal-menu-item`,
                dataAttr: {
                    value: bookmark
                },
                callback: (key, e, $trigger) => {
                    // console.log('bookmark', key)
                    if (explore_folder_flag) {
                        explore_folder_flag = false
                        shell.openPath(key, { activate: true })
                    }
                    else if (switch_term_dir_flag) {
                        switch_term_dir_flag = false
                        change_dir = key.startsWith(homedir()) ? `~/${relative(homedir(), key)}` : key

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
                            workingDirectory: key,
                            view: 'split',
                            windowID: globals.windowID,
                            action: null,
                            currTabNo: $('.active')[0].id

                        })
                    }
                }
            }
        })

        if (Object.keys(nodeScripts).length > 0) {
            var scripts = {}
            if (Object.keys(nodeScripts)) {
                Object.keys(nodeScripts).forEach(function (script) {
                    scripts[script] = {
                        name: script,
                        className: 'terminal-menu-item',
                        icon: 'bi bi-play',
                        callback: () => {
                            // console.log(e_processTitle[parent_term][active_term], defaultProfile)
                            if (e_processTitle[active_term]["title"] == settings['terminal.profiles'][settings['terminal.defaultProfile']][`path`]) {
                                if (scriptRunner == 'yarn') ipcRenderer.send('write_pty', active_term, `${scriptRunner} ${script}\r`)
                                else {
                                    if (script == 'start') ipcRenderer.send('write_pty', active_term, `${scriptRunner} ${script}\r`)
                                    else ipcRenderer.send('write_pty', active_term, `${scriptRunner} run ${script}\r`)
                                }
                            }
                            else {
                                alert('Process is Running!')
                            }
                        }
                    }
                })
            }

            var scriptObject = new Object()
            scriptObject['scripts'] = {}
            scriptObject['scripts'].name = 'Scripts'
            scriptObject['scripts'].className = 'terminal-menu-item'
            scriptObject['scripts'].list = Object.assign({}, scripts)
            appmenu = Object.assign({}, scriptObject, appmenu)
        }

        var defaults = {
            "paneControls": {
                className: `terminal-menu-item`,
                customName: ``,
                type: 'paneControls', callback: () => { }

            },
            "sep_1": '-------',
            "compass": {
                className: `terminal-menu-item`, name: `Compass`,
                icon: 'bi bi-compass',
                callback: (event) => {
                    $(`ul#hidden_menu_list li#compass`).trigger('click')

                }
            },
            "open": {
                className: `terminal-menu-item`, name: `Open Directory`,
                callback: () => {
                    ipcRenderer.send('open_file_dialog', globals.windowID, currentPWD)
                }
            },
            ...(xtermMap.get(active_term).hasSelection() && {
                "sep_2": '-------',

                "selectionControls": {
                    className: `terminal-menu-item`,
                    type: 'selectionControls',
                    callback: () => { }
                },
                "sep_3": '-------',

            }),
            "paste": {
                className: `terminal-menu-item`, name: `Paste`,
                callback: () => {
                    xtermMap.get(active_term).paste(clipboard.readText())
                    xtermMap.get(active_term).focus()
                    UpdateSentenceOnPaste(clipboard.readText())
                }
            }
            , "paste_go": {
                className: `terminal-menu-item`, name: `Paste & Go`,
                callback: () => {
                    ipcRenderer.send('write_pty', active_term, `${clipboard.readText()}\r`)

                    xtermMap.get(active_term).focus()
                    UpdateSentenceOnPaste(clipboard.readText())
                }
            },

            ...(Object.keys(nodeScripts).length > 0 && scriptObject),
            ...(Object.keys(urlActions).length > 0 && {
                'url': {
                    className: `terminal-menu-item`, name: `URL Actions`,
                    list: urlActions, callback: () => { }

                }
            }),
            // "sep_4": '-------',
            // "terminalControls": {
            //     className: `terminal-menu-item`,
            //     customName: ``,
            //     type: 'terminalControls', callback: () => { }

            // },
            "sep_5": '-------',
            "new_fovourite": {
                className: `terminal-menu-item`,
                icon: `bi bi-bookmark-plus`,
                name: `${currentPWD.split(sep).pop()} ${currentPWD.startsWith(homedir()) ? `~/${relative(homedir(), currentPWD.substr(0, currentPWD.lastIndexOf(sep)))}` : currentPWD.lastIndexOf(sep)}`,
                callback: () => {
                    AddBookmark(currentPWD)
                }
            },
            ...bookMarksObj,
        }

        appmenu = Object.assign({}, defaults);

        return {
            list: appmenu
        };

    }
    // some asynchronous click handler
    $('#container').on('mousedown', function (e) {
        // console.log('right click')
        if (e.button == 2) {
            // console.log('right click')
            var $this = $(this);
            // store a callback on the trigger
            //  use this technique to pass data to terminal menu
            $this.data('runCallbackThingie', createSomeMenu);

            // open the contextMenu asynchronously
            $this.contextMenu({ x: e.clientX, y: e.clientY })
        }
    });

    $(`.app`).contextMenu({
        selector: '#container',
        trigger: 'none',
        className: 'terminal-menu',

        build: function ($trigger, e) {
            // console.log(e)
            clickPosition.x = e.pageX
            clickPosition.y = e.pageY
            e.preventDefault();
            // pull a callback from the trigger
            return $trigger.data('runCallbackThingie')();
        },
        events: {
            show: function (opt) {
                // console.log('menu shown')

                SetMessageOutside(`'${clipboard.readText()}'`, 'sticky')

                $(".pane-titlebar-title").addClass("undragable")

                document.querySelectorAll('.paneControls-list-nested').forEach(ele => {
                    ele.addEventListener('mouseup', (e) => {
                        // console.log('close', e)
                        xtermMap.get(active_term).clear();
                        xtermMap.get(active_term).focus();
                    })
                })
                document.querySelectorAll('.paneControls-sort-down').forEach(ele => {
                    ele.addEventListener('mouseup', (e) => {
                        // console.log('close', e)
                        xtermMap.get(active_term).scrollToBottom()
                    })
                })
                document.querySelectorAll('.paneControls-folder-symlink-fill').forEach(ele => {
                    ele.addEventListener('mouseup', (e) => {
                        // console.log('close', e)
                        shell.openPath(currentPWD, { activate: true })
                    })
                })

                document.querySelectorAll('.selectionControls-clipboard').forEach(ele => {
                    ele.addEventListener('mouseup', (e) => {
                        // console.log('close', e)
                        if (xtermMap.get(active_term).hasSelection()) {
                            clipboard.writeText(xtermMap.get(active_term).getSelection())
                            SetMessageOutside('Copied to clipboard', 'sticky')
                        }
                    })
                })
                document.querySelectorAll('.selectionControls-bi-globe2').forEach(ele => {
                    ele.addEventListener('mouseup', (e) => {
                        // console.log('close', e)
                        if (xtermMap.get(active_term).getSelection().length != 0) {
                            shell.openExternal(`https://www.google.com/search?q=${xtermMap.get(active_term).getSelection()}`)
                        }
                    })
                })




                document.querySelectorAll('.bookmark-remove').forEach(ele => {
                    ele.addEventListener('mouseup', (e) => {
                        // console.log('close', e.target.parentElement.getAttribute('value'))
                        e.target.parentElement.parentElement.parentElement.remove()
                        RemoveBookmark(e.target.parentElement.getAttribute('value'))
                    })
                })
                document.querySelectorAll('.bookmark-controls-split').forEach(ele => {
                    ele.addEventListener('mouseup', (e) => {
                        // console.log('close', e)
                        split_flag = true
                    })
                })
                document.querySelectorAll('.bookmark-controls-arrow-return-right').forEach(ele => {
                    ele.addEventListener('mouseup', (e) => {
                        // console.log('close', e)
                        switch_term_dir_flag = true
                    })
                })
                document.querySelectorAll('.bookmark-controls-folder-symlink-fill').forEach(ele => {
                    ele.addEventListener('mouseup', (e) => {
                        // console.log('close', e)
                        explore_folder_flag = true
                    })
                })
                // console.log('menu shown')
            },
            hide: async function (opt) {
                $(".pane-titlebar-title").removeClass("undragable")


                SetMessageOutside(``, 'sticky')

                var $this = this;
                var temp = bookmarks
                temp.forEach(bookmark => {
                    if (!existsSync(bookmark)) {
                        RemoveBookmark(bookmark)
                    }
                })
                writejsonfile(join(globals.userData, 'bookmarks'), { "bookmarks": temp })
            }
        }
    });
}

export { LoadTerminalMenu, clickPosition }