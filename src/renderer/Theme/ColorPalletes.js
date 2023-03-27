
var r = document.querySelector(':root');
var rs = getComputedStyle(r)
const all_themes_object = new Object();
all_themes_object[process.platform] = new Object()
all_themes_object[process.platform].currentPalette = process.env.NODE_ENV !== 'production' ? 'sonicDev' : 'Dark'

var sonicDev = new Object()

// sonicDev.paneSplit = rs.getPropertyValue('--paneSplit')

// sonicDev.windowControls = new Object()
// sonicDev.windowControls.background = rs.getPropertyValue('--windowControls_BG')

// if (process.platform != 'darwin') {
//     sonicDev.windowControls.foreground = rs.getPropertyValue('--windowControls_FG')
//     sonicDev.windowControls.hover_BG = rs.getPropertyValue('--windowControls_BG_Hover')
// }

sonicDev.titleBar = new Object()
sonicDev.titleBar.background = rs.getPropertyValue('--titleBar_BG')
sonicDev.titleBar.foreground = rs.getPropertyValue('--titleBar_FG')
sonicDev.titleBar.activeTabLabel = rs.getPropertyValue('--activeTabLabel')
sonicDev.titleBar.activeTab_BG = rs.getPropertyValue('--activeTab_BG')
sonicDev.titleBar.inactiveTabLabel = rs.getPropertyValue('--inactiveTabLabel')
sonicDev.titleBar.inactiveTabHover_BG = rs.getPropertyValue('--inactiveTabHover_BG')


// sonicDev.statusBar = new Object()
// sonicDev.statusBar.background = rs.getPropertyValue('--statusBar_BG')
// sonicDev.statusBar.label = rs.getPropertyValue('--statusBarLabel')
// sonicDev.statusBar.hover_BG = rs.getPropertyValue('--statusBarLabel_BG_Hover')

// sonicDev.autocomplete = new Object()
// sonicDev.autocomplete.border = rs.getPropertyValue('--autocompleteBorder')
// sonicDev.autocomplete.background = rs.getPropertyValue('--autocomplete_BG')
// sonicDev.autocomplete.label = rs.getPropertyValue('--autocompleteLabel')
// sonicDev.autocomplete.hover_BG = rs.getPropertyValue('--autocompleteLabelSelect_BG')

// sonicDev.menu = new Object()
// sonicDev.menu.background = rs.getPropertyValue('--menu_BG')
// sonicDev.menu.label = rs.getPropertyValue('--menuLabel')
// sonicDev.menu.hover_BG = rs.getPropertyValue('--menuLabel_BG_Hover')
// sonicDev.menu.seperator = rs.getPropertyValue('--menuSeperator')

// sonicDev.scrollBar = new Object()
// sonicDev.scrollBar.foreground = rs.getPropertyValue('--xtermScrollBar')
// sonicDev.scrollBar.hover_FG = rs.getPropertyValue('--xtermScrollBar_Hover')
// sonicDev.scrollBar.hover_BG = rs.getPropertyValue('----xtermScrollBar_BG_Hover')

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

sonicDev.panel = {}
sonicDev.panel.terminal = terminal

// ----------------------------------------------------------------

all_themes_object.colorPalettes = new Object()

if (process.env.NODE_ENV !== 'production') {
    all_themes_object.colorPalettes.sonicDev = sonicDev
}

export { all_themes_object }