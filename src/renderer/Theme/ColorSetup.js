
import { join } from 'path';
import { watch } from "chokidar";
import { xtermMap } from 'xTerm';
import { ipcRenderer } from 'electron';
import { globals, watcher } from "App";
import { existsSync, lstatSync } from 'fs';
import { ensureDir, readJsonSync, writeJsonSync, ensureDirSync, writeJson, readJson } from 'fs-extra';

var colorConfig = {},
    currentPalette,
    defaultColorSettings, defaultColorPalettes,
    customColorPalettes

var terminalDevColors = new Object()



var r = document.querySelector(':root');
var rs = getComputedStyle(r)

ipcRenderer.on('apply_palette', async (event, palette) => {
    // console.log(`apply_palette`, palette)
    ChangeColors(palette)
})
function ChangeColors(theme) {
    // console.log('changing colors')
    currentPalette = theme;
    colorConfig[process.platform].currentPalette = theme;

    r.style.setProperty('--titleBar_BG', colorConfig?.colorPalettes[theme]?.titleBar?.background || "#302f2f")
    // r.style.setProperty('--titleBar_FG', colorConfig?.colorPalettes[theme]?.titleBar?.foreground || "#c9c9c9")
    r.style.setProperty('--activeTab_BG', colorConfig?.colorPalettes[theme]?.titleBar?.tabTitle?.active_BG || "#161616")
    r.style.setProperty('--activeTabLabel', colorConfig?.colorPalettes[theme]?.titleBar?.tabTitle?.active_Label || "#eceaea")
    r.style.setProperty('--inactiveTabLabel', colorConfig?.colorPalettes[theme]?.titleBar?.tabTitle?.inactive_Label || "#929191")
    r.style.setProperty('--inactiveTabHover_BG', colorConfig?.colorPalettes[theme]?.titleBar?.tabTitle?.inactive_BG_Hover || "#9b99994d")

    // r.style.setProperty('--windowControls_BG', colorConfig?.colorPalettes[theme]?.titleBar?.windowControls?.background || "#444444")

    // if (process.platform != 'darwin') {
    //     r.style.setProperty('--windowControls_FG', colorConfig?.colorPalettes[theme]?.titleBar?.windowControls?.foreground || "#c9c9c9")
    //     r.style.setProperty('--windowControls_BG_Hover', colorConfig?.colorPalettes[theme]?.titleBar?.windowControls?.BG_Hover || "#918f8f5d")
    // }

    r.style.setProperty('--paneSplit', colorConfig?.colorPalettes[theme]?.panel?.paneSplit || "#7d7d7d")
    r.style.setProperty('--xtermScrollBar', colorConfig?.colorPalettes[theme]?.panel?.scrollBar?.foreground || "#949596")
    r.style.setProperty('--xtermScrollBar_Hover', colorConfig?.colorPalettes[theme]?.panel?.scrollBar?.FG_Hover || "#d1d2d3")
    r.style.setProperty('--xtermScrollBar_BG_Hover', colorConfig?.colorPalettes[theme]?.panel?.scrollBar?.BG_Hover || "#302f2f")

    r.style.setProperty('--background', colorConfig?.colorPalettes[theme]?.panel?.terminal?.background || "#161616")
    r.style.setProperty('--foreground', colorConfig?.colorPalettes[theme]?.panel?.terminal?.foreground || "#eceaea")

    r.style.setProperty('--statusBar_BG', colorConfig?.colorPalettes[theme]?.statusBar.background || "#111111")
    r.style.setProperty('--statusBarLabel', colorConfig?.colorPalettes[theme]?.statusBar.label || "#e4e4e4")
    r.style.setProperty('--statusBarLabel_BG_Hover', colorConfig?.colorPalettes[theme]?.statusBar.BG_Hover || "#827f7f82")

    r.style.setProperty('--menu_BG', colorConfig?.colorPalettes[theme]?.menu.background || "#393939")
    r.style.setProperty('--menuSeperator', colorConfig?.colorPalettes[theme]?.menu.seperator || "#cbcbcb")
    r.style.setProperty('--menuLabel', colorConfig?.colorPalettes[theme]?.menu.label || "#cbcbcb")
    r.style.setProperty('--menuLabel_BG_Hover', colorConfig?.colorPalettes[theme]?.menu.label_BG_Hover || "#707070d1")
    r.style.setProperty('--menuScrollBar', colorConfig?.colorPalettes[theme]?.menu.scrollBar || "#707070d1")

    if (xtermMap && xtermMap.size > 0) {
        xtermMap.forEach((value, key) => {
            xtermMap.get(key).setOption('theme', Object.assign({}, colorConfig?.colorPalettes[theme]?.panel?.terminal))
        })
    }

    if (process.platform === 'darwin') {
        if (colorConfig['darwin']?.enableVibrancy || false) {
            ipcRenderer.send(`set_vibrancy`, colorConfig['darwin']?.vibrancy, globals.windowID)
            ipcRenderer.send(`set_background_color`, `#00000100`, globals.windowID)
        } else {
            ipcRenderer.send(`set_background_color`, colorConfig?.colorPalettes[currentPalette]?.panel?.terminal?.background || '#000000', globals.windowID)
        }
    } else {
        ipcRenderer.send(`set_background_color`, colorConfig?.colorPalettes[currentPalette]?.panel?.terminal?.background || '#000000', globals.windowID)
    }
}

