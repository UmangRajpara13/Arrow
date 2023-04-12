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
  showStartupPanel: false
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {

    setAction: (state, action) => {
      // console.log(action)
      state.action = action.payload
    },
    setShowStartupPanel: (state, action) => {
      // console.log(action)
      state.showStartupPanel = action.payload
    },
    // setActiveTab: (state, action) => {
    //   // console.log(action)
    //   state.activeTab = action.payload
    // },
    // addTab: (state, action) => {
    //   // console.log(action.payload[action.payload.pid])
    //   state.panes = {
    //     ...state.panes,
    //     [action.payload.pid]: { [action.payload.pid]: action.payload }
    //   }
    // },
    addPane: (state, action) => {
      // console.log(action)
      if (Object.keys(state.panesMap).length == 0) state.showStartupPanel = true

      state.panesTitle = {
        ...state.panesTitle,
        [action.payload.pid]: { title: action.payload.title }
      }
      state.panesMap = {
        ...state.panesMap,
        [action.payload.pid]: {}
      }
      // console.log(Object.keys(state.panesMap).length)
    },

    updateTitle: (state, action) => {
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
      if (Object.keys(state.panesMap).length == 0) state.showStartupPanel = false

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

    setUpdatesAvailable: (state, action) => {
      // console.log(action)
      state.updatesAvailable = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { setBookmarks, setLoadTerminal, setWorkingDirectory,
  setActiveTab, removePane, setShowStartupPanel,
  setUpdatesAvailable, addTab, addTabTitle, updateTitle, addPane
  , removePaneTitle, setAction } = profileSlice.actions

export default profileSlice.reducer