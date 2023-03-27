
import React, { useEffect } from `react`
import $ from `jquery`
import { ipcRenderer } from `electron`
import { globals } from '../../../../../App'

import './AppButtons.css'

function AppButtons() {
    useEffect(() => {
        $(`.close_app`).on(`click`, function () {
            window.close()
        })
    }, [])
    return (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {
                process.platform === 'darwin' ?
                    <div className="AppButtons" style={{ 'width': "70px" }}>
                    </div> :
                    <div className="AppButtons">
                       
                        <div className='close_app'>   <i className=" bi bi-x"></i></div>
                    </div>
            }
        </div>
    )
}

export default AppButtons
