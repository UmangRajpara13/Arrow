import $ from `jquery`;

import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ipcRenderer } from 'electron'
import { updateTitle} from 'profileSlice'



function TitleBar(props) {
  // console.log('TitleBar render',props)

  const panesTitle = useSelector((state) => state.profile.panesTitle);

  const dispatch = useDispatch();
  closePane = (e) => {
    console.log(e);

    const terminalId = e.target.id.replace(/^\D+/g, ``);
   
    ipcRenderer.send("kill_pty", terminalId);
  };

  useEffect(() => {

    ipcRenderer.once("current_process", (event, pid, title) => {
      dispatch(updateTitle({ panePID: pid, title: title }));
    });
  }, []);

  return (
    <div className="pane-titlebar">
      <div className="pane-titlebar-title noselect">
        <span> {panesTitle[props.id]["title"]}</span>
      </div>
      <div className="close_app" onClick={closePane}>
        <i id={`close-${props.id}`} className="bi bi-x"></i>
      </div>
    </div>
  );
}

export { TitleBar };
