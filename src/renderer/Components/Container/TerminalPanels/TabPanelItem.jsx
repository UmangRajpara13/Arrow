import React, { useEffect } from `react`
import './TabPanelItem.css'


function TabPanelItem(props) {

 
  useEffect(() => {
    // Resize  
  })
  return (
    <div key={props.id} id={`tabs-${props.id}`} className="ui-tabs-panel" >
      <div id={`xterm-${props.id}`} className="pane"></div>
    </div>
  )
}

export default TabPanelItem