async function ThemeSetup() {
    return new Promise(async (resolve) => {
        var configPath = globals.isDev ?
            join(process.cwd(), 'build', `${process.platform}`, 'colorSettings.json') :
            process.platform === 'darwin' ?
                join(globals.exePath, `../../Resources/${process.platform}/colorSettings.json`)
                : join(globals.exePath, `../resources/${process.platform}/colorSettings.json`)

        defaultColorSettings = readJsonSync(configPath)
        defaultColorPalettes = defaultColorSettings.defaultColorPalettes
        // console.log(defaultColorSettings, defaultColorPalettes)

        if (!existsSync(join(globals.settingsPath, `colorSettings.json`))) {

            writeJsonSync(join(globals.settingsPath, 'colorSettings.json'),
                {
                    // takes care of windows as well
                    [process.platform]: {
                        ...(process.platform === 'darwin' && { "enableVibrancy": true }),
                        ...(process.platform === 'darwin' && { "vibrancy": "under-window" }),
                        "currentPalette":
                            process.platform === 'darwin' ? 'Grey' : 'Dark'
                    },
                    "customColorPalettes": {}
                }, {
                spaces: 4
            })
        }

        // watcher.add(join(globals.settingsPath, 'colorSettings.json'));

        watcher.on('all', async (event, path) => {

            if (path !== join(globals.settingsPath, 'colorSettings.json')) return

            if ((event === 'add' || event === 'change')) {
                // console.log('chokidar', event, path);

                readJson(path, (err, customColorSettings) => {
                    if (err) {
                        // console.error(err)

                        colorConfig[process.platform] = defaultColorSettings[process.platform]
                        colorConfig["colorPalettes"] = defaultColorPalettes

                        customColorPalettes = {}

                        currentPalette = defaultColorSettings[process.platform].currentPalette;
                        // console.log('colors on error', colorConfig, currentPalette)
                        return
                    }

                    colorConfig[process.platform] = Object.assign({}, defaultColorSettings[process.platform], customColorSettings[process.platform])

                    customColorPalettes = customColorSettings.customColorPalettes

                    colorConfig["colorPalettes"] = Object.assign({}, defaultColorPalettes, customColorPalettes)

                    currentPalette = colorConfig[process.platform].currentPalette;

                    // console.log('custom colors', colorConfig, currentPalette)

                    if (!globals.isDev) { // Prod
                        ipcRenderer.send('change_palette', currentPalette)
                    }
                    else { // Dev
                        terminalDevColors.background = rs.getPropertyValue('--background')
                        terminalDevColors.foreground = rs.getPropertyValue('--foreground')
                        terminalDevColors.selection = rs.getPropertyValue('--selection')
                        terminalDevColors.cursor = rs.getPropertyValue('--cursor')

                        terminalDevColors.brightBlack = rs.getPropertyValue('--brightBlack')
                        terminalDevColors.black = rs.getPropertyValue('--black')

                        terminalDevColors.brightBlue = rs.getPropertyValue('--brightBlue')
                        terminalDevColors.blue = rs.getPropertyValue('--blue');

                        terminalDevColors.brightCyan = rs.getPropertyValue('--brightCyan')
                        terminalDevColors.cyan = rs.getPropertyValue('--cyan')

                        terminalDevColors.brightGreen = rs.getPropertyValue('--brightGreen')
                        terminalDevColors.green = rs.getPropertyValue('--green')

                        terminalDevColors.brightMagenta = rs.getPropertyValue('--brightMagenta')
                        terminalDevColors.magenta = rs.getPropertyValue('--magenta')

                        terminalDevColors.brightRed = rs.getPropertyValue('--brightRed')
                        terminalDevColors.red = rs.getPropertyValue('--red')

                        terminalDevColors.brightWhite = rs.getPropertyValue('--brightWhite')
                        terminalDevColors.white = rs.getPropertyValue('--white')

                        terminalDevColors.brightYellow = rs.getPropertyValue('--brightYellow')
                        terminalDevColors.yellow = rs.getPropertyValue('--yellow')

                        if (process.platform === 'darwin') {
                            if (colorConfig['darwin']?.enableVibrancy || false) {
                                ipcRenderer.send(`set_vibrancy`, colorConfig['darwin']?.vibrancy || 'under-window', globals.windowID)
                                ipcRenderer.send(`set_background_color`, `#00000100`, globals.windowID)
                            } else {
                                ipcRenderer.send(`set_background_color`, colorConfig?.colorPalettes[currentPalette]?.panel?.terminal?.background || '#000000', globals.windowID)

                            }
                        } else {
                            ipcRenderer.send(`set_background_color`, colorConfig?.colorPalettes[currentPalette]?.panel?.terminal?.background || '#000000', globals.windowID)
                        }
                    }
                })
            }
        });


        var colorProfilesPath = globals.isDev ?
            join(process.cwd(), 'src', 'renderer', 'index.css') :
            join(globals.settingsPath, `colorSettings.json`)

        // TODO: real time update of themes in production
        if (globals.isDev) {
            // watcher.add(colorProfilesPath, {
            //     persistent: true,
            // }).on('change', async (event, path) => {
            //     // console.log(event, path)
            //     if (path != colorProfilesPath) return
            //    
            //     if (xtermMap && xtermMap.size > 0) {
            //         xtermMap.forEach((value, key) => {
            //             xtermMap.get(key).setOption('theme', Object.assign({}, terminal))
            //             // ptyProcessMap.get(key).write('git\r')
            //             // xtermMap.get(key).select(0,15,2000)
            //             // xtermMap.get(key).scrollToLine(0)

            //         })
            //     }
            // });
        }
        resolve()
    })
}




export { ChangeColors, terminalDevColors, colorConfig, currentPalette, defaultColorPalettes, customColorPalettes, ThemeSetup }

