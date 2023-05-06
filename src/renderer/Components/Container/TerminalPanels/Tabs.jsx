import React from "react";
import './Tabs.css'
import $ from "jquery";
// import { spawn } from `node-pty`
import { xTerminal } from "xTerm";
import { LoadTerminalMenu } from "TerminalMenu";
import { Resize } from "resize";
import TabPanelItem from "TabPanelItem";
import { xtermMap } from "xTerm";
import { sep } from "path";
import TabNavItem from `TabNavItem`
import AppButtons from `AppButtons`
import { terminalProfiles, defaultProfile } from "System";
import shellEnv from 'shell-env';
import osLocale from 'os-locale';
import { globals } from 'App'
import { homedir } from 'os'
import { existsSync, lstatSync } from 'fs'
import { RunAction } from 'Actions';
import { colorConfig, currentPalette } from "ColorSetup";
import { useSelector, useDispatch } from 'react-redux'
import { addTab } from 'profileSlice'

var tabs, tabArray = [], newList = []
let AddTabOutside, UpdateTabTittleOutSide, AppendTabTitleOutSide, UnshiftTabTitleOutside
var PTY, filePath = null, workingDirectory
class Tabs extends React.Component {

    constructor(props) {
        super(props);
        // const mapStateToProps = state => ({
        //     panes: state.profile.panes
        // });

        // console.log('First Tab', props.workingDirectory,terminalProfiles)
        if (lstatSync(props.workingDirectory).isDirectory()) {
            workingDirectory = props.workingDirectory
        }
        else {
            // run Actions coz its a file
            filePath = props.workingDirectory
            workingDirectory = props.workingDirectory.substring(0, props.workingDirectory.lastIndexOf(sep))
        }

        PTY = spawn(terminalProfiles[defaultProfile][`path`],
            terminalProfiles[defaultProfile][`args`], {
            cwd: workingDirectory,
            env: Object.assign({},
                shellEnv.sync(),
                {
                    LANG: `${osLocale.sync().replace(/-/, '_')}.UTF-8`,
                    TERM: 'xterm-256color',
                    COLORTERM: 'truecolor',
                    TERM_PROGRAM: 'arrow',
                    TERM_PROGRAM_VERSION: globals.version
                },
                process.env,
            )
        })
        this.state = {
            tittle: [{
                id: PTY.pid,
                processes:
                    [
                        {
                            [`${PTY.pid}`]: PTY[`process`].split(sep).pop()
                        }
                    ]
            }],
            panel: [{
                id: PTY.pid,
                process: PTY,
            }]
        };
        tabArray = this.state.tittle.length
        this.addTab = this.addTab.bind(this);
        this.UpdateTabTittle = this.UpdateTabTittle.bind(this);
        this.AppendTabTitle = this.AppendTabTitle.bind(this);
        this.UnshiftTabTitle = this.UnshiftTabTitle.bind(this);

        AddTabOutside = this.addTab
        UpdateTabTittleOutSide = this.UpdateTabTittle
        AppendTabTitleOutSide = this.AppendTabTitle
        UnshiftTabTitleOutside = this.UnshiftTabTitle

    };

    addTab(dir) {
        return new Promise((resolve, reject) => {
            PTY = spawn(terminalProfiles[defaultProfile][`path`],
                terminalProfiles[defaultProfile][`args`], {
                // cwd: process.env.NODE_ENV != `production` ? process.cwd() : (dir) ? dir : homedir(),
                cwd: (dir) ? dir : homedir(),
                env: Object.assign({},
                    shellEnv.sync(),
                    {
                        LANG: `${osLocale.sync().replace(/-/, '_')}.UTF-8`,
                        TERM: 'xterm-256color',
                        COLORTERM: 'truecolor',
                        TERM_PROGRAM: 'arrow',
                        TERM_PROGRAM_VERSION: globals.version
                    },
                    process.env
                )
            })
            // console.log(PTY)
            this.setState({
                tittle: [...this.state.tittle, {
                    id: PTY.pid,
                    processes:
                        [
                            {
                                [`${PTY.pid}`]: PTY[`process`].split(sep).pop()
                            }
                        ]

                }],
                panel: [...this.state.panel, {
                    id: PTY.pid,
                    process: PTY,
                }]
            })
            xtermMap.get(PTY.pid).focus()
            LoadTerminalMenu()
            resolve()
        })
    }
    AppendTabTitle(ptyprocess) {
        // console.log(`append`)
        currTab = tabs.find(".ui-tabs-active").attr("aria-controls");
        currTabNo = parseInt(currTab.replace(/^\D+/g, ``))

        newList = this.state.tittle.map((item) => {
            // console.log(`tab`, item)

            if (item.id === currTabNo) {
                var newProcess = [...item.processes, {
                    [ptyprocess.pid]: ptyprocess.process.split(sep).pop()
                }]
                // console.log(newProcess)
                return { ...item, processes: newProcess }
            }
            return item
        });
        // console.log(`appendedList`, newList)

        this.setState({
            tittle: newList
        })
    }
    UnshiftTabTitle(id) {
        // console.log(`unshift`)
        currTab = tabs.find(".ui-tabs-active").attr("aria-controls");
        currTabNo = parseInt(currTab.replace(/^\D+/g, ``))

        newList = this.state.tittle.map((item) => {
            // console.log(`tab`, item)

            if (item.id === currTabNo) {
                var newProcess = item.processes.filter(process => {
                    if (`${id}` == Object.keys(process)[0]) {
                        return false
                    }
                    return process
                })
                // console.log(newProcess)

                return { ...item, processes: newProcess }
            }
            return item
        });
        // console.log(`unshiftedList`, newList)

        this.setState({
            tittle: newList
        })
    }
    UpdateTabTittle(id, name) {
        currTab = tabs.find(".ui-tabs-active").attr("aria-controls");
        currTabNo = parseInt(currTab.replace(/^\D+/g, ``))
        // console.log(`IP`, id, name, ptyProcessMap.get(id).process)
        newList = this.state.tittle.map((item) => {
            // console.log(`tab`, item)

            if (item.id === currTabNo) {
                var newProcesses = item.processes.map(pane => {
                    // console.log(`panes`, pane)
                    // console.log(`pane`, `${id}` == Object.keys(pane)[0], pane[`${id}`])
                    if (`${id}` == Object.keys(pane)[0]) {
                        return { [id]: name.split(sep).pop() }
                    }
                    return pane

                })
                // console.log(newProcesses)
                return { ...item, processes: newProcesses }
            }
            return item
        });
        // console.log(`newList`, newList)
        this.setState({
            tittle: newList
        })
    }

