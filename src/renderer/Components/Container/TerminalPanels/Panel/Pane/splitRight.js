
import { homedir } from 'os'
import $ from 'jquery';
import { tabs } from 'Tabs';
// import { spawn } from 'node-pty'
import { Resize } from 'resize'
import { xTerminal, xtermMap } from 'xTerm'
import { terminalProfiles } from 'System';
import { sonicConfig } from "Init";
import { AppendTabTitleOutSide } from 'Tabs';
import shellEnv from 'shell-env';
import osLocale from 'os-locale';
import { globals } from 'App'
import { defaultProfile } from 'System';

var currTab, currTabNo
var childTerms

async function SplitRight(dir) {
    return new Promise(async (resolve, reject) => {
        currTab = tabs.find(".ui-tabs-active").attr("aria-controls");
        currTabNo = parseInt(currTab.replace(/^\D+/g, ``))

        childTerms = $(`#tabs-${currTabNo}`)[0].childNodes
        // console.log(childTerms)
        termCount = childTerms.length
        var resizer_drag

        function manageResize(md) {
            // console.log(md)
            resizer_drag = md.target
            resizer_drag.setAttribute('class', 'flex-resizer resizer-drag')

            const currentEle = md.target.previousElementSibling
            const nextEle = md.target.nextElementSibling
            const sum_width = currentEle.offsetWidth + nextEle.offsetWidth
            const sum_grow = parseFloat(currentEle.style.flexGrow) + parseFloat(nextEle.style.flexGrow)
            var last_pos = md.pageX
            var prevSize = currentEle.offsetWidth
            var nextSize = nextEle.offsetWidth
            // console.log(last_pos, sum_grow)
            // console.log(currentEle, nextEle)
            function onMouseMove(mm) {
                var pos = mm.pageX;
                var d = pos - last_pos;
                prevSize += d;
                nextSize -= d;
                if (prevSize < 0) {
                    nextSize += prevSize;
                    pos -= prevSize;
                    prevSize = 0;
                }
                if (nextSize < 0) {
                    prevSize += nextSize;
                    pos += nextSize;
                    nextSize = 0;
                }

                var prevGrowNew = sum_grow * (prevSize / sum_width);
                var nextGrowNew = sum_grow * (nextSize / sum_width);
                // console.log('mouseMove', mm.pageX)
                currentEle.style.flexGrow = prevGrowNew;
                nextEle.style.flexGrow = nextGrowNew;

                last_pos = pos;

            }
            function onMouseUp() {
                // console.log('mouseUp');
                resizer_drag.setAttribute('class', 'flex-resizer')

                window.removeEventListener("mousemove", onMouseMove);
                window.removeEventListener("mouseup", onMouseUp);
                setTimeout(() => { Resize() }, 100)

            }
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);
        }

        var availableForOld = childTerms.length / (termCount + 1)
        // console.log('availableForOld', availableForOld)
        var widthForNewTerm = 2 - availableForOld

        // console.log('total width', $('.ui-tabs-panel').width(), 'for new', widthForNewTerm, 'for old', availableForOld)
        childTerms.forEach(ele => {

            if (ele.id.includes('xterm')) {
                // console.log('scaledDownWidth', ele.style.flexGrow, $(`#${ele.id}`).css('flex-grow'), ele.id)

                var scaledDownWidth = convertRange($(`#${ele.id}`).css('flex-grow'), [1, 2], [1, 1 + availableForOld])
                // console.log('scaledDownWidth', scaledDownWidth)
                ele.style.flexGrow = scaledDownWidth
            }
        })

        var flexResizer = document.createElement('div')
        flexResizer.setAttribute('class', `flex-resizer`)
        flexResizer.addEventListener('mousedown', function (md) {
            manageResize(md);
            // console.log('mouseDown')
        })

        document.getElementById(`${currTab}`).appendChild(flexResizer)

        const ptyProcess = spawn(terminalProfiles[defaultProfile]['path'],
            terminalProfiles[defaultProfile][`args`], {
            cwd: (dir) ? dir : homedir(),
            env: Object.assign({},
                shellEnv.sync(),
                {
                    LANG: `${osLocale.sync().replace(/-/, '_')}.UTF-8`,
                    TERM: 'xterm-256color',
                    COLORTERM: 'truecolor',
                    TERM_PROGRAM: 'sonic',
                    TERM_PROGRAM_VERSION: globals.version
                },
                process.env)
        })

        var divTerm = document.createElement('div')
        divTerm.setAttribute('id', `xterm-${ptyProcess.pid}`)
        divTerm.setAttribute('class', `pane`)

        ele = document.getElementById(`tabs-${currTabNo}`).appendChild(divTerm)
        await xTerminal(ptyProcess, ele);
        // console.log(xtermMap.get(ptyProcess.pid),ptyProcess.pid)
        xtermMap.get(ptyProcess.pid).focus()

        divTerm.style.flexGrow = widthForNewTerm

        Resize()
        // if (sonicConfig.autocomplete.enable) AutoComplete(ptyProcess.pid)
        AppendTabTitleOutSide(ptyProcess)
        resolve()
    })
}

function convertRange(value, r1, r2) {
    return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
}

export { SplitRight }