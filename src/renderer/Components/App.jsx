"use strict";

import React, { useEffect, useState } from "react";
import "jquery-ui.css";
import "jquery-ui";
import "bootstrapCss";
import "bootstrapIcons";
import "./App.css";
import { sep } from "path";
import { Container } from "Container";
import { watch } from "chokidar";
import { ipcRenderer } from "electron";
import { getjsonfile } from "readJSON";
import { join } from "path";
import { existsSync, lstatSync } from "fs";
import { setLoadTerminal } from "profileSlice";
import { Init } from "Init";
import { StatusBar } from "./StatusBar/StatusBar";
import { settings } from "Init";
import { ThemeSetup } from "ColorSetup";
import {
  ensureDir,
  ensureDirSync
} from "fs-extra";
import { useSelector, useDispatch } from "react-redux";
import { setBookmarks } from "profileSlice";
import { homedir } from "os";
import { addPane } from "profileSlice";
import yargs from "yargs";

var globals, watcher;

// window.onerror = function (message, file, line, col, error) {
//      process.env.NODE_ENV !== 'production' ? // console.error(message, file, line, col, error) :
//           alert("Error occurred: " + error.message);
//      return false;
// };
// window.addEventListener("error", function (e) {
//      process.env.NODE_ENV !== 'production' ? // console.error(e.error.message) :
//           alert("Error occurred: " + e.error.message);
//      return false;
// })
// window.addEventListener('unhandledrejection', function (e) {
//      process.env.NODE_ENV !== 'production' ? // console.error(e.error.message) :
//           alert("Error occurred: " + e.reason.message);
// })

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    console.log('App UseEffectHook')
    ipcRenderer.send(`get_user_path`);

    ipcRenderer.once(
      `user_path`,
      async function (
        event,
        exePath,
        appName,
        version,
        id,
        appData,
        commandLine
      ) {
        console.log(commandLine)
        globals = {
          isDev: process.env.NODE_ENV !== "production",
          userData: join(appData, appName),
          settingsPath: join(appData, appName, `settings`),
          appName: appName,  
          version: version,
          windowID: id,
          sonicHistory: join(appData, appName, `sonicHistory.txt`),
          dirLinkRegex:
            process.platform !== "win32"
              ? new RegExp(/((\~|\/)(((\w)|((\s|\W)\w)|\/)+)?)/)
              : new RegExp(
                /((\~|\/)(((\w)|((\s|\W)\w)|\/)+)?)|(([A-Za-z])(:)(([^\<\>\/\:\"\?\*\|])+)?)/
              ),
          exePath: exePath,
        };
        // regex stash ->  /(\~|\/)(((\w)|((\s|\W)\w)|\/)+)?/
        // (\~|\/)[.?](((\w)|(\s)\w)+)?
        ensureDirSync(join(globals.settingsPath), (err) => { });

        watcher = watch(join(globals.userData), {
          // ignored: /(^|[\/\\])\../, // ignore dotfiles
          persistent: true,
          useFsEvents: false,
        });
        await ThemeSetup();

        await Init();

        await getjsonfile(join(globals.userData, "bookmarks")).then(
          async (jsonfile) => {
            // MakeBookmarksObject(jsonfile)
            bookmarks = jsonfile["bookmarks"] || [];
            dispatch(setBookmarks(jsonfile["bookmarks"] || []));
          },
          () => {
            // console.log('no bookmarks')
            ensureDir(join(globals.userData), (err) => {
              // console.log(err) // => null
              writejsonfile(join(globals.userData, `bookmarks`), {
                bookmarks: [],
              });
            });
          }
        );

        // console.log(settings)
        // click on dock icon gives commandLine[1] empty
        // hence only load terminal if commandLine[1] is present
        // triggered on new window

        // if (commandLine[1]) {
        //   dispatch(setLoadTerminal(true));

        //   if (existsSync(commandLine[1])) {
        //     if (lstatSync(commandLine[1]).isDirectory()) {
        //       // console.log('its Directory')
        //       ipcRenderer.send("spawn", {
        //         process:
        //           settings["terminal.profiles"][
        //           settings["terminal.defaultProfile"]
        //           ][`path`],
        //         args: settings["terminal.profiles"][
        //           settings["terminal.defaultProfile"]
        //         ][`args`],
        //         workingDirectory: commandLine[1],
        //         windowID: globals.windowID,
        //         action: null,
        //         view: "newTab",
        //       });
        //     } else {
        //       // console.log('// run Actions coz its a file ')
        //       fileName = commandLine[1].substring(
        //         commandLine[1].lastIndexOf(sep) + 1,
        //         commandLine[1].lastIndexOf(".")
        //       );
        //       fileType = commandLine[1].substring(
        //         commandLine[1].lastIndexOf(".") + 1
        //       );
        //       // console.log(fileName, fileType, settings['terminal.file.actions'][`${fileType}`].command.replace('${fileName}', `${fileName}.${fileType}`))

        //       ipcRenderer.send("spawn", {
        //         process:
        //           settings["terminal.profiles"][
        //           settings["terminal.defaultProfile"]
        //           ][`path`],
        //         args: settings["terminal.profiles"][
        //           settings["terminal.defaultProfile"]
        //         ][`args`],
        //         workingDirectory: commandLine[1].substring(
        //           0,
        //           commandLine[1].lastIndexOf(sep)
        //         ),
        //         view: "newTab",
        //         windowID: globals.windowID,
        //         action: settings["terminal.file.actions"][
        //           `${fileType}`
        //         ].command.replace("${fileName}", `${fileName}.${fileType}`)
        //       });
        //     }
        //   } else {
        //     // console.log('// either -e or doesnt exist')
        //     if (commandLine[1] === "-e") {
        //       // console.log(' // code session')
        //       dispatch(setLoadTerminal(true));
        //       ipcRenderer.send("spawn", {
        //         process: commandLine[2],
        //         args: commandLine[3],
        //         workingDirectory: commandLine[1].substring(
        //           0,
        //           commandLine[1].lastIndexOf(sep)
        //         ),
        //         view: "newTab",
        //         windowID: globals.windowID,
        //         action: commandLine[4],
        //         currTabNo: null,
        //       });
        //     } else {
        //       alert(`Path ${commandLine[1]} does not exist`);
        //     }
        //   }
        // }

        // if (existsSync(workingDirectory)) {
        //   console.log('// open Dir')
        //   // pwd = workingDirectory, action = null, type = 'directory'
        //   const commandLineObject = yargs(commandLine).parse()

        //   if (commandLineObject["file"]) {
        //     const fileNameWithType = commandLineObject["file"]
        //     const fileName = fileNameWithType.substring(0, fileNameWithType.lastIndexOf('.'))
        //     const fileType = fileNameWithType.substring(fileNameWithType.lastIndexOf('.') + 1)

        //     knownActions = Object.keys(settings['terminal.file.actions'])
        //     if (!knownActions.includes(fileType)) {
        //       alert(`No action configured for .${fileType} file`);
        //       return
        //     }
        //     const action = settings['terminal.file.actions'][`${fileType}`].command.replace('${fileName}', `${fileName}.${fileType}`)
        //     console.log('fileName', fileName, 'fileType', fileType, action)
        //     ipcRenderer.send('spawn', {
        //       process: settings['terminal.profiles'][settings['terminal.defaultProfile']][`path`],
        //       args: settings['terminal.profiles'][settings['terminal.defaultProfile']][`args`],
        //       workingDirectory: workingDirectory,
        //       view: 'newPane',
        //       windowID: globals.windowID,
        //       action: action
        //     })
        //   }
        // } else {
        //   alert(`Path ${workingDirectory} does not Exist!`)
        // }
        console.log(yargs(commandLine).parse());
        const commandLineObject = yargs(commandLine).parse()

        if (existsSync(commandLineObject["dir"])) {

            if (commandLineObject["file"]) {
                const fileNameWithType = commandLineObject["file"]
                const fileName = fileNameWithType.substring(0, fileNameWithType.lastIndexOf('.'))
                const fileType = fileNameWithType.substring(fileNameWithType.lastIndexOf('.') + 1)

                knownActions = Object.keys(settings['terminal.file.actions'])
                if (!knownActions.includes(fileType)) {
                    alert(`No action configured for .${fileType} file`);
                    return
                }
                const action = settings['terminal.file.actions'][`${fileType}`].command.replace('${fileName}', `${fileName}.${fileType}`)
                console.log('fileName', fileName, 'fileType', fileType, action)
                ipcRenderer.send('spawn', {
                    process: settings['terminal.profiles'][settings['terminal.defaultProfile']][`path`],
                    args: settings['terminal.profiles'][settings['terminal.defaultProfile']][`args`],
                    workingDirectory: commandLineObject["dir"],
                    view: 'newPane',
                    windowID: globals.windowID,
                    action: action
                })
            }
        } else {
            alert(`Path ${commandLineObject["dir"]} does not Exist!`)
        }


        if (globals.isDev) {
          ipcRenderer.send("spawn", {
            process:
              settings["terminal.profiles"][
              settings["terminal.defaultProfile"]
              ][`path`],
            args: settings["terminal.profiles"][
              settings["terminal.defaultProfile"]
            ][`args`],
            workingDirectory: homedir(),
            view: "newPane",
            windowID: globals.windowID,
            action: null
          });
        }
      }
    );
    ipcRenderer.on(
      "create_pane",
      (event, obj) => {
        console.log("create_pane ", obj);
        if (obj.view == "newPane") {
          dispatch(addPane(obj));
        }
        // Temporary workaround
        if (obj.action)
          setTimeout(() => {
            //  run action straight away
            ipcRenderer.send("write_pty", obj.pid, obj.action);
          }, 250);
      }
    );
  }, []);

  return (
    <div className="app">
      <Container />
      <StatusBar />
    </div>
  );
}

export { App, globals, watcher };
