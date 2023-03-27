import React, { useEffect, Fragment } from "react";
import { xTerminal, xtermMap } from "xTerm";
import $ from "jquery";
import { useSelector, useDispatch } from "react-redux";
import { ipcRenderer } from "electron";
import { TitleBar } from "./TitleBar";
import Pane from "./Pane";
import { LoadTerminalMenu } from "TerminalMenu";
import { Resize } from "resize";

function Panes(props) {
  const panesMap = useSelector((state) => state.profile.panesMap);


  onMouseMove = (e) => {
    // if (mouseMoveLock) {
    // console.log('onMouseMove')
    var pos =
      $(`#container`).css("flex-direction") !== "row" ? e.pageY : e.pageX;
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
    // console.log('mouseMove',prevGrowNew,nextGrowNew)
    currentEle.style.flexGrow = prevGrowNew;
    nextEle.style.flexGrow = nextGrowNew;

    last_pos = pos;
    // }
  };
  onMouseUp = () => {
    // console.log('onMouseUp')
    // resizer_drag.setAttribute('class', 'flex-resizer resizer-drag')
    resizer_drag.classList.remove("resizer-drag");

    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
    setTimeout(() => {
      Resize();
    }, 10);
  };
  manageResize = (e) => {
    console.log(e);
    resizer_drag = e.target;
    // resizer_drag.setAttribute('class', 'flex-resizer resizer-drag')
    resizer_drag.classList.add("resizer-drag");
    currentEle = e.target.previousElementSibling;
    nextEle = e.target.nextElementSibling;
    sum_width =
      $(`#container`).css("flex-direction") !== "row"
        ? currentEle.offsetHeight + nextEle.offsetHeight
        : currentEle.offsetWidth + nextEle.offsetWidth;

    sum_grow =
      parseFloat(currentEle.style.flexGrow) +
      parseFloat(nextEle.style.flexGrow);
    last_pos =
      $(`#container`).css("flex-direction") !== "row" ? e.pageY : e.pageX;
    prevSize =
      $(`#container`).css("flex-direction") !== "row"
        ? currentEle.offsetHeight
        : currentEle.offsetWidth;
    nextSize =
      $(`#container`).css("flex-direction") !== "row"
        ? nextEle.offsetHeight
        : nextEle.offsetWidth;
    // console.log(e, nextEle, sum_width, sum_grow, last_pos, prevSize, nextSize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  useEffect(() => {
    LoadTerminalMenu();
  },[]);
  return (
    Object.keys(panesMap).map((e, i, panes) => (
      <Fragment key={e}>
        <div key={e} id={e} className="pane" style={{ flexGrow: "1" }}>
          <div className="terminal-pane">
            <TitleBar id={e}/>
            <Pane key={e} id={`xterm-${e}`} />
          </div>
        </div>
        {i < panes.length - 1 && (
          <div className="flex-resizer" onMouseDown={manageResize}></div>
        )}{" "}
      </Fragment>
    ))
  );
}

export default Panes;
