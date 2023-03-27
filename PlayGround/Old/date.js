Date.prototype.addDays = function(days) {
    console.log(this.valueOf())
    var date = new Date(this.valueOf()+864E5*3);
    // date.setDate(date.getDate() + days);
    return date;
}

var date = new Date();

console.log(new Date().toISOString());
console.log(new Date(Date.now()+864E5*3).toLocaleDateString());
console.log(typeof new Date('2021-12-03T10:40:18.583Z').getTime());
console.log(new Date('2021-12-06T10:40:18.583Z').getTime());
console.log(Date.now());

// var date = new Date();
// console.log(date)

// var exp = date.setDate(date.getDate()+3)
// var num =`2021-12-03T04:01:48.105Z`
// // console.log(num.toLocaleDateString())
// console.log(date.toLocaleDateString(), date)
