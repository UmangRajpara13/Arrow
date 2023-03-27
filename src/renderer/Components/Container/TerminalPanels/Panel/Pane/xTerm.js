import 'xtermCss'
import $ from 'jquery'
import { WebLinksAddon } from 'xterm-addon-web-links';
import { Unicode11Addon } from 'xterm-addon-unicode11';
import { shell, clipboard, ipcRenderer } from 'electron';
import { Terminal } from "xterm"
import { currentPalette, terminalDevColors } from 'ColorSetup';
import { colorConfig } from 'ColorSetup';
import { SetMessageOutside } from 'Messages';
import { KeyBindings } from 'KeyBindings'
import { globals } from 'App';
import { Watch } from 'KnightsWatch';
import { Resize } from 'resize';
import { execSync } from 'child_process';
import { RemovePane } from 'Container';
import { AnalyseURL } from 'urlSchemes';
import { settings } from "Init";

var arrow_count = 0
    , ptyProcessMap = new Map()
    , xtermMap = new Map()
    , fitAddonMap = new Map()
    , directory_switch
    , sentence = ''
    , active_term
    , cursor_pos = 0
    , xtermCursor = new Object(), nodeScripts, scriptRunner
    , currentPWD
    , autocomplete_selector = 'ul[id*=\'ui-id\']:not([style*="display: none"])'
    , specialKeys = [
        'Home', 'PageUp', 'PageDown', 'End', 'NumLock', 'Backspace', 'Delete', 'Insert',
        'CapsLock', 'Tab', 'Escape', 'Meta',
        'Enter', 'Shift', 'Alt', 'AltGraph', ' ', 'Control',
        'ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight',
        'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'
    ],
    exculdeModifiersAsKeys = ['Control', 'Alt', 'AltGraph', 'Shift', 'Meta']
    , show_autoComplete = true
    , lockKeyBindings = false
    , paneQueue = []
    , parent_term

