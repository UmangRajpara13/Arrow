import './Statusbar.css'
import $ from `jquery`

import React, { useEffect } from 'react';
import { ipcRenderer, shell } from 'electron';
import { Compass } from 'Compass';
import { Open } from 'Open';
import { globals } from 'App'
import { LeftAnchor } from 'LeftAnchor'
import { Messages } from 'Messages';
import { RightAnchor } from 'RightAnchor'
import { existsSync, lstatSync } from 'fs'
import { settings } from 'Init'

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

var openDirectory

function StatusBar() {
    useEffect(() => {
        Compass(); Open();

        // this would be triggered if window is present
        ipcRenderer.on('open_in_sonic', (event, commandLine, workingDirectory) => {
            console.log('open_in_sonic', commandLine, workingDirectory,)

            console.log(yargs(commandLine).parse(), yargs(hideBin(commandLine)).parse());
            if (existsSync(workingDirectory)) {
                // console.log('// open Dir')
                // pwd = workingDirectory, action = null, type = 'directory'
                const commandLineObject = yargs(commandLine).parse()

                if (commandLineObject["file"]) {
                    const fileNameWithType = commandLineObject["file"]
                    const fileName = fileNameWithType.substring(0, fileNameWithType.lastIndexOf('.'))
                    const fileType = fileNameWithType.substring(fileNameWithType.lastIndexOf('.') + 1)

                    knownActions = Object.keys(settings['terminal.file.actions'])
                    if (!knownActions.includes(fileType)) {
                        alert(`No action configured for .${fileType} file`);
                        return
                    }
                    const action = settings['terminal.file.actions'][`${fileType}`].command.replace('${fileName}', `${fileName}.${fileType}`)
                    console.log('fileName', fileName, 'fileType', fileType, action)
                    ipcRenderer.send('spawn', {
                        process: settings['terminal.profiles'][settings['terminal.defaultProfile']][`path`],
                        args: settings['terminal.profiles'][settings['terminal.defaultProfile']][`args`],
                        workingDirectory: commandLineObject["dir"] || workingDirectory,
                        view: 'newPane',
                        windowID: globals.windowID,
                        action: action
                    })
                }
            } else {
                alert(`Path ${workingDirectory} does not Exist!`)
            }

            // if (commandLine[1]) {
            //     pwd = null, action = null, type = null
            //     // console.log(existsSync(commandLine[1]), lstatSync(commandLine[1]).isDirectory())

            //     if (existsSync(commandLine[1]) && lstatSync(commandLine[1]).isDirectory()) {
            //         // console.log('// its Dir')

            //         pwd = commandLine[1], action = null, type = 'directory'
            //     }
            //     else if (existsSync(commandLine[1]) && lstatSync(commandLine[1]).isFile()) {
            //         // console.log('// run Actions coz its a file ')

            //         pwd = commandLine[1].substring(0, commandLine[1].lastIndexOf(sep))
            //         fileName = commandLine[1].substring(commandLine[1].lastIndexOf(sep) + 1, commandLine[1].lastIndexOf('.'))
            //         fileType = commandLine[1].substring(commandLine[1].lastIndexOf('.') + 1)
            //         type = 'file'

            //         knownActions = Object.keys(settings['terminal.file.actions'])
            //         if (!knownActions.includes(fileType)) {
            //             alert(`No action configured for .${fileType} file`);
            //             return
            //         }

            //         action = settings['terminal.file.actions'][`${fileType}`].command.replace('${fileName}', `${fileName}.${fileType}`)
            //     }

            //     else if (commandLine[1] === '-e') {
            //         // console.log(' // code session')
            //         pwd = workingDirectory
            //         type = 'debug'
            //         action = commandLine[4].replace(/['"]+/g, '')
            //     }
            //     console.log(pwd, action, type)

            //     Object.keys(panesMap).length > 0 &&
            //         ipcRenderer.send('spawn', {
            //             process: settings['terminal.profiles'][settings['terminal.defaultProfile']][`path`],
            //             args: settings['terminal.profiles'][settings['terminal.defaultProfile']][`args`],
            //             workingDirectory: pwd,
            //             view: 'newPane',
            //             windowID: globals.windowID,
            //             action: action
            //         })

            //     switch (type) {
            //         case 'directory':
            //             openDirectory = commandLine[1]
            //             $(`ul#hidden_menu_list li#open`).trigger('click')
            //             break;
            //         case 'file': {
            //             if (panesMap.length < 2) {
            //                 // spawn pane
            //                 ipcRenderer.send('spawn', {
            //                     process: settings['terminal.profiles'][settings['terminal.defaultProfile']][`path`],
            //                     args: settings['terminal.profiles'][settings['terminal.defaultProfile']][`args`],
            //                     workingDirectory: pwd,
            //                     view: 'newPane',
            //                     windowID: globals.windowID,
            //                     action: action
            //                 })
            //             }
            //             else {
            //                 // new window
            //                 ipcRenderer.send('create_new_window', pwd)
            //             }
            //             // use pane inside current active tab
            //             // currTabNo = $(`.active`)[0]?.id; panePIDs = []

            //             // panes = $(`#tabs-${currTabNo}`)[0].childNodes
            //             // panes.forEach((term) => {
            //             //     if (term.id) panePIDs.push(parseInt((term.id.replace(/^\D+/g, ``))))
            //             // })
            //             // console.log(e_processTitle, e_processTitle[currTabNo])
            //             // for (let index = 0; index < panePIDs.length; index++) {
            //             //     if (e_processTitle[currTabNo][panePIDs[index]] == settings['terminal.defaultProfile']) {
            //             //         // console.log('process is free')
            //             //         exec(`lsof -p ${panePIDs[index]} | grep cwd`, (error, stdout, stderr) => {
            //             //             if (error) {
            //             //                 // console.error(`exec error: ${error}`);
            //             //                 return;
            //             //             }
            //             //             currentPWD = stdout.substring(stdout.search(/\//g), stdout.length).replace(/\n/g, '')
            //             //             // console.log(currentPWD)
            //             //             if (currentPWD != pwd) ipcRenderer.send('write_pty', panePIDs[index], `cd ; cd '${pwd}'\r`)
            //             //             ipcRenderer.send('write_pty', panePIDs[index], action)
            //             //             // console.log(currentPWD, fileLocation)
            //             //         })
            //             //         break
            //             //     } else {
            //             //         // console.log('// pty is not free, check if its last pane then only add a tab ')
            //             //         if (panePIDs.length < 3) {
            //             //             ipcRenderer.send('spawn', {
            //             //                 process: settings['terminal.profiles'][settings['terminal.defaultProfile']][`path`],
            //             //                 args: settings['terminal.profiles'][settings['terminal.defaultProfile']][`args`],
            //             //                 workingDirectory: pwd,
            //             //                 view: 'newPane',
            //             //                 windowID: globals.windowID,
            //             //                 action: action
            //             //             })
            //             //         } else {
            //             //             ipcRenderer.send('spawn', {
            //             //                 process: settings['terminal.profiles'][settings['terminal.defaultProfile']][`path`],
            //             //                 args: settings['terminal.profiles'][settings['terminal.defaultProfile']][`args`],
            //             //                 workingDirectory: pwd,
            //             //                 view: 'newPane',
            //             //                 windowID: globals.windowID,
            //             //                 action: action
            //             //             })
            //             //         }
            //             //         break
            //             //     }
            //             // }
            //         }
            //             break;
            //         case 'debug':
            //             ipcRenderer.send('spawn', {
            //                 process: commandLine[2],
            //                 args: commandLine[3],
            //                 workingDirectory: pwd,
            //                 view: 'newPane',
            //                 windowID: globals.windowID,
            //                 action: action,
            //                 currTabNo: null
            //             })
            //             break;
            //         default:
            //             break;
            //     }
            // }

        })
        ipcRenderer.on(`openDirectory`, (event, arg) => {
            // console.log('openDirectory', arg[0])
            openDirectory = arg[0]
            $(`ul#hidden_menu_list li#open`).trigger('click')
        })
    }, []);
    return (
        <div id="toolbar" style={{}}>
            <div id="hidden_menu">
                <ul id="hidden_menu_list" >
                    <li id="compass"></li>
                    <li id="open"></li>
                    <li id="actions"></li>
                </ul>
            </div>
            <div className='toolbar_slots noselect'>
                <LeftAnchor />
                <Messages />
                <RightAnchor />
            </div>


        </div>
    )
}

export {
    StatusBar, openDirectory
}
