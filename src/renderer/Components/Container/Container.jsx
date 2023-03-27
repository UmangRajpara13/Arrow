import "context";
import "context-menu";
import "./Container.css";
import "MenuCss";
import $ from "jquery";
import React, { useEffect, useState } from "react";
// import { Tabs } from './TerminalPanels/Tabs'
import WelcomePanel from "WelcomePanel";
import { StatusBar } from "../StatusBar/StatusBar";
import { globals } from "../App";
// import { ReadHistory } from './AutoComplete/corpus';
import {  setLoadTerminal, updateTitle } from "../../profileSlice";
import { useSelector, useDispatch } from "react-redux";
import { TerminalPanels } from "TerminalPanels";
import { removePaneTitle, removePane } from "profileSlice";
import { ipcRenderer } from "electron";
import { Resize } from "resize";
import Panes from "./Panes/Panes";
import { addPane } from "profileSlice";
let RemovePane;

function Container(props) {
  // console.log('Container render')
  const panesMap = useSelector((state) => state.profile.panesMap);

  const dispatch = useDispatch();

  RemovePane = (pid) => {
    // console.log(parentID)
    dispatch(removePane({ paneId: pid }));

    Resize();
  };
  useEffect(() => {
    ipcRenderer.once(
      "create_pane_title",
      (event, obj) => {
        // console.log("create_pane_title ", obj);
        if (obj.view == "newPane") {
          dispatch(addPane(obj));
        }
        // Temporary workaround
        if (obj.action)
          setTimeout(() => {
            //  run action straight away
            ipcRenderer.send("write_pty", obj.pid, obj.action);
          }, 250);
      },
    );
  },[panesMap]);
  return process.platform === "darwin" ? (
    <div id="container" style={{ borderRadius: "12px" }}>
      {Object.keys(panesMap).length > 0  ? <Panes /> : <WelcomePanel />}
    </div>
  ) : (
    <div id="container">
      {Object.keys(panesMap).length > 0 ? <Panes /> : <WelcomePanel />}
    </div>
  );
}

export { Container, globals, RemovePane };
