import { WebSocketServer } from 'ws';
import { ipcMain } from `electron`
import { window, createwindow, windowsMap } from './main'
import { format as formatUrl } from `url`
import { join } from `path`

let wss
ipcMain.on(`run_websocket_server`, async (event, sonicPort) => {
    // console.log('run_websocket_server at sonicPort: ' + sonicPort)
    if (!wss) {
        try {
            wss = new WebSocketServer({ port: sonicPort });
            wss.getUniqueID = function () {
                function s4() {
                    return `${parseInt(Math.floor((1 + Math.random()) * 0x10000), 16)}`.substring(1);
                }
                return s4() + s4() + '-' + s4();
            };
            wss.on('connection', async (ws, req) => {
                if (!window && process.platform === 'darwin') {
                    url = process.env.NODE_ENV !== `production` ?
                        `http://localhost:9080`
                        : formatUrl({
                            pathname: join(__dirname, `index.html`),
                            protocol: `file`,
                            slashes: true
                        })
                    // shout wait before proceding
                    await createwindow(url);
                }

                ws.id = wss.getUniqueID();
                ws.on('close', function close() {
                    // console.log('[SERVER]: Client disconnected.');
                    // windowsMap.forEach(function (value, key) {
                    //     windowsMap.get(key).webContents.send('ws_close')
                    // })
                });
                ws.on('error', function close(error) {
                    // console.log('[SERVER]: Client error.', error);
                    // windowsMap.forEach(function (value, key) {
                    //     windowsMap.get(key).webContents.send('ws_error')

                    // })
                });
                ws.on('message', async (recieveData) => {
                    // console.log('[SERVER]:', `${recieveData}`);

                    if (!window && process.platform === 'darwin') {
                        url = process.env.NODE_ENV !== `production` ?
                            `http://localhost:9080`
                            : formatUrl({
                                pathname: join(__dirname, `index.html`),
                                protocol: `file`,
                                slashes: true
                            })
                        await createwindow(url);
                    }

                    switch (`${recieveData}`.split('<|>')[0]) {
                        case 'code':
                            switch (`${recieveData}`.split('<|>')[1]) {
                                // case 'open':
                                //     // console.log('open', `${recieveData}`.split('<|>')[2])
                                //     windowsMap.forEach(function (value, key) {
                                //         windowsMap.get(key).webContents.send(`open_in_sonic`, ['', `${recieveData}`.split('<|>')[2]])
                                //         windowsMap.get(key).show();
                                //     })
                                //     break;
                                case 'run':
                                    // console.log('run', `${recieveData}`.split('<|>')[2])
                                    window.webContents.send(`open_in_sonic`, ['', `${recieveData}`.split('<|>')[2]])
                                    if (process.platform === 'win32') {
                                        window.minimize();
                                        window.show();
                                    }
                                    else {
                                        window.show();
                                    }
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case 'browser':
                            // console.log('browser')
                            if (process.platform === 'win32') {
                                window.minimize();
                                window.show();
                            }
                            else {
                                window.show();
                            }
                            break;
                        default:
                            break;
                    }
                });
            });
        } catch (error) {
            // console.log(error);
        }

    }
})

