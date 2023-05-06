
import { app, BrowserWindow, ipcMain, dialog, shell } from `electron`
import { spawn } from `node-pty`
import shellEnv from 'shell-env';
import osLocale from 'os-locale';
import { windowsMap, window } from './main'

var  ptyProcessMap = new Map();

ipcMain.on(`spawn`, (event, obj) => {
   const PTY = spawn(obj.process,
        obj.args, {
        cwd: obj.workingDirectory,
        env: Object.assign({},
            shellEnv.sync(),
            {
                LANG: `${osLocale.sync().replace(/-/, '_')}.UTF-8`,
                ...(process.platform !== 'win32' &&
                    { TERM: 'xterm-256color' }),
                COLORTERM: 'truecolor',
                TERM_PROGRAM: 'arrow',
                TERM_PROGRAM_VERSION: app.getVersion()
            },
            process.env
        )
    })

    ptyProcessMap.set(PTY.pid, { windowID: obj.windowID, pty: PTY, title: PTY.process })

    event.reply(`create_pane`, { ...obj, pid: PTY.pid, title: PTY.process })
})

ipcMain.on('data', (event, processID, data) => {
    // console.log('received',processID,data)
    ptyProcessMap.get(parseInt(processID)).pty.write(data)
})

ipcMain.on(`get_last_process_title`, (event, windowID, processID) => {
    windowsMap.get(windowID).webContents.send('update_process_title',
        processID, ptyProcessMap.get(parseInt(processID)).pty.process
    );
})

ipcMain.on('render_complete', (event, windowID, processID) => {
    // console.log(typeof pid, typeof processID, windowID, ptyProcessMap.get(parseInt(processID)))
    ptyProcessMap.get(parseInt(processID)).pty.onData((data) => {
        // console.log('onData',processID,data)
        windowsMap.get(windowID).webContents.send('data', processID, data);
    })
    ptyProcessMap.get(parseInt(processID)).pty.onExit(() => {
        // console.log('onData',processID,data)
        windowsMap.get(windowID).webContents.send('kill_xterm', processID);
    })
})
ipcMain.on('resize_pty', (event, processID, cols, rows) => {
    // console.log(typeof pid, typeof processID, windowID, ptyProcessMap.get(parseInt(processID)))
    ptyProcessMap.get(parseInt(processID)).pty.resize(cols, rows)
})
ipcMain.on('kill_pty', (event, processID) => {
    // console.log(kill_pty, typeof processID,  ptyProcessMap.get(parseInt(processID)))
    ptyProcessMap.get(parseInt(processID)).pty.kill()
    ptyProcessMap.delete(parseInt(processID))

})
ipcMain.on('write_pty', (event, processID, data) => {
    // console.log(kill_pty, typeof processID,  ptyProcessMap.get(parseInt(processID)))
    ptyProcessMap.get(parseInt(processID)).pty.write(data)
})