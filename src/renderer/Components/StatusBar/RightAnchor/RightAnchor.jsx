import "./RightAnchor.css";
import $ from "jquery";

import React, { useEffect, useState } from "react";
import { hostname, userInfo } from "os";
import { useSelector, useDispatch } from "react-redux";
import { LoadPalleteMenu } from "../../../MenuServices/PalleteMenu";
import { Resize } from "resize";
import { setOrientation } from "profileSlice";
import { ipcRenderer, shell } from "electron";
import { settings } from "Init";
import { currentPWD } from "xTerm"
import { globals } from `App`

function RightAnchor() {
  const orientation = useSelector((state) => state.profile.orientation);
  const loadTerminal = useSelector((state) => state.profile.loadTerminal);

  const dispatch = useDispatch();

  Rotate = () => {
    orientation == "vertical"
      ? dispatch(setOrientation("horizontal"))
      : dispatch(setOrientation("vertical"));

    var list = document.getElementsByClassName("panel");
    for (let item of list) {
      if ($(`#${item.id}`).css("flex-direction") === "row") {
        $(`#${item.id}`).addClass("panes-horizontal");
        $(`#${item.id}`).removeClass("panes-vertical");
        document.querySelectorAll(".flex-resizer").forEach((ele) => {
          ele.classList.add("flex-resizer-horizontal");
          ele.classList.remove("flex-resizer-vertical");
        });
      } else {
        $(`#${item.id}`).addClass("panes-vertical");
        $(`#${item.id}`).removeClass("panes-horizontal");
        document.querySelectorAll(".flex-resizer").forEach((ele) => {
          ele.classList.add("flex-resizer-vertical");
          ele.classList.remove("flex-resizer-horizontal");
        });
      }
    }
    Resize();
  };
  Split = () => {
    ipcRenderer.send("spawn", {
      process:
        settings["terminal.profiles"][settings["terminal.defaultProfile"]][
          `path`
        ],
      args: settings["terminal.profiles"][settings["terminal.defaultProfile"]][
        `args`
      ],
      workingDirectory: currentPWD,
      view: "newPane",
      windowID: globals.windowID,
      action: null,
      currTabNo: $(".active")[0]?.id,
    });
  };
  function NewWindow() {
    ipcRenderer.send("create_new_window", currentPWD);
  }
  useEffect(() => {
    LoadPalleteMenu();
  }, []);
  return (
    <div className="right_anchor">
      {/* <div className="toolbar_item" onClick={Rotate} >
                <svg style={{ transform: 'rotate(0deg)' }} xmlns="http://www.w3.org/2000/svg" height="20" width="20">
                    <path fill="var(--statusBarLabel)"
                        d="M10.354 16 4 9.646q-.417-.458-.427-1.073-.011-.615.427-1.052L7.521 4q.458-.458 1.083-.458T9.646 4L16 10.354q.458.417.458 1.042T16 12.479L12.479 16q-.437.438-1.052.427-.615-.01-1.073-.427Zm1.063-1.042 3.521-3.541-6.355-6.375-3.541 3.541ZM9.958 20q-1.937 0-3.656-.688-1.719-.687-3.052-1.895-1.333-1.209-2.198-2.855Q.188 12.917 0 11h1.5q.188 1.521.865 2.833.677 1.313 1.729 2.302 1.052.99 2.396 1.605 1.343.614 2.864.739l-1.396-1.417L9 16l3.646 3.625q-.667.187-1.334.281-.666.094-1.354.094ZM18.5 9q-.188-1.521-.865-2.833-.677-1.313-1.718-2.302-1.042-.99-2.396-1.605-1.354-.614-2.875-.739l1.396 1.417L11 4 7.354.375Q8.021.167 8.688.083 9.354 0 10.042 0q1.937 0 3.656.688 1.719.687 3.062 1.895 1.344 1.209 2.198 2.855Q19.812 7.083 20 9ZM10 10Z" />
                </svg>
            </div> */}

{!loadTerminal &&
                <div className="toolbar_item" style={{ padding: '10px' }}>
                    {`${userInfo().username}@${hostname()}`}
                </div>
            }

      <div className="toolbar_item rainbow">🌈</div>

      
      {loadTerminal && (
        <div className="toolbar_item" onClick={NewWindow}>
          <i className="bi bi-window-plus"></i>
        </div>
      )}
{loadTerminal && (
        <div className="toolbar_item" onClick={Split}>
          <i className="bi bi-layout-split"></i>
        </div>
      )}
      {/* 
            <div className="toolbar_item settings"  style={{
                    justifyContent: 'center', alignItems: 'center',
                    display: 'flex', 
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
    </div>
  );
}

export { RightAnchor };
