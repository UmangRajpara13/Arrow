
import { getjsonfile } from 'readJSON'
import { writejsonfile } from 'writeJSON'
import { all_themes_object } from "./ColorPalletes";
import { sonicConfig } from "../../Init";
import { join } from 'path';
// import { watch } from "chokidar";
import { ptyProcessMap, xtermMap } from '../Terminal/xTerm';
import { ipcRenderer } from 'electron';
import { globals } from "../../App";

var colorConfig = new Object(), currentPalette
var r = document.querySelector(':root');
var rs = getComputedStyle(r)


ipcRenderer.on('apply_palette', async (event, palette) => {
    //console.log(`apply_palette`, palette)
    ChangeColors(palette)
})
function ChangeColors(theme) {
    //console.log('changing colors')
    currentPalette = theme;
    colorConfig[process.platform].currentPalette = theme;


    r.style.setProperty('--titleBar_BG', colorConfig.colorPalettes[theme].titleBar.background || "#302f2f")
    // r.style.setProperty('--titleBar_FG', colorConfig.colorPalettes[theme].titleBar.foreground || "#c9c9c9")
    r.style.setProperty('--activeTab_BG', colorConfig.colorPalettes[theme].titleBar.tabTitle.active_BG || "#161616")
    r.style.setProperty('--activeTabLabel', colorConfig.colorPalettes[theme].titleBar.tabTitle.active_Label || "#eceaea")
    r.style.setProperty('--inactiveTabLabel', colorConfig.colorPalettes[theme].titleBar.tabTitle.inactive_Label || "#929191")
    r.style.setProperty('--inactiveTabHover_BG', colorConfig.colorPalettes[theme].titleBar.tabTitle.inactive_BG_Hover || "#9b99994d")

    // r.style.setProperty('--windowControls_BG', colorConfig.colorPalettes[theme].titleBar.windowControls.background || "#444444")

    // if (process.platform != 'darwin') {
    //     r.style.setProperty('--windowControls_FG', colorConfig.colorPalettes[theme].titleBar.windowControls.foreground || "#c9c9c9")
    //     r.style.setProperty('--windowControls_BG_Hover', colorConfig.colorPalettes[theme].titleBar.windowControls.BG_Hover || "#918f8f5d")
    // }

    r.style.setProperty('--paneSplit', colorConfig.colorPalettes[theme].panel.paneSplit || "#7d7d7d")
    r.style.setProperty('--xtermScrollBar', colorConfig.colorPalettes[theme].panel.scrollBar.foreground || "#949596")
    r.style.setProperty('--xtermScrollBar_Hover', colorConfig.colorPalettes[theme].panel.scrollBar.FG_Hover || "#d1d2d3")
    r.style.setProperty('--xtermScrollBar_BG_Hover', colorConfig.colorPalettes[theme].panel.scrollBar.BG_Hover || "#302f2f")

    r.style.setProperty('--background', colorConfig.colorPalettes[theme].panel.terminal.background || "#161616")
    r.style.setProperty('--foreground', colorConfig.colorPalettes[theme].panel.terminal.foreground || "#eceaea")

    r.style.setProperty('--statusBar_BG', colorConfig.colorPalettes[theme].statusBar.background || "#111111")
    r.style.setProperty('--statusBarLabel', colorConfig.colorPalettes[theme].statusBar.label || "#e4e4e4")
    r.style.setProperty('--statusBarLabel_BG_Hover', colorConfig.colorPalettes[theme].statusBar.BG_Hover || "#827f7f82")

    r.style.setProperty('--menu_BG', colorConfig.colorPalettes[theme].menu.background || "#393939")
    r.style.setProperty('--menuSeperator', colorConfig.colorPalettes[theme].menu.seperator || "#cbcbcb")
    r.style.setProperty('--menuLabel', colorConfig.colorPalettes[theme].menu.label || "#cbcbcb")
    r.style.setProperty('--menuLabel_BG_Hover', colorConfig.colorPalettes[theme].menu.label_BG_Hover || "#707070d1")
    r.style.setProperty('--menuScrollBar', colorConfig.colorPalettes[theme].menu.scrollBar || "#707070d1")

    if (xtermMap && xtermMap.size > 0) {
        xtermMap.forEach((value, key) => {
            xtermMap.get(key).setOption('theme', Object.assign({}, colorConfig.colorPalettes[theme].panel.terminal))
        })
    }

    if (process.platform === 'darwin') {
        if (colorConfig['darwin'].enableVibrancy || false) {
            ipcRenderer.send(`set_vibrancy`, colorConfig['darwin'].vibrancy, globals.windowID)
            ipcRenderer.send(`set_background_color`, `#00000100`, globals.windowID)
        } else {
            ipcRenderer.send(`set_background_color`, colorConfig.colorPalettes[currentPalette].panel.terminal.background || '#000000', globals.windowID)
        }
    } else {
        ipcRenderer.send(`set_background_color`, colorConfig.colorPalettes[currentPalette].panel.terminal.background || '#000000', globals.windowID)
    }
}
async function ThemeSetup() {
    return new Promise(async (resolve) => {
        await getjsonfile(join(globals.settingsPath, `colorProfiles`)).then(async (jsonfile) => {
            //console.log(jsonfile)
            colorConfig = globals.isDev ? all_themes_object : jsonfile
        }, async () => {
            //console.log('no file, loading color Deafaults')

            var configPath = globals.isDev ?
                join(process.cwd(), 'build', `${process.platform}`, 'colorProfiles') :
                process.platform === 'darwin' ?
                    join(globals.exePath, `../../Resources/${process.platform}/colorProfiles`)
                    : join(globals.exePath, `../resources/${process.platform}/colorProfiles`)

            await getjsonfile(configPath).then(async (jsonfile) => {
                colorConfig = globals.isDev ? all_themes_object : jsonfile
                // use the following line only for new theme
                writejsonfile(join(globals.settingsPath, 'colorProfiles'), globals.isDev ? colorConfig : jsonfile)
                // writejsonfile(join(globals.settingsPath, 'colorProfiles'),  jsonfile)
            })
        })
        currentPalette = globals.isDev ? 'sonicDev' : colorConfig[process.platform].currentPalette;

        if (!globals.isDev) {
            ipcRenderer.send('change_palette', currentPalette || 'Dark')
        }
        else {
            if (process.platform === 'darwin') {
                if (colorConfig['darwin'].enableVibrancy || false) {
                    ipcRenderer.send(`set_vibrancy`, colorConfig['darwin'].vibrancy || 'under-window', globals.windowID)
                    ipcRenderer.send(`set_background_color`, `#00000100`, globals.windowID)
                } else {
                    ipcRenderer.send(`set_background_color`, colorConfig.colorPalettes[currentPalette].panel.terminal.background || '#000000', globals.windowID)

                }
            } else {
                ipcRenderer.send(`set_background_color`, colorConfig.colorPalettes[currentPalette].panel.terminal.background || '#000000', globals.windowID)
            }
        }

        var colorProfilesPath = globals.isDev ?
            join(process.cwd(), 'src', 'renderer', 'index.css') :
            join(globals.settingsPath, `colorProfiles.json`)

        // TODO: real time update of themes in production
        if (globals.isDev) {
            watch(colorProfilesPath, {
                persistent: true,
            }).on('change', async (event, path) => {
                //console.log(event, path)

                var terminal = new Object()
                terminal.background = rs.getPropertyValue('--background')
                terminal.foreground = rs.getPropertyValue('--foreground')
                terminal.selection = rs.getPropertyValue('--selection')
                terminal.cursor = rs.getPropertyValue('--cursor')

                terminal.brightBlack = rs.getPropertyValue('--brightBlack')
                terminal.black = rs.getPropertyValue('--black')

                terminal.brightBlue = rs.getPropertyValue('--brightBlue')
                terminal.blue = rs.getPropertyValue('--blue');

                terminal.brightCyan = rs.getPropertyValue('--brightCyan')
                terminal.cyan = rs.getPropertyValue('--cyan')

                terminal.brightGreen = rs.getPropertyValue('--brightGreen')
                terminal.green = rs.getPropertyValue('--green')

                terminal.brightMagenta = rs.getPropertyValue('--brightMagenta')
                terminal.magenta = rs.getPropertyValue('--magenta')

                terminal.brightRed = rs.getPropertyValue('--brightRed')
                terminal.red = rs.getPropertyValue('--red')

                terminal.brightWhite = rs.getPropertyValue('--brightWhite')
                terminal.white = rs.getPropertyValue('--white')

                terminal.brightYellow = rs.getPropertyValue('--brightYellow')
                terminal.yellow = rs.getPropertyValue('--yellow')

                if (xtermMap && xtermMap.size > 0) {
                    xtermMap.forEach((value, key) => {
                        xtermMap.get(key).setOption('theme', Object.assign({}, terminal))
                        // ptyProcessMap.get(key).write('git\r')
                        // xtermMap.get(key).select(0,15,2000)
                        // xtermMap.get(key).scrollToLine(0)

                    })
                }
            });
        }
        resolve()
    })
}




export { ChangeColors, colorConfig, currentPalette, ThemeSetup }

