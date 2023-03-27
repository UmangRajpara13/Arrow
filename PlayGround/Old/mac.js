var macaddress = require('macaddress');
var { write, writeFile } = require('fs')


macaddress.all(function (err, all) {
    console.log(JSON.stringify(all, null, 2));
    // writeFile('./mac.json', JSON.stringify(all, null, 2), (err, data) => {
    //     if (err) console.log(err)
    //     else console.log(data)
    // })
});


const computerName = require('computer-name')
 
console.log(computerName())