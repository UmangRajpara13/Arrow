import { createSlice } from '@reduxjs/toolkit'
import { xtermMap } from 'xTerm'

const initialState = {

  loadTerminal: false,
  updatesAvailable: false,
  bookmarks: [],
  workingDirectory: '',
  panesMap: {},
  panesTitle: {},
  activeTab: null,
  action: null,
  orientation: 'vertical'
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {

    setAction: (state, action) => {
      // console.log(action)
      state.action = action.payload
    },
    setActiveTab: (state, action) => {
      // console.log(action)
      state.activeTab = action.payload
    },
    addTab: (state, action) => {
      // console.log(action.payload[action.payload.pid])
      state.panes = {
        ...state.panes,
        [action.payload.pid]: { [action.payload.pid]: action.payload }
      }
    },
    addTabTitle: (state, action) => {
      // console.log(action)
      // state.panesTitle = {
      //   ...state.panesTitle,
      //   [action.payload.pid]: { [action.payload.pid]: action.payload }
      // }
    },
    addPane: (state, action) => {
      // console.log(action)
      // state.panes = {
      //   ...state.panes,
      //   [action.payload.currTabNo]: {
      //     ...state.panes[action.payload.currTabNo],
      //     [action.payload.pid]: {}
      //   }
      // }
      state.panesTitle = {
        ...state.panesTitle,
        [action.payload.pid]: { title: action.payload.title }
      }
      state.panesMap = {
        ...state.panesMap,
        [action.payload.pid]: {}
      }
     
    },
  
    updateTitle: (state, action) => {
      // console.log(action)
      // state.panesTitle = {
      //   ...state.panesTitle,
      //   [action.payload.parentPID]: {
      //     ...state.panesTitle[action.payload.parentPID],
      //     [action.payload.panePID]: {
      //       ...state.panesTitle[action.payload.parentPID][action.payload.panePID],
      //       title: action.payload.title
      //     }
      //   }
      // }
      state.panesTitle = {
        ...state.panesTitle,
        [action.payload.panePID]: {
          ...state.panesTitle[action.payload.panePID],
          title: action.payload.title
        }
      }
    },
    removePane: (state, action) => {
      // console.log(action)
      let nextState = { ...state.panesMap }
      delete nextState[action.payload.paneId]
      state.panesMap = {
        ...nextState
      }
    },
    removePaneTitle: (state, action) => {
      // console.log(action)

      // let nextState = { ...state.panesTitle }
      // delete nextState[action.payload.parentPID][action.payload.panePID]
      // // if (Object.keys(nextState[action.payload.parentPID]).length = 0) delete nextState[action.payload.parentPID]
      // state.panesTitle = {
      //   ...nextState
      // }
      // // removinf panel and its li here if no panes , this is a temp workaround

      // if (Object.keys(state.panes[action.payload.parentPID]).length == 0) {
      //   let nextPanesState = { ...state.panes }
      //   delete nextPanesState[action.payload.parentPID]

      //   state.panes = {
      //     ...nextPanesState
      //   }

      //   let nextTitleState = { ...state.panesTitle }
      //   delete nextTitleState[action.payload.parentPID]
      //   state.panesTitle = {
      //     ...nextTitleState
      //   }
      // }
      // if (xtermMap.size == 0) state.loadTerminal = false
    },

    setBookmarks: (state, action) => {
      // console.log(action)
      state.bookmarks = action.payload
    },

    setLoadTerminal: (state, action) => {
      // console.log(action)
      state.loadTerminal = action.payload
    },
    setWorkingDirectory: (state, action) => {
      // console.log(action)
      state.workingDirectory = action.payload
    },
    setOrientation: (state, action) => {
      // console.log(action)
      state.orientation = action.payload
    },
    setUpdatesAvailable: (state, action) => {
      // console.log(action)
      state.updatesAvailable = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { setBookmarks, setLoadTerminal, setWorkingDirectory,
  setActiveTab, removePane,
  setUpdatesAvailable, addTab, addTabTitle, updateTitle, addPane
  , removePaneTitle, setAction, setOrientation } = profileSlice.actions

export default profileSlice.reducer