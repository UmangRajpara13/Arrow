const axios = require('axios')

var url = `https://api.blindfoldgroup.com/myFunc`
const data = {
    email: 'umangrajpara@live.in'
}
const headers = {
    headers: {
        'Content-Type': 'application/json',
    },
}


async function fetch() {
    await axios.post(`${url}`, data, headers).then((response) => {
        console.log('vr', response.data);
    })
}

fetch()