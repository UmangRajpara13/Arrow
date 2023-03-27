import './TabNavItem.css'

import React, { useEffect } from `react`
import $ from `jquery`;
import { addTab, setActiveTab, updateTitle, addTabTitle } from 'profileSlice'
import { useSelector, useDispatch, connect } from 'react-redux'
import { Resize } from 'resize'
import { ipcRenderer } from 'electron'
import { Fragment } from 'react'

function TabNavItem(props) {
    // console.log(props)

    // var title = props.processes.map(item => {
    //     return item[Object.keys(item)]
    // }).join(` | `)
    const activeTab = useSelector((state) => state.profile.activeTab)
    // var title = props.id

    const dispatch = useDispatch()


    function closeTab(event) {
        // console.log(event.target.id.replace(/^\D+/g, ``))
        // panel id of tab active or inactive
        childTerms = $(`#tabs-${event.target.id.replace(/^\D+/g, ``)}`)[0].childNodes
        // kill all panes in tab
        // display warning if pocess running
        // remove tab tittle 

        childTerms.forEach((term) => {
            // console.log(term.id)
            if (term.id) {
                ipcRenderer.send('kill_pty', term.id.replace(/^\D+/g, ``))
            }
        })
        // console.log($('.tab-list')[0].childNodes)

        // return if not active tab is closed 
        if ($(`.active`)[0].id != event.target.id.replace(/^\D+/g, ``)) return
        // return if ony one tab is present
        // if ($('.tab-list')[0].childNodes.length == 1) return
        var tabs = $('.tab-list')[0].childNodes
        var tabIDs = []
        tabs.forEach((tab) => { tabIDs.push(tab.id.replace(/^\D+/g, ``)) })
        // console.log(tabIDs, tabIDs.indexOf(event.target.id.replace(/^\D+/g, ``)))

        if (tabIDs.indexOf(event.target.id.replace(/^\D+/g, ``)) == 0) {
            // first tab switch to next tab
            $(`#${tabIDs[1]}`).addClass('active')
            $(`#tabs-${tabIDs[1]}`).css('display', 'flex')
            dispatch(setActiveTab(tabIDs[1]))


        } else {
            // else switch to next pane
            $(`#${tabIDs[tabIDs.indexOf(event.target.id.replace(/^\D+/g, ``)) - 1]}`).addClass('active')
            $(`#tabs-${tabIDs[tabIDs.indexOf(event.target.id.replace(/^\D+/g, ``)) - 1]}`).css('display', 'flex')
            dispatch(setActiveTab(tabIDs[tabIDs.indexOf(event.target.id.replace(/^\D+/g, ``)) - 1]))

        }
    }

    function switchTab(event) {
        // console.log(event.target.parentElement.id, activeTab)
        if (event.target.parentElement.id != activeTab) {
            // console.log($(`#${activeTab}`))
            $(`#${activeTab}`).removeClass('active')
            $(`#tabs-${activeTab}`).css('display', 'none')
            dispatch(setActiveTab(parseInt(event.target.parentElement.id)))
            $(`#${event.target.parentElement.id}`).addClass('active')
            $(`#tabs-${event.target.parentElement.id}`).css('display', 'flex')
        }
        Resize()
    }
    useEffect(() => {
        $(".tab-list").sortable({
            axis: "x",
            containment: '#tab-nav',
            stop: () => { }
        });
    })
    return (
        <li id={`li-${props.id}`} >
            <div id={props.id} className="tab">
                {Object.keys(props.childPanes).map((e, i, arr) =>
                    <Fragment key={e} >
                        <div className="tab-tittle noselect" onClick={switchTab}>
                            {props.childPanes[e].title}
                        </div>
                        {i < arr.length - 1 && <div className="tab-title-split"></div>}
                    </Fragment>
                )}
                {/* <div id={`close-${props.id.replace(/^\D+/g, ``)}`}
                    className="tab-close" style={{ 'WebkitAppRegion': 'no-drag' }} onClick={closeTab}>
                    <i id={`i-${props.id.replace(/^\D+/g, ``)}`} className="tab-close-icon bi bi-x"></i>
                </div> */}
            </div>
        </li>
    )
}

export default TabNavItem
