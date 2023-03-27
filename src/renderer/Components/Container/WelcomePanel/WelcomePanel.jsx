import './WelcomePanel.css'
import { ipcRenderer, shell } from "electron";
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { join, sep } from 'path'
import { globals } from "App";
import {
     setLoadTerminal,
} from 'profileSlice'

import { homedir } from "os";
import { bookmarks, settings } from "Init"

function Welcome(props) {
     // console.log('welcome Mounted')

     const dispatch = useDispatch()

   

     function Home() {
          dispatch(setLoadTerminal(true))
          ipcRenderer.send('spawn', {
               process: settings['terminal.profiles'][settings['terminal.defaultProfile']][`path`],
               args: settings['terminal.profiles'][settings['terminal.defaultProfile']][`args`],
               workingDirectory: homedir(),
               view: 'newPane',
               windowID: globals.windowID,
               action: null,
               currTabNo: null
          })
     }
     function Desktop() {
          dispatch(setLoadTerminal(true))
          ipcRenderer.send('spawn', {
               process: settings['terminal.profiles'][settings['terminal.defaultProfile']][`path`],
               args: settings['terminal.profiles'][settings['terminal.defaultProfile']][`args`],
               workingDirectory: `${homedir()}/Desktop`,
               view: 'newPane',
               windowID: globals.windowID,
               action: null,
               currTabNo: null
          })
     }
     function LoadTerminal(e) {
          // console.log(e.target.getAttribute('value'))
          dispatch(setLoadTerminal(true))
          ipcRenderer.send('spawn', {
               process: settings['terminal.profiles'][settings['terminal.defaultProfile']][`path`],
               args: settings['terminal.profiles'][settings['terminal.defaultProfile']][`args`],
               workingDirectory: e.target.getAttribute('value'),
               view: 'newPane',
               windowID: globals.windowID,
               action: null,
               currTabNo: null
          })
     } 
     return (
          <div className="welcome-pane noselect" style={{
               backgroundColor: 'var(--background)', color: 'var(--foreground)', position: 'relative',
               display: 'flex',flex:1,overflow:'hidden', flexDirection: 'column', height: '-webkit-fill-available'
          }}>
                        <div className="drag-area" style={{
                         'WebkitAppRegion': 'drag',
                    }}></div>
                  <div className="AppButtons">
                       
                       <div className='close_app'>   <i className=" bi bi-x"></i></div>
                   </div>

               <div style={{
                    display: 'flex', flexDirection: 'row', overflow: 'hidden',
                    justifyContent: 'space-around', alignItems: 'center',height: '-webkit-fill-available',
                    zIndex: '10'
               }}>

                    <div style={{
                         display: 'flex', height: '100%',
                         flexDirection: 'column', justifyContent: 'flex-start'
                    }}>
                         <div style={{
                              display: 'flex', flex: 1.5, alignItems: 'flex-end',
                              justifyContent: 'center'
                         }}>
                              <div className='homeLink' style={{
                                   margin: '0 5px',
                                   padding: '10px 20px',
                                   cursor: 'pointer',
                                   fontWeight: 'bold',
                              }} onClick={Home}>Home</div>
                              <div className='desktopLink' style={{
                                   margin: '0 5px',
                                   padding: '10px 20px',
                                   cursor: 'pointer',
                                   fontWeight: 'bold',
                              }} onClick={Desktop}>Desktop</div>

                         </div>
                         <div style={{
                              display: 'flex', flex: 2, flexDirection: 'column', height: '100%', overflow: 'hidden',
                              alignItems: 'strech', overflowX: 'hidden', padding: '10px 30px',
                         }}>
                              {bookmarks.length > 0 ? <div
                                   className='bookmarks'
                                   style={{
                                        overflow: 'auto',
                                        height: 'auto'
                                   }}>

                                   {bookmarks.map((item, index) => {
                                        return <div onClick={LoadTerminal} value={item} className="bookmarksLinks"
                                             style={{
                                                  padding: '10px 0px', display: 'flex', justifyContent: 'center',
                                                  cursor: 'pointer', fontWeight: 'bold'
                                             }} key={index}>{item.split(sep).pop()} </div>
                                   })}
                              </div> : null}
                         </div>
                    </div>
               </div>

          </div >
     );
}

export default Welcome;