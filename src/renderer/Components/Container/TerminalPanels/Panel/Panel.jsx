import $ from "jquery";
import "./Panel.css";
import React from "react";
import { Fragment } from "react";
import Pane from "./Pane/Pane";
import { Resize } from "resize";
import { PaneError } from "./Pane/PaneError";
import { useSelector, useDispatch } from "react-redux";

var currentEle,
  nextEle,
  sum_width,
  sum_grow,
  last_pos,
  prevSize,
  nextSize,
  resizer_drag;

function Panel(props) {
  // console.log('panel render')
  // console.log(props)
  const orientation = useSelector((state) => state.profile.orientation);

  onMouseMove = (e) => {
    // if (mouseMoveLock) {
    // console.log('onMouseMove')
    var pos = $(`.panel`).css("flex-direction") !== "row" ? e.pageY : e.pageX;
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
    // console.log(e)
    resizer_drag = e.target;
    // resizer_drag.setAttribute('class', 'flex-resizer resizer-drag')
    resizer_drag.classList.add("resizer-drag");
    currentEle = e.target.previousElementSibling;
    nextEle = e.target.nextElementSibling;
    sum_width =
      $(`.panel`).css("flex-direction") !== "row"
        ? currentEle.offsetHeight + nextEle.offsetHeight
        : currentEle.offsetWidth + nextEle.offsetWidth;

    sum_grow =
      parseFloat(currentEle.style.flexGrow) +
      parseFloat(nextEle.style.flexGrow);
    last_pos = $(`.panel`).css("flex-direction") !== "row" ? e.pageY : e.pageX;
    prevSize =
      $(`.panel`).css("flex-direction") !== "row"
        ? currentEle.offsetHeight
        : currentEle.offsetWidth;
    nextSize =
      $(`.panel`).css("flex-direction") !== "row"
        ? nextEle.offsetHeight
        : nextEle.offsetWidth;
    // console.log(e,nextEle,sum_width,sum_grow,last_pos,prevSize,nextSize)
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div
      id={props.id}
      className={
        orientation === "vertical"
          ? "panel panes-vertical"
          : "panel panes-horizontal"
      }
    >
      {Object.keys(props.childPanes).map((f, i, arr) => {
        return (
          <PaneError key={f}>
            <Fragment key={f}>
              <Pane id={`xterm-${f}`} />
              {i < arr.length - 1 && (
                <div className="flex-resizer" onMouseDown={manageResize}></div>
              )}
            </Fragment>
          </PaneError>
        );
      })}
    </div>
  );
}

export default Panel;
