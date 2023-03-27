const { createWriteStream, createReadStream } = require('fs');
const readline = require('readline');

var files = ['../dist/renderer/index.js', '../dist/main/main.js']

files.forEach((file) => {
    var lineStack = []
    const fileStream = createReadStream(file);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    async function read(file) {
        for await (line of rl) {
            if (line.includes("Screen Limit... Logging Out!")) {
                console.log(line, line.length, lineStack.length)
                line = line.replace(/"Screen Limit... Logging Out!"/g, '(function () { var g = Array.prototype.slice.call(arguments), c = g.shift(); return g.reverse().map(function (S, A) { return String.fromCharCode(S - c - 41 - A) }).join(\'\') })(26, 183, 167, 150) + (18671).toString(36).toLowerCase() + (16).toString(36).toLowerCase().split(\'\').map(function (E) { return String.fromCharCode(E.charCodeAt() + (-71)) }).join(\'\') + (28).toString(36).toLowerCase().split(\'\').map(function (n) { return String.fromCharCode(n.charCodeAt() + (-39)) }).join(\'\') + (868997).toString(36).toLowerCase() + (30).toString(36).toLowerCase().split(\'\').map(function (Q) { return String.fromCharCode(Q.charCodeAt() + (-71)) }).join(\'\') + (function () { var o = Array.prototype.slice.call(arguments), m = o.shift(); return o.reverse().map(function (O, V) { return String.fromCharCode(O - m - 6 - V) }).join(\'\') })(56, 191, 191, 152, 104, 174, 180, 174, 171, 170, 177, 141, 96, 109, 108) + (17).toString(36).toLowerCase().split(\'\').map(function (l) { return String.fromCharCode(l.charCodeAt() + (-71)) }).join(\'\')')
                console.log(line.length, lineStack.length)
                lineStack.push(line)
            } 
            else if (line.includes("Copied")) {
                console.log(line, line.length, lineStack.length)
                line = line.replace(/"Copied"/g, '(19).toString(36).toLowerCase().split(\'\').map(function(v){return String.fromCharCode(v.charCodeAt()+(-39))}).join(\'\')+(function(){var p=Array.prototype.slice.call(arguments),T=p.shift();return p.reverse().map(function(m,D){return String.fromCharCode(m-T-4-D)}).join(\'\')})(40,157,155)+(23845).toString(36).toLowerCase()')
                console.log(line.length, lineStack.length)
                lineStack.push(line)
            } 
            else {
                lineStack.push(line)
            }
        }
        console.log(lineStack.length)
        // var file = createWriteStream(file);
        // file.on(`error`, function (err) { alert(err) });
        // lineStack.forEach(function (v) { file.write(v + `\n`); });
        // file.end();
        console.log(lineStack.length)

    }
    read(file)


})
