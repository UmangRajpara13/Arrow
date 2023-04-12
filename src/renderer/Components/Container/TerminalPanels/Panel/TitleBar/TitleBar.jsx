import './TitleBar.css'
import $ from `jquery`;

import React, { useEffect } from 'react'
import AppButtons from "./WinowControls/AppButtons"
import { useSelector, useDispatch } from 'react-redux'
import TabNavItem from './TabNav/TabNavItem'
import { ipcRenderer } from 'electron'
import { updateTitle, addTabTitle, setActiveTab } from 'profileSlice'


var e_processTitle = {}

function TitleBar(props) {
     // console.log('TitleBar render')

     const loadTerminal = useSelector((state) => state.profile.loadTerminal)
     const panesTitle = useSelector((state) => state.profile.panesTitle)
     const panes = useSelector((state) => state.profile.panes)

     const dispatch = useDispatch()

     useEffect(() => {
          // ipcRenderer.on('create_pane', (event, obj) => {
          //      console.log('create_pane ', obj, panes)
          //      if (obj.view == 'newTab') {
          //           dispatch(addTabTitle(obj))
          //           if (obj.currTabNo) {
          //                $(`#${obj.currTabNo}`).removeClass('active')
          //           }
          //           dispatch(setActiveTab(obj.pid))
          //           $(`#${obj.pid}`).addClass('active')

          //      }
          //      if (obj.view == 'split') {
          //           dispatch(addPaneTitle(obj))
          //      }

          //      // Temporary workaround
          //      if (obj.action) setTimeout(() => {
          //           //  run action straight away
          //           ipcRenderer.send('write_pty', obj.pid, obj.action)

          //      }, 250)
          //      var r = document.querySelector(':root');

          //      // if (Object.keys(panes).length > 2) {
          //      //      r.style.setProperty('--activeTab_BG', 'red' || "#161616")
          //      //      r.style.setProperty('--activeTabLabel', 'blue' || "#929191")
          //      // } else {
          //      //      r.style.setProperty('--activeTab_BG', colorConfig.colorPalettes[currentPalette].titleBar.background || "#161616")
          //      //      r.style.setProperty('--activeTabLabel', colorConfig.colorPalettes[currentPalette].titleBar.foreground || "#eceaea")
          //      // }

          // })
          // ipcRenderer.on('update_process_title', (event, pid, title) => {
          //      // console.log('update_process_title',pid, title)
          //      const parentPID = $(`#xterm-${pid}`)[0].parentElement.id.replace(/^\D+/g, ``)
          //      e_processTitle = {
          //           ...e_processTitle, [parentPID]: {
          //                ...e_processTitle[parentPID],
          //                [pid]: title
          //           }
          //      }
          //      dispatch(updateTitle({ parentPID: parentPID, panePID: pid, title: title }))
          // })
     }, [])
     return (
          <div id="title-bar" style={{
               flexDirection: process.platform == 'darwin' ? 'row-reverse' : 'row',
               // paddingBottom: "2px"
          }} >
                 {/* <div style={{
                    justifyContent: 'center', alignItems: 'center',
                    display: 'flex', backgroundColor: 'var(--titleBar_BG)',
                    width: '30px', 
               }}>
                    <div className="brand_title" style={{
                         height: '80%', width: '80%', 
                         display: 'flex', alignItems: 'center',

                    }}>
                         <svg style={{
                              // width: '55%', height: '55%',
                              opacity: '0.8'
                         }} version="1.1" viewBox="0.0 0.0 3023.6220472440946 3023.6220472440946" fill="none" stroke="none" strokeLinecap="square" strokeMiterlimit="10" xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><clipPath id="p.0"><path d="m0 0l3023.622 0l0 3023.622l-3023.622 0l0 -3023.622z" clipRule="nonzero" /></clipPath><g clipPath="url(#p.0)"><path fill="var(--inactiveTabLabel)" fillOpacity="0.0" d="m0 0l3023.622 0l0 3023.622l-3023.622 0z" fillRule="evenodd" /><path fill="var(--inactiveTabLabel)" d="m690.34344 356.5301l639.66583 1.7333069l753.2727 743.8718l-320.682 304.66907z" fillRule="evenodd" /><path stroke="var(--inactiveTabLabel)" strokeWidth="1.0" strokeLinejoin="round" strokeLinecap="butt" d="m690.34344 356.5301l639.66583 1.7333069l753.2727 743.8718l-320.682 304.66907z" fillRule="evenodd" /><path fill="var(--inactiveTabLabel)" d="m697.3721 2491.5447l1409.5388 -1367.755l305.49048 295.2334l-1073.0215 1071.945z" fillRule="evenodd" /><path stroke="var(--inactiveTabLabel)" strokeWidth="1.0" strokeLinejoin="round" strokeLinecap="butt" d="m697.3721 2491.5447l1409.5388 -1367.755l305.49048 295.2334l-1073.0215 1071.945z" fillRule="evenodd" /></g></svg>

                    </div>
               </div> */}

               {loadTerminal ?
                    <div id="tab-nav" >
                         {/* <ol className="tab-list">
                              {
                                   Object.keys(panesTitle).length > 0 && Object.keys(panesTitle).map(e =>
                                        <TabNavItem key={e} id={e} childPanes={panesTitle[e]} />
                                   )}
                         </ol> */}
                        <div className="tab-tittle noselect">
                            {props.title}
                        </div>
                    </div> :
                    <div className="drag-area" style={{
                         'WebkitAppRegion': 'drag',
                    }}></div>
               }
               <AppButtons />
          </div>
     )
}

export { TitleBar, e_processTitle }