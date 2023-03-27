import axios from 'a';
import { app } from 'electron';
import { window, windowsMap } from './main';

const isDev = process.env.NODE_ENV != `production`
// console.log('isDev', isDev)

// TODO
var url = isDev ? `http://localhost:8080/sonic` : ``

async function CheckForUpdates() {
    // console.log('check for updates')
    try {
        await axios.post(`${url}/check-for-updates`, {}, {
            'Content-Type': 'application/json'
        }).then(async (response) => {
            if (response.data) {
                var lts = response.data[`${process.platform}`]["version"].split('.')
                var current_version = app.getVersion().split('.')
                for (let i = 0; i < current_version.length; i++) {
                    if (lts[i] > current_version[i]) {
                        windowsMap.forEach(function (value, key) {
                            windowsMap.get(parseInt(key)).webContents.send('updates_available', response.data[`${process.platform}`]["version"]);
                        })
                        break
                    }
                }
            }
        })
    } catch (err) {
        // console.error(err);
    }
}





export { CheckForUpdates }
