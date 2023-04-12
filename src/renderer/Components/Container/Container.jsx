import "context";
import "context-menu";
import "./Container.css";
import "MenuCss";
import $ from "jquery";
import React, { useEffect, useState } from "react";
import StartupPanel from "startupPanel";
import { StatusBar } from "StatusBar";
import { globals } from "../App";
import { useSelector, useDispatch } from "react-redux";
import {  removePane } from "profileSlice";
import { ipcRenderer } from "electron";
import { Resize } from "resize";
import Panes from "./Panes/Panes";
import { addPane } from "profileSlice";

let RemovePane;

function Container(props) {
  console.log('Container render')

  const showStartupPanel = useSelector((state) => state.profile.showStartupPanel);

  const dispatch = useDispatch();

  RemovePane = (pid) => {
    // console.log(parentID)
    dispatch(removePane({ paneId: pid }));

    Resize();
  };
  useEffect(() => {
    
  },[]);
  return process.platform === "darwin" ? (
    <div id="container" style={{ borderRadius: "12px" }}>
      {showStartupPanel  ? <Panes /> : <StartupPanel />}
    </div>
  ) : (
    <div id="container">
      {showStartupPanel ? <Panes /> : <StartupPanel />}
    </div>
  );
}

export { Container, globals, RemovePane };
