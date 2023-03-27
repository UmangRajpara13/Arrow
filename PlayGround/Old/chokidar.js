const { watch } = require('chokidar')

watch('./memory.js').on('all', (event, path) => {
    console.log(event, path);
});