    componentDidMount() {
        // console.log(`Tabs did mount`)

        LoadTerminalMenu()

        tabs = $("#tabs").tabs({
            activate: async function (event, ui) {
                // console.log(`activate`)
                currTab = tabs.find(".ui-tabs-active").attr("aria-controls");
                currTabNo = parseInt(currTab.replace(/^\D+/g, ``))
                // console.log(`activateTab`, xtermMap)

                if (xtermMap.has(currTabNo)) {
                    // console.log(`it has`)
                    Resize()
                    // AutoComplete(currTabNo)

                }
            }
        })
        tabs.find(".ui-tabs-nav").sortable({
            axis: "x",
            containment: '.ui-tabs-nav',
            stop: function () {
                tabs.tabs("refresh");
            }
        });
        // tabs.on("keydown", function (event) {
        // console.log('tabs key', event)
        // });
        var ele = document.getElementById(`xterm-${this.state.tittle[tabArray - 1][`id`]}`)
        xTerminal(this.state.panel[tabArray - 1][`process`], ele)
        Resize()
        if (filePath) {
            RunAction(filePath)
            filePath = null
        }
    }
    componentDidUpdate() {
        // console.log(`Tabs Update`)

        if (tabArray != this.state.tittle.length) {
            tabs.tabs("refresh");
            tabs.tabs("option", "active", -1);
            tabArray = this.state.tittle.length
            // console.log(`update`, tabArray)
            var ele = document.getElementById(`xterm-${this.state.tittle[tabArray - 1][`id`]}`)
            // console.log(ele)
            xTerminal(this.state.panel[tabArray - 1][`process`], ele)
            Resize()
        }
        var r = document.querySelector(':root');
        if ($(`#tabs`)[0].childNodes.length > 2) {
            r.style.setProperty('--activeTab_BG', colorConfig.colorPalettes[currentPalette].titleBar.activeTab_BG || "#161616")
            r.style.setProperty('--activeTabLabel', colorConfig.colorPalettes[currentPalette].titleBar.activeTabLabel || "#929191")
        } else {
            r.style.setProperty('--activeTab_BG', colorConfig.colorPalettes[currentPalette].titleBar.background || "#161616")
            r.style.setProperty('--activeTabLabel', colorConfig.colorPalettes[currentPalette].titleBar.foreground || "#eceaea")
        }

    }

    render() {
        return (
            <div id="tabs">
                {process.platform === 'darwin' ?
                    <div id="header">
                        <AppButtons />
                        <div id="tab-nav-headers" >
                            <ol style={{ "WebkitAppRegion": "drag" }}>
                                {
                                    this.state.tittle.map(e =>
                                        <TabNavItem key={e.id} id={e.id} processes={e.processes} />
                                    )}
                            </ol>
                        </div>
                    </div> :
                    <div id="header">
                        <div id="tab-nav-headers">
                            <ol>
                                {
                                    this.state.tittle.map(e =>
                                        <TabNavItem key={e.id} id={e.id} processes={e.processes} />
                                    )}
                            </ol>
                        </div>
                        <AppButtons />
                    </div>
                }

                {this.state.panel.map(e =>
                    <TabPanelItem key={e.id} id={e.id} />
                )}
            </div>
        )
    }
}

export { Tabs, tabs, AddTabOutside, UpdateTabTittleOutSide, AppendTabTitleOutSide, UnshiftTabTitleOutside }
