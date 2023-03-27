module.exports = {
    string: {
        apps: {
            node: ["js", "mjs", "cjs"],
            nano: ["*"],
            python3: ["py"],
            cat: ["*"]
        },
        files: [{
            type: ["py"],
            suggest: ["python3 <i>"]

        },
        {
            type: ["js", "mjs", "cjs"],
            suggest: ["node <i>",]

        }]
    },
    integer: {
        suggest: ["fuser -k -n tcp <i>", "lsof -p <i>"]
    }

}
