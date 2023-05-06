
var r = document.querySelector(':root');
var rs = getComputedStyle(r)
const all_themes_object = new Object();
all_themes_object[process.platform] = new Object()
all_themes_object[process.platform].currentPalette = process.env.NODE_ENV !== 'production' ? 'arrowDev' : 'Dark'

var arrowDev = new Object()

// arrowDev.paneSplit = rs.getPropertyValue('--paneSplit')

// arrowDev.windowControls = new Object()
// arrowDev.windowControls.background = rs.getPropertyValue('--windowControls_BG')

// if (process.platform != 'darwin') {
//     arrowDev.windowControls.foreground = rs.getPropertyValue('--windowControls_FG')
//     arrowDev.windowControls.hover_BG = rs.getPropertyValue('--windowControls_BG_Hover')
// }

arrowDev.titleBar = new Object()
arrowDev.titleBar.background = rs.getPropertyValue('--titleBar_BG')
arrowDev.titleBar.foreground = rs.getPropertyValue('--titleBar_FG')
arrowDev.titleBar.activeTabLabel = rs.getPropertyValue('--activeTabLabel')
arrowDev.titleBar.activeTab_BG = rs.getPropertyValue('--activeTab_BG')
arrowDev.titleBar.inactiveTabLabel = rs.getPropertyValue('--inactiveTabLabel')
arrowDev.titleBar.inactiveTabHover_BG = rs.getPropertyValue('--inactiveTabHover_BG')


// arrowDev.statusBar = new Object()
// arrowDev.statusBar.background = rs.getPropertyValue('--statusBar_BG')
// arrowDev.statusBar.label = rs.getPropertyValue('--statusBarLabel')
// arrowDev.statusBar.hover_BG = rs.getPropertyValue('--statusBarLabel_BG_Hover')

// arrowDev.autocomplete = new Object()
// arrowDev.autocomplete.border = rs.getPropertyValue('--autocompleteBorder')
// arrowDev.autocomplete.background = rs.getPropertyValue('--autocomplete_BG')
// arrowDev.autocomplete.label = rs.getPropertyValue('--autocompleteLabel')
// arrowDev.autocomplete.hover_BG = rs.getPropertyValue('--autocompleteLabelSelect_BG')

// arrowDev.menu = new Object()
// arrowDev.menu.background = rs.getPropertyValue('--menu_BG')
// arrowDev.menu.label = rs.getPropertyValue('--menuLabel')
// arrowDev.menu.hover_BG = rs.getPropertyValue('--menuLabel_BG_Hover')
// arrowDev.menu.seperator = rs.getPropertyValue('--menuSeperator')

// arrowDev.scrollBar = new Object()
// arrowDev.scrollBar.foreground = rs.getPropertyValue('--xtermScrollBar')
// arrowDev.scrollBar.hover_FG = rs.getPropertyValue('--xtermScrollBar_Hover')
// arrowDev.scrollBar.hover_BG = rs.getPropertyValue('----xtermScrollBar_BG_Hover')

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

arrowDev.panel = {}
arrowDev.panel.terminal = terminal

// ----------------------------------------------------------------

all_themes_object.colorPalettes = new Object()

if (process.env.NODE_ENV !== 'production') {
    all_themes_object.colorPalettes.arrowDev = arrowDev
}

export { all_themes_object }