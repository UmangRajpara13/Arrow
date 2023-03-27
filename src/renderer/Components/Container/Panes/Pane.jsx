import './Pane.css'
import './xterm.css'
import React, { useEffect } from 'react'
import { xTerminal, xtermMap } from "xTerm";
import $ from "jquery";

function Pane(props) {
  // console.log('pane render')
  // console.log(props)
  useEffect(() => {
    if (!xtermMap.get(props.id.replace(/^\D+/g, ``)))
      xTerminal(props.id.replace(/^\D+/g, ``)) //sending only PID to xTerminal
  })
  return (
    <div id={props.id} className='xterm-pane'></div>
  )
}

export default Pane