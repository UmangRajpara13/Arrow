const ratings = [5, 4, 5];
let sum = 0;

const sumFunction = (a, b) => a + b;

ratings.forEach((rating) => {
  sum = sumFunction(sum, rating);
});

console.log(sum);