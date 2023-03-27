import './TerminalPanels.css'

import $ from "jquery";
import React, { useEffect } from 'react'
import { LoadTerminalMenu } from "TerminalMenu";
import { useSelector, useDispatch } from 'react-redux'
import { addTab, setActiveTab, addPane } from 'profileSlice'
import { ipcRenderer } from 'electron'
import Panel from "./Panel/Panel"

function TerminalPanels() {
  // console.log('TerminalPanels Render')

  const panes = useSelector((state) => state.profile.panes)

  const dispatch = useDispatch()


  useEffect(() => {
    // console.log('TerminalPanels useEffect', panes, activeTab)
    LoadTerminalMenu()

    ipcRenderer.on('create_pane', (event, obj) => {
      // console.log('create_pane', obj)
      if (obj.view == 'newTab') {
        dispatch(addTab(obj))
        if (obj.currTabNo) {
          $(`#${obj.currTabNo}`).removeClass('active')

          $(`#tabs-${obj.currTabNo}`).css('display', 'none')
        }
        dispatch(setActiveTab(obj.pid))
        $(`#${obj.pid}`).addClass('active')
        if (Object.keys(panes).length > 0) {
          $(`#tabs-${obj.pid}`).css('display', 'flex')
        }
      }
      if (obj.view == 'split') {
        // console.log(obj)
        dispatch(addPane(obj))
      }
    })
  }, [])

  return (
    Object.keys(panes).map(e =>
      <Panel key={e} id={`tabs-${e}`} childPanes={panes[e]} />
    )
  )
}

export { TerminalPanels }