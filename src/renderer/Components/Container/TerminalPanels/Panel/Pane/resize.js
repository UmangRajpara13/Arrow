import $ from 'jquery'
import { xtermMap } from './xTerm'
// import { tabs } from '../Tabs/Tabs'
import { ipcRenderer } from 'electron'

$(window).on('resize', function (e) {
  // console.log($(window).width() , $(window).height())
  // if ($(`.active`)[0]?.id) {
  //   Resize()
  // }
  if (xtermMap.size > 0) Resize()
})

function Resize() {
  $(`#container`)[0]?.childNodes.forEach(terminalPane => {

    console.log(terminalPane.id)
    if (terminalPane.id) {
      term_pid = terminalPane.id.replace(/^\D+/g, ``)
      w = $(`#xterm-${term_pid}`).width()
      // console.log('term_pid', term_pid, w)
      paddingBottom = parseFloat($(`#xterm-${term_pid}`).css('padding-bottom'))
      paddingTop = parseFloat($(`#xterm-${term_pid}`).css('padding-top'))
      paddingLeft = parseFloat($(`xterm-${term_pid}`).css('padding-Left'))
      paddingRight = parseFloat($(`xterm-${term_pid}`).css('padding-Right'))

      scrollBar = parseFloat($(`.xterm`).innerWidth() - $(`.xterm`).width())

      scaledWidthAvailable = (w - scrollBar) * window.devicePixelRatio;

      letterSpacing = xtermMap.get(term_pid).getOption('letterSpacing');
      realCellWidth = xtermMap.get(term_pid)['_core']._renderService.dimensions.actualCellWidth
      charWidth = realCellWidth - Math.round(letterSpacing) / window.devicePixelRatio
      scaledCharWidth = charWidth * window.devicePixelRatio + letterSpacing;

      cols = Math.max(Math.floor(scaledWidthAvailable / scaledCharWidth), 1);

      h = document.getElementById(`xterm-${term_pid}`).offsetHeight

      scaledHeightAvailable = (h - paddingBottom - paddingTop) * window.devicePixelRatio;

      lineHeight = xtermMap.get(term_pid).getOption('lineHeight');
      realCellHeight = xtermMap.get(term_pid)['_core']._renderService.dimensions.actualCellHeight
      // console.log(h, toolbarHeight, headingHeight)
      charHeight = realCellHeight / lineHeight
      scaledCharHeight = Math.ceil(charHeight * window.devicePixelRatio);
      // console.log(scaledCharHeight)
      scaledLineHeight = Math.floor(scaledCharHeight * lineHeight);
      // console.log(scaledLineHeight)

      rows = Math.max(Math.floor(scaledHeightAvailable / scaledLineHeight), 1);
      // console.log(rows, cols)

      ipcRenderer.send('resize_pty', term_pid, cols, rows)
      xtermMap.get(term_pid).resize(cols, rows)
    }
  })
  // if ($(`.active`)[0]?.id) {

  //   var id = $(`.active`)[0]?.id

  //   if (!$(`#tabs-${id}`)[0]?.childNodes) return
  //   childTerms = $(`#tabs-${id}`)[0].childNodes
  //   // console.log(childTerms)
  //   childTerms.forEach(ele => {
  //     if (ele.id) {
  //       // console.log(ele.id)
  //       term_pid = ele.id.replace(/^\D+/g, ``)
  //       // console.log(term_pid)
  //       w = $(`#xterm-${term_pid}`).width()
  //       // console.log('term_pid', term_pid, w)
  //       paddingBottom = parseFloat($(`.pane`).css('padding-bottom'))
  //       paddingTop = parseFloat($(`.pane`).css('padding-top'))
  //       paddingLeft = parseFloat($(`.pane`).css('padding-Left'))
  //       paddingRight = parseFloat($(`.pane`).css('padding-Right'))
  //       scrollBar = parseFloat($(`.xterm`).innerWidth() - $(`.xterm`).width())

  //       scaledWidthAvailable = (w - scrollBar - paddingRight) * window.devicePixelRatio;

  //       letterSpacing = xtermMap.get(term_pid).getOption('letterSpacing');
  //       realCellWidth = xtermMap.get(term_pid)['_core']._renderService.dimensions.actualCellWidth
  //       charWidth = realCellWidth - Math.round(letterSpacing) / window.devicePixelRatio
  //       scaledCharWidth = charWidth * window.devicePixelRatio + letterSpacing;

  //       cols = Math.max(Math.floor(scaledWidthAvailable / scaledCharWidth), 1);
  //       h = document.getElementById(`xterm-${term_pid}`).offsetHeight
  //       headingHeight = $('#title-bar').height()
  //       toolbarHeight = $('#toolbar').height()

  //       scaledHeightAvailable = (h - paddingBottom - paddingTop) * window.devicePixelRatio;

  //       lineHeight = xtermMap.get(term_pid).getOption('lineHeight');
  //       realCellHeight = xtermMap.get(term_pid)['_core']._renderService.dimensions.actualCellHeight
  //       // console.log(h, toolbarHeight, headingHeight)
  //       charHeight = realCellHeight / lineHeight
  //       scaledCharHeight = Math.ceil(charHeight * window.devicePixelRatio);
  //       // console.log(scaledCharHeight)
  //       scaledLineHeight = Math.floor(scaledCharHeight * lineHeight);
  //       // console.log(scaledLineHeight)

  //       rows = Math.max(Math.floor(scaledHeightAvailable / scaledLineHeight), 1);

  //       // ptyProcessMap.get(term_pid).resize(cols, rows)
  //       ipcRenderer.send('resize_pty', term_pid, cols, rows)
  //       xtermMap.get(term_pid).resize(cols, rows)
  //       // console.log(cols, rows)

  //       // xtermMap.get(term_pid).focus()}
  //     }
  //   })
  // }
}

export { Resize }