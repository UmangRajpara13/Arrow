import './Settings.css'
import $ from `jquery`;

// import { ipcRenderer, shell } from `electron`
// import { ChangeColors, colorConfig } from 'src/renderer/Components/Theme/ColorSetup'
// import { getjsonfile } from 'readJSON';
// import { writejsonfile } from 'writeJSON';
// import { join } from 'path';
// import { globals } from `src/renderer/Components/App`



function LoadSettingsMenu() {

    $(`#toolbar`).contextMenu({
        selector: `.brand_title`,
        trigger: `left`,
        autohide: false,
        build: function ($trigger, e) {

            // settings = {







                // TODO:// quick actions instead, sonic also becomes a command
                // line app and switch themes like modification is added for 
                // other apps as well as operating system
            // }
            // console.log(`settings`, ws_error)


            // appmenu = Object.assign({}, settings);

            return {

                list: appmenu
            };
        },
        events: {
            show: function (opt) {
                var $this = this;
                // console.log(`menu shown`)
            },
            hide: async function (opt) {

            }
        }
    })
}

export { LoadSettingsMenu }