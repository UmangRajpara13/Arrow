// modifying values requires Sonic Terminal Reload/Restart

module.exports = {
    // port used by sonic to communicate with Extensions.
    // Browser Extensions' and Visual Studio Code Extensions' port value must be set to this value.
    // Make sure you don't use a port which you ocassianlly use for dev servers
    // like 8080(Express server) or 3000 (React dev server) 
    sonicPort: 3030,
    // should be one of the top-level key from terminalProfiles.json
    defaultProfile: 'zsh',
    // use keyword 'meta' to add Super key ( Windows|Command key ) as modifier key
    keyBindings: {
        "splitPane": "alt+s",
        "newTab": "ctrl+t",
        "newWindow": "ctrl+n",
        "focusPrevPane":"alt+arrowleft",
        "focusNextPane":"alt+arrowright"
    },
    /*
    [Recommended] launching compass from terminal menu.
    This is recommended way since it can accessed from any underlying *.zsh-theme, 
    which doesn't display full length workingDirectory (i.e. %c works), e.g. robyrussell zsh theme

    [Optional] additionally compass can be also be triggered from path like strings rendered
    on terminal screen. however this has following limitations:
    %c must be replaced with %d or %~
    */
    compass: {
        enableOnPathLikeStrings: false
    },
    /*  
    Disclaimer: 
        the autcomplete feature is still in Beta mode.
        In very extreme cases the autocomplete feature may be unstable,
        this is due the fact that it manipulates DOM heavily.
        if you find yourself in situations where your productivity is hindered
        then set the 'enable' property to false and report the issue.
    */

    // Works only for first word,
    // Disables on : Escape, Up/Down Arrow keys
    // Enables back again on: Enter/Ctrl + u 
    autocomplete: {
        enable: false,
        /*  
        Experimental : 
            Makes a search while typing through console history files(.zsh_history/.bash_history)
            # Might make the typing experience a bit slower
        */
        showHistory: false,
        // Only shows Formulated suggestions as per autocomplete.js config file
        showFormulatedSuggesions: false
    }
}
