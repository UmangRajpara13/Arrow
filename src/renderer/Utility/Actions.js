
import $ from `jquery`
import { sep } from 'path';
import { ipcRenderer } from 'electron';
import { settings } from 'Init'

var fileLocation, fileType, fileName
var knownActions = []

async function RunAction(filePath) {

    fileLocation = filePath.substring(0, filePath.lastIndexOf(sep))
    fileName = filePath.substring(filePath.lastIndexOf(sep) + 1, filePath.lastIndexOf('.'))
    fileType = filePath.substring(filePath.lastIndexOf('.') + 1)
    // console.log(fileLocation, fileName, fileType)
    knownActions = Object.keys(settings['terminal.url.actions'])
    // console.log(knownActions)
    if (!knownActions.includes(fileType)) {
        alert(`No action configured for .${fileType} file`);
        return
    }

    // currTabNo = $(`.active`)[0].id

    // panes = $(`#tabs-${currTabNo}`)[0].childNodes
    // // console.log(panes)

    // panePIDs = []
    // panes.forEach((term) => {
    //     // console.log(term.id)
    //     if (term.id) panePIDs.push(parseInt((term.id.replace(/^\D+/g, ``))))
    // })
    // // console.log(panePIDs)
    // TODO: there should be global cwdMap
    // we should check if this Map has fileLocation 
    //      if yes, then see if process is running, 
    //          if yes then see if it has only one pane
    //          else then active its parent tab, split panel and execute
    //      if no then active its parent tab & execute
    // if no then we get currTab and see if process is running
    //      if yes then see if it has only one pane 
    //      if yes split panel and execute
    // ...... to be written later
    // [active_term] == defaultProfile
    // // console.log(e_processTitle, e_processTitle[currTabNo])
    // for (let index = 0; index < panePIDs.length; index++) {
    //     if (e_processTitle[currTabNo][panePIDs[index]] == defaultProfile) {
    //         // console.log('process is free')
    //         exec(`lsof -p ${panePIDs[index]} | grep cwd`, (error, stdout, stderr) => {
    //             if (error) {
    //                 // console.error(`exec error: ${error}`);
    //                 return;
    //             }
    //             currentPWD = stdout.substring(stdout.search(/\//g), stdout.length).replace(/\n/g, '')
    //             // console.log(currentPWD)
    //             if (currentPWD != fileLocation) ipcRenderer.send('write_pty', panePIDs[index], `cd ; cd ${fileLocation}\r`)
    //             ipcRenderer.send('write_pty', panePIDs[index], settings['terminal.url.actions'][`${fileType}`].command.replace('${fileName}', `${fileName}.${fileType}`))
    //             // console.log(currentPWD, fileLocation)
    //         })
    //         break
    //     } else {
    //         // console.log('// pty is not free, check if its last pane then only add a tab ')
    //         if (panePIDs.length < 3) {
    //             ipcRenderer.send('spawn', {
    //                 workingDirectory: fileLocation,
    //                 view: 'split',
    //                 windowID: globals.windowID,
    //                 currTabNo: $(`.active`)[0]?.id,
    //                 action: filePath
    //             })
    //         } else {
    //             ipcRenderer.send('spawn', {
    //                 workingDirectory: fileLocation,
    //                 view: 'newTab',
    //                 windowID: globals.windowID,
    //                 currTabNo: $(`.active`)[0]?.id,
    //                 action: filePath
    //             })
    //         }
    //     }
    // }
}

ipcRenderer.on(`run_actions`, (event, filePath) => {
    RunAction(filePath)
})

export { RunAction }