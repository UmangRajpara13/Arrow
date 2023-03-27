let price = 1.0 // 1.85
let stripe_cost = (price * 0.03) + 0.25
let taxes_percent = 25
let after_stripe = price-stripe_cost
console.log(`revenue before AWS Cost ${(after_stripe)-(after_stripe * taxes_percent/100)}`)