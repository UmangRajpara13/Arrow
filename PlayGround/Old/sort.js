var a = []
a[5] = 10
console.log(a.length)
a[16] = 45
console.log(a.length)

console.log(!a[2], a[10])
console.log(a)
console.log(a.filter(n => n))

a = [undefined,'dd',undefined,'ddfcss','s']
console.log(a.filter(n => n),a.sort())