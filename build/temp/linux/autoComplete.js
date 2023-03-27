// modifying values requires Sonic Terminal Reload/Restart

// The autocompelte feature at first checks the type of input(string or number)

module.exports = {
    string: {
        // following property gets autocomplete results based on command line "application name" as input
        // for instance:
        // if you type "node" then all the files with "js","mjs" or "cjs" extension
        // are shown in autocomplete widget as "node ${fileName}" (with extension)

        // the type property acts as a filter to allow only relevant files in autocomplete widget
        // Note : file must exist in $PWD or this won't work.

        apps: {
            node: { type: ["js", "mjs", "cjs"], suggest: ["node ${fileName}"] },
            nano: { type: ["*"], suggest: ["nano ${fileName}"] },
            python3: { type: ["py"], suggest: ["python3 ${fileName}"] },
            cat: { type: ["*"], suggest: ["cat ${fileName}"] }
        },

        // following property gets autocomplete results based on fileName as input
        // for instance : 
        // if you type the name of the file. and that file is python file(.py)
        // then you should see "python3 fileName.py" in autocomplete widget.

        // the type property acts as a filter to allow only relevant files in autocomplete widget.
        // Note : file must exist in $PWD or this won't work.

        files: [{
            type: ["py"],
            suggest: ["python3 ${fileName}"]
        },
        {
            type: ["js", "mjs", "cjs"],
            suggest: ["node ${fileName}",]
        }]
    },

    // this property is very handy when you want kill processes or close busy ports
    // just type the port value or process id and all values in "suggest" property
    // will be displayed in autocomplete

    integer: {
        suggest: ["fuser -k -n tcp ${number}", "lsof -p ${number}"]
    }
}