ipcRenderer.on('data', (event, processID, data) => {
    // console.log('received', processID, data);
    xtermMap.get(processID).write(data)
})
ipcRenderer.on('kill_xterm', (event, processID) => {
    // console.log('kill_xterm', processID);
    xtermMap.get(processID).dispose()
    xtermMap.delete(processID)

    // if (xtermMap.size > 0) Resize();
    RemovePane(processID)

})
function xTerminal(pid) {
    // console.log(pid, colorConfig)
    // console.log(settings, defaultSettings)

    return new Promise((res, reject) => {
        active_term = pid

        //     ptyProcessMap.set(ptyProcess.pid, ptyProcess)
        const xterm = new Terminal({
            ...settings['terminal.configuration'],
            theme: globals.isDev ? terminalDevColors : colorConfig.colorPalettes[currentPalette].panel.terminal,
            allowTransparency: true,
            linkTooltipHoverDuration: 1
        })


        xtermMap.set(pid, xterm)

        xtermMap.get(pid).open(document.getElementById(`xterm-${pid}`))
        // console.log(xtermMap.get(pid))

        xtermMap.get(pid).loadAddon(new WebLinksAddon((event, uri) => {
            // console.log(event, uri)
            if (event.ctrlKey) shell.openExternal(uri)
        },
            {
                willLinkActivate: (event) => {
                    // console.log('link activate')
                    event?.preventDefault();
                    // return shallActivateWebLink(event);
                    return true;
                },
                tooltipCallback: (event, uri) => {
                    // console.log('tooltip callback')
                    SetMessageOutside('ctrl + click to open', 'sticky')
                },
                leaveCallback: (event, uri) => {
                    // console.log('leave')
                    SetMessageOutside('', 'sticky')
                }
            }
        ));
        
        xtermMap.get(pid).loadAddon(new Unicode11Addon());
        xtermMap.get(pid).unicode.activeVersion = '11';

        // xterm.loadAddon(new WebglAddon());
        //     setTimeout(() => {
        //         UpdateTabTittleOutSide(ptyProcess.pid, ptyProcessMap.get(ptyProcess.pid).process)
        //     }, 100)



        xtermMap.get(pid).onData(data => {
            // console.log('onData', pid, data)
            // ptyProcessMap.get(ptyProcess.pid).write(data);
            ipcRenderer.send('data', pid, data)
        });


        xtermMap.get(pid).onRender((rows) => {
            ipcRenderer.send('get_latest_process_name', globals.windowID, pid)
        });

        xtermMap.get(pid).onLineFeed(() => {
            // ipcRenderer.send('get_latest_process_name', globals.windowID, pid)
        });

        //     $(`#xterm-${ptyProcess.pid}`).on('mousedown', (event) => {
        //         active_term = parseInt(event.currentTarget.id.replace(/^\D+/g, ``))
        //     })

        //     $(`#xterm-${ptyProcess.pid}`).on('contextmenu', (event) => {
        //         // active_term = parseInt(event.currentTarget.id.replace(/^\D+/g, ``))
        //         active_term = ptyProcess.pid
        //         // console.log('xterm contextmenu', active_term)
        //     })

        $(`#xterm-${pid}`).on('mouseover', (event) => {
            active_term = event.currentTarget.id.replace(/^\D+/g, ``)
            // console.log('xterm mouseover', active_term)
            parent_term = $(`#xterm-${active_term}`)[0].parentElement.id.replace(/^\D+/g, ``)

            currentPWD = execSync(`lsof -p ${active_term} | grep cwd`)
            currentPWD = `${currentPWD}`.substring(`${currentPWD}`.search(/\//g), `${currentPWD}`.length).replace(/\n/g, '')

            directory_switch = currentPWD
            Watch(currentPWD)
            AnalyseURL()
            // console.log('xterm mouseover', currentPWD)
        })


        //     $(`#xterm-${ptyProcess.pid}`).on('focusin', (event) => {
        //         // console.log('xterm focusin', ptyProcess.pid)

        //         // active_term = ptyProcess.pid
        //         active_term = parseInt(event.currentTarget.id.replace(/^\D+/g, ``))

        //         // var paddingLeft = parseFloat($(`#xterm-${active_term}`).css('padding-left'))
        //         // var realCellWidth = xtermMap.get(active_term)['_core']._renderService.dimensions.actualCellWidth
        //         // var offsetLeft = $(`#xterm-${active_term}`).position().left
        //         // xtermCursor.left = offsetLeft + paddingLeft + realCellWidth * (xtermMap.get(active_term).buffer.normal.cursorX)

        //         // var paddingTop = parseFloat($(`#xterm-${active_term}`).css('padding-top'))
        //         // var headingHeight = $('#tabs ol').height()
        //         // var realCellHeight = xtermMap.get(active_term)['_core']._renderService.dimensions.actualCellHeight

        //         // xtermCursor.top = ((xtermMap.get(active_term).buffer.normal.cursorY + 1) * realCellHeight) + paddingTop + headingHeight
        //     })

        //     $(`#xterm-${ptyProcess.pid}`).on('click', (event) => {
        //         // active_term = ptyProcess.pid
        //         active_term = parseInt(event.currentTarget.id.replace(/^\D+/g, ``))

        //         // xtermMap.get(ptyProcess.pid).focus()
        //         // console.log('xterm click', ptyProcess.pid)
        //     })


        xtermMap.get(pid).attachCustomKeyEventHandler((event) => {
            // console.log(`${event.type}:${event.key}`)
            if (event.type == 'keydown' || event.type == 'keypress') {

                if (event.metaKey || event.ctrlKey || event.altKey || event.altGraphKey) {

                    if (event.metaKey) {
                        if (process.platform == 'darwin') {
                            if (event.code == 'Space' & event.ctrlKey) {
                                ipcRenderer.send('showEmogi')
                                event.preventDefault(); return false
                            }
                            if (event.key == 'C' || event.key == "c") {
                                clipboard.writeText(xtermMap.get(active_term).getSelection())
                                SetMessageOutside('Copied', 'disappear'); return
                            }
                            if (event.key == 'V' || event.key == "v") {
                                // console.log(clipboard.readText())
                                xtermMap.get(active_term).paste(clipboard.readText())
                                xtermMap.get(active_term).focus()
                                UpdateSentenceOnPaste(clipboard.readText()); return
                            }
                        }
                    }
                    if (event.ctrlKey) {
                        // console.log('ctrl key')
                        // linux and darwin
                        if (process.platform == 'linux') {
                            if (event.shiftKey && (event.key == 'C' || event.key == "c")) {
                                clipboard.writeText(xtermMap.get(active_term).getSelection())
                                SetMessageOutside('Copied', 'disappear'); return
                            }
                            if (event.shiftKey && (event.key == 'V' || event.key == "v")) {
                                xtermMap.get(active_term).focus()
                            }
                        }
                    }
                    if (!exculdeModifiersAsKeys.includes(event.key) & !lockKeyBindings) {
                        KeyBindings(event).then((obj) => {
                            console.log('KeyBindings found', obj.event, obj.focusPID);
                            if (obj.focusPID) {
                                // console.log('switch focus from', active_term, 'to', obj.focusPID);
                                xtermMap.get(active_term).blur();
                                xtermMap.get(obj.focusPID).focus();
                            }
                            lockKeyBindings = true;
                            // event.preventDefault(); return false
                        }, () => {
                            // console.log('no Key Bindings')
                        })
                    }
                }
                //             // else {
                //             // no modifiers
                //             // if (ptyProcessMap.get(ptyProcess.pid).process != defaultProfile) return

                //             // if (xtermCursor.start != xtermCursor.end) {
                //             //     paddingLeft = parseFloat($(`#xterm-${ptyProcess.pid}`).css('padding-left'))
                //             //     realCellWidth = xtermMap.get(ptyProcess.pid)['_core']._renderService.dimensions.actualCellWidth
                //             //     offsetLeft = $(`#xterm-${ptyProcess.pid}`).position().left

                //             //     xtermCursor.left = offsetLeft + paddingLeft + realCellWidth * (xtermMap.get(ptyProcess.pid).buffer.normal.cursorX)
                //             // }

                //             // if (event.key == 'ArrowDown') {
                //             //     // console.log('arrow down')
                //             //     if ($(autocomplete_selector).css('display')) {
                //             //         // console.log('preventing')
                //             //         event.preventDefault()
                //             //         return false
                //             //     }
                //             //     if (arrow_count < 0) arrow_count += 1
                //             //     if (arrow_count == 0) {
                //             //         SetMessageOutside('autocomplete ON', 'sticky')
                //             //         setTimeout(() => {
                //             //             SetMessageOutside('', 'sticky')
                //             //         }, 1000)
                //             //     }
                //             //     // console.log(arrow_count)
                //             //     return
                //             // }

                //             // if (event.key == 'ArrowUp') {
                //             //     // console.log('ArrowUp')
                //             //     if ($(autocomplete_selector).css('display')) {
                //             //         // console.log('preventing')
                //             //         event.preventDefault()
                //             //         return false
                //             //     }
                //             //     arrow_count -= 1
                //             //     // console.log(arrow_count)
                //             //     SetMessageOutside('autocomplete OFF ...waiting for enter(or ctrl + u)', 'sticky')
                //             //     return
                //             // }

                //             // if (event.key == 'Enter') {
                //             //     if (arrow_count < 0) {
                //             //         arrow_count = 0
                //             //         SetMessageOutside('autocomplete ON', 'sticky')
                //             //         setTimeout(() => {
                //             //             SetMessageOutside('', 'sticky')
                //             //         }, 1000)
                //             //         return
                //             //     }
                //             //     if ($(autocomplete_selector).css('display') && $(autocomplete_selector).find('.ui-state-active')[0]) {
                //             //         $(autocomplete_selector).find('.ui-state-active').trigger('click')
                //             //         event.preventDefault()
                //             //         return false
                //             //     }

                //             //     // enter pressed on terminal

                //             //     sentence = ''
                //             //     cursor_pos = 0
                //             //     SetMessageOutside('', 'sticky')
                //             //     auto_complete.autocomplete('close');
                //             //     
                //             //     if (!show_autoComplete) show_autoComplete = true
                //             //     return
                //             // }

                //             // if (event.key == 'Escape') {
                //             //     if ($(autocomplete_selector).css('display')) {
                //             //         $(autocomplete_selector).hide();
                //             //         event.preventDefault()
                //             //         return false
                //             //     }
                //             //     return
                //             // }

                //             // if (event.key == 'Backspace') {
                //             //     if (cursor_pos != 0) {
                //             //         sentence = sentence.slice(0, cursor_pos - 1) + sentence.slice(cursor_pos);
                //             //         cursor_pos -= 1
                //             //     }
                //             // }

                //             // if (event.key == 'ArrowLeft') {
                //             //     if (cursor_pos != 0) {
                //             //         cursor_pos -= 1
                //             //     }
                //             //     return
                //             // }

                //             // if (event.key == 'ArrowRight') {
                //             //     if (cursor_pos < sentence.length) {
                //             //         cursor_pos += 1
                //             //     }
                //             //     return
                //             // }

                //             // console.log ('aint returned')
                //             // if (event.key == 'Delete') {
                //             //     // console.log('del', $(autocomplete_selector).find('.ui-state-active')[0].outerText)
                //             //     if ($(autocomplete_selector).css('display') && $(autocomplete_selector).find('.ui-state-active')[0]) {
                //             //         // console.log('removing')
                //             //         RemoveCommand($(autocomplete_selector).find('.ui-state-active')[0].outerText)
                //             //         $(autocomplete_selector).find('.ui-state-active').remove()
                //             //         auto_complete.autocomplete('close');
                //             //         // auto_complete.autocomplete('search', `${sentence}`)
                //             //         if (show_autoComplete) {
                //             //             // console.log(`${event.type}:${event.key}: ON`)
                //             //             auto_complete.autocomplete('search', `${sentence}`)
                //             //         }
                //             //         else {
                //             //             // console.log(`${event.type}:${event.key}: OFF`)
                //             //             auto_complete.autocomplete('close')
                //             //             SetMessageOutside('autocomplete OFF ...waiting for enter(or ctrl + u)', 'sticky')
                //             //         }
                //             //         event.preventDefault()
                //             //         return false
                //             //     } else {
                //             //         sentence = sentence.slice(0, cursor_pos) + sentence.slice(cursor_pos + 1)
                //             //         if (show_autoComplete) {
                //             //             // console.log(`${event.type}:${event.key}: ON`)
                //             //             auto_complete.autocomplete('search', `${sentence}`)
                //             //         }
                //             //         else {
                //             //             // console.log(`${event.type}:${event.key}: OFF`)
                //             //             auto_complete.autocomplete('close')
                //             //             SetMessageOutside('autocomplete OFF ...waiting for enter(or ctrl + u)', 'sticky')
                //             //         }
                //             //         return
                //             //     }
                //             // }

                //             // if (event.code == 'Space') {
                //             //     sentence = sentence.slice(0, cursor_pos) + " " + sentence.slice(cursor_pos)
                //             //     cursor_pos += 1
                //             //     if (show_autoComplete) {
                //             //         // console.log(`${event.type}:${event.key}: ON`)
                //             //         auto_complete.autocomplete('search', `${sentence}`)
                //             //     }
                //             //     else {
                //             //         // console.log(`${event.type}:${event.key}: OFF`)
                //             //         auto_complete.autocomplete('close')
                //             //         SetMessageOutside('autocomplete OFF ...waiting for enter(or ctrl + u)', 'sticky')
                //             //     }
                //             //     return
                //             // }
                //             // if (!specialKeys.includes(event.key)) {
                //             //     if (cursor_pos == 0) {
                //             //         sentence = event.key + sentence
                //             //     } else {
                //             //         sentence = sentence.slice(0, cursor_pos) + event.key + sentence.slice(cursor_pos)
                //             //     }
                //             //     cursor_pos += 1

                //             //     if (show_autoComplete) {
                //             //         // console.log(`${event.type}:${event.key}: ON`)
                //             //         auto_complete.autocomplete('search', `${sentence}`)
                //             //     }
                //             //     else {
                //             //         // console.log(`${event.type}:${event.key}: OFF`)
                //             //         auto_complete.autocomplete('close')
                //             //         SetMessageOutside('autocomplete OFF ...waiting for enter(or ctrl + u)', 'sticky')
                //             //     }
                //             // }
                //             // }
            }
            else {
                //             // event.preventDefault();return false
                if ((event.metaKey || event.ctrlKey || event.altKey || event.altGraphKey)) {
                    // console.log(exculdeModifiersAsKeys.includes(event.key.toLowerCase()))
                    if (!exculdeModifiersAsKeys.includes(event.key)) {
                        lockKeyBindings = false
                    }
                }
                //             // else {

                //             //     if (event.key == 'Backspace') {
                //             //         if (show_autoComplete) {
                //             //             // console.log(`${event.type}:${event.key}: ON`)
                //             //             auto_complete.autocomplete('search', `${sentence}`)
                //             //         }
                //             //         else {
                //             //             // console.log(`${event.type}:${event.key}: OFF`)
                //             //             auto_complete.autocomplete('close')
                //             //             SetMessageOutside('autocomplete OFF ...waiting for enter(or ctrl + u)', 'sticky')
                //             //         }
                //             //     }
                //             //     return
                //             // }
            }
        });

        //     xtermMap.get(ptyProcess.pid).registerLinkMatcher(globals.dirLinkRegex, (event, uri) => {
        //         // console.log('Link Match', uri, resolve(homedir(), uri.substring(2)))
        //         xtermMap.get(ptyProcess.pid).focus()
        //         try {

        //             // for home subdirectories
        //             if (uri.startsWith('~/')) {
        //                 // console.log('~/')
        //                 directory_switch = resolve(homedir(), uri.substring(2))
        //             }
        //             // for home directories
        //             else if (uri.startsWith('~')) {
        //                 // console.log('~')
        //                 directory_switch = homedir()
        //             }
        //             // for root directories
        //             else {
        //                 // console.log('/')
        //                 directory_switch = uri
        //             }
        //             // console.log(directory_switch)
        //             // }
        //         } catch (error) {
        //         }
        //         !limitFeatures ? $(`ul#hidden_menu_list li#compass`).contextMenu({ x: event.clientX, y: event.clientX })
        //             : confirm(limitMessage) === true ?
        //                 shell.openExternal('https://thevoyagingstar.com/pricing') : () => { }
        //     })
        ipcRenderer.send('render_complete', globals.windowID, pid)
        xtermMap.get(pid).focus()
        setTimeout(() => {
            Resize()
        }, 0)
        res()
    })
}
function ShowAutocomplete(flag) {
    show_autoComplete = flag
}

function UpdateSentenceOnSelect(str) {
    sentence = str
    cursor_pos = str.length
    // SetMessageOutside(str)
}

function UpdateSentenceOnPaste(str) {
    if (cursor_pos == 0) {
        sentence = str
        cursor_pos = sentence.length
        // auto_complete.autocomplete('search', `${sentence}`);
        // SetMessageOutside(str)
    } else {
        sentence = sentence.slice(0, cursor_pos) + str + sentence.slice(cursor_pos)
        cursor_pos = cursor_pos + str.length
        // auto_complete.autocomplete('search', `${sentence}`);
        // SetMessageOutside(str)
    }
}

function UpdateDirectoryLink(str) {
    // console.log('navigation', str)
    directory_switch = str
}

export { xTerminal, parent_term, fitAddonMap, ShowAutocomplete, xtermMap, ptyProcessMap, directory_switch, nodeScripts, scriptRunner, currentPWD, UpdateSentenceOnPaste, UpdateDirectoryLink, UpdateSentenceOnSelect, sentence, active_term, xtermCursor }