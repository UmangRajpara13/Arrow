import { clipboard, ipcRenderer } from "electron";
import { active_term } from "xTerm";
import { settings } from 'Init'

var leftCheck = false, rightCheck = false;
var urlActions = new Object();

function AnalyseURL(url) {
    url = clipboard.readText().trim()
    settings['terminal.url.actions'].forEach(scheme => {
        leftCheck = false; rightCheck = false;
        scheme['startsWithAnyOf'].forEach(startWith => {
            if (url.startsWith(startWith)) {
                leftCheck = true
            }
        })
        scheme['endsWithAnyOf'].forEach(endsWith => {
            if (url.endsWith(endsWith)) {
                rightCheck = true
            }
        })
        if (leftCheck && rightCheck) {
            scheme['actions'].forEach(action => {
                urlActions[action.title] = {
                    name: action.title,
                    className: 'terminal-menu-item',
                    callback: () => {
                        ipcRenderer.send('write_pty', active_term, `${action.command.replace('${url}', url)}`)

                    }
                }
            })
        }
    })
}

ipcRenderer.on(`is_it_recognizable_url`, (event) => {
    // console.log('analyzinf url')
    AnalyseURL()
})


export { urlActions, AnalyseURL }