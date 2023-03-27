import $ from `jquery`

 import {  settings } from "Init";
import { active_term, currentPWD, xtermMap } from "xTerm";
import { ipcRenderer } from "electron";
import { globals } from "App";

var modifier, operation
function KeyBindings(event) {
    // console.log("KeyBindings", event)
    modifier = ``, operation = ``

    return new Promise(function (resolve, reject) {
        if (event.metaKey && event.key) {
            modifier += `meta+`
        }
        if (event.ctrlKey && event.key) {
            modifier += `ctrl+`
        }
        if (event.altKey && event.key) {
            modifier += `alt+`
        }
        if (event.key) {
            modifier += event.key.toLowerCase()
        }
        Object.keys(settings['terminal.keybindings']).forEach(key => {
            if (modifier === settings['terminal.keybindings'][key]) {
                operation = key
            }
        })
        // console.log('KeyBinding ', modifier, operation,
        //     settings['terminal.profiles'][settings['terminal.defaultProfile']][`path`])
        switch (operation) {
            case 'splitPane': {
                // console.log('splititing ', settings['terminal.profiles'][settings['terminal.defaultProfile']][`path`],
                    // settings['terminal.profiles'][settings['terminal.defaultProfile']][`args`])
                ipcRenderer.send('spawn', {
                    process: settings['terminal.profiles'][settings['terminal.defaultProfile']][`path`],
                    args: settings['terminal.profiles'][settings['terminal.defaultProfile']][`args`],
                    workingDirectory: currentPWD,
                    view: 'newPane',
                    windowID: globals.windowID,
                    action: null,
                    currTabNo: $('.active')[0]?.id
                })
                resolve(event);
                break;
            }
            case 'newTab': {
                // console.log('newTab ')
                ipcRenderer.send('spawn', {
                    process: settings['terminal.profiles'][settings['terminal.defaultProfile']][`path`],
                    args: settings['terminal.profiles'][settings['terminal.defaultProfile']][`args`],
                    workingDirectory: currentPWD,
                    view: 'newTab',
                    windowID: globals.windowID,
                    action: null,
                    currTabNo: $('.active')[0].id
                })
                resolve(event);
                break;
            }
            case 'newWindow': {
                ipcRenderer.send('create_new_window', currentPWD);
                resolve(event);
                break;
            }
            case 'focusPrevPane': {
                // console.log('focusPrevPane')
                currTabNo = $('.active')[0].id

                panes = $(`#tabs-${currTabNo}`)[0].childNodes
                panesPIDs = []
                panes.forEach((term) => {
                    // console.log(term.id)
                    if (term.id) panesPIDs.push(parseInt((term.id.replace(/^\D+/g, ``))))
                })
                // console.log(panesPIDs)
                if (panesPIDs.length > 1) {
                    current_pane_position = panesPIDs.indexOf(active_term)
                    // console.log(current_pane_position)
                    if (current_pane_position != 0) {
                        // not last pane
                        // console.log('focu prev pane', panesPIDs[current_pane_position - 1])
                        resolve({ 'event': event, 'focusPID': panesPIDs[current_pane_position - 1] });

                    } else {
                        // console.log('focus last pane', panesPIDs[panesPIDs.length - 1])
                        resolve({ 'event': event, 'focusPID': panesPIDs[panesPIDs.length - 1] });
                    }
                }
                else {
                    SplitRight(currentPWD); resolve(event);

                }
                break;
            }
            case 'focusNextPane': {
                // console.log('focusNextPane')
                currTabNo = $('.active')[0].id

                panes = $(`#tabs-${currTabNo}`)[0].childNodes
                panesPIDs = []
                panes.forEach((term) => {
                    // console.log(term.id)
                    if (term.id) panesPIDs.push(parseInt((term.id.replace(/^\D+/g, ``))))
                })
                // console.log(panesPIDs)
                if (panesPIDs.length > 1) {
                    current_pane_position = panesPIDs.indexOf(active_term)
                    // console.log(current_pane_position)
                    if (current_pane_position != panesPIDs.length - 1) {
                        // not last pane
                        // console.log('focu next pane', panesPIDs[current_pane_position + 1])
                        // xtermMap.get(active_term).blur()
                        resolve({ 'event': event, 'focusPID': panesPIDs[current_pane_position + 1] });
                    } else {
                        // console.log('focus first pane', panesPIDs[0], xtermMap.get(panesPIDs[0]))
                        resolve({ 'event': event, 'focusPID': panesPIDs[0] });
                    }
                }
                else {
                    SplitRight(currentPWD); resolve(event);
                }
                break;
            }
            default:
                reject()
                break
        }
    })
}
export { KeyBindings }
