async function wait(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function hello() {
    var r = await wait(10000);
    return 'world';
}

async function my() {
    var my = await hello()
    console.log(my)
    console.log(hello())
    console.log('hi')
}
my()

async function foo() {
    return 1
}
console.log(foo())


