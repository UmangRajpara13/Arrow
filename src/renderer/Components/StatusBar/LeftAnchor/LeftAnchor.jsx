import './LeftAnchor.css'
import $ from 'jquery';

import React, { useEffect, useState } from `react`;
import { useSelector, useDispatch } from 'react-redux'
import { ipcRenderer, shell } from 'electron'
import {
    setUpdatesAvailable,
} from 'src/renderer/profileSlice';
import { globals } from `App`
import { LoadProfileMenu } from 'Profile'
import { hostname, userInfo } from "os";


function LeftAnchor() {
    const updatesAvailable = useSelector((state) => state.profile.updatesAvailable)

    const dispatch = useDispatch()

    $('#update').tooltip({
        position: { my: "right bottom", at: "right top", of: '#update' }
    });

    function update() {
        shell.openExternal('https://github.com/umangrajpara13/sonic/releases')
    }

    useEffect(() => {
        LoadProfileMenu()

        // listener keeps reference to old state, hence its better to 
        // receive data from main
        ipcRenderer.once('updates_available', () => {
            dispatch(setUpdatesAvailable(true))
        })
    }, []);

    return (
        <div className='left_anchor'>
            <div className="toolbar_item settings" style={{ padding: '10px' }}>
                {`${userInfo().username}@${hostname()}`}
            </div>

            {
                updatesAvailable &&
                <div id="update" className="toolbar_item" onClick={update} title="Update">
                    <i className="bi bi-arrow-up-circle"></i>
                </div>
            }
        </div >
    )
}

export { LeftAnchor }
