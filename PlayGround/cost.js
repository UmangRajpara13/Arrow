let price = 3.0
let stripe_cost = (price * 0.03) + 0.25
let sales_tax_cost = 0.25 * price

let revenue = price - stripe_cost - sales_tax_cost

console.log(`before AWS Cost`)
console.log(`revenue : ${revenue.toFixed(2)},
        stripe ${stripe_cost.toFixed(2)},
        sales_tax ${sales_tax_cost.toFixed(2)}`)


console.log(`PAT ${(revenue - (0.15 * revenue)).toFixed(2)}`)
console.log(`PAT for 1M users ${(1E6 * revenue - (0.15 * revenue)).toFixed(2)}`)