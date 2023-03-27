import $ from `jquery`;

import { ipcRenderer, shell } from `electron`
import { defaultColorPalettes, colorConfig, customColorPalettes } from 'ColorSetup'
import { getjsonfile } from 'readJSON';
import { writejsonfile } from 'writeJSON';
import { join } from 'path';
import { globals } from `App`
import { ensureDir, readJsonSync, writeJsonSync, ensureDirSync, writeJson, readJson } from 'fs-extra';


function LoadPalleteMenu() {

    $(`#toolbar`).contextMenu({
        selector: `.rainbow`,
        trigger: `left`,
        autohide: false,
        build: function ($trigger, e) {
            var defaultPalettes = new Object();
            Object.keys(defaultColorPalettes).forEach((theme) => {
                defaultPalettes[theme] = {
                    name: theme,
                    className: `settings bi bi-dot`,
                    callback: async (key) => {
                        // ChangeColors(key)
                        ipcRenderer.send('change_palette', key)
                        readJson(join(globals.settingsPath, 'colorSettings.json'),
                            (err, colorSettings) => {
                                colorSettings[process.platform].currentPalette = key
                                writeJsonSync(join(globals.settingsPath, 'colorSettings.json'),
                                    colorSettings, {
                                    spaces: 4
                                })
                            })

                    }
                }
            })
            var customPalettes = new Object()
            Object.keys(customColorPalettes).forEach((theme) => {
                customPalettes[theme] = {
                    name: theme,
                    className: `settings`,
                    callback: async (key) => {
                        // ChangeColors(key)
                        ipcRenderer.send('change_palette', key)
                        readJson(join(globals.settingsPath, 'colorSettings.json'),
                            (err, colorSettings) => {
                                colorSettings[process.platform].currentPalette = key
                                writeJsonSync(join(globals.settingsPath, 'colorSettings.json'),
                                    colorSettings, {
                                    spaces: 4
                                })
                            })
                    }
                }
            })
            var edit = {
                edit: {
                    name: `Add/Edit`,
                    className: `settings`,
                    callback: () => {
                        shell.openPath(join(globals.settingsPath, 'colorSettings.json'))
                    }
                }
            }
            var view = {
                view: {
                    name: `View Default Palettes`,
                    className: `settings`,
                    callback: () => {
                        var configPath = globals.isDev ?
                            join(process.cwd(), 'build', `${process.platform}`, 'colorSettings.json') :
                            process.platform === 'darwin' ?
                                join(globals.exePath, `../../Resources/${process.platform}/colorSettings.json`)
                                : join(globals.exePath, `../resources/${process.platform}/colorSettings.json`)

                        confirm(`
                        The following file contains Default Color Palettes for Sonic Console.\n 
                        Do not modify this file as it will be replaced on every update.\n
                        if you wish to add your own color palette, use 'Add/Edit' option and create custom color palettes in that file.\n
                        you should use this file as reference for creating custom color palettes`)
                            && shell.openPath(configPath)
                    }
                }
            }
            return {
                list: Object.assign({},
                    defaultPalettes, view,
                    { "sep": "------" } ,   
                    Object.keys(customPalettes).length > 0 ? customPalettes : {},
                    edit)
            };
        },
        events: {
            show: function (opt) {
                var $this = this;
                // console.log(`menu shown`)
            },
            hide: async function (opt) {

            }
        }
    })
}
export { LoadPalleteMenu }