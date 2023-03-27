import React, { useEffect, useState } from `react`;
import './Messages.css'
let SetMessageOutside

function Messages() {
    const [message, setMessage] = useState(``)

    SetMessageOutside = function SearchText(msg, type) {
        // console.log(msg, type)
        switch (type) {
            case 'sticky':
                setMessage(msg)
                break;
            case 'disappear':
                temp = message
                // console.log(temp)
                setMessage(msg)
                // restore the prev message
                setTimeout(() => {
                    setMessage(temp)
                }, 1000)
                break;
            default:
                break;
        }
    }
    return (
        <div className="messages">
            {`${message}`}
        </div>
    )
}

export { Messages, SetMessageOutside }